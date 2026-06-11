"use client";

import { useEffect, useState } from "react";
import { getMySoccerPicks, type SoccerPick } from "@/lib/soccer/predictions";
import { getMyCalibrationPicks, getMyRationales } from "@/lib/predictions-market";

// ── ZONE 27 · 足球收據蓋「本人這手 pick」(soul R208 close-the-loop · 三向版)──────
// 足球單場收據(/receipts/fd-* · SoccerReceiptView)是 SSG/ISR,無本人 context。
// 這個 client island 在 hydrate 後抓「登入本人對這場的押注」蓋上去 ——
// 世界盃押完當下最想要的那張 proof:「我賽前就鎖死押了 X、含輸、改不了」。
//
// 兩種收據階段都蓋(R213 賽前可外傳收據):
//   · outcome === null(賽前鎖定中 / 已開賽待對帳)→「你賽前鎖了 X · 待對帳」(無 ✓/✕)。
//   · outcome 有值(已結算)→「你賽前押了 X · ✓命中 / ✕落空」(含輸照掛)。
//
// 🔴 紅線(同棒球 UserReceiptPick):
//   · 含輸照掛 —— ✕落空跟 ✓命中同權重、不修飾。 三向:押了「和局」結果是和 = ✓命中。
//   · graceful:沒登入 / 沒押這場 / 開賽後才補登(late-pick · ts ≥ 開賽)→ 回 null(收據乾淨)。
//   · 先鎖後結:用跟「你的足球戰績」同一份 late 判定(ts ≥ kickoffISO 剔除)· 不另搞一套 ·
//     賽前/賽後都套(賽前不可能 late · 已開賽待對帳的場剔除賽後補登 = 不假裝賽前鎖死)。
//   · mute 為主 · 命中/隊名點一個金 · 不上金邊金底(守 gold discipline)。
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  /** 賽後真實結果(三向)· null = 還沒結算(賽前鎖定中 / 待對帳)→ 蓋「待對帳」版 */
  outcome: SoccerPick | null;
  /** 開賽 UTC ISO · 先鎖後結 late-pick 剔除 */
  kickoffISO: string;
  homeName: string;
  awayName: string;
  /** 引擎當初鎖定看好的一邊(三向 argmax)· 給「你 vs 引擎 · 對賭/同調」對照 */
  enginePick: SoccerPick;
  /** 引擎看好那邊的顯示名(home/away 隊名 or「和局」) */
  engineLabel: string;
};

function fmtTaipei(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  try {
    return new Intl.DateTimeFormat("zh-Hant", {
      timeZone: "Asia/Taipei",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(t));
  } catch {
    return "";
  }
}

export default function SoccerUserReceiptPick({
  matchId,
  outcome,
  kickoffISO,
  homeName,
  awayName,
  enginePick,
  engineLabel,
}: Props) {
  const [ready, setReady] = useState(false);
  const [pick, setPick] = useState<SoccerPick | null>(null);
  const [ts, setTs] = useState<string>("");
  // 你押注時宣告的把握(校準大師 · 0021)· 收據上同時蓋「喊了幾成把握」= 比單純的 pick 更強的 flex。
  const [conf, setConf] = useState<number | null>(null);
  // 你賽前鎖的那句理由(押注理由 · 0024)· 沒寫 / migration 未套 / 未登入 → 空(graceful)。
  const [rationale, setRationale] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const [picks, calPicks, rats] = await Promise.all([
        getMySoccerPicks(),
        getMyCalibrationPicks(),
        getMyRationales(),
      ]);
      if (!alive) return;
      const mine = picks.find((p) => p.matchId === matchId);
      if (mine) {
        setPick(mine.pick);
        setTs(mine.ts);
      }
      const myConf = calPicks.find((c) => c.matchId === matchId);
      if (myConf) setConf(myConf.confidence);
      setRationale(rats[matchId] ?? "");
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [matchId]);

  // graceful 隱藏:還沒抓完 / 沒押這場 → 不顯示。
  if (!ready || pick === null) return null;
  // 先鎖後結:開賽後才押(ts ≥ 開賽)→ 不蓋在收據上(同戰績 late 剔除 · 不假裝賽前鎖死)。
  const t = Date.parse(ts);
  const k = Date.parse(kickoffISO);
  if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) return null;

  const teamName = pick === "home" ? homeName : pick === "away" ? awayName : "和局";
  const when = fmtTaipei(ts);
  // 你賽前鎖死的那句理由(押注理由 · 0024)· 賽前/賽後都掛(收據從「我押了 X」升級成「我押了 X,因為 Y」)。
  const rationaleBlock = rationale ? (
    <p className="mt-2 text-bone/90 text-[13px] sm:text-sm leading-relaxed">
      <span className="font-mono text-gold/60 text-[10px] tracking-[0.2em] mr-1.5">
        你賽前寫的
      </span>
      「{rationale}」
    </p>
  ) : null;

  // 還沒結算(賽前鎖定中 / 待對帳)→ 蓋「你賽前鎖了 X · 待對帳」(無 ✓/✕ · 不假裝有結果)。
  if (outcome === null) {
    return (
      <div className="px-5 sm:px-8 py-5 border-t border-line/40 bg-slate/20">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.35em] mb-2">
          / 你的這一手
        </p>
        <p className="text-bone text-base sm:text-lg leading-relaxed">
          <span className="font-mono text-gold mr-1.5">▸</span>
          你賽前鎖了 <span className="text-gold">{teamName}</span>
          {conf !== null && (
            <span className="text-gold/80"> · 喊 {conf / 10} 成把握</span>
          )}{" "}
          · <span className="text-mute/80">待對帳</span>
        </p>
        {rationaleBlock}
        {/* 你 vs 引擎:對賭 = 「我敢跟演算法對著幹」的炫耀物(金 · 病毒槓桿)· 同調 = mute。 */}
        {pick === enginePick ? (
          <p className="mt-1.5 font-mono text-mute/65 text-[11px] tracking-[0.08em]">
            跟引擎同調 · 都看好 {engineLabel}
          </p>
        ) : (
          <p className="mt-1.5 font-mono text-gold/85 text-[11px] tracking-[0.08em]">
            ▸ 你跟引擎對賭 —— 引擎偏 {engineLabel}、你押 {teamName} · 賽後見真章
          </p>
        )}
        {when && (
          <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] tabular">
            鎖定於 {when} · 賽前鎖死 · 改不了 · 賽後自動揭曉命中或落空
          </p>
        )}
      </div>
    );
  }

  const hit = pick === outcome; // 三向:押的邊 == 結果(押和、結果和 = 命中)
  const mark = hit ? "✓" : "✕";
  const markColor = hit ? "text-gold" : "text-loss/85";
  const verdictWord = hit ? "命中了" : "落空了";

  return (
    <div className="px-5 sm:px-8 py-5 border-t border-line/40 bg-slate/20">
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.35em] mb-2">
        / 你的這一手
      </p>
      <p className="text-bone text-base sm:text-lg leading-relaxed">
        <span className={`font-mono ${markColor} mr-1.5`}>{mark}</span>
        你賽前押了 <span className="text-gold">{teamName}</span>
        {conf !== null && (
          <span className="text-gold/80"> · 喊 {conf / 10} 成把握</span>
        )}{" "}
        · <span className={markColor}>{verdictWord}</span>
      </p>
      {rationaleBlock}
      {/* 你 vs 引擎結果對照:你對它錯 = 你贏過引擎了(金 · 最爽的炫耀物)· 其餘含輸照誠實(mute)。 */}
      <EngineContrast hit={hit} engineHit={enginePick === outcome} />
      {when && (
        <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] tabular">
          鎖定於 {when} · 賽前鎖死 · 改不了
        </p>
      )}
    </div>
  );
}

// 賽後「你 vs 引擎」四象限:你對它錯=你贏過引擎(金 · 炫耀物)· 其餘含輸照誠實(mute · 無紅綠)。
function EngineContrast({ hit, engineHit }: { hit: boolean; engineHit: boolean }) {
  if (hit && !engineHit) {
    return (
      <p className="mt-1.5 font-mono text-gold/90 text-[11px] tracking-[0.08em]">
        ▸ 引擎沒看好你押的這邊 —— 你贏過引擎了
      </p>
    );
  }
  const text =
    !hit && engineHit
      ? "這場引擎看對了 · 你沒中"
      : hit && engineHit
        ? "你跟引擎都看好這邊 · 一起中了"
        : "你跟引擎都看走眼了 · 含輸照留";
  return (
    <p className="mt-1.5 font-mono text-mute/65 text-[11px] tracking-[0.08em]">{text}</p>
  );
}
