"use client";

import { useState } from "react";
import { ShareIcon } from "./Icons";

/**
 * 分享：手機上叫出手機自己的分享選單（LINE、臉書、Messenger），電腦上沒有那個選單就複製連結。
 *
 * 2026-09-13 Tim 問要不要「加到我的最愛、按愛心、分享」。
 * 收藏和愛心不做：要收藏就要會員、要登入、要存資料；飼料一個月買一次，
 * 沒有人會回來看收藏清單，蝦皮本身也有收藏。按讚數沒人按的時候掛出來反而難看，假的更不行。
 *
 * 分享要做：養寵物的人本來就會互相問「你家吃什麼」。一條連結點開就是同一個答案，
 * 是讀者幫我們帶人進來的路。不用會員、不用後台，一顆按鈕。
 */
export default function Share({ path, text, label = "分享給朋友" }: { path: string; text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function go() {
    const url = new URL(path, window.location.origin).toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "ZONE 27", text, url });
        return;
      } catch (e) {
        // 自己按了取消，就什麼都不做；其他錯誤（有的瀏覽器不讓分享）改成複製連結
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("複製這條連結", url);
    }
  }

  return (
    <button type="button" onClick={go} style={btn}>
      <ShareIcon size={16} />
      {copied ? "已複製連結，貼給朋友就好" : label}
    </button>
  );
}

const btn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", font: "inherit",
  fontSize: 14, color: "var(--muted)", background: "var(--surface)",
  border: "1px solid var(--line)", borderRadius: 999, padding: "8px 16px",
};
