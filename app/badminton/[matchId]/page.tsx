import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import BadmintonBetStrip from "@/components/BadmintonBetStrip";
import { createPageMetadata } from "@/lib/page-og";
import { ratingFromRank } from "@/lib/badminton/rating";
import {
  getBadmintonMatch,
  drawLine,
  bettable,
  BADMINTON_DRAW,
  type BadmintonDrawPlayer,
} from "@/lib/badminton/matches";

// ── ZONE 27 · /badminton/[matchId] · 單場完整分析(運彩場次)─────────────────────────
// 一場的完整引擎拆解:兩位球員 + BWF 排名換算實力分 + 勝率怎麼來的 + 賽前鎖定押注。 純展示 +
// 一個 client 押注島。 不可開盤(認不出)/ 進行中 → 誠實狀態。 絕不顯示盤口 / 賠率。 鏡 /tennis/[id]。
// ─────────────────────────────────────────────────────

export const revalidate = 3600;

export function generateStaticParams() {
  return BADMINTON_DRAW.map((m) => ({ matchId: m.id }));
}

function glyph(p: BadmintonDrawPlayer): string {
  return p.en && p.en !== "?" ? p.en.slice(0, 1).toUpperCase() : p.zh.slice(0, 1);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matchId: string }>;
}): Promise<Metadata> {
  const { matchId } = await params;
  const m = getBadmintonMatch(matchId);
  if (!m) return { title: "找不到這場" };
  return createPageMetadata({
    title: `${m.a.zh} vs ${m.b.zh} · 引擎分析`,
    description: `${m.tournament} · ${m.a.zh} vs ${m.b.zh} —— ZONE 27 引擎用 BWF 排名換算的實力分算出的勝率(不是盤口)。 賽前鎖死、賽後對帳。`,
    ogTitle: `${m.a.zh} vs ${m.b.zh} · ZONE 27 引擎`,
    ogDescription: `${m.tournament} · 引擎自己算的勝率 · 不是盤口`,
    path: `/badminton/${m.id}`,
  });
}

function PlayerHead({ p, align }: { p: BadmintonDrawPlayer; align: "left" | "right" }) {
  const right = align === "right";
  const known = !!p.en && p.en !== "?";
  return (
    <div className={`flex items-center gap-3 min-w-0 ${right ? "flex-row-reverse text-right" : ""}`}>
      <Avatar seed={known ? p.en : p.zh} glyph={glyph(p)} size={44} />
      <div className="min-w-0">
        <p className="text-bone text-xl sm:text-2xl font-light tracking-tight truncate">{p.zh}</p>
        {known && (
          <p className="font-mono text-mute/55 text-[10px] tracking-[0.1em] truncate">{p.en}</p>
        )}
        {p.rank != null && (
          <p className="font-mono text-gold/60 text-[10px] tracking-[0.15em] tabular mt-0.5">
            世界排名 #{p.rank}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function BadmintonMatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const m = getBadmintonMatch(matchId);
  if (!m) notFound();

  const line = drawLine(m);
  const tie = line ? line.aWin === line.bWin : false;
  const aGold = !tie && line?.pick === "a";
  const bet = bettable(m);
  const ra = m.a.rank != null ? ratingFromRank(m.a.rank) : null;
  const rb = m.b.rank != null ? ratingFromRank(m.b.rank) : null;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="badminton" />
      <SportTabs active="badminton" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* 麵包屑 */}
        <Link
          href="/badminton"
          className="font-mono text-mute/60 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
        >
          ← 羽球看板
        </Link>

        {/* 賽事 + 時間 */}
        <div className="flex items-baseline gap-3 mt-6 mb-4 flex-wrap">
          <p className="font-mono text-gold/75 text-[10px] tracking-[0.35em]">{m.tournament}</p>
          <span className="font-mono text-mute/55 text-[9px] tracking-[0.2em]">
            {m.tour === "ws" ? "女單" : "男單"} · {m.time}
          </span>
        </div>

        {/* 兩位球員 */}
        <div className="flex items-center justify-between gap-3 bg-slate/40 border border-line/60 p-5 sm:p-6">
          <PlayerHead p={m.a} align="left" />
          <span className="font-mono text-mute/40 text-xs shrink-0">vs</span>
          <PlayerHead p={m.b} align="right" />
        </div>

        {/* 引擎開盤 or 誠實狀態 */}
        {m.live ? (
          <p className="mt-6 font-mono text-mute/70 text-sm leading-relaxed border-l-2 border-line/60 pl-4">
            進行中 · 引擎只做<span className="text-bone">賽前</span>,不追 live。
          </p>
        ) : line && ra != null && rb != null ? (
          <section className="mt-6">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎開盤</p>
            <div className="flex items-baseline justify-between mb-2 font-mono tabular">
              <span className={`text-3xl font-light ${aGold && !tie ? "text-gold" : "text-mute"}`}>
                {line.aWin}
                <span className="text-sm opacity-60">%</span>
              </span>
              <span className="font-mono text-mute/40 text-[10px]">勝率</span>
              <span className={`text-3xl font-light ${!aGold && !tie ? "text-gold" : "text-mute"}`}>
                {line.bWin}
                <span className="text-sm opacity-60">%</span>
              </span>
            </div>
            <div className="flex h-2.5 w-full overflow-hidden rounded-[2px] bg-line/30" aria-hidden="true">
              <div className={aGold && !tie ? "bg-gold/85" : "bg-bone/25"} style={{ width: `${line.aWin}%` }} />
              <div className={!aGold && !tie ? "bg-gold/85" : "bg-bone/25"} style={{ width: `${line.bWin}%` }} />
            </div>
            <p className="mt-3 text-mute text-[13px] leading-relaxed">
              {tie ? (
                <>引擎算下來<span className="text-bone">勢均力敵</span> —— 這種場它自己也拿不準,你的判斷最值錢。</>
              ) : (
                <>
                  引擎看好 <span className="text-gold">{aGold ? m.a.zh : m.b.zh}</span>。
                  這不是盤口,是<span className="text-bone">排名換算的實力分</span>跑出來的機率。
                </>
              )}
            </p>

            {/* 怎麼算的(這場的真實拆解 · 攤開 · 不黑箱)*/}
            <div className="mt-5 bg-slate/30 border border-line/60 p-4 text-[13px] leading-relaxed text-mute">
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2">這場怎麼算的</p>
              <p>
                <span className="text-bone">{m.a.zh}</span> 世界排名 #{m.a.rank} → 實力分{" "}
                <span className="font-mono text-gold tabular">{ra}</span> ·{" "}
                <span className="text-bone">{m.b.zh}</span> 世界排名 #{m.b.rank} → 實力分{" "}
                <span className="font-mono text-gold tabular">{rb}</span>。 差{" "}
                <span className="font-mono text-bone tabular">{Math.abs(ra - rb)}</span> 分,
                用標準 Elo 換成勝率(羽球室內無場地差 → 一人一個實力分)。
              </p>
              <p className="mt-2 font-mono text-mute/55 text-[11px] leading-relaxed">
                ⚠️ 實力分由現時 BWF 世界排名換算(估計值 · 非官方數據)· 引擎只看排名:沒看臨場傷停 /
                狀態 —— 那是你的判斷比引擎值錢的地方。 羽球沒有「神準」,全球最強賽前模型也才六成出頭。
              </p>
            </div>
          </section>
        ) : (
          <p className="mt-6 font-mono text-mute/65 text-sm leading-relaxed border-l-2 border-line/60 pl-4">
            {m.note ?? "覆蓋建置中 · 這場我們還沒把握誠實開盤。 賭場什麼都敢開,我們只開算得出的。"}
          </p>
        )}

        {/* 賽前鎖定押注 · 🔴 引擎開不開得出線都能押(Tim 鐵律:能上架就能押)· 移到狀態判斷之外
            → 認不出的場(無引擎線)照樣讓玩家點選押注。 已結算 / 無開賽時戳 → bettable 回 null 自動隱藏。 */}
        {bet && (
          <div className="mt-6">
            <BadmintonBetStrip
              matchId={m.id}
              startISO={bet}
              aLabel={m.a.zh}
              bLabel={m.b.zh}
              returnTo={`/badminton/${m.id}`}
            />
          </div>
        )}

        {/* 校準入口 */}
        <div className="mt-8 pt-6 border-t border-line/50">
          <Link
            href="/calibration"
            className="font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
          >
            校準是什麼 · 喊 70% 真的中 70% 嗎 →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
