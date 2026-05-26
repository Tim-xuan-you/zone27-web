"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { sanitizeNext } from "@/lib/sanitize-next";

const EMAIL_CACHE_KEY = "zone27_last_login_email";
const RESEND_COOLDOWN_SEC = 30;
const MIN_PASSWORD_LEN = 8;

// ── ZONE 27 · /login ───────────────────────────────────
// Round 30 Wave 5 · 2026-05-21 evening · Phase 1 magic link auth ·
// accelerated from「Q3 2026」timeline → NOW after Tim 3rd-time pratfall
// canary fire(「我真的可以註冊嗎?我懷疑...」)。
//
// Pratfall + Costly Signaling design:
//   - Password-only single path(R50 W-F · 砍 magic link toggle per Tim
//     27+ canary「2 個都存在好困擾」 · founder dogfood trump abstract
//     axiom)· 沒 OAuth · 沒 social login · 沒 magic link toggle
//   - 2 個欄位(email + password)· 1 個動作 · 1 封 confirmation email
//   - 寄信失敗時誠實顯示 error · 不藏
//   - signup 需 email confirmation(Supabase 標準)· click link → /member
//
// 跟 WaitlistForm 的關係:
//   - WaitlistForm = pure email collection · 沒 auth · 沒 session(legacy)
//   - /login(本頁)= real magic-link/password registration · 有 session ·
//     有 member state · /member 真實 authenticated dashboard
//   - 兩者並存:純訂閱選 WaitlistForm · 註冊選 /login
//
// Round 32 W-C · 2026-05-22 noon · Tim founder-dogfood canary fire:
// 「沒有收到 6 位數 code 呀!直接點擊信箱的登入連結,就進去了...」 surface
// 了 R30 W13b OTP code fallback 是 over-promised UI:Supabase 預設 magic
// link email template 只寄 `{{ .ConfirmationURL }}` · 不寄 `{{ .Token }}` ·
// 訪客看 6 位數 verify form 永遠收不到 code。 違反 R30 W11 axiom「every
// section must be true right now」 + 反向 brand IP「方法公開 · 物理產出」。
// 砍 path ② 整套(PATH B form · handleVerifyOtp · friendlyOtpError ·
// verifying state)· 對齊 Apple/Stratechery 1-tap minimalism + R30 W7
// 「越少 fields 越正式」 axiom + R30 W11 present-tense-only axiom · 三 axiom
// 同時 fire。 將來真要 cross-device OTP(Supabase Studio 改 template 加
// `{{ .Token }}` 後)30 行可重 wire · git show 9860d61 之前版本還可參考。
//
// Round 50 W-F · 2026-05-22 evening · Tim 27+ canary fire dogfood:
// 「註冊, 可以(magic link)跟帳號密碼, 2 選一就好嗎? 不要 2 個都存在!
//  好困擾!好複雜!」 Hick's Law 教科書 case(2 choices = decision paralysis
// + form 複雜)· 必須選 1 個。 founder signal 過去 5+ time reject magic
// link(per R30 W14 註解寫死)· 此時 ship password-only 對齊 founder
// preference。 砍 magic link mode toggle · 砍 mode state · 砍 submitMagicLink
// function · 砍 magic_link_sent state · /login 變單一 form(email + password
// + submit)。 R30 W14 「Tim prefer password」 lesson 物理 codify · 不再
// hybrid 2-mode 複雜度。 「忘記密碼」 case 將來若需要 · 走 Supabase 標準
// reset password flow(/reset · 另獨立 page)· 不再在 /login 內 toggle。
// Resend functionality 保留 但 only for signup confirm email · 不再 OTP magic。
// ─────────────────────────────────────────────────────

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "signup_confirm_sent"; email: string }
  | { kind: "error"; message: string };

export default function LoginPage() {
  // Round 50 W-F · password-only · 砍 mode state(per Tim 27+ canary
  // 「2 個都存在好困擾」)。 founder signal trump abstract axiom · Tim
  // 過去 5+ time reject magic link · 此時 ship password-only。
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [existingEmail, setExistingEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      // R160 W1 · Agent M CRITICAL security parity fix · 之前 string-prefix
      // check 有 bypass surface(`/%2F%2Fattacker.com` URL-encoded · `/\\evil.tld`
      // backslash variant · null-byte injection 等)· 同 R54 W-A vulnerability
      // class 已在 /auth/callback patched 但 /login 缺 parity · ALL of nextPath
      // is propagated to window.location.assign() at lines 178+217 + Supabase
      // emailRedirectTo at lines 195+254 · 必須 sanitize at input · per
      // [[zone27-disclosure-philosophy]] defense parity axiom · sanitizeNext
      // canonical helper from lib/sanitize-next.ts(URL parse-based validation)。
      const sp = new URLSearchParams(window.location.search);
      const rawNext = sp.get("next");
      if (rawNext) {
        const sanitized = sanitizeNext(rawNext);
        // sanitizeNext fallback returns "/member?welcome=true" · only set
        // nextPath if visitor explicitly passed a valid override(not fallback)
        if (sanitized !== "/member?welcome=true") {
          setNextPath(sanitized);
        }
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

    // Cache email for next-visit autofill
    try {
      window.localStorage.setItem(EMAIL_CACHE_KEY, trimmed);
    } catch {
      // localStorage blocked · 不擋
    }

    // Round 50 W-F · password-only path · 砍 magic link mode branching。
    return submitPassword(trimmed);
  }

  // Round 30 Wave 14 · Apple-pattern smart sign-in-or-sign-up:
  // 1. Try signInWithPassword(existing account)
  // 2. If「Invalid login credentials」(could be wrong password OR new user)·
  //    try signUp · if signUp 成功 → "check email to confirm" state
  // 3. 若 signUp 也 fail(e.g. account exists · password 確實錯)· show error
  async function submitPassword(trimmedEmail: string) {
    if (password.length < MIN_PASSWORD_LEN) {
      setState({
        kind: "error",
        message: `密碼至少 ${MIN_PASSWORD_LEN} 個字元`,
      });
      return;
    }
    setState({ kind: "submitting" });
    try {
      const supabase = createSupabaseBrowserClient();
      // Try sign in first
      const signInResult = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (!signInResult.error) {
        // Success · session set · redirect
        const dest = nextPath ?? "/member?welcome=true";
        window.location.assign(dest);
        return;
      }

      // Sign in failed · check if it's "user not found" → try signUp
      const errMsg = (signInResult.error.message || "").toLowerCase();
      const looksLikeNewUser =
        errMsg.includes("invalid login credentials") ||
        errMsg.includes("user not found") ||
        errMsg.includes("invalid email or password");

      if (looksLikeNewUser) {
        const callbackUrl = new URL(
          "/auth/callback",
          window.location.origin
        );
        if (nextPath) callbackUrl.searchParams.set("next", nextPath);
        const signUpResult = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: callbackUrl.toString(),
          },
        });
        if (signUpResult.error) {
          // Real sign up error(account already exists w/ different password · etc.)
          setState({
            kind: "error",
            message: friendlyPasswordError(signUpResult.error.message),
          });
          return;
        }
        // Check if email confirmation needed(Supabase default = yes)
        const session = signUpResult.data.session;
        if (session) {
          // Auto-confirmed(Supabase project has email confirmation off)·
          // redirect directly
          const dest = nextPath ?? "/member?welcome=true";
          window.location.assign(dest);
          return;
        }
        // Email confirmation pending
        setState({ kind: "signup_confirm_sent", email: trimmedEmail });
        return;
      }
      // Other error(rate limit · network · etc.)
      setState({
        kind: "error",
        message: friendlyPasswordError(signInResult.error.message),
      });
    } catch (err) {
      // Round 54 W-A · Agent 2 #10 fix · 不 leak Supabase internal infra
      // detail(IP / port / API key / timeout)to DOM · log server-side
      // for debugging · return canonical generic + Tim recovery path。
      if (err instanceof Error) {
        console.error("[login submitPassword]", err.message);
      }
      setState({
        kind: "error",
        message: "未知錯誤 · 請稍候再試 · 持續寫信 tatayngiti@gmail.com",
      });
    }
  }

  // Round 50 W-F · submitMagicLink function 砍乾淨 · password-only path。
  // Future「忘記密碼」 case 將來若需要 · 走 Supabase 標準 reset password
  // flow(/reset · 另獨立 page)· 不再在 /login 內 toggle 2 modes。

  async function handleResend() {
    if (cooldown > 0 || state.kind !== "signup_confirm_sent") return;
    const targetEmail = state.email;
    setState({ kind: "submitting" });
    try {
      const supabase = createSupabaseBrowserClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (nextPath) callbackUrl.searchParams.set("next", nextPath);
      // Round 51 W-A · Agent 2 #4 fix · 砍 signInWithOtp(OTP magic link
      // flow · password signup 不該走此 path)· 改用 supabase.auth.resend
      // ({ type: "signup", ...}) canonical Supabase API for resending
      // signup confirmation email · 不創 new account · 不混 OTP path。
      const { error } = await supabase.auth.resend({
        type: "signup",
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
      setState({
        kind: "signup_confirm_sent",
        email: targetEmail,
      });
    } catch (err) {
      // Round 54 W-A · Agent 2 #10 fix · 同 submitPassword · 不 leak infra detail。
      if (err instanceof Error) {
        console.error("[login handleResend]", err.message);
      }
      setState({
        kind: "error",
        message: "重發失敗 · 請稍候再試 · 持續寫信 tatayngiti@gmail.com",
      });
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
            / LOGIN · FREE TIER · 登入或註冊
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
            <span className="text-gold">加入 ZONE 27</span>
          </h1>
          <p className="mt-6 text-mute text-base leading-relaxed max-w-xl mx-auto">
            Email + 密碼 · Apple/Google 標準。 新帳號自動建立 · 已有帳號自動登入。
            終身免費 · 永不調漲 · 0 tracking。
          </p>
        </section>

        {/* ── ALREADY LOGGED IN · Round 30 Wave 13 ──────
            Session probe on mount detected existing session · 不重複 ship
            magic link · 直接 link 到 /member。 Tim's pain:多次點 /login
            其實 session 已 active · UI 沒告訴他 · 重複寄 confusing emails。 */}
        {existingEmail &&
          state.kind !== "signup_confirm_sent" &&
          state.kind !== "submitting" && (
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

        {/* ── FORM · Round 50 W-F · password-only single path · 砍 mode toggle ── */}
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 pb-12">
          {state.kind === "signup_confirm_sent" ? (
            <SentState
              email={state.email}
              cooldown={cooldown}
              onResend={handleResend}
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
                  className="w-full bg-navy/60 border border-line/70 px-4 py-3 text-bone text-base focus:outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20 transition-colors"
                  disabled={state.kind === "submitting"}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-2"
                >
                  PASSWORD · 密碼 (≥ {MIN_PASSWORD_LEN} 字元)
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={MIN_PASSWORD_LEN}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy/60 border border-line/70 px-4 py-3 text-bone text-base focus:outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20 transition-colors"
                  disabled={state.kind === "submitting"}
                />
              </div>

              <button
                type="submit"
                disabled={state.kind === "submitting"}
                className="w-full px-6 py-3 bg-gold text-navy font-mono text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.kind === "submitting" ? "● 處理中 ..." : "→ 登入 / 註冊"}
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

              {/* ── Round 50 W-F · 砍 mode toggle button · 留 3-line hint
                  簡化 to 1-path explanation。 「忘記密碼」 將來走獨立
                  /reset page · 不在 /login 內 toggle 模式。 */}
              <div className="pt-3 border-t border-line/40">
                <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
                  ▸ 新 email = 自動建帳號 · 寄確認 email · 點 link 完成 register
                  <br />
                  ▸ 已有 email = 用密碼登入 · session 落本 browser
                  <br />
                  ▸ 沒 social login · 沒 OAuth · 沒 tracking · per /privacy
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
            <li>▸ 0 GA · 0 Pixel · 0 Hotjar · 0 tracking cookies(essential auth session only · 登出即刪)</li>
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

// Round 50 W-F · SentState 簡化 · 砍 isSignupConfirm prop · 永遠 signup
// confirm state(magic_link_sent path 已 R50 W-F 砍)。 password sign up
// 走 Supabase 預設 email confirmation flow · 寄 confirmation link · click
// → /auth/callback → /member · 同 PKCE same-device 限制。
function SentState({
  email,
  cooldown,
  onResend,
}: {
  email: string;
  cooldown: number;
  onResend: () => void;
}) {
  return (
    <div className="bg-gold/5 border border-gold/60 glow-soft p-6 sm:p-8">
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4 shimmer text-center"
      >
        ✓ ACCOUNT CREATED · 等 email 確認
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4 text-center">
        帳號建好了 · 請確認 email
      </h2>
      <p className="text-mute text-sm sm:text-base leading-relaxed mb-5 text-center">
        Email 寄到{" "}
        <span className="font-mono text-gold">{email}</span>
      </p>

      {/* ── CLICK CONFIRM LINK ─────────────── */}
      <div className="bg-navy/40 border border-line/60 p-4 mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em] mb-2"
        >
          → CLICK CONFIRM LINK · 1-tap 落地
        </p>
        <p className="text-mute text-xs sm:text-sm leading-relaxed">
          email 在<strong className="text-bone">這個 device + browser</strong>
          開 · 點 confirmation link → 自動轉 /member。 PKCE 限制 · 換 device /
          換 browser 點 link 不 work · 在新 device Resend 後再點。
        </p>
      </div>

      {/* ── Resend button + countdown ── */}
      <div className="text-center mb-3">
        <button
          type="button"
          onClick={onResend}
          disabled={cooldown > 0}
          className="px-6 py-2.5 border border-line/60 text-mute font-mono text-[10px] tracking-[0.3em] hover:bg-gold/5 hover:text-gold hover:border-gold/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cooldown > 0
            ? `⌛ Resend · 等 ${cooldown}s`
            : "↻ 沒收到 · Resend email"}
        </button>
      </div>

      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed text-center">
        ▸ Confirmation link 1 小時內有效 · 過期 Resend
        <br />
        ▸ 找不到 email · 看垃圾信夾 · 或 30s 後 Resend
      </p>
    </div>
  );
}

// Round 30 Wave 14 · friendly password error mapping。
// Round 51 W-A · Agent 2 #10 fix · 砍 stale「忘記密碼」 references · R50 W-F
// 已移除 mode toggle button · 此 message 指向不存在 UI 是 ghost text · 改寫
// canonical「密碼錯了 · 確認 capslock · 寫信 tatayngiti@gmail.com」 path · 真實
// 可達 recovery option(/reset page 將來 ship)。
//
// Round 54 W-A · Agent 2 #3 + #10 fix · whitelist-only approach · 砍
// `raw.slice(0, 200)` fallback(unsanitized Supabase error message → DOM ·
// fragile refactor surface · 也 leak infrastructure detail · 違反 security
// 最小信息揭露)· 改為 unknown error → log + canonical generic message。
// R59 W-B · Agent B Finding #2 · 從 comment-only intent 升為 actual
// implementation(之前 comment 寫 「改為 log + canonical generic message」 但
// code 還是 return raw.slice 違反 comment 承諾 · 同 security drift 信號)。
function friendlyPasswordError(raw: string): string {
  if (!raw || typeof raw !== "string") return "錯誤 · 請稍候再試 · 持續寫信 tatayngiti@gmail.com";
  const lower = raw.toLowerCase();
  if (lower.includes("already") && lower.includes("registered"))
    return "此 email 已註冊 · 密碼錯了? 寫信 tatayngiti@gmail.com 重設";
  if (lower.includes("user already exists"))
    return "此 email 已註冊 · 密碼錯了? 寫信 tatayngiti@gmail.com 重設";
  if (lower.includes("password should be at least"))
    return `密碼至少 ${MIN_PASSWORD_LEN} 字元`;
  if (lower.includes("weak"))
    return "密碼太弱 · 加長 / 加數字 / 加符號";
  if (lower.includes("rate"))
    return "太快 · 等 30 秒後再試";
  if (lower.includes("network") || lower.includes("fetch"))
    return "網路問題 · 重試";
  // R59 W-B · log raw for Tim 後台 debug + return canonical generic message。
  // 之前 return raw.slice(0, 200) 直接 leak Supabase infra strings 到 DOM。
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error("[login friendlyPasswordError unknown]", raw);
  }
  return "錯誤 · 請稍候再試 · 持續寫信 tatayngiti@gmail.com";
}
