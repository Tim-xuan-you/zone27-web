import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27 狗飼料";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "狗飼料怎麼選",
    headline: "依品種和過敏原，先刪掉不適合的",
    sub: "每一款都附排除理由與購買時機",
    tone: "accent",
  });
}
