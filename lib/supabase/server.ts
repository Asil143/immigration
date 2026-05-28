import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Admin client — uses service role key, bypasses RLS, for API routes only
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
