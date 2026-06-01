import { redirect } from "next/navigation";

// ── /now · R181 retired ─────────────────────────────────
// Tim canary 3:這頁原本把整個內部開發日誌(round 編號 · agent 討論 ·
// memory 代號 · 「三綠 TSC EXIT 0」· 連 Tim 私下懷疑都逐字)render 給訪客
// = 最大的「劇本外洩」。 整頁退役 · 轉址到 /changelog(精簡版本紀錄)。
// 公開的版本歷史留 /changelog · 內部開發過程不對外。
export default function NowRetired() {
  redirect("/changelog");
}
