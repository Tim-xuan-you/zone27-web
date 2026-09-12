import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { mer } from "@/lib/engine";

export const alt = "貓一天要吃幾罐";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const kcal = Math.round(mer(4, "adultFixed", "cat"));
  return ogCard({
    kicker: "貓主食罐計算機",
    headline: "同樣 85 克，一包 57 大卡、一罐 131 大卡",
    sub: `4 公斤已結紮的貓，一天大約 ${kcal} 大卡`,
    tone: "accent",
  });
}
