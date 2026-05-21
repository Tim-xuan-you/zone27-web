// ── ZONE 27 · Personal Match Notes ─────────────────────
// Round 30 Wave 9 · FREE TIER unlock #2(after W6 Follow)。
//
// Note = 私人 per-match annotation · 只 user 自己 read · 不公開 · 0
// server-side read。 用 Supabase auth.users.user_metadata.match_notes
// (JSONB)存 · 同 W6 follows pattern · 0 DB migration · 0 Tim 動作。
//
// Storage shape:
//   user_metadata.match_notes = { "cpbl-260521-01": "我覺得...", ... }
//
// Per-note cap 1000 chars(防 user_metadata 膨脹 · per Supabase 100KB
// recommended)。 Empty note = delete entry。 No public listing(per
// /privacy 0-tracking)· /member 不顯示 notes 全文 · 只在 /matches/[id]
// 該場頁顯示該場 note(per Tim「分析在哪裡」 sharp answer)。
//
// 跟「發文(公開)」分開:
//   - Note(私人) = FREE TIER · 自己看 · 0 public read
//   - 公開發文 = BLACK CARD Q3+ TapPay · 完全不同 flow / 審核 / 抽成 5%
// 互相不替代 · 共存。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const META_KEY = "match_notes";
const MAX_LEN = 1000;

export type NotesMap = Record<string, string>;

export async function getMyNotes(): Promise<NotesMap> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return {};
  return extractNotes(data.user.user_metadata as Record<string, unknown>);
}

export async function saveNote(
  matchId: string,
  text: string
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    throw new Error("not_logged_in");
  }
  const current = extractNotes(
    userData.user.user_metadata as Record<string, unknown>
  );
  const trimmed = text.trim().slice(0, MAX_LEN);
  if (trimmed) {
    current[matchId] = trimmed;
  } else {
    delete current[matchId];
  }
  const { error: updateErr } = await supabase.auth.updateUser({
    data: { [META_KEY]: current },
  });
  if (updateErr) {
    throw new Error(updateErr.message || "save_failed");
  }
}

export function readNotesFromMeta(
  meta: Record<string, unknown> | null | undefined
): NotesMap {
  if (!meta) return {};
  return extractNotes(meta);
}

function extractNotes(meta: Record<string, unknown> | null): NotesMap {
  if (!meta) return {};
  const raw = meta[META_KEY];
  if (!raw || typeof raw !== "object") return {};
  const result: NotesMap = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string") result[k] = v;
  }
  return result;
}
