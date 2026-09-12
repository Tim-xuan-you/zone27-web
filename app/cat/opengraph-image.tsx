import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27 貓";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "貓飼料、貓主食罐怎麼選",
    headline: "乾糧跟罐頭都可以問，先刪掉不適合的",
    sub: "我們一款一款讀過台灣架上的中文標示",
    tone: "accent",
  });
}
