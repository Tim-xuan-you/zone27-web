/**
 * 「我家大班生」：網站上提到孩子的唯一叫法（不放名字、臉、學校）。升上小一的時候只改這裡。
 *
 * 2026-10-12 Tim 定的規矩：**新的學習單都是孩子玩過、Tim 看過才上網站。**
 * 玩過的那一張，資料裡記 tested（日期），頁面上就寫「我家大班生 10 月 12 日寫過」；
 * 沒寫過的什麼都不寫，不說寫過。日期是 Tim 說的，不是程式猜的。
 */
export const KID = "我家大班生";

/** "2026-10-12" → "10 月 12 日" */
export const dateZh = (iso: string): string => {
  const [, m, d] = iso.split("-").map(Number);
  return `${m} 月 ${d} 日`;
};

/** 沒有日期就回 null：頁面上什麼都不顯示 */
export const testedLabel = (tested?: string): string | null => (tested ? `${KID} ${dateZh(tested)}寫過` : null);
