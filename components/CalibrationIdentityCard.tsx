import Link from "next/link";
import type { CalibrationIdentity, AccuracyPoint } from "@/lib/predictions";
import AccuracySparkline from "@/components/AccuracySparkline";

// ── ZONE 27 · 你的校準身分(soul-roadmap #1 · 「有帳本的玩運彩」脊椎)──────
// 會員儀表板的主角:把你押過的場攤成一份不可造假的帳本 —— 你的準度(含輸)·
// 對比亂猜(50%)· 同一批場上你 vs 引擎 · 以及本月升階閘門(R188「當月贏過引擎」)。
//
// 為什麼不是 45° 校準曲線:二元押注(home/away)沒有機率軸 · 畫不出校準曲線
// (R189 已確立)。 個人「可靠度」改用三方命中率對照 —— 對二元押注才誠實。
// 不誇大:滿軸 0-100 · 小領先就畫成小領先(放大小差距 = 捏造精確度 · 品牌紅線)。
// 必含輸:✕ 跟 ✓ 一樣大 · 落後亂猜也照講(明牌站藏輸 · 我們是它的反面)。
//
// 純展示 server component · 計算在 lib/predictions.ts aggregateIdentity(單一真相)。
// ─────────────────────────────────────────────────────

const ROOKIE_MIN = 10; // 上天梯門檻 · 同 /member · /ladder · YourRecordStrip
const SAMPLE_FIRM = 8; // 低於此 · 數字還會跳 · 掛誠實小字(反過度自信)

type Props = {
  identity: CalibrationIdentity;
  /** 準度歷程序列(computeAccuracySeries)· 場數夠多(≥SAMPLE_FIRM)才畫 sparkline */
  series?: AccuracyPoint[];
};

// "2026-06" → "6 月"
function monthZh(key: string): string {
  const m = parseInt(key.slice(5, 7), 10);
  return Number.isFinite(m) ? `${m} 月` : "本月";
}

// 一句話總結「你 vs 亂猜 vs 引擎」· 誠實雙向(贏照講、輸也照講)。
function standingVerdict(id: CalibrationIdentity): string {
  const v = id.vsCoinPts;
  if (v === null) return "";
  // 沒贏過亂猜時 · 引擎對照先擱著(本就還沒站穩),只講基本盤。
  if (v < 0) return `你還落後亂猜 ${-v} 分 —— 帳本不騙人,先穩住基本盤。`;
  if (v === 0) return "你跟亂猜一樣準 —— 還沒證明你比丟銅板強。";

  const coin = `你比亂猜準 ${v} 分`;
  if (id.beatEngine === null) return `${coin}。`; // 無引擎同場對照
  if (id.beatEngine) return `${coin},也贏過引擎 —— 帳本看得出你有東西。`;
  if (id.tiedEngine) return `${coin},跟引擎打平 —— 再一場決勝負。`;
  return `${coin},但還沒贏過引擎。`;
}

// 本月升階閘門那一行 · 隨進度換句(入榜 → 爬階)。
function gateVerdict(id: CalibrationIdentity): string {
  const mo = id.month;
  if (mo.you.decided === 0) {
    return "這個月還沒有結算的場 · 押一手,開始這個月的對帳。";
  }
  if (mo.beatEngine === null) return "本月已開始記帳 · 等更多場結算才比得出高下。";
  if (mo.beatEngine) return "本月你領先引擎 —— 升階要的就是這個。";
  if (mo.tiedEngine) return "本月跟引擎打平 · 還差臨門一腳。";
  return "本月還沒贏過引擎 —— 贏過,才升得上去。";
}

export default function CalibrationIdentityCard({ identity: id, series }: Props) {
  // ── 空狀態:還沒押任何一場 ─────────────────────────
  if (id.total === 0) {
    return (
      <section className="mt-8 bg-slate/40 border border-gold/30 p-6 sm:p-8">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          你的校準身分
        </p>
        <p className="text-bone text-lg leading-relaxed">還沒押任何一場。</p>
        <p className="mt-1 text-mute text-sm leading-relaxed">
          你的帳本 —— 含贏含輸、刪不掉 —— 從這一場開始記。 接下來會這樣走:
        </p>
        {/* soul R209 · 新會員 3 步引導(member 介面 scale 的「0 態」· 引導非催單 · 押了即消失)*/}
        <ol className="mt-4 space-y-2.5 list-none pl-0">
          {[
            "押一場 · 賽前鎖死、改不了",
            "賽後自動生一張收據 · 中、沒中都留著",
            "滿 10 場 · 上天梯,跟公開引擎正面比準度",
          ].map((step, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span className="font-mono text-gold/80 tabular text-xs shrink-0 w-4">
                {i + 1}
              </span>
              <span className="text-mute text-sm leading-snug">{step}</span>
            </li>
          ))}
        </ol>
        <Link
          href="/matches"
          className="mt-6 inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          去押第一注 →
        </Link>
      </section>
    );
  }

  const hasDecided = id.accuracy !== null;
  const youPct = Math.max(0, Math.min(100, id.accuracy ?? 0));
  const engPct = Math.max(0, Math.min(100, id.engine.accuracy ?? 0));
  const showEngineBar = id.engine.decided > 0 && id.engine.accuracy !== null;
  const lowSample = id.decided > 0 && id.decided < SAMPLE_FIRM;

  return (
    <section className="mt-8 bg-slate/40 border border-gold/30 p-6 sm:p-8">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
        你的校準身分
      </p>

      {/* ── 1 · 你的準度 · 含輸 ─────────────────────── */}
      <div className="flex items-baseline gap-3">
        {hasDecided ? (
          <span className="font-mono text-gold text-6xl sm:text-7xl font-light tracking-tight tabular">
            {id.accuracy}
            <span className="text-2xl opacity-60 ml-1">%</span>
          </span>
        ) : (
          // 都還沒結算(全在場上)· 不顯示巨大的「—」(讀起來像壞掉)
          <span className="font-mono text-bone text-4xl sm:text-5xl font-light tracking-tight tabular">
            {id.total}
            <span className="font-sans text-mute text-xl ml-2">手在場上</span>
          </span>
        )}
      </div>
      <p className="mt-4 text-bone text-base leading-relaxed">
        押了 <span className="font-mono text-gold tabular">{id.total}</span> 場 ·{" "}
        <span className="font-mono text-gold tabular">✓{id.proved}</span> 中 ·{" "}
        <span className="font-mono text-loss/85 tabular">✕{id.diverged}</span> 沒中
        {id.push > 0 && (
          <>
            {" "}· <span className="font-mono text-mute tabular">={id.push}</span> 平
          </>
        )}
        {id.pending > 0 && (
          <span className="text-mute/70 text-sm"> · {id.pending} 場待開</span>
        )}
      </p>
      <p className="mt-2 font-mono text-mute/60 text-[10px] tracking-[0.2em] leading-relaxed">
        每場賽後自動對照引擎 · 押了刪不掉。
      </p>

      {/* ── 1.5 · 準度歷程 sparkline(soul R208 · 會動的數字 = 回訪鉤)──────
          場數夠多才畫(≥SAMPLE_FIRM · 場太少不假裝趨勢 = 不捏造精確度)。 */}
      {hasDecided && id.decided >= SAMPLE_FIRM && series && series.length >= 2 && (
        <div className="mt-5">
          <AccuracySparkline series={series} />
          <p className="mt-1.5 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
            準度歷程 · 按比賽日累計 · 虛線 = 亂猜 50%
          </p>
        </div>
      )}

      {/* ── 2 · 三方對照 · 你 vs 亂猜 vs 引擎(同一批已結算場)──────
          二元押注沒有校準曲線 · 改用同場命中率對照。 亂猜 = 50% 那條虛線 ·
          你的金條過了線 = 比猜的準;比引擎條長 = 贏過引擎。 滿軸 0-100 不放大。 */}
      {hasDecided && (
        <div className="mt-6 pt-5 border-t border-line/40">
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-4">
            同樣這 {id.decided} 場 · 你 vs 引擎
          </p>

          <div className="space-y-2.5">
            <CompareBar
              label="你"
              pct={youPct}
              hit={id.proved}
              of={id.decided}
              gold
            />
            {showEngineBar && (
              <CompareBar
                label="引擎"
                pct={engPct}
                hit={id.engine.proved}
                of={id.engine.decided}
              />
            )}
          </div>
          {/* 亂猜 50% 基準 · 用跟對照軌相同的欄結構 · 讓字正落在虛線(50%)正下方 */}
          <div className="mt-1.5 flex items-center gap-3">
            <span className="w-8 shrink-0" aria-hidden />
            <span className="flex-1 text-center font-mono text-mute/45 text-[9px] tracking-[0.25em]">
              亂猜 50%
            </span>
            <span className="w-[3.25rem] shrink-0" aria-hidden />
            <span className="hidden sm:inline w-12 shrink-0" aria-hidden />
          </div>

          {/* soul R209 · THE 炫耀數字:你比公開引擎準 +X 個百分點(edgeVsEnginePts 已算好 ·
              「賭徒的 Bloomberg」最該有的單一 alpha 數字)· 場數夠(≥ROOKIE_MIN)才掛 ·
              負的照誠實掛(Pratfall · 不是勝率虛榮榜是 alpha over baseline)。 */}
          {id.edgeVsEnginePts !== null &&
            id.decided >= ROOKIE_MIN &&
            id.engine.decided >= ROOKIE_MIN && (
            <div className="mt-5 border-l-2 border-gold/60 bg-gold/[0.05] pl-4 py-2.5">
              {id.edgeVsEnginePts > 0 ? (
                <p className="text-bone text-base sm:text-lg leading-snug">
                  你比那台公開引擎準{" "}
                  <span className="font-mono text-gold tabular text-2xl">
                    +{id.edgeVsEnginePts}
                  </span>{" "}
                  個百分點
                </p>
              ) : id.edgeVsEnginePts === 0 ? (
                <p className="text-bone text-base sm:text-lg leading-snug">
                  你跟那台公開引擎 <span className="text-gold">一樣準</span>。
                </p>
              ) : (
                <p className="text-bone text-base sm:text-lg leading-snug">
                  你比公開引擎低{" "}
                  <span className="font-mono text-loss/85 tabular text-2xl">
                    {-id.edgeVsEnginePts}
                  </span>{" "}
                  個百分點 —— 帳本不騙人。
                </p>
              )}
              <p className="mt-1 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
                同一批 {id.engine.decided} 場 · 跟一台公開機器正面比 · 含輸照算
              </p>
            </div>
          )}

          <p className="mt-4 text-bone text-sm sm:text-base leading-relaxed">
            {standingVerdict(id)}
          </p>
          {lowSample && (
            <p className="mt-1.5 font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed">
              場數還少({id.decided} 場)· 這些數字還會跳 · 先把帳本累起來。
            </p>
          )}
        </div>
      )}

      {/* ── 3 · 本月 · 升階閘門(R188「當月贏過引擎」實作)──────────── */}
      <div className="mt-6 border-l-2 border-gold/60 bg-gold/[0.05] pl-4 py-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.3em] mb-1.5">
          {monthZh(id.month.key)} · 升階閘門
        </p>
        {id.month.you.decided > 0 ? (
          <p className="text-bone text-sm sm:text-base leading-relaxed mb-1">
            你 <span className="font-mono text-gold tabular">{id.month.you.proved}/{id.month.you.decided}</span> 中
            {id.month.engine.decided > 0 && (
              <>
                {" "}· 引擎{" "}
                <span className="font-mono text-mute tabular">
                  {id.month.engine.proved}/{id.month.engine.decided}
                </span>{" "}
                中
              </>
            )}
          </p>
        ) : null}
        <p className="text-mute text-sm leading-relaxed">{gateVerdict(id)}</p>

        {/* 入榜 / 爬階 連結 · 未滿 10 場先講入榜門檻 · 滿了講爬階 */}
        <p className="mt-2 text-sm leading-relaxed">
          {id.total < ROOKIE_MIN ? (
            <span className="text-mute/80">
              再押 <span className="font-mono text-bone tabular">{ROOKIE_MIN - id.total}</span> 場 ·
              你就能上天梯排名 ·{" "}
            </span>
          ) : null}
          <Link
            href="/ladder"
            className="font-mono text-gold/80 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
          >
            {id.total < ROOKIE_MIN ? "天梯怎麼爬 →" : "看你能爬到第幾階 →"}
          </Link>
        </p>
      </div>
    </section>
  );
}

// ── 單條對照軌 · 命中率橫條 + 50% 亂猜虛線 ──────────────────────
function CompareBar({
  label,
  pct,
  hit,
  of,
  gold = false,
}: {
  label: string;
  pct: number;
  hit: number;
  of: number;
  gold?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-8 shrink-0 font-mono text-[10px] tracking-[0.2em] ${
          gold ? "text-gold" : "text-mute/70"
        }`}
      >
        {label}
      </span>
      <div className="relative flex-1 h-4 bg-line/30 overflow-hidden">
        {/* 命中率填充 */}
        <div
          className={`absolute inset-y-0 left-0 ${gold ? "bg-gold/85" : "bg-bone/30"}`}
          style={{ width: `${pct}%` }}
        />
        {/* 亂猜 50% 基準虛線 */}
        <div
          className="absolute inset-y-0 border-l border-dashed border-mute/50"
          style={{ left: "50%" }}
        />
      </div>
      <span
        className={`w-[3.25rem] shrink-0 text-right font-mono tabular text-sm ${
          gold ? "text-gold" : "text-mute"
        }`}
      >
        {Math.round(pct)}%
      </span>
      <span className="hidden sm:inline w-12 shrink-0 text-right font-mono text-mute/50 text-[10px] tabular">
        {hit}/{of}
      </span>
    </div>
  );
}
