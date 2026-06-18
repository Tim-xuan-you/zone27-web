import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";
import { createPageMetadata } from "@/lib/page-og";

// R159 W4.L · Agent L · convert to createPageMetadata for locale + siteName
// restoration + truncate description from 393 chars to ~140 · per Twitter
// 200-char cap + Slack 200-char readable weight + Open Graph Protocol spec。
export const metadata: Metadata = createPageMetadata({
  title: "Integrity · 22 件 ZONE 27 永久不會變的事",
  description:
    "13 條永遠不做的紅線 + 9 條永遠會做的承諾 = 22 件 ZONE 27 永久不會變的事 · Tim 親手簽名 · 修改要提前 30 天公告。",
  ogDescription:
    "13 條永遠不做 + 9 條永遠會做 = 22 件永久不會變的事 · Tim 親手簽名 · 修改要提前 30 天公告。",
  path: "/integrity",
});

// /integrity · Berkshire 1996 Owner's Manual pattern · 22 永久 binding rules
// (13 redlines + 9 ethics)· public bond not implicit · 修改 needs 30-day
// /changelog notice per /audit S05 PRE-COMMIT clause。

export const revalidate = 86400; // daily revalidate

const SIGNED_AT = "2026-05-23";

// 13 brand-IP redlines · single-source canonical · same axis as /transparency § 02。
const REDLINES: ReadonlyArray<{ no: string; rule: string; basis: string; revised?: string }> = [
  {
    no: "01",
    rule: "不做黏著式社交迴圈 · 0 私訊 / 0 即時聊天室 / 0 獨立論壇",
    basis: "每篇分析底下可以討論、可以回覆作者(一場一篇預測仍賽前鎖死、不可改)· 但沒有私訊、沒有即時聊天室、沒有獨立論壇 · ZONE 27 是讓你照見自己判斷的鏡子 · 不是想盡辦法黏住你的互動迴圈。",
    revised: "2026-06 隨群眾市場 pivot 修訂:原文「不做任何 user-to-user 互動」· 開了「分析底下可討論」後,如實改成現在的界線。",
  },
  {
    no: "02",
    rule: "不 ship streak / daily-login farming / Days Followed badge",
    basis: "不用「連續登入天數」「追蹤幾天」這種把你黏在站上的設計 · 不為互動而互動。",
  },
  {
    no: "03",
    rule: "點數錢包單向 · 不可提現 / 轉讓 / 換回現金",
    basis: "儲值點數是 1 點 = NT$ 1 的單向記帳 · 不能提現 / 不能轉給別人 / 不能換回現金 · 不是可流通的虛擬貨幣 · 更不碰真錢對賭(那才是唯一會坐牢的紅線)。",
    revised: "2026-06-15 修訂:原本點數用途是「買別人的付費分析」;後來把『賣分析賺錢』整條路收掉、改回純訂閱身分(Defector 式 · 見 #04),所以「買分析」這個用途也一併暫停。 單向、不可提現的金融紅線不變;程式碼保留,未來用途確定會提前公告。",
  },
  {
    no: "04",
    rule: "不抽真錢下注的傭 · 不做多層次分潤",
    basis: "0 抽賭注的傭(唯一法律紅線 · 我們自己不接受下注)· 0 referral code / 0 UTM / 0 多層次傳銷分潤。創作者只免費公開發分析,回報是地位(天梯 / 校準 / 被追蹤),不是牆後的錢。",
    revised: "2026-06-15 修訂:原本創作者可標價賣分析、平台抽 5-10% 內容傭;後來把『賣分析賺錢』這條路整個收掉、改回純訂閱身分(Defector 式),所以改成創作者只免費公開發、平台 0 抽傭。 程式碼保留,未來若重開會提前公告。",
  },
  {
    no: "05",
    rule: "不 ship「剩 X 個名額」即時搶購倒數",
    basis: "會員不限量 · 0 即時人數跳動 · 0 倒數計時 · 不用「再不買就沒了」催你下單。",
  },
  {
    no: "06",
    rule: "不 寄生 gambling 平台",
    basis: "0 爬取 賣明牌的站 / 收費明牌群組 / 收費老師 · 0 抽成 / 分潤 · 我們要取代它們 · 不是幫它們導流。",
  },
  {
    no: "07",
    rule: "不 接 AdMob 廣告營收",
    basis: "AdMob 永久封殺 · 0 廣告 · 0 業配 · 同步 /privacy + /audit · /ethics 第 2 條 binding。",
  },
  {
    no: "08",
    rule: "不 multi-step onboarding wizard",
    basis: "1 個動作 / 1 個 email · 不分好幾頁註冊 · 不一步一步逼你填更多欄位。",
  },
  {
    no: "09",
    rule: "不 modal paywall scroll-lock",
    basis: "0 彈窗 · 0 卡住捲動 · 0「訂閱才能看下去」遮罩 · 內容看到底都不擋你。",
  },
  {
    no: "10",
    rule: "不 ship「管它準不準包裝」 fake methodology",
    basis: "engine v0.2/v0.3/v0.4 全 publish · 不藏 estimate · 不藏 DIVERGED · 不藏 sample debt N<30 · 這是最核心的一條紅線。",
  },
  {
    no: "11",
    rule: "不 ship fake testimonials / 偽造 social proof",
    basis: "等真實 BLACK 會員加入後才放他們的話 · 0 代筆好評 · 0 假推薦 · 0「已有 1000+ 人加入」灌水。",
  },
  {
    no: "12",
    rule: "不為了覆蓋更廣而開半成品的盤 · 每個運動的引擎沒驗證到夠準,絕不上線開盤 · 任何擴張都提前公告、絕不偷偷加",
    basis: "目標是把台灣運彩賣的每個運動都做 —— 但一個運動、一個引擎,逐步點亮,品質閘門永遠不降。寧可少做、做得準,也不為了菜單好看而亂開盤(那是賭場的玩法)。棒球先把 CPBL 做到極致 · MLB 跟其他運動的引擎逐步研發 · 沒驗證夠準之前不會在賽事板出現它的開盤、/track-record 也不替它計分。/matches/mlb 目前是純看即時比分的工具(0 引擎預測)· /lab + /lab/custom 是你自己跑的模擬器、不算引擎預先承諾。每次擴張都走公開流程、提前公告 · 絕不偷偷加一個運動上去。",
  },
  {
    no: "13",
    rule: "不 ship subscription auto-renewal · 永遠 · ECPay / TapPay / 綠界定期定額 / Stripe / 藍新 / 任何 payment gateway 自動扣款 全 refused",
    basis: "每次續訂都要你親手按一次 + 自己轉帳 · 自動扣款 = 「忘記取消就一直被扣」的暗黑設計 · 我們不做。每一季由你主動「我還在乎」重新加入 · 而不是靠你忘記取消來留住你。BLACK 從月費自動扣款改成 NT$ 500/31 天親手一次性付款 · 沒有自動續訂對我們是機會不是限制 · 違反 = 品牌信用永久留下記錄。",
  },
];

// 9 binding ethics commitments · single-source canonical · same axis as /ethics 9 commitments。
const ETHICS_COMMITMENTS: ReadonlyArray<{
  no: string;
  rule: string;
  basis: string;
}> = [
  {
    no: "01",
    rule: "0 betting affiliate / 不分潤博彩平台",
    basis: "0 sportsbook commission · 0 affiliate revenue · per /ethics commitment #1 binding · 違反 = brand 信用 collapse 永久 audit trail",
  },
  {
    no: "02",
    rule: "0 ads · AdMob 永久封殺",
    basis: "no Google AdSense · no AdMob · no Meta ads · no display banner · 永久 0 廣告 · 同步 /privacy + /audit。",
  },
  {
    no: "03",
    rule: "0 user tracking · GA / Pixel / Hotjar 永遠 0",
    basis: "0 Google Analytics · 0 Facebook Pixel · 0 Hotjar · 0 Plausible · 0 tracking pixel · per /privacy 0-tracker promise + /audit S06 LocalStorage Transparency 11-key inventory binding",
  },
  {
    no: "04",
    rule: "0 fake testimonials · 公開 founders 全名清單(Q3+ onboard 後)",
    basis: "等真實 BLACK 會員加入 6 個月後才放他們的話 · 0 假推薦 · 現在是空的就誠實留空。",
  },
  {
    no: "05",
    rule: "0 DIVERGED 隱藏 · 賽後 receipt 等大列出 · 7 天 ingest SLA",
    basis: "PROVED + DIVERGED same visual weight · 不藏 miss · per /track-record + /audit Section 03 + /steelman pattern · CPBL pipeline ingest deadline",
  },
  {
    no: "06",
    rule: "0 silently model rotation · Lens Lifetime Pledge · 每 ship 過的 engine 永久 viewable",
    basis: "engine v0.2 永久 viewable · v0.3 EXPANSION 永久 viewable · 不 rotate · 不 deprecate · per /methodology Section 04 + Lens Lifetime Pledge canonical",
  },
  {
    no: "07",
    rule: "0「明牌」 framing · prediction = probability 不是 picks",
    basis: "不販售「鐵口直斷」 · 不顯示賠率 · 純機率分布 + 公開實際準度 · per /audit + /manifesto + /coverage NEVER list + 11-NEVER #10 fake methodology binding",
  },
  {
    no: "08",
    rule: "0 fine print · 任何 rule modification 30 天前提前公告",
    basis: "/audit S05 PRE-COMMIT clause · 修改任一 rule 需 30 天前提前公告 · 此 page integrity 同 binding · 違反 = brand 信用 collapse",
  },
  {
    no: "09",
    rule: "0 cherry-pick · 每筆 CPBL engine prediction → mandatory /track-record entry + /receipts/[receiptId] permalink · 0 retroactive delete",
    basis: "引擎一旦出手預測 · 你就有權看到結果 · 只挑好的公布 = 信任直接崩掉 · PROVED + DIVERGED + PUSH 一樣大、一樣亮 · 不藏失手。無論引擎那場對或錯都一定列出 · 就算 100% 算錯也照樣公布 · 搭配紅線 #12(沒驗證夠準不開盤)= 完整範圍 + 紀律收尾。",
  },
];

export default function IntegrityPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            INTEGRITY · 22 件永久不會變的事
          </p>
          <h1
            className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            22 件 ZONE 27 永久{" "}
            <span className="text-gold">不會變</span>{" "}
            的事
          </h1>
          {/* Cold Gold Hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[280px] mb-6" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs tracking-[0.3em] tabular mb-6"
          >
            SIGNED · TIM · {SIGNED_AT} · 只增不刪 · 修改前 30 天 /CHANGELOG 公告
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4 zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這頁列出 ZONE 27「永遠會做」與「永遠不做」的事 · 公開寫死 ·
            不是放在心裡的默契。13 條「永遠不做」紅線 + 9 條「永遠會做」的
            承諾 = 22 件永久不會變的事 · 要改 · 必須提前 30 天公告。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            為什麼重要:當你以後懷疑 ZONE 27 會不會偷偷裝追蹤、開社群帳號、
            或把引擎改成付費才能用 · 這頁就是可以拿來對照的白紙黑字。它管的是
            未來好幾年的一致性 · 不只是上線那一週。
          </p>
          <div className="mt-5">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · 13 永遠不做 redlines ──────────── */}
        <section
          id="section-01"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §01 · 13 BRAND-IP REDLINES · 永遠不做
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            這 13 件「永遠不做」是 ZONE 27 跟賣明牌的站、收費明牌群組劃清界線的
            底線。 違反任一 = 品牌自殺 · 修改需 30 天前提前公告。
            其中 3 條我們確實修訂過(下方標「↻ 已修訂」)· 完整經過收在{" "}
            <Link href="/corrections" className="text-gold underline-offset-4 hover:underline">
              我們搞砸過的事
            </Link>
            。
          </p>
          <ol className="space-y-4 mt-4">
            {REDLINES.map((item) => (
              <RuleEntry key={item.no} no={item.no} rule={item.rule} basis={item.basis} revised={item.revised} negative />
            ))}
          </ol>
        </section>

        {/* ── §02 · 9 binding ethics ────────────────── */}
        <section
          id="section-02"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §02 · 9 BINDING ETHICS COMMITMENTS · 永遠會做
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            這 9 件承諾把 ZONE 27「方法公開」的原則寫死 · 與 /ethics + /audit
            同步。 違反 = Tim 親手在 /ethics 用紅字標記、永久留下記錄 ·
            不能事後重新包裝成別的說法。
          </p>
          <ol className="space-y-4 mt-4">
            {ETHICS_COMMITMENTS.map((item) => (
              <RuleEntry key={item.no} no={item.no} rule={item.rule} basis={item.basis} />
            ))}
          </ol>
        </section>

        {/* ── §02B · EDITORIAL-COMMERCE WALL ─────────────
            R156 W3.D2 · Wirecutter editorial-commerce wall covenant ·
            per Agent D R156 research · NYT Wirecutter 2026 redesign
            transparency wall pattern transplanted · solo-founder paradox
            registered as binding covenant since no org-chart structural wall
            possible · per [[zone27-disclosure-philosophy]] + [[zone27-
            monetization-philosophy]] + [[feedback-zone27-pratfall-brand-ip]]
            三 axiom 同時 fire · brand IP minimum-violation form。 */}
        <section
          id="section-02b"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §02B · EDITORIAL-COMMERCE WALL · ENGINE 與 IDENTITY
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            引擎 FREE forever · 識別 tier PAID · 兩條線之間有一道<span className="text-gold">牆</span>
          </h2>

          <div className="space-y-5 text-mute leading-relaxed zh-body">
            <p>
              引擎這條線只看數據品質、不受任何金錢關係影響;賺錢那條線(身分
              訂閱)完全不能反過來干涉引擎算出什麼。 因為 ZONE 27 是一個人做的 ·
              沒辦法靠公司部門互相隔離 · 所以改用<strong className="text-bone">公開白紙黑字</strong>
              的方式守住這道牆 · 不假裝有牆 · 而是公開講清楚這道牆怎麼維持。
            </p>

            <p>
              <strong className="text-bone">這道牆的具體形狀:</strong>
              ZONE 27 引擎 output(K/9 · BB/9 · HR/9 推推演引擎模擬 · 7-LENS
              CANVAS · /audit S02 全部 estimation disclosure)對<strong className="text-bone">
              FREE tier 訪客 = BLACK 訂閱者</strong>
              · 物理上同一份 lib/simulator.ts 跑出來。 paid tier 買的是 IDENTITY
              (出錢養著免費引擎 + 支持者金環 + 寫信給 Tim 本人親手回)· 不買 engine accuracy
              升級 · 不買 secret edge · 不買 paywall predictions · 連驗證準度標章都免費(靠戰績賺,不靠付費)。
            </p>

            <p>
              <strong className="text-bone">Boundary case ZONE 27 已 pre-commit:</strong>
              若 sportsbook / 賣明牌的站 / 收費明牌群組 / 任何 betting
              platform 主動 contact 提出 NT$ X K 買 engine API · whitelabel
              · co-branded launch · affiliate program · sponsored content · 任何
              形式 commerce relationship · Tim 將: (1) 在 /audit 公開拒絕往來 ·
              (2) email 回絕、不洽談 · (3) 收到的個資不外洩 · 不談判、不還價。
              就算 sportsbook 拿我們公開授權的引擎去自己改一份 · 我們也會在
              /audit 公開這件事 + 公開撇清 + 收 NT$ 0(已寫進 /ethics §02B)。
            </p>
          </div>

          <div className="mt-8 border border-gold/30 bg-slate/30 p-5 sm:p-7">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
            >
              ⚓ 3 BINDING COVENANTS · 只增不刪 · 修改前 30 天 /CHANGELOG 公告
            </p>
            <ol className="space-y-4 mt-4">
              <li className="border-l-2 border-gold/40 pl-4 py-2">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span
                    lang="en"
                    className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                  >
                    ✓ W-01
                  </span>
                  <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                    <strong>引擎 output 對所有 tier 物理相同 · 0 paywall on prediction</strong>
                  </p>
                </div>
                <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                  FREE tier 訪客看到的 win probability = BLACK 訂閱者
                  · 同一個引擎、同一份賽事資料跑出來 · 任何人比對得出來
                  · 違反 = Tim 親手 在 /ethics 紅字標永久 audit trail
                </p>
              </li>
              <li className="border-l-2 border-gold/40 pl-4 py-2">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span
                    lang="en"
                    className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                  >
                    ✓ W-02
                  </span>
                  <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                    <strong>0 sportsbook revenue 永久 · 任何 betting 生態 commerce relationship 全 decline</strong>
                  </p>
                </div>
                <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                  賣明牌的站 / 收費明牌群組 / sportsbook / betting platform / affiliate
                  / sponsored content / API license / whitelabel / 任何形式 incentive 全
                  decline · 不 counter-offer 不 negotiation · email refuse 收 PII 不 leak ·
                  違反 = brand 信用永久 collapse · /ethics 紅字
                </p>
              </li>
              <li className="border-l-2 border-gold/40 pl-4 py-2">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span
                    lang="en"
                    className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                  >
                    ✓ W-03
                  </span>
                  <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                    <strong>identity tier 不 unlock engine accuracy · 不 unlock secret edge · paid tier = SUPPORT/IDENTITY 不 features</strong>
                  </p>
                </div>
                <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                  BLACK 不解鎖任何功能(功能全免費 · 見 /membership/black-card)·
                  它給的只有一圈所有人看得見的支持者金環 —— 身分,不是讓引擎變更準。
                  違反 = 品牌鐵律直接崩。
                </p>
              </li>
            </ol>
          </div>

          <p className="mt-6 text-mute/85 text-sm leading-relaxed zh-body">
            <strong className="text-bone">為什麼這道牆必須白紙黑字寫出來:</strong>
            一個人做的東西沒辦法靠公司部門互相把關 · 只能靠公開承諾來守住。
            ZONE 27 還很年輕 · 不裝自己經營了幾十年 · 而是先把承諾講清楚 ·
            再慢慢用時間證明。 這道牆就是其中一條承諾。
          </p>

        </section>

        {/* ── §03 · BERKSHIRE 1996 PATTERN explanation ── */}
        <section
          id="section-03"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §03 · 為什麼寫死、不留模糊空間
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4 zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這 22 條是寫死的承諾。 沒有「必要時我們可能會改」這種伏筆 ·
            沒有「內容可能隨時變動」的小字 · 沒有「除非遇到某些情況」的但書。
            讀完之後你可以一條一條對照、隨時檢查 · 違反 = 品牌自殺。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            ZONE 27 還很年輕 · 老實說還沒累積多少戰績 · 目前 4 場 PROVED ·
            0 付費客戶。 整個品牌的做法是:先把承諾講清楚 · 再用時間去證明 ·
            而不是事後才補一張漂亮的成績單。
          </p>
        </section>

        {/* ── §04 · PRE-COMMIT MECHANISM ─────────── */}
        <section
          id="section-04"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12 scroll-mt-20"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §04 · PRE-COMMIT MECHANISM · 修改 protocol
          </p>
          <p className="text-mute text-sm leading-relaxed mb-3">
            如果 ZONE 27 future 需要修改任一條 22 binding rule · 唯一允許
            mechanism 是:
          </p>
          <ol className="space-y-2.5 text-mute text-sm leading-relaxed ml-4">
            <li>
              <strong className="text-bone">1.</strong> Tim 親手公開記一筆 ·
              註明 modify which rule · 為什麼 · 30 天 notice period
              開始 dated。
            </li>
            <li>
              <strong className="text-bone">2.</strong> 30 天內 fan 可以
              讀那筆公開紀錄 · 公開反對 via email
              tatayngiti@gmail.com · Tim 親手 reply 解釋 reasoning。
            </li>
            <li>
              <strong className="text-bone">3.</strong> 30 天後 IF Tim 仍
              堅持 modify · /integrity page entry 更新 · 並收進{" "}
              <Link
                href="/corrections"
                className="text-gold underline-offset-4 hover:underline"
              >
                我們搞砸過的事
              </Link>
              {" "}「modified, effective YYYY-MM-DD」。
            </li>
            <li>
              <strong className="text-bone">4.</strong> 違反 protocol(silently
              modify · skip 30-day notice · backdate)= brand 信用 collapse
              永久 audit trail · per /ethics commitment #8。
            </li>
            <li>
              <strong className="text-bone">5.</strong> 加 NEW binding rule
              同 protocol · Tim 親手 signature 一句即決 · 公開記一筆
              「added, effective YYYY-MM-DD」· 「擴」 protocol 跟「改」
              protocol 同 axis · 不藏 hidden expansion。
            </li>
          </ol>
          <p className="text-mute/85 text-sm leading-relaxed mt-5">
            這套流程本身就是承諾。 我們公開「要改的話該怎麼改」這條路 ·
            但同時承諾盡量永遠不去走它。
          </p>
        </section>

        <FounderSignOff signedAt={SIGNED_AT}>
          <p>
            這 22 件不是行銷文案 · 不是銷售話術 · 是 Tim 親手在 {SIGNED_AT}
            公開簽名、寫死的承諾。
          </p>
          <p>
            如果未來你看到 ZONE 27 違反任一條 · 你有權質問:email
            tatayngiti@gmail.com 直接問 Tim · 或在 /faq 留言。
            「方法公開 · 品味私藏」這八個字寫進承諾裡 ·
            沒有藏起來的彈性空間。
          </p>
          <p>
            修改任一條都要提前 30 天公告。 違反這個流程 =
            品牌信用崩掉 · 你永遠有權檢查、有權公開質問。
          </p>
        </FounderSignOff>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/audit"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /audit · Model Report · DISCLOSURE PHILOSOPHY
            </Link>
            <Link
              href="/ethics"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /ethics · 9 commitments source →
            </Link>
            <Link
              href="/audit#section-02"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /audit § 02 · 13 NEVER source →
            </Link>
            <Link
              href="/corrections"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /corrections · 我們搞砸過的事 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── RuleEntry · negative or positive variant ──
function RuleEntry({
  no,
  rule,
  basis,
  revised,
  negative = false,
}: {
  no: string;
  rule: string;
  basis: string;
  revised?: string;
  negative?: boolean;
}) {
  const colorClass = negative ? "text-loss/85" : "text-gold/85";
  const borderClass = negative ? "border-loss/40" : "border-gold/40";

  return (
    <li className={`border-l-2 ${borderClass} pl-4 py-2`}>
      <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
        <span
          lang="en"
          className={`font-mono ${colorClass} text-[10px] tracking-[0.3em] tabular`}
        >
          {negative ? "✕" : "✓"} {no}
        </span>
        <p className="text-bone text-sm sm:text-base leading-snug flex-1">
          <strong>{rule}</strong>
        </p>
      </div>
      <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
        {basis}
      </p>
      {revised && (
        <p className="mt-2 flex items-baseline gap-2 text-[11px] leading-relaxed">
          <span className="font-mono text-gold/60 text-[9px] tracking-[0.2em] shrink-0">
            ↻ 已修訂
          </span>
          <span className="text-mute/60">{revised}</span>
        </p>
      )}
    </li>
  );
}
