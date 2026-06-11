import Link from "next/link";
import Avatar from "@/components/Avatar";
import ProfileShareCard from "@/components/ProfileShareCard";
import { creatorIdentity } from "@/lib/identity";
import { isPaid } from "@/lib/tier";
import { monthLabel } from "@/lib/season-recap";
import type { SeasonHighlights } from "@/lib/season-recap";
import type { CalibrationIdentity } from "@/lib/predictions";
import type { SoccerRecord } from "@/lib/soccer/predictions";
import type { PublicProfile } from "@/lib/profile-server";
import type { Trophy } from "@/lib/trophies";

// ── ZONE 27 · 賽季回顧(月度 · Spotify-Wrapped 誠實版)──────────────────────
// /u/[code]/season/[YYYY-MM] 的主體。 公開檔 /u/[code] 是「整本帳的證物」· 這裡是
// 「單月的故事」:這個月你多準(含輸)· 最漂亮一手 + 一筆誠實失手 · 回來對帳幾天。
//
// 🔴 紅線(同 ProfileView):暗金 · 無紅綠(輸用 loss 柔紅)· 無 emoji(✓✕ 是站上收據
//   字彙)· 純中文 · 校準排非 PnL · 含輸照算 · 絕不只選贏(highlights 一定含一筆失手)·
//   不慶祝式賭場語氣(「你超神!」)· 付費身分金環次於校準大數字。 0 client JS(純展示)。
// ─────────────────────────────────────────────────────

type Props = {
  profile: PublicProfile;
  period: string; // "2026-06"
  /** 本月棒球校準身分(已按月切片的 picks 餵 aggregateIdentity) */
  identity: CalibrationIdentity;
  /** 本月足球戰績(已按月切片的 picks 餵 gradeSoccerPicks) */
  soccer: SoccerRecord;
  highlights: SeasonHighlights;
  /** 本月回來對帳的不同台北日數 */
  activeDays: number;
  /** 本月有沒有任何押注(false → 尊嚴空狀態) */
  hasActivity: boolean;
};

export default function SeasonRecapView({
  profile,
  period,
  identity: id,
  soccer,
  highlights,
  activeDays,
  hasActivity,
}: Props) {
  const who = creatorIdentity({
    handle: profile.handle,
    authorCode: profile.authorCode,
    displayName: profile.displayName,
  });
  const label = monthLabel(period);

  const hasBaseball = id.total > 0;
  const hasSoccer = soccer.n > 0 || soccer.pending > 0 || soccer.late > 0;
  const hasDecided = id.accuracy !== null;
  const showEdge =
    id.edgeVsEnginePts !== null && id.engine.decided > 0 && id.decided > 0;
  const highlightCount =
    (highlights.best ? 1 : 0) + (highlights.miss ? 1 : 0);

  return (
    <div className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
      {/* ── 身分列 + 月份 ──────────────────────────────────── */}
      <header className="flex items-center gap-4">
        <Avatar
          seed={who.seed}
          glyph={who.glyph}
          size={56}
          supporter={isPaid(profile.tier)}
        />
        <div className="min-w-0">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-1">
            {label} · 回顧
          </p>
          <h1 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight truncate">
            {who.label}
          </h1>
          {who.code && (
            <span className="font-mono text-gold/70 text-[11px] tracking-[0.2em] tabular">
              {who.code}
            </span>
          )}
        </div>
      </header>

      <div className="zone27-rule max-w-[300px] mt-6" aria-hidden="true" />

      {/* ── 尊嚴空狀態(這個月沒鎖任何一手)──────────────────────── */}
      {!hasActivity && (
        <section className="mt-9 bg-slate/40 border border-gold/30 p-6 sm:p-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            {label}
          </p>
          <p className="text-bone text-lg leading-relaxed">
            這個月還沒鎖任何一手。
          </p>
          <p className="mt-2 text-mute text-sm leading-relaxed">
            回顧只記你真的鎖過的 —— 賽前鎖死、含贏含輸、刪不掉。 哪個月有押,
            那個月就會有一份。
          </p>
          <p className="mt-4">
            <Link
              href={`/u/${profile.authorCode}`}
              className="font-mono text-gold/80 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
            >
              看完整帳本 →
            </Link>
          </p>
        </section>
      )}

      {hasActivity && (
        <>
          {/* ── 本月棒球 · 含輸命中率 ──────────────────────────── */}
          {hasBaseball && (
            <section className="mt-9 bg-slate/40 border border-gold/30 p-6 sm:p-8">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
                本月棒球 · 含輸命中率
              </p>
              <div className="flex items-baseline gap-3">
                {hasDecided ? (
                  <span className="font-mono text-gold text-6xl sm:text-7xl font-light tracking-tight tabular">
                    {id.accuracy}
                    <span className="text-2xl opacity-60 ml-1">%</span>
                  </span>
                ) : (
                  <span className="font-mono text-bone text-4xl sm:text-5xl font-light tracking-tight tabular">
                    {id.total}
                    <span className="font-sans text-mute text-xl ml-2">
                      手鎖在這個月
                    </span>
                  </span>
                )}
              </div>

              <p className="mt-4 text-bone text-base leading-relaxed">
                這個月押了{" "}
                <span className="font-mono text-gold tabular">{id.total}</span> 場 ·{" "}
                <span className="font-mono text-gold tabular">✓{id.proved}</span> 中 ·{" "}
                <span className="font-mono text-loss/85 tabular">✕{id.diverged}</span>{" "}
                沒中
                {id.push > 0 && (
                  <>
                    {" "}· <span className="font-mono text-mute tabular">={id.push}</span> 平
                  </>
                )}
                {id.pending > 0 && (
                  <span className="text-mute/70 text-sm"> · {id.pending} 場待開</span>
                )}
              </p>

              {showEdge && (
                <div className="mt-5 pt-4 border-t border-line/40">
                  {id.edgeVsEnginePts! > 0 ? (
                    <p className="text-bone text-sm sm:text-base leading-relaxed">
                      同這 {id.engine.decided} 場 · 你比公開引擎準{" "}
                      <span className="font-mono text-gold tabular text-lg">
                        +{id.edgeVsEnginePts}
                      </span>{" "}
                      個百分點。
                    </p>
                  ) : id.edgeVsEnginePts === 0 ? (
                    <p className="text-bone text-sm sm:text-base leading-relaxed">
                      同這 {id.engine.decided} 場 · 你跟公開引擎{" "}
                      <span className="text-gold">一樣準</span>。
                    </p>
                  ) : (
                    <p className="text-bone text-sm sm:text-base leading-relaxed">
                      同這 {id.engine.decided} 場 · 你比公開引擎低{" "}
                      <span className="font-mono text-loss/85 tabular text-lg">
                        {-id.edgeVsEnginePts!}
                      </span>{" "}
                      個百分點 —— 連這個也不藏。
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── 本月足球(三向 · 含輸 · 跟棒球分開算)─────────────── */}
          {hasSoccer && (
            <section className="mt-6 bg-slate/40 border border-gold/30 p-5 sm:p-6">
              <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-2">
                本月足球 · 含輸命中率
              </p>
              {soccer.n > 0 ? (
                <p className="text-bone text-lg sm:text-xl font-light tracking-tight">
                  <span className="text-gold tabular">{soccer.rate}%</span> 準 ·{" "}
                  <span className="text-gold tabular">✓{soccer.hits}</span>{" "}
                  <span className="text-loss tabular">✕{soccer.misses}</span>
                  <span className="text-mute/60 text-sm"> · {soccer.n} 場已結算</span>
                  {soccer.pending > 0 && (
                    <span className="text-mute/50 text-sm">
                      {" "}· {soccer.pending} 場進行中
                    </span>
                  )}
                </p>
              ) : soccer.pending > 0 ? (
                <p className="text-bone text-base font-light leading-snug">
                  押了 <span className="text-gold tabular">{soccer.pending}</span> 場 ·
                  <span className="text-mute/70">
                    {" "}都還沒結算 —— 賽後自動掛準 / 不準,連輸的也留著
                  </span>
                </p>
              ) : null}
              {/* 晚押誠實剔除(同 /u SoccerSection · 無聲消失比剔除更傷信任 · 同一把尺)。
                  這也修掉「只有晚押」時上面兩個分支都不顯示 = 空區塊的邊界 bug。 */}
              {soccer.late > 0 && (
                <p className="mt-2 font-mono text-mute/55 text-[10px] tracking-[0.12em] leading-snug">
                  {soccer.late} 場開賽後才押 · 不計入戰績(先鎖後結 · 開賽前押的才算數)
                </p>
              )}
            </section>
          )}

          {/* ── 本月紀律(回來對帳幾天 · 非連勝)──────────────────── */}
          <section className="mt-6 border-l-2 border-gold/50 pl-4 py-1">
            <p className="text-mute/90 text-[13px] sm:text-sm leading-relaxed">
              這個月回來對帳{" "}
              <span className="font-mono text-gold tabular">{activeDays}</span> 天 ——
              <span className="text-bone"> 面對自己的帳本</span>(含贏含輸),
              不是連勝幾場。 紀律,不是運氣。
            </p>
          </section>

          {/* ── 本月高光 · 最漂亮一手 + 一筆誠實失手 ──────────────── */}
          {(highlights.best || highlights.miss) && (
            <section className="mt-9">
              <p className="font-mono text-gold/80 text-[10px] tracking-[0.4em] mb-1.5">
                本月高光 · 賽前鎖死的{highlightCount === 2 ? "兩手" : "一手"}
              </p>
              <p className="text-mute/70 text-[13px] leading-relaxed mb-4 max-w-xl">
                {highlights.miss ? (
                  <>
                    {highlights.best ? "一手最漂亮、一筆沒中 —— " : ""}含贏含輸,
                    <span className="text-gold">敢留輸的</span>,賣明牌的攤不出來。
                  </>
                ) : (
                  <>這個月最漂亮的一手 —— 賽前鎖死、賽後自動掛準。</>
                )}
              </p>
              <div className="flex flex-col gap-3">
                {highlights.best && (
                  <HighlightRow trophy={highlights.best} kind="best" />
                )}
                {highlights.miss && (
                  <HighlightRow trophy={highlights.miss} kind="miss" />
                )}
              </div>
            </section>
          )}

          {/* ── 分享卡(把這份回顧傳出去 · 自動帶月度收據 OG)──────── */}
          <div className="mt-9">
            <ProfileShareCard
              code={profile.authorCode}
              path={`/u/${profile.authorCode}/season/${period}`}
              heading="這份回顧"
              shareTitle={`ZONE 27 · 我的 ${label} 回顧`}
              shareText={`我的 ${label} 戰績:賽前鎖死、含贏含輸、刪不掉。`}
              previewHref={`/u/${profile.authorCode}/season/${period}/opengraph-image`}
            />
          </div>

          {/* ── 回完整帳本 ──────────────────────────────────── */}
          <section className="mt-8 text-center">
            <Link
              href={`/u/${profile.authorCode}`}
              className="font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              看完整帳本(全期含輸戰績)→
            </Link>
          </section>
        </>
      )}
    </div>
  );
}

// ── 高光單行 · 一張賽前鎖死的 call(連單場收據)────────────────────────────
function HighlightRow({
  trophy: t,
  kind,
}: {
  trophy: Trophy;
  kind: "best" | "miss";
}) {
  const c = t.card;
  const pickName =
    t.pick === "home" ? c.home : t.pick === "away" ? c.away : "和局";
  const tagLine =
    kind === "best"
      ? t.upset
        ? "逆風 · 押了引擎沒看好的一邊,對了"
        : "命中"
      : "沒中 · 留著";

  return (
    <Link
      href={`/receipts/${c.id}`}
      className="flex items-center justify-between gap-3 p-3 sm:p-3.5 border border-line/60 bg-slate/30 hover:border-gold/40 hover:bg-slate/40 transition-colors"
    >
      <span className="min-w-0">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span
            className={`font-mono text-[8px] tracking-[0.2em] px-1.5 py-0.5 border ${
              kind === "best"
                ? "border-gold/60 text-gold"
                : "border-loss/60 text-loss/85"
            }`}
          >
            {kind === "best" ? "最漂亮" : "誠實一筆"}
          </span>
          <span className="font-mono text-mute/55 text-[9px] tracking-[0.15em]">
            {c.tag} · {c.dateLabel}
          </span>
        </span>
        <span className="block text-bone text-sm font-light tracking-tight mt-1 truncate">
          {c.away}
          <span className="text-mute/50"> @ </span>
          {c.home}
        </span>
        <span className="block font-mono text-mute/70 text-[10px] tracking-[0.12em] mt-0.5">
          你押 <span className="text-bone">{pickName}</span> · {tagLine}
        </span>
      </span>
      <span
        className={`shrink-0 font-mono text-[10px] tracking-[0.2em] px-1.5 py-0.5 border ${
          t.hit ? "border-gold text-gold" : "border-loss/70 text-loss"
        }`}
      >
        {t.hit ? "✓ 中" : "✕ 沒中"}
      </span>
    </Link>
  );
}
