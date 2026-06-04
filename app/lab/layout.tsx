import type { Metadata } from "next";

// ── ZONE 27 · /lab metadata ────────────────────────────
// /lab/page.tsx is a "use client" component (needs useState),
// which can't export metadata. This server-side layout supplies
// the title + description so browser tabs / bookmarks / OG
// fallbacks show "Live AI Laboratory" instead of inheriting the
// generic ZONE 27 home title.
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Lab — 引擎實驗室",
  description:
    "親眼看引擎在您的瀏覽器內跑 10,000 場虛擬比賽 — 從亂數收斂為穩定勝率分布,再用文字直播一場 9 局逐打席的虛擬戰局。",
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
