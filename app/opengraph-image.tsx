import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27：陪孩子動腦的益智學習單";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    // 2026-10-01 網站改成孩子的學習單。家長在班級群組看到的就是這張
    kicker: "免費・A4・印了就能寫",
    headline: "陪孩子動腦的益智學習單",
    sub: "說明都有注音，不用寫國字，卡住了有提示",
    tone: "accent",
  });
}
