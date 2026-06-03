import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "BLACK · CPBL 季票 · NT$ 500 / 31 天",
  description:
    "BLACK · NT$ 500 / 31 天 · 升級解鎖賣分析賺錢(你拿 90%)+ 賽事討論室發言 + 驗證準度標章。 手動轉帳 · 不自動續扣 · 14 天退款。",
};

export const revalidate = 86400;

// ── /membership/black-card · R187 砍乾淨(Tim:整頁看不懂 · 超複雜)──────
// 542 行(4-cell anchor / pricing 推導 / 一堆英文技術詞 / 長 FAQ)→ ~85 行:
// 是什麼 → 解鎖 6 件事 → 直接付款(reuse MembershipUpgrade)→ 一行誠實。
// ─────────────────────────────────────────────────────

const UNLOCKS: [string, string][] = [
  ["💵", "寫整篇分析來賣 · 你拿 90%(平台抽 10%)"],
  ["💬", "每場比賽發一篇預測 / 觀察(限 200 字 · Tim 看過才上)"],
  ["✓", "解鎖「✓ 驗證準確度」標章(預測滿 10 場、準 6 場自動)"],
  ["⚡", "寫信給 Tim · 24 小時內親手回(免費會員 7 天)"],
  ["📡", "比賽結束 15 分鐘內 · 收到引擎結果通知"],
  ["🎫", "每年 1/1 GOLD 會員開放 · 你享 24 小時優先"],
];

const BLACK_PERKS = [
  { text: "寫整篇分析來賣 · 你拿", strong: "90%" },
  { text: "賽事討論室發言" },
  { text: "「✓ 驗證準度」標章(連輸都算 · 不可造假)" },
];

export default function BlackCardPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── 是什麼 ──────────────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / BLACK · CPBL 季票
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-3">
          BLACK
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-10">
          NT$ 500 / 31 天。 引擎永遠免費 —— 你付的是
          <span className="text-bone">解鎖賣分析賺錢</span>:賣出你拿 90%。
        </p>

        {/* ── 解鎖什麼 ─────────────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          你解鎖這 6 件事
        </p>
        <ul className="space-y-2.5 list-none pl-0 mb-3">
          {UNLOCKS.map(([icon, text], i) => (
            <li key={i} className="flex items-baseline gap-3 text-sm leading-relaxed">
              <span aria-hidden="true" className="shrink-0">
                {icon}
              </span>
              <span className="text-bone/90">{text}</span>
            </li>
          ))}
        </ul>
        <p className="font-mono text-mute/55 text-[10px] tracking-[0.15em] mb-10">
          ⏳ 部分功能(賣文章、發言、通知)等付款系統上線後陸續開放。
        </p>

        {/* ── 直接付款(同錢包 UX · 點了直接給帳號)──── */}
        <MembershipUpgrade
          name="BLACK"
          kicker="CPBL 季票 · 每 31 天"
          priceLabel="500"
          period="31 天"
          perks={BLACK_PERKS}
          highlight
        />

        {/* ── 一行誠實 ─────────────────────────── */}
        <p className="mt-6 text-center font-mono text-mute/65 text-[10px] tracking-[0.18em] leading-relaxed">
          手動轉帳 · 不自動續扣 · 14 天無條件退款 · 隨時可停。
          <br className="hidden sm:block" />
          每 31 天結束 · 你主動再轉一次才續(我們不偷扣你錢)。{" "}
          <Link
            href="/membership"
            className="text-mute hover:text-gold underline-offset-4 hover:underline"
          >
            比較三種會員 →
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
