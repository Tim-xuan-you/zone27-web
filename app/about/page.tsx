import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SUPPORT_EMAIL } from "@/lib/brand-constants";

export const metadata: Metadata = {
  title: "關於 · 有帳本的玩運彩",
  description:
    "收費明牌輸了刪文、黑箱、喊神準。 ZONE 27 引擎免費、輸了照掛、方法全公開、誠實講沒人能準。 一個看 27 年中華職棒的球迷做的,不是博彩公司。",
};

// ── ZONE 27 · /about ───────────────────────────────────
// R199 NUCLEAR · Tim canary「8 章節品牌方法論 · 內容多到不可思議 · 沒人從頭看到尾 ·
// 不知道重點在哪 · 第一印象最重要 · 以心理學處理 · 極簡 · 看 Apple/Polymarket」。
//
// 從 8 章節 8-min essay(PROLOGUE/PROBLEM/THESIS/METHOD/PROMISE/FOUNDER/WHY27/
// OPERATIONS + 8字 glow box + LongReadHandoff)→ 一屏可掃完的「我們是誰、為什麼不同」。
//
// 第一印象心理學:
//   · 對比錨定 —— 人靠「跟已知的東西比」來理解新東西 · 所以用「收費明牌 vs 我們」
//     當主視覺(skeptic 一眼就懂我們是它的誠實反面)。
//   · 首因效應 —— 最利的鉤子放最前面(身分一句話)。
//   · 證據勝過宣稱 —— 每個差異點都掛一條可點的收據(/lab · /track-record · GitHub
//     · /calibration)· 不只嘴上講。
//   · 認知輕鬆 —— 白話、短、具體、無術語、無 8 章。
//   · 人的信任訊號 —— 一個人做的(solo founder = costly signal)。
// 深度(方法論/audit/coverage/承諾)不刪 · 移到各自的專頁 · 好奇的人一鍵到得了。
// ─────────────────────────────────────────────────────

const THEM = [
  "收你明牌費",
  "輸了刪文 · 只截贏的給你看",
  "黑箱 · 不告訴你怎麼算的",
  "喊「94% 神準」(數學上不可能)",
];

const US: { text: string; href?: string; external?: boolean }[] = [
  { text: "引擎永遠免費 · 自己跑一萬次", href: "/lab" },
  { text: "輸了照掛 · 刪不掉", href: "/track-record" },
  { text: "方法完整公開 · 怎麼算的都攤開", href: "/methodology" },
  { text: "誠實講:全世界最準也才 5 成 7", href: "/calibration" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="about" />

      <main id="main">
        {/* ── HERO · 一句話身分(首因)──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-16 sm:pt-24 pb-12 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 關於 ZONE 27
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.12] tracking-tight text-bone">
            有<span className="text-gold">帳本</span>的玩運彩。
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-mute text-base sm:text-lg leading-relaxed">
            免費引擎告訴你接下來誰會贏。 押了、贏了、輸了 ——
            <span className="text-bone"> 全部攤開,刪不掉。</span>
          </p>
        </section>

        {/* ── 對比錨定 · 我們 vs 收費明牌(主視覺)────────────
            第一眼就懂:我們是「收費明牌站」的誠實反面。 不用紅綠(品牌紅線)·
            他們 = 暗灰、我們 = 冷金。 手機堆疊(他們上、我們下 = 收尾印象更強)。 */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-14">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
            / 我們跟收費明牌哪裡不一樣
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 他們 */}
            <div className="border border-line/60 bg-slate/20 p-6 sm:p-7 order-1">
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-5">
                收費明牌 · LINE 老師 · 莊家
              </p>
              <ul className="space-y-3.5">
                {THEM.map((t) => (
                  <li key={t} className="flex items-baseline gap-3 text-mute/85 text-sm sm:text-[15px] leading-relaxed">
                    <span aria-hidden className="font-mono text-loss/70 text-[11px] shrink-0">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* 我們 · 每條掛收據 */}
            <div className="border border-gold/50 bg-gold/[0.05] glow-soft p-6 sm:p-7 order-2">
              <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-5">
                ZONE 27
              </p>
              <ul className="space-y-3.5">
                {US.map((u) => (
                  <li key={u.text} className="flex items-baseline gap-3 text-bone text-sm sm:text-[15px] leading-relaxed">
                    <span aria-hidden className="font-mono text-gold text-[11px] shrink-0">✓</span>
                    {u.href ? (
                      u.external ? (
                        <a href={u.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-gold hover:underline transition-colors">
                          {u.text}
                        </a>
                      ) : (
                        <Link href={u.href} className="underline-offset-4 hover:text-gold hover:underline transition-colors">
                          {u.text}
                        </Link>
                      )
                    ) : (
                      <span>{u.text}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-gold/20 font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
                每一條都點得進去看證據 · 不是嘴上講。
              </p>
            </div>
          </div>
        </section>

        {/* ── 誰在做 · 人的信任訊號(solo founder = costly signal)──── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6 py-1">
            <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-3">
              / 誰在做這個
            </p>
            <p className="text-bone text-lg sm:text-xl font-light leading-relaxed">
              一個人。 Tim · 看了 27 年中華職棒的球迷。
            </p>
            <p className="mt-3 text-mute text-sm sm:text-base leading-relaxed">
              不是公司、不是工程師、不是博彩業者 —— 就是受不了「收錢報明牌、輸了刪文」
              這套劇本反覆上演。 每一場預測都攤在{" "}
              <Link
                href="/track-record"
                className="text-gold/90 underline-offset-4 hover:underline"
              >
                公開戰績
              </Link>
              ;輸的紀錄刪不掉 —— 因為「刪不掉」才是整件事的重點。
            </p>
            <p className="mt-3 text-mute/80 text-sm leading-relaxed">
              有問題、想回報、或要找我?直接寫信:{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-gold/90 underline-offset-4 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              （Tim 親手回 · 約 1-3 個工作天)。
            </p>
          </div>
        </section>

        {/* ── 簽名 · 8 字 grammar(一行 · 不再是 glow box + 三段解釋)──── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14 text-center">
          <p className="text-2xl sm:text-3xl text-bone font-light tracking-tight">
            方法公開 <span className="text-gold/50 mx-1.5">·</span> 品味私藏
          </p>
          <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.25em]">
            27 = 一場完美比賽的出局數 · 也是我們的標準
          </p>
        </section>

        {/* ── CTA · 去看產品(不是這頁就推銷付費)──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-14 text-center border-t border-line/40">
          <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-7">
            與其聽我講 · 不如自己看。
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] px-7 py-3.5 hover:bg-gold-soft transition-colors"
            >
              看接下來誰會贏 →
            </Link>
            <Link
              href="/track-record"
              className="inline-flex items-center gap-2 border border-gold/50 text-gold font-mono text-xs tracking-[0.25em] px-7 py-3.5 hover:bg-gold/10 transition-colors"
            >
              看公開戰績(含輸) →
            </Link>
          </div>
          {/* 深度一鍵到得了 · 給少數想挖的人(不在主動線轟炸)*/}
          <p className="mt-9 font-mono text-mute text-[10px] tracking-[0.2em] leading-relaxed">
            想挖更深?{" "}
            <Link href="/methodology" className="text-mute hover:text-gold underline-offset-4 hover:underline">引擎方法</Link>
            {" · "}
            <Link href="/audit" className="text-mute hover:text-gold underline-offset-4 hover:underline">模型稽核</Link>
            {" · "}
            <Link href="/coverage" className="text-mute hover:text-gold underline-offset-4 hover:underline">覆蓋範圍</Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
