"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import RecentSims from "@/components/RecentSims";
import EngineFreeBrandBlock from "@/components/EngineFreeBrandBlock";
import StatTerm from "@/components/StatTerm";
import { matches } from "@/lib/matches";

// ── /lab · Live AI Laboratory ──────────────────────────
// 從 v0.10 起,核心模擬 UI 抽到 components/MatchSimulator,
// 這頁只保留 Hero + 比賽選擇器 + 方法論。
// ─────────────────────────────────────────────────────

export default function LabPage() {
  // Defense: matches.length === 0 case (lib/matches.ts in migration).
  // Hooks must be called unconditionally — useState gets a stable empty
  // string fallback, then we guard on match below.
  const initialId = matches[0]?.id ?? "";
  const [matchId, setMatchId] = useState(initialId);
  const match = matches.find((m) => m.id === matchId);

  if (!match) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Nav active="lab" />
        <main id="main">
          <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
            <p
              lang="en"
              className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-8"
            >
              ENGINE READY · NO MATCHES LOADED
            </p>
            <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
              範例賽事尚未排定
            </h1>
            <p className="mt-8 text-mute leading-relaxed max-w-md mx-auto">
              範例 CPBL 比賽資料目前不可用 · 您仍可從以下三條路理解引擎:
            </p>

            {/* Round 51 W-B · Agent 3 CRITICAL #1+#2 fix · empty state 從
                單一 power-user dead-end ship 3-card grid · 訪客 fan
                first-visit 不會卡在 power-user form · 同時 surface
                /methodology 工程白皮書 + /track-record 公開戰績 credibility
                anchor。 */}
            <div className="grid sm:grid-cols-3 gap-3 mt-10 max-w-2xl mx-auto">
              <Link
                href="/methodology"
                className="block p-5 border border-line/60 hover:border-gold/60 transition-colors group bg-slate/20 text-left"
              >
                <p
                  lang="en"
                  className="font-mono text-mute group-hover:text-gold text-[10px] tracking-[0.3em] mb-2 transition-colors"
                >
                  WHITEPAPER
                </p>
                <h3 className="text-base text-bone font-light leading-snug mb-1">
                  引擎怎麼運作 →
                </h3>
                <p className="font-mono text-mute/80 text-[10px] tracking-[0.2em]">
                  6 sections · 工程白皮書
                </p>
              </Link>
              <Link
                href="/track-record"
                className="block p-5 border border-line/60 hover:border-gold/60 transition-colors group bg-slate/20 text-left"
              >
                <p
                  lang="en"
                  className="font-mono text-mute group-hover:text-gold text-[10px] tracking-[0.3em] mb-2 transition-colors"
                >
                  TRACK RECORD
                </p>
                <h3 className="text-base text-bone font-light leading-snug mb-1">
                  引擎過去戰績 →
                </h3>
                <p className="font-mono text-mute/80 text-[10px] tracking-[0.2em]">
                  PROVED ✓ · DIVERGED ✕ 等大列出
                </p>
              </Link>
              <Link
                href="/lab/custom"
                className="block p-5 border border-gold/40 bg-gold/5 hover:border-gold transition-colors group text-left"
              >
                <p
                  lang="en"
                  className="font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] mb-2 transition-colors"
                >
                  POWER USER
                </p>
                <h3 className="text-base text-bone font-light leading-snug mb-1">
                  自訂任意投手 →
                </h3>
                <p className="font-mono text-mute/80 text-[10px] tracking-[0.2em]">
                  輸入 K/9 BB/9 HR/9 跑 10K sim
                </p>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="lab" />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.35em]">
          <span className="text-gold">即時 AI 實驗室</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            v0.2 · 真實打席 + 重播
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

        {/* Universal engine-free brand block — same on /lab/custom.
            Brand axiom visible at engine entry point, not buried in
            /lab/custom only. Algorithm Step 3 (SIMPLIFY): one source. */}
        <EngineFreeBrandBlock />

        {/* Round 51 W-B · Agent 3 CRITICAL #2 fix · pre-sim credibility
            anchor · 訪客 cold land /lab 不知 track-record 存在 · 跑完
            sim 才 surface(post-sim trust loop)= 太晚 · 此 hero
            single-line link 是 entry-point credibility · 「親手跑 model」
            前 surface「model 過去 receipts」 = NN/g Halo Effect ·
            訪客 trust threshold 大幅降低。 */}
        <p className="mt-6 font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.25em] text-center leading-relaxed">
          <Link
            href="/track-record"
            className="text-gold underline-offset-4 hover:underline transition-colors"
          >
            ✓ 公開戰績 · 引擎過去 PROVED / DIVERGED 等大列出 →
          </Link>
        </p>
      </section>

      {/* ── MATCH SELECTOR ───────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-8">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / 01 · 選擇比賽
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {matches.map((m) => {
            const active = m.id === matchId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMatchId(m.id)}
                className={`text-left p-4 border transition-colors duration-150 cursor-pointer ${
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
                  歷史鎖定 · {m.home.winRate}% / {m.away.winRate}%
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

      {/* ── POST-SIM TRUST LOOP ────────────────────
          Round 28 · Agent C P1.2 fix: hardcore baseball fan 跑完
          10K 收斂後,下一個 instinct 是「show me where this engine
          has been wrong」· 沒有 /track-record CTA = 高 trust visitor
          無處可去。這兩張卡完成 trust loop:看引擎跑 → 看引擎過去
          PROVED/DIVERGED 紀錄 → Founders 27。和 CUSTOM MODE CTA
          視覺上分層 · 那是「power-user 再玩」· 這是「verify the
          engine has receipts」. */}
      <section
        aria-labelledby="post-sim-trust-heading"
        className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-12"
      >
        <p
          id="post-sim-trust-heading"
          className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4"
        >
          / 引擎跑完了 · 接下來?
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/track-record"
            className="block p-5 sm:p-6 border border-line/60 hover:border-gold/60 transition-colors group bg-slate/20"
          >
            <p
              lang="en"
              className="font-mono text-mute group-hover:text-gold text-[10px] tracking-[0.35em] mb-2 transition-colors"
            >
              TRACK RECORD · 公開戰績
            </p>
            <h3 className="text-lg text-bone font-light tracking-tight mb-2">
              看引擎過去哪場 PROVED · 哪場 DIVERGED →
            </h3>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              不藏 miss · 等大列出 · sample 累積中
            </p>
          </Link>
          <Link
            href="/founders"
            className="block p-5 sm:p-6 border border-gold/40 hover:border-gold transition-colors group bg-gold/5"
          >
            <p
              lang="en"
              className="font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.35em] mb-2 transition-colors"
            >
              FOUNDERS 27 · 創始席位
            </p>
            <h3 className="text-lg text-bone font-light tracking-tight mb-2">
              引擎免費 · 270 個位置不免費 →
            </h3>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              NT$ 2,700 一次性 · 終身 · 限量
            </p>
          </Link>
        </div>
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
                進階模式 · 自訂投手
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
              自訂對戰 →
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
            每個打席依該投手的 <StatTerm term="K/9" /> · <StatTerm term="BB/9" />{" "}
            · <StatTerm term="HR/9" /> 推導出 8 種互斥結果
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
            加入打者個別進階數據 (
            <StatTerm term="OPS" /> · <StatTerm term="wRC+" />
            ) 細化結果機率(可在現有資料上路);
            v0.4(aspirational · 等 CPBL 公開 Statcast 等級資料)接上球速 + 轉軸物理先驗。
          </p>
        </div>
      </section>

      {/* Round 51 W-B · Agent 3 founder voice audit · /lab 缺 Tim signature ·
          訪客親手跑完 10K sim · founder accountability marker 增強 trust。
          One-liner mute · 不破 minimalism。 */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 text-center">
        <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em]">
          —{" "}
          <Link
            href="/about"
            className="hover:text-gold transition-colors"
            aria-label="讀 Tim 創辦人筆記"
          >
            TIM · This is where you verify everything yourself
          </Link>
        </p>
      </section>

      </main>

      <Footer />
    </div>
  );
}
