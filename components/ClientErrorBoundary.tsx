"use client";

// ── ZONE 27 · Client Error Boundary ─────────────────────
// R73 W-A · code-quality deferred queue R66+ · per-component ErrorBoundary
// wrapper for risk-bearing client components that might crash WITHOUT
// taking down the whole page。 Next.js 16 app/error.tsx(R66 W-A)handles
// route-level errors · this handles SINGLE component crashes(localStorage
// quota throw mid-render · form state corruption · unexpected JSON parse
// failure post-mount)。
//
// Architecture:
//   - React class component(only way to use componentDidCatch · official
//     React 19 still requires class for error boundary)
//   - Brand-pure fallback UI · 不 expose raw error to visitor · console.error
//     server-side log for debug
//   - Auto-retry button(per Next.js 16 unstable_retry parallel pattern)·
//     visitor can click retry · if persists · same fallback
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · 不藏 broken state · fallback
//     UI explicit「component crashed · this part 暫不可用 · 不影響 rest of
//     page」 honest disclosure
//   - per /audit S05 PRE-COMMIT · same Pratfall pattern as「DIVERGED 等大」
//     · 不假裝 everything works
//   - per Next.js 16 error boundary modernization R66 W-A · parallel
//     architecture at component-level
//
// 不做 anti-pattern:
//   ✕ NO raw error string display(brand IP「不藏 broken state」 ≠ leak
//     internal stack traces to visitor · same axiom as /auth/callback R61
//     W-D raw-error-leak fix)
//   ✕ NO automatic retry-on-loop(could cause infinite re-render storm)
//   ✕ NO「send error report」 telemetry CTA(per /privacy 0-tracker promise)
//   ✕ NO modal / popup(per 不打擾就是禮物 + 11-item NOT-DO #9 modal redline)
//
// Usage:
//   <ClientErrorBoundary fallbackLabel="LensFocusVote">
//     <LensFocusVote matchId={m.id} />
//   </ClientErrorBoundary>
// ─────────────────────────────────────────────────────

import { Component, type ReactNode, type ErrorInfo } from "react";

type Props = {
  /** Children to render · usually a single risk-bearing client component */
  children: ReactNode;
  /** Short identifier for fallback UI · e.g. "LensFocusVote" · "DraftSaveLink" ·
   *  shown in fallback as brand-pure context · NOT raw error message */
  fallbackLabel: string;
};

type State = {
  /** True when componentDidCatch fired · false during normal render */
  hasError: boolean;
  /** Render attempt counter · auto-incremented on retry · used to force re-mount */
  attemptKey: number;
};

export default class ClientErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, attemptKey: 0 };
  }

  static getDerivedStateFromError(): Partial<State> {
    // Update state so next render shows fallback UI · 不 expose error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Server-side debug log · NOT visitor-facing
    // brand IP: log enough for Tim to grep Vercel logs but 不 leak to visitor
    console.error(
      `[ZONE27 · CLIENT_ERROR_BOUNDARY] component=${this.props.fallbackLabel} error=${error.message} componentStack=${errorInfo.componentStack?.split("\n").slice(0, 3).join(" | ") ?? "—"}`,
    );
  }

  handleRetry = (): void => {
    // Reset error state + bump attemptKey to force child re-mount
    this.setState({ hasError: false, attemptKey: this.state.attemptKey + 1 });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <aside
          role="alert"
          aria-live="polite"
          className="bg-slate/30 border border-loss/40 p-4 sm:p-5"
        >
          <p
            lang="en"
            className="font-mono text-loss/85 text-[10px] tracking-[0.35em] mb-2"
          >
            ✕ {this.props.fallbackLabel} · TEMPORARILY UNAVAILABLE
          </p>
          <p className="text-mute text-sm leading-relaxed mb-3">
            這個 widget crashed · 其他 page content 不受影響 · per /audit
            S05 disclosure 不藏 broken state · ZONE 27 brand IP「方法公開 ·
            不假裝 everything works」 axiom 物理 codify。
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={this.handleRetry}
              aria-label={`Retry rendering ${this.props.fallbackLabel}`}
              className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.3em] px-3 py-1.5 border border-gold/40 hover:border-gold transition-colors"
            >
              ↻ RETRY
            </button>
            <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em]">
              ⚓ NO error report sent · NO telemetry · per /privacy 0-tracker · 0 PII
            </p>
          </div>
        </aside>
      );
    }
    // attemptKey changes force re-mount of children after retry · React
    // canonical pattern for resetting error boundary state per child tree。
    return <div key={this.state.attemptKey}>{this.props.children}</div>;
  }
}
