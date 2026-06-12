import Link from "next/link";
import { type LockedSoccerPrediction } from "@/lib/soccer/locked";
import { getResolvedSoccerEngine } from "@/lib/soccer/engine-settle";

// ── ZONE 27 · 足球引擎賽前鎖定 · 賽後對帳(公開戰績 · 三向)──────────────
// 鏡 components/MlbEngineRecord.tsx,但足球是三向(主勝/和/客勝)。 讀 lib/soccer-locked.json
// (GitHub Action soccer-engine.yml 賽前鎖、賽後 grade · 留時間戳)。 引擎看好邊(三向 argmax)
// == 終場 → ✓ 命中;偏錯 → ✕ 落空(含輸照掛、永不刪)。
//
// 🔴 誠實鐵律:
//   · 命中率不是排名尺(和局幾乎永遠不是任一場的最高機率 → 引擎幾乎不挑「和」→ 命中率
//     「結構性低估」引擎讀和局的能力)。 真正的尺 = 校準(RPS · 見下方 / /calibration)。
//   · 57% 天花板:足球更難(進球少、平手多)· 命中率再高都不是「神準」。
//   · 滿 30 場才報數字(幾場的輸贏是運氣不是準度)· 跟 MLB/CPBL 同一把尺。
//   · 三本帳分開計(CPBL / MLB / 足球)· 不混池。
// 資料賽後由 Action 更新 → commit → Vercel 重佈 · 此元件靜態讀 JSON(server component)。
// ─────────────────────────────────────────────────────

type Outcome = "home" | "draw" | "away";
type Pred = {
  homeWin: number;
  draw: number;
  awayWin: number;
  enginePick: Outcome;
  outcome: Outcome | null;
  verdict: "proved" | "diverged" | "push" | null;
  gradedAt: string | null;
};

// 排名校準的真尺:Ranked Probability Score(三向有序 home>draw>away · 越低越準 ·
// 「偏向主勝、結果是和」比「偏向主勝、結果是客勝」罰得輕 = 對有序結果才公平)。
function rps(pHome: number, pDraw: number, pAway: number, outcome: Outcome): number {
  const o = outcome === "home" ? [1, 0] : outcome === "draw" ? [0, 1] : [0, 0];
  // 累積:c1 = P(home), c2 = P(home)+P(draw)。 結果累積同理。
  const c1 = pHome - o[0];
  const c2 = pHome + pDraw - (o[0] + o[1]);
  return 0.5 * (c1 * c1 + c2 * c2);
}

const UNIFORM = { h: 1 / 3, d: 1 / 3, a: 1 / 3 };
// 「主場先驗」基準:聯賽長期大致 主勝 0.46 / 和 0.27 / 客勝 0.27(只編碼主場優勢、不看兩隊)。
// 引擎要「賺到」它的說法,得贏過這條先驗,不只贏過亂猜。
const HOME_PRIOR = { h: 0.46, d: 0.27, a: 0.27 };

export default async function SoccerEngineRecord() {
  // 站上即時對帳(resolveLockedSoccer)· 終場一進 live 窗就算進戰績,不等 GitHub cron commit。
  const { predictions: lockedAll, notKicked, awaitingGrade } =
    await getResolvedSoccerEngine();
  const preds = lockedAll as Pred[];
  const total = preds.length;
  if (total === 0) return null;

  // 逐場「戰功收據」· 已對帳(命中/落空)的場 → 點進單場收據(/receipts/fd-*)· 含輸照列。
  // 兌現 SoccerPendingFrame 的「每一場都會當眾對帳」承諾 = 可點的證物,不只一個總數。
  const gradedReceipts: LockedSoccerPrediction[] = lockedAll
    .filter((p) => p.verdict === "proved" || p.verdict === "diverged")
    .slice()
    .sort((a, b) => (b.kickoffISO || "").localeCompare(a.kickoffISO || ""))
    .slice(0, 12);

  const decided = preds.filter(
    (p) => p.verdict === "proved" || p.verdict === "diverged",
  );
  const proved = decided.filter((p) => p.verdict === "proved").length;
  const diverged = decided.length - proved;
  // verdict null = 還沒結算 ≠ 還沒踢:結算每 3h 跑一輪,終場到入帳之間誠實分兩格
  // (時鐘分流在 lib/soccer/locked.ts · 元件 render 不讀時鐘)。
  const pending = preds.filter((p) => p.verdict === null).length;
  const noLine = preds.filter((p) => p.verdict === "push").length;
  const played = decided.length + noLine;
  const rate =
    decided.length > 0 ? Math.round((proved / decided.length) * 100) : null;
  const firm = decided.length >= 30;

  // RPS 校準(對已結算、有結果的場)· 引擎 vs 亂猜 vs 主場先驗。 滿 30 場才報。
  let skill: { engine: number; uniform: number; prior: number } | null = null;
  if (firm) {
    let e = 0;
    let u = 0;
    let pr = 0;
    let nn = 0;
    for (const p of decided) {
      if (!p.outcome) continue;
      e += rps(p.homeWin, p.draw, p.awayWin, p.outcome);
      u += rps(UNIFORM.h, UNIFORM.d, UNIFORM.a, p.outcome);
      pr += rps(HOME_PRIOR.h, HOME_PRIOR.d, HOME_PRIOR.a, p.outcome);
      nn += 1;
    }
    if (nn > 0) skill = { engine: e / nn, uniform: u / nn, prior: pr / nn };
  }

  const gradedTs = preds
    .map((p) => p.gradedAt)
    .filter((t): t is string => Boolean(t))
    .sort();
  const lastUpdated =
    gradedTs.length > 0 ? gradedTs[gradedTs.length - 1].slice(0, 10) : null;

  return (
    <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-7">
        <div className="flex items-baseline gap-3 flex-wrap mb-3">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
            足球引擎 · 賽後對帳
          </p>
          <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80">
            賽前鎖定 · 賽後對帳
          </span>
        </div>
        <p className="text-mute/90 text-sm leading-relaxed mb-5 max-w-2xl">
          足球就是足球 —— 世界盃跟各大聯賽{" "}
          <span className="text-bone">同一套引擎</span>(Dixon-Coles)· 每天自動抓中立賽程、
          <span className="text-bone">賽前鎖開盤線</span>(留時間戳、改不了)· 賽後自動對
          「當初鎖的那組機率」結算 · <span className="text-gold">落空照掛、永不刪</span> ·
          跟棒球三本帳分開計(不讓一個運動的雜訊污染另一個)。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat
            label="賽前鎖死"
            value={String(total)}
            sub={
              awaitingGrade > 0
                ? `未開賽 ${notKicked} · 開踢後待對帳 ${awaitingGrade}`
                : `${pending} 場還沒踢 · 改不了`
            }
            tone="gold"
          />
          <Stat
            label="踢完對帳"
            value={String(played)}
            sub={noLine > 0 ? `${noLine} 場無偏向不計` : "已對帳"}
            tone="bone"
          />
          <Stat
            label="✓ 命中"
            value={String(proved)}
            sub={`${decided.length} 場有看好邊`}
            tone="gold"
          />
          <Stat label="✕ 落空" value={String(diverged)} sub="照掛 · 刪不掉" tone="bone" />
        </div>

        {/* 小樣本誠實:才幾場別讓「命中」大字讀成判決 · 同 MLB/CPBL 滿 30 場才報 */}
        {!firm && decided.length > 0 && (
          <p className="mt-4 border-l-2 border-gold/55 bg-gold/[0.05] pl-4 py-2.5 text-mute/90 text-[13px] leading-relaxed">
            才 <span className="font-mono text-bone tabular">{decided.length}</span> 場分出結果 ——
            <span className="text-bone"> 還看不出引擎準不準</span>。 足球幾場的輸贏是運氣,
            跟棒球同一把尺,<span className="text-bone">滿 30 場才報數字</span>。 這幾場的輸 ·
            一樣照掛、永不刪。
          </p>
        )}

        {/* 和局誠實揭露(永遠顯示 · Pratfall · 主動講自己這把尺最不利的地方)*/}
        <p className="mt-4 text-mute/75 text-[12px] leading-relaxed max-w-2xl">
          <span className="text-bone">為什麼命中率不是我們的排名尺:</span>{" "}
          和局幾乎永遠不是任何一場的「最高機率結果」(長期大致 主勝多 / 和居中 / 客勝其次),
          所以引擎幾乎不會把「和」當首選 —— 這個命中率<span className="text-bone">結構性地低估</span>
          了引擎讀準和局的能力。 命中率是誠實的計分板,<span className="text-gold">但真正的尺是校準</span>
          (RPS · 看引擎押的機率分佈準不準,不是只看猜對沒)。 而且足球更難(進球少、平手多),
          <span className="text-bone">命中率再高都不是「神準」</span>(全世界沒有神準引擎)。
        </p>

        {/* 真正的尺:RPS 校準 vs 亂猜 vs 主場先驗(滿 30 場才報)*/}
        {skill && (
          <div className="mt-4 border-t border-line/40 pt-3">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2">
              校準分數 RPS · 越低越準(真正的尺)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="我們引擎" value={skill.engine.toFixed(3)} sub="鎖定的機率分佈" tone="gold" />
              <Stat label="主場先驗" value={skill.prior.toFixed(3)} sub="只賭主場優勢" tone="mute" />
              <Stat label="亂猜 1/3" value={skill.uniform.toFixed(3)} sub="什麼都不知道" tone="mute" />
            </div>
            <p className="mt-2 font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed">
              引擎要「贏過主場先驗」才算真的有讀出東西(不只贏過亂猜)。
              {skill.engine < skill.prior
                ? " 目前贏過先驗。"
                : " 目前還沒贏過先驗 —— 照實掛。"}
            </p>
          </div>
        )}

        <p className="mt-3 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
          引擎開盤公式公開(國際實力分 + Dixon-Coles 低比分修正 · 完整揭露見 /audit)。
          對帳一律算 90 分鐘正規賽 1X2 —— 淘汰賽的延長賽 / PK 晉級不影響這條線。
          {firm && rate !== null && (
            <span className="text-gold/80"> 看好邊命中 {rate}% ·</span>
          )}
          {lastUpdated && (
            <span className="text-mute/75"> 最後對帳 {lastUpdated}</span>
          )}
        </p>

        {/* 逐場戰功收據 · 已對帳的場 → 點進單場收據(可截圖外傳)· 兌現「每一場都當眾對帳」。 */}
        {gradedReceipts.length > 0 && (
          <div className="mt-5 pt-4 border-t border-line/40">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-2.5">
              逐場收據 · 點進去看 / 外傳
            </p>
            <ul className="space-y-1.5">
              {gradedReceipts.map((p) => {
                const hit = p.verdict === "proved";
                return (
                  <li key={p.matchId}>
                    <Link
                      href={`/receipts/${p.matchId}`}
                      className="flex items-center justify-between gap-3 group py-1"
                    >
                      <span className="text-bone/90 text-sm font-light tracking-tight truncate group-hover:text-gold transition-colors">
                        {p.home} <span className="text-mute/50 text-xs">vs</span> {p.away}
                        {p.finalScore && (
                          <span className="font-mono text-mute/70 text-xs tabular ml-2">
                            {p.finalScore.home}:{p.finalScore.away}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 flex items-center gap-2">
                        <span
                          className={`font-mono text-[11px] tabular ${hit ? "text-gold" : "text-loss/85"}`}
                        >
                          {hit ? "✓ 命中" : "✕ 落空"}
                        </span>
                        <span className="font-mono text-mute/40 group-hover:text-gold text-[10px] tracking-[0.2em] transition-colors">
                          收據 →
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
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
  const valueColor = { gold: "text-gold", bone: "text-bone", mute: "text-mute" }[
    tone
  ];
  return (
    <div className="border border-line/60 bg-slate/30 p-3">
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-1">
        {label}
      </p>
      <p className={`font-mono tabular text-2xl tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.2em] mt-1">
        {sub}
      </p>
    </div>
  );
}
