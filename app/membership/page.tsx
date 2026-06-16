import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "撐著它的人 · BLACK / GOLD",
  description:
    "賣明牌的賣依賴 —— 你永遠得回來買下一張牌。 我們做的剛好相反:一個你不必回來買的引擎,一筆連輸都不刪的帳本。 不放廣告、不收創投、不抽你下注的傭、不賣你的資料 —— 全部免費,永遠免費。 付費不解鎖任何功能;你買的是一件事:讓陌生人也能永遠免費用下去。 BLACK NT$ 500/31 天 · GOLD NT$ 2,700/365 天 · 手動轉帳 · 不自動續扣 · 隨時可停。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R245 · Tim dogfood 第三輪:「寫得超爛、不吸引、不會想立刻買」)──
// Tim 點名 Defector + 心理學。 根因診斷 = 情感次序顛倒:上一版開場第一句就「老實說大部分都免費 ·
// 付費不解鎖」= 還沒讓人動心就先 de-sell。 Defector 從不道歉開場 —— 先點火(反派/立場)、招募歸屬、
// 把「而且全免費、你純粹是出錢讓它活」留到後面當 mic-drop(抬升而非洩氣)。 同一份誠實、相反的次序。
//
// 慾望來自(全部誠實 · 0 dark pattern):① 反派真實(賣明牌賣依賴/靠你輸錢賺/輸了刪文)② 誠實的脆弱
// = 真·loss aversion(引擎結構性流血、撐的人是擋在前面的牆)—— 但明寫「不是倒數、沒有剩幾個名額」釘死
// /integrity #05 ③ 金環當「被看見的身分」costly signal ④ 反 dark pattern 信任 flex(不自動扣、隨時停)。
//
// 🔴 對抗式稽核逐碼驗證後修掉的紅線(別重犯):
//   · CUT「✓ 驗證準度徽章」當付費 perk —— /u/[code]/badge 對任何碼 0 tier-gate 產生 = 準度證明免費。
//     列成付費=暗示「付錢才驗證準度」踩「付費≠比較準·準是免費的」。
//   · CUT「賽事討論室發言」當付費 perk —— migration 0005/0010 grant to authenticated · CreatorAnalysis
//     「免費會員只能免費發(建戰績)」+ R238 標價賣整段關閉 = 公開發分析對所有登入會員免費。 列成付費 =
//     vapor + 自打「付費不解鎖任何功能」的臉。 改成在「免費 mic-drop」把它講成免費陣營的驕傲。
//   · GOLD 寫信回覆對齊 binding SLA(lib/founder-sla.ts「1-3 工作天 · 親手 · 不外包」)· 不寫「24h」過度承諾。
//   → 移除後 BLACK 唯一真 tier-gated exclusive = 金色支持環(0023 get_tier_by_code → Avatar supporter)·
//     不灌水補回清單:一個造不了假、人人看得到的金環,勝過三條裡兩條其實免費。
// 守紅線:付費=身分非功能 · 引擎永遠免費 · 0 假稀缺/倒數/FOMO · 0 自動續扣 · 不指名對手 · 只寫真 perk。
// ─────────────────────────────────────────────────────

const BLACK_PERKS = [
  {
    text: "一圈金色支持環 ·",
    strong: "公開戰績頁 / 活動脈動 / 天梯都跟著你 —— 所有人一眼看到你在撐這個免費引擎",
  },
  {
    text: "就這一樣 ——",
    strong: "因為其他本來就全免費。 你付的是「被看見站在這一邊」,不是解鎖功能",
  },
];

const GOLD_PERKS = [
  { text: "BLACK 的金環 ·", strong: "一樣戴" },
  {
    text: "寫信給 Tim ·",
    strong: "本人親手回(1–3 個工作天 · 不外包 · 不是客服、不是機器人)",
  },
  { text: "撐這個撐最深的一群 ·", strong: "Tim 記得你是誰" },
];

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── HERO · 先點火(反派 + 立場)· 不提價、不提免費、不道歉 ── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 撐著它的人
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-5">
          有些地方,你贏太多就被請出去。
          <br className="hidden sm:block" />
          <span className="text-gold">這裡不是那種。</span>
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-12 max-w-lg">
          賣明牌的賣的是「依賴」—— 你永遠得回來買下一張牌:靠你輸錢賺,你贏太多就砍你帳號,
          輸了就刪文、只留贏的截圖。 我們做的剛好相反 ——{" "}
          <span className="text-bone">一個你不必回來買的引擎,一筆連輸都不刪的帳本</span>。
          這一頁,給想站在這一邊的人。
        </p>

        {/* ── 1 · 我們關上的每一道錢路(refusals · 每個「不做」是盾不是清單)── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          / 我們親手關上的每一道錢路
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-4">
          賺錢的門,我們一道一道焊死了。
        </h2>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-12 max-w-lg">
          <span className="text-bone">不放廣告。 不收創投。 不抽你下注的傭。 不賣你的資料。</span>{" "}
          每一個「不做」,都是一條別人搶著要、我們主動切斷的錢路 —— 因為只要開其中一道,
          我們遲早會變成自己最看不起的那種人:把你的注意力、你的輸贏、你的個資,
          拿去賣給出價最高的人。
        </p>

        {/* ── 2 · 免費 mic-drop(現行開場句的同一事實 · 移到這裡當引爆點 = 自我克制=高級)── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          / 那你會問:這樣你們靠什麼活?
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-4">
          對 · <span className="text-gold">幾乎全部都免費</span>。 而且是我們選的。
        </h2>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-12 max-w-lg">
          押注、跑引擎、爬天梯、把每一手賽前鎖死賽後對帳、看自己的校準、標出你哪一場
          <span className="text-bone">贏過引擎</span>,連在賽事討論室公開掛名發分析 ——{" "}
          <span className="text-bone">全部免費,永遠免費</span>。 我們大可以把「證明你準」
          鎖進付費牆,一張一張賣你 —— 賣明牌的就是這樣賺的。{" "}
          <span className="text-bone">我們選擇不</span>。 因為證明你準這件事,
          本來就不該被我們扣著當人質。
        </p>

        {/* ── 3 · 誠實的脆弱(真·loss aversion · 0 倒數/0 名額 —— 自我釘死 /integrity #05)── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          / 老實講一件不太舒服的事
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-4">
          把錢路全焊死,代價是 —— 這東西每天都在流血。
        </h2>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
          沒有廣告分潤、沒有創投輸血、沒有賭注抽成、不賣資料變現。 剩下唯一能讓這個免費引擎
          活下去的,是<span className="text-bone">出錢撐著它的人</span>。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
          撐的人不夠,結局不是漲價、也不是關站 —— 是有一天,我們被迫變成自己最討厭的那種人。
          出錢的人,就是<span className="text-gold">擋在那一天前面的牆</span>。
        </p>
        <p className="text-mute/80 text-[13px] sm:text-sm leading-relaxed mb-12 max-w-lg">
          這不是倒數計時,也沒有「剩幾個名額」—— 我們不玩那套。 這只是真話:這面牆,需要人。
        </p>

        {/* ── 4 · 邀請 + 金環(身分被「感覺到」非被解釋)· 既有金環預覽卡接在這拍 ── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          / 你付的錢,買的不是功能
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-4">
          你買的是一件事:<span className="text-gold">讓陌生人也能永遠免費用下去</span>。
        </h2>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
          再說一次,因為這是整件事的核心:付費<span className="text-bone">不解鎖任何東西</span>。
          準是免費的、對帳是免費的、連你贏過引擎都是免費標出來的。 升級不會多給你一點準度。
        </p>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
          升級給你的,是一圈<span className="text-gold">金環</span>。 在一個人人曬連勝、輸了就刪文的地方,
          你戴的這圈金環只說一件事:「<span className="text-bone">這個人出錢,讓陌生人也能免費用這個引擎</span>。」
          它買不到準度(那個用賺的)· 造不了假(你是真的轉了錢)· 所有人都看得到。
          在這裡,你不是顧客 —— 你是撐著它活下去的人。
        </p>
        {/* 金環具象化:公開戰績頁長相(Avatar supporter ring) */}
        <div className="border border-gold/30 bg-gold/5 p-5 sm:p-6 max-w-md mb-12">
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
              準度、贏過引擎、校準 —— 這些<span className="text-bone">免費就有</span>。
              金環不證明你準,它證明你「撐著這個」。
            </p>
          </div>
          <p className="mt-3 pt-3 border-t border-line/40 text-mute text-[12px] leading-relaxed">
            這份帳本敢把<span className="text-bone">輸的</span>也留著 · 賣明牌的攤不出來。{" "}
            <Link
              href="/track-record"
              className="text-gold/75 hover:text-gold underline-offset-4 hover:underline transition-colors"
            >
              看我們怎麼公開每一場(連引擎自己的輸)→
            </Link>
          </p>
        </div>

        {/* ── 5 · 兩種撐法(到這才出現價格 · 已先做完情感招募 → 讀起來是「會費」非「成本」)── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          / 兩種撐法 · 都不是「解鎖」,是「撐著」
        </p>
        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-3">
          撐一個月 · 或撐一整年、還直接認識做這件事的人。
        </h2>
        <p className="text-mute text-sm leading-relaxed mb-6 max-w-lg">
          兩種都給你那圈金環。 GOLD 多一件 BLACK 沒有的事:你寫信給 Tim,
          本人親手回 —— 不是客服、不是機器人,是做這整件事的人。
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
            kicker="撐最深的一群 · GOLD"
            priceLabel="2,700"
            period="365 天"
            perks={GOLD_PERKS}
            highlight
          />
        </div>

        {/* ── 6 · 信任 flex 收尾(反 dark pattern 升成自信宣言 = 降低 yes 門檻的臨門一腳)── */}
        <p className="mt-10 border-l-2 border-gold/50 pl-4 py-1 text-bone text-sm sm:text-base leading-relaxed max-w-lg">
          我們本來就<span className="text-gold">不自動扣你的錢</span>。 每 31 天 / 365 天 ·
          你得自己主動再轉一次帳,它才會續 —— 我們寧願靠你「還在乎」留你,
          也不要靠你「忘了取消」留住你。 想停,隨時停,不用寄信、不用找客服、不用解釋。
        </p>
        <p className="mt-5 text-center font-mono text-mute/65 text-[10px] tracking-[0.18em] leading-relaxed">
          點「立即升級」會<span className="text-mute">直接顯示轉帳帳號</span> → 轉完一鍵通知 →
          Tim 確認入帳後幫你開通。 手動轉帳 · 不自動續扣 · 14 天無條件退款。
          <br className="hidden sm:block" />
          <span className="text-mute">準是免費的 —— 撐著它,是金環。</span>{" "}
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
