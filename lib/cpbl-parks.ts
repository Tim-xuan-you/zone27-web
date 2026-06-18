// ── ZONE 27 · CPBL Park Factor Reference Data ──────────
// Round 37 W-C · Park Factor lens scaffold(第 2 個 BLACK analytical
// lens 真實 LIVE · 接 R37 W-B Vibe Check)· per [[feedback-no-waiting-rule]]
// 鐵律「任何現在能做就做 · 不等 Q3」。
//
// Sources & disclosure(per /audit Section 02 ESTIMATION DISCLOSURE):
//
//   · Home advantage %       · ESTIMATE · CPBL aggregate league baseline
//                              ~53% home win 過去 5 季均值 · 場館 specific
//                              derive from stadium dimensions + elevation +
//                              dome/open observable factors
//   · R/G environment        · ESTIMATE · 球場左右外野距離 + 高度 +
//                              outfield wall height observable
//   · Hitter/Pitcher tilt    · ESTIMATE · binary axis derived from R/G
//                              + home advantage tilt
//   · Capacity / 開場年       · 真實 · public stadium fact
//
// 任何 CPBL park-factor 工作者(球評 / sabermetrician / 球隊分析師)可發
// PR 提供 verified park-specific BPF(Basic Park Factor)+ wOBA-park ·
// 此檔立即 update · 引擎輸出 + visualization 自動 reflect。
//
// Brand IP · educational lens · 不是 prediction signal:
//   · Pratfall · 主動承認「park factor ≠ outcome predictor」 · 只是
//     multiplier on team-level skills
//   · Costly Signaling · 公開 estimate methodology + source 邀請 PR · 不藏
//   · 0 cash · 0 referral · 0 social transfer
//   · Disclosure Philosophy · 延伸 /audit Section 02 同 pattern
// ─────────────────────────────────────────────────────

export type ParkFactor = {
  /** Venue 全名 · matches.ts venue field 對應 */
  venue: string;
  /** Stadium English label · 顯示 lens header */
  en: string;
  /** Home team(常駐使用) · 不一定每場主辦 · 中職多 venue rotate */
  homeTeam: string;
  /** Stadium 啟用年 · public fact */
  openedYear: number;
  /** Estimated 主隊勝率 baseline · CPBL aggregate ~53% · 場館 tilt ±3pp */
  estimatedHomeWinPct: number;
  /** Estimated 平均得分環境 R/G(雙方合計)· CPBL season ~9.5 R/G league baseline */
  estimatedRunsPerGame: number;
  /** Hitter / Pitcher / Neutral tilt · descriptive lens · 不是 prediction */
  tilt: "hitter" | "pitcher" | "neutral";
  /** Observable factor 簡短說明 · public-record reasoning · 不藏 */
  rationale: string;
};

export const CPBL_PARK_BASELINE_HOME_WIN_PCT = 53;
export const CPBL_PARK_BASELINE_RUNS_PER_GAME = 9.5;
export const CPBL_PARK_DATA_FETCH_DATE = "2026-05-22";

// ── 4 CPBL home venues 目前 matches.ts 出現 ────────────
// 完整 CPBL 12+ venues 將來 expand · 目前 ingestion 內 4 個 sample
// per [[zone27-coverage-philosophy]]「cover engine-validated games」
// ─────────────────────────────────────────────────────
export const cpblParks: ParkFactor[] = [
  {
    venue: "新莊棒球場",
    en: "XINZHUANG",
    homeTeam: "富邦悍將",
    openedYear: 1997,
    // mid-sized · 中外野 122m · neutral · 略微 pitcher-friendly
    estimatedHomeWinPct: 51,
    estimatedRunsPerGame: 9.2,
    tilt: "neutral",
    rationale: "中外野 122m · 中型場 · 海平面 · neutral baseline",
  },
  {
    venue: "樂天桃園棒球場",
    en: "TAOYUAN",
    homeTeam: "樂天桃猿",
    openedYear: 2009,
    // 中外野 122m 但左右翼短 · 球容易出去 · hitter-friendly
    estimatedHomeWinPct: 55,
    estimatedRunsPerGame: 10.1,
    tilt: "hitter",
    rationale: "左右翼短 · 海拔低 · 易出全壘打 · 偏打者",
  },
  {
    venue: "臺北大巨蛋",
    en: "TAIPEI DOME",
    homeTeam: "中信兄弟",
    openedYear: 2024,
    // 新場 · 室內 · 風阻消除 · 球速保留 · 略偏打者
    estimatedHomeWinPct: 53,
    estimatedRunsPerGame: 9.7,
    tilt: "hitter",
    rationale: "室內 dome · 無風阻 · 球速保留 · 略偏打者",
  },
  {
    venue: "澄清湖棒球場",
    en: "CHENGCING LAKE",
    homeTeam: "台鋼雄鷹",
    openedYear: 1998,
    // 中型 · 海拔 + 球場乾燥 · 中外野 122m · 略偏打者
    estimatedHomeWinPct: 54,
    estimatedRunsPerGame: 9.8,
    tilt: "hitter",
    rationale: "南部乾燥 · 球體積較大 · 海拔約 30m · 略偏打者",
  },
  {
    // R139 W1 · NEW · 嘉義市棒球場 added per cpbl-260526-02 ingest ·
    // 統一獅 secondary home(primary 台南棒球場)· 1918 開幕 historic ground
    // 多次 renovation · CPBL 主辦 hosts assigned per season schedule。
    venue: "嘉義市棒球場",
    en: "CHIAYI MUNICIPAL",
    homeTeam: "統一獅",
    openedYear: 1918,
    // 老場 · 中外野 122m · 嘉義市區位 · 南部乾燥 · neutral baseline
    // historic Asahi Stadium 改建 · 多次整修 · capacity ~11,500
    estimatedHomeWinPct: 52,
    estimatedRunsPerGame: 9.5,
    tilt: "neutral",
    rationale: "1918 開幕 · 多次 renovation · 中型場 · 嘉義市區 · neutral baseline",
  },
  {
    // 2026-06-03 ingest 補:味全龍主場 · cpbl-260531-01 等場次使用 · 1999 開幕
    venue: "天母棒球場",
    en: "TIANMU",
    homeTeam: "味全龍",
    openedYear: 1999,
    // 台北市區 · 中型場 · 中外野約 121m · 海平面 · neutral baseline
    estimatedHomeWinPct: 53,
    estimatedRunsPerGame: 9.5,
    tilt: "neutral",
    rationale: "1999 開幕 · 台北天母市區 · 中外野約 121m · 海平面 · neutral baseline",
  },
  {
    // 2026-06-05 ingest 補:中信兄弟主場 · cpbl-260605-01 使用 · 2006 開幕
    venue: "臺中洲際棒球場",
    en: "TAICHUNG INTERCONTINENTAL",
    homeTeam: "中信兄弟",
    openedYear: 2006,
    // 大型場 · 中外野深 · 海平面 · 略偏投手(ESTIMATE · per /audit S02)
    estimatedHomeWinPct: 53,
    estimatedRunsPerGame: 9.0,
    tilt: "pitcher",
    rationale: "2006 開幕 · 中外野深 · 大型場 · 海平面 · 略偏投手",
  },
  {
    // 2026-06-18 ingest 補:統一獅 2026 新主場 · 台南安南區 · 自台南市立棒球場遷入
    //（2026-03-29 首戰統一 vs 台鋼）· 台灣最大戶外球場 25,000 席 · cpbl-260618-01 使用。
    venue: "亞太棒球村",
    en: "ASIA PACIFIC",
    homeTeam: "統一獅",
    openedYear: 2026,
    // 新場 · 職棒樣本極少 → 場地 tilt 未知 · 誠實採 CPBL 聯盟 baseline(ESTIMATE · per /audit S02)
    estimatedHomeWinPct: 53,
    estimatedRunsPerGame: 9.5,
    tilt: "neutral",
    rationale: "2026 啟用 · 統一獅新主場(台南安南區 · 台灣最大戶外球場 25,000 席)· 職棒樣本少 · 採聯盟 baseline",
  },
];

export function getParkFactorByVenue(venue: string): ParkFactor | null {
  return cpblParks.find((p) => p.venue === venue) ?? null;
}

/**
 * Home advantage delta from CPBL baseline 53%。
 * Positive = park favors home over baseline · negative = park favors away。
 */
export function getHomeAdvantageDelta(park: ParkFactor): number {
  return park.estimatedHomeWinPct - CPBL_PARK_BASELINE_HOME_WIN_PCT;
}

/**
 * Run environment delta from CPBL baseline 9.5 R/G。
 * Positive = high-scoring park · negative = pitcher's park。
 */
export function getRunsDelta(park: ParkFactor): number {
  return park.estimatedRunsPerGame - CPBL_PARK_BASELINE_RUNS_PER_GAME;
}
