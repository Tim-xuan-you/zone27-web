import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import MemberUnlocksGrid from "@/components/MemberUnlocksGrid";
import { getSession } from "@/lib/supabase/server";
import { readFollowsFromMeta } from "@/lib/follows";
import { readNotesFromMeta } from "@/lib/notes";
import {
  getMatchById,
  getMatchPhase,
  getCalibration,
  type Match,
} from "@/lib/matches";

export const metadata: Metadata = {
  title: "Member · 您的引擎時間軸 · FREE TIER dashboard preview",
  description:
    "ZONE 27 會員儀表板預覽。您在 /lab 跑過的所有 Monte Carlo · 您 follow 的賽事 calibration record · 您能投票的引擎下一步 — 全部以 4 個 cognitive bias(Endowment Effect / IKEA Effect / Loss Aversion / Collection)為基礎設計。Auth 上線 + cloud sync 在 2026 Q3 規劃。",
};

// ── ZONE 27 · /member ──────────────────────────────────
// Round 29 Wave 2 · Tim 直擊:「會員他們自己的頁面又在哪裡?他們會員
// 頁面能做什麼呢?多以心理學的角度去出發及處理」
//
// 這頁是 FREE TIER 會員儀表板的 PUBLIC PREVIEW · 不是 mock · 不是
// marketing。Visitor 進來看到自己 localStorage 裡的 sim history(已
// 累積資料)當 preview data — Endowment Effect 立刻 fire。沒 auth ·
// 但因為 data 是 visitor 自己的 · 心理連結比看 fake screenshots 強。
//
// 4 個 cognitive bias 同時 fire(per Tim「多以心理學角度」 ask):
//   01 Endowment Effect    · 您的引擎時間軸(localStorage data)
//   02 Loss Aversion       · 您 follow 的賽事 + 個人 calibration record
//   03 IKEA Effect         · 您能投票決定的引擎下一步(/roadmap items)
//   04 Pratfall + Costly Signaling · 誠實 launch timeline (preview vs functional)
//
// Pratfall: 不假裝 functionality already exists · launch timeline 公開
// 寫 (Phase 1 Q3 Supabase auth · Phase 2 Q3+ TapPay · Phase 3 Q4+ CMS)。
// 倒置 SaaS 預設「coming soon · trust me · sign up now」 · 不放空頭支票。
//
// 跟 /membership 分工:
//   /membership = 4-tier ladder 全景 + sales conversion
//   /member     = 個人預覽 + 心理學 product gap surface
// ─────────────────────────────────────────────────────

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  // Round 30 Wave 5 · auth-aware /member。 Session present = 真實註冊
  // 會員 · 顯示 welcome 區塊 + 登出 button · PREVIEW chip 切 AUTHENTICATED。
  // No session = preview mode (existing behavior) · 不假裝 functionality 已存在。
  const session = await getSession();
  const params = await searchParams;
  const justArrived = params.welcome === "true";
  const email = session?.user.email ?? null;
  // Round 30 Wave 6 · pull followed match IDs from user_metadata · server-
  // side render so logged-in members see their follows list immediately ·
  // anonymous visitors see empty array (no UI for follows section)。
  const userMeta = session?.user.user_metadata as
    | Record<string, unknown>
    | undefined;
  const followIds = readFollowsFromMeta(userMeta);
  const followedMatches = followIds
    .map((id) => getMatchById(id))
    .filter((m): m is Match => !!m);
  // Round 30 Wave 10 · note map for badge display on each FollowedMatchRow
  const notesMap = readNotesFromMeta(userMeta);
  // Round 30 Wave 10 · days-since-join · auth.users.created_at = registration
  // moment(magic link first click)。 Endowment Effect deepening:「您是
  // ZONE 27 第 N 天會員」 explicit identity anchor。
  // Round 31 lint fix · server-side computation moved to helper so the
  // react-hooks/purity rule doesn't false-flag Date.now() in an async
  // server component(server renders once per request · Date.now is
  // stable across that render · same wall-clock semantics as Vercel's
  // request timestamp).
  const createdAt = session?.user.created_at ?? null;
  const daysSinceJoin = computeDaysSinceJoin(createdAt);

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
              {session
                ? "/ MEMBER · 您的 dashboard"
                : "/ MEMBER · 您的引擎時間軸"}
            </p>
            {session ? (
              <span
                lang="en"
                className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold shimmer"
                title="您已登入 · session 啟用 · Round 30 Wave 5 ship 的 Phase 1 magic link auth"
              >
                ✓ AUTHENTICATED · FREE TIER
              </span>
            ) : (
              <span
                lang="en"
                className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-loss/40 text-loss/80"
                title="本頁尚未 auth-gated · 您是 visitor / preview state · 想正式註冊 → /login"
              >
                PREVIEW · 您尚未登入
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            {session ? (
              <>
                FREE TIER ·{" "}
                <span className="text-gold">您的 dashboard</span>
              </>
            ) : (
              <>
                FREE TIER 會員儀表板 ·{" "}
                <span className="text-gold">預覽版</span>
              </>
            )}
          </h1>
          {session ? (
            <p className="mt-6 text-mute leading-relaxed max-w-2xl">
              歡迎 · 您正式是{" "}
              <span className="font-mono text-gold">{email}</span>
              {daysSinceJoin !== null && (
                <>
                  {" · "}ZONE 27 第{" "}
                  <span className="font-mono text-gold tabular">
                    {daysSinceJoin}
                  </span>{" "}
                  天 FREE TIER 會員
                </>
              )}{" "}
              · 終身免費 · 永不調漲。
            </p>
          ) : (
            <p className="mt-6 text-mute leading-relaxed max-w-2xl">
              Tim 反覆被問:「會員他們自己的頁面在哪裡?能做什麼?」
              <strong className="text-bone">這頁就是答案的 preview</strong> · 用
              您 localStorage 裡已有的 sim history 當 preview data ·
              不假裝 functionality 已存在。
            </p>
          )}

          {/* ── Round 31 W-M · 5 UNLOCKS PROMINENT GRID ──
              Tim canary fire「會員哩!還是沒辦法享用會員能使用的所有
              功能呀!」 surface visibility blocker · 5 個 FREE TIER
              unlocks 升 prominent · 取代「散在文字裡」 pattern。 上方
              出現在 hero text 後 · welcome flash banner 上方 · 是
              dashboard 主視覺。 logged-in / anonymous 兩 mode 同 grid · 後者點 → /login。 */}
          <div className="mt-8">
            <MemberUnlocksGrid
              authenticated={!!session}
              stats={
                session
                  ? {
                      followsCount: followedMatches.length,
                      notesCount: Object.keys(notesMap).filter((k) => notesMap[k]?.length > 0).length,
                      calibrationDots: followedMatches.filter((m) => m.finalResult).length,
                      daysSinceJoin,
                      reservationNumber: null, // future · pull from get_my_reservation RPC
                    }
                  : undefined
              }
            />
          </div>

          {/* ── Round 30 Wave 5 · Welcome flash + logout · only when session ── */}
          {session && (
            <div className="mt-6 bg-gold/5 border border-gold/50 p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
                <p
                  lang="en"
                  className={`font-mono text-gold text-[10px] tracking-[0.4em] ${
                    justArrived ? "shimmer" : ""
                  }`}
                >
                  {justArrived
                    ? "✓ MAGIC LINK · 登入成功"
                    : "✓ SESSION ACTIVE"}
                </p>
                <div className="flex items-baseline gap-4">
                  <Link
                    href="/member/submit"
                    className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                  >
                    投稿 →
                  </Link>
                  <Link
                    href="/member/calibration"
                    className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                  >
                    mirror →
                  </Link>
                  <form action="/auth/signout" method="post" className="inline">
                    <button
                      type="submit"
                      className="font-mono text-mute hover:text-loss text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                    >
                      登出 →
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-mute/85 text-sm leading-relaxed">
                Session 用 HTTP-only cookies · 直到您點登出 / cookie 過期。
                FREE TIER 解鎖:★ Follow / ✏️ Note / ↗ Submit / 🪞 Calibration
                mirror。
              </p>
            </div>
          )}

          {/* ── Round 30 Wave 6 · FIRST-ACTION ONBOARDING ───
              當 logged-in 但還沒 follow 任何賽事 · 顯示大 CTA「您的第一
              個動作」指 /matches。 Day One「first journal entry」 / Linear
              「create first ticket」 / HEY「write first email」same pattern。
              已 follow 過的 logged-in user 不顯示此 block · 改顯示下方
              follows list。 */}
          {session && followedMatches.length === 0 && (
            <div className="mt-6 bg-slate/40 border-2 border-gold/60 glow-soft p-6 sm:p-8">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3 shimmer"
              >
                / YOUR FIRST ACTION · 第一個動作
              </p>
              <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-4">
                Follow 您的第一場 ZONE 27 賽事
              </h2>
              <p className="text-mute text-sm sm:text-base leading-relaxed mb-5 max-w-2xl">
                您剛註冊 FREE TIER · 但 dashboard 是空的。
                <strong className="text-bone"> Day-1 retention 的黃金一招</strong>
                ·{" "}
                <strong className="text-bone">
                  Follow 一場 ZONE 27 公開預測過的賽事
                </strong>{" "}
                · 賽後 PROVED / DIVERGED 自動進您 dashboard · 您的
                personal calibration mirror 從這場開始累積。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/matches"
                  className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
                >
                  → 今日賽事板 · follow 第一場
                </Link>
                <Link
                  href="/track-record"
                  className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-xs tracking-[0.3em] hover:bg-gold/10 transition-colors"
                >
                  → 引擎過去戰績 ledger
                </Link>
              </div>
              <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] mt-5 leading-relaxed">
                ▸ Follow = explicit 動作 · 不是被動 recommendation algorithm
                <br />
                ▸ 您 follow 哪場是您的事 · 我們不推薦 · 不排名 · 0 tracking
              </p>
            </div>
          )}

          {/* ── Round 30 Wave 5 · CTA to /login if not authenticated ── */}
          {!session && (
            <div className="mt-6 bg-slate/40 border border-gold/40 p-5 sm:p-6">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
              >
                / WANT REAL DASHBOARD?
              </p>
              <p className="text-mute text-sm leading-relaxed mb-4">
                這頁目前是 preview。想<strong className="text-bone">真實註冊
                FREE TIER 會員</strong> · magic link 1 分鐘內收到 · 點開後本頁
                自動變成<strong className="text-bone">您的 dashboard</strong> ·
                Round 30 Wave 5 剛 ship · Phase 1 timeline 從 Q3 加速到 NOW。
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                → /login · magic link 註冊
              </Link>
            </div>
          )}
          <div className="mt-6">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── Round 30 Wave 6 · YOUR FOLLOWED MATCHES ───
            Logged-in 會員 + 有 follow 過時顯示。 每行 = 一場 follow ·
            phase chip + verdict chip(if final)+ score(if final)+
            連結到 /matches/[gameId]。 Endowment Effect cranked — 您
            手動 follow 的 collection · 累積 = 您的 trophy。 */}
        {session && followedMatches.length > 0 && (
          <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
            <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.45em]"
              >
                / YOUR FOLLOWED MATCHES · 您 follow 的 {followedMatches.length} 場
              </p>
              <Link
                href="/matches"
                className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
              >
                + follow 更多 · /matches
              </Link>
            </div>
            <div className="border border-line/60 bg-slate/30">
              {followedMatches.map((m, i) => (
                <FollowedMatchRow
                  key={m.id}
                  match={m}
                  isFirst={i === 0}
                  isLast={i === followedMatches.length - 1}
                  noteLength={notesMap[m.id]?.length ?? 0}
                />
              ))}
            </div>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mt-4 leading-relaxed">
              ▸ 賽後 finalized 的場 · verdict(PROVED ✓ / DIVERGED ✕)在每行顯示
              <br />
              ▸ 您 personal calibration mirror 從這些 followed-and-finalized
              matches 累積{" "}
              <Link
                href="/member/calibration"
                className="text-gold underline-offset-4 hover:underline"
              >
                /member/calibration
              </Link>
            </p>
          </section>
        )}

        {/* ── Round 30 Wave 11b · DELETED MemberDashboardPreview ────
            Agent research deepest call:「strip future-tense scaffolding from
            present-tense pages」 = 4-bias preview block was「preview of a
            dashboard」 · 現在 W6 真實 YOUR FOLLOWED MATCHES + W10 personal
            calibration mirror 已 ship · preview 變 future-tense scaffolding
            on present-tense page · 砍。 Component file 保留(import 移除)· 將
            來如果需要 marketing surface 還可用。 */}

        {/* ── MEMBER SYSTEM, INVERTED · Wave 11b MERGED ──
            Agent Merge #1:原 ✕/✓ blocks + 3-col + deepest call CTA 三 sub-block
            合一。 Stratechery「one core argument per article」· ✕/✓ 跟 3-col
            argue 同一件事兩次 · 砍 ✕/✓ · 留 3-col(視覺主角)+ 1-line quote
            + CTA。 9 sections → 7 sections per Cowan 4-chunk ceiling。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-12 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8 text-center"
          >
            / MEMBER SYSTEM · INVERTED
          </p>

          {/* 3-col concrete brand comparison · 視覺主角保留 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ComparisonCard
              brand="Apple Store 會員"
              type="COMMERCE · 交易史"
              give="付費 + 訂單史"
              get="下次購買更快 · 收藏 · 退換貨"
              reward="重複購買"
              track="全部購買行為 + 設備指紋"
            />
            <ComparisonCard
              brand="Spotify Premium"
              type="CONSUMPTION · 消費史"
              give="月費 + 收聽行為"
              get="更精準推薦 · skip 無上限"
              reward="重複收聽"
              track="全部播放行為 + 跨平台"
            />
            <ComparisonCard
              brand="ZONE 27 會員"
              type="EPISTEMIC · 思辨史"
              give="email + 您自己跑過的 sim"
              get="您歷史的所有權"
              reward="重複思辨"
              track="0 · 寫進 /privacy"
              highlight
            />
          </div>

          {/* Deepest sharp call · 1-line quote + 1-CTA · no elaboration */}
          <div className="mt-10 pt-6 border-t border-gold/30 text-center">
            <p className="text-bone text-lg sm:text-xl font-light tracking-tight leading-snug mb-5 max-w-xl mx-auto">
              不是 feature stack · 是{" "}
              <span className="text-gold">epistemic mirror</span>。
            </p>
            <Link
              href="/member/calibration"
              className="inline-block px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
            >
              → /member/calibration · 看 mirror
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            Auth 已上(Round 30 W5)· Follow 已開(W6)· 雲端 sim sync 還沒
            (per /now UNRESOLVED)。 不假裝 functional 之外的事。
          </p>
          <p>
            任何 timing 偏差在{" "}
            <strong>/changelog git commit diff</strong> 看得到 ·
            沒有「即將推出 · 敬請期待」 · 只有實際的 commit。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/member" />
        {/* sub-component:見檔尾 ComparisonCard */}

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/membership"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← 4-tier ladder 全景 · /membership
            </Link>
            <Link
              href="/now"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              這頁工程現狀 · /now →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// Round 30 Wave 6 · One row in the「您 follow 的賽事」list on /member。
// Server-rendered(no client state needed since auth + follows already
// read server-side)· phase + verdict chip + score(if final)· entire
// row links to /matches/[gameId]。 Endowment Effect visual:gold-tinted
// hover · 每場 felt-as-owned。
function FollowedMatchRow({
  match,
  isFirst,
  isLast,
  noteLength,
}: {
  match: Match;
  isFirst: boolean;
  isLast: boolean;
  noteLength: number;
}) {
  const phase = getMatchPhase(match);
  const calibration = getCalibration(match);
  const fr = match.finalResult;
  const homeFav = match.home.winRate >= match.away.winRate;

  const verdictColor = {
    proved: "text-gold border-gold/60",
    diverged: "text-loss border-loss/60",
    push: "text-mute border-mute/60",
  };
  const verdictLabel = {
    proved: "✓ PROVED",
    diverged: "✕ DIVERGED",
    push: "= PUSH",
  };

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`block px-5 py-4 hover:bg-gold/5 transition-colors ${
        isLast ? "" : "border-b border-line/40"
      } ${isFirst ? "" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-mono text-mute text-[10px] tracking-[0.25em] tabular">
          {match.date} · {match.startTime}
        </p>
        {fr && calibration ? (
          <span
            lang="en"
            className={`font-mono text-[10px] tracking-[0.25em] px-1.5 py-0.5 border ${verdictColor[calibration]}`}
          >
            {verdictLabel[calibration]}
          </span>
        ) : phase === "today-live" ? (
          <span
            lang="en"
            className="font-mono text-[10px] tracking-[0.25em] px-1.5 py-0.5 border border-gold text-gold shimmer"
          >
            LIVE
          </span>
        ) : phase === "today-pregame" ? (
          <span
            lang="en"
            className="font-mono text-[10px] tracking-[0.25em] px-1.5 py-0.5 border border-gold text-gold"
          >
            TODAY · 今晚開賽
          </span>
        ) : phase === "future" ? (
          <span
            lang="en"
            className="font-mono text-[10px] tracking-[0.25em] px-1.5 py-0.5 border border-gold/60 text-gold/80"
          >
            PREVIEW
          </span>
        ) : (
          <span
            lang="en"
            className="font-mono text-[10px] tracking-[0.25em] px-1.5 py-0.5 border border-mute/60 text-mute"
          >
            ARCHIVED
          </span>
        )}
      </div>
      <p className="text-bone text-base sm:text-lg font-light leading-snug">
        <span className={homeFav ? "text-gold" : ""}>{match.home.name}</span>
        <span className="text-mute mx-2 text-xs">vs</span>
        <span className={!homeFav ? "text-gold" : ""}>{match.away.name}</span>
      </p>
      <div className="mt-2 flex items-baseline justify-between flex-wrap gap-2">
        <p className="font-mono text-mute text-[10px] tracking-[0.2em] tabular">
          ENGINE · {homeFav ? match.home.winRate : match.away.winRate}% ·{" "}
          {homeFav ? match.home.en : match.away.en} 領先
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          {noteLength > 0 && (
            <span
              className="font-mono text-gold/80 text-[10px] tracking-[0.2em]"
              title={`您寫了 ${noteLength} 字筆記 · 點開看`}
            >
              ✏️ {noteLength} 字筆記
            </span>
          )}
          {fr ? (
            <p className="font-mono text-bone text-sm tabular">
              FINAL · {fr.homeScore}:{fr.awayScore}
            </p>
          ) : (
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.2em]">
              賽後 receipt 自動入帳
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Round 30 Wave 2 · 3-col member-system comparison card.
// Brand-IP focused · NOT a feature-arms-race。 Each card surfaces 4 axes:
// give/get/reward/track。 Highlight version(ZONE 27)gold-bordered with
// 0 tracking visible as gold cell · 對齊 Footer「FUNDED BY FOUNDERS · NO
// GA · NO PIXEL」inversion brand line。
function ComparisonCard({
  brand,
  type,
  give,
  get,
  reward,
  track,
  highlight = false,
}: {
  brand: string;
  type: string;
  give: string;
  get: string;
  reward: string;
  track: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 border flex flex-col h-full ${
        highlight
          ? "border-gold/60 bg-gold/5 glow-soft"
          : "border-line/50 bg-slate/30"
      }`}
    >
      <p
        lang="en"
        className={`font-mono text-[9px] tracking-[0.25em] mb-2 ${
          highlight ? "text-gold" : "text-mute/70"
        }`}
      >
        {type}
      </p>
      <h3
        className={`text-base sm:text-lg font-light tracking-tight mb-4 ${
          highlight ? "text-gold" : "text-bone"
        }`}
      >
        {brand}
      </h3>
      <dl className="space-y-3 text-xs sm:text-sm">
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            您給他們
          </dt>
          <dd className="text-bone/90 leading-snug">{give}</dd>
        </div>
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            他們給您
          </dt>
          <dd className="text-bone/90 leading-snug">{get}</dd>
        </div>
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            獎勵您的
          </dt>
          <dd className="text-bone/90 leading-snug">{reward}</dd>
        </div>
        <div>
          <dt className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-0.5">
            追蹤您的
          </dt>
          <dd
            className={`leading-snug ${highlight ? "text-gold" : "text-bone/90"}`}
          >
            {track}
          </dd>
        </div>
      </dl>
    </div>
  );
}

// ── computeDaysSinceJoin ───────────────────────────────
// Top-level helper · isolates Date.now() from the async server
// component above so react-hooks/purity lint rule doesn't false-
// flag it. Server-side render uses Date.now() as the request
// timestamp · stable across the render · equivalent semantics
// to a Vercel build/request constant.
function computeDaysSinceJoin(createdAt: string | null): number | null {
  if (!createdAt) return null;
  const created = new Date(createdAt).getTime();
  const nowMs = Date.now();
  return Math.max(1, Math.floor((nowMs - created) / 86_400_000) + 1);
}
