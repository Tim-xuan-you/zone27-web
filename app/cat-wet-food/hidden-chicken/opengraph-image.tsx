import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "寫著鮭魚、鴨肉的貓罐頭，很多是雞湯煮的";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "我們自己讀成分表",
    headline: "寫著鮭魚、鴨肉的罐頭，第一項是雞湯",
    sub: "名字沒寫雞的 8 款，5 款前三項就有雞",
    tone: "cut",
  });
}
