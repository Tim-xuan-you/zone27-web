import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { checkItems, checkStats } from "@/lib/check";

/**
 * 「查藏雞」的分享卡。這一頁最常被丟進 LINE 群組、臉書社團，
 * 卡片上放的是那個反直覺的數字本身：看到的人會想知道自己家那包是不是其中一款。
 */

const st = checkStats(checkItems());

export const alt = `名字沒寫雞的 ${st.unnamed} 款，${st.hidden} 款成分表裡有雞`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    kicker: "我們自己讀成分表",
    headline: `名字沒寫雞的 ${st.unnamed} 款，${st.hidden} 款有雞`,
    sub: "你家那包有沒有藏雞？打名字就查得到",
    tone: "cut",
  });
}
