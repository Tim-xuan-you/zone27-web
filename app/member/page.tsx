import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WalletPanel from "@/components/WalletPanel";
import { getUser } from "@/lib/supabase/server";
import { aggregateIdentity, aggregateStreak } from "@/lib/predictions";
import { getMyPredictionsMap } from "@/lib/predictions-server";
import {
  getTodayAndFutureMatches,
  getMatchPhase,
  getMatchStartIso,
  getEngineFavorite,
  getCurrentTaipeiMonthKey,
  getTodayTaipei,
  matches as allMatches,
} from "@/lib/matches";
import CalibrationIdentityCard from "@/components/CalibrationIdentityCard";
import HonorWall from "@/components/HonorWall";
import DisciplineStreak from "@/components/DisciplineStreak";
import { readTier, isPaid, creatorTakePct, tierLabel } from "@/lib/tier";
import OpenPositionCard, { type OpenPosition } from "@/components/OpenPositionCard";
import MyCreatorPanel from "@/components/MyCreatorPanel";
import DisplayNameSetting from "@/components/DisplayNameSetting";
import { SUPPORT_EMAIL } from "@/lib/brand-constants";
import { readDisplayName } from "@/lib/identity";
import { getMlbAsMatches } from "@/lib/mlb-matches";
import { createHash } from "crypto";

export const metadata: Metadata = {
  title: "你的儀表板",
  description: "你的準度 · 你 vs 引擎 · 今晚可以押的賽事。終身免費。",
};

// ── ZONE 27 · /member · 會員自己的儀表板 ─────────────────
// R183 NUCLEAR · Tim canary fire(mobile screenshot):「亂七八糟 · 划不到底 ·
// 寫一堆沒必要的東西 · 這是會員自己的介面 · 極簡再極簡 · go Polymarket go」。
//
// 砍掉所有行銷/哲學/說明文(PaidTierLockedGrid 推銷、Apple/Spotify 對照、
// localStorage 清單、創辦人簽名、5 大解鎖格、MemberHomeHero、DailyBrief、
// 招募 essay)。會員登入後只想看三樣:
//   1. 我準不準(你 vs 引擎 · THE number)
//   2. 今晚可以押什麼(一鍵進場)
//   3. 登出
// 招募 bar(StickyFoundersCTA)+ 創始編號 strip(ScarcityStrip)已在
// /member 隱藏 — 不對已是會員的人推入會。
// ─────────────────────────────────────────────────────

// "2026 · 06 · 03 · 星期三" → "06/03"(未結算押注卡只在未來場顯示日期)
function compactDate(dateStr: string): string {
  const parts = dateStr.split("·").map((s) => s.trim());
  return parts.length >= 3 && parts[1] && parts[2]
    ? `${parts[1]}/${parts[2]}`
    : "";
}

// 持倉排序:進行中 → 今晚待開 → 未來(最急的在最上面)
function phaseRank(phase: OpenPosition["phase"]): number {
  return phase === "today-live" ? 0 : phase === "today-pregame" ? 1 : 2;
}

export default async function MemberPage() {
  // getUser() re-validates with Supabase auth server(JWT verify)· 渲染會員
  // 自己的 email / tier / 資料屬於 trust-critical · 不可用可偽造的 getSession()。
  const user = await getUser();

  // 未登入 → 一頁式登入邀請(不再是長預覽)
  if (!user) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Nav active="member" />
        <main id="main" className="flex-1 flex items-center">
          <section className="mx-auto max-w-md w-full px-6 sm:px-10 py-24 text-center">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
              / 會員儀表板
            </p>
            <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
              登入看<span className="text-gold">你的準度</span>
            </h1>
            <p className="mt-5 text-mute leading-relaxed">
              你押過的場、你跟引擎誰準,登入後都在這裡。終身免費。
            </p>
            <Link
              href="/login?next=/member"
              className="mt-7 inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              登入 / 註冊 →
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = (user.user_metadata ?? null) as Record<string, unknown> | null;
  const tier = readTier(meta);
  const tierZh = `${tierLabel(tier)} 會員`;
  // 公開身分:顯示名(會員自填 · opt-in)否則匿名代號「球迷 #hash」。
  // anonHandle 的 md5 必須跟 SQL 的 md5(user_id::text) 一致 → 頭像、署名同一張臉。
  const displayName = readDisplayName(meta);
  const anonHandle =
    "球迷 #" + createHash("md5").update(user.id).digest("hex").slice(0, 8);

  const predictionsMap = await getMyPredictionsMap();
  // R198 · 併 MLB(全套):押 MLB 也計進你 vs 引擎準度 + 顯示為未結算持倉。
  const mlbMatches = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbMatches];
  // 個人校準身分:你的紀錄(含輸)+ 對比亂猜 + 同場 你 vs 引擎 + 本月升階閘門。
  // engineFav 走 getEngineFavorite()(50/50 真銅板局回 null · 不灌引擎水)。
  const identity = aggregateIdentity(
    predictionsMap,
    allWithMlb.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: getEngineFavorite(m),
      startISO: getMatchStartIso(m),
    })),
    getCurrentTaipeiMonthKey()
  );

  // 對帳紀律 streak(soul-roadmap #2)· 連續性按「下注日」的台北日曆日算(見
  // aggregateStreak 註解:下注日 ≠ 比賽日 · 衡量你哪幾天回來面對帳本)。
  const streak = aggregateStreak(predictionsMap, getTodayTaipei());

  // 你的未結算押注(the live middle · soul)· 你押過、還沒結算的場 —— 押下去到
  // 打完之間那段以前 /member 一片空白。 你 vs 引擎 vs 群眾 的張力撐住「我現在
  // 有一手在賭」。 LIVE 場(getMatchPhase today-live)多一道呼吸金線。
  const openPositions: OpenPosition[] = allWithMlb
    .map((m): OpenPosition | null => {
      const entry = predictionsMap[m.id];
      // table 只存 home/away · 但 map 型別保留舊的 "skip" · skip 不是一手持倉
      if (!entry || (entry.pick !== "home" && entry.pick !== "away")) return null;
      const phase = getMatchPhase(m);
      if (
        phase !== "today-live" &&
        phase !== "today-pregame" &&
        phase !== "future"
      ) {
        return null;
      }
      return {
        matchId: m.id,
        homeName: m.home.name,
        awayName: m.away.name,
        startTime: m.startTime,
        dateLabel: compactDate(m.date),
        myPick: entry.pick,
        engineHomePicked: m.home.winRate >= m.away.winRate,
        engineConfidence: Math.max(m.home.winRate, m.away.winRate),
        phase,
      };
    })
    .filter((p): p is OpenPosition => p !== null)
    .sort((a, b) => phaseRank(a.phase) - phaseRank(b.phase));
  const heldIds = new Set(openPositions.map((p) => p.matchId));

  // 今晚 + 即將(同首頁 getTodayAndFutureMatches · 已排除已結算)· 修會員 vs 訪客
  // 不對等的 bug:原本只抓「今天」· 休賽日但明後天有排賽時,登入會員看到死路
  // (track-record / lab),沒登入的人在首頁卻看得到、還能先押 = 高意願的會員反而
  // 拿到比較差的答案。 改抓今天+未來,跟首頁同一份資料。
  // 已押的場移到上方「你的未結算押注」· 這裡只留「還沒押」的,不重複。
  const upcoming = getTodayAndFutureMatches().filter((m) => !heldIds.has(m.id));

  // 創作者後台:付費會員傳輕量賽事清單給 MyCreatorPanel(client 端撈我在每場的分析)。
  const creatorCheckMatches = isPaid(tier)
    ? allMatches.map((m) => ({
        id: m.id,
        homeName: m.home.name,
        awayName: m.away.name,
        finalWinner: m.finalResult?.winner ?? null,
        dateLabel: compactDate(m.date),
      }))
    : [];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />

      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-10 pb-24">
        {/* 1 · 身分列 · 頭像 + 公開名(可改)+ tier + 登出 ──────
            Tim dogfood「球迷#hash 不知道是誰 · 能自己設名嗎」→ 頭像 + 改名 inline。
            預設一行(守極簡)· 點「改名」才展開。 */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <DisplayNameSetting
            initialName={displayName}
            anonHandle={anonHandle}
            tierLabel={tierZh}
          />
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="font-mono text-mute/70 hover:text-bone text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
            >
              登出
            </button>
          </form>
        </div>

        {/* 1.5 · 你的未結算押注 · the live middle(soul)· 只在有持倉時出現 ──
            押下去到打完之間那段 —— 你 vs 引擎 vs 群眾。 放在準度數字之上,因為
            這是你今天回來的理由(動態 · 時效)· 沒持倉時自動隱藏,準度數字遞補為首。 */}
        {openPositions.length > 0 && (
          <section className="mt-8">
            <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
              你的未結算押注
            </p>
            <div className="flex flex-col gap-3">
              {openPositions.map((p) => (
                <OpenPositionCard key={p.matchId} position={p} />
              ))}
            </div>
          </section>
        )}

        {/* 2 · 你的校準身分 · 含輸帳本 · 你 vs 亂猜 vs 引擎 + 本月升階閘門 ──
            「有帳本的玩運彩」脊椎(soul-roadmap #1)· 計算在 aggregateIdentity。 */}
        <CalibrationIdentityCard identity={identity} />

        {/* 3 · 你的榮譽牆(soul-roadmap #5 · 「靠誠實賺來的地位」三樓第一塊)· 章全部
            從含輸帳本自動算 · 報馬仔掛不出 · Apple 紀律只放 5 個 · 框 mute 不搶校準卡主角。 */}
        <HonorWall identity={identity} />

        {/* 3.5 · 對帳紀律 streak(soul-roadmap #2 · 「交易員紀律」鏡子)· 接在榮譽牆後當
            三樓 status 配角 · mute 不搶校準卡金色主角 · 沒對帳過自動隱藏(計算同單一真相)。 */}
        <DisciplineStreak streak={streak} />

        {/* 升級入口 · 路要看得見(Apple:付費路徑永遠不藏)· 但這是會員自己的介面 ·
            不對他推銷、不打「賺錢」· 接著上面的榮譽牆 → 用「身分/地位」當主軸(paid=身分
            非功能)· 賣分析變現降成括號副利 · 價格/方案在 /membership 不在這裡轟炸。 */}
        {!isPaid(tier) && (
          <Link
            href="/membership"
            className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
          >
            <span className="text-mute text-sm leading-snug">
              想把<span className="text-bone">準度變成身分</span>?升級 BLACK / GOLD(分析還能標價賣 · 你拿 90–95%)
            </span>
            <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
              看方案 →
            </span>
          </Link>
        )}

        {/* 點數錢包 · 儲值 → 買別人的付費分析(0009)· 跟「升級賣分析」是兩回事 */}
        <WalletPanel />

        {/* 你的分析 · 創作者後台(付費會員 · 沒發過分析自動隱藏)· Tim dogfood:
            「看不到我發了哪些文章/幾勝幾敗/有人回嗎」· 答 #1 #5 #7 */}
        {isPaid(tier) && <MyCreatorPanel matches={creatorCheckMatches} />}

        {/* 3 · 今晚可以押 ───────────────────────────── */}
        <section className="mt-6">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
            {upcoming.length > 0 ? "接下來可以押" : "今天賽事"}
          </p>
          {upcoming.length > 0 ? (
            <div className="border border-line/60 bg-slate/30">
              {upcoming.map((m, i) => {
                const homeFav = m.home.winRate >= m.away.winRate;
                return (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-gold/5 transition-colors ${
                      i === upcoming.length - 1 ? "" : "border-b border-line/40"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-bone text-sm sm:text-base font-light leading-snug truncate">
                        <span className={homeFav ? "text-gold" : ""}>{m.home.name}</span>
                        <span className="text-mute/60 mx-1.5 text-xs">vs</span>
                        <span className={!homeFav ? "text-gold" : ""}>{m.away.name}</span>
                      </p>
                      <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] mt-1 tabular">
                        {m.startTime} · 引擎看好 {homeFav ? m.home.name : m.away.name}{" "}
                        {Math.max(m.home.winRate, m.away.winRate)}%
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-gold/70 text-[10px] tracking-[0.3em]">
                      押 →
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border border-line/60 bg-slate/30 p-5">
              <p className="text-mute text-sm leading-relaxed mb-4">
                目前沒有排定的 CPBL 賽事。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/track-record"
                  className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                >
                  看引擎戰績 →
                </Link>
                <Link
                  href="/lab/custom"
                  className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                >
                  自己跑模擬 →
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* 4 · 付費會員 → 你已解鎖賣分析 · 直接去發文(免費會員看上面升級卡)*/}
        {isPaid(tier) && (
          <p className="mt-10 text-center font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
            你已解鎖賣分析 · 賣出你拿 {creatorTakePct(tier)}%{" "}
            <Link
              href={upcoming.length > 0 ? `/matches/${upcoming[0].id}#say` : "/matches"}
              className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
            >
              去發一篇 →
            </Link>
          </p>
        )}

        {/* 聯絡站長 · Tim dogfood:會員找不到「怎麼聯絡站長」· 直接 mailto Tim 個人 inbox */}
        <p className="mt-10 text-center font-mono text-mute/50 text-[10px] tracking-[0.2em] leading-relaxed">
          有問題、想回報、或要找站長?{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-gold/70 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            聯絡 Tim →
          </a>
        </p>
      </main>

      <Footer />
    </div>
  );
}
