import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /feedback · 任何人(含匿名)回報問題 / bug ──────────────────────
// Tim:「要有一個顯眼、任何人(連沒註冊的)都能輕易告知哪裡有 bug 的管道。」
// 設計:0 登入摩擦的單頁(一個輸入框 + 選填聯絡 + 送出)· Footer 每頁掛入口 ·
//   只 email 給站長(0 資料庫)· 框架接上品牌的「公開認錯」靈魂(/corrections)。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "回報問題",
  description:
    "在 ZONE 27 發現算錯、壞掉、看不懂的地方?不用登入,一句話告訴我們 —— 我們修好的會公開記在「我們搞砸過的事」。",
  path: "/feedback",
});

export default function FeedbackPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main
        id="main"
        className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-20 pb-24"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
          / 回報問題
        </p>
        <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
          發現哪裡怪怪的?<span className="text-gold">告訴我們。</span>
        </h1>
        <p className="mt-6 text-mute leading-relaxed">
          算錯了、壞了、看不懂、跑不動 —— 任何一點,我們都想知道。{" "}
          <span className="text-bone">不用登入、不用留個資</span>,一句話就好。
        </p>
        <p className="mt-3 text-mute/80 text-sm leading-relaxed">
          這不是客套。 ZONE 27 整個立場就是「公開認錯、攤開來修」—— 你回報的問題,
          我們修好的會記在{" "}
          <Link
            href="/corrections"
            className="text-gold underline-offset-4 hover:underline"
          >
            我們搞砸過的事
          </Link>
          。
        </p>

        <div className="mt-8">
          <FeedbackForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
