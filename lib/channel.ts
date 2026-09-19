/**
 * 賣場的類型：商城、優選、一般賣家。
 *
 * 2026-09-19 Tim：「您永遠給我的都是商城耶，蝦皮優選及一般商家您查不到嗎？
 * 畢竟商城都會比較高價，雖然比較有保障，但是畢竟會有不同需求的客群。」
 *
 * 他是對的，而且差距不小。同一包臭味滾 7L：商城 $223，一般賣家 $100。
 * 同一盒 CIAO 肉泥 14g×4：商城 $45 到 $79，一般賣家 $25 到 $39。
 *
 * 所以這一層要看得見：
 *   - 補連結的時候，每一款都要有商城以外的候選，不然讀者只剩貴的可以買
 *   - 讀者那邊同一款同時有商城和一般賣家的時候，要講一句差別在哪
 *
 * 判斷只能從賣場名字來：我們登記的名字裡本來就帶著（蝦皮商城）（蝦皮優選）。
 * 名字沒寫的就是一般賣家 —— 蝦皮的一般賣家本來就沒有任何標章。
 */

export type Channel = "mall" | "preferred" | "seller";

export const CHANNEL_ZH: Record<Channel, string> = {
  mall: "商城",
  preferred: "優選",
  seller: "一般賣家",
};

export function channelOf(label: string): Channel {
  if (/商城|直營|旗艦/.test(label)) return "mall";
  if (/優選/.test(label)) return "preferred";
  return "seller";
}

/** 商城跟官方直營都算「有平台背書」的那一邊 */
export const isMall = (label: string): boolean => channelOf(label) === "mall";

/**
 * 同一款同時有商城和商城以外的賣場時，讀者要看到的那一句。
 *
 * 不講「比較好」「比較安全」這種話：兩邊都有人要。只講差在哪，讓他自己選。
 */
export const CHANNEL_NOTE =
  "商城是蝦皮認證過的店家，出問題退換比較單純。一般賣家和優選常常便宜一截，買之前自己看一下評價和出貨紀錄。";
