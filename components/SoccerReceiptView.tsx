import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import Avatar from "@/components/Avatar";
import EngineThreeWayBar from "@/components/EngineThreeWayBar";
import SoccerUserReceiptPick from "@/components/SoccerUserReceiptPick";
import KickoffCountdown from "@/components/KickoffCountdown";
import LockStamp from "@/components/LockStamp";
import { getNationalCode } from "@/lib/soccer/teams";
import type { SoccerReceipt } from "@/lib/soccer/receipt";

// ── ZONE 27 · 足球單場「戰功收據」頁 ───────────────────────────────────
// 鏡棒球收據(Patek 式 reference + TCG 卡解剖 + 命中/落空同等揭露)· 但足球是三向
// (主勝/和/客勝)· 無局數/場館。 一手鎖在結果還不存在的時候,賽後攤開 —— 這正是
// ZONE 27 賣的東西。 暗金、無 emoji、無賠率;命中上金、落空用既有收據色(非紅綠對比)。
//
// R213 賽前可外傳收據:收據不再只活在賽後。 三階段都渲染同一個 reference 物件 ——
//   · locked(賽前鎖定中)= 押完當下就能外傳的那張 · 引擎線在、結果待對帳
//   · live(已開賽待對帳)= 誠實標「已開賽」· 不假裝賽前鎖定中
//   · settled(已結算)= 命中/落空都釘在這、改不了
// 賽前/賽後同一個網址 → 賽後自動長出比分與判決(收據頁 10 分鐘 ISR)。
// ─────────────────────────────────────────────────────

export default function SoccerReceiptView({ r }: { r: SoccerReceipt }) {
  const ref = `Z27 · ${r.competitionName} · ${r.matchId}`;
  // 上金的邊綁 enginePick(原始機率 argmax)· 不從展示%重算 → 金數字與「引擎看好 X」同源。
  const homeGold = r.enginePick === "home";
  const drawGold = r.enginePick === "draw";
  const awayGold = r.enginePick === "away";

  const settled = r.phase === "settled";
  // 賽前鎖定中 / 已開賽待對帳 · 上方那行狀態詞要誠實分(不在已開踢的場掛「還沒開踢」)。
  const pendingStatus =
    r.phase === "locked" ? "賽前鎖定中" : "已開賽 · 待對帳";

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="soccer" />

      <main id="main">
        {/* ── BREADCRUMB ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">HOME</Link>
            <span className="text-mute/60">/</span>
            <Link href="/soccer" className="hover:text-gold transition-colors">足球</Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold tabular break-all">{r.matchId}</span>
          </div>
        </section>

        {/* ── HERO ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            ZONE 27 足球引擎收據 · 賽前鎖定 · 改不了
          </p>
          <h1 className="font-mono text-bone tabular text-2xl sm:text-3xl md:text-4xl font-light tracking-tight leading-tight mb-4 break-all">
            {ref}
          </h1>
          <div className="zone27-rule max-w-[320px] mb-6" aria-hidden="true" />
          {settled ? (
            <p className="text-mute text-base leading-relaxed">
              這一頁,就是那張收據本身。 賽前鎖死的三向機率 + 賽後的真實結果 —— 命中或落空,
              都釘在這裡、改不了。 我們把預測押在結果還不存在的時候 ——
              <span className="text-bone"> 這正是 ZONE 27 賣的東西。</span>
            </p>
          ) : (
            <p className="text-mute text-base leading-relaxed">
              這一頁,就是那張收據本身 —— 而且<span className="text-bone">現在就存在</span>,
              不用等賽後。 引擎賽前鎖死的三向機率釘在下面、改不了;結果還沒發生,
              賽後這同一個網址會自己長出比分與判決。 把預測押在結果還不存在的時候 ——
              <span className="text-bone"> 這正是 ZONE 27 賣的東西。</span>
            </p>
          )}
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── RECEIPT OBJECT ── */}
        <article
          aria-label={`ZONE 27 足球收據 ${ref}`}
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12"
        >
          <div className="border-2 border-mute/40 bg-slate/30">
            {/* TOP-LINE */}
            <div className="border-b border-gold/40 bg-gold/5 px-5 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
              <p className="font-mono text-gold tracking-[0.35em] text-[10px] sm:text-[11px]">
                ZONE 27 足球引擎 · v0.1 · 收據
              </p>
              <p className="font-mono text-gold/80 tracking-[0.3em] text-[9px] sm:text-[10px]">
                {settled ? r.competitionName : pendingStatus}
              </p>
            </div>

            {/* REFERENCE BAND · 鎖定時戳已升級成下方招牌徽章(LockStamp)· 這裡不重複,只留參考編號。 */}
            <div className="border-b border-mute/30 px-5 sm:px-8 py-4">
              <p lang="en" className="font-mono text-mute/85 text-[10px] sm:text-xs tracking-[0.4em] break-all">
                REF · {r.matchId}
              </p>
            </div>

            {/* MATCHUP */}
            <div className="px-5 sm:px-8 pt-7 pb-5">
              <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-3">/ 對戰</p>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2.5 min-w-0">
                  <Avatar seed={r.homeSeed} glyph={getNationalCode(r.homeSeed) ?? undefined} size={30} />
                  <span className="text-xl sm:text-2xl text-bone font-light tracking-tight truncate">{r.home}</span>
                </span>
                <span className="font-mono text-mute/50 text-xs shrink-0">vs</span>
                <span className="flex items-center gap-2.5 min-w-0 justify-end">
                  <span className="text-xl sm:text-2xl text-bone font-light tracking-tight truncate text-right">{r.away}</span>
                  <Avatar seed={r.awaySeed} glyph={getNationalCode(r.awaySeed) ?? undefined} size={30} />
                </span>
              </div>
              <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-2">
                開賽 {r.kickoffTPE} TPE
              </p>
            </div>

            {/* ENGINE THREE-WAY LINE */}
            <div className="px-5 sm:px-8 pb-6">
              <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.35em] mb-3">
                ENGINE PREDICTED · 賽前鎖定的三向機率
              </p>
              <div className="flex items-baseline justify-between font-mono tabular mb-2">
                <Cell label={r.home} value={r.homeWinPct} gold={homeGold} align="left" />
                <Cell label="和局" value={r.drawPct} gold={drawGold} align="center" />
                <Cell label={r.away} value={r.awayWinPct} gold={awayGold} align="right" />
              </div>
              <EngineThreeWayBar
                homePct={r.homeWinPct}
                drawPct={r.drawPct}
                awayPct={r.awayWinPct}
                goldSide={r.enginePick}
              />
              <p className="mt-2.5 font-mono text-mute/75 text-[11px] tracking-[0.1em]">
                引擎看好 <span className="text-bone">{r.favoredLabel}</span>(<span className="tabular">{r.favoredPct}%</span>)
              </p>
            </div>

            {/* 賽前鎖定戳記 = 全站最強「抄不走」信任徽章 · 擺在引擎線之後(先看到開的值=競 · 再看到
                改不了=誠實/拙)· 全球研究:賽前公開+事後改不了 是造假唯一做不到的 costly signal。 */}
            <div className="px-5 sm:px-8 pb-6">
              <LockStamp lockedAtTPE={r.lockedAtTPE} />
            </div>

            {/* ACTUAL RESULT · settled = 真實比分 · pending = 待對帳 frame(不假裝有結果)*/}
            {settled ? (
              <div className="px-5 sm:px-8 pb-6 border-t border-mute/20 pt-5">
                <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2">/ 賽後 · 90 分鐘</p>
                <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
                  {r.finalHome}:{r.finalAway}
                  <span className="text-mute text-base ml-3">
                    {r.outcome === "home" ? `${r.home} 勝` : r.outcome === "away" ? `${r.away} 勝` : "和局"}
                  </span>
                </p>
                <p className="mt-3 font-mono text-mute/60 text-[9px] sm:text-[10px] tracking-[0.25em] leading-relaxed">
                  ▸ 賽果來源 · football-data.org 中立公開比分 · 賽前鎖定的線永遠優先 · 改不了 ·
                  淘汰賽延長賽 / PK 不算(只認 90 分鐘 1X2)
                </p>
              </div>
            ) : (
              <div className="px-5 sm:px-8 pb-6 border-t border-mute/20 pt-5">
                <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2">/ 賽後 · 90 分鐘</p>
                {/* 開賽倒數:把「賽前鎖死、改不了」變成會跳動的對帳張力(倒數歸零=這條線拿去對現實)·
                    島自己判斷開賽了沒 → 倒數中 / 已開賽待對帳;降噪 / 無 JS → 靜態開賽時間。 */}
                <KickoffCountdown kickoffISO={r.kickoffISO} fallbackTPE={r.kickoffTPE} />
                <p className="mt-3 font-mono text-mute/60 text-[9px] sm:text-[10px] tracking-[0.25em] leading-relaxed">
                  ▸ 結果由 football-data.org 中立公開比分自動對帳 · 賽前鎖定的線改不了 ·
                  只認 90 分鐘 1X2(延長賽 / PK 不算)
                </p>
              </div>
            )}

            {/* VERDICT BAND · settled = 判決 · pending = 待揭曉 frame(無假 verdict · mute)*/}
            {settled ? (
              <VerdictBand verdict={r.verdict} />
            ) : (
              <div className="border-t-2 border-mute/50 px-5 sm:px-8 py-6 sm:py-7 text-center">
                <p className="font-mono text-mute text-lg sm:text-2xl tracking-[0.25em] font-medium">
                  {r.phase === "locked" ? "賽前鎖死 · 等開賽見真章" : "已開賽 · 終場後揭曉"}
                </p>
                <p className="font-mono text-mute/65 text-[10px] tracking-[0.25em] mt-3 leading-relaxed">
                  賽前鎖死、刪不掉 · 賽後命中與落空同等揭露 · 永不刪
                </p>
              </div>
            )}

            {/* 本人這手 pick(soul R208 close-the-loop)· 登入本人押過這場才蓋上 ·
                賽前 = 待對帳版(outcome=null)· 賽後 = 命中/落空版 ·
                沒登入 / 沒押 / 開賽後才補登 → 自動隱藏(graceful)。 */}
            <SoccerUserReceiptPick
              matchId={r.matchId}
              outcome={settled ? r.outcome : null}
              kickoffISO={r.kickoffISO}
              homeName={r.home}
              awayName={r.away}
              enginePick={r.enginePick}
              engineLabel={r.favoredLabel}
            />
          </div>

          {/* SHARE + BACK */}
          <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
            <CopyLinkButton refTag="soccer-receipt" />
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em]">
              <Link href="/soccer" className="text-mute hover:text-gold transition-colors">看更多足球 →</Link>
              <Link href="/track-record" className="text-mute hover:text-gold transition-colors">公開戰績 →</Link>
            </div>
          </div>

          {/* 賽前/進行中 · 把外傳這張的人接成下一個押注者(轉換漏斗 · 不是空喊分享)·
              連回這場的卡(#m-{id})· 未開賽就還能鎖、已開賽就看別場。 */}
          {!settled && (
            <div className="mt-6 border border-gold/30 bg-gold/5 px-5 py-4">
              <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-2">
                / 也想鎖一手?
              </p>
              <p className="text-mute text-sm leading-relaxed mb-3">
                這張收據現在就能外傳 —— 賽前鎖死、改不了。 你也可以在結果還沒發生前,
                對著引擎開的線鎖下你自己的判斷,賽後逐場對帳、含輸都留。
              </p>
              <Link
                href={`/soccer#m-${r.matchId}`}
                className="inline-flex items-center gap-2 font-mono text-gold/90 hover:text-gold text-[11px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
              >
                ▸ 去鎖你的這一手 →
              </Link>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}

function VerdictBand({
  verdict,
}: {
  verdict: "proved" | "diverged" | "push";
}) {
  const verdictColor =
    verdict === "proved" ? "text-gold" : verdict === "diverged" ? "text-loss" : "text-mute";
  const verdictBorder =
    verdict === "proved" ? "border-gold" : verdict === "diverged" ? "border-loss/70" : "border-mute/60";
  const verdictLabel =
    verdict === "proved"
      ? "✓ 命中 · 引擎看對了"
      : verdict === "diverged"
        ? "✕ 落空 · 引擎看錯了"
        : "平 · 引擎三向同分";
  return (
    <div className={`border-t-2 ${verdictBorder} px-5 sm:px-8 py-6 sm:py-7 text-center enter-verdict-reveal`}>
      <p className={`font-mono ${verdictColor} text-lg sm:text-2xl tracking-[0.25em] font-medium`}>
        {verdictLabel}
      </p>
      <p className="font-mono text-mute/65 text-[10px] tracking-[0.25em] mt-3 leading-relaxed">
        三向結算 · 和局是真實結果照常評 · 命中與落空同等揭露 · 永不刪
      </p>
    </div>
  );
}

function Cell({
  label,
  value,
  gold,
  align,
}: {
  label: string;
  value: number;
  gold: boolean;
  align: "left" | "center" | "right";
}) {
  const alignCls =
    align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center";
  return (
    <span className={`flex flex-col ${alignCls} gap-0.5 min-w-0`}>
      <span className={`text-xl sm:text-2xl font-light ${gold ? "text-gold" : "text-mute"}`}>
        {value}
        <span className="text-[11px] opacity-60">%</span>
      </span>
      <span className="text-mute/65 text-[10px] tracking-[0.1em] truncate max-w-[7rem]">
        {label.length > 6 ? label.slice(0, 6) : label}
      </span>
    </span>
  );
}
