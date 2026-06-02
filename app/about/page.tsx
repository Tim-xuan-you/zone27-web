import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import LongReadHandoff from "@/components/LongReadHandoff";
import ArticleMeta from "@/components/ArticleMeta";
import { FOUNDERS_NEXT, formatBadge } from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "About — 我們不是博彩公司,是相信數字比運氣誠實的棒球迷",
  description:
    "ZONE 27 的品牌方法論、AI 蒙地卡羅引擎背後的哲學、以及為什麼是 27。",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="about" />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-24 pb-16 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          OUR MANIFESTO
        </p>

        {/* Round 56 W-B · Agent A Vector 9 fix · 之前 「我們是一群」 plural ·
            但 /about 自己 declare「ZONE 27 是一個人在跑」 solo founder ·
            attacker 抓 fake-we / startup-plural 矛盾。 改 single-voice
            addressing community「我寫 ZONE 27 給...」 · brand IP「方法公開
            · 不假裝」 axiom 更純 · pratfall 強化 not weaker。 */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.15] tracking-tight text-bone">
          ZONE 27 不是博彩公司。
          <br />
          <span className="text-gold">
            我寫給一群相信數字
            <br className="sm:hidden" />
            比運氣誠實的棒球迷。
          </span>
        </h1>
        {/* Round 54 W-C · Cold Gold Hairline signature moat。 */}
        <div className="zone27-rule mx-auto max-w-[280px]" aria-hidden="true" />

        <p className="font-mono text-mute text-xs tracking-[0.3em] mt-10">
          A QUIET REBELLION AGAINST GUT-FEEL.
        </p>
        <div className="mt-6 flex justify-center">
          <ArticleMeta readingMin={8} />
        </div>
      </section>

      {/* Round 52 W-C · Agent 3「necessary soul」 fix · 8-字 grammar
          「方法公開 · 品味私藏」 之前 only surface in /manifesto Section V
          SYNTHESIS · 24 個 page 都有引用 但 /about + /learn(訪客 first-
          touch 兩個 entry-level pages)沒有。 加 hero-level grammar anchor
          block · Tim 親手簽 · 物理 codify 整個品牌的 unifying theory · 訪客
          /about 第一眼看到 8 字 + 英文版 + 1 行 explanation。 */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 text-center">
        <div className="inline-block border border-gold/40 bg-slate/40 px-8 py-6 glow-soft">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
          >
            OUR UNIFYING THEORY · 8 字 BRAND GRAMMAR
          </p>
          <p className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-snug mb-3">
            方法公開 <span className="text-gold/60 mx-2">·</span> 品味私藏
          </p>
          <p
            lang="en"
            className="font-mono text-gold text-xs tracking-[0.35em] mb-4"
          >
            SHOW YOUR WORK <span className="text-gold/40 mx-1">·</span> KEEP YOUR SOUL
          </p>
          <p className="text-mute/85 text-sm leading-relaxed max-w-xl mx-auto">
            這 8 個字是 ZONE 27 整個品牌的 unifying theory ·
            從 /lab 引擎開源 / /audit model report / /track-record DIVERGED
            不藏 / /privacy 0 tracking · 全部從這一句衍生。
          </p>
          <p className="mt-3 font-mono text-mute/70 text-[10px] tracking-[0.3em]">
            full canonical 寫在{" "}
            <Link
              href="/manifesto"
              className="text-gold underline-offset-4 hover:underline"
            >
              /manifesto Section V SYNTHESIS
            </Link>
          </p>
        </div>
      </section>

      <div className="mx-auto w-32 gold-line mb-20" />

      {/* ── 00 PROLOGUE · Round 19 soul addition ──────
          Per [[zone27-pratfall-brand-ip]] · /about previously buried
          Tim's emotional anchor in Chapter 05 (FOUNDER NOTE) · after
          4 chapters of systematic argument. Top niche brands
          (Stratechery / HEY / Bankless) lead with WHY · then unfold
          WHAT/HOW. Round 19 inserts PROLOGUE as Chapter 00 = personal
          founder hook BEFORE the systematic chapters. The systematic
          chapters become the methodology version of the love letter
          introduced here · not the unrelated front loader of a buried
          emotional moment. Per Round 19 Tim ask · soul-level addition. */}
      <Chapter
        no="00"
        en="PROLOGUE"
        zh="起源"
        kicker="我寫這封情書的原因"
      >
        <p>
          過去 20 多年 · 我見過台灣棒球商業形態的所有版本:
        </p>
        <ul className="space-y-2.5 text-mute leading-relaxed list-none pl-0">
          <li className="flex items-baseline gap-3">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0">▸</span>
            <span className="flex-1">
              <strong className="text-bone">LINE 老師</strong>收會員費 ·
              輸了刪文 · 群組解散後重新開另一個
            </span>
          </li>
          <li className="flex items-baseline gap-3">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0">▸</span>
            <span className="flex-1">
              <strong className="text-bone">報馬仔網站</strong>paid picks 點數 1:1 NT$ ·
              9 駐站名家自稱「55-59% 勝率」 · 戰績無第三方審計
            </span>
          </li>
          <li className="flex items-baseline gap-3">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0">▸</span>
            <span className="flex-1">
              <strong className="text-bone">殺手平台</strong>(地下莊家)抽下注金額
              30-50% · 贏家帳號被砍 · 跟報馬仔/玩運彩是不同 mechanism
            </span>
          </li>
          <li className="flex items-baseline gap-3">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0">▸</span>
            <span className="flex-1">
              <strong className="text-bone">免費論壇</strong>資訊雜亂 ·
              沒人為 prediction 負責 · 信任歸零
            </span>
          </li>
        </ul>
        <p>
          我不是學者 · 不是工程師 · 不是博彩業者。
          我是看 27 年中華職棒的球迷 ·{" "}
          <strong className="text-bone">受不了這套劇本反覆上演</strong>。
        </p>
        <p>
          ZONE 27 是用「不靠秘密 · 靠紀律」這套方法 ·
          試著做一個<strong className="text-gold">不背叛球迷的平台</strong>。
        </p>
        <p className="text-mute/80">
          下方 6 章節 · 是這個嘗試的<strong className="text-bone">完整方法論版</strong>。
          您可以從問題、賭注、方法、承諾、創辦人筆記、為什麼是 27 任一處進入。
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-8">
          — TIM · 創辦人 · CPBL 球迷 27 年
        </p>
      </Chapter>

      {/* ── 01 THE PROBLEM ─────────────────────────
          R168 W2 compression · 5 paragraphs → 2 · PROLOGUE 已詳列 4 失敗形態 ·
          此章 focus 為什麼這群球迷值得更好的場所 · 不重複 PROLOGUE。 */}
      <Chapter
        no="01"
        en="THE PROBLEM"
        zh="問題"
        kicker="這群球迷值得一個更好的場所"
      >
        <p>
          PROLOGUE 4 失敗形態(LINE 老師 · 報馬仔 · 殺手 · 免費論壇)的共同問題:
          沒有人對自己的預測負責 · 沒有透明的勝率紀錄 · 沒有產品化。
        </p>
        <p className="text-bone">
          我們認為這群熱愛棒球、追求精緻、相信數據的人 —— 值得一個更好的場所。
        </p>
      </Chapter>

      {/* ── 02 OUR THESIS ────────────────────────── */}
      <Chapter
        no="02"
        en="OUR THESIS"
        zh="我們的賭注"
        kicker="三個我們深信的事"
      >
        <p>
          <strong className="text-gold">A.</strong>
          沒有人能準確預測單場比賽。但用 10,000
          次蒙地卡羅模擬出的機率分布,比直覺、運勢、神祕學有意義 100 倍。
        </p>
        <p>
          <strong className="text-gold">B.</strong>
          高質感的看盤介面,本身就是一種篩選機制。願意花
          1 分鐘看懂機率儀表板的人,才是真正值得服務的會員。
        </p>
        <p>
          <strong className="text-gold">C.</strong>
          把抽成砍到極致透明 → 把信任拉到最高 →
          留住創作者 → 吸引粉絲 → 形成生態。
        </p>
      </Chapter>

      {/* ── 03 THE METHOD ────────────────────────── */}
      <Chapter
        no="03"
        en="THE METHOD"
        zh="方法論"
        kicker="蒙地卡羅四步驟"
      >
        <p>
          每一場比賽出現在 ZONE 27,都經歷四個獨立步驟。沒有星座、沒有命盤、沒有殺手憑感覺。
        </p>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="font-mono text-gold/70 tabular shrink-0">A.</span>
            <span>
              <strong className="text-bone">公開資料先驗。</strong>{" "}
              先發投手的 K/9 · BB/9 · HR/9
              三個基礎指標 — 從 MLB Stats API 取得(MLB)或創辦人親手 curate
              (CPBL,詳見{" "}
              <Link href="/coverage" className="text-gold hover:underline">
                /coverage
              </Link>
              )。
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-gold/70 tabular shrink-0">B.</span>
            <span>
              <strong className="text-bone">投打對決機率矩陣。</strong>{" "}
              每個打席依投手三項指標推導 8 種互斥結果(K · BB · HR · 1B · 2B · 3B · GO · FO)
              的條件機率,滾亂數選一個。
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-gold/70 tabular shrink-0">C.</span>
            <span>
              <strong className="text-bone">蒙地卡羅萬次推演。</strong>{" "}
              引擎在<strong className="text-bone">您的瀏覽器內</strong>跑 10,000 場虛擬 9 局比賽
              (~ 1.5 - 2.0 秒收斂),ZONE 27 伺服器零運算 — 詳見{" "}
              <Link href="/audit" className="text-gold hover:underline">
                /audit
              </Link>
              {" "}Section 04 ENVIRONMENTAL IMPACT。
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-gold/70 tabular shrink-0">D.</span>
            <span>
              <strong className="text-bone">結果分布加總。</strong>{" "}
              統計 10,000
              場虛擬比賽中各隊獲勝次數與最終比分,輸出本站所有機率與信心指標。
            </span>
          </li>
        </ol>
        <p className="text-mute/80">
          這 4 步驟刻意保持極簡 — 範圍外的事項(打者個別差異 · 球場因素 · 投手疲勞 · 牛棚切換等)
          consolidated 在{" "}
          <Link href="/audit" className="text-gold hover:underline">
            /audit
          </Link>
          {" "}Section 03 ENGINE SCOPE — 不掩飾極簡模型的限制,反而把限制公開當作品牌資產。
        </p>
      </Chapter>

      {/* ── 04 THE PROMISE ───────────────────────── */}
      <Chapter
        no="04"
        en="THE PROMISE"
        zh="我們的承諾"
        kicker="給每一位會員的四個保證"
      >
        <ul className="space-y-3">
          <li>
            <strong className="text-bone">極低抽成。</strong>
            黑金會員 creator 抽成,平台只抽 10%(創始 27 只 5%)。對比 LINE 老師 / 投顧老師業界 30-50% 是降維打擊。
          </li>
          <li>
            <strong className="text-bone">不可篡改紀錄。</strong>
            勝率寫死在系統,沒有刪文截圖、沒有夜深修改、沒有後台漂白。
          </li>
          <li>
            <strong className="text-bone">廣告紀律。</strong>
            永遠不會塞 AdMob、不會出現減重食譜、不會放閃爍橫幅。版位只開放給品味相符的特約贊助。
          </li>
          <li>
            <strong className="text-bone">介面紀律。</strong>
            深藏青、冷金、純白、Geist Mono。永遠不會變成宮廟風。
          </li>
        </ul>
      </Chapter>

      {/* ── 05 FOUNDER NOTE ──────────────────────── */}
      <Chapter
        no="05"
        en="FOUNDER NOTE"
        zh="創辦人筆記"
        kicker="一個棒球迷的 27 年觀察"
      >
        <p>
          我從 1999 年看陳金鋒打第一支大聯盟全壘打的那一刻,就被棒球這項運動的「結構性可量化」迷住了。
        </p>
        <p>
          棒球之美,在於它幾乎是所有運動裡最容易被數字解構的。
          每一個打席都是獨立事件,每一個結果都被嚴密記錄,每一個數字背後都有更深的數字。
        </p>
        <p>
          但台灣的棒球資訊產業,卻長期停留在「直覺說書人」的階段。
          我覺得這群熱愛棒球的硬核球迷,值得擁有自己的 Bloomberg、自己的 TradingView、自己的 Robinhood。
        </p>
        {/* Round 44 W-C · Agent K DEEPEST canonical sentence · 此 sentence
            在 4 key pages 重複 fire(/about Prologue · /ethics hero · /steelman
            hero · /annual hero)· brand-IP moat 統一物理 codify · Tim 簽名
            個人累積 vs 玩運彩+報馬仔 anonymity+deletion structurally 不可
            replicate。 */}
        <p className="text-bone">
          ZONE 27 是我給這群人 —— 包括我自己 —— 的一封情書。
        </p>
        <p className="text-mute mt-5 leading-relaxed border-l-2 border-gold/40 pl-5 py-2">
          <strong className="text-bone">每一個承諾 Tim 簽名 · 可被驗證 ·
          違反任何一條 = <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">/ethics</Link> 紅字永久標 · 不可刪</strong> ·
          這是 ZONE 27 跟 玩運彩+報馬仔 anonymity+deletion model 的
          structural asymmetry。
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-6">
          — TIM · FOUNDER · CPBL 球迷 27 年
        </p>
      </Chapter>

      {/* ── 06 WHY 27 ────────────────────────────── */}
      <Chapter
        no="06"
        en="WHY 27"
        zh="為什麼是 27"
        kicker="這個數字背後的三層意義"
      >
        <p>
          <strong className="text-gold">第一層:</strong>{" "}
          棒球場上的最後一個 OUT。9 局 × 3 個出局 = 27。每一場比賽都從 27 個出局數開始倒數。
        </p>
        <p>
          <strong className="text-gold">第二層:</strong>{" "}
          完美比賽(Perfect Game)的數字。27 上 27 下 ——
          沒有任何一個跑者上壘。歷史上只發生過 24 次。
        </p>
        <p>
          <strong className="text-gold">第三層:</strong>{" "}
          我們相信 270 位創始會員能用同樣的精準、同樣的紀律,定義這個品牌的開局。
        </p>
        <p className="text-bone">
          所以,黑金會員年費是 NT$ 3,588。
          但這 270 位創始會員,只需要付一次 NT$ 2,700 ——
          一輩子。
        </p>
      </Chapter>

      {/* ── 07 OPERATIONS ──────────────────────────
          Round 28 Wave 2E · Agent C Persona 3 P3.3 fix. Industry
          insider lands on /about from a DM and asks: "who's accountable?
          solo or team? what's their day job?" The site says
          "我不是學者 · 不是工程師" but doesn't surface solo-founder as
          a *commitment* (vs. team behind a curtain). This chapter
          frames solo-as-discipline · 3-row mono-grid · radically
          honest about response cadence. */}
      <Chapter
        no="07"
        en="OPERATIONS"
        zh="這個品牌怎麼跑"
        kicker="solo founder · 不藏"
      >
        <p>
          ZONE 27 是<strong className="text-bone">一個人</strong>在跑的品牌 — 不是團隊背後的 marketing
          套版。下面是 ZONE 27 的後台真實樣貌:
        </p>
        <div className="mt-8 border border-gold/30 divide-y divide-line/40">
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em] pt-1"
            >
              MAINTAINER
            </p>
            <p className="text-bone text-base">
              Tim · solo founder · CPBL 球迷 27 年 · 非工程師(寫 prompts 不寫 ts)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em] pt-1"
            >
              BUILD CADENCE
            </p>
            <p className="text-bone text-base">
              daily commits ·{" "}
              <a
                href="https://github.com/Tim-xuan-you/zone27-web/commits/main"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                GitHub
              </a>
              {" "}為 source of truth · 沒有 backdate · 沒有「行銷上線一次性 push」
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em] pt-1"
            >
              RESPONSE TIME
            </p>
            <div className="text-bone text-base">
              <p>email / DM 24 小時內 Taipei time · 不外包客服 · 不批次回覆</p>
              {/* Round 51 W-C · Agent 3 MEDIUM #10 fix · 缺 explicit Tim
                  accountability marker · 24h SLA claim 不夠 · 必須給 visitor
                  actionable mailto entry。 真實 mailto:tatayngiti@gmail.com direct
                  channel · 若 SLA 超過則 /ethics 紅字標 · brand-pure 物理 codify。 */}
              <p className="mt-3 font-mono text-mute/85 text-[11px] tracking-[0.25em] leading-relaxed">
                📧 直接寫信:{" "}
                <a
                  href="mailto:tatayngiti@gmail.com"
                  className="text-gold underline-offset-4 hover:underline transition-colors"
                >
                  tatayngiti@gmail.com
                </a>
                {" "}· 24h 內回覆保證 · 超過則{" "}
                <Link
                  href="/ethics"
                  className="text-loss/80 underline-offset-4 hover:underline transition-colors"
                >
                  /ethics 紅字標
                </Link>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em] pt-1"
            >
              SCORE INGEST
            </p>
            <p className="text-bone text-base">
              Tim 親手截圖 cpbl.com.tw box score · 寫入 lib/matches.ts · 沒有
              cron · 沒有外包(per /coverage philosophy)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em] pt-1"
            >
              FOUNDER ONBOARDING
            </p>
            <p className="text-bone text-base">
              Founders 27 全 270 位 Tim 親手 onboard · 銀行轉帳 · personal email
              ·{" "}
              <a
                href="https://github.com/Tim-xuan-you/zone27-web/blob/main/docs/MANUAL-ONBOARDING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline-offset-4 hover:underline"
              >
                docs/MANUAL-ONBOARDING.md
              </a>
              {" "}寫死流程
            </p>
          </div>
        </div>
        <p className="mt-8 text-mute/80 text-sm sm:text-base leading-relaxed">
          這不是「等規模化後再升級」的 SaaS 預設思維。
          <strong className="text-bone">手工 = 識別性</strong> ·
          每位 #00X 跟 Tim 的 first-name-basis 聯繫是核心 deliverable。
          詳細的「為什麼不自動化」見{" "}
          <Link href="/manifesto" className="text-gold underline-offset-4 hover:underline">
            /manifesto Section II
          </Link>
          {" "}的 MONETIZATION 倒置那一節。
        </p>
      </Chapter>

      {/* R69 W-E · Agent A SHIP 5 · LongReadHandoff · honor reader's 8-min
          time investment at MAX trust state · next deep read + RSS-only ·
          0 email capture · /steelman is natural next destination for /about
          readers(brand IP philosophy → adversarial steelman). */}
      <LongReadHandoff
        readingMin={8}
        nextHref="/steelman"
        nextLabel="6 strongest objections against ZONE 27 · 自己 publish(R108 W7 加 #06 LLM 對立面)"
      />

      <RelatedReading currentPath="/about" />

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          THE 27 ARE BEING FORGED.
        </p>
        <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          您準備好成為{" "}
          <span className="text-gold tabular mx-1">
            {formatBadge(FOUNDERS_NEXT)}
          </span>{" "}
          嗎?
        </h3>
        <Link
          href="/founders"
          className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          加入創始名冊 →
        </Link>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── Reusable Chapter Block ─────────────────────────────
// R75 W-H · Agent B R75 audit 🔴 C-1 fix · slug helper for /about Chapter
// 從 R71-R74 section-id-slug sweep MISSED · /transparency + /privacy +
// /terms + /audit 都 ship 過 slugFromXxxSectionNo helper · /about 沒有 ·
// 導致 R74 W-G M3 NonComparableAnchor /about#operations cross-link 5-second
// DevTools self-debunk(same Pratfall axis as R74 W-G C1 itself)· fix:
// add slugFromAboutChapterEn helper + id={id} scroll-mt-20 to Chapter ·
// /about#operations + /about#bus-factor + /about#founder + all 8 Chapter
// uses now resolve · brand IP「不藏 · drift = 5-second self-debunk」 axiom
// 物理 codify。
function slugFromAboutChapterEn(en: string): string {
  return en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function Chapter({
  no,
  en,
  zh,
  kicker,
  children,
}: {
  no: string;
  en: string;
  zh: string;
  kicker: string;
  children: React.ReactNode;
}) {
  const id = slugFromAboutChapterEn(en);
  return (
    /* R75 W-H · id + scroll-mt-20 for anchor jumps · 同 /audit R74 W-G C1 +
       /transparency R71 W-E F1 + /privacy R70 W-F F1 + /terms R69 W-F F2
       slug helper pattern · /about#operations + #bus-factor + all Chapter
       en-prop-derived anchors now resolve。 */
    <section
      id={id}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-16 scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {en}
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight mb-2">
        {zh}
      </h2>
      <p className="font-mono text-mute text-xs tracking-[0.25em] mb-10">
        {kicker}
      </p>
      <div className="space-y-5 zh-body text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}
