import { NextResponse } from "next/server";
import { buildDuelResults } from "@/lib/duel-results";

// ── ZONE 27 · 跨運動賽果一本帳 API(R293/R294)────────────────────────────────
// 給 /today 紀錄條(DuelRecordStrip)client 端對帳用。 為什麼走 API 而不是 server prop:
// 一本帳 4,500+ 列(且逐日長大)—— 塞進 /today 的 HTML = 每個訪客(含未登入、看完就走的)
// 都吞 400KB+ 序列化 payload,違反 mobile-first 鐵律。 改成:只有「登入且押過」的人才來抓
// 這份(公開賽果 · 0 個資 · CDN 可快取)。
// revalidate 同 /today(300s)· 結算 on-read 口徑不變(buildDuelResults 內含 live 補強)。
// ─────────────────────────────────────────────────────

export const revalidate = 300;

export async function GET() {
  try {
    return NextResponse.json(await buildDuelResults());
  } catch {
    return NextResponse.json([]); // graceful · 紀錄條退回只顯示應戰天數
  }
}
