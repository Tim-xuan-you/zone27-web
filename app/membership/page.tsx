import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "撐著它的人 · BLACK / GOLD",
  description:
    "全部免費。 付錢的人,是讓它一直免費的人。 BLACK NT$ 500/31 天 · GOLD NT$ 2,700/365 天 · 手動轉帳 · 不自動續扣 · 隨時停。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R246 · Tim dogfood 第四輪:「看不懂·超雜·亂·極簡再極簡·Apple」)──
// 🔑 學到的教訓(寫死):前三輪我一直「加字」想更有說服力 —— 但 Tim 要的剛好相反 = Apple 式
//   殘酷極簡。 一個大訊息、一個價、一顆按鈕,完。 Defector 的「靈魂」(付費=身分非功能、準是免費、
//   不自動扣)留著,但用 Apple 的「字數經濟」表達:整頁 = 3 句 + 兩張卡 + 一行。 國小生 5 秒看懂:
//   全部免費 → 付錢=讓它一直免費+一圈金環 → 500 或 2,700 → 不自動扣。
// 🔴 守紅線:付費=身分非功能 · 準是免費(0 把準度當付費)· 0 假稀缺/倒數 · 0 自動續扣 · 只寫真 perk
//   (唯一 tier-gated exclusive = 金色支持環;GOLD 多本人回信)。 細節留給 /black-card(Apple「Learn more」)。
// ─────────────────────────────────────────────────────

const BLACK_PERKS = [
  { text: "金色支持環 ·", strong: "公開檔 / 脈動 / 天梯都看得到" },
  { text: "其他全免費 ·", strong: "你付的是身分,不是功能" },
];

const GOLD_PERKS = [
  { text: "BLACK 全部" },
  { text: "寫信給 Tim ·", strong: "本人親手回" },
  { text: "撐最深的一群 ·", strong: "Tim 記得你是誰" },
];

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-20 pb-24">
        {/* ── 一個訊息(Apple:一句話講完)── */}
        <h1 className="text-5xl sm:text-6xl text-bone font-light tracking-tight leading-[1.05] mb-6">
          全部免費。
        </h1>
        <p className="text-xl sm:text-2xl text-mute font-light leading-snug mb-10">
          付錢的人,是讓它<span className="text-gold">一直免費</span>的人。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-14 max-w-md">
          押注、引擎、戰績、校準 —— 一個功能都不收你錢。 付費只換一樣:一圈
          <span className="text-gold">金環</span>,大家看得到你在撐這個。
        </p>

        {/* ── 兩張卡(價 + 按鈕)── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MembershipUpgrade
            name="BLACK"
            kicker="進場支持 · 黑卡"
            priceLabel="500"
            period="31 天"
            perks={BLACK_PERKS}
          />
          <MembershipUpgrade
            name="GOLD"
            kicker="撐最深的一群 · GOLD"
            priceLabel="2,700"
            period="365 天"
            perks={GOLD_PERKS}
            highlight
          />
        </div>

        {/* ── 一行信任 + 細節留給 Learn more ── */}
        <p className="mt-8 text-center font-mono text-mute/65 text-[10px] tracking-[0.2em] leading-relaxed">
          手動轉帳 · 不自動續扣 · 隨時停 · 14 天退款。{" "}
          <Link
            href="/membership/black-card"
            className="text-mute hover:text-gold underline-offset-4 hover:underline"
          >
            完整說明 →
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
