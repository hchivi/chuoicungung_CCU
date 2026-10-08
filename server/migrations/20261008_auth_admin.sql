-- Additive migration: no customer table is dropped, truncated or auto-published.
BEGIN;
CREATE TABLE IF NOT EXISTS public.ccu_staff_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin','moderator','viewer')),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.ccu_admin_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  note text NOT NULL,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ccu_audit_entity ON public.ccu_admin_audit(entity_type,entity_id,created_at DESC);
ALTER TABLE public.ccu_staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ccu_admin_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ccu_staff_roles, public.ccu_admin_audit FROM anon, authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.ccu_staff_roles TO service_role;
GRANT SELECT,INSERT ON public.ccu_admin_audit TO service_role;
GRANT USAGE,SELECT ON SEQUENCE public.ccu_admin_audit_id_seq TO service_role;

-- Backend supplies p_actor only after auth.getUser verifies the access token.
-- Functions are not callable with anon/authenticated keys.
CREATE OR REPLACE FUNCTION public.ccu_require_staff(p_actor uuid, p_roles text[])
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.ccu_staff_roles WHERE user_id=p_actor AND enabled AND role=ANY(p_roles)) THEN
    RAISE EXCEPTION USING ERRCODE='42501', MESSAGE='Staff permission required';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.ccu_claim_anonymous(p_old_owner text, p_user uuid)
-- Backend verifies the confirmed account through Auth.getUser before this RPC.
-- service_role cannot SELECT auth.users; keep SQL invoker privileges unchanged.
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF p_old_owner IS NULL OR p_user IS NULL OR p_old_owner !~ '^ccu_[0-9a-f]{64}$' THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='Invalid owner claim';
  END IF;
  UPDATE public.ccu_submissions SET owner_id='auth:'||p_user::text WHERE owner_id=p_old_owner;
  UPDATE public.suppi_conversations SET owner_id='auth:'||p_user::text WHERE owner_id=p_old_owner;
  UPDATE public.requirement_drafts SET owner_id='auth:'||p_user::text WHERE owner_id=p_old_owner;
END $$;

CREATE OR REPLACE FUNCTION public.ccu_review_submission(p_id text,p_status text,p_note text,p_expected_updated_at timestamptz,p_actor uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE previous public.ccu_submissions; updated public.ccu_submissions;
BEGIN
  PERFORM public.ccu_require_staff(p_actor,ARRAY['admin','moderator']);
  IF p_status NOT IN ('APPROVED','REJECTED','NEED_MORE_INFO') OR p_note IS NULL OR length(trim(p_note))=0 OR length(p_note)>2000 OR p_expected_updated_at IS NULL THEN
    RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid review';
  END IF;
  SELECT * INTO previous FROM public.ccu_submissions WHERE id=p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='Missing submission'; END IF;
  IF previous.updated_at IS DISTINCT FROM p_expected_updated_at OR previous.status NOT IN ('PENDING','NEED_MORE_INFO') THEN
    RAISE EXCEPTION USING ERRCODE='40001',MESSAGE='Submission changed';
  END IF;
  UPDATE public.ccu_submissions SET status=p_status,updated_at=clock_timestamp() WHERE id=p_id RETURNING * INTO updated;
  INSERT INTO public.ccu_admin_audit(actor_id,action,entity_type,entity_id,note,before_data,after_data)
  VALUES(p_actor,'REVIEW','submission',p_id,p_note,jsonb_build_object('status',previous.status),jsonb_build_object('status',updated.status));
  -- Review does not publish private fields, create contacts or send messages.
  RETURN to_jsonb(updated)-'owner_id'-'idempotency_key';
END $$;

CREATE OR REPLACE FUNCTION public.ccu_admin_patch_content(p_collection text,p_id text,p_patch jsonb,p_note text,p_expected_updated_at timestamptz,p_actor uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE tab text; payload_column text; previous jsonb; updated jsonb; keys text[];
BEGIN
  PERFORM public.ccu_require_staff(p_actor,ARRAY['admin']);
  IF p_patch IS NULL OR jsonb_typeof(p_patch)<>'object' OR p_patch='{}'::jsonb OR octet_length(p_patch::text)>20000 OR p_expected_updated_at IS NULL OR p_note IS NULL OR length(trim(p_note))=0 OR length(p_note)>2000 THEN
    RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid content patch';
  END IF;
  SELECT array_agg(k) INTO keys FROM jsonb_object_keys(p_patch) k;
  IF NOT keys <@ ARRAY['name','title','description','industry','category','province','location','phase','phases','stage','stages'] THEN
    RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Protected field';
  END IF;
  tab := CASE p_collection WHEN 'suppliers' THEN 'enterprises' WHEN 'factories' THEN 'factories' WHEN 'industrialParks' THEN 'industrial_parks' WHEN 'organizations' THEN 'organizations' WHEN 'associations' THEN 'organizations' ELSE NULL END;
  IF tab IS NULL THEN
    IF p_collection NOT IN ('programs','catalogues','catalogueEditions','catalogueEntries','publicRequirements','productsServices','categories','categoriesAlphabetical','associationProfiles','programOrganizations','organizationMemberships','factoryProfiles','kcnOrganizations','supplyGaps') THEN
      RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Unknown collection';
    END IF;
    SELECT to_jsonb(d) INTO previous FROM public.ccu_documents d WHERE collection=p_collection AND id=p_id FOR UPDATE;
    IF previous IS NULL THEN RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='Missing content'; END IF;
    IF (previous->>'updated_at')::timestamptz IS DISTINCT FROM p_expected_updated_at THEN RAISE EXCEPTION USING ERRCODE='40001',MESSAGE='Content changed'; END IF;
    UPDATE public.ccu_documents SET data=data||p_patch,updated_at=clock_timestamp() WHERE collection=p_collection AND id=p_id RETURNING to_jsonb(ccu_documents) INTO updated;
  ELSE
    EXECUTE format('SELECT to_jsonb(t) FROM public.%I t WHERE id=$1 FOR UPDATE',tab) INTO previous USING p_id;
    IF previous IS NULL THEN RAISE EXCEPTION USING ERRCODE='P0002',MESSAGE='Missing entity'; END IF;
    IF (previous->>'updated_at')::timestamptz IS DISTINCT FROM p_expected_updated_at THEN RAISE EXCEPTION USING ERRCODE='40001',MESSAGE='Entity changed'; END IF;
    payload_column := CASE WHEN tab='organizations' THEN 'metadata' ELSE 'data' END;
    EXECUTE format('UPDATE public.%I SET name=coalesce($2->>''name'',name),%I=coalesce(%I,''{}''::jsonb)||$2,updated_at=clock_timestamp() WHERE id=$1 RETURNING to_jsonb(%I)',tab,payload_column,payload_column,tab) INTO updated USING p_id,p_patch;
    IF tab IN ('enterprises','factories','industrial_parks') AND p_patch ? 'province' THEN
      EXECUTE format('UPDATE public.%I SET province=$2 WHERE id=$1 RETURNING to_jsonb(%I)',tab,tab) INTO updated USING p_id,p_patch->>'province';
    END IF;
    IF tab IN ('enterprises','factories') AND p_patch ? 'category' THEN
      EXECUTE format('UPDATE public.%I SET category=$2 WHERE id=$1 RETURNING to_jsonb(%I)',tab,tab) INTO updated USING p_id,p_patch->>'category';
    END IF;
  END IF;
  INSERT INTO public.ccu_admin_audit(actor_id,action,entity_type,entity_id,note,before_data,after_data)
  VALUES(p_actor,'PATCH',p_collection,p_id,p_note,previous,updated);
  RETURN updated;
END $$;

REVOKE ALL ON FUNCTION public.ccu_require_staff(uuid,text[]),public.ccu_claim_anonymous(text,uuid),public.ccu_review_submission(text,text,text,timestamptz,uuid),public.ccu_admin_patch_content(text,text,jsonb,text,timestamptz,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.ccu_require_staff(uuid,text[]),public.ccu_claim_anonymous(text,uuid),public.ccu_review_submission(text,text,text,timestamptz,uuid),public.ccu_admin_patch_content(text,text,jsonb,text,timestamptz,uuid) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
