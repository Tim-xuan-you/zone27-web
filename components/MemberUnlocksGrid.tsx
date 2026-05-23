import Link from "next/link";

// ── ZONE 27 · Member Unlocks Grid ───────────────────────
// Round 31 W-M · Tim canary fire「會員哩!還是沒辦法享用會員能使用的
// 所有功能呀!」 surface 了 visibility blocker。 5 個 FREE TIER unlocks
// 散在不同 routes(★ Follow on /matches/X · ✏️ Note on /matches/X ·
// ↗ Submit on /member/submit · 🪞 Calibration on /member/calibration ·
// 🎫 Reservation on /leaderboard)· /member dashboard 只 text 1 行提及 ·
// visitor 看不到「我擁有什麼 · 一鍵點」。 此 widget 把 5 unlocks 升為
// prominent 5-card grid · 每個 unlock 都是 clickable button + 狀態 + 描述。
//
// 兩 mode:
//   - authenticated · 真實點得到 · 5 個 unlock 全可達 · 顯示
//     personal stats(N follows · N notes etc.)
//   - anonymous · preview mode · 5 個 unlock 顯示但 click → /login?next=X
//     · 帶 next param 登入後直接到 unlock 起點
//
// brand IP:「one menu per dashboard」 axiom 延伸 · 不讓 visitor 自己
// wander · 「您擁有的福利」直接 surface 而非藏在 deep page。
// ─────────────────────────────────────────────────────

export type MemberUnlocksGridProps = {
  /** 是否已登入 · 影響 CTA 行為(直接 vs 登入 redirect) */
  authenticated: boolean;
  /** Optional stats overlay for authenticated mode */
  stats?: {
    followsCount?: number;
    notesCount?: number;
    calibrationDots?: number;
    daysSinceJoin?: number | null;
    reservationNumber?: number | null; // null if not reserved · number if reserved
  };
};

const UNLOCKS = [
  {
    icon: "★",
    title: "Follow 賽事",
    body: "任何 ZONE 27 公開預測過的賽事 · 一鍵 Follow · 賽後 PROVED / DIVERGED 自動進您 dashboard。",
    href: "/matches",
    cta: "瀏覽今日賽事",
  },
  {
    icon: "✏️",
    title: "私人筆記",
    body: "任何 match 詳情頁 · 280 字 private note · 只您看得到 · 跨裝置 sync。",
    href: "/matches",
    cta: "進賽事頁寫",
  },
  {
    icon: "↗",
    title: "投稿給 Tim",
    body: "1 篇 / 週 · Tim 親手 curate · 通過則手動 publish 到 /signal-board(Stratechery Guest Post pattern)。",
    href: "/member/submit",
    cta: "投稿介面",
  },
  {
    icon: "🪞",
    title: "個人 calibration mirror",
    body: "您 follow 賽事的引擎 calibration drift · ZONE 27 唯一發布會員自己 epistemic mirror 的高端 sports 品牌。",
    href: "/member/calibration",
    cta: "看您 mirror",
  },
  {
    icon: "🎫",
    title: "Founder # 預訂",
    body: "鎖 #008-#270 編號 · 等 payment infra 就緒 + 付款開放後再 NT$2,700 forge(milestone-triggered · 不綁日期)· Patek allocation pattern · 不 forfeit。",
    href: "/leaderboard",
    cta: "選您 #",
  },
];

export default function MemberUnlocksGrid({
  authenticated,
  stats,
}: MemberUnlocksGridProps) {
  return (
    <div className="bg-slate/50 border-2 border-gold/40 glow-soft p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em]"
        >
          {authenticated
            ? "✓ YOUR FREE TIER UNLOCKS · 5 樣全 LIVE"
            : "FREE TIER UNLOCKS · 5 樣免費 · 登入後即活"}
        </p>
        {authenticated && stats?.daysSinceJoin !== null && stats?.daysSinceJoin !== undefined && (
          <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
            第 {stats.daysSinceJoin} 天會員
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {UNLOCKS.map((u, i) => {
          const href = authenticated
            ? u.href
            : `/login?next=${encodeURIComponent(u.href)}`;
          const statBadge = getStatBadge(i, stats);
          return (
            <Link
              key={u.title}
              href={href}
              className="block bg-navy/40 border border-line/60 hover:border-gold/60 transition-colors p-4 sm:p-5 group h-full flex flex-col"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span
                  aria-hidden="true"
                  className="text-2xl text-gold/90 leading-none"
                >
                  {u.icon}
                </span>
                {statBadge && (
                  <span className="font-mono text-gold text-[9px] tracking-[0.25em] tabular">
                    {statBadge}
                  </span>
                )}
              </div>
              <h4 className="text-bone text-sm sm:text-base font-light tracking-tight leading-snug mb-2">
                {u.title}
              </h4>
              <p className="text-mute text-[11px] sm:text-xs leading-relaxed mb-3 flex-1">
                {u.body}
              </p>
              <p className="font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors text-right">
                {u.cta} →
              </p>
            </Link>
          );
        })}
      </div>

      {!authenticated && (
        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            → 加入 ZONE 27 · 免費 · 5 樣解鎖
          </Link>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mt-3">
            email + password · 0 cookie tracking · 0 行銷信 · per
            <Link href="/login" className="text-mute hover:text-gold underline-offset-4 hover:underline ml-1">
              /login WHY THIS IS MINIMAL
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

function getStatBadge(
  unlockIndex: number,
  stats?: MemberUnlocksGridProps["stats"]
): string | null {
  if (!stats) return null;
  if (unlockIndex === 0 && stats.followsCount !== undefined) {
    return stats.followsCount > 0 ? `✓ ${stats.followsCount}` : "";
  }
  if (unlockIndex === 1 && stats.notesCount !== undefined) {
    return stats.notesCount > 0 ? `✓ ${stats.notesCount}` : "";
  }
  if (unlockIndex === 3 && stats.calibrationDots !== undefined) {
    return stats.calibrationDots > 0 ? `✓ N=${stats.calibrationDots}` : "";
  }
  if (unlockIndex === 4 && stats.reservationNumber !== null && stats.reservationNumber !== undefined) {
    return `✓ #${String(stats.reservationNumber).padStart(3, "0")}`;
  }
  return null;
}
