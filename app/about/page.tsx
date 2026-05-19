import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — 我們不是博彩公司,是相信數字比運氣誠實的棒球迷",
  description:
    "ZONE 27 的品牌方法論、AI 蒙地卡羅引擎背後的哲學、以及為什麼是 27。",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="about" />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-24 pb-16 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          OUR MANIFESTO
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.15] tracking-tight text-bone">
          我們不是博彩公司。
          <br />
          <span className="text-gold">
            我們是一群相信數字
            <br className="sm:hidden" />
            比運氣誠實的棒球迷。
          </span>
        </h1>

        <p className="font-mono text-mute text-xs tracking-[0.3em] mt-10">
          A QUIET REBELLION AGAINST GUT-FEEL.
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-20" />

      {/* ── 01 THE PROBLEM ───────────────────────── */}
      <Chapter
        no="01"
        en="THE PROBLEM"
        zh="問題"
        kicker="台灣棒球預測市場的三重失敗"
      >
        <p>
          台灣的棒球預測市場,長期被三股勢力把持。
        </p>
        <p>
          <strong className="text-gold">老牌大型平台</strong>用 30% 到 50%
          的高額手續費剝奪預測創作者,介面停留在十年前的論壇格式,廣告閃爍如夜市霓虹。
        </p>
        <p>
          <strong className="text-gold">免費社群論壇</strong>(PTT、Dcard、運彩版)
          資訊雖然即時,但完全沒有產品化,看半天等於沒看,數據不可視覺化、不可比較、不可追蹤。
        </p>
        <p>
          <strong className="text-gold">LINE 老師群組</strong>則是信任歸零的黑箱。
          輸了刪文,贏了截圖,沒有人對自己的預測負責,也沒有任何透明的勝率紀錄。
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
              <strong className="text-bone">Trackman 雷達追蹤先驗。</strong>{" "}
              從 stats.cpbl.com.tw 拉取投手球路轉速、進壘角度,以及打者本壘板紀律(PR)作為機率矩陣的初始參數。
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-gold/70 tabular shrink-0">B.</span>
            <span>
              <strong className="text-bone">投打對決機率矩陣。</strong>{" "}
              每個打席計算「三振 / 保送 / 一壘安打 / 長打 / 全壘打 /
              出局」的條件機率,左右投對左右打獨立拆解。
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-mono text-gold/70 tabular shrink-0">C.</span>
            <span>
              <strong className="text-bone">蒙地卡羅萬次推演。</strong>{" "}
              後端引擎以 &lt; 1
              ms 跑完一場完整虛擬比賽(含換投、代打、跑壘推進),連續執行 10,000 次。
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
        <p className="text-mute/80 italic">
          當預測不準時,我們不藏。會主動公布偏差值報告,告訴會員模型在哪一個變數失算,並把這個變數寫進下一次迭代。
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
            <strong className="text-bone">零抽成。</strong>
            黑金會員賣明牌,平台只抽 5%(創始 27 完全 0%)。對比業界 30-50% 是降維打擊。
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
        <p className="text-bone">
          ZONE 27 是我給這群人 —— 包括我自己 —— 的一封情書。
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-8">
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
          所以,黑金會員年費是 NT$ 4,990。
          但這 270 位創始會員,只需要付一次 NT$ 2,700 ——
          一輩子。
        </p>
      </Chapter>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          THE 27 ARE BEING FORGED.
        </p>
        <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          您準備好成為 #008 嗎?
        </h3>
        <Link
          href="/founders"
          className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          CLAIM YOUR NUMBER →
        </Link>
      </section>

      <Footer />
    </div>
  );
}

// ── Reusable Chapter Block ─────────────────────────────
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
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-16">
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
      <div className="space-y-5 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}
