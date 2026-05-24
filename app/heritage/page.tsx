import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Heritage · Pre-Cast Inheritance Artifact",
  description:
    "Patek Philippe 1996「Generations」 campaign + Belk 1988 Extended Self + Weinstein & Deutschberger 1963 altercasting · 4-line negative-then-positive altercasting applied to ALL visitors not just Founders 27 buyers · pre-cast 「您只是替下一個 CPBL 球迷世代守著它」 identity vehicle · Aronson Pratfall self-selection filter · per /audit S05 PRE-COMMIT clause。",
  openGraph: {
    title: "Heritage · 替下一個 CPBL 球迷世代守 ZONE 27",
    description:
      "Patek 1996 + Belk 1988 + Weinstein 1963 altercasting · pre-cast inheritance for all visitors",
    type: "article",
    url: "/heritage",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heritage · 替下一個 CPBL 球迷世代守 ZONE 27",
    description:
      "Patek 1996 + Belk 1988 + Weinstein 1963 altercasting · pre-cast inheritance for all visitors",
  },
  alternates: {
    canonical: "/heritage",
  },
};

// /heritage · Patek 1996「Generations」 + Belk 1988 Extended Self + Weinstein
// 1963 altercasting · pre-cast inheritance for ALL visitors not just buyers ·
// distinct from /founders/inheritance(post-purchase seat transfer)。

export const revalidate = 86400; // daily revalidate

export default function HeritagePage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO · the Patek altercasting line ─────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            HERITAGE · PRE-CAST INHERITANCE · PATEK 1996 + BELK 1988 +
            WEINSTEIN 1963
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light leading-[1.15] tracking-tight text-bone"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            您不會
            <span className="text-mute/60 line-through mx-2">買</span>
            ZONE 27 ·
            <br />
            您只是替
            <span className="text-gold">下一個 CPBL 球迷世代</span>
            守著它。
          </h1>
          {/* Cold Gold Hairline · R54 W-C signature moat */}
          <div className="zone27-rule mx-auto max-w-[320px] mt-6" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-8"
          >
            ALTERCASTING WITHOUT GATEKEEPING · APPLIES TO ALL VISITORS
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 4 BELK MECHANISMS · plain prose · negative space ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-6"
          >
            / 4 BELK MECHANISMS · APPLIED TO ZONE 27 VOCABULARY
          </p>
          <ol className="space-y-6">
            <BelkMechanism
              n="01"
              mechanism="APPROPRIATION · 使用 makes 您的"
              detail={`您每跑一次 /lab Monte Carlo 模擬 · engine 在您 device 跑 10K 次 · 結果只在您 localStorage · ZONE 27 server 0 運算 · 0 PII transit。 每跑一次 = appropriate engine into your client-side state。 您不需要 buy · engine 已經是您的。`}
            />
            <BelkMechanism
              n="02"
              mechanism="CURATION · 您 read = 您 curate"
              detail={`您每次訪 /audit · /methodology · /transparency · /track-record · /letter Tim 親手 voice · 您 internalize ZONE 27 brand IP grammar · 變 your own epistemic mirror。 您 read 完 = 您 curate 完整 ZONE 27 disclosure surface。`}
            />
            <BelkMechanism
              n="03"
              mechanism="BEQUEATHAL · 傳給下一代 confirms 永久"
              detail={`即便您不買 Founders 27 seat · ZONE 27 engine MIT licensed open-source on GitHub · 您 fork 一份 = 您可以 transfer 給 next-gen CPBL fan · 不需 ZONE 27 approval · 不需 Tim 在世。 Founders 27 seat 持有者另有 /founders/inheritance 4-rule seat transfer protocol · 同 Patek 1996「look after for next generation」 grammar 物理 codify 到 seat-level + engine-level 雙層。`}
            />
            <BelkMechanism
              n="04"
              mechanism="NO-CONTAMINATION · engine 永遠不會 paywall"
              detail={`engine FREE through 2029-12-31 binding · /audit + /methodology + /track-record NEVER paywalled · Tim 失蹤 30 days → GitHub repo open-sources within 30 days BUS_FACTOR commitment。 engine 永不 contaminate by paywall · 您 use 的 engine 跟 Founders 27 holder use 的 engine 是 IDENTICAL · 只是您 identity 是 visitor · 他/她 identity 是 Founder #NNN。`}
            />
          </ol>
        </section>

        {/* ── PRATFALL FILTER · self-selection close ─── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-5"
          >
            / PRATFALL FILTER · ARONSON 1966 SELF-SELECTION
          </p>
          <p
            className="text-bone text-base sm:text-lg leading-relaxed mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            如果這 4 條對您不成立 · ZONE 27 不是給您的 · 而且{" "}
            <strong className="text-gold">
              我們同樣感謝您 read 完此 covenant
            </strong>
            。
          </p>
          <p
            className="text-mute/85 text-base leading-relaxed"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            brand IP「客戶 ≠ 朋友 · 不催」 axiom 守 · per Aronson 1966
            Pratfall self-selection filter · ZONE 27 不 sell 您 · 您
            self-select。 您不是 audience target · 您是 self-recruited
            generational steward。
          </p>
        </section>

        {/* ── DISTINCT FROM /founders/inheritance ─── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.4em] mb-4"
          >
            / DISTINCT FROM /founders/inheritance · 兩個 surface 不同
          </p>
          <p className="text-mute text-sm leading-relaxed mb-4">
            <strong className="text-bone">/heritage</strong>(此 page)·
            altercasts ALL visitors · pre-purchase pre-cast · Belk 1988
            Extended Self 4-mechanism explanation applied to ZONE 27
            vocabulary · self-selection Pratfall filter。
          </p>
          <p className="text-mute text-sm leading-relaxed mb-4">
            <strong className="text-bone">
              <Link
                href="/founders/inheritance"
                className="text-gold underline-offset-4 hover:underline"
              >
                /founders/inheritance
              </Link>
            </strong>{" "}
            · post-purchase identity vehicle · 4-rule seat transfer protocol
            for actual Founders 27 buyers · lifetime + single transfer +
            family-member-only + Tim executor · Patek 1996 generational
            grammar + Hanshin Tigers 二代目ファン pattern。
          </p>
          <p className="text-mute/85 text-sm leading-relaxed">
            兩個 surface 同 axis(Patek 1996 generational identity)·
            different mechanism · /heritage = altercast non-buyers ·
            /founders/inheritance = transfer protocol for buyers。 brand IP
            「engine FREE forever · identity PAID」 軸線 物理 codify 到 dual
            altercasting surface。
          </p>
        </section>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← Home
            </Link>
            <Link
              href="/founders"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /founders · NT$ 2,700 終身 →
            </Link>
            <Link
              href="/founders/inheritance"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /founders/inheritance · post-purchase →
            </Link>
            <Link
              href="/audit"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /audit · model report →
            </Link>
          </div>
          <p className="font-mono text-mute/65 text-[10px] tracking-[0.25em] leading-relaxed mt-8 max-w-2xl mx-auto">
            ⚓ 修改 4-mechanism explanation 需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              /changelog
            </Link>{" "}
            公告 · 同 brand IP「方法公開」 binding。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── BelkMechanism component · plain typography · negative space ──
function BelkMechanism({
  n,
  mechanism,
  detail,
}: {
  n: string;
  mechanism: string;
  detail: string;
}) {
  return (
    <li
      className="border-l-2 border-gold/40 pl-5 sm:pl-6 py-2"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <span
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {n}
        </span>
        <h3 className="text-bone text-lg font-light tracking-tight leading-snug">
          {mechanism}
        </h3>
      </div>
      <p
        className="text-mute/90 text-sm sm:text-base leading-relaxed"
        style={{ textWrap: "pretty" }}
      >
        {detail}
      </p>
    </li>
  );
}
