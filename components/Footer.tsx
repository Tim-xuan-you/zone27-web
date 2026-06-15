import Link from "next/link";
import { PRODUCT_VERSION } from "@/lib/build-meta";

// ── Footer · R181 大砍(Tim canary 4「footer 亂七八糟 · 有人要看這一堆東西?」)──
// 砍掉:中英雙語重複(FUNDED BY GOLD…)· 錯誤宣稱「不收下注佣 · NO
// COMMISSION」(我們其實有創作者抽傭)· ledger 繼承詩句 · 7/270 placeholder
// 計數 · LAST SHIPPED 節奏 · 雙語 tagline。 留:桌機連結網格(導覽)+ 精簡
// 底部 bar(法律 + 一句信任 + 版權 + 版本)。
function getTaipeiTodayChip(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

type FooterLink = { label: string; href: string; external?: boolean };
type FooterGroup = { label: string; enLabel: string; links: FooterLink[] };

// R194 · Tim canary「footer 雜亂無比 · 資訊轟炸 · 變成沒人要點的網站 · Apple 式極簡」。
// 從 4 欄 ~20 連結砍成 3 欄 10 連結 —— footer 不是把所有頁面倒出來,是反映用戶心裡
// 的地圖:玩(賽事/引擎)→ 信任(公開的證據)→ 帳號。 其餘深度頁(audit/methodology/
// integrity/manifesto/discipline/roadmap/learn/faq/changelog/投手排行)不刪(護城河 +
// 靠 Cmd-K 全站快搜 + 內文交叉連結到得了),只是不再 footer 轟炸。 Linear/Stripe 式。
//
// R239 · Tim canary「資訊轟炸 · 極簡再極簡 · Apple」再一刀:FOR FANS 欄又長回 7 連結
// (隨功能慢慢加上來)→ 收回 2。 砍掉的全部在別處到得了、不製造孤兒:MLB / 足球 → 頂 Nav
// 「賽事」的頁內 SportTabs(R234 已把運動切換收進去)· 模擬實驗室 → 頂 Nav「實驗室」·
// 海選天梯 / 私人預測聯盟 → Cmd-K + /member 儀表板。 footer 只留「天天會動」的兩個:
// 今日賽事 + 活動脈動。 PROOF 三個是護城河(戰績 / 校準 / 認錯)= 該被看見、不動。
const FOOTER_GROUPS: FooterGroup[] = [
  {
    label: "賽事 · 引擎",
    enLabel: "FOR FANS",
    links: [
      { label: "今日 CPBL 賽事", href: "/matches" },
      { label: "開盤 · 群眾預測市場", href: "/markets" },
      { label: "活動脈動 · 大家在押什麼", href: "/pulse" },
    ],
  },
  {
    label: "信任 · 公開",
    enLabel: "PROOF",
    links: [
      { label: "公開戰績 · 每場對錯", href: "/track-record" },
      { label: "引擎校準 · 說七成中幾成", href: "/calibration" },
      { label: "我們搞砸過的事 · 公開認錯", href: "/corrections" },
    ],
  },
  {
    label: "帳號 · 關於",
    enLabel: "ENTRY",
    links: [
      { label: "登入 / 註冊", href: "/login" },
      { label: "會員制", href: "/membership" },
      { label: "關於 ZONE 27", href: "/about" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "隱私政策", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
  { label: "量力而為", href: "/ethics" },
];

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="mt-auto border-t border-line/40 scroll-mt-4"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 sm:py-12">
        {/* 桌機 · 4 欄連結網格(導覽)· 手機隱藏(改用 Nav + Cmd-K) */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-x-8 gap-y-10 pb-10">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.enLabel}>
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-1"
              >
                {group.enLabel}
              </p>
              <p className="font-mono text-mute/80 text-[9px] tracking-[0.3em] mb-5">
                {group.label}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-mute hover:text-gold text-[11px] tracking-[0.18em] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-mono text-mute hover:text-gold text-[11px] tracking-[0.18em] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── 精簡底部 bar(法律 + 一句信任 + 版權 + 版本)── */}
        <div className="pt-6 border-t border-line/30 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/privacy"
            className="font-mono text-mute/70 hover:text-gold text-[9px] tracking-[0.3em] transition-colors"
          >
            不追蹤你 · 0 廣告
          </Link>

          <div className="flex items-center gap-3 flex-wrap justify-center mt-1">
            <span className="font-mono text-mute/80 text-[10px] tracking-[0.22em]">
              <span className="text-gold">ZONE</span> 27 © 2026 · by Tim
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-mute/70">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
              {PRODUCT_VERSION} · {getTaipeiTodayChip()} TPE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
