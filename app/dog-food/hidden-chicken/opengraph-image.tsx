import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "寫著低敏，成分表裡有雞";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "我們自己讀成分表",
    headline: "寫著低敏，成分表第一項是雞肉",
    sub: "四款逐筆核對，包含我們自己在推的那一款",
    tone: "cut",
  });
}
