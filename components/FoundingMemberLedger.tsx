import {
  claimedFounders,
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
  isClaimed,
} from "@/lib/founders-stats";

// ── ZONE 27 · Founding Member Ledger · 001-270 Public Roll ──
// R72 W-C · Agent A R72 SHIP 2 · ★★★★★ HIGHEST direct revenue amplifier
// · Patek Philippe Geneva Seal certification roll + Berkshire shareholder
// identity continuity + Pinboard.in user-count public disclosure pattern。
//
// Real Patek-style allocation roll: 001-270 grid visualized as physical
// scarcity · all empty rows render typographic「— —」 · zero fake names ·
// zero「X already taken」 FOMO · zero live counter。 Currently 7 SYSTEM-TEST
// placeholders per lib/founders-stats.ts(R31 W-V2 honest disclosure)·
// rows 008-270 awaiting first real Founder onboard Q3+。
//
// Visitor scrolling /founders/ledger today sees text-only allocation rules
// + 4 axiom chips · with THIS they see the PHYSICAL Patek-roll mechanic ·
// 「scarce 263 empty seats」 is brand-pure costly signaling 不靠 FOMO counter。
//
// brand IP fit:
//   - per [[feedback-zone27-pratfall-brand-ip]] · empty grid IS the costly
//     signal · NO competitor publishes their empty allocation roll
//   - per [[zone27-disclosure-philosophy]] · Patek serial-roll mechanic +
//     transparency-first(not collector-secret)
//   - per Pokemon TCG SHADOWLESS RUN axiom(R60 W-A)· 整批 270 = 1st
//     Edition · 不分 sub-tier · 不 retroactively reprint · 同 SHADOWLESS
//     mechanical extension
//   - per 「X of 270 sold」 redline #5(11-item NOT-DO list)· this is NOT
//     a live counter · it's the static Patek-roll · weekly handwritten
//     append per Founder onboard · 不 fire on every claim
//   - per [[feedback-zone27-audience-fans-not-engineers]] · hardcore CPBL
//     fans 看到 070/270 empty grid 立刻 pattern-match limited drop · NOT
//     SaaS marketing
//
// 不做 anti-pattern:
//   ✕ NO live「3 sold in last 24h」 ticker(redline)
//   ✕ NO「only 263 left!」 urgency framing(brand-pure restraint)
//   ✕ NO progress bar(would imply SaaS-grade growth metric)
//   ✕ NO「reserve your seat」 hover CTA(pre-launch · payment infra not ready)
//
// Compounds with:
//   - R68 W-A /founders/apply Patek-style application form
//   - R68 W-G PreTransferReceipt 3-row choreography
//   - R71 W-A /methodology Section 06 ENGINE DRY DOCK
//   - R72 W-A FromOneSolo + R72 W-B TimResponseSLA
//   - R69 W-B /founders/from-one-current-founder empty scaffold
//     (270 letters cap parallel)· same physics-of-time discipline。
// ─────────────────────────────────────────────────────

export default function FoundingMemberLedger() {
  return (
    <section
      aria-label="Founding member ledger · 270-seat Patek-style allocation roll · empty seats visible"
      className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12"
    >
      <header className="mb-6 flex items-baseline justify-between gap-3 flex-wrap">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
        >
          / FOUNDING MEMBER LEDGER · 001-270 · PATEK ROLL
        </p>
        <p
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
        >
          {claimedFounders.length} SYSTEM-TEST / {FOUNDERS_TOTAL} ·{" "}
          {FOUNDERS_REMAINING} AWAITING REAL · WEEKLY HANDWRITTEN
        </p>
      </header>

      <p className="text-mute text-sm leading-relaxed mb-6 max-w-2xl">
        每位 Founder · 1 row · 永久寫入 · 不刪 · 不藏 · 不重印。 Tim 每週
        週四 22:30 TPE 手寫 append 新 Founder · per /audit S05 PRE-COMMIT
        clause · 不 live counter · 不 FOMO ticker · 純物理 scarcity 公開。{" "}
        <strong className="text-bone">
          這頁您看到 263 個空 row · 就是 brand IP receipt 本身
        </strong>
        。
      </p>

      {/* ── 27 × 10 Patek-roll grid · adapts mobile → desktop ──── */}
      <div className="border border-line/50 bg-slate/20 p-2 sm:p-3">
        <div
          role="list"
          aria-label="270-seat allocation roll"
          className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-10 lg:grid-cols-15 gap-1 sm:gap-1.5"
        >
          {Array.from({ length: FOUNDERS_TOTAL }, (_, i) => {
            const id = i + 1;
            const claimed = isClaimed(id);
            const founder = claimed
              ? claimedFounders.find((f) => f.id === id)
              : null;
            const idStr = String(id).padStart(3, "0");
            // R73 W-D · Agent B audit F09 fix · visual differentiation
            // SYSTEM-TEST placeholders vs REAL founders · brand IP「不藏
            // SYSTEM-TEST state」 axiom physical codify · 3-state visual:
            // empty(—)· SYSTEM-TEST(◌ dashed border opacity-50)· REAL(✦ solid)。
            const isSystemTest =
              claimed && (founder?.alias?.startsWith("SYSTEM-TEST") ?? false);
            const isRealFounder = claimed && !isSystemTest;
            const cellClass = isSystemTest
              ? "border border-dashed border-gold/30 bg-gold/[0.03] text-gold/50"
              : isRealFounder
                ? "border border-gold/60 bg-gold/10 text-gold hover:bg-gold/15"
                : "border border-line/30 bg-slate/30 text-mute/40 hover:text-mute/60";
            const sigil = isSystemTest ? "◌" : isRealFounder ? "✦" : "—";
            return (
              <div
                key={id}
                role="listitem"
                aria-label={
                  isSystemTest
                    ? `Seat ${idStr} · SYSTEM-TEST placeholder · awaiting real founder`
                    : isRealFounder
                      ? `Seat ${idStr} · claimed by ${founder?.alias ?? "anonymous"}`
                      : `Seat ${idStr} · empty · awaiting allocation`
                }
                title={
                  isSystemTest
                    ? `#${idStr} · SYSTEM-TEST · ${founder?.alias ?? "—"} · 真實 founder Q3+ 取代`
                    : isRealFounder
                      ? `#${idStr} · ${founder?.alias ?? "—"} · ${founder?.claimedOn ?? "—"}`
                      : `#${idStr} · — — — · empty seat`
                }
                className={`relative aspect-square flex flex-col items-center justify-center text-center font-mono tabular leading-tight transition-colors ${cellClass}`}
              >
                <span className="block text-[8px] sm:text-[9px] tracking-[0.1em]">
                  {sigil}
                </span>
                <span className="block text-[8px] sm:text-[9px] tracking-[0.15em]">
                  {idStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Compact legend + status footer ───── */}
      <footer className="mt-5 flex items-baseline justify-between gap-3 flex-wrap">
        <ul className="flex items-center gap-3 sm:gap-4 text-mute/85 text-[10px] font-mono tracking-[0.22em] leading-relaxed flex-wrap">
          {/* R73 W-D · Agent B audit F09 fix · 3-state legend matching 3-state
              cell visualization · brand IP「不藏 SYSTEM-TEST state」 axiom。 */}
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-3 h-3 border border-dashed border-gold/30 bg-gold/[0.03] text-gold/50 text-center text-[6px] leading-[10px]"
            >
              ◌
            </span>
            <span lang="en">SYSTEM-TEST · {claimedFounders.length}</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-3 h-3 border border-gold/60 bg-gold/10 text-gold text-center text-[6px] leading-[10px]"
            >
              ✦
            </span>
            <span lang="en">REAL FOUNDER · 0(awaiting #008)</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-3 h-3 border border-line/30 bg-slate/30 text-mute/40"
            />
            <span lang="en">EMPTY · {FOUNDERS_REMAINING}</span>
          </li>
        </ul>
        <p
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em] leading-relaxed"
        >
          1 FOUNDER = 1 ROW FOREVER · NO REPRINT · POKEMON SHADOWLESS RUN
        </p>
      </footer>

      <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.22em] leading-relaxed">
        ⚓ #001-#007 為 SYSTEM-TEST Tim 親手 forged placeholders · 真實第一位
        Founder #008 onboard 後取代 · per /audit S05 PRE-COMMIT 公開記錄
        transfer history · 不 silently swap · per /founders/from-one-current-founder
        R69 W-B 270 letters cap parallel(每位 Founder 6 個月後 ship 真實
        letter · 1 founder = 1 row + 1 letter forever)。
      </p>
    </section>
  );
}
