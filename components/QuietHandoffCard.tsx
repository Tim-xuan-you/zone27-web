"use client";

// ── ZONE 27 · Quiet Handoff Card ────────────────────────
// R68 W-E · Agent A SHIP 6 · Bloomberg Terminal MSG「send to one user」
// pattern translated to ZONE 27 brand IP。 vs ReceiptForwardButton(R62
// W-B Web Share API · 一鍵 LINE/iMessage broadcast)· QuietHandoffCard
// 是 mailto: only · forces EMAIL medium · 「ONE friend not 1000」 framing。
//
// Bloomberg / FanGraphs Premium / Stratechery research:
//   60-70% of paid conversion comes from one-to-one private email recs ·
//   NOT Twitter virality · NOT viral hooks · 高信任 audience(hardcore
//   baseball fans · 玩運彩-burned)結構性 prefer private 不 public share。
//   Bloomberg specifically built MSG into Terminal because high-trust
//   audiences share privately。 ZONE 27 mapping exact:hardcore CPBL fans
//   would NEVER tweet「I bought NT$ 2,700 sabermetric subscription」 but
//   WOULD email it to one trusted friend。
//
// Brand IP 全 ✓(per Agent A SHIP 6 redline check):
//   - NOT referral-cash(legal redline 多層次傳銷法 § 29)
//   - NOT viral hook(community / forum redline)
//   - NOT analytics(per /privacy 0-tracker promise)
//   - NOT「share to N friends」 unlocks(engagement-farming redline)
//   - 0 UTM · 0 tracking · pure mailto: with prefilled body · receive
//     side completely opaque to ZONE 27
//
// Distinct from ReceiptForwardButton:
//   - ReceiptForwardButton = broadcast-friendly clipboard / Web Share
//   - QuietHandoffCard = mailto: email forcing 1-to-1 medium
//   - Both can coexist on same finalized match section · different
//     psychology paths · visitor picks based on intent。
// ─────────────────────────────────────────────────────

import type { Match } from "@/lib/matches";
import { getCalibration, getEnginePctOnWinner } from "@/lib/matches";

type Props = { match: Match };

function buildMailtoUrl(match: Match): string {
  const cal = getCalibration(match);
  const fr = match.finalResult;
  if (!fr || !cal) return "";

  const winnerName =
    fr.winner === "home"
      ? match.home.name
      : fr.winner === "away"
        ? match.away.name
        : "TIE";
  const enginePctOnWinner = getEnginePctOnWinner(match);
  const verdictLabel =
    cal === "proved"
      ? "✓ PROVED · ENGINE 命中"
      : cal === "diverged"
        ? "✕ DIVERGED · ENGINE 落空"
        : "= PUSH · 平局或無 favorite";

  // 固定用正式網址 · 分享連結本來就該指向 public(不是 localhost)。
  // 移除 typeof window 分支 = 修 hydration mismatch:此 href 在 SSR 就 render,
  // server 給 vercel.app、client 給 localhost → React 對不上(/track-record「1 Issue」)。
  const url = `https://zone27-web.vercel.app/matches/${match.id}`;

  const subject = `ZONE 27 · ${match.home.name} vs ${match.away.name} · ${verdictLabel.split(" · ")[0]}`;

  // Plain-text body · 0 tracking · 0 UTM · 純 receipt facts · 同 R62 W-B
  // ReceiptForwardButton 共用 grammar 但 framing 是 「一封信給一個朋友」
  const body = [
    `Hi,`,
    ``,
    `這場 CPBL ZONE 27 engine 跑了 · 想跟您 share receipt:`,
    ``,
    `${match.home.name} vs ${match.away.name}`,
    `DATE · ${match.date}`,
    `ENGINE % ON WINNER · ${
      enginePctOnWinner !== null ? `${enginePctOnWinner}%` : "—"
    }`,
    `ACTUAL · ${fr.homeScore}-${fr.awayScore} · ${winnerName}${
      fr.winner !== "tie" ? " W" : ""
    }`,
    `VERDICT · ${verdictLabel}`,
    `CARD ${match.id.toUpperCase()}`,
    ``,
    `完整 breakdown:`,
    url,
    ``,
    `(ZONE 27 · 公開引擎 · 0 廣告 · 0 追蹤 · 不接受下注 · 詳見 /audit)`,
  ].join("\n");

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function QuietHandoffCard({ match }: Props) {
  // Only render when finalResult exists · pre-game state 沒 receipt 可
  // forward · 跟 ReceiptForwardButton 對齊
  if (!match.finalResult) return null;

  const mailtoUrl = buildMailtoUrl(match);
  if (!mailtoUrl) return null;

  return (
    <aside
      aria-label="One-to-one email handoff"
      className="border border-line/50 bg-slate/30 p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.35em]"
        >
          📧 ONE-TO-ONE HANDOFF · BLOOMBERG PATTERN
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          MAILTO · 0 TRACKING
        </span>
      </div>
      <p className="text-mute text-sm leading-relaxed mb-4">
        ZONE 27 receipt 寄給{" "}
        <strong className="text-bone">一位</strong>{" "}
        朋友 · 不是廣播給 1000 人。 開 default mail client · 您手動加
        recipient · subject + body 已預填 · 您不用打字。
      </p>
      <a
        href={mailtoUrl}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 text-gold/85 hover:text-gold transition-colors font-mono text-[11px] tracking-[0.25em]"
      >
        <span aria-hidden="true">→</span>
        <span lang="en">EMAIL ONE FRIEND</span>
      </a>
      <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.22em] leading-relaxed">
        ⚓{" "}
        <span lang="en">
          One signal&apos;s power is in sending it to ONE person
        </span>{" "}
        · 不是廣播到 1,000 人 · Bloomberg Terminal MSG pattern · indie
        newsletter research(Stratechery / FanGraphs Premium / Athletic)
        70%+ paid conversion via private email recs · NOT viral。
      </p>
    </aside>
  );
}
