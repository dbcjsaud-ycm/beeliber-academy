import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminClient } from './AdminClient';

export default async function AdminPage() {
  // 1) Check session
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?from=/admin');
  }

  // 2) Check superadmin role
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('account_type')
    .eq('id', user.id)
    .single();

  if (profile?.account_type !== 'superadmin') {
    redirect('/academy');
  }

  // 3) Fetch academy profiles (non-superadmin)
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, email, display_name, account_type, is_active, metadata, created_at')
    .neq('account_type', 'superadmin')
    .order('created_at', { ascending: false });

  // 4) Fetch credit balances for all profiles
  const profileIds = (profiles ?? []).map((p) => p.id);
  let creditMap: Record<string, number> = {};

  if (profileIds.length > 0) {
    const { data: credits } = await admin
      .from('credit_accounts')
      .select('user_id, balance')
      .in('user_id', profileIds);

    for (const c of credits ?? []) {
      creditMap[c.user_id] = c.balance ?? 0;
    }
  }

  // 5) Dashboard stats from real submissions
  const { data: submissions } = await admin
    .from('academy_submissions')
    .select('id, status, ai_score, user_id, assignment_id, created_at');

  const totalSubmissions = submissions?.length ?? 0;
  const passed = submissions?.filter((s) => ['passed', 'completed'].includes(s.status)).length ?? 0;
  const revised = submissions?.filter((s) => s.status === 'revision_required').length ?? 0;
  const totalUsers = profiles?.length ?? 0;

  // 6) Pending review queue
  const { data: pendingRaw } = await admin
    .from('academy_submissions')
    .select(`
      id,
      status,
      ai_score,
      user_id,
      profiles!academy_submissions_user_id_fkey ( display_name ),
      academy_assignments!academy_submissions_assignment_id_fkey ( title )
    `)
    .in('status', ['submitted', 'ai_reviewed'])
    .order('created_at', { ascending: false })
    .limit(10);

  const pending = (pendingRaw ?? []).map((s: Record<string, unknown>) => ({
    id: s.id as string,
    status: s.status as string,
    score: s.ai_score as number | null,
    userName: (s.profiles as { display_name?: string } | null)?.display_name ?? '(알 수 없음)',
    assignmentTitle: (s.academy_assignments as { title?: string } | null)?.title ?? '(알 수 없음)',
  }));

  // 7) Violation TOP 5 from ai_reviews
  const { data: reviewsRaw } = await admin
    .from('academy_ai_reviews')
    .select('violations');

  const violationCounts: Record<string, number> = {};
  for (const r of reviewsRaw ?? []) {
    const viols: string[] = Array.isArray(r.violations) ? r.violations : [];
    for (const v of viols) {
      violationCounts[v] = (violationCounts[v] ?? 0) + 1;
    }
  }
  const violations = Object.entries(violationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([rule, count]) => ({ rule, count }));

  // 8) Track completion from academy_progress
  const { data: progressRaw } = await admin
    .from('academy_progress')
    .select('track_id, completed_at');

  const completedByTrack: Record<string, number> = {};
  for (const p of progressRaw ?? []) {
    if (p.completed_at && p.track_id) {
      completedByTrack[p.track_id] = (completedByTrack[p.track_id] ?? 0) + 1;
    }
  }

  const dashboardData = {
    stats: {
      totalUsers,
      submissionRate: totalUsers > 0 && totalSubmissions > 0
        ? Math.round((totalSubmissions / totalUsers) * 100)
        : 0,
      firstPassRate: totalSubmissions > 0 ? Math.round((passed / totalSubmissions) * 100) : 0,
      revisionRate: totalSubmissions > 0 ? Math.round((revised / totalSubmissions) * 100) : 0,
    },
    pending,
    violations,
    completedByTrack,
  };

  return (
    <AdminClient
      initialProfiles={profiles ?? []}
      initialCreditMap={creditMap}
      dashboardData={dashboardData}
    />
  );
}
