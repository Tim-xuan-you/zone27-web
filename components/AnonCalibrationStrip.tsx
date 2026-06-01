"use client";

// ── ZONE 27 · 你的戰績 strip(免登入 · 你 vs 引擎)─────────
// 把訪客自己押在這台裝置的紀錄,用「你 vs 引擎誰準」的對照呈現。
// 只在 localStorage 有 picks 時才出現(0 picks → 不 render · 不佔空間)。
//
// 鐵律:
//   - 0 個資 / 0 伺服器 / 0 cookie / 純這台裝置的瀏覽器
//   - 你押了什麼,ZONE 27 看不到(只在你瀏覽器裡算)
//   - 沒夠樣本不假裝準(N≥1 才出現 · 數字夠不夠準誠實標)
//
// 兩個版型:
//   - "calibration" · /看準度 頁的完整版(4 格 stat)
//   - "homepage"   · 首頁市場板下方的一行精簡版(回訪鉤子)
//
// SSR-safe + hydration-safe(discriminated union mount flag)。
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  readAnonPicks,
  computeAnonStats,
  type AnonPick,
} from "@/lib/anon-picks";

type Variant = "calibration" | "homepage";

type Props = {
  variant: Variant;
};

type MountState =
  | { mounted: false }
  | { mounted: true; picks: AnonPick[] };

export default function AnonCalibrationStrip({ variant }: Props) {
  const [state, setState] = useState<MountState>({ mounted: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, picks: readAnonPicks() });
  }, []);

  // SSR-safe: render nothing during SSR
  if (!state.mounted) return null;
  const { picks } = state;

  // 0 picks → 不 render(新訪客看不到 · 不佔空間)
  if (picks.length === 0) return null;

  const stats = computeAnonStats(picks);
  const decided = stats.proved + stats.diverged;
  const deltaWord =
    stats.delta > 0 ? "你領先" : stats.delta < 0 ? "你落後" : "平手";

  // ── 首頁精簡版 ────────────────────────────────────────
  if (variant === "homepage") {
    return (
      <section
        className="mx-auto max-w-3xl px-6 sm:px-10 pb-10"
        aria-label="你的戰績 · 你 vs 引擎"
      >
        <Link
          href="/calibration"
          className="block border border-gold/40 bg-slate/30 p-4 sm:p-5 hover:bg-slate/40 hover:border-gold/60 transition-colors group"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <p className="font-mono text-gold/90 text-[10px] tracking-[0.3em]">
              你的戰績 · 你 vs 引擎
            </p>
            <span className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
              只存這台裝置
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-4 flex-wrap text-sm">
            <span className="text-bone">
              押了{" "}
              <strong className="font-mono text-gold tabular text-lg">
                {stats.total}
              </strong>{" "}
              場
            </span>
            {decided > 0 && (
              <>
                <span aria-hidden="true" className="text-mute/40">·</span>
                <span className="text-mute">
                  <span className="font-mono text-gold tabular">
                    ✓{stats.proved}
                  </span>{" "}
                  <span className="font-mono text-loss/85 tabular">
                    ✕{stats.diverged}
                  </span>
                </span>
                <span aria-hidden="true" className="text-mute/40">·</span>
                <span className="text-mute">
                  你準度{" "}
                  <strong className="font-mono text-bone tabular">
                    {stats.yourAccuracyLabel}
                  </strong>
                </span>
                <span aria-hidden="true" className="text-mute/40">·</span>
                <span className="text-mute">
                  引擎{" "}
                  <strong className="font-mono text-bone tabular">
                    {stats.engineAccuracyLabel}
                  </strong>
                </span>
                {decided >= 3 && (
                  <>
                    <span aria-hidden="true" className="text-mute/40">·</span>
                    <span
                      className={
                        stats.delta > 0
                          ? "text-gold"
                          : stats.delta < 0
                          ? "text-loss/85"
                          : "text-mute"
                      }
                    >
                      {deltaWord}
                      {stats.delta !== 0 && (
                        <strong className="font-mono tabular ml-1">
                          {Math.abs(Math.round(stats.delta))} 分
                        </strong>
                      )}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
          <p className="mt-2 font-mono text-mute/70 text-[9px] tracking-[0.25em]">
            完整紀錄在看準度頁 · 你的資料永遠只在這台裝置 →
          </p>
        </Link>
      </section>
    );
  }

  // ── 看準度頁完整版 ────────────────────────────────────
  return (
    <section
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12"
      aria-label="你的戰績 · 你 vs 引擎"
    >
      <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
        / 你的戰績 · 你 vs 引擎
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3 leading-tight">
        你押的每一手 · 只存這台裝置 · <span className="text-gold">ZONE 27 看不到</span>
      </h2>
      <p className="text-mute leading-relaxed mb-6">
        這一塊只在你的瀏覽器裡算 · 你押了什麼從不會傳給 ZONE 27 · 跟上面的公開
        戰績是兩回事,不會混在一起。
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatBox
          label="總場數"
          value={String(stats.total)}
          sub={`${stats.pending} 場待開`}
          tone="bone"
        />
        <StatBox
          label="你準度"
          value={stats.yourAccuracyLabel}
          sub={decided > 0 ? `✓${stats.proved} ✕${stats.diverged}` : "還沒結算"}
          tone={stats.proved > stats.diverged ? "gold" : "bone"}
        />
        <StatBox
          label="引擎準度"
          value={stats.engineAccuracyLabel}
          sub="同樣這幾場"
          tone="mute"
        />
        <StatBox
          label="你 vs 引擎"
          value={
            decided >= 3
              ? `${stats.delta > 0 ? "+" : stats.delta < 0 ? "−" : ""}${Math.abs(
                  Math.round(stats.delta)
                )}`
              : "再幾場"
          }
          sub={decided >= 3 ? deltaWord : "至少 3 場結算"}
          tone={
            decided >= 3
              ? stats.delta > 0
                ? "gold"
                : stats.delta < 0
                ? "loss"
                : "bone"
              : "mute"
          }
        />
      </div>

      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mb-3">
        ⚓ 累積到 30 場以上有結果,這個數字才真的準 · 目前{" "}
        <strong className="text-bone">{decided}</strong> 場有結果 · 還差{" "}
        <strong className="text-bone">{Math.max(0, 30 - decided)}</strong> 場。
      </p>

      <p className="text-mute/85 text-sm leading-relaxed">
        想累積?在{" "}
        <Link
          href="/matches"
          className="text-gold underline-offset-4 hover:underline"
        >
          市場看板
        </Link>{" "}
        每場先選一邊,再看引擎怎麼想 · 不用註冊 · 不傳伺服器 · 純粹練自己的眼光。
      </p>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────

function StatBox({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "gold" | "bone" | "mute" | "loss";
}) {
  const valueColor = {
    gold: "text-gold",
    bone: "text-bone",
    mute: "text-mute",
    loss: "text-loss/85",
  }[tone];

  const borderColor = {
    gold: "border-gold/40 bg-slate/40",
    bone: "border-line/60 bg-slate/30",
    mute: "border-line/40 bg-slate/20",
    loss: "border-loss/30 bg-loss/5",
  }[tone];

  return (
    <div className={`border ${borderColor} p-3`}>
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-1">
        {label}
      </p>
      <p
        className={`font-mono tabular text-2xl sm:text-3xl tracking-tight ${valueColor}`}
      >
        {value}
      </p>
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.22em] mt-1">
        {sub}
      </p>
    </div>
  );
}
