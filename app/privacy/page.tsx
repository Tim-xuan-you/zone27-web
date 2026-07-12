import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── ZONE 27 · /privacy · 隱私(國小生版)──────────────────────────────────
// Tim 2026-07-13「隱私、服務條款也一樣處理 · 看了心煩意亂」(同 /ethics 刀法):
// 舊 588 行整頁活在「等候名單/排隊順位」時代(三次改版前)—— 過期章節與內部腔
// (30 天公告流程、migration 編號、retention 英文行話)全刪。 留下個資法真正要求
// 告知的幾件事,每句國小生都懂:收什麼、不收什麼、放哪(跨境=日本東京)、
// 你的權利(查/改/刪)、找誰。 「反追蹤」承諾是品牌差異化,原樣保留。
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "隱私 · ZONE 27",
  description:
    "我們收什麼:帳號 email 和密碼、你自己按下去的紀錄、你寫給我們的話,就這些。不裝任何追蹤器、不賣資料、站上沒有廣告。資料存在 Supabase(日本東京)。想查、改、刪你的資料,寄信就辦。",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 隱私 · 2026 年 7 月更新
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            收得少,<span className="text-gold">講得清</span>。
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-2" aria-hidden="true" />
        </section>

        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12">
          <ul className="list-none pl-0 m-0 space-y-6 text-mute leading-relaxed text-base">
            <li>
              <strong className="text-bone">我們收什麼(全部在這)。</strong>
              ① 你的帳號:email 和密碼(登入用)。
              ② 你自己按出來的紀錄:押了哪些場、追蹤了誰、取的顯示名 —— 這些本來就是功能。
              ③ 你主動寫給我們的話(回報問題、會員申請)。 就這些,沒有藏起來的。
            </li>
            <li>
              <strong className="text-bone">我們不收什麼。</strong>
              不裝任何追蹤器(沒有 Google Analytics 那一類)、不記錄你逛了哪些頁、
              不抓你的 IP 建檔案。 Cookie 只有登入需要的那一顆 —— 沒有廣告 cookie,
              因為<strong className="text-bone">站上沒有廣告</strong>。
            </li>
            <li>
              <strong className="text-bone">絕不做的事。</strong>
              不賣你的資料、不給廣告商、不丟進行銷名單、不拿去訓練 AI。
            </li>
            <li>
              <strong className="text-bone">資料放哪。</strong>
              帳號和紀錄存在 Supabase(機房在日本東京),網站跑在 Vercel,
              寄信用 Resend —— 都是國際大廠。 依個資法告知:你的資料會出境到日本存放。
            </li>
            <li>
              <strong className="text-bone">你的權利(個資法)。</strong>
              你隨時可以要求<strong className="text-bone">查看、更正、刪除</strong>你的資料,
              也可以要求停止使用 —— 寄一封信就辦,不用理由。 刪帳號,個人資料就跟著刪。
            </li>
            <li>
              <strong className="text-bone">未滿 18 歲,請不要註冊。</strong>
            </li>
          </ul>
        </section>

        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-20">
          <p className="font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed border-t border-line/40 pt-4">
            查資料、改資料、刪帳號、任何隱私問題:寫信到{" "}
            <a
              href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20privacy"
              className="text-mute/70 hover:text-gold underline-offset-4 hover:underline"
            >
              tatayngiti@gmail.com
            </a>
            {" "}· 相關頁:{" "}
            <Link href="/terms" className="text-mute/70 hover:text-gold underline-offset-4 hover:underline">
              服務條款
            </Link>
            {" "}·{" "}
            <Link href="/ethics" className="text-mute/70 hover:text-gold underline-offset-4 hover:underline">
              量力而為
            </Link>
            。 政策有改,這頁最上面的日期會換。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
