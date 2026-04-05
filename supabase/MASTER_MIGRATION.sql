-- ============================================================
-- Beeliber Academy — MASTER MIGRATION
-- 대상: https://iuscxyciqstwfgrrluwf.supabase.co
-- 실행 방법: Supabase 대시보드 → SQL Editor → 전체 복사 붙여넣기 후 Run
-- 순서: extensions → types → 함수 → 테이블 → RLS → 트리거 → RPC → 시드
-- ============================================================

begin;

-- ── Extensions ─────────────────────────────────────────────
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- ── Shared updated_at helper (define once) ─────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  display_name  text,
  account_type  text not null default 'student'
                  check (account_type in ('student','marketer','developer','automation','reviewer','admin','superadmin')),
  is_active     boolean not null default true,
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Admin can read all profiles
drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.account_type in ('admin','superadmin','reviewer')
    )
  );

-- ── Auto-create profile on signup ──────────────────────────
create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'display_name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

-- ============================================================
-- 2. CREDIT ACCOUNTS
-- ============================================================
create table if not exists public.credit_accounts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null unique references auth.users on delete cascade,
  balance           integer not null default 300 check (balance >= 0),
  monthly_allowance integer not null default 300,
  used_this_month   integer not null default 0,
  plan              text not null default 'free' check (plan in ('free','pro','enterprise')),
  reset_date        date not null default (date_trunc('month', now()) + interval '1 month')::date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists credit_accounts_updated_at on public.credit_accounts;
create trigger credit_accounts_updated_at
  before update on public.credit_accounts
  for each row execute function public.set_updated_at();

alter table public.credit_accounts enable row level security;

drop policy if exists "credit_accounts: owner read" on public.credit_accounts;
create policy "credit_accounts: owner read" on public.credit_accounts
  for select using (auth.uid() = user_id);

-- Admin can read all
drop policy if exists "credit_accounts: admin read" on public.credit_accounts;
create policy "credit_accounts: admin read" on public.credit_accounts
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.account_type in ('admin','superadmin')
    )
  );

-- ── Auto-create credit account on signup ───────────────────
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

drop trigger if exists on_auth_user_created_credits on auth.users;
create trigger on_auth_user_created_credits
  after insert on auth.users
  for each row execute function public.handle_new_user_credits();

-- ============================================================
-- 3. CREDIT TRANSACTIONS
-- ============================================================
create table if not exists public.credit_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  amount        integer not null,
  type          text not null check (type in ('generation','purchase','refund','bonus','monthly_reset','adjustment')),
  model_id      text,
  generation_id uuid unique,
  note          text,
  granted_by    uuid references auth.users on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists credit_transactions_user_idx on public.credit_transactions (user_id);
create index if not exists credit_transactions_date_idx on public.credit_transactions (created_at);

alter table public.credit_transactions enable row level security;

drop policy if exists "credit_transactions: owner read" on public.credit_transactions;
create policy "credit_transactions: owner read" on public.credit_transactions
  for select using (auth.uid() = user_id);

-- ============================================================
-- 4. GENERATIONS
-- ============================================================
create table if not exists public.generations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  model_id      text not null,
  type          text not null default 'image'
                  check (type in ('image','video','audio','3d','inpaint','outpaint','relight','camera','upscale')),
  status        text not null default 'completed'
                  check (status in ('queued','processing','completed','failed','cancelled')),
  prompt        text,
  output_urls   jsonb not null default '[]',
  credits_cost  integer not null default 0,
  error_message text,
  space_id      uuid,
  expires_at    timestamptz not null default (now() + interval '30 days'),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists generations_user_idx on public.generations (user_id, created_at desc);
create index if not exists generations_status_idx on public.generations (status);

drop trigger if exists generations_updated_at on public.generations;
create trigger generations_updated_at
  before update on public.generations
  for each row execute function public.set_updated_at();

alter table public.generations enable row level security;

drop policy if exists "generations: owner full access" on public.generations;
create policy "generations: owner full access" on public.generations
  for all using (auth.uid() = user_id);

-- ============================================================
-- 5. WORKSPACE DOCUMENTS & VERSIONS
-- ============================================================
create table if not exists public.workspace_documents (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users on delete cascade,
  track_slug         text not null,
  lesson_slug        text not null,
  title              text not null,
  status             text not null default 'draft'
                       check (status in ('draft','published','archived')),
  current_version_no integer not null default 1,
  current_version_id uuid null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.workspace_document_versions (
  id             uuid primary key default gen_random_uuid(),
  document_id    uuid not null references public.workspace_documents on delete cascade,
  user_id        uuid not null references auth.users on delete cascade,
  version_no     integer not null,
  prompt_text    text not null default '',
  input_payload  jsonb not null default '{}',
  output_payload jsonb not null default '{}',
  ai_provider    text not null default 'openai',
  ai_model       text not null default '',
  notes          text,
  created_at     timestamptz not null default now(),
  unique(document_id, version_no)
);

-- FK from workspace_documents.current_version_id → workspace_document_versions.id
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'workspace_documents_current_version_id_fkey'
  ) then
    alter table public.workspace_documents
    add constraint workspace_documents_current_version_id_fkey
    foreign key (current_version_id)
    references public.workspace_document_versions(id)
    on delete set null;
  end if;
end $$;

create index if not exists idx_workspace_documents_user
  on public.workspace_documents(user_id, updated_at desc);
create index if not exists idx_workspace_versions_doc
  on public.workspace_document_versions(document_id, version_no desc);

drop trigger if exists set_workspace_documents_updated_at on public.workspace_documents;
create trigger set_workspace_documents_updated_at
  before update on public.workspace_documents
  for each row execute function public.set_updated_at();

alter table public.workspace_documents enable row level security;
alter table public.workspace_document_versions enable row level security;

drop policy if exists "workspace_documents_select_own" on public.workspace_documents;
create policy "workspace_documents_select_own" on public.workspace_documents
  for select using ((select auth.uid()) = user_id);
drop policy if exists "workspace_documents_insert_own" on public.workspace_documents;
create policy "workspace_documents_insert_own" on public.workspace_documents
  for insert with check ((select auth.uid()) = user_id);
drop policy if exists "workspace_documents_update_own" on public.workspace_documents;
create policy "workspace_documents_update_own" on public.workspace_documents
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "workspace_documents_delete_own" on public.workspace_documents;
create policy "workspace_documents_delete_own" on public.workspace_documents
  for delete using ((select auth.uid()) = user_id);

drop policy if exists "workspace_versions_select_own" on public.workspace_document_versions;
create policy "workspace_versions_select_own" on public.workspace_document_versions
  for select using ((select auth.uid()) = user_id);
drop policy if exists "workspace_versions_insert_own" on public.workspace_document_versions;
create policy "workspace_versions_insert_own" on public.workspace_document_versions
  for insert with check ((select auth.uid()) = user_id);
drop policy if exists "workspace_versions_delete_own" on public.workspace_document_versions;
create policy "workspace_versions_delete_own" on public.workspace_document_versions
  for delete using ((select auth.uid()) = user_id);

-- ============================================================
-- 6. CANVAS — SPACES / PAGES / ELEMENTS
-- ============================================================
create table if not exists public.spaces (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users on delete cascade,
  title      text not null default '새 스페이스',
  settings   jsonb not null default '{}',
  is_public  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists spaces_owner_idx on public.spaces (owner_id);

drop trigger if exists spaces_updated_at on public.spaces;
create trigger spaces_updated_at
  before update on public.spaces
  for each row execute function public.set_updated_at();

alter table public.spaces enable row level security;
drop policy if exists "spaces: owner full access" on public.spaces;
create policy "spaces: owner full access" on public.spaces
  for all using (auth.uid() = owner_id);
drop policy if exists "spaces: public read" on public.spaces;
create policy "spaces: public read" on public.spaces
  for select using (is_public = true);

create table if not exists public.space_collaborators (
  id         uuid primary key default gen_random_uuid(),
  space_id   uuid not null references public.spaces on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  role       text not null default 'viewer' check (role in ('viewer','editor','admin')),
  created_at timestamptz not null default now(),
  unique (space_id, user_id)
);

alter table public.space_collaborators enable row level security;
drop policy if exists "space_collaborators: owner can manage" on public.space_collaborators;
create policy "space_collaborators: owner can manage" on public.space_collaborators
  for all using (
    exists (select 1 from public.spaces s where s.id = space_id and s.owner_id = auth.uid())
  );
drop policy if exists "space_collaborators: members can read" on public.space_collaborators;
create policy "space_collaborators: members can read" on public.space_collaborators
  for select using (user_id = auth.uid());

create table if not exists public.pages (
  id         uuid primary key default gen_random_uuid(),
  space_id   uuid not null references public.spaces on delete cascade,
  name       text not null default '페이지 1',
  "order"    integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists pages_space_idx on public.pages (space_id);

alter table public.pages enable row level security;
drop policy if exists "pages: space owner can manage" on public.pages;
create policy "pages: space owner can manage" on public.pages
  for all using (
    exists (select 1 from public.spaces s where s.id = space_id and s.owner_id = auth.uid())
  );
drop policy if exists "pages: collaborators can read" on public.pages;
create policy "pages: collaborators can read" on public.pages
  for select using (
    exists (
      select 1 from public.space_collaborators sc
      where sc.space_id = space_id and sc.user_id = auth.uid()
    )
  );

create table if not exists public.elements (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages on delete cascade,
  type       text not null check (type in ('image','text','video','sticky','group')),
  x          float8 not null default 0,
  y          float8 not null default 0,
  width      float8 not null default 200,
  height     float8 not null default 200,
  rotation   float8 not null default 0,
  z_index    integer not null default 0,
  data       jsonb not null default '{}',
  group_id   uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists elements_page_idx on public.elements (page_id);

drop trigger if exists elements_updated_at on public.elements;
create trigger elements_updated_at
  before update on public.elements
  for each row execute function public.set_updated_at();

alter table public.elements enable row level security;
drop policy if exists "elements: page owner can manage" on public.elements;
create policy "elements: page owner can manage" on public.elements
  for all using (
    exists (
      select 1 from public.pages p
      join public.spaces s on s.id = p.space_id
      where p.id = page_id and s.owner_id = auth.uid()
    )
  );

-- ============================================================
-- 7. AI MODELS (read-only catalog)
-- ============================================================
create table if not exists public.ai_models (
  id              text primary key,
  name            text not null,
  provider        text not null,
  type            text not null check (type in ('image','video','audio','3d')),
  credit_cost_min integer not null default 5,
  credit_cost_max integer not null default 5,
  tags            jsonb not null default '[]',
  estimated_time  text not null default '10s',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.ai_models enable row level security;
drop policy if exists "ai_models: anyone can read" on public.ai_models;
create policy "ai_models: anyone can read" on public.ai_models
  for select using (true);

insert into public.ai_models (id, name, provider, type, credit_cost_min, credit_cost_max, tags, estimated_time) values
  ('flux-1-fast',      'Flux 1 Fast',       'fal',       'image', 5,   5,   '["fast"]',               '3s'),
  ('flux-2-pro',       'Flux 2 Pro',         'replicate', 'image', 50,  50,  '["quality"]',            '10s'),
  ('seedream-5-lite',  'Seedream 5 Lite',    'fal',       'image', 50,  50,  '["quality","reference"]','12s'),
  ('google-imagen-4',  'Google Imagen 4',    'google',    'image', 100, 100, '["quality","creative"]', '15s'),
  ('gpt',              'GPT Image (DALL-E)', 'openai',    'image', 150, 150, '["quality","creative"]', '20s'),
  ('kling-v2-5-pro',   'Kling v2.5 Pro',     'kling',     'video', 360, 360, '["video","quality"]',   '90s'),
  ('kling-v2-5-standard','Kling v2.5 Std',   'kling',     'video', 180, 180, '["video"]',             '60s'),
  ('kling-3',          'Kling 3',            'fal',       'video', 210, 360, '["video"]',             '60s'),
  ('wan-2.2',          'Wan 2.2',            'replicate', 'video', 80,  200, '["video","fast"]',      '30s'),
  ('elevenlabs-v3',    'ElevenLabs v3',      'elevenlabs','audio', 10,  10,  '["audio"]',             '5s'),
  ('elevenlabs-music', 'ElevenLabs Music',   'elevenlabs','audio', 20,  20,  '["audio"]',             '10s')
on conflict (id) do nothing;

-- ============================================================
-- 8. USER REFERENCES & TEMPLATES & COMMENTS
-- ============================================================
create table if not exists public.user_references (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  category   text not null,
  name       text not null,
  image_url  text not null,
  weight     float4 not null default 1.0,
  created_at timestamptz not null default now()
);

create index if not exists user_references_user_idx on public.user_references (user_id);
alter table public.user_references enable row level security;
drop policy if exists "user_references: owner full access" on public.user_references;
create policy "user_references: owner full access" on public.user_references
  for all using (auth.uid() = user_id);

create table if not exists public.templates (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  type       text not null check (type in ('image','video','canvas')),
  config     jsonb not null default '{}',
  is_public  boolean not null default false,
  owner_id   uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

alter table public.templates enable row level security;
drop policy if exists "templates: public read" on public.templates;
create policy "templates: public read" on public.templates
  for select using (is_public = true or auth.uid() = owner_id);

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  space_id   uuid not null references public.spaces on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  x          float8 not null default 0,
  y          float8 not null default 0,
  content    text not null,
  resolved   boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists comments_space_idx on public.comments (space_id);
alter table public.comments enable row level security;
drop policy if exists "comments: space members can read" on public.comments;
create policy "comments: space members can read" on public.comments
  for select using (
    exists (
      select 1 from public.spaces s
      where s.id = space_id and (s.owner_id = auth.uid() or s.is_public)
    )
  );
drop policy if exists "comments: authenticated users can insert" on public.comments;
create policy "comments: authenticated users can insert" on public.comments
  for insert with check (auth.uid() = user_id);
drop policy if exists "comments: owner can update/delete" on public.comments;
create policy "comments: owner can update/delete" on public.comments
  for all using (auth.uid() = user_id);

-- ============================================================
-- 9. RPCs
-- ============================================================

-- deduct_credits: atomic credit deduction (idempotent via generation_id)
create or replace function public.deduct_credits(
  p_user_id       uuid,
  p_amount        integer,
  p_generation_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Idempotency: skip if already deducted for this generation
  if exists (
    select 1 from public.credit_transactions
    where generation_id = p_generation_id and type = 'generation'
  ) then
    return;
  end if;

  -- Atomic balance deduction
  update public.credit_accounts
  set
    balance         = balance - p_amount,
    used_this_month = used_this_month + p_amount,
    updated_at      = now()
  where user_id = p_user_id
    and balance >= p_amount;

  if not found then
    raise exception 'insufficient_credits';
  end if;

  -- Record transaction
  insert into public.credit_transactions (user_id, amount, type, generation_id)
  values (p_user_id, -p_amount, 'generation', p_generation_id)
  on conflict (generation_id) do nothing;
end;
$$;

-- admin_adjust_credits: admin manual adjustment
create or replace function public.admin_adjust_credits(
  p_user_id   uuid,
  p_amount    integer,
  p_note      text default null,
  p_granted_by uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_new_balance integer;
begin
  -- Upsert credit account
  insert into public.credit_accounts (user_id, balance)
  values (p_user_id, greatest(0, p_amount))
  on conflict (user_id) do update
    set balance    = greatest(0, public.credit_accounts.balance + p_amount),
        updated_at = now()
  returning balance into v_new_balance;

  -- Log the adjustment
  insert into public.credit_transactions (user_id, amount, type, note, granted_by)
  values (p_user_id, p_amount, 'adjustment', p_note, p_granted_by);

  return v_new_balance;
end;
$$;

-- ============================================================
-- 10. AI OUTPUTS (for /api/ai/review route)
-- ============================================================
create table if not exists public.ai_outputs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users on delete set null,
  use_case         text,
  input_context    text,
  generated_text   text,
  risk_score       integer,
  approval_status  text default 'pending',
  created_at       timestamptz not null default now()
);

alter table public.ai_outputs enable row level security;
drop policy if exists "ai_outputs: owner read" on public.ai_outputs;
create policy "ai_outputs: owner read" on public.ai_outputs
  for select using (auth.uid() = user_id);
drop policy if exists "ai_outputs: server insert" on public.ai_outputs;
create policy "ai_outputs: server insert" on public.ai_outputs
  for insert with check (true);

create table if not exists public.ai_review_logs (
  id           uuid primary key default gen_random_uuid(),
  ai_output_id uuid references public.ai_outputs on delete cascade,
  check_type   text,
  result       text,
  detail       jsonb default '{}',
  created_at   timestamptz not null default now()
);

alter table public.ai_review_logs enable row level security;
drop policy if exists "ai_review_logs: server access" on public.ai_review_logs;
create policy "ai_review_logs: server access" on public.ai_review_logs
  for all using (true);

-- ============================================================
-- 11. STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit)
values
  ('generations',          'generations',          true,  52428800),
  ('academy-submissions',  'academy-submissions',  false, 52428800),
  ('academy-resources',    'academy-resources',    false, 52428800)
on conflict (id) do nothing;

-- Storage RLS
drop policy if exists "generations: public read" on storage.objects;
create policy "generations: public read" on storage.objects
  for select using (bucket_id = 'generations');

drop policy if exists "generations: owner upload" on storage.objects;
create policy "generations: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'generations'
    and auth.uid() is not null
  );

commit;
