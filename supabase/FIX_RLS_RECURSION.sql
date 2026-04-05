-- Fix: profiles & credit_accounts infinite recursion in RLS
-- profiles_admin_select 정책이 profiles 테이블을 재귀 참조하는 문제 해결
-- Admin 페이지는 service role key (bypass RLS) 를 사용하므로 admin 정책 불필요

-- 1) Drop the recursive policy
drop policy if exists "profiles_admin_select" on public.profiles;
drop policy if exists "credit_accounts: admin read" on public.credit_accounts;
