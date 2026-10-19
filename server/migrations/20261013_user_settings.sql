-- Add authenticated memberships to the EXISTING organization registry.
-- Run as database administrator. No public/authenticated direct access or RPC grants.
begin;
create table if not exists public.ccu_org_user_memberships (
  organization_id text not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  roles text[] not null default '{}',
  status text not null default 'ACTIVE' check (status in ('ACTIVE','INVITED','LEFT')),
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id,user_id),
  check (cardinality(roles) > 0 and roles <@ array['owner','admin','buyer','sales','editor','finance','event_coordinator']::text[])
);
create index if not exists ccu_org_user_memberships_user on public.ccu_org_user_memberships(user_id,status);
alter table public.ccu_org_user_memberships enable row level security;
revoke all on public.ccu_org_user_memberships from anon, authenticated;
grant all on public.ccu_org_user_memberships to service_role;

create or replace function public.ccu_settings_member_names(p_actor uuid,p_organization text)
returns table(user_id uuid,name text) language plpgsql security definer set search_path = public,pg_temp as $$
begin
  if not exists(select 1 from public.ccu_org_user_memberships m where m.organization_id=p_organization and m.user_id=p_actor and m.status='ACTIVE') then raise exception 'FORBIDDEN'; end if;
  return query select u.id,coalesce(u.raw_user_meta_data->>'full_name','Thành viên') from auth.users u join public.ccu_org_user_memberships m on m.user_id=u.id where m.organization_id=p_organization and m.status in ('ACTIVE','INVITED');
end $$;

create or replace function public.ccu_settings_org_action(p_actor uuid,p_action text,p_organization text,p_input jsonb)
returns jsonb language plpgsql security definer set search_path = public,pg_temp as $$
declare
  actor_roles text[]; new_roles text[]; org public.organizations%rowtype;
  target uuid; entity_id text; v_name text; v_normal text; v_tax text; v_domain text;
  actor_email text; active_owner_count integer;
begin
  select email into actor_email from auth.users where id=p_actor and email_confirmed_at is not null;
  if actor_email is null then raise exception 'FORBIDDEN'; end if;
  -- Serialize membership actions (including account deletion checks) across organizations.
  perform pg_advisory_xact_lock(hashtextextended('ccu-membership-mutation',0));
  if p_action='delete-account-request' then
    if exists(select 1 from public.ccu_org_user_memberships m where m.user_id=p_actor and m.status='ACTIVE' and 'owner'=any(m.roles) and not exists(select 1 from public.ccu_org_user_memberships other where other.organization_id=m.organization_id and other.user_id<>p_actor and other.status='ACTIVE' and 'owner'=any(other.roles))) then raise exception 'SOLE_OWNER'; end if;
    entity_id := gen_random_uuid()::text;
    insert into public.ccu_submissions(id,kind,owner_id,status,data) values(entity_id,'serviceRequest','auth:'||p_actor::text,'PENDING',jsonb_build_object('purpose','DELETE_ACCOUNT_REQUEST','reason',left(coalesce(p_input->>'reason',''),300)));
    return jsonb_build_object('id',entity_id,'status','PENDING','message','Đã gửi yêu cầu xóa tài khoản. Tài khoản chưa bị xóa.');
  end if;
  if p_action='create' then
    v_name:=trim(p_input->>'name'); v_normal:=lower(regexp_replace(v_name,'\s+',' ','g'));
    v_tax:=regexp_replace(coalesce(p_input->>'taxCode',''),'[^0-9]','','g');
    v_domain:=lower(regexp_replace(split_part(regexp_replace(coalesce(p_input->>'website',''),'^https?://','','i'),'/',1),'^www\.','','i'));
    select array_agg(distinct value) into new_roles from jsonb_array_elements_text(p_input->'roles');
    if v_name is null or length(v_name)<2 or length(v_name)>200 or new_roles is null or not new_roles <@ array['supplier','factory','kcn','association','partner','sponsor','founding_partner','development_partner','advisor','investor']::text[] then raise exception 'INVALID_INPUT'; end if;
    if exists(select 1 from public.organizations o where (v_tax<>'' and regexp_replace(coalesce(o.tax_code,''),'[^0-9]','','g')=v_tax) or lower(regexp_replace(o.name,'\s+',' ','g'))=v_normal or (v_domain<>'' and lower(regexp_replace(split_part(regexp_replace(coalesce(o.metadata->>'website',''),'^https?://','','i'),'/',1),'^www\.','','i'))=v_domain)) then raise exception 'DUPLICATE_ORGANIZATION'; end if;
    entity_id:='org-'||gen_random_uuid()::text;
    select array_agg(case role when 'factory' then 'FACTORY' when 'supplier' then 'SUPPLIER' when 'kcn' then 'INDUSTRIAL_PARK' when 'partner' then 'SERVICE_PARTNER' else upper(role) end) into new_roles from unnest(new_roles) role;
    insert into public.organizations(id,name,normalized_name,tax_code,roles,canonical_slug,status,verification_status,metadata)
    values(entity_id,v_name,v_normal,nullif(v_tax,''),new_roles,entity_id,'DRAFT','UNVERIFIED',jsonb_build_object('website',left(coalesce(p_input->>'website',''),300),'confirmed_roles','[]'::jsonb));
    insert into public.ccu_org_user_memberships(organization_id,user_id,roles) values(entity_id,p_actor,array['owner']);
    insert into public.ccu_submissions(id,kind,owner_id,status,data) values(gen_random_uuid()::text,'organizationProposal','auth:'||p_actor::text,'PENDING',jsonb_build_object('organizationId',entity_id,'name',v_name));
    return jsonb_build_object('id',entity_id,'status','DRAFT','message','Đã tạo hồ sơ nháp. Doanh nghiệp chưa được xác minh hoặc công bố.');
  end if;
  select * into org from public.organizations where id=p_organization for update;
  if org.id is null or (org.status='ARCHIVED' and p_action<>'restore') then raise exception 'INVALID_INPUT'; end if;
  if p_action='claim' then
    if org.status<>'PUBLISHED' then raise exception 'FORBIDDEN'; end if;
    if exists(select 1 from public.ccu_submissions where owner_id='auth:'||p_actor::text and kind='organizationClaim' and status='PENDING' and data->>'organizationId'=p_organization) then return jsonb_build_object('status','PENDING','message','Yêu cầu nhận quản lý đang chờ duyệt.'); end if;
    insert into public.ccu_submissions(id,kind,owner_id,status,data) values(gen_random_uuid()::text,'organizationClaim','auth:'||p_actor::text,'PENDING',jsonb_build_object('organizationId',p_organization,'purpose','CLAIM_MANAGEMENT','reason',left(coalesce(p_input->>'reason',''),300)));
    return jsonb_build_object('status','PENDING','message','Đã gửi yêu cầu nhận quản lý. Chưa cấp quyền doanh nghiệp.');
  end if;
  if p_action='accept' then
    update public.ccu_org_user_memberships set status='ACTIVE',updated_at=now() where organization_id=p_organization and user_id=p_actor and status='INVITED';
    if not found then raise exception 'FORBIDDEN'; end if;
    return jsonb_build_object('status','ACTIVE','message','Đã tham gia doanh nghiệp.');
  end if;
  select roles into actor_roles from public.ccu_org_user_memberships where organization_id=p_organization and user_id=p_actor and status='ACTIVE';
  if actor_roles is null then raise exception 'FORBIDDEN'; end if;
  if p_action in ('roles','invite','member') and not actor_roles && array['owner','admin']::text[] then raise exception 'FORBIDDEN'; end if;
  if p_action in ('transfer','archive','restore') and not 'owner'=any(actor_roles) then raise exception 'FORBIDDEN'; end if;
  if p_action='roles' then
    select array_agg(distinct value) into new_roles from jsonb_array_elements_text(p_input->'roles');
    if new_roles is null or not new_roles <@ array['supplier','factory','kcn','association','partner','sponsor','founding_partner','development_partner','advisor','investor']::text[] then raise exception 'INVALID_INPUT'; end if;
    select array_agg(case role when 'factory' then 'FACTORY' when 'supplier' then 'SUPPLIER' when 'kcn' then 'INDUSTRIAL_PARK' when 'partner' then 'SERVICE_PARTNER' else upper(role) end) into new_roles from unnest(new_roles) role;
    update public.organizations set roles=new_roles,updated_at=now() where id=p_organization;
  elsif p_action in ('invite','member','transfer') then
    if p_action='invite' then
      select id into target from auth.users where lower(email)=lower(trim(p_input->>'email')) and email_confirmed_at is not null;
      if target is null then raise exception 'INVALID_INPUT'; end if;
    else
      begin target:=(p_input->>'targetUserId')::uuid; exception when invalid_text_representation then raise exception 'INVALID_INPUT'; end;
    end if;
    if target is null or target=p_actor then raise exception 'INVALID_INPUT'; end if;
    if p_action='transfer' then
      if not exists(select 1 from public.ccu_org_user_memberships where organization_id=p_organization and user_id=target and status='ACTIVE') then raise exception 'INVALID_INPUT'; end if;
      update public.ccu_org_user_memberships set roles=array(select distinct unnest(roles||array['owner'])),updated_at=now() where organization_id=p_organization and user_id=target;
      update public.ccu_org_user_memberships set roles=array['admin'],updated_at=now() where organization_id=p_organization and user_id=p_actor;
    else
      select array_agg(distinct value) into new_roles from jsonb_array_elements_text(p_input->'roles');
      if new_roles is null or 'owner'=any(new_roles) or not new_roles <@ array['admin','buyer','sales','editor','finance','event_coordinator']::text[] then raise exception 'INVALID_INPUT'; end if;
      if exists(select 1 from public.ccu_org_user_memberships where organization_id=p_organization and user_id=target and ('owner'=any(roles) or (status='ACTIVE' and p_action='invite'))) then raise exception 'FORBIDDEN'; end if;
      if p_action='invite' then
        insert into public.ccu_org_user_memberships(organization_id,user_id,roles,status,invited_by) values(p_organization,target,new_roles,'INVITED',p_actor)
        on conflict(organization_id,user_id) do update set roles=excluded.roles,status='INVITED',invited_by=p_actor,updated_at=now();
      else
        update public.ccu_org_user_memberships set roles=new_roles,updated_at=now() where organization_id=p_organization and user_id=target and status='ACTIVE';
        if not found then raise exception 'INVALID_INPUT'; end if;
      end if;
    end if;
  elsif p_action='leave' then
    select count(*) into active_owner_count from public.ccu_org_user_memberships where organization_id=p_organization and status='ACTIVE' and 'owner'=any(roles);
    if 'owner'=any(actor_roles) and active_owner_count<2 then raise exception 'SOLE_OWNER'; end if;
    update public.ccu_org_user_memberships set status='LEFT',updated_at=now() where organization_id=p_organization and user_id=p_actor;
  elsif p_action='archive' then
    update public.organizations set metadata=jsonb_set(coalesce(metadata,'{}'),'{archived_from_status}',to_jsonb(status)),status='ARCHIVED',updated_at=now() where id=p_organization;
  elsif p_action='restore' then
    update public.organizations set status=case when metadata->>'archived_from_status'='PUBLISHED' then 'PUBLISHED' else 'DRAFT' end,updated_at=now() where id=p_organization;
  elsif p_action='facility' then
    if not actor_roles && array['owner','admin','editor']::text[] then raise exception 'FORBIDDEN'; end if;
    if length(trim(coalesce(p_input->>'name','')))<2 then raise exception 'INVALID_INPUT'; end if;
    entity_id:='factory-'||gen_random_uuid()::text;
    insert into public.factories(id,name,province,data) values(entity_id,left(trim(p_input->>'name'),200),left(coalesce(p_input->>'province',''),200),jsonb_build_object('organization_id',p_organization,'status','DRAFT','visibility','PRIVATE'));
    return jsonb_build_object('id',entity_id,'message','Đã thêm cơ sở nháp riêng tư.');
  else raise exception 'INVALID_INPUT';
  end if;
  return jsonb_build_object('id',p_organization,'message','Đã cập nhật doanh nghiệp.');
end $$;
revoke all on function public.ccu_settings_member_names(uuid,text) from public,anon,authenticated;
revoke all on function public.ccu_settings_org_action(uuid,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.ccu_settings_member_names(uuid,text) to service_role;
grant execute on function public.ccu_settings_org_action(uuid,text,text,jsonb) to service_role;
commit;
