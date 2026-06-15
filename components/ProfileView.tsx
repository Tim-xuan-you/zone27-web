import Link from "next/link";
import Avatar from "@/components/Avatar";
import HonorWall from "@/components/HonorWall";
import AccuracySparkline from "@/components/AccuracySparkline";
import TrophyGrid from "@/components/TrophyGrid";
import CalibrationMasterView from "@/components/CalibrationMasterView";
import type { CalibrationReport } from "@/lib/calibration-master";
import FollowLedgerButton from "@/components/FollowLedgerButton";
import { creatorIdentity } from "@/lib/identity";
import { isPaid, tierLabel } from "@/lib/tier";
import type {
  CalibrationIdentity,
  DisciplineStreak,
  AccuracyPoint,
} from "@/lib/predictions";
import type { SoccerRecord } from "@/lib/soccer/predictions";
import type { PublicProfile } from "@/lib/profile-server";
import type { Trophy } from "@/lib/trophies";

// ── ZONE 27 · 公開含輸 Profile(soul-roadmap P0 keystone)──────────────────
// /u/[code] 的主體:把任一位會員攤開的、刪不掉的、含贏含輸押注帳本,做成一張
// 可以丟給懷疑者的「證物」。 不是儀表板(沒有「去押一注」那種對自己人的 CTA)——
// 是一份對外的 costly signal:敢把輸的也公開 = 報馬仔結構上做不到(他們靠藏輸活)。
//
// 設計脈絡(同 soul-roadmap / visual-identity 紅線):
//   · 主角是「帳本」不是「粉絲數」—— 名字旁唯一的大數字永遠是「他多準 · 含輸」。
//   · 第三人稱、去人稱(主詞用「這份帳本」)· 訪客讀起來不會以為在講自己。
//   · 暗金 · 無紅綠(輸用 loss token 的柔紅)· 無 emoji · 無動畫 · 無吉祥物。
//   · 校準排非 PnL · ✕ 跟 ✓ 一樣大 · 滿軸 0-100 不放大小差距(不捏造精確度)。
//   · 結尾轉換 = 免費建你自己的帳本(引擎永遠免費)· 付費身分(BLACK/GOLD)當安靜副線,
//     永不暗示「付錢看起來比較準」(那會自打 57% 天花板那張誠實王牌)。
//
// 純展示 server component · 計算全在 aggregateIdentity / aggregateStreak / gradeSoccerPicks
// (單一真相 · 跟 /member 同一套函式 · 只是讀的是「那個碼的人」)。 無 client JS。
// ─────────────────────────────────────────────────────

const FIRM = 8; // 低於此 · 數字還會跳(同 CalibrationIdentityCard SAMPLE_FIRM)

type Props = {
  profile: PublicProfile;
  identity: CalibrationIdentity;
  streak: DisciplineStreak;
  soccer: SoccerRecord;
  /** 準度歷程序列(棒球 · computeAccuracySeries)· 場數夠多才畫 sparkline */
  series?: AccuracyPoint[];
  /** 戰功卡(已結算的每一手 · 連單場收據)· 把數字背後的「實物證物」攤給懷疑者看 */
  trophies?: Trophy[];
  /** 公開校準曲線(0027 · 信心桶 vs 實際命中)· 沒宣告過把握 / 未套 0027 → null → 不顯示 */
  calibration?: CalibrationReport | null;
  /** 本月賽季回顧入口(R218 · 有本月押注才連 · 避免連到空回顧)· "2026-06" */
  seasonPeriod?: string;
  /** 本月顯示標「2026 年 6 月」· 配 seasonPeriod */
  seasonLabel?: string;
  /** 本月有沒有任何押注(false → 不顯示回顧入口) */
  hasSeasonActivity?: boolean;
  /** 這份帳本是創辦人(Tim)的?→ 頂端掛「創辦人框」(R238 · isFounderCode) */
  founder?: boolean;
};

// 一句話總結這份帳本的站位 · 第三人稱(主詞 = 帳本)· 誠實雙向(贏照講、輸也照講)。
function standingVerdict(id: CalibrationIdentity): string {
  const v = id.vsCoinPts;
  if (v === null) return "場還沒結算 —— 帳本才剛開始記。";
  if (v < 0) return `還落後亂猜 ${-v} 分 —— 帳本不騙人,也刪不掉。`;
  if (v === 0) return "跟亂猜打平 —— 還沒證明比丟銅板強。";
  const coin = `比亂猜準 ${v} 分`;
  if (id.beatEngine === null) return `${coin}。`;
  if (id.beatEngine) return `${coin},而且贏過引擎 —— 這份帳本看得出有東西。`;
  if (id.tiedEngine) return `${coin},跟引擎打平 —— 差臨門一腳。`;
  return `${coin},但還沒贏過引擎。`;
}

export default function ProfileView({ profile, identity: id, streak, soccer, series, trophies, calibration, seasonPeriod, seasonLabel, hasSeasonActivity, founder }: Props) {
  // 身分解析(同創作者署名 · 顯示名 or 球迷#碼 + 永久碼 chip + 頭像 seed/glyph)。
  const who = creatorIdentity({
    handle: profile.handle,
    authorCode: profile.authorCode,
    displayName: profile.displayName,
  });

  const hasBaseball = id.total > 0;
  // late 也算「有足球」:只有晚押的人 · 區塊若在結算瞬間整個消失 = 比剔除更傷信任。
  const hasSoccer = soccer.n > 0 || soccer.pending > 0 || soccer.late > 0;
  const hasDecided = id.accuracy !== null;
  const youPct = Math.max(0, Math.min(100, id.accuracy ?? 0));
  const engPct = Math.max(0, Math.min(100, id.engine.accuracy ?? 0));
  const showEngineBar = id.engine.decided > 0 && id.engine.accuracy !== null;
  const lowSample = id.decided > 0 && id.decided < FIRM;

  return (
    <div className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24">
      {/* ── 創辦人框(R238 · Michelin 記分板)· 只在 Tim 的碼出現 ──────────
          框成「記分的人,自己也被同一把尺量」——「裁判親自下場、而且照規矩記分」=
          公信力的源頭(米其林評審自掏腰包吃飯)· 不是「站長報明牌」。 */}
      {founder && (
        <div className="mb-7 pb-5 border-b border-gold/30">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-2">
            / 創辦人帳本 · FOUNDER
          </p>
          <p className="text-mute text-sm sm:text-[15px] leading-relaxed max-w-xl">
            Tim 跟引擎用<span className="text-bone">同一把尺</span>記分 ——
            賽前鎖死、輸了照留、看校準不看勝率。
            <span className="text-mute/75"> 評價買不到、名次也買不到 —— 這份帳本就是證明。</span>
          </p>
        </div>
      )}

      {/* ── 身分列 · 頭像 + 名字 + 永久碼 ──────────────────────── */}
      <header className="flex items-center gap-4">
        <Avatar
          seed={who.seed}
          glyph={who.glyph}
          size={60}
          supporter={isPaid(profile.tier)}
        />
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight truncate">
            {who.label}
          </h1>
          <p className="mt-1 flex items-center gap-2 flex-wrap">
            {who.code && (
              <span className="font-mono text-gold/70 text-[11px] tracking-[0.2em] tabular">
                {who.code}
              </span>
            )}
            <span className="font-mono text-mute/60 text-[10px] tracking-[0.3em]">
              ZONE 27 · 公開戰績
            </span>
            {/* 支持者身分(0023 tier)· 低調金框 chip · 框成「贊助開放引擎」而非準度
                (守紅線:付費≠比較準 · 永遠次於下方校準大數字)。 免費 / 未套 0023 → 不顯示。 */}
            {isPaid(profile.tier) && (
              <span
                className="font-mono text-gold/80 text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/40"
                title="付費支持「引擎永遠免費」· 這是身分,不是準度"
              >
                {tierLabel(profile.tier)} · 支持開放引擎
              </span>
            )}
          </p>
        </div>
      </header>

      {/* 追蹤這份帳本(liveness · 登入的非本人訪客才出現 · 自己/未套 0025 → 隱藏)·
          追的是準度不是人氣 · 名單私密 · 旁邊永遠不放粉絲數(紅線)。 */}
      <FollowLedgerButton targetCode={profile.authorCode} />

      {/* 招牌黃金比例髮絲線(品牌唯一可辨識幾何記號 · 校準卡尺 IP)· 把這張最會被
          截圖外傳的公開檔案,錨上品牌記號(同收據頁)· 提升 viral 表面的辨識度。 */}
      <div className="zone27-rule max-w-[300px] mt-6" aria-hidden="true" />

      {/* ── 空檔案 · 尊嚴框(profile 存在但還沒結算的場)──────────────
          不寫「沒資料」· 寫「已經開始鎖了」—— 把弱點翻成最強信號(同足球 SoccerPendingFrame)。 */}
      {!hasBaseball && !hasSoccer && (
        <section className="mt-9 bg-slate/40 border border-gold/30 p-6 sm:p-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            這份帳本
          </p>
          <p className="text-bone text-lg leading-relaxed">
            還沒有結算的押注 —— 但它已經開始記了。
          </p>
          <p className="mt-2 text-mute text-sm leading-relaxed">
            這裡的每一手都在<span className="text-bone">賽前就鎖死</span>、含贏含輸、刪不掉。
            第一場結算後,準度就會出現在這裡 —— 連輸的也一起。
          </p>
        </section>
      )}

      {/* ── 校準身分 · 含輸帳本(主角)──────────────────────────── */}
      {hasBaseball && (
        <section className="mt-9 bg-slate/40 border border-gold/30 p-6 sm:p-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            棒球 · 含輸命中率
          </p>

          {/* THE number */}
          <div className="flex items-baseline gap-3">
            {hasDecided ? (
              <span className="font-mono text-gold text-6xl sm:text-7xl font-light tracking-tight tabular">
                {id.accuracy}
                <span className="text-2xl opacity-60 ml-1">%</span>
              </span>
            ) : (
              <span className="font-mono text-bone text-4xl sm:text-5xl font-light tracking-tight tabular">
                {id.total}
                <span className="font-sans text-mute text-xl ml-2">手在場上</span>
              </span>
            )}
          </div>

          <p className="mt-4 text-bone text-base leading-relaxed">
            押了 <span className="font-mono text-gold tabular">{id.total}</span> 場 ·{" "}
            <span className="font-mono text-gold tabular">✓{id.proved}</span> 中 ·{" "}
            <span className="font-mono text-loss/85 tabular">✕{id.diverged}</span> 沒中
            {id.push > 0 && (
              <>
                {" "}· <span className="font-mono text-mute tabular">={id.push}</span> 平
              </>
            )}
            {id.pending > 0 && (
              <span className="text-mute/70 text-sm"> · {id.pending} 場待開</span>
            )}
          </p>
          <p className="mt-2 font-mono text-mute/60 text-[10px] tracking-[0.2em] leading-relaxed">
            每場賽前鎖定、賽後自動對照引擎 · 押了刪不掉。
          </p>

          {/* 準度歷程 sparkline(soul R208)· 場數夠多才畫(≥FIRM · 不假裝趨勢)*/}
          {hasDecided && id.decided >= FIRM && series && series.length >= 2 && (
            <div className="mt-5">
              <AccuracySparkline series={series} />
              <p className="mt-1.5 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
                準度歷程 · 按比賽日累計 · 虛線 = 亂猜 50%
              </p>
            </div>
          )}

          {/* 三方對照 · 這份帳本 vs 亂猜 vs 引擎(同一批已結算場)*/}
          {hasDecided && (
            <div className="mt-6 pt-5 border-t border-line/40">
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-4">
                同樣這 {id.decided} 場 · 帳本 vs 引擎
              </p>
              <div className="space-y-2.5">
                <CompareBar label="本人" pct={youPct} hit={id.proved} of={id.decided} gold />
                {showEngineBar && (
                  <CompareBar
                    label="引擎"
                    pct={engPct}
                    hit={id.engine.proved}
                    of={id.engine.decided}
                  />
                )}
              </div>
              {/* 亂猜 50% 基準字 · 落在虛線正下方 */}
              <div className="mt-1.5 flex items-center gap-3">
                <span className="w-8 shrink-0" aria-hidden />
                <span className="flex-1 text-center font-mono text-mute/45 text-[9px] tracking-[0.25em]">
                  亂猜 50%
                </span>
                <span className="w-[3.25rem] shrink-0" aria-hidden />
                <span className="hidden sm:inline w-12 shrink-0" aria-hidden />
              </div>

              {/* soul R209 · THE 炫耀數字(第三人稱)· 場數夠(≥10)才掛 · 負的照誠實掛 */}
              {id.edgeVsEnginePts !== null &&
                id.decided >= 10 &&
                id.engine.decided >= 10 && (
                <div className="enter-verdict-reveal mt-5 border-l-2 border-gold/60 bg-gold/[0.05] pl-4 py-2.5">
                  {id.edgeVsEnginePts > 0 ? (
                    <p className="text-bone text-base sm:text-lg leading-snug">
                      這份帳本比那台公開引擎準{" "}
                      <span className="font-mono text-gold tabular text-2xl">
                        +{id.edgeVsEnginePts}
                      </span>{" "}
                      個百分點
                    </p>
                  ) : id.edgeVsEnginePts === 0 ? (
                    <p className="text-bone text-base sm:text-lg leading-snug">
                      這份帳本跟公開引擎 <span className="text-gold">一樣準</span>。
                    </p>
                  ) : (
                    <p className="text-bone text-base sm:text-lg leading-snug">
                      這份帳本比公開引擎低{" "}
                      <span className="font-mono text-loss/85 tabular text-2xl">
                        {-id.edgeVsEnginePts}
                      </span>{" "}
                      個百分點 —— 連這個也不藏。
                    </p>
                  )}
                  <p className="mt-1 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed">
                    同一批 {id.engine.decided} 場 · 跟一台公開機器正面比 · 含輸照算
                  </p>
                </div>
              )}

              <p className="mt-4 text-bone text-sm sm:text-base leading-relaxed">
                {standingVerdict(id)}
              </p>
              {lowSample && (
                <p className="mt-1.5 font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed">
                  場數還少({id.decided} 場)· 這些數字還會跳。
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── 足球戰績(含輸 · 三向 · 跟棒球分開算)· 沒押足球自動隱藏 ──────── */}
      {hasSoccer && <SoccerSection r={soccer} />}

      {/* ── 公開校準曲線(0027 · Metaculus「Checking Our Work」個人公開版)· 報馬仔最不敢攤的 ──
          「TA 說 8 成把握的場、真的中 8 成嗎」逐桶公開含輸 · 沒宣告過把握 / 未套 0027 → view 自回 null。
          同 /member 校準大師卡共用呈現層(CalibrationMasterView)· 口徑零漂移 · subject 換成「TA」。 */}
      <CalibrationMasterView report={calibration} subject="TA" wrapperClass="mt-9" />


      {/* ── costly-signal 框 · 整頁的論點 · 只說一次 ──────────────────── */}
      <section className="mt-8 border-l-2 border-gold/50 pl-4 py-1">
        <p className="text-mute/90 text-[13px] sm:text-sm leading-relaxed max-w-xl">
          這裡每一手都在<span className="text-bone">賽前就鎖死</span>、
          <span className="text-bone">含輸照算</span>、刪不掉。
          賣明牌的靠連勝截圖、輸了刪文;
          <span className="text-gold">這份帳本,他們攤不出來</span>。
        </p>
        {/* 可驗證性 = 護城河:給訪客一條「自己去查」的路(不是要他信,是讓他驗) */}
        <p className="mt-2.5">
          <Link
            href="/audit"
            className="font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
          >
            這些數字怎麼來的、怎麼驗 →
          </Link>
        </p>
      </section>

      {/* 本月賽季回顧入口(R218 · 有本月押注才連 · 避免連到空回顧)· 子路由 /season/[期] ·
          公開檔是全期證物 · 回顧是單月故事(高光 + 一筆誠實失手 + 紀律天數)。 */}
      {hasSeasonActivity && seasonPeriod && (
        <section className="mt-5">
          <Link
            href={`/u/${profile.authorCode}/season/${seasonPeriod}`}
            className="inline-flex items-center font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
          >
            看 {seasonLabel ?? "本月"} 回顧 · 這個月的故事 →
          </Link>
        </section>
      )}

      {/* ── 榮譽牆(第三人稱 public 視角)· 章全部從含輸帳本自動算 ─────────── */}
      <HonorWall identity={id} streak={streak} subject="public" />

      {/* ── 戰功卡 · 數字背後的「實物證物」(soul 願景3)· 每張賽前鎖死、可點進單場收據
          自己驗 —— 把「敢曬輸」從一個數字變成一櫃可外傳、刪不掉的收藏。 沒結算過 → 不顯示。 */}
      {trophies && trophies.length > 0 && (
        <section className="mt-9">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.4em] mb-1.5">
            戰功卡 · 賽前鎖死的每一手
          </p>
          <p className="text-mute/70 text-[13px] leading-relaxed mb-4 max-w-xl">
            數字背後的證物 —— 點任一張進去看單場收據,鎖定時戳改不了。 含贏含輸,
            <span className="text-gold">敢留輸的</span>,賣明牌的攤不出來。
          </p>
          <TrophyGrid trophies={trophies} showSummary={false} />
        </section>
      )}

      {/* ── 結尾轉換 · 免費建你自己的帳本(引擎永遠免費)· 付費身分當安靜副線 ───── */}
      <section className="mt-12 pt-8 border-t border-line/50 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
          換你
        </p>
        <h2 className="text-xl sm:text-2xl text-bone font-light tracking-tight leading-snug">
          看完別人的帳本,該建<span className="text-gold">你自己的</span>了。
        </h2>
        <p className="mt-4 text-mute text-sm leading-relaxed max-w-md mx-auto">
          ZONE 27 的引擎<span className="text-bone">永遠免費</span>。
          押一手、賽前鎖死、含輸照算 —— 你也會有一份刪不掉的公開帳本。
        </p>
        <Link
          href="/login?next=/member"
          className="mt-7 inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          免費建立你的帳本 →
        </Link>
        <p className="mt-5 text-mute/70 text-[13px] leading-relaxed">
          想支持這個專案、出錢養著免費引擎?{" "}
          <Link
            href="/membership"
            className="text-gold/75 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            認識 BLACK / GOLD →
          </Link>
        </p>
      </section>
    </div>
  );
}

// ── 單條對照軌 · 命中率橫條 + 50% 亂猜虛線(同 CalibrationIdentityCard 視覺語言)─────
function CompareBar({
  label,
  pct,
  hit,
  of,
  gold = false,
}: {
  label: string;
  pct: number;
  hit: number;
  of: number;
  gold?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-8 shrink-0 font-mono text-[10px] tracking-[0.1em] ${
          gold ? "text-gold" : "text-mute/70"
        }`}
      >
        {label}
      </span>
      <div className="relative flex-1 h-4 bg-line/30 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${gold ? "bg-gold/85" : "bg-bone/30"}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 border-l border-dashed border-mute/50"
          style={{ left: "50%" }}
        />
      </div>
      <span
        className={`w-[3.25rem] shrink-0 text-right font-mono tabular text-sm ${
          gold ? "text-gold" : "text-mute"
        }`}
      >
        {Math.round(pct)}%
      </span>
      <span className="hidden sm:inline w-12 shrink-0 text-right font-mono text-mute/50 text-[10px] tabular">
        {hit}/{of}
      </span>
    </div>
  );
}

// ── 足球戰績區(第三人稱 · 含輸 · 含同場 你 vs 引擎)──────────────────────
function SoccerSection({ r }: { r: SoccerRecord }) {
  const { n, hits, misses, rate, pending, late, vsN, vsYouHits, vsEngineHits } = r;
  return (
    <section className="mt-6 bg-slate/40 border border-gold/30 p-5 sm:p-6">
      <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-2">
        足球 · 含輸命中率
      </p>
      {n > 0 ? (
        <p className="text-bone text-lg sm:text-xl font-light tracking-tight">
          <span className="text-gold tabular">{rate}%</span> 準 ·{" "}
          <span className="text-gold tabular">✓{hits}</span>{" "}
          <span className="text-loss tabular">✕{misses}</span>
          <span className="text-mute/60 text-sm"> · {n} 場已結算</span>
          {pending > 0 && (
            <span className="text-mute/50 text-sm"> · {pending} 場進行中</span>
          )}
        </p>
      ) : pending > 0 ? (
        <p className="text-bone text-base font-light leading-snug">
          押了 <span className="text-gold tabular">{pending}</span> 場 ·
          <span className="text-mute/70"> 都還沒結算 —— 賽後自動掛準 / 不準,連輸的也留著</span>
        </p>
      ) : null}

      {/* 晚押誠實剔除 · 公開面同 /member(無聲消失比剔除更傷信任 · 同一把尺)。 */}
      {late > 0 && (
        <p className="mt-2 font-mono text-mute/55 text-[10px] tracking-[0.12em] leading-snug">
          {late} 場開賽後才押 · 不計入戰績(先鎖後結 · 開賽前押的才算數)
        </p>
      )}

      {vsN > 0 && (
        <p className="mt-2.5 pt-2.5 border-t border-line/40 font-mono text-[12px] tracking-[0.04em] text-mute/80">
          同 <span className="text-bone tabular">{vsN}</span> 場 本人 vs 引擎:
          <span className="text-bone"> 本人 ✓{vsYouHits}</span> ·
          <span className="text-bone"> 引擎 ✓{vsEngineHits}</span>
          <span className="text-mute/55">
            {" "}
            ·{" "}
            {vsYouHits > vsEngineHits
              ? "本人領先"
              : vsYouHits < vsEngineHits
                ? "引擎暫時領先"
                : "打平"}
          </span>
        </p>
      )}

      <p className="mt-2 font-mono text-mute text-[9px] tracking-[0.12em] leading-snug">
        三向對帳(主勝 / 和 / 客勝)· 賽前鎖死、賽後自動結算 · 跟棒球準度分開算。
      </p>
    </section>
  );
}
