import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WalletPanel from "@/components/WalletPanel";
import { getSession } from "@/lib/supabase/server";
import { aggregatePredictionStats } from "@/lib/predictions";
import { getMyPredictionsMap } from "@/lib/predictions-server";
import { getTodayMatches, matches as allMatches } from "@/lib/matches";
import { readTier, isPaid, creatorTakePct } from "@/lib/tier";

export const metadata: Metadata = {
  title: "你的儀表板",
  description: "你的準度 · 你 vs 引擎 · 今晚可以押的賽事。終身免費。",
};

// ── ZONE 27 · /member · 會員自己的儀表板 ─────────────────
// R183 NUCLEAR · Tim canary fire(mobile screenshot):「亂七八糟 · 划不到底 ·
// 寫一堆沒必要的東西 · 這是會員自己的介面 · 極簡再極簡 · go Polymarket go」。
//
// 砍掉所有行銷/哲學/說明文(PaidTierLockedGrid 推銷、Apple/Spotify 對照、
// localStorage 清單、創辦人簽名、5 大解鎖格、MemberHomeHero、DailyBrief、
// 招募 essay)。會員登入後只想看三樣:
//   1. 我準不準(你 vs 引擎 · THE number)
//   2. 今晚可以押什麼(一鍵進場)
//   3. 登出
// 招募 bar(StickyFoundersCTA)+ 創始編號 strip(ScarcityStrip)已在
// /member 隱藏 — 不對已是會員的人推入會。
// ─────────────────────────────────────────────────────

export default async function MemberPage() {
  const session = await getSession();

  // 未登入 → 一頁式登入邀請(不再是長預覽)
  if (!session) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Nav active="member" />
        <main id="main" className="flex-1 flex items-center">
          <section className="mx-auto max-w-md w-full px-6 sm:px-10 py-24 text-center">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
              / 會員儀表板
            </p>
            <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
              登入看<span className="text-gold">你的準度</span>
            </h1>
            <p className="mt-5 text-mute leading-relaxed">
              你押過的場、你跟引擎誰準,登入後都在這裡。終身免費。
            </p>
            <Link
              href="/login?next=/member"
              className="mt-7 inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              登入 / 註冊 →
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const email = session.user.email ?? "";
  const emailName = email.split("@")[0] || "會員";
  const tier = readTier(
    (session.user.user_metadata ?? null) as Record<string, unknown> | null,
  );
  const tierZh =
    tier === "founder" ? "創始會員" : tier === "black" ? "BLACK CARD 會員" : "FREE 會員";

  const predictionsMap = await getMyPredictionsMap();
  const stats = aggregatePredictionStats(
    predictionsMap,
    allMatches.map((m) => ({ id: m.id, finalWinner: m.finalResult?.winner ?? null }))
  );

  const tonight = getTodayMatches().filter((m) => !m.finalResult);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-10 pb-24">
        {/* 1 · 身分列 · 一行 ────────────────────────── */}
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <p className="font-mono text-mute text-[11px] tracking-[0.2em]">
            <span className="text-gold">{emailName}</span> · {tierZh}
          </p>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="font-mono text-mute/70 hover:text-loss text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
            >
              登出
            </button>
          </form>
        </div>

        {/* 2 · 你的準度 · THE number ────────────────── */}
        <section className="mt-8 bg-slate/40 border border-gold/30 p-6 sm:p-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            你的準度 · 你 vs 引擎
          </p>
          {stats.total > 0 ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-gold text-6xl sm:text-7xl font-light tracking-tight tabular">
                  {stats.accuracy ?? "—"}
                  {stats.accuracy !== null && (
                    <span className="text-2xl opacity-60 ml-1">%</span>
                  )}
                </span>
              </div>
              <p className="mt-4 text-bone text-base leading-relaxed">
                押了 <span className="font-mono text-gold tabular">{stats.total}</span> 場 ·{" "}
                <span className="font-mono text-gold tabular">✓{stats.proved}</span> 中 ·{" "}
                <span className="font-mono text-loss/85 tabular">✕{stats.diverged}</span> 沒中
                {stats.push > 0 && (
                  <>
                    {" "}· <span className="font-mono text-mute tabular">={stats.push}</span> 平
                  </>
                )}
                {stats.pending > 0 && (
                  <span className="text-mute/70 text-sm"> · {stats.pending} 場待開</span>
                )}
              </p>
              {/* 準度接天梯進度 · 把孤兒數字接上「排名感」(UX M2)· 門檻 10 場同 /ladder */}
              <p className="mt-2 font-mono text-mute/60 text-[10px] tracking-[0.2em] leading-relaxed">
                每場賽後自動對照引擎 · 押了刪不掉。{" "}
                {stats.total >= 10 ? (
                  <>
                    你已達上天梯門檻 ·{" "}
                    <Link href="/ladder" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
                      看你排第幾 →
                    </Link>
                  </>
                ) : (
                  <>
                    再押 <span className="text-bone tabular">{10 - stats.total}</span> 場 · 你就能上天梯排名 ·{" "}
                    <Link href="/ladder" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
                      天梯怎麼爬 →
                    </Link>
                  </>
                )}
              </p>
            </>
          ) : (
            <>
              <p className="text-bone text-lg leading-relaxed">
                還沒押任何一場。
              </p>
              <p className="mt-1 text-mute text-sm leading-relaxed">
                押一邊,賽後自動掛準 / 不準,你的準度從這一場開始累積。
              </p>
              <Link
                href="/matches"
                className="mt-5 inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                去押第一注 →
              </Link>
            </>
          )}
        </section>

        {/* ★ 升級入口 · 免費會員專屬 · 賺錢的路要看得見(Apple:付費路徑永遠不藏)*/}
        {!isPaid(tier) && (
          <Link
            href="/membership"
            className="mt-6 block border border-gold/50 bg-gold/5 glow-soft p-5 sm:p-6 hover:bg-gold/10 hover:border-gold transition-colors group"
          >
            <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2">
              升級 · 開始賣分析賺錢
            </p>
            <p className="text-bone text-lg sm:text-xl font-light leading-snug mb-3">
              解鎖<span className="text-gold">標價賣你的分析</span> · 賣出你拿 90–95%。
            </p>
            <p className="font-mono text-mute text-[12px] tracking-[0.12em] leading-relaxed mb-4">
              BLACK CARD <span className="text-bone tabular">NT$ 500 / 31 天</span> · 你拿 90%
              <br />
              創始會員 <span className="text-bone tabular">NT$ 2,700 / 365 天</span> · 你拿 95%（全站最低抽成）
            </p>
            <span className="inline-flex items-center gap-2 font-mono text-navy bg-gold px-5 py-2.5 text-xs tracking-[0.25em] group-hover:bg-gold-soft transition-colors">
              看方案並升級 →
            </span>
          </Link>
        )}

        {/* 點數錢包 · 儲值 → 買別人的付費分析(0009)· 跟「升級賣分析」是兩回事 */}
        <WalletPanel />

        {/* 3 · 今晚可以押 ───────────────────────────── */}
        <section className="mt-6">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
            {tonight.length > 0 ? "今晚可以押" : "今天賽事"}
          </p>
          {tonight.length > 0 ? (
            <div className="border border-line/60 bg-slate/30">
              {tonight.map((m, i) => {
                const homeFav = m.home.winRate >= m.away.winRate;
                return (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-gold/5 transition-colors ${
                      i === tonight.length - 1 ? "" : "border-b border-line/40"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-bone text-sm sm:text-base font-light leading-snug truncate">
                        <span className={homeFav ? "text-gold" : ""}>{m.home.name}</span>
                        <span className="text-mute/60 mx-1.5 text-xs">vs</span>
                        <span className={!homeFav ? "text-gold" : ""}>{m.away.name}</span>
                      </p>
                      <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] mt-1 tabular">
                        {m.startTime} · 引擎看好 {homeFav ? m.home.name : m.away.name}{" "}
                        {Math.max(m.home.winRate, m.away.winRate)}%
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-gold/70 text-[10px] tracking-[0.3em]">
                      押 →
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border border-line/60 bg-slate/30 p-5">
              <p className="text-mute text-sm leading-relaxed mb-4">
                今天沒排 CPBL 賽事。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/track-record"
                  className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                >
                  看引擎戰績 →
                </Link>
                <Link
                  href="/lab/custom"
                  className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                >
                  自己跑模擬 →
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* 4 · 付費會員 → 你已解鎖賣分析 · 直接去發文(免費會員看上面升級卡)*/}
        {isPaid(tier) && (
          <p className="mt-10 text-center font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
            你已解鎖賣分析 · 賣出你拿 {creatorTakePct(tier)}%{" "}
            <Link
              href={tonight.length > 0 ? `/matches/${tonight[0].id}#say` : "/matches"}
              className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
            >
              去發一篇 →
            </Link>
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
