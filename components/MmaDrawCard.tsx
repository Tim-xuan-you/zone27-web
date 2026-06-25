import Avatar from "@/components/Avatar";
import MmaBetStrip from "@/components/MmaBetStrip";
import { bettable, drawLine, type MmaFight } from "@/lib/mma/matches";

// ── ZONE 27 · UFC/MMA 真實賽卡(運彩在賣的場 · 兩向 · 名字一字不改)─────────────────────
// 狀態分流,誠實:① 可開盤有傾向 → 引擎兩向勝率(favored 上金)② 可開盤但同等級 → 50/50「純銅板·
// 引擎沒選邊」③ 認不出(tier null)→「算不出 · 不硬開假盤」④ 完場 → 結果 + 引擎對帳(含輸照掛)。
// 🔴 不管引擎開不開得出線,只要還沒完場 + 有開賽時戳 → 一律掛押注條(Tim 鐵律:能上架就能押)。
// 絕不顯示盤口 / 賠率。 純展示 + client 押注島。
// ─────────────────────────────────────────────────────

function initial(en: string, zh: string): string {
  return en && en !== "?" ? en.slice(0, 1).toUpperCase() : zh.slice(0, 1);
}

function FighterLine({ zh, en, align }: { zh: string; en: string; align: "left" | "right" }) {
  const right = align === "right";
  const known = !!en && en !== "?";
  const seed = known ? en : zh;
  return (
    <span className={`flex items-center gap-2 min-w-0 ${right ? "justify-end" : ""}`}>
      {!right && <Avatar seed={seed} glyph={initial(en, zh)} size={26} />}
      <span className={`min-w-0 ${right ? "text-right" : ""}`}>
        <span className="block text-bone text-[15px] font-light tracking-tight truncate">{zh}</span>
        {known && (
          <span className="block font-mono text-mute/50 text-[8px] tracking-[0.1em] truncate">
            {en}
          </span>
        )}
      </span>
      {right && <Avatar seed={seed} glyph={initial(en, zh)} size={26} />}
    </span>
  );
}

export default function MmaDrawCard({ fight }: { fight: MmaFight }) {
  const line = drawLine(fight);
  // pick=null = 同等級「純銅板」(引擎沒選邊)· 有 pick = 有傾向。
  const pickem = !!line && line.pick === null;
  const aGold = line?.pick === "a";
  const bGold = line?.pick === "b";
  const bet = bettable(fight);

  return (
    <article
      id={`m-${fight.id}`}
      className="bg-slate/40 border border-line/60 p-4 flex flex-col gap-2.5 transition-colors hover:border-gold/40 scroll-mt-24"
    >
      {/* 量級 + 時間(運彩字串) */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-gold/75 text-[9px] tracking-[0.25em] truncate">
          {fight.weightClass}
        </span>
        <span className="font-mono text-mute text-[9px] tracking-[0.18em] shrink-0">
          {fight.time}
        </span>
      </div>

      {/* 兩位選手(運彩名一字不改) */}
      <div className="flex items-center justify-between gap-2">
        <FighterLine zh={fight.a.zh} en={fight.a.en} align="left" />
        <span className="font-mono text-mute/40 text-[10px] shrink-0">vs</span>
        <FighterLine zh={fight.b.zh} en={fight.b.en} align="right" />
      </div>

      {/* 狀態分流 */}
      {fight.finalResult ? (
        <div className="border-t border-line/40 pt-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-gold/70 text-[9px] tracking-[0.25em]">完場</span>
            {fight.finalResult.method && (
              <span className="font-mono text-mute/65 text-[10px]">{fight.finalResult.method}</span>
            )}
          </div>
          {fight.finalResult.draw ? (
            <p className="mt-1.5 text-bone text-sm font-light tracking-tight">和局 / 無效比賽 · 不計勝負</p>
          ) : (
            <p className="mt-1.5 text-bone text-sm font-light tracking-tight">
              <span className="text-gold">
                {fight.finalResult.winner === "a" ? fight.a.zh : fight.b.zh}
              </span>{" "}
              勝
            </p>
          )}
          {line && line.pick && !fight.finalResult.draw && (
            <p className="mt-1 font-mono text-[9px] tracking-[0.12em]">
              <span className="text-mute/55">
                引擎看好 {line.pick === "a" ? fight.a.zh : fight.b.zh} ·{" "}
              </span>
              {line.pick === fight.finalResult.winner ? (
                <span className="text-gold">命中 ✓</span>
              ) : (
                <span className="text-loss/85">沒中 ✕</span>
              )}
            </p>
          )}
        </div>
      ) : line ? (
        <div className="border-t border-line/40 pt-2.5">
          <div className="flex items-baseline justify-between mb-1.5 font-mono tabular">
            <span className={`text-lg font-light ${aGold ? "text-gold" : "text-mute"}`}>
              {line.aWin}
              <span className="text-[10px] opacity-60">%</span>
            </span>
            <span className={`text-lg font-light ${bGold ? "text-gold" : "text-mute"}`}>
              {line.bWin}
              <span className="text-[10px] opacity-60">%</span>
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-[2px] bg-line/30" aria-hidden="true">
            <div className={aGold ? "bg-gold/85" : "bg-bone/25"} style={{ width: `${line.aWin}%` }} />
            <div className={bGold ? "bg-gold/85" : "bg-bone/25"} style={{ width: `${line.bWin}%` }} />
          </div>
          <p className="mt-2 font-mono text-mute/80 text-[9px] tracking-[0.12em] leading-snug">
            {pickem ? (
              <>勢均力敵 · 引擎也拿不準 —— <span className="text-bone/80">你的判斷最值錢</span>(MMA 本來就接近銅板)</>
            ) : (
              <>引擎看好 <span className="text-gold">{aGold ? fight.a.zh : fight.b.zh}</span> · 戰力換算 · 非盤口</>
            )}
          </p>
        </div>
      ) : (
        <p className="font-mono text-mute/80 text-[10px] tracking-[0.1em] leading-relaxed border-t border-line/40 pt-2.5">
          引擎算不出 · 有人資料太薄 / 認不出(首戰、臨時替補)→ 不硬開假盤。 賭場什麼都敢開,我們只開算得出的
          —— 但這場<span className="text-bone">你照樣能押</span>(你的判斷比引擎值錢)。
        </p>
      )}

      {/* 賽前鎖定押注 · 🔴 引擎開不開得出線都能押(Tim 鐵律:能上架就能押)· 只要還沒完場 + 有開賽時戳。 */}
      {bet && !fight.finalResult && (
        <MmaBetStrip matchId={fight.id} startISO={bet} aLabel={fight.a.zh} bLabel={fight.b.zh} />
      )}
    </article>
  );
}
