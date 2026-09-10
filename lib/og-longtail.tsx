import { ogCard } from "./og";
import { adjudicate } from "./engine";
import { catalog, constraintsFor } from "./catalog";
import { ALLERGENS, BREEDS, allPaths, resolve, situationOf, titleOf } from "./slugs";

/**
 * 長尾頁的分享卡片。
 *
 * 這 143 頁正是會被貼進品種 LINE 群組的那種 ——「柴犬雞肉過敏」
 * 在柴犬群組裡被轉出去的機率，遠高於首頁。所以每一頁都要有自己的卡，
 * 大字寫那一頁的題目，底下寫我們實際刪掉了幾款。
 *
 * Next.js 不允許在 catch-all 路由底下放 opengraph-image，
 * 所以拆成兩個路由：/og/dog-food/[a] 和 /og/dog-food/[a]/[b]，
 * 各自靜態產生。
 */

/* 所有長尾卡片會用到的字，一次抓完共用 */
const CHARSET =
  BREEDS.map((b) => b.zh).join("") +
  ALLERGENS.map((a) => a.zh).join("") +
  "飼料怎麼選過敏不含的狗先幫你刪掉款剩下附排除理由與購買時機建議進入裁決留下沒有一符合器0123456789，、。";

export function longtailParams(segments: 1 | 2) {
  return allPaths()
    .filter((s) => s.length === segments)
    .map((s) => (segments === 1 ? { a: s[0] } : { a: s[0], b: s[1] }));
}

export async function longtailCard(slug: string[]) {
  const p = resolve(slug);
  if (!p) {
    return ogCard({
      kicker: "狗飼料裁決器", headline: "狗飼料怎麼選",
      sub: "先刪掉不適合的，剩下的才給你看", fontText: CHARSET,
    });
  }

  const s = situationOf(p);
  s.constraints = constraintsFor(s);
  const v = adjudicate(catalog, s);
  const cut = v.startCount - v.survivors.length;

  return ogCard({
    kicker: "狗飼料裁決器",
    headline: titleOf(p),
    sub: v.survivors.length > 0
      ? `${v.startCount} 款進入裁決，刪掉 ${cut} 款，剩下 ${v.survivors.length} 款`
      : `${v.startCount} 款進入裁決，沒有一款符合`,
    fontText: CHARSET,
  });
}
