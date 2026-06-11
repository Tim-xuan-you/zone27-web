import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { PulseSummary } from "@/lib/pulse";

// ── ZONE 27 · 首頁活動脈動條(會動的前門)─────────────────────────────────
// 一塊低調的 liveness 訊號:最近 N 個不重複的人賽前鎖定 + 滾動的最新一手 · 整塊一個連結 → /pulse
// 完整對帳牆(名字要連 /u 公開校準檔是在牆上,不在這裡 nest 連結)。 心理學:訪客被「有人在的
// 地方」吸進來,不是被空房間 ——「人潮就是錢潮」。
// 🔴 紅線:lib getPulseSummary 已把「不到門檻」回成 lockerCount 0 → 這裡整塊不渲染(不秀空牆、
//   不曝光單一用戶)· 無 PnL / 連勝 / 排名 / 粉絲數 · 暗金、無紅綠、無 emoji(守品牌)。
export default function HomepagePulseStrip({ summary }: { summary: PulseSummary }) {
  if (summary.lockerCount === 0 || !summary.latest) return null;
  const { lockerCount, avatars, latest } = summary;
  return (
    <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-2 pb-2">
      <Link
        href="/pulse"
        aria-label={`活動脈動 · ${lockerCount} 人已在牆上賽前鎖定 · 最新 ${latest.handle} 看好 ${latest.teamLabel} · 看完整牆`}
        className="block border border-gold/30 bg-gold/[0.04] hover:border-gold/50 hover:bg-gold/[0.06] transition-colors px-4 py-3 group"
      >
        <div className="flex items-center gap-3">
          {/* 最近押注者頭像列(幾何身分 · 無紅綠)· navy 環分開疊放 */}
          {avatars.length > 0 && (
            <div className="flex shrink-0">
              {avatars.map((code, i) => (
                <span
                  key={code}
                  className={`inline-flex rounded-[30%] ring-2 ring-navy ${i === 0 ? "" : "-ml-2"}`}
                >
                  <Avatar seed={code} size={26} />
                </span>
              ))}
            </div>
          )}
          <p className="text-bone text-sm leading-snug min-w-0">
            <span className="text-gold font-medium">{lockerCount}</span> 人已在牆上賽前鎖定
          </p>
          <span className="ml-auto shrink-0 font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em]">
            看牆 →
          </span>
        </div>
        <p className="mt-1.5 font-mono text-mute/60 text-[10px] sm:text-[11px] tracking-[0.1em] truncate">
          最近 · <span className="text-bone/80">{latest.handle}</span> 看好{" "}
          <span className="text-gold/90">{latest.teamLabel}</span>
        </p>
      </Link>
    </section>
  );
}
