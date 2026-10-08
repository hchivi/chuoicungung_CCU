-- Narrow fix: no GRANT SELECT on auth.users, no new access for browser roles.
BEGIN;
CREATE OR REPLACE FUNCTION public.ccu_claim_anonymous(p_old_owner text,p_user uuid)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  -- Confirmed identity is checked by backend Auth.getUser, not a SQL auth.users read.
  IF p_old_owner IS NULL OR p_user IS NULL OR p_old_owner !~ '^ccu_[0-9a-f]{64}$' THEN
    RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid owner claim';
  END IF;
  UPDATE public.ccu_submissions SET owner_id='auth:'||p_user::text WHERE owner_id=p_old_owner;
  UPDATE public.suppi_conversations SET owner_id='auth:'||p_user::text WHERE owner_id=p_old_owner;
  UPDATE public.requirement_drafts SET owner_id='auth:'||p_user::text WHERE owner_id=p_old_owner;
END $$;
REVOKE ALL ON FUNCTION public.ccu_claim_anonymous(text,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.ccu_claim_anonymous(text,uuid) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
