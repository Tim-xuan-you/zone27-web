"use client";

import { useEffect, useState } from "react";
import { getMyPredictionsClient, getMyRationales } from "@/lib/predictions-market";
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
  /** 賽前可外傳收據(R220)· true 時 finalWinner=null 不再隱藏,改蓋「你賽前押了 X · 待對帳」。
   *  預設 false → 賽後收據頁(原本唯一用法)行為完全不變(未結算就隱藏)。 */
  pending?: boolean;
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
  pending = false,
}: Props) {
  const [ready, setReady] = useState(false);
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  const [ts, setTs] = useState<string>("");
  // 你賽前鎖的那句理由(押注理由 · 0024)· 沒寫 / migration 未套 / 未登入 → 空字串(graceful 不顯示)。
  const [rationale, setRationale] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const [map, rats] = await Promise.all([
        getMyPredictionsClient(),
        getMyRationales(),
      ]);
      if (!alive) return;
      const entry = map[matchId];
      if (entry && (entry.pick === "home" || entry.pick === "away")) {
        setPick(entry.pick);
        setTs(entry.ts);
      }
      setRationale(rats[matchId] ?? "");
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [matchId]);

  // graceful 隱藏:還沒抓完 / 沒押這場 → 不顯示。
  if (!ready || pick === null) return null;
  // 先鎖後結:開賽後才補登 → 不蓋在收據上(同準度 late 剔除 · 不假裝賽前鎖死)。
  if (isLatePick(ts, startISO)) return null;

  const teamName = pick === "home" ? homeName : awayName;
  const when = fmtTaipei(ts);
  // 你賽前鎖死的那句理由(押注理由 · 0024)· 賽前 / 賽後都掛(讓收據從「我押了 X」升級成「我押了 X,因為 Y」)。
  const rationaleBlock = rationale ? (
    <p className="mt-2 text-bone/90 text-[13px] sm:text-sm leading-relaxed">
      <span className="font-mono text-gold/60 text-[10px] tracking-[0.2em] mr-1.5">
        你賽前寫的
      </span>
      「{rationale}」
    </p>
  ) : null;

  // 還沒結算 · 賽前鎖定中 / 待對帳:
  //   · pending(賽前可外傳收據 R220)→ 蓋「你賽前押了 X · 待對帳」(無 ✓/✕ · 不假裝有結果)。
  //   · 非 pending(賽後收據頁但結果還沒進來)→ 維持原行為隱藏(收據乾淨)。
  if (finalWinner === null) {
    if (!pending) return null;
    return (
      <div className="px-5 sm:px-8 py-5 border-t border-line/40 bg-slate/20">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.35em] mb-2">
          / 你的這一手
        </p>
        <p className="text-bone text-base sm:text-lg leading-relaxed">
          <span className="font-mono text-gold mr-1.5">▸</span>
          你賽前押了 <span className="text-gold">{teamName}</span> ·{" "}
          <span className="text-mute/80">待對帳</span>
        </p>
        {rationaleBlock}
        {when && (
          <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] tabular">
            鎖定於 {when} · 賽前鎖死 · 改不了 · 賽後自動揭曉命中或落空
          </p>
        )}
      </div>
    );
  }

  const verdict = computeUserVerdict(pick, finalWinner); // proved | diverged | push

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
      {rationaleBlock}
      {when && (
        <p className="mt-2 font-mono text-mute/70 text-[10px] tracking-[0.2em] tabular">
          鎖定於 {when} · 賽前鎖死 · 改不了
        </p>
      )}
    </div>
  );
}
