"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import EngineGate from "@/components/EngineGate";
import RecentSims from "@/components/RecentSims";
import EngineFreeBrandBlock from "@/components/EngineFreeBrandBlock";
import { matches } from "@/lib/matches";

// ── /lab · Live AI Laboratory ──────────────────────────
// R110 W2 · Apple-style minimalism refactor per Tim 2026-05-25 mobile
// screenshot critique「頁面很雜 · 過多資訊 · 選擇太多 · 重複選項」 ·
// 解決:
//   - Match selector 10 cards → 3(filter logic: pre-game first · then
//     most recent finalized by id desc · 限制 visual clutter)
//   - 加 date chip(5/24 etc)per card · 同 team 跨日不再 looks duplicate
//   - 砍 methodology section 整段(6 paragraphs · /methodology 已存在)·
//     /lab 不該複製白皮書 content · 只該 link
//   - Hero text 縮短到 single H1 + single subtitle line · Apple-grade single-action
//   - StatTerm import removed(只用在 methodology section · 已 cut)
// 從 v0.10 起,核心模擬 UI 抽到 components/MatchSimulator,
// 這頁只保留 Hero + 比賽選擇器 + 方法論 cross-link。
// ─────────────────────────────────────────────────────

// R110 W2 · Filter matches for selector · 3 max · pre-game first · most
// recent finalized fill 剩下 slot · slice 限制 visual clutter per Apple/
// Stripe Press minimalism · 訪客 want「選個比賽 + RUN」 not「scroll 10 cards」。
const LAB_MATCHES = matches
  .slice()
  .sort((a, b) => {
    const aPre = a.finalResult ? 1 : 0;
    const bPre = b.finalResult ? 1 : 0;
    if (aPre !== bPre) return aPre - bPre;
    return b.id.localeCompare(a.id);
  })
  .slice(0, 3);

// R110 W2 · Extract MM/DD from cpbl-260524-01 id format · 同 team 不同日
// disambiguation chip。 cpbl-YYMMDD-NN → "5/24"。
function formatMatchDateChip(id: string): string {
  const m = id.match(/^cpbl-\d{2}(\d{2})(\d{2})-/);
  if (!m) return "";
  return `${parseInt(m[1], 10)}/${parseInt(m[2], 10)}`;
}

export default function LabPage() {
  // Defense: LAB_MATCHES.length === 0 case (lib/matches.ts in migration).
  // Hooks must be called unconditionally — useState gets a stable empty
  // string fallback, then we guard on match below.
  const initialId = LAB_MATCHES[0]?.id ?? "";
  const [matchId, setMatchId] = useState(initialId);
  const match = LAB_MATCHES.find((m) => m.id === matchId);

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

      {/* ── HERO · R110 W2 Apple-style minimal · 1 chip + 1 H1 + 1 subtitle line ── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <p className="font-mono text-[10px] tracking-[0.35em] mb-8 text-gold">
          即時 AI 實驗室 · v0.2
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          親眼看
          <span className="text-gold">演算法</span>
          跑。
        </h1>
        <p className="mt-6 max-w-md mx-auto text-mute leading-relaxed text-base">
          選一場 CPBL · 跑 10,000 次 Monte Carlo · &lt; 2 秒收斂。
        </p>

        {/* Universal engine-free brand block — same on /lab/custom. */}
        <EngineFreeBrandBlock />

        {/* Pre-sim credibility anchor · single-line trust link · NN/g Halo Effect。 */}
        <p className="mt-6 font-mono text-mute/85 text-[11px] sm:text-xs tracking-[0.25em] text-center">
          <Link
            href="/track-record"
            className="text-gold underline-offset-4 hover:underline transition-colors"
          >
            ✓ 公開戰績 · PROVED / DIVERGED 等大列出 →
          </Link>
        </p>
      </section>

      {/* ── MATCH SELECTOR · R110 W2 · 3 cards max · date chip 避免 same-team
          跨日 looks duplicate · per Tim mobile critique「10 cards 太多 ·
          重複的選項」 ── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-8">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
            / 01 · 選擇比賽
          </p>
          <Link
            href="/matches"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
          >
            看全部 {matches.length} 場 →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {LAB_MATCHES.map((m) => {
            const active = m.id === matchId;
            const dateChip = formatMatchDateChip(m.id);
            const isFinal = !!m.finalResult;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMatchId(m.id)}
                aria-current={active ? "true" : undefined}
                className={`relative text-left p-4 border transition-colors duration-150 cursor-pointer ${
                  active
                    ? "border-gold border-l-4 bg-gold/10 text-bone"
                    : "border-line/60 text-mute hover:border-gold/40 hover:text-bone"
                }`}
              >
                {/* R156 W1.9 · Agent E friction #4 · active selector visual
                    reinforcement · 4px left-border + 4px gold dot · 訪客 1.2s
                    識別 active state · Bloomberg Terminal selected-cell pattern。 */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold glow-gold"
                  />
                )}
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span
                    lang="en"
                    className="font-mono text-mute/80 text-[10px] tracking-[0.25em] tabular"
                  >
                    {dateChip}
                  </span>
                  {isFinal && (
                    <span
                      lang="en"
                      className="font-mono text-gold/70 text-[9px] tracking-[0.25em]"
                    >
                      ✓ FINAL
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base font-light leading-tight">
                  {m.home.name}
                </p>
                <p className="font-mono text-[9px] text-mute/70 tracking-[0.2em] my-0.5">
                  vs
                </p>
                <p className="text-sm sm:text-base font-light leading-tight">
                  {m.away.name}
                </p>
                <p className="font-mono text-[10px] text-gold/70 tabular mt-3 tracking-[0.2em]">
                  {m.home.winRate}% / {m.away.winRate}%
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* R156 W1.13 · Agent E rhythm #2 · /lab transition visual continuity ·
          subtle scroll-position cue between match selector + simulator ·
          Bloomberg Terminal panel-boundary pattern · 1-line mute orientation
          guide · brand-pure 不破 minimalism。 */}
      <p
        aria-hidden="true"
        className="text-center font-mono text-mute/40 text-[9px] tracking-[0.4em] mb-2 mt-4"
      >
        ↓ ENGINE ↓
      </p>

      {/* ── THE SIMULATOR (shared component) · R188 跑引擎要登入 ─────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-12 border-t border-gold/20 pt-8">
        <EngineGate next="/lab">
          <MatchSimulator key={match.id} match={match} />
        </EngineGate>
      </section>

      {/* ── POST-SIM TRUST LOOP ────────────────────
          Round 28 · Agent C P1.2 fix: hardcore baseball fan 跑完
          10K 收斂後,下一個 instinct 是「show me where this engine
          has been wrong」· 沒有 /track-record CTA = 高 trust visitor
          無處可去。這兩張卡完成 trust loop:看引擎跑 → 看引擎過去
          PROVED/DIVERGED 紀錄 → FOUNDER。和 CUSTOM MODE CTA
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
        {/* R160 W2.O1 · Agent O Gap 1 · 2-card → 3-card trust loop · /audit
            是 plain-language Model Report entry · Disclosure Philosophy
            canonical home(S05)· 之前 lab 跑完訪客找「why trust this output」
            必須 exit page through Cmd-K · /track-record + /audit + /founders
            three-card 完整 trust loop · per Anthropic transparency hub pattern。 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/audit"
            className="block p-5 sm:p-6 border border-line/60 hover:border-gold/60 transition-colors group bg-slate/20"
          >
            <p
              lang="en"
              className="font-mono text-mute group-hover:text-gold text-[10px] tracking-[0.35em] mb-2 transition-colors"
            >
              MODEL REPORT · /audit
            </p>
            <h3 className="text-lg text-bone font-light tracking-tight mb-2">
              方法完整公開 · 5 個章節 →
            </h3>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              引擎背後的 model card · 零行銷語言
            </p>
          </Link>
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
              PROVED · DIVERGED 等大列出 →
            </h3>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              不藏 miss · sample 累積中
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
              FOUNDER · 最高階年度
            </p>
            <h3 className="text-lg text-bone font-light tracking-tight mb-2">
              引擎免費 · 賣分析抽成全站最低 →
            </h3>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              NT$ 2,700/年 · 會員不限量 · 抽成 5%
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

      {/* ── METHODOLOGY · R110 W2 · single-line cross-link · 6-paragraph
          inline copy cut per Apple/Stripe minimalism · 白皮書本就 in
          /methodology · 不複製 ── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-10 text-center">
        <p className="font-mono text-mute text-sm leading-relaxed">
          引擎用 K/9 · BB/9 · HR/9 推 8 種打席結果 · 70 個打席 / 場 ·
          10,000 場 · 全在您的瀏覽器跑。
        </p>
        <p className="mt-4 font-mono text-gold/85 text-[10px] tracking-[0.35em]">
          <Link
            href="/methodology"
            className="underline-offset-4 hover:underline transition-colors"
          >
            完整白皮書 →
          </Link>
        </p>
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
