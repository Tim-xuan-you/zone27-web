"use client";

import { useEffect, useState } from "react";
import { getMyPredictionsClient } from "@/lib/predictions-market";
import { computeUserVerdict, isLatePick } from "@/lib/predictions";

// ── ZONE 27 · 收據蓋「本人這手 pick + 鎖定時戳」(soul-roadmap R208 #1 · close-the-loop b)──
// 收據頁(/receipts/[receiptId])是 SSG 靜態引擎收據,無本人 context。 這個 client island
// 在 hydrate 後抓「登入本人對這場的押注 + 鎖定時戳」蓋上去 —— 最可截圖的 proof:
// 報馬仔結構上掛不出「我賽前就鎖死的這一手、含輸、改不了」。
//
// 🔴 紅線:
//   · 含輸照掛 —— ✕落空跟 ✓命中同權重 · 文案不修飾。
//   · graceful:沒登入 / 沒押這場 / 開賽後才補登(isLatePick)/ 未結算 → 回 null(頁面乾淨)。
//     0 用戶時整個元件靜默消失 · 不掛「快去登入」CTA(不假裝有資料)。
//   · 先鎖後結用既有 isLatePick(顯示層防線 · 跟準度計算同一份判定)。
//   · mute 為主 · 只在隊名/命中點一個金 accent · 不上金邊金底(守 gold discipline)。
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  finalWinner: "home" | "away" | "tie" | null;
  startISO: string | null;
  homeName: string;
  awayName: string;
};

// ISO 時戳 → 「6月9日 18:35」(台北)· client-only render · 無 hydration 風險(掛載後才填)。
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

export default function UserReceiptPick({
  matchId,
  finalWinner,
  startISO,
  homeName,
  awayName,
}: Props) {
  const [ready, setReady] = useState(false);
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  const [ts, setTs] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const map = await getMyPredictionsClient();
      if (!alive) return;
      const entry = map[matchId];
      if (entry && (entry.pick === "home" || entry.pick === "away")) {
        setPick(entry.pick);
        setTs(entry.ts);
      }
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [matchId]);

  // graceful 隱藏:還沒抓完 / 沒押 / 未結算 / 開賽後才補登 → 不顯示。
  if (!ready || pick === null || finalWinner === null) return null;
  if (isLatePick(ts, startISO)) return null;

  const verdict = computeUserVerdict(pick, finalWinner); // proved | diverged | push
  const teamName = pick === "home" ? homeName : awayName;
  const when = fmtTaipei(ts);

  const mark = verdict === "proved" ? "✓" : verdict === "diverged" ? "✕" : "=";
  const markColor =
    verdict === "proved"
      ? "text-gold"
      : verdict === "diverged"
        ? "text-loss/85"
        : "text-mute";
  const verdictWord =
    verdict === "proved" ? "命中了" : verdict === "diverged" ? "落空了" : "平";

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
