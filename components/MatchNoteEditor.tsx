"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMyNotes, saveNote } from "@/lib/notes";

// ── ZONE 27 · Match Note Editor ────────────────────────
// Round 30 Wave 9 · FREE TIER unlock #2(在 /matches/[gameId] 渲染)。
//
// 只 logged-in user 看到 editor · anon visitor 完全不渲染 component。
// 1000 char cap · 自動 truncate。 Save 到 user_metadata。 Dirty / saved
// state visible · 不 toast / 不 alert · 沿 W8 brand axiom interface IS
// message — 1 行 caption「只您看得到」就夠 · 不寫 prose 解釋。
// ─────────────────────────────────────────────────────

type Status =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "ready" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

const MAX_LEN = 1000;

export default function MatchNoteEditor({ matchId }: { matchId: string }) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!data.session) {
          setStatus({ kind: "anonymous" });
          return;
        }
        const notes = await getMyNotes();
        if (cancelled) return;
        const existing = notes[matchId] ?? "";
        setText(existing);
        setSavedText(existing);
        setStatus({ kind: "ready" });
      } catch {
        if (!cancelled) setStatus({ kind: "anonymous" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  async function handleSave() {
    setStatus({ kind: "saving" });
    try {
      await saveNote(matchId, text);
      setSavedText(text);
      setStatus({ kind: "saved" });
      setTimeout(() => setStatus({ kind: "ready" }), 1800);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "save_failed";
      setStatus({ kind: "error", message });
    }
  }

  if (status.kind === "loading" || status.kind === "anonymous") {
    // Hide silently · anon visitors don't see editor at all。
    return null;
  }

  const dirty = text !== savedText;
  return (
    <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
      <div className="bg-slate/30 border border-line/60 p-5 sm:p-6">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em]"
          >
            / YOUR PRIVATE NOTE · 您的分析
          </p>
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] tabular">
            {text.length} / {MAX_LEN}
          </p>
        </div>
        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value.slice(0, MAX_LEN))
          }
          placeholder="您對這場的分析 / 預測 / 賽後回顧..."
          rows={4}
          aria-label="Private match note"
          className="w-full bg-navy/60 border border-line/70 px-3 py-2 text-bone text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors font-mono leading-relaxed resize-y"
        />
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            ▸ 只您看得到 · 不公開 · 0 server-side read · per /privacy
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || status.kind === "saving"}
            className="px-5 py-1.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.kind === "saving"
              ? "● 儲存中"
              : status.kind === "saved"
              ? "✓ 已儲存"
              : "儲存筆記"}
          </button>
        </div>
        {status.kind === "error" && (
          <p
            role="alert"
            aria-live="polite"
            className="mt-3 font-mono text-loss text-[10px] tracking-[0.2em] leading-relaxed"
          >
            ✕ {status.message}
          </p>
        )}
      </div>
    </section>
  );
}
