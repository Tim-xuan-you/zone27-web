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
  /** LINE 官方帳號網址，例如 https://lin.ee/xxxxxx */
  line: "",
  /** 收信信箱 */
  email: "",
};

export const hasContact = Boolean(CONTACT.line || CONTACT.email);

/** 回報連結失效用的信件連結。沒設定信箱就回 null。 */
export function reportMailto(subject: string): string | null {
  if (!CONTACT.email) return null;
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`;
}
