import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";
import RelatedReading from "@/components/RelatedReading";
import { getFinalizedMatches } from "@/lib/matches";
import { LAST_SHIPPED_DATE_ISO } from "@/lib/last-shipped";

export const metadata: Metadata = {
  title: "首五分鐘 · 5 receipts of Tim's craft · ZONE 27",
  description:
    "ZONE 27 onboarding · 5 個獨立 trust artifact · 不是 wizard · 不是 progress bar · 每 step 是 Tim 親手 ship 的 receipt · 您 5 分鐘看完 = 您已 verified ZONE 27 不是 LINE 老師 · 倒置 SaaS marketing。",
};

// ── R69 W-A · Founders 27 First-Five-Minutes Onboarding ──
// Agent A R68 SHIP 1 deferred · Linear command-palette tour +
// Superhuman 30-min concierge compressed to 5 self-paced steps + Notion
// template gallery first-paint pattern。 NOT a wizard · NOT a modal ·
// NOT a progress bar · NOT a streak。 5 stacked trust-artifact sections ·
// 每 step 是 existing public artifact 的 inline preview + cross-link。
//
// brand IP triple-fire:
//   - per [[zone27-disclosure-philosophy]] · 5 steps 全 cross-link 公開
//     artifact · 訪客 5 分鐘看完 = 親自 verified 不是 LINE 老師
//   - per [[feedback-zone27-pratfall-brand-ip]] · STEP 04 強迫 visitor
//     看 DIVERGED grid · 不只 PROVED · 同 /track-record 公開戰績 axiom
//   - per [[feedback-zone27-audience-fans-not-engineers]] · STEP 03
//     用 fan-grammar「您 vote 哪 lens 對今晚最 matter」 · NOT engineer
//     wizard「config your dashboard」
//   - per 「不打擾就是禮物」 · 不是 modal · 不是 scroll-lock · 不是
//     forced sequence · 每 step 可 skip · 5 段獨立 readable
//
// 不做 anti-pattern(per Agent A SHIP 1 redline check):
//   ✕ no progress bar percent("3/5 completed!")· streak farming redline
//   ✕ no confetti animation · brand IP「不慶祝 N=1」 axiom
//   ✕ no badge unlock("you've earned EXPLORER badge")· engagement redline
//   ✕ no required sequence · each step independently completable
//   ✕ no time-pressure countdown("complete in 5 min!")· brand-pure restraint
//
// Placement:
//   - Cmd-K palette entry「首五分鐘」 group「入門」 · power-user discoverable
//   - Footer ENTRY column · 訪客 F-pattern scan 看到
//   - /faq「我新來 · 從哪開始」 entry cross-link
//   - /auth/callback?welcome=true 成功登入後可 redirect 來這(future)
// ─────────────────────────────────────────────────────

export default async function FirstFiveMinutesPage() {
  const finalized = await getFinalizedMatches();
  const provedCount = finalized.filter(
    (m) =>
      m.finalResult &&
      m.finalResult.winner !== "tie" &&
      ((m.home.winRate > m.away.winRate &&
        m.finalResult.winner === "home") ||
        (m.away.winRate > m.home.winRate &&
          m.finalResult.winner === "away")),
  ).length;
  const divergedCount = finalized.filter(
    (m) =>
      m.finalResult &&
      m.finalResult.winner !== "tie" &&
      ((m.home.winRate > m.away.winRate &&
        m.finalResult.winner === "away") ||
        (m.away.winRate > m.home.winRate &&
          m.finalResult.winner === "home")),
  ).length;
  // R70 W-G · Agent B audit F11 fix · PUSH count(ties · 50/50 no-favorite)·
  // canonical /track-record + /calibration surface this · 不藏 PUSH cases ·
  // disclosure-parity discipline · 同 Engine Lineup R41 W-A precedent。
  const pushCount = finalized.filter(
    (m) =>
      m.finalResult &&
      (m.finalResult.winner === "tie" || m.home.winRate === m.away.winRate),
  ).length;
  const totalN = finalized.length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/founders"
              className="hover:text-gold transition-colors"
            >
              FOUNDERS 27
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">FIRST FIVE MINUTES</span>
          </div>
        </section>

        {/* ── HERO ──────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            ZONE 27 ONBOARDING · 5 RECEIPTS OF TIM&apos;S CRAFT
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight">
            首五分鐘 ·{" "}
            <span className="text-gold">親自 verify 我們不是 LINE 老師</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed text-base sm:text-lg">
            這不是 wizard · 不是 progress bar · 不是 5-step setup form。{" "}
            <strong className="text-bone">
              是 5 個獨立 trust artifact 的 inline preview
            </strong>{" "}
            · 每 step 是 Tim 親手 ship 的 receipt · 您讀完一個 step =
            您看到一個 brand-pure 不可偽造的證據。
          </p>
          <p className="mt-3 text-mute/85 text-sm leading-relaxed">
            ⚓ 不要求 click sequence · 不要求完成度 · 您看 STEP 03 後關掉也
            OK · 每 step 是 standalone artifact · 訪客 own pace 物理 codify。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── STEP 01 · RUN ────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6">
            <p className="font-mono text-gold/85 text-[10px] sm:text-[11px] tracking-[0.4em] mb-3">
              / STEP 01 · RUN · 您先親手跑一場模擬
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
              10,000 場 Monte Carlo · 您 browser 跑 ·{" "}
              <span className="text-gold">~2 秒收斂</span>
            </h2>
            <p className="text-mute leading-relaxed mb-4">
              ZONE 27 引擎 v0.2 · 逐打席 Monte Carlo · 100%{" "}
              <strong className="text-bone">您裝置內計算</strong> · 0 server
              call · 0 結果預先計算 · 您 refresh 跑 1 次 / 跑 100 次 都同樣
              受 LLM-incompliable 引擎 deterministic · 您可以親眼 verify
              (DevTools Network 看 0 prediction request)。
            </p>
            <div className="bg-slate/30 border border-line/40 px-4 py-3 mb-4">
              <p className="font-mono text-mute/85 text-xs leading-relaxed">
                ⚓ 1 個 Pitcher matchup · 1 場 simulation · 10,000 個 outcomes ·
                您 see distribution + most-likely score band + tail risk · NOT
                「老師明牌」 · NOT 推薦下注 · per /transparency 02 NEVER list。
              </p>
            </div>
            <Link
              href="/lab"
              className="inline-block px-5 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              開 /lab → 跑一場 →
            </Link>
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-3">
              ▸ STEP 02 不需要您跑完 step 01 · 直接往下看
            </p>
          </div>
        </section>

        {/* ── STEP 02 · READ ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6">
            <p className="font-mono text-gold/85 text-[10px] sm:text-[11px] tracking-[0.4em] mb-3">
              / STEP 02 · READ · 看 Tim 這週 ship 什麼
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
              /now journal · craft 在當下 ·{" "}
              <span className="text-gold">last shipped {LAST_SHIPPED_DATE_ISO}</span>
            </h2>
            <p className="text-mute leading-relaxed mb-4">
              ZONE 27 不寫 marketing blog · 寫{" "}
              <strong className="text-bone">/now journal</strong> · 每次 ship
              一個 wave Tim 在 /now 親手記錄 what / why / what&apos;s not yet。
              不是「coming soon」 · 不是「Q3 roadmap」 · 是{" "}
              <strong className="text-bone">已經 ship 的 commit</strong>
              {" "}+ <strong className="text-bone">還沒解決的 friction</strong>。
            </p>
            <div className="bg-slate/30 border-l-2 border-gold/40 px-4 py-3 mb-4">
              <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-2">
                ⚓ /now journal grammar
              </p>
              <p className="text-mute text-sm leading-relaxed">
                <strong className="text-bone">SHIPPED THIS CYCLE</strong>{" "}
                section · 過去 30 天每 wave 有 entry · 加 commit hash · per /audit
                S05 binding 30-day cadence promise · 違反 = brand 信用 collapse。
              </p>
            </div>
            <Link
              href="/now"
              className="inline-block px-5 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              開 /now → 看本週 ship →
            </Link>
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-3">
              ▸ 同 Stratechery weekly · Defector monthly · The Athletic daily ·
              ZONE 27「有東西可以說的時候才更新」 不承諾節奏
            </p>
          </div>
        </section>

        {/* ── STEP 03 · VOTE ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6">
            <p className="font-mono text-gold/85 text-[10px] sm:text-[11px] tracking-[0.4em] mb-3">
              / STEP 03 · VOTE · 您 1-tap lens-focus
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
              6 個 lens · 您先 pick{" "}
              <span className="text-gold">哪個對今晚這場最 matter</span>
            </h2>
            <p className="text-mute leading-relaxed mb-4">
              ZONE 27 /matches/[gameId] 每場有{" "}
              <strong className="text-bone">7 個獨立 analytical lens</strong>
              (vibe / park / workload / underdog / bullpen / matchup + lens trace)·
              您 explore 之前 1-tap pick 哪個您認為最 matter · per Cialdini
              commitment-consistency · 您 reading 帶 own bet mentally active ·
              比 cold scroll 更有 ownership。
            </p>
            <div className="bg-slate/30 border-l-2 border-gold/40 px-4 py-3 mb-4">
              <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-2">
                ⚓ 不是 leaderboard · 不是 social proof
              </p>
              <p className="text-mute text-sm leading-relaxed">
                您 vote 純您裝置(localStorage zone27_lens_focus_votes_v1 ·
                per /audit S06 9th key 公開)· 0 server / 0 PII / 0「X% voters
                chose park factor」 live feed · ZONE 27 不藏 「不做」 anti-
                pattern · 您 see 沒有 social proof = 您 see brand IP discipline。
              </p>
            </div>
            <Link
              href="/matches/cpbl-260521-01"
              className="inline-block px-5 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              開 /matches/cpbl-260521-01 → vote →
            </Link>
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-3">
              ▸ vote 完看 7-lens canvas · 對照 your bet vs reading 體驗 ·
              IKEA effect 物理 codify
            </p>
          </div>
        </section>

        {/* ── STEP 04 · AUDIT ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6">
            <p className="font-mono text-gold/85 text-[10px] sm:text-[11px] tracking-[0.4em] mb-3">
              / STEP 04 · AUDIT · 看引擎 PROVED + DIVERGED 等大
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
              /track-record · 公開戰績 ledger ·{" "}
              <span className="text-gold">N={totalN} 不藏</span>
            </h2>
            <p className="text-mute leading-relaxed mb-4">
              ZONE 27 每場真實 CPBL 賽事 ingest · 公開 engine prediction +
              actual result + verdict(PROVED ✓ / DIVERGED ✕)。 不 backfill
              歷史 · 不 cherry-pick 言中場次 · per /audit S05 PRE-COMMIT
              clause:第一筆 cpbl-260521-01 永久 pinned 1st Edition ·{" "}
              <strong className="text-bone">每場 DIVERGED 跟 PROVED 同視覺權重</strong>。
            </p>
            <div className="bg-slate/30 border border-line/40 px-5 py-4 mb-4">
              <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-3">
                ⚓ 目前 ledger state
              </p>
              <ul className="space-y-2 text-mute text-sm">
                <li className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span>
                    <strong className="text-bone">N total finalized</strong>
                  </span>
                  <span className="font-mono text-bone tabular">{totalN}</span>
                </li>
                <li className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span>
                    <strong className="text-gold">PROVED ✓</strong> ·
                    引擎言中
                  </span>
                  <span className="font-mono text-gold tabular">
                    {provedCount}
                  </span>
                </li>
                <li className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span>
                    <strong className="text-loss">DIVERGED ✕</strong> ·
                    引擎落空(brand IP 同視覺權重 surface)
                  </span>
                  <span className="font-mono text-loss tabular">
                    {divergedCount}
                  </span>
                </li>
                {pushCount > 0 && (
                  <li className="flex items-baseline justify-between gap-3 flex-wrap">
                    <span>
                      <strong className="text-mute">PUSH ▪</strong> · 平局/
                      無 favorite(per /track-record disclosure parity)
                    </span>
                    <span className="font-mono text-mute tabular">
                      {pushCount}
                    </span>
                  </li>
                )}
                <li className="flex items-baseline justify-between gap-3 flex-wrap border-t border-line/40 pt-2 mt-2">
                  <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
                    ⚓ N&lt;30 = 不是 evidence · Bill James 慣例
                  </span>
                  <span className="font-mono text-mute/70 text-[10px] tabular">
                    {Math.max(0, 30 - totalN)} more to N=30
                  </span>
                </li>
              </ul>
            </div>
            <Link
              href="/track-record"
              className="inline-block px-5 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              開 /track-record → 看完整 ledger →
            </Link>
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-3">
              ▸ 同 Hindenburg Research evidence-grade citation · per
              /methodology Section 07 FOOTNOTES + R59 W-D
            </p>
          </div>
        </section>

        {/* ── STEP 05 · DECIDE ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6">
            <p className="font-mono text-gold/85 text-[10px] sm:text-[11px] tracking-[0.4em] mb-3">
              / STEP 05 · DECIDE · 您 conclude 自己
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
              3 條路 · ZONE 27 不{" "}
              <span className="text-gold">push</span>
            </h2>
            <p className="text-mute leading-relaxed mb-6">
              您讀完 STEP 01-04 = 您看到 4 個{" "}
              <strong className="text-bone">brand-pure 不可偽造</strong>{" "}
              的 trust artifact。 接下來您 own decision · ZONE 27 不{" "}
              push · 不 nag · 不 retargeting · 不 email 行銷信。 3 條路
              都 OK:
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="font-mono text-gold/70 text-xs tracking-[0.25em] tabular shrink-0 mt-0.5 w-8"
                >
                  A
                </span>
                <span className="flex-1 text-mute leading-relaxed">
                  <strong className="text-bone">關掉這個 tab</strong> · 您
                  bookmark 或 RSS subscribe(per /feed.xml)· 您 visitor 永久
                  OK · 引擎 forever FREE · per /transparency。
                </span>
              </li>
              <li className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="font-mono text-gold/70 text-xs tracking-[0.25em] tabular shrink-0 mt-0.5 w-8"
                >
                  B
                </span>
                <span className="flex-1 text-mute leading-relaxed">
                  <strong className="text-bone">留 email</strong> · 進 free
                  tier 訂閱層(per /founders WaitlistForm)· 永久免費 · 重要
                  iteration 您第一波知道 · 不寄行銷信。
                </span>
              </li>
              <li className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="font-mono text-gold/70 text-xs tracking-[0.25em] tabular shrink-0 mt-0.5 w-8"
                >
                  C
                </span>
                <span className="flex-1 text-mute leading-relaxed">
                  <strong className="text-bone">申請 Founders 27</strong> ·
                  Patek-style application(per /founders/apply)· Tim 親手
                  review 1-3 days · 通過後 NT$ 2,700 wire(終身 · 270 限量)。
                </span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/founders"
                className="inline-block px-5 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
              >
                B · 開 /founders 留 email →
              </Link>
              <Link
                href="/founders/apply"
                className="inline-block px-5 py-2.5 border border-gold/40 bg-gold/10 text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy hover:border-gold transition-colors"
              >
                C · 開 /founders/apply 申請 →
              </Link>
            </div>
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-6">
              ▸ A 路徑(關掉 tab)在 ZONE 27 是 brand-pure 結果 · 不是失敗 ·
              per 「不打擾就是禮物」 axiom · 您讀完離開 = 您看到我們不
              push = trust earned
            </p>
          </div>
        </section>

        {/* ── ENGINE STAMP ────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 text-center">
          <div className="inline-block border-t border-line/40 pt-4">
            <EngineStamp />
          </div>
        </section>

        {/* ── FOUNDER SIGN-OFF ─────────────────────── */}
        <FounderSignOff signedAt="2026-05-23">
          <p>
            5 個 step · 每個都是{" "}
            <strong>您可以親自 verify 的 receipt</strong>。 不是 marketing
            promise · 不是「我 promise 我們很 good」 · 是「您 open DevTools
            看 0 prediction request · 您 open GitHub commit history 看 R67
            真實 commit · 您 open /track-record 看 N=1 真實 verdict」。
          </p>
          <p>
            為什麼這樣設計?因為{" "}
            <strong>玩運彩 + 報馬仔 沒有一頁可以這樣公開</strong>。 他們
            的 brand 結構性無法 ship 同 page · 您 click step 01 跑 10K
            simulation · 您 own 計算 · 您 audit 戰績 · 您 conclude 自己。
          </p>
          <p>
            如果您 conclude「ZONE 27 不適合我」 · 我 100% accept · 關掉 tab
            是 brand-pure 結果。 如果您 conclude 想成為 Founder ·{" "}
            <strong>那是您 conclude · 不是我 sell</strong>。
          </p>
        </FounderSignOff>

        {/* ── RELATED READING ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <RelatedReading currentPath="/founders/first-five-minutes" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
