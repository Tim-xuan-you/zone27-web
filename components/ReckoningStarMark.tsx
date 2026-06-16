// ── ZONE 27 · 對帳之星 幾何金星標記(頁面 HTML 用 · 非 emoji · 米其林克制)──────────
// dim = 未達標暗星(只描邊不填)。 達標 = 金星(低透明填 + 金邊)。 SVG polygon · 守暗金、無紅綠。
// 🔴 這支給「頁面」用(/u ProfileView · /member)· OG 卡(next/og)另在各自檔內 inline polygon ——
//    別把這個 component import 進 next/og route(避免 client/SSR 邊界 + 保 OG 0 symbol glyph 房規)。
// 單一真相門檻在 lib/reckoning-star(本檔只管「畫一顆星」)。
// ─────────────────────────────────────────────────────

export default function ReckoningStarMark({
  size = 30,
  dim = false,
}: {
  size?: number;
  dim?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={`shrink-0 ${dim ? "text-mute/45" : "text-gold"}`}
    >
      <polygon
        points="16,2 19.5,11.5 29.5,11.5 21.5,18 24.5,29 16,22.5 7.5,29 10.5,18 2.5,11.5 12.5,11.5"
        fill="currentColor"
        fillOpacity={dim ? 0 : 0.18}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
