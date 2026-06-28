import Link from "next/link";

// ── ZONE 27 · 運動切換 tab(棒球 | 足球)· 多運動一致導覽 ─────────────────
// 所有「賽事 / 公開戰績」表面共用同一條:學一次、到處一樣 = 換運動像換頻道,不是換網站
// (Sofascore/FlashScore 式 · Polymarket category 同精神 · recognition over recall)。
// 棒球底下 CPBL / MLB 是次級(/matches 的聯賽 chip)· 之後加運動 = 加一個 tab,零重建。
// server component(每個 tab 是 Link · active 由頁面傳入)· 暗金、無紅綠、無 emoji。
// ─────────────────────────────────────────────────────

const TABS = [
  { key: "baseball", label: "棒球", href: "/matches" },
  { key: "soccer", label: "足球", href: "/soccer" },
  { key: "tennis", label: "網球", href: "/tennis" },
  { key: "badminton", label: "羽球", href: "/badminton" },
  { key: "mma", label: "UFC", href: "/mma" },
  { key: "basketball", label: "籃球", href: "/basketball" },
] as const;

export type SportKey = (typeof TABS)[number]["key"];

export default function SportTabs({ active }: { active: SportKey }) {
  return (
    <div className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-6">
      <nav className="flex items-center gap-1 border-b border-line/60" aria-label="運動">
        {TABS.map((t) => {
          const on = t.key === active;
          return (
            <Link
              key={t.key}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={`font-mono text-xs tracking-[0.3em] px-4 py-2.5 -mb-px border-b-2 transition-colors ${
                on
                  ? "text-gold border-gold"
                  : "text-mute/70 border-transparent hover:text-gold hover:border-gold/40"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
