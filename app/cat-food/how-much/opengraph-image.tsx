import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { mer } from "@/lib/engine";

export const alt = "貓一天要吃多少飼料";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const kcal = Math.round(mer(4, "adultFixed", "cat"));
  return ogCard({
    kicker: "貓飼料計算機",
    headline: "結紮的貓，照狗的算法會多餵三成",
    sub: `4 公斤已結紮的貓，一天大約 ${kcal} 大卡`,
  });
}
