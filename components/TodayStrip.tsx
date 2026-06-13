import Link from "next/link";
import type { DisciplineStreak } from "@/lib/predictions";

// ── ZONE 27 · 「今天」焦點條(soul · 每日對帳儀式)──────────────────────────
// 全速討論(Defector 高路 / 柏青哥低路)收斂出的結論:人會為「一個願意每天回去的
// 地方」死心塌地 —— 差別只在你用什麼把他綁回來。 柏青哥靠「讓你忘記輸多少」;我們靠
// 「讓你回來看自己到底準不準」。 這條 = 我們版本的柏青哥儀式,但靈魂相反(面對,非逃避)。
//
// 把散在會員頁的「今天該做什麼」收攏成一條:今天的一手(去鎖 / 沒場就練校準)+ 對帳紀律
// (連續回來對帳幾天)。 = 會員一打開就知道今天的一個誠實動作,然後就走。
//
// 🔴 紅線(這次討論直接刻進來 · 柏青哥 near-miss 的反面):
//   · streak 數「回來面對帳本幾天」**不是連勝幾場** · 明寫「斷了也不羞辱 · 接上今天就好」。
//   · 無倒數、無「別斷了!」恐嚇、無火焰/動畫、無點數、無聲光、無紅綠 · 暗金冷靜。
//   · 不在這裡推銷升級(守「別對會員推銷」)· 純服務。
// 純展示 server component · 資料全來自 aggregateStreak + 今日賽程(單一真相 · 0 client JS)。
// ─────────────────────────────────────────────────────

function disciplineLine(s: DisciplineStreak): { strong: string; soft: string } {
  if (s.activeToday) return { strong: `連續回來對帳 ${s.current} 天`, soft: "今天已對帳" };
  if (s.current > 0) return { strong: `連續回來對帳 ${s.current} 天`, soft: "今天還沒對帳" };
  if (s.totalDays > 0) return { strong: `累計回來對帳 ${s.totalDays} 天`, soft: "今天接上" };
  return { strong: "還沒開始記你的對帳紀律", soft: "鎖第一手就開始" };
}

export default function TodayStrip({
  tonightLockable,
  streak,
  dateLabel,
}: {
  /** 今天還沒押、賽前可鎖的場數(today-pregame) */
  tonightLockable: number;
  streak: DisciplineStreak;
  /** 今天台北日期短標 "6/11" */
  dateLabel: string;
}) {
  const hasLock = tonightLockable > 0;
  const d = disciplineLine(streak);
  // 斷了(current 0 但有歷史)才掛「不羞辱」那句 —— 平靜承接,不對天天來的人嘮叨。
  const lapsed = !streak.activeToday && streak.current === 0 && streak.totalDays > 0;

  return (
    <section className="mt-6 bg-slate/40 border border-gold/30 p-5 sm:p-6">
      <p className="font-mono text-gold/75 text-[10px] tracking-[0.4em] mb-3">
        今天 · {dateLabel}
      </p>

      {/* 今天的一手:有可鎖的場 → 去鎖;沒場 → 練一題校準(永遠有事可做、但都不是拉霸)。 */}
      {hasLock ? (
        <Link href="/matches" className="group flex items-end justify-between gap-3">
          <span className="min-w-0">
            <span className="block text-bone text-lg sm:text-xl font-light tracking-tight">
              今晚 <span className="font-mono text-gold tabular">{tonightLockable}</span> 場可以鎖
            </span>
            <span className="block text-mute/70 text-xs mt-1 leading-snug">
              賽前鎖死才算數 · 賽後自動掛準 / 不準
            </span>
          </span>
          <span className="shrink-0 font-mono text-gold/75 group-hover:text-gold text-[10px] tracking-[0.25em] transition-colors">
            去鎖 →
          </span>
        </Link>
      ) : (
        <Link href="/calibration" className="group flex items-end justify-between gap-3">
          <span className="min-w-0">
            <span className="block text-bone text-lg sm:text-xl font-light tracking-tight">
              今天沒有你的場 · 練一題校準
            </span>
            <span className="block text-mute/70 text-xs mt-1 leading-snug">
              30 秒 · 看你說的把握跟實際差多少(不押錢)
            </span>
          </span>
          <span className="shrink-0 font-mono text-gold/75 group-hover:text-gold text-[10px] tracking-[0.25em] transition-colors">
            去練 →
          </span>
        </Link>
      )}

      {/* 對帳紀律(冷靜 · 不催連勝 · 斷了不羞辱)· streak 章的里程碑仍在榮譽牆 */}
      <div className="mt-4 pt-3.5 border-t border-line/40 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center justify-center w-6 h-6 rounded-[8px] border border-gold/25 bg-gold/[0.04] font-mono text-[11px] text-gold/70"
        >
          紀
        </span>
        <p className="font-mono text-[11px] tracking-[0.1em] leading-relaxed text-mute/80">
          <span className="text-bone">{d.strong}</span>
          <span className="text-mute/65"> · {d.soft}</span>
        </p>
      </div>
      <p className="mt-2 text-mute text-[11px] leading-relaxed">
        面對自己的帳本,不是追連勝。
        {lapsed && " 斷了也不羞辱你 —— 接上今天就好。"}
      </p>
    </section>
  );
}
