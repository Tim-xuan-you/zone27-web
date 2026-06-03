import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import UnscheduledLetterChip from "@/components/UnscheduledLetterChip";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "Changelog — 完整變動歷史 · git 是唯一事實來源",
  description:
    "ZONE 27 不手工維護版本敘事 · 所有變動公開在 GitHub commits · git log 是唯一事實來源 · 本頁列出近期里程碑當參考 · 點按鈕直達完整歷史。",
  ogTitle: "Changelog · git 是唯一事實來源 · ZONE 27",
  ogDescription: "所有變動公開 · git log 唯一事實 · 不手工維護敘事",
  path: "/changelog",
});

// ── ZONE 27 · /changelog ──────────────────────────────
// git log 是唯一事實來源。本頁只放近期里程碑當參考 · 每條一句白話 ·
// 完整逐 commit 歷史在 GitHub。 milestone 文案一律球迷白話 · 不放開發
// 內部代號 / 元件名 / 學術引用(那些屬於台前不該出現的後設層)。
// ─────────────────────────────────────────────────────

const GH_COMMITS_URL =
  "https://github.com/Tim-xuan-you/zone27-web/commits/main";

const MILESTONES: { date: string; title: string; detail: string }[] = [
  {
    date: "2026-06-02",
    title: "免費引擎 + 群眾市場全線打通 · 點擊後台 + 忘記密碼",
    detail:
      "押注、點數錢包、賣分析、留言、賽事討論室的後端全部上線並實測通過。/admin 改成用按鈕操作的後台(不用寫程式)、新增忘記密碼流程。/founders 銷售頁砍成 Apple 式極簡,全站把準度相關的術語改成棒球迷看得懂的白話。",
  },
  {
    date: "2026-05-30",
    title: "商業模式拍板:「台灣版・合法的 Polymarket」",
    detail:
      "四根支柱:引擎永遠免費、群眾即時預測市場(虛擬點數・零真錢)、創作者標價賣分析平台抽 5–10%、準度海選天梯。會員不限量,GOLD 會員。",
  },
  {
    date: "2026-05-26",
    title: "大幅減頁・學 Apple",
    detail:
      "砍掉沒人看、滑不到底的頁面(從 60 多頁精簡到約 40 頁)。寧可少而精,也不要多而雜。",
  },
  {
    date: "2026-05-23",
    title: "GOLD 申請表單上線 + 信任頁打磨",
    detail:
      "GOLD 申請頁上線,退款與隱私條款對齊台灣消保法與個資法。多個頁面的可信度與動線一起優化。",
  },
  {
    date: "2026-05-21",
    title: "手機優先重塑 + 深度頁改成球迷語法",
    detail:
      "首頁在手機上的滑動壓到 3 個畫面以內,加上底部常駐的入會列。深度頁把工程術語改寫成棒球迷看得懂的話。",
  },
  {
    date: "2026-05-21",
    title: "公開戰績上線 · 輸的也掛",
    detail:
      "引擎每一場預測,賽後自動標「中 / 沒中」並永久累積在戰績頁。言中跟落空一樣大方公開,從第一場開始算。",
  },
  {
    date: "2026-05-20",
    title: "後端上線 + 倒置宣言",
    detail:
      "等候名單改成真實資料庫儲存。/manifesto 寫下四個「反過來做」的論證:方法公開、不靠明牌賺錢、覆蓋範圍誠實、不追蹤你。",
  },
  {
    date: "2026-05-18 之前",
    title: "v0.1–v0.26 · 從零打造",
    detail:
      "打造 ZONE 27 品牌系統、逐打席「萬象」模擬引擎、/lab 模擬器、整合 MLB 官方資料。完整逐版歷史見 GitHub commits。",
  },
];

export default function ChangelogPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <header className="pb-10 border-b border-line/60">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
            >
              CHANGELOG
            </p>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-6">
              我們把版本歷史交給{" "}
              <span lang="en" className="font-mono text-gold">git</span>
            </h1>
            <p className="text-mute text-base leading-relaxed mb-8 max-w-2xl">
              ZONE 27 不手工維護版本敘事 —— 那種敘事容易遺漏、過時、變成行銷話術。
              <strong className="text-bone">
                所有變動都公開在 GitHub commits,git log 是唯一事實來源
              </strong>
              。本頁列出近期里程碑當參考;完整逐 commit 歷史請看下方按鈕。
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={GH_COMMITS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 border border-gold text-gold hover:bg-gold hover:text-navy transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                <span lang="en">VIEW ALL COMMITS ON GITHUB →</span>
              </a>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 px-5 py-3 border border-line/60 text-mute hover:text-gold hover:border-gold/40 transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                <span>/ROADMAP · 未來承諾 →</span>
              </Link>
            </div>

            <div className="mt-8">
              <UnscheduledLetterChip variant="panel" />
            </div>
          </header>

          <section className="py-12">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.45em] mb-6"
            >
              RECENT MILESTONES
            </p>
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div
                  key={`${m.date}-${i}`}
                  className="pb-6 border-b border-line/40 last:border-b-0"
                >
                  <p
                    lang="en"
                    className="font-mono text-gold text-sm tracking-[0.2em] tabular mb-3"
                  >
                    {m.date}
                  </p>
                  <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-3 leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-mute text-sm leading-relaxed">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 border-t border-line/40 text-center">
            <p className="text-mute text-sm leading-relaxed max-w-xl mx-auto">
              這頁刻意保持精簡 —— 因為我們相信
              <strong className="text-bone">git log 比任何手寫敘事更新更快、更不會撒謊</strong>。
              每個頁面 Footer 點版本 chip 也可以直達 commits。
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
