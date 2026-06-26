import Link from "next/link";
import { BADMINTON_DRAW, drawLine, gradeBadmintonEngine } from "@/lib/badminton/matches";

// ── ZONE 27 · 羽球引擎賽前開盤 · 賽後對帳(公開戰績 · 兩向)──────────────────
// 鏡 components/TennisEngineRecord.tsx,但羽球兩向(A 勝 / B 勝 · 無和局)· BWF 排名換算
// 實力分 + 標準 Elo 開盤(室內無場地差 · 比網球更單純)。 賽果 Tim 賽後 curate(同棒球)→
// gradeBadmintonEngine 賽後對帳。
//
// 🔴 誠實鐵律(同網球):
//   · 羽球熱門贏面天生高(一人控球、磨平運氣)→ 命中率看起來高不是神準,是好預測 → 真尺是校準。
//   · 滿 30 場才報數字(同 CPBL / MLB / 足球 / 網球)· 幾場的輸贏是運氣不是準度。
//   · 引擎沒開盤的場(認不出選手、排名失真)不進戰績 · 落空照掛、永不刪。
//   · 跟棒球 / 足球 / 網球分開計(不混池)。
// 純資料(gradeBadmintonEngine / drawLine 同步純函式)· server component。
// ─────────────────────────────────────────────────────

export default function BadmintonEngineRecord() {
  const rec = gradeBadmintonEngine();
  if (rec.n === 0 && rec.pending === 0) return null;

  // 逐場已對帳(引擎有開盤 + 有賽果)· 出現順序(draw-data 大致按賽事/時間)· 顯示全部(不挑好看的)。
  const graded = BADMINTON_DRAW.flatMap((m) => {
    const line = drawLine(m);
    const fr = m.finalResult;
    if (!line || !fr) return [];
    return [
      {
        id: m.id,
        a: m.a.zh,
        b: m.b.zh,
        score: fr.score ?? "",
        hit: line.pick === fr.winner,
      },
    ];
  }).slice(0, 60);

  const firm = rec.n >= 30;
  const total = rec.n + rec.pending;

  return (
    <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-7">
        <div className="flex items-baseline gap-3 flex-wrap mb-3">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
            羽球引擎 · 賽後對帳
          </p>
          <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80">
            賽前開盤 · 賽後對帳
          </span>
        </div>
        <p className="text-mute/90 text-sm leading-relaxed mb-5 max-w-2xl">
          羽球用 <span className="text-bone">BWF 排名換算的實力分 + 標準 Elo</span> 賽前逐場開盤(改不了)·
          賽後對「當初開的那條線」結算 —— <span className="text-gold">看好邊中沒中、落空照掛、永不刪</span> ·
          跟棒球、足球、網球四本帳分開計(不讓一個運動的雜訊污染另一個)。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="引擎開盤" value={String(total)} sub={`${rec.pending} 場待結算`} tone="gold" />
          <Stat label="已對帳" value={String(rec.n)} sub="賽果已 curate" tone="bone" />
          <Stat label="✓ 命中" value={String(rec.hits)} sub="引擎看好邊贏了" tone="gold" />
          <Stat label="✕ 落空" value={String(rec.misses)} sub="照掛 · 刪不掉" tone="bone" />
        </div>

        {/* 小樣本誠實:才幾場別讓命中率讀成判決 · 同棒球足球網球滿 30 場才報 */}
        {!firm && rec.n > 0 && (
          <p className="mt-4 border-l-2 border-gold/55 bg-gold/[0.05] pl-4 py-2.5 text-mute/90 text-[13px] leading-relaxed">
            才 <span className="font-mono text-bone tabular">{rec.n}</span> 場對帳完(目前看好邊命中{" "}
            <span className="font-mono text-gold tabular">{rec.rate}%</span>)——
            <span className="text-bone"> 還看不出引擎準不準</span>。 幾場的輸贏是運氣,跟棒球同一把尺,
            <span className="text-bone">滿 30 場才算數</span>。 這幾場的輸 · 一樣照掛、永不刪。
          </p>
        )}

        {/* 羽球誠實揭露(永遠顯示 · Pratfall):好預測 ≠ 神準 → 真尺是校準 */}
        <p className="mt-4 text-mute/75 text-[12px] leading-relaxed max-w-2xl">
          <span className="text-bone">為什麼羽球看起來會準很多:</span>{" "}
          羽球<span className="text-bone">本來就好預測</span>(一個人控制每一球、磨平運氣)——
          所以命中率高不代表我們神準,是這個運動天生好猜。 真正的尺是
          <span className="text-gold">校準</span>:引擎喊 70%,長期就該中 70%(看{" "}
          <Link href="/calibration" className="text-gold underline-offset-4 hover:underline">
            /calibration
          </Link>
          )。 全世界沒有神準引擎 · 羽球誠實天花板約六成出頭。
        </p>

        {/* 逐場戰績 · 已對帳的場 → 點進單場分析 · 含輸照列 */}
        {graded.length > 0 && (
          <div className="mt-5 pt-4 border-t border-line/40">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2.5">
              逐場對帳 · 點進去看引擎怎麼算
            </p>
            <ul className="space-y-1.5">
              {graded.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/badminton/${g.id}`}
                    className="flex items-center justify-between gap-3 group py-1"
                  >
                    <span className="text-bone/90 text-sm font-light tracking-tight truncate group-hover:text-gold transition-colors">
                      {g.a} <span className="text-mute/50 text-xs">vs</span> {g.b}
                      {g.score && (
                        <span className="font-mono text-mute/70 text-xs tabular ml-2">{g.score}</span>
                      )}
                    </span>
                    <span className="shrink-0 flex items-center gap-2">
                      <span className={`font-mono text-[11px] tabular ${g.hit ? "text-gold" : "text-loss/85"}`}>
                        {g.hit ? "✓ 命中" : "✕ 落空"}
                      </span>
                      <span className="font-mono text-mute/40 group-hover:text-gold text-[10px] tracking-[0.2em] transition-colors">
                        分析 →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  tone = "mute",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "gold" | "bone" | "mute";
}) {
  const valueColor = { gold: "text-gold", bone: "text-bone", mute: "text-mute" }[tone];
  return (
    <div className="border border-line/60 bg-slate/30 p-3">
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-1">{label}</p>
      <p className={`font-mono tabular text-2xl tracking-tight ${valueColor}`}>{value}</p>
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.2em] mt-1">{sub}</p>
    </div>
  );
}
