-- 신규 가입자 초기 크레딧 500 → 300
alter table public.credit_accounts
  alter column balance set default 300,
  alter column monthly_allowance set default 300;

create or replace function public.handle_new_user_credits()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  insert into public.credit_accounts (user_id, balance, monthly_allowance)
  values (new.id, 300, 300)
  on conflict (user_id) do nothing;
  return new;
end;
$$;
