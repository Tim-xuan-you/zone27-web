"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import RecentSims from "@/components/RecentSims";
import { matches } from "@/lib/matches";

// ── /lab · Live AI Laboratory ──────────────────────────
// 從 v0.10 起,核心模擬 UI 抽到 components/MatchSimulator,
// 這頁只保留 Hero + 比賽選擇器 + 方法論。
// ─────────────────────────────────────────────────────

export default function LabPage() {
  const [matchId, setMatchId] = useState(matches[0].id);
  const match = matches.find((m) => m.id === matchId)!;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="lab" />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.35em]">
          <span className="text-gold">LIVE AI LABORATORY</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            v0.3 · REAL AT-BAT + REPLAY
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          親眼看
          <span className="text-gold">演算法</span>
          跑。
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed text-base">
          每場虛擬比賽都是{" "}
          <span className="font-mono text-gold/80">逐打席</span>
          模擬:9 局、27 個出局數、滿壘保送會推進跑者。
          選一場 CPBL 比賽,按下執行,看 10,000 次模擬如何在
          兩秒內從亂數收斂成穩定的勝率分布 — 再按 REPLAY 看一場 9 局文字直播。
        </p>
      </section>

      {/* ── MATCH SELECTOR ───────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-8">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / 01 · SELECT A MATCHUP
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {matches.map((m) => {
            const active = m.id === matchId;
            return (
              <button
                key={m.id}
                onClick={() => setMatchId(m.id)}
                className={`text-left p-4 border transition-colors ${
                  active
                    ? "border-gold bg-gold/10 text-bone"
                    : "border-line/60 text-mute hover:border-gold/40 hover:text-bone"
                }`}
              >
                <p className="text-base font-light leading-tight">
                  {m.home.name}
                </p>
                <p className="font-mono text-[10px] text-mute tracking-[0.2em] my-1">
                  VS
                </p>
                <p className="text-base font-light leading-tight">
                  {m.away.name}
                </p>
                <p className="font-mono text-[10px] text-gold/70 tabular mt-3 tracking-[0.2em]">
                  HISTORICAL · {m.home.winRate}% / {m.away.winRate}%
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── THE SIMULATOR (shared component) ─────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-12">
        <MatchSimulator key={match.id} match={match} />
      </section>

      {/* ── CUSTOM MODE CTA ──────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-16">
        <Link
          href="/lab/custom"
          className="block bg-slate/40 border border-gold/30 hover:border-gold/70 transition-colors p-6 sm:p-8 group"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-2">
                POWER USER · CUSTOM MODE
              </p>
              <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight">
                想自己當總教練?
              </h3>
              <p className="text-mute text-sm mt-2 max-w-xl">
                輸入任意兩位投手的 K/9 · BB/9 · HR/9,引擎會即時構造一場
                全新虛擬比賽。「3000 三振王」對「火球菜鳥」?一鍵就跑。
              </p>
            </div>
            <span className="font-mono text-gold text-xs tracking-[0.3em] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
              TRY CUSTOM MATCHUP →
            </span>
          </div>
        </Link>
      </section>

      {/* ── RECENT SIMS (local history) ──────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10">
        <RecentSims />
      </section>

      {/* ── METHODOLOGY NOTE ─────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-12">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / METHODOLOGY · v0.2 — REAL AT-BAT
        </p>
        <div className="space-y-4 text-mute text-sm leading-relaxed">
          <p>
            v0.2 引擎升級為
            <strong className="text-bone">逐打席對決模型</strong>。
            每個打席依該投手的 K/9 · BB/9 · HR/9 推導出 8 種互斥結果
            (K · BB · HR · 1B · 2B · 3B · GO · FO)的機率,滾亂數選一個,
            執行對應的壘上推進物理(滿壘保送強制得分、二壘安打 + 一壘跑者
            50% 機率回本壘等),累計分數與出局數。
          </p>
          <p>
            一場虛擬比賽需要模擬約{" "}
            <strong className="text-bone">70 個打席</strong>(9 局 ×
            約 8 次半局打席)。10,000 場 = 約 70 萬次亂數採樣,全部在
            瀏覽器端執行,&lt; 2 秒收斂。
          </p>
          <p>
            <strong className="text-bone">下一站 v0.3:</strong>
            加入打者個別進階數據 (OPS / wRC+ / Platoon Splits) 細化結果機率;
            v0.4 接上 Trackman 球速 + 轉軸的物理先驗。
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
