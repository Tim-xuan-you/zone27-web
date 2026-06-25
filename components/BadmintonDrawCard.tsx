import Link from "next/link";
import Avatar from "@/components/Avatar";
import BadmintonBetStrip from "@/components/BadmintonBetStrip";
import { bettable, drawLine, type BadmintonMatch } from "@/lib/badminton/matches";

// ── ZONE 27 · 羽球真實賽程卡(運彩在賣的場 · 兩向 · 名字一字不改)── v0.1 唯讀 ────────────
// 四種狀態,誠實分流:① 可開盤 → 引擎兩向勝率(favored 上金)② 進行中(live)→「進行中 ·
// 引擎只做賽前」③ 有 note(認得出某位、但對手認不出)→ 那句誠實 note ④ 其餘認不出 →「覆蓋
// 建置中」。 絕不顯示盤口 / 賠率。 純展示 · 0 client JS · deterministic = ISR-safe。
// 🔴 v0.1 不掛押注條(新運動帳本隔離另開一波)· 不連詳情頁(尚未建)。
// ─────────────────────────────────────────────────────

function initial(en: string, zh: string): string {
  return en && en !== "?" ? en.slice(0, 1).toUpperCase() : zh.slice(0, 1);
}

function PlayerLine({
  zh,
  en,
  align,
}: {
  zh: string;
  en: string;
  align: "left" | "right";
}) {
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

export default function BadmintonDrawCard({ match }: { match: BadmintonMatch }) {
  const line = drawLine(match);
  // 真・五五波(展示整數相等)→ 不上金、不喊「引擎看好」· 誠實標「勢均力敵」(同網球 / 足球)。
  const tie = line ? line.aWin === line.bWin : false;
  const aGold = !tie && line?.pick === "a";
  const bGold = !tie && line?.pick === "b";
  // 可賽前鎖定押注的場(有明確未來開賽時戳 + 還沒完場)· 🔴 引擎開不開得出線都能押(Tim 鐵律)。
  const bet = bettable(match);

  return (
    <article
      id={`m-${match.id}`}
      className="bg-slate/40 border border-line/60 p-4 flex flex-col gap-2.5 transition-colors hover:border-gold/40 scroll-mt-24"
    >
      {/* 賽事 + 時間(運彩字串) */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-gold/75 text-[9px] tracking-[0.25em] truncate">
          {match.tournament}
        </span>
        <span className="font-mono text-mute text-[9px] tracking-[0.18em] shrink-0">
          {match.time}
        </span>
      </div>

      {/* 兩位球員(運彩名一字不改) */}
      <div className="flex items-center justify-between gap-2">
        <PlayerLine zh={match.a.zh} en={match.a.en} align="left" />
        <span className="font-mono text-mute/40 text-[10px] shrink-0">vs</span>
        <PlayerLine zh={match.b.zh} en={match.b.en} align="right" />
      </div>

      {/* 狀態分流 */}
      {match.finalResult ? (
        // 完場 · 結果 + 引擎對帳(含輸照掛 · 同棒球 / 足球 / 網球的賽後卡)。
        <div className="border-t border-line/40 pt-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-gold/70 text-[9px] tracking-[0.25em]">
              {match.finalResult.retired ? "完場 · 退賽" : "完場"}
            </span>
            {match.finalResult.score && (
              <span className="font-mono text-mute/65 text-[10px] tabular">
                {match.finalResult.score}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-bone text-sm font-light tracking-tight">
            <span className="text-gold">
              {match.finalResult.winner === "a" ? match.a.zh : match.b.zh}
            </span>{" "}
            勝
          </p>
          {line && (
            <p className="mt-1 font-mono text-[9px] tracking-[0.12em]">
              <span className="text-mute/55">
                引擎看好 {line.pick === "a" ? match.a.zh : match.b.zh} ·{" "}
              </span>
              {line.pick === match.finalResult.winner ? (
                <span className="text-gold">命中 ✓</span>
              ) : (
                <span className="text-loss/85">沒中 ✕</span>
              )}
            </p>
          )}
        </div>
      ) : match.live ? (
        <p className="font-mono text-mute/60 text-[10px] tracking-[0.12em] leading-relaxed border-t border-line/40 pt-2.5">
          進行中 · 引擎只做<span className="text-mute">賽前</span>,不追 live。
        </p>
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
          <p className="mt-2 font-mono text-mute/80 text-[9px] tracking-[0.12em]">
            {tie ? (
              <>勢均力敵 · 引擎也拿不準 —— <span className="text-bone/80">你的判斷最值錢</span></>
            ) : (
              <>引擎看好 <span className="text-gold">{aGold ? match.a.zh : match.b.zh}</span> · 排名換算 · 非盤口</>
            )}
          </p>
        </div>
      ) : match.note ? (
        <p className="font-mono text-mute/80 text-[10px] tracking-[0.1em] leading-relaxed border-t border-line/40 pt-2.5">
          {match.note}
        </p>
      ) : (
        <p className="font-mono text-mute/80 text-[10px] tracking-[0.1em] leading-relaxed border-t border-line/40 pt-2.5">
          覆蓋建置中 · 這場我們還沒把握誠實開盤。 賭場什麼都敢開,我們只開算得出的。
        </p>
      )}

      {/* 賽前鎖定押注(登入才能押 · 押了不可改 · 開賽封盤)· 🔴 引擎開不開得出線都能押(Tim 鐵律:
          能上架就能押)· 認不出的場、你的判斷比引擎值錢。 只要有明確未來開賽時戳 + 還沒完場。 */}
      {bet && !match.finalResult && (
        <BadmintonBetStrip
          matchId={match.id}
          startISO={bet}
          aLabel={match.a.zh}
          bLabel={match.b.zh}
        />
      )}

      {/* 進這場完整分析(引擎怎麼算 · 賽前鎖定)· 只有引擎開盤的場連(其餘詳情頁無引擎內容) */}
      {line && (
        <Link
          href={`/badminton/${match.id}`}
          className="pt-0.5 flex items-baseline justify-end font-mono text-gold/65 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
        >
          完整分析 →
        </Link>
      )}
    </article>
  );
}
