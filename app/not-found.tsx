import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "K · 三振 · 404",
  description:
    "這條 URL 不在 ZONE 27 的 ledger 上 — 可能是引擎還沒覆蓋、可能是 URL 已搬家、可能是手滑。三振也是統計的一部分。",
};

// ── ZONE 27 · Not-Found Page ───────────────────────────
// 訪客打錯 URL / 點到已搬家的舊連結 / 從外部 stale link 過來,
// 看到的不是 Next.js 預設 404,而是 brand-pure terminal-aesthetic
// 三振卡。"K" 在棒球記錄符號中代表三振 — 用最 ZONE-27-specific
// 的方式說「404」+ 用 K/9(引擎三大基礎指標之一)做主視覺。
//
// 設計原則(per 敢於突破 brand IP):
//   - 不裝可愛(no oops / sorry / 😢)· 不用感嘆號
//   - 用 sabermetric 符號(K · 三振)而不是通用「STRIKE THREE」棒球諺語
//   - 4 個 canonical 路徑而不只是「回首頁」
//   - Footer 自動帶上整站 trust chrome(per layout)
// ─────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main" className="flex-1">
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 sm:pt-28 pb-20 sm:pb-28 text-center">
          {/* Scoring symbol kicker · sabermetric literate */}
          <p
            lang="en"
            className="font-mono text-gold/70 text-[10px] sm:text-xs tracking-[0.45em] mb-8"
          >
            SCORING NOTATION · STRIKEOUT
          </p>

          {/* The massive "K" · gold tabular · the sabermetric symbol
              for strikeout. Real baseball scorekeepers use K (forward)
              for swinging K and ꓘ (reverse) for looking. We render
              forward — universally readable as "letter K" by anyone,
              with the sabermetric layer for those who know. */}
          <p
            className="font-mono text-gold tabular leading-none mb-4 select-none"
            style={{
              fontSize: "clamp(140px, 36vw, 320px)",
              fontWeight: 300,
              letterSpacing: "-0.04em",
              textShadow: "0 0 80px rgba(212, 175, 55, 0.3)",
            }}
            aria-hidden="true"
          >
            K
          </p>

          <p
            lang="en"
            className="font-mono text-gold/60 text-xs sm:text-sm tracking-[0.4em] mb-12"
          >
            404 · OUT OF ZONE
          </p>

          {/* Honest explanation · brand tone */}
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-snug mb-4 max-w-xl mx-auto">
            這條 URL <span className="text-gold">不在 ledger 上</span>
          </h1>
          <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-12">
            可能是引擎還沒覆蓋、可能是 URL 已搬家、可能是手滑。
            三振也是統計的一部分 — 我們不假裝它沒發生。
          </p>

          {/* Four canonical paths · brand IP entry points */}
          <div className="flex flex-wrap gap-3 justify-center mb-14">
            <Link
              href="/"
              className="px-6 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              回首頁 →
            </Link>
            <Link
              href="/lab"
              className="px-6 py-2.5 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
            >
              即時引擎 →
            </Link>
            <Link
              href="/track-record"
              className="px-6 py-2.5 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
            >
              公開戰績 →
            </Link>
            <Link
              href="/manifesto"
              className="px-6 py-2.5 border border-line/60 text-mute hover:text-gold hover:border-gold/40 text-xs tracking-[0.3em] transition-colors"
            >
              倒置宣言 →
            </Link>
          </div>

          {/* Secondary · for visitors who landed here from a stale share */}
          <div className="pt-10 border-t border-line/40 max-w-md mx-auto">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.35em] mb-4"
            >
              / IF YOU FOLLOWED A LINK
            </p>
            <p className="text-mute text-xs leading-relaxed">
              ZONE 27 每一場預測的對錯都記在{" "}
              <Link
                href="/track-record"
                className="text-gold underline-offset-4 hover:underline"
              >
                公開戰績
              </Link>
              {" "}— 連輸都掛、刪不掉。
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
