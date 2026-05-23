// ── ZONE 27 · Supabase server client(SSR · cookies-aware)──
// Round 30 Wave 5 · Phase 1 magic link auth。
//
// Used by:
//   - Server components reading session(/member · /admin · /login)
//   - Route handlers exchanging magic-link code for session
//     (/auth/callback)
//   - Server actions performing authenticated mutations
//
// The cookie adapter passes Next 16's cookies() store · so Supabase can
// read + write session cookies during SSR + route-handler execution。
// ─────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars · expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component · cookie set is no-op here
          // (middleware would handle session refresh in a fuller setup ·
          // for MVP we skip middleware · session refresh happens lazily
          // on next request)。
        }
      },
    },
  });
}

/** Lightweight helper for server components: returns current session or
 *  null。 Used by /member · /admin · etc. to render auth-aware UI without
 *  bouncing on render errors when Supabase is unreachable.
 *
 *  ⚠ SECURITY NOTE(R59 W-E · Agent B Finding #8)· getSession() reads cookies
 *  WITHOUT server re-validation · spoofable client-side。 SAFE for UI-paint
 *  (chip rendering · welcome banner)· UNSAFE for trust decisions(admin gate
 *  · per-user data fetch · destructive mutations)· 之後 trust-critical code
 *  必須 use getUser() below(re-validates with Supabase auth server)。 */
export async function getSession() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

/** R59 W-E · Agent B Finding #8 · TRUST-VALIDATED user helper · 同 getSession
 *  但 re-validates with Supabase auth server(JWT verify · DB lookup)。 用於
 *  trust-critical code path:admin gating · per-user data fetch · destructive
 *  mutations · server actions reading PII。 Supabase docs explicitly warn
 *  getSession() is spoofable for these · use this helper instead。 Returns
 *  { user } or null on failure / no auth。
 *
 *  Latency:~50-100ms vs getSession 0ms · acceptable for non-UI paths。
 *  Currently /admin doesn't yet gate · this helper is here for the future
 *  Phase-2 admin actions ship。 */
export async function getUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
