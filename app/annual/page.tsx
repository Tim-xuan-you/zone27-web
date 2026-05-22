import { redirect } from "next/navigation";

// ── ZONE 27 · /annual ─────────────────────────────────
// Redirect to most-recent annual report. Currently:Year 0(2026)·
// pre-launch honest empty state。 Future:每 5/31 Year-1 publish ·
// 此 file 改 redirect 路徑。
//
// Brand-IP pattern · Round 33 W-E:Defector + Hell Gate + Aftermath
// annual report convention · radical transparency = costly signaling。
// Year 0 pre-launch 內容雖然 empty(0 paid · NT$ 0 rev)· brand IP
// statement「我們從 Year 0 就承諾 every year publish」是 commitment
// device 比 Year-1 才 first publish 更強。
// ─────────────────────────────────────────────────────

export default function AnnualIndex() {
  redirect("/annual/2026");
}
