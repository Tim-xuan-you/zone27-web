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
  "喊「94% 神準」(根本不可能這麼準)",
];

const US: { text: string; href?: string; external?: boolean }[] = [
  { text: "引擎永遠免費 · 自己跑一萬次", href: "/lab" },
  { text: "輸了照掛 · 刪不掉", href: "/track-record" },
  { text: "方法完整公開 · 怎麼算的都攤開", href: "/methodology" },
  { text: "誠實講:全世界最準也才 5 成 7", href: "/calibration" },
];

// R307 ·「錢從哪來」= Defector 的核心招式(錢的結構 = 論證本身,不是宣稱)。
// 原本這四件埋在「誰在做」的第三段、灰色 14px —— 整頁最強的一句話卻是最小的字。
// 🔴 R181 honesty 紅線:**不准寫「0 抽傭」**(創作者抽 5-10% 會當場自打臉)。
//    只列確實成立的四件:沒廣告主、沒創投/股東、不抽真錢下注的傭、不賣你的資料。
const NO_MONEY_FROM: { n: string; k: string }[] = [
  { n: "0", k: "廣告主" },
  { n: "0", k: "創投 · 股東" },
  { n: "0", k: "賭場抽成" },
  { n: "0", k: "賣掉你的資料" },
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
              ;輸的紀錄刪不掉。
            </p>
            {/* R307 ·「錢從哪來」原本是這裡的第三段(灰色小字)→ 已升格成自己的一節(見下)。
                理由:那是整頁最強的一句話,卻用最小的字埋在段落堆裡 = Defector 的招式被浪費掉。 */}
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

        {/* ── 錢從哪來 · 我對誰負責(R307 · Defector 的核心招式)────────────
            Defector 的 about 之所以有力,是因為「錢從哪來」這個事實【本身就是論證】——
            不用形容詞。 我們有更強的版本,但原本被埋在上一節的第三段灰色小字裡。
            四個 0 = SHOW(規格式的 costly signal · 同 /shops 規格表),下面那句才是punch。
            🔴 不寫「0 抽傭」(見 NO_MONEY_FROM 上方紅線)。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
            / 錢從哪來 · 我對誰負責
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {NO_MONEY_FROM.map((m) => (
              <div
                key={m.k}
                className="border border-line/60 bg-slate/20 px-3 py-5 text-center"
              >
                <p className="font-mono text-gold text-3xl sm:text-4xl font-light leading-none tabular">
                  {m.n}
                </p>
                <p className="mt-2 text-mute text-xs sm:text-sm leading-snug">{m.k}</p>
              </div>
            ))}
          </div>
          <p className="text-bone text-base sm:text-lg font-light leading-relaxed text-center max-w-xl mx-auto">
            養這個站的錢<span className="text-gold">來自會員</span>。
            所以我只需要對一種人負責 —— <span className="text-gold">出錢撐著它的你</span>。
          </p>
          <p className="mt-4 text-mute text-sm sm:text-base leading-relaxed text-center max-w-xl mx-auto">
            不是投資人、不是廣告主,更不是賭場。 這一條決定了整個站長什麼樣子:靠廣告活的站,
            最後要賣掉你的注意力;靠賭場活的站,最後要你多下一注。
            兩個我都不靠 —— 所以我可以老實跟你說「今天沒有值得出手的」。
          </p>
        </section>

        {/* ── 說到底 · 8 字 grammar(R307:終於把這句話講完)──────────────
            🔴 Tim 2026-07-15 canary「這頁感覺寫一半沒完結」= 精準,而且是字面上的。
            實測全頁區塊:這是【唯一】沒有小標、沒有內文的一節 —— 11 個字用標題級大小印出來,
            底下什麼都沒有 → 大腦把它讀成「一個標題」然後等內文,結果來的是分隔線。
            八個字是 /manifesto 的品牌骨幹,被裸著丟在這裡、從來沒有人解釋過它是什麼意思
            = 一句主張,後面沒有句子。 解 = 不是刪掉它,是【把句子寫完】+ 署名收尾。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6 text-center">
            / 說到底
          </p>
          <p className="text-2xl sm:text-3xl text-bone font-light tracking-tight text-center">
            方法公開 <span className="text-gold/50 mx-1.5">·</span> 品味私藏
          </p>
          <p className="mt-6 text-mute text-sm sm:text-base leading-relaxed text-center max-w-xl mx-auto">
            演算法、數據、怎麼算的 —— 全部攤開,你要抄就抄去。 我不靠秘密賺錢。
            但挑哪一場、怎麼把價講清楚、哪一格該劃掉 —— 那是品味。
            <span className="text-bone"> 那個抄不走,也是我唯一留著的東西。</span>
          </p>
          <p className="mt-7 font-mono text-gold/70 text-[10px] tracking-[0.3em] text-center">
            —— TIM · ZONE 27
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
