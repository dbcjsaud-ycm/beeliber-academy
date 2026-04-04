create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  track_slug text not null,
  lesson_slug text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  current_version_no integer not null default 1,
  current_version_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.workspace_documents(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  version_no integer not null,
  prompt_text text not null default '',
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  ai_provider text not null default 'openai',
  ai_model text not null default '',
  notes text,
  created_at timestamptz not null default now(),
  unique(document_id, version_no)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_documents_current_version_id_fkey'
  ) then
    alter table public.workspace_documents
    add constraint workspace_documents_current_version_id_fkey
    foreign key (current_version_id)
    references public.workspace_document_versions(id)
    on delete set null;
  end if;
end $$;

create index if not exists idx_workspace_documents_user_track_lesson
  on public.workspace_documents(user_id, track_slug, lesson_slug, updated_at desc);

create index if not exists idx_workspace_versions_document_version_no
  on public.workspace_document_versions(document_id, version_no desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_workspace_documents_updated_at on public.workspace_documents;
create trigger set_workspace_documents_updated_at
before update on public.workspace_documents
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspace_documents enable row level security;
alter table public.workspace_document_versions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "workspace_documents_select_own" on public.workspace_documents;
create policy "workspace_documents_select_own"
  on public.workspace_documents
  for select
  using ((select auth.uid()) = user_id);

drop policy if exists "workspace_documents_insert_own" on public.workspace_documents;
create policy "workspace_documents_insert_own"
  on public.workspace_documents
  for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "workspace_documents_update_own" on public.workspace_documents;
create policy "workspace_documents_update_own"
  on public.workspace_documents
  for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "workspace_documents_delete_own" on public.workspace_documents;
create policy "workspace_documents_delete_own"
  on public.workspace_documents
  for delete
  using ((select auth.uid()) = user_id);

drop policy if exists "workspace_versions_select_own" on public.workspace_document_versions;
create policy "workspace_versions_select_own"
  on public.workspace_document_versions
  for select
  using ((select auth.uid()) = user_id);

drop policy if exists "workspace_versions_insert_own" on public.workspace_document_versions;
create policy "workspace_versions_insert_own"
  on public.workspace_document_versions
  for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "workspace_versions_delete_own" on public.workspace_document_versions;
create policy "workspace_versions_delete_own"
  on public.workspace_document_versions
  for delete
  using ((select auth.uid()) = user_id);
