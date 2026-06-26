import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { getUser } from "@/lib/supabase/server";
import {
  aggregateIdentity,
  aggregateStreak,
  computeAccuracySeries,
  computeSettlementDelta,
  readLastSeenFromMeta,
} from "@/lib/predictions";
import { getMyPredictionsMap } from "@/lib/predictions-server";
import { baseballPropIdMatches } from "@/lib/baseball-totals";
import {
  getMatchPhase,
  getMatchStartIso,
  getEngineFavorite,
  getCurrentTaipeiMonthKey,
  getTodayTaipei,
  matches as allMatches,
} from "@/lib/matches";
import CalibrationIdentityCard from "@/components/CalibrationIdentityCard";
import ReturnedWhileAwayCard from "@/components/ReturnedWhileAwayCard";
import ExportLedgerButton from "@/components/ExportLedgerButton";
import HonorWall from "@/components/HonorWall";
import ProfileShareCard from "@/components/ProfileShareCard";
import SoccerRecordCard from "@/components/SoccerRecordCard";
import TennisRecordCard from "@/components/TennisRecordCard";
import { tennisResults, tennisEnginePicks } from "@/lib/tennis/matches";
import BadmintonRecordCard from "@/components/BadmintonRecordCard";
import { badmintonResults, badmintonEnginePicks } from "@/lib/badminton/matches";
import MmaRecordCard from "@/components/MmaRecordCard";
import { mmaResults, mmaEnginePicks } from "@/lib/mma/matches";
import CalibrationMasterCard from "@/components/CalibrationMasterCard";
import type { CalibrationResult } from "@/lib/calibration-master";
import { getSoccerLedgerResults } from "@/lib/soccer/football-data";
import { getSoccerEnginePicksAll } from "@/lib/soccer/locked";
import { isPaid, tierLabel } from "@/lib/tier";
import { effectiveTier } from "@/lib/membership";
import MembershipStatus from "@/components/MembershipStatus";
import { reckoningStar, credentialHeadline, RECKONING_STAR_MIN } from "@/lib/reckoning-star";
import ReckoningStarMark from "@/components/ReckoningStarMark";
import CredentialGrabPanel from "@/components/CredentialGrabPanel";
import OpenPositionsPanel from "@/components/OpenPositionsPanel";
import TodayStrip from "@/components/TodayStrip";
import PushToggle from "@/components/PushToggle";
import { buildOpenPositions, compactDate } from "@/lib/open-positions";
import MyCreatorPanel from "@/components/MyCreatorPanel";
import MyActivityPanel from "@/components/MyActivityPanel";
import { getMyComments } from "@/lib/creator-activity-server";
import DisplayNameSetting from "@/components/DisplayNameSetting";
import NicknamePrompt from "@/components/NicknamePrompt";
import { hasMonthActivity, monthLabel } from "@/lib/season-recap";
import { SUPPORT_EMAIL } from "@/lib/brand-constants";
import { readDisplayName, getTeamCrest } from "@/lib/identity";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { createHash } from "crypto";
import Disclosure from "@/components/Disclosure";

export const metadata: Metadata = {
  title: "你的儀表板",
  description: "你的準度 · 你 vs 引擎 · 接下來可以押的賽事。終身免費。",
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

// compactDate / phaseRank / openPositions 建構已抽到 lib/open-positions.ts(與 /member/collection
// 共用同一份「你的未結算押注」邏輯 · 單一真相不漂移)· compactDate 仍 import 給下方創作者清單用。

// R241 收納:會員頁「接下來可以押」最多露幾場 · 其餘導回 /matches(會員頁=我的資料+下一步,
// 不重造賽事看板)。 露的是最快開賽的 6 場 = 最 actionable(upcoming 已按開賽時間排)。
const MEMBER_UPCOMING_MAX = 6;

// R241 收納:區塊白話小標 · 同站上既有 eyebrow 視覺語彙 · mt-10 與上一群拉開。
// 🔴 用它的群組,標頭必須跟「該組至少一個 child 會 render」一起 gate(防空標頭破 graceful)。
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-gold/60 text-[10px] tracking-[0.4em] mt-10 mb-3">
      {children}
    </p>
  );
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
            {/* 冷訪客的「先搞懂再登入」軟入口 · /learn 本來只在 ⌘K 找得到(R220 稽核)。 */}
            <p className="mt-5 font-mono text-mute/60 text-[10px] tracking-[0.2em] leading-relaxed">
              第一次來?{" "}
              <Link
                href="/learn"
                className="text-gold/75 hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                5 分鐘看懂這在玩什麼 →
              </Link>
            </p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = (user.user_metadata ?? null) as Record<string, unknown> | null;
  // effectiveTier = 即時生效的 tier:BLACK 到期 → 自動當免費(等級字/金環/房間入口/升級邀請全自動回退)·
  // 不用 Tim 手動降級、也不收錢。 到期卡仍由 MembershipStatus(讀原始 meta)顯示「支持期已到 · 想續再轉一次」。
  const tier = effectiveTier(meta);
  const tierZh = `${tierLabel(tier)} 會員`;
  // 公開身分:顯示名(會員自填 · opt-in)否則匿名代號「球迷 #hash」。
  // anonHandle 的 md5 必須跟 SQL 的 md5(user_id::text) 一致 → 頭像、署名同一張臉。
  const displayName = readDisplayName(meta);
  // 永久碼(md5(uid) 前 8 碼)· 同 SQL z27_author_code · 公開檔案 /u/[code] 的 URL key。
  const authorCode = createHash("md5").update(user.id).digest("hex").slice(0, 8);
  const anonHandle = "球迷 #" + authorCode;

  const predictionsMap = await getMyPredictionsMap();
  // R198 · 併 MLB(全套):押 MLB 也計進你 vs 引擎準度 + 顯示為未結算持倉。
  const mlbMatches = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbMatches];
  // 你的足球戰績(含輸 · 跟棒球分開算)· 公開賽後結果(ISR 快取 · 與 /soccer 共用)·
  // 本人 picks 由 SoccerRecordCard client 端讀 · 沒押足球 → 卡自動隱藏(不破會員極簡)。
  const soccerResults = await getSoccerLedgerResults();
  const soccerEnginePicks = getSoccerEnginePicksAll();
  // 一份賽果輸入餵三支(同一真相):校準身分 + 準度歷程 sparkline + 回訪 delta。
  // engineFav 走 getEngineFavorite()(50/50 真銅板局回 null · 不灌引擎水)·
  // settledDay = finalResult.ingestedAt(賽果入帳台北日 · 回訪卡判「你不在時結算的」用)。
  // ⚠️ 校準身分/準度的賽果輸入用「永久鎖定源」(getMlbLockedMatches 放最後 → 下游 new Map
  // 同 key『後者勝出』· 永久源蓋過 live)· live 窗(mlbMatches)只在永久源缺該場時補今日/未鎖定 ——
  // 修「MLB 賽果掉出 2 天 live 窗 → 已結算押注倒退回 pending → 準度數字每天亂跳、且少算」+ 堵
  // 「locked 已 grade 但 live 此刻回非 final → live 的 null 蓋掉永久 winner」窄反例(對齊 canonical
  // getMlbFinalizedResults 的 JSON-first 政策)。 allWithMlb 不動(下方持倉/可押賽事仍要 live 窗)。
  const mlbLockedMatches = getMlbLockedMatches();
  const lockedMlbIds = new Set(mlbLockedMatches.map((m) => m.id));
  const idGameList = [...allMatches, ...mlbMatches, ...mlbLockedMatches];
  const idMatches = idGameList.map((m) => {
    // 你 vs 引擎只認「賽前真的鎖定過引擎線」的場。 CPBL 永遠有賽前鎖定 winRate;MLB 只有
    // 在 mlb-locked.json 內的才算。 未鎖定的 MLB 已結束場,它的引擎線是「賽後用當下球季
    // 數據即時重算」(賽後還會變)→ 拿來當「賽前引擎看好誰」= 用後見之明灌引擎水(正是
    // 我們最該避免的「賽後假裝賽前就猜中」)。 故未鎖定 MLB 排除出你 vs 引擎(engineFav=null,
    // 同 50/50 銅板局),但你自己這手的對錯照常計入個人戰績。 鎖定過的 MLB 由
    // getMlbLockedMatches 那筆帶正確賽前線(陣列最後 · 下游 Map 後者勝)。
    const isUnlockedMlb = m.id.startsWith("mlb-") && !lockedMlbIds.has(m.id);
    return {
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: isUnlockedMlb ? null : getEngineFavorite(m),
      startISO: getMatchStartIso(m),
      settledDay: m.finalResult?.ingestedAt ?? null,
    };
  });
  // 玩法併入同一本帳:把已結算棒球的大小分當「虛擬比賽」一起對帳(同源比賽清單)。
  // 🔴 headline / sparkline / 回訪 delta 三者用「同一份」prop-inclusive 清單 = 數字一致
  //    (對齊 /u · 否則大數字含大小分、旁邊 sparkline 不含 → 自打臉砸校準護城河)。
  const idMatchesAll = [...idMatches, ...baseballPropIdMatches(idGameList)];
  // 個人校準身分:你的紀錄(含輸)+ 對比亂猜 + 同場 你 vs 引擎 + 本月升階閘門。
  const identity = aggregateIdentity(
    predictionsMap,
    idMatchesAll,
    getCurrentTaipeiMonthKey()
  );
  // 對帳之星(米其林式最高榮譽 · lib/reckoning-star 單一真相)· 達標金星 / 在軌道上給目標 / 其餘不顯。
  const star = reckoningStar(identity);
  // 一鍵拿取可攜憑證 · 句子走單一真相 credentialHeadline(含卡尺話術)· 達星 / 贏過引擎才給面板。
  const cred = credentialHeadline(identity);
  // 準度歷程(會動的數字 · 回訪鉤)· 按比賽日累計命中率 · sparkline 在校準卡內畫。
  const accuracySeries = computeAccuracySeries(predictionsMap, idMatchesAll);
  // 回訪卡 delta:上次造訪後新結算的場(首訪 / 0 新 → null)· last_seen 由卡的 client 端寫回。
  // 回訪 delta 用原 idMatches(需 settledDay · 大小分虛擬場無此欄)· 玩法不計入「你不在時 N 場結算」
  // 提示 = 刻意(headline/sparkline 一致才是重點 · 稽核員確認可如此)。
  const settlementDelta = computeSettlementDelta(
    predictionsMap,
    idMatches,
    readLastSeenFromMeta(meta)
  );

  // 對帳紀律 streak(soul-roadmap #2)· 連續性按「下注日」的台北日曆日算(見
  // aggregateStreak 註解:下注日 ≠ 比賽日 · 衡量你哪幾天回來面對帳本)。
  const todayTaipei = getTodayTaipei();
  const streak = aggregateStreak(predictionsMap, todayTaipei);
  // 「今天」焦點條的日期短標(台北 "YYYY-MM-DD" → "M/D")· 每日變 = 儀式的「活」感。
  const [, todayMM, todayDD] = todayTaipei.split("-");
  const todayLabel = `${Number(todayMM)}/${Number(todayDD)}`;
  // 本月賽季回顧入口:把已建好、卻只在 /u 連得到的月度回顧接到會員頁 · 有本月(棒球)押注才連
  //(避免連到空回顧)· 足球-only 的人仍從 /u 進得去(graceful · 不誤導)。
  const currentMonth = getCurrentTaipeiMonthKey();
  const hasSeasonActivity = hasMonthActivity(predictionsMap, [], currentMonth);

  // 校準大師(R217 · 你說的把握 vs 實際中的)· 跨運動賽果輸入(同一真相):
  // 棒球用永久鎖定源的 finalWinner(idMatches 已含 CPBL+MLB+locked)· 足球用 outcome。
  // CalibrationMasterCard client 端讀本人 confidence 押注 · 先鎖後結用 startISO 過濾。
  const calibrationResults: Record<string, CalibrationResult> = {};
  for (const m of idMatches) {
    calibrationResults[m.id] = { result: m.finalWinner, startISO: m.startISO ?? "" };
  }
  for (const r of soccerResults) {
    calibrationResults[r.matchId] = { result: r.outcome, startISO: r.kickoffISO };
  }
  // 網球 / 羽球 / UFC 的賽果也餵進校準曲線(同天梯 buildSyncResults 的 a/b→home/away 規則 ·
  // A=home/B=away)—— 否則設了把握的這三種運動押注會永遠卡「未結算」幽靈(get_my_calibration_picks
  // 跨運動全收,但賽果原本只組了棒球+足球)· 跟 /u 同步收進來(見 app/u/[code]/page.tsx)。
  // 🔴 MMA 和局(draw)→ "tie" = push(同棒球平手 · 不計分母,非幽靈 pending)。
  for (const [id, r] of Object.entries(tennisResults()))
    calibrationResults[id] = { result: r.outcome === "a" ? "home" : "away", startISO: r.startISO ?? "" };
  for (const [id, r] of Object.entries(badmintonResults()))
    calibrationResults[id] = { result: r.outcome === "a" ? "home" : "away", startISO: r.startISO ?? "" };
  for (const [id, r] of Object.entries(mmaResults()))
    calibrationResults[id] = {
      result: r.outcome === "draw" ? "tie" : r.outcome === "a" ? "home" : "away",
      startISO: r.startISO ?? "",
    };

  // 你的足跡(soul · Tim 2026-06-05 dogfood:回過的留言找不回去)· server-side 撈本人留言 ·
  // 沒回過 → panel 自動隱藏(同其他 graceful 元件)。
  // ⚠ R237 Defector pivot:「買過的分析」書架已隨賣分析/錢包收掉(R237 移除錢包)· 這裡只留留言足跡。
  const myComments = await getMyComments();

  // 你的未結算押注(the live middle · soul)· 你押過、還沒結算的場 —— 押下去到
  // 打完之間那段以前 /member 一片空白。 你 vs 引擎 vs 群眾 的張力撐住「我現在
  // 有一手在賭」。 LIVE 場(getMatchPhase today-live)多一道呼吸金線。
  const openPositions = buildOpenPositions(predictionsMap, allWithMlb);
  const heldIds = new Set(openPositions.map((p) => p.matchId));

  // 今晚 + 即將 · 修會員 vs 訪客不對等的 bug(兩層):
  //  ① 原本只抓「今天」· 休賽日但明後天有排賽時,登入會員看到死路(track-record /
  //     lab),沒登入的人在首頁卻看得到、還能先押 = 高意願的會員反而拿到比較差的答案。
  //  ② R202 · 原本只抓 CPBL(舊 getTodayAndFutureMatches 只跑靜態 matches 陣列)· 但
  //     上方「你的未結算押注」是用 allWithMlb 建的 —— 你押了一場 MLB,在這裡卻永遠
  //     找不到新的 MLB 場可押(同一個 bug class 的第二段)。 改用 allWithMlb(跟持倉
  //     同一份)· 同 phase 規則(今晚待開/進行中/未來)· 按完整開賽 instant 排
  //     (跨聯盟/跨日正確 · 同 /matches 看板的排序鍵)。
  // 已押的場移到上方「你的未結算押注」· 這裡只留「還沒押」的,不重複。
  const upcoming = allWithMlb
    .filter((m) => {
      if (heldIds.has(m.id)) return false;
      const phase = getMatchPhase(m);
      return (
        phase === "today-pregame" ||
        phase === "today-live" ||
        phase === "future"
      );
    })
    .sort((a, b) =>
      (getMatchStartIso(a) ?? "").localeCompare(getMatchStartIso(b) ?? ""),
    );

  // 「今天」焦點條:今晚還沒押、賽前可鎖的場數(today-pregame · 不含已開賽的 live ·
  // 從 upcoming 算 = 跟下方「接下來可以押」同一份來源、同一份去重)。
  const tonightLockable = upcoming.filter(
    (m) => getMatchPhase(m) === "today-pregame",
  ).length;

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
        {/* ── R241 收納(Tim「會員功能越來越多、版面雜亂、超長」)· 7 區 + 白話小標 ──
            只分組/折疊/截斷,不刪功能。 最上焦點(身分 + 今天的一手 + 你現在的一手)永不折。
            🔴 群組小標必須跟「該組至少一個 child 會 render」一起 gate,避免空標頭破 graceful。 */}

        {/* ═══ 區 1 · 最上焦點(無標 · 永不折)═══ */}
        {/* 取暱稱漸進提示(沒設名才現)· 身分列(改名 / tier / 登出)· 到期狀態(付費才現)*/}
        <NicknamePrompt
          show={
            displayName.trim() === "" && meta?.nick_prompt_dismissed !== true
          }
          anonHandle={anonHandle}
          code={authorCode}
        />
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
        <MembershipStatus meta={meta} />

        {/* 今天的一手 + 對帳紀律 = 會員每天回來的核心動作(鐵律置頂 · 永不收折)*/}
        <TodayStrip
          tonightLockable={tonightLockable}
          streak={streak}
          dateLabel={todayLabel}
        />

        {/* 你現在的一手:未結算押注 + 你不在時結算了 N 場(都 graceful 自動隱藏)·
            放最上=今天回來的理由(動態時效)· 不歸進「成績」(它們還沒分勝負)。 */}
        <OpenPositionsPanel positions={openPositions} />
        <ReturnedWhileAwayCard delta={settlementDelta} />

        {/* ═══ 區 2 · 你的成績(CalibrationIdentityCard 永遠 render → 標頭恆有內容)═══ */}
        <SectionLabel>你的成績 · 你 vs 引擎</SectionLabel>
        {/* 校準身分(含輸帳本脊椎 · 金色主角)+ 準度歷程 sparkline */}
        <CalibrationIdentityCard identity={identity} series={accuracySeries} />
        {/* 對帳之星進度(達標金星卡 / 在軌道上給目標 / 其餘不顯)*/}
        {star.earned ? (
          <Link
            href={`/u/${authorCode}`}
            className="mt-6 flex items-center gap-3 border border-gold/55 bg-gold/[0.06] p-4 hover:border-gold transition-colors group"
          >
            <ReckoningStarMark size={34} />
            <span className="flex-1 min-w-0">
              <span className="block text-gold text-base font-light tracking-tight">
                你拿到了對帳之星
              </span>
              <span className="block text-mute/80 text-[12px] leading-relaxed mt-0.5">
                {identity.decided} 場含輸裡贏過引擎 · 全站極少人做得到 · 守不住會被收回
              </span>
            </span>
            <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
              外傳 →
            </span>
          </Link>
        ) : star.onTrack ? (
          <div className="mt-6 flex items-center gap-3 border-b border-line/40 pb-3">
            <ReckoningStarMark size={28} dim />
            <span className="flex-1 min-w-0 text-mute text-sm leading-snug">
              你正在追<span className="text-bone">對帳之星</span> · 已贏引擎 +{star.edge} 分 · 還差{" "}
              <span className="text-gold">{star.toGo} 場</span>(滿 {RECKONING_STAR_MIN} 場、含輸贏過引擎)
            </span>
          </div>
        ) : null}
        {/* 足球戰績(沒押足球自動隱藏)· 網球戰績(沒押網球自動隱藏)· 校準大師(沒填把握自動隱藏)· 榮譽牆 */}
        <SoccerRecordCard
          results={soccerResults}
          enginePicks={soccerEnginePicks}
          wrapperClass="mt-6"
        />
        <TennisRecordCard
          results={tennisResults()}
          enginePicks={tennisEnginePicks()}
          wrapperClass="mt-6"
        />
        <BadmintonRecordCard
          results={badmintonResults()}
          enginePicks={badmintonEnginePicks()}
          wrapperClass="mt-6"
        />
        <MmaRecordCard
          results={mmaResults()}
          enginePicks={mmaEnginePicks()}
          wrapperClass="mt-6"
        />
        <CalibrationMasterCard results={calibrationResults} wrapperClass="mt-6" />
        <HonorWall identity={identity} streak={streak} />

        {/* ═══ 區 3 · 你的東西 · 收藏 / 對帳 / 回顧(收件匣+收藏無條件 → 標頭恆有內容)═══ */}
        <SectionLabel>你的東西 · 收藏、對帳、回顧</SectionLabel>
        <Link
          href="/member/inbox"
          className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
        >
          <span className="text-mute text-sm leading-snug">
            <span className="text-bone">結算收件匣</span> · 中沒中逐筆對帳
          </span>
          <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
            收件匣 →
          </span>
        </Link>
        <Link
          href="/member/collection"
          className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
        >
          <span className="text-mute text-sm leading-snug">
            <span className="text-bone">戰功卡收藏</span> · 每一手都改不了
          </span>
          <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
            看收藏 →
          </span>
        </Link>
        {hasSeasonActivity && (
          <Link
            href={`/u/${authorCode}/season/${currentMonth}`}
            className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
          >
            <span className="text-mute text-sm leading-snug">
              <span className="text-bone">{monthLabel(currentMonth)}的回顧</span> · 一張可外傳的月度收據
            </span>
            <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
              看回顧 →
            </span>
          </Link>
        )}

        {/* ═══ 區 4 · 拿去給人看 · 把準度丟給懷疑者 ═══
            🔴 整組標頭 gate `identity.decided > 0`:全新會員(0 場)兩張卡都不 render,
            裸標頭 = 孤兒標頭破 graceful。 徽章/嵌入碼也走同一 gate(任何有紀錄的人都能拿)·
            LinkedIn 對帳之星認證再往內用 earned 收緊(達星才掛)。 */}
        {identity.decided > 0 && (
          <>
            <SectionLabel>拿去給人看 · 把準度丟給不信你的人</SectionLabel>
            {/* 基本分享卡:公開檔含輸戰績(有紀錄才到這 · 不發空檔案)*/}
            <ProfileShareCard code={authorCode} />
            {/* 戰績徽章 + 嵌入碼 · 任何有紀錄的人都能拿(不再只鎖對帳之星那群極少數)·
                每個徽章帶 /u 回鏈 = 報馬仔偽造不出的 costly signal + 自動把點的人帶回站 = 獲客迴圈。
                預設折疊省版面(同基本分享卡之後的「進階」位)· LinkedIn 對帳之星認證只有真達星才掛。 */}
            <Disclosure summary="拿你的戰績徽章 · 貼到 bio / LINE / 論壇 →">
              <CredentialGrabPanel
                code={authorCode}
                sentence={cred.sentence}
                earned={star.earned}
              />
            </Disclosure>
          </>
        )}

        {/* ═══ 區 5 · 揪朋友 · 一起玩 · 聯盟 / 房間 / 足跡 / 創作 / 支持
            (聯盟+房間無條件 → 標頭恆有內容)═══ */}
        <SectionLabel>揪朋友 · 一起玩</SectionLabel>
        <Link
          href="/member/leagues"
          className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
        >
          <span className="text-mute text-sm leading-snug">
            揪朋友開<span className="text-bone">私人預測聯盟</span> · 整季比準度
          </span>
          <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
            我的盟 →
          </span>
        </Link>
        <Link
          href="/member/lounge"
          className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
        >
          <span className="text-mute text-sm leading-snug">
            <span className="text-bone">會員房間</span> · 養著免費引擎那群人的客廳
          </span>
          <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
            進房間 →
          </span>
        </Link>
        {/* 你的足跡(沒留言自動隱藏)· 創作者後台(付費 + 沒發過自動隱藏)*/}
        <MyActivityPanel comments={myComments} />
        {isPaid(tier) && <MyCreatorPanel matches={creatorCheckMatches} />}
        {/* 付費會員:去發一篇(接在創作者後台後 · 同對象)· 免費會員:低調升級 link(不推銷)*/}
        {isPaid(tier) && (
          <p className="mt-6 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
            你的支持身分已開通 · 公開發分析、賽後自動對帳{" "}
            <Link
              href={upcoming.length > 0 ? `/matches/${upcoming[0].id}#say` : "/matches"}
              className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
            >
              去發一篇 →
            </Link>
          </p>
        )}
        {!isPaid(tier) && (
          <Link
            href="/membership"
            className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
          >
            <span className="text-mute text-sm leading-snug">
              <span className="text-bone">撐著它的人</span> · 讓這個引擎對所有人一直免費
            </span>
            <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
              成為其中一個 →
            </span>
          </Link>
        )}

        {/* ═══ 區 6 · 接下來可以押(下一步動作)· 截斷 top 6 + 看全部 → 解「超長」═══ */}
        <section className="mt-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
            {upcoming.length > 0 ? "接下來可以押" : "今天賽事"}
          </p>
          {upcoming.length > 0 ? (
            <div className="border border-line/60 bg-slate/30">
              {upcoming.slice(0, MEMBER_UPCOMING_MAX).map((m, i, arr) => {
                const homeFav = m.home.winRate >= m.away.winRate;
                // 引擎看好那隊的隊徽 + 隊色 → 一行密清單也能「顏色秒認隊」。
                const favName = homeFav ? m.home.name : m.away.name;
                const crest = getTeamCrest(
                  favName,
                  homeFav ? m.home.en : m.away.en,
                  m.league,
                );
                // 最後一列才去掉底線 —— 但若有「看全部」列接在後面(upcoming 超過上限),
                // 這 6 列都要保留底線(看全部列才是最後)。
                const noBorder =
                  i === arr.length - 1 && upcoming.length <= MEMBER_UPCOMING_MAX;
                return (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-gold/5 transition-colors ${
                      noBorder ? "" : "border-b border-line/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar
                        seed={favName}
                        glyph={crest?.glyph}
                        color={crest?.color}
                        size={22}
                      />
                      <div className="min-w-0">
                        <p className="text-bone text-sm sm:text-base font-light leading-snug truncate">
                          <span className={homeFav ? "text-gold" : ""}>{m.home.name}</span>
                          <span className="text-mute/60 mx-1.5 text-xs">vs</span>
                          <span className={!homeFav ? "text-gold" : ""}>{m.away.name}</span>
                        </p>
                        <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] mt-1 tabular">
                          {m.startTime} · 引擎看好 {favName}{" "}
                          {Math.max(m.home.winRate, m.away.winRate)}%
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-gold/70 text-[10px] tracking-[0.3em]">
                      押 →
                    </span>
                  </Link>
                );
              })}
              {/* 超過上限 → 一條安靜的「看全部」導回賽事板(不在會員頁重造看板)*/}
              {upcoming.length > MEMBER_UPCOMING_MAX && (
                <Link
                  href="/matches"
                  className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-gold/5 transition-colors font-mono text-[10px] tracking-[0.3em] text-mute hover:text-gold"
                >
                  <span>還有 {upcoming.length - MEMBER_UPCOMING_MAX} 場</span>
                  <span className="text-gold/70">看全部賽事 →</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="border border-line/60 bg-slate/30 p-5">
              <p className="text-mute text-sm leading-relaxed mb-4">
                目前沒有可以押的賽事。
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

        {/* ═══ 區 7 · 設定 · 其他(頁尾收尾)· 提醒開關 + 匯出 + 聯絡
            (匯出+聯絡無條件 → 標頭恆有內容;PushToggle graceful 隱藏也不破)═══ */}
        <SectionLabel>設定 · 其他</SectionLabel>
        {/* 結算提醒開關(web-push · 從中段移來頁尾設定區 · 未設金鑰/不支援→整顆隱藏)*/}
        <PushToggle />
        {/* 帳本可攜:你的歷史我們改不了、你也能帶走 */}
        <ExportLedgerButton />
        <p className="mt-8 text-center font-mono text-mute/50 text-[10px] tracking-[0.2em] leading-relaxed">
          有問題?{" "}
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
