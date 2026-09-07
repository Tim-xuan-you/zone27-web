import { NextResponse } from "next/server";
import { byId } from "@/lib/catalog";

/**
 * 分潤跳轉端點。頁面上不直接掛聯盟連結，一律走這裡。
 *
 * 一個端點解決四件事：
 *   1. 隱私 —— 我們的頁面不落第三方 cookie，追蹤只發生在跳轉之後
 *   2. 數據 —— 點擊統計是我們的，不是平台的
 *   3. 換方案 —— 之後換聯盟平台時不用改幾千個連結
 *   4. 歸因 —— 跳轉前可以補上專屬折扣碼參數（拿到碼之後）
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ merchant: string; sku: string }> }
) {
  const { merchant, sku } = await ctx.params;

  const product = byId(sku);
  const target = product?.price.merchants.find((m) => m.id === merchant);

  if (!target) {
    // 找不到就回首頁，不要把使用者丟在錯誤頁
    return NextResponse.redirect(new URL("/", "https://zone27.com.tw"), 302);
  }

  // TODO 拿到專屬折扣碼後在這裡附加，讓歸因不受 last-click 覆蓋影響
  // TODO 點擊記錄（Supabase）—— 這是我們自己的數據，平台後台看不到全貌

  const res = NextResponse.redirect(target.affiliateUrl, 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
