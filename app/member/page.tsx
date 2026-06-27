import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getUser } from "@/lib/supabase/server";
import {
  aggregateIdentity,
  aggregateStreak,
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
import ReturnedWhileAwayCard from "@/components/ReturnedWhileAwayCard";
import ExportLedgerButton from "@/components/ExportLedgerButton";
import { isPaid, tierLabel } from "@/lib/tier";
import { effectiveTier } from "@/lib/membership";
import MembershipStatus from "@/components/MembershipStatus";
import { careerTier } from "@/lib/reckoning-star";
import CareerLadderMini from "@/components/CareerLadderMini";
import OpenPositionsPanel from "@/components/OpenPositionsPanel";
import PushToggle from "@/components/PushToggle";
import { buildOpenPositions, compactDate } from "@/lib/open-positions";
import MyCreatorPanel from "@/components/MyCreatorPanel";
import MyActivityPanel from "@/components/MyActivityPanel";
import { getMyComments } from "@/lib/creator-activity-server";
import DisplayNameSetting from "@/components/DisplayNameSetting";
import NicknamePrompt from "@/components/NicknamePrompt";
import { hasMonthActivity, monthLabel } from "@/lib/season-recap";
import { SUPPORT_EMAIL } from "@/lib/brand-constants";
import { readDisplayName } from "@/lib/identity";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { createHash } from "crypto";

export const metadata: Metadata = {
  title: "你的操盤室",
  description: "你的操盤室 · 今天這一手 · 你現在哪一階。終身免費。",
};

// ── ZONE 27 · /member · 會員自己的儀表板 ─────────────────
// R282 NUCLEAR 極簡(Tim BLACK dogfood fire:「超級超級亂!很多資訊內容都重複!點進去顯示的
//   類似!極簡再極簡!一點點多餘就大膽刪除!國小生會玩!心理學!米其林(一顆星、留白、篤定)」)。
//
// 7 區 25 卡 → 1 身分列 + 3 主角 + 1 安靜連結組 + 收尾。 心理學:登入第一眼只該看見「現在做什麼」
//   (今日一戰)+「我爬到第幾階」(操盤室),其餘是噪音。 重複全刪 —— 整個「你的成績」卡堆
//   (校準卡/sparkline/對帳之星/四運動卡/校準大師/榮譽牆)是同一個命中率穿六套衣服,且全部一字不差
//   鏡在公開檔 /u/[code];三組「今天押什麼」(今日一戰+TodayStrip+接下來可以押看板)收成一個。
//   把那六套衣服收到「我的公開檔 →」一個連結;把重造的賽事看板收成「看全部賽事 →」一個連結。
//
// 🔴 沒刪只是搬(orphan-guard):每個被收掉的功能都還在某個可達頁(公開檔/收件匣/收藏/賽事板)。
//   🔴 守住的紅線:免費會員「撐著它的人 → /membership」付費入口永不藏(R186 命門)· 創作者後台
//   (付費)留 · graceful 自動隱藏全保留 · 操盤室階級 keyed 校準非 PnL/連勝。
// ─────────────────────────────────────────────────────

// 安靜連結列(無卡 · 一行一個 · 米其林留白)· 取代原本 7 個搶眼的金色 SectionLabel 群標。
function QuietLink({
  href,
  label,
  hint,
  cta,
}: {
  href: string;
  label: string;
  hint: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-baseline justify-between gap-3 border-b border-line/40 py-3.5 hover:border-gold/40 transition-colors group"
    >
      <span className="text-mute text-sm leading-snug min-w-0">
        <span className="text-bone">{label}</span> · {hint}
      </span>
      <span className="shrink-0 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
        {cta}
      </span>
    </Link>
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
  // effectiveTier = 即時生效的 tier:BLACK 到期 → 自動當免費。 到期卡仍由 MembershipStatus 顯示。
  const tier = effectiveTier(meta);
  const tierZh = `${tierLabel(tier)} 會員`;
  // 公開身分:顯示名(opt-in)否則匿名代號「球迷 #hash」· 永久碼 = 公開檔 /u/[code] 的 key。
  const displayName = readDisplayName(meta);
  const authorCode = createHash("md5").update(user.id).digest("hex").slice(0, 8);
  const anonHandle = "球迷 #" + authorCode;

  const predictionsMap = await getMyPredictionsMap();
  // 併 MLB(全套):押 MLB 也計進你 vs 引擎準度 + 顯示為未結算持倉。
  const mlbMatches = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbMatches];
  // 校準身分/準度的賽果輸入用「永久鎖定源」(getMlbLockedMatches 放最後 → 永久源蓋過 live)·
  // live 窗只在永久源缺該場時補今日/未鎖定(修「賽果掉出 live 窗 → 已結算倒退回 pending」)。
  const mlbLockedMatches = getMlbLockedMatches();
  const lockedMlbIds = new Set(mlbLockedMatches.map((m) => m.id));
  const idGameList = [...allMatches, ...mlbMatches, ...mlbLockedMatches];
  const idMatches = idGameList.map((m) => {
    // 未鎖定的 MLB 已結束場排除出「你 vs 引擎」(賽後重算的線當賽前用 = 灌引擎水)· 你自己這手照計。
    const isUnlockedMlb = m.id.startsWith("mlb-") && !lockedMlbIds.has(m.id);
    return {
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: isUnlockedMlb ? null : getEngineFavorite(m),
      startISO: getMatchStartIso(m),
      settledDay: m.finalResult?.ingestedAt ?? null,
    };
  });
  // 把已結算棒球的大小分當「虛擬比賽」一起對帳(同源 · headline 數字含玩法 = 跟操盤室階級口徑一致)。
  const idMatchesAll = [...idMatches, ...baseballPropIdMatches(idGameList)];
  // 個人校準身分:你的紀錄(含輸)+ 同場 你 vs 引擎 + 本月升階閘門。
  const identity = aggregateIdentity(
    predictionsMap,
    idMatchesAll,
    getCurrentTaipeiMonthKey()
  );
  // 操盤室生涯階級(R280)· 把已算好的天梯階級鏡回本人(同 lib/reckoning-star 單一真相)。
  const career = careerTier(identity.accuracy, identity.decided);

  // 對帳紀律 streak(連續回來面對帳本的台北日曆日 · 非連勝)· 餵今日一戰盒的一行。
  const todayTaipei = getTodayTaipei();
  const streak = aggregateStreak(predictionsMap, todayTaipei);
  // 本月賽季回顧入口:有本月(棒球)押注才連(避免連到空回顧)。
  const currentMonth = getCurrentTaipeiMonthKey();
  const hasSeasonActivity = hasMonthActivity(predictionsMap, [], currentMonth);

  // 回訪卡 delta:上次造訪後新結算的場(首訪 / 0 新 → null · 卡自動隱藏)。
  const settlementDelta = computeSettlementDelta(
    predictionsMap,
    idMatches,
    readLastSeenFromMeta(meta)
  );

  // 你的足跡(server-side 撈本人留言)· 沒回過 → panel 自動隱藏。
  const myComments = await getMyComments();

  // 你的未結算押注(the live middle)· 你押過、還沒結算的場。
  const openPositions = buildOpenPositions(predictionsMap, allWithMlb);
  const heldIds = new Set(openPositions.map((p) => p.matchId));

  // 今晚還沒押、賽前可鎖的場數(餵今日一戰盒)· 已押的移到上方持倉 · 同 phase 規則。
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
  const tonightLockable = upcoming.filter(
    (m) => getMatchPhase(m) === "today-pregame",
  ).length;

  // 創作者後台:付費會員傳輕量賽事清單給 MyCreatorPanel。
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
        {/* ── 身分列(永不折)· 暱稱漸進提示 + 改名/tier/登出 + 到期狀態(付費才現)── */}
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

        {/* ── 主角 A · 今天這一手(今日一戰 + 今晚可鎖 + 連續對帳 三合一 · 唯一的「押什麼」)── */}
        <Link
          href="/today"
          className="mt-6 block border border-gold/45 bg-gold/[0.05] p-4 hover:border-gold transition-colors group"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-1">
                今日一戰
              </span>
              <span className="block text-bone text-base sm:text-lg font-light leading-snug">
                你 vs 機器 · 今天這一題
              </span>
            </span>
            <span className="shrink-0 font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
              上場 →
            </span>
          </div>
          <p className="mt-2 font-mono text-mute/80 text-[11px] tracking-[0.12em] leading-relaxed">
            {tonightLockable > 0
              ? `今晚 ${tonightLockable} 場可以鎖 · 賽前鎖死 · 隔天見真章`
              : "今天沒有可鎖的場 · 明天再來對決"}
            {streak.current >= 1 && ` · 連續回來對帳 ${streak.current} 天`}
          </p>
        </Link>

        {/* ── 主角 B · 你的操盤室(唯一的「我多準/我第幾階」· 含命中率+場數+下一階 · 會升會降)── */}
        <CareerLadderMini
          career={career}
          accuracy={identity.accuracy}
          decided={identity.decided}
        />

        {/* ── 主角 C · 你現在的一手(未結算押注 + 你不在時結算 N 場 · 都 graceful 自動隱藏)── */}
        <OpenPositionsPanel positions={openPositions} />
        <ReturnedWhileAwayCard delta={settlementDelta} />

        {/* ── 你的東西(安靜連結組 · 無卡 · 米其林留白)·「我的公開檔」一條收下整本完整戰績
            (各運動 / 對帳之星 / 校準大師 / 榮譽牆全在 /u/[code])· 不在儀表板重造。 ── */}
        <div className="mt-12 flex flex-col">
          {/* R282b · 整合「3 個都像我的押注紀錄」(Tim:差異不大?)→ 只留 2 個「真的不同工作」的門:
              ① 我的對帳本(私下 · 中沒中 + 戰功卡收藏 · 收件匣頁底已連到收藏牆 → 不孤兒)
              ② 別人眼中的你(公開 · 拿去給人看)· 心理學:同一概念只給一扇門,避免「點哪個都一樣」的選擇癱瘓。 */}
          <QuietLink
            href="/member/inbox"
            label="我的對帳本"
            hint="你押過的每一手 · 中沒中 · 戰功卡都在這"
            cta="對帳 →"
          />
          {identity.decided > 0 && (
            <QuietLink
              href={`/u/${authorCode}`}
              label="別人眼中的你"
              hint="公開戰績 + 對帳之星 · 拿去給懷疑的人看"
              cta="公開檔 →"
            />
          )}
          {hasSeasonActivity && (
            <QuietLink
              href={`/u/${authorCode}/season/${currentMonth}`}
              label={`${monthLabel(currentMonth)}的回顧`}
              hint="一張可外傳的月度收據"
              cta="看回顧 →"
            />
          )}
          <QuietLink
            href="/member/leagues"
            label="私人聯盟"
            hint="揪朋友整季比準度"
            cta="我的盟 →"
          />
          <QuietLink
            href="/member/lounge"
            label="會員房間"
            hint="養著免費引擎那群人的客廳"
            cta="進房間 →"
          />
          <QuietLink
            href="/matches"
            label="看全部可押賽事"
            hint="今天 · 即將"
            cta="賽事板 →"
          />
          {/* 免費會員的支持入口 · 永不藏(R186 命門)· 付費會員不顯(不對撐著它的人再推銷)。 */}
          {!isPaid(tier) && (
            <QuietLink
              href="/membership"
              label="撐著它的人"
              hint="讓這個引擎對所有人一直免費"
              cta="了解 →"
            />
          )}
        </div>

        {/* 你的足跡(沒留言自動隱藏)· 創作者後台(付費 + 沒發過自動隱藏)*/}
        <MyActivityPanel comments={myComments} />
        {isPaid(tier) && <MyCreatorPanel matches={creatorCheckMatches} />}
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

        {/* ── 收尾 · 設定(最安靜)· 提醒開關 + 匯出 + 聯絡 ── */}
        <div className="mt-12 pt-6 border-t border-line/30">
          <PushToggle />
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
