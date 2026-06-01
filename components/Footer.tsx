import Link from "next/link";

// ── Footer · R181 大砍(Tim canary 4「footer 亂七八糟 · 有人要看這一堆東西?」)──
// 砍掉:中英雙語重複(FUNDED BY FOUNDERS…)· 錯誤宣稱「不收下注佣 · NO
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

const FOOTER_GROUPS: FooterGroup[] = [
  {
    label: "賽事 · 引擎",
    enLabel: "FOR FANS",
    links: [
      { label: "今日 CPBL 賽事", href: "/matches" },
      { label: "MLB · 即時資料", href: "/matches/mlb" },
      { label: "模擬實驗室", href: "/lab" },
      { label: "CPBL 投手排行", href: "/cpbl-pitchers" },
      { label: "海選天梯", href: "/ladder" },
      {
        label: "GitHub 開源",
        href: "https://github.com/Tim-xuan-you/zone27-web",
        external: true,
      },
    ],
  },
  {
    label: "信任文件",
    enLabel: "DOCS",
    links: [
      { label: "模型報告", href: "/audit" },
      { label: "公開戰績", href: "/track-record" },
      { label: "引擎自評", href: "/calibration" },
      { label: "永遠不變 22 件事", href: "/integrity" },
      { label: "技術白皮書", href: "/methodology" },
    ],
  },
  {
    label: "入門",
    enLabel: "ENTRY",
    links: [
      { label: "5 分鐘入門", href: "/learn" },
      { label: "關於 ZONE 27", href: "/about" },
      { label: "登入 / 註冊", href: "/login" },
      { label: "會員制", href: "/membership" },
      { label: "常見問題", href: "/faq" },
    ],
  },
  {
    label: "品牌 IP",
    enLabel: "BRAND",
    links: [
      { label: "倒置宣言", href: "/manifesto" },
      { label: "鐵律", href: "/discipline" },
      { label: "公開路線圖", href: "/roadmap" },
      { label: "版本紀錄", href: "/changelog" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "隱私政策", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
];

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="mt-auto border-t border-line/40 scroll-mt-4"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 sm:py-12">
        {/* 桌機 · 4 欄連結網格(導覽)· 手機隱藏(改用 Nav + Cmd-K) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 pb-10">
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
            <a
              href="https://github.com/Tim-xuan-you/zone27-web"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
            >
              GitHub 開源
            </a>
          </div>

          <Link
            href="/privacy"
            className="font-mono text-mute/70 hover:text-gold text-[9px] tracking-[0.3em] transition-colors"
          >
            不追蹤你 · 0 廣告 · 程式碼公開
          </Link>

          <div className="flex items-center gap-3 flex-wrap justify-center mt-1">
            <span className="font-mono text-mute/80 text-[10px] tracking-[0.22em]">
              <span className="text-gold">ZONE</span> 27 © 2026 · by Tim
            </span>
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-mute/70 hover:text-gold transition-colors"
              title="完整版本歷史 · GitHub commits"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
              v0.29 · {getTaipeiTodayChip()} TPE
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
