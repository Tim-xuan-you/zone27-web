import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import EngineRerunBadge from "@/components/EngineRerunBadge";
import LineKeepHint from "@/components/LineKeepHint";
import FounderSignOff from "@/components/FounderSignOff";
import UserReceiptPick from "@/components/UserReceiptPick";
import MatchSegment from "@/components/MatchSegment";
import { getMatchSegment } from "@/lib/match-segment";
import {
  getMatchById,
  getFinalizedMatches,
  getCalibration,
  getEnginePctOnWinner,
  getMatchDateIso,
  getMatchStartIso,
} from "@/lib/matches";
import { getMlbMatchById } from "@/lib/mlb-matches";
import { getSoccerReceipt } from "@/lib/soccer/receipt";
import SoccerReceiptView from "@/components/SoccerReceiptView";
import {
  getBaseballPendingReceipt,
  deriveReferenceNumber,
} from "@/lib/baseball-receipt";
import BaseballReceiptPendingView from "@/components/BaseballReceiptPendingView";

// 足球收據是 on-demand(fd-* 不在 generateStaticParams · dynamicParams 預設允許)·
// 結果隨比賽打完才出現 → ISR 10 分鐘讓「還沒踢完(404)」在賽後自動變成 200。
// 棒球收據本來就靜態,加 revalidate 只是每 10 分鐘重出同樣內容 · 無害。
export const revalidate = 600;

// ── ZONE 27 · /receipts/[receiptId] · Single Receipt Object Page ──
// R75 W-F · Agent A R75 SHIP 1 ★★★★★ BIGGEST GAP CLOSURE · Stripe Press
// 3D book detail pages + Patek Philippe Reference Number permanence +
// Defector citation permalink + Anthropic Transparency Hub model card
// archive pattern。 ZONE 27 had 0 visitor-grabbable receipt objects · ALL
// pages were narrative surfaces(/track-record · /audit · /methodology ·
// /founders/ledger · /calibration)none was a single-object page。 此 NEW
// dynamic route group converts every PROVED/DIVERGED finalized match into
// its own dedicated URL · object-as-receipt · share-as-thing。
//
// The cognitive frame this closes:
//   - Visitor wants to share/screenshot/audit a SPECIFIC receipt
//   - Existing /track-record shows ALL receipts inline · not a single OBJECT
//   - /matches/[gameId] is the LIVE/PRE/POST match page · not a receipt page
//   - /audit is the model report · not a receipt page
//   - Stripe Press treats each book as its own URL · Patek Reference Number
//     each watch · Defector each annual report · ZONE 27 needed the analog
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · receipt-as-object publishes
//     entire engine evaluation history in shareable form · 同 Stripe Press
//     book detail page grammar
//   - per [[feedback-zone27-pratfall-brand-ip]] · PROVED + DIVERGED same
//     visual weight on this page · Aronson 1966 Pratfall axiom 物理 codify
//   - per /audit S05 PRE-COMMIT clause · receipts append-only · never
//     retroactively deleted · git diff log = source of truth
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     audience wants to share「我跟的 ZONE 27 cpbl-260521-01 receipt」
//     · single URL == single grabbable thing
//   - per [[zone27-payment-architecture]] · static SSG no dynamic rendering
//     · 0 server cost · 0 PII · 0 tracking
//
// 不做 anti-pattern:
//   ✕ NO「share with bonus credits」 incentive(violates 11-NEVER #4 MLM)
//   ✕ NO「view count · X people seen this receipt」 social proof
//   ✕ NO comment section / discussion(violates 11-NEVER #1 user-to-user social)
//   ✕ NO push notification「your followed match has a receipt」
//   ✕ NO retroactive edit · per /audit S05 PRE-COMMIT · 修改 receipt content
//     需 30 天前 /changelog 公告
//
// Architecture(per Agent A R75 SHIP 1 spec):
//   - Static SSG · generateStaticParams returns only finalized match IDs
//   - 404 if id not found or not yet finalized(receipt only exists post-final)
//   - Reference number format · Z27-{league}-{date-short}-{seq}
//     e.g. Z27-CPBL-260521-01 · Patek Reference grammar
//   - TIM signature footer + ingest timestamp
//   - <CopyLinkButton /> reuses /founders pattern
//   - Cross-links · /track-record(parent ledger)+ /matches/[gameId]
//     (match page)+ /audit(model report)
//
// Inspiration sources(per Agent A R75 SHIP 1 spec):
//   - Stripe Press(books.stripe.com)· each book = own URL · 3D parallax
//   - Patek Philippe Reference Number archive(patek.com/en/collection)
//   - Defector annual report PDFs(2020/2021/2022 · each = own permalink)
//   - Anthropic Transparency Hub model card revisions(each = own page)
//   - The Athletic beat-writer column permalink(each = own URL)
// ─────────────────────────────────────────────────────

type Params = Promise<{ receiptId: string }>;

export async function generateStaticParams(): Promise<{ receiptId: string }[]> {
  // Pre-render ONLY finalized matches · receipts only exist post-final ·
  // pre-game / live / future / archived matches resolve to 404。 Per /audit
  // S05 disclosure parity · receipt-page existence IS the proof of finalization。
  return getFinalizedMatches().map((m) => ({ receiptId: m.id }));
}

// R75 W-F · canonical Patek-style reference number derivation(Z27 · {league} ·
// {YYMMDD} · {seq})已抽到 lib/baseball-receipt.ts 共用 —— 保證同一場的「賽前」與
// 「賽後」收據顯示完全相同的參考編號(R220 賽前可外傳收據)· 見該檔註解。

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { receiptId } = await params;
  // 足球收據(fd-*)· 三向 · 賽前(鎖定中)就存在,賽後長出比分與判決(走 getSoccerReceipt)。
  if (receiptId.startsWith("fd-")) {
    const sr = await getSoccerReceipt(receiptId);
    if (!sr) {
      return {
        title: "Receipt not found",
        description: "此足球收據不存在(這場沒有賽前鎖定線)· 完整足球戰績在 /soccer。",
      };
    }
    // 賽前 / 已開賽待對帳 → 賽前鎖定卡(無比分判決 · 「你也想鎖一手?」轉換鉤子)。
    // 🔴 已開賽(live)絕不標「賽前鎖定中」= 對已開踢的場說謊(對齊 OG 卡 headerTag + view pendingStatus)。
    if (sr.phase !== "settled") {
      const live = sr.phase === "live";
      return {
        title: live
          ? `${sr.home} vs ${sr.away} · 已開賽 · 待對帳 · ZONE 27 足球收據`
          : `${sr.home} vs ${sr.away} · 賽前鎖定 · ZONE 27 足球收據`,
        description: live
          ? `引擎賽前鎖定看好 ${sr.favoredLabel}(${sr.favoredPct}%)· 賽前鎖死、已開賽 · 終場後逐場對帳 · 含贏含輸、改不了。`
          : `引擎賽前鎖定看好 ${sr.favoredLabel}(${sr.favoredPct}%)· 鎖在結果還不存在的時候、改不了 · 賽後逐場對帳。你也想對著引擎的線鎖一手?`,
        openGraph: {
          title: live
            ? `${sr.home} vs ${sr.away} · 待對帳`
            : `${sr.home} vs ${sr.away} · 賽前鎖定中`,
          description: live
            ? `賽前鎖死 · 終場後對帳 · 含贏含輸、改不了。`
            : `引擎賽前鎖定看好 ${sr.favoredLabel}(${sr.favoredPct}%)· 鎖在結果還不存在的時候、改不了。`,
        },
      };
    }
    const vt = sr.verdict === "proved" ? "命中" : sr.verdict === "diverged" ? "落空" : "平";
    return {
      title: `${sr.home} vs ${sr.away} · 引擎${vt} · ZONE 27 足球收據`,
      description: `${sr.home} ${sr.finalHome}:${sr.finalAway} ${sr.away} · 引擎賽前鎖定看好 ${sr.favoredLabel}(${sr.favoredPct}%）· 賽後逐場對帳 · 命中與落空都留著、改不了。`,
      openGraph: {
        title: `${sr.home} vs ${sr.away} · 引擎${vt}`,
        description: `引擎賽前鎖定、賽後對帳 · 含贏含輸、改不了。`,
      },
    };
  }
  // CPBL(sync)+ MLB(async · R228 修:MLB 戰功卡點收據 404 —— getMatchById 只認 CPBL)。
  const match =
    getMatchById(receiptId) ??
    (receiptId.startsWith("mlb-") ? await getMlbMatchById(receiptId) : null);
  if (!match || !match.finalResult) {
    // 賽前 / 進行中(CPBL · 尚未結算)→ 賽前鎖定卡 metadata(押完當下就能外傳)。
    // 🔴 已開賽(live)絕不標「賽前鎖定中」= 對已開打的場說謊(對齊 OG 卡 + view)。
    const bp = getBaseballPendingReceipt(receiptId);
    if (bp) {
      const live = bp.phase === "live";
      const favLine = bp.favoriteName
        ? `引擎賽前鎖定看好 ${bp.favoriteName}(${bp.favoritePct}%)`
        : `引擎這場約五五波(${bp.homeWinRate}% : ${bp.awayWinRate}%)`;
      return {
        title: live
          ? `${bp.homeName} vs ${bp.awayName} · 已開賽 · 待對帳 · ZONE 27 收據`
          : `${bp.homeName} vs ${bp.awayName} · 賽前鎖定 · ZONE 27 收據`,
        description: live
          ? `${favLine} · 賽前鎖死、已開賽 · 終場後逐場對帳 · 含贏含輸、改不了。`
          : `${favLine} · 鎖在結果還不存在的時候、改不了 · 賽後逐場對帳。你也想對著引擎的線鎖一手?`,
        openGraph: {
          title: live
            ? `${bp.homeName} vs ${bp.awayName} · 待對帳`
            : `${bp.homeName} vs ${bp.awayName} · 賽前鎖定中`,
          description: live
            ? `賽前鎖死 · 終場後對帳 · 含贏含輸、改不了。`
            : `${favLine} · 鎖在結果還不存在的時候、改不了。`,
        },
      };
    }
    return {
      title: "Receipt not found",
      description: "此 receipt 不存在或未 finalized · 完整 ledger 在 /track-record。",
    };
  }
  const ref = deriveReferenceNumber(match.id, match.league);
  const cal = getCalibration(match) ?? "push";
  const verdict = cal === "proved" ? "命中" : cal === "diverged" ? "落空" : "平";
  // images 不再覆寫 → Next 自動帶上本路由的 opengraph-image.tsx(單場引擎收據卡)。
  return {
    title: `${ref} · 引擎${verdict} · ZONE 27 收據`,
    description: `${match.home.name} vs ${match.away.name} · ${match.date} · 引擎賽前鎖定、賽後對帳的單場收據 —— 命中與落空都留著、改不了。`,
    openGraph: {
      title: `${match.home.name} vs ${match.away.name} · 引擎${verdict}`,
      description: `引擎賽前鎖定、賽後逐場對帳 · 含贏含輸、改不了。`,
    },
  };
}

export default async function ReceiptPage({ params }: { params: Params }) {
  const { receiptId } = await params;
  // 足球單場戰功收據(fd-*)· 三向 · 賽後才有(查無鎖定 / 還沒踢完 → 404)。
  // 走獨立的 SoccerReceiptView · 完全不碰下方棒球收據邏輯(零風險)。
  if (receiptId.startsWith("fd-")) {
    const sr = await getSoccerReceipt(receiptId);
    if (!sr) notFound();
    // R230 · 這場的「誰賽前鎖了 · 賽後誰押對」人類記分板(足球版 · settled 顯示 ✓/✕)·
    // 走公開 ladder(0 migration)· 在 async 父層算好傳進 view(view 維持 sync)。
    const sseg = await getMatchSegment(receiptId);
    return <SoccerReceiptView r={sr} segment={sseg} />;
  }
  // CPBL(sync)+ MLB(async · R228 修:MLB 戰功卡點收據 404 —— getMatchById 只認 CPBL ·
  // 已結算 MLB 由 getMlbMatchById 從 mlb-locked.json 永久重建 · 走下方同一份賽後收據渲染)。
  const match =
    getMatchById(receiptId) ??
    (receiptId.startsWith("mlb-") ? await getMlbMatchById(receiptId) : null);
  if (!match || !match.finalResult) {
    // 賽前 / 進行中(CPBL · 尚未結算)→ 賽前可外傳收據(R220)· 走獨立 view · 完全不碰
    // 下方賽後棒球收據邏輯(零風險)。 賽後同一網址自己長出比分判決(ISR 10 分鐘)。
    // MLB 賽前 / 延賽 / 查無 → 仍 404(無 MLB 賽前 receipt view · 不假裝 pre-final receipt)。
    const bp = getBaseballPendingReceipt(receiptId);
    if (bp) return <BaseballReceiptPendingView r={bp} />;
    notFound();
  }

  const fr = match.finalResult;
  const cal = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);
  if (!cal) {
    notFound();
  }

  const ref = deriveReferenceNumber(match.id, match.league);
  const dateIso = getMatchDateIso(match) ?? "—";
  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);
  // R230 · 這場的「誰賽前鎖了 · 賽後誰押對」人類記分板(per-match segment · 公開 ladder · 0 migration)
  const segment = await getMatchSegment(match.id);

  // R228 · 外傳這張時帶一句具體鉤子(預寫具體訊息比通用標語點閱高 2-4 倍)· 講引擎鎖死的線 + 結果。
  const verdictWord =
    cal === "proved" ? "引擎命中" : cal === "diverged" ? "引擎落空" : "平";
  const shareText = `ZONE 27 · ${match.home.name} vs ${match.away.name} · 引擎賽前鎖死看好 ${favoriteName} ${favoritePct}% · 結果 ${fr.homeScore}:${fr.awayScore} · ${verdictWord} · 一張改不了的收據`;

  // soul R209 · 賽果來源(Kalshi 式事前公開「用哪個資料源、何時算、怎麼判」)·
  // 把現成的自動對帳基建變成可見的信任聲明 —— 官方賽程,不爬盤口。
  const resultSource = match.id.startsWith("cpbl")
    ? "cpbl.com.tw 官方賽程 · 每 3 小時自動鏡像對帳"
    : match.id.startsWith("mlb")
      ? "MLB 官方 Stats API · 自動對帳"
      : "官方賽程 · 自動對帳";

  const verdictColor = {
    proved: "text-gold",
    diverged: "text-loss",
    push: "text-mute",
  }[cal];
  const verdictBorder = {
    proved: "border-gold",
    diverged: "border-loss/70",
    push: "border-mute/60",
  }[cal];
  const verdictLabel = {
    proved: "✓ PROVED · ENGINE 命中",
    diverged: "✕ DIVERGED · ENGINE 落空",
    push: "= PUSH · 平局或無 favorite",
  }[cal];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/track-record"
              className="hover:text-gold transition-colors"
            >
              TRACK RECORD
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold tabular">{receiptId}</span>
          </div>
        </section>

        {/* ── HERO · Patek-style reference number ──── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            ZONE 27 引擎收據 · 賽前鎖定 · 改不了
          </p>
          <h1 className="font-mono text-bone tabular text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4 break-all">
            {ref}
          </h1>
          {/* Cold gold hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[320px] mb-6" aria-hidden="true" />
          <p className="text-mute text-base leading-relaxed">
            這一頁,就是那張收據本身。 賽前鎖定的預測 + 賽後的結果 —— 命中或落空,都釘在這裡、改不了。
            要改內容,得 30 天前先公開公告(誰都查得到的那份)。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── RECEIPT OBJECT · Stripe Press-style detail ── */}
        <article
          aria-label={`ZONE 27 receipt ${ref}`}
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12"
        >
          <div className="border-2 border-mute/40 bg-slate/30">
            {/* ── TOP-LINE · TCG card anatomy(R60 W-B established pattern) ── */}
            <div className="border-b border-gold/40 bg-gold/5 px-5 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
              <p
                className="font-mono text-gold tracking-[0.35em] text-[10px] sm:text-[11px]"
              >
                ZONE 27 引擎 · v0.2 · 收據
              </p>
              <p
                lang="en"
                className="font-mono text-gold/80 tracking-[0.3em] text-[9px] sm:text-[10px] tabular"
              >
                {match.league} SEASON {dateIso.slice(0, 4)}
              </p>
            </div>

            {/* ── REFERENCE BAND ─────────────────────── */}
            <div className="border-b border-mute/30 px-5 sm:px-8 py-4 flex items-baseline justify-between flex-wrap gap-3">
              <p
                lang="en"
                className="font-mono text-mute/85 text-[10px] sm:text-xs tracking-[0.4em]"
              >
                REFERENCE · {ref}
              </p>
              <div className="flex items-baseline gap-3 flex-wrap">
                {/* R77 W-A · EngineRerunBadge · Agent A R76 SHIP F · Cloudflare
                    postmortem pattern · per-receipt version chip · v1 quiet · v2+
                    rendered when ENGINE_OPS_LOG has receipt-correction events for
                    this receipt · pairs with R76 W-C /engine-log canonical spine。 */}
                <EngineRerunBadge receiptId={match.id} />
                <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
                  {dateIso} · INGEST
                </p>
              </div>
            </div>

            {/* ── MATCH SUMMARY ──────────────────────── */}
            <div className="px-5 sm:px-8 pt-7 pb-6">
              <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-3">
                / MATCHUP
              </p>
              <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-1">
                <span className="text-gold">{match.home.name}</span>
                <span className="text-mute/60 mx-3 text-base">vs</span>
                <span className="text-mute">{match.away.name}</span>
              </h2>
              <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-1">
                {match.home.en}{" "}
                <span aria-hidden="true" className="text-mute/85">
                  ·
                </span>{" "}
                {match.away.en} · {match.venue}
              </p>
            </div>

            {/* ── ENGINE vs ACTUAL GRID ──────────────── */}
            <div className="px-5 sm:px-8 pb-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="border-l-2 border-gold/30 pl-5 pr-2 py-2">
                  <p
                    lang="en"
                    className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
                  >
                    ENGINE PREDICTED · 賽前鎖定
                  </p>
                  <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
                    {favoritePct}
                    <span className="text-lg opacity-60 ml-1">%</span>
                    <span className="text-mute text-base ml-3">
                      {homeFavored ? match.home.en : match.away.en}
                    </span>
                  </p>
                  <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
                    FAVORITE · {favoriteName} · CONF{" "}
                    {match.aiConfidence ?? 0}/100
                  </p>
                </div>
                <div className="border-l-2 border-bone/30 pl-5 pr-2 py-2 sm:text-right sm:border-l-0 sm:border-r-2 sm:pr-5 sm:pl-2">
                  <p
                    lang="en"
                    className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
                  >
                    ACTUAL RESULT · 賽後
                  </p>
                  <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
                    {fr.homeScore}:{fr.awayScore}
                    <span className="text-mute text-base ml-3">
                      {fr.winner === "home"
                        ? `${match.home.en} W`
                        : fr.winner === "away"
                          ? `${match.away.en} W`
                          : "TIE"}
                    </span>
                  </p>
                  <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
                    {fr.innings ?? 9} 局 · {fr.ingestedAt} INGEST
                  </p>
                </div>
              </div>
            </div>

            {/* ── 賽果來源(soul R209 · 事前公開結算規則 = Kalshi 式信任)──────── */}
            <div className="px-5 sm:px-8 pb-6 -mt-1">
              <p className="font-mono text-mute/65 text-[9px] sm:text-[10px] tracking-[0.25em] leading-relaxed">
                ▸ 賽果來源 · {resultSource} · 賽前鎖定的線永遠優先 · 改不了
              </p>
            </div>

            {/* ── VERDICT BAND · R67 W-B Peak-End rule axiom 物理 codify ─── */}
            <div
              className={`border-t-2 ${verdictBorder} px-5 sm:px-8 py-6 sm:py-7 text-center enter-verdict-reveal`}
            >
              <p
                lang="en"
                className={`font-mono ${verdictColor} text-lg sm:text-2xl tracking-[0.3em] font-medium`}
              >
                {verdictLabel}
              </p>
              {enginePctOnWinner !== null && (
                <p
                  className={`font-mono ${verdictColor} text-[11px] sm:text-xs tracking-[0.3em] tabular mt-3 opacity-80`}
                >
                  {cal === "proved" && (
                    <>
                      ENGINE 鎖 {favoritePct}% · {favoriteName} 勝
                    </>
                  )}
                  {cal === "diverged" && (
                    <>
                      ENGINE 鎖 {favoritePct}% · {favoriteName} 落空
                    </>
                  )}
                  {cal === "push" && <>無 favorite · 平局或同分</>}
                </p>
              )}
            </div>

            {/* ── 本人這手 pick + 鎖定時戳(soul R208 #1 · close-the-loop b)──────
                SSG 收據蓋上「登入本人對這場的押注 + 賽前鎖定時戳」= 最可截圖的 proof。
                graceful client island:沒登入 / 沒押這場 / 開賽後才補登 → 不顯示。 */}
            <UserReceiptPick
              matchId={match.id}
              finalWinner={fr.winner}
              startISO={getMatchStartIso(match)}
              homeName={match.home.name}
              awayName={match.away.name}
            />

            {/* ── TIM SIGNATURE FOOTER ───────────────── */}
            <div className="border-t border-line/40 px-5 sm:px-8 py-5 flex items-baseline justify-between flex-wrap gap-3">
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
                — TIM · ZONE 27 創辦人 · {dateIso}
              </p>
              <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] tabular">
                只增不改 · 改了會留公開紀錄
              </p>
            </div>
          </div>
        </article>

        {/* ── 誰賽前鎖了這場 · 賽後誰押對(per-match segment · 人類記分板 · 沒人鎖→整塊隱藏)──
            引擎的收據在上面 · 這裡是「真人」的記分板:誰賽前押了手、賽後誰押對 · 每格連 /u 公開校準檔。 */}
        <MatchSegment
          lockers={segment}
          homeName={match.home.name}
          awayName={match.away.name}
          winner={fr.winner}
        />

        {/* ── COPY-LINK + CROSS-LINKS ─────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border border-line/40 bg-slate/20 p-5 sm:p-6">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4">
              分享這張收據 · 沒有追蹤碼
            </p>
            <p className="text-mute text-sm leading-relaxed mb-5">
              這個網址就是這張收據的永久位置 —— 直接傳就好。 沒有追蹤碼、沒有推薦碼,
              我們不記錄誰把它傳給誰,也不會推播「你分享的收據被看了幾次」。
            </p>
            <CopyLinkButton shareText={shareText} />
            {/* R77 W-B · LineKeepHint · Agent A R76 SHIP E · mobile-only
                long-press → LINE Keep · 不需加好友 · 不 push · session-only
                dismiss(NOT localStorage · per 11-key cap discipline)·
                client component · graceful degrade desktop。 */}
            <LineKeepHint />
          </div>
        </section>

        {/* R228 · 閉漏斗:外傳這張(常是命中)收據、點進來的朋友多半沒登入,給一條「也免費鎖一手」
            的下一步 —— 之前 settled 收據只有內部交叉連結 = 迴圈開了卻不閉。 這場鎖不了了 → 連去今日板。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border border-gold/30 bg-gold/5 px-5 py-4">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-2">
              / 也想鎖一手?
            </p>
            <p className="text-mute text-sm leading-relaxed mb-3">
              引擎開盤免費看,押一手要登入(免費)· 賽後逐場對帳、含輸都留 ——
              跟一台公開機器正面比準度,你 vs 引擎誰準。
            </p>
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 font-mono text-gold/90 hover:text-gold text-[11px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
            >
              ▸ 去鎖今日的一手 →
            </Link>
          </div>
        </section>

        {/* ── RELATED CROSS-LINKS ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-mute text-[10px] tracking-[0.4em] mb-4">
            / 順著查下去
          </p>
          <ul className="space-y-2 text-mute text-sm">
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href="/track-record"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                完整戰績
              </Link>
              <span className="text-mute/70">· 所有收據,按時間排,含贏含輸</span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href={`/matches/${match.id}`}
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                這場的賽事頁
              </Link>
              <span className="text-mute/70">· 賽前 / 進行中 / 賽後完整資訊</span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href="/audit"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                引擎報告
              </Link>
              <span className="text-mute/70">· 引擎怎麼算的、哪些是估計值,全攤開</span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <Link
                href="/methodology"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                方法白皮書
              </Link>
              <span className="text-mute/70">· 這個預測是怎麼跑出來的</span>
            </li>
          </ul>
        </section>

        <FounderSignOff>
          <p>
            我做這一頁,是想讓每一場預測都有一個可以單獨拿出來、傳給別人看的地方 ——
            不是埋在一長串戰績裡,而是這一場、這個結果,自己一張。
          </p>
          <p>
            每場打完,系統自動幫它生一頁,網址永久不變。 你把它傳出去,我這邊不會知道是誰點的、
            也不會偷偷記錄 —— 跟我在隱私頁講的一樣,不追蹤。
          </p>
          <p>
            這張收據的內容我不能偷偷改。 真要更正,得 30 天前先公開公告,
            誰都查得到。 命中我留著,落空我也留著 —— 這就是這整個站值得信的地方。
          </p>
        </FounderSignOff>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/track-record"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← /track-record · 完整 ledger
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
