// ── ZONE 27 · Solo Founder Reference Class Anchor ───────
// R74 W-C · Agent A R73 SHIP 4 · Samuelson & Zeckhauser Status Quo Bias
// (1988)· counter the default 「SaaS-with-team」 comparison frame by
// anchoring ZONE 27 against a different reference class entirely · solo-
// durable-premium indie · NOT solo-failing-to-be-team。
//
// The cognitive trap this counters:
//   - Visitor's System 1 default reference class for「web subscription」 =
//     Stripe / Notion / Linear / Vercel · all team-funded SaaS
//   - When ZONE 27 is compared to that reference class · Tim solo seems
//     under-resourced · 「risky · small · not real」
//   - But the actual reference class is Pinboard / Tarsnap / Sublime Text /
//     Drafts · solo-durable-premium · 15+ year retention · different unit
//     economics · different commitment shape
//
// The pitch reframe:
//   - ZONE 27 is NOT「SaaS minus team」 · it's a different category
//   - Solo durable indie operates at sustainability not growth · at
//     personal craft not headcount leverage · at one-author voice not
//     marketing copy committee
//   - Your $NT 2,700 buys allocation to that category · not SaaS budget allocation
//
// brand IP fit:
//   - per [[feedback-zone27-pratfall-brand-ip]] · «we're not the SaaS you're
//     expecting» = publish-the-category-mismatch · same Aronson 1966 axis
//   - per [[zone27-disclosure-philosophy]] · anchor the comparison frame
//     itself · most premium brands hide their reference class · ZONE 27
//     publishes ours
//   - per [[zone27-monetization-philosophy]] · solo durable IS the monetization
//     model · 270 cap = Tim's review ceiling · NOT marketing scarcity
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan audience
//     recognizes Tim 's solo voice IS the differential · not「team behind
//     the brand」 corporate veil
//
// Inspiration sources(per Agent A R73 SHIP 4 spec):
//   - Pinboard.in(Maciej Cegłowski)· 2009-now · solo · ~14K paid users
//     · $11 one-time + $25/yr archival upgrade · NO advertising · NO VC
//   - Tarsnap(Colin Percival)· 2008-now · solo · encrypted backup ·
//     usage-billed · 0 employees · invite-only growth
//   - Sublime Text(Jon Skinner)· 2007-now · $99/3yr license · code editor
//     · solo for many years · evergreen sale model
//   - Drafts(Greg Pierce / Agile Tortoise)· 2015-now · iOS text capture ·
//     solo developer · subscription model
//   - Soulver(Zac Cohan / Acqualia)· 2003-now · macOS calculator · $30
//     one-time · solo · 22+ years durable
//   - Pieter Levels · nomadlist + RemoteOK · 2013-now · solo · subscription
//     · 0 employees · public revenue
//
// 不做 anti-pattern:
//   ✕ NO「we're better than [team SaaS X]」 direct comparison(would frame
//     as competitor not category-anchor · violates non-comparable axiom)
//   ✕ NO specific revenue / user count claims that we can't verify(per
//     [[feedback-zone27-pratfall-brand-ip]] · don't claim numbers we don't own)
//   ✕ NO「indie heroes」 hagiography(would convert anchor into hero worship
//     · violates audience-fans-not-engineers axiom)
//   ✕ NO「join the indie movement」 community framing(brand IP 「不 ship
//     user-to-user social platform」 redline)
//
// Append-only per /audit S05 PRE-COMMIT clause · 修改 peer list 需 30 天前
// /changelog 公告 · same Costly Signaling discipline as R71 W-C ENGINE_DIFF_
// BEACONS + R73 W-D NO_PUSH_INVENTORY + R74 W-A RECIPROCITY_LEDGER。
// ─────────────────────────────────────────────────────

export type SoloFounderPeer = {
  /** Brand / product name · max ~25 chars */
  brand: string;
  /** Founder real name · solo attribution */
  founder: string;
  /** Year started solo · 4 digits */
  since: number;
  /** Category · 1-3 words · what they sell */
  category: string;
  /** Pricing model · 1 sentence */
  pricing: string;
  /** Why this peer anchors ZONE 27's reference class · 1-2 sentences */
  anchor: string;
  /** Official URL · 1-click visitor verify · 不假裝 we own these */
  url: string;
};

/** 6 solo-durable-indie peers · ZONE 27 reference class · NOT SaaS · NOT
 *  team-funded · 不是 hero worship · 是 category anchor · append-only per
 *  /audit S05 PRE-COMMIT clause discipline。 */
export const SOLO_FOUNDER_PEERS: ReadonlyArray<SoloFounderPeer> = [
  {
    brand: "Pinboard.in",
    founder: "Maciej Cegłowski",
    since: 2009,
    category: "Bookmark archive",
    pricing: "NT$ 350 一次性 lifetime + NT$ 800/yr archival 上層",
    anchor:
      "Solo · 0 VC · 0 ads · 0 tracker · public retention disclosed · 17 年 durable · 同 ZONE 27「engine FREE forever · identity PAID」 axis · disclosure-as-product",
    url: "https://pinboard.in",
  },
  {
    brand: "Tarsnap",
    founder: "Colin Percival",
    since: 2008,
    category: "Encrypted backup",
    pricing: "Usage-billed picodollar/byte · 不訂閱 · 不 minimum",
    anchor:
      "Solo · 0 employees · cryptographic provability(not「trust us」)· 18 年 invite-only growth · same Costly Signaling discipline as ZONE 27 SHADOWLESS RUN axiom",
    url: "https://tarsnap.com",
  },
  {
    brand: "Sublime Text",
    founder: "Jon Skinner",
    since: 2007,
    category: "Code editor",
    pricing: "NT$ 3,000 一次性 / 3 年 license · evergreen sale",
    anchor:
      "Solo years · evergreen one-time license · no subscription churn · 19 年 craft software · 同 ZONE 27 Founders 27「NT$ 2,700 一次 終身」 closed-state mechanic",
    url: "https://www.sublimetext.com",
  },
  {
    brand: "Drafts",
    founder: "Greg Pierce / Agile Tortoise",
    since: 2015,
    category: "iOS text capture",
    pricing: "NT$ 600/年 subscription · 免費版永久存在",
    anchor:
      "Solo iOS indie · 10+ 年 sustained · free tier permanent · paid 補 advanced features · 同 ZONE 27 FREE engine + PAID identity 倒置 SaaS",
    url: "https://getdrafts.com",
  },
  {
    brand: "Soulver",
    founder: "Zac Cohan / Acqualia",
    since: 2003,
    category: "macOS calculator",
    pricing: "NT$ 900 一次性 · 不訂閱",
    anchor:
      "Solo · 23 年 durable · macOS pre-App-Store-launch · one-time license · no subscription pivot · 同 ZONE 27「不 pivot to Web3」 binding pre-commit pattern",
    url: "https://soulver.app",
  },
  {
    brand: "Pieter Levels(nomadlist)",
    founder: "Pieter Levels",
    since: 2013,
    category: "Travel + remote data",
    pricing: "NT$ 700-1500/年 subscription · 公開 revenue 上 Twitter",
    anchor:
      "Solo · 0 employees · 12 年 durable · 公開 revenue numbers · 同 ZONE 27 /annual/2026 enterprise disclosure axiom · solo founder 經濟學 transparent",
    url: "https://nomadlist.com",
  },
];

/** Computed count · used by component header chip · brand IP「6 peer reference
 *  class」 surface · 6 not arbitrary - matches NumItem 6-row Stripe Atlas
 *  pattern in /pricing/why §03 · same visual rhythm。 */
export const SOLO_FOUNDER_PEERS_COUNT = SOLO_FOUNDER_PEERS.length;
