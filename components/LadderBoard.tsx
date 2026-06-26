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

// 米其林式月度升降標記(本月 vs 上月底)· 幾何三角非 emoji · 升=金、降=loss 柔紅、新上榜=金框。
// 持平不顯示(不囉嗦)。 同 /ladder 文案:位置會升也會降,星不是永久的。
function MoveMark({ move }: { move: "up" | "down" | "same" | "new" }) {
  if (move === "same") return null;
  if (move === "new") {
    return (
      <span className="font-mono text-gold/80 text-[8px] tracking-[0.18em] px-1 border border-gold/40">
        新上榜
      </span>
    );
  }
  const up = move === "up";
  return (
    <span
      className={`font-mono text-[8px] tracking-[0.18em] ${up ? "text-gold" : "text-loss/80"}`}
      title={up ? "本月升階" : "本月掉階"}
    >
      {up ? "▲ 本月升" : "▼ 本月降"}
    </span>
  );
}

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
          {board.qualifyingUsers > 0
            ? `${board.qualifyingUsers} 人在榜 · 含輸`
            : "機器在榜上 · 等你爬上來"}
        </p>
      </div>

      <ul className="flex flex-col gap-2 list-none pl-0 m-0">
        {board.entries.map((e) => {
          const apex = e.tier === 5;
          const eng = e.isEngine === true;
          const rowClass = `flex items-center gap-3 p-3 sm:p-3.5 border transition-colors ${
            eng
              ? "border-dashed border-gold/45 bg-navy/40"
              : apex
                ? "border-gold/70 bg-gold/[0.07] glow-soft hover:border-gold"
                : "border-line/60 bg-slate/30 hover:border-gold/40 hover:bg-slate/40"
          }`;
          const inner = (
            <>
              {/* 名次 */}
              <span
                className={`font-mono tabular text-lg font-light w-7 shrink-0 text-center ${
                  apex ? "text-gold" : eng ? "text-gold/70" : "text-mute/60"
                }`}
              >
                {e.rank}
              </span>

              {/* 頭像 · 引擎用方塊「尺」標記(非人臉)· 用戶用幾何頭像(付費亮金環) */}
              {eng ? (
                <span
                  aria-hidden="true"
                  className="shrink-0 grid place-items-center w-[30px] h-[30px] border border-gold/40 font-mono text-gold/80 text-[10px]"
                >
                  尺
                </span>
              ) : (
                <Avatar
                  seed={`#${e.authorCode}`}
                  glyph={handleGlyph(e.handle)}
                  size={30}
                  supporter={e.supporter}
                  className="shrink-0"
                />
              )}

              {/* 身分 + 階級 */}
              <span className="flex-1 min-w-0">
                <span className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className={`text-sm sm:text-base font-light tracking-tight truncate max-w-[10rem] ${
                      apex || eng ? "text-gold" : "text-bone"
                    }`}
                  >
                    {e.handle}
                  </span>
                  {eng ? (
                    <span className="font-mono text-gold/80 text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/45">
                      尺 · 爬過它
                    </span>
                  ) : (
                    <span
                      className={`font-mono text-[9px] tracking-[0.2em] px-1.5 py-0.5 border ${
                        apex ? "border-gold/60 text-gold" : "border-line/70 text-mute/70"
                      }`}
                    >
                      {TIER_ZH[e.tier] ?? "新秀"}
                    </span>
                  )}
                  {!eng && <MoveMark move={e.move} />}
                  {!eng && e.monthBeatEngine && (
                    <span className="font-mono text-gold/70 text-[8px] tracking-[0.18em]">
                      本月仍贏引擎
                    </span>
                  )}
                </span>
                <span className="block font-mono text-mute/55 text-[9px] tracking-[0.15em] tabular mt-0.5">
                  命中 {e.accuracyPct}% · {e.decided} 場已對帳
                </span>
              </span>

              {/* 領頭數字 = 贏過引擎幾分(alpha)· 引擎本人是「0 線」基準 */}
              <span className="shrink-0 text-right">
                {eng ? (
                  <span className="block font-mono text-gold/70 text-[10px] tracking-[0.15em] leading-none">
                    基準線
                  </span>
                ) : (
                  <>
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
                  </>
                )}
              </span>
            </>
          );
          return (
            <li key={e.authorCode}>
              {eng ? (
                <div className={rowClass}>{inner}</div>
              ) : (
                <Link href={`/u/${e.authorCode}`} className={rowClass}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <p className="font-mono text-mute/50 text-[9px] tracking-[0.15em] leading-relaxed mt-3">
        ▸ 兩台「ZONE 27 引擎」(棒球 / 足球)就在榜上當<span className="text-gold/70">尺</span> ·
        名次隨大家表現上下移動 —— 你的工作是爬到它上面。 神準手 / 神諭 = ≥30 場裡守住{" "}
        <span className="text-gold/70">60%</span>(連我們自己的棒球引擎現在都才 53%、還沒站上)。
        排名按「贏過引擎幾分」+ 樣本厚度,不是裸勝率;含輸照算、平手不計、開賽後才下的不算。 王座只留給人。
      </p>
    </section>
  );
}
