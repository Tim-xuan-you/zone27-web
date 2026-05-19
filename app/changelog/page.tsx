import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Changelog — Build in Public",
  description:
    "ZONE 27 的完整版本歷史。每一次部署都在這裡公開,沒有秘密,沒有 PR 包裝。",
};

type Tag = "feature" | "engine" | "design" | "infra" | "content";

type Release = {
  version: string;
  title: string;
  date: string;
  tag: Tag;
  body: string;
  bullets: string[];
};

const RELEASES: Release[] = [
  {
    version: "v0.8",
    title: "REPLAY MODE · 文字直播",
    date: "2026 · 05 · 19",
    tag: "feature",
    body: "真實打席引擎現在會說故事。在 Lab 底部出現 ▶ REPLAY ONE GAME 按鈕,每按一次,引擎跑一場全新的 9 局比賽,並以 CPBL 文字直播的形式逐打席播出。",
    bullets: [
      "70+ 個打席 × 110ms 流速,約 9 秒看完一場",
      "HR 視覺特殊處理(冷金 + medium 字重)、滿壘保送強制推進得分",
      "每按一次 REPLAY ANOTHER 都是全新的劇本,沒有兩場一樣",
    ],
  },
  {
    version: "v0.7",
    title: "Real At-Bat Engine",
    date: "2026 · 05 · 19",
    tag: "engine",
    body: "Lab 引擎從簡化的 Poisson 得分模型升級成「逐打席對決」模型。每場虛擬比賽現在會跑 ~70 次打席對決,完整模擬 9 局、27 個出局數,以及壘上跑者推進物理。",
    bullets: [
      "8 種打席結果機率由投手 K/9 · BB/9 · HR/9 推導",
      "滿壘保送會強制得分,二壘安打 + 一壘跑者 50% 回本壘",
      "10,000 場 ~700,000 RNG 採樣,仍 < 2 秒收斂",
    ],
  },
  {
    version: "v0.6",
    title: "Founders 27 Waitlist (Live)",
    date: "2026 · 05 · 19",
    tag: "feature",
    body: "/founders 的 CLAIM YOUR NUMBER 按鈕從此會做事。訪客填 email,送出後拿到自己的等候名單編號(從 #001 開始遞增)。所有報名永久保存在 Vercel 後台 logs,可隨時 export。",
    bullets: [
      "React 19 Server Action + useActionState + useFormStatus",
      "介面誠實標示「PRE-LAUNCH WAITLIST · NO PAYMENT TAKEN」",
      "升級到 Vercel KV / Upstash 只要 5 分鐘,介面零變動",
    ],
  },
  {
    version: "v0.5",
    title: "Live AI Laboratory (BETA)",
    date: "2026 · 05 · 19",
    tag: "feature",
    body: "ZONE 27 第一個會做事的功能上線:/lab。選一場 CPBL 比賽,按下 ▶ RUN 10,000 SIMULATIONS,2 秒內看到黑金勝率條從 50/50 收斂到 62/38。",
    bullets: [
      "純客戶端 Monte Carlo(Knuth Poisson sampler)",
      "requestAnimationFrame 批次 200 場/frame",
      "完成後出現比分分布、信心指標、AI 偏差復盤",
    ],
  },
  {
    version: "v0.4",
    title: "Brand Manifesto + The 27 Wall",
    date: "2026 · 05 · 19",
    tag: "design",
    body: "兩個品牌靈魂頁面 + 客製 favicon + 架構升級。",
    bullets: [
      "/about 六章節品牌方法論(Problem · Thesis · Method · Promise · Founder Note · Why 27)",
      "/leaderboard 視覺化 270 個創始席位,#001-#007 已 FORGED",
      "app/icon.tsx 用 ImageResponse 生成 Z27 monogram favicon",
      "抽出 Nav + Footer 共用元件,日後加頁面只改 1 處",
    ],
  },
  {
    version: "v0.3",
    title: "Match Detail + Dynamic OG",
    date: "2026 · 05 · 19",
    tag: "feature",
    body: "死按鈕復活。每場比賽現在有完整詳情頁。同時加入動態社群分享預覽圖。",
    bullets: [
      "/matches/[gameId] 動態 SSG,3 場 CPBL 預先 build",
      "Top 5 預測比分 · 雙投手 5 項進階數據 · 近 5 場戰績 · AI 方法論",
      "app/opengraph-image.tsx — LINE/FB 分享自動帶黑金品牌卡",
    ],
  },
  {
    version: "v0.2",
    title: "Matches Board + Founders Sales Page",
    date: "2026 · 05 · 19",
    tag: "content",
    body: "從單頁變成多頁網站。",
    bullets: [
      "/matches 賽事列表,網格排列縮小版預測卡片",
      "/founders 創始會員 NT$ 2,700 × 270 銷售頁",
      "首頁 Nav 加上 next/link 連到三個頁面",
    ],
  },
  {
    version: "v0.1",
    title: "First Light",
    date: "2026 · 05 · 19",
    tag: "infra",
    body: "ZONE 27 正式上線。Next.js 16 + TypeScript + Tailwind v4 + Geist 字型 + 深藏青 × 冷金品牌設計系統。",
    bullets: [
      "首頁靈魂卡片:中信兄弟 vs 統一獅 62%/38% 黑金微光進度條",
      "Slogan:不靠直覺,只看演算法 / We Don't Guess. We Compute.",
      "Founders 27 限量銷售區塊 + 三大特色:零抽成 · 不可篡改 · 量化視覺化",
    ],
  },
];

const ROADMAP = [
  {
    item: "Lab v0.4 · Trackman 球速與轉軸先驗",
    note: "把投手的 K/9 等率轉換成更逼近真實的球速分布",
  },
  {
    item: "CPBL 賽程 ISR 自動更新",
    note: "每小時 revalidate,網頁始終顯示當天最新對戰組合",
  },
  {
    item: "Waitlist 升級至 Supabase / Vercel KV",
    note: "從 console.log 換成永久資料庫,加入創始編號自動鎖定",
  },
  {
    item: "支付整合(Stripe / TapPay / Newebpay)",
    note: "Founders 27 正式開放預訂,$2,700 一次性鎖定終身會員",
  },
  {
    item: "/glossary · 27 種進階棒球數據詞彙表",
    note: "對應 27 概念,從 OPS 到 wRC+ 到 FIP 到 Trackman 指標",
  },
];

const TAG_COLOR: Record<Tag, string> = {
  feature: "text-gold border-gold/50",
  engine: "text-gold border-gold/50",
  design: "text-bone border-line",
  infra: "text-mute border-line",
  content: "text-bone border-line",
};

const TAG_LABEL: Record<Tag, string> = {
  feature: "FEATURE",
  engine: "ENGINE",
  design: "DESIGN",
  infra: "INFRA",
  content: "CONTENT",
};

export default function ChangelogPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          BUILD LOG · BUILT IN PUBLIC
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          ZONE 27 的
          <br />
          <span className="text-gold">完整出土史</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          每一次部署、每一個版本、每一個失敗,都會出現在這裡。
          沒有 PR 包裝,沒有公關稿。直接讀懂 ZONE 27 是怎麼被打造出來的。
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-16" />

      {/* ── RELEASES TIMELINE ────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-10">
          / RELEASES — LATEST FIRST
        </p>

        <div className="space-y-14">
          {RELEASES.map((r) => (
            <article key={r.version} className="relative pl-0 sm:pl-10">
              {/* Marker dot for sm+ */}
              <span
                className="hidden sm:block absolute left-0 top-2 w-2 h-2 rounded-full bg-gold/70 glow-gold"
                aria-hidden
              />
              {/* Faint vertical line */}
              <span
                className="hidden sm:block absolute left-[3px] top-7 bottom-[-56px] w-px bg-line/40"
                aria-hidden
              />

              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="font-mono text-gold tabular text-2xl tracking-tight">
                  {r.version}
                </span>
                <span
                  className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${TAG_COLOR[r.tag]}`}
                >
                  {TAG_LABEL[r.tag]}
                </span>
                <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em] ml-auto">
                  {r.date}
                </span>
              </div>

              <h2 className="text-2xl text-bone font-light tracking-tight mb-3">
                {r.title}
              </h2>

              <p className="text-mute leading-relaxed mb-4 text-sm sm:text-base">
                {r.body}
              </p>

              <ul className="space-y-1.5">
                {r.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-mute/80 text-sm leading-relaxed flex gap-3"
                  >
                    <span className="text-gold/60 select-none">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── UP NEXT ─────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 border-t border-line/40">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-8">
          / UP NEXT · TRANSPARENT ROADMAP
        </p>

        <div className="space-y-5">
          {ROADMAP.map((r) => (
            <div
              key={r.item}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 pb-4 border-b border-line/40 last:border-b-0"
            >
              <span className="font-mono text-bone text-base flex-1">
                {r.item}
              </span>
              <span className="text-mute text-sm">{r.note}</span>
            </div>
          ))}
        </div>

        <p className="mt-12 text-mute/70 text-sm leading-relaxed text-center max-w-xl mx-auto">
          這份路線圖隨時可能調整,但目前每個 item 都有實作計畫。
          我們相信寫出來的承諾才有兌現的壓力。
        </p>
      </section>

      {/* ── FINAL CTA ───────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          BUILT IN PUBLIC. SHIPPED IN PUBLIC.
        </p>
        <h3 className="text-3xl text-bone font-light tracking-tight">
          想看更深?直接讀 commits。
        </h3>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            href="https://github.com/Tim-xuan-you/zone27-web"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            VIEW SOURCE →
          </a>
          <Link
            href="/founders"
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            JOIN THE WAITLIST →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
