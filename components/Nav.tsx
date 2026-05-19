import Link from "next/link";

type NavKey =
  | "home"
  | "matches"
  | "lab"
  | "leaderboard"
  | "founders"
  | "about";

const NAV_ITEMS: {
  key: Exclude<NavKey, "home">;
  href: string;
  label: string;
  badge?: string;
}[] = [
  { key: "matches", href: "/matches", label: "賽事" },
  { key: "lab", href: "/lab", label: "實驗室", badge: "BETA" },
  { key: "leaderboard", href: "/leaderboard", label: "27 之牆" },
  { key: "founders", href: "/founders", label: "創始會員" },
  { key: "about", href: "/about", label: "關於" },
];

export default function Nav({ active }: { active?: NavKey }) {
  return (
    <nav className="w-full border-b border-line/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <span className="font-mono text-gold text-xl tracking-[0.22em] font-medium group-hover:opacity-80">
            ZONE
          </span>
          <span className="font-mono text-bone text-xl tracking-[0.22em] font-medium group-hover:opacity-80">
            27
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 text-sm overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`font-mono text-[10px] sm:text-xs tracking-[0.22em] whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
                active === item.key
                  ? "text-gold"
                  : "text-mute hover:text-gold"
              }`}
            >
              {item.label}
              {item.badge && (
                <span className="px-1 py-px text-[8px] tracking-[0.15em] border border-gold/40 text-gold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <button className="hidden sm:inline-block px-4 py-2 border border-gold/30 text-gold text-xs tracking-[0.18em] hover:bg-gold/10 transition-colors">
            登入
          </button>
        </div>
      </div>
    </nav>
  );
}
