import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";

export const metadata: Metadata = {
  title: "Ethics Policy · 9 binding commitments",
  description:
    "ZONE 27 的 9 條「我永遠不做」承諾,Tim 親筆簽名。對標、取代賣明牌的站、收費明牌群組。每一條都公開、可追蹤,修改任何一條都要 30 天前在 /changelog 公告。違反 = 品牌信用崩盤。",
};

// /ethics · Stratechery About page transplant · 9 ZONE 27 binding NOT-DO
// commitments · 修改任 commitment 需 30 天 /changelog 公告。

const COMMITMENTS: { num: string; title: string; body: string; tier: "displacement" | "subscriber" | "brand"; }[] = [
  {
    num: "01",
    title: "我不賣引擎預測給 bookmakers 或 scrapers",
    body: "若我收到 offer 來自任何博彩平台 / data scraper / sportsbook 想授權 ZONE 27 引擎輸出 · 我會把 offer 內容 + 我的拒絕 publish 在 /changelog · 不私下交易 · 不簽 NDA。",
    tier: "displacement",
  },
  {
    num: "02",
    title: "我永遠不接受 gambling-platform advertising / affiliate revenue",
    body: "ZONE 27 不接 sportsbook 廣告 · 不在站上放 affiliate link 到 任何 betting platform · 不接「點擊轉換」 commission · 不收賠率/明牌引流費。",
    tier: "displacement",
  },
  {
    num: "03",
    title: "我不接受任何形式的 paid recommendations",
    body: "任何 sponsor wanting ZONE 27 to recommend their service · product · 球員 · 球隊 · 媒體 · 都會被公開拒絕 · 不接 paid placement · 不寫 sponsored content · 不收「我們公司很棒」型 fee。",
    tier: "displacement",
  },
  {
    num: "04",
    title: "我不接受 data-licensing offers to sportsbooks",
    body: "ZONE 27 lens output(Vibe Check · Park Factor · Pitcher Fatigue · Underdog · Bullpen · Matchup History · Win Probability)+ engine version 計算結果 永遠不 sell / license / API access 給任何 sportsbook OR gambling-adjacent business。",
    tier: "displacement",
  },
  {
    num: "05",
    title: "我不接 CPBL 球隊 / 球員經紀 equity / consulting",
    body: "ZONE 27 與 CPBL 球隊 / 球員 / 經紀 / agents 之間永遠沒有 financial 關係 · 不持任何隊伍 equity · 不接 consulting fee · 不收 endorsement · 任何 conflict of interest 都會公開 disclose 在 /audit。",
    tier: "displacement",
  },
  {
    num: "06",
    title: "我永遠不跑 ads / affiliate / paid placement on ZONE 27",
    body: "整個 ZONE 27 站上 · 0 廣告 · 0 業配 · 0 付費置入 · 0 贊助內容 · 0 合作推廣。 訂閱費(FOUNDER + BLACK)就是全部的收入來源 · 從設計上就這樣定。",
    tier: "subscriber",
  },
  {
    num: "07",
    title: "我每年 5 月 publish 全年收入 + 開銷 + subscriber count",
    body: "每年 5/31 publish /annual/{year} report · 含全年收入 · 全年開銷 · BLACK subscriber count · FOUNDER 認領數 · 同 /audit S05 PRE-COMMIT pattern · 修改此 publish cadence 需 30 天 /changelog 公告。",
    tier: "subscriber",
  },
  {
    num: "08",
    title: "我永遠不接 sportsbook conversion fee / referral commission",
    body: "若 ZONE 27 visitor 從 ZONE 27 跳出去 register sportsbook account · ZONE 27 不收任何 referral commission · 不在 URL 加 tracking parameter · 不享 conversion fee。 visitor 的選擇是 visitor 自己的。",
    tier: "displacement",
  },
  {
    num: "09",
    title: "我每筆 engine 預測都 mandatory publish · 0 cherry-pick · 0 retroactive delete",
    body: "每筆 CPBL engine pre-committed prediction → mandatory /track-record entry + /receipts/[receiptId] permalink + PROVED / DIVERGED / PUSH label。 不選擇性 publish · 不 retroactive delete · 不 cherry-pick high-confidence-only · 即使 engine 100% 錯也 binding publish。 顯示 prediction 後 · 訪客對「我會看到結果」 產生擁有感 · selective publishing = trust 物理崩。 同 Berkshire 70-year annual letter「無論好年壞年 都 mandatory publish」 + Geneva Seal「每只 watch 都印 serial」 pattern · per /audit S05 PRE-COMMIT clause 升級到 /integrity binding rule layer(commitment #09 · R80 加)· 配對 /integrity redline #12(引擎驗證夠準才開盤 scope)close brand IP loop。",
    // R119 W4 · redline patch · tier corrected displacement → brand · #09 是
    // ZONE 27 internal brand discipline(Berkshire 70-year + Geneva Seal
    // pattern · per body cite)· NOT displacement of 玩運彩 (那 1-5 + 8 在
    // 做)· OG card TierStat 6+2+1=9 結構之前 silent assumed brand=1 但 array
    // mistagged 7+2+0 · per [[feedback-zone27-pratfall-brand-ip]] self-
    // falsifiable count drift 永遠 patch · 不藏。
    tier: "brand",
  },
];

export default function EthicsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / ETHICS POLICY · 9 binding NOT-DO commitments
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold"
            >
              9 LINE · SIGNED · BINDING
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            9 件 ZONE 27 <span className="text-gold">永遠不做</span> 的事
          </h1>

          <div className="mt-8 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              <strong>靠賣明牌的生意,結構上做不出這頁</strong> · 因為他們的每
              一條 revenue stream 都 violate 下面 9 條 · 公開等於商業自殺。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              ZONE 27 可以 ship · 因為訂閱費(FOUNDER + BLACK CPBL
              Season Pass)是整個 revenue model · 您贏您輸我都一樣賺。
            </p>
          </div>

          <p className="mt-6 text-bone text-base sm:text-lg leading-relaxed border-l-4 border-gold pl-5 py-2 max-w-2xl">
            <strong>每一個承諾 Tim 簽名 · 可被驗證 · 違反任何一條 = 此 page 紅字
            永久標 · 不可刪</strong> · ZONE 27 vs 賣明牌的站 anonymity+deletion
            model 的 structural asymmetry。
          </p>

          <div className="mt-6">
            <ArticleMeta readingMin={4} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 01 COMMITMENTS ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 01 · 9 COMMITMENTS · 簽 Tim · 2026-05-23
          </p>

          <ol className="space-y-6">
            {COMMITMENTS.map((c) => (
              <li
                key={c.num}
                className="border border-gold/30 bg-slate/30 p-5 sm:p-6 hover:border-gold/50 transition-colors"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span
                    lang="en"
                    className="font-mono text-gold text-[14px] tracking-[0.35em] tabular"
                  >
                    {c.num}
                  </span>
                  <span
                    lang="en"
                    className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                      c.tier === "displacement"
                        ? "border-gold/60 text-gold"
                        : "border-line/60 text-mute"
                    }`}
                  >
                    {c.tier === "displacement"
                      ? "DISPLACEMENT"
                      : c.tier === "subscriber"
                      ? "SUBSCRIBER PROTECT"
                      : "BRAND"}
                  </span>
                </div>
                <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight mb-3 leading-snug">
                  {c.title}
                </h3>
                <p className="text-mute leading-relaxed zh-body">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 02 WHY STRUCTURALLY NON-COPYABLE ──────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 02 · WHY PAID-PICK BUSINESSES STRUCTURALLY CANNOT SHIP THIS
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            這 9 條對他們是商業自殺 · 對我們是 <span className="text-gold">brand moat</span>
          </h2>
          <div className="space-y-4 text-mute leading-relaxed zh-body">
            <p>
              賣明牌的站 · 收費明牌群組 · sportsbook adjacents · 整個
              靠賣明牌賺錢的 service 經濟結構 violate 上面 1-5 + 8 共 6 條:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>他們的 revenue model 直接 OR 間接 來自 sportsbook conversion fee + referral commission(violate #2 #8)</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>他們的 data partnership 跟 betting platform license 是核心 revenue(violate #1 #4)</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>他們的 ads / affiliate 是核心 monetization(violate #3 #6)</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>「明牌」 內容 + paid pick + 老師收費 = paid recommendations(violate #3)</span>
              </li>
            </ul>
            <p className="pt-3">
              <strong className="text-bone">ZONE 27 structurally 可以 ship</strong> ·
              因為 incentive alignment 跟訪客在同一邊:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>FOUNDER NT$ 2,700/365 天 · 5% 抽成(BLACK 一半)· 會員不限量 · 前 270 拿編號</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>BLACK NT$ 500/31 天 manual subscription · 10% creator commission</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>引擎 FREE forever · 不 paywall predictions · 不藏 lens · 不 silently rotate engine</span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>您贏您輸 ZONE 27 都一樣賺 · 跟您在同一邊 · 不在對立面</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── 02B · MIT LICENSE LIMIT · honest limit-of-power disclosure ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-10">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 02B · MIT LICENSE LIMIT · 我們做不到的事
          </p>
          <div className="border border-line/70 bg-slate/30 p-5 sm:p-7">
            <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight mb-4 leading-snug">
              我們承諾我們不做 · 但我們不能阻止 fork
            </h3>
            <p className="text-mute leading-relaxed mb-4">
              ZONE 27 引擎是 MIT 授權的開源軟體(這就是我們「方法公開」的原則)。 任何 sportsbook 明天可以 fork lib/simulator.ts +
              lib/simulator-v03.ts · 包成 odds 服務賣。 我們的 9 commitments
              只 bind 我們的 actions · <strong className="text-bone">不能 bind
              code 的流向</strong>。
            </p>
            <p className="text-mute/85 leading-relaxed mb-4">
              <strong className="text-bone">透明 limit-of-power 比假裝沒 contradiction 強</strong>。
              此 commitment 「不分潤博彩」 = Tim signs 「ZONE 27 entity 不
              license / sell / API access 給 sportsbook」 · 不是「ZONE 27 code
              永遠不會出現在 sportsbook tool」 — 後者是 MIT license 物理 上做
              不到。
            </p>
            <p className="font-mono text-mute/80 text-[10px] tracking-[0.3em] leading-relaxed">
              ⚓ 若 sportsbook fork ZONE 27 · 我們會在{" "}
              <Link href="/audit" className="text-gold underline-offset-4 hover:underline">/audit</Link>
              {" "}列出 fork 事實 + publicly disavow · 不收 brand 利益關聯。
              限制公開 = 比假裝強大更可信。
            </p>
          </div>
        </section>

        {/* ── 03 PRE-COMMIT BINDING ────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 03 · PRE-COMMIT · BINDING RULES
          </p>
          <div className="border border-loss/30 bg-loss/5 p-5 sm:p-7">
            <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight mb-4 leading-snug">
              修改任何 commitment 需 30 天 /changelog 公告
            </h3>
            <p className="text-mute leading-relaxed mb-4">
              同 /audit S05 PRE-COMMIT pattern · /annual yearly publish
              pattern · /membership/black-card/ledger 5 rules pattern。
              此 /ethics page 上的 9 commitments 任一條 wording 改動 / 條件
              加 / 條件砍 · 全部需要:
            </p>
            <ol className="space-y-2 list-decimal pl-6 text-mute leading-relaxed mb-4">
              <li>30 天前 /changelog publish 公告 · 含 before/after diff + 理由</li>
              <li>30 天 freeze window · visitor 可在此期間發 GitHub Issue 反對</li>
              <li>30 天後新 commitment 生效 · /ethics page rewrite · git commit 為 source of truth</li>
              <li>每次修改在 commit message 強制 cite issue link · audit trail 1-click 可達</li>
            </ol>
            <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
              ⚓ 事前綁定的承諾 · 比事後找理由強 100× ·
              改 ethics 不是「動 page · 是動 brand 信仰 base」。
            </p>
          </div>
        </section>

        {/* ── BUS_FACTOR · solo-founder contingency disclosure ── */}
        <section
          id="bus-factor"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-14 border-t border-line/40 scroll-mt-20"
        >
          <div className="flex items-baseline gap-4 mb-2">
            <span
              lang="en"
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em]"
            >
              / 單人風險
            </span>
            <span
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.35em]"
            >
              CONTINGENCY · TIM 失蹤了
            </span>
          </div>
          <h2 className="text-3xl text-bone font-light tracking-tight mb-6">
            如果 Tim 失蹤了 · 全靠他一個人
          </h2>
          <p className="text-mute leading-relaxed mb-4">
            ZONE 27 是 solo founder · 0 employees · 0 contractors · 0
            outsourced ops。{" "}
            <strong className="text-bone">就只有 Tim 一個人</strong> · 如果
            Tim 出車禍 / 失蹤 / health-collapse · 整個 brand pipeline 中斷。
            這是 brand IP「稀缺手工」 的 cost · 不藏 · 此 section explicit
            codify what happens then。
          </p>
          <h3 className="text-bone text-lg mt-6 mb-3">您的資料 · 0 vendor lock-in</h3>
          <ul className="space-y-3 text-mute leading-relaxed zh-body">
            <li>
              <strong className="text-bone">您的 Founder ID + ledger row</strong>{" "}
              · 在{" "}
              <a
                href="https://github.com/Tim-xuan-you/zone27-web"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                GitHub zone27-web
              </a>{" "}
              repository · MIT licensed · 您 fork 自己 host 沒問題 · per /audit
              S05 + /transparency 02 NEVER list
            </li>
            <li>
              <strong className="text-bone">您的 PDF 證書 + welcome kit</strong>{" "}
              · 本機 · 您下載後永久 own · 不需要 ZONE 27 server 渲染
            </li>
            <li>
              <strong className="text-bone">您的 application + Tim email</strong>{" "}
              · 在您 Gmail inbox + Tim Gmail inbox · 兩處 copy · 即使 Tim
              帳號 frozen · 您 inbox 完整保留 audit trail
            </li>
            <li>
              <strong className="text-bone">Supabase 資料</strong> · zone27-prod
              Tokyo region · RLS-locked · 即使 Tim Vercel deploy 停止 · Supabase
              Pro tier 無人接管下 90 天 auto-pause 但不刪除 · 您 email reset
              可從 Supabase Auth 直接 recover。
            </li>
            <li>
              <strong className="text-bone">您 NT$ 2,700 paid FOUNDER</strong>{" "}
              · 14 天 cooling-off window 隨時可退款 · per /terms § 4B Taiwan
              消保法 § 19。 Tim 失蹤情境 · 因 service interruption · 您可
              email{" "}
              <a
                href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20service%20interruption%20refund"
                className="text-gold underline-offset-4 hover:underline"
              >
                tatayngiti@gmail.com
              </a>{" "}
              · 由 Tim 家人 / executor 退款處理(per /privacy Section 06B
              emergency contact provision)
            </li>
          </ul>
          <h3 className="text-bone text-lg mt-6 mb-3">為什麼不雇人 · 不外包?</h3>
          <p className="text-mute leading-relaxed mb-4">
            僱人 = 分散這個單人風險 · 但同時稀釋 brand identity。 ZONE 27 brand IP
            「Tim 親手」 = 「Tim 親眼 verify wire」 + 「Tim 親手 review
            application」 + 「Tim 親手 manually onboard」。 僱第 2 人 = 變 SaaS
            · 違反「倒置 SaaS」跟「稀缺、手工」這兩個原則。
          </p>
          <p className="text-mute leading-relaxed mb-4">
            <strong className="text-bone">所以選擇:</strong> 我選擇「只有一個人」
            的代價 · 因為這就是 brand 信用的根基。 為了減少您的
            risk · 我 ship 此 section 公開 · 您 see contingency = 您 conclude
            您 own 風險決定。
          </p>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ 同 Pinboard.in(Maciej Cegłowski 單人 17 年)· 同 Patek Philippe
            family-business 174 年 · 同 Berkshire Hathaway succession plan
            公開 · solo founder 老實講出單人風險 · 比 fake「team page · 10
            people」 brand-pure。
          </p>
        </section>

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 對標、取代 靠賣明牌的生意 的品牌底層落地 ·
            <strong>不是 marketing copy</strong>。 9 條是 hard commitments +
            單人風險的接管安排 · 違反任一條 = brand 信用
            collapse · 即使違反 1 次 · /ethics page 上會出現「{COMMITMENTS[0].num}
            {" "}- VIOLATED YYYY-MM-DD · see /changelog」 紅色 alert · 永久
            visible · per /audit S05 PRE-COMMIT
            「不刪不藏」 pattern。
          </p>
          <p>
            Stratechery About page Ben Thompson 6 commitments · ZONE 27 9
            commitments · 不是 incremental more · 是 displacement-specific
            more · 第 1 + 2 + 4 + 5 + 8 + 9 是 ZONE 27-only 6 條 ·
            <strong>靠賣明牌的生意,結構上永遠 ship 不出來</strong> · 因為他們 violate
            這 6 條 == 他們整個 revenue model 構成。
          </p>
          <p>
            修改此 page 9 commitments 需 30 天 /changelog 公告 · 同{" "}
            <Link href="/audit#section-05" className="text-gold hover:underline">/audit S05</Link>{" "}
            PRE-COMMIT pattern · 用實際成本背書 · 同{" "}
            <Link href="/integrity" className="text-gold hover:underline">/integrity 22 binding rules</Link>{" "}
            modification protocol 軸線一致。 違反任一條 = 紅字永久標 in{" "}
            <Link href="/track-record" className="text-gold hover:underline">/track-record</Link>。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/ethics" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            ETHICS IS PHYSICS · NOT MARKETING.
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight mb-4">
            9 條 binding · 0 wiggle room · 0 fine print。
          </h3>
          {/* Round 51 W-C · Agent 3 HIGH #6 fix · /ethics 缺 conversion
              CTA at page end · 讀完 9 commitments 訪客是 strongest possible
              warm-up state · trust loop must close to FOUNDER / BLACK
              CARD entry · 不 dump 到 navigation 即跑路。 加 explicit Founders
              27 + BLACK chip · 同 trust artifacts 並列 surface · 訪客
              可 1-tap action。 */}
          <p className="text-mute text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            這 9 條 commitment 改變了您的判斷嗎? 加入 ZONE 27 ·
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              href="/founders"
              className="inline-block px-6 py-3 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              → FOUNDER · NT$ 2,700/365 天
            </Link>
            <Link
              href="/membership/black-card"
              className="inline-block px-6 py-3 border border-gold text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → BLACK · NT$ 500/31 天(R81 pivot)
            </Link>
          </div>
          <p
            lang="en"
            className="font-mono text-mute/85 text-[10px] tracking-[0.35em] mb-6"
          >
            OR DIG DEEPER ·
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/steelman"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /steelman 6 strongest objections
            </Link>
            <Link
              href="/audit"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /audit S05 · DISCLOSURE PHILOSOPHY
            </Link>
            <Link
              href="/coverage"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /coverage NEVER list
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
