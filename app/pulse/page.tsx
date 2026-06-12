import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ActivityPulse from "@/components/ActivityPulse";
import { getActivityPulse } from "@/lib/pulse";

export const metadata: Metadata = {
  title: "活動脈動 · 大家在押什麼 · ZONE 27",
  description:
    "一面會動的對帳牆:誰賽前鎖死了哪一手、引擎又對帳了哪場 —— 全是改不了的真事件,不是嘴砲。 點任何一個名字,看他到底準不準。",
};

// ── ZONE 27 · /pulse · 中央活動脈動(會動的對帳牆)──────────────────────
// R210 設計、R226(Tim 找來 10 個真人)才建。 只讀廣播 —— 把真實帳本事件(會員賽前鎖定 +
// 引擎結算)按時間串起來,讓站「有人在」。 不是聊天室、沒有發言框 · 熱鬧靠「被看見的對帳」。
// 資料走 0022 get_ladder_entries(已公開署名)+ matches.ts 結算 → 0 新 migration · graceful。
// ─────────────────────────────────────────────────────

// 脈動要新鮮(但不必即時)· 2 分鐘 ISR · 讀全站公開事件 · 不混登入者(同 /ladder)。
export const revalidate = 120;

export default async function PulsePage() {
  const events = await getActivityPulse(24);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="pulse" />

      <main id="main">
        {/* ── HERO ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 活動脈動
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            現在,<span className="text-gold">大家在押什麼</span>
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-5" aria-hidden="true" />
          <p className="text-mute text-base leading-relaxed">
            一面會動的對帳牆 —— 誰賽前鎖死了哪一手、引擎又對帳了哪場,全是
            <span className="text-bone">改不了的真事件</span>,不是嘴砲。
            這裡<span className="text-bone">沒有發言框</span>:不靠誰喊得大聲,靠看得見的紀律。
            點任何一個名字,直接看他到底準不準。
          </p>
        </section>

        {/* ── PULSE FEED ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-12">
          {events.length > 0 ? (
            <ActivityPulse events={events} />
          ) : (
            <div className="border border-dashed border-gold/30 bg-slate/30 p-8 text-center">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                牆還很安靜
              </p>
              <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
                還沒有人鎖手、引擎也還沒對帳出結果。 第一手鎖下去,這面牆就會開始動。
              </p>
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-20 text-center border-t border-line/40 pt-10">
          <p className="text-mute text-sm leading-relaxed mb-5">
            想上這面牆?賽前鎖一手 —— 押了就刪不掉、賽後逐場對帳。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] px-6 py-3 hover:bg-gold-soft transition-colors"
            >
              去鎖一手 →
            </Link>
            <Link
              href="/ladder"
              className="inline-flex items-center gap-2 border border-gold/45 text-gold font-mono text-xs tracking-[0.2em] px-6 py-3 hover:border-gold hover:bg-gold/5 transition-colors"
            >
              看海選天梯 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
