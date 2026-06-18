import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "BLACK · CPBL 季票 · NT$ 500 / 31 天",
  description:
    "BLACK · NT$ 500 / 31 天 · 引擎永遠免費,BLACK 不解鎖任何功能(功能全免費)—— 你出錢養著它,戴上一圈所有人看得到的金色支持環、走進一間只有自己人的房間。 手動轉帳 · 不自動續扣 · 14 天退款。",
};

export const revalidate = 86400;

// ── /membership/black-card · R245 對齊 /membership 誠實重寫(對抗稽核逐碼驗證後修紅線)──────
// 舊版把一堆「其實免費 / 沒實作 / 過度承諾」的東西列成 BLACK 解鎖,踩了好幾條紅線:
//   ✕「驗證準度標章」= /u/[code]/badge 對任何碼 0 tier-gate 產生 = 準度證明免費(付費≠比較準)。
//   ✕「每場發一篇預測/觀察」= migration 0005/0010 grant authenticated + CreatorAnalysis「免費會員只能
//      免費發」= 公開發分析對所有會員免費。 ✕「15 分鐘內收結算通知」= web-push 對任何訂閱會員免費、非
//      tier-gated。 ✕「寫信 Tim 24h(免費 7 天)」= 過度承諾(binding SLA 1-3 工作天)+ 個人回覆是 GOLD
//      的差異點不是 BLACK。 ✕「每年 1/1 GOLD 開放 · 24h 優先」= 會員不限量、無名額窗 = 假稀缺(/integrity #05)。
// 修法 = 跟 /membership 同一把尺:BLACK 唯一真 tier-gated exclusive = 金色支持環(0023 Avatar supporter)·
//   其餘全部誠實標「免費」(反而強化「我們不靠鎖功能賺錢」的 flex)· 不灌水補回清單。
// 🔴 守紅線:付費=身分非功能 · 準是免費的 · 0 假稀缺 · 0 自動續扣 · 只寫真 perk。
// ─────────────────────────────────────────────────────

// BLACK 之外本來就免費的(列出來 = 強化「我們不鎖功能」的誠實 flex,不是 BLACK 解鎖)。
const FREE_ALREADY: string[] = [
  "押注、跑引擎、爬天梯、每一手賽前鎖死賽後對帳",
  "你的含輸命中率、校準曲線、哪一場贏過引擎 —— 全部免費標出來",
  "在賽事討論室公開掛名發分析 / 觀察 · 賽後自動對帳",
  "賽果結算通知(開了就收得到)",
];

const BLACK_PERKS = [
  {
    text: "一圈金色支持環 ·",
    strong: "公開戰績頁 / 活動脈動 / 天梯都跟著你 —— 一眼看到你在撐這個免費引擎",
  },
  {
    text: "一間會員房間 ·",
    strong: "只有付費會員進得去的客廳 · 聊球聊判斷,不押注",
  },
  {
    text: "寫信給 Tim ·",
    strong: "本人親手回(1–3 個工作天)· 不外包、不罐頭",
  },
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
          <span className="text-gold">一圈所有人看得到的金色支持環、一間自己人的房間</span>:出錢養著這個免費引擎,
          讓陌生人也能永遠免費用下去。
        </p>
        {/* 「為什麼免費還要付費」的答案:不是買 access(都免費)· 是當這個免費引擎的出錢人 + 戴上身分。 */}
        <p className="text-mute/85 text-sm leading-relaxed mb-10 border-l-2 border-gold/50 pl-4 py-1">
          說白:引擎永遠免費,總得有人付錢養它 —— 那個人就是你。 你不是顧客,是
          <span className="text-bone">出錢讓「引擎永遠免費」活下去的人</span>。
          我們不靠廣告、不抽你下注的傭、不賣你的數據 —— 靠的就是願意這樣的少數人。
        </p>

        {/* ── 這些本來就免費(誠實 flex)── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-1">
          先說清楚 · 這些本來就免費
        </p>
        <p className="text-mute/80 text-[13px] leading-relaxed mb-4">
          BLACK 不解鎖任何功能 —— 因為證明你準的東西,我們不敢藏在付費牆後面:
        </p>
        <ul className="space-y-2.5 list-none pl-0 mb-10">
          {FREE_ALREADY.map((text, i) => (
            <li key={i} className="flex items-baseline gap-3 text-sm leading-relaxed">
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-gold/60 text-[10px] tracking-[0.2em] mt-0.5"
              >
                免費
              </span>
              <span className="text-bone/90">{text}</span>
            </li>
          ))}
        </ul>

        {/* ── BLACK 加的兩樣(都是身分,不是功能)── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
          BLACK 加的 · 身分的東西
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-4">
          一圈<span className="text-gold">金環</span>。 在一個人人曬連勝、輸了就刪文的地方,
          它只說一件事:「<span className="text-bone">這個人出錢,讓陌生人也能免費用這個引擎</span>。」
          它買不到準度(那個用賺的)· 造不了假(你是真的轉了錢)· 公開檔、脈動、天梯都看得到。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-6">
          再加一間<span className="text-gold">房間</span>。 出錢養著引擎的這群人,有一面只有自己人進得去的
          留言牆 —— 聊球、聊判斷、打個招呼。 不是明牌、不押注,就是一間客廳。
          <span className="text-bone">身分制,不是功能制</span>。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-6">
          還有一件真人的事:你寫信給 Tim,<span className="text-gold">本人親手回</span>(1–3 個工作天、不外包、不罐頭)。
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
            回會員頁 →
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
