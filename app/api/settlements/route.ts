// ── ZONE 27 · /api/settlements · Nav 結算鈴鐺的「新結算」數字 ────────────────────
// Nav 是全站每頁的 server component,R207 鐵律:Nav 不可在 render 時 fetch(uncached
// promise 會讓 client 頁打字失焦)。 所以「你有幾場新結算」改由 client island
// (components/SettlementBell)mount 後打這支輕量 endpoint 拿。
//
// 回的只有一個數字(newCount)· 不洩任何賽事細節 · 純本人(cookie auth · getUser 驗 JWT)。
// 結算數字 = (你的押注) × (賽果) 的純函式(getMySettlementInbox · 0 migration · on-read)。
// 未登入 / 讀失敗 → newCount: 0(鈴鐺隱藏)· 永不 500 吵使用者。
// ─────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getMySettlementInbox } from "@/lib/settlement-data";

// 本人資料(讀 cookie)· 絕不能被 CDN 快取成別人的數字。
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const inbox = await getMySettlementInbox();
    return NextResponse.json(
      { newCount: inbox?.newCount ?? 0 },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // graceful · 鈴鐺是 nice-to-have · 任何錯誤都退「0 新結算」不擋頁面。
    return NextResponse.json(
      { newCount: 0 },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
