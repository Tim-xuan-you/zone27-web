import type { DisciplineStreak as Streak } from "@/lib/predictions";

// ── ZONE 27 · 對帳紀律 streak(soul-roadmap #2 · 「交易員紀律」鏡子)──────────────
// 你連續幾天回來面對自己的帳本。 玩運彩/賭場用 streak 做「每日登入獎勵 + 別斷了焦慮」
// 把你綁住;我們刻意拆掉那一套 —— 不發點數、不放動畫、不恐嚇,只當一面安靜的紀律鏡。
//
// 🔴 紅線:連續天數 ≠ 更準(文案明講 · 防把 streak 暗示成勝率)· lapsed 時平靜顯示
//   紀錄不羞辱 · 獎勵是身分/紀律本身不是現金。 計算全部來自 aggregateStreak(單一真相)。
// 🍎 排版:三樓 status 配角(接在榮譽牆後)· 框 mute、數字用骨白不用金 —— 唯一的金色
//   主角永遠是上面的校準準度卡 · 這裡不搶。 守 R183「會員介面極簡」。
// ─────────────────────────────────────────────────────

export default function DisciplineStreak({ streak }: { streak: Streak }) {
  const { current, longest, totalDays, activeToday } = streak;

  // 還沒在任何一天對帳過 → 不顯示(校準卡空狀態已負責 onboarding · 不擺空殼)
  if (totalDays === 0) return null;

  // 主行文案 · 隨狀態誠實換句(連 ≥2 大數字 / 第一手鼓勵 / 已斷 · 全程不嚇人)
  let lead: React.ReactNode;
  if (current >= 2) {
    lead = (
      <>
        <span className="font-mono text-bone text-3xl sm:text-4xl font-light tabular leading-none">
          {current}
        </span>
        <span className="text-mute text-sm ml-2">
          天連續對帳{activeToday ? "" : " · 今天還沒押,可接上"}
        </span>
      </>
    );
  } else if (current === 1) {
    // 只連一天 ·「1 天連續」中文生硬 → 換鼓勵句(新會員第一天押完的高頻 onboarding 畫面)。
    lead = (
      <span className="text-bone text-base leading-relaxed">
        {activeToday ? "今天回來對帳了 ——" : "昨天對過一手 ——"}{" "}
        <span className="text-mute">
          {activeToday ? "明天再來,就連起來了。" : "今天接上,就連起來了。"}
        </span>
      </span>
    );
  } else {
    lead = (
      <span className="text-bone text-base leading-relaxed">
        目前沒有連續 ——{" "}
        <span className="text-mute">押一手,重新開始你的紀律。</span>
      </span>
    );
  }

  return (
    <section className="mt-8 bg-slate/40 border border-line/50 p-6 sm:p-8">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        對帳紀律
      </p>

      <div className="flex items-baseline gap-2 flex-wrap">{lead}</div>

      {/* 紀錄 + 累計 · 兩個只增不減的數(無焦慮)· 連續斷了這兩個也不會掉 */}
      <p className="mt-3 font-mono text-mute/75 text-[11px] tracking-[0.2em] tabular">
        最長連過 <span className="text-bone">{longest}</span> 天 · 累計對帳{" "}
        <span className="text-bone">{totalDays}</span> 天
      </p>

      {/* 紅線護欄 · 一句講完:連續 ≠ 準度(防報馬仔話術)· 斷了不扣帳。 上方榮譽牆已有
          「含輸帳本」說教段 · 這裡不重複份量(R183 極簡 · 三樓配角不搶戲)。 */}
      <p className="mt-4 text-mute/85 text-[13px] leading-relaxed max-w-xl">
        連續天數是<span className="text-bone">紀律</span>,不是準度 —— 斷了不扣帳。
      </p>
    </section>
  );
}
