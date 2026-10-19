-- Integration regression. Synthetic fixtures, every change rolls back.
begin;
do $$
declare a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); c uuid:=gen_random_uuid(); o text; r jsonb;
begin
  insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values
  (a,a::text||'@settings-test.invalid',now(),'{}'),(b,b::text||'@settings-test.invalid',now(),'{}'),(c,c::text||'@settings-test.invalid',now(),'{}');
  r:=public.ccu_settings_org_action(a,'create',null,jsonb_build_object('name','Settings regression '||a::text,'taxCode',a::text,'roles',jsonb_build_array('factory','supplier')));
  o:=r->>'id';
  if not exists(select 1 from public.ccu_org_user_memberships where organization_id=o and user_id=a and roles=array['owner']) then raise exception 'TEST_OWNER'; end if;
  begin
    perform public.ccu_settings_org_action(b,'create',null,jsonb_build_object('name','Settings regression '||a::text,'roles',jsonb_build_array('investor')));
    raise exception 'TEST_DEDUPE';
  exception when others then if sqlerrm not like '%DUPLICATE_ORGANIZATION%' then raise; end if; end;
  perform public.ccu_settings_org_action(a,'invite',o,jsonb_build_object('email',b::text||'@settings-test.invalid','roles',jsonb_build_array('buyer')));
  begin perform public.ccu_settings_org_action(b,'roles',o,'{"roles":["advisor"]}'); raise exception 'TEST_INVITE_PERMISSIONS';
  exception when others then if sqlerrm not like '%FORBIDDEN%' then raise; end if; end;
  perform public.ccu_settings_org_action(b,'accept',o,'{}');
  begin perform public.ccu_settings_org_action(b,'roles',o,'{"roles":["advisor"]}'); raise exception 'TEST_BUYER_ESCALATION';
  exception when others then if sqlerrm not like '%FORBIDDEN%' then raise; end if; end;
  begin perform public.ccu_settings_org_action(c,'facility',o,'{"name":"Forbidden"}'); raise exception 'TEST_NONMEMBER';
  exception when others then if sqlerrm not like '%FORBIDDEN%' then raise; end if; end;
  begin perform public.ccu_settings_org_action(a,'leave',o,'{}'); raise exception 'TEST_SOLE_OWNER';
  exception when others then if sqlerrm not like '%SOLE_OWNER%' then raise; end if; end;
  begin perform public.ccu_settings_org_action(a,'delete-account-request',null,'{}'); raise exception 'TEST_DELETE_OWNER';
  exception when others then if sqlerrm not like '%SOLE_OWNER%' then raise; end if; end;
  perform public.ccu_settings_org_action(a,'roles',o,'{"roles":["factory","supplier","sponsor"]}');
  if (select cardinality(roles) from public.organizations where id=o)<>3 then raise exception 'TEST_MULTI_ROLE'; end if;
  perform public.ccu_settings_org_action(a,'facility',o,'{"name":"Private factory","province":"Test"}');
  if not exists(select 1 from public.factories where data->>'organization_id'=o and data->>'visibility'='PRIVATE') then raise exception 'TEST_FACILITY'; end if;
  perform public.ccu_settings_org_action(a,'transfer',o,jsonb_build_object('targetUserId',b));
  perform public.ccu_settings_org_action(a,'leave',o,'{}');
  perform public.ccu_settings_org_action(a,'delete-account-request',null,'{}');
  perform public.ccu_settings_org_action(b,'archive',o,'{}');
  if (select status from public.organizations where id=o)<>'ARCHIVED' then raise exception 'TEST_ARCHIVE'; end if;
  perform public.ccu_settings_org_action(b,'restore',o,'{}');
  if (select status from public.organizations where id=o)<>'DRAFT' then raise exception 'TEST_RESTORE'; end if;
  if has_table_privilege('anon','public.ccu_org_user_memberships','SELECT') or has_table_privilege('authenticated','public.ccu_org_user_memberships','SELECT') or has_function_privilege('authenticated','public.ccu_settings_org_action(uuid,text,text,jsonb)','EXECUTE') then raise exception 'TEST_RLS'; end if;
end $$;
rollback;
select 'PASS: owner / dedupe / multi-role / invite / RBAC / private facility / sole-owner / transfer / leave / archive / RLS. All fixtures rolled back.' as result;
