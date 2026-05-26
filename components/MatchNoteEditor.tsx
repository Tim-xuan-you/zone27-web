"use client";

import { useEffect, useRef, useState } from "react";
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
  const mountedRef = useRef(true);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

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
      if (!mountedRef.current) return;
      setSavedText(text);
      setStatus({ kind: "saved" });
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => {
        if (mountedRef.current) setStatus({ kind: "ready" });
      }, 1800);
    } catch (err) {
      if (!mountedRef.current) return;
      const raw = err instanceof Error ? err.message : "save_failed";
      // R158 W1 · Agent I error #2 · 不 leak raw Supabase err.message(JWT expired
      // / fetch failed)to visitor · per [[zone27-disclosure-philosophy]] + 不 panic ·
      // 不 pretend nothing wrong · 給 concrete 下一步。 raw error 在 console
      // available for debugging。
      if (process.env.NODE_ENV !== "production") {
        console.warn("[MatchNoteEditor] save error:", raw);
      }
      const visibleMessage = /network|fetch/i.test(raw)
        ? "網路 issue · 您的筆記還沒寫入(留在輸入框)· 請 10 秒後再儲存"
        : /jwt|session|expired/i.test(raw)
        ? "session 過期 · 請 /login 重新登入 · 您的筆記留在輸入框"
        : "筆記儲存失敗 · 留在輸入框未消失 · 重試或 email Tim";
      setStatus({ kind: "error", message: visibleMessage });
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
          // R108 W5 · field-sizing: content auto-grow(Chrome 123+ Baseline 2024)·
          // textarea 自動隨 content 高度長 · 不需 useRef + resize hack ·
          // Notion/Linear inline-comment editor pattern · 0 JS · 0 CLS。
          // 上限 24rem 防失控 · 下限 6rem 保 initial visual weight。
          className="w-full bg-navy/60 border border-line/70 px-3 py-2 text-bone text-sm focus:outline-none focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/30 transition-colors font-mono leading-relaxed resize-y [field-sizing:content] min-h-[6rem] max-h-[24rem]"
        />
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            ▸ 只您看得到 · 不公開 · 0 server-side read · per /privacy
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || status.kind === "saving"}
            className="px-5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[32px] bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
