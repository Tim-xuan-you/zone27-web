import { redirect } from "next/navigation";
import { FOUNDER_AUTHOR_CODE } from "@/lib/founder";

// ── ZONE 27 · /tim · 創辦人帳本捷徑(R238)──────────────────────────
// 好記、好外傳的入口 → 解析到 Tim 的公開含輸帳本 /u/[他的永久碼]·
// 那頁(因為碼=創辦人碼)會自動掛上「創辦人框」(見 ProfileView founder prop)。
// FOUNDER_AUTHOR_CODE 未設 → 退回 /track-record(graceful · 設好 env redeploy 即活)。
// ─────────────────────────────────────────────────────

// force-dynamic:在「請求當下」做 redirect(否則靜態預渲染會把它變成空的 200 頁)·
// 順帶讓它讀「執行時」的 FOUNDER_AUTHOR_CODE → Tim 設好 env 不必重 build 即生效。
export const dynamic = "force-dynamic";

export default function TimPage() {
  redirect(FOUNDER_AUTHOR_CODE ? `/u/${FOUNDER_AUTHOR_CODE}` : "/track-record");
}
