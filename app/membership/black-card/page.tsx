import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";

export const metadata: Metadata = {
  title: "BLACK CARD · UI Preview · ZONE 27",
  description:
    "ZONE 27 BLACK CARD 訂閱會員 UI preview · 預計 2026 Q3 上線 · NT$ 499/月 · 信用卡定期定額自動扣款 · 5% 創作者抽成 · 14 天無條件退款 · pre-launch mockup state · payment infrastructure ready 後正式上線。",
};

// ── ZONE 27 · /membership/black-card ───────────────────
// Round 31 W-X3 · Tim 「能 fluently 看 BLACK CARD 長相」 enabler 之前
// 不存在 BLACK CARD dedicated UI preview · 只在 /membership 4-tier
// ladder 中 1 張 card 帶過。 visitor 想付費前需要看 product 長相。
//
// Pre-launch state:
//   - 整 page UI mockup · 不可實際訂閱(payment infra 還沒接)
//   - 「PRE-LAUNCH · UI MOCKUP」 status badge honest 標
//   - 「想 Q3 第一時間通知」 → /login email · 同 W-V1 / W-W1 pattern
//
// brand IP fits:
//   - Stratechery / Substack PRE-LAUNCH preview pattern(public showcase
//     of future product · build trust + scarcity)
//   - 「方法公開」 延伸:UI 公開 · code 開源 · 跟 /audit pattern 一致
//   - 0 cookie / 0 PII / 純 informational
//
// Wires:
//   - /membership BLACK CARD card 「Q3 通知我 · 先免費註冊」 CTA(已 W-M)
//     可加 「→ 看 BLACK CARD UI preview」 link
//   - /founders 跳到 此 page 做 4-tier cross-comparison
//   - Cmd-K palette 加 entry
// ─────────────────────────────────────────────────────

export const revalidate = 86400;

const UNLOCKS = [
  {
    icon: "💬",
    title: "賽事討論室發言 / 分享預測",
    body: "BLACK CARD 之上會員可在 /matches/[gameId] 頁面發言 / 推薦 / 分享預測。 球迷 grammar 「明牌」 native 詞 · 不導向莊家 · 不抽下注佣金(per /membership #pick-vs-bet)。",
  },
  {
    icon: "💵",
    title: "創作者抽成 5%",
    body: "BLACK CARD 訂閱者自己 publish 內容 · ZONE 27 抽 5%(vs Taiwan LINE 老師 / 投顧老師生態 30-50% 業界共識是降維打擊)。 Founders 27 永遠 0% 創作者抽成。",
  },
  {
    icon: "🗳️",
    title: "每月 voting 影響引擎迭代方向",
    body: "Tim 每月 publish 「下個月想 ship 什麼」 3 個 options · BLACK CARD 訂閱者 vote · 結果公開。 IKEA Effect(您 voting → 您的引擎)+ brand IP「方法公開」延伸到 product roadmap。",
  },
  {
    icon: "📓",
    title: "每週 Tim 工程筆記 full 版",
    body: "Tim 每週寫 1 篇「本週寫什麼 / 為什麼這樣寫 / 下週要 ship 什麼」 · 公開版 truncated 在 /now · BLACK CARD 拿 full 版 · Stratechery 模式。",
  },
  {
    icon: "🔓",
    title: "Founders 27 LINE 群 access",
    body: "Founders 27 創始會員 LINE 群 access(read-only) · BLACK CARD 可看 7 forged founders 互動 + Tim 親自答 · 真實 founders Q3 onboard 後 active。",
  },
];

const FAQS = [
  {
    q: "現在可以訂閱嗎?",
    a: "尚未 · 預計 2026 Q3 上線。 想 Q3 第一時間通知 → 註冊 FREE TIER · 我 publish 開放當天 send email。",
  },
  {
    q: "如何取消訂閱?",
    a: "上線後 · 任何時候 /member dashboard 一鍵取消 · 立刻停止下月扣款 · 已扣本月不退(per 一般 SaaS · 14 天試用首次訂閱例外)。",
  },
  {
    q: "14 天無條件退款?",
    a: "首次訂閱 14 天內 100% 退款 · 不問理由。 此後每月新扣款不適用(因為您每月選擇繼續或取消)。",
  },
  {
    q: "信用卡資料安全?",
    a: "0 信用卡資訊在 ZONE 27 server。 透過 payment gateway(綠界 / 藍新 / TapPay 之一 · Q3 上線前 Tim 拍板選哪個)token 處理。 我們 store user_metadata.subscription_id 不存卡號。",
  },
  {
    q: "為什麼要付費?",
    a: "您完全可以不付 · FREE TIER 5 unlocks 已涵蓋 80% 核心功能。 BLACK CARD 是想 support engine iteration + 加入 voting 流程 + 拿 Tim 工程筆記 full 版的會員。 brand IP 不催 · 不 dark pattern · 不藏 cancel button。",
  },
];

export default function BlackCardPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / BLACK CARD · 訂閱會員
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-loss/40 text-loss/80 shimmer"
              title="UI Preview only · 實際訂閱機制 + payment infrastructure 2026 Q3 上線"
            >
              PRE-LAUNCH · UI MOCKUP
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            BLACK CARD ·{" "}
            <span className="text-gold">NT$ 499 / 月</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            ZONE 27 訂閱會員 · 信用卡定期定額自動扣款 · 14 天無條件退款 ·
            隨時可取消 · 5% 創作者抽成(vs 業界平台 30-50% 是降維打擊)。
            預計 2026 Q3 上線 · 此頁是 UI preview · 不可實際訂閱。
          </p>
          <p className="mt-4 font-mono text-mute/85 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
            想 Q3 開放第一時間通知 → 註冊 FREE TIER · 我會 publish 開放當天
            send email。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={4} />
          </div>
          <div className="mt-3">
            <EngineStamp />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              → Q3 開放通知 · FREE TIER 註冊
            </Link>
            <Link
              href="/membership"
              className="inline-block px-5 py-2.5 border border-gold/40 text-gold hover:bg-gold/5 font-mono text-xs tracking-[0.3em] transition-colors"
            >
              ← 看 4-tier 全 ladder
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-12">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* ── 5 UNLOCKS ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 5 UNLOCKS · 您拿什麼
          </p>
          <div className="space-y-6">
            {UNLOCKS.map((u) => (
              <article
                key={u.title}
                className="bg-slate/40 border border-line/60 p-5 sm:p-6"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    aria-hidden="true"
                    className="text-2xl text-gold/90 leading-none"
                  >
                    {u.icon}
                  </span>
                  <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight">
                    {u.title}
                  </h3>
                </div>
                <p className="text-mute text-sm leading-relaxed">{u.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── PAYMENT FLOW MOCKUP ──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / PAYMENT FLOW · MOCKUP(disabled · 2026 Q3 啟用)
          </p>
          <div className="bg-slate/30 border-2 border-dashed border-loss/30 p-6 sm:p-8 opacity-70">
            <p className="font-mono text-loss/80 text-[10px] tracking-[0.35em] mb-4 text-center">
              ⚠ MOCKUP · 此 form 不可實際提交 · payment infra 2026 Q3 上線
            </p>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                  EMAIL · 訂閱 email
                </label>
                <input
                  type="email"
                  disabled
                  placeholder="您 FREE TIER 註冊 email · 自動 prefilled"
                  className="w-full bg-navy/40 border border-line/60 px-3 py-2 text-mute/60 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                  信用卡 · 由 payment gateway 處理 · 0 卡號 in ZONE 27 server
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="•••• •••• •••• ••••(payment iframe)"
                  className="w-full bg-navy/40 border border-line/60 px-3 py-2 text-mute/60 text-sm cursor-not-allowed font-mono tabular"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                    MM / YY
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="MM / YY"
                    className="w-full bg-navy/40 border border-line/60 px-3 py-2 text-mute/60 text-sm cursor-not-allowed font-mono tabular"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="•••"
                    className="w-full bg-navy/40 border border-line/60 px-3 py-2 text-mute/60 text-sm cursor-not-allowed font-mono tabular"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled
                className="w-full bg-mute/30 text-mute py-3 font-mono text-xs tracking-[0.3em] cursor-not-allowed"
              >
                → 訂閱 NT$ 499 / 月(MOCKUP · disabled)
              </button>
              <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] text-center leading-relaxed">
                首月 14 天無條件退款 · 隨時可取消 · 每月扣款前 3 天 email 提醒
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / FAQ · 5 個常問
          </p>
          <div className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.q} className="border-l-2 border-gold/30 pl-5 sm:pl-6">
                <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
                  Q · {f.q}
                </p>
                <p className="text-mute text-sm leading-relaxed">A · {f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CROSS LINK · 4-TIER LADDER ────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12 text-center">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4"
          >
            / 4-TIER LADDER
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6 max-w-xl mx-auto">
            BLACK CARD 在 ZONE 27 4-tier 會員 ladder 中位處第 3 階 ·
            上有 Founders 27(限量 270 終身)· 下有 FREE TIER(永久免費)。
            完整對照在 /membership。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/membership"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /membership 4-tier ladder
            </Link>
            <Link
              href="/founders"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              Founders 27 詳情 →
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            BLACK CARD 是 ZONE 27 主要 recurring revenue model · NT$ 499/月 ·
            支援 engine iteration + 給訂閱者投 voting 影響下個 ship · 拿 Tim
            每週工程筆記 full 版。 5% 創作者抽成 vs 業界 30-50% 是降維打擊 ·
            per /membership #pick-vs-bet brand boundary 明確「球迷 share 預測」
            · NOT 博彩。
          </p>
          <p>
            這頁今天是 UI mockup · payment infrastructure 還沒接 · 2026 Q3
            上線 · 想 Q3 第一時間通知 → /login 免費 30 秒註冊 FREE TIER ·
            我 publish 開放當天 send email。 不催 · 不 dark pattern · 不藏
            cancel button。 brand IP「不靠秘密賺錢 · 靠紀律」 延伸到訂閱模式。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/membership/black-card" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/membership"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回 4-tier ladder /membership
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
