"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  reserveFounderNumber,
  cancelMyReservation,
  getMyReservationBrowser,
  type MyReservation,
} from "@/lib/founder-reservations";

// ── ZONE 27 · Founder Pick Form ────────────────────────
// Round 30 Wave 12 · Patek allocation pattern · 「pick your number」 UX。
//
// States:
//   - loading: 初始 mount · spinner
//   - anonymous: /login CTA · 註冊才能 reserve
//   - migration_missing: 顯示「Tim 還沒 apply 0002 migration · functional
//     soon」 · graceful degrade
//   - no_reservation: 顯示 pick form · input number 008-270
//   - has_reservation: 顯示「您 reserved #N · pending Tim 確認」 + cancel
//   - submitting / cancelling: 操作中
//   - error: aria-live alert
//
// Number range 008-270:
//   - #001-#007 = Tim hardcoded forged · server RPC rejects
//   - #008+ = open or already reserved by other member
// ─────────────────────────────────────────────────────

type Status =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "migration_missing" }
  | { kind: "no_reservation" }
  | { kind: "has_reservation"; data: MyReservation }
  | { kind: "submitting" }
  | { kind: "cancelling" }
  | { kind: "error"; message: string; previous: Status };

export default function FounderPickForm({
  reservedNumbers,
}: {
  reservedNumbers: number[];
}) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [pickInput, setPickInput] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!data.session) {
          setStatus({ kind: "anonymous" });
          return;
        }
        // Probe whether migration applied · if RPC missing · degrade
        const reservation = await getMyReservationBrowser();
        if (cancelled) return;
        if (reservation) {
          setStatus({ kind: "has_reservation", data: reservation });
        } else {
          setStatus({ kind: "no_reservation" });
        }
      } catch {
        if (!cancelled) setStatus({ kind: "migration_missing" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleReserve(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = parseInt(pickInput, 10);
    if (Number.isNaN(n) || n < 8 || n > 270) {
      setStatus({
        kind: "error",
        message: "Number 必須在 8-270 之間 · #001-#007 是 Tim hardcoded forged",
        previous: { kind: "no_reservation" },
      });
      return;
    }
    if (reservedNumbers.includes(n)) {
      setStatus({
        kind: "error",
        message: `#${String(n).padStart(3, "0")} 已被別人 reserve · 試其他號碼`,
        previous: { kind: "no_reservation" },
      });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const result = await reserveFounderNumber(n);
      setStatus({
        kind: "has_reservation",
        data: {
          number: result.number,
          state: result.state,
          reservedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "未知錯誤";
      setStatus({
        kind: "error",
        message: friendlyError(msg),
        previous: { kind: "no_reservation" },
      });
    }
  }

  async function handleCancel() {
    if (status.kind !== "has_reservation") return;
    const prev = status;
    setStatus({ kind: "cancelling" });
    try {
      await cancelMyReservation();
      setStatus({ kind: "no_reservation" });
      setPickInput("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "cancel_failed";
      setStatus({
        kind: "error",
        message: friendlyError(msg),
        previous: prev,
      });
    }
  }

  // ── Render by state ─────────────────────────────────

  if (status.kind === "loading") {
    return (
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em]">
        ● 載入中
      </p>
    );
  }

  if (status.kind === "anonymous") {
    return (
      <div className="bg-slate/40 border border-gold/40 p-5">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
        >
          / LOGIN REQUIRED · reserve 需 FREE TIER session
        </p>
        <p className="text-mute text-sm leading-relaxed mb-4">
          您要先 /login(1 分鐘 Email + 密碼)· 才能 reserve 一個 #N。
          Patek 模式 · 公開 commitment 在轉帳之前。
        </p>
        <Link
          href="/login?next=/leaderboard"
          className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          → /login · Email + 密碼 註冊
        </Link>
      </div>
    );
  }

  if (status.kind === "migration_missing") {
    return (
      <div className="bg-loss/5 border border-loss/40 p-5">
        <p
          lang="en"
          className="font-mono text-loss text-[10px] tracking-[0.4em] mb-3"
        >
          ⏳ MIGRATION PENDING
        </p>
        <p className="text-mute text-sm leading-relaxed">
          Founder Number Reservation feature 程式 ready · 但 Supabase migration
          0002_founder_reservations.sql 還沒 apply。 Tim 5 分鐘 Supabase Studio
          → SQL Editor → paste → run · 然後此 form 自動 functional。
        </p>
      </div>
    );
  }

  if (status.kind === "has_reservation") {
    const pad = String(status.data.number).padStart(3, "0");
    return (
      <div className="bg-gold/5 border border-gold/60 glow-soft p-5 sm:p-6">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3 shimmer"
        >
          ✓ RESERVED · 您 reserved #{pad}
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3">
          狀態:<strong className="text-bone">{stateLabel(status.data.state)}</strong>
          {" · "}reserved at {formatTime(status.data.reservedAt)}
        </p>
        <p className="text-mute/85 text-xs sm:text-sm leading-relaxed mb-5">
          下一步:銀行轉帳 NT$ 2,700 給 Tim(手工 onboarding · per docs/MANUAL-ONBOARDING.md)·
          Tim 確認後 state → confirmed · 您正式入 270 之牆 #{pad}。
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="font-mono text-mute hover:text-loss text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
        >
          cancel reservation →
        </button>
      </div>
    );
  }

  if (status.kind === "cancelling") {
    return (
      <p className="font-mono text-mute text-[10px] tracking-[0.3em]">
        ● 取消中 ...
      </p>
    );
  }

  // no_reservation OR submitting OR error
  const submitting = status.kind === "submitting";
  const error = status.kind === "error" ? status.message : null;

  return (
    <form
      onSubmit={handleReserve}
      className="bg-slate/40 border border-gold/40 p-5 sm:p-6 space-y-4"
    >
      <div>
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
        >
          / PICK YOUR NUMBER · 選一個 008-270
        </p>
        <p className="text-mute/85 text-xs sm:text-sm leading-relaxed mb-3">
          您 reserved 後 · /leaderboard 那個 cell 顯示 RESERVED · 銀行轉帳完成 →
          confirmed · 永遠是您的。 #001-#007 是 Tim hardcoded forged · 不能 pick。
        </p>
        <input
          type="number"
          inputMode="numeric"
          min={8}
          max={270}
          step={1}
          required
          value={pickInput}
          onChange={(e) => setPickInput(e.target.value)}
          placeholder="例:27 · 008-270"
          className="w-full bg-navy/60 border border-line/70 px-4 py-3 text-bone text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors font-mono tabular"
          disabled={submitting}
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !pickInput}
        className="w-full px-6 py-3 bg-gold text-navy font-mono text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "● Reserving ..." : "→ Reserve this #N"}
      </button>
      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="font-mono text-loss text-xs tracking-[0.15em] leading-relaxed"
        >
          ✕ {error}
        </p>
      )}
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed pt-3 border-t border-line/40">
        ▸ Reserve = 公開承諾(/leaderboard 立刻顯示「RESERVED · pending」)
        <br />
        ▸ 銀行轉帳 NT$ 2,700 給 Tim · Tim 確認後 → confirmed · 永遠是您的
        <br />
        ▸ 不轉帳 = 可隨時 cancel · 釋出 number 給其他人
      </p>
    </form>
  );
}

// ── Helpers ────────────────────────────────────────────

function friendlyError(raw: string): string {
  const map: Record<string, string> = {
    not_logged_in: "您 session 過期 · 請重 /login",
    invalid_number: "Number 必須在 1-270 之間",
    reserved_by_founder: "此 number 是 Tim hardcoded forged · 試 008-270",
    number_taken: "此 number 已被別人 reserve · 試其他",
    already_reserved: "您已 reserved 一個 number · 先 cancel 才能換",
  };
  for (const key in map) {
    if (raw.includes(key)) return map[key]!;
  }
  return raw.slice(0, 200);
}

function stateLabel(state: "pending" | "confirmed" | "cancelled"): string {
  return {
    pending: "PENDING · 等 Tim 確認銀行轉帳",
    confirmed: "CONFIRMED · 永遠是您的",
    cancelled: "CANCELLED",
  }[state];
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d
      .toISOString()
      .replace("T", " ")
      .slice(0, 16);
  } catch {
    return iso;
  }
}
