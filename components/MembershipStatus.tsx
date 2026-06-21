import type { ReactNode } from "react";
import {
  getMembershipStatus,
  formatUntilShort,
  type MembershipStatus as Status,
} from "@/lib/membership";

// ── ZONE 27 · 會員到期狀態卡(R252 · Defector 式誠實日期、零催繳)──────────────
// /member 上,付費會員看自己的 BLACK 撐到哪天 + 還有幾天。 免費會員 → 不 render(守極簡)。
// 🔴 不紅字、不倒數鐘、不 FOMO:「還有 N 天」是平靜的資訊,不是跳動的催繳鐘。 每種狀態都收在
//    「引擎 / 戰績永遠免費 · 離開也帶不走」= 把壓力卸掉、把這頁變成「你在支持」而不是「你快沒
//    access 了」。 不自動扣款是驕傲的功能(/integrity #13),不是要遮的缺點。 純 server component。
// ─────────────────────────────────────────────────────

export default function MembershipStatus({
  meta,
}: {
  meta: Record<string, unknown> | null | undefined;
}) {
  const s = getMembershipStatus(meta);
  if (!s.paid || s.state === "none") return null;
  return (
    <section
      aria-label="你的 BLACK 會員狀態"
      className="mt-6 border border-gold/30 bg-gold/[0.04] px-4 py-3.5 sm:px-5"
    >
      <Body s={s} />
    </section>
  );
}

function Body({ s }: { s: Status }) {
  if (s.state === "undated") {
    return (
      <>
        <Kicker>BLACK 會員</Kicker>
        <p className="text-bone text-sm leading-relaxed">
          有效期還沒設定 —— 跟 Tim 說一聲、或下次續訂時就會補上「有效到哪天」。
        </p>
      </>
    );
  }

  const until = s.until ? formatUntilShort(s.until) : "";
  const n = s.daysLeft ?? 0;

  if (s.state === "expired") {
    return (
      <>
        <Kicker>BLACK 會員 · 支持期已到</Kicker>
        <p className="text-bone text-sm leading-relaxed">
          你的支持期到 <span className="text-gold tabular">{until}</span> 為止。
        </p>
        <p className="text-mute text-[13px] leading-relaxed mt-2">
          想繼續隨時再轉一次,我幫你接上、不會少算天數。 沒空也完全沒關係 ——
          <span className="text-bone">引擎、你的戰績、校準永遠對你免費</span>,一個都帶不走。
          金色支持環和會員房間會先收起來,等你回來。
        </p>
      </>
    );
  }

  // active / expiring —— 平靜口吻,連「快到期」也不催不紅
  const daysLine = n === 0 ? "今天是最後一天" : `還有 ${n} 天`;
  return (
    <>
      <Kicker>BLACK 會員{s.state === "expiring" ? " · 快到期" : ""}</Kicker>
      <p className="text-bone text-sm leading-relaxed">
        有效到 <span className="text-gold tabular">{until}</span>
        <span className="text-mute/80 tabular"> · {daysLine}</span>
      </p>
      <p className="text-mute text-[13px] leading-relaxed mt-2">
        我們從不自動扣款。 到期前 Tim 會親手寄信提醒你,你再決定要不要續 ——
        <span className="text-bone">早一點續,天數不會少算</span>。
        {s.state === "expiring"
          ? " 不續也沒關係,引擎和你的戰績永遠免費、永遠都在。"
          : ""}
      </p>
    </>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-gold text-[10px] tracking-[0.35em] mb-2">
      {children}
    </p>
  );
}
