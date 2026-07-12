import Link from "next/link";
import mlbLocked from "@/lib/mlb-locked.json";

// ── ZONE 27 · MLB 引擎自動盤戰績(驗證中)──────────────────
// Tim 2026-06-03:「太慢了!把 MLB 接進來,樣本多更好調引擎。」
//
// lib/mlb.ts 早就會即時算 MLB 引擎勝率 + 賽後 grade,但因為「沒賽前鎖定」一直
// 不能進戰績。 scripts/lock-mlb-predictions.mjs + grade-mlb-locked.mjs(GitHub
// Action 每天自動跑)補上「賽前鎖定 → 賽後對帳」那塊,寫進 lib/mlb-locked.json。
// 這個 component 把那份戰績呈現出來。
//
// brand 紀律(R197 Tim de-BETA:蒙地卡羅是全世界在用的方法 · 不需要「測 30 場驗證」):
//   · MLB 跟 CPBL 同一套引擎 · 賽前鎖定、賽後對帳、落空照掛(first-class · 非「驗證中」)。
//   · ⚠️ R201 紀律反轉(Tim「公開戰績該有 MLB」· Musk「刪人為分離 · 同一引擎」):/track-record
//     的「方向命中率大數字」現在**跨聯盟合計** CPBL+MLB(舊「分聯盟計防污染」已不適用於方向命中
//     —— 紅隊實測:命中是 binary 對/錯,不像機率分佈會被混池污染)。 此 component 仍可只秀 MLB。
//   · 🔴 但「機率校準曲線 / reliability diagram」**仍各聯盟分開**(那個才會被混池污染)· 見 /calibration。
//   · 🔴 N<30 老實標:/track-record 即使合計過 30,仍掛「各聯盟單獨仍<30」· 絕不因合計灌大就熄滅。
//   · 準度% 等樣本夠了才報:幾場的勝率是運氣不是準度 = 同「沒人能神準」的誠實。
// 資料賽後由 Action 更新 → commit → Vercel 重佈 · 此頁靜態讀 JSON。
// ─────────────────────────────────────────────────────

// void = 延賽改期 ≥2 天停審(先發重排 · 賽前鎖的線不描述改期後的比賽 → 退回不計 ·
// 同運彩「先發投手異動退注」慣例 · grade-mlb-locked.mjs R296)。
type Verdict = "proved" | "diverged" | "tie" | "push" | "void" | null;
type Pred = {
  engineWinHomePct: number;
  verdict: Verdict;
  lockedAt?: string;
  gradedAt?: string;
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
  // 延賽改期停審(不進任何分母 · 誠實顯示不隱形 —— 否則「鎖死 N 場」跟其他格子兜不攏)。
  const voided = preds.filter((p) => p.verdict === "void").length;
  const rate =
    decided.length > 0 ? Math.round((proved / decided.length) * 100) : null;
  // 最後更新戳(賽後對帳 gradedAt · 沒有就用最近 lockedAt)· 補 Tim 指出的「沒寫日期」·
  // 也強化「賽後自動對帳」誠實感(看得到上次什麼時候對的)。
  // 「最後對帳」只看 gradedAt(賽後結算時間)· 不混 lockedAt —— lockedAt 對未來
  // 還沒打的場也有,混進去會把「最後對帳」顯示成未來日期 = 假時效。 無結算則不顯示。
  const gradedTs = preds
    .map((p) => p.gradedAt)
    .filter((t): t is string => Boolean(t))
    .sort();
  const lastUpdated =
    gradedTs.length > 0 ? gradedTs[gradedTs.length - 1].slice(0, 10) : null;
  // 打完對帳的場數(有勝負 + 五五波)· 讓「25 鎖死 = 22 待打 + N 打完」對得起來
  // (原本只報 decided · 五五波那場憑空消失 → 數字兜不攏 = 看起來像壞掉)。
  const played = decided.length + noLine;
  // 滿 30 場才報總準度(同 CPBL / /calibration 同一把尺)· 之前才幾場就用大字「命中 0」
  // 等於違反自己「幾場是運氣不是準度」原則 + 讓正確數字讀起來像引擎壞掉。
  const firm = decided.length >= 30;

  return (
    <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-12">
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-7">
        <div className="flex items-baseline gap-3 flex-wrap mb-3">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
            MLB 引擎 · 賽後對帳
          </p>
          <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80">
            賽前鎖定 · 賽後對帳
          </span>
        </div>
        <p className="text-mute/90 text-sm leading-relaxed mb-5 max-w-2xl">
          棒球就是棒球 —— MLB 跟 CPBL <span className="text-bone">同一套引擎</span>:
          每天自動抓 MLB 官方先發投手數據、<span className="text-bone">賽前鎖定開盤線</span>
          (留時間戳、改不了)· 賽後自動對「當初鎖的那個數字」結算 ·{" "}
          <span className="text-gold">落空照掛、永不刪</span>。 樣本累積比 CPBL 快很多 ·
          跟 CPBL 戰績分開計(不讓一個聯盟的雜訊污染另一個)。
        </p>
        {/* 主角 = 「賽前鎖死 N 場」(N 個改不了的承諾)+ 完整戰績(✓ 與 ✕ 同等大方秀)·
            不是軟弱的「準度 —」框。 我們的肌肉是「敢全攤開、連輸都掛」· 不是準度%
            (57% 當大字弱 + 要 30 場才誠實)。 % 退到 /calibration 深頁當細節。 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat
            label="賽前鎖死"
            value={String(total)}
            sub={`${pending} 場還沒打 · 改不了`}
            tone="gold"
          />
          {/* 打完對帳 = 有勝負 + 五五波 · 讓 25 = 22 待打 + 這格 對得起來(修兜不攏) */}
          <Stat
            label="打完對帳"
            value={String(played)}
            sub={noLine > 0 ? `${noLine} 場五五波不計` : "已對帳"}
            tone="bone"
          />
          <Stat
            label="✓ 命中"
            value={String(proved)}
            sub={`${decided.length} 場有看好邊`}
            tone="gold"
          />
          {/* ✕ 落空照掛、同等大方 —— 這格報馬仔永遠不敢有(Pratfall · 不藏輸) */}
          <Stat label="✕ 落空" value={String(diverged)} sub="照掛 · 刪不掉" tone="bone" />
        </div>
        {/* 小樣本誠實:才幾場分勝負時 · 別讓「命中 0」大字讀成「引擎壞掉/爛掉」的判決
            (那違反自己「幾場是運氣不是準度」原則)。 跟 CPBL / /calibration 同一把尺:
            滿 30 場才報準度。 輸的照掛(Pratfall 不藏輸)· 只是用文字框成「還太早」不是「判決」。 */}
        {!firm && decided.length > 0 && (
          <p className="mt-4 border-l-2 border-gold/55 bg-gold/[0.05] pl-4 py-2.5 text-mute/90 text-[13px] leading-relaxed">
            才 <span className="font-mono text-bone tabular">{decided.length}</span> 場分出勝負 ——
            <span className="text-bone"> 還看不出引擎準不準</span>。 棒球幾場的輸贏是運氣,
            賽前再看好也可能爆冷;跟 CPBL 同一把尺,<span className="text-bone">滿 30 場才報總準度</span>。
            這幾場的輸 · 一樣照掛、永不刪。
          </p>
        )}
        <p className="mt-3 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
          引擎開盤公式公開(主場優勢 + 先發投手 ERA / K9 / HR9)。
          {firm && rate !== null && (
            <span className="text-gold/80"> 目前總準度 {rate}% ·</span>
          )}
          {voided > 0 && (
            <span className="text-mute/75"> {voided} 場延賽改期停審(退回不計)·</span>
          )}
          {lastUpdated && (
            <span className="text-mute/75"> 最後對帳 {lastUpdated}</span>
          )}{" "}
          <Link
            href="/calibration"
            className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
          >
            說幾成、實際中幾成 · MLB 校準曲線 →
          </Link>
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
