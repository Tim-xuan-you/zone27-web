import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getMatchById, getCalibration } from "@/lib/matches";

export const metadata: Metadata = {
  title: "/poster · Launch-Day Visual Cannon · ZONE 27",
  description:
    "Patek 50th Nautilus packaging + Stripe Press hardcover + A24 zine box-set + Defector Year-Five annual report · ZONE 27 launch-day standalone visual artifact · 1080×1080(IG)+ 1080×1920(Story/TikTok)dual aspect · 冷金/骨白 palette + cpbl-260521-01 PROVED stat + Tim signature · screenshot-as-brand · screenshot-friendly。 不在 sitemap · 不在 Cmd-K · launch-day cannon ready。",
  // Per AGENTS.md SEO freeze · noindex this page until launch
  robots: {
    index: false,
    follow: false,
  },
};

// ── ZONE 27 · /poster · Launch-Day Visual Cannon ───────
// R76 W-E · Agent A R75 「第 2 gap」 honest answer · Patek Philippe 50th
// Anniversary Nautilus cork-clad presentation packaging(2026)+ Stripe Press
// hardcover-only philosophy + A24 zine #01-12 box-set chipboard + Defector
// Year-Five annual report PDF artifact · ZONE 27 had OG cards(per-page)but
// 0 standalone visual asset 「screenshot-as-brand」 outlasting launch week。
//
// The cognitive frame this closes(per Agent A R75 「第 2 gap」 spec):
//   - Eventually-public launch needs 1 visual cannon · 1080×1080(IG)+
//     1080×1920(Story/TikTok)standalone · 冷金/骨白 palette · 1 PROVED stat
//     · Tim signature · designed to live as screenshot beyond launch week
//   - Building NOW in stealth = already old craft by launch-day · per Tim
//     「全權交給您 + 攻頂 + 我們這遊戲可是要攻頂」 mandate
//   - Per AGENTS.md SEO/SOCIAL FREEZE · NOT in sitemap · NOT in Cmd-K palette
//     · NOT linked from public surface · Tim ships this when 他 ready
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · screenshot artifact 顯示 PROVED
//     receipt + Tim signature + engine version = same disclosure axis as
//     /audit DISCLOSURE block + /transparency aggregator
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     audience screenshot-as-share grammar · 同 Pokemon TCG 1st Edition
//     card prestige axis(R60 W-A SHADOWLESS RUN)
//   - per /audit S05 PRE-COMMIT clause · poster content 同 ENGINE_DIFF_BEACONS
//     + ENGINE_OPS_LOG · 修改 stat 顯示 需 30 天前 /changelog 公告 · append-
//     only Costly Signaling discipline
//   - per [[feedback-zone27-pratfall-brand-ip]] · poster 不藏 N=1 + PROVED
//     receipt · Aronson Pratfall axiom 物理 codify
//
// 不做 anti-pattern:
//   ✕ NO「DOWNLOAD POSTER」 button(brand IP「不打擾就是禮物」 · visitor
//     screenshots whatever they need · 不 push social share funnel)
//   ✕ NO logo / tagline animation(static · per /audit S05 disclosure parity)
//   ✕ NO「Coming Soon · join waitlist」 CTA(brand IP redline · poster is
//     launch-day visual not pre-launch hype generator)
//   ✕ NO multi-language toggle / hreflang(brand IP「audience 是 Taiwan
//     CPBL fans · not global」 · Chinese-only or zh-tw default)
//
// Inspiration sources(per Agent A R75 spec + R76 SHIP A/D research):
//   - Patek Philippe 50th Nautilus cork box(2026 · heritage in tactile object)
//   - Stripe Press hardcover-only(books.stripe.com · cultural-status object)
//   - A24 zines #01-12 box set(2mm chipboard · silver foil deboss · OOP)
//   - Defector Year-Five annual report PDF(85% renew rate · single artifact)
//   - Pokemon TCG 1st Edition Shadowless Charizard 1999 card(screenshot mythology)
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily revalidate(stat freshness)

// Pull from canonical PROVED receipt · cpbl-260521-01 first PROVED in
// /track-record · 60% engine prediction → 富邦 win 同 engine favorite ·
// PROVED ✓ verdict · per /audit DISCLOSURE block 1 PROVED N=1 honest empty。
const PROVED_RECEIPT_ID = "cpbl-260521-01";

export default function PosterPage() {
  const match = getMatchById(PROVED_RECEIPT_ID);
  const cal = match ? getCalibration(match) : null;
  const fr = match?.finalResult;

  // Defensive · should always have data per canonical PROVED receipt
  if (!match || !fr || !cal) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Nav />
        <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-20 pb-12">
          <p className="text-mute text-base">
            Poster pending · cpbl-260521-01 not yet finalized · per /audit
            S05 disclosure parity 不假裝 pre-final stat。
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const enginePct = Math.max(match.home.winRate, match.away.winRate);
  const winner = fr.winner === "home" ? match.home.name : match.away.name;
  const winnerEn = fr.winner === "home" ? match.home.en : match.away.en;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO · meta-explanation ──────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            POSTER · LAUNCH-DAY VISUAL CANNON · NOINDEX
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-snug mb-4">
            ZONE 27 standalone visual artifact ·{" "}
            <span className="text-gold">screenshot-as-brand</span>
          </h1>
          <p className="text-mute text-sm sm:text-base leading-relaxed mb-3">
            Patek Philippe 50th Nautilus cork box(2026)+ Stripe Press
            hardcover-only philosophy + A24 zine box-set + Defector Year-Five
            annual report pattern · ZONE 27 standalone visual cannon。 1080×1080
            for IG · 1080×1920 for Story/TikTok · both static SSG · 冷金/骨白
            palette + cpbl-260521-01 PROVED stat + Tim signature。
          </p>
          <p className="text-mute/70 text-xs leading-relaxed">
            ⚓ noindex · 不在 sitemap · 不在 Cmd-K · Tim 啟動 launch-day
            cannon 時親手 share · 不靠 SEO discovery · per AGENTS.md
            SEO/SOCIAL freeze。 visitor 想 share · 直接 screenshot 下面兩個
            poster · 不 push download button(per 不打擾就是禮物 axiom)。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── POSTER 1 · 1080×1080 SQUARE(IG)─────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / POSTER 01 · 1080×1080 · INSTAGRAM SQUARE
          </p>
          <div className="aspect-square w-full max-w-[540px] mx-auto bg-navy border border-gold/40 relative overflow-hidden">
            {/* Radial gradient · matches body bg per globals.css */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 175, 55, 0.12), transparent 60%)",
              }}
            />

            <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-10">
              {/* TOP · Brand wordmark */}
              <div>
                <p
                  lang="en"
                  className="font-mono text-gold tracking-[0.5em] text-xs sm:text-sm"
                >
                  ZONE · 27
                </p>
                <p className="font-mono text-mute text-[10px] tracking-[0.35em] mt-2 tabular">
                  TAIWAN CPBL · QUANTITATIVE ENGINE · v0.2
                </p>
              </div>

              {/* MIDDLE · Hero stat · cpbl-260521-01 PROVED */}
              <div className="text-center">
                <p
                  lang="en"
                  className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3"
                >
                  ★ FIRST PROVED RECEIPT
                </p>
                <p className="font-mono text-bone tabular text-5xl sm:text-6xl font-light tracking-tight leading-none mb-2">
                  {enginePct}%
                </p>
                <p className="text-bone text-sm leading-snug">
                  ENGINE → <span className="text-gold">{winner} 勝</span>
                </p>
                <p className="font-mono text-mute text-[10px] tracking-[0.3em] mt-3 tabular">
                  ACTUAL · {fr.homeScore}:{fr.awayScore} · {winnerEn} W
                </p>
                <p
                  lang="en"
                  className="font-mono text-gold text-xs tracking-[0.4em] mt-4 font-medium"
                >
                  ✓ PROVED · 言中
                </p>
              </div>

              {/* BOTTOM · Tim signature + URL */}
              <div className="flex items-baseline justify-between gap-3 flex-wrap pt-4 border-t border-line/40">
                <p className="font-mono text-mute text-[10px] tracking-[0.3em]">
                  — TIM · ZONE 27 FOUNDER
                </p>
                <p
                  lang="en"
                  className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                >
                  zone27-web.vercel.app
                </p>
              </div>
            </div>
          </div>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] text-center mt-3">
            ⚓ Screenshot this card · 1080×1080 IG-ready · 不 download button ·
            per /privacy 0-tracker promise
          </p>
        </section>

        {/* ── POSTER 2 · 1080×1920 STORY/TIKTOK ─── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / POSTER 02 · 1080×1920 · IG STORY · TIKTOK · YOUTUBE SHORTS
          </p>
          <div className="aspect-[9/16] w-full max-w-[360px] mx-auto bg-navy border border-gold/40 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(212, 175, 55, 0.12), transparent 60%)",
              }}
            />

            <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-10">
              {/* TOP · Brand wordmark · bigger for story */}
              <div className="pt-8">
                <p
                  lang="en"
                  className="font-mono text-gold tracking-[0.6em] text-base sm:text-lg"
                >
                  ZONE · 27
                </p>
                <p className="font-mono text-mute text-xs tracking-[0.4em] mt-3 tabular leading-relaxed">
                  TAIWAN CPBL
                  <br />
                  QUANTITATIVE ENGINE
                  <br />
                  v0.2
                </p>
              </div>

              {/* MIDDLE · Hero stat · centered larger */}
              <div className="text-center">
                <p
                  lang="en"
                  className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
                >
                  ★ FIRST PROVED RECEIPT
                </p>
                <p className="font-mono text-bone tabular text-7xl sm:text-8xl font-light tracking-tight leading-none mb-3">
                  {enginePct}%
                </p>
                <p className="text-bone text-base leading-snug mb-2">
                  ENGINE → <span className="text-gold">{winner} 勝</span>
                </p>
                <p className="font-mono text-mute text-[11px] tracking-[0.3em] mt-3 tabular">
                  ACTUAL · {fr.homeScore}:{fr.awayScore} · {winnerEn} W
                </p>
                <p
                  lang="en"
                  className="font-mono text-gold text-sm tracking-[0.4em] mt-5 font-medium"
                >
                  ✓ PROVED · 言中
                </p>
              </div>

              {/* MID-DETAIL · differentiator tagline */}
              <div className="text-center px-3">
                <p className="text-mute/85 text-sm leading-relaxed font-light">
                  「方法公開
                  <br />
                  品味私藏」
                </p>
                <p
                  lang="en"
                  className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mt-2 tabular"
                >
                  SHOW YOUR WORK · KEEP YOUR SOUL
                </p>
              </div>

              {/* BOTTOM · Tim signature + URL */}
              <div className="pb-4 border-t border-line/40 pt-4 flex flex-col items-center gap-2">
                <p className="font-mono text-mute text-[10px] tracking-[0.3em]">
                  — TIM · ZONE 27 FOUNDER
                </p>
                <p
                  lang="en"
                  className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                >
                  zone27-web.vercel.app
                </p>
              </div>
            </div>
          </div>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] text-center mt-3">
            ⚓ Screenshot this card · 1080×1920 Story/TikTok-ready · 不
            download button · per /privacy 0-tracker promise
          </p>
        </section>

        {/* ── HOW TO USE ────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / HOW TO USE · 4 binding rules
          </p>
          <ol className="space-y-3 text-mute text-sm leading-relaxed">
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                01
              </span>
              <span className="flex-1">
                <strong className="text-bone">Screenshot 即用</strong> · 直接
                long-press / 截圖 · 不 download button · 不發 push 提醒「您
                share 了 N 次」 · per /privacy 0-tracker promise。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                02
              </span>
              <span className="flex-1">
                <strong className="text-bone">Stat 永久 binding</strong> ·
                60% engine + PROVED + cpbl-260521-01 是 physical truth · 修改
                per /audit S05 PRE-COMMIT 30-day notice · 違反 = brand 信用
                collapse 永久 audit trail。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                03
              </span>
              <span className="flex-1">
                <strong className="text-bone">Tim 親手 signature</strong> ·
                不 fake watermark · 不 auto-generated · 此 poster 跟 Tim
                親自 ship 的 first PROVED receipt 同 chronology binding。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                04
              </span>
              <span className="flex-1">
                <strong className="text-bone">noindex · 不在 sitemap</strong> ·
                此 page 是 launch-day cannon · Tim 親手 ship 時直接 share URL ·
                不靠 SEO discovery · 同 AGENTS.md SEO/SOCIAL freeze policy。
              </span>
            </li>
          </ol>
        </section>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href={`/receipts/${PROVED_RECEIPT_ID}`}
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /receipts/{PROVED_RECEIPT_ID} · full receipt object
            </Link>
            <Link
              href="/track-record"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /track-record · 完整 ledger →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
