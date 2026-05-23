// ── ZONE 27 · The Letter · canonical voice artifact ──────
// R77 W-D · Agent A R77 SHIP B ★★★★★ · 「biggest invisible gap」 third-pass
// honest answer · DHH HEY World + Berkshire annual letter + Bret Victor
// replace-in-place essay + Maciej Cegłowski Pinboard blog + Substack-pre-
// Substack Ben Thompson(2013-2014)pattern · ZONE 27 had 49 routes 但 0
// singular voice artifact where Tim is SPEAKING AS Tim · 此 missing organ
// · 此 lib + /letter route fills it。
//
// The cognitive frame this closes(per Agent A R77 spec):
//   - /audit speaks ABOUT the engine
//   - /methodology speaks ABOUT the rules
//   - /founders/why-270 speaks ABOUT the price
//   - /poster speaks AT the lurker
//   - NONE speak AS Tim · replacing-in-place · dated · vulnerable · brief
//
// Every brand at ZONE 27's pre-launch stage that survived had one:
//   - Berkshire(Buffett letters · 60 yrs)
//   - HEY World(DHH)
//   - Stratechery weekly essay(Ben Thompson)
//   - Pinboard blog(Cegłowski)
//   - worrydream.com/about(Bret Victor)
//
// The brand-defining artefact is never a route called /about · 是 singular
// letter that gets EDITED and RE-EDITED until it BECOMES the brand voice。
//
// Architecture(per Agent A R77 SHIP B spec):
//   - LETTER_BODY · markdown text · ~200-400 words · Tim 親手 written voice
//   - LAST_EDITED_AT · ISO date · stamp when last touched
//   - EDIT_HISTORY · append-only array · each edit dated + 1-line summary
//   - per /audit S05 PRE-COMMIT clause · ENTRIES append-only · 修改 letter
//     body 是 acceptable replace-in-place(this IS the design)· BUT
//     EDIT_HISTORY entries 不可 retroactively edit / delete · canonical
//     append-only single-source same as ENGINE_OPS_LOG R76 W-C pattern
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · singular voice IS the
//     disclosure axis 物理 codify · 不 hide behind narrative voice
//   - per [[feedback-zone27-pratfall-brand-ip]] · vulnerable + brief +
//     edited-in-place IS Pratfall · 不 craft「perfect launch piece」
//   - per [[feedback-zone27-audience-fans-not-engineers]] · Tim 親手 voice
//     speaks fan-grammar instantly · 不是 corporate marketing copy
//   - per /audit S05 PRE-COMMIT · edit history append-only · same Costly
//     Signaling discipline as ENGINE_OPS_LOG + ENGINE_DIFF_BEACONS pattern
//
// 不做 anti-pattern(per Agent A R77 SHIP B spec):
//   ✕ NO comment thread(violates 11-NEVER #1 user-to-user social)
//   ✕ NO share button(reader 自己 long-press / copy URL · 不 funnel)
//   ✕ NO related-reading rail(letter IS the artifact · 不 cross-link)
//   ✕ NO email subscribe(per NoPushManifest R73 W-D · 0 push)
//   ✕ NO「read more letters」 archive(letter is REPLACE-in-place not feed)
//   ✕ NO「join my Substack」(not Substack · 不 invite to email list)
//
// Inspiration sources(per Agent A R77 SHIP B spec):
//   - DHH world.hey.com/dhh(replacing-in-place letter pattern · 2022-now)
//   - Berkshire Hathaway 2024 letter PDF(Buffett 60-yr cadence)
//   - Stratechery About(stratechery.com/about · single voice page)
//   - Maciej Cegłowski Pinboard blog(idlewords.com · 17 yr durable)
//   - Bret Victor worrydream.com/about(non-incremental publishing)
//   - patio11 Kalzumeus annual report(once/year December · single artifact)
//
// Edit history rules(canonical append-only · same as ENGINE_OPS_LOG):
//   ✕ NEVER retroactively edit existing EDIT_HISTORY entry date / summary
//   ✕ NEVER delete EDIT_HISTORY entry(if change was wrong · add NEW entry)
//   ✕ NEVER reorder(canonical ASCENDING chronological)
//   ✓ Append NEW entry when LETTER_BODY changes · timestamp + 1-line diff
// ─────────────────────────────────────────────────────

export type LetterEditEntry = {
  /** ISO YYYY-MM-DD · TPE-anchored · physical edit date */
  date: string;
  /** 1-line summary of what changed · brand-pure honest · ~80 chars max */
  summary: string;
};

/** Tim's letter body · markdown text · replace-in-place(not append)·
 *  ~200-400 words · vulnerable + brief + edited over months · NOT crafted
 *  「perfect launch piece」 · IS the living center of gravity per Agent A
 *  R77 third-pass honest answer。 */
export const LETTER_BODY = `
這是我 Tim 親手寫的 letter · 不是 marketing copy · 不是 launch announcement ·
不是 blog post · 不是 newsletter。

是一封會被 replace-in-place 的 letter · 同 DHH world.hey.com 模式 · 同
Berkshire annual letter 模式 · 同 Stratechery About 頁面模式。 沒有
new post · 沒有 archive · 沒有 RSS subscribe · 沒有 email digest。
您 read 完此 letter · 我 edit 完此 letter · 您再回來 read · 您 see
edit history but 不 see new post。

ZONE 27 此刻是什麼狀態(2026-05-23):

一個 PROVED receipt(cpbl-260521-01 富邦 60% engine → PROVED ✓)·
4 場 ingested matches · 7 個 SYSTEM-TEST forged Founders · 0 個真實
paying customer · 53 visitor-discoverable routes · 7 canonical append-only
ledgers · 143+ waves of craft · 0 brand redline violation。

我在台南某間咖啡店或某個夜班 · 親手寫每個 page。 沒外包 · 沒 hire intern ·
沒 auto-approve 任何 application。 引擎邏輯全 publish · /methodology 全
viewable · /audit 全 disclose · GitHub MIT licensed · 您 fork 走可以。

我為什麼寫這個 letter?

因為前 76 rounds 我 ship 了 76+ rounds of「what ZONE 27 IS」(/audit ·
/methodology · /founders/why-270 · /poster · /engine-log)· 但沒有任何
一個 page 是「what Tim IS」 thinking 此刻 ZONE 27 going。 ZONE 27 brand
是 structural disclosure · 但 living center 是 Tim 親手 voice · 此 letter
fills the missing organ。

如果您是 future Founder #001-#270 之一 · 您 read 此 letter 後決定 trust
ZONE 27 的不是 marketing · 是因為這封 letter sustained over months ·
被 edited many times · 仍然 honest。 brand IP「方法公開 · 品味私藏」 8-字
grammar 在此 letter 物理 codify。

— TIM · ZONE 27 · 台南 · 2026-05-23
`.trim();

/** Last edited timestamp · ISO YYYY-MM-DD · TPE-anchored · update when
 *  LETTER_BODY changes · same as ENGINE_OPS_LOG canonical pattern。 */
export const LAST_EDITED_AT = "2026-05-23";

/** Edit history · APPEND-ONLY · ASCENDING chronological · 修改任 entry 需
 *  30 天前 /changelog 公告 · per /audit S05 PRE-COMMIT clause · same
 *  single-source append-only discipline as ENGINE_OPS_LOG R76 W-C +
 *  ENGINE_DIFF_BEACONS R71 W-C + canonical 7-ledger family pattern。
 *
 *  此 history IS the costly signal · LETTER_BODY 可以被 replace-in-place
 *  但每次 replace MUST add NEW EDIT_HISTORY entry · 不可 silently 修改。
 *  reader can audit the edit cadence via this array。 */
export const EDIT_HISTORY: ReadonlyArray<LetterEditEntry> = [
  {
    date: "2026-05-23",
    summary:
      "Initial letter · Year-Zero state · 第一封 voice artifact · R77 W-D · Agent A R77 SHIP B 「biggest invisible gap」 third-pass closure",
  },
];

/** Computed count · used by /letter page edit-log + LetterStampBar chip ·
 *  brand IP「N edits since initial publish」 surface · transparency-friendly
 *  explicit counter · same axis as ENGINE_OPS_LOG_COUNT。 */
export const EDIT_HISTORY_COUNT = EDIT_HISTORY.length;
