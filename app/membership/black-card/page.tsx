import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "BLACK · CPBL 季票 · NT$ 500 / 31 天",
  description:
    "BLACK · NT$ 500 / 31 天 · 引擎永遠免費,BLACK 不是買功能 —— 是出錢養著它,戴上一個賺來的「驗證準度」標章 + 支持者金環 + 賽事討論室發言。 手動轉帳 · 不自動續扣 · 14 天退款。",
};

export const revalidate = 86400;

// ── /membership/black-card · R187 砍乾淨(Tim:整頁看不懂 · 超複雜)──────
// 542 行(4-cell anchor / pricing 推導 / 一堆英文技術詞 / 長 FAQ)→ ~85 行:
// 是什麼 → 解鎖 6 件事 → 直接付款(reuse MembershipUpgrade)→ 一行誠實。
// ─────────────────────────────────────────────────────

// 守暗金:render 無 emoji(原 💵💬⚡📡🎫 移除 · 改站上既有的 ▸ 項目符號)。
const UNLOCKS: string[] = [
  "支持者金環 · 公開檔頭像旁的「支持開放引擎」標記",
  "每場比賽發一篇預測 / 觀察(限 200 字 · Tim 看過才上)",
  "「驗證準度」標章(預測滿 10 場、準 6 場自動 · 連輸都算 · 不可造假)",
  "寫信給 Tim · 24 小時內親手回(免費會員 7 天)",
  "比賽結束 15 分鐘內 · 收到引擎結果通知",
  "每年 1/1 GOLD 會員開放 · 你享 24 小時優先",
];

const BLACK_PERKS = [
  { text: "「✓ 驗證準度」標章(連輸都算 · 不可造假)" },
  { text: "賽事討論室發言" },
  { text: "支持者金環 · 出錢讓引擎永遠免費" },
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
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-4">
          NT$ 500 / 31 天。 引擎永遠免費 —— 所以 BLACK
          <span className="text-bone">不是買功能</span>(功能都免費)。 你買的是
          <span className="text-gold">一個賺來的身分</span>:出錢養著這個免費引擎,
          戴上一個連輸都算、不可造假的「驗證準度」標章。
        </p>
        {/* 「為什麼免費還要付費」的答案:不是買 access(都免費)· 是當這個免費引擎的
            出錢人 + 戴上身分(Defector / Patreon 模式 · 信徒養活所有人的免費)。 */}
        <p className="text-mute/85 text-sm leading-relaxed mb-10 border-l-2 border-gold/50 pl-4 py-1">
          說白:引擎永遠免費,總得有人付錢養它 —— 那個人就是你。 你不是顧客,是
          <span className="text-bone">出錢讓「引擎永遠免費」活下去的人</span>。
          我們不靠廣告、不抽你下注的傭、不賣你的數據 —— 靠的就是願意這樣的少數人。
        </p>

        {/* ── 你的身分還帶這些 ─────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          BLACK 的身分 · 還帶這些
        </p>
        <ul className="space-y-2.5 list-none pl-0 mb-3">
          {UNLOCKS.map((text, i) => (
            <li key={i} className="flex items-baseline gap-3 text-sm leading-relaxed">
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-gold/60 text-[10px] tracking-[0.2em] mt-0.5"
              >
                ▸
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
