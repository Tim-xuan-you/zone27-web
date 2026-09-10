import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "寫著鮭魚、鴨肉、火雞，成分表裡有雞";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "我們自己讀成分表",
    headline: "寫著鴨肉、火雞、鮭魚，成分表前四項就有雞",
    sub: "貓飼料五款逐筆核對，附台灣代理商的中文標示",
    tone: "cut",
  });
}
