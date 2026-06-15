import Avatar from "@/components/Avatar";
import {
  ANALYSTS,
  analystRecords,
  analystTotals,
  type AnalystRecord,
} from "@/lib/analyst-calls";

// ── ZONE 27 · 分析師看法 · 人類賽道(R239)──────────────────────────────────────
// 3 位平權分析師(Tim · Ron · Lewi)的跨運動賽前鎖定 —— 引擎沒覆蓋的(籃球/電競/任何球)
// 由人來鎖。 沒有版主、大家一樣、不一定每天發。 規則跟引擎一樣硬:賽前鎖死、賽後逐場打分、
// 連輸都留、看校準不看勝率。 框成「某分析師的看法」非明牌(不顯示賠率/不寫跟單)。
// 純展示 server component · 0 client JS · 0 migration(資料在 lib/analyst-calls.ts)。
//
// GRACEFUL:還沒有任何公開鎖定 → 收成一段「介紹 + 名單」(不掛 3 個空盒)· 一有手就長出明細。
// ─────────────────────────────────────────────────────

const SPORT_LABEL: Record<string, string> = {
  足球: "足球",
  籃球: "籃球",
  棒球: "棒球",
  電競: "電競",
  其他: "賽事",
};

export default function AnalystPanel() {
  const totals = analystTotals();
  const records = analystRecords().filter((r) => r.total > 0);
  const roster = ANALYSTS.map((a) => a.name).join(" · ");

  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        / 分析師看法 · 人類賽道
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4 leading-tight">
        引擎只算棒球足球 · <span className="text-gold">人</span>負責其他球
      </h2>
      <p className="text-mute leading-relaxed mb-2 max-w-2xl">
        ZONE 27 有 {ANALYSTS.length} 位分析師(
        <span className="text-bone">{roster}</span>)· 大家平起平坐、沒有版主。
        籃球、電競、任何引擎沒覆蓋的球,由人賽前鎖定。
      </p>
      <p className="text-mute/75 text-[13px] leading-relaxed mb-6 max-w-2xl">
        規則跟引擎一樣硬:賽前鎖死、賽後逐場打分、
        <span className="text-mute">連輸的都留著</span> · 看長期準度不是勝率、不是連勝。
        是人的看法、不是叫你跟單。 我們不一定每天發。
      </p>

      {totals.total === 0 ? (
        <p className="font-mono text-mute/60 text-[11px] tracking-[0.18em] leading-relaxed">
          ▸ 還沒有公開鎖定的手 —— 賽前鎖一手就會出現在這(我們不每天發)。
        </p>
      ) : (
        <div className="space-y-5">
          {records.map((r) => (
            <AnalystBlock key={r.analyst.id} r={r} />
          ))}
        </div>
      )}

      <p className="mt-6 font-mono text-mute/55 text-[10px] tracking-[0.18em] leading-relaxed">
        ▸ 賽前鎖定 = 以公開提交時間為證 · 改不了、刪不掉 · 賽後逐場攤開對帳。
      </p>
    </section>
  );
}

function AnalystBlock({ r }: { r: AnalystRecord }) {
  const { analyst, pending, settled, hits, misses, total } = r;
  return (
    <div className="bg-slate/30 border border-line/60 p-5">
      <div className="flex items-center gap-3 mb-3">
        <Avatar seed={analyst.name} size={30} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-bone text-base font-light tracking-tight">
            {analyst.name}
          </p>
          <p className="font-mono text-[10px] tracking-[0.18em] mt-0.5">
            <span className="text-bone tabular">{total}</span>
            <span className="text-mute/70"> 手 · </span>
            <span className="text-gold tabular">{pending.length}</span>
            <span className="text-mute/70"> 鎖定中</span>
            {settled.length > 0 && (
              <>
                <span className="text-mute/70"> · </span>
                <span className="text-bone tabular">✓{hits}</span>{" "}
                <span className="text-loss/90 tabular">✕{misses}</span>
              </>
            )}
          </p>
        </div>
      </div>
      <ul className="space-y-2 list-none pl-0">
        {[...settled, ...pending].map((c, i) => {
          const tone =
            c.result === "hit"
              ? "text-bone"
              : c.result === "miss"
                ? "text-loss/90"
                : "text-gold/80";
          const status =
            c.result === "hit"
              ? "✓ 命中"
              : c.result === "miss"
                ? "✕ 落空"
                : c.result === "push"
                  ? "和 · 不計"
                  : "賽前鎖定 · 待對帳";
          return (
            <li
              key={`${c.event}-${i}`}
              className="flex items-baseline justify-between gap-3 border-b border-line/40 pb-2"
            >
              <span className="min-w-0">
                <span className="font-mono text-mute/55 text-[9px] tracking-[0.2em] mr-2">
                  {SPORT_LABEL[c.sport] ?? "賽事"}
                </span>
                <span className="text-bone text-sm">{c.event}</span>
                <span className="block text-mute text-[13px] leading-snug mt-0.5">
                  看:{c.read}
                </span>
              </span>
              <span
                className={`shrink-0 font-mono text-[10px] tracking-[0.15em] ${tone}`}
              >
                {status}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
