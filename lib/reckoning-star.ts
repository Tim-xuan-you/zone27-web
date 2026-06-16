import type { CalibrationIdentity } from "@/lib/predictions";

// ── ZONE 27 · 對帳之星 · 米其林式「賺來的稀有」榮譽(單一真相)──────────────────
// 達標 = 在 ≥RECKONING_STAR_MIN 場「賽前鎖死、含輸」的公開對帳裡,準度贏過那台只敢喊 57%
// 的誠實引擎。 米其林三性質:① 賺來的、錢買不到 ② on-read 即時算 → 滑落自動收回(同每年複評)
// ③ 稀有來自高門檻(不是限量名額 = 賭場 FOMO 紅線)。
//
// 🔴 為什麼抽成單一檔:這顆星散在四面 —— /u 公開檔(ProfileView)、/u OG 分享卡、/member 目標、
//   /ladder 神準手/神諭(LADDER_SHARP_MIN 同 30)。 門檻 + 判定邏輯只准有一個來源,免得各面漂移。
//   含輸照算(非連勝/PnL)· edge>0 才算(真的贏過、不是平手)· 你跟引擎都要 ≥MIN 場(公平樣本)。
// ─────────────────────────────────────────────────────

// 米其林式高門檻(Bill James SAMPLE DEBT 慣例)· 一晚/十場手氣不算頂。
export const RECKONING_STAR_MIN = 30;
// 「追星軌道」最低樣本:低於此數字還在跳,不談「快到了」(同全站 FIRM)。
const TRACK_MIN = 8;

export type ReckoningStar = {
  /** 達標:≥MIN 場含輸對帳裡準度贏過引擎(你 + 引擎同場都 ≥MIN) */
  earned: boolean;
  /** 你已對帳場數(含輸) */
  decided: number;
  /** 贏過引擎幾分(>0 才有意義 · null = 無對照) */
  edge: number | null;
  /** 在不在「追星軌道」上:正在贏引擎、樣本夠穩可談、但還沒到門檻(給 /member 目標鉤) */
  onTrack: boolean;
  /** 還差幾場到門檻(至少 1)· 看「你 / 引擎同場對照」較少的那邊離 MIN 多遠 */
  toGo: number;
};

/** 從個人校準身分推導對帳之星狀態。 純函式 · on-read · 0 I/O。 同一份口徑給所有面用。 */
export function reckoningStar(id: CalibrationIdentity): ReckoningStar {
  const beat =
    id.beatEngine === true &&
    id.edgeVsEnginePts !== null &&
    id.edgeVsEnginePts > 0;
  // 公平樣本 = 「你」與「引擎同場對照」較少的那邊(兩邊都要夠厚才算數)。
  const sample = Math.min(id.decided, id.engine.decided);
  const earned = beat && sample >= RECKONING_STAR_MIN;
  const onTrack = beat && !earned && sample >= TRACK_MIN;
  const toGo = Math.max(1, RECKONING_STAR_MIN - sample);
  return { earned, decided: id.decided, edge: id.edgeVsEnginePts, onTrack, toGo };
}
