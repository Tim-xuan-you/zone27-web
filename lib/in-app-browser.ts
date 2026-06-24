// ── ZONE 27 · App 內建瀏覽器偵測(LINE / FB / IG 等 WebView)· 純函式 ──────────────
// 命門:Tim 把 zone27.com.tw 丟進 LINE → 朋友在 LINE 的內建瀏覽器開 → 想登入 →
//   ① 按 Google 一鍵登入 → Google 直接擋(403 · disallowed_useragent)= Google 安全政策
//      禁止在 App 內建 WebView 跑 OAuth(就是朋友截圖看到的那個錯誤)。
//   ② 用 email 註冊 → 確認信常被 LINE 丟到「外部」瀏覽器打開 → PKCE 同裝置驗證失效 → 也卡。
//   → 內建瀏覽器裡「兩條路都死」。 唯一解 = 把人帶到正式瀏覽器(Safari / Chrome),那裡兩條都通。
//
// 這支只做「偵測 + 平台判斷」(讀 userAgent · deterministic · 可單測)· 引導 UI 在 /login。
// 🔴 保守偵測:只認明確的問題 App token(LINE/FB/IG/Messenger),不認泛 Android `wv`
//   —— 寧可漏判幾個冷門 WebView,也不要誤判正常 Chrome/Safari 把能登入的人擋下來(false-positive
//   比 false-negative 傷:正常瀏覽器的人被叫「去外部瀏覽器」會困惑)。
// ─────────────────────────────────────────────────────

export type InAppBrowser = {
  /** 是否在已知會擋登入的 App 內建瀏覽器裡 */
  isInApp: boolean;
  /** 顯示用 App 名(LINE / Facebook / Instagram / Messenger)· 非內建 → null */
  app: string | null;
  /** LINE 支援 ?openExternalBrowser=1 一鍵跳系統瀏覽器(其餘 App 只能教手動開) */
  isLine: boolean;
  isIOS: boolean;
  isAndroid: boolean;
};

const NOT_IN_APP: InAppBrowser = {
  isInApp: false,
  app: null,
  isLine: false,
  isIOS: false,
  isAndroid: false,
};

/**
 * 從 userAgent 判斷是不是在會擋登入的 App 內建瀏覽器。 ua 空 → 當作正常瀏覽器(不擋)。
 * 只認明確 token:LINE(`Line/`)· Facebook(FBAN/FBAV/FB_IAB/FBIOS)· Instagram · Messenger。
 */
export function detectInAppBrowser(ua: string | null | undefined): InAppBrowser {
  const s = typeof ua === "string" ? ua : "";
  if (!s) return NOT_IN_APP;

  const isIOS = /iPhone|iPad|iPod/i.test(s);
  const isAndroid = /Android/i.test(s);
  const isLine = /\bLine\//i.test(s);

  let app: string | null = null;
  if (isLine) app = "LINE";
  else if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(s)) app = "Facebook";
  else if (/Instagram/i.test(s)) app = "Instagram";
  else if (/Messenger/i.test(s)) app = "Messenger";

  if (!app) return { ...NOT_IN_APP, isIOS, isAndroid };
  return { isInApp: true, app, isLine, isIOS, isAndroid };
}

/**
 * 把人帶到系統瀏覽器的「乾淨」目標網址(去掉 query / hash,只留 origin + 路徑)。
 * LINE 會吃 ?openExternalBrowser=1 → navigate 過去時自動開系統瀏覽器(其餘 App 無此參數,
 * 此參數在 Safari/Chrome 被忽略 = 無害)。 給「複製網址」與「一鍵開外部」共用。
 */
export function externalBrowserUrl(
  origin: string,
  pathname: string,
  opts?: { lineHint?: boolean },
): string {
  const base = `${origin}${pathname}`;
  return opts?.lineHint ? `${base}?openExternalBrowser=1` : base;
}
