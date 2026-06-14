import { redirect } from "next/navigation";

// ── ZONE 27 · /interact → /pulse(R234 收合)─────────────────────────────
// /interact 是全站唯一的真孤兒:0 個 live inbound(Nav / Footer / Cmd-K / 任何頁面都
// 沒連到它,只能硬打網址)。 內容是 Polymarket pivot「之前」的反社群宣言(宣告「我們
// 不做留言 / 不做活動牆 / 不做即時計數」),pivot 後站上早就有 /pulse 活動脈動、追蹤、
// 創作者留言討論 —— 這頁已自相矛盾。 它想承載的「互動」入口,真正的家現在是 /pulse。
// 收合成 redirect(可逆 · 舊連結不 404 · 同 R199 /rewards 手法)· 不硬 delete。
// 🔴 表面已 Apple 級極簡(nav 4 / footer 13 / cmd-k 13);揭露護城河深度頁(audit /
//    methodology / track-record / calibration / corrections / steelman / integrity /
//    ethics / coverage)是對手做不出的差異化、刻意 opt-in 保留,絕不為「像對手」砍掉。
// ─────────────────────────────────────────────────────────────────────
export default function InteractPage() {
  redirect("/pulse");
}
