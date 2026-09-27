import type { Merchant } from "./types";

/**
 * 讀者看得到的賣場。
 *
 * 有貨的優先，只要還有一家有貨，就只給有貨的。
 * 全部賣完的時候，賣完的那幾條照樣給（2026-09-27 Tim：「還沒找到新商家之前，還是會展示給使用者吧！
 * 說不定他點進去的時候已經補貨了」）。網站不寫賣完：庫存天天在變，寫了常常是錯的，還會讓人不點（2026-09-27 Tim 問「上次看是賣完的，有需要寫？」，拿掉了）。
 * 連失效的都沒有，才回原陣列，讓上層自己判斷要不要整款拿掉（回空陣列會讓一堆 [0] 變成 undefined）。
 */
export function showable(ms: Merchant[]): Merchant[] {
  const inStockMs = ms.filter((m) => !m.dead && !m.soldOut);
  if (inStockMs.length > 0) return inStockMs;
  const sold = ms.filter((m) => !m.dead);
  return sold.length > 0 ? sold : ms;
}

/** 同一家、同規格、同價錢只留第一條（新的在前）。同一頁產了好幾條連結，讀者只該看到一次 */
export function onePerShop(ms: Merchant[]): Merchant[] {
  const seen = new Set<string>();
  return ms.filter((m) => {
    const k = `${m.label}|${m.unit ?? ""}|${m.amount}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
