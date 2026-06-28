import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getUser } from "@/lib/supabase/server";

// ── ZONE 27 · /api/my-code ─────────────────────────────
// 回傳目前登入者的永久碼(md5(uid) 前 8 碼 · 同 /member · /u/[code] 的 z27_author_code)。
//
// 為什麼需要這支:client 端「下戰帖」要把『我的』永久碼塞進可外傳的 /vs/<碼> 連結。 但永久碼是
// md5(uid)、瀏覽器端沒有 md5(WebCrypto 只有 SHA · 不支援 MD5)· 又不想為了一條連結把 /today
// (ISR 招牌頁)退成 per-request dynamic。 這支用 server 端 cookies 算碼回傳(getUser 會 re-validate
// JWT)· 未登入 / 任何錯 → { code: null }(graceful · 按鈕自隱)。
//
// 0 PII:只回不可逆雜湊碼(本就公開掛在 /u/<碼>)· 不回 email / uid / 任何個資。
// ─────────────────────────────────────────────────────

export const dynamic = "force-dynamic"; // 依登入者而異 · 絕不快取共用

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ code: null });
    const code = createHash("md5").update(user.id).digest("hex").slice(0, 8);
    return NextResponse.json({ code });
  } catch {
    return NextResponse.json({ code: null });
  }
}
