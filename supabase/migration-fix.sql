-- Beeliber Academy migration (순서 수정 버전)
-- 테이블을 먼저 만들고, 함수는 나중에 생성

begin;

create extension if not exists pgcrypto;

-- =========================
-- 1) Enum types
-- =========================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'academy_user_role') then
    create type public.academy_user_role as enum ('student','marketer','developer','automation','reviewer','admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'academy_user_status') then
    create type public.academy_user_status as enum ('active','inactive','suspended');
  end if;
  if not exists (select 1 from pg_type where typname = 'academy_module_difficulty') then
    create type public.academy_module_difficulty as enum ('basic','intermediate','advanced');
  end if;
  if not exists (select 1 from pg_type where typname = 'academy_submission_type') then
    create type public.academy_submission_type as enum ('text','markdown','json','image','video','mixed');
  end if;
  if not exists (select 1 from pg_type where typname = 'academy_submission_status') then
    create type public.academy_submission_status as enum ('draft','submitted','ai_reviewed','revision_requested','resubmitted','passed','failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'academy_feedback_decision') then
    create type public.academy_feedback_decision as enum ('pass','revise','fail');
  end if;
  if not exists (select 1 from pg_type where typname = 'academy_resource_type') then
    create type public.academy_resource_type as enum ('markdown','pdf','link','video','image','template','checklist');
  end if;
  if not exists (select 1 from pg_type where typname = 'academy_rule_type') then
    create type public.academy_rule_type as enum ('brand','policy','language','factual');
  end if;
end $$;

-- =========================
-- 2) updated_at 함수 (테이블 참조 없음 — 안전)
-- =========================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- =========================
-- 3) 테이블 생성 (핵심)
-- =========================
create table if not exists public.academy_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role public.academy_user_role not null default 'student',
  team text,
  status public.academy_user_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  order_no integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.academy_tracks(id) on delete cascade,
  slug text not null unique,
  title text not null,
  summary text,
  difficulty public.academy_module_difficulty not null default 'basic',
  estimated_minutes integer not null default 20 check (estimated_minutes > 0),
  is_required boolean not null default true,
  order_no integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_module_resources (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.academy_modules(id) on delete cascade,
  title text not null,
  resource_type public.academy_resource_type not null,
  external_url text,
  content_markdown text,
  order_no integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint module_resource_payload_check check (external_url is not null or content_markdown is not null)
);

create table if not exists public.academy_assignments (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.academy_modules(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null,
  submission_type public.academy_submission_type not null,
  rubric jsonb not null default '{}'::jsonb,
  due_days integer check (due_days is null or due_days >= 0),
  is_required boolean not null default true,
  order_no integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.academy_assignments(id) on delete cascade,
  user_id uuid not null references public.academy_users(id) on delete cascade,
  version_no integer not null default 1 check (version_no > 0),
  content_text text,
  content_json jsonb,
  status public.academy_submission_status not null default 'draft',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.academy_submissions(id) on delete cascade,
  file_url text not null,
  file_kind text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_ai_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.academy_submissions(id) on delete cascade,
  planner_score numeric(5,2) check (planner_score is null or (planner_score >= 0 and planner_score <= 100)),
  evaluator_score numeric(5,2) check (evaluator_score is null or (evaluator_score >= 0 and evaluator_score <= 100)),
  brand_violation_count integer not null default 0 check (brand_violation_count >= 0),
  policy_violation_count integer not null default 0 check (policy_violation_count >= 0),
  factual_risk_count integer not null default 0 check (factual_risk_count >= 0),
  language_violation_count integer not null default 0 check (language_violation_count >= 0),
  review_summary text,
  review_detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_feedbacks (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.academy_submissions(id) on delete cascade,
  reviewer_id uuid not null references public.academy_users(id) on delete cascade,
  feedback_text text not null,
  action_items jsonb not null default '[]'::jsonb,
  final_score numeric(5,2) check (final_score is null or (final_score >= 0 and final_score <= 100)),
  decision public.academy_feedback_decision not null,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.academy_users(id) on delete cascade,
  module_id uuid not null references public.academy_modules(id) on delete cascade,
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create table if not exists public.academy_placement_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.academy_users(id) on delete cascade,
  recommended_role text not null,
  confidence_score numeric(5,2) check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 100)),
  reason_text text,
  recommended_tasks jsonb not null default '[]'::jsonb,
  approved_by uuid references public.academy_users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_review_rules (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  rule_type public.academy_rule_type not null,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- 4) 테이블 생성 후 — 참조 함수 생성
-- =========================
create or replace function public.current_academy_role()
returns public.academy_user_role language sql stable security definer set search_path = public as $$
  select au.role from public.academy_users au where au.id = auth.uid()
$$;

create or replace function public.is_academy_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_users au where au.id = auth.uid() and au.role = 'admin')
$$;

create or replace function public.is_reviewer_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_users au where au.id = auth.uid() and au.role in ('reviewer', 'admin'))
$$;

-- =========================
-- 5) Indexes
-- =========================
create index if not exists idx_academy_tracks_order on public.academy_tracks(order_no);
create index if not exists idx_academy_modules_track_order on public.academy_modules(track_id, order_no);
create index if not exists idx_academy_assignments_module_order on public.academy_assignments(module_id, order_no);
create index if not exists idx_academy_submissions_user on public.academy_submissions(user_id, created_at desc);
create index if not exists idx_academy_submissions_assignment on public.academy_submissions(assignment_id, created_at desc);
create index if not exists idx_academy_ai_reviews_submission on public.academy_ai_reviews(submission_id, created_at desc);
create index if not exists idx_academy_feedbacks_submission on public.academy_feedbacks(submission_id, created_at desc);
create index if not exists idx_academy_progress_user on public.academy_progress(user_id);
create index if not exists idx_academy_placement_user on public.academy_placement_recommendations(user_id, created_at desc);

-- =========================
-- 6) updated_at triggers
-- =========================
drop trigger if exists trg_academy_users_updated_at on public.academy_users;
create trigger trg_academy_users_updated_at before update on public.academy_users for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_tracks_updated_at on public.academy_tracks;
create trigger trg_academy_tracks_updated_at before update on public.academy_tracks for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_modules_updated_at on public.academy_modules;
create trigger trg_academy_modules_updated_at before update on public.academy_modules for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_module_resources_updated_at on public.academy_module_resources;
create trigger trg_academy_module_resources_updated_at before update on public.academy_module_resources for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_assignments_updated_at on public.academy_assignments;
create trigger trg_academy_assignments_updated_at before update on public.academy_assignments for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_submissions_updated_at on public.academy_submissions;
create trigger trg_academy_submissions_updated_at before update on public.academy_submissions for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_progress_updated_at on public.academy_progress;
create trigger trg_academy_progress_updated_at before update on public.academy_progress for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_placement_updated_at on public.academy_placement_recommendations;
create trigger trg_academy_placement_updated_at before update on public.academy_placement_recommendations for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_review_rules_updated_at on public.academy_review_rules;
create trigger trg_academy_review_rules_updated_at before update on public.academy_review_rules for each row execute function public.set_updated_at();

-- =========================
-- 7) Auth signup trigger
-- =========================
create or replace function public.handle_new_academy_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_users (id, email, name, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1), 'academy-user'),
    coalesce((new.raw_user_meta_data ->> 'role')::public.academy_user_role, 'student'),
    'active'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created_academy on auth.users;
create trigger on_auth_user_created_academy after insert on auth.users for each row execute function public.handle_new_academy_user();

-- =========================
-- 8) Storage buckets
-- =========================
insert into storage.buckets (id, name, public, file_size_limit)
values
  ('academy-submissions', 'academy-submissions', false, 52428800),
  ('academy-resources', 'academy-resources', false, 52428800)
on conflict (id) do nothing;

commit;
