import type { ReactNode } from "react";

// ── ZONE 27 · Disclosure(原生折疊 · server-safe)──────────────────────────
// R241 會員頁收納:把「高門檻、低頻、佔版面大」的區塊(如可攜憑證卡)預設收起,
// 點 summary 才展開。 用原生 <details>/<summary> → 0 client JS、SSR 友善、無水合成本。
// 🔴 守品牌:無紅綠、無誇張動畫、summary 用 mute→gold · 跟既有 link row 同視覺語彙。
// summary 文案要「具體說出點下去看到什麼」(別寫「更多/進階」這種沒人點的模糊標題)。
// ─────────────────────────────────────────────────────
export default function Disclosure({
  summary,
  children,
  className = "",
}: {
  summary: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={`mt-6 group ${className}`}>
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden border-b border-line/40 pb-3 font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className="text-gold/45 transition-transform group-open:rotate-90"
        >
          ›
        </span>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}
