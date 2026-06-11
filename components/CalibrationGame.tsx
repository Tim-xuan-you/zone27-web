"use client";

import { useState } from "react";
import Link from "next/link";

// ── ZONE 27 · 校準小遊戲(Solo Calibration Game)─────────────
// 「缺的靈魂」研究頭號發現:全站揭露護城河已世界級、幾乎做完 —— 缺的不是更多
// 揭露頁,而是讓一個訪客「自己玩一次、親身發現」品牌的核心命題(沒人能算命 ·
// 57% 是天花板)。 機制:拿已打完的 CPBL 比賽、藏住比分 + 引擎開盤 · 讓訪客逐場
// 滑「主隊勝率 %」· 攤開後對照「你以為的把握 vs 實際中幾成」+ 你 vs 引擎 + 45°
// 校準散點。 Metaculus/Open Philanthropy「Calibrate Your Judgment」retrodiction
// pattern · 0 用戶就成立(單人鏡子)· 0 Tim 工 · 純 client。
//
// ⚠ 這不是押注 · 不進戰績 · 不上天梯(不違反 R188 註冊閘門 · 別跟「免登入押注」
// 混淆)· 純自我校準練習(用打完的比賽)= 看免費的教育層。
//
// 連續信心(slider %)而非二元選邊 → 畫得出 45° 校準(舊 /member/calibration 因
// 二元押注畫不出曲線被收掉;這裡訪客自己給「機率」就成立)。
// ─────────────────────────────────────────────────────

export type QuizMatch = {
  id: string;
  date: string; // compact "06/03(三)"
  venue: string;
  homeName: string;
  awayName: string;
  homePitcher: string;
  homeEra: string;
  awayPitcher: string;
  awayEra: string;
  homeRecent: ("W" | "L")[];
  awayRecent: ("W" | "L")[];
  // ── 藏到攤開才用 ──
  winner: "home" | "away";
  engineHomePct: number;
  engineAwayPct: number;
};

export default function CalibrationGame({ matches }: { matches: QuizMatch[] }) {
  // picks[id] = 訪客給主隊的勝率 %(0-100 · 50 = 銅板局)
  const [picks, setPicks] = useState<Record<string, number>>(() =>
    Object.fromEntries(matches.map((m) => [m.id, 50]))
  );
  const [revealed, setRevealed] = useState(false);

  const setPick = (id: string, v: number) =>
    setPicks((p) => ({ ...p, [id]: v }));

  const reset = () => {
    setPicks(Object.fromEntries(matches.map((m) => [m.id, 50])));
    setRevealed(false);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const score = revealed ? computeScore(matches, picks) : null;

  return (
    <div className="space-y-4">
      {/* 進度 / 攤開列 · sticky 讓玩到一半也按得到 */}
      {!revealed && (
        <div className="sticky top-2 z-10 flex items-center justify-between gap-3 bg-navy/85 backdrop-blur border border-gold/30 px-4 py-2.5 rounded">
          <span className="font-mono text-mute text-[10px] tracking-[0.2em]">
            {matches.length} 場 · 滑出你的把握
          </span>
          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              if (typeof window !== "undefined")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-5 py-2 bg-gold text-navy font-mono text-[11px] tracking-[0.25em] hover:bg-gold-soft transition-colors"
          >
            攤開結果 →
          </button>
        </div>
      )}

      {/* 攤開後 · 結果分析放最上面(峰終) */}
      {revealed && score && <ResultPanel score={score} />}

      {/* 逐場卡 */}
      <div className="space-y-3">
        {matches.map((m, i) => (
          <QuizCard
            key={m.id}
            index={i + 1}
            match={m}
            homePct={picks[m.id] ?? 50}
            onChange={(v) => setPick(m.id, v)}
            revealed={revealed}
          />
        ))}
      </div>

      {revealed && score && (
        <div className="pt-2">
          <ResultPanelFooter onReset={reset} score={score} />
        </div>
      )}
    </div>
  );
}

// ── 單場預測卡 ─────────────────────────────────────────
function QuizCard({
  index,
  match: m,
  homePct,
  onChange,
  revealed,
}: {
  index: number;
  match: QuizMatch;
  homePct: number;
  onChange: (v: number) => void;
  revealed: boolean;
}) {
  const awayPct = 100 - homePct;
  const leaned = homePct !== 50;
  const pickedHome = homePct > 50;
  const correct =
    leaned &&
    ((pickedHome && m.winner === "home") ||
      (!pickedHome && m.winner === "away"));

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-mute/60 text-[9px] tracking-[0.25em] tabular">
          / {String(index).padStart(2, "0")} · {m.date} · {m.venue}
        </span>
        {revealed && leaned && (
          <span
            className={`font-mono text-[9px] tracking-[0.2em] px-1.5 py-0.5 border ${
              correct ? "border-gold text-gold" : "border-loss/70 text-loss"
            }`}
          >
            {correct ? "✓ 你猜對" : "✕ 你猜錯"}
          </span>
        )}
      </div>

      {/* 對戰 · 兩隊 + 投手(夠你預測)· 藏引擎 % 與比分 */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
        <TeamCol
          label="客 AWAY"
          name={m.awayName}
          pitcher={m.awayPitcher}
          era={m.awayEra}
          recent={m.awayRecent}
          align="left"
          win={revealed && m.winner === "away"}
        />
        <span className="font-mono text-gold/50 text-xs tracking-[0.2em]">VS</span>
        <TeamCol
          label="主 HOME"
          name={m.homeName}
          pitcher={m.homePitcher}
          era={m.homeEra}
          recent={m.homeRecent}
          align="right"
          win={revealed && m.winner === "home"}
        />
      </div>

      {!revealed ? (
        <>
          {/* 你的把握 readout */}
          <div className="flex items-baseline justify-between mb-1.5 font-mono text-[11px] tracking-[0.15em] tabular">
            <span className={awayPct > 50 ? "text-gold" : "text-mute"}>
              {m.awayName.slice(0, 4)} {awayPct}%
            </span>
            <span className="text-mute/50 text-[9px]">你的盤</span>
            <span className={homePct > 50 ? "text-gold" : "text-mute"}>
              {m.homeName.slice(0, 4)} {homePct}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={homePct}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={`${m.awayName} 對 ${m.homeName} · 你給主隊的勝率 ${homePct}%`}
            aria-valuetext={`主隊 ${homePct}% · 客隊 ${100 - homePct}%`}
            className="w-full cursor-pointer"
            style={{ accentColor: "var(--zone-gold)" }}
          />
          <p className="mt-1 font-mono text-mute/45 text-[8px] tracking-[0.25em] text-center">
            拖到中間 = 銅板局 · 越往一邊 = 你越有把握
          </p>
        </>
      ) : (
        <RevealRow match={m} homePct={homePct} />
      )}
    </article>
  );
}

function TeamCol({
  label,
  name,
  pitcher,
  era,
  recent,
  align,
  win,
}: {
  label: string;
  name: string;
  pitcher: string;
  era: string;
  recent: ("W" | "L")[];
  align: "left" | "right";
  win: boolean;
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="font-mono text-mute text-[8px] tracking-[0.3em] mb-1">
        {label}
      </p>
      <h3
        className={`text-base sm:text-lg font-light tracking-tight leading-snug ${
          win ? "text-gold" : "text-bone"
        }`}
      >
        {name}
        {win && <span className="text-gold/80 text-[10px] ml-1">W</span>}
      </h3>
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.12em] mt-1 leading-snug">
        {pitcher} · ERA <span className="tabular">{era}</span>
      </p>
      <p className="font-mono text-[9px] tracking-[0.15em] mt-0.5">
        {recent.map((r, i) => (
          <span key={i} className={r === "W" ? "text-gold/70" : "text-mute/50"}>
            {r}
          </span>
        ))}
      </p>
    </div>
  );
}

// 攤開後一場的「你 vs 引擎 vs 實際」對照
function RevealRow({ match: m, homePct }: { match: QuizMatch; homePct: number }) {
  const engineHome = m.engineHomePct >= m.engineAwayPct;
  const engineFav = engineHome ? m.homeName : m.awayName;
  const enginePct = Math.max(m.engineHomePct, m.engineAwayPct);
  const engineCorrect =
    (engineHome && m.winner === "home") ||
    (!engineHome && m.winner === "away");
  const youText =
    homePct === 50
      ? "你說銅板局"
      : `你給 ${homePct > 50 ? m.homeName.slice(0, 4) : m.awayName.slice(0, 4)} ${
          homePct > 50 ? homePct : 100 - homePct
        }%`;
  return (
    <div className="border-t border-line/40 pt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10px] tracking-[0.12em]">
      <span className="text-mute/85">{youText}</span>
      <span className="text-mute/85 text-right">
        引擎看好 {engineFav.slice(0, 4)} {enginePct}%{" "}
        <span className={engineCorrect ? "text-gold/70" : "text-loss/60"}>
          {engineCorrect ? "✓" : "✕"}
        </span>
      </span>
      <span className="col-span-2 text-bone/80">
        實際:{m.winner === "home" ? m.homeName : m.awayName} 贏
      </span>
    </div>
  );
}

// ── 攤開分析(峰終)──────────────────────────────────────
type Score = ReturnType<typeof computeScore>;

function computeScore(matches: QuizMatch[], picks: Record<string, number>) {
  let decided = 0;
  let youHits = 0;
  let confSum = 0;
  let engineHits = 0;
  let engineDecided = 0;
  // 信心分桶(訪客)· 給 45° 散點
  const buckets: { lo: number; hi: number; n: number; hits: number; confSum: number }[] =
    [
      { lo: 50, hi: 62, n: 0, hits: 0, confSum: 0 },
      { lo: 62, hi: 75, n: 0, hits: 0, confSum: 0 },
      { lo: 75, hi: 88, n: 0, hits: 0, confSum: 0 },
      { lo: 88, hi: 101, n: 0, hits: 0, confSum: 0 },
    ];

  for (const m of matches) {
    const homePct = picks[m.id] ?? 50;
    // 引擎
    const engineHome = m.engineHomePct >= m.engineAwayPct;
    if (m.engineHomePct !== m.engineAwayPct) {
      engineDecided++;
      if (
        (engineHome && m.winner === "home") ||
        (!engineHome && m.winner === "away")
      )
        engineHits++;
    }
    // 訪客
    if (homePct === 50) continue; // 銅板局不計入「你押對幾場」
    decided++;
    const pickedHome = homePct > 50;
    const conf = pickedHome ? homePct : 100 - homePct;
    confSum += conf;
    const correct =
      (pickedHome && m.winner === "home") ||
      (!pickedHome && m.winner === "away");
    if (correct) youHits++;
    const b = buckets.find((x) => conf >= x.lo && conf < x.hi);
    if (b) {
      b.n++;
      b.confSum += conf;
      if (correct) b.hits++;
    }
  }

  const youHitPct = decided > 0 ? Math.round((youHits / decided) * 100) : null;
  const avgConf = decided > 0 ? Math.round(confSum / decided) : null;
  const gap = youHitPct !== null && avgConf !== null ? avgConf - youHitPct : null;
  const dots = buckets
    .filter((b) => b.n > 0)
    .map((b) => ({
      x: Math.round(b.confSum / b.n), // 平均把握
      y: Math.round((b.hits / b.n) * 100), // 實際中
      n: b.n,
    }));

  return {
    total: matches.length,
    decided,
    youHits,
    youHitPct,
    avgConf,
    gap,
    engineHits,
    engineDecided,
    dots,
  };
}

function ResultPanel({ score: s }: { score: Score }) {
  // 校準裁決(誠實 · 不羞辱)· gap = 你以為的把握 − 實際
  let verdict: { head: string; body: string };
  if (s.decided === 0) {
    verdict = {
      head: "你每一場都說銅板局",
      body: "全押 50/50 也是一種誠實 —— 但試著真的選一邊、給個把握,才看得出你的校準。再玩一次?",
    };
  } else if (s.gap !== null && s.gap > 12) {
    verdict = {
      head: `你高估了自己 ${s.gap} 個百分點`,
      body: "跟大多數人一樣 —— 你以為的把握,比實際中的高出一截。這不丟臉:這正是「過度自信」,也正是賣明牌的人利用的東西。連最強的引擎都只能到 5 成 7。",
    };
  } else if (s.gap !== null && s.gap < -8) {
    verdict = {
      head: "你太保守了",
      body: "你其實比自己以為的準 —— 把握給太低。少數人會這樣。下次敢一點。",
    };
  } else {
    verdict = {
      head: "你算誠實的",
      body: "你的把握,跟實際中的差不多 —— 這叫「校準良好」,多數人辦不到。你沒有騙自己。",
    };
  }

  return (
    <div className="bg-gold/5 border border-gold/50 glow-soft p-5 sm:p-7 enter-fade-up">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        / 攤開 · 你剛剛也是一台預測引擎
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight mb-3">
        {verdict.head}
      </h2>
      <p className="text-mute leading-relaxed mb-6 max-w-xl">{verdict.body}</p>

      {/* 三個數字 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatBox
          label="你押對"
          value={`${s.youHits}/${s.decided}`}
          tone="bone"
        />
        <StatBox
          label="你以為的把握"
          value={s.avgConf !== null ? `${s.avgConf}%` : "—"}
          tone="mute"
        />
        <StatBox
          label="實際中"
          value={s.youHitPct !== null ? `${s.youHitPct}%` : "—"}
          tone="gold"
        />
      </div>

      {/* 你 vs 引擎(誠實:小樣本你贏引擎也可能只是運氣 = 課本身)*/}
      <div className="border-t border-gold/20 pt-4 mb-6">
        <p className="text-mute/85 text-sm leading-relaxed">
          同樣這 {s.engineDecided} 場 · 引擎押對{" "}
          <span className="font-mono text-bone tabular">{s.engineHits}</span> 場 ·
          你押對{" "}
          <span className="font-mono text-gold tabular">{s.youHits}</span> 場。{" "}
          {s.decided > 0 && s.youHits >= s.engineHits ? (
            <span className="text-mute/70">
              你這次贏過引擎 —— 但別高興太早:幾場的樣本,運氣占很大。這正是為什麼我們講「樣本要夠」。
            </span>
          ) : (
            <span className="text-mute/70">
              贏不過引擎很正常 —— 但引擎也只是逼近那道 5 成 7 的牆,不是神。
            </span>
          )}
        </p>
      </div>

      {/* 45° 校準散點(你的點)· 同 /calibration 引擎自評那張圖的語言 */}
      {s.dots.length > 0 && (
        <div className="border-t border-gold/20 pt-5">
          <p className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-1">
            / 你說幾成 vs 實際中幾成
          </p>
          <p className="text-mute/70 text-[12px] leading-relaxed mb-3 max-w-md">
            橫軸=你給的把握、直軸=實際中的成數。 點落在金線上 = 你說幾成就真的中幾成(校準準)。
            點在金線右下 = 你太有把握了。 點少 · 這只是你今天這幾手。
          </p>
          <CalibScatter dots={s.dots} />
        </div>
      )}

      {/* 57% 天花板 tie-in(品牌核心命題 · 親手摸到)*/}
      <div className="border-t border-gold/20 pt-5 mt-5">
        <p className="text-bone text-lg sm:text-xl font-light leading-relaxed">
          沒有人是神。 連我們的引擎,天花板也大概在{" "}
          <span className="text-gold">5 成 7</span>。
        </p>
        <p className="mt-2 text-mute leading-relaxed max-w-xl">
          你剛剛親手摸到了那道牆 —— 這就是為什麼任何喊「94% 神準」的人,
          數學上不可能。 ZONE 27 不裝準 · 只敢把這道天花板掛出來、逐場對帳。
        </p>
      </div>
    </div>
  );
}

function ResultPanelFooter({
  onReset,
  score,
}: {
  onReset: () => void;
  score: Score;
}) {
  // C3(轉換 agent)· 剛親手摸到「我太有把握」= 最高意圖時刻 · 原本三個等重 outline 鈕、
  // 真正的轉換鏈藏在第三個 → 主轉換做成實心金 · 另兩個降為安靜文字鏈(一個焦點)。
  return (
    <div className="flex flex-col items-center gap-3">
      <Link
        href="/login?next=/matches"
        className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] px-7 py-3 hover:bg-gold-soft transition-colors"
      >
        開始記你的真實戰績 →
      </Link>
      <p className="font-mono text-mute/55 text-[9px] tracking-[0.2em] leading-relaxed text-center">
        免費 · 押一邊,賽後自動掛準 / 不準、刪不掉
      </p>
      {/* 病毒回路:剛照完鏡子那刻最想「叫朋友也來試」· 分享的是你的成績(不洩題)·
          朋友點進去是全新一局、撞自己的牆 = Wordle 式不劇透招募。 純前端 · 0 後端。 */}
      <ShareResultButton score={score} />
      <div className="flex flex-wrap items-center gap-5 justify-center mt-1">
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
        >
          ↻ 再玩一次
        </button>
        <Link
          href="/calibration"
          className="font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
        >
          看引擎自己的準度 →
        </Link>
      </div>
    </div>
  );
}

// 把校準結果做成一句不洩題、會招募的分享文 —— 自己的成數(可炫/可自嘲)+ 一條乾淨連結。
// 朋友點進去看不到你的答案,是全新一局,得自己撞那道 57% 的牆(= 病毒擴散的真正引擎)。
function buildShareLine(s: Score): string {
  if (s.decided === 0 || s.avgConf === null || s.youHitPct === null) {
    return "我剛測了自己判斷比賽有多準 —— 沒有人是神。換你也來測測看(60 秒):";
  }
  if (s.gap !== null && s.gap > 12) {
    return `我以為自己有 ${s.avgConf}% 把握,實際只中 ${s.youHitPct}% —— 連我都沒那麼準。換你測測你有多準:`;
  }
  if (s.gap !== null && s.gap < -8) {
    return `我說 ${s.avgConf}% 把握、實際中了 ${s.youHitPct}% —— 原來我太保守。換你測測自己的判斷:`;
  }
  return `我測了自己判斷比賽的校準:說 ${s.avgConf}% 把握、實際中 ${s.youHitPct}%,算誠實的。換你也試試:`;
}

function ShareResultButton({ score }: { score: Score }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const line = buildShareLine(score);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/calibration/test`
        : "https://zone27-web.vercel.app/calibration/test";
    // 手機原生分享面板優先(LINE / IG / 訊息一鍵)· 桌機沒有 → 退回複製到剪貼簿。
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "ZONE 27 · 你有多準?", text: line, url });
        return;
      } catch {
        // 使用者取消或失敗 → 落到複製
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${line}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // 連剪貼簿都沒有 → 安靜略過(不報錯嚇人)
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="分享你的校準結果 · 不洩題 · 朋友點進去是全新一局"
      className="inline-flex items-center gap-2 border border-gold/45 hover:border-gold hover:bg-gold/5 text-gold font-mono text-[11px] tracking-[0.2em] px-5 py-2.5 transition-colors"
    >
      {copied ? "已複製 · 貼給朋友" : "把這面鏡子傳給朋友 →"}
    </button>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "gold" | "bone" | "mute";
}) {
  const color =
    tone === "gold" ? "text-gold" : tone === "bone" ? "text-bone" : "text-mute";
  return (
    <div className="bg-slate/40 border border-line/50 p-3 text-center">
      <p
        className={`font-mono ${color} tabular text-2xl sm:text-3xl font-light leading-none mb-1.5`}
      >
        {value}
      </p>
      <p className="font-mono text-mute/65 text-[9px] tracking-[0.15em] leading-tight">
        {label}
      </p>
    </div>
  );
}

// 你的校準散點 · 重用 /calibration 引擎自評圖的 px/py + 45° 金線語言
function CalibScatter({ dots }: { dots: { x: number; y: number; n: number }[] }) {
  const px = (pct: number) => 40 + (pct / 100) * 340;
  const py = (pct: number) => 360 - (pct / 100) * 340;
  return (
    <div className="aspect-square max-w-sm mx-auto">
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="你的校準散點 · 你給的把握對上實際中的成數"
      >
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={px(0)} y1={py(v)} x2={px(100)} y2={py(v)} stroke="rgba(138,147,168,0.12)" strokeWidth="1" />
            <line x1={px(v)} y1={py(0)} x2={px(v)} y2={py(100)} stroke="rgba(138,147,168,0.12)" strokeWidth="1" />
          </g>
        ))}
        <line x1={px(0)} y1={py(0)} x2={px(100)} y2={py(0)} stroke="rgba(138,147,168,0.6)" strokeWidth="1" />
        <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(100)} stroke="rgba(138,147,168,0.6)" strokeWidth="1" />
        {/* 45° 完美校準金線 */}
        <line x1={px(0)} y1={py(0)} x2={px(100)} y2={py(100)} stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" />
        {/* 你的點 */}
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={px(d.x)}
            cy={py(d.y)}
            r={Math.min(4 + d.n * 1.5, 12)}
            fill="#D4AF37"
            fillOpacity={0.85}
            stroke="#0F1A2E"
            strokeWidth="1"
          />
        ))}
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <text x={px(v)} y={py(0) + 18} fontSize="10" fontFamily="monospace" fill="rgba(138,147,168,0.85)" textAnchor="middle">
              {v}%
            </text>
            <text x={px(0) - 8} y={py(v) + 3} fontSize="10" fontFamily="monospace" fill="rgba(138,147,168,0.85)" textAnchor="end">
              {v}%
            </text>
          </g>
        ))}
        <text x={px(50)} y={py(0) + 36} fontSize="9" fontFamily="monospace" fill="rgba(212,175,55,0.85)" textAnchor="middle" letterSpacing="0.18em">
          你給的把握
        </text>
        <text x={px(0) - 32} y={py(50)} fontSize="9" fontFamily="monospace" fill="rgba(212,175,55,0.85)" textAnchor="middle" letterSpacing="0.18em" transform={`rotate(-90 ${px(0) - 32} ${py(50)})`}>
          實際中幾成
        </text>
      </svg>
    </div>
  );
}
