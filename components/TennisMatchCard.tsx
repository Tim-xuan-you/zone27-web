import Avatar from "@/components/Avatar";
import {
  predictTennis,
  toDisplayPercents,
  enginePickOf,
  type TennisSurface,
} from "@/lib/tennis/engine";
import { initials, type TennisPlayer } from "@/lib/tennis/players";

// ── ZONE 27 · 網球對戰卡(兩向 · 非足球三向)──────────────────────────────────
// 網球無和局 → 兩向開盤(A 勝 / B 勝)。 顯示「我們引擎自己算的草地勝率」· 絕不顯示盤口。
// 引擎看好那邊上金;弱邊 mute(守暗金品牌 · 無紅綠)。 v0.1 用於「引擎示範對戰」(草地實力
// 分怎麼變成勝率)—— 真正的對戰盤等籤表出爐後逐場鎖定(同棒球 Tim 親手 curate)。
// 純展示 · 0 client JS · deterministic(predictTennis 純函式)= ISR-safe。
// ─────────────────────────────────────────────────────

export default function TennisMatchCard({
  a,
  b,
  surface,
  label,
  sublabel,
}: {
  a: TennisPlayer;
  b: TennisPlayer;
  surface: TennisSurface;
  /** 卡頭小標(例 "引擎示範對戰") */
  label?: string;
  /** 卡頭右側補充(例 "草地 · 五盤三勝") */
  sublabel?: string;
}) {
  const pred = predictTennis(a.rating, b.rating, surface);
  const d = toDisplayPercents(pred);
  const pick = enginePickOf(pred);
  const aGold = pick === "a";

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5 flex flex-col gap-3 transition-colors hover:border-gold/40">
      {/* 卡頭:小標 + 表面/賽制 */}
      {(label || sublabel) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <span className="font-mono text-gold/80 text-[9px] tracking-[0.3em]">{label}</span>
          )}
          {sublabel && (
            <span className="font-mono text-mute text-[9px] tracking-[0.25em] shrink-0">
              {sublabel}
            </span>
          )}
        </div>
      )}

      {/* 兩位球員 · 頭像 + 名字(主角) */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 min-w-0">
          <Avatar seed={a.id} glyph={initials(a.en)} size={28} />
          <span className="min-w-0">
            <span className="block text-bone text-base font-light tracking-tight truncate">
              {a.name}
            </span>
            <span className="block font-mono text-mute/55 text-[9px] tracking-[0.12em] truncate">
              {a.en}
            </span>
          </span>
        </span>
        <span className="font-mono text-mute/50 text-[10px] shrink-0">vs</span>
        <span className="flex items-center gap-2 min-w-0 justify-end">
          <span className="min-w-0 text-right">
            <span className="block text-bone text-base font-light tracking-tight truncate">
              {b.name}
            </span>
            <span className="block font-mono text-mute/55 text-[9px] tracking-[0.12em] truncate">
              {b.en}
            </span>
          </span>
          <Avatar seed={b.id} glyph={initials(b.en)} size={28} />
        </span>
      </div>

      {/* 兩向勝率(放大主角)· favored 上金 · 另一邊 mute */}
      <div className="border-t border-line/40 pt-2.5">
        <div className="flex items-baseline justify-between mb-2 font-mono tabular">
          <span className="flex flex-col items-start gap-0.5">
            <span className={`text-lg sm:text-xl font-light ${aGold ? "text-gold" : "text-mute"}`}>
              {d.aWin}
              <span className="text-[10px] opacity-60">%</span>
            </span>
          </span>
          <span className="flex flex-col items-end gap-0.5">
            <span className={`text-lg sm:text-xl font-light ${!aGold ? "text-gold" : "text-mute"}`}>
              {d.bWin}
              <span className="text-[10px] opacity-60">%</span>
            </span>
          </span>
        </div>

        {/* 兩段條 · A 勝 / B 勝(favored 亮金 · 另一邊 mute · 無紅綠) */}
        <div className="flex h-2.5 w-full overflow-hidden rounded-[2px] bg-line/30" aria-hidden="true">
          <div
            className={aGold ? "bg-gold/85" : "bg-bone/25"}
            style={{ width: `${d.aWin}%` }}
          />
          <div
            className={!aGold ? "bg-gold/85" : "bg-bone/25"}
            style={{ width: `${d.bWin}%` }}
          />
        </div>

        <p className="mt-2.5 font-mono text-mute/60 text-[10px] tracking-[0.12em] leading-relaxed">
          引擎看好 <span className="text-gold">{aGold ? a.name : b.name}</span> · 草地實力分換算
        </p>
      </div>
    </article>
  );
}
