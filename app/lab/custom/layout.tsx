import type { Metadata } from "next";

// ── ZONE 27 · /lab/custom metadata ─────────────────────
// /lab/custom/page.tsx is a "use client" component (uses
// useSearchParams + useState for the pitcher form), which
// can't export metadata. This layout supplies the title +
// description without changing the page's interactive shell.
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Lab · Custom — 自訂投手對決",
  description:
    "輸入任何兩位投手的 K/9 · BB/9 · HR/9,引擎即時構造完整虛擬比賽 — 「三振王 vs 火球菜鳥」一鍵就跑。Power user mode for ZONE 27 Engine.",
};

export default function LabCustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
