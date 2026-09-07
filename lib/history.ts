import raw from "@/data/price-history.json";

/**
 * 價格史。
 *
 * 這是唯一一種抄不走的護城河 —— 別人可以在一週內複製你的規格庫和工具，
 * 但沒有人能複製「三年份的台灣價格波動」。時間買不到。
 *
 * 而它的代價是：晚一天開始就永遠少一天。所以在只有 8 筆示範資料、
 * 一個使用者都還沒有的現在就先開始記。
 *
 * 每次跑 npm run data:import 會自動追加一筆當日快照。
 */
export interface Snapshot {
  /** YYYY-MM-DD */
  d: string;
  /** productId → 當日最低價 */
  p: Record<string, number>;
}

export const history = raw.snapshots as Snapshot[];

export interface PriceStat {
  /** 有幾天的紀錄 */
  days: number;
  low: number;
  high: number;
  /** 目前價在歷史區間的位置，0 = 史低，1 = 史高 */
  position: number;
  lowDate: string;
}

/**
 * 算某款商品的價格位置。
 * 紀錄少於 7 天不回傳 —— 樣本太小的「史低」是誤導，
 * 而誤導比沒有資訊糟糕得多。
 */
export function priceStat(productId: string, current: number): PriceStat | null {
  const points = history
    .filter((s) => s.p[productId] !== undefined)
    .map((s) => ({ d: s.d, v: s.p[productId] }));

  if (points.length < 7) return null;

  const low = Math.min(...points.map((p) => p.v));
  const high = Math.max(...points.map((p) => p.v));
  if (high === low) return null;

  return {
    days: points.length,
    low,
    high,
    position: (current - low) / (high - low),
    lowDate: points.find((p) => p.v === low)!.d,
  };
}

/** 給使用者的一句話建議。刻意會叫人先別買。 */
export function timingAdvice(stat: PriceStat, current: number): { verdict: string; wait: boolean } {
  if (stat.position <= 0.15) {
    return { verdict: `近 ${stat.days} 天的低點附近，現在買不吃虧`, wait: false };
  }
  if (stat.position >= 0.7) {
    const save = current - stat.low;
    return { verdict: `比 ${stat.days} 天內的低點貴 $${save}（${stat.lowDate} 曾到 $${stat.low}）· 建議等`, wait: true };
  }
  return { verdict: `落在近 ${stat.days} 天的中間帶`, wait: false };
}
