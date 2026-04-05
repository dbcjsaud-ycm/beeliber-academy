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

  return <AdminClient initialProfiles={profiles ?? []} initialCreditMap={creditMap} />;
}
