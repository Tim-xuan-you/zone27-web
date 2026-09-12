import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "ZONE 27 貓主食罐";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "貓主食罐怎麼選",
    headline: "先分主食罐跟副食罐，再看第一項是不是雞湯",
    sub: "每一款都寫清楚什麼時候不要買、一天要吃幾罐",
    tone: "accent",
  });
}
