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
  supporter = false,
  className = "",
}: {
  /** handle 或顯示名 · 用來衍生顏色(取穩定代號)+ 預設字符 */
  seed: string;
  size?: number;
  /** 覆寫頭像上的字符(預設從 seed 推)· 之後顯示名可傳名字首字 */
  glyph?: string;
  /** 覆寫 accent 色(隊徽傳真隊色)· 同時把細框染成隊色 = 隊徽感 */
  color?: string;
  /** 付費支持者(BLACK/GOLD)· 加一圈低調金環 = 看得見的「身分」標記 ·
   *  🔴 這是「贊助開放引擎」的身分,不是準度 —— 絕不暗示付費比較準(守 57% 誠實王牌)。 */
  supporter?: boolean;
  className?: string;
}) {
  const g = glyph ?? handleGlyph(seed);
  const { bg1, bg2, accent } = avatarColors(stableSeed(seed));
  const ink = color ?? accent;
  // 字數越多越縮:1 字(中文/單碼)0.46 · 2 字(KC/SF)0.40 · 3 字(LAD/NYY)0.32
  // → MLB 三碼縮寫塞得進小圓徽不溢出。
  const glyphLen = [...g].length;
  const fontSize = Math.round(
    size * (glyphLen >= 3 ? 0.32 : glyphLen === 2 ? 0.4 : 0.46),
  );
  // 隊色內框(隊徽辨識)+ 支持者金環(身分標記)· 可同時存在 · 沒有就 undefined。
  const teamInset = color ? `inset 0 0 0 1px ${color}66` : null;
  const supporterRing = supporter ? "0 0 0 1.5px rgba(212,175,55,0.75)" : null;
  const boxShadow = [teamInset, supporterRing].filter(Boolean).join(", ") || undefined;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-[30%] font-mono font-medium tabular leading-none select-none ${
        color || supporter ? "" : "ring-1 ring-inset ring-bone/10"
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(140deg, ${bg1}, ${bg2})`,
        color: ink,
        fontSize,
        boxShadow,
      }}
    >
      {g}
    </span>
  );
}
