"use client";

import { useState } from "react";

// ── ZONE 27 · 一鍵拿取可攜憑證(/member · 達到對帳之星 / 已贏過引擎才亮)──────────────
// 把「你的 ZONE 27 準度」變成貼得到處都是的履歷/談判籌碼:徽章圖 + 嵌入碼 + 履歷句 + LinkedIn 深連結 +
// Email 純文字後備。 🔴 鐵律(米其林「門牌服從指南」):每一種拿取物的點擊一律落回 live /u(會即時重算、
// 滑落即收回)· 圖/截圖永遠不是憑證,憑證是那本含輸帳本。 數字永遠連著卡尺(句子由 credentialHeadline 出 ·
// 含「N 場含輸 · vs 57% 引擎」)· 單獨的 X% 不外傳。 0 賭場 · earned 不可買 · 訪客面 0 提 GitHub/開源。
// ─────────────────────────────────────────────────────

// 後備網址(SSR / 無 window 時)· 上線自訂網域後改這裡一處即可。
const CANON_ORIGIN = "https://zone27-web.vercel.app";

export default function CredentialGrabPanel({
  code,
  sentence,
}: {
  /** 永久碼 · 憑證一律連回 /u/[code] */
  code: string;
  /** credentialHeadline(identity).sentence(不含 verify URL · 這裡用 origin 補上) */
  sentence: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  // 用真實 origin(client)· 上線自訂網域後嵌入碼自動跟著換 —— SSR 退 CANON(避免 hydration 漂移以
  // 純展示文字呈現,複製當下一律取現值)。
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : CANON_ORIGIN;
  const profileUrl = `${origin}/u/${code}`;
  const badgeUrl = `${origin}/u/${code}/badge`;
  const alt = "ZONE 27 公開含輸戰績";

  const html = `<a href="${profileUrl}"><img src="${badgeUrl}" alt="${alt}" width="340"></a>`;
  const md = `[![${alt}](${badgeUrl})](${profileUrl})`;
  const bio = `${sentence} · 查驗 ${profileUrl}`;
  const plain = `ZONE 27 公開含輸戰績 · 查驗 ${profileUrl}`;
  // LinkedIn「加到個人檔案」深連結 · certUrl 永遠把驗證帶回 live /u(不是截圖)。
  const linkedin =
    `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent("ZONE 27 對帳之星")}` +
    `&certUrl=${encodeURIComponent(profileUrl)}` +
    `&certId=${encodeURIComponent(code)}`;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard 不可用 · 文字已可見、手動選取複製 */
    }
  };

  const rows: { k: string; label: string; text: string }[] = [
    { k: "html", label: "嵌入網站 / 部落格(HTML)", text: html },
    { k: "md", label: "Markdown 嵌入碼(Notion / 論壇 / 文件)", text: md },
    { k: "bio", label: "履歷 / 個人簡介 一句話", text: bio },
    { k: "plain", label: "Email 簽名(純文字 · 防被剝連結)", text: plain },
  ];

  return (
    <section className="mt-6 border border-gold/35 bg-gold/[0.04] p-5">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-1">
        / 你的可攜憑證 · 貼到任何地方
      </p>
      <p className="text-mute/80 text-[12px] leading-relaxed mb-4 max-w-lg">
        貼到 bio / email 簽名 / LinkedIn / 論壇 —— 別人點一下,就落回你
        <span className="text-bone">即時重算、含輸、刪不掉</span>的公開帳本自己驗。
        圖只是鉤子,憑證永遠是那本帳。
      </p>

      {/* 徽章預覽(動態圖端點 · 非 next/image 適用) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/u/${code}/badge`}
        alt={alt}
        width={340}
        className="block w-full max-w-[340px] border border-line/50 mb-4"
      />

      <div className="border-t border-line/40">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex items-start gap-3 py-2.5 border-b border-line/40 last:border-b-0"
          >
            <div className="min-w-0 flex-1">
              <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mb-1">
                {r.label}
              </p>
              <p className="font-mono text-bone/70 text-[11px] leading-relaxed break-all max-h-[3.4em] overflow-hidden">
                {r.text}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy(r.text, r.k)}
              className="shrink-0 px-2.5 py-1 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.2em] hover:bg-gold/10 transition-colors"
            >
              {copied === r.k ? "已複製 ✓" : "複製"}
            </button>
          </div>
        ))}
      </div>

      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy font-mono text-[11px] tracking-[0.2em] hover:bg-gold-soft transition-colors"
      >
        加到 LinkedIn 個人檔案 →
      </a>
    </section>
  );
}
