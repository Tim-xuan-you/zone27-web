"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

// ── ZONE 27 · 公開檔案 / 賽季回顧 分享卡 ──────────────────────────────
// soul-roadmap P0 的會員端觸點:把「你的含輸帳本可以丟給任何懷疑者」變成一個主動作。
// /u/[code](或 /u/[code]/season/[期])一旦貼到 LINE/FB/IG,預覽會自動帶上一張黑金
// OG 收據卡(已建好)—— 但會員根本不知道那張卡存在。 這裡補上:① 講清楚「傳出去會
// 自動帶上戰績卡」② 一鍵原生分享 ③「看分享卡長怎樣」直接預覽 PNG。
//
// R218 起改可參數化(path/heading/分享文/預覽路徑)· 預設值 = 原本 /member 公開檔行為
// (零改動)· 賽季回顧頁傳入 season 路徑即可共用同一套原生分享邏輯(DRY)。
//
// 極簡守則:會員自己的介面只放他的資料 + 下一步 · 這是「他的資料 + 一個動作」· 非招募。
// 暗金 · 無 emoji(✓ 是站上既有收據字彙非表情)· 無動畫。
// ─────────────────────────────────────────────────────

export default function ProfileShareCard({
  code,
  path,
  heading = "你的公開檔案",
  blurb,
  shareTitle = "ZONE 27 · 我的公開戰績",
  shareText = "我的含輸戰績:賽前就鎖死、含贏含輸、刪不掉。",
  previewHref,
  linkLabel,
}: {
  /** 永久碼(顯示 + 預設路徑用) */
  code: string;
  /** 要分享的站內路徑 · 預設 `/u/{code}` */
  path?: string;
  /** 卡片小標 */
  heading?: string;
  /** 描述段 · 不傳用預設(公開檔含輸卡)文案 */
  blurb?: ReactNode;
  /** navigator.share 的 title */
  shareTitle?: string;
  /** navigator.share 的 text(+ 桌機複製的文字) */
  shareText?: string;
  /** OG 預覽路徑 · 預設 `/u/{code}/opengraph-image` */
  previewHref?: string;
  /** 底部連結顯示文字 · 預設 = path */
  linkLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const resolvedPath = path ?? `/u/${code}`;
  const resolvedPreview = previewHref ?? `/u/${code}/opengraph-image`;
  const resolvedLinkLabel = linkLabel ?? resolvedPath;

  const fullUrl = () =>
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://zone27-web.vercel.app") + resolvedPath;

  const onShare = async () => {
    const url = fullUrl();
    // 手機原生分享面板優先(LINE / FB / IG 一鍵 · 那邊會自動抓 OG 戰績卡)。
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url });
        return;
      } catch {
        // 取消或失敗 → 落到複製
      }
    }
    // 桌機沒有原生分享 → 複製到剪貼簿(graceful · 失敗安靜不報錯)。
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
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
        {heading}
      </p>
      <p className="text-mute text-sm leading-relaxed mb-4">
        {blurb ?? (
          <>
            含輸帳本、賽前鎖定、刪不掉。 傳到 LINE / FB / IG,會自動帶上{" "}
            <span className="text-bone">你的含輸戰績卡</span> —— 賣明牌的結構上做不出這張
            (他們靠藏輸活)。 把它<span className="text-bone">丟給不信你的人</span>:
            他不用登入,就能驗證你到底多準。
          </>
        )}
      </p>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onShare}
          aria-label="分享 · 手機叫原生分享、桌機複製連結"
          className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-[11px] tracking-[0.2em] px-5 py-2.5 hover:bg-gold-soft transition-colors"
        >
          {copied ? "已複製 · 貼給對手" : "傳給朋友 / 對手 →"}
        </button>
        <Link
          href={resolvedPath}
          className="font-mono text-bone/90 text-xs hover:text-gold underline-offset-4 hover:underline transition-colors truncate"
        >
          {resolvedLinkLabel}
        </Link>
      </div>

      <div className="mt-3">
        <Link
          href={resolvedPreview}
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
