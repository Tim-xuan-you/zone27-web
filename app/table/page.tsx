import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { getTableCalls, type CallResult } from "@/lib/table-picks";

export const metadata: Metadata = {
  title: "今晚這桌 · 誠實收據 · ZONE 27",
  description:
    "真正的賭徒不只賭誰贏 —— 角球、總分、讓分、兩隊都得分。 有些盤我們的引擎根本沒有模型。 我們不裝懂:沒模型的就老實標『只負責對帳』,照樣幫你賽前鎖死、賽後攤開,贏輸都掛你名下。",
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
      return { text: "命中", cls: "text-gold" };
    case "lose":
      return { text: "落空", cls: "text-loss/85" };
    case "push":
      return { text: "退注", cls: "text-mute/60" };
    case "void":
      return { text: "取消", cls: "text-mute/60" };
    default:
      return { text: "待對帳", cls: "text-mute/55" };
  }
}

export default function TablePage() {
  const { calls, total, pending, noModel } = getTableCalls();

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
            這桌<span className="text-gold">鎖了什麼</span>
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-5" aria-hidden="true" />
          <p className="text-mute text-base leading-relaxed">
            真正的賭徒不只賭誰贏 —— 角球、總分、讓分、兩隊都得分。 而有些盤,我們的引擎
            <span className="text-bone">根本沒有模型</span>。 我們不裝懂:沒模型的,就老實標
            「只負責對帳」,然後照樣幫你<span className="text-bone">賽前鎖死、賽後攤開</span>,
            贏輸都掛你名下、刪不掉。 賣明牌的對什麼都裝有把握 —— 我們敢說哪些不懂。
          </p>
        </section>

        {/* ── 計數條 ── */}
        {total > 0 && (
          <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-2">
            <p className="font-mono text-mute/60 text-[11px] tracking-[0.2em] tabular">
              <span className="text-bone">{total}</span> 注在桌上
              {" · "}
              <span className="text-bone">{pending}</span> 待對帳
              {noModel > 0 && (
                <>
                  {" · "}
                  <span className="text-bone">{noModel}</span> 注引擎沒模型(照樣對帳)
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
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {/* 引擎欄:有模型 vs 無模型(誠實的沉默)· 🔴 不捏造機率數字 */}
                      {c.engineModels ? (
                        <span className="font-mono text-[9px] tracking-[0.18em] px-1.5 py-0.5 border border-gold/40 text-gold/85 whitespace-nowrap">
                          引擎有模型
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] tracking-[0.18em] px-1.5 py-0.5 border border-mute/30 text-mute/65 whitespace-nowrap">
                          無模型 · 只對帳
                        </span>
                      )}
                      <span
                        className={`font-mono text-[9px] tracking-[0.2em] tabular ${res.cls}`}
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
            引擎只在<span className="text-bone">有把握時</span>開口。 沒把握的,我們閉嘴 ——
            但<span className="text-bone">照樣幫你對帳</span>,贏輸都掛你名下、刪不掉。
          </p>
          <p className="mt-5 text-mute/70 text-[13px] leading-relaxed">
            這就是米其林的權威來源:不是給每家店星星,而是
            <span className="text-bone">敢給零星</span>。 敢說「這盤我不懂」的人,比對什麼都裝懂的,
            可信一百倍。
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
