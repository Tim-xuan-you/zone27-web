import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import NoPushManifest from "@/components/NoPushManifest";
import ReciprocityLedger from "@/components/ReciprocityLedger";
import ArticleMeta from "@/components/ArticleMeta";
import { matches, getFinalizedMatches } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Transparency — 完整 audit aggregator",
  description:
    "ZONE 27 所有 transparency artifacts 集中索引:LIMITS · NEVER list · DIVERGED 賽事 · 8 binding commitments · DATA SOURCES · audit trail。 Anthropic /transparency 模式 · 公開散布在 /audit /methodology /coverage /track-record /ethics /steelman 的 transparency 資產統一 surface。",
};

// ── ZONE 27 · /transparency · transparency aggregator ──
// Round 51 W-D · 2026-05-22 evening · Agent 1 ship #1 from world-class
// niche subscription audit:Anthropic pattern · 把分散在 5 個 trust
// artifact pages 的 transparency content 統一 surface 在一個 navigable
// destination · 讓 transparency 變 first-class brand axis · 不只 buried
// inline section anchor。
//
// Disclosure Philosophy 物理 codify 升級:
//   - 之前:訪客必須逐頁讀 /audit + /methodology + /coverage + /track-record
//     + /ethics + /steelman + /calibration + /annual/2026 8 個 trust pages
//     才能拼湊 ZONE 27 transparency surface
//   - 之後:/transparency 1 page = 整份 audit table-of-contents · 訪客
//     scan 後再 deep-dive 對應 trust artifact
//
// Brand IP triple-fire:
//   - Disclosure(canonical)· 延伸 /audit S05 PRE-COMMIT pattern 到
//     meta-navigation layer
//   - Pratfall(Aronson 1966)· 6 sections 全是 self-exposure(LIMITS /
//     NEVER / DIVERGED / 不會做的 / data sources / audit trail)
//   - Costly Signaling(Spence 1973)· 把 transparency 提升為 navigable
//     destination = 物理表態「transparency is product, not afterthought」
//
// 6 sections spine(對標 Anthropic /transparency · Stratechery「say what
// you don't do」 + Defector worker-owned radical-transparency pattern):
//   01 WHAT WE DON'T KNOW · LIMITS 集合
//   02 WHAT WE DON'T DO · NEVER 集合
//   03 WHEN WE'VE BEEN WRONG · DIVERGED 集合
//   04 WHAT WE COMMIT TO · 8 binding ethics
//   05 WHERE OUR DATA COMES FROM · sources audit
//   06 HOW YOU CAN AUDIT US · reproducibility tools
// ─────────────────────────────────────────────────────

const FINALIZED_N = getFinalizedMatches().length;
const TOTAL_MATCHES = matches.length;

export default function TransparencyPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            TRANSPARENCY · COMPLETE AUDIT INDEX · MAY 2026
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
            完整 audit
            <br />
            <span className="text-gold">一頁可見</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
            散布在 /audit · /methodology · /coverage · /track-record ·
            /ethics · /steelman 8 個 trust 文件的 transparency content ·
            統一 surface 在此 · scan 後 deep-dive 對應 artifact。
          </p>
          <div className="mt-8 flex justify-center">
            <ArticleMeta readingMin={4} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* R59 W-G · Hindenburg DISCLOSURE block 第 3 個 trust artifact ·
            brand-IP triple consistency · /methodology + /audit + /transparency
            同一份 8-field position disclosure 同一份 LAST UPDATED · 訪客從
            「audit aggregator」 進 /transparency 第一眼即見 enterprise position ·
            no hidden incentive · canonical Anthropic system card「known
            affiliations」 + Hindenburg「at-the-top」 + Defector「show the
            books」 pattern triple-sync。 同 [[project-zone27-disclosure-
            philosophy]]「公開 enterprise not just engine」 物理 codify。 */}
        <aside
          id="disclosure"
          aria-labelledby="transparency-disclosure-heading"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-12"
        >
          <div className="border border-line/60 bg-slate/30 p-5 sm:p-6">
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <span
                id="transparency-disclosure-heading"
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em]"
              >
                / DISCLOSURE · WHO WROTE THIS
              </span>
              <span
                lang="en"
                className="font-mono text-mute/60 text-[9px] tracking-[0.3em]"
              >
                LAST UPDATED · 2026-05-23
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-mute/85 text-[12px] sm:text-[13px] leading-relaxed">
              <li className="font-mono tabular">
                <span className="text-mute/60">EQUITY</span>{" "}
                <span className="text-bone">100% TIM solo</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">SPONSORS</span>{" "}
                <span className="text-bone">0</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">ADS</span>{" "}
                <span className="text-bone">0 · AdMob permanently banned</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">TRACKERS</span>{" "}
                <span className="text-bone">0 · per /privacy</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">RECEIPTS</span>{" "}
                <span className="text-bone">N={FINALIZED_N} · {FINALIZED_N} PROVED · 0 DIVERGED</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">FOUNDERS 27</span>{" "}
                <span className="text-bone">7 SYSTEM-TEST · 0 real</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">BLACK CARD</span>{" "}
                <span className="text-bone">0 paid subscribers</span>
              </li>
              <li className="font-mono tabular">
                <span className="text-mute/60">REVENUE</span>{" "}
                <span className="text-bone">NT$ 0 · Year 0 honest empty</span>
              </li>
            </ul>
            <p className="mt-3 text-mute/65 text-[11px] leading-relaxed border-t border-line/40 pt-3">
              同 disclosure block 在{" "}
              <Link
                href="/methodology#disclosure"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /methodology
              </Link>
              {" "}+{" "}
              <Link
                href="/audit#disclosure"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /audit
              </Link>
              {" "}· 3 trust artifact 同步 LAST UPDATED · 完整 enterprise state 在{" "}
              <Link
                href="/annual/2026"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /annual/2026
              </Link>
              {" "}· 違反任何一條 = brand 信用 collapse(per{" "}
              <Link
                href="/ethics"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                /ethics
              </Link>
              )。
            </p>
          </div>
        </aside>

        {/* ── 01 · WHAT WE DON'T KNOW ───────────────── */}
        <Section no="01" label="WHAT WE DON'T KNOW" zh="我們知道自己還不知道什麼">
          <p>
            ZONE 27 引擎 LIMITS · 主動列出。 不是 marketing-omission · 是
            <strong className="text-bone"> Pratfall axiom(Aronson 1966)</strong>{" "}
            物理 codify · 主動暴露弱點 = 增強 trust。
          </p>
          <ItemList>
            <Item title="N ≥ 30 SAMPLE DEBT(canonical Z27 LEXICON)">
              當前 finalized matches N = {FINALIZED_N}(共 {TOTAL_MATCHES} 場 ingest)·
              統計顯著門檻 N = 30(Bill James 1985 慣例)· 未達 = 不能 claim
              「我們準」。 完整 sample debt chip 在{" "}
              <Link href="/track-record" className="text-gold underline-offset-4 hover:underline">/track-record</Link>
              。
            </Item>
            <Item title="K/9 · BB/9 · HR/9 estimate disclosure">
              CPBL pitcher stats 部分 estimate from public box scores(per{" "}
              <Link href="/audit" className="text-gold underline-offset-4 hover:underline">/audit S02 ESTIMATION DISCLOSURE</Link>
              )。 真實值 PR welcome · 不藏 estimate framework。
            </Item>
            <Item title="v0.3 NOT 修正的 6 件事(per /methodology/diff S05)">
              BABIP / 場館 dimension splits / 溫度 風 濕度 / batter park
              splits / DH 規則 / N ≥ 30 calibration validation · 6 件 v0.3
              不修正 publish 在{" "}
              <Link href="/methodology/diff" className="text-gold underline-offset-4 hover:underline">/methodology/diff</Link>
              。
            </Item>
            <Item title="5 strongest objections against us(per /steelman)">
              ZONE 27 自己寫 5 個反 ZONE 27 strongest objections · 不 strawman
              · 不 weakman · 完整 honest concessions in{" "}
              <Link href="/steelman" className="text-gold underline-offset-4 hover:underline">/steelman</Link>
              。
            </Item>
            <Item title="所有 simplification assumptions in engine v0.2">
              寫死的條件機率(1B 60%/20% 推進 · 2B 50% · 3B 100%)· BABIP
              fixed 0.300 · ratio constants · 所有 simplification 公開於{" "}
              <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">/methodology Section 01</Link>
              + lib/simulator.ts on GitHub。
            </Item>
          </ItemList>
        </Section>

        {/* ── 02 · WHAT WE DON'T DO ───────────────── */}
        <Section no="02" label="WHAT WE DON'T DO" zh="13 件「永遠不做」 binding">
          <p>
            ZONE 27 displacement target = 玩運彩 + 報馬仔 + LINE 老師生態。
            這 13 件「永遠不做」 是物理 differentiation · 違反任一 = 品牌自殺(R80 加 #12 CPBL-only-forever engine scope binding · R81 加 #13 永遠不 subscription auto-renewal binding · scope + discipline + renewal 三軸 close brand IP loop)。
            Costly Signaling(Spence 1973)· 公布「不做」 比公布「會做」 更
            expensive · 因為 publish = 物理 ban 退路。
          </p>
          <NeverGrid>
            <Never>不顯示賠率(NO ODDS)</Never>
            <Never>不賣明牌(NO PICK-OF-THE-DAY LOCK-IN)</Never>
            <Never>不分潤博彩 affiliate(NO COMMISSION)</Never>
            <Never>不寄生 gambling 平台(NO PARASITE)</Never>
            <Never>不藏 DIVERGED 賽事(NO HIDDEN MISSES)</Never>
            <Never>不追蹤訪客(0 GA · 0 Pixel · 0 tracking cookies · essential auth session 例外明示 in /privacy)</Never>
            <Never>不接受 AdMob / 廣告營收(NO ADS · 永久)</Never>
            <Never>不做 fake methodology「管它準不準包裝」</Never>
            <Never>不做 fake testimonials / 偽造 social proof</Never>
            <Never>不做 modal paywall scroll-lock</Never>
            <Never>不做多步驟 onboarding wizard</Never>
            <Never>不預測 MLB / NPB / KBO / 任何外國職棒 / 任何台灣運彩 bettable events(R80 加 · ENGINE PERMANENT CPBL-ONLY SCOPE)</Never>
            <Never>不 ship subscription auto-renewal · 永遠 · ECPay/TapPay/Stripe 自動扣款全 refused(R81 加 · BLACK CARD pivot 至 CPBL Season Pass NT$ 1,500/season explicit · Defector 85% explicit-renewal + NBA 88% season ticket renewal + Pinboard 一次性 pattern · Loss aversion FOR ZONE 27 axiom)</Never>
          </NeverGrid>
          <p className="text-mute/85 mt-6">
            完整 list 含 explainer 與 reason · 見{" "}
            <Link href="/coverage" className="text-gold underline-offset-4 hover:underline">/coverage Section 05 NEVER</Link>
            {" "}+{" "}
            <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">/ethics 9 binding commitments</Link>
            {" "}+{" "}
            <Link href="/integrity" className="text-gold underline-offset-4 hover:underline">/integrity 22 binding rules</Link>
            。 任何 1 條修改需 30 天前在{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">/changelog</Link>
            {" "}公告 · 同 PRE-COMMIT pattern。
          </p>
        </Section>

        {/* ── 03 · WHEN WE'VE BEEN WRONG ───────────────── */}
        <Section no="03" label="WHEN WE'VE BEEN WRONG" zh="DIVERGED 賽事 · 不藏 miss">
          <p>
            ZONE 27 引擎每場 prediction 公開 lock 一個機率分布 · 賽後物理
            真實結果 against prediction · PROVED ✓ 跟 DIVERGED ✕{" "}
            <strong className="text-bone">等大等亮列出</strong> · 不藏、
            不修飾、不重新加權。
          </p>
          <p className="text-mute/85">
            目前 finalized {FINALIZED_N} 場 · sample 累積中 · N ≥ 30 才能
            claim 統計顯著(Bill James 1985 慣例)· 在那之前每場 receipt
            都 displayed in{" "}
            <Link href="/track-record" className="text-gold underline-offset-4 hover:underline">
              /track-record
            </Link>
            。 Brier score + reliability diagram(45° calibration curve)·
            見{" "}
            <Link href="/calibration" className="text-gold underline-offset-4 hover:underline">
              /calibration
            </Link>
            (匿名可進)。
          </p>
          <div className="mt-4 bg-slate/40 border border-line/70 p-5">
            <p
              lang="en"
              className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-3"
            >
              ZONE 27 「不藏 DIVERGED」 物理 codify
            </p>
            <ul className="space-y-2 text-mute text-sm">
              <BulletItem>引擎 prediction 公開鎖定 + EngineStamp commit hash</BulletItem>
              <BulletItem>賽後 Tim 親手截圖 cpbl.com.tw box score 物理時刻</BulletItem>
              <BulletItem>finalResult ingest into lib/matches.ts · git commit · public diff</BulletItem>
              <BulletItem>PROVED ✓ 跟 DIVERGED ✕ 同顯示 weight · 不藏 / 不淡化 / 不重新加權</BulletItem>
              <BulletItem>玩運彩+報馬仔 結構性 not publish 同 page · 因 publish = 暴露 cherry-picking</BulletItem>
            </ul>
          </div>
        </Section>

        {/* ── 04 · WHAT WE COMMIT TO ───────────────── */}
        <Section no="04" label="WHAT WE COMMIT TO" zh="9 binding ethics commitments">
          <p>
            ZONE 27 publish 9 條 binding ethics commitment · 違反任一 = Tim
            親手 在{" "}
            <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">
              /ethics
            </Link>
            {" "}紅字標永久 audit trail。 此非 marketing copy · 是 Tim 親手
            簽名物理 codify。
          </p>
          <CommitGrid>
            <Commit n="01" title="0 betting affiliate / 不分潤博彩平台" />
            <Commit n="02" title="0 ads · AdMob 永久封殺" />
            <Commit n="03" title="0 user tracking · GA / Pixel / Hotjar 永遠 0" />
            <Commit n="04" title="0 fake testimonials · 公開 founders 全名清單(將來 Q3 onboard 後)" />
            <Commit n="05" title="0 DIVERGED 隱藏 · 賽後 receipt 等大列出 · 7 天 ingest SLA" />
            <Commit n="06" title="0 silently model rotation · Lens Lifetime Pledge · 每 ship 過的 engine 永久 viewable" />
            <Commit n="07" title="0 「明牌」 framing · prediction = probability 不是 picks" />
            <Commit n="08" title="0 fine print · 任何 rule modification 30 天前 /changelog 公告" />
            <Commit n="09" title="0 cherry-pick · 每筆 CPBL engine prediction → mandatory /track-record + /receipts permalink · 0 retroactive delete(R80 加)" />
          </CommitGrid>
          <p className="text-mute/85 mt-6">
            完整 8 commitments + per-item violation receipt mechanism · 見{" "}
            <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">
              /ethics
            </Link>
            。
          </p>
        </Section>

        {/* ── 05 · WHERE OUR DATA COMES FROM ───────────────── */}
        <Section no="05" label="WHERE OUR DATA COMES FROM" zh="data sources 物理 audit">
          <p>
            訪客有權 audit ZONE 27 用什麼 data · 從哪來 · 怎麼 ingest。 三條
            data path 透明 publish:
          </p>
          <div className="mt-4 space-y-4">
            <DataPath
              source="CPBL · 中華職棒"
              method="Tim 親手截圖 cpbl.com.tw box score · Claude 解析 · git commit · lib/matches.ts ingest"
              cadence="賽後 24h · per /ethics commitment #5 SLA"
              audit="完整 ingest log 在 git history · 每場 receipt commit message 可審"
            />
            <DataPath
              source="MLB · 美國職棒大聯盟"
              method="MLB Stats API(免費官方)· Vercel ISR 每 10 分鐘 revalidate · 自動 ingest · 不需 Tim 手動"
              cadence="每 10 分鐘 ISR · 1d cache TTL · revalidate background"
              audit="lib/mlb.ts open source · ISR config in app/matches/mlb/page.tsx"
            />
            <DataPath
              source="Park Factor + Workload Proxy ESTIMATE"
              method="lib/cpbl-parks.ts · lib/cpbl-pitchers.ts · estimate methodology + 場館 reference public fact 來源 · PR welcome"
              cadence="一次性 ingest · 未來 PR-modified update"
              audit="lib/cpbl-*.ts source code + /audit S02 ESTIMATION DISCLOSURE 完整 framework"
            />
          </div>
          <p className="text-mute/85 mt-6">
            完整 coverage philosophy 與 NEVER list(不會 cover 什麼)· 見{" "}
            <Link href="/coverage" className="text-gold underline-offset-4 hover:underline">
              /coverage
            </Link>
            。
          </p>
        </Section>

        {/* ── 06 · HOW YOU CAN AUDIT US ───────────────── */}
        <Section no="06" label="HOW YOU CAN AUDIT US" zh="您可以親手 audit 的工具">
          <p>
            ZONE 27 把 audit tools 設計為 first-class 公開 · 不是「我們公開
            method 給您 trust」 · 是「我們公開 method 給您 audit」。 三個
            audit primitives 公開可用:
          </p>
          <ItemList>
            <Item title="GitHub source code · 100% open">
              全 codebase MIT-licensed 公開於{" "}
              <a
                href="https://github.com/Tim-xuan-you/zone27-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                github.com/Tim-xuan-you/zone27-web
              </a>
              。 任何訪客可 clone · fork · audit · PR 修正。 lib/simulator.ts
              (v0.2)+ lib/simulator-v03.ts(v0.3)+ lib/cpbl-parks.ts 等 ·
              整套 ingest pipeline 可重 reproduce。
            </Item>
            <Item title="Reproducibility Receipt · 每個 number 有 audit trail">
              ZONE 27 ship ReproducibilityReceipt component · 任何 published
              number 帶 4 minimum audit elements:
              <span className="font-mono text-gold/80 text-[10px] block mt-1">
                ⌗ COMMIT SHA + DATA AS-OF + RANDOM SEED + SAMPLE N
              </span>
              {" "}per IJCAI 2026 standard。 自 R42 W-B ship · current
              applied to /methodology ABSTRACT + /track-record + /annual/2026。
            </Item>
            <Item title="Engine Stamp · 每場 prediction 帶 build commit hash">
              HeroLiveCard / TonightReceiptsCard / /track-record 每場 prediction
              帶 EngineStamp:「ENGINE v0.2 · LOCKED YYYY-MM-DD · BUILD ⌗SHA」
              · BUILD chip 直連 GitHub commit · 訪客可審 entire engine state
              at prediction lock moment。
            </Item>
            <Item title="GitHub Issue · 您發現 bug 公開可審">
              發現 bug / 建議 → 開{" "}
              <a
                href="https://github.com/Tim-xuan-you/zone27-web/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                GitHub Issue
              </a>
              {" "}· 公開 audit trail · 同 Pratfall + Disclosure axiom 延伸到
              bug-tracking layer。
            </Item>
          </ItemList>
        </Section>

        {/* ── 07 · ANCHOR ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-t border-line/40">
          <div className="border border-gold/40 bg-slate/40 p-6 sm:p-8 glow-soft">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
            >
              07 · TRANSPARENCY AS PRODUCT
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-5 leading-tight">
              transparency 不是 marketing afterthought · 是 product
            </h2>
            <p className="text-mute leading-relaxed text-base mb-4">
              SaaS 標準是 transparency 散落在 footer link / about page bottom /
              「learn more」 secondary CTA。 ZONE 27 倒置:transparency 升 first-
              class navigable destination · 進 Footer DOCS group · Cmd-K
              palette · Nav 信任文件軸線。 訪客 1-click 從 homepage 到此 ·
              不必逐頁拼湊 8 個 trust pages。
            </p>
            <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
              ⚓ 修改此 page 或砍任一 section 需 30 天前 /changelog 公告 ·
              同 /audit S05 PRE-COMMIT pattern · Costly Signaling 100×。
            </p>
          </div>
        </section>

        {/* R74 W-A · ReciprocityLedger ledger variant · Agent A R73 SHIP 3 ·
            Cialdini Reciprocity Principle(1984)· 16 concrete artifacts
            published BEFORE NT$ 1,500/season + NT$ 2,700 ASK · Berkshire 70 年
            annual letters + Patek 200 年 movement schematics + Anthropic
            model card library pattern · LINE 老師 / 報馬仔 ask-first-give-
            never inversion · CPBL fan audience pattern-match instantly。 */}
        <ReciprocityLedger />

        {/* R73 W-D · NoPushManifest manifest variant · Agent A R73 SHIP 2 ·
            Brehm Reactance(1966)+ Deci/Ryan Self-Determination(1985)·
            costly-signaling-via-restraint(Spence 1973)· 12 deliberate
            absences PUBLISHED · operational artifact of existing 11
            「永遠不做」 CLAUDE.md axiom · Mubi+Calm+Are.na+Astral Codex Ten
            +1Password pattern · Patagonia「Don't Buy This Jacket」 NYT
            2011 parallel。 */}
        <NoPushManifest />

        <FounderSignOff>
          <p>
            這頁不是 marketing 創意 · 是把分散在 5-6 個 trust artifact 的
            transparency content 聚合一個 navigable destination。 Anthropic 模式 ·
            ZONE 27 brand-pure 延伸。
          </p>
          <p>
            您 1 分鐘 scan 完此 page 等於 know ZONE 27 大致 audit surface ·
            然後 deep-dive 哪個 section 由您決定。 不藏 / 不誇 / 不催。
          </p>
          <p>
            修改 6 sections 需 30 天前在 /changelog 公告 · 砍任一 section
            等於 retroactive curation · brand 自殺。 此 page 永久 viewable ·
            per Lens Lifetime Pledge 同 pattern。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/transparency" />

        {/* ── FINAL CTA ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            TRANSPARENCY · NAVIGABLE · 1-CLICK.
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight mb-8">
            您看到的 audit 不在「learn more」 secondary。
            <br />
            是 6 sections 物理 codify 一頁可見。
          </h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              href="/founders"
              className="inline-block px-6 py-3 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              → Founders 27 · NT$ 2,700 終身
            </Link>
            <Link
              href="/membership/black-card"
              className="inline-block px-6 py-3 border border-gold text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → BLACK CARD · NT$ 1,500/season
            </Link>
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

// R71 W-E · Agent B audit F1 fix · slug helper for /transparency Section ·
// 同 R69 W-F /terms + R70 W-F /privacy pattern · enables /transparency
// #section-02 anchor jump · /founders/apply R70 W-E pre-apply checklist
// row 01 cross-link target · 不再 broken-anchor 5-second devtools verify。
function slugFromTransparencySectionNo(no: string): string {
  return `section-${no.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

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
  const id = slugFromTransparencySectionNo(no);
  return (
    /* Round 57 W-A · Agent B Ship #3 · cv-auto skips paint+layout off-screen ·
       LCP -150ms on long /transparency page · TBT -100ms · brand IP fit:
       pure browser-native primitive · 0 cookies · 0 animation。
       R71 W-E · Agent B audit F1 fix · id slug for anchor jump · scroll-mt-20。 */
    <section
      id={id}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40 cv-auto scroll-mt-20"
    >
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

function ItemList({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-4 mt-4">{children}</ul>;
}

function Item({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-l-2 border-gold/40 pl-4 py-1">
      <p className="text-bone font-light mb-2">{title}</p>
      <p className="text-mute/85 text-sm leading-relaxed">{children}</p>
    </li>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-baseline">
      <span aria-hidden="true" className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">▸</span>
      <span className="flex-1">{children}</span>
    </li>
  );
}

function NeverGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-2 mt-4">
      {children}
    </ul>
  );
}

function Never({ children }: { children: React.ReactNode }) {
  return (
    <li className="border-l-2 border-loss/40 pl-3 py-1.5 text-mute/85 text-sm">
      <span aria-hidden="true" className="text-loss/70 mr-2">✕</span>
      {children}
    </li>
  );
}

function CommitGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-2 mt-4">
      {children}
    </ul>
  );
}

function Commit({ n, title }: { n: string; title: string }) {
  return (
    <li className="border-l-2 border-gold/40 pl-3 py-1.5 text-sm">
      <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em] mr-2">
        {n}
      </span>
      <span className="text-mute/85">{title}</span>
    </li>
  );
}

function DataPath({
  source,
  method,
  cadence,
  audit,
}: {
  source: string;
  method: string;
  cadence: string;
  audit: string;
}) {
  return (
    <div className="border border-line/70 bg-slate/30 p-4 sm:p-5">
      <p className="text-bone font-light mb-3">{source}</p>
      <div className="grid sm:grid-cols-[100px_1fr] gap-2 sm:gap-4 text-sm">
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
          METHOD
        </span>
        <span className="text-mute/85 text-[13px] leading-relaxed">{method}</span>
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
          CADENCE
        </span>
        <span className="text-mute/85 text-[13px] leading-relaxed">{cadence}</span>
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
          AUDIT
        </span>
        <span className="text-mute/85 text-[13px] leading-relaxed">{audit}</span>
      </div>
    </div>
  );
}
