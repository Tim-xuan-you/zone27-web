import Link from "next/link";
import Avatar from "@/components/Avatar";
import { getTeamCrest } from "@/lib/identity";
import OpenPositionCard, { type OpenPosition } from "@/components/OpenPositionCard";

// ── ZONE 27 · 你的未結算押注 · adaptive(時刻 ↔ 投資組合)──────────────
// Tim 2026-06-05 dogfood:押了十幾場 → /member 被一疊大卡洗版、「全部都是字、本能想抗拒」。
// 診斷:1-2 注是一個「時刻」(大卡有戲)· 10+ 注是一個「投資組合」(要密清單一眼掃)。
// 原本只有時刻模式 → 一多就變一座牆。 交易終端(Robinhood/Polymarket portfolio)都是:
// 焦點用大卡、持倉用密清單。
//
// 解法:≤2 注 → 保留大卡(soul moment · 含群眾線)· ≥3 注 → 切密清單:
//   · 每列隊徽顏色領頭(解「全是字」· 球迷用顏色 0.1 秒秒認隊 · R197 自己的答案)
//   · 結算說明只說一次(不再每列重複 = 去噪)· 群眾線不打(省 N 次 client RPC · server 純渲染)
//   · 摘要 header「N 注在場上 · 進行中/今晚/等待」給一眼總覽。
// ─────────────────────────────────────────────────────

const RICH_MAX = 2; // ≤ 此數用大卡(時刻)· 以上切密清單(組合)

function StatusTag({ p }: { p: OpenPosition }) {
  if (p.phase === "today-live") {
    return (
      <span className="shrink-0 font-mono text-[9px] tracking-[0.22em] border border-gold text-gold px-1.5 py-0.5 shimmer">
        進行中
      </span>
    );
  }
  if (p.phase === "today-pregame") {
    return (
      <span className="shrink-0 font-mono text-[9px] tracking-[0.22em] border border-gold/50 text-gold px-1.5 py-0.5 tabular">
        今日 {p.startTime}
      </span>
    );
  }
  return (
    <span className="shrink-0 font-mono text-[9px] tracking-[0.22em] border border-mute/40 text-mute px-1.5 py-0.5 tabular">
      {p.dateLabel}
    </span>
  );
}

function CompactRow({ p }: { p: OpenPosition }) {
  const myTeam = p.myPick === "home" ? p.homeName : p.awayName;
  const crest = getTeamCrest(myTeam, p.myTeamEn, p.league);
  const withEngine = (p.myPick === "home") === p.engineHomePicked;
  return (
    <Link
      href={`/matches/${p.matchId}`}
      className="flex items-center gap-3 px-3 py-2.5 border-b border-line/40 last:border-b-0 hover:bg-gold/5 transition-colors group"
    >
      <Avatar seed={myTeam} glyph={crest?.glyph} color={crest?.color} size={24} />
      <span className="min-w-0 flex-1">
        <span className="block text-bone text-sm leading-snug truncate">
          你押 <span className="text-gold">{myTeam}</span>
        </span>
        <span className="block font-mono text-mute/55 text-[10px] tracking-[0.12em] truncate mt-0.5">
          {withEngine ? "引擎同邊" : "站引擎對面"}
          <span className="text-mute/35 mx-1.5">·</span>
          {p.homeName} vs {p.awayName}
        </span>
      </span>
      <StatusTag p={p} />
      <span className="shrink-0 font-mono text-gold/40 group-hover:text-gold text-xs transition-colors">
        →
      </span>
    </Link>
  );
}

export default function OpenPositionsPanel({
  positions,
}: {
  positions: OpenPosition[];
}) {
  if (positions.length === 0) return null;

  // ── 1-2 注:時刻模式 · 大卡(含群眾線)─────────────
  if (positions.length <= RICH_MAX) {
    return (
      <section className="mt-8">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          你的未結算押注
        </p>
        <div className="flex flex-col gap-3">
          {positions.map((p) => (
            <OpenPositionCard key={p.matchId} position={p} />
          ))}
        </div>
      </section>
    );
  }

  // ── 3+ 注:投資組合模式 · 密清單 ─────────────────
  const live = positions.filter((p) => p.phase === "today-live").length;
  const tonight = positions.filter((p) => p.phase === "today-pregame").length;
  const future = positions.filter((p) => p.phase === "future").length;
  const parts: string[] = [];
  if (live > 0) parts.push(`${live} 進行中`);
  if (tonight > 0) parts.push(`${tonight} 今日待開`);
  if (future > 0) parts.push(`${future} 等待`);

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          你的未結算押注
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] tabular">
          <span className="text-gold">{positions.length}</span> 注在場上
          {parts.length > 0 && (
            <span className="text-mute/50"> · {parts.join(" · ")}</span>
          )}
        </p>
      </div>
      <div className="border border-line/60 bg-slate/30">
        {positions.map((p) => (
          <CompactRow key={p.matchId} p={p} />
        ))}
      </div>
      {/* 結算說明只說一次(不再每列重複)*/}
      <p className="mt-2 font-mono text-mute/45 text-[10px] tracking-[0.16em] leading-relaxed">
        押了改不了 · 賽後自動對帳你的準度 · 點任一場看引擎/群眾即時盤
      </p>
    </section>
  );
}
