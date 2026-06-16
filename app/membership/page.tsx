import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "升級會員 · 老實說,大部分都免費",
  description:
    "押注、跑引擎、爬天梯、對帳 —— 全部免費,付費一個功能都不解鎖。 付的錢只做一件事:讓這個免費的東西活下去,不靠廣告、不賣你的資料、不抽你下注的傭。 換來的是一個看得見、造不了假的支持身分。 BLACK NT$ 500/31 天 · GOLD NT$ 2,700/365 天 · 不自動續扣 · 隨時可停。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R241② · Tim dogfood 第二輪)──────
// Tim 第二輪開火:「投票權?最高階支持身分?Tim 親手帶你進門?——這些是什麼?
//   我們有嗎?」 → 一查屬實:投票權 / 新版搶先試 / 最高階支持身分 = 空話(無功能)·
//   寫死在 copy 卻沒實作 = 踩自己的 /integrity #10「不 ship fake methodology」紅線。
// 修法(Apple 式殘酷簡化 + 誠實):
//   ① 砍掉所有空話 perk(投票權 / 新版搶先試 / 最高階支持身分 / 含糊的「帶你進門」)
//   ② 只留「真的、看得出來、賺得到」的(金環 / 驗證準度徽章 / 發言 / 寫信 Tim 親手回)
//   ③ 直接老實回答訪客的疑問:「免費就一堆,那我幹嘛付錢?」= 付費買身分不買功能
//   ④ 國小生語言:短句、常用字、0 英文術語
//   ⑤「隨時可停」從小字升成驕傲的差異點(Defector 式不鎖你)
// 🔴 守紅線:付費=支持/身分非功能 · 引擎永遠免費 · 0 賭場(不加任務/連續登入/等級grind)·
//   不指名對手 · 絕不再寫沒實作的 perk。 ⏳ 投票權/新版搶先試「砍了不是不能做」=Tim 決定要不要真的做。
// ─────────────────────────────────────────────────────

const BLACK_PERKS = [
  { text: "金色支持環 ·", strong: "大家一眼看到你在撐免費引擎" },
  { text: "「✓ 驗證準度」徽章 ·", strong: "連你輸的場都算、造不了假" },
  { text: "賽事討論室發言 ·", strong: "說話有成績撐腰、不是嗓門大" },
];

const GOLD_PERKS = [
  { text: "BLACK 全部" },
  { text: "寫信給 Tim ·", strong: "24 小時內本人親手回" },
  { text: "出錢撐這個撐最深的一群 ·", strong: "Tim 記得你是誰" },
];

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── HERO ── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 升級會員
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
          老實說 · <span className="text-gold">大部分都免費</span>。
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
          押注、跑引擎、爬天梯、對帳 —— <span className="text-bone">全部免費,永遠免費</span>。
          付費,一個功能都不解鎖。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
          你付的錢只做一件事:讓這個免費的東西<span className="text-bone">活下去</span> ——
          不靠廣告、不賣你的資料、不抽你下注的傭。 在一個靠「刪掉你的輸單」賺錢的行業裡 ·
          你是出錢撐住一個反過來做的地方的人。
        </p>

        {/* ── 那我幹嘛付錢:準是免費的 · 撐著它是金環(誠實分清 free-earned vs paid-ring)──
            真相 = 整份「證明你準」的公開戰績(含輸帳本/戰功卡/贏過引擎/校準)免費就能建(ProfileView)·
            付費唯一加的是支持環(Avatar supporter)= 出錢撐免費引擎的記號。 別把這條再寫成空話 perk。 */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          / 那,我幹嘛付錢?
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
          你押的每一手 · 賽前鎖死、賽後對帳 · 贏輸都掛在你的公開戰績頁(連你
          <span className="text-bone">贏過引擎</span>都會標出來)。 證明你「準」的這一整份 ——
          <span className="text-bone">免費就能建</span>。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
          付費 · 加的是另一件事:那一圈<span className="text-gold">金環</span>。 它不證明你準
          (那個用賺的)· 它證明你「<span className="text-bone">撐著這個</span>」—— 出錢讓引擎對下一個
          懷疑的人也免費。 <span className="text-gold">準是免費的 · 撐著它是金環。</span>
        </p>
        <div className="border border-gold/30 bg-gold/5 p-5 sm:p-6 max-w-md">
          <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-4">
            你的公開戰績頁會長這樣
          </p>
          <div className="flex items-center gap-3 mb-4">
            <Avatar seed="zone27-you" size={46} supporter glyph="你" />
            <div className="min-w-0">
              <p className="text-bone text-base leading-tight">你的名字</p>
              <p className="font-mono text-gold/80 text-[10px] tracking-[0.12em] mt-1 leading-snug">
                金色支持環 · 出錢讓引擎免費的記號
              </p>
            </div>
          </div>
          <div className="border-t border-line/40 pt-3 space-y-2">
            <p className="text-bone/90 text-[13px] leading-relaxed">
              <span className="text-gold">含輸命中率</span> · 每一手賽前鎖死 · 賽後{" "}
              <span className="text-gold">✓ 中</span> / <span className="text-loss/85">✕ 沒中</span> 都掛
            </p>
            <p className="text-mute/80 text-[12px] leading-relaxed">
              還會標出你<span className="text-bone">贏過公開引擎</span>的場 —— 賺得到、買不到、刪不掉。
            </p>
          </div>
        </div>
        <p className="mt-4 mb-10 text-mute text-[13px] sm:text-sm leading-relaxed max-w-lg">
          這份帳本敢把<span className="text-bone">輸的</span>也留著 · 賣明牌的攤不出來。{" "}
          <Link
            href="/track-record"
            className="text-gold/75 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            看我們怎麼公開每一場(連引擎自己的輸)→
          </Link>
        </p>

        {/* ── 兩種深度 ── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          / 兩種深度 · 都是「撐著它」不是「解鎖」
        </p>
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
            kicker="最深的支持 · GOLD"
            priceLabel="2,700"
            period="365 天"
            perks={GOLD_PERKS}
            highlight
          />
        </div>

        {/* ── 誠實版「厭惡心理學」· 不用假倒數(守 /integrity #05)── */}
        <p className="mt-8 border-l-2 border-gold/50 pl-4 py-1 text-bone text-sm sm:text-base leading-relaxed max-w-lg">
          這個身分買不到捷徑:準度一場一場累積 · 徽章連輸都算。
          晚進場的人 · 補不回你已經對帳的<span className="text-gold">每一天</span>。
        </p>

        {/* ── 「隨時可停」升成驕傲的差異點(Tim 問:Defector 怎麼做)── */}
        <p className="mt-8 text-center font-mono text-mute/65 text-[10px] tracking-[0.18em] leading-relaxed">
          隨時可停 —— 而且我們<span className="text-mute">本來就不自動扣你錢</span>。 每 31 / 365 天 ·
          你主動再轉一次才續 · 靠你「還在乎」留你 · 不靠你忘記取消。
          <br className="hidden sm:block" />
          點「立即升級」會<span className="text-mute">直接顯示轉帳帳號</span> → 轉完一鍵通知 → Tim 確認入帳幫你開通。{" "}
          <Link
            href="/membership/black-card"
            className="text-mute hover:text-gold underline-offset-4 hover:underline"
          >
            看完整權益 →
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
