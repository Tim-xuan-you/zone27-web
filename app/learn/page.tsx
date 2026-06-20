import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
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
            ZONE 27 用引擎拆解棒球比賽勝率 · 這頁是專屬給沒讀過進階棒球數據的人的入門。
          </p>
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
            一支正當顛峰的兄弟可能輸給冷門的味全,一個王牌投手可能在第 2 局被打爆。
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

        {/* ── CHAPTER 03 · 沒有神準 → 指向校準 ─────── */}
        <Chapter
          no="03"
          en="NOBODY IS PSYCHIC"
          zh="為什麼沒有「神準」這回事"
          kicker="1 分鐘"
          anchor="no-oracle"
        >
          <p>
            全世界最強的模型,賽前單場勝率也只到大約{" "}
            <strong className="text-bone">5 成 7</strong> —— 棒球本來就有一半是運氣。
            所以我們不比「誰猜得準」,改比「誰夠誠實」:當引擎說 67%,長期那種場真的要中大約 67% 才算數。
          </p>
          <ChapterFooter
            cta="看引擎準不準 · 公開校準 →"
            href="/calibration"
            note="當引擎說 67% · 實際發生幾成?賽前預測對上真實結果 · 命中落空都掛"
          />
        </Chapter>

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

