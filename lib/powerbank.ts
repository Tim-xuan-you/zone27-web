import data from "@/data/powerbank.json";
import type { Charger } from "./charger";

/**
 * 行動電源（2026-09-27 開）。
 *
 * 就是有電池的充電器：你的手機插它多快，跟充電器用同一套裝置清單和判斷（lib/charger.ts 的 fit、rank），
 * 多出來的是電池那幾件事，也是這個類目的「背面」：
 *   包裝大字寫的 mAh 是電池本身（3.7V），背面的額定容量才是手機拿得到的（5V），各家寫法還不一樣
 *   能不能帶上飛機看的是 Wh，不是 mAh
 * 研究筆記在 docs/POWER-BANK-RESEARCH.md。
 */
export interface PowerBank extends Charger {
  /** 包裝上的電池容量（3.7V 那個 mAh） */
  cellMah: number;
  /** 電池電壓。官方沒寫就不填 */
  cellV?: number;
  /** 電池的瓦時。搭飛機看這個 */
  cellWh: number;
  /** 背面的額定容量：用 5V 輸出算，手機拿得到的 */
  rated5vMah?: number;
  /** 官方寫的轉換率 */
  conversionPct?: number;
  /** 自帶線 */
  cable?: string;
  /** 自己充電的規格 */
  input?: string;
}

export const powerbanks = data.products as unknown as PowerBank[];
export const powerbankById = (id: string): PowerBank | undefined => powerbanks.find((p) => p.id === id);
export const POWERBANK_SUB_ID = "powerbank";

/**
 * 能不能帶上飛機。民航局：「鋰電池小於100瓦特小時可攜帶上機（大於100瓦特小時且小於160瓦特小時須經航空公司同意，數量限制為2個）」，
 * 只能手提、不能託運；2026-04-08 起每人最多 2 個，飛機上不能用、也不能幫它充電。
 */
export function flightOf(p: PowerBank): { ok: boolean; short: string; why: string; rule: string; line: string } {
  const rule = "放隨身行李，不能託運；每人最多帶 2 個，飛機上不能用、也不能充它";
  const why = p.cellWh < 100 ? `${p.cellWh}Wh，小於 100Wh` : p.cellWh <= 160 ? `${p.cellWh}Wh，超過 100Wh` : `${p.cellWh}Wh，超過 160Wh`;
  const [ok, short] = p.cellWh < 100 ? [true, "可以帶上飛機"] : p.cellWh <= 160 ? [false, "要先問航空公司"] : [false, "不能帶上飛機"];
  return { ok, short, why, rule, line: `${why}，${short}。${ok || p.cellWh <= 160 ? rule + "。" : ""}` };
}
