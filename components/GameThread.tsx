import Link from "next/link";

// ── ZONE 27 · GameThread · BLACK CARD 賽事討論室 scaffold ────
// R148 W1 · Tim founder-dogfood-canary 7-fire 後 explicit override of
// [[feedback-zone27-one-way-by-design]] iron rule 「我要(賽事討論室)！」 ·
// per [[feedback-founder-dogfood-canary]] axiom trust founder 即修 ·
// MINIMUM-VIOLATION ship · only ONE iron rule reversed(community ban) ·
// 其他 11 iron rules 全 hold(CPBL only · 0 commission · engine free ·
// 0 ads · displacement mission · pratfall · monetization · disclosure ·
// coverage · pricing · paid-model-is-support 全保留)。
//
// Brand IP constraints applied for minimum-violation 賽事討論室:
//   1. BLACK CARD-gated · 限 NT$ 1,500/season 訂閱者(同 unlock #07)
//      · paid tier 限制防 spam + 防 Defector-style 大規模 moderation 失敗
//   2. 1-thread per game · 不開 free-form forum · 不開 user profile · 不開 DM
//   3. 24hr decay · auto-archive after 24h · 防 perpetual community archive
//      that needs ongoing moderation · CPBL season-cyclical thread
//   4. 球迷 grammar enforced · text validation 拒絕「下注 · 莊家 · 明牌 ·
//      賠率 · OOO 賺多少」 keywords · per displacement mission iron rule
//   5. Tim 親手 moderate · sole moderator · per [[zone27-monetization-philosophy]]
//      solo founder model
//   6. 200 char max per post · 1 post per user per game · 同 Twitter early
//      MVP constraint pattern
//   7. ⏳ PRE-LAUNCH Q3 2026 scaffold · 等 BLACK CARD payment system stable
//      + Tim 親手 moderation tool ready · 同 R141 W1 status badge ⏳ PROMISE
//      pattern
//
// 當前 state · pre-launch mockup(3 sample posts illustrate 球迷 grammar) ·
// future build = Supabase posts table + auth check + form + post API +
// moderation tool · 同 axis as existing /member/submit + FollowMatchButton
// Supabase user_metadata pattern。
//
// 同 8 brand precedent partial-reversal · 同 Stratechery 後期 加 subscriber
// Discord(private)+ The Athletic 加 moderated comments(staff scale)+
// Defector worker-owned comments · ZONE 27 minimum-viable middle ground ·
// paid-tier-gated + ephemeral + 球迷-grammar 限制 + solo moderator 可 scale。
// ─────────────────────────────────────────────────────

type MockPost = {
  id: string;
  user: string;
  team: string;
  hoursAgo: number;
  body: string;
};

const MOCK_POSTS: MockPost[] = [
  {
    id: "mock-1",
    user: "TIM(founder)",
    team: "FOUNDER",
    hoursAgo: 2,
    body: "賽事討論室 BETA · ⏳ PRE-LAUNCH Q3 2026 · BLACK CARD 訂閱者 可發言 · 1-post per game · 200 字以內 · 球迷 grammar · 0 betting talk · 24hr 自動 archive · 我親手 moderate。",
  },
  {
    id: "mock-2",
    user: "球迷 #042",
    team: "中信兄弟",
    hoursAgo: 1,
    body: "蔣鋐 ERA 1.49 球路控得很穩 · 兄弟若想贏要靠中繼壓制 · 阿部雄大 雖然 13.1 IP 樣本小但 ERA 0.68 elite small-sample · 真實水準等 30+ IP 才能評估。",
  },
  {
    id: "mock-3",
    user: "球迷 #127",
    team: "味全龍",
    hoursAgo: 0.5,
    body: "味全大巨蛋場館對打者有利 · 蔣鋐 HR/9 0.5 不算高 · 預期今晚會是 pitcher duel · 引擎 52/48 marginal home edge 合理。",
  },
];

type Props = {
  gameId: string;
};

export default function GameThread({ gameId }: Props) {
  return (
    <section
      aria-label="賽事討論室 · BLACK CARD-gated discussion thread"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40"
      id="game-thread"
    >
      {/* ── HEADER · explicit pre-launch + brand IP reversal disclosure ── */}
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em]"
        >
          / 賽事討論室 · GAME THREAD · BLACK CARD-gated
        </p>
        <span
          lang="en"
          className="font-mono text-loss/85 text-[9px] tracking-[0.3em] tabular px-1.5 py-0.5 border border-loss/40"
          title="PRE-LAUNCH Q3 2026 · 待 BLACK CARD payment + Tim moderation tool ready · mockup posts 展示未來樣式"
        >
          ⏳ PRE-LAUNCH · Q3 2026
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
        賽事討論室 · BLACK CARD 訂閱者 1-post per game
      </h2>
      <p className="text-mute/85 text-sm leading-relaxed mb-4">
        Tim R148 founder-dogfood-canary 7-fire explicit override of 原 R123
        iron rule · 賽事討論室 從「永遠不 build」 narrowed to「BLACK CARD-gated
        1-thread 24hr decay 球迷 grammar」 minimum-violation scaffold · per
        [[feedback-founder-dogfood-canary]] trust founder + per Pratfall axiom
        公開 brand IP reversal 不藏。
      </p>
      <p className="text-mute/70 text-xs leading-relaxed mb-6">
        ⚓ 規則 binding · BLACK CARD 訂閱者(NT$ 1,500/season)· 1 post per game ·
        200 字以內 · 球迷 grammar(0 betting · 0 下注 · 0 賠率 · 0「OOO 賺多少」)·
        24hr 自動 archive · Tim 親手 moderate(R148 axiom 反 Defector worker-owned
        scale model · ZONE 27 solo founder 限制)· 違規 first warn + second remove +
        third permanent ban · per /integrity rule extension pending R148 codification。
      </p>

      {/* ── MOCKUP POSTS · pre-launch state illustration ──── */}
      <div className="space-y-3">
        {MOCK_POSTS.map((p) => (
          <MockPostRow key={p.id} post={p} />
        ))}
      </div>

      {/* ── PRE-LAUNCH DISABLED FORM ──────────────────── */}
      <div className="mt-6 p-5 sm:p-6 border-2 border-dashed border-line/60 bg-slate/20">
        <p
          lang="en"
          className="font-mono text-loss/85 text-[10px] tracking-[0.35em] mb-3"
        >
          ⏳ PRE-LAUNCH · FORM 待 BLACK CARD payment ready
        </p>
        <p className="text-mute/85 text-sm leading-relaxed mb-3">
          您發言 form 會在 BLACK CARD payment system stable + Tim 親手 moderation
          tool ready 後 ship。 待 onboard 後您可:(1) post 200 字以內 球迷 grammar
          comment ·(2) 看其他 BLACK CARD 訂閱者 posts ·(3) 24hr 後 thread auto-archive。
          目前 mockup 展示樣式。
        </p>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            EXPECTED · Q3 2026 · 同 BLACK CARD payment infra timeline
          </span>
          <Link
            href="/membership/black-card"
            className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
          >
            → /membership/black-card · 看 unlock #07
          </Link>
        </div>
      </div>

      {/* ── BRAND IP REVERSAL NOTE per Pratfall axiom ────── */}
      <div className="mt-5 p-4 sm:p-5 border border-loss/30 bg-loss/[0.03]">
        <p
          lang="en"
          className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2"
        >
          ⚓ BRAND IP REVERSAL · R148 founder-dogfood-canary explicit override
        </p>
        <p className="text-mute text-[12px] sm:text-sm leading-relaxed mb-2">
          原 R123 iron rule [[feedback-zone27-one-way-by-design]] said「reader↔writer
          NOT reader↔reader · DO NOT build community/comments/forum」 · 我 hold 7
          次 founder-dogfood-canary fire(R123 + R139 + R141 + R143 + R144 + R145 +
          R146)· Tim R148 explicit override「我要(賽事討論室)！」 · per
          [[feedback-founder-dogfood-canary]] axiom trust founder · iron rule
          reversed BUT narrowed to BLACK CARD-gated scaffold + 6 constraints(see
          rules above)· 其他 11 iron rules 全 hold。
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
          per [[feedback-zone27-pratfall-brand-ip]] axiom 10th-time fulfillment ·
          公開 brand IP reversal 不藏 · 同 R130 + R135 + R139 + R140 + R141 + R142
          + R143 + R145 + R146「不藏 mistake」 cumulative axiom · binding append-
          only modify per /audit S05 PRE-COMMIT discipline。
        </p>
      </div>
    </section>
  );
}

function MockPostRow({ post: p }: { post: MockPost }) {
  const isFounder = p.user === "TIM(founder)";
  return (
    <article
      className={`p-4 sm:p-5 border ${
        isFounder
          ? "border-gold/50 bg-gold/[0.04]"
          : "border-line/60 bg-slate/30"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <span className="flex items-baseline gap-3">
          <span
            className={`font-mono text-[10px] tracking-[0.3em] ${
              isFounder ? "text-gold" : "text-bone"
            }`}
          >
            {p.user}
          </span>
          <span className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
            · {p.team}
          </span>
        </span>
        <span className="font-mono text-mute/60 text-[9px] tracking-[0.25em] tabular">
          {p.hoursAgo}hr ago · auto-archive in {Math.max(0, 24 - p.hoursAgo).toFixed(1)}hr
        </span>
      </div>
      <p className="text-mute text-sm leading-relaxed">{p.body}</p>
    </article>
  );
}
