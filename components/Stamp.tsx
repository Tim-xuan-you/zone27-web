import { STAMP } from "@/lib/chicken";
import type { Product } from "@/lib/types";

/**
 * 「藏雞／有雞／沒有雞」標章。
 *
 * 全站只有這一個樣子：商品頁、推薦卡、查藏雞、分享卡都是它。
 * 做成有框、微微歪一點的章，像檢驗單上蓋的印。截圖傳到群組，
 * 別人不用看網址也認得「這是那個查有沒有雞的網站」。
 */
export default function Stamp({ p, size = "sm" }: { p: Pick<Product, "chicken">; size?: "sm" | "lg" }) {
  const st = p.chicken?.status;
  if (!st) return null;
  const s = STAMP[st];
  return (
    <span
      title={s.zh}
      style={{ ...base, ...(size === "lg" ? lg : sm), color: s.fg, background: s.bg, borderColor: s.fg }}
    >
      {s.zh}
    </span>
  );
}

const base: React.CSSProperties = {
  display: "inline-block", flex: "none", fontWeight: 900, letterSpacing: ".08em", whiteSpace: "nowrap",
  border: "2px solid", borderRadius: 8, transform: "rotate(-3deg)", lineHeight: 1.3,
};
const sm: React.CSSProperties = { fontSize: 13, padding: "2px 8px" };
const lg: React.CSSProperties = { fontSize: 20, padding: "5px 14px", borderWidth: 3, borderRadius: 10 };
