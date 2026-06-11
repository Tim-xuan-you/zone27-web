"use client";

import Link from "next/link";
import { useState } from "react";

// ── ZONE 27 · 你的公開檔案分享卡(/member)──────────────────────
// soul-roadmap P0 的會員端觸點:把「你的含輸帳本可以丟給任何懷疑者」變成一個會員主動作。
// /u/[code] 一旦貼到 LINE/FB/IG,預覽會自動帶上一張黑金「含輸戰績卡」(OG image · 已建好)
// —— 但會員根本不知道那張卡存在。 這裡補上:① 講清楚「傳出去會自動帶上戰績卡」②一鍵原生分享
// (手機叫 LINE/FB/IG 面板)③「看分享卡長怎樣」直接預覽那張 PNG。 = 把已存在的病毒資產
// 從「藏起來」變「看得見、一鍵傳」。 報馬仔結構上掛不出含輸卡(他們靠藏輸活)。
//
// 極簡守則:會員自己的介面只放他的資料 + 下一步 · 這是「他的資料 + 一個動作」· 非招募。
// 暗金 · 無 emoji(✓ 是站上既有收據字彙非表情)· 無動畫。
// ─────────────────────────────────────────────────────

export default function ProfileShareCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/u/${code}`;

  const fullUrl = () =>
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://zone27-web.vercel.app") + path;

  const onShare = async () => {
    const url = fullUrl();
    const text = "我的含輸戰績:賽前就鎖死、含贏含輸、刪不掉。";
    // 手機原生分享面板優先(LINE / FB / IG 一鍵 · 那邊會自動抓含輸戰績卡)。
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "ZONE 27 · 我的公開戰績", text, url });
        return;
      } catch {
        // 取消或失敗 → 落到複製
      }
    }
    // 桌機沒有原生分享 → 複製到剪貼簿(graceful · 失敗安靜不報錯)。
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* 連剪貼簿都沒有 → 連結仍在下方可手動複製 */
      }
    }
  };

  return (
    <section className="mt-6 bg-gold/[0.05] border border-gold/30 p-5">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-2">
        你的公開檔案
      </p>
      <p className="text-mute text-sm leading-relaxed mb-4">
        含輸帳本、賽前鎖定、刪不掉。 傳到 LINE / FB / IG,會自動帶上{" "}
        <span className="text-bone">你的含輸戰績卡</span> —— 賣明牌的結構上做不出這張
        (他們靠藏輸活)。
      </p>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onShare}
          aria-label="分享你的公開含輸戰績 · 手機叫原生分享、桌機複製連結"
          className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-[11px] tracking-[0.2em] px-5 py-2.5 hover:bg-gold-soft transition-colors"
        >
          {copied ? "已複製 · 貼給對手" : "傳給朋友 / 對手 →"}
        </button>
        <Link
          href={path}
          className="font-mono text-bone/90 text-xs hover:text-gold underline-offset-4 hover:underline transition-colors truncate"
        >
          /u/{code}
        </Link>
      </div>

      <div className="mt-3">
        <Link
          href={`/u/${code}/opengraph-image`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-mute/55 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
        >
          看分享出去長怎樣 · 戰績卡預覽 →
        </Link>
      </div>
    </section>
  );
}
