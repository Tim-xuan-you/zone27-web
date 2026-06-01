import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/supabase/server";
import { readTier, tierLabel } from "@/lib/tier";
import { FOUNDERS_REMAINING } from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "升級會員",
  description:
    "引擎永遠免費。付費會員 = 標價賣你的分析變現(你拿 90-95%)+ 身分。BLACK CARD NT$ 500/月 · Founders 27 NT$ 2,700/年 · 手動轉帳 · 0 自動續扣。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R184 NUCLEAR)──────────
// Tim canary fire(免費會員 · mobile):「我要如何付費升級?有夠難!會員介面
// 爛到極致!找不到地方點!划不到底!複雜!Polymarket go」。
//
// 砍掉舊的 Costco 論文頁(3-tier 對應表 + FREE 卡 + waitlist + creator-
// permissions + 明牌vs博彩 essay + founders deep-dive 段)。免費會員來這
// 只想做一件事:升級。所以剩:一句價值主張 + 兩張付費卡 + 兩個大按鈕 +
// 一行「怎麼付」。一個螢幕看完。per [[feedback-member-surface-minimalism]]。
// ─────────────────────────────────────────────────────

export default async function MembershipPage() {
  const session = await getSession();
  const tier = session
    ? readTier(session.user.user_metadata as Record<string, unknown> | undefined)
    : null;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── 一句價值主張 ─────────────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
          / 升級會員
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
          引擎永遠免費。<br />
          付費的是<span className="text-gold">賣分析變現 + 身分</span>。
        </h1>
        <p className="mt-5 text-mute leading-relaxed">
          跑模擬、看戰績、押注、發看法 —— <span className="text-bone">免費會員全都有</span>,
          永遠不鎖。付費多的是一件事:<span className="text-gold">能標價賣你的分析賺錢</span>(你拿 90–95%)+ 身分編號。
        </p>

        {/* 你現在是哪一層 */}
        <p className="mt-4 font-mono text-[11px] tracking-[0.2em]">
          {tier ? (
            <span className="text-mute">
              你現在:<span className="text-gold">{tierLabel(tier)}</span> 會員 ·{" "}
              {tier === "free" ? "升級解鎖「賣分析」↓" : "已是付費會員 · 感謝支持"}
            </span>
          ) : (
            <Link
              href="/login?next=/membership"
              className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
            >
              先免費註冊 → 之後隨時升級
            </Link>
          )}
        </p>

        {/* ── 兩張付費卡 ───────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BLACK CARD */}
          <article className="flex flex-col border border-line/60 bg-slate/30 p-5 sm:p-6">
            <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
              / 一般付費會員
            </p>
            <h2 className="text-xl text-bone font-light tracking-tight mb-2">BLACK CARD</h2>
            <p className="font-mono text-bone tabular text-2xl font-light leading-none mb-1">
              NT$ 500
            </p>
            <p className="font-mono text-mute text-[10px] tracking-[0.2em] mb-4">
              每 31 天 · 手動轉帳 · 0 自動續扣
            </p>
            <ul className="space-y-1.5 mb-5 text-sm leading-relaxed flex-grow list-none pl-0">
              <Perk>標價賣你的分析(你拿 90% · 平台抽 10%)</Perk>
              <Perk>賽事討論室發言</Perk>
              <Perk>「✓ 驗證準度」徽章(準度達標自動解鎖)</Perk>
            </ul>
            <Link
              href="/membership/black-card"
              className="mt-auto block text-center px-4 py-3 border border-gold/50 text-gold font-mono text-xs tracking-[0.3em] hover:bg-gold/10 hover:border-gold transition-colors"
            >
              → 升級 BLACK CARD
            </Link>
          </article>

          {/* FOUNDERS 27 · highlight */}
          <article className="flex flex-col border border-gold/50 bg-gold/5 glow-soft p-5 sm:p-6">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-1">
              / 最高 tier · 年費
            </p>
            <h2 className="text-xl text-gold font-light tracking-tight mb-2">FOUNDERS 27</h2>
            <p className="font-mono text-gold tabular text-2xl font-light leading-none mb-1">
              NT$ 2,700
            </p>
            <p className="font-mono text-mute text-[10px] tracking-[0.2em] mb-4">
              每 365 天 · 手動轉帳 · 0 自動續扣
            </p>
            <ul className="space-y-1.5 mb-5 text-sm leading-relaxed flex-grow list-none pl-0">
              <Perk gold>BLACK CARD 全部 + 抽成更低(你拿 95%)</Perk>
              <Perk gold>
                前 270 名永久創始編號(
                <span className="tabular">{FOUNDERS_REMAINING}</span> 待領)
              </Perk>
              <Perk gold>引擎新版搶先試 + 投票</Perk>
            </ul>
            <Link
              href="/founders"
              className="mt-auto block text-center px-4 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              → 升級 Founders 27
            </Link>
          </article>
        </div>

        {/* ── 怎麼付款 · 一行 ───────────────────────── */}
        <p className="mt-6 text-center font-mono text-mute/70 text-[10px] sm:text-[11px] tracking-[0.2em] leading-relaxed">
          怎麼付:<span className="text-bone">手動銀行 / ATM 轉帳 · 0 自動續扣 · 14 天退款</span>。
          點上面任一個,照指示 email 給 Tim 就好。
        </p>
      </main>

      <Footer />
    </div>
  );
}

function Perk({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-2">
      <span
        aria-hidden="true"
        className={`font-mono text-[9px] shrink-0 ${gold ? "text-gold" : "text-mute/60"}`}
      >
        ▸
      </span>
      <span className="flex-1 text-mute/90">{children}</span>
    </li>
  );
}
