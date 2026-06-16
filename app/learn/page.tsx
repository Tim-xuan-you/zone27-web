import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import ArticleMeta from "@/components/ArticleMeta";
import StatTerm from "@/components/StatTerm";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "6 分鐘看懂 ZONE 27 — 給沒聽過 Bill James 的人",
  description:
    "對棒球有興趣但不懂進階數據?從這裡開始。4 個章節 · 6 分鐘 · 不需要統計學背景。為什麼運氣不是答案 · 機率分布到底在說什麼 · 為什麼 ZONE 27 不是博彩 · 為什麼沒有神準。",
  ogTitle: "6 分鐘看懂 ZONE 27 · 給沒聽過 Bill James 的人",
  ogDescription:
    "4 章節 · 6 分鐘 · 不需要統計學背景 · 為什麼運氣不是答案 · 為什麼不是博彩 · 沒有神準",
  path: "/learn",
});

// ── ZONE 27 · /learn — 5-minute primer for non-quant visitors ──
// Why this page exists:
// Tim asked 2026-05-20: "Bill James 1985 理論,也是您說我才知道"
// — meaning even the founder didn't know sabermetrics terminology.
// That's the gap: the rest of the site assumes you already know
// what K/9 means. /learn is the front door for visitors who are
// curious about baseball but haven't been initiated into quant.
//
// Tone: accessible, no condescension. Treats the reader as smart
// but uninitiated. Avoids the trap of "explain like I'm five" —
// instead it's "explain like I'm a curious adult who happens not
// to know this domain yet."
//
// Each of the 4 chapters ends with a concrete next-step link
// (to /lab, /methodology, /membership, /calibration) to avoid dead-end pages.
//
// Aligned with [[zone27-disclosure-philosophy]]:
//   Teaching the public the math IS the disclosure.
//   Not "we have a secret model" but "here's how the math works."
// ─────────────────────────────────────────────────────

export default function LearnPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            6 分鐘入門 · BEFORE YOU INVEST AN HOUR
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
            您不需要懂 Bill James
            <br />
            <span className="text-gold">就可以開始</span>。
          </h1>
          <p className="mt-10 max-w-xl mx-auto text-mute leading-relaxed">
            ZONE 27 用引擎拆解棒球比賽勝率。
            但如果您從來沒讀過進階棒球數據 · 這頁是專屬給您的 6 分鐘入門。
          </p>
          <p className="mt-4 max-w-xl mx-auto font-mono text-mute/70 text-[10px] tracking-[0.3em]">
            4 CHAPTERS · NO STATS DEGREE REQUIRED · NO PREVIOUS BASEBALL VOCAB
          </p>
          <div className="mt-6 flex justify-center">
            <ArticleMeta readingMin={6} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── CHAPTER 01 ───────────────────────────── */}
        <Chapter
          no="01"
          en="WHY PROBABILITY"
          zh="為什麼是「機率」,不是「鐵口直斷」"
          kicker="2 分鐘"
        >
          <p>
            棒球場上,
            <strong className="text-bone">沒有任何人能準確預測單場比賽</strong>。
            一支 prime 的兄弟可能輸給冷門的味全,一個王牌投手可能在第 2 局被打爆。
            這是棒球的本質 — 它有<strong className="text-bone">不可預測的隨機性</strong>。
          </p>
          <p>
            但<strong className="text-gold">機率分布</strong>是另一個東西。
            它不告訴您「兄弟今天會贏」 · 它告訴您「
            <strong className="text-bone">兄弟今天有 62% 機率贏</strong>,
            這個數字基於模型考慮的所有變數」。
          </p>
          <p>
            想像擲一個有偏的骰子:沒有人能預測下一次擲出什麼,
            但您可以說「6 點出現的機率是 25%」 — 這個機率是可驗證的、可重現的、不是猜的。
          </p>
          <p>
            ZONE 27 的引擎做的是後者:<strong className="text-gold">機率分布</strong>,不是鐵口直斷。
          </p>
          <ChapterFooter
            cta="親手試一場 →"
            href="/lab"
            note="按 RUN 看演算法在您瀏覽器即時跑出 10,000 場虛擬比賽 · 收斂到穩定機率"
          />
        </Chapter>

        {/* ── CHAPTER 02 ───────────────────────────── */}
        <Chapter
          no="02"
          en="WHAT THE STATS MEAN"
          zh="3 個指標 · 看懂為什麼引擎信任它們"
          kicker="2 分鐘"
        >
          <p>
            ZONE 27 引擎只用 3 個基礎投手指標推導比賽機率。每個指標都有它的「為什麼」:
          </p>

          <PrimerStat
            term="K/9"
            zh="每九局三振率"
            explain="投手 9 局能拿多少三振。直接反映壓制力。一個 K/9 = 11 的投手 vs 一個 K/9 = 6 的投手,在每個打席的「直接拿下出局數」能力天差地別。"
            example="兄弟王牌德保拉 K/9 ≈ 9.2 · 業餘菜鳥 K/9 ≈ 5.0"
          />

          <PrimerStat
            term="BB/9"
            zh="每九局保送率"
            explain="投手 9 局送出多少四壞球。低 = 控球好 · 高 = 容易在關鍵時刻自爆。一個 BB/9 = 1.5 的投手很少把人「送上壘」 · BB/9 = 5 的投手三天兩頭滿壘自爆。"
            example="頂級 < 2.0 · 聯盟平均 ~ 3.0 · 危險 > 4.0"
          />

          <PrimerStat
            term="HR/9"
            zh="每九局被全壘打數"
            explain="投手 9 局被打多少 HR。HR 不只是 1 分 · 壘上有人時被掃光是「爆炸性失分」。HR/9 高的投手在 1-2 球之內可能把優勢逆轉。"
            example="王牌 < 0.7 · 聯盟平均 ~ 1.0 · 容易被打爆 > 1.3"
          />

          <p className="mt-6 text-mute/80">
            <strong className="text-bone">沒有更多了。</strong>{" "}
            這就是 v0.2 引擎的全部輸入 — 3 個數字,沒有玄學、沒有星座、沒有靠感覺報牌。
            想看更多進階指標(<StatTerm term="OPS" />,
            {" "}<StatTerm term="wRC+" />,{" "}
            <StatTerm term="WAR" />)的解釋?
          </p>

          <ChapterFooter
            cta="完整方法論白皮書 →"
            href="/methodology"
            note="ERA · WHIP · OPS · BABIP · wRC+ · 進階指標逐一解釋"
          />
        </Chapter>

        {/* ── CHAPTER 03 ───────────────────────────── */}
        <Chapter
          no="03"
          en="WHY NOT GAMBLING"
          zh="為什麼 ZONE 27 不是博彩平台"
          kicker="1 分鐘"
          anchor="why-not-gambling"
        >
          <p>
            如果您看到「機率」「賠率」「edge」這些字 · 可能會以為 ZONE 27 是某種運彩或抽下注的莊家。
            <strong className="text-bone">不是。</strong>
          </p>
          <p>
            下注平台、賣明牌的站、收費明牌群組賣的是「下注方向」 —
            「兄弟今天贏 · 讓 1.5 · 押這個」。這套東西的問題不是準不準
            · 是<strong className="text-bone">商業模式跟您站在對立面</strong>:
            您輸越多 · 平台抽得越多 · 您贏太多 · 帳號被砍。
          </p>
          <p>
            ZONE 27 的商業模式跟您站<strong className="text-bone">同一邊</strong>:
          </p>
          <ul className="space-y-2 list-none pl-0">
            <li>▸ 我們<strong className="text-bone">不接受下注</strong> · 沒有彩金 · 沒有對賭</li>
            <li>▸ 我們<strong className="text-bone">不收交易抽成</strong>(您下注我們不賺)</li>
            <li>▸ 我們的收入是 GOLD 年度會員 + BLACK 31 天通行 — 您贏您輸都一樣</li>
          </ul>
          <p>
            如果您看完機率之後仍想去博彩平台下注?那是您的選擇 — 我們不阻止也不從中抽錢。
            但我們會明確告訴您:
            <strong className="text-bone">每個機率都有 50% 的相反可能 · 不要把 ZONE 27 當保證</strong>。
          </p>
          <ChapterFooter
            cta="ZONE 27 4-tier 會員制 →"
            href="/membership"
            note="從匿名免費到 NT$ 2,700 / 年 · 任時可選 · 我們不催"
          />
        </Chapter>

        {/* ── CHAPTER 04 · 缺的核心概念:校準 ──────────
            新手讀完機率/指標/不是博彩,卻沒學到品牌的地基 = 校準 + 57% 天花板。
            補完概念弧:機率 → 指標 → 不是博彩 → 沒人是神,我們比誠實。
            接到 /calibration(完整證據)+ /calibration/test(換你當引擎)。 */}
        <Chapter
          no="04"
          en="NOBODY IS PSYCHIC"
          zh="為什麼沒有「神準」這回事"
          kicker="1 分鐘"
          anchor="no-oracle"
        >
          <p>看到這裡您可能想問:那 ZONE 27 的引擎,到底準不準?</p>
          <p>
            老實說 —— 全世界最強的模型,賽前單場勝率也只到大約{" "}
            <strong className="text-bone">5 成 7</strong>。 這是天花板,不是我們不夠努力:
            棒球本來就有一半是運氣。 所以任何喊「<strong className="text-bone">94% 神準</strong>」的,
            數學上就是在騙你。
          </p>
          <p>
            既然沒人能神準,我們就不比「誰猜得準」 · 改比
            <strong className="text-bone">「誰夠誠實」</strong>。 衡量的方式叫
            <strong className="text-bone">校準</strong>:當引擎說 67%,長期下來那種場,
            真的要有大約 67% 發生才算數。 一個說 6 成、就真的中 6 成的人,
            比一個天天截圖喊神準、輸了就刪文的人,可信太多。
          </p>
          <p>
            而且這不是嘴上講。 我們把每一場的賽前預測對上實際結果全攤開,
            <strong className="text-bone">命中、落空都掛,刪不掉</strong> —— 您可以自己驗。
            不信引擎?{" "}
            <Link href="/calibration/test" className="text-gold hover:underline">
              先別下注,玩一次「換你當引擎」測你自己有多準 →
            </Link>
          </p>
          <ChapterFooter
            cta="看引擎準不準 · 公開校準 →"
            href="/calibration"
            note="當引擎說 67% · 實際發生幾成?賽前預測對上真實結果 · 命中落空都掛"
          />
        </Chapter>

        {/* ── SERIES · 誠實讀一個機率 ───────────────────
            修 R231:此三篇科普(streaks/sample-size/reading-a-probability)原本只能從
            footer 的延伸閱讀摸到 = 形同孤兒。 在 primer 正文補一個系列入口,讓前門就看得到。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 pt-16 border-t border-line/40">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">
            誠實讀一個機率 · 科普系列
          </p>
          <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight mb-4 leading-snug">
            想再深一點?<span className="text-gold">三篇,把機率讀懂。</span>
          </h2>
          <p className="text-mute leading-relaxed mb-8 max-w-xl">
            賣明牌的,靠你「看不懂機率」賺錢。 這三篇免費把它說白:連勝為什麼會騙你、
            一個準度要打幾場才算數、「62%」到底在說什麼。
            讀完,你就拆得掉任何一張神準截圖。
          </p>
          <div className="space-y-3">
            <SeriesItem
              no="第一篇"
              href="/learn/streaks"
              title="連勝,是最會騙人的那個數字"
              note="變異數 · 銅板也能連 7 次正面"
            />
            <SeriesItem
              no="第二篇"
              href="/learn/sample-size"
              title="10 場的神準,是運氣還沒被攤平"
              note="樣本量 · 沒掛場數的準度等於沒說"
            />
            <SeriesItem
              no="第三篇"
              href="/learn/reading-a-probability"
              title="「62%」,不是「他會贏」的意思"
              note="讀一個機率 · 它早就把會輸算進去了"
            />
          </div>
        </section>

        {/* ── 這條路 · 路線圖 ─────────────────────────
            把入門/科普/校準/讀球/帳本串成一條「你在這 → 畢業」的路,收尾閉環到真實鎖定 +
            掙來的榮譽(準心/對帳之星)。 不賣明牌、教到你不需要我們 = 反報馬仔終局。
            軟脊椎:不開 /school 頂層、不改首頁、不命名儀式。 取代原本散開的 WHERE NEXT 三格 ——
            那是「接下來去哪」的清單,這是「整條路、有頭有尾、最後落在你自己的帳本」的旅程。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 pt-16 border-t border-line/40">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            這條路 · 你在哪、接下來去哪
          </p>
          <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-snug mb-5">
            從這裡 · 一直到你<span className="text-gold">不需要任何人報牌</span>。
          </h2>
          <p className="text-mute leading-relaxed mb-10 max-w-xl">
            ZONE 27 不賣明牌。 我們做的是另一件事 —— 把「自己讀球、自己對帳」一階一階交到你手上,
            教到你連我們的引擎都可以站上去挑戰。 下面是整條路,你已經踏出前兩步了。
          </p>

          <div>
            <PathStage no="第 0 階" done title="讀懂一個機率">
              62% 不是「他會贏」,是「看好、但內含 38% 會輸」。 你剛讀完的四章就是這一階 ——
              從此沒有人能用「神準」「穩賺」唬住你。
            </PathStage>
            <PathStage no="第 1 階" done title="拆穿任何一張神準截圖">
              連勝會騙人、十場神準是運氣還沒攤平、信心不是保證。 上面那三篇科普就是這一階 ——
              讀完,賣明牌的截圖你一眼看穿。
            </PathStage>
            <PathStage
              no="第 2 階"
              title="換你當引擎 —— 先測你自己多準"
              links={[{ cta: "玩一次「換你當引擎」→", href: "/calibration/test" }]}
            >
              藏住比分,你滑出你的把握,再翻開。 30 秒,你會撞到那道「全世界最強模型也只到
              5 成 7」的牆。 不用登入。
              <span className="block mt-3 text-mute/85">
                ▸ 而且這把尺不只量球。 你的直覺、你阿公教的「逢七必勝」、你看了一週的數據 ——
                哪一套讓你的把握更準,你自己量得出來。{" "}
                <span className="text-bone">我們不評斷你信什麼,只把尺交給你。</span>
              </span>
            </PathStage>
            <PathStage
              no="第 3 階"
              title="自己讀一場球"
              links={[
                { cta: "看今天的比賽 · 打開那些鏡頭 →", href: "/matches" },
                { cta: "進實驗室 · 親手跑一萬場 →", href: "/lab" },
              ]}
            >
              不靠任何人報牌,自己過一遍:先發投手壓不壓得住、球場吃不吃打、牛棚撐不撐得到第九局。
              讀完,進實驗室按 RUN 跑一萬場,看你眼睛看到的、跟模型算的差多少。
            </PathStage>
            <PathStage
              no="第 4 階"
              title="立你自己的帳本 —— 這就是畢業"
              gold
              links={[{ cta: "免費 · 鎖你的第一手 →", href: "/login?next=/member" }]}
            >
              練習結束,來真的:賽前鎖一手、賽後自動對帳、含贏含輸全掛在你的公開檔案,刪不掉。
              這裡沒有畢業證書 —— 你的畢業證書,是一本你親手掙來、連輸都記著的帳本。
              撐到「說幾成、就真的中幾成」,你掙到<span className="text-gold">準心</span>;
              撐滿 30 場還贏過引擎,你掙到<span className="text-gold">對帳之星</span>。
              到那天,你連我們的引擎都可以挑戰 —— 那,就是我們最想教會你的一課。
            </PathStage>
          </div>

          <p className="mt-10 font-mono text-mute text-[10px] tracking-[0.25em] leading-relaxed">
            想先看引擎自己準不準?{" "}
            <Link
              href="/calibration"
              className="text-gold/75 hover:text-gold underline-offset-4 hover:underline transition-colors"
            >
              公開校準 →
            </Link>
            {"　"}讀完整 model report?{" "}
            <Link
              href="/audit"
              className="text-gold/75 hover:text-gold underline-offset-4 hover:underline transition-colors"
            >
              /audit →
            </Link>
          </p>
        </section>

        <RelatedReading currentPath="/learn" />
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function Chapter({
  no,
  en,
  zh,
  kicker,
  children,
  anchor,
}: {
  no: string;
  en: string;
  zh: string;
  kicker: string;
  children: React.ReactNode;
  anchor?: string;
}) {
  return (
    <section
      id={anchor}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-14 scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-3">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em] tabular">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {en}
        </span>
        <span className="font-mono text-mute/60 text-[10px] tracking-[0.25em] ml-auto">
          {kicker}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-8 leading-snug">
        {zh}
      </h2>
      <div className="space-y-5 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function ChapterFooter({
  cta,
  href,
  note,
}: {
  cta: string;
  href: string;
  note: string;
}) {
  return (
    <div className="mt-8 pt-6 border-t border-line/40">
      <Link
        href={href}
        className="inline-flex items-center gap-3 font-mono text-gold text-[11px] tracking-[0.3em] hover:opacity-80 transition-opacity"
      >
        {cta}
      </Link>
      <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
        {note}
      </p>
    </div>
  );
}

function PrimerStat({
  term,
  zh,
  explain,
  example,
}: {
  term: string;
  zh: string;
  explain: string;
  example: string;
}) {
  return (
    <div className="border-l-2 border-gold/30 pl-5 sm:pl-6 py-2 my-5">
      <div className="flex items-baseline flex-wrap gap-3 mb-2">
        <StatTerm term={term} />
        <span className="text-bone text-base font-light">{zh}</span>
      </div>
      <p className="text-mute text-sm leading-relaxed mb-2">{explain}</p>
      <p className="font-mono text-gold/70 text-[10px] tabular tracking-[0.2em]">
        ▸ {example}
      </p>
    </div>
  );
}

function SeriesItem({
  no,
  href,
  title,
  note,
}: {
  no: string;
  href: string;
  title: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 border border-line/60 hover:border-gold/50 hover:bg-slate/30 transition-colors group"
    >
      <span className="font-mono text-gold/70 text-[10px] tracking-[0.3em] shrink-0 w-14">
        {no}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-bone text-base sm:text-lg font-light tracking-tight group-hover:text-gold transition-colors">
          {title}
        </span>
        <span className="block font-mono text-mute/70 text-[10px] tracking-[0.2em] mt-1">
          {note}
        </span>
      </span>
      <span
        className="font-mono text-mute/60 text-[10px] tracking-[0.2em] shrink-0 group-hover:text-gold/70 transition-colors"
        aria-hidden="true"
      >
        →
      </span>
    </Link>
  );
}

// ── 路線圖的一階(時間線式 · 左側金線 + 階段點 · 已走過=金實心、未走=描邊)─────────
// done = 你已經走過(暗、實心點)· gold = 畢業階(金線金點)· links = 該階的真實去處(閉環到動作)。
function PathStage({
  no,
  title,
  children,
  links,
  done = false,
  gold = false,
}: {
  no: string;
  title: string;
  children: React.ReactNode;
  links?: { cta: string; href: string }[];
  done?: boolean;
  gold?: boolean;
}) {
  return (
    <div
      className={`relative pl-8 pb-9 border-l last:pb-0 ${
        gold ? "border-gold/45" : "border-line/50"
      }`}
    >
      {/* 階段點 */}
      <span
        className={`absolute -left-[6px] top-1 w-[11px] h-[11px] rounded-full border ${
          done
            ? "bg-gold/70 border-gold/70"
            : gold
              ? "bg-navy border-gold"
              : "bg-navy border-mute/70"
        }`}
        aria-hidden="true"
      />
      <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
        <span
          className={`font-mono text-[10px] tracking-[0.3em] ${
            done ? "text-mute/60" : "text-gold"
          }`}
        >
          {no}
        </span>
        {done && (
          <span className="font-mono text-mute/45 text-[9px] tracking-[0.25em]">
            你已經走過
          </span>
        )}
      </div>
      <h3
        className={`text-lg sm:text-xl font-light tracking-tight mb-2 ${
          done ? "text-mute" : "text-bone"
        }`}
      >
        {title}
      </h3>
      <p className="text-mute text-sm leading-relaxed max-w-xl">{children}</p>
      {links && links.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5 items-start">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-gold/85 hover:text-gold text-[11px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              {l.cta}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
