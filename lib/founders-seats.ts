// ── ZONE 27 · Founders 27 Seat Roll · 270 altercasting cards ──
// R78 W-A · Agent A R77 SHIP A ★★★★★ · Patek Philippe 1996「Generations」
// campaign + Weinstein & Deutschberger 1963 altercasting theory + Belk
// 1988 Extended Self + Defector worker-owned launch · 270 seats with
// permanent URL /founders/seat-card/[001-270] · each shows seat number +
// altercasting line BEFORE they're claimed · visitors LITERALLY see seats
// waiting · NOT「X seats left」 FOMO counter · NOT exclusivity gatekeeping
// · 是 identity pre-casting via empty chair grammar。
//
// The altercasting mechanism(Weinstein & Deutschberger 1963):
//   - DOESN'T tell visitor「BE generational」 OR「BE a Founder」
//   - PRE-CASTS visitor INTO the role and lets them opt-in by recognition
//   - 「This seat is held by ____. They believed the engine before it
//     had a stadium.」 = visitor casts SELF into ____  identity
//   - Same axis as Patek 1996「you merely look after for next generation」
//     · NOT marketing exclusivity · IS identity assumption
//
// Belk 1988 Extended Self:
//   - Possessions don't display identity · they CONSTITUTE it
//   - Seat #027 is not「what Founder owns」 · is「what Founder IS」
//   - Permanent URL = permanent identity vehicle
//
// 不做 anti-pattern(per Agent A R77 SHIP A spec + R76 W-D /founders/why-270 axiom):
//   ✕ NO live counter「X seats remaining」(11-NEVER #5 redline · per
//     /founders/why-270 anti-pattern 1)
//   ✕ NO countdown timer until close(brand IP「不催」 axiom)
//   ✕ NO「exclusive club」 / 「VIP」 / 「入會審核」 luxury-gatekeeping
//     (per Agent A R77 anti-pattern 1 · Hermès Birkin scarcity-as-power
//     doesn't transpose to ZONE 27 brand IP)
//   ✕ NO purchase form on seat-card page(seat-card 是 identity surface ·
//     /founders/apply 才是 actual application form · separate concerns)
//   ✕ NO fake testimonials in pre-launch claimed seats(per 11-NEVER #11)
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · 公開 empty seats · per
//     /founders/ledger transparency axis 物理 codify to per-seat permalink
//   - per [[feedback-zone27-pratfall-brand-ip]] · 263 empty seats publicly
//     visible IS Pratfall axiom strongest application · 不藏 unsold inventory
//   - per [[zone27-payment-architecture]] · SHADOWLESS RUN axiom(R60 W-A)·
//     once 270 filled · permanent closed state · 不 reprint
//   - per /audit S05 PRE-COMMIT clause · 7 SYSTEM-TEST forged 公開明示
//     per FoundingMemberLedger R72 W-C pattern · 改變 system-test count 需
//     30 天前 /changelog 公告
//
// Inspiration sources(per Agent A R77 SHIP A spec):
//   - Patek Philippe 1996「Generations」 campaign(Weinstein altercasting)
//   - Belk 1988 Journal of Consumer Research「Extended Self」 paper
//   - Defector 2020 launch(19 worker-owners NAMED on launch page · names
//     ARE the announcement · per Agent A R76 SHIP B research)
//   - Linear invite-only 2019(named-invitee pre-launch signal)
//   - Bottega Veneta 1978 Warhol tagline「your own initials are enough」
//
// Append-only discipline per /audit S05 PRE-COMMIT clause · 修改 SEAT
// holder names 需 30 天前 /changelog 公告 · same Costly Signaling
// discipline as canonical 7-ledger family pattern。
// ─────────────────────────────────────────────────────

export type FounderSeat = {
  /** 1-270 · canonical seat number · binds to /founders/seat-card/[n] URL */
  seatNumber: number;
  /** Holder name when claimed · null = empty seat · "SYSTEM-TEST" for forged · brand-pure honest */
  holderName: string | null;
  /** Holder city when claimed · 不收 PII beyond city · null = empty */
  holderCity: string | null;
  /** ISO YYYY-MM-DD when seat claimed · null = empty · timestamp 不可
   *  retroactively edit per /audit S05 PRE-COMMIT。 */
  claimedAt: string | null;
  /** True = SYSTEM-TEST forged placeholder · per /founders/ledger 7 forged
   *  pre-launch pattern · 不藏 fake claim · honest disclosure per Pratfall。 */
  isSystemTest: boolean;
};

/** Generate 270-entry seat roll · 7 SYSTEM-TEST + 263 empty · canonical
 *  append-only single-source · 修改 seat content 需 30 天前 /changelog
 *  公告 · same axis as ENGINE_OPS_LOG R76 W-C + ENGINE_DIFF_BEACONS R71
 *  W-C + 7-ledger family pattern。 */
function generateSeatRoll(): ReadonlyArray<FounderSeat> {
  const seats: FounderSeat[] = [];
  // 7 SYSTEM-TEST forged · seat #001-#007 · per FoundingMemberLedger R72 W-C
  // matching pattern · Tim 親手 placeholder · 等真實 Founder #001 onboard 後
  // 全 reset 排序 · 不藏 SYSTEM-TEST state per Aronson Pratfall axiom。
  for (let i = 1; i <= 7; i++) {
    seats.push({
      seatNumber: i,
      holderName: "SYSTEM-TEST",
      holderCity: null,
      claimedAt: null,
      isSystemTest: true,
    });
  }
  // 263 empty seats · seat #008-#270 · awaiting first real applicant
  // post-payment-infra-ready · per /founders/apply Patek-style allocation
  // form R68 W-A + /founders/ledger 5-step rules · 不 fake claim · empty
  // state IS the receipt-of-finite-set proof per Pokemon TCG 1st Edition
  // SHADOWLESS RUN mechanic R60 W-A。
  for (let i = 8; i <= 270; i++) {
    seats.push({
      seatNumber: i,
      holderName: null,
      holderCity: null,
      claimedAt: null,
      isSystemTest: false,
    });
  }
  return seats;
}

/** 270-entry seat roll · canonical single-source · append-only per /audit
 *  S05 PRE-COMMIT clause · same discipline as 7-ledger family pattern。 */
export const FOUNDERS_SEATS: ReadonlyArray<FounderSeat> = generateSeatRoll();

/** Get seat by number · 1-indexed · returns null for out-of-range · pure
 *  data accessor · no business logic。 */
export function getSeatByNumber(n: number): FounderSeat | null {
  if (n < 1 || n > 270 || !Number.isInteger(n)) return null;
  return FOUNDERS_SEATS[n - 1];
}

/** Count claimed seats(real Founders · NOT SYSTEM-TEST forged)· brand
 *  IP「不藏 0 paying customers」 axiom · pre-launch returns 0 honestly。 */
export function getClaimedRealCount(): number {
  return FOUNDERS_SEATS.filter(
    (s) => s.holderName !== null && !s.isSystemTest,
  ).length;
}

/** Count SYSTEM-TEST forged seats · pre-launch returns 7 · transparency
 *  discipline per FoundingMemberLedger R72 W-C「7 SYSTEM-TEST / 270」 chip。 */
export function getSystemTestCount(): number {
  return FOUNDERS_SEATS.filter((s) => s.isSystemTest).length;
}

/** Count empty seats · pre-launch returns 263 · brand IP「empty seats
 *  publicly visible」 Pratfall axiom 物理 codify。 */
export function getEmptyCount(): number {
  return FOUNDERS_SEATS.filter(
    (s) => s.holderName === null && !s.isSystemTest,
  ).length;
}

/** Format seat number as 3-digit padded string · "001" not "1" · per
 *  Pokemon TCG card numbering convention + Patek Reference grammar。 */
export function formatSeatNumber(n: number): string {
  return String(n).padStart(3, "0");
}
