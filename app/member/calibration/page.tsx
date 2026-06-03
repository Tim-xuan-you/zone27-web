import { redirect } from "next/navigation";

// ── /member/calibration · R189 收合 → /calibration ──────────────
// 原本是「你 vs 引擎 vs 實際」個人準度對照頁(R30 W2B epistemic mirror)。
// 收掉的兩個原因:
//   1. 它的「個人模式」靠 followed_matches(追蹤賽事)過濾,但唯一能加追蹤的
//      FollowMatchButton 早已刪除 → 對現在的會員永遠是空的(死功能過濾)。
//   2. 更根本:那張 45° 校準圖需要「機率預測」才畫得出來(引擎才會說七成),
//      而會員只能押 home/away 二選一 → 二元押注根本沒有校準曲線可言。
//      「個人版校準圖」這概念從根上不成立(無論用追蹤還押注過濾都一樣)。
// 校準圖只應存在一頁(公開的 /calibration「引擎準不準」);會員的個人準度
// (押注命中率)已在 /member 儀表板 + 首頁戰績條 + /ladder 三處。
// redirect 不讓殘留舊連結 404 · 連結文案已在本輪 sweep 大部分清乾淨。
// lib/follows.ts(此頁是唯一 import)同步刪除。
// ─────────────────────────────────────────────────────
export default function MemberCalibrationRedirect() {
  redirect("/calibration");
}
