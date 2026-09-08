/**
 * 對外聯絡方式。
 *
 * 空字串代表還沒開通 —— 畫面會自動改成「還在開通」的說法，
 * 不會生出一個點下去沒反應的按鈕。
 *
 * 要開通只要填這裡，全站（問我們、連結回報、裁決不出來的出口）一起生效。
 * 不要把網址散在各個元件裡，那種東西改一次會漏三個地方。
 */
export const CONTACT = {
  /**
   * LINE 刻意留空。
   *
   * 我們不是賣家 —— 出貨、缺貨、正品、退換、發票，我們看不到對方的訂單，
   * 也看不到賣場的庫存，接進來只會變成一個沒有權限的客服。
   * 而沒人回的 LINE 比沒有 LINE 更傷信任。
   */
  line: "",
  /**
   * 這不是客服信箱，是勘誤信箱：資料寫錯、連結壞了、價格不對。
   * 那是整站唯一真的只有我們能修的事。
   */
  email: "tatayngiti@gmail.com",
};

export const hasContact = Boolean(CONTACT.line || CONTACT.email);

/** 回報連結失效用的信件連結。沒設定信箱就回 null。 */
export function reportMailto(subject: string): string | null {
  if (!CONTACT.email) return null;
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`;
}
