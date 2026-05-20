// ── ZONE 27 · Supabase client (singleton) ──────────────
// Used by:
//   - WaitlistForm (client component) → INSERT into waitlist table
//   - Server Actions / Server Components → read aggregate counts
//
// Uses the publishable key (formerly "anon" key). Safe to expose because:
//   - Row Level Security is enabled on every table by default (project
//     created with "Enable automatic RLS").
//   - Tables stay invisible to anon until we explicitly write a policy.
//   - See Supabase dashboard → Authentication → Policies for current grants.
// ─────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars · expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY · see .env.local"
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
