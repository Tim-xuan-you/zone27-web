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
 *  bouncing on render errors when Supabase is unreachable. */
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
