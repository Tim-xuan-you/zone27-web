import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleMeta from "@/components/ArticleMeta";
import FounderSignOff from "@/components/FounderSignOff";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "62%,不是「他會贏」的意思 — 誠實讀一個機率(三)",
  description:
    "一個賽前機率不是「會贏」的承諾,它早就把「另外那 38% 會輸」算進去了。 單獨一場的輸贏,既不能證明也不能推翻一個機率——就像氣象說 10% 會下雨、真下了也不算它錯。 要驗一個機率準不準,只能看一長串預測對不對得上:校準。",
  ogTitle: "62%,不是「他會贏」 · 誠實讀一個機率",
  ogDescription:
    "62% 內含 38% 會輸 · 一場輸贏證明不了一個機率 · 信心高不等於穩贏 · 驗準度只能看校準,不是看那一場",
  path: "/learn/reading-a-probability",
});

// ── ZONE 27 · /learn/reading-a-probability — 機率識讀庫 第三篇 ───────────────────────
// 系列收尾的一塊。 第一篇:連勝/變異數會騙你(多場的角度)。 第二篇:要多少場才算數(樣本)。
// 這篇回到最小單位 —— 怎麼讀「單獨一個機率」:62% 不是預言,內含 38% 會輸;單場結果無法證偽一個
// 機率(氣象 10% 下雨類比);驗法只有校準(說幾成、真的中幾成)。 順帶點破「信心高≠穩贏」和
// 「基準率」兩個最常見的翻車。 收回品牌:正因為一個機率只能用一長串含輸紀錄來驗,我們才不喊神準、
// 只逐場攤開對帳。
//
// 🔴 訪客語氣:白話、不賣弄、不引用學者、不丟術語當主詞(校準=「說幾成就中幾成」當場白話解釋)。
// 含輸誠實(先攤輸再講不代表壞掉,順序不反)。 不指名對手。 不導向下注/+EV/凱利/盤口。
// 數字已核對:62% 為科普代表數(非真實掛牌);5/31 三摃為真(54/57/57);三摃≈8.5% 為粗估(假設互不影響)。
// ─────────────────────────────────────────────────────

function Section({
  no,
  zh,
  children,
}: {
  no: string;
  zh: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">
        {no}
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-5">
        {zh}
      </h2>
      <div className="space-y-4 text-mute text-[15px] sm:text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

// 真實已結算單的小證物框。
function LedgerAside({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 border-l-2 border-gold/40 bg-slate/30 pl-4 py-3">
      <p className="font-mono text-gold/60 text-[9px] tracking-[0.3em] mb-1.5">
        / 我們自己的帳本
      </p>
      <p className="text-bone/90 text-[14px] leading-relaxed">{children}</p>
    </div>
  );
}

export default function ReadingAProbabilityPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-7">
            誠實讀一個機率 · 第三篇
          </p>
          <h1 className="text-4xl sm:text-5xl font-light leading-[1.12] tracking-tight text-bone">
            「62%」,不是
            <br />
            <span className="text-gold">「他會贏」</span>的意思。
          </h1>
          <p className="mt-6 text-mute text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            一個賽前機率,是最容易被讀錯的東西。 你以為它在說「會贏」,
            其實它早就把「會輸」也算進去了。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        {/* ── 1 · 62% 是什麼意思 ─────────────────────── */}
        <Section no="01" zh="62% 是什麼意思?它早就把「會輸」算進去了">
          <p>
            假設引擎賽前看好某隊 <strong className="text-gold">62%</strong> 會贏。
            這句話的意思<strong className="text-bone">不是</strong>「他會贏」 ——
            而是「同樣這種局面如果跑很多次,大約 6 成多會贏、
            <strong className="text-bone">近 4 成(38%)會輸</strong>」。
          </p>
          <p>
            把它想成氣象預報說「今天 <strong className="text-gold">60% 會下雨</strong>」。
            你出門會帶把傘,因為很可能下;但要是那天<strong className="text-bone">沒下</strong>,
            你不會打電話去罵氣象台騙人 —— 因為它從來沒承諾「一定下」,
            它只說了「這種天,十次大概有六次會下」。
          </p>
          <p>
            賽前機率一模一樣:62% 是「<strong className="text-bone">帶傘級別的看好</strong>」,
            不是「穩贏」的保證。 那 38% 的輸,
            <strong className="text-gold">是這個數字本來就承諾過、會發生的劇本之一</strong> ——
            不是它出錯。 真正讀錯的,是把 62% 當成「穩了」的那個人。
          </p>
        </Section>

        {/* ── 2 · 一場輸贏什麼都證明不了 ─────────────────── */}
        <Section no="02" zh="一場輸贏,其實什麼都證明不了">
          <p>
            這帶出一個更反直覺、但統計上很硬的事實:
            <strong className="text-bone">單獨一場的結果,既不能證明、也不能推翻一個機率。</strong>
          </p>
          <p>
            氣象說 10% 會下雨、結果真的下了,你也不能說那個 10% 是「錯的」——
            它沒說不會下,它說的是「很少下」。 一個機率,
            <strong className="text-bone">放在單獨一件事上,根本沒有「對 / 錯」可言</strong>;
            它只有放進一長串預測裡,才驗得出來。
          </p>
          <LedgerAside>
            第二篇我們用 2026-05-31 那一晚講「場數太少」;這裡換個角度,算給你看。
            那晚引擎三盤全摃 —— 看好味全(54%)、富邦(57%)、台鋼(57%),結果三場全落空。
            聽起來很慘? 但就算這三場各有 5 成多的把握、且彼此不相干,
            <strong className="text-bone">三場全摃的機率大約是 8%~9%</strong> —— 差不多
            <strong className="text-bone">每十幾個這樣的夜晚,就會撞上一次</strong>。
            (這是假設三場互不影響的粗估,不是精確結論。) 連摃一晚,不代表引擎壞了;
            就像第一篇說的,那只是<strong className="text-gold">變異數</strong>,機率本來就長這樣。
          </LedgerAside>
          <p>
            反過來也成立:有人連贏一串,不代表他準;我們某晚連摃,也不代表它笨。
            <strong className="text-bone">單看一場、或單看一段,你什麼都判斷不出來。</strong>
          </p>
        </Section>

        {/* ── 3 · 信心高 ≠ 穩贏 · 先看底子 ──────────────── */}
        <Section no="03" zh="「信心很高」不等於「穩贏」;也別被一條新聞拐走">
          <p>兩個讀機率最常見的翻車,順手點破:</p>
          <p>
            <strong className="text-gold">一、把「信心高」讀成「保證」。</strong>{" "}
            在棒球這種運動裡,<strong className="text-bone">最高的把握也就 5 成 7 上下</strong>。
            所以「高信心(57%)」和「低信心(51%)」的差別,只是「往哪邊偏多一點」,
            不是「一定 vs 不一定」。 任何喊「<strong className="text-bone">94% 神準</strong>」「鐵口直斷」的,
            數學上不可能 —— 因為運動本身就帶著大量洗不掉的運氣。
          </p>
          <p>
            <strong className="text-gold">二、被一條爆點新聞拐走。</strong>{" "}
            讀機率要先看「<strong className="text-bone">基準率</strong>」—— 這兩隊本來大概多強
            (戰績、先發投手、主客場),那是地基。 一條突發新聞(某人手感、某個傷兵)
            只能在地基上<strong className="text-bone">微調</strong>,不能整個推翻。
            忘了原本的強弱底子、被單一新聞牽著鼻子走整個翻盤押另一邊 ——
            是讀機率最常見的摔法。
          </p>
        </Section>

        {/* ── 4 · 那怎麼驗 · 看校準 ─────────────────────── */}
        <Section no="04" zh="那到底怎麼驗一個機率準不準?看校準,不是看那一場">
          <p>
            既然單場驗不出名堂,那一個機率到底準不準,該怎麼驗?
            只有一個辦法:<strong className="text-gold">校準</strong>。
          </p>
          <p>
            講白話,校準就是 ——「<strong className="text-bone">說幾成,就真的要中幾成</strong>」。
            把所有「說 7 成把握」的場全部集合起來,看它們是不是真的中了大約 7 成;
            說 9 成的那些,是不是真的中了約 9 成。 說的把握對得上實際命中率,才叫準。
            這比連勝難太多,也<strong className="text-bone">騙不了人</strong> —— 而且要很多場才看得出來,
            單場看不出半點名堂。
          </p>
          <p>
            這就是為什麼我們<strong className="text-gold">不喊神準 —— 也喊不出</strong>。
            我們能做、別人不敢做的,是把每個賽前數字鎖死、贏輸都留著,
            再把引擎「說幾成、實際中幾成」整張攤開,讓你逐場對帳。
            <strong className="text-bone">一場的輸贏騙得了人,一整本含輸的帳本騙不了。</strong>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calibration"
              className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              看引擎說幾成、實際中幾成 →
            </Link>
            <Link
              href="/track-record"
              className="inline-block px-5 py-2.5 border border-line/60 text-mute hover:text-gold hover:border-gold/60 font-mono text-[10px] tracking-[0.3em] transition-colors"
            >
              每場賽前預測 vs 實際 →
            </Link>
          </div>
        </Section>

        {/* ── 收尾 ─────────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p className="text-mute text-[15px] leading-relaxed">
            下次看到一個賽前機率,你已經知道它在說什麼了:
            <span className="text-bone">它不是預言,是一個帶著「會輸」一起出廠的數字。</span>{" "}
            別用一場輸贏去審判它 —— 要審,就審它一整年說的把握,對不對得上。
          </p>
        </section>

        <FounderSignOff signedAt="2026-06-14">
          <p>
            我給你的每個百分比,都老實把「會輸的那一半」也寫在裡面 —— 它不是保證,從來不是。
            所以我不敢用一場去自誇,也請你別用一場來罵它;要驗,就看一整本鎖死的、含輸的帳。
            這一篇,是把「怎麼讀那個數字」也交到你手上。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/learn/reading-a-probability" />
      </main>

      <Footer />
    </div>
  );
}
