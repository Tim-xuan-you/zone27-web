/**
 * 日期一律用台北時間。
 *
 * 這是踩到才會知道的坑：new Date().toISOString() 給的是 UTC。
 * 台灣是 UTC+8，所以早上八點以前跑任何腳本，寫進去的都是**昨天**。
 *
 * 查價日期寫錯一天，「這個價格是 N 天前查的」就跟著錯一天 ——
 * 整個站的誠實度建立在這個數字上，不能讓時區去決定它。
 */
export function todayTW(d: Date = new Date()): string {
  // sv-SE 的格式剛好就是 YYYY-MM-DD
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(d);
}

/** 兩個 YYYY-MM-DD 之間差幾天 */
export function daysBetween(from: string, to: string): number {
  const a = Date.parse(from + "T00:00:00Z");
  const b = Date.parse(to + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / 86400000);
}

/** YYYY-MM-DD 往後推 n 天 */
export function addDays(ymd: string, n: number): string {
  const t = Date.parse(ymd + "T00:00:00Z") + n * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}

const WEEKDAY = "日一二三四五六";

/** 給人看的日期：9/27（日） */
export function fmtShort(ymd: string): string {
  const d = new Date(ymd + "T00:00:00Z");
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${WEEKDAY[d.getUTCDay()]}）`;
}
