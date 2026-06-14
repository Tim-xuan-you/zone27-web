import Link from "next/link";
import Avatar from "@/components/Avatar";
import { handleGlyph } from "@/lib/identity";
import type { LeagueStandings, LeagueStanding } from "@/lib/leagues";

// ── ZONE 27 · 私人聯盟天梯(盟內 · 棒球 CPBL+MLB · 重用 /ladder 口徑)──────────────
// 每列領頭數字 = 贏過引擎幾個百分點(alpha · 金/柔紅/灰)· 不是裸勝率/連勝。 含輸照算。
// 自己那列高亮(掛「你」)· 名字連 /u/[code] 公開含輸檔。 未滿 10 場 → 下方「暫不評」(誠實)。
// 守暗金:無紅綠(贏引擎=金 · 輸引擎=loss 柔紅)· 純中文 · 0 emoji。
// ─────────────────────────────────────────────────────

function edgeText(e: number | null): string {
  if (e === null) return "—";
  return `${e > 0 ? "+" : ""}${e}`;
}
function edgeColor(e: number | null): string {
  if (e === null) return "text-mute/50";
  if (e > 0) return "text-gold";
  if (e < 0) return "text-loss/80";
  return "text-mute";
}

function Row({ s }: { s: LeagueStanding }) {
  const lead = s.rank === 1;
  // 自己高亮優先(你來看就是找自己)· 否則第一名金框 · 其餘暗格。
  const frame = s.isYou
    ? "border-gold/70 bg-gold/[0.07] hover:border-gold"
    : lead
      ? "border-gold/55 bg-gold/[0.04] hover:border-gold/70"
      : "border-line/60 bg-slate/30 hover:border-gold/40 hover:bg-slate/40";
  return (
    <li>
      <Link
        href={`/u/${s.authorCode}`}
        className={`flex items-center gap-3 p-3 sm:p-3.5 border transition-colors ${frame}`}
      >
        <span
          className={`font-mono tabular text-lg font-light w-7 shrink-0 text-center ${
            lead ? "text-gold" : "text-mute/60"
          }`}
        >
          {s.rank ?? "·"}
        </span>
        <Avatar
          seed={`#${s.authorCode}`}
          glyph={handleGlyph(s.handle)}
          size={30}
          supporter={s.supporter}
          className="shrink-0"
        />
        <span className="flex-1 min-w-0">
          <span className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`text-sm sm:text-base font-light tracking-tight truncate max-w-[10rem] ${
                s.isYou ? "text-gold" : "text-bone"
              }`}
            >
              {s.handle}
            </span>
            {s.isYou && (
              <span className="font-mono text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/60 text-gold">
                你
              </span>
            )}
            {s.monthBeatEngine && (
              <span className="font-mono text-gold/70 text-[8px] tracking-[0.18em]">
                本月仍贏引擎
              </span>
            )}
          </span>
          <span className="block font-mono text-mute/55 text-[9px] tracking-[0.15em] tabular mt-0.5">
            {s.accuracyPct !== null
              ? `命中 ${s.accuracyPct}% · ${s.decided} 場已對帳`
              : `${s.decided} 場已對帳`}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span
            className={`block font-mono tabular text-base sm:text-lg font-light leading-none ${edgeColor(
              s.edgeVsEnginePts,
            )}`}
          >
            {edgeText(s.edgeVsEnginePts)}
          </span>
          <span className="block font-mono text-mute/45 text-[8px] tracking-[0.2em] mt-0.5">
            vs 引擎
          </span>
        </span>
      </Link>
    </li>
  );
}

function ProvisionalRow({ s }: { s: LeagueStanding }) {
  return (
    <li>
      <Link
        href={`/u/${s.authorCode}`}
        className={`flex items-center gap-3 px-3 py-2.5 border transition-colors ${
          s.isYou
            ? "border-gold/50 bg-gold/[0.05]"
            : "border-line/50 bg-slate/20 hover:border-gold/30"
        }`}
      >
        <span className="font-mono text-mute/40 text-sm w-7 shrink-0 text-center">·</span>
        <Avatar
          seed={`#${s.authorCode}`}
          glyph={handleGlyph(s.handle)}
          size={26}
          className="shrink-0"
        />
        <span className="flex-1 min-w-0 flex items-baseline gap-2 flex-wrap">
          <span
            className={`text-sm font-light tracking-tight truncate max-w-[9rem] ${
              s.isYou ? "text-gold" : "text-bone/85"
            }`}
          >
            {s.handle}
          </span>
          {s.isYou && (
            <span className="font-mono text-[8px] tracking-[0.2em] px-1 py-px border border-gold/50 text-gold">
              你
            </span>
          )}
        </span>
        <span className="shrink-0 font-mono text-mute/55 text-[10px] tracking-[0.12em] tabular">
          {s.decided > 0 ? `${s.decided}/10 場` : "還沒押"}
        </span>
      </Link>
    </li>
  );
}

export default function LeagueStandingsView({
  standings,
}: {
  standings: LeagueStandings;
}) {
  const { ranked, provisional } = standings;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          / 本季天梯 · 棒球(CPBL + MLB)
        </p>
        <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em] tabular">
          {standings.memberCount} 人 · 含輸
        </p>
      </div>

      {ranked.length > 0 ? (
        <ul className="flex flex-col gap-2 list-none pl-0 m-0">
          {ranked.map((s) => (
            <Row key={s.authorCode} s={s} />
          ))}
        </ul>
      ) : (
        <div className="border border-line/60 bg-slate/30 p-5 text-center">
          <p className="text-bone text-sm font-light leading-relaxed">
            還沒有人押滿 <span className="text-gold tabular">10</span> 場分勝負。
          </p>
          <p className="mt-1.5 text-mute/80 text-[12px] leading-relaxed">
            排名要夠樣本才算數(幾場的輸贏是運氣)· 先去押幾場,榜就長出來了。
          </p>
        </div>
      )}

      {provisional.length > 0 && (
        <div className="mt-5 pt-4 border-t border-line/40">
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-2.5">
            暫不評 · 押滿 10 場分勝負才排名
          </p>
          <ul className="flex flex-col gap-1.5 list-none pl-0 m-0">
            {provisional.map((s) => (
              <ProvisionalRow key={s.authorCode} s={s} />
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 font-mono text-mute/50 text-[10px] tracking-[0.15em] leading-relaxed">
        排名按「贏過引擎的幅度 + 樣本厚度」· 不是輸贏多寡 / 連勝 / 盈虧。 連輸的都算進去、刪不掉。
        足球三選一基準不同 · 之後當獨立賽道(不混進這個棒球榜)。
      </p>
    </div>
  );
}
