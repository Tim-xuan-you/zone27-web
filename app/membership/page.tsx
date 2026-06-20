import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "撐著它的人 · BLACK",
  description:
    "別的地方靠你輸錢過活、贏太多請你走。 我們不賣明牌、不抽你下注 —— 讓這台引擎永遠免費的,是出錢的這群人。 一圈金環、一間自己人的房間、一個記得你名字的創辦人。 NT$ 500 / 月 · 手動轉帳 · 不自動續扣。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · R250 收成單一付費層(Tim「GOLD 拿掉 · 先留 BLACK · 極簡」)──
// 兩層併一層:GOLD 收掉,BLACK 吸收原 GOLD 的真 perk(Tim 親手回信)= 唯一也是最高。
// 黑卡本來就是頂級的代名詞,GOLD 拿掉後不必改名。 一張卡、小學生看得懂。
// 🔴 R250② 恆美實體店紅茶招待先拿掉(Tim:實體店面還沒規劃好 · 不承諾還沒準備好的東西 = Defector 式誠實)。
// 🔴 守紅線:付費=身分非功能 · 準是免費 · 0 假稀缺 · 0 自動續扣 · perk 只用白名單(金環/房間/Tim 親手回信/未來球員卡)。
// ─────────────────────────────────────────────────────

const PERKS = [
  { text: "金色支持環 ·", strong: "公開檔 / 脈動 / 天梯都看得到你" },
  { text: "會員房間 ·", strong: "只有自己人進得去的客廳" },
  { text: "寫信給 Tim ·", strong: "本人親手回(1–3 個工作天)" },
];

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-20 pb-24">
        {/* 金環本人(先秀產品)*/}
        <div className="flex items-center gap-3 mb-7">
          <Avatar seed="27" size={48} supporter />
          <span className="font-mono text-gold/60 text-[9px] tracking-[0.35em] uppercase">
            支持者金環
          </span>
        </div>

        {/* 身分先行(Defector:你不是顧客)*/}
        <h1 className="text-5xl sm:text-6xl text-bone font-light tracking-tight leading-[1.05] mb-5">
          你不是顧客。
        </h1>
        <p className="text-xl sm:text-2xl text-mute font-light leading-snug mb-9">
          是出錢讓這台引擎<span className="text-gold">永遠免費</span>的人。
        </p>

        {/* 一張卡 */}
        <MembershipUpgrade
          name="BLACK"
          kicker="撐著它的人 · 黑卡"
          priceLabel="500"
          period="31 天"
          perks={PERKS}
          highlight
        />

        {/* 一行誠實 */}
        <p className="mt-6 text-center font-mono text-mute/65 text-[10px] tracking-[0.2em] leading-relaxed">
          其餘全部免費,永遠 —— 引擎、準度、徽章都不藏在付費牆後面。
          <br className="hidden sm:block" />
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
