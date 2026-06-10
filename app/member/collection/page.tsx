import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CollectionWall from "@/components/CollectionWall";
import { getUser } from "@/lib/supabase/server";
import { buildSettledCards } from "@/lib/trophies";

// ── ZONE 27 · /member/collection · 個人戰功卡收藏牆 ─────────────────────
// 會員看自己「所有已結算的 call」的畫廊 —— 一場結算 = 一張刪不掉的戰功卡(含輸照收)。
// 純讀本人已結算帳本(0 migration)· 1 個真人就成立(收的是自己的眼光,不是別人的榜
// = 不碰「0 用戶不上空榜」紅線)· server 備齊賽事資訊(buildSettledCards · 0 API)→ client
// CollectionWall 用 session 端讀本人 picks 配對(不破頁面靜態)。 世界盃今晚第一批結算 → 長卡。
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "你的戰功卡收藏",
  description: "你所有賽前鎖死、改不了的 call —— 命中與落空都收著。收的是自己的眼光,不是中獎彩券。",
};

export default async function CollectionPage() {
  const user = await getUser();
  // 已結算賽事資訊(永久來源 · 0 API · 含名字/隊徽/引擎看好邊)· 共用 lib/trophies。
  const settled = buildSettledCards();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main" className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-12 pb-24">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 戰功卡 · 你的收藏
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
          你鎖死的每一手,<span className="text-gold">都在這。</span>
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-10 max-w-xl">
          每押一手、賽前鎖死,賽後結算就變一張卡 —— 命中、落空,都收著。 改不了、刪不掉,
          收的是<span className="text-bone">你自己的眼光</span>,不是中獎彩券。
          押了引擎沒看好那邊、你卻對了的,叫<span className="text-gold">逆風</span> —— 那是贏過機器的證明。
        </p>

        {user ? (
          <CollectionWall settled={settled} />
        ) : (
          <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
            <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
              這是你的私人收藏。
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
              登入(免費)後,你押過、賽前鎖死的每一手都會收進這面牆 —— 含輸照收。
            </p>
            <Link
              href={`/login?next=${encodeURIComponent("/member/collection")}`}
              className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              免費登入 →
            </Link>
          </div>
        )}

        <p className="mt-12 pt-6 border-t border-line/40">
          <Link
            href="/member"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
          >
            ← 回你的儀表板
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
