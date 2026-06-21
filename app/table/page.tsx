import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { getTableCalls, type CallResult } from "@/lib/table-picks";

export const metadata: Metadata = {
  title: "今晚這桌 · 誠實收據 · ZONE 27",
  description:
    "Tim、Ron、Lewi 三個朋友的牌桌(Tim 是這個站的創辦人)。 每一注賽前就講死、不能改;賽後不管中、沒中,全部留著不刪。 與其叫你相信,他們先把自己的攤出來。",
};

// ── ZONE 27 · /table · 今晚這桌 · 誠實收據 ─────────────────────────────────
// 緣起:Tim 跟朋友真的在賭世界盃/MLB 的角球、總分、讓分、BTTS —— 而我們的引擎對「角球」這種盤
// 根本沒有模型。 米其林式克制:對沒模型的盤大聲說「沒有」,然後照樣幫你鎖死、賽後誠實對帳。
// 資料走 lib/table-picks.ts(Tim curate · 同 CPBL 賽果手抄紀律)· 0 migration · graceful 空桌。
// 🔴 站上不指名運彩平台、不顯編號、不掛賠率 —— 我們不是賭場,這是「公開鎖的判斷 + 誠實對帳」。
// ─────────────────────────────────────────────────────

export const revalidate = 300;

function resultLabel(r: CallResult): { text: string; cls: string } {
  switch (r) {
    case "win":
      return { text: "中了", cls: "text-gold" };
    case "lose":
      return { text: "沒中", cls: "text-loss/85" };
    case "push":
      return { text: "退錢", cls: "text-mute/60" };
    case "void":
      return { text: "取消", cls: "text-mute/60" };
    default:
      return { text: "還沒對帳", cls: "text-mute/55" };
  }
}

export default function TablePage() {
  const { calls, total, pending, settled, win, lose } = getTableCalls();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 今晚這桌
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            這桌<span className="text-gold">押了什麼</span>
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-5" aria-hidden="true" />
          {/* 誰是 Tim/Ron/Lewi + 為什麼出現(Tim dogfood:用戶不知道這三個人是誰)·
              行銷框架 = 創辦人帶頭示範,不是版主管你(守 R239③「我們大家一樣」)。 */}
          <p className="text-mute text-base leading-relaxed">
            這是 <span className="text-bone">Tim、Ron、Lewi</span> 三個朋友的牌桌 —— 一起看球、一起下注
            (Tim 就是這個站的創辦人)。 跟別人不一樣的是:他們押的每一注,
            <span className="text-bone">賽前就講死、不能改</span>;賽後不管
            <span className="text-bone">中、沒中,全部留著</span>,不刪。
          </p>
          <p className="mt-3 text-mute text-base leading-relaxed">
            與其叫你相信我們,他們先把自己的攤出來。 賣明牌的只敢曬贏的 —— 這桌連自己輸的都掛著。
          </p>
        </section>

        {/* ── 計數條 ── */}
        {total > 0 && (
          <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-2">
            <p className="font-mono text-mute/60 text-[11px] tracking-[0.2em] tabular">
              桌上 <span className="text-bone">{total}</span> 注
              {" · "}
              還沒對帳 <span className="text-bone">{pending}</span> 注
              {settled > 0 && (
                <>
                  {" · "}
                  已對帳 <span className="text-bone">{settled}</span> 注(
                  <span className="text-gold">{win} 中</span>、
                  <span className="text-loss/85">{lose} 沒中</span>)
                </>
              )}
            </p>
          </section>
        )}

        {/* ── 這桌的牌 ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12">
          {total > 0 ? (
            <ul className="border-b border-line/40 list-none pl-0 m-0">
              {calls.map((c, i) => {
                const res = resultLabel(c.result);
                return (
                  <li
                    key={`${c.handle}-${c.match}-${c.call}-${i}`}
                    className="flex items-start gap-3 py-3.5 border-t border-line/40"
                  >
                    <Avatar seed={c.handle} size={32} className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-bone text-sm font-medium">{c.handle}</span>
                        <span className="font-mono text-mute/50 text-[10px] tracking-[0.18em]">
                          {c.league}
                          {c.when ? ` · ${c.when}` : ""}
                        </span>
                      </div>
                      <p className="mt-1 text-mute text-[13px] leading-snug">
                        {c.match} · <span className="text-gold">{c.call}</span>
                      </p>
                      {!c.engineModels && c.engineNote && (
                        <p className="mt-1 text-mute/55 text-[11px] leading-relaxed">
                          {c.engineNote}
                        </p>
                      )}
                      {c.resultNote && (
                        <p className="mt-1 text-mute/75 text-[11px] leading-relaxed">
                          {c.resultNote}
                        </p>
                      )}
                    </div>
                    {/* R241:拿掉「引擎有模型/無模型」badge(對結果 0 差別=對用戶 0 意義 ·
                        Tim dogfood)· 只留結果(還沒對帳/中了/沒中)。 引擎不會算的盤,改由
                        左欄一句白話 engineNote 誠實註記。 */}
                    <div className="shrink-0 flex flex-col items-end">
                      <span
                        className={`font-mono text-[10px] tracking-[0.2em] tabular ${res.cls}`}
                      >
                        {res.text}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="border border-dashed border-gold/30 bg-slate/30 p-8 text-center">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                這桌還沒開
              </p>
              <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
                還沒有人賽前鎖手。 第一注鎖下去,這桌就會開始記帳 —— 贏輸都攤開。
              </p>
            </div>
          )}
        </section>

        {/* ── 收尾 · 米其林那一句 ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-20 border-t border-line/40 pt-10">
          <p className="text-mute text-base leading-relaxed">
            敢曬贏、也<span className="text-bone">敢曬輸</span> —— 這就是這桌跟「賣明牌」最不一樣的地方。
            連我們引擎不會算的賭法,他們押了,也一筆一筆幫他對到底。
          </p>
          <div className="mt-8 flex items-center gap-3 flex-wrap">
            <Link
              href="/pulse"
              className="inline-flex items-center gap-2 border border-gold/45 text-gold font-mono text-xs tracking-[0.2em] px-6 py-3 hover:border-gold hover:bg-gold/5 transition-colors"
            >
              看活動脈動 →
            </Link>
            <Link
              href="/track-record"
              className="inline-flex items-center gap-2 border border-line/60 text-mute font-mono text-xs tracking-[0.2em] px-6 py-3 hover:text-bone hover:border-bone/40 transition-colors"
            >
              看引擎自己的戰績 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
