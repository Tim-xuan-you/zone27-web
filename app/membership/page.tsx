import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FOUNDERS_REMAINING } from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "升級會員",
  description:
    "升級解鎖「標價賣你的分析賺錢」。BLACK CARD NT$ 500/月(你拿 90%)· Founders 27 NT$ 2,700/年(你拿 95% + 創始編號)· 手動轉帳 · 0 自動續扣 · 14 天退款。",
};

export const revalidate = 3600;

// ── ZONE 27 · /membership · 升級頁(R184 W2 · Apple 式買頁)──────
// Tim 連兩次 canary(免費會員 · mobile):「還是很複雜!完全看不懂!也不想看!
// 我到底要怎麼升級?用戶想花錢也不讓花?可以極簡?讓用戶不用動腦就能花錢?
// 參考 Apple」。 上一版還是「先一大段說明文才看到按鈕」= 不夠 Apple。
//
// Apple 買頁鐵律:看到東西 → 價格 → 一個大 Buy 鈕,不囉嗦。 這版:
//   標題 1 行 → 兩張卡(價格 + 3 個勾 + 大「立即升級」鈕)→ 完。
//   「立即升級」= 一鍵開好預填 email(手動轉帳 v1 · 最低摩擦)。
//   說明文(引擎免費/0 自動續扣)降成最底下一行 footnote · 不擋買。
// ⚠ 真正「點一下刷卡就付完」(Apple 級)要接金流(TIER 2 花錢)· 見對話。
// ─────────────────────────────────────────────────────

// 一鍵升級 = 預填 email 給 Tim(手動轉帳 · 同會員模式 · 0 自動續扣)
const BLACK_UPGRADE =
  "mailto:tatayngiti@gmail.com?subject=%E6%88%91%E8%A6%81%E5%8D%87%E7%B4%9A%20BLACK%20CARD%20%C2%B7%20NT%24%20500%2F%E6%9C%88&body=Tim%20%E5%A5%BD%2C%0A%0A%E6%88%91%E8%A6%81%E5%8D%87%E7%B4%9A%20BLACK%20CARD(NT%24%20500%20%2F%2031%20%E5%A4%A9)%E3%80%82%0A%E8%AB%8B%E7%B5%A6%E6%88%91%E9%8A%80%E8%A1%8C%E8%BD%89%E5%B8%B3%E5%B8%B3%E8%99%9F%20%2B%20%E9%96%8B%E9%80%9A%E8%AA%AA%E6%98%8E%E3%80%82%0A%E5%B7%B2%E7%9F%A5%E6%82%89%200%20%E8%87%AA%E5%8B%95%E7%BA%8C%E6%89%A3%20%C2%B7%2014%20%E5%A4%A9%E9%80%80%E6%AC%BE%E3%80%82%0A%0A%E8%AC%9D%E8%AC%9D%E3%80%82";
const FOUNDER_UPGRADE =
  "mailto:tatayngiti@gmail.com?subject=%E6%88%91%E8%A6%81%E5%8D%87%E7%B4%9A%20Founders%2027%20%C2%B7%20NT%24%202%2C700%2F%E5%B9%B4&body=Tim%20%E5%A5%BD%2C%0A%0A%E6%88%91%E8%A6%81%E5%8D%87%E7%B4%9A%20Founders%2027(NT%24%202%2C700%20%2F%20365%20%E5%A4%A9%20%C2%B7%20%E5%90%AB%E5%89%B5%E5%A7%8B%E7%B7%A8%E8%99%9F)%E3%80%82%0A%E8%AB%8B%E7%B5%A6%E6%88%91%E9%8A%80%E8%A1%8C%E8%BD%89%E5%B8%B3%E5%B8%B3%E8%99%9F%20%2B%20%E9%96%8B%E9%80%9A%E8%AA%AA%E6%98%8E%E3%80%82%0A%E5%B7%B2%E7%9F%A5%E6%82%89%200%20%E8%87%AA%E5%8B%95%E7%BA%8C%E6%89%A3%20%C2%B7%2014%20%E5%A4%A9%E9%80%80%E6%AC%BE%E3%80%82%0A%0A%E8%AC%9D%E8%AC%9D%E3%80%82";

export default function MembershipPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="membership" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 升級會員
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-8">
          升級 · 解鎖<span className="text-gold">賣分析賺錢</span>
        </h1>

        {/* 兩張卡 · 價格 + 3 勾 + 大 Buy 鈕(Apple 式)*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BLACK CARD */}
          <article className="flex flex-col border border-line/60 bg-slate/30 p-6">
            <p className="font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
              一般付費會員
            </p>
            <h2 className="text-xl text-bone font-light tracking-tight mb-3">
              BLACK CARD
            </h2>
            <p className="font-mono text-bone tabular text-3xl font-light leading-none mb-5">
              NT$ 500
              <span className="text-base text-mute ml-1">/月</span>
            </p>
            <ul className="space-y-2 mb-6 text-sm leading-relaxed flex-grow list-none pl-0">
              <Check>標價賣你的分析 · 你拿 <span className="text-gold">90%</span></Check>
              <Check>賽事討論室發言</Check>
              <Check>「✓ 驗證準度」徽章</Check>
            </ul>
            <a
              href={BLACK_UPGRADE}
              className="mt-auto block text-center px-4 py-3.5 border border-gold/60 text-gold font-mono text-sm tracking-[0.3em] hover:bg-gold/10 hover:border-gold transition-colors"
            >
              立即升級 →
            </a>
          </article>

          {/* FOUNDERS 27 · highlight */}
          <article className="flex flex-col border border-gold/60 bg-gold/5 glow-soft p-6">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-1">
              最高 tier · 年費
            </p>
            <h2 className="text-xl text-gold font-light tracking-tight mb-3">
              FOUNDERS 27
            </h2>
            <p className="font-mono text-gold tabular text-3xl font-light leading-none mb-5">
              NT$ 2,700
              <span className="text-base text-mute ml-1">/年</span>
            </p>
            <ul className="space-y-2 mb-6 text-sm leading-relaxed flex-grow list-none pl-0">
              <Check gold>BLACK CARD 全部 · 你拿 <span className="text-gold">95%</span></Check>
              <Check gold>
                前 270 創始編號(<span className="tabular">{FOUNDERS_REMAINING}</span> 待領)
              </Check>
              <Check gold>引擎新版搶先試 + 投票</Check>
            </ul>
            <a
              href={FOUNDER_UPGRADE}
              className="mt-auto block text-center px-4 py-3.5 bg-gold text-navy font-mono text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              立即升級 →
            </a>
          </article>
        </div>

        {/* 最底下一行 · 不擋買 · 誠實說明手動轉帳 */}
        <p className="mt-6 text-center font-mono text-mute/65 text-[10px] tracking-[0.18em] leading-relaxed">
          引擎永遠免費 · 0 自動續扣 · 14 天退款 · 隨時可停。
          <br className="hidden sm:block" />
          點「立即升級」= 寄一封預填好的信給 Tim → 他給你轉帳帳號 → 轉帳後幫你開通。{" "}
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

function Check({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-2">
      <span
        aria-hidden="true"
        className={`text-[11px] shrink-0 ${gold ? "text-gold" : "text-gold/70"}`}
      >
        ✓
      </span>
      <span className="flex-1 text-bone/90">{children}</span>
    </li>
  );
}
