import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "第一次養狗，先買這幾樣";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "第一次養狗",
    headline: "先買這幾樣，每一樣直接給答案",
    sub: "吃什麼、吃多少、零食要不要給",
    tone: "accent",
  });
}
