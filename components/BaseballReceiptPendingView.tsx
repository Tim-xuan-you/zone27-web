import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import LineKeepHint from "@/components/LineKeepHint";
import UserReceiptPick from "@/components/UserReceiptPick";
import type { BaseballReceiptPending } from "@/lib/baseball-receipt";

// ── ZONE 27 · CPBL 賽前可外傳收據 頁 ───────────────────────────────────────
// 鏡賽後那張棒球收據(/receipts/[id] 的賽後 JSX:Patek 式 reference + TCG 卡解剖 +
// 「ENGINE PREDICTED · 賽前鎖定」左欄),但右欄不假裝有比分 —— 改秀「賽後 · 待對帳」+
// 開賽時間。 同一個 match 的收據賽前長這樣、賽後長出比分判決(同網址、同參考編號)。
//
// 為什麼要有這頁(同足球 R213/R215):賭徒押完當下最想曬「我開賽前就鎖了 X」——
// 收據賽前就存在、不用等賽後。 報馬仔結構上做不到(他們贏才曬、輸了刪)。
//
// 🔴 紅線:賽前鎖定的證明 = 公開 GitHub 提交紀錄(不捏造逐場「鎖定於 HH:MM」時戳 ·
//   棒球線是 Tim 手 curate 進 lib/matches.ts 的 commit)· 暗金 · 無 emoji(✓/✕ 例外)·
//   無賠率 · verdict 帶未結算一律 mute(不假裝命中/落空)。
// ─────────────────────────────────────────────────────

export default function BaseballReceiptPendingView({
  r,
}: {
  r: BaseballReceiptPending;
}) {
  const locked = r.phase === "locked";
  const yy = r.dateIso !== "—" ? r.dateIso.slice(0, 4) : "—";

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link href="/track-record" className="hover:text-gold transition-colors">
              TRACK RECORD
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold tabular break-all">{r.matchId}</span>
          </div>
        </section>

        {/* ── HERO ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            ZONE 27 引擎收據 · 賽前鎖定 · 改不了
          </p>
          <h1 className="font-mono text-bone tabular text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4 break-all">
            {r.ref}
          </h1>
          <div className="zone27-rule max-w-[320px] mb-6" aria-hidden="true" />
          <p className="text-mute text-base leading-relaxed">
            這一頁,就是那張收據本身 —— 而且<span className="text-bone">現在就存在</span>,
            不用等賽後。 引擎賽前鎖死的勝率釘在下面、改不了;結果還沒發生,賽後這同一個網址
            會自己長出比分與判決。 我們把預測押在結果還不存在的時候 ——
            <span className="text-bone"> 這正是 ZONE 27 賣的東西。</span>
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── RECEIPT OBJECT · 鏡賽後卡解剖 ── */}
        <article
          aria-label={`ZONE 27 receipt ${r.ref}`}
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12"
        >
          <div className="border-2 border-mute/40 bg-slate/30">
            {/* TOP-LINE */}
            <div className="border-b border-gold/40 bg-gold/5 px-5 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
              <p className="font-mono text-gold tracking-[0.35em] text-[10px] sm:text-[11px]">
                ZONE 27 引擎 · v0.2 · 收據
              </p>
              <p className="font-mono text-gold/80 tracking-[0.3em] text-[9px] sm:text-[10px]">
                {locked ? "賽前鎖定中" : "已開賽 · 待對帳"}
              </p>
            </div>

            {/* REFERENCE BAND */}
            <div className="border-b border-mute/30 px-5 sm:px-8 py-4 flex items-baseline justify-between flex-wrap gap-3">
              <p
                lang="en"
                className="font-mono text-mute/85 text-[10px] sm:text-xs tracking-[0.4em] break-all"
              >
                REFERENCE · {r.ref}
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
                {r.league} SEASON {yy}
              </p>
            </div>

            {/* MATCH SUMMARY */}
            <div className="px-5 sm:px-8 pt-7 pb-6">
              <p className="font-mono text-mute text-[10px] tracking-[0.35em] mb-3">
                / MATCHUP
              </p>
              <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-1">
                <span className="text-gold">{r.homeName}</span>
                <span className="text-mute/60 mx-3 text-base">vs</span>
                <span className="text-mute">{r.awayName}</span>
              </h2>
              <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-1">
                {r.homeEn}{" "}
                <span aria-hidden="true" className="text-mute/85">
                  ·
                </span>{" "}
                {r.awayEn} · {r.venue}
              </p>
            </div>

            {/* ENGINE vs 待對帳 GRID */}
            <div className="px-5 sm:px-8 pb-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="border-l-2 border-gold/30 pl-5 pr-2 py-2">
                  <p
                    lang="en"
                    className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
                  >
                    ENGINE PREDICTED · 賽前鎖定
                  </p>
                  {r.favorite !== null ? (
                    <>
                      <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light tracking-tight leading-none">
                        {r.favoritePct}
                        <span className="text-lg opacity-60 ml-1">%</span>
                        <span className="text-mute text-base ml-3">
                          {r.homeFavored ? r.homeEn : r.awayEn}
                        </span>
                      </p>
                      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
                        FAVORITE · {r.favoriteName} · CONF {r.aiConfidence}/100
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-mono text-bone tabular text-2xl sm:text-3xl font-light tracking-tight leading-none">
                        {r.homeWinRate}
                        <span className="text-base opacity-60">%</span>
                        <span className="text-mute/60 mx-2 text-base">:</span>
                        {r.awayWinRate}
                        <span className="text-base opacity-60">%</span>
                      </p>
                      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
                        引擎難分 · 約五五波 · CONF {r.aiConfidence}/100
                      </p>
                    </>
                  )}
                </div>
                <div className="border-l-2 border-bone/30 pl-5 pr-2 py-2 sm:text-right sm:border-l-0 sm:border-r-2 sm:pr-5 sm:pl-2">
                  <p
                    lang="en"
                    className="font-mono text-mute text-[10px] tracking-[0.35em] mb-2"
                  >
                    ACTUAL RESULT · 賽後
                  </p>
                  <p className="font-mono text-mute tabular text-2xl sm:text-3xl font-light tracking-tight leading-none">
                    {locked ? "待對帳" : "終場後揭曉"}
                  </p>
                  <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-3 tabular">
                    {locked
                      ? `開賽 ${r.startDisplay} TPE`
                      : "已開賽 · 結果還沒進來"}
                  </p>
                </div>
              </div>
            </div>

            {/* 賽果來源 + 鎖定證明(誠實:GitHub commit = 鎖定證明 · 不捏造逐場時戳) */}
            <div className="px-5 sm:px-8 pb-6 -mt-1">
              <p className="font-mono text-mute/65 text-[9px] sm:text-[10px] tracking-[0.25em] leading-relaxed">
                ▸ 賽果來源 · cpbl.com.tw 官方賽程 · 每 3 小時自動鏡像對帳 · 賽前鎖定的線永遠優先 · 改不了
              </p>
            </div>

            {/* VERDICT BAND · 未結算 = mute · 不假裝命中/落空 */}
            <div className="border-t-2 border-mute/50 px-5 sm:px-8 py-6 sm:py-7 text-center">
              <p className="font-mono text-mute text-lg sm:text-2xl tracking-[0.25em] font-medium">
                {locked ? "賽前鎖死 · 等開賽見真章" : "已開賽 · 終場後揭曉"}
              </p>
              <p className="font-mono text-mute/65 text-[10px] tracking-[0.25em] mt-3 leading-relaxed">
                這條線賽前就鎖進{" "}
                <a
                  href="https://github.com/Tim-xuan-you/zone27-web/commits/main"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
                >
                  公開的 GitHub 紀錄
                </a>
                、改不了 · 賽後命中與落空同等揭露 · 永不刪
              </p>
            </div>

            {/* 本人這手 pick(soul R208 close-the-loop)· 賽前 = 待對帳版(無 ✓/✕)·
                沒登入 / 沒押這場 / 開賽後才補登 → 自動隱藏(graceful)。 */}
            <UserReceiptPick
              matchId={r.matchId}
              finalWinner={null}
              pending
              startISO={r.startISO}
              homeName={r.homeName}
              awayName={r.awayName}
            />

            {/* TIM SIGNATURE FOOTER */}
            <div className="border-t border-line/40 px-5 sm:px-8 py-5 flex items-baseline justify-between flex-wrap gap-3">
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
                — TIM · ZONE 27 創辦人 · {r.dateIso}
              </p>
              <p className="font-mono text-gold/70 text-[9px] tracking-[0.3em] tabular">
                只增不改 · 改了會留公開紀錄
              </p>
            </div>
          </div>

          {/* SHARE + BACK */}
          <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
            <CopyLinkButton refTag="cpbl-receipt" />
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.3em]">
              <Link href="/matches" className="text-mute hover:text-gold transition-colors">
                今日賽事 →
              </Link>
              <Link href="/track-record" className="text-mute hover:text-gold transition-colors">
                公開戰績 →
              </Link>
            </div>
          </div>
          <LineKeepHint />

          {/* 也想鎖一手?把外傳這張的人接成下一個押注者(轉換漏斗 · 不是空喊分享)。 */}
          <div className="mt-6 border border-gold/30 bg-gold/5 px-5 py-4">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-2">
              / 也想鎖一手?
            </p>
            <p className="text-mute text-sm leading-relaxed mb-3">
              這張收據現在就能外傳 —— 賽前鎖死、改不了。 你也可以在結果還沒發生前,
              對著引擎開的線鎖下你自己的判斷,賽後逐場對帳、含輸都留。
            </p>
            <Link
              href={`/matches/${r.matchId}`}
              className="inline-flex items-center gap-2 font-mono text-gold/90 hover:text-gold text-[11px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
            >
              ▸ 去鎖你的這一手 →
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
