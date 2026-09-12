import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "副食罐可以當主食嗎";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "貓主食罐",
    headline: "副食罐可以當主食嗎？偶爾可以，天天不行",
    sub: "我們讀的副食罐，鈣只有 0.002% 和 0.004%",
    tone: "cut",
  });
}
