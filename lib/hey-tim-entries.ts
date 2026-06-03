// ── ZONE 27 · Hey-Tim Q&A Ledger · canonical append-only ──
// R80 W-H · Agent A R80 BIGGEST GAP closure · Bill James「Hey Bill」
// (billjamesonline.com/hey_bill · 15-year canonical pattern · #1
// retention driver for Bill James Online subscriptions)+ Defector
// Funbag staff-reply pattern + Stratechery daily-update reply +
// Tom Tango comments dialogue + patio11 reader reply ethic。
//
// The cognitive frame this closes(per Agent A R80 honest answer):
//   - ZONE 27 has 22 binding rules + receipts + letters + Year-Zero
//   - 但 0 recurring proof that Tim is on the other end of a line
//   - 整 brand IP 是「trust the human」· 但無 visible 「Tim 親手 reply」
//     ritual · 訪客 spending NT$ 2,700 應該看到 Tim's name on dated
//     replies before deciding
//
// Brand IP fit(triple-fire):
//   - Cialdini Reciprocity(1984)· Tim 親手 reply 無報酬 = costly
//     reciprocity gift · 預先 build trust before NT$ 2,700 ask
//   - Aronson Pratfall(1966)· certainty 「wrong-then-corrected」 entries
//     觸發 Pratfall axiom · publish「我答錯了 然後 correction」 是 brand
//     IP soul · 同 /steelman + /audit DIVERGED 等大 axiom
//   - Spence Costly Signaling(1973)· 8 ledger family 8th append-only
//     · 無人能 fake 200-entry reply log over 18 months · 同 7 existing
//     ledger family discipline:ENGINE_OPS_LOG + ENGINE_DIFF_BEACONS +
//     NO_PUSH_INVENTORY + RECIPROCITY_LEDGER + LOCAL_STORAGE_INVENTORY +
//     SOLO_FOUNDER_PEERS + LETTER_BODY/EDIT_HISTORY
//
// Per /audit S05 PRE-COMMIT clause · APPEND-ONLY · 0 retroactive delete
// · 0 cherry-pick · 即使 Tim 答錯也 binding publish + correction · 同
// /integrity rule #9(R80)mandatory-ledger-no-cherry-pick discipline
// extended to Q&A artifact layer。 違反 = brand 信用 collapse 永久
// audit trail per /ethics commitment #08 protocol。
//
// Inspiration sources(per Agent A R80 SHIP #1 spec · all cited):
//   - Bill James「Hey Bill」 2009- (billjamesonline.com/hey_bill · 15+ yrs)
//   - Defector「Funbag」 2020- (defector.com/funbag · worker-coop reply)
//   - Stratechery Daily Update 2013- (stratechery.com · Thompson 親手
//     reply · sub-2% churn driver per thoughtleader.school analysis)
//   - Tom Tango Tangotiger 2003- (tangotiger.com · comments dialogue)
//   - patio11 reply ethic (x.com/patio11 · 3-year-later reader emails)
// ─────────────────────────────────────────────────────

export type HeyTimCertainty =
  | "certain" // Tim 答了 · 信心高
  | "uncertain" // Tim 答了 · 但承認 not sure
  | "wrong-then-corrected" // Tim 之前答錯 · 此 entry 是 correction
  | "pending"; // 等 Tim 回覆 · 7-day SLA

export interface HeyTimEntry {
  /** URL-safe slug · used for permalink anchor #slug. */
  slug: string;
  /** Question received date YYYY-MM-DD. */
  asked: string;
  /** Tim reply date YYYY-MM-DD · null if pending. */
  answered: string | null;
  /** First name / handle / 「Anonymous CPBL fan」 if no name given. */
  asker: string;
  /** Visitor's question · Chinese OR English · verbatim · no editing. */
  question: string;
  /** Tim's reply · verbatim · no editing post-publish · 0 retroactive. */
  answer: string;
  /** Pratfall-axis certainty signal · visible to visitor. */
  certainty: HeyTimCertainty;
  /** Optional tags · group entries by topic. */
  tags?: ReadonlyArray<string>;
}

// APPEND-ONLY · 不 reorder · 不 retroactive delete · 不 cherry-pick · 同
// Berkshire 70-year annual letter pattern + Geneva Seal per-watch serial。
// 新 entry append 末尾 · 修改任一 existing entry 需 30 天前 /changelog
// 公告 per /audit S05 PRE-COMMIT clause + /integrity rule #08 protocol。
export const HEY_TIM_ENTRIES: ReadonlyArray<HeyTimEntry> = [
  {
    slug: "what-is-this-page",
    asked: "2026-05-23",
    answered: "2026-05-23",
    asker: "Tim · 自問自答",
    question: "為什麼有這個 page?它跟 /faq 有什麼不一樣?",
    answer:
      "Bill James 從 2009 年開始 ship「Hey Bill」 — 球迷 email questions · Bill 親手 reply · 公開 ledger 不藏。15+ 年來這個 page 是 Bill James Online subscription 第 1 retention driver(讓人續訂的原因不是預測準度 · 是「Bill 在另一頭」 的感覺)。Defector 有 Funbag · Stratechery 有 Daily Update reply · Tom Tango 有 comments dialogue · patio11 收 3 年後 reader emails 還回。ZONE 27 採同 axis from Year 0。\n\n跟 /faq 不一樣:/faq 是 Tim pre-anticipated 的 14 個 question · 已經知道答案。/hey-tim 是 visitor 想到我 沒想到 的 question · Tim 親手 reply · 包括「我答錯了」 的 correction。/faq 是 monologue · /hey-tim 是 dialogue。\n\n為什麼 Year 0 就 ship 而不等有 N=50 questions 才 ship?因為「方法公開」就是原則 · 空的紀錄也是紀錄 · 跟FOUNDER 會員上 263 個還沒人認領的空位、/annual/2026 第 0 年那份誠實的空白報表一樣 · 空 = 一種訊號。",
    certainty: "certain",
    tags: ["meta", "year-zero", "ledger-family"],
  },
];

export const HEY_TIM_COUNT = HEY_TIM_ENTRIES.length;

// ── Stats derived from append-only ledger ────────────────────
export const HEY_TIM_PENDING_COUNT = HEY_TIM_ENTRIES.filter(
  (e) => e.certainty === "pending"
).length;

export const HEY_TIM_WRONG_THEN_CORRECTED_COUNT = HEY_TIM_ENTRIES.filter(
  (e) => e.certainty === "wrong-then-corrected"
).length;

export const HEY_TIM_UNCERTAIN_COUNT = HEY_TIM_ENTRIES.filter(
  (e) => e.certainty === "uncertain"
).length;

// ── Helpers ───────────────────────────────────────────────
export function getHeyTimEntry(slug: string): HeyTimEntry | undefined {
  return HEY_TIM_ENTRIES.find((e) => e.slug === slug);
}

export function formatCertaintyLabel(certainty: HeyTimCertainty): string {
  switch (certainty) {
    case "certain":
      return "✓ ANSWERED";
    case "uncertain":
      return "◌ ANSWERED · NOT SURE";
    case "wrong-then-corrected":
      return "✕→✓ WRONG · THEN CORRECTED";
    case "pending":
      return "⌛ PENDING TIM · 7-DAY SLA";
  }
}

export function formatCertaintyClass(certainty: HeyTimCertainty): string {
  switch (certainty) {
    case "certain":
      return "border-gold/50 text-gold/85";
    case "uncertain":
      return "border-mute/60 text-mute";
    case "wrong-then-corrected":
      return "border-loss/50 text-loss/85";
    case "pending":
      return "border-line/60 text-mute/70";
  }
}
