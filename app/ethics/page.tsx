import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── ZONE 27 · /ethics · 量力而為 ─────────────────────────────────────────
// Tim 2026-07-13 canary「很雜 · 一堆內部溝通的東西寫出去幹嘛 · 極簡再極簡 · 國小生」:
// 原 319 行(9 條簽名宣言 + 30 天修訂流程 + 對手違反幾條的對照)全刪不搬家 ——
// 那是我們自己在後台對齊用的話,不是訪客要看的。 留下來的只有訪客真的用得到的:
// 我們是誰(不是賭場)、錢該怎麼看待、撐不住時打給誰。 每句國小生都懂。
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "量力而為 · ZONE 27",
  description:
    "我們不是賭場,不收注、看這裡永遠免費。沒有人能保證獲利。用輸了也不心痛的錢。需要幫忙,這幾支電話免費:1925 安心專線(24 小時)、1995 生命線、1980 張老師。未滿 18 歲依法不能買運動彩券。",
};

export default function EthicsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 量力而為
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            玩得起,<span className="text-gold">才玩</span>。
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-2" aria-hidden="true" />
        </section>

        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-10">
          <ul className="list-none pl-0 m-0 space-y-5 text-mute leading-relaxed text-base">
            <li>
              <strong className="text-bone">我們不是賭場。</strong>
              不收你的注、不碰你的錢 —— 看這裡的所有東西,永遠免費。
            </li>
            <li>
              <strong className="text-bone">沒有人能保證獲利。</strong>
              全世界最強的引擎,賽前算單場也只到大約 5 成 7 —— 喊神準的,別信。
            </li>
            <li>
              <strong className="text-bone">用「輸了也不心痛」的錢。</strong>
              運彩是娛樂,不是收入 —— 別借錢押,別想靠它翻身。
            </li>
            <li>
              <strong className="text-bone">未滿 18 歲,依法不能買運動彩券。</strong>
            </li>
          </ul>
        </section>

        {/* 求助資源 · 台灣 · 免費(全頁唯一的框 · 這才是這頁存在的理由)*/}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-20">
          <div className="p-5 sm:p-6 border border-gold/30 bg-slate/30">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-4">
              覺得停不下來?先停一天 · 想找人聊聊,這幾支電話免費、不記名
            </p>
            <ul className="space-y-2.5 text-mute leading-relaxed list-none pl-0">
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-bone tabular text-lg shrink-0">1925</span>
                <span className="text-sm">安心專線 · 24 小時</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-bone tabular text-lg shrink-0">1995</span>
                <span className="text-sm">生命線</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-bone tabular text-lg shrink-0">1980</span>
                <span className="text-sm">張老師專線</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
