import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import ArticleMeta from "@/components/ArticleMeta";
import VsRowFold from "@/components/VsRowFold";
import { FOUNDERS_REMAINING } from "@/lib/founders-stats";
import { createPageMetadata } from "@/lib/page-og";

// R159 W1.L1 · Agent L CRITICAL · backfill createPageMetadata · /manifesto
// 是 canonical brand IP page · per /audit S05 PRE-COMMIT · share preview 必須
// reflect 4 axiom inversion not generic slogan。
export const metadata: Metadata = createPageMetadata({
  title: "倒置宣言 · ZONE 27 Manifesto",
  description:
    "四個我們刻意倒置的行業預設:完整公開引擎、工具免費身分付費、引擎能算的才覆蓋、零第三方追蹤。每一個倒置都有代價,代價就是品牌。",
  path: "/manifesto",
});

// ── ZONE 27 · /manifesto · 倒置宣言 ────────────────────
// Canonical long-form home for the 4 brand axioms that are
// otherwise scattered across /audit, /privacy, /coverage,
// /lab/custom and the homepage Brand Inversion section.
//
// Why a standalone page?
//   - Homepage TLDR shows the 4 rows in 60 seconds — no argument
//   - /audit Section 05 covers disclosure axiom only
//   - /coverage covers coverage axiom only
//   - /privacy covers privacy axiom only
//   - There is no single canonical URL where someone can read the
//     FULL inverted-positioning argument and screenshot a 5-min
//     read that explains who ZONE 27 is. This is that page.
//
// Voice contract:
//   - Match /audit Section 05 tone: declarative + structural
//   - English mono kickers + zh prose body (bilingual scaffold)
//   - No marketing language, no slogans, no exhortation
//   - Each axiom = INDUSTRY pattern + ZONE 27 inverse + 4-layer
//     argument (why industry does it · who loses · what it costs us
//     · why we accept the cost) + canonical citation
// ─────────────────────────────────────────────────────

const MANIFESTO_DATE = "2026-05-21";
const MANIFESTO_VERSION = "v0.28";

export default function ManifestoPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          {/* ── PRINT-ONLY ATTRIBUTION ─────────────────── */}
          <div
            lang="en"
            className="print-only mb-6 pb-3 border-b border-line/60 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            <div className="flex justify-between gap-4">
              <span>ZONE 27 — MANIFESTO {MANIFESTO_VERSION}</span>
              <span>PRINTED · zone27-web.vercel.app/manifesto</span>
            </div>
          </div>

          {/* ── HEADER ──────────────────────────────── */}
          <header className="pb-10 border-b border-line/60">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
            >
              INVERTED BY DESIGN
            </p>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-3">
              倒置宣言
              <span className="block mt-3 font-mono text-gold text-lg sm:text-xl tracking-[0.25em]">
                THE FOUR INVERSIONS
              </span>
            </h1>
            {/* Round 54 W-C · Cold Gold Hairline signature moat。 */}
            <div className="zone27-rule max-w-[260px] mb-6" aria-hidden="true" />
            {/* Round 54 W-C · Editorial drop-cap on first body paragraph。 */}
            <p className="editorial-dropcap text-mute text-base leading-relaxed mb-8 max-w-2xl">
              四個我們刻意倒置的行業預設。每一個倒置都有代價,代價就是品牌。
              這份宣言列出我們的選擇、放棄的選項,以及為什麼。
            </p>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 font-mono text-[11px] tracking-[0.05em]">
              <MetaPair label="VERSION" value={MANIFESTO_VERSION} />
              <MetaPair label="PUBLISHED" value={MANIFESTO_DATE} />
              <MetaPair label="AUTHOR" value="Tim · 創辦人" />
            </dl>
            <div className="mt-5">
              <ArticleMeta readingMin={14} />
            </div>
          </header>

          {/* ── OPENING NOTE ────────────────────────── */}
          <section className="pt-12 pb-2 space-y-5 zh-body text-mute text-base leading-relaxed max-w-2xl">
            <P>
              ZONE 27 是台灣硬核棒球迷的暗黑黃金級量化分析品牌。
              我們做的事不獨特:Monte Carlo 模擬器、勝率分布、賽事資料。
              <strong className="text-bone">獨特的是我們刻意不做什麼。</strong>
            </P>
            <P>
              下方四個段落,每一段都是行業正統做法 vs ZONE 27 倒置版本。
              不是「我們還沒做到」,是「我們刻意倒置之」。
              每一個倒置都讓我們失去某些東西 — 通常是某種規模、某種收入流、
              某種行銷管道。我們接受這些代價,因為它們換來的東西
              更稀有:可被驗證的信任。
            </P>
            <P className="text-mute/70">
              這份宣言是<strong className="text-bone">系統論證版</strong>。
              想看為什麼一個 27 年中華職棒球迷會做這品牌的<strong className="text-bone">個人起源</strong>?
              請見{" "}
              <Link
                href="/about"
                className="text-gold underline-offset-4 hover:underline"
              >
                /about Chapter 00 PROLOGUE
              </Link>
              。
            </P>
          </section>

          {/* ── I · DISCLOSURE ──────────────────────── */}
          <AxiomSection
            roman="I"
            label="DISCLOSURE"
            zh="完整公開引擎"
            industry="藏 model weights · 藏 training data · 藏 fine-tuning"
            zone27="把整個演算法、所有輸入、所有限制全部寫進公開 model report"
          >
            <P>
              <strong className="text-bone">行業為什麼藏:</strong>{" "}
              OpenAI / Anthropic / Google 的商業模式核心是 API 計費 ·
              算法是會被複製的資產。藏 weights = 對手不能立刻 fork =
              billions of dollars 的 R&amp;D 不會在 24 小時內歸零。
              對封閉式 AI 公司,商業邏輯成立。
            </P>
            <P>
              <strong className="text-bone">誰因此受害:</strong>{" "}
              訪客被迫信任不可驗證的黑盒。「我們的模型在 X 個 benchmark 上
              拿到 Y 分」這種主張無法獨立檢驗 ·
              使用者只能接受或拒絕,沒有第三條路。
            </P>
            <P>
              <strong className="text-bone">這個倒置讓我們失去什麼:</strong>{" "}
              任何工程師閱讀{" "}
              <Link
                href="/methodology"
                className="text-gold hover:underline underline-offset-4"
              >
                /methodology
              </Link>{" "}
              + 30 分鐘 fork 我們的{" "}
              <ExtLink href="https://github.com/Tim-xuan-you/zone27-web">
                GitHub repository
              </ExtLink>
              ,就可以複製出功能等效的引擎。沒有算法護城河。
            </P>
            <P>
              <strong className="text-bone">為什麼我們接受這個代價:</strong>{" "}
              因為 ZONE 27 賣的不是演算法,是身分。
              <Link href="/founders" className="text-gold hover:underline underline-offset-4">
                Founders 27
              </Link>{" "}
              的價值是 #001 ~ #270 創始編號 + 創辦人親手 onboarding +
              建立期社群的位置 —{" "}
              <strong className="text-bone">這些東西 fork 不走</strong>。
              算法本來就沒有可藏的價值,硬藏 = 假裝有秘密 = 對訪客撒謊
              = 品牌信用自殺。
            </P>
            <P className="text-mute/70">
              <strong className="text-bone">物理產出在</strong>{" "}
              <Link href="/track-record" className="text-gold hover:underline">
                /track-record
              </Link>
              {" "}— 每場引擎賽前公開預測 + 賽後實際結果 ·
              PROVED ✓ 跟 DIVERGED ✕ 等大列出 · 不刪、不修飾、不過濾。
              倒置 I 是文字理論,這頁是文字理論每天加一行的物理證據。
            </P>
            <P className="text-mute/70">
              完整論證見{" "}
              <Link href="/audit" className="text-gold hover:underline">
                /audit
              </Link>{" "}
              Section 05 · DISCLOSURE PHILOSOPHY。
            </P>
          </AxiomSection>

          {/* ── II · MONETIZATION ───────────────────── */}
          <AxiomSection
            roman="II"
            label="MONETIZATION"
            zh="工具免費,身分付費"
            industry="工具 per-use 計費 (SaaS) 或免費釣魚後抽佣 (運彩平台)"
            zone27="引擎完全免費 · 收費僅在身分層 (Founders 27 + BLACK CARD)"
          >
            <P>
              <strong className="text-bone">行業為什麼這樣收費:</strong>{" "}
              SaaS 模式收入隨使用量線性成長,投資人估值模型友善
              (LTV / CAC / Net Revenue Retention 都有現成公式)。
              運彩平台則用免費工具當釣餌,賺真錢靠賭注抽佣 30-50% —
              這種比例只有在「使用者看不見」的地方才可能。
            </P>
            <P>
              <strong className="text-bone">誰因此受害:</strong>{" "}
              偶爾使用者每月被 charge 卻沒用到那個錢的價值 ·
              重度使用者繳的也覆蓋不了他造成的真實服務成本(被攤平了)·
              而運彩用戶最大的受害是不知道自己一年付了多少抽佣
              (隱藏在每筆下注的賠率裡)。
            </P>
            <P>
              <strong className="text-bone">這個倒置讓我們失去什麼:</strong>{" "}
              我們永遠不會有「ARR 50x 線性成長」的故事可以講給創投。
              收入靠會員費(Founders 27 NT$ 2,700/年 · BLACK CARD NT$ 500/月)+
              創作者抽成 5–10% · 會員不限量 · 但 CPBL 市場本身就小。這是一個{" "}
              <Link href="/about" className="text-gold hover:underline underline-offset-4">
                俱樂部規模的事業
              </Link>
              ,不是 unicorn 路線。
            </P>
            <P>
              <strong className="text-bone">為什麼我們接受這個代價:</strong>{" "}
              因為我們蓋的不是消耗品 SaaS,是 270 人封閉俱樂部 + 一個
              開放給所有人的精緻工具。引擎免費讓任何懷疑者可以親手驗證 ·
              身分付費讓真正想成為品牌一部分的人有專屬位置。
              這兩件事不能反過來:免費身分 + 收費工具 = 我們變成普通 SaaS。
            </P>
            {/* Round 29 Wave 1 · MLM disambiguation brand defense.
                台灣訪客看到「前 270 創始編號 + 親手 onboard + 年度 + LINE 群 +
                未來實體聚會」很容易 surface-level 聯想到 MLM/安麗式
                「限量早期合夥人」框架 · 但 ZONE 27 經濟結構跟 MLM 完全
                相反。先前這個 disambiguation 埋在 /founders + /audit +
                /manifesto 多處 · 沒有任何一處主動 surface。Pratfall +
                Costly Signaling pattern · 主動 distance 比 reactive
                clarify 強。 */}
            <div className="mt-8 border border-loss/30 bg-loss/5 p-5 sm:p-6">
              <p
                lang="en"
                className="font-mono text-loss text-[10px] tracking-[0.4em] mb-3"
              >
                ▲ NOT MLM · 結構防線
              </p>
              <P className="!mb-3">
                <strong className="text-bone">這結構長得像 MLM 嗎?</strong>{" "}
                表面有幾個 visual cue 確實會被聯想:創始編號(前 270)·
                年度會員 · Tim 親手 onboard · 未來 LINE 群 + 實體聚會。
                但 ZONE 27 的經濟結構跟 MLM / 安麗式平台
                <strong className="text-bone">完全相反</strong>。
              </P>
              <ul className="list-none pl-0 space-y-2 text-sm font-mono text-mute">
                <li>
                  <span className="text-loss/80">✕</span> MLM downline 抽佣 →{" "}
                  <span className="text-bone">ZONE 27 · 零 multi-level compensation</span>
                </li>
                <li>
                  <span className="text-loss/80">✕</span> MLM 推薦獎金 / referral bonus →{" "}
                  <span className="text-bone">ZONE 27 · 沒有任何推薦獎金</span>
                </li>
                <li>
                  <span className="text-loss/80">✕</span> MLM 業績 quota →{" "}
                  <span className="text-bone">Founders 27 年度付款 · 沒 quota</span>
                </li>
                <li>
                  <span className="text-loss/80">✕</span> MLM 強制庫存 →{" "}
                  <span className="text-bone">沒實體商品 · 引擎免費</span>
                </li>
                <li>
                  <span className="text-loss/80">✕</span> MLM「成功學」/ 畫餅訓練 →{" "}
                  <span className="text-bone">沒任何 sales-script · 沒洗腦營</span>
                </li>
                <li>
                  <span className="text-loss/80">✕</span> MLM 無限招募下線 · 每層抽佣 →{" "}
                  <span className="text-bone">會員不限量 · 但零多層抽佣 · 每位都是平台直接關係</span>
                </li>
              </ul>
              <P className="text-mute/70 !mb-0 mt-4 text-sm">
                BLACK CARD 創作者抽成 10% = platform fee(類 Stripe / Spotify) ·
                Founders 27 創作者抽成 5%(BLACK CARD 的一半 · 不是 referral kick-back)。
                前 270 創始編號是 <strong className="text-bone">Costly Signaling</strong> · 不是招募階梯。
                創始會員是
                <strong className="text-bone">扛了品牌風險的早期支持者的補償</strong> ·
                不是未來業績的領先指標。
              </P>
            </div>
            <P className="text-mute/70">
              現場版完整聲明見{" "}
              <Link
                href="/lab/custom"
                className="text-gold hover:underline underline-offset-4"
              >
                /lab/custom
              </Link>{" "}
              hero footer · FAQ 對照清單見{" "}
              <Link
                href="/faq#mlm"
                className="text-gold hover:underline underline-offset-4"
              >
                /faq · ZONE 27 跟傳銷有什麼不同
              </Link>
              。
            </P>
          </AxiomSection>

          {/* R155 W3 · VsRowFold 3rd placement · Agent C R155 synthesis ·
              canonical philosophical surface 跟 /founders + /pricing/why
              conversion surfaces 隔離 · 0 surface prop = manifesto-default
              variant · contrastive 行業 vs ZONE 27 axis row visualization ·
              per [[feedback-zone27-psychology-ux-axis]] · Pirolli & Card 1995
              Information Foraging + Tversky & Kahneman 1981 contrast-frame
              cited · 4 axiom 對照表 跟 manifesto 4-axiom body 平行 binding。 */}
          <VsRowFold />

          {/* ── III · COVERAGE ──────────────────────── */}
          <AxiomSection
            roman="III"
            label="COVERAGE"
            zh="引擎能誠實算的才覆蓋"
            industry="覆蓋全部可下注賽事 (越多上架 · 越多抽佣機會)"
            zone27="只覆蓋引擎驗證過、誠實能算的賽事 · 拒絕為了量犧牲信號品質"
          >
            <P>
              <strong className="text-bone">行業為什麼覆蓋全部:</strong>{" "}
              運彩 / 報馬仔平台的收入線性綁定上架賽事數 — 多一場 CPBL
              次級聯盟 · 多一場 K-League · 多一場非洲冠軍盃 = 多一條抽佣管道。
              這套商業模式底下,
              <strong className="text-bone">引擎能不能算 ≠ 該不該上架</strong>。
            </P>
            <P>
              <strong className="text-bone">誰因此受害:</strong>{" "}
              當訪客拿到「兄弟 vs 統一 62 : 38」這種輸出 · 看起來跟
              「非洲第三聯賽 A vs B 55 : 45」一模一樣的卡片 · 但事實上
              第二場引擎根本沒有可信的輸入資料,輸出是隨機數加包裝。
              訪客以為兩者同等可信 · 押的賭注是在被誤導之上。
            </P>
            <P>
              <strong className="text-bone">這個倒置讓我們失去什麼:</strong>{" "}
              當下{" "}
              <Link href="/coverage" className="text-gold hover:underline underline-offset-4">
                /coverage
              </Link>{" "}
              頁面承認我們只覆蓋 MLB + Tim 親手 ingest 過的 CPBL 場次(目前 N=1)—
              比運彩平台的數百場少了兩個數量級。
              這個小覆蓋面意味著流量上限低 · 訪客回訪率低 ·
              「來 ZONE 27 看今天有什麼」這個習慣難以建立。
            </P>
            <P>
              <strong className="text-bone">為什麼我們接受這個代價:</strong>{" "}
              品牌的核心資產是訊號品質。一旦我們上架一場引擎其實算不準的賽事 ·
              說服力立刻全面打折 — 所有頁面上的 K/9 · BB/9 · HR/9 數字都
              變得「可能也是這樣亂寫的」。
              <strong className="text-bone">覆蓋率可以慢慢長 · 信任一旦丟就回不來</strong>。
            </P>
            <P className="text-mute/70">
              完整 curation 名單見{" "}
              <Link href="/coverage" className="text-gold hover:underline">
                /coverage · CPBL HAND-CURATED
              </Link>
              。
            </P>
          </AxiomSection>

          {/* ── IV · PRIVACY ────────────────────────── */}
          <AxiomSection
            roman="IV"
            label="PRIVACY"
            zh="零第三方追蹤"
            industry="Google Analytics + Facebook Pixel + Hotjar + 全套廣告 retargeting"
            zone27="0 第三方 cookies · 0 trackers · 0 pixels · 0 session recording"
          >
            <P>
              <strong className="text-bone">行業為什麼追蹤:</strong>{" "}
              個人化能讓轉換率提升 15-30% · retargeting 廣告 ROAS 平均高
              5-8 倍 · A/B testing 讓產品決策有數據根據。
              現代行銷的整套 playbook 就是建立在「我們知道訪客每一步動作」這個前提上。
            </P>
            <P>
              <strong className="text-bone">誰因此受害:</strong>{" "}
              訪客 — 但他們大多不知道。
              一次造訪可能在背後觸發 8-12 個追蹤腳本 · 把 IP、瀏覽器指紋、
              滑鼠軌跡、停留時間全部送進 Google / Meta / TikTok 的廣告聯播網。
              這些資料後續被用來在訪客其他網站做 retargeting · 在他
              不知情的狀態下持續追蹤一輩子。
            </P>
            <P>
              <strong className="text-bone">這個倒置讓我們失去什麼:</strong>{" "}
              我們無法做 A/B testing(看不到使用者行為差異)·
              無法做 retargeting 廣告(沒有 audience pool)·
              無法精細測量行銷 funnel 各階段轉換率。
              這些是現代行銷 SaaS 的標準動作,我們全部放棄。
            </P>
            <P>
              <strong className="text-bone">為什麼我們接受這個代價:</strong>{" "}
              因為我們本來就不打廣告 — 沒有 audience profiling 的需求 ·
              沒有 retargeting 的對象。
              真正的回饋管道是 Founders 27 直接寫信給創辦人 ·
              這比任何 heatmap 都精確一千倍。
              <strong className="text-bone">放棄追蹤的代價剛好是 0</strong> —
              我們失去的能力本來就不在我們的成長路徑上。
            </P>
            <P className="text-mute/70">
              完整不追蹤清單見{" "}
              <Link href="/privacy" className="text-gold hover:underline">
                /privacy
              </Link>{" "}
              Section 03 · WHAT WE DELIBERATELY DON&apos;T COLLECT。
            </P>
          </AxiomSection>

          {/* ── SHAREABLE PULL-QUOTE ──────────────────── */}
          <blockquote
            className="mt-16 mx-auto max-w-2xl border-l-2 border-gold/60 pl-6 sm:pl-8 py-2 font-light text-bone text-2xl sm:text-3xl leading-snug"
            style={{ textWrap: "balance" }}
          >
            &ldquo;每一個{" "}
            <span className="text-gold">「我們不做」</span>,
            都是{" "}
            <span className="text-gold">「我們是誰」</span>{" "}
            的證明。&rdquo;
            <footer className="mt-4 font-mono text-mute text-[10px] tracking-[0.3em] not-italic">
              — ZONE 27 倒置宣言 {MANIFESTO_VERSION} · 上方四個倒置詳列
            </footer>
          </blockquote>

          {/* ── V · SYNTHESIS · 方法公開 · 品味私藏 ─────
              Crystallizes the 4 axioms into a single operational
              principle. The 8-character framing distinguishes ZONE
              27 from BOTH closed AI labs (藏一切) AND naive
              "everything public" indie projects (沒可賣的東西).
              Public + Private coexist intentionally · this is
              what makes the model defensible. */}
          <section className="pt-16 pb-2 mt-12 border-t border-line/40">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-mono text-gold/70 text-[11px] tabular tracking-[0.3em]">
                V
              </span>
              <h2 className="font-mono text-bone text-[11px] tracking-[0.3em]">
                SYNTHESIS · 方法公開 · 品味私藏
              </h2>
            </div>
            <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-snug mb-8">
              SHOW YOUR WORK ·
              <br />
              <span className="text-gold">KEEP YOUR SOUL.</span>
            </h3>

            <div className="space-y-5 zh-body text-mute text-base leading-relaxed max-w-2xl">
              <P>
                4 個倒置濃縮成一句話:
                <strong className="text-bone">
                  「公開複製不走的算法,藏複製不走的人 + 品味 + 社群」
                </strong>
                。
              </P>
              <P>
                這跟「全部公開」(naive indie)不一樣,也跟「全部藏」(closed AI lab)
                不一樣。是兩個世界都要:
              </P>
            </div>

            {/* ── 2-column SHOW vs KEEP ──────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-10 mb-10">
              {/* 公開 */}
              <div className="border border-line/60 p-6 sm:p-7 bg-slate/30">
                <p
                  lang="en"
                  className="font-mono text-mute text-[10px] tracking-[0.3em] mb-5"
                >
                  PUBLIC · 攤陽光下 · 訪客可驗證
                </p>
                <ul className="space-y-2.5 text-mute text-sm leading-relaxed list-none pl-0">
                  <SynthItem>演算法 · 程式碼 · GitHub source</SynthItem>
                  <SynthItem>方法論 · 假設 · 排除清單</SynthItem>
                  <SynthItem>商業模式 · 完整定價結構</SynthItem>
                  <SynthItem>不收集什麼 · 不做什麼</SynthItem>
                  <SynthItem>本身就是公開的事(sabermetric 累積知識 · 圖書館 / Wikipedia)</SynthItem>
                </ul>
                <p className="mt-6 pt-4 border-t border-line/40 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
                  公開的事 fork 走無意義 · 信任卻能換來
                </p>
              </div>

              {/* 私藏 */}
              <div className="border border-gold/40 p-6 sm:p-7 bg-gold/5 glow-soft">
                <p
                  lang="en"
                  className="font-mono text-gold text-[10px] tracking-[0.3em] mb-5"
                >
                  PRIVATE · 訪客買不到的特權 · 限定身分
                </p>
                <ul className="space-y-2.5 text-bone text-sm leading-relaxed list-none pl-0">
                  <SynthItem gold>
                    270 個 Founders 身分(全宇宙只有 270 個)
                  </SynthItem>
                  <SynthItem gold>
                    Founders LINE 群對話(關門的)
                  </SynthItem>
                  <SynthItem gold>
                    Tim 每日策展焦點(人工 · BLACK CARD 訂閱限定)
                  </SynthItem>
                  <SynthItem gold>
                    每週工程筆記(BLACK CARD 訂閱限定)
                  </SynthItem>
                  <SynthItem gold>
                    線上工作坊 + 模型 voting / preview(訂閱限定)
                  </SynthItem>
                </ul>
                <p className="mt-6 pt-4 border-t border-gold/30 font-mono text-gold text-[10px] tracking-[0.25em] leading-relaxed">
                  Tim 本人 · 27 年品味 · 不可能 fork
                </p>
              </div>
            </div>

            <div className="space-y-5 zh-body text-mute text-base leading-relaxed max-w-2xl">
              <P>
                <strong className="text-bone">這個 framing 解決兩個矛盾:</strong>
              </P>
              <List>
                <Item label="假厲害 vs 真厲害">
                  「藏算法」是假厲害(對手 30 分鐘 fork 就拆穿)。
                  「藏 270 個身分 + Tim 的品味」是真厲害(本來就 fork 不走)。
                </Item>
                <Item label="信任 vs 神秘感">
                  「全部攤」訪客信任你(可驗證)。
                  「保留訂閱者特權」訪客還是想加入(因為神秘感)。
                </Item>
                <Item label="紅海 vs 藍海">
                  「假裝有秘密」進的是紅海(LINE 老師 / 報馬仔 / 殺手平台 50+ 個競品)。
                  「公開方法 + 私藏身分」進的是藍海(0 競品)。
                </Item>
              </List>
              <P className="text-mute/70">
                世界級案例驗證這套模式:Patagonia(供應鏈公開 · 品牌身分認同)·
                Plausible(source code 在 GitHub · 收 $19/月) · Stratechery
                (內容半免費 · USD $12/月)· Signal(完全開源 · 靠捐款 + 信任活)·
                The Athletic(比分免費 · 訂閱買編輯品味)。
              </P>
            </div>
          </section>

          {/* ── VI · CLOSING · WHO IS THIS FOR ────────── */}
          <section className="pt-16 pb-2 mt-12 border-t border-line/40">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-mono text-gold/70 text-[11px] tabular tracking-[0.3em]">
                VI
              </span>
              <h2 className="font-mono text-bone text-[11px] tracking-[0.3em]">
                WHO THIS IS FOR
              </h2>
            </div>
            <div className="space-y-5 zh-body text-mute text-base leading-relaxed max-w-2xl">
              <P>
                這份宣言不是寫給所有人。
                <strong className="text-bone">是寫給三種人:</strong>
              </P>
              <List>
                <Item label="硬核棒球迷">
                  看比賽時自己會算 wOBA、WAR、xFIP 的人。對運彩平台的色情化包裝
                  反感、想要乾淨的數據與透明的方法論。
                </Item>
                <Item label="工程師同好">
                  習慣讀 paper、檢查 source code、會 fork repo 自己跑驗證的人。
                  你 30 分鐘可以複製我們的引擎 — 我們知道。
                </Item>
                <Item label="厭惡掠奪式平台的人">
                  曾經被「保證命中」「大師明牌」這類話術騙過,
                  想找一個明確說「我們只算機率,不保證任何結果」的品牌。
                </Item>
              </List>
              <P>
                如果你不屬於這三種,
                <strong className="text-bone">ZONE 27 不適合你</strong> —
                我們不打算說服你。市場上有很多適合所有人的平台。
              </P>
              {/* Round 12 funnel-audit: manifesto is the strongest self-
                  selection filter in the funnel. Anyone finishing it
                  has self-identified as fit. Leaving them with only
                  footer links wastes the highest-quality conversion
                  moment in the entire funnel. The conditional framing
                  ("如果...點頭超過 3 次") preserves Pratfall voice — it
                  still explicitly tells unfit visitors to skip. */}
              {FOUNDERS_REMAINING > 0 && (
                <P className="mt-8 text-mute/80">
                  如果這 4 個倒置讓您點頭超過 3 次 ·{" "}
                  <Link
                    href="/founders"
                    className="text-gold underline-offset-4 hover:underline"
                  >
                    這 {FOUNDERS_REMAINING} 個創始編號是為您留的
                  </Link>
                  。
                </P>
              )}
            </div>
          </section>

          {/* ── FOOTER · SIGN-OFF ─────────────────────── */}
          <footer className="pt-12 mt-12 border-t border-line/60">
            <p className="font-mono text-mute text-[11px] tracking-[0.25em] mb-6">
              VERIFY THIS MANIFESTO
            </p>
            <ul className="space-y-3 text-sm text-mute leading-relaxed">
              <li>
                ▸ 倒置 I · 完整 model report:{" "}
                <Link href="/audit" className="text-gold hover:underline">
                  /audit
                </Link>{" "}
                — 7 sections · 引擎範圍 + 揭露哲學 + LocalStorage + v0.3 ESTIMATE
              </li>
              <li>
                ▸ 倒置 II · 引擎工具免費:{" "}
                <Link href="/lab" className="text-gold hover:underline">
                  /lab
                </Link>{" "}
                + {" "}
                <Link href="/lab/custom" className="text-gold hover:underline">
                  /lab/custom
                </Link>{" "}
                — 在您瀏覽器內跑 10,000 場模擬
              </li>
              <li>
                ▸ 倒置 III · 親手 curation 範圍:{" "}
                <Link href="/coverage" className="text-gold hover:underline">
                  /coverage
                </Link>
              </li>
              <li>
                ▸ 倒置 IV · 不追蹤清單:{" "}
                <Link href="/privacy" className="text-gold hover:underline">
                  /privacy
                </Link>{" "}
                Section 03
              </li>
              <li>
                ▸ 完整原始碼:{" "}
                <ExtLink href="https://github.com/Tim-xuan-you/zone27-web">
                  github.com/Tim-xuan-you/zone27-web
                </ExtLink>
              </li>
            </ul>

            <p className="mt-12 font-mono text-mute text-[10px] tracking-[0.25em]">
              本文件採 ZONE 27 Engineering Disclosure 規範 · 任何版本變動
              於 GitHub commits 留存 · 不可被刪除
            </p>

            <div className="mt-10 flex items-center justify-center">
              <CopyLinkButton />
            </div>
          </footer>
        </article>

        <RelatedReading currentPath="/manifesto" />
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function MetaPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-mute/70 mb-1 tracking-[0.25em]">{label}</dt>
      <dd className="text-bone tabular">{value}</dd>
    </div>
  );
}

function AxiomSection({
  roman,
  label,
  zh,
  industry,
  zone27,
  children,
}: {
  roman: string;
  label: string;
  zh: string;
  industry: string;
  zone27: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-12 pb-2 mt-12 border-t border-line/40">
      <div className="flex items-baseline gap-4 mb-3 section-reveal">
        <span className="font-mono text-gold/70 text-[11px] tabular tracking-[0.3em]">
          {roman}
        </span>
        <h2 className="font-mono text-bone text-[11px] tracking-[0.3em]">
          {label}
        </h2>
      </div>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight mb-8">
        {zh}
      </h3>

      {/* INDUSTRY ❌ vs ZONE 27 ✓ row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-10 border-y border-line/30 py-6">
        <div>
          <p
            lang="en"
            className="font-mono text-mute/60 text-[10px] tracking-[0.3em] mb-2"
          >
            INDUSTRY
          </p>
          <p className="text-mute text-sm leading-snug line-through decoration-mute/40">
            {industry}
          </p>
        </div>
        <div>
          <p
            lang="en"
            className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2"
          >
            ZONE 27
          </p>
          <p className="text-bone text-sm leading-snug">{zone27}</p>
        </div>
      </div>

      <div className="space-y-5 zh-body text-mute text-base leading-relaxed max-w-2xl">
        {children}
      </div>
    </section>
  );
}

function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`leading-relaxed ${className}`}>{children}</p>;
}

function SynthItem({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-3">
      <span
        aria-hidden="true"
        className={`font-mono text-[10px] tracking-[0.2em] shrink-0 ${
          gold ? "text-gold" : "text-mute/60"
        }`}
      >
        ▸
      </span>
      <span className="flex-1">{children}</span>
    </li>
  );
}

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2.5 list-none pl-0">{children}</ul>;
}

function Item({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-baseline gap-3 sm:gap-4 text-sm sm:text-base">
      <span className="font-mono text-gold/70 text-[11px] tracking-[0.15em] shrink-0 sm:w-44 sm:max-w-44">
        {label}
      </span>
      <span className="text-mute leading-relaxed flex-1">{children}</span>
    </li>
  );
}
