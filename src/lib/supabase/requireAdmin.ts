import { createServerSupabaseClient } from './server';
import { createAdminClient } from './admin';

/**
 * Returns the authenticated user if they are an admin or superadmin, otherwise null.
 * Use in API route handlers to guard admin-only endpoints.
 */
export async function requireAdmin() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();

    const allowed = ['admin', 'superadmin'];
    return profile?.account_type && allowed.includes(profile.account_type) ? user : null;
  } catch {
    return null;
  }
}
