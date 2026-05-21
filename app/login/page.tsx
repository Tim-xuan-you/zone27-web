"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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
  | { kind: "error"; message: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  // Round 30 Wave 6 · ?next= forwarding · so FollowMatchButton anonymous
  // visitor 從 match page 登入 → magic link → /auth/callback?next=/matches/X
  // → 自動回原 match page。 Internal-only redirect(只接 /-prefixed path ·
  // 拒外部 URL · 防 open-redirect 漏洞)。
  const [nextPath, setNextPath] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get("next");
    if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
      setNextPath(raw);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setState({ kind: "error", message: "請輸入 email" });
      return;
    }
    // Mirror the same regex as supabase migration 0001_waitlist.sql
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
      setState({ kind: "sent", email: trimmed });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "未知錯誤 · 請稍候再試";
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

        {/* ── FORM ─────────────────────────────────── */}
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 pb-12">
          {state.kind === "sent" ? (
            <SentState email={state.email} />
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
                <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
                  ▸ 我們不要密碼 · 不要 social login · 不要 OAuth
                  <br />
                  ▸ Email = 您的會員 identifier · 不需第二個欄位
                  <br />
                  ▸ Magic link 點 1 次 = 您 session 啟動 · 不用再 sign-in
                  <br />
                  ▸ 想登出 · /member 內有「登出」按鈕
                </p>
              </div>
            </form>
          )}
        </section>

        {/* ── Round 30 Wave 7 · WHY THIS IS MINIMAL ────
            Tim 第 5 次 canary fire: Apple 註冊截圖「為什麼我們不像 Apple」 ·
            = 訪客看到只 1 個欄位會想「奇怪 · 太簡單 · 是不是 bug?」 · 這個
            confusion moment 是 brand IP 教學黃金。 不解釋 = 訪客誤判忘記
            寫 · 解釋 = trust signal。 Pratfall + Costly Signaling + 訪客
            expectation reversal: 普通常識「越多 fields 越正式」 ·
            ZONE 27 倒置「越少 fields 越正式」 · 因為少存 = 少漏。 */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12">
          <div className="bg-slate/40 border border-gold/40 p-6 sm:p-8">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3"
            >
              / WHY THIS IS MINIMAL · 不是 bug · 是 brand IP
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed mb-5">
              Apple / Google / Microsoft 註冊問您 5-8 個 fields
              (姓名 · 國家 · 生日 · 密碼 · 安全問題...)· ZONE 27 問{" "}
              <strong className="text-bone">1 個</strong>(email)。
              <strong className="text-bone"> 不是我們忘了寫 · 是結構性決定。</strong>
            </p>

            {/* 5-row comparison · why we deliberately don't ask */}
            <div className="space-y-3 mb-6">
              <MinimalRow
                field="姓名"
                whyNotAsk="會員 identifier = email · 不是真名 · 您可以匿名"
              />
              <MinimalRow
                field="國家 / 地區"
                whyNotAsk="沒地理 targeting · 沒 IP-based recommendation"
              />
              <MinimalRow
                field="出生日期"
                whyNotAsk="沒人口統計 · 不會根據年齡推內容"
              />
              <MinimalRow
                field="密碼"
                whyNotAsk="magic link = passwordless · 沒密碼可外洩 · 沒 phishing 攻擊面"
              />
              <MinimalRow
                field="安全問題"
                whyNotAsk="沒 account recovery 攻擊面 · 遺失 magic link 重發即可"
              />
            </div>

            {/* Why Apple does · why we don't */}
            <div className="border-l-2 border-gold/40 pl-4 sm:pl-5 mb-5">
              <p className="text-mute text-sm leading-relaxed">
                Apple 要這些 fields 是因為 Apple{" "}
                <strong className="text-bone">賣您東西</strong> ·
                iPhone 配送需地址 · iCloud 訂閱需付款方式 · 是 commerce platform
                必要 collection。
              </p>
              <p className="text-mute text-sm leading-relaxed mt-3">
                ZONE 27 <strong className="text-bone">不賣您東西</strong>
                (engine free per{" "}
                <Link
                  href="/manifesto"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /manifesto Section II
                </Link>
                )· 我們給您 epistemic mirror。 您給 1 個 email · 我們連住址都不要。
              </p>
            </div>

            {/* Brand IP closing statement */}
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2"
            >
              / THE AXIOM
            </p>
            <p className="text-bone text-base sm:text-lg font-light tracking-tight leading-snug mb-2">
              「0 tracking」延伸到註冊本身:
            </p>
            <p className="text-gold text-base sm:text-lg font-light tracking-tight leading-snug mb-4">
              少存 = 少漏 · 不存 = 不漏。
            </p>
            <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
              這是 Costly Signaling · 刻意的 friction-by-omission ·
              對齊{" "}
              <Link
                href="/privacy"
                className="text-gold underline-offset-4 hover:underline"
              >
                /privacy
              </Link>
              (0 GA · 0 Pixel · 0 Hotjar)+ Footer 「FUNDED BY FOUNDERS · NO
              TRACKERS」brand line。
            </p>
          </div>
        </section>

        {/* ── PSYCHOLOGY / COMMITMENT REAFFIRM ──────── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16">
          <div className="bg-slate/30 border-l-2 border-gold/50 pl-5 sm:pl-6 py-4">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
            >
              / WHAT YOU GET · FREE TIER 承諾
            </p>
            <ul className="text-mute text-sm leading-relaxed space-y-2 list-none pl-0">
              <li>
                ▸{" "}
                <span className="text-bone">終身免費</span>
                {" · "}永不調漲(Stratechery / Plausible 同 model)
              </li>
              <li>
                ▸{" "}
                <span className="text-bone">/member 個人 dashboard</span>
                {" · "}localStorage sim history + 您的引擎時間軸(Endowment
                Effect · 您 vote 引擎下一步 · Loss Aversion · 個人 calibration)
              </li>
              <li>
                ▸{" "}
                <span className="text-bone">/member/calibration</span>
                {" · "}sabermetric 45° reliability diagram · 您 follow 賽事
                的 personal mirror(會員系統 deepest sharp call)
              </li>
              <li>
                ▸{" "}
                <span className="text-bone">模型重要迭代 email 通知</span>
                {" · "}Founders 27 預售開放優先通知 · 不寄行銷信
              </li>
              <li>
                ▸{" "}
                <span className="text-bone">0 tracking</span>
                {" · "}Footer FUNDED BY FOUNDERS · NO GA · NO PIXEL · NO HOTJAR
                ·   per /privacy 寫死
              </li>
            </ul>
          </div>
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

// Round 30 Wave 7 · One row in「為什麼我們刻意不問」 list · field name
// + 為什麼 we don't ask · brand-pure mono kicker + body text。
function MinimalRow({
  field,
  whyNotAsk,
}: {
  field: string;
  whyNotAsk: string;
}) {
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className="font-mono text-loss/80 text-[11px] tracking-[0.25em] tabular shrink-0 min-w-[80px]">
        ✕ {field}
      </span>
      <span className="text-mute text-xs sm:text-sm leading-relaxed flex-1 min-w-0">
        {whyNotAsk}
      </span>
    </div>
  );
}

function SentState({ email }: { email: string }) {
  return (
    <div className="bg-gold/5 border border-gold/60 glow-soft p-6 sm:p-8 text-center">
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4 shimmer"
      >
        ✓ MAGIC LINK SENT
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4">
        寄出了 · 1 分鐘內看您信箱
      </h2>
      <p className="text-mute text-sm sm:text-base leading-relaxed mb-6">
        Magic link 寄到{" "}
        <span className="font-mono text-gold">{email}</span> ·
        點開後您 session 啟動 · 自動轉到{" "}
        <span className="font-mono text-bone">/member</span>。
      </p>
      <div className="bg-navy/40 border border-line/60 p-4 text-left">
        <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed">
          ▸ 沒收到?看垃圾信夾 · 或 1 分鐘後重發
          <br />
          ▸ Email typo?關掉此頁 · 重 /login 重輸入
          <br />
          ▸ 收到但連結失效?Magic link 30 分鐘內有效 · 過期重發
        </p>
      </div>
    </div>
  );
}
