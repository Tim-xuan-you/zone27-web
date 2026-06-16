import Link from "next/link";
import Avatar from "@/components/Avatar";
import { handleGlyph } from "@/lib/identity";
import type { LadderBoard as LadderBoardData } from "@/lib/ladder-server";

// ── ZONE 27 · 海選天梯榜(跨用戶 · 誰比機器準)──────────────────────────
// 只在合格用戶 ≥ 門檻時才由 /ladder 渲染(0 用戶不上空榜的閘門在 lib/ladder-server.ts)。
// 每列領頭的數字是「贏過引擎幾個百分點(alpha)」+ 樣本 —— 不是裸勝率排行(那是玩運彩虛榮榜)。
// 含輸照算(命中率 = proved/decided · diverged 進分母)· 名字連到 /u/[code] 公開含輸檔。
// 守暗金:無紅綠(贏引擎=金 · 輸引擎=loss 柔紅)· 純中文 · render 無 emoji。
// ─────────────────────────────────────────────────────

const TIER_ZH = ["", "新秀", "分析師", "操盤手", "神準手", "神諭"];

export default function LadderBoard({ board }: { board: LadderBoardData }) {
  if (!board.show || board.entries.length === 0) return null;

  return (
    <section aria-labelledby="ladder-board-heading" className="mb-10">
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <p
          id="ladder-board-heading"
          className="font-mono text-gold text-[10px] tracking-[0.4em]"
        >
          / 海選榜 · 誰比機器準
        </p>
        <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em] tabular">
          {board.qualifyingUsers} 人在榜 · 含輸
        </p>
      </div>

      <ul className="flex flex-col gap-2 list-none pl-0 m-0">
        {board.entries.map((e) => {
          const apex = e.tier === 5;
          return (
            <li key={e.authorCode}>
              <Link
                href={`/u/${e.authorCode}`}
                className={`flex items-center gap-3 p-3 sm:p-3.5 border transition-colors ${
                  apex
                    ? "border-gold/70 bg-gold/[0.07] glow-soft hover:border-gold"
                    : "border-line/60 bg-slate/30 hover:border-gold/40 hover:bg-slate/40"
                }`}
              >
                {/* 名次 */}
                <span
                  className={`font-mono tabular text-lg font-light w-7 shrink-0 text-center ${
                    apex ? "text-gold" : "text-mute/60"
                  }`}
                >
                  {e.rank}
                </span>

                {/* 幾何頭像(同 /u/[code] · seed 綁永久碼 → 同一個人同一張臉)·
                    付費支持者亮金環 = 身分標記,不是名次(名次只看上面那欄 alpha)。 */}
                <Avatar
                  seed={`#${e.authorCode}`}
                  glyph={handleGlyph(e.handle)}
                  size={30}
                  supporter={e.supporter}
                  className="shrink-0"
                />

                {/* 身分 + 階級 */}
                <span className="flex-1 min-w-0">
                  <span className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={`text-sm sm:text-base font-light tracking-tight truncate max-w-[10rem] ${
                        apex ? "text-gold" : "text-bone"
                      }`}
                    >
                      {e.handle}
                    </span>
                    <span
                      className={`font-mono text-[9px] tracking-[0.2em] px-1.5 py-0.5 border ${
                        apex
                          ? "border-gold/60 text-gold"
                          : "border-line/70 text-mute/70"
                      }`}
                    >
                      {TIER_ZH[e.tier] ?? "新秀"}
                    </span>
                    {e.monthBeatEngine && (
                      <span className="font-mono text-gold/70 text-[8px] tracking-[0.18em]">
                        本月仍贏引擎
                      </span>
                    )}
                  </span>
                  <span className="block font-mono text-mute/55 text-[9px] tracking-[0.15em] tabular mt-0.5">
                    命中 {e.accuracyPct}% · {e.decided} 場已對帳
                  </span>
                </span>

                {/* 領頭數字 = 贏過引擎幾分(alpha)· 不是裸勝率 */}
                <span className="shrink-0 text-right">
                  <span
                    className={`block font-mono tabular text-base sm:text-lg font-light leading-none ${
                      e.edgeVsEnginePts === null
                        ? "text-mute/50"
                        : e.edgeVsEnginePts > 0
                          ? "text-gold"
                          : e.edgeVsEnginePts < 0
                            ? "text-loss/80"
                            : "text-mute"
                    }`}
                  >
                    {e.edgeVsEnginePts === null
                      ? "—"
                      : `${e.edgeVsEnginePts > 0 ? "+" : ""}${e.edgeVsEnginePts}`}
                  </span>
                  <span className="block font-mono text-mute/45 text-[8px] tracking-[0.2em] mt-0.5">
                    vs 引擎
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="font-mono text-mute/50 text-[9px] tracking-[0.15em] leading-relaxed mt-3">
        ▸ 排名按「贏過引擎幾分」+ 樣本厚度,不是裸勝率。 含輸照算、平手不計、開賽後才下的不算。
        場數少、運氣占大 —— 爬到神準手以上,要在 ≥30 場裡真的贏過機器。
      </p>
    </section>
  );
}
