import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27：先刪掉不適合的，剩下的才給你看";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    // 開了貓飼料、貓罐頭之後，這裡還寫「狗飼料裁決器」，養貓的人看到預覽就不會點
    kicker: "狗飼料・貓飼料・貓罐頭",
    headline: "點一下牠的年紀和狀況，先刪掉不適合的",
    sub: "每一款都寫清楚什麼時候不要買",
    tone: "accent",
  });
}
