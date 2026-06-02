"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── ZONE 27 · /auth/reset ──────────────────────────────
// 忘記密碼重設信的落地頁(R185 · Tim dogfood「忘記密碼會卡死」)。 Supabase
// recovery 信 redirectTo 這裡 · 帶 ?code=(PKCE)→ exchangeCodeForSession →
// 顯示「設新密碼」表單 → updateUser({ password })。 連結無效/過期 → 導回 /login 重寄。
//
// ⚠️ Supabase 後台要把 /auth/reset 加進 Auth → URL Configuration 的 Redirect URLs
// 允許清單(同 /auth/callback)· 否則 recovery link 會被導到 Site URL 預設頁。
// ─────────────────────────────────────────────────────

const MIN_PASSWORD_LEN = 8;

type Phase = "checking" | "ready" | "invalid" | "saving" | "done" | "error";

export default function ResetPasswordPage() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    (async () => {
      const supabase = createSupabaseBrowserClient();
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!cancelled) setPhase(error ? "invalid" : "ready");
          return;
        }
        // 或 recovery session 已被 client 自動接住
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setPhase(data.session ? "ready" : "invalid");
      } catch {
        if (!cancelled) setPhase("invalid");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    if (pw.length < MIN_PASSWORD_LEN) {
      setMsg(`密碼至少 ${MIN_PASSWORD_LEN} 字元`);
      return;
    }
    setPhase("saving");
    setMsg("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) {
        setPhase("error");
        setMsg("更新失敗 · 連結可能過期 · 回登入頁重寄一次");
      } else {
        setPhase("done");
      }
    } catch {
      setPhase("error");
      setMsg("更新失敗 · 回登入頁重寄一次");
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main" className="flex-1 flex items-center">
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 py-24">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6 text-center">
            / 重設密碼
          </p>

          {phase === "checking" && (
            <p className="text-mute text-center font-mono text-[11px] tracking-[0.3em]">
              確認連結中...
            </p>
          )}

          {phase === "invalid" && (
            <div className="bg-loss/5 border border-loss/30 p-6 text-center">
              <p className="text-bone mb-4 leading-relaxed">
                這個重設連結無效或已過期。
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                回登入頁重寄 →
              </Link>
            </div>
          )}

          {(phase === "ready" || phase === "saving" || phase === "error") && (
            <div className="bg-slate/40 border border-gold/40 p-6 sm:p-8 space-y-5">
              <h1 className="text-2xl text-bone font-light tracking-tight text-center">
                設定新密碼
              </h1>
              <input
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LEN}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder={`新密碼(≥ ${MIN_PASSWORD_LEN} 字元)`}
                className="w-full bg-navy/60 border border-line/70 px-4 py-3 text-bone text-base focus:outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20 transition-colors"
              />
              <button
                type="button"
                onClick={save}
                disabled={phase === "saving"}
                className="w-full px-6 py-3 bg-gold text-navy font-mono text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phase === "saving" ? "● 更新中..." : "→ 設定新密碼"}
              </button>
              {msg && (
                <p role="alert" className="font-mono text-loss text-xs tracking-[0.15em] leading-relaxed">
                  ✕ {msg}
                </p>
              )}
            </div>
          )}

          {phase === "done" && (
            <div className="bg-gold/5 border border-gold/60 glow-soft p-6 text-center">
              <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3 shimmer">
                ✓ 密碼已更新
              </p>
              <p className="text-mute mb-5 leading-relaxed">
                新密碼設好了 · 以後用它登入。
              </p>
              <Link
                href="/member"
                className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                進會員儀表板 →
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
