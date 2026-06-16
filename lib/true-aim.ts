import type { CalibrationReport } from "@/lib/calibration-master";

// ── ZONE 27 · 準心 · 米其林「必比登」式姊妹榮譽(校準軸 · 單一真相)──────────────────
// 對帳之星(reckoning-star)量的是「準度贏不贏得過引擎」(ACCURACY / 鑑別力)。
// 準心量的是另一條完全不同的軸:「你說幾成把握、就真的中幾成」(CALIBRATION / 自知之明)——
// 538 / Metaculus「Checking Our Work」最看重、而全世界沒有任何明牌站敢做的那種誠實。
// 兩者平行、不分高下:一個量你贏不贏得過機器,一個量你看不看得準自己,都極少人拿得到。
//
// 米其林三性質一樣守:① 賺來的、錢買不到(只吃 CalibrationReport · 0 tier 輸入 → 付費永遠算不出)
//   ② on-read 即時算 → 滑掉自動收回(同每年複評)③ 稀有來自高門檻、不是限量名額(賭場 FOMO 紅線)。
//
// 🔴 為什麼這支的數學要很硬(它是信任護城河的一塊 · 一個灌水的準心就毀掉整套榮譽):
//   · confidence 只有 {50,60,70,80,90} 五檔(ConfidencePicker)· 桶數 ≤5 · 每桶 actualPct = hits/n
//     是量化跳格的(n=8 → 只能落在 0/12.5/25…)。 所以「固定 N 分容差」會比桶本身的量化還細 =
//     在量骰子不是量校準。 改用「噪音帶」:每桶容許的偏差 = 二項標準誤 × Z(n 越小帶越寬 —— 幾場本來
//     就分不出 7 成跟 6 成;n 越大帶越窄 —— 資料多就該更準)。 真校準者過得了、系統性過度自信的報馬仔過不了。
//   · 反退化:只看校準誤差會把「永遠喊 50%、剛好中 50%」誤判成完美(其實它什麼主張都沒下)。
//     所以要 sharpness:用了 ≥3 個不同把握檔(各 ≥MIN_BUCKET_N 場)、且 n-加權平均離 50 夠遠
//     (真的下了判斷)。 n-加權 → 直打 RPC 塞一手 n=1 的極端把握想鑽門檻,貢獻趨近 0,鑽不動。
//   · 寧可漏掉真校準者,也絕不誤頒給未校準者(false negative 可接受 · false positive 不可) ——
//     三閘 AND、任一不過即否決。 米其林「這城市還沒夠格、王座就空著」是 feature 不是 bug。
//   · ⚠️ 四個門檻常數是先驗拍板(0 真實多用戶分布可回測)· 改它們 = 改稀有度 = Tim 拍板級,不可悄改。
// 純函式 deterministic · 0 I/O · 0 import(型別除外)· 好測。
// ─────────────────────────────────────────────────────

// 米其林式高門檻(同 RECKONING_STAR_MIN · Bill James SAMPLE DEBT)· 一晚/十場手氣不算頂。
export const TRUE_AIM_MIN_DECIDED = 30;
// 「追星軌道」最低樣本(同全站 FIRM / TRACK_MIN)· 低於此不談「快到了」。
const TRACK_MIN = 8;
// 一個把握檔要 ≥ 這麼多場才算「真的示範過這個把握」· 擋:① 直打 RPC 塞單點極端值鑽門檻
// ② 量化噪音(n 太小時 actualPct 跳格太粗,判不出校準)。
const MIN_BUCKET_N = 5;
// 至少用過這麼多個「夠厚」的不同把握檔 = 真的在分辨高低把握(不是永遠喊同一個數)。
const MIN_DISTINCT = 3;
// n-加權平均「離 50 的距離」要 ≥ 這麼多分 = 平均而言真的下了判斷(不是永遠喊銅板局)。
// 用對稱 |conf−50| 不設絕對信心地板 → 未來若開放更低把握檔(足球三向)也不歧視「低但有主張」的宣告。
const MIN_MEAN_DIST = 8;
// 噪音帶倍數:每桶容許偏差 = 二項標準誤 × 此值。 1.5 ≈ 嚴但真校準者各桶仍約 87% 過得了 →
// 整體達得到(不是被量化噪音卡死成永遠 0 人),系統性偏 ≥2 個標準誤的桶會被抓出來。
const NOISE_Z = 1.5;
// 噪音帶下限(分)· 大樣本桶標準誤很小時別把帶收到不近人情 + 吸收 actualPct 量化的最後一格。
const BAND_FLOOR_PTS = 8;

export type TrueAim = {
  /** 達標:≥MIN 場含輸 · 用了 ≥3 個夠厚的不同把握檔且真的下了判斷 · 每個夠厚的桶都落在噪音帶內 */
  earned: boolean;
  /** 已結算、先鎖後結後計入校準的場(= report.decided) */
  decided: number;
  /** 已結算場「平均宣告把握」%(人話顯示用 · 來自 report.statedAvg) */
  statedAvg: number | null;
  /** 已結算場「實際命中率」%(來自 report.actualAvg) */
  actualAvg: number | null;
  /** 在不在「追星軌道」上:品質(sharpness + 校準)都已達標、只差場數沒到門檻(給目標鉤) */
  onTrack: boolean;
  /** 還差幾場到門檻(至少 1) */
  toGo: number;
};

// 一個把握桶的「合理抽樣噪音」帶(百分點)· 二項標準誤 × Z · 含下限。
// p = 宣告把握 · n = 該桶場數 · 回傳「這桶的 |宣告 − 實際| 容許落在多少分內」。
function bandPts(confidence: number, n: number): number {
  if (n <= 0) return Infinity;
  const p = Math.min(0.99, Math.max(0.01, confidence / 100));
  const sePts = Math.sqrt((p * (1 - p)) / n) * 100;
  return Math.max(BAND_FLOOR_PTS, NOISE_Z * sePts);
}

/** 從個人校準報告推導準心狀態。 純函式 · on-read · 同一份口徑給所有面用(/u · /member)。 */
export function trueAim(report: CalibrationReport): TrueAim {
  const decided = report.decided;
  const toGo = Math.max(1, TRUE_AIM_MIN_DECIDED - decided);
  const base: TrueAim = {
    earned: false,
    decided,
    statedAvg: report.statedAvg,
    actualAvg: report.actualAvg,
    onTrack: false,
    toGo,
  };
  if (decided <= 0 || report.buckets.length === 0) return base;

  // fail-closed:口徑漂移(桶 n 加總 ≠ decided · 例如足球 draw 被上游誤當 push 剔除)→ 不算、不頒
  // (寧可不顯也絕不對著被污染的資料誤發榮譽)。
  const nSum = report.buckets.reduce((s, b) => s + Math.max(0, b.n), 0);
  if (nSum !== decided) return base;

  let wDist = 0; // Σ n·|conf−50|(n-加權 · 單點植入貢獻趨近 0)
  let distinct = 0; // n ≥ MIN_BUCKET_N 的不同把握檔數
  let allWithinBand = true; // 每個「夠厚」的桶都落在自己的噪音帶內(太薄的桶噪音太大、不拿來判)
  for (const b of report.buckets) {
    if (b.n <= 0) continue;
    wDist += b.n * Math.abs(b.confidence - 50);
    if (b.n >= MIN_BUCKET_N) {
      distinct += 1;
      if (Math.abs(b.confidence - b.actualPct) > bandPts(b.confidence, b.n)) {
        allWithinBand = false;
      }
    }
  }
  const meanDistFrom50 = wDist / decided;

  const sharp = distinct >= MIN_DISTINCT && meanDistFrom50 >= MIN_MEAN_DIST;
  const calibrated = allWithinBand;

  const earned = decided >= TRUE_AIM_MIN_DECIDED && sharp && calibrated;
  // 追星軌道:品質(夠分散有主張 + 每桶都在噪音帶內)都已達標、只差場數(誠實門檻,非 near-miss 陷阱)。
  const onTrack = !earned && sharp && calibrated && decided >= TRACK_MIN;

  return { ...base, earned, onTrack };
}
