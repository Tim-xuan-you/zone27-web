import Link from "next/link";
import BadgeIcon from "@/components/BadgeIcon";
import type { CalibrationIdentity, DisciplineStreak } from "@/lib/predictions";

// ── ZONE 27 · 你的榮譽牆(soul-roadmap #5 · 「靠誠實賺來的地位」· 三樓第一塊)──────
// Tim 看玩運彩的徽章/殺手榜 → 要「景仰 / 收藏 / 優越」。 但他們的章獎勵連勝 + 人氣 +
// 賣量 + 發文量(全部裝得出來、刷得到、輸了刪)。 我們的章**全部從含輸的帳本自動算**
// —— 刪不掉、裝不來、報馬仔結構上掛不出來(他們的生意建立在藏輸之上)= 抄不走的 costly
// signal。 北極星:讓「誠實」成為全站最稀有的收藏品。
//
// 🔴 紅線(R201 成就系統設計 · 3-agent 紅隊過):絕不獎勵「連勝 / 人氣 / 粉絲 / 賣量 /
//   發文量」· 只獎勵「校準 / 含輸命中 / 贏公開引擎 / 紀律(回來對帳,不是連贏)」。 streak 章
//   一律綁 longest/totalDays(回來面對的天數)· 絕非連勝。 場數(25)當「公信力入場券」非名次
//   (場數=地位 = 對手的 22 級發文量崇拜 · 紅線)。 樣本門檻防 1-2 場僥倖。
// 🪜 收集梯度(Tim「要讓人想蒐集、挑戰、有層級」):入門 → 進階 → 精英,易到難,新人立刻
//   點得亮一排、高手要爬很久。「已點亮 N/M」= 收集進度條(goal-gradient)。 全部現有資料算得出
//   (Wave 1 · 零新資料)· 傳奇章(校準大師/透明帳本/連月勝引擎)需新資料,等開門後 Wave 2 補。
// 排版:章是配角(三樓)· 框 mute(讓上面金色校準卡當唯一主角)· 爬進 /member 才看得到 = 稀缺。
//
// 純展示 server component · 計算來自 aggregateIdentity + aggregateStreak(單一真相)。
// ─────────────────────────────────────────────────────

const ROOKIE_MIN = 10; // 上天梯門檻 · 同 /ladder · CalibrationIdentityCard
const FIRM = 8; // 「勝過亂猜」最低樣本 · 同 CalibrationIdentityCard SAMPLE_FIRM
const THICK = 25; // 帳本夠厚 · 公信力入場券(非名次)
const EDGE_BIG = 10; // 大幅勝引擎 · 含輸還領先引擎 ≥10 分
const STREAK_WK = 7; // 連續對帳一週
const STREAK_MO = 30; // 連續對帳一個月
const DISCIPLINE_100 = 100; // 紀律百日(回來對帳累積/最長 100 天)

type Tier = "入門" | "進階" | "精英";

type Honor = {
  key: string;
  glyph: string; // 幾何 / 數字字符(無 emoji · 無星等 · 守品牌)
  name: string;
  tier: Tier;
  earned: boolean;
  detail: string; // 點亮:你怎麼賺到的;未點亮:怎麼解鎖(給目標 · 非只是灰掉)
};

// 易 → 難排序(收集梯度)· 全部 integrity-based · 全部用既有欄位算得出。
function buildHonors(id: CalibrationIdentity, st: DisciplineStreak): Honor[] {
  const firm = id.decided >= FIRM;
  const beatCoin = id.vsCoinPts !== null && id.vsCoinPts > 0 && firm;
  const edge = id.edgeVsEnginePts;
  const bigEdge = id.beatEngine === true && edge !== null && edge >= EDGE_BIG;
  return [
    // ── 入門 ──────────────────────────────
    {
      key: "first",
      glyph: "1",
      name: "首戰登錄",
      tier: "入門",
      earned: id.total >= 1,
      detail: "押下第一手 · 進了刪不掉的帳本",
    },
    {
      key: "ladder",
      glyph: "10",
      name: "上天梯",
      tier: "入門",
      earned: id.total >= ROOKIE_MIN,
      detail:
        id.total >= ROOKIE_MIN
          ? "累積滿 10 場 · 夠資格上海選天梯排名"
          : `再 ${ROOKIE_MIN - id.total} 場 · 上天梯排名`,
    },
    {
      key: "thick",
      glyph: "25",
      name: "帳本夠厚",
      tier: "入門",
      earned: id.decided >= THICK,
      detail:
        id.decided >= THICK
          ? "滿 25 場結算 · 命中率有公信力了(刷不出來)"
          : `再 ${THICK - id.decided} 場結算 · 命中率才站得住(防僥倖)`,
    },
    // ── 進階 ──────────────────────────────
    {
      key: "coin",
      glyph: "△",
      name: "勝過亂猜",
      tier: "進階",
      earned: beatCoin,
      detail: beatCoin
        ? `含輸還是比丟銅板準 ${id.vsCoinPts} 分`
        : firm
          ? "含輸命中率要先過 50%(亂猜線)"
          : `先累到 ${FIRM} 場結算 · 數字才算數`,
    },
    {
      key: "streak7",
      glyph: "7",
      name: "連續對帳 7 日",
      tier: "進階",
      earned: st.longest >= STREAK_WK,
      detail:
        st.longest >= STREAK_WK
          ? "連 7 天回來面對帳本 · 不管輸贏"
          : st.longest > 0
            ? `最長連 ${st.longest} 天 · 衝到 7`
            : "連續 7 天回來對帳(紀律,不是連贏)",
    },
    {
      key: "engine",
      glyph: "◆",
      name: "贏過引擎",
      tier: "進階",
      earned: id.beatEngine === true,
      detail:
        id.beatEngine === true
          ? "同一批場 · 命中率超過免費引擎"
          : "同一批已結算場 · 命中率要超過引擎",
    },
    {
      key: "month",
      glyph: "↑",
      name: "本月勝引擎",
      tier: "進階",
      earned: id.month.beatEngine === true,
      detail:
        id.month.beatEngine === true
          ? "這個月領先引擎 = 升階要的那一條"
          : "這個月命中率贏過引擎(每月重算)",
    },
    // ── 精英 ──────────────────────────────
    {
      key: "edge",
      glyph: "◆◆",
      name: "大幅勝引擎",
      tier: "精英",
      earned: bigEdge,
      detail: bigEdge
        ? `含輸還領先引擎 ${edge} 分 · 壓制級`
        : "同一批場 · 領先引擎 10 分以上(不只贏一點)",
    },
    {
      key: "streak30",
      glyph: "30",
      name: "連續對帳 30 日",
      tier: "精英",
      earned: st.longest >= STREAK_MO,
      detail:
        st.longest >= STREAK_MO
          ? "連 30 天回來面對帳本 · 紀律成形"
          : st.longest > 0
            ? `最長連 ${st.longest} 天 · 朝 30 天前進`
            : "連續 30 天回來對帳",
    },
    {
      key: "discipline",
      glyph: "100",
      name: "紀律百日",
      tier: "精英",
      earned: st.longest >= DISCIPLINE_100 || st.totalDays >= DISCIPLINE_100,
      detail:
        st.longest >= DISCIPLINE_100 || st.totalDays >= DISCIPLINE_100
          ? "累積 100 天回來對帳 · 報馬仔世界不存在的物種"
          : `已累積 ${st.totalDays} 天 · 朝 100 天紀律前進`,
    },
  ];
}

const TIER_ORDER: Tier[] = ["入門", "進階", "精英"];

// 鑄印章樣式 · earned = 灌好的金章(精英多印璽外環 + 放大)· locked = 空模子(等灌金)。
// 徽記用 BadgeIcon(currentColor):earned 走 badge-engrave(藏青蝕刻)· locked 幽靈金線。
function sealClass(tier: Tier, earned: boolean): {
  box: string;
  iconWrap: string;
  iconSize: number;
} {
  const elite = tier === "精英";
  const dim = elite ? "w-12 h-12" : "w-10 h-10";
  const iconSize = elite ? 24 : 20;
  if (earned) {
    return {
      box: `${dim} rounded-full ${elite ? "badge-relief" : "badge-minted"}`,
      iconWrap: "badge-engrave",
      iconSize,
    };
  }
  return { box: `${dim} rounded-full badge-mold`, iconWrap: "text-gold/30", iconSize };
}

export default function HonorWall({
  identity: id,
  streak,
  subject = "self",
}: {
  identity: CalibrationIdentity;
  streak: DisciplineStreak;
  /** "self" = 會員看自己(/member · 第二人稱「你」)· "public" = 別人看這份檔案
   *  (/u/[code] · 去人稱 · streak 改報最長/累計而非「今天接上」CTA)。 預設 self 不動既有。 */
  subject?: "self" | "public";
}) {
  // 還沒押任何一場 → 不顯示(上面校準卡已有「去押第一注」· 不擺一面灰章嚇新人)
  if (id.total === 0) return null;

  const honors = buildHonors(id, streak);
  const earned = honors.filter((h) => h.earned).length;
  const pub = subject === "public";

  return (
    <section className="mt-8 bg-slate/40 border border-line/50 p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          {pub ? "榮譽牆" : "你的榮譽"}
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] tabular">
          已點亮 <span className="text-gold">{earned}</span> / {honors.length}
        </p>
      </div>

      {/* 誠實 frame · 這面牆抄不走 = 護城河(玩運彩靠連勝/人氣/賣量發章 · 結構上掛不出這個) */}
      <p className="mb-4 text-mute/85 text-[13px] leading-relaxed max-w-xl">
        每個章都從{pub ? "" : "你"}
        <span className="text-bone">含輸的帳本</span>自動算 —— 刪不掉、裝不來。
        賣明牌的站靠連勝、人氣、賣量發章;
        <span className="text-gold">這面牆,他們掛不出來</span>。
      </p>

      {/* 對帳紀律一行 · 只在 public(/u 公開檔)掛:報最長/累計(回來對帳天數 = 紀律證據)。
          self(/member)的「現在連續 + 今天接上」已收進頂端「今天」焦點條 TodayStrip ——
          此處不重複(R218 收乾淨 · 單一動作面)。 紀律里程碑(7/30/100 日)走下方 streak 徽章。 */}
      {pub && (
        <p className="mb-5 font-mono text-mute/65 text-[11px] tracking-[0.15em] leading-relaxed">
          對帳紀律 ·{" "}
          {streak.longest > 0 || streak.totalDays > 0 ? (
            <>
              最長連續 <span className="text-bone tabular">{streak.longest}</span> 天 ·
              累計回來對帳 <span className="text-bone tabular">{streak.totalDays}</span> 天
            </>
          ) : (
            <span className="text-mute">還在累積</span>
          )}
          <span className="text-mute/40"> · 紀律,不是準度</span>
        </p>
      )}

      {/* 入門 → 進階 → 精英 · 易到難的收集梯度(分階小標 + 各階一格 grid)*/}
      <div className="flex flex-col gap-5">
        {TIER_ORDER.map((tier) => {
          const rows = honors.filter((h) => h.tier === tier);
          if (rows.length === 0) return null;
          const tierEarned = rows.filter((h) => h.earned).length;
          return (
            <div key={tier}>
              <p className="font-mono text-mute/55 text-[9px] tracking-[0.35em] mb-2">
                {tier} <span className="text-mute/40">· {tierEarned}/{rows.length}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {rows.map((h) => {
                  const s = sealClass(h.tier, h.earned);
                  return (
                  <div
                    key={h.key}
                    className={`flex items-center gap-3.5 px-3 py-3 border transition-colors ${
                      h.earned
                        ? "border-gold/45 bg-gold/[0.05]"
                        : "border-line/50 bg-ink/30"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-flex shrink-0 items-center justify-center ${s.box}`}
                    >
                      <span className={`inline-flex ${s.iconWrap}`}>
                        <BadgeIcon name={h.key} size={s.iconSize} />
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`flex items-center gap-1.5 font-mono text-[12px] tracking-[0.15em] ${
                          h.earned ? "text-bone" : "text-mute/55"
                        }`}
                      >
                        {h.name}
                        {h.earned && <span className="text-gold/80 text-[10px]">✓</span>}
                      </span>
                      <span
                        className={`block text-[11px] leading-snug mt-0.5 ${
                          h.earned ? "text-mute/80" : "text-mute/45"
                        }`}
                      >
                        {h.detail}
                      </span>
                    </span>
                  </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 三樓出口 · 地位的歸宿(公開天梯)· 安靜次要 · 不搶上面校準卡的金色主角 */}
      <p className="mt-5">
        <Link
          href="/ladder"
          className="font-mono text-gold/80 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
        >
          這些章怎麼換到天梯排名 →
        </Link>
      </p>
    </section>
  );
}
