import SoccerBetStrip from "@/components/SoccerBetStrip";
import MatchSegment from "@/components/MatchSegment";
import { getMatchSegment } from "@/lib/match-segment";
import type { AdHocMarket } from "@/lib/markets";

// ── ZONE 27 · 群眾預測市場卡(R239 · /markets)──────────────────────────────────
// 引擎沒覆蓋的任一場 —— 所有登入會員都能賽前鎖一手 + 看群眾共識 + 賽後對帳。
// 🔴 卡上 0 盤口 / 0 莊家賠率(台灣運彩只是「有哪些場」的目錄)· 明寫「無引擎線 · 群眾盤」=
//    跟引擎盤誠實區隔。 押注/共識/「誰鎖了+理由」全 reuse(SoccerBetStrip + MatchSegment ·
//    match_id-keyed · 0 migration)。 賽後 result 由 lib/markets.ts 帶入(Tim relays)。
// 純展示 · async server component(自己撈 segment)· SoccerBetStrip 是 client 島。
// ─────────────────────────────────────────────────────

function fmtKickoff(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  // 台北 = 固定 UTC+8 · 手動格式化(server render · 與站內 fmtTPE 一致)。
  const d = new Date(t + 8 * 60 * 60 * 1000);
  const mo = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${mo}/${day} ${hh}:${mm}`;
}

export default async function MarketCard({ market }: { market: AdHocMarket }) {
  const lockers = await getMatchSegment(market.id);
  const settled = market.result === "home" || market.result === "away" || market.result === "draw";
  const resultLabel = settled
    ? market.result === "home"
      ? `${market.home} 勝`
      : market.result === "away"
        ? `${market.away} 勝`
        : "和局"
    : null;

  return (
    <div id={`m-${market.id}`} className="scroll-mt-20">
      <div className="border border-line/60 bg-slate/30 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-mono text-gold/80 text-[9px] tracking-[0.3em]">
          {market.sport} · {market.league}
        </p>
        <span className="font-mono text-mute/55 text-[9px] tracking-[0.25em] tabular">
          {settled ? "已結束" : `${fmtKickoff(market.kickoffISO)} 開賽`}
        </span>
      </div>

      <p className="text-bone text-base sm:text-lg font-light tracking-tight leading-snug">
        {market.home}
        <span className="text-mute/55 mx-2 text-sm">vs</span>
        {market.away}
      </p>

      {/* 🔴 跟引擎盤誠實區隔:引擎沒覆蓋這場 → 沒有引擎機率 · 也絕不秀盤口。 */}
      <p className="mt-1 font-mono text-mute/45 text-[9px] tracking-[0.18em]">
        無引擎線 · 純群眾盤 · 不秀盤口
      </p>

      {settled ? (
        <p className="mt-3 font-mono text-[11px] tracking-[0.18em]">
          <span className="text-mute/70">賽果 · </span>
          <span className="text-gold">{resultLabel}</span>
          <span className="text-mute/55"> · 對照你鎖的那手</span>
        </p>
      ) : (
        // 押注 + 群眾共識 + 留一句為什麼(全 reuse · match_id-keyed · locked=false → 不掛收據)。
        <SoccerBetStrip
          matchId={market.id}
          dateISO={market.kickoffISO}
          homeLabel={market.home}
          awayLabel={market.away}
          locked={false}
          returnTo="/markets"
        />
      )}
      </div>

      {/* 誰賽前鎖了這場 + 理由(= 帶帳本的「討論」· 非匿名嘴砲)· 賽後標誰押對。 沒人鎖 → 不顯示。
          MatchSegment 自帶 section 排版 → 放在卡片邊框「下方」(不雙重內距)· 視覺上仍緊貼這場。 */}
      <MatchSegment
        lockers={lockers}
        homeName={market.home}
        awayName={market.away}
        winner={settled ? market.result : null}
      />
    </div>
  );
}
