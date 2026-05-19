"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { reserveSpot, type WaitlistResult } from "@/lib/waitlist";

// ── Submit button — disables while pending, shows spinner ───
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-4 text-xs tracking-[0.3em] transition-colors font-medium ${
        pending
          ? "bg-gold/30 text-navy/70 cursor-not-allowed"
          : "bg-gold text-navy hover:bg-gold-soft"
      }`}
    >
      {pending ? "▸ 正在預留位置 ..." : "立即預留我的位置 →"}
    </button>
  );
}

// ── Main form ──────────────────────────────────────────
export default function WaitlistForm() {
  const [state, formAction] = useActionState<WaitlistResult | null, FormData>(
    reserveSpot,
    null
  );

  // ── Success state ────────────────────────────────────
  if (state?.ok) {
    const pos = String(state.queuePos).padStart(3, "0");
    return (
      <div className="bg-slate/70 border border-gold/60 glow-soft p-10 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          {state.alreadyReserved ? "✓ 您已在等候名單上" : "✓ 預留成功"}
        </p>
        <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
          您在等候名單上的位置
        </h3>
        <p className="font-mono text-gold tabular text-6xl sm:text-7xl tracking-tight my-6 font-light">
          # {pos}
        </p>
        <p className="text-mute text-sm max-w-sm mx-auto leading-relaxed">
          當付款系統正式開放(預計 Q3 2026),我們會優先通知您。
          您的位置已被保留。
        </p>
        <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em] mt-8">
          目前不收費 · 不綁定 · 隨時可退出
        </p>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────
  return (
    <form
      action={formAction}
      className="bg-slate/70 border border-gold/40 glow-soft p-8 sm:p-10"
    >
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2">
        創始會員 · 預售等候名單
      </p>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
        留下 email,保留您的位置
      </h3>
      <p className="text-mute text-sm mb-8 leading-relaxed">
        付款系統尚未開放。先進入等候名單,我們會在正式開放預訂時 email
        您。**不收費、不綁定、隨時可退出。**
      </p>

      {/* Email field */}
      <label className="block mb-5">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          EMAIL · 必填
        </span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full bg-ink/60 border border-line/70 focus:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/40 font-mono text-sm"
        />
      </label>

      {/* Name field (optional) */}
      <label className="block mb-8">
        <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
          稱呼 · 選填
        </span>
        <input
          type="text"
          name="name"
          placeholder="Tim"
          autoComplete="given-name"
          className="w-full bg-ink/60 border border-line/70 focus:border-gold/70 text-bone px-4 py-3 outline-none transition-colors placeholder:text-mute/40 font-mono text-sm"
        />
      </label>

      <SubmitButton />

      {/* Inline error */}
      {state && !state.ok && (
        <p className="mt-4 font-mono text-loss text-[10px] tracking-[0.3em] text-center">
          {state.error === "missing_email"
            ? "請填寫 EMAIL"
            : "EMAIL 格式不正確"}
        </p>
      )}

      <p className="font-mono text-mute/50 text-[10px] tracking-[0.25em] mt-6 text-center">
        我們永遠不會分享您的 email · 隨時可退出
      </p>
    </form>
  );
}
