import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MembershipUpgrade from "@/components/MembershipUpgrade";

export const metadata: Metadata = {
  title: "升級會員",
  description:
    "升級解鎖「標價賣你的分析賺錢」。BLACK NT$ 500/31 天(你拿 90%)· GOLD NT$ 2,700/365 天(你拿 95%,全站最低抽成)· 點一下直接顯示轉帳帳號 · 不自動續扣 · 14 天退款。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R187 · Tim canary 重做)──────
// Tim 實測連環開火:① 點「立即升級」開 mailto 去「要」帳號 = 跟之前一樣慢蠢
//   → 改成點一下直接秀轉帳帳號(MembershipUpgrade · 同 WalletPanel)。
// ② 內容看不懂、不吸引人 → 重寫成「升級 = 賣分析賺錢 + 稀有身分」。
// ③「一般付費會員」這詞讓黑卡顯得廉價 → 換成有身分感的 kicker。
// ④ 不要月費/年費 → 寫「每 31 天 / 每 365 天」。
// ⑤ 拿掉「前 270 / 263 待領」倒數 → 太複雜一頭霧水(稀有感改用「最高階·GOLD 會員」)。
// ⚠ 站上其他地方(頂部 7/270 條 ScarcityStrip · /founders 深頁)還有 270 字樣 ·
//   那是更大的品牌決定 · 待 Tim 確認後一起掃。
// ─────────────────────────────────────────────────────

const BLACK_PERKS = [
  { text: "標價賣你的分析 · 你拿", strong: "90%" },
  { text: "賽事討論室發言" },
  { text: "「✓ 驗證準度」徽章(連輸都算 · 不可造假)" },
];

const GOLD_PERKS = [
  { text: "BLACK 全部功能 · 你拿", strong: "95%（全站最低抽成）" },
  { text: "引擎新版搶先試 + 投票權" },
  { text: "GOLD 會員 · 賣分析賺最多的人" },
];

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 升級會員
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-3">
          升級 · 把你的準度<span className="text-gold">變成身分</span>
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
          引擎永遠免費。升級不是買功能 —— 是把你<span className="text-bone">誠實累積的準度</span>
          變成一個夠稀有的身分(順帶解鎖把分析標價賣 · 你拿 90–95%)。
        </p>
        {/* 任務型支持框架(Substack 最高信任轉換語)· 對誠實品牌:付費 = 養著那本刪不掉的帳本 */}
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
          你的訂閱養著這個地方 —— 讓<span className="text-bone">引擎永遠免費</span>、讓
          <span className="text-bone">贏和輸的帳本永遠刪不掉</span>。
        </p>

        {/* 兩張卡 · 點「立即升級」直接秀轉帳帳號(不再 email 去要)*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MembershipUpgrade
            name="BLACK"
            kicker="進場 · 黑卡會員"
            priceLabel="500"
            period="31 天"
            perks={BLACK_PERKS}
          />
          <MembershipUpgrade
            name="GOLD"
            kicker="最高階 · GOLD 會員"
            priceLabel="2,700"
            period="365 天"
            perks={GOLD_PERKS}
            highlight
          />
        </div>

        {/* 最底下一行 · 不擋買 · 誠實說明手動轉帳 */}
        <p className="mt-6 text-center font-mono text-mute/65 text-[10px] tracking-[0.18em] leading-relaxed">
          引擎永遠免費 · 不自動續扣 · 14 天退款 · 隨時可停。
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
