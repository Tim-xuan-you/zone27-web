"use client";

import { useEffect, useState } from "react";
import { getMySoccerPicks, type SoccerPick } from "@/lib/soccer/predictions";

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
}: Props) {
  const [ready, setReady] = useState(false);
  const [pick, setPick] = useState<SoccerPick | null>(null);
  const [ts, setTs] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const picks = await getMySoccerPicks();
      if (!alive) return;
      const mine = picks.find((p) => p.matchId === matchId);
      if (mine) {
        setPick(mine.pick);
        setTs(mine.ts);
      }
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

  // 還沒結算(賽前鎖定中 / 待對帳)→ 蓋「你賽前鎖了 X · 待對帳」(無 ✓/✕ · 不假裝有結果)。
  if (outcome === null) {
    return (
      <div className="px-5 sm:px-8 py-5 border-t border-line/40 bg-slate/20">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.35em] mb-2">
          / 你的這一手
        </p>
        <p className="text-bone text-base sm:text-lg leading-relaxed">
          <span className="font-mono text-gold mr-1.5">▸</span>
          你賽前鎖了 <span className="text-gold">{teamName}</span> ·{" "}
          <span className="text-mute/80">待對帳</span>
        </p>
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
        你賽前押了 <span className="text-gold">{teamName}</span> ·{" "}
        <span className={markColor}>{verdictWord}</span>
      </p>
      {when && (
        <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] tabular">
          鎖定於 {when} · 賽前鎖死 · 改不了
        </p>
      )}
    </div>
  );
}
