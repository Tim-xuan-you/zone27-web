"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLeague, leagueErrorText } from "@/lib/leagues-client";

// ── ZONE 27 · 建立私人聯盟(client form)──────────────────────────────
// 取盟名 → create_league → 成功直接帶去新盟的天梯頁(你立刻看到自己的盟 + 邀請碼)。
// ─────────────────────────────────────────────────────

const MAX = 40;

export default function CreateLeagueForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    const v = name.trim();
    if (!v || busy) return;
    setBusy(true);
    setErr(null);
    const res = await createLeague(v);
    if (res.ok) {
      router.push(`/member/leagues/${res.id}`);
      return; // 導頁 · 不解除 busy(避免閃一下)
    }
    setErr(leagueErrorText(res.error));
    setBusy(false);
  };

  return (
    <div className="border border-line/60 bg-slate/30 p-5">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-1">
        / 開一個盟
      </p>
      <p className="text-mute/85 text-[13px] leading-relaxed mb-3">
        揪一群朋友,整季比誰最會讀球。 建完拿到邀請碼,傳給他們就能加入。
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={name}
          maxLength={MAX}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="例如:兄弟死忠盟"
          aria-label="聯盟名稱"
          className="flex-1 min-w-[12rem] bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 placeholder:text-mute/50 font-mono text-[13px] transition-colors"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || name.trim().length === 0}
          className="shrink-0 px-4 py-2 bg-gold text-navy font-mono text-[11px] tracking-[0.2em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "建立中…" : "建立 →"}
        </button>
      </div>
      {err && (
        <p
          role="alert"
          className="mt-2 font-mono text-loss/85 text-[10px] tracking-[0.12em] leading-relaxed"
        >
          {err}
        </p>
      )}
    </div>
  );
}
