/**
 * 賣場備註裡，哪些可以給讀者看。
 *
 * 2026-09-13 Tim：「滿 999 送 vita 罐頭，這種東西都不要寫出來。哪一天商家沒辦活動了怎麼辦？」
 *
 * 活動、贈品、折價券、免運、幾點前下單隔日到，都是賣家隨時會改的東西。
 * 價格旁邊有查價日期，這些沒有。寫上去，就是一句不知道哪天會變成假話的承諾，
 * 讀者點進去發現沒有，壞掉的是整個網站的信用。
 *
 * 資料裡照樣留著：比價、判斷送東西的那一組划不划算、Tim 自己對賣場，都還用得到。
 * 只是不出現在讀者看得到的地方。讀者看得到的只剩不會過期的事實：
 * 顆粒大小、口味和規格的提醒、限宅配、超取限幾包。
 *
 * 用擋的，不用放行清單：備註是一條一條人工寫的，新的說法會一直出現，
 * 放行清單會把有用的提醒一起擋掉。擋的字寫寬一點，寧可多擋。
 * build 之後還有 scripts/promo-check.ts 掃一遍產出的頁面，漏網的會讓 build 失敗。
 */

/** 會過期的：活動、贈品、折扣、運費、出貨速度、平台保障，還有「更便宜」這種要跟著價錢變的話 */
const VOLATILE =
  /送|贈|滿\s*\$?\s*\d|免運|運費|折|券|優惠|特價|限時|活動|檔期|加購|回饋|下殺|隔日|當日|出貨|到貨|工作日|備貨|鑑賞|保障|安心退|蝦皮商城|蝦皮優選|更便宜|最便宜|划算|最低價/;

/** 寫給我們自己看的：規格名稱另外有地方顯示，「一頁多款」是觸發提醒用的記號 */
const INTERNAL = /^規格選「|一頁多款|大包裝專頁/;

/**
 * 一條備註裡，讀者可以看的那幾段。
 *
 * keepVariant：各家明細要照原文列出「規格選「…」」，讀者點進去才選得對。
 * 那是賣家自己取的規格名稱，原封不動照抄，不拿去比對會不會過期。
 */
export function readerNotes(note: string, opts: { keepVariant?: boolean } = {}): string[] {
  return note
    .split("·")
    .map((x) => x.trim())
    .filter((x) => {
      if (!x) return false;
      if (x.startsWith("規格選「")) return Boolean(opts.keepVariant);
      return !INTERNAL.test(x) && !VOLATILE.test(x);
    });
}

/** 檢查用：這一段會不會過期（給 import 時提醒、給測試用） */
export function isVolatile(part: string): boolean {
  return VOLATILE.test(part);
}
