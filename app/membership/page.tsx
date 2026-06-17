import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "撐著它的人 · BLACK / GOLD",
  description:
    "別的地方靠你輸錢過活、贏太多請你走。 我們不賣明牌、不抽你下注 —— 讓這台引擎永遠免費的,是出錢的這群人。 你付的不是門票,是歸屬:一圈金環、一間自己人的房間、一個記得你名字的創辦人。 手動轉帳 · 不自動續扣。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R248② · Tim「會員沒感覺有優勢 · 參考 Defector · Defector go」)──
// 🔑 診斷(寫死):R246 砍成 296 字 Apple 極簡後,Tim 反而說「一點都沒感覺有優勢」。 真因 =
//   開場「全部免費」先 de-sell + 把會員講成「換一圈金環」= 0 desire / 0 反派 / 0 房間 / 0 歸屬。
//   Defector 的解不是加功能(那是 SaaS 陷阱 + 我們紅線),是讓會員變成一場運動:① 反派/身分先點火
//   ② 攤出真 stack(金環 + 會員房間 + Tim 親手回信 + 實體招待)③「免費」當 desire 之後的 mic-drop。
//   🔴 針 = 加 desire 不加字(Defector pitch 每行都勾情緒,不是長篇解說)。
// 🔴 守紅線:付費=身分非功能 · 準是免費 · 0 假稀缺/倒數 · 0 自動續扣 · 不指名對手(用行為類別)·
//   **0 創作者抽傭/賣分析**(R238 收掉 · 別再加回)· 唯一可寫 perk = 金環/會員房間/Tim 回信/實體招待/(未來)BOTTOM 27。
// ─────────────────────────────────────────────────────

const BLACK_PERKS = [
  { text: "金色支持環 ·", strong: "公開檔 / 脈動 / 天梯都看得到你" },
  { text: "會員房間 ·", strong: "只有自己人進得去的客廳" },
  { text: "其他全免費 ·", strong: "你付的是身分,不是功能" },
];

const GOLD_PERKS = [
  { text: "BLACK 全部" },
  { text: "寫信給 Tim ·", strong: "本人親手回" },
  { text: "恆美實體店 ·", strong: "一品紅茶招待" },
  { text: "撐最深的一群 ·", strong: "Tim 記得你是誰" },
];

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-20 pb-24">
        {/* HERO 物件:金環本人(Apple 先秀產品)· 把抽象的「金環」變成看得見、想戴的東西 */}
        <div className="flex items-center gap-3 mb-7">
          <Avatar seed="27" size={48} supporter />
          <span className="font-mono text-gold/60 text-[9px] tracking-[0.35em] uppercase">
            支持者金環
          </span>
        </div>

        {/* 身分先行 · 不開場 de-sell(Defector 核心:你不是顧客)── */}
        <h1 className="text-5xl sm:text-6xl text-bone font-light tracking-tight leading-[1.05] mb-5">
          你不是顧客。
        </h1>
        <p className="text-xl sm:text-2xl text-mute font-light leading-snug mb-9">
          是出錢讓這台引擎<span className="text-gold">永遠免費</span>的人。
        </p>

        {/* 共同敵人(行為類別不指名)· Defector 的 us-vs-them 點火 ── */}
        <div className="border-l-2 border-gold/50 pl-5 py-1 mb-10 space-y-2.5 max-w-md">
          <p className="text-bone text-base sm:text-lg leading-relaxed">
            別的地方靠你輸錢過活,贏太多就請你走。
          </p>
          <p className="text-mute text-sm sm:text-base leading-relaxed">
            我們不賣明牌、不抽你下注 —— 一塊錢都不從你的輸贏來。
            所以讓它一直免費的,只有這群人。
          </p>
        </div>

        {/* 你會變成什麼(felt stack · 不是清單是「得到的身分」)── */}
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-md">
          付費換到的:一圈大家看得見的<span className="text-gold">金環</span>、
          一間只有自己人進得去的<span className="text-gold">房間</span>、
          一個<span className="text-gold">記得你名字</span>的創辦人。
        </p>
        <p className="text-mute/80 text-sm leading-relaxed mb-12 max-w-md">
          引擎、押注、戰績、校準 —— 一個功能都不收你錢,永遠。 你付的不是門票,是歸屬。
        </p>

        {/* 兩張卡(價 + 真 perk)── */}
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

        {/* 一行信任 + 細節留給 Learn more ── */}
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
