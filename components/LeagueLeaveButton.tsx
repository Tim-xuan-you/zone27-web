"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { leaveLeague } from "@/lib/leagues-client";

// ── ZONE 27 · 退出聯盟(client · 次要動作 · 二段確認免誤觸)──────────────
export default function LeagueLeaveButton({ leagueId }: { leagueId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const doLeave = async () => {
    if (busy) return;
    setBusy(true);
    await leaveLeague(leagueId);
    router.push("/member/leagues");
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="font-mono text-mute/45 hover:text-loss/80 text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
      >
        退出這個盟
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-3">
      <span className="font-mono text-mute/70 text-[10px] tracking-[0.15em]">
        確定退出?
      </span>
      <button
        type="button"
        onClick={doLeave}
        disabled={busy}
        className="font-mono text-loss/85 hover:text-loss text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors disabled:opacity-50"
      >
        {busy ? "退出中…" : "退出"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="font-mono text-mute/50 hover:text-gold text-[10px] tracking-[0.2em] transition-colors"
      >
        取消
      </button>
    </span>
  );
}
