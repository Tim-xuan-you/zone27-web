import { ogCard } from "@/lib/og";
import { byId, catalog } from "@/lib/catalog";
import { nameMeatsOf, STAMP } from "@/lib/chicken";
import { meatsOf } from "@/lib/labels";

/**
 * 每一款商品的分享卡：右上角蓋「藏雞／沒有雞」的章，大字寫那個發現。
 *
 * 商品頁按「分享這一款」傳到 LINE 群組，對方看到的就是
 * 「名字寫鴨，第 2 項是雞肉」加一個紅色的章，不用點進來就知道重點，也認得是哪個網站。
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.map((p) => ({ id: p.id }));
}

// 全部商品共用一份字集：幾十張圖只下載一次字型
const CHARSET =
  catalog.map((p) => p.brand + p.name + meatsOf(p) + (p.chicken?.found ?? []).join("")).join("") +
  "名字寫沒有雞成分表裡是肉油脂用脂肪的來源清楚只有什麼時候不要買這一頁藏";

const TONE = { hidden: "cut", fat: "warn", unsure: "warn", clean: "keep", chicken: "muted" } as const;

function headlineOf(id: string): { headline: string; tone: "accent" | "cut" } {
  const p = byId(id)!;
  const st = p.chicken?.status ?? "chicken";
  if (st === "hidden") {
    const nm = nameMeatsOf(p.name);
    // 「第 2 項：雞肉」→「第 2 項是雞肉」；名字只寫「野禽」這種，講「名字寫禽肉」反而更亂，用通用的說法
    const hit = p.chicken?.found?.find((f) => /雞/.test(f) && /第\s*\d+\s*項/.test(f));
    const line = hit?.replace(/^成分表/, "").replace("：", "是");
    return { headline: nm && !nm.includes("禽") && line ? `名字寫${nm}，${line}` : "名字沒寫雞，成分表裡有雞", tone: "cut" };
  }
  if (st === "fat") return { headline: "肉沒有雞，油脂用雞脂肪", tone: "cut" };
  if (st === "unsure") return { headline: "肉的來源沒寫清楚", tone: "cut" };
  if (st === "clean") return { headline: `成分表裡沒有雞，肉只有${meatsOf(p)}`, tone: "accent" };
  return { headline: "什麼時候不要買，這一頁寫了", tone: "accent" };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = byId(id)!;
  const st = p.chicken?.status ?? "chicken";
  const { headline, tone } = headlineOf(id);
  return ogCard({
    kicker: p.brand,
    headline,
    sub: p.name,
    tone,
    fontText: CHARSET,
    stamp: { zh: STAMP[st].zh, tone: TONE[st] },
  });
}
