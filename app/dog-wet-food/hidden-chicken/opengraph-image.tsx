import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { catalogOf } from "@/lib/catalog";
import { NAME_HAS_CHICKEN } from "@/lib/chicken";

export const alt = "名字寫鹿肉、鱉肉的狗罐頭，第一二項是雞";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  // 款數照資料算：分享圖跟頁面講的一定要是同一個數字
  const unnamed = catalogOf("dog", "wet").filter((p) => !NAME_HAS_CHICKEN.test(p.name));
  const hidden = unnamed.filter((p) => p.chicken?.status === "hidden");
  return ogCard({
    kicker: "我們自己讀成分表",
    headline: "名字寫鹿肉、鱉肉的狗罐頭，第一二項是雞",
    sub: `名字沒寫雞的 ${unnamed.length} 款，${hidden.length} 款成分表裡有雞`,
    tone: "cut",
  });
}
