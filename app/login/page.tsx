"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const EMAIL_CACHE_KEY = "zone27_last_login_email";
const RESEND_COOLDOWN_SEC = 30;

// ── ZONE 27 · /login ───────────────────────────────────
// Round 30 Wave 5 · 2026-05-21 evening · Phase 1 magic link auth ·
// accelerated from「Q3 2026」timeline → NOW after Tim 3rd-time pratfall
// canary fire(「我真的可以註冊嗎?我懷疑...」)。
//
// Pratfall + Costly Signaling design:
//   - Magic link ONLY · 沒密碼欄 · 沒 OAuth · 沒 social login
//   - 1 個欄位 · 1 個動作 · 1 封 email
//   - 寄信失敗時誠實顯示 error · 不藏
//   - 不要求 email verification 第二步(magic link 點開即等於 verified)
//
// 跟 WaitlistForm 的關係:
//   - WaitlistForm = pure email collection · 沒 auth · 沒 session(legacy)
//   - /login(本頁)= real magic-link registration · 有 session · 有 member
//     state · /member 真實 authenticated dashboard
//   - 兩者並存:純訂閱選 WaitlistForm · 註冊選 /login
//
// Psychology trigger:
//   - 「您將成為 ZONE 27 第 X 位 FREE TIER 會員」 (concrete identity ·
//     Endowment Effect)
//   - 「1 分鐘內」 (specific time · 降焦慮)
//   - 「您只給 email · 我們不要密碼 · 不要 social login」 (Pratfall
//     deliberate minimalism · Costly Signaling)
//   - 「終身免費 · 永不調漲」 (re-affirm commitment)
// ─────────────────────────────────────────────────────

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "verifying"; email: string }
  | { kind: "error"; message: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  // Round 30 Wave 13 · session probe on mount · 已登入訪客顯示「您已
  // logged in as X」 + 跳 /member 連結 · 不重複 magic link 寄信。
  const [existingEmail, setExistingEmail] = useState<string | null>(null);
  // Round 30 Wave 13 · resend cooldown countdown · 防混淆多 email
  // (Tim 之前一晚 3 封 confusing email · UX bug)
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Round 30 Wave 6 · ?next= forwarding
  const [nextPath, setNextPath] = useState<string | null>(null);

  // ── On mount: session probe + email cache + next param ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    (async () => {
      // Restore last-used email from localStorage(Round 30 Wave 13 ·
      // 重訪不重打)。
      try {
        const cached = window.localStorage.getItem(EMAIL_CACHE_KEY);
        if (cached && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cached)) {
          setEmail(cached);
        }
      } catch {
        // localStorage blocked · 不擋
      }
      // Parse ?next=
      const sp = new URLSearchParams(window.location.search);
      const raw = sp.get("next");
      if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
        setNextPath(raw);
      }
      // Probe existing session(已登入訪客不需重 register)
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session?.user.email) {
          setExistingEmail(data.session.user.email);
        }
      } catch {
        // Network blocked / Supabase down · degrade silently
      }
    })();
    return () => {
      cancelled = true;
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN_SEC);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          if (cooldownTimerRef.current) {
            clearInterval(cooldownTimerRef.current);
            cooldownTimerRef.current = null;
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setState({ kind: "error", message: "請輸入 email" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setState({ kind: "error", message: "email 格式有誤" });
      return;
    }

    setState({ kind: "sending" });

    try {
      const supabase = createSupabaseBrowserClient();
      const callbackUrl = new URL(
        "/auth/callback",
        window.location.origin
      );
      if (nextPath) callbackUrl.searchParams.set("next", nextPath);
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: callbackUrl.toString(),
        },
      });
      if (error) {
        setState({
          kind: "error",
          message: error.message || "寄信失敗 · 請稍候再試",
        });
        return;
      }
      // Round 30 Wave 13 · cache email + start cooldown
      try {
        window.localStorage.setItem(EMAIL_CACHE_KEY, trimmed);
      } catch {
        // 不擋
      }
      startCooldown();
      setState({ kind: "sent", email: trimmed });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "未知錯誤 · 請稍候再試";
      setState({ kind: "error", message });
    }
  }

  async function handleResend() {
    if (cooldown > 0 || state.kind !== "sent") return;
    const targetEmail = state.email;
    setState({ kind: "sending" });
    try {
      const supabase = createSupabaseBrowserClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (nextPath) callbackUrl.searchParams.set("next", nextPath);
      const { error } = await supabase.auth.signInWithOtp({
        email: targetEmail,
        options: { emailRedirectTo: callbackUrl.toString() },
      });
      if (error) {
        setState({
          kind: "error",
          message: error.message || "重發失敗 · 請稍候再試",
        });
        return;
      }
      startCooldown();
      setState({ kind: "sent", email: targetEmail });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "未知錯誤";
      setState({ kind: "error", message });
    }
  }

  // Round 30 Wave 13b · Linear pattern OTP code fallback。
  // Per 2026 auth UX agent research deepest call:keep magic link · add OTP
  // 6-digit code 同封 email · 跨 device 也 work · PKCE constraint bypass。
  // Same brand axiom(0 password · 0 OAuth · 1-field /login)· 純 SentState
  // 加 OTP input · 不動 form structure。
  async function handleVerifyOtp(token: string) {
    if (state.kind !== "sent") return;
    const targetEmail = state.email;
    const trimmed = token.replace(/\s/g, "");
    if (!/^\d{6}$/.test(trimmed)) {
      setState({
        kind: "error",
        message: "6 碼 code 必須是 6 個數字",
      });
      return;
    }
    setState({ kind: "verifying", email: targetEmail });
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        email: targetEmail,
        token: trimmed,
        type: "email",
      });
      if (error) {
        setState({
          kind: "error",
          message: friendlyOtpError(error.message),
        });
        return;
      }
      // Session set via @supabase/ssr cookies · redirect to /member or next
      const dest = nextPath ?? "/member?welcome=true";
      window.location.assign(dest);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "未知錯誤";
      setState({ kind: "error", message });
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-20 pb-8 text-center">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / LOGIN · MAGIC LINK · FREE TIER 註冊
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
            一封 email · 一個 link · 您正式{" "}
            <span className="text-gold">加入 ZONE 27</span>
          </h1>
          <p className="mt-6 text-mute text-base leading-relaxed max-w-xl mx-auto">
            這是真的註冊 · 不是 email 預訂。1 分鐘內您信箱會收到 magic link ·
            點開您就有 session · /member 即時變成您的 dashboard。
          </p>
        </section>

        {/* ── ALREADY LOGGED IN · Round 30 Wave 13 ──────
            Session probe on mount detected existing session · 不重複 ship
            magic link · 直接 link 到 /member。 Tim's pain:多次點 /login
            其實 session 已 active · UI 沒告訴他 · 重複寄 confusing emails。 */}
        {existingEmail && state.kind !== "sent" && state.kind !== "sending" && (
          <section className="mx-auto max-w-md w-full px-6 sm:px-10 pb-6">
            <div className="bg-gold/5 border border-gold/60 glow-soft p-5">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2 shimmer"
              >
                ✓ ALREADY LOGGED IN
              </p>
              <p className="text-mute text-sm leading-relaxed mb-4">
                您本 device 已 logged in as{" "}
                <span className="font-mono text-gold">{existingEmail}</span> ·
                不需重新註冊。
              </p>
              <Link
                href="/member"
                className="inline-block px-5 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                → 進您 /member dashboard
              </Link>
            </div>
          </section>
        )}

        {/* ── FORM ─────────────────────────────────── */}
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 pb-12">
          {state.kind === "sent" || state.kind === "verifying" ? (
            <SentState
              email={state.kind === "sent" ? state.email : state.email}
              cooldown={cooldown}
              onResend={handleResend}
              onVerifyOtp={handleVerifyOtp}
              verifying={state.kind === "verifying"}
            />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-slate/40 border border-gold/40 p-6 sm:p-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-2"
                >
                  EMAIL · 您的信箱
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-navy/60 border border-line/70 px-4 py-3 text-bone text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                  disabled={state.kind === "sending"}
                />
              </div>

              <button
                type="submit"
                disabled={state.kind === "sending"}
                className="w-full px-6 py-3 bg-gold text-navy font-mono text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.kind === "sending"
                  ? "● 寄送中 ..."
                  : "→ 寄 magic link 給我"}
              </button>

              {state.kind === "error" && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="font-mono text-loss text-xs tracking-[0.15em] leading-relaxed"
                >
                  ✕ {state.message}
                </p>
              )}

              <div className="pt-3 border-t border-line/40">
                <p className="font-mono text-loss/90 text-[10px] tracking-[0.25em] leading-relaxed mb-2">
                  ⚠ <span className="text-loss font-medium">關鍵</span>:必須在<span className="text-bone">同一個 device</span>開 magic link
                  <br />
                  (e.g. 手機 /login → 手機 Gmail open · 不能 desktop 填 · 手機開 email)
                </p>
                <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
                  ▸ 1 個欄位 · 沒密碼 · 沒 OAuth · 沒 social login
                  <br />
                  ▸ Magic link 點 1 次 · 30 分鐘內有效 · 過期重發
                  <br />
                  ▸ Email 多封 · click 最新一封(舊的 token 已失效)
                  <br />
                  ▸ 想登出 · /member 內有「登出」按鈕
                </p>
              </div>
            </form>
          )}
        </section>

        {/* ── Round 30 Wave 8 · COMPRESSED · 1-line trust signal ──
            原 Wave 7 是 60-line WHY MINIMAL block(自我矛盾 — 加文字解釋
            為什麼少文字)· Tim 第 9 次 canary fire「太多字 · 沒人想看」 ·
            砍到 1 行 + 5-bullet what-you-get(各 1 字)。 Trust signal 保留 ·
            elaboration 全砍。 訪客想知 detail click /privacy。 */}
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed text-center mb-6">
            1 個欄位 · 不問姓名 / 國家 / 生日 · 因為我們 0 tracking 延伸到註冊本身。{" "}
            <Link
              href="/privacy"
              className="text-gold underline-offset-4 hover:underline"
            >
              /privacy
            </Link>
          </p>
          <ul className="text-mute/80 text-xs font-mono tracking-[0.15em] space-y-1.5 list-none pl-0 text-center">
            <li>▸ 終身免費</li>
            <li>▸ /member dashboard + /member/calibration mirror</li>
            <li>▸ 模型迭代 email 通知</li>
            <li>▸ 0 GA · 0 Pixel · 0 Hotjar · 0 cookies</li>
          </ul>
        </section>

        {/* ── ALT PATH ──────────────────────────────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-24 text-center">
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-4">
            不想註冊 · 只想被通知?
          </p>
          <Link
            href="/membership#waitlist"
            className="font-mono text-mute hover:text-gold text-[11px] tracking-[0.35em] underline-offset-4 hover:underline transition-colors"
          >
            → /membership · 純訂閱通知 email(不需 magic link · 不需 session)
          </Link>
          <div className="mt-12 pt-8 border-t border-line/40">
            <Link
              href="/membership"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← 4-tier ladder 全景 · /membership
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SentState({
  email,
  cooldown,
  onResend,
  onVerifyOtp,
  verifying,
}: {
  email: string;
  cooldown: number;
  onResend: () => void;
  onVerifyOtp: (token: string) => Promise<void>;
  verifying: boolean;
}) {
  const [otpInput, setOtpInput] = useState("");

  return (
    <div className="bg-gold/5 border border-gold/60 glow-soft p-6 sm:p-8">
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4 shimmer text-center"
      >
        ✓ EMAIL SENT · 2 個 path 任選
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4 text-center">
        寄出了 · 1 分鐘內看您信箱
      </h2>
      <p className="text-mute text-sm sm:text-base leading-relaxed mb-5 text-center">
        Email 寄到{" "}
        <span className="font-mono text-gold">{email}</span>
      </p>

      {/* ── PATH A · CLICK MAGIC LINK(same device only) ── */}
      <div className="bg-navy/40 border border-line/60 p-4 mb-3">
        <p
          lang="en"
          className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-2"
        >
          ① CLICK LINK · 同 device 開 email
        </p>
        <p className="text-mute text-xs sm:text-sm leading-relaxed">
          email 在<strong className="text-bone">這個 device + browser</strong>
          開 · 點 link → 自動轉 /member。 PKCE 限制 · 換 device / 換 browser
          不 work · 用 ② path。
        </p>
      </div>

      {/* ── PATH B · TYPE 6-DIGIT CODE(cross-device 也 work) ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onVerifyOtp(otpInput);
        }}
        className="bg-gold/5 border border-gold/40 p-4 mb-4"
      >
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em] mb-2"
        >
          ② TYPE CODE · 跨 device 也 work · Linear pattern
        </p>
        <p className="text-mute text-xs leading-relaxed mb-3">
          Email 裡有 6 位數 code · 貼到下方 verify · 不限 device · session
          落您現在 browser。
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            autoComplete="one-time-code"
            value={otpInput}
            onChange={(e) =>
              setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            className="flex-1 min-w-[110px] bg-navy/60 border border-line/70 px-3 py-2 text-bone text-xl tabular tracking-[0.4em] text-center focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors font-mono"
            disabled={verifying}
          />
          <button
            type="submit"
            disabled={verifying || otpInput.length !== 6}
            className="px-4 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {verifying ? "● 驗證" : "→ Verify"}
          </button>
        </div>
      </form>

      {/* ── Resend button + countdown ── */}
      <div className="text-center mb-3">
        <button
          type="button"
          onClick={onResend}
          disabled={cooldown > 0 || verifying}
          className="px-6 py-2.5 border border-line/60 text-mute font-mono text-[10px] tracking-[0.3em] hover:bg-gold/5 hover:text-gold hover:border-gold/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cooldown > 0
            ? `⌛ Resend · 等 ${cooldown}s`
            : "↻ 沒收到 · Resend email"}
        </button>
      </div>

      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed text-center">
        ▸ Link + code 同 1 小時內有效 · 過期 Resend
        <br />
        ▸ 找不到 email · 看垃圾信夾 · 或 30s 後 Resend
      </p>
    </div>
  );
}

function friendlyOtpError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("expired")) return "Code 過期(1 小時)· Resend 取新 code";
  if (lower.includes("invalid") || lower.includes("not found"))
    return "Code 錯誤 · 看最新 email · 6 碼數字";
  if (lower.includes("rate"))
    return "太快 · 等 30 秒後再試";
  return raw.slice(0, 200);
}
