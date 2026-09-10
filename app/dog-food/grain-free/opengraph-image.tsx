import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "無穀飼料到底有沒有比較好";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "用我們自己的資料",
    headline: "無穀飼料，豆類反而最多",
    sub: "無穀不等於無雞、不等於低碳水、也不等於豆類少",
    tone: "cut",
  });
}
