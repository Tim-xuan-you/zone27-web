"use client";

import Link from "next/link";
import { useState } from "react";

// ── ZONE 27 · 你的公開檔案分享卡(/member)──────────────────────
// soul-roadmap P0 的會員端觸點:把「你的含輸帳本可以丟給任何懷疑者」從一行小字
// 升成一個會員主動作 —— 連結 + 一鍵複製。 這是 costly signal 的入口(地位賺來、也攤得開驗證)。
// 極簡守則:會員自己的介面只放他的資料+下一步 · 這是「他的資料 + 一個動作」· 非招募。
// 暗金 · 無 emoji(✓ 是站上既有收據字彙非表情)· 無動畫。
// ─────────────────────────────────────────────────────

export default function ProfileShareCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/u/${code}`;

  const copy = async () => {
    try {
      const url =
        (typeof window !== "undefined" ? window.location.origin : "") + path;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard 不可用 → 連結仍可手動複製 · graceful */
    }
  };

  return (
    <section className="mt-6 bg-gold/[0.05] border border-gold/30 p-5">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2">
        你的公開檔案
      </p>
      <p className="text-mute text-sm leading-relaxed mb-3.5">
        含輸帳本、賽前鎖定、刪不掉。 把這個連結丟給任何懷疑你的人 ——{" "}
        <span className="text-bone">他不用登入也看得到</span>。
      </p>
      <div className="flex items-center gap-2.5 flex-wrap">
        <Link
          href={path}
          className="font-mono text-bone text-sm hover:text-gold underline-offset-4 hover:underline transition-colors truncate"
        >
          /u/{code}
        </Link>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 font-mono text-[10px] tracking-[0.3em] px-3 py-1.5 border border-gold/40 text-gold/80 hover:bg-gold/10 hover:text-gold transition-colors"
        >
          {copied ? "已複製 ✓" : "複製連結"}
        </button>
      </div>
    </section>
  );
}
