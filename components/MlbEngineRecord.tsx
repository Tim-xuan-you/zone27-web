import mlbLocked from "@/lib/mlb-locked.json";

// ── ZONE 27 · MLB 引擎自動盤戰績(驗證中)──────────────────
// Tim 2026-06-03:「太慢了!把 MLB 接進來,樣本多更好調引擎。」
//
// lib/mlb.ts 早就會即時算 MLB 引擎勝率 + 賽後 grade,但因為「沒賽前鎖定」一直
// 不能進戰績。 scripts/lock-mlb-predictions.mjs + grade-mlb-locked.mjs(GitHub
// Action 每天自動跑)補上「賽前鎖定 → 賽後對帳」那塊,寫進 lib/mlb-locked.json。
// 這個 component 把那份戰績呈現出來。
//
// brand 紀律(per /integrity #12 R185 reframe = 品質閘門,不是「只做 CPBL」):
//   · 這不是「開放 MLB 押注」· 是「引擎在公開累積 MLB 戰績、證明自己」。
//   · 累積到夠準(同 /calibration 30 場門檻)才會開放 MLB 押注。
//   · 跟 CPBL 戰績分開計(避免一個 league 的雜訊污染另一個)。
//   · 引擎落空(DIVERGED)照掛不刪 = 同站上 costly-signal 紀律。
// 資料賽後由 Action 更新 → commit → Vercel 重佈 · 此頁靜態讀 JSON。
// ─────────────────────────────────────────────────────

type Verdict = "proved" | "diverged" | "tie" | "push" | null;
type Pred = {
  engineWinHomePct: number;
  verdict: Verdict;
};

export default function MlbEngineRecord() {
  const preds = (mlbLocked.predictions ?? []) as Pred[];
  const total = preds.length;
  if (total === 0) return null;

  const decided = preds.filter(
    (p) => p.verdict === "proved" || p.verdict === "diverged"
  );
  const proved = decided.filter((p) => p.verdict === "proved").length;
  const diverged = decided.length - proved;
  const pending = preds.filter((p) => p.verdict === null).length;
  const noLine = preds.filter(
    (p) => p.verdict === "push" || p.verdict === "tie"
  ).length;
  const rate =
    decided.length > 0 ? Math.round((proved / decided.length) * 100) : null;

  return (
    <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-7">
        <div className="flex items-baseline gap-3 flex-wrap mb-3">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
            MLB 引擎 · 驗證中
          </p>
          <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80">
            賽前鎖定 · 賽後對帳
          </span>
        </div>
        <p className="text-mute/90 text-sm leading-relaxed mb-5 max-w-2xl">
          引擎每天自動抓 MLB 官方先發投手數據、
          <span className="text-bone">賽前鎖定開盤線</span>(留時間戳、改不了)·
          賽後自動對「當初鎖定的那個數字」結算。
          <span className="text-gold"> 樣本累積比 CPBL 快很多</span> —— 這是引擎在
          公開證明自己。{" "}
          <span className="text-bone">累積到夠準,才會開放 MLB 押注</span>
          (沒驗證夠不開盤 = 鐵律)· 跟 CPBL 戰績分開計。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="賽前鎖定" value={String(total)} sub={`${pending} 場待結算`} />
          <Stat
            label="已結算"
            value={String(decided.length)}
            sub={noLine > 0 ? `${noLine} 平/無盤` : "已對帳"}
            tone="bone"
          />
          <Stat
            label="引擎言中"
            value={`✓${proved}`}
            sub={`✕${diverged} 落空`}
            tone="gold"
          />
          <Stat
            label="準度"
            value={rate !== null ? `${rate}%` : "—"}
            sub={
              decided.length < 30
                ? `還差 ${30 - decided.length} 場才作數`
                : "已達門檻"
            }
            tone={rate !== null && rate >= 55 ? "gold" : "mute"}
          />
        </div>
        <p className="mt-4 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
          引擎開盤公式公開(主場優勢 + 先發投手 ERA / K9 / HR9)· 30 場以上準度才有
          統計意義(同 /calibration 誠實門檻)· 引擎落空照掛、永不刪。
        </p>
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
