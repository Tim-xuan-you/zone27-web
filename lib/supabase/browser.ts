// ── ZONE 27 · Supabase browser client(SSR-aware · cookies)──
// Round 30 Wave 5 · Phase 1 magic link auth accelerated from
// Q3 2026 → 2026-05-21 evening。
//
// Used by client components that need auth-aware session(login form ·
// logout button · client-side gated UI)。 Cookie-aware (vs the legacy
// lib/supabase.ts singleton which uses createClient + no cookie
// handling)· so session persists across page navigations + SSR reads
// the same session via the matching server client。
//
// Backward compat: lib/supabase.ts stays for the legacy WaitlistForm +
// waitlist-stats reads which don't need auth context。 New auth-aware
// code uses this browser client。
// ─────────────────────────────────────────────────────

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars · expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
