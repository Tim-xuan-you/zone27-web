import { redirect } from "next/navigation";

// ── /rewards · R199 收合 → / ──────────────────────────────
// Tim canary「37 頁太多太扯 · 一堆沒人看 · 極簡再極簡」+ 這頁是 PRE-LAUNCH
//「Q4 2026 兌換實體獎品」= 我們還沒兌現的承諾(違反 no-waiting-rule「等 = brand
// sin · default = ship NOW」)。 stealth 期掛一張 Q4 vapor 頁,純粹增加雜訊。
// 集點兌換 feature 真的做好時再一個 git revert 回來;在那之前不掛。
// redirect 不讓舊連結 404 · 已從 Cmd-K 全站快搜移除。
// （注:/rewards 曾在 R166 因同理由刪、R170 Tim 一度恢復 · 此次 R199 canary
//   方向明確「砍多餘」· 故再收合 · 但保留為可逆 redirect 而非硬刪。）
// ─────────────────────────────────────────────────────
export default function RewardsRedirect() {
  redirect("/");
}
