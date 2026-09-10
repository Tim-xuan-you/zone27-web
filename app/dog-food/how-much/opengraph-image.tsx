import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "狗一天要吃多少飼料";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "獸醫的能量公式",
    headline: "狗一天要吃多少飼料",
    sub: "一天幾克、這包吃幾天、一個月多少錢",
    tone: "accent",
  });
}
