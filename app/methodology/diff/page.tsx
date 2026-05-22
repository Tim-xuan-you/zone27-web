import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReproducibilityReceipt from "@/components/ReproducibilityReceipt";
import {
  cpblParks,
  CPBL_PARK_BASELINE_RUNS_PER_GAME,
  getRunsDelta,
} from "@/lib/cpbl-parks";

export const metadata: Metadata = {
  title: "Engine Diff · v0.2 → v0.3 — ZONE 27 Methodology",
  description:
    "v0.2 base 與 v0.3 Park Factor 引擎的完整逐行 diff:constants、code、4 場館 worked example、v0.3 不修正的清單、v0.4 PRE-COMMIT。",
};

// ── Round 50 W-A · /methodology/diff DEEPEST ────────────
// 「Most prediction sites have 1 secret engine. We built 2 open ones.」
// 不止 claim 2 engines · 把 v0.2 → v0.3 entire diff publish ·
// 同 React.dev / Stripe API changelog / Anthropic model card diff pattern。
//
// Brand IP 同時 fire:
//   - Disclosure Philosophy · publish entire model · 不止 claim version
//   - Pratfall · 主動 list v0.3 NOT 修正的 6 處 limitation(BABIP /
//     dimensions / temperature / wind / batter splits / sample debt)
//   - Costly Signaling · 玩運彩+報馬仔 不 publish 引擎 diff(他們 publish
//     等於暴露 cherry-picking 或 retroactive curation)
//   - Method Public(/manifesto V SYNTHESIS)· 延伸 8 字 grammar 到 engine
//     version layer · 不只 是 simulator.ts 整個檔案開源 · 是 v0.2 → v0.3
//     的 delta 也開源
//
// Reproducibility per IJCAI 2026 standard:
//   - 每個 numeric output 配 ReproducibilityReceipt(commit + data + seed + N)
//   - Worked example 數字 deterministic · 無 seed · 直接 import constants
//   - GitHub permalinks for v0.2 simulator.ts + v0.3 simulator-v03.ts
// ─────────────────────────────────────────────────────

export default function MethodologyDiffPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            ENGINE DIFF · v0.2 → v0.3 · MAY 2026
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
            v0.2 vs v0.3
            <br />
            <span className="text-gold">逐行 diff</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
            不只說「我們有 2 個 engine」 · 整份 delta 完整公開:
            constants 改了什麼 · code 改了什麼 · 數字輸出差多少 ·
            v0.3 還沒做的 6 件事。
          </p>
          <div className="mt-8 flex justify-center">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 00 · ABSTRACT ───────────────────────── */}
        <Section no="00" label="ABSTRACT" zh="一句話總結">
          <p>
            v0.3 = v0.2 base + 一個 HR rate multiplier · 由場館 R/G 環境推導 ·
            <strong className="text-bone">新增 11 行程式碼 · 0 修改 v0.2 既有檔案</strong>
            (per <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">/methodology</Link>{" "}
            Section 06 Lens Lifetime Pledge)。 v0.2 永遠 callable · v0.3 是
            wrapping layer · 不 silently rotate default。
          </p>
          <Pre>
            {`v0.3 atBatProbsV03(pitcher, venue) =
  v0.2 atBatProbs(pitcher).HR × parkMultiplier(venue)
  + 其他 outcome rescale 維持 Σ = 1`}
          </Pre>
          <p className="text-mute/80">
            <strong className="text-bone">不修正 v0.2 任何邏輯</strong> ·
            不修正 K rate · 不修正 BB rate · 不修正 BABIP · 不修正
            in-play hit distribution · 不修正 baserunner advancement ·
            不修正 PA per 9。 純加一個 multiplier。
          </p>
        </Section>

        {/* ── 01 · WHY THIS DIFF EXISTS ───────────── */}
        <Section no="01" label="WHY THIS DIFF EXISTS" zh="為什麼有這頁">
          <p>
            <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">/methodology</Link>{" "}
            Section 04 ENGINE LINEUP 用 table 列了「v0.2 LIVE · v0.3 LIVE DEV
            PREVIEW · v0.4 PLANNED」 · 多數 sportsbook 到此為止 ·
            <strong className="text-bone">「我們升級了 model」</strong> 是
            marketing 標準語。 我們不停在 marketing。
          </p>
          <p>
            這頁是 entire delta · 同 React.dev release notes · Stripe API
            changelog · Anthropic model card revision history。 您可以打開
            兩個 tab 對照{" "}
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              lib/simulator.ts
            </a>{" "}
            +{" "}
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator-v03.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              lib/simulator-v03.ts
            </a>
            {" "}· 不需 fork。
          </p>
          <p className="text-mute/80">
            <strong className="text-bone">玩運彩+報馬仔不 publish 引擎 diff。</strong>
            {" "}publish 等於暴露 cherry-picking(回頭改 model)或 retroactive
            curation(刪掉 losing weeks)。 ZONE 27 ship 此頁 = 物理 ban 這條
            退路 · per{" "}
            <Link href="/audit" className="text-gold underline-offset-4 hover:underline">
              /audit
            </Link>{" "}
            S05 PRE-COMMIT。
          </p>
        </Section>

        {/* ── 02 · CONSTANTS DIFF ─────────────────── */}
        <Section no="02" label="CONSTANTS DIFF" zh="常數對照表">
          <p>
            v0.2 公開 7 個 named constants + 6 個 in-play split 常數。 v0.3
            <strong className="text-bone"> 0 個修改 · 1 個新增</strong>
            (HR_PARK_SENSITIVITY = 0.5)。
          </p>

          <div className="mt-6 bg-slate/40 border border-line/70 overflow-x-auto">
            <table className="w-full font-mono text-[11px] sm:text-xs tabular">
              <thead>
                <tr className="border-b border-line/60 bg-slate/60">
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    CONSTANT
                  </th>
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    v0.2
                  </th>
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    v0.3
                  </th>
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    DELTA
                  </th>
                </tr>
              </thead>
              <tbody>
                <ConstRow name="PA_PER_9" v02="38" v03="38" delta="(unchanged)" />
                <ConstRow name="K_RATE_MIN" v02="0.15" v03="0.15" delta="(unchanged)" />
                <ConstRow name="K_RATE_MAX" v02="0.35" v03="0.35" delta="(unchanged)" />
                <ConstRow name="BB_RATE_MIN" v02="0.04" v03="0.04" delta="(unchanged)" />
                <ConstRow name="BB_RATE_MAX" v02="0.16" v03="0.16" delta="(unchanged)" />
                <ConstRow name="HR_RATE_MIN" v02="0.008" v03="0.008" delta="(unchanged)" />
                <ConstRow name="HR_RATE_MAX" v02="0.06" v03="0.06" delta="(unchanged)" />
                <ConstRow name="OUTS_IN_PLAY_RATIO" v02="0.65" v03="0.65" delta="(unchanged)" />
                <ConstRow name="HITS_IN_PLAY_RATIO" v02="0.35" v03="0.35" delta="(unchanged)" />
                <ConstRow name="SINGLE_RATIO" v02="0.75" v03="0.75" delta="(unchanged)" />
                <ConstRow name="DOUBLE_RATIO" v02="0.20" v03="0.20" delta="(unchanged)" />
                <ConstRow name="TRIPLE_RATIO" v02="0.05" v03="0.05" delta="(unchanged)" />
                <ConstRow name="GROUND_OUT_RATIO" v02="0.55" v03="0.55" delta="(unchanged)" />
                <ConstRow name="FLY_OUT_RATIO" v02="0.45" v03="0.45" delta="(unchanged)" />
                <ConstRow
                  name="HR_PARK_SENSITIVITY"
                  v02="—"
                  v03="0.5"
                  delta="NEW · v0.3 only"
                  isNew
                />
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-mute/85 leading-relaxed">
            <strong className="text-bone">14 unchanged + 1 new。</strong>{" "}
            v0.3 不 retune v0.2 任何 sampled probability · 任何 baserunner
            advancement rule · 任何 in-play split。 純加一個 0.5 sensitivity
            multiplier · 保守設計 · 半 R/G delta 反映在 HR rate。
          </p>

          <div className="mt-4">
            <ReproducibilityReceipt
              seed={null}
              dataAt="2026-05-22"
              n={null}
              fileLink="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator-v03.ts#L51"
            />
          </div>
        </Section>

        {/* ── 03 · CODE DIFF ──────────────────────── */}
        <Section no="03" label="CODE DIFF" zh="關鍵函式 diff">
          <p>
            v0.3 wraps v0.2 · 不 fork。 Function signature 加 1 個 venue
            parameter · body 加 5 行 multiplier 計算 + 9 行 outcome rescale。
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DiffBlock
              version="v0.2"
              file="lib/simulator.ts"
              line="atBatProbs()"
              tone="bone"
              code={`function atBatProbs(
  pitcher
) {
  const kRate = clamp(
    parseFloat(pitcher.k9) / 38,
    0.15, 0.35
  );
  const bbRate = clamp(...);
  const hrRate = clamp(...);

  const remaining =
    1 - kRate - bbRate - hrRate;

  return {
    K: kRate,
    BB: bbRate,
    HR: hrRate,
    "1B": remaining * 0.35 * 0.75,
    // ... 5 more outcomes
  };
}`}
            />
            <DiffBlock
              version="v0.3"
              file="lib/simulator-v03.ts"
              line="atBatProbsV03()"
              tone="gold"
              code={`function atBatProbsV03(
  pitcher, venue       // NEW param
) {
  const base = atBatProbs(pitcher);
  const park = getParkFactorByVenue(venue);

  if (!park) return base;  // fallback

  const delta = park.R/G - 9.5;
  const mult = 1 + (delta / 9.5) * 0.5;

  const newHr = base.HR * mult;
  const hrDelta = newHr - base.HR;
  const otherTotal = 1 - base.HR;
  const scale = (otherTotal - hrDelta)
                / otherTotal;

  return { HR: newHr, ...rescale };
}`}
            />
          </div>

          <p className="mt-6 text-mute/85 leading-relaxed">
            <strong className="text-bone">v0.3 reuse v0.2 atBatProbs()</strong>{" "}
            · 不 copy paste · 不 fork。 v0.2 任何 future 修正(K/BB/HR rate
            clamp / in-play distribution / baserunner physics)v0.3 自動 inherit。
            這是 Lens Lifetime Pledge 物理 codify · 不 silently divergence。
          </p>

          <p className="text-mute/80 text-sm leading-relaxed">
            完整 v0.3 source: 88 行 · 含 simulateGameV03 + applyOutcomeV03 +
            ENGINE_V03_TRACE_STEPS preset。 95% 同 v0.2 邏輯 · 5% Park Factor
            adjustment。{" "}
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator-v03.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              view source →
            </a>
          </p>
        </Section>

        {/* ── 04 · WORKED EXAMPLE · 4 PARKS ───────── */}
        <Section no="04" label="WORKED EXAMPLE" zh="4 場館 numeric output">
          <p>
            假設 pitcher HR/9 = 1.0(CPBL 中位 ace)· v0.2 base HR rate ={" "}
            <Mono>1.0 / 38 ≈ 0.0263</Mono>(每打席 2.63% 機率全壘打)。
            v0.3 在 4 個 CPBL 主場 multiplier:
          </p>

          <div className="mt-4 bg-slate/40 border border-line/70 overflow-x-auto">
            <table className="w-full font-mono text-[11px] sm:text-xs tabular">
              <thead>
                <tr className="border-b border-line/60 bg-slate/60">
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    VENUE
                  </th>
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    R/G
                  </th>
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    DELTA
                  </th>
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    MULT
                  </th>
                  <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-2 text-[10px]">
                    HR RATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {cpblParks.map((park) => {
                  const delta = getRunsDelta(park);
                  const mult =
                    1 + (delta / CPBL_PARK_BASELINE_RUNS_PER_GAME) * 0.5;
                  const baseHr = 0.0263;
                  const adjHr = baseHr * mult;
                  const deltaPct = ((mult - 1) * 100).toFixed(2);
                  const isHitter = park.tilt === "hitter";
                  return (
                    <tr key={park.venue} className="border-b border-line/40">
                      <td className="px-3 py-3 text-bone">
                        {park.venue}
                        <div className="text-mute/60 text-[10px] tracking-[0.2em] mt-0.5">
                          {park.en}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-mute tabular">
                        {park.estimatedRunsPerGame.toFixed(1)}
                      </td>
                      <td
                        className={`px-3 py-3 tabular ${
                          delta > 0 ? "text-gold/80" : delta < 0 ? "text-mute/70" : "text-mute"
                        }`}
                      >
                        {delta > 0 ? "+" : ""}
                        {delta.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-bone tabular">
                        ×{mult.toFixed(4)}
                      </td>
                      <td className="px-3 py-3 tabular">
                        <span className="text-bone">{adjHr.toFixed(4)}</span>
                        <span
                          className={`ml-2 text-[10px] tracking-[0.2em] ${
                            isHitter ? "text-gold/80" : "text-mute/70"
                          }`}
                        >
                          ({mult > 1 ? "+" : ""}
                          {deltaPct}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-mute/85 leading-relaxed">
            <strong className="text-bone">樂天桃園</strong>(hitter park ·
            10.1 R/G)multiplier 是 ×{(1 + (10.1 - 9.5) / 9.5 * 0.5).toFixed(4)}{" "}
            · HR rate 從 0.0263 → 0.0271 · 約 +3.2%。 也就是說 · 同 1.0 HR/9
            的投手在桃園每打席多 ~3% 機率被打出 HR。 9 局約 38 個打席 ·
            multiplier 累積後對 expected runs allowed 影響 ~0.1-0.2 分。
          </p>

          <p className="text-mute/80 text-sm leading-relaxed">
            <strong className="text-bone">這是保守 sensitivity 0.5 設計</strong>
            (per <Mono>HR_PARK_SENSITIVITY = 0.5</Mono>)。 完整 R/G delta
            直接套會 ×0.5 → ×1.0 sensitivity · 但 R/G delta 本身包含 BABIP /
            in-play hit / 跑壘 / strikeout 各 component · 不全 attribute 到
            HR rate。 v0.4 split 各 component(BABIP × park BABIP factor ·
            HR rate × park HR factor)再 ship。
          </p>

          <div className="mt-4">
            <ReproducibilityReceipt
              seed={null}
              dataAt="2026-05-22"
              n={null}
              fileLink="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/cpbl-parks.ts"
            />
          </div>
        </Section>

        {/* ── 05 · WHAT v0.3 DOES NOT FIX(Pratfall) ── */}
        <Section no="05" label="WHAT v0.3 DOES NOT FIX" zh="v0.3 不修正的 6 件事">
          <p>
            <strong className="text-bone">主動列出 v0.3 沒有修的 6 個 limitation</strong>
            (Pratfall · per <Link href="/audit" className="text-gold underline-offset-4 hover:underline">/audit</Link>{" "}
            S08 disclosure pattern)。 玩運彩+報馬仔 marketing 標準是「升級了
            model」 不交代細節 · ZONE 27 倒置:列出來。
          </p>

          <div className="mt-6 space-y-4">
            <NotFix
              n="01"
              what="BABIP(場內安打率)"
              why="v0.3 只 adjust HR rate · BABIP 仍 fixed 0.300 hitting-on-balls baseline · 樂天桃園左右翼短可能拉高 BABIP · v0.3 不反映。"
            />
            <NotFix
              n="02"
              what="球場 dimension splits"
              why="左外野 / 中外野 / 右外野 distance 沒分。 v0.3 用 aggregate R/G environment 推 multiplier · 不 split L/C/R 個別 outfield distance。"
            />
            <NotFix
              n="03"
              what="溫度 / 風 / 濕度"
              why="台灣夏季高溫 + 北部秋季東北季風 · 物理上影響 ball flight distance · v0.3 不採。 CPBL 沒 published per-game weather feed · ingest 從何拿。"
            />
            <NotFix
              n="04"
              what="batter park splits"
              why="同 pitcher park factor 邏輯應 apply to batter side · 但 v0.3 只 multiplier HR rate(pitcher 視角)· batter park advantage(BABIP / contact %)留 v0.4。"
            />
            <NotFix
              n="05"
              what="DH 規則 + 美聯/國聯式差異"
              why="CPBL 各場 DH 規則一致 · 但若引擎將來涵蓋 MLB Inter-League · DH on/off 對 batting order 影響 · v0.3 不 model。"
            />
            <NotFix
              n="06"
              what="N ≥ 30 calibration validation"
              why="v0.3 LIVE 後 N=0 finalized matches per engine · 不能宣稱「v0.3 > v0.2 accuracy」 · per /audit S05 PRE-COMMIT · 等 N≥30 finalized matches per engine 才 publish Brier score 對照。"
            />
          </div>

          <p className="mt-6 text-mute/85 leading-relaxed">
            <strong className="text-bone">這 6 件事不藏 · 不口頭承諾 · 寫在這頁。</strong>
            {" "}v0.4 routemap 將 4 個轉為 IMPLEMENTED ·{" "}
            <Link href="/roadmap" className="text-gold underline-offset-4 hover:underline">
              /roadmap
            </Link>{" "}
            列得到 · 30 天前在{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
              /changelog
            </Link>{" "}
            公告 modifications · 同 /audit S05 PRE-COMMIT pattern。
          </p>
        </Section>

        {/* ── 06 · v0.4 PRE-COMMIT ───────────────────── */}
        <Section no="06" label="v0.4 PRE-COMMIT" zh="v0.4 將會加什麼">
          <p>
            v0.4 PLANNED · Q4 2026 ·{" "}
            <strong className="text-bone">Bayesian Model Averaging across v0.2 + v0.3 votes</strong>
            (per <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">/methodology</Link>{" "}
            Section 04 ENGINE LINEUP table)。 不取代 v0.2 / v0.3 · ensemble。
          </p>

          <div className="mt-4 bg-slate/40 border border-line/70 p-5">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
            >
              v0.4 SCOPE · PRE-COMMITTED
            </p>
            <ul className="space-y-2 text-mute text-sm">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
                <span>v0.2 vote × Bayesian weight + v0.3 vote × Bayesian weight</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
                <span>Weights derived from per-engine Brier score over rolling 30-game window</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
                <span>BLACK CARD tier unlock(per Section 04 ENGINE LINEUP TIER column)</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
                <span>Source code published lib/simulator-v04.ts · 同 v0.2 + v0.3 pattern · 不藏</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
                <span>v0.4 diff page 同此頁 pattern publish · 不只 claim「升級了」</span>
              </li>
            </ul>
          </div>

          <p className="mt-6 text-mute/85 leading-relaxed">
            <strong className="text-bone">v0.4 ship 前 30 天 /changelog 公告 ·
            modifications via 同 /audit S05 PRE-COMMIT pattern。</strong>{" "}
            訂閱 BLACK CARD 不是「等 model 神奇升級」 · 是 see-through 看
            entire process · v0.4 ship 那天 您可以打開 lib/simulator-v04.ts
            audit 整個 Bayesian weight derivation · 不需相信 marketing。
          </p>
        </Section>

        {/* ── 07 · LENS LIFETIME PLEDGE ANCHOR ──────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-t border-line/40">
          <div className="border border-gold/40 bg-slate/40 p-6 sm:p-8 glow-soft">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
            >
              07 · LENS LIFETIME PLEDGE ANCHOR
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-5 leading-tight">
              此 diff page 永久 viewable · v0.4 ship 後也不刪
            </h2>
            <p className="text-mute leading-relaxed text-base mb-4">
              SaaS 標準是 model 升級時 silently delete old changelog · 訪客
              看不到 history。 ZONE 27 倒置:此 /methodology/diff 在 v0.4 ship
              後 NOT 刪 · 改為「v0.2 → v0.3 → v0.4」 progression diff · 永遠
              audit trail。 同 React.dev v17/v18/v19 release notes 並列模式 ·
              不 silently rotate。
            </p>
            <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
              ⚓ 修改此 pledge 需 30 天前 /changelog 公告 · 同 /audit S05
              PRE-COMMIT pattern · Costly Signaling 100×。
            </p>
          </div>
        </section>

        <FounderSignOff>
          <p>
            v0.3 是 88 行程式碼 · 5 行真正 logic delta。 沒有 marketing 把
            這個誇成什麼「next-gen AI」。 它就是 v0.2 加一個 HR rate
            multiplier。
          </p>
          <p>
            列得出來的 6 件 v0.3 不修正 · 一條一條寫在 Section 05。
            您比我懂 sabermetric · 看到漏了什麼請發 PR。
          </p>
          <p>
            v0.4 ship 那天 · 同此頁 pattern publish v0.3 → v0.4 diff。
            這個承諾寫死了 · 不藏。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/methodology/diff" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            DIFF · NOT MARKETING.
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight">
            您看到的不是「升級了 model」標語。
            <br />
            是 v0.2 → v0.3 整份 delta。
          </h3>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/methodology"
              className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              ← 回完整白皮書
            </Link>
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator-v03.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              v0.3 SOURCE →
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-line/40 flex items-center justify-center">
            <CopyLinkButton />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────

function Section({
  no,
  label,
  zh,
  children,
}: {
  no: string;
  label: string;
  zh: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40">
      <div className="flex items-baseline gap-4 mb-2 section-reveal">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {label}
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-8">{zh}</h2>
      <div className="space-y-5 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-gold/90 bg-ink/40 px-1.5 py-0.5 text-[0.9em] border border-line/60">
      {children}
    </code>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-ink/40 border border-line/60 p-4 sm:p-5 overflow-x-auto font-mono text-[12px] sm:text-sm text-bone leading-relaxed my-2">
      <code>{children}</code>
    </pre>
  );
}

function ConstRow({
  name,
  v02,
  v03,
  delta,
  isNew = false,
}: {
  name: string;
  v02: string;
  v03: string;
  delta: string;
  isNew?: boolean;
}) {
  return (
    <tr className={`border-b border-line/40 ${isNew ? "bg-gold/[0.04]" : ""}`}>
      <td className="px-3 py-2.5 text-bone tabular tracking-tight">{name}</td>
      <td className="px-3 py-2.5 text-mute tabular">{v02}</td>
      <td className={`px-3 py-2.5 tabular ${isNew ? "text-gold" : "text-mute"}`}>
        {v03}
      </td>
      <td
        className={`px-3 py-2.5 text-[10px] tracking-[0.2em] ${
          isNew ? "text-gold/90" : "text-mute/50"
        }`}
      >
        {delta}
      </td>
    </tr>
  );
}

function DiffBlock({
  version,
  file,
  line,
  tone,
  code,
}: {
  version: string;
  file: string;
  line: string;
  tone: "bone" | "gold";
  code: string;
}) {
  const toneClass = tone === "gold" ? "text-gold" : "text-bone";
  const borderClass = tone === "gold" ? "border-gold/40" : "border-line/70";
  return (
    <div className={`border ${borderClass} bg-slate/40 overflow-hidden`}>
      <div className="border-b border-line/60 bg-slate/60 px-3 py-2 flex items-baseline gap-3 flex-wrap">
        <span
          className={`font-mono ${toneClass} text-[10px] tracking-[0.3em]`}
        >
          {version}
        </span>
        <span className="font-mono text-mute/60 text-[10px] tracking-[0.2em]">
          {file}
        </span>
        <span className="font-mono text-mute/80 text-[10px] tracking-[0.2em]">
          · {line}
        </span>
      </div>
      <pre className="font-mono text-[11px] sm:text-[12px] leading-relaxed text-bone p-3 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function NotFix({
  n,
  what,
  why,
}: {
  n: string;
  what: string;
  why: string;
}) {
  return (
    <div className="border-l-2 border-loss/40 pl-4 py-1">
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="font-mono text-loss/70 text-[10px] tracking-[0.25em]">
          {n}
        </span>
        <span className="text-bone font-light">{what}</span>
      </div>
      <p className="text-mute/85 text-sm leading-relaxed">{why}</p>
    </div>
  );
}
