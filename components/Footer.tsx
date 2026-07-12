import Link from "next/link";
import { PRODUCT_VERSION } from "@/lib/build-meta";

// ── Footer · R255 大刀闊斧(Tim 第 7+ 次「還是超多 · 國小生想逛 · 極簡再極簡」)──
// 之前 3 欄分組 + 英文標頭 + 每條長描述 = 一面字牆 = Tim 每天看到、最煩的東西。
// 收成「一排短字」:5 個最常用的去處 + 法律 + 版本。 沒有分組、沒有副標、沒有形容詞。
// 被拿掉的頁(脈動/開盤/校準/認錯/關於)全留 · Nav + 內文 + 快搜 + 直打網址到得了。
function getTaipeiTodayChip(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

// R258 · 去重(Tim「上面下面這麼多重複的頁面 · 可以不要重複?」)+ 13 站 IA 研究:
//  footer 不該是頂 Nav 的弱化複本。 砍掉跟 Nav 重複的兩條 —— 「比賽」(Nav 已有「賽事」· 同
//  目的地還用不同字)與「登入」(Nav 右上已有常駐按鈕)。 footer 只留 Nav 沒有的次要去處
//  (今晚這桌 / 公開戰績 / 會員)+ 法律 + 版本 = 跟頂部零重複。
// 公開戰績依 Tim 拍板(2026-07-13「不主打」)從 footer 退場 —— 頁面不刪:
// /brief 底線小字 + sitemap + 內文連結仍可達(保固書收進抽屜,不是撕掉)。
const PRIMARY_LINKS = [
  { label: "戰報", href: "/brief" },
  { label: "今晚這桌", href: "/table" },
  { label: "會員", href: "/membership" },
];

const LEGAL_LINKS = [
  { label: "隱私", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
  { label: "量力而為", href: "/ethics" },
];

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="mt-auto border-t border-line/40 scroll-mt-4"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 sm:py-10 flex flex-col items-center gap-5 text-center">
        {/* 回報問題 · 每頁都在 · 任何人(含沒登入的)都能一句話告訴站長哪裡有 bug。
            獨立一顆金框 chip · 比下方普通連結醒目一級(Tim:要顯眼)。 */}
        <Link
          href="/feedback"
          className="inline-flex items-center gap-2 font-mono text-gold/90 hover:text-gold text-[11px] tracking-[0.25em] border border-gold/35 hover:border-gold/70 px-4 py-2 transition-colors"
        >
          發現問題?回報一下 →
        </Link>

        {/* 一排短字 · 最常用的去處 */}
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-bone/80 hover:text-gold text-xs tracking-[0.2em] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 法律 · 小字一排 */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1">
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

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            不追蹤你 · 0 廣告
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-mute/70">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
            <span className="text-gold">ZONE</span> 27 © 2026 · by Tim · {PRODUCT_VERSION} ·{" "}
            {getTaipeiTodayChip()} TPE
          </span>
        </div>
      </div>
    </footer>
  );
}
