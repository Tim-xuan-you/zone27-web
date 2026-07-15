import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { visibleBriefs, briefHref, briefLabel } from "@/lib/briefs";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /shops · 給運彩門市 ──────────────────────────────────────────
// Tim 2026-07-15「網站哪裡放『我們很有權威』的感覺?讓人覺得原來這家是給運彩門市用的
// 資料、有可信度、值得逛」+「米其林指南!GO!您決定」= R221 式全權授權。
//
// 🔴 拍板的核心判斷(別讓後人改回去):Tim 想要的感覺對,但他描述的手法會踩紅線 ——
// 「運彩門市都在用我們的資料」是【宣稱】,而我們一家門市都還沒有 = 假社會證明
// (per [[feedback_zone27_social_proof_costly_signal]] 唯一不能碰的東西)。
// 解 = 換一個【事實】:「這份報,是為運彩門市印的」—— A4 一頁、白底省墨、店章欄、
// 「本店每天免費為您備妥」全都已經在那張紙上,是規格,不是宣稱。
//
// 為什麼「為誰做的」比「誰在用」更有權威:「業務用 / Professional Grade / 廚師指定」
// 的權威從來不是靠客戶名單,是靠規格擺在那(Hobart 不用說五星飯店在用)。 米其林的
// 權威也不是「很多人看」,是:每年出 · 有版本 · 有一把公開的尺 · 檢查員自付帳單 ——
// 這四樣我們全有(每日出刊+呼號 / A4 門市版+店章欄 / 星星只評價格 / 不收博彩業者贊助),
// 只是門面一個都沒露。 所以這頁不加任何新宣稱,只把【既有規格】攤開。
//
// 🔴 這頁對兩種人同時有效(也是它值得存在的理由):
//  · 對店家 = 真的招募通路(散播 = 真瓶頸 per [[project_zone27_feeling_vs_moat]])。
//  · 對賭徒 = 「原來這網站還有給門市的專區」→ 權威感【由他自己推論出來】,不是我們宣稱的。
//    讀者自己得出的結論,永遠比你告訴他的強。
//
// 🔴 永不加:「已有 N 家門市採用」「門市指定」「業界唯一」等任何採用數/客戶名單 ——
//    真的有、而且他們願意具名之前,一個字都不寫。 這頁是【邀請】不是【宣稱】。
// 🔴 首頁不加宣示條(Tim 2026-07-13 才親手砍掉字牆「門面竟然趕客」)· 只給一條低調鏈。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "給運彩門市 · 免費影印",
  description:
    "《ZONE 27 戰報》是為運彩門市印的:每天一張 A4、白底省墨、整頁影印就能發給客人,右下角留白給您的店章。 不用改、不用付錢、不用先問我們。 星星只評價格不評輸贏 · 不收博彩業者的廣告與贊助。",
  ogTitle: "《ZONE 27 戰報》· 給運彩門市",
  ogDescription:
    "每天一張 A4 · 白底省墨 · 整頁影印 · 店章欄留給您 · 永遠免費 · 不收博彩業者的廣告與贊助",
  path: "/shops",
  type: "article",
});

export const revalidate = 300;

// 米其林式規格表 = 權威的真來源(不是形容詞,是可查證的規格)。
const SPECS: { k: string; v: string }[] = [
  { k: "出刊頻率", v: "每天。 過刊全部公開,任何人都能翻回去查。" },
  { k: "版式", v: "A4 一頁。 白底省墨,黑白影印一樣看得清楚。" },
  { k: "店章欄", v: "右下角留白 —— 那格是給您蓋章、寫店名的。" },
  { k: "星星的意思", v: "只評「這張票的價格划不划算」,不評誰會贏。 一把不變的尺。" },
  { k: "廣告與贊助", v: "不收博彩業者的。 所以評的是價,不是誰給錢。" },
  { k: "我們的身分", v: "我們自己不接受下注 —— 我們不是莊家,是評的人。" },
];

const STEPS: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "我們每天出一張",
    d: "當天的場次評完 —— 哪張票太貴、哪張還有呼吸空間 —— 出成一張 A4。",
  },
  {
    n: "02",
    t: "您整頁影印",
    d: "不用改、不用付錢、不用先問我們。 印幾張、發給誰,都是您決定。",
  },
  {
    n: "03",
    t: "蓋上您的店章",
    d: "右下角那格空著就是為了這個。 蓋下去,那就是貴店給客人的服務。",
  },
];

export default function ShopsPage() {
  const briefs = visibleBriefs();
  const latest = briefs[0]; // 期號降冪 · 最新一期
  const issueCount = briefs.length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 給運彩門市 · 永遠免費
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            這份報,是為<span className="text-gold">門市</span>印的。
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-5" aria-hidden="true" />
          <p className="text-mute text-base leading-relaxed">
            每天一張 A4。 白底省墨、整頁影印就能發給客人。
            <br className="hidden sm:block" />
            右下角那塊空白 —— 是留給您的店章。
          </p>
        </section>

        {/* ── 那張紙本身(SHOW 非 TELL · 主角是紙,不是文案)── */}
        {latest && (
          <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-10">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">
              / 最新一期 · {briefLabel(latest)}
            </p>
            {/* 🔴 這裡本來想嵌 A4 原版的 iframe 縮覽(最強的 SHOW),但全站安全標頭是
                X-Frame-Options: DENY + CSP frame-ancestors 'none'(防點擊劫持)→ 同源也擋。
                裁決:**不為了一個縮圖弱化全站安全標頭**(要排除路徑得用負向正則,弄錯 = 真的
                安全退步)。 改用首頁已拍板的「大數字磚」語彙當入口 —— 同一套視覺,不做兩套。
                真正的 SHOW 在點下去那一下:那張紙自己會說話。 */}
            <Link
              href={briefHref(latest)}
              className="group block border border-gold/40 bg-gold/[0.04] hover:border-gold hover:bg-gold/[0.08] transition-colors px-6 py-5"
            >
              <div className="flex items-baseline gap-2 font-mono text-mute/60 text-[10px] tracking-[0.25em]">
                <span className="text-gold/70">{briefLabel(latest)}</span>
                <span>{latest.sport}</span>
                <span className="ml-auto">A4 · 一頁</span>
              </div>

              {latest.bigNum ? (
                <p className="mt-3 mb-1 leading-none">
                  <span className="font-mono text-gold text-[52px] sm:text-[60px] font-light tracking-tight tabular">
                    {latest.bigNum}
                  </span>
                  {latest.bigNumUnit && (
                    <span className="font-mono text-gold/60 text-lg ml-1">{latest.bigNumUnit}</span>
                  )}
                </p>
              ) : (
                <p className="mt-3 mb-1 text-bone text-xl font-light tracking-tight leading-snug">
                  {latest.matchup}
                </p>
              )}

              {latest.hook && <p className="text-bone/90 text-sm leading-snug">{latest.hook}</p>}
              {latest.bigNum && (
                <p className="mt-2 text-mute/70 text-xs leading-snug">{latest.matchup}</p>
              )}

              <p className="mt-4 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.25em]">
                打開 A4 原版 · 直接列印 →
              </p>
            </Link>

            <p className="mt-4 text-mute text-sm leading-relaxed">
              點開就是原版 —— 線上看的,跟店裡印出來的是同一張紙。 我們不做兩套。
            </p>
            <p className="mt-3">
              <Link
                href="/brief"
                className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
              >
                看全部 {issueCount} 期過刊 →
              </Link>
            </p>
          </section>
        )}

        {/* ── 怎麼用 · 三步 ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-10">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-4">
            / 怎麼用
          </p>
          <div className="flex flex-col gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4 items-baseline">
                <span className="font-mono text-gold/60 text-[11px] tracking-[0.2em] shrink-0 w-6">
                  {s.n}
                </span>
                <div>
                  <p className="text-bone text-base font-light">{s.t}</p>
                  <p className="mt-1 text-mute text-sm leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 規格(米其林式:權威來自可查證的規格,不是形容詞)── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-10">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-4">
            / 規格
          </p>
          <dl className="border-t border-line/60">
            {SPECS.map((s) => (
              <div
                key={s.k}
                className="flex flex-col sm:flex-row sm:gap-6 border-b border-line/60 py-3"
              >
                <dt className="font-mono text-gold/80 text-[10px] tracking-[0.2em] shrink-0 sm:w-32 pt-[3px]">
                  {s.k}
                </dt>
                <dd className="text-mute text-sm leading-relaxed flex-1 mt-1 sm:mt-0">{s.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 font-mono text-mute/50 text-[10px] tracking-[0.15em]">
            已出刊 {issueCount} 期 · 每一期賽後,賽果自己會說話。
          </p>
        </section>

        {/* ── 我們圖什麼(誠實框 · Pratfall)── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16">
          <div className="border border-gold/40 bg-gold/[0.04] px-6 py-5">
            <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-3">
              那你們圖什麼?
            </p>
            <p className="text-bone/90 text-sm leading-relaxed">
              我們靠會員費活,不賣明牌、也不抽賭注的傭 —— 我們自己根本不接受下注。
              這份報,是我們讓人認識 ZONE 27 的方式:您印它,客人多一個回店裡的理由;
              我們多一個被看見的機會。 就這樣,沒有別的條件。
            </p>
            <p className="mt-3 text-mute text-sm leading-relaxed">
              不用簽約、不用掛我們的名字、不用回報任何數字。 哪天您覺得不好用,不印就是了。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
