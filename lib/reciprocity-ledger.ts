// ── ZONE 27 · Reciprocity Ledger(published-before-ask inventory)─
// R74 W-A · Agent A R73 SHIP 3 · Cialdini Reciprocity Principle(1984)·
// 16 concrete artifacts ZONE 27 PUBLISHED before asking for NT$ 2,700 /
// NT$ 299/月。 give-first triggers obligation-to-reciprocate cognitive
// loop · same axis as Berkshire Hathaway annual letter(give 70 years
// of investment letters BEFORE asking shareholder allegiance)+ Patek
// Philippe Movement Schematic Library(give 200 years of public
// movement specs BEFORE selling watches)+ Anthropic Model Card library
// (give complete model spec BEFORE charging API)pattern。
//
// The grammar inversion:
//   - LINE 老師 / 報馬仔: ask for $$ first, then maybe show「準度」
//   - ZONE 27: publish entire engine + methodology + receipts + refusals
//     + privacy inventory + BUS_FACTOR + 11-NEVER list BEFORE form
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · 「方法公開」 8 字 grammar 物理
//     codify · 此 inventory = the operational receipt
//   - per [[feedback-zone27-pratfall-brand-ip]] · same publish-weakness
//     axiom · here publish-strength-before-ask
//   - per [[zone27-monetization-philosophy]] · engine FREE forever · this
//     list IS the「what FREE actually means」 surface
//   - per Cialdini Influence(1984)Chapter 2 Reciprocity Rule · pre-gift
//     gift-back compulsion is universal · CPBL fan audience burned by
//     LINE 老師 ask-first-give-never pattern-match this inversion instantly
//
// 不做 anti-pattern:
//   ✕ no「list of features」 marketing tone(would convert receipt into
//     sales pitch · violates costly-signaling-via-disclosure axiom)
//   ✕ no「we gave you X · now subscribe」 explicit reciprocity ask(would
//     trigger reactance · Brehm 1966 · negate the give)
//   ✕ no「unlock to read」 gating(content already PUBLIC · entire point)
//   ✕ no「join 1000+ subscribers」 social proof(fake testimonials redline)
//
// Inspiration sources(per Agent A R73 SHIP 3 spec):
//   - Berkshire Hathaway 1965-2025 annual letters publicly archived
//   - Patek Philippe Geneva Museum movement schematics public catalog
//   - Anthropic Transparency Hub model cards open library
//   - DHH 37signals (HEY/Basecamp) public Manifesto + behind-scenes ops
//   - Stratechery Ben Thompson Free Daily Update(give before paywall)
//
// Append-only discipline per /audit S05 PRE-COMMIT clause · 修改任一
// entry 需 30 天前 /changelog 公告 · 同 ENGINE_DIFF_BEACONS R71 W-C +
// NO_PUSH_INVENTORY R73 W-D + founders-stats claimedFounders canonical
// single-source pattern · Costly Signaling 100× per Spence 1973。
// ─────────────────────────────────────────────────────

export type ReciprocityArtifact = {
  /** Short imperative title · what ZONE 27 published · max ~30 chars zh */
  what: string;
  /** Route path or external URL · where the artifact lives · 1-click verify */
  surface: string;
  /** 1-line rationale · WHY published before ask · brand-IP axiom anchor */
  why: string;
  /** Inspiration source · concrete brand that publishes-before-ask · we follow */
  source: string;
};

/** 16 concrete artifacts published BEFORE asking · brand-pure reciprocity
 *  inventory · append-only per /audit S05 PRE-COMMIT clause · 修改需 30 天
 *  /changelog 公告。 Order = grammar from「engine output」 → 「process」 →
 *  「failure」 → 「constraint」 → 「ledger」 · 不是 marketing impact order。 */
export const RECIPROCITY_LEDGER: ReadonlyArray<ReciprocityArtifact> = [
  // ── 1-4 · ENGINE OUTPUT · 您能跑、能 fork、能 audit ───
  {
    what: "整份 engine source · MIT licensed",
    surface: "https://github.com/Tim-xuan-you/zone27-web",
    why: "您 fork 一份私有 ZONE 27 給自己用 · 0 NDA · 0 license fee · 我們不能 revoke · per /transparency Section 06 audit primitives 4-tool surface",
    source: "Anthropic Transparency Hub · Stripe API docs",
  },
  {
    what: "v0.2 → v0.3 entire logic delta",
    surface: "/methodology/diff",
    why: "5 行 logic change + 14 unchanged constants + 6 件 v0.3 不修正 · 「您 audit 我們的 model 升級」 not 「您 trust」 · per Hindenburg Research evidence-grade citation",
    source: "React.dev changelog · Anthropic model card revision",
  },
  {
    what: "Park Factor + Workload ESTIMATE methodology",
    surface: "/audit#section-02",
    why: "K/9 · BB/9 · HR/9 estimate from public box score · framework + PR welcome inline · 不藏 estimate · 賽前 publish 「我們估了什麼」 才有資格 ask 訂閱",
    source: "FanGraphs ESTIMATE methodology notes",
  },
  {
    what: "ENGINE DRY DOCK · 4 build states 公開",
    surface: "/methodology#section-06",
    why: "v0.2 LIVE · v0.3 DEV PREVIEW · v0.4 SPEC LOCKED · NEXT SHIP UNCOMMITTED · per DHH HEY inbox-is-dashboard grammar · NO progress bar / NO ETA · 您看 ZONE 27 真實 engineering pipeline · not marketing roadmap",
    source: "DHH HEY/Basecamp public Manifesto",
  },
  // ── 5-8 · PROCESS · receipts + 拒絕 + cadence + 不打擾 ───
  {
    what: "PROVED + DIVERGED 等大 receipts ledger",
    surface: "/track-record",
    why: "每場 receipt = engine lock + EngineStamp commit SHA + 賽後 final · PROVED ✓ 跟 DIVERGED ✕ 同顯示 weight · 不藏 / 不淡化 / 不重新加權 · 您看 ZONE 27 失準也照常 publish",
    source: "Berkshire annual letter loss disclosure",
  },
  {
    what: "5-step Founders 27 allocation rules + refusal sample",
    surface: "/founders/ledger",
    why: "唯一 luxury 品牌(vs Patek · Hermès · Tesla)公布拒絕原因 sample · weekly 手寫 update · 您看到「我們會 reject 您」 不藏 · per /founders/ledger Pratfall + Costly Signaling + Disclosure 4-axiom triple-fire",
    source: "Hermès workshop process transparency",
  },
  {
    what: "NO-PUSH MANIFEST · 12 deliberate absences",
    surface: "/transparency#no-push-manifest",
    why: "operational artifact of existing 11 「永遠不做」 axiom · per Patagonia「Don't Buy This Jacket」 2011 NYT 案例 · Mubi+Calm+Are.na+1Password pattern · 我們 publish restraint not invisible silence",
    source: "Patagonia 2011 NYT 「Don't Buy This Jacket」",
  },
  {
    what: "Tim Response SLA · Patek dealer promise",
    surface: "/founders/apply",
    why: "1-3 business days · TIM 親手 · 不外包 · pre-launch honest empty 4-cell(LAST REPLY TBD · AVG REPLY TBD)· Tim manual weekly update post-Founder-#001 · 您看到「Tim 能 sustain 多少」 not auto-responder lie",
    source: "Patek dealer personal call + Linear 2019 invite-only",
  },
  // ── 9-12 · CONSTRAINT · 不會做 + 失敗 + 跨境 + 大樓崩 ───
  {
    what: "12-item NEVER list · 永遠不會做",
    surface: "/transparency#section-02",
    why: "ZONE 27 displacement target = 玩運彩 + 報馬仔 + LINE 老師生態 · 13 件物理 ban(R80 加 #12 CPBL-only-forever engine scope binding · R81 加 #13 永遠不 subscription auto-renewal binding · BLACK CARD pivot 至 CPBL Season Pass NT$ 1,500/season explicit)· publish = 物理 codify 退路 · Costly Signaling 100× per Spence 1973",
    source: "Stratechery「say what you don't do」",
  },
  {
    what: "5 strongest objections AGAINST us",
    surface: "/steelman",
    why: "ZONE 27 自己 write 5 個反 ZONE 27 strongest objections · 不 strawman · 不 weakman · 您看 ZONE 27 自己列「我們可能錯哪裡」 · 完整 honest concessions",
    source: "Y Combinator「what would kill your startup」",
  },
  {
    what: "PDPA cross-border data transfer + emergency contact",
    surface: "/privacy#section-6b",
    why: "Supabase Tokyo + Vercel + Resend + GitHub 跨境 locations 明示 · 無 PRC 節點 · Tim 失蹤 / incapacity 配偶 + 2 兄弟姊妹 executor 接管 protocol · 您 PII 在哪 + Tim 不在了怎麼辦 都 publish",
    source: "Apple Privacy default posture + Pinboard solo-founder honesty",
  },
  {
    what: "BUS_FACTOR = 1 · solo founder contingency",
    surface: "/ethics#bus-factor",
    why: "Tim solo · 0 employees · 0 contractors · 0 vendor lock-in · 「distributed team across 5 timezones」 false framing 明 reject · Pinboard+Patek+Berkshire solo-founder honesty pattern",
    source: "Pinboard.in Maciej Cegłowski public solo disclosure",
  },
  // ── 13-16 · LEDGER · enterprise + state + craft journal + raw audit ───
  {
    what: "/audit DISCLOSURE block · 8 enterprise facts",
    surface: "/audit#disclosure",
    why: "EQUITY 100% TIM solo · SPONSORS 0 · ADS 0 · TRACKERS 0 · RECEIPTS N=1 · FOUNDERS 27 = 7 SYSTEM-TEST + 0 real · BLACK CARD 0 paid · REVENUE NT$ 0 Year 0 · publish enterprise state 同 Hindenburg position disclosure · 你看 Tim 沒收一分錢之前就 publish 完整經濟學",
    source: "Hindenburg Research at-top position disclosure",
  },
  {
    what: "8 binding ethics commitments + violation receipt",
    surface: "/ethics",
    why: "0 betting affiliate · 0 ads · 0 tracking · 0 fake testimonials · 0 hidden DIVERGED · 0 silent model rotation · 0 「明牌」 framing · 0 fine print · 違反任一 = Tim 親手在 /ethics 紅字標永久 audit trail · 不是 marketing copy · 是 Tim 簽名物理 codify",
    source: "Berkshire owner's manual ethics + binding lock",
  },
  {
    what: "/now journal · UNRESOLVED section",
    surface: "/now",
    why: "current cycle SHIPPED + DISCOVERED + UNRESOLVED · Pratfall axiom「本週還沒解決的」 section 永遠 non-empty · 您看 ZONE 27 真實 maintainer state · 不是「即將上線」 marketing scaffolding",
    source: "Linear /now movement + Derek Sivers /now",
  },
  {
    what: "/annual/2026 enterprise state · 5/31 yearly publish",
    surface: "/annual/2026",
    why: "Year 0 honest empty · NT$ 0 revenue · 0 paid subscribers · 5/31 每年 publish commitment · 違反 = brand 信用 collapse · per [[zone27-disclosure-philosophy]] 延伸 enterprise transparency 到 founder 經濟學",
    source: "Berkshire 60-year annual letter cadence",
  },
];

/** Computed count · used by component header chip · per inventory append
 *  size · brand IP「16 artifacts before NT$ 2,700 ask」 surface · transparency-
 *  friendly explicit counter。 */
export const RECIPROCITY_COUNT = RECIPROCITY_LEDGER.length;
