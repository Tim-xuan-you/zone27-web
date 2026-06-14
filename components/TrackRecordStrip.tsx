import Link from "next/link";

// ── ZONE 27 · 引擎公開戰績條(賽事板頂端 · 兩運動共用)· R234 ──────────────────
// 把品牌最強、對手抄不走的證物(每場預測 ✓命中 / ✕落空、賽前鎖死、永不刪)從「角落
// 一個小連結」升成賽事板頂端、帶真實數字的一行 —— 訪客評估引擎的「第一眼」就撞到
// 「連輸都掛的帳本」(costly signal 只在被看見時才生效;藏起來等於沒付出那個代價)。
//
// 一個共用元件、/matches 與 /soccer 兩個賽事板同款同位 = Apple 一致性(同一個問題用
// 同一個元件,使用者零重學)。 BetVize 把驗證勝率掛在列表上、FiveThirtyEight「Checking
// Our Work」、Metaculus 校準曲線:都把證物擺在「主張發生的地方」,不是藏在子頁。
//
// 🔴 暗金一行 · 無紅綠閃爍 · ✓/✕ 數字當唯一重點。 刻意只放 counts 不放命中率% ——
//   counts 永遠誠實(不需小樣本 N<30 caveat),且足球/棒球同一把尺、跨運動一致。
// ─────────────────────────────────────────────────────────────────────
export default function TrackRecordStrip({
  hits,
  misses,
  pending = 0,
  href = "/track-record",
}: {
  /** 引擎看好邊 == 終場(✓ 命中) */
  hits: number;
  /** 引擎偏錯(✕ 落空 · 照掛、永不刪) */
  misses: number;
  /** 已賽前鎖定、還沒對帳的場(decided=0 時用來說「鎖了 N 場等對帳」· 不假裝有戰績) */
  pending?: number;
  /** 連到完整含輸帳本 · 預設 /track-record(足球板傳 /track-record#soccer 直接開足球視圖) */
  href?: string;
}) {
  const decided = hits + misses;
  return (
    <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 mb-6">
      <Link
        href={href}
        aria-label={
          decided > 0
            ? `引擎公開戰績 · 命中 ${hits} · 落空 ${misses} · 共 ${decided} 場已對帳 · 看每一場對錯`
            : `引擎已賽前鎖定 ${pending} 場 · 賽後逐場對帳 · 看公開戰績`
        }
        className="group block border border-gold/30 bg-slate/30 hover:border-gold/55 hover:bg-slate/40 transition-colors px-4 sm:px-5 py-3"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="font-mono text-gold text-[10px] tracking-[0.35em] shrink-0">
            引擎公開戰績
          </span>

          {decided > 0 ? (
            <span className="flex items-center gap-x-3 gap-y-1 flex-wrap font-mono tabular text-sm">
              <span className="text-gold">✓ {hits} 命中</span>
              <span className="text-loss/85">✕ {misses} 落空</span>
              <span className="text-mute/65 text-xs">共 {decided} 場已對帳</span>
            </span>
          ) : (
            <span className="font-mono tabular text-sm text-mute">
              已賽前鎖定 {pending} 場 · 賽後逐場對帳
            </span>
          )}

          <span className="ml-auto shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.25em] transition-colors">
            看每一場對錯 →
          </span>
        </div>

        <p className="mt-1.5 text-mute/70 text-[12px] leading-snug">
          賽前鎖死、連輸的都留著、永不刪。
        </p>
      </Link>
    </section>
  );
}
