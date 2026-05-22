import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";

export const metadata: Metadata = {
  title: "Steelman · 反 ZONE 27 最強論證 · ZONE 27",
  description:
    "ZONE 27 自己 publish 反我們最強的 5 個論點 · Adversarial collaboration 倒置「自己當反方」 pattern · per Aronson 1966 Pratfall axiom 極限版 · skeptic 看到我們先寫了 strongest objection 就 disarmed · 玩運彩+報馬仔 永遠不會 publish steelman against themselves · 因為他們的 steelman 同時是他們的 obituary。",
};

// ── ZONE 27 · /steelman ─────────────────────────────────
// Round 42 W-A · Agent H #3 ship · per [[feedback-no-waiting-rule]] 鐵律。
//
// 5 strongest arguments against ZONE 27 · ZONE 27 自己寫 · steelman tier
// (不 strawman · 不 weakman)· 寫完 NOT 反駁 to win argument · 寫完 respond
// honest assessment + Pratfall acknowledgment + concrete commitment when
// applicable。
//
// Adversarial collaboration pattern transplant(PLOS · arXiv adversarial-
// collab protocol · Tetlock superforecaster discipline)· 倒置「自己當
// 反方」 · brand IP 物理層 maximum Pratfall(Aronson 1966 + Spence 1973):
// - reader 看到我們先 publish strongest objection 等於 disarm 99% 抗辯
// - 同時 prove brand 不 fragile to scrutiny · 真實 truth-seeking discipline
// - 玩運彩+報馬仔 結構性 not publish 同樣 page · 因為他們的 steelman
//   同時是他們的 obituary(每個 objection 都 lethal · 商業自殺)
//
// Brand IP 物理 codify:
//   - Pratfall · 極限版 · 主動 publish 反方 strongest argument
//   - Costly Signaling · steelman 寫得越好 反方 看了越覺「他們 know
//     this」 trust signal · 寫差 反方 看了覺「strawman」 反信號
//   - Disclosure Philosophy · 延伸 /audit S05 到 epistemic layer
//   - 倒置 SaaS · 「自己當批評者」 vs SaaS「自己當銷售」 倒置
//
// Routing: /steelman · public · 38th visitor-discoverable route。
// ─────────────────────────────────────────────────────

const STEELMAN_OBJECTIONS: {
  num: string;
  title: string;
  objection: string;
  response: string;
  concession: string;
}[] = [
  {
    num: "01",
    title: "Bayesian ensembles on 12-team CPBL are over-parameterized",
    objection:
      "CPBL 只有 12 隊 · 每隊每年最多 ~120 場常規賽 · 整聯盟 ~720 場/年 · 樣本量遠小於 MLB(2,430 場)或 NPB(858 場)。 v0.4 Bayesian Model Averaging across v0.2 + v0.3 votes 在這 sample size 上會過擬合 prior · noise > signal。 即使 ZONE 27 ship v0.4 · 數據量本質上無法支撐 Bayesian ensemble 的 statistical machinery。 Stats 文盲不會發現 · stats 識者一眼看出。",
    response:
      "這 critique 是對的 · 不是 wrong。 v0.4 ship 前 ZONE 27 commit:(1) per /audit S05 PRE-COMMIT · v0.4 release notes 必須 explicit「CPBL season sample = N=720/year · ensemble Brier delta vs v0.3 需 統計 significance test pass · 否則 v0.4 mark INCONCLUSIVE not LIVE」 ·(2) v0.4 weighting between v0.2 v0.3 用 hierarchical Bayes prior · 不假裝 flat prior 是 informative ·(3) full posterior predictive check published in /methodology before v0.4 LIVE。",
    concession:
      "如果 N=720 不夠支撐 v0.4 ensemble · ZONE 27 應該 wait 累積 2-3 季 sample 才 ship · 不應該 prematurely declare v0.4 LIVE 滿足「accuracy progression」 narrative。 此 critique 是 valid brand-IP constraint · 不是抹黑。",
  },
  {
    num: "02",
    title: "Park factors in Taoyuan / 新莊 / 大巨蛋 / 澄清湖 都是 small-sample noise",
    objection:
      "lib/cpbl-parks.ts 4 場館 park factor estimate · 標 ESTIMATE 沒 cite specific BPF(Basic Park Factor)data 來源。 中職一年每場館主辦 ~60 場 · ZONE 27 用「stadium dimensions + 海拔 + 公開觀察 factor」 推估 · 不是 ingest 真實 BPF。 v0.3 HR rate adjustment 用這 estimate 乘 0.5 sensitivity · 等於 small-noise × small-multiplier × small-data = 完全 noise。 v0.3 vs v0.2 Brier delta 在 N≥30 之前永遠看不到 signal。",
    response:
      "完全同意。 此 critique 寫成 commitment:(1) /audit S07 ENGINE v0.3 ESTIMATION DISCLOSURE 已寫死「estimate · derive from observable factors」 · 公開承認 not real BPF ingest ·(2) /track-record + /calibration 將分 v0.2 vs v0.3 receipts ingest · N≥30 per engine 後 Brier 對照 publish ·(3) 若 v0.3 calibration drift 比 v0.2 worse · /methodology Section 04 v0.3 row 從「LIVE」 改「INFERIOR · deprecated TBD」 · 不 silently rotate(per Lens Lifetime Pledge)·(4) 真實 CPBL park-factor 工作者(球評/sabermetrician/球隊分析師)可發 PR 修正 lib/cpbl-parks.ts data fields · 立即 swap real BPF。",
    concession:
      "v0.3 在 N≥30 per engine 之前 · honestly 是 noise + estimate + small sensitivity 的 product。 預期 short-term Brier delta vs v0.2 = 0 ± wide CI。 不假裝 v0.3 是 progress · 是 architectural commitment to expandable engine pipeline。",
  },
  {
    num: "03",
    title: "Pitcher Fatigue lens v0.1 PROXY 是 marketing dressed as engineering",
    objection:
      "PitcherFatigueLens(R38 W-A)寫「v0.1 PROXY · 用 WHIP + BB9 + K9 季累計 derive command stability」 · 但「command stability」 跟「fatigue」 是完全不同的東西。 季累計 stats 反映 season talent · 不反映「該投手 since last start 是否疲勞」。 vocabulary 「Fatigue」 = false labeling · 即使 disclaimer 寫了「不是 true fatigue」 · 訪客 default mental model 仍是「這 lens 告訴我投手疲勞嗎」 · 我們 ship 等於 利用 disclaimer 漏洞 marketing 「fatigue」 brand value。",
    response:
      "Sharp call · 接近 brand-IP violation 的邊界。 ✓ R43 W-C EXECUTED · lens naming「Pitcher Fatigue」 → 「Workload Proxy」 visible label rename ship in /matches /02C + /methodology Section 05 LensRow + PitcherFatigueLens component label · file 保留 git history。 brand-IP audit cycle 加入「lens vocabulary 與 actual data scope reconciliation」 PRE-COMMIT discipline:任何新 lens visible label 必須 match actual data scope · 不可 ship 「planned full angle 但 v0.1 partial scope」 mismatch。 若 v0.2 commit upgrade real fatigue(ingest rest_days + season_ip)持續 deferred · v0.1 Workload Proxy lens 應該 mark「待 v0.2 升 Pitcher Fatigue full angle」 status。",
    concession:
      "✓ R43 W-C concession executed · Lens naming「Fatigue」 是 marketing inheritance from Section 05 table planned-name · ship v0.1 PROXY 時應該 rename to match scope · Agent J post-R42 dogfood verify「promised rename · never executed」 surface · 修正 + 此 page 自我 update reflect execution。 此 critique 推動 vocabulary discipline 必要 audit · 是 brand-IP healthy stress test。",
  },
  {
    num: "04",
    title: "「方法公開」 transparency 是 commodity moat · 不是 differentiation",
    objection:
      "ZONE 27 通篇 「方法公開」 + GitHub link + 「我們不藏」 framing · 但所有 indie SaaS 都做 open source 或 publish methodology(FanGraphs publish glossary · Plausible publish whole codebase · Stratechery publish ethics · Defector publish ARR)。 ZONE 27「方法公開」 在 indie SaaS 場域是 commodity · 不是 moat。 真正的 moat 必須 structurally exclusive · ZONE 27 的「方法公開」 與 Plausible/Defector/Stratechery 重疊度太高 · 不是差異化。",
    response:
      "Half-true objection · 需 disentangle。 (1) ZONE 27 的 displacement target 不是 Plausible/Defector/Stratechery · 是 玩運彩+報馬仔 · 在 Taiwan baseball gambling-adjacent space 內 · 「方法公開」 仍是 structural moat(他們 publish 等於商業自殺) ·(2) 但在 global indie SaaS audience 確實 commodity · ZONE 27 應該 explicit「我們的 moat 是 incentive alignment 不是 transparency itself」 · 修正 framing in /manifesto + /ethics ·(3) 此 critique 是 brand-IP refinement opportunity:transparency 是 NECESSARY but NOT SUFFICIENT condition · 真實 moat = displacement-specific transparency(/calibration + /ethics + /membership/black-card/ledger 都是 玩運彩 結構性無法 copy 的 sub-patterns)。",
    concession:
      "「方法公開」 standalone 確實不夠 differentiation。 ZONE 27 應該升級 brand statement 到「displacement-specific transparency」 · 不是 generic open-source narrative。 此 critique 加速 brand IP maturation。",
  },
  {
    num: "05",
    title: "Pre-launch state(0 paid · NT$ 0 rev · N=1 finalized)真的是「品牌力」 還是「我們其實還沒 product-market fit」?",
    objection:
      "ZONE 27 通篇 publish 「0 paid BLACK CARD subscriber」 · 「NT$ 0 annual revenue」 · 「N=1 finalized prediction」 · 框架為 「radical transparency」 + 「Aronson 1966 Pratfall」。 但 Aronson 1966 的 finding 是「competent person + admitted mistake」 > 「competent + perfect」 · 不是「unproven + admitted unproven」 > 「unproven + claimed proven」。 ZONE 27 pre-launch state publish 是 Pratfall 還是 spinning weakness as virtue?",
    response:
      "Brutal · 但 important critique。 ZONE 27 此處的 honest assessment:(1) Aronson 1966 mechanism 確實是 competent + admitted mistake · 不是 unproven + admitted unproven ·(2) ZONE 27 pre-launch publish 0 paid 唯一有效 IFF 之後 真的 ship paying subscribers + 真的累積 finalized predictions · 否則 Pratfall mechanism collapses ·(3) 此 critique pre-commit ZONE 27 必須:Year 1(2027)at minimum N≥10 paid BLACK CARD subscribers · N≥30 finalized predictions · N≥3 Founders 27 認領。 若 Year 1 未達 · /annual/2027 必須 explicit「我們 marketed transparency 但 fail to ship product-market fit」 · 不能藏 ·(4) /annual/2026 Year 0 honest report 必須 publish 此 Year 1 binding criteria · 同 PRE-COMMIT pattern。",
    concession:
      "Pre-launch radical transparency IFF 之後真的成為 launched · 否則是「losing strategy admitted live」。 此 critique 推動 ZONE 27 必須 publish concrete 2027 sucess threshold · 不能無限 Year 0 永續。 Critique valid · concrete brand-IP commitment 生成。",
  },
];

export default function SteelmanPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / STEELMAN · 反 ZONE 27 最強論證
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-loss/60 text-loss/85"
            >
              ADVERSARIAL COLLAB · 5 OBJECTIONS
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            5 個我們<span className="text-loss">最怕</span>的論證 ·
            <br className="hidden sm:inline" />我們自己 <span className="text-gold">先寫</span>
          </h1>

          <div className="mt-8 border-l-2 border-loss/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              <strong>多數 SaaS 寫 FAQ 是預先反駁訪客可能的反對</strong> ·
              ZONE 27 反向:這頁是反 ZONE 27 最強的 5 個 argument · 我們自己
              寫成 steelman tier(不 strawman · 不 weakman)。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              寫完 NOT 反駁 to win · 寫完 honest response + concession when
              applicable。 玩運彩+報馬仔 永遠不會 publish 同樣 page · 因為他們
              的 steelman 同時是他們的 obituary。
            </p>
          </div>

          {/* Round 44 W-C · Agent K DEEPEST canonical sentence · 同 /about
              Prologue · /ethics hero · /annual hero。 */}
          <p className="mt-6 text-bone text-base sm:text-lg leading-relaxed border-l-4 border-gold pl-5 py-2 max-w-2xl">
            <strong>每一個承諾 Tim 簽名 · 可被驗證 · 違反任何一條 = <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">/ethics</Link> 紅字
            永久標 · 不可刪</strong> · 包括此 page 的 5 objections 自我 self-update
            mechanism · 同樣 binding。
          </p>

          <div className="mt-6">
            <ArticleMeta readingMin={6} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── OBJECTIONS ──────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          {STEELMAN_OBJECTIONS.map((obj, idx) => (
            <article
              key={obj.num}
              className={`pb-12 ${
                idx < STEELMAN_OBJECTIONS.length - 1
                  ? "mb-12 border-b border-line/40"
                  : ""
              }`}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  lang="en"
                  className="font-mono text-loss/85 text-[14px] tracking-[0.35em] tabular"
                >
                  ✕ {obj.num}
                </span>
                <span
                  lang="en"
                  className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
                >
                  OBJECTION
                </span>
              </div>
              <h2 className="text-bone text-2xl sm:text-3xl font-light tracking-tight mb-6 leading-tight">
                {obj.title}
              </h2>

              {/* The objection · steelman tier · render in loss-tinted block */}
              <div className="bg-loss/5 border border-loss/30 p-5 sm:p-6 mb-5">
                <p
                  lang="en"
                  className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-3"
                >
                  ⚔ THE STRONGEST FORM OF THIS ARGUMENT
                </p>
                <p className="text-mute leading-relaxed">{obj.objection}</p>
              </div>

              {/* Our response · NOT a rebuttal · honest assessment + commitments */}
              <div className="bg-slate/40 border border-gold/30 p-5 sm:p-6 mb-5">
                <p
                  lang="en"
                  className="font-mono text-gold text-[10px] tracking-[0.3em] mb-3"
                >
                  ↩ OUR HONEST RESPONSE
                </p>
                <p className="text-mute leading-relaxed">{obj.response}</p>
              </div>

              {/* Concession · what we agree IS valid in the objection */}
              <div className="bg-slate/30 border border-line/60 p-5 sm:p-6">
                <p
                  lang="en"
                  className="font-mono text-bone text-[10px] tracking-[0.3em] mb-3"
                >
                  ✓ WHAT WE CONCEDE
                </p>
                <p className="text-mute leading-relaxed">{obj.concession}</p>
              </div>
            </article>
          ))}
        </section>

        {/* ── WHY THIS PAGE EXISTS ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / META · WHY THIS PAGE EXISTS
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            Adversarial Collaboration pattern · 倒置「自己當銷售」
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              多數 SaaS / publication FAQ page 寫法是「先回應訪客最常 doubt」 ·
              本質是 sales-defensive。 ZONE 27 此頁 inverse:我們自己 publish
              反我們最強的 5 個 argument · steelman tier 寫成。
            </p>
            <p>
              <strong className="text-bone">Aronson 1966 + Spence 1973 Pratfall 極限版</strong>:
              展示我們知道自己最大 weakness · 知道得 sharp 比 reader 知道得更
              sharp。 reader 看到 we got there first · disarmed 99% antagonism。
            </p>
            <p>
              <strong className="text-bone">為什麼 玩運彩+報馬仔 結構性無法 ship</strong> ·
              因為他們 strongest objections 都是 lethal(「你們 retroactively
              刪輸的週次」 / 「你們 incentive aligned with bookmaker」 / 「你們
              真實勝率 50-52% vs claimed 94%」 ··· 每個 objection 都同時是
              商業 obituary)。 ZONE 27 5 objections 是 brand-IP refinement
              opportunities · 不是 obituary · 結構性差別。
            </p>
            <p className="font-mono text-mute/80 text-sm tracking-[0.18em] leading-relaxed">
              ⚓ 此 page 5 objections 數量 不可降(每次有 reader / agent /
              skeptic 提出 6th objection 我們無法 dismiss · 必須 publish 在
              此 page)· 5 objections wording 修改需 30 天 /changelog 公告 ·
              同 /audit S05 + /ethics PRE-COMMIT pattern。
            </p>
          </div>
        </section>

        {/* ── 2027 BINDING SUCCESS CRITERIA ───────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / PRE-COMMIT · 2027 BINDING SUCCESS CRITERIA
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            從 Objection 05 衍生 · ZONE 27 Year 1 minimum threshold
          </h2>
          <div className="border border-gold/40 bg-slate/40 p-5 sm:p-7 glow-soft">
            <p className="text-bone mb-4">
              Per Steelman Objection 05 · ZONE 27 此 PRE-COMMIT:
            </p>
            <ul className="space-y-3 list-disc pl-6 text-mute leading-relaxed">
              <li>
                <strong className="text-bone">N≥10</strong> paid BLACK CARD
                subscribers by 2027-05-31(/membership/black-card/ledger
                row 1-10 必須 occupied)
              </li>
              <li>
                <strong className="text-bone">N≥30</strong> finalized
                predictions by 2027-05-31(/track-record + /calibration
                meaningful Brier score 統計 OK)
              </li>
              <li>
                <strong className="text-bone">N≥3</strong> Founders 27
                claimed by real visitors(/founders/ledger 從 7 SYSTEM-TEST
                placeholders 真實 onboard 至少 3 個)
              </li>
            </ul>
            <p className="mt-5 font-mono text-mute/80 text-sm tracking-[0.18em] leading-relaxed">
              ⚓ 若 Year 1(2027-05-31)未達上述 minimum threshold ·
              /annual/2027 report 必須 explicit「ZONE 27 marketed
              transparency but failed to ship product-market fit」 ·
              不能藏 · per /audit S05 PRE-COMMIT pattern · Costly Signaling
              100×。
            </p>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 epistemic layer 最 expensive 的 trust artifact ·
            因為公布等於把自己暴露在 5 個 sharpest skeptic 的 question 之下 ·
            然後逐條 honest concession 自己 conceded。
          </p>
          <p>
            Adversarial collaboration pattern from PLOS ONE protocol +
            Tetlock superforecaster discipline · 倒置「自己當銷售」 標準
            SaaS pattern · ZONE 27 = 自己當批評者。 玩運彩+報馬仔 永遠 ship
            不出 同 page · 因為他們 steelman 同時是 obituary。
          </p>
          <p>
            修改 5 objections wording 需 30 天 /changelog 公告 · 同 /audit
            S05 + /ethics PRE-COMMIT pattern · Costly Signaling 100×。
            新 objection 提出時必須 add 不可 dismiss。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/steelman" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            STEELMAN · NOT STRAWMAN.
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight mb-8">
            5 strongest objections · 5 honest concessions · 0 dismissals。
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/ethics"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /ethics 8 binding commitments
            </Link>
            <Link
              href="/audit"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /audit S05 disclosure philosophy
            </Link>
            <Link
              href="/calibration"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /calibration Brier self-grading
            </Link>
            {/* Round 51 W-B · Agent 3 missing cross-link #1 fix · /steelman
                → /annual/2026 不藏 Year 0 honest empty state(0 paid · NT$0
                rev)· Year 0 是 strongest pratfall · 跟 5 strongest objections
                同 pratfall pattern · 應在 FINAL CTA 並列 surface · 不只
                ethics/audit/calibration 三條。 */}
            <Link
              href="/annual/2026"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /annual/2026 Year 0 honest empty
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
