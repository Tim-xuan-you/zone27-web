import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27 狗主食罐怎麼選";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "狗主食罐怎麼選",
    headline: "名字寫鹿肉、鱉肉的，成分表前兩項常常是雞",
    sub: "我們一款一款讀過台灣架上的中文標示",
    tone: "accent",
  });
}
