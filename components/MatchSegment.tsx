import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { SegmentLocker } from "@/lib/match-segment";

// ── ZONE 27 · 誰賽前鎖了這場(per-match segment · Strava 式微競技場)──────────────
// 「這一場有誰賽前鎖了手、押哪邊,賽後誰押對」—— 每格連那人的 /u 公開含輸校準檔。
// 最 tipster-hostile 的物件:一個會刪輸單的人,撐不過一張「逐場、逐人、賽後公開對帳」的記分板。
// 🔴 只按「賽後誰押對」排(非 PnL / 人氣)· 含輸照掛(✕跟✓同權重)· 無粉絲數 · 純讀(發言去分析區)。
// 純展示 server component(0 client JS · server-render 進 HTML)· 走公開 ladder(0 migration)。
// ─────────────────────────────────────────────────────

type Winner = "home" | "away" | "draw" | "tie" | null;

export default function MatchSegment({
  lockers,
  homeName,
  awayName,
  winner = null,
}: {
  lockers: SegmentLocker[];
  homeName: string;
  awayName: string;
  /** 賽果(已結算才有)· home/away/draw → 評誰押對;tie/null → 賽前 or 棒球和局不評 */
  winner?: Winner;
}) {
  if (lockers.length === 0) return null; // 沒人鎖 → 不顯示(graceful · 不假裝熱鬧)

  const settled = winner === "home" || winner === "away" || winner === "draw";
  const sideLabel = (p: SegmentLocker["pick"]) =>
    p === "home" ? homeName : p === "away" ? awayName : "和局";
  const isCorrect = (p: SegmentLocker["pick"]) => settled && p === winner;

  // 賽後 → 押對的排前面(誰押對了 = 這場的記分板);賽前 → 維持時間序(rows 已 desc)。
  const ordered = settled
    ? [...lockers].sort(
        (a, b) => Number(isCorrect(b.pick)) - Number(isCorrect(a.pick)),
      )
    : lockers;
  const hits = settled ? lockers.filter((l) => isCorrect(l.pick)).length : 0;

  return (
    <section
      aria-label="誰賽前鎖了這場 · 賽後誰押對"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8"
    >
      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <p className="font-mono text-gold text-[9px] tracking-[0.4em]">/ 誰賽前鎖了這場</p>
        <span className="font-mono text-mute/55 text-[10px] tracking-[0.25em] tabular">
          {lockers.length} 人
          {settled && (
            <>
              {" · "}
              <span className="text-gold/80">{hits} 人押對</span>
            </>
          )}
        </span>
      </div>
      <p className="mb-4 text-mute/80 text-[12px] leading-relaxed max-w-2xl">
        賽前就鎖死、賽後逐人對帳 · <span className="text-gold">押對押錯都掛、刪不掉</span> ·
        點任何一個名字,看他到底準不準(含輸)。 賣明牌的撐不過這張記分板。
      </p>
      <ul className="divide-y divide-line/40 border-y border-line/40">
        {ordered.map((l, i) => {
          const correct = isCorrect(l.pick);
          return (
            <li
              key={`${l.authorCode}-${i}`}
              className="flex items-center gap-3 py-2.5"
            >
              <Avatar seed={l.authorCode} size={26} />
              <Link
                href={`/u/${l.authorCode}`}
                className="min-w-0 flex-1 text-bone hover:text-gold text-sm truncate underline-offset-4 hover:underline transition-colors"
              >
                {l.handle}
              </Link>
              <span className="shrink-0 font-mono text-gold/75 text-[10px] tracking-[0.15em]">
                看好 {sideLabel(l.pick).slice(0, 5)}
              </span>
              {settled && (
                <span
                  className={`shrink-0 font-mono text-[10px] tracking-[0.2em] tabular ${
                    correct ? "text-gold" : "text-loss/85"
                  }`}
                >
                  {correct ? "✓ 中" : "✕ 沒中"}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
