import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import PreTransferReceipt from "@/components/PreTransferReceipt";
import NonComparableAnchor from "@/components/NonComparableAnchor";
import MultiYearAnchor from "@/components/MultiYearAnchor";
import GenerationsLine from "@/components/GenerationsLine";
import CopyLinkButton from "@/components/CopyLinkButton";
import CredentialStack from "@/components/CredentialStack";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";
import { getWaitlistCount } from "@/lib/waitlist-stats";

export const metadata: Metadata = {
  title: "Founders 27 · NT$ 2,700 終身會員 · 限量 270 名",
  description:
    "ZONE 27 創始會員資格 · 一次付清 NT$ 2,700,終身免費 · 270 名額滿即永久關閉,不會有第二批 · 9 個月達損益平衡,之後每年省下 NT$ 3,588。",
};

// R40 perf agent finding · was 60s ISR overhead · founders state is
// hardcoded(claimedFounders array)not live API · 60s ISR triggers
// Vercel Function invocations unnecessarily。 3600s(1hr)fallback cache
// only · git push 觸發 redeploy when claimedFounders update Q3 onboard。
export const revalidate = 3600;

// R63 W-B · Agent 5 SHIP #5 · 「What your NT$ 2,700 didn't buy」 list ·
// FanGraphs honest limitation pattern · concentrate 11-item NOT-DO list at
// /founders decision point · brand IP triple-fire(Pratfall + Costly Signaling +
// Disclosure)· Differentiator from LINE 老師 / 報馬仔 / 投顧老師 schemes ·
// 6 items selected for direct buyer-expectation gap close。
const DOLLAR_DIDNT_BUY: { what: string; why: string }[] = [
  {
    what: "明牌 / 內幕消息",
    why: "ZONE 27 不接受下注 · 不出彩金 · 不撮合對賭 · 沒有「老師明牌」 可以給 · per /transparency#section-02",
  },
  {
    what: "Tim 私人 DM access",
    why: "Tim 親手 reply email · 但不開個人 LINE / DM channel · 客戶 ≠ 朋友 · 全 270 同等對待 · Berkshire annual letter pattern",
  },
  {
    what: "排他 Discord / 私群 community",
    why: "ZONE 27 brand IP「不 ship user-to-user social platform」 · 永遠無 community / forum / 私群 / 排他 channel · per 11-item NOT-DO list",
  },
  {
    what: "Founders 27 投票權",
    why: "Tim 一手決定 product direction · /now journal 公開 + /roadmap LOCKED/EXPLORING 兩段 · 270 holders 不 vote · brand 不是 DAO · 不裝 community 民主",
  },
  {
    what: "免費 BLACK CARD 季票",
    why: "Founders 27 = lifetime full access · 但不送 BLACK CARD subscription · 兩個 product 分開 · 想要 BLACK CARD CPBL 季票 NT$ 1,500/season 另付 · 同 The Athletic+FanGraphs Plus 不互送",
  },
  {
    what: "保證 ROI / 賺錢承諾",
    why: "ZONE 27 是 data publisher · 不是 advisor · 不 promise 您下注賺錢 · 不算 sponsor 投資建議 · 同 Taiwan 投顧 license analogy · 公開可驗證 · 不收下注佣 · 不推薦投注",
  },
];

const benefits = [
  {
    no: "01",
    zh: "終身會員資格",
    en: "LIFETIME ACCESS",
    body: "一次性 NT$ 2,700,永久解鎖未來所有功能。BLACK CARD 季票 NT$ 1,500/season 對您完全免費,終身。",
  },
  {
    no: "02",
    zh: "鑲金編號徽章",
    en: "NUMBERED BADGE · #001-#270",
    body: "個人 ID 永久鑲入創始編號徽章,在動態牆、明牌、聊天室都會顯示。是身分,也是勳章。",
  },
  {
    no: "03",
    zh: "創作者零抽成",
    en: "0% PLATFORM FEE",
    body: "如果您也是預測創作者,creator 抽成 100% 全拿(BLACK CARD creators 5% 給平台 · 您完全 0%)。 對比 LINE 老師 / 投顧老師業界 30-50% 是降維打擊。",
  },
  {
    no: "04",
    zh: "BOTTOM 27 共生",
    en: "ECOSYSTEM CROSS-PASS",
    body: "未來 BOTTOM 27 棒球手遊上線,自動空投創始限定球員卡、稀有球場代幣、終身贊助商徽章。",
  },
  {
    no: "05",
    zh: "AI 模型優先試用",
    en: "PRIORITY PREVIEW",
    body: "每一次 AI 模型迭代(打席矩陣升級、新球種變數)創始會員提前 7 天試用,並可投票決定下一步迭代方向。",
  },
  {
    no: "06",
    zh: "實體尊榮招待",
    en: "PREMIUM HOSPITALITY",
    body: "出示創始會員 QR Code 至恆美攝影 × 伶 Kopi 旗艦店,免費招待一杯冰鎮頂級一品紅茶。終身有效。",
  },
];

// ── Tier comparison data — single source for the comparison table
// Tier definitions live in CLAUDE.md (商業模式定錨).
const TIERS = [
  {
    name: "FREE",
    zh: "自由訪客",
    price: "NT$ 0",
    priceNote: "永久免費",
    highlight: false,
    rows: {
      data: "基本(可看)",
      participate: "—",
      fee: "—",
      badge: "—",
      bottom27: "—",
      preview: "—",
      hospitality: "—",
      cap: "無限",
    },
  },
  {
    name: "BLACK CARD",
    zh: "CPBL 季票",
    price: "NT$ 1,500",
    priceNote: "每季 · LIVE manual ECPay · 0 auto-renewal · per /integrity rule #13",
    highlight: false,
    rows: {
      data: "完整",
      participate: "✓",
      fee: "創作者抽 5%",
      badge: "—",
      bottom27: "—",
      preview: "—",
      hospitality: "—",
      cap: "無限",
    },
  },
  {
    name: "FOUNDERS 27",
    zh: "創始會員",
    price: "NT$ 2,700",
    priceNote: "一次性 · 終身 · 不再開放",
    highlight: true,
    rows: {
      data: "完整 + 優先試用",
      participate: "✓",
      fee: "創作者抽 0%",
      badge: "✓ #001-#270",
      bottom27: "✓",
      preview: "✓ 7 天",
      hospitality: "✓",
      cap: "270 · 永遠關閉",
    },
  },
] as const;

const COMPARE_ROWS = [
  { key: "data", label: "數據存取", en: "DATA" },
  { key: "participate", label: "參與預測", en: "PARTICIPATE" },
  { key: "fee", label: "創作者抽成", en: "CREATOR FEE" },
  { key: "badge", label: "編號徽章", en: "BADGE" },
  { key: "bottom27", label: "BOTTOM 27 空投", en: "AIRDROP" },
  { key: "preview", label: "AI 模型優先試用", en: "MODEL PREVIEW" },
  { key: "hospitality", label: "實體招待", en: "HOSPITALITY" },
  { key: "cap", label: "名額", en: "CAP" },
] as const;

// ── Inline FAQ — Round 52 W-E · Agent 1 #1 ship · 從 3 → 10 Q · HEY pricing
// pattern「pre-empt the 5-7 concrete fears」 · 訪客 buy-decision moment 直接
// surface 對抗 silent objections · 不必跳 /faq 求解。 Plain bullets · no
// marketing tone · Pratfall pattern「主動 publish redlines IS the signal」。
const INLINE_FAQ = [
  {
    q: "我怎麼知道這不是 vaporware?",
    a: "原始碼公開在 GitHub(連結在 footer)。蒙地卡羅引擎已經在 /lab 跑得到,您可以親自跑 10,000 次模擬看收斂過程。版本紀錄在 /changelog 從 v0.1 到 v0.28 都看得到 — 每一個版本都是真的上線。賽後實際結果則在 /track-record 公開累積。",
  },
  {
    q: "現在留 email 就要付錢嗎?",
    a: "不收費、不綁定、隨時可退出。留 email 同時 = 進入免費訂閱層(永久免費 · launch 後也存在)+ Founders 27 預售名單(payment infra 就緒後開放時優先通知 · milestone-triggered · 不綁日期)。真正付款是當您主動選擇升級到 Founders 27(NT$ 2,700 終身)或 BLACK CARD(NT$ 1,500/season)· 我們不催。Founders 27 付款後 14 天無條件退款保證。",
  },
  {
    q: "這是博彩平台嗎?",
    a: "不是。ZONE 27 計算的是機率分布,從不販售「鐵口直斷」。我們不接受運彩抽成、不寄生報馬仔生態、不買廣告投放。商業模式是會員制(BLACK CARD 季票 + Founders 27 一次性)+ 未來 Premium Sponsor。詳見 /about /faq。",
  },
  // Round 52 W-E · Agent 1 #1 · 7 concrete fears added · HEY pricing model:
  {
    q: "如果 270 個席位賣完前我還在猶豫怎麼辦?",
    a: "/founders/ledger 每週手寫更新分配進度。 您可以隨時 check ledger 看「目前 N/270」 + 拒絕原因 sample。 沒有 live counter 製造 FOMO · 但有 weekly transparency。 售完即永久關閉 · 不會有第二批 — 這也是 brand IP 物理 codify(不是 marketing pressure)。",
  },
  {
    q: "如果我加入後反悔想退款?",
    a: "付款後 14 天無條件退款保證(Founders 27 + BLACK CARD 都適用)。 寫信 tatayngiti@gmail.com 即可 · 不問原因 · 不嘗試挽留。 退款後您仍保留所有已下載的 GitHub source code + methodology docs(MIT licensed · 我們不能 revoke)。",
  },
  {
    q: "手動銀行轉帳具體流程?",
    a: "(1)Founders 27 開放後 · 您 email tatayngiti@gmail.com 表達意願 ·(2)Tim 24h 內回覆銀行 4 欄位 + 您專屬 ZONE27-#NNN 備註碼 ·(3)您匯款 NT$ 2,700 · 備註寫 ZONE27-#NNN ·(4)Tim 確認入帳後寄 lifetime access confirmation + Founders LINE 群邀請。 全程 Tim 親手 onboard · 沒有 cron · 沒有外包(per /coverage philosophy)。",
  },
  {
    q: "BLACK CARD 上線後我 Founders 27 status 會變嗎?",
    a: "不會。 Founders 27 是 lifetime 第 4 階 · 包含未來所有 BLACK CARD unlocks(v0.3 + v0.4 engine + 創作者抽成 0%(BLACK CARD 是 5%)+ 每月 voting + Tim 工程筆記 full + LINE 群)。 Founders 27 是 floor not sidegrade · 您買的 270 個 seat 是 ZONE 27 整個系統永久 root identity · 不會 dilute。",
  },
  {
    q: "Tim 會存我什麼資料?",
    a: "(1)Email(magic link 用 · Supabase Tokyo · RLS-locked · 0 server-side analytics)·(2)Founders 27 銀行轉帳 ZONE27-#NNN 備註碼 + 您姓名(public ledger 用 · per /founders/ledger)。 不存:身分證 / 信用卡 / 電話 / 地址 / IP / 瀏覽行為。 完整 inventory 見 /privacy + /transparency。",
  },
  {
    q: "可以贈送 Founders 27 給朋友嗎?",
    a: "可以。 Founders 27 是 lifetime seat · transferable · 寫信 tatayngiti@gmail.com 說「我要轉讓 #NNN 給某某人(對方 email)」 · Tim 24h 內 update ledger + 寄新 owner confirmation。 受贈人也享 14 天無條件退款保證(從 ledger update 日起算)。",
  },
  {
    q: "如果我之後不喜歡 ZONE 27 的 methodology 怎麼辦?",
    a: "您可以 fork GitHub repo 用自己的 methodology · MIT license 允許。 ZONE 27 的 methodology 持續 publish · 每次重大改動 30 天前 /changelog 公告(per /audit S05 PRE-COMMIT)。 您不喜歡 = 您可以反饋 + 我們聽 · 但不 retroactive 改 / 不 silently rotate。 還是不滿意 · 14 天內 refund · 不挽留。",
  },
] as const;

export default async function FoundersPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const refSource = typeof params.ref === "string" ? params.ref : undefined;
  const waitlistCount = await getWaitlistCount();
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
      {/* ── HERO · Round 8 mobile compress (per Round 5 lesson) ─────
          Previously pt-24 + text-5xl on mobile = ~800px hero alone.
          Visitors arriving via sticky CTA bar from another page were
          seeing only "FOUNDERS · 27" badge in first viewport · had
          to scroll twice before reaching the offer. Compressed to
          ~400px on mobile · 0 desktop change. */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-10 sm:pt-24 pb-8 sm:pb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-5 sm:mb-8 font-mono text-[9px] sm:text-[10px] tracking-[0.4em]">
          <span className="text-gold">FOUNDERS · 27</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            PRE-LAUNCH WAITLIST
          </span>
        </div>

        {/* Round 14 brand-IP amplification(Agent A #1 · Patek/Cartier
            serial-number specificity)→ Round 31 W-X2 Hermès process
            transparency pivot · 砍 「263 席剩」 FOMO e-commerce script
            kid pattern · 改 Patek specificity + 「永不再開」 · agent
            ONE deepest call:「我們公布分配規則 · 不公布 live counter ·
            每週手寫更新 ledger」 per Hogan Lovells exclusivity-scarcity
            legal boundaries · per Hermès workshop transparency pattern。 */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          NEXT IS{" "}
          <span className="text-gold tabular">{formatBadge(FOUNDERS_NEXT)}</span>
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl text-mute">
            (共 {FOUNDERS_TOTAL} 名 · 永不再開)
          </span>
        </h1>

        {/* Round 31 W-X2 · Hermès process transparency · 砍 live counter
            FOMO · 改 allocation rules cross-link · 每週手寫更新 ledger
            per /founders/ledger pattern · brand IP「方法公開·品味私藏」
            延伸:分配規則公開到極致(誰被 reject · 為什麼)· 但 live count
            不 expose。 */}
        <p className="mt-4 sm:mt-5 font-mono text-mute text-sm sm:text-base tabular tracking-[0.2em] leading-relaxed">
          NT$ 2,700
          <span className="text-mute/60 mx-2">·</span>
          終身
          <span className="text-mute/60 mx-2">·</span>
          <Link
            href="/founders/ledger"
            className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
            title="分配公開帳本 · 每週手寫更新 · 拒絕原因 sample 去 PII · 4 brand IP axiom 同時 fire"
          >
            分配規則公開帳本 →
          </Link>
        </p>

        <p
          lang="en"
          className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-3 sm:mt-5"
        >
          ONE-TIME · LIFETIME · NEVER REOPENS
        </p>

        {/* Round 52 W-D · Agent 1 #3 fix ·「270 = Tim's personal-reply
            ceiling」 1-sentence justification · 之前 cap 看 arbitrary FOMO
            marketing number · 加 1 行 explain「不是 marketing number 是物理
            人力上限」 · 把 FOMO counter (banned axiom) 轉為 costly-signaling
            (brand axiom) · 違反 0 · 強化 brand IP。 Pinboard pattern。 */}
        <p className="mt-4 max-w-md mx-auto text-mute/85 text-xs sm:text-[13px] leading-relaxed">
          <span className="text-gold/90 font-medium">270</span>{" "}
          是一年 Tim 親手回覆 + 親筆 sign-off 的人力上限 · 不是 marketing
          number。 超過 Tim sustain 不來 · 名額就成{" "}
          <span className="text-loss/80">空頭支票</span> · 那 brand 自殺。
        </p>

        {/* R60 W-B · 「SHADOWLESS RUN」 framing · 整批 270 = 1st Edition
            relative to BLACK CARD ongoing renewal · 同 Pokemon TCG WoTC 1999
            Base Set 1st Edition / Shadowless 第一批 print run · 從未被 reprint ·
            PSA 10 1st Edition Shadowless Charizard 2024 Heritage 拍賣 $550K
            (vs Unlimited 同卡 low five figures = 10-50x premium · per
            cllct.com / heritage / bulbapedia 1st_Edition_TCG)。 binary tier
            機制(1st Edition vs Unlimited)是 Pokemon 經濟學的核心 driver ·
            不是 sub-tier · 是 print-run-of-record · 之後永遠不會再有 270 個
            seat opened。 同 [[zone27-payment-architecture]] 倒置 SaaS 手工
            稀缺 + Tim 「270 = 一年 sign-off ceiling」 axiom · brand IP
            triple-fire(disclosure-philosophy + pratfall + costly-signaling)。 */}
        <p className="mt-3 max-w-md mx-auto text-mute/70 text-[11px] sm:text-xs leading-relaxed">
          <strong className="text-bone">Founders 27</strong> = ZONE 27 的{" "}
          <span className="text-gold/90">1st Edition Shadowless Run</span> ·
          同 Pokemon Base Set 1999 第一批 print run · 售完即永久關閉 · BLACK
          CARD 訂閱者永遠無法 retroactively 升 Founders 27 ·{" "}
          <Link
            href="/founders/ledger"
            className="text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /founders/ledger
          </Link>
          {" "}記名追蹤。
        </p>

        {/* R63 W-C · Agent 5 SHIP #3 · CredentialStack · 3-credential founder
            portfolio block · Cameron Grove + Travis Sawchik indie analyst
            pattern · 「demonstrated impact over sales language」 · trust
            establishment 在 founder voice 之前 · 訪客自己 verify(不靠
            testimonial)· brand IP「方法公開」 + Pratfall(列 solo + 0
            investors) + audience-fans grammar(CPBL fan 27 yr)triple-fire。 */}
        <CredentialStack />

        {/* Round 52 W-D · Agent 1 #4 fix · Founder voice block at buy line
            · 之前 FROM THE FOUNDER 在 form 之後(R8 移)· 訪客 buy-decision
            moment 沒看到 Tim voice · 加 present-tense first-person 120-word
            block at hero · 直接上 BreakEvenCell 之前 · 同 Pinboard /
            Stratechery「founder's voice on the buy line itself」 pattern · 不
            轉 cold copy。 */}
        <div className="mt-7 sm:mt-9 max-w-xl mx-auto bg-slate/30 border-l-2 border-gold/60 px-5 py-4 text-left">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
          >
            DIRECTLY FROM TIM · 親筆 · 不是公關稿
          </p>
          <p className="text-bone text-[14px] sm:text-[15px] leading-relaxed mb-2">
            我寫這個引擎 · 是因為台灣硬核棒球迷沒有自己的 Bloomberg。
            玩運彩 + 報馬仔 + LINE 老師生態用「明牌」 框架對待您 — 我們不是。
            您現在看到的這頁 · 我親手寫 · 您加入 · 我親手回覆。
          </p>
          <p className="text-mute/90 text-[13px] sm:text-[14px] leading-relaxed mb-3">
            <strong className="text-bone">您不是在買明牌</strong> ·
            您是在買 270 個 lifetime seat 之一 · 加入 ZONE 27 整個系統的 floor。
            引擎永遠免費 · 您買的是身分 + 永久 access + 0% creator 抽成。
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mt-3 pt-3 border-t border-line/40">
            — TIM · SOLO FOUNDER · ZONE 27 · {new Date().getFullYear()}
          </p>
        </div>

        {/* Break-even math · Round 12 funnel-audit lifted the numbers
            out of body copy into a 3-cell bento. Mobile visitors skim
            (Kahneman System 1) · body copy was System 2 territory ·
            sharpest rational-buyer argument was invisible at the
            decision moment. Now the 3 numbers grab attention; the
            descriptive caption stays below as supporting text. */}
        <div className="mt-5 sm:mt-7 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto">
          <BreakEvenCell
            value="2"
            unit="個季"
            en="SEASONS TO BREAK-EVEN"
          />
          <BreakEvenCell
            value="2,700"
            unit="NT$ 一次"
            en="ONE-TIME · LIFETIME"
            gold
          />
          <BreakEvenCell
            value="3,000"
            unit="NT$ /年省"
            en="SAVED PER YEAR"
          />
        </div>
        <p className="mt-4 max-w-xl mx-auto text-mute text-xs sm:text-sm leading-relaxed text-center">
          與 BLACK CARD NT$ 1,500/season 比較 ·{" "}
          <span className="text-gold">2 個 CPBL 季即回本</span> · 之後終身免費
        </p>
        <p className="mt-2 max-w-xl mx-auto text-mute/70 text-[10px] sm:text-[11px] leading-relaxed text-center">
          完整定價邏輯 ·{" "}
          <Link
            href="/pricing/why"
            className="text-gold/80 hover:text-gold underline decoration-mute/40 underline-offset-4 hover:decoration-gold transition-colors"
          >
            /pricing/why →
          </Link>
        </p>
        <p
          lang="en"
          className="mt-2 font-mono text-mute text-[10px] tracking-[0.3em] text-center"
        >
          NO AUTO-RENEW · NO HIDDEN FEES · NEVER REOPENS
        </p>

        <p className="mt-6 sm:mt-10 max-w-xl mx-auto text-mute leading-relaxed text-sm sm:text-base">
          這 {FOUNDERS_TOTAL} 個編號將是 ZONE 27 永遠的傳教士。
          <br />
          一次入會,終身免費。售完即永久關閉,不會有第二批。
        </p>
        <p className="mt-3 sm:mt-4 max-w-xl mx-auto text-mute/70 text-xs sm:text-sm leading-relaxed">
          付款系統 payment infra 就緒後開放(milestone-triggered · 不綁日期)。先加入等候名單,優先取得購買權。
        </p>

        {/* Hero anchor CTA — visitors landing here from sticky CTA on
            another page shouldn't have to scroll-read the founder note
            before reaching the form. Brand-on minimal text link. */}
        <a
          href="#waitlist"
          className="inline-block mt-6 sm:mt-10 font-mono text-gold text-[11px] tracking-[0.4em] hover:text-gold-soft transition-colors"
        >
          ↓ 跳到等候名單
        </a>
      </section>

      {/* R68 W-G · Agent A SHIP 3 · PreTransferReceipt upgrade of R63 W-B
          4-point trust block · per taiwan.md trust-at-transfer creator-
          economy report · Patek SEA / MUJI Asia / Kinokuniya HK pattern ·
          show human choreography BEFORE checkout because Taiwanese cultural
          default is suspicion of automated wire transfers · NOT「secure
          checkout」 badges。 3 rows:01 您將收到 · 02 Tim 5-step choreography
          · 03 如果出錯了 · brand IP triple-fire(Pratfall ROW 3 + Disclosure
          choreography + costly signaling Tim 親眼 each step)。 */}
      <PreTransferReceipt />

      {/* R74 W-C · NonComparableAnchor · Agent A R73 SHIP 4 · Samuelson &
          Zeckhauser Status Quo Bias(1988)· counter「SaaS-with-team」
          default comparison frame · anchor against solo-durable-premium
          indie reference class · Pinboard + Tarsnap + Sublime Text + Drafts
          + Soulver + Pieter Levels · per [[feedback-zone27-pratfall-brand-
          ip]] publish-the-category-mismatch axiom · ZONE 27 unit economics
          axis 不是「SaaS minus team」 · 是 sustainability-not-growth · 1-
          author-voice · craft-not-headcount-leverage 的 category。 placement
          BETWEEN PreTransferReceipt + WaitlistForm · narrative:hero →
          handshake choreography → reference class anchor → form。 */}
      <NonComparableAnchor />

      {/* R75 W-D · MultiYearAnchor · Agent A R75 SHIP 2 ★★★★★ · FanGraphs
          3-yr tier solo-founder durability + Patek Philippe「Generations」
          1996 campaign + Stratechery cadence-promise · 3-line binding pre-
          commitment(engine FREE through 2029 + /audit + /methodology
          NEVER paywalled + Tim 失蹤 30 days → GitHub open-sources within
          30 days per /ethics BUS_FACTOR)· NOT payment tier · 是 durability
          statement · publish-before-asked-to-honor Costly Signaling 100×
          per Spence 1973。 placement BETWEEN NonComparableAnchor reference
          class + WaitlistForm · narrative:hero → handshake choreography →
          reference class → multi-year durability → form。 */}
      <MultiYearAnchor />

      {/* R75 W-G · GenerationsLine · Agent A R75 SHIP 3 · Patek Philippe
          1996「Generations」 campaign + Hanshin Tigers 二代目ファン
          generational identity grammar + family-recording-coach skill
          territory · 「您不是買 ZONE 27 · 您只是替下一代守 27 號席位」 ·
          inheritance grammar 物理 codify · cross-link to /founders/
          inheritance 4-section deep dive。 placement after MultiYearAnchor ·
          narrative:durability(across 5-year horizon)→ inheritance
          (across multi-generation horizon)。 */}
      <GenerationsLine />

      {/* ── WAITLIST FORM · Round 8 moved up to be 2nd block ────
          Was 3rd block (after FROM THE FOUNDER) · per Round 8 agent
          audit "+280px mobile scroll inserted between sticky-bar tap
          and form submission". Now form is the second touchpoint —
          sticky bar tap → hero scarcity → form. FROM THE FOUNDER
          moved below form so it warms returning visitors but doesn't
          block the conversion path. */}
      {/* R75 W-A · ClientErrorBoundary 5th wrap · code quality #4 5/5 complete ·
          per R73 W-A pattern · WaitlistForm risk-bearing client component
          (useActionState + server action + Supabase RLS call + Resend email +
          form state hydrate)· per [[zone27-disclosure-philosophy]]「不藏 broken
          state」 · component crash 不 take down /founders 主要 conversion path ·
          retry button + brand-pure fallback。 */}
      <section
        id="waitlist"
        className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-8 sm:pb-12 scroll-mt-20"
      >
        <ClientErrorBoundary fallbackLabel="WaitlistForm">
          <WaitlistForm waitlistCount={waitlistCount} refSource={refSource} />
        </ClientErrorBoundary>
      </section>

      {/* ── R68 W-A · APPLY CTA strip ───────────────────────
          Patek-style application form 1 layer deeper than waitlist email
          signup · for visitors who have already read /founders + accept
          6 「什麼不買到」 + /founders/ledger 5-step rules + /pricing/why
          rationale · 直接想 apply for #008-#270 founding seat。

          Per [[zone27-payment-architecture]] Founders 27 = manual bank
          transfer 是 INTENTIONAL · 此 form 是 PRE-REQUISITE before Tim
          sends bank details · NOT a payment form。

          Visual treatment 比 WaitlistForm 更 subdued · 是「您已決定 ·
          下一步」 destination 而非「正在 marketing」 surface · Patek
          allocation form 該 understated。 */}
      <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12 sm:pb-16">
        <div className="border-2 border-gold/40 bg-slate/40 p-6 sm:p-8">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
          >
            ⚓ READY TO APPLY · 您已決定?
          </p>
          <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-3">
            申請 Founders 27 創始席位 ·{" "}
            <span className="text-gold">Patek allocation form</span>
          </h3>
          <p className="text-mute text-sm sm:text-base leading-relaxed mb-5">
            上面留 email 是 free tier + waitlist · 您仍可慢慢決定。
            <strong className="text-bone">下面是直接 apply 表單</strong> ·
            Tim 親手 review 1-3 days · 通過後您收到銀行資訊 + 24h transfer
            window。 per /founders/ledger 5-step rules。
          </p>
          <Link
            href="/founders/apply"
            className="inline-block px-6 py-3 border border-gold text-gold text-xs sm:text-sm tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            申請 Founders 27 → /founders/apply
          </Link>
        </div>
      </section>

      {/* ── FREE EMAIL TIER CLARIFICATION · Round 21 ────────
          Tim 直覺(Round 21 三問之第 3):「加入會員一定要付錢?」
          答:不一定。WaitlistForm 目前被 framed 為「PRE-LAUNCH
          WAITLIST」· 訪客可能誤以為 launch 後就 expire 必須升級。
          實際 launch 後免費 email 層永遠存在(Stratechery /
          Plausible / Substack model)· launch 後從「waitlist」變成
          「free subscriber tier」 · 永久免費 · 隨時升級或退出。
          這個 clarifier 寫死 free tier permanence · 給「想留 email
          不想付錢」的人 explicit pathway · 對齊 [[zone27-monetization-
          philosophy]] 「engine FREE forever · identity PAID」 — 把
          「email 訂閱」明確列入 FREE side。 */}
      <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12 sm:pb-16">
        <div className="border-l-2 border-gold/40 pl-5 sm:pl-6 py-2">
          <p
            lang="en"
            className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3"
          >
            / FREE TIER · 免費永久訂閱
          </p>
          <p className="text-bone text-base sm:text-lg leading-relaxed mb-4 font-light">
            留 email 就是進入 <strong className="text-gold">ZONE 27 免費訂閱層</strong>。
            不只 pre-launch · launch 後也存在 · 永久免費。
          </p>
          <ul className="space-y-2.5 text-mute text-sm leading-relaxed list-none pl-0">
            <li className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0"
              >
                ▸
              </span>
              <span className="flex-1">
                <strong className="text-bone">模型重要迭代</strong> · 您是第一波知道的
              </span>
            </li>
            <li className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0"
              >
                ▸
              </span>
              <span className="flex-1">
                <strong className="text-bone">/track-record 重大 entry 提醒</strong> ·
                例如 N=30 統計門檻 · 大型 PROVED/DIVERGED
              </span>
            </li>
            <li className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0"
              >
                ▸
              </span>
              <span className="flex-1">
                <strong className="text-bone">不寄行銷信 · 不轉售 email</strong> ·
                隨時 reply UNSUBSCRIBE 退出
              </span>
            </li>
          </ul>
          <p className="mt-5 text-mute/80 text-xs sm:text-sm leading-relaxed">
            想升級成 Founders 27(NT$ 2,700 終身)或 BLACK CARD(NT$ 1,500/season · CPBL March-November · 0 auto-renewal)· 任時可選。也可<strong className="text-mute">永遠停在這層</strong>·
            <span className="text-gold"> 我們不催</span>。
          </p>
        </div>
      </section>

      {/* ── WHAT YOU'RE NOT BUYING ────────────
          Pre-empts the silent objection: "if engine is free + GitHub is
          public, what am I actually paying NT$ 2,700 for?" That doubt
          lives in every visitor's head and (today, 2026-05-20) lived in
          Tim's too. The 6 BENEFITS grid below answers what they GET; this
          section reframes the question itself — you're not buying utility
          (commoditized), you're buying identity (finite, founder-forged,
          fork-proof). Aligns with [[zone27-monetization-philosophy]] and
          /manifesto Section II MONETIZATION. */}
      <section
        aria-labelledby="not-buying-engine-heading"
        className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
          / 您不是在買引擎
        </p>
        <h2
          id="not-buying-engine-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4"
        >
          引擎免費 · 永遠免費。
        </h2>
        <p className="text-mute text-center text-sm sm:text-base mb-14 max-w-xl mx-auto leading-relaxed">
          您不必為引擎付錢 — 任何時候、任何方式都不用。
          <br />
          Founders 27 賣的不是工具,是 {FOUNDERS_TOTAL} 個 fork 不走的位置。
        </p>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {/* ── 左欄 · FREE FOREVER ── */}
          <div className="border border-line/60 p-6 sm:p-7 bg-slate/30">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.3em] mb-5"
            >
              FREE FOREVER · 永遠免費
            </p>
            <ul className="space-y-3 text-mute text-sm leading-relaxed list-none pl-0">
              <NotBuyingItem>
                跑無限次 10,000 場 Monte Carlo 模擬
              </NotBuyingItem>
              <NotBuyingItem>
                自訂任意投手對戰(K/9 · BB/9 · HR/9)
              </NotBuyingItem>
              <NotBuyingItem>
                讀完整 model report(/audit 7 sections)
              </NotBuyingItem>
              <NotBuyingItem>
                讀完整 methodology(/methodology)
              </NotBuyingItem>
              <NotBuyingItem>
                Fork 整個 codebase(GitHub 公開)
              </NotBuyingItem>
              <NotBuyingItem>
                自己 host 一份私有版本
              </NotBuyingItem>
            </ul>
            <p className="mt-6 pt-4 border-t border-line/40 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
              引擎跑在您的 CPU · ZONE 27 伺服器零運算
            </p>
          </div>

          {/* ── 右欄 · NT$ 2,700 BUYS ── */}
          <div className="border border-gold/40 p-6 sm:p-7 bg-gold/5 glow-soft">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.3em] mb-5"
            >
              NT$ 2,700 · 一次 · 終身
            </p>
            <ul className="space-y-3 text-bone text-sm leading-relaxed list-none pl-0">
              <NotBuyingItem gold>
                #001–#{FOUNDERS_TOTAL} 編號(世界永遠只有 {FOUNDERS_TOTAL} 個)
              </NotBuyingItem>
              <NotBuyingItem gold>
                Tim 親手 onboarding(個人簽名證書)
              </NotBuyingItem>
              <NotBuyingItem gold>
                Founders 27 LINE 群終身 access
              </NotBuyingItem>
              <NotBuyingItem gold>
                BOTTOM 27 創始限定球員卡(Tim 的遊戲)
              </NotBuyingItem>
              <NotBuyingItem gold>
                恆美 × 伶 Kopi 紅茶招待 QR(台南實體)
              </NotBuyingItem>
              <NotBuyingItem gold>
                模型迭代提前 7 天試用 + 投票權
              </NotBuyingItem>
            </ul>
            <p className="mt-6 pt-4 border-t border-gold/30 font-mono text-gold text-[10px] tracking-[0.25em] leading-relaxed">
              Tim 親手 forge 每一位 · 不外包
            </p>
          </div>
        </div>

        <p
          className="mt-12 text-center text-bone text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
          style={{ textWrap: "balance" }}
        >
          工具可以被複製、被 fork、被自己 host。
          <br />
          <span className="text-gold">
            {FOUNDERS_TOTAL} 個編號 · {FOUNDERS_TOTAL} 段第一手關係 · 不能。
          </span>
        </p>

        <p className="mt-8 text-center font-mono text-mute text-[10px] tracking-[0.3em]">
          完整論證見{" "}
          <Link href="/manifesto" className="text-gold hover:underline">
            /manifesto
          </Link>{" "}
          倒置 II · MONETIZATION
        </p>

        {/* Round 29 Wave 10C · Agent research Pattern #3:Manual Bank
            Transfer 不是 conversion friction · 是 Costly Signaling
            ritual。Spence 1973 + Cialdini commitment principle + 2026
            luxury-friction-design research 共同方向 · 「不解釋 friction
            而道歉 → 解釋 friction 為什麼是 the product itself」。
            短簽名 Tim note · 不放 sales-script · 把 handshake framing
            寫成 brand statement。 */}
        <div className="mt-12 max-w-2xl mx-auto border-l-2 border-gold/40 pl-5 sm:pl-6 py-1">
          <p
            lang="en"
            className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3"
          >
            ▌ THIS ISN&apos;T A CHECKOUT · 這不是結帳
          </p>
          <p className="text-mute/90 text-sm sm:text-base leading-relaxed">
            銀行匯款 not Apple Pay · 是<strong className="text-bone">刻意的</strong>。
            我親手 verify 每一筆轉帳 · 24 小時內 DM 您 Founders 27 編號 ·
            然後您就<strong className="text-bone">永遠是 #00X 了</strong>。
            <br />
            <br />
            這不是 checkout · 是 handshake。Apple Pay 一秒鐘的 commitment ·
            跟 10 分鐘手工匯款的 commitment 不是同一個東西。
            <strong className="text-bone">我們選後者 · 因為它 filter 的是對的人</strong>。
          </p>
          <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-4 tabular">
            — TIM · FOUNDER · 2026-05-21
          </p>
        </div>
      </section>

      {/* Round 8: BLACK CARD VALUE REFRAME section (114 lines · 2nd
          reframe back-to-back with 「您不是在買引擎」) removed.
          Agent #3 (premium /founders research): "premium pages do
          ONE reframe block, not stacked. Pick the sharper one."
          Kept: 「您不是在買引擎」(closer to Founders 27 brand IP).
          BLACK CARD context still in /manifesto Section II MONETIZATION
          (link already exists above) — visitors curious about BLACK
          CARD specifically can read the full reframe there.
          Saves ~900px mobile scroll. */}

      {/* ── BENEFITS GRID ────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20">
        <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4">
          創始六大權益
        </h2>
        <p className="font-mono text-mute text-xs tracking-[0.3em] text-center mb-16">
          THE SIX UNLOCKS
        </p>

        {/* R76 W-B · Agent A R75 SHIP 5 UniformHeightStrip Aesop spacing
            audit · auto-rows-fr forces uniform row heights · h-full + flex-
            col stretches benefit cards · 6 benefits had inconsistent body
            lengths(終身 = 2 lines vs 創作者 0% = 4 lines)· Aesop website
            grid discipline · NN/g Anatomy of Good Design · 0 new tokens · CSS-only。 */}
        <div className="grid sm:grid-cols-2 auto-rows-fr gap-x-12 gap-y-14">
          {benefits.map((b) => (
            <div key={b.no} className="flex flex-col h-full">
              <p
                lang="en"
                className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3"
              >
                / {b.no}
              </p>
              <h3 className="text-xl text-bone font-light tracking-tight mb-1">
                {b.zh}
              </h3>
              <p
                lang="en"
                className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mb-4"
              >
                {b.en}
              </p>
              <p className="text-mute text-sm leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIER COMPARISON ───────────────── */}
      <section
        aria-labelledby="tier-compare-heading"
        className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
      >
        <h2
          id="tier-compare-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4"
        >
          三種會員,一個選擇
        </h2>
        <p className="font-mono text-mute text-xs tracking-[0.3em] text-center mb-16">
          FREE · BLACK CARD · FOUNDERS 27
        </p>

        {/* Desktop: 4-column comparison grid
            Round 52 W-B · Agent 2 #6 fix · breakpoint trap · md(768px)
            上 desktop table 太擠 · 768-1023px iPad portrait viewport 4-col
            table cells 字 cutoff · column 對齊崩。 改 lg(1024px)· iPad
            portrait 維持 stacked cards · iPad landscape 才升 4-col table。 */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-x-4 text-sm">
            {/* Header row */}
            <div />
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`text-center pb-6 ${
                  t.highlight ? "bg-gold/5 -mx-2 px-2 pt-4 border-x border-gold/30" : ""
                }`}
              >
                <p
                  className={`font-mono text-[10px] tracking-[0.3em] mb-2 ${
                    t.highlight ? "text-gold" : "text-mute"
                  }`}
                >
                  {t.name}
                </p>
                <p
                  className={`text-2xl font-light tracking-tight mb-1 tabular ${
                    t.highlight ? "text-gold" : "text-bone"
                  }`}
                >
                  {t.price}
                </p>
                <p className="text-mute text-[11px] leading-tight">
                  {t.priceNote}
                </p>
              </div>
            ))}

            {/* Data rows */}
            {COMPARE_ROWS.map((row, idx) => (
              <DesktopRowGroup
                key={row.key}
                row={row}
                isLast={idx === COMPARE_ROWS.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Mobile: 3 stacked cards */}
        {/* Round 52 W-B · 對齊 lg: breakpoint(Agent 2 #6)· stacked cards
            on mobile + iPad portrait(< 1024px)· 4-col table on iPad
            landscape + desktop。 */}
        <div className="lg:hidden space-y-6">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`border p-6 ${
                t.highlight
                  ? "bg-gold/5 border-gold/50 glow-soft"
                  : "bg-slate/40 border-line/60"
              }`}
            >
              <p
                className={`font-mono text-[10px] tracking-[0.3em] mb-2 ${
                  t.highlight ? "text-gold" : "text-mute"
                }`}
              >
                {t.name}
              </p>
              <p
                className={`text-3xl font-light tracking-tight mb-1 tabular ${
                  t.highlight ? "text-gold" : "text-bone"
                }`}
              >
                {t.price}
              </p>
              <p className="text-mute text-xs leading-tight mb-6">
                {t.priceNote}
              </p>

              <dl className="space-y-2 text-sm">
                {COMPARE_ROWS.map((row) => (
                  <div
                    key={row.key}
                    className="flex justify-between gap-3 border-b border-line/30 pb-2"
                  >
                    <dt className="text-mute text-[11px]">{row.label}</dt>
                    <dd
                      className={`text-right text-[11px] font-mono ${
                        t.highlight ? "text-bone" : "text-mute"
                      }`}
                    >
                      {t.rows[row.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center font-mono text-mute text-[10px] tracking-[0.3em]">
          BLACK CARD CPBL 季票 LIVE manual ECPay · 0 auto-renewal · FOUNDERS 27 為終身定價,不再變動
        </p>
      </section>

      {/* ── WHY THIS PRICE ─────────────────── */}
      <section
        aria-labelledby="why-price-heading"
        className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
          / WHY NT$ 2,700
        </p>
        <h2
          id="why-price-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4"
        >
          這個數字不是隨便定的。
        </h2>
        <p className="text-mute text-center text-sm mb-12 max-w-xl mx-auto leading-relaxed">
          也不是「先把價格設高、再打七折」的常見手法。
        </p>

        <div className="bg-slate/60 border border-line/70 p-6 sm:p-10 font-mono text-sm">
          <dl className="space-y-4">
            <CalcRow label="數字源" en="ORIGIN">
              <span className="text-bone">
                27 × 100 — 棒球完美比賽的 27 個出局數
              </span>
            </CalcRow>

            <CalcRow label="對標" en="ANCHOR">
              <span className="text-mute">
                BLACK CARD 季票{" "}
                <span className="text-bone tabular">NT$ 1,500</span> /season
              </span>
            </CalcRow>

            <CalcRow label="5 年訂閱對照" en="5-YEAR PARITY">
              <span className="text-mute">
                BLACK CARD 10 季:{" "}
                <span className="text-bone tabular">NT$ 15,000</span>
                <span className="mx-2 text-mute/50">vs</span>
                FOUNDERS 27:{" "}
                <span className="text-gold tabular">NT$ 2,700</span>
              </span>
            </CalcRow>

            <CalcRow label="等同每場攤提" en="EFFECTIVE PER GAME">
              <span className="text-bone tabular">~ NT$ 2 / 場</span>
              <span className="text-mute/60 ml-2">(5 年 1,200 場計)</span>
            </CalcRow>

            <CalcRow label="創作者抽成節省" en="CREATOR FEE">
              <span className="text-mute">
                BLACK CARD 5% <span className="mx-2 text-mute/50">→</span>{" "}
                <span className="text-gold">0%</span>
              </span>
            </CalcRow>

            <CalcRow label="名額" en="CAP" isLast>
              <span className="text-bone">
                {FOUNDERS_TOTAL} 名 · 永遠關閉(沒有第二批)
              </span>
            </CalcRow>
          </dl>
        </div>

        <p className="mt-10 text-center text-mute text-sm max-w-xl mx-auto leading-relaxed">
          一次付完,終身屬於您
          <span className="text-gold tabular mx-1">{FOUNDERS_TOTAL}</span>
          個編號之一。
          <br />
          不是優惠期、不是早鳥折扣 — 是這 270 個位置的真實成本。
        </p>
      </section>

      {/* R63 W-B · Agent 5 SHIP #5 · Pratfall「what your dollar didn't buy」 ·
          FanGraphs honest limitation pattern(per blogs.fangraphs.com/a-note-
          on-membership-pricing「Our articles aren't written by AI... We don't
          partner with sportsbooks. We don't have corporate overlords」)·
          concentrate 11-item NOT-DO list at decision-point · brand IP triple-
          fire(Pratfall + Costly Signaling + Disclosure)· hardcore CPBL fan
          audience pattern-matches LINE 老師 / 報馬仔 / 投顧老師 schemes ·
          「we are NOT that」 explicit differentiator at decision point。 */}
      <section
        aria-labelledby="dollar-didnt-buy-heading"
        className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 sm:py-20 border-t border-line/40"
      >
        <p
          lang="en"
          className="font-mono text-loss/85 text-[10px] tracking-[0.4em] mb-6 text-center"
        >
          ✕ / WHAT YOUR NT$ 2,700 DIDN&apos;T BUY
        </p>
        <h2
          id="dollar-didnt-buy-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4"
        >
          NT$ 2,700 不會給您
        </h2>
        <p className="text-mute text-sm sm:text-base leading-relaxed text-center max-w-xl mx-auto mb-10">
          ZONE 27 跟 LINE 老師 / 報馬仔 / 投顧老師生態的 differential ·
          explicit 列在 buy-line · 不藏 expectations gap。
        </p>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {DOLLAR_DIDNT_BUY.map((item, i) => (
            <div
              key={i}
              className="border border-loss/30 bg-slate/30 p-4 sm:p-5"
            >
              <p
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2"
              >
                ✕ {item.what}
              </p>
              <p className="text-mute text-[13px] leading-relaxed">
                {item.why}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
          完整 11-item NOT-DO list 在{" "}
          <Link
            href="/transparency#section-02"
            className="text-gold hover:underline"
          >
            /transparency Section 02
          </Link>
          {" "}· brand IP「方法公開」 物理 codify · 不只 marketing 講法。
        </p>
      </section>

      {/* ── INLINE FAQ (top 3 objections) ────── */}
      <section
        aria-labelledby="inline-faq-heading"
        className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
          / BEFORE YOU JOIN
        </p>
        <h2
          id="inline-faq-heading"
          className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-12"
        >
          您應該問的問題
        </h2>

        <div className="space-y-3">
          {INLINE_FAQ.map((item, idx) => (
            <details
              key={idx}
              className="group bg-slate/40 border border-line/60 open:border-gold/40 transition-colors"
            >
              <summary className="cursor-pointer list-none px-6 py-5 flex items-start justify-between gap-4 hover:bg-slate/60 transition-colors">
                <span className="text-bone text-base leading-snug flex-1">
                  {item.q}
                </span>
                <span
                  className="font-mono text-gold/60 text-xs tracking-[0.2em] group-open:rotate-45 transition-transform shrink-0 mt-1"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 pt-1 text-mute text-sm leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-mute text-[10px] tracking-[0.3em]">
          完整詳細問答在{" "}
          <Link href="/faq" className="text-gold hover:underline">
            /faq
          </Link>
        </p>
      </section>

      {/* ── FINAL CTA ────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 text-center border-t border-line/40">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
        >
          ONE NUMBER. ONE LIFETIME.
        </p>
        <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          當 {formatBadge(FOUNDERS_TOTAL)} 被認領,這扇門將永遠關閉。
        </h3>
        <p className="mt-6 text-mute max-w-md mx-auto text-sm leading-relaxed">
          現在加入等候名單,在正式開放預訂時擁有第一順位。
        </p>
        <Link
          href="#waitlist"
          className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          ↑ 加入等候名單
        </Link>
        <Link
          href="/about"
          className="block mt-6 font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
        >
          閱讀完整品牌方法論 →
        </Link>
        <Link
          href="/founders/ledger"
          className="block mt-3 font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
          title="本週新分配 · 累計通過率 · 拒絕原因 sample(去 PII)· 4 brand IP axiom 同時 fire"
        >
          分配公開帳本 · 拒絕原因公布 · 每週一更 →
        </Link>

        {/* ── Share this offer · private-DM lever ── */}
        <div className="mt-10 pt-8 border-t border-line/40 flex items-center justify-center">
          <CopyLinkButton />
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function DesktopRowGroup({
  row,
  isLast,
}: {
  row: (typeof COMPARE_ROWS)[number];
  isLast: boolean;
}) {
  return (
    <>
      <div
        className={`flex flex-col justify-center py-4 ${
          isLast ? "" : "border-b border-line/30"
        }`}
      >
        <p className="text-bone text-sm leading-tight">{row.label}</p>
        <p className="font-mono text-mute text-[9px] tracking-[0.25em] mt-1">
          {row.en}
        </p>
      </div>
      {TIERS.map((t) => (
        <div
          key={t.name}
          className={`flex items-center justify-center text-center py-4 font-mono text-[12px] ${
            isLast ? "" : "border-b border-line/30"
          } ${
            t.highlight
              ? "bg-gold/5 -mx-2 px-2 border-x border-gold/30 text-bone"
              : "text-mute"
          }`}
        >
          {t.rows[row.key]}
        </div>
      ))}
    </>
  );
}

function NotBuyingItem({
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

// Round 8: BlackCardItem helper removed with the BLACK CARD reframe
// section. No other call sites in this file.

function CalcRow({
  label,
  en,
  children,
  isLast,
}: {
  label: string;
  en: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 ${
        isLast ? "" : "border-b border-line/40 pb-4"
      }`}
    >
      <div className="shrink-0 sm:w-44">
        <p className="text-mute text-[11px]">{label}</p>
        <p className="font-mono text-mute text-[9px] tracking-[0.25em] mt-0.5">
          {en}
        </p>
      </div>
      <div className="text-right flex-1">{children}</div>
    </div>
  );
}

// ── Break-even bento cell · Round 12 funnel-audit lift ────
// Visual treatment for the 3-number break-even math row in /founders
// hero. Mirrors the hairline-border + gold-accent idiom used in the
// TIER comparison grid below for visual continuity. The HIGHLIGHTED
// (gold) cell is the price itself — anchor number that everything
// else compares against.
function BreakEvenCell({
  value,
  unit,
  en,
  gold = false,
}: {
  value: string;
  unit: string;
  en: string;
  gold?: boolean;
}) {
  return (
    <div
      className={`text-center p-3 sm:p-4 border ${
        gold
          ? "border-gold/50 bg-gold/5"
          : "border-line/60 bg-slate/30"
      }`}
    >
      <p
        className={`font-mono tabular tracking-tight text-2xl sm:text-3xl font-light leading-none ${
          gold ? "text-gold" : "text-bone"
        }`}
      >
        {value}
      </p>
      <p
        className={`text-[10px] sm:text-[11px] tracking-tight leading-tight mt-1.5 ${
          gold ? "text-gold/80" : "text-mute"
        }`}
      >
        {unit}
      </p>
      <p
        lang="en"
        className={`font-mono text-[8px] sm:text-[9px] tracking-[0.2em] leading-tight mt-1 ${
          gold ? "text-gold/60" : "text-mute/60"
        }`}
      >
        {en}
      </p>
    </div>
  );
}
