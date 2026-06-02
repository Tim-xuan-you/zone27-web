import { redirect } from "next/navigation";

// ── /founders/ledger · R187 · 「創始 270 名冊」已移除(per Tim「太複雜 · 刪掉吧」)
// 原本是 270 席位分配公開帳本 + 拒絕原因帳本。 270 機制收掉後此頁失去意義 ·
// 改成 redirect 到 /founders(站上仍有 ~11 個舊連結指這 · redirect 不讓它們 404 ·
// 連結文案的清理留下一輪 sweep)。 FoundingMemberLedger / ScarcityStrip 已刪。
// ─────────────────────────────────────────────────────
export default function FoundersLedgerPage() {
  redirect("/founders");
}
