import Link from "next/link";
import Avatar from "@/components/Avatar";
import { handleGlyph } from "@/lib/identity";
import type { LadderEntry } from "@/lib/ladder-server";

// ── ZONE 27 · 首頁海選天梯條 ───────────────────────────────────────────────
// R258 · Tim「首頁完全看不到天梯」。 13 站 IA 研究一致:排行榜不放首頁 hero,只放一個入口 →
//  獨立頁(Polymarket/Metaculus/Manifold/Substack/Strava/Chess… 全如此)。 這條是首頁那個安靜
//  入口,兩態:
//   · 榜亮了(≥3 人各 ≥10 場已結算 · getLadderBoard().show)→ 秀榜首一行(頭像 + handle +
//     比引擎準幾分)→ /ladder。
//   · 還沒亮(朋友才押 1-2 天 · 世界盃多押足球、足球準度天梯外另算)→ 不擺空的排名列表,擺一句
//     呼應 /ladder 官方空狀態「王座上只有機器」的誠實邀請 → /ladder。
//
// 🔴 紅線:不上空榜 —— 這條永遠不渲染排名「列表」;未亮時只有一句狀態陳述(王座未被認領是事實,
//   不是空的榜)· 名次只看 alpha(比引擎準幾分)非 PnL/連勝/粉絲數 · 不曝光單一用戶(未亮不顯任何
//   人 · 已亮才顯榜首,且榜已 ≥3 人)· 暗金、無紅綠、無 emoji、無「快來搶第一」催促(守誠實門檻、
//   非 near-miss 陷阱)。
export default function HomepageLadderStrip({
  lit,
  top,
}: {
  lit: boolean;
  top?: LadderEntry;
}) {
  const showEdge =
    lit && top != null && top.edgeVsEnginePts != null && top.edgeVsEnginePts > 0;

  return (
    <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-2 pb-2">
      <Link
        href="/ladder"
        aria-label={
          lit && top
            ? `海選天梯 · 王座暫由 ${top.handle} 守著 · 在 ${top.decided} 場已對帳 · 看完整天梯`
            : "海選天梯正在成形 · 王座上還只有機器 · 還沒有人在夠多場裡贏過引擎 · 看天梯怎麼爬"
        }
        className="block border border-gold/30 bg-gold/[0.04] hover:border-gold/50 hover:bg-gold/[0.06] transition-colors px-4 py-3 group"
      >
        <div className="flex items-center gap-3">
          {lit && top ? (
            <span className="inline-flex rounded-[30%] ring-2 ring-navy shrink-0">
              <Avatar
                seed={`#${top.authorCode}`}
                glyph={handleGlyph(top.handle)}
                size={26}
              />
            </span>
          ) : null}
          <p className="text-bone text-sm leading-snug min-w-0">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.3em]">
              海選天梯 ·{" "}
            </span>
            {lit && top ? (
              <>
                王座暫由 <span className="text-bone/90">{top.handle}</span> 守著
              </>
            ) : (
              <>王座上還只有機器</>
            )}
          </p>
          <span className="ml-auto shrink-0 font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em]">
            看天梯 →
          </span>
        </div>
        <p className="mt-1.5 font-mono text-mute/60 text-[10px] sm:text-[11px] tracking-[0.1em] truncate">
          {lit && top ? (
            showEdge ? (
              <>
                在 <span className="text-bone/80">{top.decided}</span> 場裡比引擎準{" "}
                <span className="text-gold/90">{top.edgeVsEnginePts}</span> 個百分點
              </>
            ) : (
              <>
                已在 <span className="text-bone/80">{top.decided}</span> 場公開對帳
              </>
            )
          ) : (
            <>還沒有人在夠多場裡贏過引擎 · 押滿 10 場、又贏過它,才坐得上去</>
          )}
        </p>
      </Link>
    </section>
  );
}
