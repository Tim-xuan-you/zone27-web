import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "升級會員 · 把你的準度變成買不到的身分",
  description:
    "押注、跑引擎、爬天梯、對帳 —— 全部免費,付費一個功能都不解鎖。 你付的錢只做兩件事:讓引擎對下一個懷疑的人也免費、讓贏和輸的帳本永遠刪不掉。 換來一個看得見、賺得到、造不了假的身分。 BLACK NT$ 500/31 天 · GOLD NT$ 2,700/365 天 · 不自動續扣 · 14 天退款。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R241 · Tim dogfood canary 重做)──────
// Tim 實測:「完全看不出在幹嘛 · 有寫等於沒寫 · 一點吸引力都沒有」。
// 真因 = 頁面只忙著解釋「不是買功能」(對的哲學),卻從不讓人「看見/感覺到」
// 會員到底變成什麼。 修法(Defector 40k 訂閱 + Apple + 定價心理學,全守紅線):
//   ① 先解除「免費還付什麼」的疑問(功能全免費,付費 0 解鎖)
//   ② 把錢的去向講具體(Defector 命脈:你的錢養活什麼)+ 點出共同的敵人(行為類別)
//   ③ 把「你會變成什麼」用看得見的身分秀出來(reuse Avatar 金環 + 驗證準度徽章)
//   ④ 兩階 = 關係深度(進場支持 → 共同守護者),不是兩個價格點
//   ⑤ 誠實版厭惡心理學:不用「剩 X 名額」假倒數(/integrity #05 紅線);
//      唯一「晚來補不回」的是「已經對帳的天數 / 賺來的位置」= 真實、賺來的稀缺
//   ⑥ 反黑暗模式收尾:不自動續扣 · 靠你「還在乎」留你、不靠你忘記取消
// 🔴 守紅線:付費=支持/身分非功能(引擎永遠免費)· 0 賣分析 · 0 賭場 · 不指名對手。
// ─────────────────────────────────────────────────────

const BLACK_PERKS = [
  { text: "公開資料頁掛上「✓ 驗證準度」徽章 ·", strong: "連輸都算、造不了假" },
  { text: "戴上支持者金環 ·", strong: "大家都看得到你撐著免費引擎" },
  { text: "賽事討論室發言 ·", strong: "你的話有公開戰績撐腰" },
];

const GOLD_PERKS = [
  { text: "BLACK 全部 +", strong: "最高階支持身分" },
  { text: "引擎新版你先玩 ·", strong: "方向你投一票" },
  { text: "Tim 親手帶你進門 ·", strong: "養活引擎最深的一群" },
];

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── HERO · 先解除「免費還付什麼」+ Defector 錢的去向 + 敵人 ── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 升級會員
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
          把你的準度,變成<span className="text-gold">一個買不到的身分</span>。
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
          押注、跑引擎、爬天梯、對帳 —— <span className="text-bone">全部免費,永遠免費</span>。
          付費,一個功能都不解鎖。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
          你付的錢只做兩件事:讓這台引擎對<span className="text-bone">下一個懷疑的人</span>也免費、
          讓贏和輸的帳本<span className="text-bone">永遠刪不掉</span>。 在一個靠「刪掉你的輸單」
          賺錢的行業裡 · 你是出錢撐住一個反過來做的地方的人。
        </p>

        {/* ── 你會變成什麼 · 看得見的身分(reuse Avatar 金環 + 徽章)── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          / 你會變成什麼
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-5 max-w-lg">
          付費不給你功能 · 給你一個 <span className="text-bone">看得見、賺得到、造不了假</span> 的身分。
        </p>
        <div className="border border-gold/30 bg-gold/5 p-5 sm:p-6 max-w-md">
          <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] mb-4">
            你的公開資料頁會長這樣
          </p>
          <div className="flex items-center gap-3 mb-4">
            <Avatar seed="zone27-you" size={46} supporter glyph="你" />
            <div className="min-w-0">
              <p className="text-bone text-base leading-tight">你的名字</p>
              <p className="font-mono text-gold/80 text-[10px] tracking-[0.12em] mt-1 leading-snug">
                金色支持環 · 一眼看出你撐著免費引擎
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 border border-gold/40 bg-gold/10 px-3 py-1.5 text-[12px] text-gold tracking-wide">
            <span aria-hidden="true">✓</span> 驗證準度 · 連輸都算
          </span>
        </div>
        <p className="mt-4 mb-10 text-mute text-[13px] sm:text-sm leading-relaxed max-w-lg">
          這個徽章 · 賣明牌的人永遠拿不到 —— 因為它連你<span className="text-bone">輸的場</span>
          都算進去 · 而他們靠刪輸單活著。
        </p>

        {/* ── 兩階 = 關係深度,不是兩個價格點 ── */}
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

        {/* ── 誠實版「厭惡心理學」· 不用假倒數(守 /integrity #05)──
            唯一「晚來補不回」的是賺來的對帳天數 / 位置 = 真實稀缺,不是催單。 */}
        <p className="mt-8 border-l-2 border-gold/50 pl-4 py-1 text-bone text-sm sm:text-base leading-relaxed max-w-lg">
          這個身分買不到捷徑:準度一場一場累積 · 徽章連輸都算 · 名冊位置是賺來的。
          晚進場的人 · 補不回你已經對帳的<span className="text-gold">每一天</span>。
        </p>

        {/* ── 反黑暗模式收尾 · 誠實說明手動轉帳 ── */}
        <p className="mt-8 text-center font-mono text-mute/65 text-[10px] tracking-[0.18em] leading-relaxed">
          不自動續扣 · 14 天退款 · 隨時可停。 每 31 / 365 天 ·
          <span className="text-mute"> 由你主動再轉一次才續</span> —— 靠你「還在乎」留你 · 不靠你忘記取消。
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
