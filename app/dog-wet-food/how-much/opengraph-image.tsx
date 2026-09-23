import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { catalogOf } from "@/lib/catalog";
import { cansOf, mer } from "@/lib/engine";

export const alt = "狗一天要吃幾罐";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const day = mer(12, "adultFixed", "dog");
  const per = catalogOf("dog", "wet")
    .map((p) => { const c = cansOf(p.price.unit); return c && p.spec.kcal ? day / ((c.g / 1000) * p.spec.kcal) : null; })
    .filter((n): n is number => n !== null);
  return ogCard({
    kicker: "先算一下",
    headline: "狗一天要吃幾罐",
    sub: `12 公斤的狗全吃罐頭，一天 ${Math.min(...per).toFixed(1)} 到 ${Math.max(...per).toFixed(1)} 罐`,
    tone: "accent",
  });
}
