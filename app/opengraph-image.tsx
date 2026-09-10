import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27：先刪掉不適合的，剩下的才給你看";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "狗飼料裁決器",
    headline: "講一句牠的狀況，我們先幫你刪掉不適合的",
    sub: "每一款都寫清楚什麼時候不要買",
    tone: "accent",
  });
}
