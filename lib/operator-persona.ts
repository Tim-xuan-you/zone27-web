// ── ZONE 27 · 操盤風格(Operator Persona)──────────────────────────────────
// Tim 2026-06-28「加點玄學?塔羅/生肖/星座?」的破壞式正解:玄學 = 我們要取代的 LINE 老師,
// 碰了就自毀「不靠直覺只看演算法」。 但人愛玄學的心理動機(「這超像我」的身分認同 + 可外傳)
// 是真的。 解 = 用『真材料』給同樣的爽感 —— 從你**真實押注紀錄**算出你的「操盤風格」,像星座
// 但是你自己賺來的、可驗證的。
//
// 🔴 鐵律(守死):
//   ① 風格 ≠ 準度。 這只描述「你怎麼押」(順著機器 / 逆著機器),不是「你多準」(那是操盤室階級)。
//      像 MBTI vs IQ —— 風格給溫度,天梯才是計分板。 絕不暗示哪種風格比較準 / 比較會贏。
//   ② 只「描述過去」絕不「預測未來」—— 一旦變成「你今天該押 X」就變回我們剛拒絕的玄學。 全用過去式。
//   ③ 樣本紀律:不夠場數(< PERSONA_MIN)→「還在成形」· 不拿三五場硬塞一個人格(同全站樣本紀律)。
//
// 純函式 · 0 新資料 · 0 RPC:吃的是 /u 與 /member 都已組好的(押注 map + 每場機器偏好 + streak)。
// 「順勢/逆風」軸 = 你押的那隊是不是機器開盤看好的那隊(getEngineFavorite = 勝率高那邊 = 強隊)。
// ─────────────────────────────────────────────────────

// 同 ProfileView FIRM / 引擎徽章 N≥8 門檻 · 低於此風格還會跳 → 不硬給人格(樣本紀律)。
export const PERSONA_MIN = 8;

export type OperatorPersonaKind = "forming" | "trend" | "fade" | "balanced";

export type OperatorPersona = {
  kind: OperatorPersonaKind;
  /** 跟機器同手(= 押開盤看好的強隊)的比例 0-100 · 可判場數為 0 → null */
  sidesWithEnginePct: number | null;
  /** 可判風格的場數(有明確機器偏好、非玩法的押注)· < PERSONA_MIN → 還在成形 */
  styleN: number;
  streakCurrent: number;
  streakLongest: number;
};

/**
 * 從真實押注算操盤風格。 `picks` = 棒球押注 map(matchId → home/away · 玩法 ~ 會被濾掉)·
 * `engineFavById` = 每場機器開盤偏好(home/away/null · 50/50 無偏好的場不計)。
 * 兩者 /u 與 /member 都現成有(idMatches 攤平即得)→ 0 新增查詢。
 */
export function computeOperatorPersona(input: {
  // pick 含 "skip"(略過該場)· 吃 UserPredictionsMap 原型 · skip 不是押隊 → 不計風格。
  picks: Record<string, { pick: "home" | "away" | "skip"; ts: string }>;
  engineFavById: Record<string, "home" | "away" | null>;
  streakCurrent: number;
  streakLongest: number;
}): OperatorPersona {
  let styleN = 0;
  let withEngine = 0;
  for (const [id, p] of Object.entries(input.picks)) {
    if (id.includes("~")) continue; // 玩法(大小分)不算「押哪隊」的順勢/逆風
    if (p.pick !== "home" && p.pick !== "away") continue; // skip(略過)不是押隊 → 不計
    const fav = input.engineFavById[id];
    if (fav !== "home" && fav !== "away") continue; // 50/50 無偏好 → 不計(沒有「強隊」可順/可逆)
    styleN++;
    if (p.pick === fav) withEngine++;
  }
  const pct = styleN > 0 ? Math.round((withEngine / styleN) * 100) : null;

  let kind: OperatorPersonaKind;
  if (styleN < PERSONA_MIN || pct === null) kind = "forming";
  else if (pct >= 62) kind = "trend"; // 多半跟機器同手 = 押強隊的穩健派
  else if (pct <= 38) kind = "fade"; // 多半跟機器唱反調 = 專挑黑馬的逆風派
  else kind = "balanced"; // 各半 = 看場下手

  return {
    kind,
    sidesWithEnginePct: pct,
    styleN,
    streakCurrent: input.streakCurrent,
    streakLongest: input.streakLongest,
  };
}
