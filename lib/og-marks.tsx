import { BRAND } from "@/lib/brand";

// ── ZONE 27 · OG geometric marks (R234) ──────────────────────────────
// next/og (Satori) 的 bundled 系統字缺 Dingbat / arrow glyph —— →, ▶, ✓, ✕,
// ★, ▸ 貼到 LINE / FB 的分享預覽卡會 render 成豆腐方塊(實機驗證屬實 · 見
// memory OG 房規 R223)。 房規:OG PNG 只用 CJK + 拉丁 + 數字 + 中點;任何
// 箭頭 / 播放 / 勾叉一律「畫出來」。 Satori 可靠 raster 的是 inline SVG
// (不是 CSS border-triangle trick),所以幾何標記統一走 SVG。
// ─────────────────────────────────────────────────────────────────────

/** 右指實心三角 · 取代 OG 卡裡的 → 與 ▶(箭頭頭 / 播放鍵同一個原始形狀)。 */
export function Tri({
  size = 12,
  color = BRAND.gold,
  opacity = 1,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="2.5,1.2 8.8,5 2.5,8.8" fill={color} fillOpacity={opacity} />
    </svg>
  );
}
