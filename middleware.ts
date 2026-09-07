import { NextResponse, type NextRequest } from "next/server";

/**
 * 舊體育站路由回 410 Gone。
 *
 * 這些網址還在 Google 索引裡（/matches /ladder /about /mma …），
 * 現在全部 404。404 的意思是「暫時找不到」，Google 會反覆回來重爬，
 * 一路扣網域信任；410 的意思是「永久下架」，退出索引快得多。
 *
 * 而且舊內容講的是運彩、盤口、下注 —— 那個主題標籤黏在網域上，
 * 對接下來要做的寵物與銀髮（都貼近 YMYL）是負擔。越快清掉越好。
 *
 * 清乾淨之後（Search Console 顯示這些網址都退出索引）這個檔案就可以刪。
 */
const GONE = new Set([
  "about", "audit", "auth", "badminton", "basketball", "brief",
  "calibration", "changelog", "corrections", "coverage", "engines",
  "eth", "ethics", "faq", "feedback", "founders", "glossary",
  "how-we-grade", "lab", "ladder", "learn", "login", "markets",
  "matches", "member", "membership", "methodology", "mma", "privacy",
  "pulse", "receipts", "shops", "signal-board", "soccer", "star",
  "table", "tennis", "terms", "tim", "today", "track-record",
  "u", "verify", "vs",
]);

export function middleware(req: NextRequest) {
  const first = req.nextUrl.pathname.split("/")[1];

  if (GONE.has(first)) {
    return new NextResponse(
      `<!doctype html><meta charset="utf-8">` +
      `<title>這一頁已經下架 · ZONE 27</title>` +
      `<meta name="robots" content="noindex">` +
      `<div style="font-family:system-ui;max-width:34rem;margin:15vh auto;padding:0 1.5rem;line-height:1.7">` +
      `<h1 style="font-size:1.4rem">這一頁已經下架</h1>` +
      `<p style="color:#666">ZONE 27 換了方向。原本的運動數據內容已經全部收起來，` +
      `現在做的是幫你挑東西的決策工具。</p>` +
      `<p><a href="/" style="color:#1F4E6B">看看新的</a></p></div>`,
      {
        status: 410,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  }
  return NextResponse.next();
}

export const config = {
  // 只跑在頁面請求上，靜態資源和我們自己的路由不碰
  matcher: ["/((?!_next|go|dog-food|favicon|sitemap|robots|.*\\.).*)"],
};
