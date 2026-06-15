import { splitFounderCalls } from "@/lib/founder-calls";

// ── ZONE 27 · 創辦人跨運動個人鎖定 · 顯示(R238)──────────────────────
// 只在創辦人帳本(/tim · /u/[創辦人碼])渲染(由 ProfileView founder gate)。
// 把 Tim 親手賽前鎖定、引擎沒覆蓋運動的「個人看法」攤成公開戰績:
//   · 賽前鎖定 → 賽後逐場打分 → 連輸都留(✕ 跟 ✓ 一樣大)。
//   · 框成「人類預測者的戰績」非明牌:不顯示賠率/運彩編號、不寫「推薦你跟單」。
//   · 引擎仍是招牌 · 這條是旁邊的人類賽道(視覺與引擎分離)。
// 純展示 server component · 0 client JS · 0 migration(資料在 lib/founder-calls.ts)。
// ─────────────────────────────────────────────────────

const SPORT_LABEL: Record<string, string> = {
  足球: "足球",
  籃球: "籃球",
  棒球: "棒球",
  電競: "電競",
  其他: "賽事",
};

export default function FounderCalls() {
  const { pending, settled, hits, misses, total } = splitFounderCalls();
  if (total === 0) return null;

  return (
    <section className="mt-9 bg-slate/40 border border-gold/30 p-6 sm:p-8">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        創辦人 · 跨運動個人鎖定
      </p>
      <p className="text-mute text-sm leading-relaxed mb-1 max-w-xl">
        引擎只算棒球、足球。 這條是 Tim <span className="text-bone">個人</span>賽前鎖定的看法 ——
        籃球、電競、任何球都鎖。
      </p>
      <p className="text-mute/75 text-[13px] leading-relaxed mb-5 max-w-xl">
        是人不是引擎、不是叫你跟單。 規則跟引擎一樣硬:賽前鎖死、賽後逐場打分、
        <span className="text-mute">連輸的都留著</span> · 看的是長期準度,不是勝率。
      </p>

      {/* counts(誠實:鎖定中 + 已對帳含輸 · 不放命中率%避免小樣本誤導)*/}
      <p className="font-mono text-[11px] tracking-[0.18em] mb-5">
        <span className="text-bone tabular">{total}</span>
        <span className="text-mute/70"> 手 · </span>
        <span className="text-gold tabular">{pending.length}</span>
        <span className="text-mute/70"> 鎖定中</span>
        {settled.length > 0 && (
          <>
            <span className="text-mute/70"> · 已對帳 </span>
            <span className="text-bone tabular">✓{hits}</span>
            <span className="text-mute/50"> </span>
            <span className="text-loss/90 tabular">✕{misses}</span>
          </>
        )}
      </p>

      <ul className="space-y-2.5 list-none pl-0">
        {[...settled, ...pending].map((c) => {
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
              key={`${c.event}-${c.read}`}
              className="flex items-baseline justify-between gap-3 border-b border-line/40 pb-2.5"
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

      <p className="mt-5 font-mono text-mute/55 text-[10px] tracking-[0.18em] leading-relaxed">
        ▸ 賽前鎖定 = 以公開提交時間為證 · 改不了、刪不掉 · 賽後逐場攤開對帳。
      </p>
    </section>
  );
}
