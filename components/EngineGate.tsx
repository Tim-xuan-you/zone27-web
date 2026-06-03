"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── ZONE 27 · Engine Gate ────────────────────────────────
// R188(2026-06-03 · Tim 拍板「要使用引擎也要登入」)· 跑 10K Monte Carlo
// 模擬要先成為免費會員。 **看(賽事 / 開盤線 / 群眾線 / 公開戰績)免費 · 跑引擎
// 要登入。** wrapper:登入 → render children(MatchSimulator)· 沒登入 → 一張
// 乾淨的登入閘。 children 只在登入時 mount(模擬不會在沒登入 / SSR 時跑)。
// session 用 getSession 讀本地(不卡網路)· checking 時先放 skeleton 避免閃錯。
// ─────────────────────────────────────────────────────
export default function EngineGate({
  next,
  children,
}: {
  next: string;
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setLoggedIn(!!data.session);
      } catch {
        if (!cancelled) setLoggedIn(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loggedIn === null) {
    return <div className="skeleton h-48 rounded" aria-hidden="true" />;
  }

  if (!loggedIn) {
    return (
      <div className="border border-gold/40 bg-gold/[0.04] p-8 sm:p-10 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          引擎 · 免費會員專屬
        </p>
        <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight leading-snug mb-3">
          登入,就能親手跑這台<span className="text-gold">一萬次模擬</span>
        </h3>
        <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
          免費註冊就解鎖:跑引擎、押注、上海選天梯 —— 跟一台公開機器正面比準度。
          看賽事、開盤線、公開戰績永遠免費。
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          登入免費註冊 → 跑引擎
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
