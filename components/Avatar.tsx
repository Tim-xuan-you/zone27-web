import { avatarColors, handleGlyph, stableSeed } from "@/lib/identity";

// ── ZONE 27 · Avatar · 幾何漸層頭像 ────────────────────────
// 給每個「人」一張臉:深藍漸層底 + 品牌色字符 · seed 衍生人人不同永遠一致。
// Polymarket/Linear/GitHub identicon 的高級版 · 守品牌(無招財貓/無紅綠/無 emoji)。
// 顏色綁穩定代號(stableSeed)· 之後加顯示名也不換臉色 · glyph 才隨名字變。
// ─────────────────────────────────────────────────────

export default function Avatar({
  seed,
  size = 28,
  glyph,
  color,
  className = "",
}: {
  /** handle 或顯示名 · 用來衍生顏色(取穩定代號)+ 預設字符 */
  seed: string;
  size?: number;
  /** 覆寫頭像上的字符(預設從 seed 推)· 之後顯示名可傳名字首字 */
  glyph?: string;
  /** 覆寫 accent 色(隊徽傳真隊色)· 同時把細框染成隊色 = 隊徽感 */
  color?: string;
  className?: string;
}) {
  const g = glyph ?? handleGlyph(seed);
  const { bg1, bg2, accent } = avatarColors(stableSeed(seed));
  const ink = color ?? accent;
  const fontSize = Math.round(size * (g.length > 1 ? 0.36 : 0.46));
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-[30%] font-mono font-medium tabular leading-none select-none ${
        color ? "" : "ring-1 ring-inset ring-bone/10"
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(140deg, ${bg1}, ${bg2})`,
        color: ink,
        fontSize,
        // 隊色版:細框染成隊色(半透明)= 隊徽辨識 · 不是大色塊(守不變賭場)
        boxShadow: color ? `inset 0 0 0 1px ${color}66` : undefined,
      }}
    >
      {g}
    </span>
  );
}
