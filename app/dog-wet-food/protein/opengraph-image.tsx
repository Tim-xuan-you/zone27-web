import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "罐子上的蛋白質差三倍，大部分是水";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "我們自己讀成分表",
    headline: "罐子上的蛋白質差三倍，大部分是水",
    sub: "扣掉水分之後，排名整個翻過來",
    tone: "accent",
  });
}
