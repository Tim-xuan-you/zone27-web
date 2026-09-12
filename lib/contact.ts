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

const SITE = "https://zone27.com.tw";

/* ------------------------------------------------------------------ */
/* 讀者回報                                                            */
/*                                                                    */
/* 回報要放在讀者發現問題的那個位置，而且信件內容先幫他填好：          */
/* 哪一款、哪一家、哪個規格、哪一頁。他只要留一行、按寄出。            */
/*                                                                    */
/* 填好的內容也是寫給 Tim 看的：收到信不用再回問「你說的是哪一款」，   */
/* 直接照著去改。空白的回報信，十封有八封要來回問，最後就不處理了。    */
/*                                                                    */
/* 賣完這件事尤其只能靠讀者：賣完的蝦皮頁面照樣打得開，                */
/* 我們又不讀蝦皮的頁面內容，程式永遠看不出來。                        */
/* ------------------------------------------------------------------ */

/** 組一封信件連結。沒設定信箱就回 null，畫面上就不出現那顆按鈕。 */
function mail(subject: string, lines: string[]): string | null {
  if (!CONTACT.email) return null;
  // 信件內文的換行照規格用 CRLF，手機的郵件 App 才會好好斷行
  const body = lines.join("\r\n");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const AUTO = "（下面是自動帶的，不用改）";

/** 購買連結有問題：賣完、打不開、價格差很多、規格對不上 */
export function linkReport(
  p: { id: string; brand: string; name: string },
  where: string,
): string | null {
  return mail(`連結回報：${p.brand} ${p.name}`, [
    "哪裡有問題？留下符合的那一行，其他刪掉就好：",
    "・賣完了、缺貨",
    "・連結打不開，或跳到別的商品",
    "・價格差很多",
    "・規格或品名對不上",
    "・其他：",
    "",
    AUTO,
    `商品：${p.id} ${p.brand} ${p.name}`,
    `賣場：${where}`,
  ]);
}

/** 某一筆資料寫錯（成分表核對、商品規格） */
export function claimReport(path: string, item: string): string | null {
  return mail(`勘誤：${item}`, [
    "哪一句寫錯了？直接貼上來就好：",
    "",
    "",
    "正確的是（有連結或照片更好）：",
    "",
    "",
    AUTO,
    `頁面：${SITE}${path}`,
    `項目：${item}`,
  ]);
}

/** 整頁的保底：不知道算哪一種，就用這個 */
export function pageReport(path: string): string | null {
  return mail(`網站勘誤：${path}`, [
    "哪裡寫錯了？直接貼那一句就好：",
    "",
    "",
    AUTO,
    `頁面：${SITE}${path}`,
  ]);
}
