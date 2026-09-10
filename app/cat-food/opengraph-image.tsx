import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27 貓飼料";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "貓飼料怎麼選",
    headline: "名字寫鮭魚、鴨肉的，成分表裡可能有雞",
    sub: "我們一款一款讀過台灣代理商的中文標示",
    tone: "accent",
  });
}
