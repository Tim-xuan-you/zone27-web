import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27 狗";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "狗飼料、狗零食怎麼選",
    headline: "講一句牠的狀況，先刪掉不適合的",
    sub: "我們一款一款讀過台灣架上的中文標示",
    tone: "accent",
  });
}
