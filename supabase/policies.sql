-- Beeliber Academy policies.sql
-- 목적: RLS 정책과 Storage 정책 초안을 정의한다.

begin;

-- =========================
-- 1) Enable RLS
-- =========================
alter table public.academy_users enable row level security;
alter table public.academy_tracks enable row level security;
alter table public.academy_modules enable row level security;
alter table public.academy_module_resources enable row level security;
alter table public.academy_assignments enable row level security;
alter table public.academy_submissions enable row level security;
alter table public.academy_submission_files enable row level security;
alter table public.academy_ai_reviews enable row level security;
alter table public.academy_feedbacks enable row level security;
alter table public.academy_progress enable row level security;
alter table public.academy_placement_recommendations enable row level security;
alter table public.academy_review_rules enable row level security;

-- =========================
-- 2) Drop old policies if exists
-- =========================
drop policy if exists "academy_users_select_self_or_admin" on public.academy_users;
drop policy if exists "academy_users_admin_manage" on public.academy_users;

drop policy if exists "academy_tracks_select_authenticated" on public.academy_tracks;
drop policy if exists "academy_tracks_admin_manage" on public.academy_tracks;

drop policy if exists "academy_modules_select_authenticated" on public.academy_modules;
drop policy if exists "academy_modules_admin_manage" on public.academy_modules;

drop policy if exists "academy_resources_select_authenticated" on public.academy_module_resources;
drop policy if exists "academy_resources_admin_manage" on public.academy_module_resources;

drop policy if exists "academy_assignments_select_authenticated" on public.academy_assignments;
drop policy if exists "academy_assignments_admin_manage" on public.academy_assignments;

drop policy if exists "academy_submissions_select_owner_or_reviewer" on public.academy_submissions;
drop policy if exists "academy_submissions_insert_owner" on public.academy_submissions;
drop policy if exists "academy_submissions_update_owner_or_admin" on public.academy_submissions;
drop policy if exists "academy_submissions_delete_owner_or_admin" on public.academy_submissions;

drop policy if exists "academy_submission_files_select_owner_or_reviewer" on public.academy_submission_files;
drop policy if exists "academy_submission_files_insert_owner" on public.academy_submission_files;
drop policy if exists "academy_submission_files_delete_owner_or_admin" on public.academy_submission_files;

drop policy if exists "academy_ai_reviews_select_owner_or_reviewer" on public.academy_ai_reviews;
drop policy if exists "academy_ai_reviews_reviewer_manage" on public.academy_ai_reviews;

drop policy if exists "academy_feedbacks_select_owner_or_reviewer" on public.academy_feedbacks;
drop policy if exists "academy_feedbacks_reviewer_insert" on public.academy_feedbacks;
drop policy if exists "academy_feedbacks_reviewer_update" on public.academy_feedbacks;

drop policy if exists "academy_progress_select_owner_or_reviewer" on public.academy_progress;
drop policy if exists "academy_progress_insert_owner_or_admin" on public.academy_progress;
drop policy if exists "academy_progress_update_owner_or_admin" on public.academy_progress;

drop policy if exists "academy_placement_select_owner_or_reviewer" on public.academy_placement_recommendations;
drop policy if exists "academy_placement_reviewer_manage" on public.academy_placement_recommendations;

drop policy if exists "academy_review_rules_select_authenticated" on public.academy_review_rules;
drop policy if exists "academy_review_rules_admin_manage" on public.academy_review_rules;

-- =========================
-- 3) Table policies
-- =========================

-- academy_users
create policy "academy_users_select_self_or_admin"
on public.academy_users
for select
to authenticated
using (
  id = auth.uid()
  or public.is_reviewer_or_admin()
);

create policy "academy_users_admin_manage"
on public.academy_users
for all
to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

-- academy_tracks
create policy "academy_tracks_select_authenticated"
on public.academy_tracks
for select
to authenticated
using (true);

create policy "academy_tracks_admin_manage"
on public.academy_tracks
for all
to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

-- academy_modules
create policy "academy_modules_select_authenticated"
on public.academy_modules
for select
to authenticated
using (true);

create policy "academy_modules_admin_manage"
on public.academy_modules
for all
to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

-- academy_module_resources
create policy "academy_resources_select_authenticated"
on public.academy_module_resources
for select
to authenticated
using (true);

create policy "academy_resources_admin_manage"
on public.academy_module_resources
for all
to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

-- academy_assignments
create policy "academy_assignments_select_authenticated"
on public.academy_assignments
for select
to authenticated
using (true);

create policy "academy_assignments_admin_manage"
on public.academy_assignments
for all
to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

-- academy_submissions
create policy "academy_submissions_select_owner_or_reviewer"
on public.academy_submissions
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
);

create policy "academy_submissions_insert_owner"
on public.academy_submissions
for insert
to authenticated
with check (
  user_id = auth.uid()
);

create policy "academy_submissions_update_owner_or_admin"
on public.academy_submissions
for update
to authenticated
using (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
)
with check (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
);

create policy "academy_submissions_delete_owner_or_admin"
on public.academy_submissions
for delete
to authenticated
using (
  user_id = auth.uid()
  or public.is_academy_admin()
);

-- academy_submission_files
create policy "academy_submission_files_select_owner_or_reviewer"
on public.academy_submission_files
for select
to authenticated
using (
  exists (
    select 1
    from public.academy_submissions s
    where s.id = academy_submission_files.submission_id
      and (
        s.user_id = auth.uid()
        or public.is_reviewer_or_admin()
      )
  )
);

create policy "academy_submission_files_insert_owner"
on public.academy_submission_files
for insert
to authenticated
with check (
  exists (
    select 1
    from public.academy_submissions s
    where s.id = academy_submission_files.submission_id
      and (
        s.user_id = auth.uid()
        or public.is_reviewer_or_admin()
      )
  )
);

create policy "academy_submission_files_delete_owner_or_admin"
on public.academy_submission_files
for delete
to authenticated
using (
  exists (
    select 1
    from public.academy_submissions s
    where s.id = academy_submission_files.submission_id
      and (
        s.user_id = auth.uid()
        or public.is_reviewer_or_admin()
      )
  )
);

-- academy_ai_reviews
create policy "academy_ai_reviews_select_owner_or_reviewer"
on public.academy_ai_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.academy_submissions s
    where s.id = academy_ai_reviews.submission_id
      and (
        s.user_id = auth.uid()
        or public.is_reviewer_or_admin()
      )
  )
);

create policy "academy_ai_reviews_reviewer_manage"
on public.academy_ai_reviews
for all
to authenticated
using (public.is_reviewer_or_admin())
with check (public.is_reviewer_or_admin());

-- academy_feedbacks
create policy "academy_feedbacks_select_owner_or_reviewer"
on public.academy_feedbacks
for select
to authenticated
using (
  exists (
    select 1
    from public.academy_submissions s
    where s.id = academy_feedbacks.submission_id
      and (
        s.user_id = auth.uid()
        or public.is_reviewer_or_admin()
      )
  )
);

create policy "academy_feedbacks_reviewer_insert"
on public.academy_feedbacks
for insert
to authenticated
with check (
  public.is_reviewer_or_admin()
  and reviewer_id = auth.uid()
);

create policy "academy_feedbacks_reviewer_update"
on public.academy_feedbacks
for update
to authenticated
using (public.is_reviewer_or_admin())
with check (public.is_reviewer_or_admin());

-- academy_progress
create policy "academy_progress_select_owner_or_reviewer"
on public.academy_progress
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
);

create policy "academy_progress_insert_owner_or_admin"
on public.academy_progress
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
);

create policy "academy_progress_update_owner_or_admin"
on public.academy_progress
for update
to authenticated
using (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
)
with check (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
);

-- academy_placement_recommendations
create policy "academy_placement_select_owner_or_reviewer"
on public.academy_placement_recommendations
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_reviewer_or_admin()
);

create policy "academy_placement_reviewer_manage"
on public.academy_placement_recommendations
for all
to authenticated
using (public.is_reviewer_or_admin())
with check (public.is_reviewer_or_admin());

-- academy_review_rules
create policy "academy_review_rules_select_authenticated"
on public.academy_review_rules
for select
to authenticated
using (true);

create policy "academy_review_rules_admin_manage"
on public.academy_review_rules
for all
to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

-- =========================
-- 4) Storage policies
-- 파일 경로 규칙 권장:
-- academy-submissions/{auth.uid()}/{submissionId}/{filename}
-- academy-resources/{moduleSlug}/{filename}
-- =========================

-- Drop old storage policies if they exist
drop policy if exists "academy_submissions_upload_own" on storage.objects;
drop policy if exists "academy_submissions_read_own_or_reviewer" on storage.objects;
drop policy if exists "academy_submissions_delete_own_or_reviewer" on storage.objects;
drop policy if exists "academy_resources_read_authenticated" on storage.objects;
drop policy if exists "academy_resources_admin_manage" on storage.objects;

create policy "academy_submissions_upload_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'academy-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "academy_submissions_read_own_or_reviewer"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'academy-submissions'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_reviewer_or_admin()
  )
);

create policy "academy_submissions_delete_own_or_reviewer"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'academy-submissions'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_reviewer_or_admin()
  )
);

create policy "academy_resources_read_authenticated"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'academy-resources'
);

create policy "academy_resources_admin_manage"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'academy-resources'
  and public.is_academy_admin()
)
with check (
  bucket_id = 'academy-resources'
  and public.is_academy_admin()
);

commit;
