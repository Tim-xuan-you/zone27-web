import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import TennisBetStrip from "@/components/TennisBetStrip";
import { createPageMetadata } from "@/lib/page-og";
import { blendedRating } from "@/lib/tennis/engine";
import { ratingFromRank } from "@/lib/tennis/rating";
import {
  getTennisMatch,
  drawLine,
  bettable,
  TENNIS_DRAW,
  type TennisDrawPlayer,
} from "@/lib/tennis/matches";
import { initials } from "@/lib/tennis/players";

// ── ZONE 27 · /tennis/[matchId] · 單場完整分析(運彩場次)─────────────────────────
// 一場的完整引擎拆解:兩位球員 + 排名換算實力分 + 勝率怎麼來的 + 賽前鎖定押注。 純展示 +
// 一個 client 押注島。 不可開盤 / 進行中 / 傷退失真 → 誠實狀態。 絕不顯示盤口 / 賠率。
// ─────────────────────────────────────────────────────

export const revalidate = 3600;

export function generateStaticParams() {
  return TENNIS_DRAW.map((m) => ({ matchId: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matchId: string }>;
}): Promise<Metadata> {
  const { matchId } = await params;
  const m = getTennisMatch(matchId);
  if (!m) return { title: "找不到這場" };
  return createPageMetadata({
    title: `${m.a.zh} vs ${m.b.zh} · 引擎分析`,
    description: `${m.tournament} · ${m.a.zh} vs ${m.b.zh} —— ZONE 27 引擎用排名換算的實力分算出的勝率(不是盤口)。 賽前鎖死、賽後對帳。`,
    ogTitle: `${m.a.zh} vs ${m.b.zh} · ZONE 27 引擎`,
    ogDescription: `${m.tournament} · 引擎自己算的勝率 · 不是盤口`,
    path: `/tennis/${m.id}`,
  });
}

function rating(p: TennisDrawPlayer): number | null {
  if (p.rank == null) return null;
  // 詳情頁的種子分:純排名換算(同 drawLine 的 overall · grass 無 per-player 細分時退 overall)。
  return Math.round(blendedRating(ratingFromRank(p.rank), undefined));
}

function PlayerHead({ p, align }: { p: TennisDrawPlayer; align: "left" | "right" }) {
  const right = align === "right";
  const glyph = p.en && p.en !== "?" ? initials(p.en) : p.zh.slice(0, 1);
  return (
    <div className={`flex items-center gap-3 min-w-0 ${right ? "flex-row-reverse text-right" : ""}`}>
      <Avatar seed={p.en && p.en !== "?" ? p.en : p.zh} glyph={glyph} size={44} />
      <div className="min-w-0">
        <p className="text-bone text-xl sm:text-2xl font-light tracking-tight truncate">{p.zh}</p>
        {p.en && p.en !== "?" && (
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

export default async function TennisMatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const m = getTennisMatch(matchId);
  if (!m) notFound();

  const line = drawLine(m);
  const tie = line ? line.aWin === line.bWin : false;
  const aGold = !tie && line?.pick === "a";
  const bet = bettable(m);
  const ra = rating(m.a);
  const rb = rating(m.b);

  const SURFACE_LABEL: Record<string, string> = { grass: "草地", clay: "紅土", hard: "硬地" };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="tennis" />
      <SportTabs active="tennis" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* 麵包屑 */}
        <Link
          href="/tennis"
          className="font-mono text-mute/60 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
        >
          ← 網球看板
        </Link>

        {/* 賽事 + 時間 */}
        <div className="flex items-baseline gap-3 mt-6 mb-4 flex-wrap">
          <p className="font-mono text-gold/75 text-[10px] tracking-[0.35em]">{m.tournament}</p>
          <span className="font-mono text-mute/55 text-[9px] tracking-[0.2em]">
            {m.tour.toUpperCase()} · {SURFACE_LABEL[m.surface] ?? m.surface} · {m.time}
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

            {/* 怎麼算的(攤開 · 不黑箱) */}
            <div className="mt-5 bg-slate/30 border border-line/60 p-4 text-[13px] leading-relaxed text-mute">
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2">怎麼算的</p>
              <p>
                <span className="text-bone">{m.a.zh}</span> 世界排名 #{m.a.rank} → 實力分{" "}
                <span className="font-mono text-gold tabular">{ra}</span> ·{" "}
                <span className="text-bone">{m.b.zh}</span> 世界排名 #{m.b.rank} → 實力分{" "}
                <span className="font-mono text-gold tabular">{rb}</span>。 差{" "}
                <span className="font-mono text-bone tabular">{Math.abs(ra - rb)}</span> 分,
                用標準 Elo 邏輯函數換成勝率(每 400 分 ≈ 勝率 10 倍)。 純數學、攤得開、可重算。
              </p>
              <p className="mt-2 font-mono text-mute/55 text-[11px] leading-relaxed">
                ⚠️ 實力分由現時世界排名換算(估計值 · 非官方數據)· 引擎只看排名:沒看臨場傷停 /
                狀態 / 場地細節 —— 那是你的判斷比引擎值錢的地方。
              </p>
            </div>

            {/* 賽前鎖定押注(有明確未來開賽時戳才開放) */}
            {bet && (
              <div className="mt-5">
                <TennisBetStrip
                  matchId={m.id}
                  startISO={bet}
                  aLabel={m.a.zh}
                  bLabel={m.b.zh}
                  returnTo={`/tennis/${m.id}`}
                />
              </div>
            )}
          </section>
        ) : (
          <p className="mt-6 font-mono text-mute/65 text-sm leading-relaxed border-l-2 border-line/60 pl-4">
            {m.note ?? "覆蓋建置中 · 這場我們還沒把握誠實開盤。 賭場什麼都敢開,我們只開算得出的。"}
          </p>
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
