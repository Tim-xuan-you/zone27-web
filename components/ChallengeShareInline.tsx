"use client";

import { useEffect, useState } from "react";

// ── ZONE 27 · 下戰帖 inline 分享(今日一戰 · 押下那刻的病毒槓桿)──────────────
// 押下一手 = 峰終時刻、最想曬的時候(CardBetStrip 註解:病毒槓桿)。 站上既有的是「外傳收據」
// (廣播:看我的牌 → 換一句讚就死)。 這顆把同一手變成「戰帖」(逼對方回手):朋友點開看不到
// 你押誰、得先自己盲押一手、賽後才揭盅誰讀得準 = 散播 + 留存一個動作全給。
//
// 永久碼是 md5(uid) · 瀏覽器算不出(WebCrypto 無 MD5)→ 跟 /api/my-code 拿(server 端算)。
// 拿不到(未登入 / 錯)→ 整顆自隱(graceful · 不留死鈕)。 暗金 · 無 emoji · 鏡收據外傳鈕樣式。
// ─────────────────────────────────────────────────────

export default function ChallengeShareInline({ matchId }: { matchId: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/my-code", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as { code?: unknown };
        if (!cancelled && typeof json.code === "string" && json.code) {
          setCode(json.code);
        }
      } catch {
        // graceful · 拿不到碼 → 按鈕不出現
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!code) return null;

  const buildUrl = () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://zone27.com.tw";
    return `${origin}/vs/${code}?m=${encodeURIComponent(matchId)}`;
  };

  const shareText =
    "我鎖了這場 · 你敢同場較量嗎?賽前各自封盤、賽後見真章 —— 你點開看不到我押誰,得先自己押一手。";

  const onShare = async () => {
    const url = buildUrl();
    // 手機原生分享面板優先(LINE / iMessage 一鍵 · 自動帶上戰帖 OG 卡)。
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: "ZONE 27 · 我下了一張戰帖",
          text: shareText,
          url,
        });
        return;
      } catch {
        // 取消 / 失敗 → 落到複製
      }
    }
    // 桌機沒有原生分享 → 複製鉤子 + 連結(graceful · 失敗安靜)。
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* 連剪貼簿都沒有 → 安靜 · 不報錯 */
      }
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="下戰帖給朋友 · 手機叫原生分享、桌機複製連結"
      className="inline-flex items-center gap-1.5 min-h-[36px] font-mono text-gold/90 hover:text-gold text-[10px] tracking-[0.2em] border border-gold/40 hover:border-gold/70 hover:bg-gold/10 px-2.5 py-1.5 transition-colors"
    >
      {copied ? "已複製 · 貼給朋友" : "下戰帖給朋友 →"}
    </button>
  );
}
