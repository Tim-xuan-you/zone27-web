"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { readPredictionsFromMeta, type UserPrediction } from "@/lib/predictions";

// ── ZONE 27 · User Prediction Picker ────────────────────
// Round 31 W-W1 · Tim「使用者可以自己猜賽事?」 brand-IP-pure ship。
// 3-way pick · saves to user_metadata.predictions(同 follows/notes
// pattern · 0 DB migration)。 logged-in only · anonymous 顯示「→ 登入
// 解鎖 您的 prediction」 CTA。
//
// 設計:
//   - 3 buttons inline:「我猜 [home]」 / 「我猜 [away]」 / 「不押」
//   - 已 picked:顯示當前 pick 標記 + 「變更 ↓」 toggle
//   - 賽後 finalResult 存在 · 加 verdict chip(✓ PROVED / ✕ DIVERGED / = PUSH)
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  /** Pre-game engine pick(home/away ≥50% prob)· 用於「對照引擎」 framing */
  engineHomePicked: boolean;
  /** Final result if ingested · 控制 verdict chip 顯示 */
  finalWinner?: "home" | "away" | "tie" | null;
};

type Status = "loading" | "anonymous" | "ready";

export default function UserPredictionPicker({
  matchId,
  homeName,
  awayName,
  engineHomePicked,
  finalWinner,
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [currentPick, setCurrentPick] = useState<UserPrediction | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!session) {
          setStatus("anonymous");
          return;
        }
        const meta = session.user.user_metadata as Record<string, unknown> | undefined;
        const map = readPredictionsFromMeta(meta);
        setCurrentPick(map[matchId] ?? null);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "unknown_error");
        setStatus("anonymous");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const pick = async (choice: UserPrediction["pick"]) => {
    setSaving(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("not_logged_in");
        setSaving(false);
        return;
      }
      const meta = (session.user.user_metadata as Record<string, unknown>) ?? {};
      const existing = readPredictionsFromMeta(meta);
      const newPred: UserPrediction = {
        pick: choice,
        ts: new Date().toISOString(),
      };
      const updated = { ...existing, [matchId]: newPred };
      const { error: updateErr } = await supabase.auth.updateUser({
        data: { ...meta, predictions: updated },
      });
      if (updateErr) {
        setError(updateErr.message);
        setSaving(false);
        return;
      }
      setCurrentPick(newPred);
      setSaving(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown_error");
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="mt-4 bg-slate/30 border border-line/40 px-4 py-3" aria-hidden="true">
        <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">
          / YOUR PREDICTION · 載入中...
        </p>
      </div>
    );
  }

  if (status === "anonymous") {
    return (
      <div className="mt-4 bg-slate/40 border border-gold/30 px-4 py-3">
        <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-2">
          🎯 YOUR PREDICTION · 您自己也猜 · 對照引擎 + 實際
        </p>
        <p className="text-mute text-sm leading-relaxed mb-2">
          純精神 prediction tracker · 0 money / 0 reward / 0 兌換 · 延伸您
          personal calibration mirror 從「engine drift」 升「您 + engine + 實際」
          三層。
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(`/matches/${matchId}`)}`}
          className="inline-block px-4 py-2 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          → 登入解鎖 prediction
        </Link>
      </div>
    );
  }

  const myPick = currentPick?.pick;
  const showVerdict = !!finalWinner && !!myPick && myPick !== "skip" && finalWinner !== "tie";
  const myWon = showVerdict && myPick === finalWinner;

  return (
    <div className="mt-4 bg-gold/5 border border-gold/40 px-4 py-3">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.35em]">
          🎯 YOUR PREDICTION
        </p>
        {myPick && (
          <p className="font-mono text-mute text-[10px] tracking-[0.25em] tabular">
            您 picked · {new Date(currentPick!.ts).toLocaleDateString("en-CA")}
          </p>
        )}
      </div>

      {showVerdict ? (
        <div className="mb-3">
          <p
            className={`font-mono text-sm tracking-[0.2em] ${
              myWon ? "text-gold" : "text-loss/80"
            }`}
          >
            {myWon ? "✓ 您 PROVED · 猜對了" : "✕ 您 DIVERGED · 猜錯了"}
          </p>
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mt-1">
            您 vs 引擎 vs 實際 · 三層 mirror · 累積您{" "}
            <Link
              href="/member"
              className="text-mute hover:text-gold underline-offset-4 hover:underline"
            >
              personal accuracy
            </Link>
          </p>
        </div>
      ) : myPick && finalWinner === "tie" ? (
        <p className="font-mono text-mute text-sm tracking-[0.2em] mb-3">
          = PUSH · 賽事平局 · 不計入您 accuracy
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-2">
        <PickButton
          label={`我猜 ${homeName.slice(0, 4)}`}
          mark={engineHomePicked ? "(engine同)" : "(engine反)"}
          active={myPick === "home"}
          disabled={saving}
          onClick={() => pick("home")}
        />
        <PickButton
          label={`我猜 ${awayName.slice(0, 4)}`}
          mark={!engineHomePicked ? "(engine同)" : "(engine反)"}
          active={myPick === "away"}
          disabled={saving}
          onClick={() => pick("away")}
        />
        <PickButton
          label="不押"
          mark="看戲"
          active={myPick === "skip"}
          disabled={saving}
          onClick={() => pick("skip")}
        />
      </div>

      {error && (
        <p className="font-mono text-loss text-[10px] tracking-[0.25em] mt-2">
          ⚠ {error}
        </p>
      )}

      {/* Round 35 W-B · close loop · UserPredictionPicker → /rewards
          ecosystem connection。 brand IP「skill-based fantasy league prize」
          物理 surface · 0 cash · 0 referral · 0 wallet · 預測 PROVED 累計
          可兌換實體獎品(底片 / 咖啡 / 沖洗 / 護照代辦折抵)。 */}
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mt-3 leading-relaxed">
        ▸ 0 cash · 0 referral · 0 wallet · skill-based fantasy league prize
        structure · 「您 vs 引擎 vs 實際」 三層 calibration · 0 PII broadcast
        <br />
        ▸ 累計 PROVED 預測 →{" "}
        <Link
          href="/rewards"
          className="text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
        >
          /rewards 兌換實體獎品(底片 / 咖啡 / 沖洗 / 護照代辦)
        </Link>
      </p>
    </div>
  );
}

function PickButton({
  label,
  mark,
  active,
  disabled,
  onClick,
}: {
  label: string;
  mark: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`px-3 py-2.5 min-h-[44px] border font-mono text-[11px] tracking-[0.2em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? "border-gold bg-gold text-navy"
          : "border-gold/40 text-bone hover:border-gold hover:bg-gold/10"
      }`}
    >
      <span className="block">{label}</span>
      <span className="block text-[8px] opacity-60 mt-1 tracking-[0.15em]">
        {mark}
      </span>
    </button>
  );
}
