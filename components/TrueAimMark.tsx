// ── ZONE 27 · 準心 幾何記號(頁面 HTML 用 · 非 emoji · 米其林克制)──────────────────
// 同心瞄準環 + 十字準星 = 「瞄哪打哪」的物理隱喻(= 說幾成、就真的中幾成)。
// 跟對帳之星(五角星 · 向外刺 = 攻擊性的「贏」)輪廓一眼可分:準心向內收斂於一點(收斂的「準」)。
// dim = 未達標(只描邊、中心不亮);達標 = 金準心(內環微填 + 中心金心)。
// 🔴 這支給「頁面」用(/u · /member)· OG 卡(next/og)另在各自檔內 inline circle/line(0 symbol glyph 房規)。
// viewBox 0 0 32 32 與 ReckoningStarMark 同規 → 可並排同高。 單一真相門檻在 lib/true-aim。
// ─────────────────────────────────────────────────────

export default function TrueAimMark({
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
      {/* 外瞄準環 */}
      <circle
        cx="16"
        cy="16"
        r="12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      {/* 內環(達標微填 = 一點重量) */}
      <circle
        cx="16"
        cy="16"
        r="6"
        fill="currentColor"
        fillOpacity={dim ? 0 : 0.12}
        stroke="currentColor"
        strokeWidth="1.1"
      />
      {/* 十字準星(四向 tick · 收斂於中心) */}
      <line x1="16" y1="1.5" x2="16" y2="6.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="16" y1="25.5" x2="16" y2="30.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="1.5" y1="16" x2="6.5" y2="16" stroke="currentColor" strokeWidth="1.3" />
      <line x1="25.5" y1="16" x2="30.5" y2="16" stroke="currentColor" strokeWidth="1.3" />
      {/* 正中金心(落點 = 瞄準點) */}
      <circle cx="16" cy="16" r="1.8" fill="currentColor" fillOpacity={dim ? 0.4 : 1} />
    </svg>
  );
}
