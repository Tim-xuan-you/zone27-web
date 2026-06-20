import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";
import { CORRECTIONS, type Correction } from "@/lib/corrections";

// ── ZONE 27 · /corrections · 我們搞砸過的事 ────────────────────────────
// 把站上原本散在三頁的「真實、已認、已修」自我糾錯,集中成一頁有靈魂的敘事。
// 「方法公開 · 品味私藏」的延伸:贏了不藏、輸了不刪、搞砸了也擺在門口。
// 與 /steelman 互補 —— steelman 是「我們可能哪裡錯」(假設),這頁是「已經錯、
// 已經認、已經修」(事實)。 素材全部已存在於 /audit §06 + /steelman #03 + /integrity
// ↻ 已修訂,0 捏造。 此頁只增不刪。 純訪客語言:不引學者、不提手法後設層。
// ─────────────────────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "我們搞砸過的事 · 公開認錯",
  description:
    "別人的網站把搞砸的事藏起來或刪掉。 ZONE 27 把自己做錯、後來自己抓到並修好的事,集中記在這一頁 —— 當初錯在哪、怎麼被發現、哪天修的,都寫清楚,只增不刪。",
  ogTitle: "我們搞砸過的事 —— 公開認錯、不刪",
  ogDescription:
    "贏了晒單、輸了刪文是別人的玩法。 我們把自己搞砸過、後來修好的事做成一頁,永遠掛著。",
  path: "/corrections",
});

export const revalidate = 86400; // daily revalidate

const SIGNED_AT = "2026-06-14";

export default function CorrectionsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            CORRECTIONS · 我們搞砸過的事
          </p>
          <h1
            className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            我們<span className="text-gold">搞砸過</span>的事
          </h1>
          {/* Cold Gold Hairline · 品牌記號 */}
          <div className="zone27-rule max-w-[280px] mb-6" aria-hidden="true" />
          <p className="font-mono text-mute text-xs tracking-[0.3em] tabular mb-6">
            目前公開 {CORRECTIONS.length} 件 · 只增不刪 · 連到原始紀錄
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4 zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            別人的網站把搞砸的事藏在最深處,或乾脆刪掉。 我們把自己做錯、
            後來自己抓到並修好的事,集中記在這一頁。 每一筆都寫清楚:
            <strong className="text-bone">當初錯在哪 → 怎麼被發現 → 哪天修的 → 連到站上原始紀錄。</strong>
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這不是行銷話術。 一個靠賣明牌賺錢的人,絕不會做一頁專門列自己搞砸過什麼 ——
            這正是我們敢做的原因。
          </p>
          <div className="mt-5">
            <ArticleMeta readingMin={4} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 糾錯清單 ─────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <ol className="space-y-10">
            {CORRECTIONS.map((c) => (
              <CorrectionEntry key={c.no} c={c} />
            ))}
          </ol>
        </section>

        {/* ── 為什麼集中放一頁 ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / 為什麼把錯誤集中放一頁
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4 zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            把搞砸的事集中、主動擺在門口,比散在各處更難,也更難假裝。 賣明牌的人贏了晒單、
            輸了刪文;我們把輸的、錯的,做成一頁永遠掛著。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這一頁講「我們<strong className="text-bone">已經</strong>錯過、已經認、已經修」——
            發生過的事實,不是可能哪裡錯的假設。 一本只增不刪的帳本。
          </p>
        </section>

        {/* ── 只增不刪 pre-commit ──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / 這頁只增不刪
          </p>
          <p className="text-mute text-sm leading-relaxed mb-3">
            未來每一個被我們自己、或被你抓到的真錯,都會進這頁,連到當時的原始紀錄。
            不挑好聽的留、不悄悄拿掉難看的。
          </p>
          <p className="text-mute/85 text-sm leading-relaxed">
            如果哪天你發現一個我們沒列上來的錯 —— email{" "}
            <a
              href="mailto:tatayngiti@gmail.com"
              className="text-gold underline-offset-4 hover:underline"
            >
              tatayngiti@gmail.com
            </a>{" "}
            告訴我們,我們補上。
          </p>
        </section>

        <FounderSignOff signedAt={SIGNED_AT}>
          <p>
            我不喜歡公開自己搞砸的事 —— 沒有人喜歡。 但一個叫別人「相信數據、別信感覺」的品牌,
            如果連自己的錯都藏,那它要的信任就是假的。
          </p>
          <p>
            這頁上的每一筆,都是我們自己用站時抓到、然後修掉的。 它只會變長,不會變短。
            這就是「方法公開 · 品味私藏」裡,「方法公開」那四個字最不舒服、也最該做的部分。
          </p>
        </FounderSignOff>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-4 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/track-record"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /track-record · 每一場對錯 →
            </Link>
            <Link
              href="/audit"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /audit · 我們為什麼全部公開 →
            </Link>
          </div>
        </section>

        <RelatedReading currentPath="/corrections" />
      </main>

      <Footer />
    </div>
  );
}

// ── 單筆糾錯 ───────────────────────────────────────────
function CorrectionEntry({ c }: { c: Correction }) {
  return (
    <li className="border-l-2 border-loss/40 pl-5 sm:pl-6 py-1">
      <div className="flex items-baseline gap-3 mb-3">
        <span
          lang="en"
          className="font-mono text-loss/85 text-[11px] tracking-[0.3em] tabular shrink-0"
        >
          ✕ {c.no}
        </span>
        <h2 className="text-xl sm:text-2xl text-bone font-light tracking-tight leading-snug">
          {c.title}
        </h2>
      </div>

      <Row label="當初錯在哪">{c.wrong}</Row>
      <Row label="怎麼被發現">{c.caught}</Row>
      <Row label="怎麼修的">{c.fixed}</Row>

      <Link
        href={c.source.href}
        className="inline-flex items-baseline gap-2 mt-3 font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
      >
        看原始紀錄 · {c.source.label} →
      </Link>
    </li>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em] mb-1">
        {label}
      </p>
      <p className="text-mute text-sm sm:text-[15px] leading-relaxed zh-body">
        {children}
      </p>
    </div>
  );
}
