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
import CalibrationMasterCard from "@/components/CalibrationMasterCard";
import type { CalibrationResult } from "@/lib/calibration-master";
import { getSoccerLedgerResults } from "@/lib/soccer/football-data";
import { getSoccerEnginePicks } from "@/lib/soccer/locked";
import { readTier, isPaid, tierLabel } from "@/lib/tier";
import { reckoningStar, credentialHeadline, RECKONING_STAR_MIN } from "@/lib/reckoning-star";
import ReckoningStarMark from "@/components/ReckoningStarMark";
import CredentialGrabPanel from "@/components/CredentialGrabPanel";
import OpenPositionsPanel from "@/components/OpenPositionsPanel";
import TodayStrip from "@/components/TodayStrip";
import PushToggle from "@/components/PushToggle";
import type { OpenPosition } from "@/components/OpenPositionCard";
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
  const tier = readTier(meta);
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
  const soccerEnginePicks = getSoccerEnginePicks();
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
  const idMatches = [...allMatches, ...mlbMatches, ...mlbLockedMatches].map((m) => {
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
  // 個人校準身分:你的紀錄(含輸)+ 對比亂猜 + 同場 你 vs 引擎 + 本月升階閘門。
  const identity = aggregateIdentity(
    predictionsMap,
    idMatches,
    getCurrentTaipeiMonthKey()
  );
  // 對帳之星(米其林式最高榮譽 · lib/reckoning-star 單一真相)· 達標金星 / 在軌道上給目標 / 其餘不顯。
  const star = reckoningStar(identity);
  // 一鍵拿取可攜憑證 · 句子走單一真相 credentialHeadline(含卡尺話術)· 達星 / 贏過引擎才給面板。
  const cred = credentialHeadline(identity);
  // 準度歷程(會動的數字 · 回訪鉤)· 按比賽日累計命中率 · sparkline 在校準卡內畫。
  const accuracySeries = computeAccuracySeries(predictionsMap, idMatches);
  // 回訪卡 delta:上次造訪後新結算的場(首訪 / 0 新 → null)· last_seen 由卡的 client 端寫回。
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

  // 你的足跡(soul · Tim 2026-06-05 dogfood:回過的留言找不回去)· server-side 撈本人留言 ·
  // 沒回過 → panel 自動隱藏(同其他 graceful 元件)。
  // ⚠ R237 Defector pivot:「買過的分析」書架已隨賣分析/錢包收掉(R237 移除錢包)· 這裡只留留言足跡。
  const myComments = await getMyComments();

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
        // 你押的那隊縮寫 + 聯盟 → 密清單掛隊徽顏色(getTeamCrest)
        myTeamEn: entry.pick === "home" ? m.home.en : m.away.en,
        league: m.league,
        engineHomePicked: m.home.winRate >= m.away.winRate,
        engineConfidence: Math.max(m.home.winRate, m.away.winRate),
        phase,
      };
    })
    .filter((p): p is OpenPosition => p !== null)
    .sort((a, b) => phaseRank(a.phase) - phaseRank(b.phase));
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
        {/* 0 · 取暱稱 onboarding 提示(R237)· 研究結論:別在註冊強制取名(降轉換)·
            改在已投入的時刻漸進邀請。 只在「還沒設顯示名 && 沒按過之後再說」時出現在最頂 ·
            取名 / 跳過就消失(守極簡)· 解決脈動/聯盟「一堆球迷#碼」impersonal 牆。 */}
        <NicknamePrompt
          show={
            displayName.trim() === "" && meta?.nick_prompt_dismissed !== true
          }
          anonHandle={anonHandle}
          code={authorCode}
        />

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

        {/* 今天 · 每日對帳儀式(soul · Defector 高路 / 柏青哥低路討論收斂)· 把「今天的一手 +
            對帳紀律」收成一條放最上 = 會員一打開就知道今天的一個誠實動作,然後就走。
            🔴 紀律 = 回來對帳天數,不是連勝 · 斷了不羞辱 · 無拉霸/聲光/點數 · 不推銷。 */}
        <TodayStrip
          tonightLockable={tonightLockable}
          streak={streak}
          dateLabel={todayLabel}
        />

        {/* 1.5 · 你的未結算押注 · the live middle(soul)· 只在有持倉時出現 ──
            押下去到打完之間那段 —— 你 vs 引擎 vs 群眾。 放在準度數字之上,因為
            這是你今天回來的理由(動態 · 時效)· 沒持倉時自動隱藏,準度數字遞補為首。
            ⚡ adaptive(Tim dogfood「押十幾場版面爆了」):≤2 注大卡(時刻)· ≥3 注密清單
            (投資組合 · 隊徽顏色秒掃 · 結算說明只說一次)· 見 OpenPositionsPanel。 */}
        <OpenPositionsPanel positions={openPositions} />

        {/* 你不在時結算了 N 場(soul-roadmap R208 #5 · 單人回訪鉤)· 平靜對帳語氣 ·
            含輸照數(引擎贏你也講)· 首訪/0 新結算自動隱藏 · 永遠寫回 last_seen。 */}
        <ReturnedWhileAwayCard delta={settlementDelta} />

        {/* 2 · 你的校準身分 · 含輸帳本 · 你 vs 亂猜 vs 引擎 + 本月升階閘門 ──
            「有帳本的玩運彩」脊椎(soul-roadmap #1)· 計算在 aggregateIdentity。
            series = 準度歷程 sparkline(會動的數字 · 場數夠多才畫)。 */}
        <CalibrationIdentityCard identity={identity} series={accuracySeries} />

        {/* 對帳之星進度(米其林式最高榮譽 · lib/reckoning-star 單一真相)· 達標 = 金星卡(連去公開檔外傳)·
            在軌道上 = 給「還差 X 場」目標(回訪鉤 · 米其林那種「快摘星了」)· 其餘不顯(graceful · 不嘮叨剛上路的人)。 */}
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

        {/* 你的足球戰績(含輸 · 跟棒球分開算 · 含你 vs 引擎)· 沒押足球自動隱藏 */}
        <SoccerRecordCard
          results={soccerResults}
          enginePicks={soccerEnginePicks}
          wrapperClass="mt-6"
        />

        {/* 校準大師(R217)· 你說的把握 vs 實際中的 · 沒填過把握自動隱藏(守極簡)*/}
        <CalibrationMasterCard results={calibrationResults} wrapperClass="mt-6" />

        {/* 3 · 你的榮譽牆(soul-roadmap #5 · 「靠誠實賺來的地位」三樓第一塊)· 章全部
            從含輸帳本自動算 · 報馬仔掛不出 · Apple 紀律只放 5 個 · 框 mute 不搶校準卡主角。 */}
        {/* 對帳紀律:current(現在連續 + 今天接上)已移到頂端「今天」焦點條 TodayStrip(R218
            收乾淨 · 單一動作面);榮譽牆只留里程碑徽章(7/30/100 日)· streak 物件仍傳給它算章。 */}
        <HonorWall identity={identity} streak={streak} />

        {/* 結算收件匣(R231 · #1 回訪迴路的不卡網域那半)· 「你不在時結算了什麼」的逐筆對帳隊列 ·
            Nav 鈴鐺點進來的家 · 跟收藏(全部畫廊)分工:這是時間序、標出新結算的隊列。
            同列樣式(不新增大卡 · 守會員頁極簡)· 接在收藏之前(對帳 → 收藏 的動線)。 */}
        <Link
          href="/member/inbox"
          className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
        >
          <span className="text-mute text-sm leading-snug">
            <span className="text-bone">結算收件匣</span> · 命中落空逐筆對帳
          </span>
          <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
            收件匣 →
          </span>
        </Link>

        {/* 結算提醒開關(R233 web-push)· graceful:站方未設 VAPID 金鑰 / 瀏覽器不支援 → 整顆隱藏。
            放在收件匣下方:賽果結算後主動敲你回來看這個收件匣。 */}
        <div className="mt-4">
          <PushToggle />
        </div>

        {/* 戰功卡收藏(soul-roadmap 願景3)· 你押過、賽前鎖死的每一手 → 個人畫廊(含輸照收)。
            接在榮譽牆後:章是榮譽的「總結」· 收藏是一張張可點進收據的「證物」· 沒結算過 → 牆自己空狀態。 */}
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

        {/* 你的公開檔案(soul-roadmap P0)· 把含輸帳本變成可以丟給懷疑者的證物 —— 地位是
            賺來的、也是可以攤開驗證的。 URL 用永久碼(改名洗不掉)· 任何人免登入可看
            (預設匿名球迷#碼 · 設了顯示名才露名)。 接在榮譽牆後 = 賺來的地位 → 拿去公開驗證。
            R204:從一行小字升成「連結 + 一鍵複製」卡(轉換審 P1:核心 costly-signal 入口太隱)。 */}
        <ProfileShareCard code={authorCode} />

        {/* 一鍵拿取可攜憑證(對帳之星 / 已贏過引擎 ≥8 場才亮)· 把準度貼到 bio / LinkedIn / 簽名 / 論壇,
            點擊一律落回 live /u 含輸帳本(圖只是鉤子)· 沒夠格自動隱藏(graceful · 不灌水)。 */}
        {(cred.level === "star" || cred.level === "beat") && (
          <CredentialGrabPanel code={authorCode} sentence={cred.sentence} />
        )}

        {/* 私人預測聯盟(R236)· 把含輸帳本變成「跟朋友整季較勁」的盟(校準計分 · 不是連勝)·
            同列樣式守極簡 · 接在公開檔後 = 賺來的地位 → 揪朋友一起比。 */}
        <Link
          href="/member/leagues"
          className="mt-6 flex items-baseline justify-between gap-3 border-b border-line/40 pb-3 hover:border-gold/40 transition-colors group"
        >
          <span className="text-mute text-sm leading-snug">
            揪朋友開<span className="text-bone">私人預測聯盟</span> · 整季比校準
          </span>
          <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
            我的盟 →
          </span>
        </Link>

        {/* 會員房間(R248 · Defector 式專屬空間)· 出錢養著免費引擎那群人的客廳 · 顯示給所有登入者
            (免費會員點進去看到房間介紹 + 升級邀請 = 偷看門後的 conversion;付費會員 = 直接進場)·
            同列樣式守極簡 · 接在聯盟後(社群/歸屬群組)。 */}
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

        {/* 本月賽季回顧入口(R220 稽核:已建好但只在 /u 連得到 → 接到會員頁)· 有本月押注才連 ·
            同「看收藏」列樣式(不新增大卡 · 守會員頁極簡)。 */}
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

        {/* 升級入口 · 路要看得見(Apple:付費路徑永遠不藏)· 但這是會員自己的介面 ·
            不對他推銷、不打「賺錢」· 接著上面的榮譽牆 → 用「身分/地位」當主軸(paid=身分
            非功能 · Defector:出錢養免費引擎,不是買功能/不賣分析)· 價格/方案在 /membership 不在這裡轟炸。 */}
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

        {/* 點數錢包已移除(R239 · Tim 拍板「整個移除」)—— Defector 下沒有付費分析可買,儲值卻無處可花 =
            文案在說謊。 拿掉可見錢包面板;後端(migrations 0008/0009 · lib/wallet.ts)保留休眠、未來要重開可復活。 */}

        {/* 你的足跡 · 回過的留言(說過的話找得回 · 一鍵回到那串)· Tim dogfood:回了留言找不到在哪。
            「買過的分析」書架已隨錢包收掉(Defector:分析免費、不賣)· 沒回過自動隱藏。 */}
        <MyActivityPanel comments={myComments} />

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
                // 引擎看好那隊的隊徽 + 隊色 → 一行密清單也能「顏色秒認隊」
                // (同上方持倉 OpenPositionCard / 看板 MiniMatchCard 的隊徽掛法)。
                // 這是 /member 最後一個純文字的押注面 · Tim R197「球迷用顏色秒認隊」。
                const favName = homeFav ? m.home.name : m.away.name;
                const crest = getTeamCrest(
                  favName,
                  homeFav ? m.home.en : m.away.en,
                  m.league,
                );
                return (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-gold/5 transition-colors ${
                      i === upcoming.length - 1 ? "" : "border-b border-line/40"
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

        {/* 4 · 付費會員 → 你的支持身分已開通 · 直接去公開發分析(免費會員看上面升級卡)·
            R238「免費封神」:不再喊「賣分析賺錢」· 主軸是公開發、賽後自動對帳、地位自己長。 */}
        {isPaid(tier) && (
          <p className="mt-10 text-center font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
            你的支持身分已開通 · 公開發分析、賽後自動對帳{" "}
            <Link
              href={upcoming.length > 0 ? `/matches/${upcoming[0].id}#say` : "/matches"}
              className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
            >
              去發一篇 →
            </Link>
          </p>
        )}

        {/* 帳本可攜(soul R209)· 你的歷史我們改不了、你也能帶走 = 對手結構上做不到 */}
        <ExportLedgerButton />

        {/* 聯絡站長 · Tim dogfood:會員找不到「怎麼聯絡站長」· 直接 mailto Tim 個人 inbox */}
        <p className="mt-10 text-center font-mono text-mute/50 text-[10px] tracking-[0.2em] leading-relaxed">
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
