import Link from "next/link";

// ── ZONE 27 · Paid Tier Locked Grid ─────────────────────
// Round 36 W-C · Tim 14+ canary fire「會員功能對付費者沒吸引力」 ·
// surface critical perception gap:Tim 截圖看的是 FREE TIER 5 unlocks ·
// /member dashboard 沒 show BLACK CARD + Founders 27 加什麼 · visitor
// 從 FREE TIER dashboard 看不到 paid tier value → 感覺「就這些?」 ·
// 同 Netflix「Standard/Premium」 grid 對照模式 缺。
//
// 設計:
//   - Header「↑ NEXT TIER · 您未解鎖」 visible locked state
//   - BLACK CARD 6 unlocks card · NT$ 1,500/season visible
//   - Founders 27 終身 mega-card · 全 BLACK CARD + 0% 抽成 + 未來所有
//     lenses/engines 永久解鎖
//   - 每 unlock 標 lock icon · 灰 + low opacity · click → /membership/black-card
//   - CTA bottom · BLACK CARD preview + Founders 27 ledger
//
// brand IP:
//   - 不破 minimalism axiom · single BLACK CARD tier(不分 STARTER/PRO)
//   - 不假承諾(BLACK CARD PRE-LAUNCH state explicit · Q3 2026 上線)
//   - Founders 27 lifetime 永久 lock 未來所有 future engines/lenses 物理
//     codify「終身」 value
//   - 同 R35 W-D Engine Lineup + R36 W-A Lens Variety 框架對齊
//
// 心理 hook:
//   - Visible status hierarchy · FREE → BLACK CARD → Founders 27 階梯
//   - FOMO · BLACK CARD 解鎖 6 個 你目前看不到
//   - Sunk cost · 已有 FREE TIER 累計(predictions / follows / notes)·
//     升級不丟 + 解鎖更多
//   - Anchoring · Founders 27 NT$ 2,700 一次 vs BLACK CARD NT$ 299×N 月
// ─────────────────────────────────────────────────────

// R141 W1 · BLACK CARD unlocks build-status honest disclosure ·
// Tim canary fire「都沒實做對吧」 · 6 unlocks 過去全部 promise text without
// implementation status disclosure · per [[feedback-zone27-pratfall-brand-ip]]
// axiom + Tim「我們只做最好不是有做就好」 + 「任何缺陷都可能被人們攻擊」
// mandate · ADD explicit ✓ LIVE / ◐ PARTIAL / ⏳ PROMISE status badge to
// EACH unlock + binding ETA for PROMISE items per /audit S05 PRE-COMMIT
// discipline · same axis as /audit EXCLUDE + /methodology LIMITS + /roadmap
// BOUNDARIES + /track-record DIVERGED + /steelman + /founders/postmortem-2028
// (6 Pratfall surfaces · this is 7th surface in implementation honesty layer)。
// 結構性 LINE 老師 / 報馬仔 永遠無法 ship 此 disclosure(他們 promise more
// 但 deliver less + 不公開 implementation gap)· Costly Signaling 100×。
// Apple「coming soon」 + Linear changelog「shipped vs in progress」 + Patek
// 「Generations」 service model honesty + ZONE 27 own /roadmap LOCKED /
// EXPLORING / BRAND BOUNDARIES pattern。
//
// 6-unlock honest status audit:
//   #01 Engine 3 變體 = ◐ PARTIAL · v0.2 LIVE · v0.3 DEV PREVIEW · v0.4 PLANNED
//                       · BLACK CARD gating ❌ NOT BUILT(no payment to gate)
//   #02 7 Lenses     = ✓ LIVE · all 7 components built · 但 BLACK CARD gating
//                       ❌ NOT BUILT(currently free for all visitors)
//   #03 /hey-tim priority = ⏳ PROMISE · /hey-tim exists · 但 BLACK CARD priority
//                       queue 邏輯 + payment-gated 賽前 24hr 直送 全未建
//   #04 創作者抽成 5%  = ⏳ PROMISE · 完全未建 · 無 CMS + 無 creator vetting +
//                       無 payment integration
//   #05 每月 voting   = ⏳ PROMISE · 完全未建 · 無 voting infrastructure
//   #06 Tim 工程筆記   = ◐ PARTIAL · /now exists 全文 LIVE for all · BLACK CARD
//                       truncation gating ❌ NOT BUILT
// Total: 1 LIVE · 2 PARTIAL · 3 PROMISE = 6
// ─────────────────────────────────────────────────────

type UnlockStatus = "live" | "partial" | "promise";

const STATUS_BADGES: Record<
  UnlockStatus,
  { glyph: string; label: string; cls: string }
> = {
  live: { glyph: "✓", label: "LIVE", cls: "text-gold" },
  partial: { glyph: "◐", label: "PARTIAL", cls: "text-mute" },
  promise: { glyph: "⏳", label: "PROMISE", cls: "text-loss/85" },
};

type Unlock = {
  icon: string;
  title: string;
  body: string;
  status: UnlockStatus;
  /** Optional ETA · binding per /audit S05 PRE-COMMIT 30-day notice */
  eta?: string;
};

const BLACK_CARD_UNLOCKS: Unlock[] = [
  {
    icon: "🤖",
    title: "Engine Lineup 3 變體解鎖",
    body: "v0.3 Pitcher+Park+Batter(LIVE DEV PREVIEW · production 待 N≥30)+ v0.4 Bayesian Ensemble(PLANNED · v0.3 ship 後)· FREE TIER 仍 access v0.2 base",
    status: "partial",
    eta: "v0.3 production Q3 2026(待 N≥30 sample)· v0.4 PLANNED Q4 2026+ · BLACK CARD gating 邏輯 全未建",
  },
  {
    icon: "🔬",
    title: "Lens Variety 7 lenses 解鎖",
    body: "Vibe Check / Park Factor / Pitcher Fatigue / Underdog / Bullpen / Matchup History · 每 1-2 月 ship 1 new lens",
    status: "live",
    eta: "全 7 lenses LIVE on /matches/[gameId] for all visitors · BLACK CARD gating 待 payment system stable · 目前 free for all",
  },
  {
    // R139 W2 · brand IP contradiction fix · 原 promise「賽事討論室發言」
    // (reader↔reader)CONTRADICTS [[feedback-zone27-one-way-by-design]] iron
    // rule · REFRAME to /hey-tim BLACK CARD priority lane(Bill James「Hey
    // Bill」 + Stratechery subscriber Q&A + Matt Levine「Money Stuff」 mailbag +
    // DELTA Japan reader letters pattern · 100% reader↔writer)。
    // R145 W1 · Tim 6-fire same canary specifically asking「賽事討論室在哪裡」
    // (R123 + R139 + R141 + R143 + R144 + R145)· refactor done R139 W2 但
    // history invisible to visitor · 訪客記憶仍有「賽事討論室」 4 字 anchor ·
    // ADD visible「previously called」 footnote on body per Pratfall「不藏
    // mistake」 axiom 8th-time fulfillment this session(R130 + R135 + R139 +
    // R140 + R141 + R142 + R143 + R145)+ per [[feedback-founder-dogfood-canary]]
    // 6-fire trust-but-explain pattern · 不再隱藏 refactor history。
    icon: "📮",
    title: "/hey-tim 賽前 BLACK CARD 優先通道",
    body: "/matches/[gameId] BLACK CARD 賽前 24hr 直送 1 question to Tim via /hey-tim · Tim 賽後 24hr 內答 selected 1-2 公開 thread · 球迷 grammar · 不答 betting · 同 /hey-tim 既有 reader↔writer 模式(Bill James 「Hey Bill」 15-yr canonical)· 0 reader↔reader · ⚓ 此 unlock 原名「賽事討論室發言」(reader↔reader)· R139 W2 refactor 改為現名 per [[feedback-zone27-one-way-by-design]] iron rule + Pratfall axiom 公開 refactor history 不藏",
    status: "promise",
    eta: "Q3 2027(待 BLACK CARD payment system stable · /hey-tim priority queue 邏輯實做 · 目前 /hey-tim 既有 channel LIVE for all · 無 priority lane)",
  },
  {
    icon: "💵",
    title: "創作者抽成 5%",
    body: "您 publish 內容 · ZONE 27 抽 5% vs LINE 老師生態 30-50% 業界共識 · 降維打擊",
    status: "promise",
    eta: "Q4 2027(完全未建 · 需 CMS + creator vetting + payment integration + 5% revenue share infra · 同 axis Defector worker-owned media pattern 但 ZONE 27 不會 ship 直到 sustainability gate 全綠)",
  },
  {
    icon: "🗳️",
    title: "每月 voting 影響引擎 + lens roadmap",
    body: "Tim publish next ship options · BLACK CARD 訂閱者 vote · 結果公開 · IKEA Effect · 您 voting 即您引擎",
    status: "promise",
    eta: "Q3 2027(完全未建 · 需 voting infrastructure + Supabase 整合 + 結果公開 ledger · 同 Patek Generations subscriber influence pattern)",
  },
  {
    icon: "📓",
    title: "每週 Tim 工程筆記 full 版",
    body: "本週寫什麼 / 為什麼這樣寫 / 下週要 ship 什麼 · /now truncated · BLACK CARD 拿 full · Stratechery 模式",
    status: "partial",
    eta: "Q3 2026(truncation gating 待建 · 目前 /now 全文 LIVE for all · FREE vs BLACK CARD 差異未實做)",
  },
];

const FOUNDERS_27_BONUS = [
  "全 BLACK CARD 6 unlocks · 終身 0 月費",
  "0% 創作者抽成(BLACK CARD 5%)",
  "未來所有 engines + lenses 終身永久解鎖(不限數量)",
  "Founders 27 LINE 群 active access · Tim 親自答",
  "限量 270 名額永久關閉 · 您 # 編號公開 /leaderboard",
  "「Witnessed by #007」 referral 認證 status(R36+ ship)",
];

export default function PaidTierLockedGrid() {
  return (
    <div className="mt-8">
      {/* ── Header band · "下一階" framing ── */}
      <div className="bg-slate/30 border border-line/60 p-4 sm:p-5 mb-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <p
            lang="en"
            className="font-mono text-mute text-[10px] sm:text-[11px] tracking-[0.4em]"
          >
            ↑ NEXT TIER · 您未解鎖 · 點下方 preview
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
            FREE 5 + BLACK CARD 6(1 ✓ LIVE · 2 ◐ PARTIAL · 3 ⏳ PROMISE)+ Founders 27 終身無限
          </p>
        </div>
      </div>

      {/* ── BLACK CARD card · 6 unlocks + price ── */}
      <div className="bg-navy/40 border-x border-line/60 p-5 sm:p-7">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-baseline gap-3">
            <p
              lang="en"
              className="font-mono text-gold text-[11px] sm:text-xs tracking-[0.4em]"
            >
              BLACK CARD
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold shimmer"
              title="LIVE NOW · 季票手動續訂模式 · 個人方案綠界 ECPay · 0 auto-renewal per /integrity rule #13"
            >
              ✓ LIVE · 季票手動
            </span>
          </div>
          <p className="font-mono text-gold tabular text-lg sm:text-xl tracking-tight">
            NT$ 1,500
            <span className="text-mute text-[10px] ml-1 tracking-[0.25em]">/ season</span>
          </p>
        </div>
        <p className="text-mute text-sm leading-relaxed mb-5">
          訂閱解鎖 6 個 functional unlocks + Engine Lineup 3 變體 + Lens
          Variety 7 lenses(每 1-2 月 ship 1 new lens · sustained value
          compounding)。 同 FanGraphs Steamer/ZiPS/ATC + Baseball Prospectus
          PECOTA tier industry validated pattern。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BLACK_CARD_UNLOCKS.map((u, i) => (
            <LockedUnlockCard
              key={u.title}
              num={`#${String(i + 1).padStart(2, "0")}`}
              icon={u.icon}
              title={u.title}
              body={u.body}
              status={u.status}
              eta={u.eta}
            />
          ))}
        </div>

        {/* R141 W1 · honest implementation gap disclosure · per Pratfall axiom
            + Tim「我們只做最好不是有做就好」 mandate · 不藏 unlock 實做狀態 ·
            6th Pratfall implementation-honesty surface(7th overall counting
            /audit EXCLUDE + /methodology LIMITS + /roadmap BOUNDARIES +
            /track-record DIVERGED + /steelman + /founders/postmortem-2028)·
            結構性 LINE 老師 / 報馬仔 永遠無法 ship 此 disclosure(他們 promise
            more 但 deliver less + 不公開 implementation gap)· Costly Signaling
            100×。 同 Apple「coming soon」 + Linear changelog + Patek Generations
            service model honesty + ZONE 27 own /roadmap LOCKED/EXPLORING/
            BOUNDARIES pattern。 */}
        <div className="mt-5 p-3 sm:p-4 border border-loss/30 bg-loss/5">
          <p className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2">
            ⚓ HONEST IMPLEMENTATION DISCLOSURE
          </p>
          <p className="text-mute text-[11px] leading-relaxed">
            6 unlocks 過去全部 promise text · 現公開 per-unlock build status:
            <span className="text-gold mx-1">✓ LIVE</span>= 完整 shipped ·
            <span className="text-mute mx-1">◐ PARTIAL</span>= 部分 shipped ·
            <span className="text-loss/85 mx-1">⏳ PROMISE</span>= 未建 + 綁定 ETA
            。 LINE 老師 / 報馬仔 結構性無法 ship 此 page(他們 promise more
            deliver less + 不公開 implementation gap)。 修改 status 需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold/85 underline-offset-4 hover:underline"
            >
              /changelog
            </Link>
            {" "}公告 · same /audit S05 PRE-COMMIT discipline · binding append-only。
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/membership/black-card"
            className="inline-block px-5 py-2.5 bg-gold/10 border border-gold text-gold font-mono text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            → BLACK CARD UI preview · 看 mockup
          </Link>
        </div>
      </div>

      {/* ── Founders 27 mega-card · 終身 + 未來所有 lenses ── */}
      <div className="bg-gold/5 border-2 border-gold/60 glow-soft p-5 sm:p-7 mt-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-baseline gap-3">
            <p
              lang="en"
              className="font-mono text-gold text-[11px] sm:text-xs tracking-[0.4em]"
            >
              FOUNDERS 27 · LIFETIME
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold shimmer"
              title="限量 270 · 7 SYSTEM-TEST forged · 263 待認領 · 永久關閉"
            >
              限量 263 · 永久關閉
            </span>
          </div>
          <p className="font-mono text-gold tabular text-lg sm:text-xl tracking-tight">
            NT$ 2,700
            <span className="text-mute text-[10px] ml-1 tracking-[0.25em]">一次 · 終身</span>
          </p>
        </div>
        <p className="text-mute text-sm leading-relaxed mb-5">
          BLACK CARD 6 unlocks 全部 + 終身 0 月費 + 0% 創作者抽成 + **未來
          所有 engines / lenses 永久解鎖**(R36+ ship 的 Vibe Check · Park
          Factor · Pitcher Fatigue · Underdog · Bullpen · Matchup History
          + Engine v0.3 + v0.4 + 任何未來 ship 的 · 全終身解鎖不限數量)·
          Patek allocation pattern · 270 名額永久關閉。
        </p>

        <ul className="space-y-2">
          {FOUNDERS_27_BONUS.map((line) => (
            <li key={line} className="flex gap-3 items-baseline">
              <span
                className="font-mono text-gold text-xs tabular shrink-0"
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="flex-1 text-mute text-[13px] leading-relaxed">
                {line}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/founders"
            className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            → Founders 27 完整 sales page
          </Link>
          <Link
            href="/founders/ledger"
            className="font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.35em] underline-offset-4 hover:underline transition-colors"
          >
            Open Allocation Ledger →
          </Link>
        </div>
      </div>

      {/* ── Brand IP footnote · Pratfall + 無限 scaling ── */}
      <div className="bg-slate/30 border border-line/60 p-4 sm:p-5 mt-0">
        <p className="font-mono text-mute/70 text-[10px] sm:text-[11px] tracking-[0.25em] leading-relaxed text-center">
          ▸ FREE TIER 5 unlocks 終身免費 · BLACK CARD 6 unlocks NT$ 1,500/season ·
          Founders 27 終身 NT$ 2,700 一次<br />
          ▸ Engine Lineup 3 變體 + Lens Variety 7 lenses 已寫入 /methodology
          Section 04 + 05 · roadmap visible · 每 lens publish methodology +
          DIVERGED · 0 fake mystery model<br />
          ▸ Patek complication 模式 · 不是「越準的錶」 · 是「越多 angle 看
          比賽」 · brand-pure 無限 scaling · 訂閱者 voting decide next ship 順序
        </p>
      </div>
    </div>
  );
}

function LockedUnlockCard({
  num,
  icon,
  title,
  body,
  status,
  eta,
}: {
  num: string;
  icon: string;
  title: string;
  body: string;
  status: UnlockStatus;
  eta?: string;
}) {
  const badge = STATUS_BADGES[status];
  return (
    <div className="bg-slate/30 border border-line/60 p-3 sm:p-4 group hover:border-gold/40 transition-colors">
      <div className="flex items-baseline justify-between mb-2 gap-2 flex-wrap">
        <span
          aria-hidden="true"
          className="text-lg text-gold/70 leading-none"
        >
          {icon}
        </span>
        <span className="flex items-baseline gap-2">
          {/* R141 W1 · honest status badge · ✓ LIVE / ◐ PARTIAL / ⏳ PROMISE
              · per Pratfall axiom 不藏 implementation gap · Apple「coming soon」
              + Linear changelog + Patek Generations honesty pattern · per /audit
              S05 PRE-COMMIT discipline · 修改 status 需 30 天前 /changelog 公告。 */}
          <span
            lang="en"
            className={`font-mono text-[9px] tracking-[0.25em] tabular ${badge.cls}`}
            title={`Build status: ${badge.label} · ${status === "live" ? "fully shipped" : status === "partial" ? "partially shipped" : "not yet built · binding ETA"}`}
          >
            {badge.glyph} {badge.label}
          </span>
          <span className="font-mono text-mute/60 text-[9px] tracking-[0.3em] tabular">
            🔒 {num}
          </span>
        </span>
      </div>
      <h5 className="text-bone/85 text-sm font-light tracking-tight leading-snug mb-1.5">
        {title}
      </h5>
      <p className="text-mute/80 text-[11px] leading-relaxed">{body}</p>
      {eta && (
        <p
          className={`mt-2 pt-2 border-t border-line/30 font-mono text-[9px] tracking-[0.2em] leading-relaxed ${
            status === "promise" ? "text-loss/70" : "text-mute/60"
          }`}
        >
          ETA · {eta}
        </p>
      )}
    </div>
  );
}
