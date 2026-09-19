import type { Form } from "@/lib/types";
/**
 * 全站只有四個圖示：狗、貓、乾糧、罐頭。
 *
 * 2026-09-13 Tim 問網站會不會太生硬、要不要小圖案。
 * 圖示只放在「讀者要做選擇」的地方（狗還是貓、乾糧還是罐頭、類目卡），
 * 讓人一眼認出「這是在講我家那隻」。不拿來裝飾內文：
 * 每一段字前面都掛一個小圖，看起來就是模板站，專業感反而掉下去。
 *
 * 自己畫的線條，不下載別人的圖；顏色跟著文字走（currentColor），深淺色主題都不用另外處理。
 */

type P = { size?: number; title?: string };

function Svg({ size = 18, title, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
      role={title ? "img" : undefined} aria-hidden={title ? undefined : true}
      style={{ flex: "none", display: "block" }}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** 狗：長長垂下來的耳朵，一看就不是貓 */
export function DogIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M8 7.2C9.2 6.3 10.5 5.9 12 5.9s2.8.4 4 1.3c1.2 1.5 1.7 3.6 1.5 5.8-.4 3.8-2.6 6.4-5.5 6.4s-5.1-2.6-5.5-6.4c-.2-2.2.3-4.3 1.5-5.8Z" />
      <path d="M8 7.2C6.3 5.8 4.2 6.1 3.6 8.3c-.6 2.4.2 5.3 1.9 6.4.9.6 1.8-.1 2-1.2.2-1.3.1-2.8.5-4" />
      <path d="M16 7.2c1.7-1.4 3.8-1.1 4.4 1.1.6 2.4-.2 5.3-1.9 6.4-.9.6-1.8-.1-2-1.2-.2-1.3-.1-2.8-.5-4" />
      <circle cx="10.2" cy="11.3" r=".6" fill="currentColor" />
      <circle cx="13.8" cy="11.3" r=".6" fill="currentColor" />
      <ellipse cx="12" cy="14.2" rx="1.2" ry=".8" fill="currentColor" />
      <path d="M12 15v1.1M10.7 16.5c.4.3.8.5 1.3.5s.9-.2 1.3-.5" />
    </Svg>
  );
}

/** 貓：尖耳的頭 */
export function CatIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M5.2 9.3V4.2l4 3.2c.9-.3 1.8-.4 2.8-.4s1.9.1 2.8.4l4-3.2v5.1c.9 1.3 1.3 2.8 1.2 4.4-.3 3.7-3.5 6-8 6s-7.7-2.3-8-6c-.1-1.6.3-3.1 1.2-4.4Z" />
      <circle cx="9.4" cy="12.4" r=".6" fill="currentColor" />
      <circle cx="14.6" cy="12.4" r=".6" fill="currentColor" />
      <path d="M11.3 15l.7.6.7-.6" />
      <path d="M3 13.6l3.4.5M3.4 16.2l3.2-.9M21 13.6l-3.4.5M20.6 16.2l-3.2-.9" />
    </Svg>
  );
}

/** 乾糧：封口折起來的袋子 */
export function BagIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M6.5 7.5 7.4 4h9.2l.9 3.5" />
      <path d="M6.5 7.5h11v11.3c0 .7-.5 1.2-1.2 1.2H7.7c-.7 0-1.2-.5-1.2-1.2V7.5Z" />
      <circle cx="12" cy="13.8" r="2.2" />
    </Svg>
  );
}

/** 罐頭：拉環罐 */
export function CanIcon(p: P) {
  return (
    <Svg {...p}>
      <ellipse cx="12" cy="7" rx="6.5" ry="2.3" />
      <path d="M5.5 7v10c0 1.3 2.9 2.3 6.5 2.3s6.5-1 6.5-2.3V7" />
      <path d="M5.5 10.6c0 1.3 2.9 2.3 6.5 2.3s6.5-1 6.5-2.3" />
      <ellipse cx="12" cy="7" rx="1.9" ry=".6" />
    </Svg>
  );
}

/** 分享：箭頭從盒子裡出來（跟手機分享鈕長得一樣，大家認得） */
export function ShareIcon(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 3.5v11" />
      <path d="M8 7.2 12 3.5l4 3.7" />
      <path d="M7.5 10.5H6c-.8 0-1.5.7-1.5 1.5v7c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5v-7c0-.8-.7-1.5-1.5-1.5h-1.5" />
    </Svg>
  );
}

/** 類目用哪一個：罐頭看形態，乾糧看動物 */
export function CategoryIcon({ species, form, size }: { species: "dog" | "cat"; form: Form; size?: number }) {
  if (form === "treat") return <TreatIcon size={size} />;
  if (form === "litter") return <LitterIcon size={size} />;
  if (form === "wet") return <CanIcon size={size} />;
  return species === "cat" ? <CatIcon size={size} /> : <DogIcon size={size} />;
}

/** 零食：一條肉泥的包裝，斜放。線條、不填色 */
export function TreatIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7.5 3.6h9a1.5 1.5 0 0 1 1.5 1.5v13.8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.9V5.1a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M6 7.2h12" />
      <path d="M9.4 11h5.2" />
      <path d="M9.4 14.4h5.2" />
    </svg>
  );
}

/** 貓砂：一個貓砂盆，裡面幾顆砂。跟其他圖示一樣，線條、不填色 */
export function LitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 9h17l-1.6 9.2a1.5 1.5 0 0 1-1.5 1.3H6.6a1.5 1.5 0 0 1-1.5-1.3Z" />
      <path d="M2.5 9 4 6.2A1.5 1.5 0 0 1 5.3 5.5h13.4A1.5 1.5 0 0 1 20 6.2L21.5 9" />
      <circle cx="9" cy="13.5" r=".9" />
      <circle cx="13" cy="15.8" r=".9" />
      <circle cx="15.5" cy="12.4" r=".9" />
    </svg>
  );
}
