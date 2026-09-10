import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "排除飲食法：怎麼真的找出牠對什麼過敏";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "一個對我們不利的數字",
    headline: "一直抓癢的狗，只有約 18% 是食物造成的",
    sub: "要確認得跑滿八週，而且最後要回測",
    tone: "cut",
  });
}
