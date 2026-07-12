import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import ChallengeBoard from "@/components/ChallengeBoard";
import { resolveChallenge, type ChallengeMatchModel } from "@/lib/challenge";
import { normalizeProfileCode } from "@/lib/profile-code";
import { creatorIdentity, getTeamCrest } from "@/lib/identity";
import { getEngineConviction, getSoccerLineConviction } from "@/lib/conviction";
import { duelStartLabel } from "@/lib/daily-duel";
import { getTodayTaipei } from "@/lib/matches";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /vs/[code] · 戰帖對決(散播命門 · 2026-06-28)──────────────────
// 真瓶頸是散播不是功能。 站上每張可外傳收據都是廣播(看我的牌 → 換一句讚就死)· 缺的是把分享
// 變成「逼對方回手的戰帖」。 這頁 = 朋友點開戰帖落地的地方:看不到對方押誰、先自己盲押一手、
// 賽後揭盅誰讀得準。 散播(戰帖是天然、不像垃圾訊息的邀請)+ 留存(盲押→揭盅→賽後對帳)一個機制全給。
//
// R294 · 六運動版:選場/解析 lib/challenge(六運動統一 model · 讀現成公開 RPC · 0 migration)·
// 下注掛各運動自己的元件(ChallengeBoard 內分派)· 身分 creatorIdentity + Avatar。
// 朋友未登入 → 下注條登入餌回跳這張戰帖 → /login 已把 Google 一鍵登入擺出來(摩擦歸零)。
//
// 快取:revalidate 60s(公開分享證物 · 不讀 cookies → ISR-safe · 你自己那手 client 端讀)。
// GRACEFUL:碼不合法 / 查無 → 404;有碼但沒可應戰的手 → 誠實空狀態(不假裝有戰帖)。
// ─────────────────────────────────────────────────────

export const revalidate = 60;

type VsParams = Promise<{ code: string }>;
type VsSearch = Promise<{ m?: string | string[] }>;

function readM(sp: { m?: string | string[] }): string | null {
  const m = sp?.m;
  return typeof m === "string" ? m : null;
}

/** 對決卡顯示順序(籃球客先 · 其餘 home/a 先)· 同各運動下注鈕順序。 */
function sidesOf(match: ChallengeMatchModel): {
  left: { name: string; seed: string; en?: string };
  right: { name: string; seed: string; en?: string };
} {
  const home = { name: match.homeName, seed: match.homeSeed, en: match.homeEn };
  const away = { name: match.awayName, seed: match.awaySeed, en: match.awayEn };
  return match.leftIsHome ? { left: home, right: away } : { left: away, right: home };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: VsParams;
  searchParams: VsSearch;
}): Promise<Metadata> {
  const { code: raw } = await params;
  const code = normalizeProfileCode(raw);
  if (!code) return { title: "找不到這張戰帖" };
  const res = await resolveChallenge(code, readM(await searchParams));
  if (!res) return { title: "找不到這張戰帖" };
  const name = res.profile.displayName || `球迷 #${res.profile.authorCode}`;
  const m = res.match;
  const matchup = m
    ? `${sidesOf(m).left.name} vs ${sidesOf(m).right.name}`
    : "";
  return createPageMetadata({
    title: `${name} 下了一張戰帖`,
    description: `${name} 在 ZONE 27 跟機器對賭了${
      matchup ? "「" + matchup + "」" : "一場"
    } · 賽前各自封盤、賽後見真章。 你敢同場較量嗎?點開先自己押一手 —— 看不到對方押誰。`,
    ogDescription: `${name} 下了戰帖${matchup ? " · " + matchup : ""} · 你敢同場較量?`,
    path: `/vs/${code}`,
  });
}

export default async function VsPage({
  params,
  searchParams,
}: {
  params: VsParams;
  searchParams: VsSearch;
}) {
  const { code: raw } = await params;
  const code = normalizeProfileCode(raw);
  if (!code) notFound();

  const res = await resolveChallenge(code, readM(await searchParams));
  if (!res) notFound();

  const ident = creatorIdentity({
    handle: res.profile.handle,
    authorCode: res.profile.authorCode,
    displayName: res.profile.displayName,
  });
  const supporter =
    res.profile.tier === "black" || res.profile.tier === "founder";

  const { match } = res;
  const sides = match ? sidesOf(match) : null;
  const leftFav = !!(match?.engine && sides && match.engine.name === sides.left.name);
  const rightFav = !!(match?.engine && sides && match.engine.name === sides.right.name);
  const leftCrest =
    match && sides ? getTeamCrest(sides.left.name, sides.left.en, match.league) : null;
  const rightCrest =
    match && sides ? getTeamCrest(sides.right.name, sides.right.en, match.league) : null;
  const todayTaipei = getTodayTaipei();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main
        id="main"
        className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-12 pb-24"
      >
        {/* ── 戰帖抬頭 · 是誰下的 ─────────────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
          / 戰帖 · <span lang="en">A DUEL</span>
        </p>
        <div className="flex items-center gap-3 mb-5">
          <Avatar
            seed={ident.seed}
            glyph={ident.glyph}
            supporter={supporter}
            size={40}
          />
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-none">
              {ident.label}
            </h1>
            <p className="mt-1 font-mono text-gold/70 text-[11px] tracking-[0.2em]">
              下了一張戰帖
            </p>
          </div>
        </div>

        {match && sides ? (
          <>
            <p className="text-mute text-sm sm:text-base leading-relaxed mb-7">
              同一場、賽前各自把話講死、賽後自動對帳。 你點開{" "}
              <span className="text-bone">看不到他押誰</span> —— 先自己押一手,賽後才揭盅誰讀得準。
              比的是你的眼光,不是抄誰的單。
            </p>

            {/* ── 對決卡(鏡今日一戰)──────────────────────── */}
            <div className="border border-gold/35 bg-slate/30 p-5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-gold/70 text-[9px] tracking-[0.3em] border border-gold/30 px-1.5 py-0.5">
                  {match.sport === "baseball"
                    ? match.league
                    : `${match.sportLabel} · ${match.league}`}
                </span>
                <span className="font-mono text-mute text-[10px] tracking-[0.2em] tabular shrink-0">
                  {match.startISO
                    ? `${duelStartLabel(match.startISO, todayTaipei)} 開賽`
                    : ""}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    seed={sides.left.seed}
                    glyph={leftCrest?.glyph}
                    color={leftCrest?.color}
                    size={30}
                  />
                  <span
                    className={`text-lg sm:text-xl font-light tracking-tight truncate ${
                      leftFav ? "text-gold" : "text-bone"
                    }`}
                  >
                    {sides.left.name}
                  </span>
                </span>
                <span className="font-mono text-mute/50 text-xs shrink-0">
                  vs
                </span>
                <span className="flex items-center gap-2.5 min-w-0 justify-end">
                  <span
                    className={`text-lg sm:text-xl font-light tracking-tight truncate text-right ${
                      rightFav ? "text-gold" : "text-bone"
                    }`}
                  >
                    {sides.right.name}
                  </span>
                  <Avatar
                    seed={sides.right.seed}
                    glyph={rightCrest?.glyph}
                    color={rightCrest?.color}
                    size={30}
                  />
                </span>
              </div>

              {/* 機器已鎖死的一手(公開 · 不是 challenger 那手 · challenger 那手在下方盲押後才揭)。 */}
              {match.engine && (
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-gold/85 text-[11px] tracking-[0.1em] leading-relaxed border-t border-gold/15 pt-3">
                  <span aria-hidden="true" className="text-gold/70">
                    ▦
                  </span>
                  <span>
                    機器已鎖{" "}
                    <span className="text-gold tabular">
                      {match.engine.name} {match.engine.pct}%
                    </span>{" "}
                    {/* 足球三向線走三向尺(同 /today 對決卡 · R296 碼審修:同一手兩個門面
                        不准兩種口氣 —— 48/27/25 在這裡也是重壓不是銅板局)。 */}
                    · {(match.soccerPcts
                      ? getSoccerLineConviction(match.engine.pct, match.soccerPcts)
                      : getEngineConviction(match.engine.pct)
                    ).label}{" "}
                    · 賽前不翻牌
                  </span>
                  {match.soccerPcts && (
                    <span className="text-mute/60 tabular">
                      主 {match.soccerPcts.homeWin} · 和 {match.soccerPcts.draw} · 客{" "}
                      {match.soccerPcts.awayWin}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* 盲押 → 揭盅 → 賽後對帳(client 島 · 內部按運動掛下注元件)。 */}
            <ChallengeBoard
              code={code}
              sport={match.sport}
              matchId={match.id}
              homeName={match.homeName}
              awayName={match.awayName}
              startISO={match.startISO}
              engineHomePct={match.engineHomePct ?? undefined}
              challengerLabel={ident.label}
              challengerPick={res.challengerPick}
              winner={match.winner}
              phase={res.phase ?? "pregame"}
              engine={
                match.engine
                  ? {
                      name: match.engine.name,
                      pct: match.engine.pct,
                      // stored 空間反查(R295 機器嘴):engine.name 由 resolveModel 產,
                      // 一定是 homeName / awayName / 和局 三者之一。
                      pick:
                        match.engine.name === match.homeName
                          ? "home"
                          : match.engine.name === match.awayName
                            ? "away"
                            : "draw",
                    }
                  : undefined
              }
            />

            <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.2em]">
              <Link
                href={`/u/${code}`}
                className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                看 {ident.label} 的公開戰績 →
              </Link>
              <Link
                href="/today"
                className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                換你開一張 · 今日一戰 →
              </Link>
            </p>
          </>
        ) : (
          // ── 有碼但沒可應戰的手(他還沒押、或都已開賽/結算且資料過舊)· 誠實空狀態 ──
          <div className="border border-line/60 bg-slate/30 p-5">
            <p className="text-bone text-base sm:text-lg font-light leading-snug mb-2">
              這張戰帖現在沒有可應戰的場。
            </p>
            <p className="text-mute text-sm leading-relaxed">
              可能是 {ident.label} 還沒鎖今天的一手,或這場已經開打了(賽前才收應戰)。
              你可以先看看他的公開戰績,或自己站到機器對面開一張。
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.2em]">
              <Link
                href={`/u/${code}`}
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                看 {ident.label} 的公開戰績 →
              </Link>
              <Link
                href="/today"
                className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                今日一戰 · 你 vs 機器 →
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
