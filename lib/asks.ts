/**
 * 大家在裁決器問了什麼。
 *
 * 2026-09-24 Tim：「裁決器要留著的話，是不是要裝收集的，看使用者都會問什麼？
 * 這樣我們自己也才能事後更新、最佳化答案。」
 *
 * 存在一份 Google 試算表（Apps Script 網頁應用程式收資料）。
 * 選它是因為：免費、不會像 Supabase 免費方案一樣沒流量就休眠、Tim 打開就看得懂。
 * 舊的 Supabase 專案（體育網站時期的）2026-09-24 已經連不到了。
 *
 * 記什麼：哪一頁、狗還是貓、點了哪些按鈕、打了什麼字、讀不讀得懂、推薦了哪一款、
 * 句子裡提到哪幾款。一次打開頁面給一個隨機編號，只用來把同一個人連點的幾下串起來，
 * 不存在瀏覽器裡、關掉就沒了。
 * 不記：IP、裝置、帳號、任何能認出是誰的東西。畫面上有一行字告訴讀者會匿名記下來。
 *
 * ASKS_URL 是空的就什麼都不送。網址本來就會出現在瀏覽器裡，不是秘密；
 * 讀資料要另一把鑰匙（ASKS_KEY），那把只在 Tim 的電腦上。
 */

export const ASKS_URL = "";

export interface Ask {
  page: string;
  sp: string;
  fm: string;
  /** 點了哪些按鈕，用頓號串起來 */
  picks: string;
  /** 自己打的字（按鈕加進去的字扣掉） */
  text: string;
  /** 讀不出任何條件 */
  empty: boolean;
  /** 推薦的那一款的編號，沒有就空的 */
  top: string;
  /** 句子裡提到、我們有收的商品編號 */
  mentions: string;
  /** 怎麼問的：chip（點按鈕）、type（打字）、answer（點常見情況）、link（朋友傳的連結） */
  src: "chip" | "type" | "answer" | "link";
  /** 這一次打開頁面的隨機編號 */
  sid: string;
}

/** 這一次打開頁面的編號。只在記憶體裡，重新整理就換一個 */
export const SESSION = Math.random().toString(36).slice(2, 8);

let pending: Ask | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

function send(a: Ask) {
  if (!ASKS_URL) return;
  const body = JSON.stringify(a);
  try {
    // 分頁關掉的時候 fetch 會被砍，sendBeacon 不會
    if (navigator.sendBeacon?.(ASKS_URL, new Blob([body], { type: "text/plain;charset=utf-8" }))) return;
  } catch {}
  try {
    fetch(ASKS_URL, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body });
  } catch {}
}

function flush() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  if (pending) send(pending);
  pending = null;
}

/**
 * 記一筆。
 *
 * 點按鈕的時候讀者常常連點好幾個（成犬、對雞過敏、想省錢），每點一下都記會變成三筆半成品。
 * 所以按鈕先等 4 秒，沒有再點才送最後那個狀態；打字送出、點常見情況是一次就決定的，直接送。
 * 讀者點完就關掉分頁的話，關掉的那一刻把還沒送的送出去。
 */
export function logAsk(a: Ask) {
  if (!ASKS_URL || typeof window === "undefined") return;
  if (a.src !== "chip") {
    pending = null;
    if (timer) clearTimeout(timer);
    send(a);
    return;
  }
  pending = a;
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 4000);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}
