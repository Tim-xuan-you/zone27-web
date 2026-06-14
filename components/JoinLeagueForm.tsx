"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinLeague, leagueErrorText } from "@/lib/leagues-client";

// ── ZONE 27 · 用邀請碼加入私人聯盟(client form)──────────────────────
// initialCode:邀請連結帶 ?join=CODE 時預填(來自 /member/leagues?join=)。 成功 → 帶去該盟天梯。
// ─────────────────────────────────────────────────────

export default function JoinLeagueForm({
  initialCode = "",
}: {
  initialCode?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode.toUpperCase().slice(0, 6));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    const v = code.trim().toUpperCase();
    if (busy || v.length === 0) return;
    setBusy(true);
    setErr(null);
    const res = await joinLeague(v);
    if (res.ok) {
      router.push(`/member/leagues/${res.id}`);
      return;
    }
    setErr(leagueErrorText(res.error));
    setBusy(false);
  };

  return (
    <div className="border border-line/60 bg-slate/30 p-5">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-1">
        / 用邀請碼加入
      </p>
      <p className="text-mute/85 text-[13px] leading-relaxed mb-3">
        朋友給你 6 碼邀請碼?貼進來就加入他的盟。
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={code}
          maxLength={6}
          onChange={(e) =>
            setCode(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ""))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="A3F90C"
          aria-label="邀請碼(6 碼英數)"
          className="w-36 bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 placeholder:text-mute/40 font-mono text-[14px] tracking-[0.25em] uppercase transition-colors"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || code.trim().length === 0}
          className="shrink-0 px-4 py-2 border border-gold/50 text-gold font-mono text-[11px] tracking-[0.2em] hover:bg-gold/10 hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "加入中…" : "加入 →"}
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
