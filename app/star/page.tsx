import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReckoningStarMark from "@/components/ReckoningStarMark";
import { RECKONING_STAR_MIN } from "@/lib/reckoning-star";
import { getLadderBoard } from "@/lib/ladder-server";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /star · 對帳之星(獎本身的定義頁 · 「先把獎攤開,prestige 才生得出來」)──────
// 這顆星(lib/reckoning-star)原本只在「已經部分達標」的面(/member · /u)render 成「狀態」——
// 0 顆星時,全站最珍貴的概念對所有人隱形。 這頁把「獎本身」當產品攤開:它是什麼 · 怎麼贏來
// (錢買不到)· 為什麼守不住會被收回 · 現在誰握著。 全部從程式碼單一真相算(0 新宣稱):
// RECKONING_STAR_MIN 直接讀常數(不會漂移)· BLOCK 4 用真實天梯狀態。
//
// 🔴 紅線:① BLOCK 4 永不列名單 —— 沒人達標 → 莊嚴空王座「連機器都還沒被超越」(同 /ladder
//   0 用戶紅線,結構上畫不出 roster)。 ② 絕不出現「米其林」或任何外部品牌字眼,只用自有語言。
//   ③ 無 FOMO / 無限量席位 / 無紅綠 / 無 emoji · 金色只留給星 + 關鍵數字。 ④ 首頁不動。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "對帳之星 · 一顆買不到的星",
  description:
    "ZONE 27 唯一的榮譽叫『對帳之星』—— 沒有付費徽章、沒有限量席位。 在賽前鎖死、含贏含輸、刪不掉的公開對帳裡,準度贏過一台只敢喊 57% 的誠實引擎才拿得到;滑落了,它自動收回。",
  ogDescription: "ZONE 27 唯一的勳章:錢買不到,只能比機器準才贏得來 —— 而且守不住會被收回。",
  path: "/star",
});

export const revalidate = 3600;

export default async function StarPage() {
  // BLOCK 4 唯一的動態:有沒有人類爬上「神準手以上」(= 握著對帳之星那一階 · LADDER_SHARP_MIN
  // 同 RECKONING_STAR_MIN)。 board.show=false(合格用戶不足)→ entries 空 → humanStar=0 →
  // 莊嚴空王座(守 0 用戶不上空榜紅線,且結構上不可能 render 出成員名單)。
  const board = await getLadderBoard();
  const humanStar = board.entries.filter((e) => !e.isEngine && e.tier >= 4).length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main" className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── 標題 ─────────────────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
          / 對帳之星 · THE RECKONING STAR
        </p>
        <div className="mb-5">
          <ReckoningStarMark size={48} />
        </div>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
          一顆,<span className="text-gold">買不到</span>的星。
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed">
          ZONE 27 沒有付費徽章、沒有限量席位。 唯一的榮譽叫
          <span className="text-bone">對帳之星</span> —— 你只能在公開、含輸、刪不掉的對帳裡,
          <span className="text-bone">親手贏來</span>。
        </p>

        {/* ── BLOCK 1 · 這是什麼 ─────────────────── */}
        <section className="mt-12 pt-8 border-t border-line/40">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3">這是什麼</p>
          <p className="text-bone/90 text-base leading-relaxed">
            在賽前就鎖死、含贏含輸、誰都改不了的公開帳本裡,你的準度
            <span className="text-gold">贏過一台只敢喊 57% 的誠實引擎</span>。
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            不是某一晚的手氣,是長期攤在陽光下、連輸都掛著的命中率。 這是這個站上
            <span className="text-bone">唯一一個會員能「得到」的東西</span> —— 其餘全部免費。
          </p>
        </section>

        {/* ── BLOCK 2 · 怎麼贏來的(錢買不到)──────── */}
        <section className="mt-10 pt-8 border-t border-line/40">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3">
            怎麼贏來的 · 錢買不到
          </p>
          <p className="text-mute text-sm leading-relaxed mb-4">門檻只有一條,但很狠:</p>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3 items-baseline">
              <span className="font-mono text-gold tabular text-xl leading-none shrink-0 w-12 text-right">
                {RECKONING_STAR_MIN}
              </span>
              <span className="text-bone/90 text-sm leading-relaxed">
                場以上已分勝負的公開對帳(賽前鎖死、含輸照算)。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0 w-12 text-right">
                同場
              </span>
              <span className="text-bone/90 text-sm leading-relaxed">
                你跟引擎要在<span className="text-bone">同一批場</span>上都押得夠厚 ——
                公平比較,不是挑對你有利的場。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0 w-12 text-right">
                贏過
              </span>
              <span className="text-bone/90 text-sm leading-relaxed">
                你的命中率要<span className="text-gold">真的高過引擎</span> —— 打平不算。
              </span>
            </li>
          </ul>
          <div className="mt-5 border-l-2 border-gold/60 bg-gold/[0.05] pl-4 py-3">
            <p className="text-bone text-sm sm:text-base leading-relaxed">
              這顆星<span className="text-gold">沒有付費通道、沒有限量名額</span>。 稀有,來自門檻高 ——
              不是位子少。 你出多少錢都買不到一顆;唯一的路,是比機器準。
            </p>
          </div>
        </section>

        {/* ── BLOCK 3 · 守不住,會被收回 ──────────── */}
        <section className="mt-10 pt-8 border-t border-line/40">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3">守不住,會被收回</p>
          <p className="text-bone/90 text-base leading-relaxed">
            每次有人打開你的檔案,這顆星就<span className="text-bone">重算一次</span>。 你滑下去,它自動暗掉
            —— 沒有人需要來收回,數字自己說話。
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            聽起來嚴苛,其實這才是它值錢的地方:
            <span className="text-bone">大多數拿到的人,某個月會掉。 能一直守著的,比第一次拿到更稀有。</span>{" "}
            賣明牌的可以截一張連勝圖騙你一輩子;這顆星,你
            <span className="text-bone">每天都得重新配得上它</span>。
          </p>
        </section>

        {/* ── BLOCK 4 · 現在誰握著(真實天梯狀態 · 永不列名單)──────── */}
        <section className="mt-10 pt-8 border-t border-line/40">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">現在誰握著</p>
          {humanStar === 0 ? (
            <div className="flex items-start gap-4">
              <ReckoningStarMark size={38} dim />
              <div className="min-w-0">
                <p className="text-bone text-base sm:text-lg leading-relaxed">
                  目前,王座上<span className="text-gold">只有機器</span>。
                </p>
                <p className="mt-2 text-mute text-sm leading-relaxed">
                  還沒有任何人類,在這道門檻上贏過引擎、拿下這顆星。 這不是話術 —— 是我們最自豪的一行:
                  <span className="text-bone">連我們自己的引擎,都還沒被人類超越</span>。
                </p>
                <Link
                  href="/ladder"
                  className="mt-4 inline-block font-mono text-gold/85 hover:text-gold text-[11px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
                >
                  第一個清過這道門檻的會是誰? 看天梯 →
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <ReckoningStarMark size={38} />
              <div className="min-w-0">
                <p className="text-bone text-base sm:text-lg leading-relaxed">
                  已經有人類清過這道門檻。
                </p>
                <p className="mt-2 text-mute text-sm leading-relaxed">
                  天梯的最高階(神準手 / 神諭),帶的就是這顆星。 含輸照掛、守不住就掉 ——
                  去看是誰、誰守得住。
                </p>
                <Link
                  href="/ladder"
                  className="mt-4 inline-block font-mono text-gold/85 hover:text-gold text-[11px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
                >
                  上天梯看誰握著這顆星 →
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── 收尾 · 交叉連結 ─────────────────── */}
        <section className="mt-12 pt-8 border-t border-line/40">
          <p className="text-mute text-sm leading-relaxed">
            想看那台引擎到底多誠實?{" "}
            <Link href="/track-record" className="text-gold underline-offset-4 hover:underline">
              公開戰績
            </Link>
            (含輸照掛)·{" "}
            <Link href="/calibration" className="text-gold underline-offset-4 hover:underline">
              校準
            </Link>
            (它喊 70% 真的中 70% 嗎)。
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            覺得你比機器準?{" "}
            <Link href="/matches" className="text-gold underline-offset-4 hover:underline">
              去押一場,開始記你的對帳 →
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
