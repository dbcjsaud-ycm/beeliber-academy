import { createServerSupabaseClient } from './server';
import { createAdminClient } from './admin';

/**
 * Returns the authenticated user if they are a superadmin, otherwise null.
 * Use in API route handlers to guard superadmin-only endpoints.
 */
export async function requireSuperadmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('account_type')
    .eq('id', user.id)
    .single();

  return profile?.account_type === 'superadmin' ? user : null;
}
