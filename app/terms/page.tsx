import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── ZONE 27 · /terms · 服務條款(國小生版)─────────────────────────────────
// Tim 2026-07-13「隱私、服務條款也一樣處理 · 看了心煩意亂」(同 /ethics 刀法):
// 舊 346 行裡的過期章節(「還在準備階段」「BLACK 等候名單」= waitlist 時代)與
// 內部腔(30 天公告流程、pre-launch meta)全刪 —— 留下真正扛法律責任的九件事,
// 每句國小生都懂。 法律錨點保留:消保法 §19 猶豫期(我們給 14 天)· 中華民國法律 ·
// 台北地院管轄 · 18 歲門檻 · 免責聲明。
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "服務條款 · ZONE 27",
  description:
    "ZONE 27 是運動資訊平台,不是賭場:不收注、不出彩金。預測是資訊不是投資建議,沒有人能保證獲利。付費會員每期 14 天內無條件全額退款、永不自動扣款。適用中華民國法律。",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 服務條款 · 2026 年 7 月更新
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            九件事,<span className="text-gold">講清楚</span>。
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-2" aria-hidden="true" />
        </section>

        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12">
          <ol className="list-none pl-0 m-0 space-y-6 text-mute leading-relaxed text-base [counter-reset:tos]">
            <li>
              <strong className="text-bone">這是什麼。</strong>
              ZONE 27 是運動資訊平台,由創辦人 Tim 以個人名義經營,尚未公司化。
              我們<strong className="text-bone">不是賭場</strong>:不收注、不出彩金、不撮合對賭。
            </li>
            <li>
              <strong className="text-bone">誰能用。</strong>
              純看內容,誰都可以;要用會員功能(押注紀錄、發言),要滿 18 歲。
            </li>
            <li>
              <strong className="text-bone">預測只是資訊。</strong>
              站上所有勝率、模擬、評鑑,都是統計和分析 ——
              不是投資建議、不是明牌,<strong className="text-bone">沒有人能保證獲利</strong>。
              你據此下注,盈虧自負。
            </li>
            <li>
              <strong className="text-bone">付費會員怎麼收錢。</strong>
              你自己手動轉帳,一期一付(BLACK 一期 31 天 · GOLD 一期 365 天)。
              <strong className="text-bone">永不自動扣款</strong> ——
              不轉下一期,服務就自然停止,不用按取消、不用填問卷。
            </li>
            <li>
              <strong className="text-bone">退款。</strong>
              消保法給你 7 天猶豫期,我們給 <strong className="text-gold">14 天</strong>:
              每期入帳後 14 天內,寄信就全額退、不問原因、不挽留。
              寄到下面那個信箱,主旨寫「退款」就行。
            </li>
            <li>
              <strong className="text-bone">合理使用。</strong>
              別攻擊伺服器、別大規模爬站、別冒充別人、別拿本站做違法的事 ——
              違反就停權。
            </li>
            <li>
              <strong className="text-bone">內容和品牌。</strong>
              我們的方法全公開,歡迎閱讀、引用、學習;
              但 ZONE 27 的名稱、Logo 和設計,不能拿去開你自己的站。
            </li>
            <li>
              <strong className="text-bone">我們不負責的事。</strong>
              預測沒中造成的損失、網站臨時掛掉、主機商(Vercel、Supabase)出事故 ——
              在法律允許的範圍內,我們不賠。
            </li>
            <li>
              <strong className="text-bone">法律。</strong>
              本條款適用中華民國法律,爭議由台北地方法院管轄。
              條款有改,這頁最上面的日期會換 —— 繼續使用就代表同意新版。
            </li>
          </ol>
        </section>

        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-20">
          <p className="font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed border-t border-line/40 pt-4">
            有疑問、要退款、要退出:寫信到{" "}
            <a
              href="mailto:tatayngiti@gmail.com?subject=ZONE%2027"
              className="text-mute/70 hover:text-gold underline-offset-4 hover:underline"
            >
              tatayngiti@gmail.com
            </a>
            {" "}· 也請看{" "}
            <Link href="/privacy" className="text-mute/70 hover:text-gold underline-offset-4 hover:underline">
              隱私
            </Link>
            {" "}和{" "}
            <Link href="/ethics" className="text-mute/70 hover:text-gold underline-offset-4 hover:underline">
              量力而為
            </Link>
            。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
