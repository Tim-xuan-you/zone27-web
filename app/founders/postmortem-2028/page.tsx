import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";

export const metadata: Metadata = {
  title: "Postmortem 2028 · ZONE 27 失敗 obituary written 2 years before · Premortem(Klein 1998)",
  description:
    "Premortem (Klein 1998 + HBR 2007) prospective hindsight 應用 · Tim 親手 first-person past-tense 寫 2028-05-26 ZONE 27 5 種最可能 die-by 失敗劇本 · 每 scenario 含 failure narrative + early-warning signal + canary fire trigger · 同 /audit S05 PRE-COMMIT clause + /steelman 5 objections 平行 pratfall surface · 6th publish-weakness artifact · 不藏未來可能 die 的方式 · 若 5 個 scenarios 全 2028-05-26 前未 fire · ZONE 27 survived · 若 1 個 fire · 此 page 變 receipt · brand IP「方法公開」 axiom 延伸到 prospective-failure 層 · 結構性 LINE 老師 / 報馬仔 永遠無法 ship 此 page(他們不公佈失敗劇本 · 也不 commit 給 failure 預測)。",
  openGraph: {
    title: "Postmortem 2028 · ZONE 27 失敗 obituary",
    description:
      "Tim 親手 2028 失敗劇本 · Premortem Klein 1998 + HBR 2007 prospective hindsight · 5 scenarios + 早期 warning signal + canary fire trigger · pratfall 6th surface",
    type: "article",
    url: "/founders/postmortem-2028",
  },
  twitter: {
    card: "summary_large_image",
    title: "Postmortem 2028 · ZONE 27 失敗 obituary",
    description:
      "Tim 親手 2028 失敗劇本 · Premortem Klein 1998 + HBR 2007 · 5 scenarios + 早期 warning · pratfall 6th",
  },
  alternates: {
    canonical: "/founders/postmortem-2028",
  },
};

// ── ZONE 27 · /founders/postmortem-2028 · Premortem Artifact ────────
// R140 W6 · Agent C R140 TOP psychology recommendation · Premortem
// (Klein 1998「Sources of Power」 ch.7 · HBR 2007「Performing a Project
// Premortem」)· prospective hindsight(Mitchell/Russo/Pennington 1989
// JBDM 2(1):25-38)· 假設 project HAS already failed 2 years from now ·
// 寫 obituary · 30% better ability to identify failure causes vs forward-
// looking risk analysis · 因為 converts ambiguous future risk(System 2
// effortful)to concrete past narrative(System 1 fluent)。
//
// brand IP fit · 6th Pratfall surface · 平行於:
//   - /audit EXCLUDE(model limits)
//   - /methodology LIMITS(technical bounds)
//   - /roadmap BOUNDARIES(scope refused)
//   - /track-record DIVERGED(receipt misses)
//   - /steelman(external objections)
//   - /founders/postmortem-2028(Tim's own obituary · THIS file)
//
// 結構性 LINE 老師 / 報馬仔 永遠無法 ship 此 page · 他們 business model
// 要求 perpetual confidence · ZONE 27 公開 own obituary = brand 信任 act
// that competitors CANNOT mimic · same Costly Signaling 100× axiom as
// /audit S05 PRE-COMMIT 第一筆 DIVERGED 處理規則。
//
// 不做 anti-pattern:
//   ✕ NO「我們不會失敗」 perpetual-confidence framing(會 trigger reactance)
//   ✕ NO「failure 可能性低 · 但我們已 plan B」 marketing-hedge(undermines pratfall)
//   ✕ NO「您訂閱可降低 failure 概率」 implicit pressure(violates「不 dark pattern」)
//   ✕ NO「failure 後 refund 條款」 transactional escape(violates identity-not-features)
//
// 若 5 個 scenarios 全 2028-05-26 前未 fire · ZONE 27 survived · 此 page
// 變 historical artifact。 若 1 個 fire · 此 page 變 self-fulfilled receipt
// · 同 R130 W-CRITICAL 「自己 introduced 自己 fixed」 + R135 W1「broken anchor
// silent」 + R139 W2「賽事討論室 brand IP contradiction」 cumulative「不藏
// mistake」 axiom 物理 codify to prospective-failure 層。
// ─────────────────────────────────────────────────────

const PUBLISHED_DATE = "2026-05-26";
const PROSPECTIVE_DATE = "2028-05-26";

type Scenario = {
  no: string;
  enKicker: string;
  zhTitle: string;
  narrative: string;
  signal: string;
  canary: string;
};

const SCENARIOS: Scenario[] = [
  {
    no: "01",
    enKicker: "SUSTAINABILITY COLLAPSE",
    zhTitle: "Tim burnout · 親手 reply 270 人 + 每週工程筆記 不可 sustain",
    narrative:
      "我在 Q2 2027 開始 ship 速度減半。 Founders 27 全 270 個都已 onboarded · 但每週寫工程筆記 + reply /hey-tim + ingest CPBL + maintain calibration 全棧 solo 撐不住。 一開始我以為再 push 一下就好。 接著我開始略過某些週的工程筆記 · 然後 /hey-tim reply 從 24hr 變 72hr 變一週。 BLACK CARD 訂戶看到 cadence 降質 · 不續訂下季。 2027 Q4 · 我發現 sustaining velocity 是 brand model 的 hidden constraint · 不是 nice-to-have。",
    signal:
      "WATCHING · 每週工程筆記延遲 ≥ 3 天 · /hey-tim reply median ≥ 48 hr · /now journal 連續 2 週空 update。",
    canary:
      "FIRE IF · 2026-12-31 前任一指標 trigger · 立即在 /year-zero 公開 cadence-revision letter · 暫停 Founders 27 新申請 · 重 size 個人 sustainable bandwidth。",
  },
  {
    no: "02",
    enKicker: "REVENUE BRIDGE GAP",
    zhTitle: "Founders 27 售完 · BLACK CARD 季票 NT$ 1,500 無法 sustain solo 工程進度",
    narrative:
      "Founders 27 270 席位在 2027 Q1 sold out · NT$ 270,000 一次性收入入帳。 我以為這就是 break-even。 結果 BLACK CARD 季票 NT$ 1,500 conversion 比預期低 · 一年 4 季 × 100 訂戶 ≈ NT$ 600,000/年 · solo 工程 + CPBL 數據 + 客服成本超過 · 2027 年底我發現自己在補貼 · 不是 sustaining。 brand IP「engine FREE forever」 binding · 不能 monetize engine。 必須選擇:(a)放棄全職 · 兼差維持 · ship 速度 1/3 ·(b)增 Founders 27 名額 · 違反 brand IP 270 lifetime lock ·(c)加 paid features · 違反 [[feedback-zone27-paid-model-is-support-not-features]]。 三個都 hurt brand。",
    signal:
      "WATCHING · 2027 Q2 active BLACK CARD 訂戶 < 80 · 6 個月 burn rate > 6 個月 runway · Founders 27 售出 < 200 by 2027-06-30。",
    canary:
      "FIRE IF · 2027-06-30 BLACK CARD < 80 + Founders 27 < 200 · 立即在 /year-zero + /founders/ledger 公開 financial-honesty letter · 邀請 Founders 27 vote 4 個 sustaining options · 不靜默 pivot。",
  },
  {
    no: "03",
    enKicker: "ENGINE CALIBRATION DRIFT",
    zhTitle: "Engine v0.3 N=30 sample 真實跑出來 · calibration 比 v0.2 worse",
    narrative:
      "2026 Q4 · CPBL N=30 sample 累積完成。 v0.3 production ship。 結果 v0.3 calibration drift 比 v0.2 高 8 個百分點 · v0.2 在 reliability diagram 上更 close to 45° line。 我必須在 /audit S05 PRE-COMMIT 規則下 ·(a)公開 DIVERGED ratio worsening · (b)decide 是否 rollback v0.3 · (c)寫 worse-engine post-mortem。 訂戶看到 calibration 退步 · trust 動搖。 即使全 publish + 全 honest · perception damage 已造成。 ZONE 27 brand IP「方法公開」 此時 cuts both ways · transparency 是 trust 累積 axiom · 也是 trust 拆穿 axiom。",
    signal:
      "WATCHING · v0.3 first 30 finalized matches calibration drift > 5 percentage points worse than v0.2 baseline · /track-record DIVERGED ratio rising 連續 4 週。",
    canary:
      "FIRE IF · v0.3 第 30 場 calibration vs v0.2 worse · 立即在 /methodology/diff 加 v0.3 rollback rationale section · 同 R130 W-CRITICAL「自己 introduced 自己 fixed」 axiom · 不藏。",
  },
  {
    no: "04",
    enKicker: "DATA PIPELINE HALT",
    zhTitle: "CPBL 真實數據 pipeline 中斷 · Tim 手動 screenshot 不可持續",
    narrative:
      "2026 Q3 · CPBL 賽程 ramp up to 240 場/年 + 季後賽 + 台灣大賽。 我每天截 2-3 場 · 一週 14-21 場 · 一年 1000+ screenshots · 半自動 parse 也要 30 min/場。 1000+ 場 × 30 min = 500 小時/年 純 data ingest · 即一個 full-time worker 等價。 我做不下去。 自動化 cpbl.com.tw 違反 [[zone27-coverage-philosophy]]「NOT scraped」 redline。 不自動化 = 不能 sustain。 binding redline 把我 trap 在 dead end · 2027 我必須選擇:(a)違反 brand IP 開始 scraping · (b)只 ingest selected 重大場次 · (c)放棄 daily ingestion claim。 三個都 hurt brand。",
    signal:
      "WATCHING · 每週 ingested 場次 < scheduled 場次 80% · /track-record N 累積速度 < 1 場/天 · Tim ingest 時間佔每日工作時 > 40%。",
    canary:
      "FIRE IF · 2026-10-31 前連續 3 週 ingestion < 80% · 立即在 /coverage 公開 selected-not-all framing letter · 不靜默 reduce scope · 同 /audit S05 30-day 提前公告 protocol。",
  },
  {
    no: "05",
    enKicker: "STEALTH MODE BROKEN",
    zhTitle: "premature SEO / social launch · 半成品 imprint 第一印象 dilutes positioning",
    narrative:
      "2026 Q4 · 我 panic-launched SEO 因為 Founders 27 conversion 比預期慢。 sitemap.xml ship · Google Search Console 解封 · IG / Threads 帳號 register · 寫了 launch 文。 結果第一波流量在還沒準備好的狀態下湧入。 visitors 看到的 N=15 calibration sample · v0.2 engine · 0 真實付費 receipts · 半成品 imprint 永久記憶體。 之後 ship 真的成熟版 · 第一印象 already imprinted · positioning damaged。 [[feedback-zone27-domain-deferred]] memory canonical 我自己 break · 同 R138 W2「明天再做 / TapPay 訂閱」 stale-promise pattern + R139 W2「賽事討論室」 brand IP contradiction · 我自己 introduced 自己 trapped。",
    signal:
      "WATCHING · Tim 主動提「我們現在 launch 吧」 vs binding [[feedback-no-rest-zone27]] + AGENTS.md SEO frozen rule · self-detected impatience signal · 訪客 unique visitors 突然 spike 50%+ 無 explainable source。",
    canary:
      "FIRE IF · 任何 SEO / social account / sitemap action 在 5 個 sustainability gate 全綠 之前 trigger · 立即在 /transparency 公開 premature-launch self-correction letter · 暫停 promotion · 同 R130 + R135 + R139「自己 catch」 cumulative axiom。",
  },
];

export default function PostmortemPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/founders"
              className="hover:text-gold transition-colors"
            >
              FOUNDERS
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">POSTMORTEM 2028</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-10">
          <p
            lang="en"
            className="font-mono text-loss/85 text-[10px] tracking-[0.45em] mb-6"
          >
            POSTMORTEM · DATED {PROSPECTIVE_DATE} · WRITTEN {PUBLISHED_DATE}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight text-bone">
            ZONE 27 失敗{" "}
            <span className="text-loss/85">obituary</span> · 寫在它 die 之前{" "}
            <span className="text-gold">2 年</span>
          </h1>
          <div className="zone27-rule max-w-[320px] mt-5" aria-hidden="true" />
          <p className="text-mute text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
            這份 obituary 假設今天是 2028-05-26 · ZONE 27 已 die · 我用過去
            式寫 5 個最可能 die 的方式。 不是預測 · 不是擔心 · 是
            <strong className="text-bone">prospective hindsight</strong>(Klein
            1998「Sources of Power」 ch.7 · HBR 2007「Performing a Project
            Premortem」)· 一個 30% 更 effective 的 failure-cause identification
            method · 因為 converts ambiguous future risk(System 2 effortful)
            to concrete past narrative(System 1 fluent)。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={7} />
          </div>
        </section>

        {/* ── WHY THIS EXISTS ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 為什麼 ship 此 page · WHY THIS EXISTS
          </p>
          <div className="space-y-4 zh-body text-mute text-base leading-relaxed">
            <p>
              每一個 Taiwan tipster / LINE 老師 / 報馬仔 都 claim 自己永遠會
              贏。 他們 business model 要求{" "}
              <strong className="text-bone">perpetual confidence</strong>。
              他們結構性無法 ship 此 page。 ZONE 27 brand IP 倒過來 ·{" "}
              <strong className="text-bone">公開 own obituary</strong> = trust
              signal that competitors CANNOT mimic · 同 Costly Signaling
              (Spence 1973)100× axiom。
            </p>
            <p>
              此 page 是 ZONE 27 第 6 個 Pratfall surface · 平行於 /audit
              EXCLUDE + /methodology LIMITS + /roadmap BOUNDARIES + /track-record
              DIVERGED + /steelman · per
              {" "}
              <Link
                href="/audit#section-05"
                className="text-gold underline-offset-4 hover:underline"
              >
                /audit Section 05 PRE-COMMIT
              </Link>
              {" "}
              clause append-only · 一旦 ship 30 天前公告於 /changelog 才可 modify。
            </p>
            <p>
              若 5 個 scenarios 全 2028-05-26 前未 fire ·{" "}
              <strong className="text-bone">ZONE 27 survived</strong> · 此 page
              變 historical artifact。 若 1 個 fire ·{" "}
              <strong className="text-bone">此 page 變 self-fulfilled receipt</strong>
              · 我 anticipate 對了 · 但 anticipating 不能 save the project ·
              brand IP「不藏 mistake」 axiom 物理 codify to prospective-failure 層。
            </p>
          </div>
        </section>

        {/* ── 5 SCENARIOS ────────────────────────── */}
        {SCENARIOS.map((s) => (
          <ScenarioSection key={s.no} scenario={s} />
        ))}

        {/* ── CANARY SUMMARY ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-loss/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / CANARY SUMMARY · 早期 warning watchlist
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            ZONE 27 倖存 IF 以下 5 個指標 全 2028-05-26 前未 fire
          </h2>
          <ol className="space-y-3 text-mute text-sm leading-relaxed list-decimal pl-6">
            {SCENARIOS.map((s) => (
              <li key={s.no} className="leading-relaxed">
                <strong className="text-bone">#{s.no} · {s.enKicker}</strong>
                {" · "}
                {s.canary}
              </li>
            ))}
          </ol>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed mt-6">
            本 5 scenarios + canary triggers binding append-only · 修改任一條
            需 30 天前 /changelog 公告 · 同 /audit S05 PRE-COMMIT discipline
            · 不能 retroactively soften 或 remove scenario。
          </p>
        </section>

        {/* ── CROSS LINKS ────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / RELATED PRATFALL SURFACES · 5 sibling artifacts
          </p>
          <ul className="space-y-2 text-mute text-sm leading-relaxed">
            <li>
              <Link
                href="/audit"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /audit EXCLUDE
              </Link>
              {" · model limits + sample debt + estimation disclosure"}
            </li>
            <li>
              <Link
                href="/methodology"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /methodology LIMITS
              </Link>
              {" · technical bounds + N≥30 SAMPLE DEBT explicit"}
            </li>
            <li>
              <Link
                href="/roadmap"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /roadmap BOUNDARIES
              </Link>
              {" · scope refused + LOCKED / EXPLORING / BRAND BOUNDARIES"}
            </li>
            <li>
              <Link
                href="/track-record"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /track-record DIVERGED
              </Link>
              {" · receipt misses equal weight as PROVED"}
            </li>
            <li>
              <Link
                href="/steelman"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /steelman
              </Link>
              {" · 5 strongest external objections wrote first"}
            </li>
          </ul>
        </section>

        <FounderSignOff signedAt={PUBLISHED_DATE}>
          這份 obituary 不是預測。 是 commitment 不藏未來可能 die 的方式。
          若您 read 完仍想加入 Founders 27 · 您 know what 您 sign up for。
          若您 read 完選擇 walk away · 我 thank 您 for the honest 評估 ·
          不會 retarget · 不會 email · 不會 push。
        </FounderSignOff>

        <Footer />
      </main>
    </div>
  );
}

function ScenarioSection({ scenario: s }: { scenario: Scenario }) {
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40 scroll-mt-20" id={`scenario-${s.no}`}>
      <div className="flex items-baseline gap-4 mb-3">
        <span className="font-mono text-loss/85 text-[10px] tabular tracking-[0.4em]">
          #{s.no}
        </span>
        <h2
          lang="en"
          className="font-mono text-bone text-[11px] tracking-[0.35em]"
        >
          {s.enKicker}
        </h2>
      </div>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight mb-6">
        {s.zhTitle}
      </h3>

      <p
        lang="en"
        className="font-mono text-mute/80 text-[10px] tracking-[0.3em] mb-2"
      >
        OBITUARY · first-person past-tense
      </p>
      <p className="zh-body text-mute text-base leading-relaxed mb-6">
        {s.narrative}
      </p>

      <div className="border-l-2 border-loss/40 pl-4 sm:pl-5 py-2 mb-4 bg-loss/5">
        <p
          lang="en"
          className="font-mono text-loss/85 text-[9px] tracking-[0.3em] mb-1"
        >
          EARLY-WARNING SIGNAL · currently watching
        </p>
        <p className="text-mute text-sm leading-relaxed">{s.signal}</p>
      </div>

      <div className="border-l-2 border-gold/60 pl-4 sm:pl-5 py-2 bg-gold/5">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[9px] tracking-[0.3em] mb-1"
        >
          CANARY FIRE TRIGGER · what I will do
        </p>
        <p className="text-mute text-sm leading-relaxed">{s.canary}</p>
      </div>
    </section>
  );
}
