import Link from "next/link";

// ── ZONE 27 · GameThread · BLACK CARD 賽事討論室 ──────
// R152 W1 · REDESIGN per Tim 12-fire browser-verified canary fire ·
// 之前 R148 W1 disclosure-heavy scaffold 看起來像 announcement page 不像
// discussion room · Tim landed on it via Nav click 但不認識「賽事討論室」 ·
// REDESIGN · posts at TOP product-first · form visible(disabled state)·
// brand IP narrative + PRE-LAUNCH footer at BOTTOM · Tim sees discussion
// room first 立即 認出「啊 這是 賽事討論室」。
//
// R148 origin · Tim founder-dogfood-canary 7-fire 後 explicit override of
// [[feedback-zone27-one-way-by-design]] iron rule 「我要(賽事討論室)！」 ·
// per [[feedback-founder-dogfood-canary]] axiom trust founder 即修 ·
// MINIMUM-VIOLATION ship · only ONE iron rule reversed(community ban) ·
// 其他 11 iron rules 全 hold(CPBL only · 0 commission · engine free ·
// 0 ads · displacement mission · pratfall · monetization · disclosure ·
// coverage · pricing · paid-model-is-support 全保留)。
//
// Brand IP constraints applied for minimum-violation 賽事討論室:
//   1. BLACK CARD-gated 發言 · 限 NT$ 1,500/season 訂閱者(自由 tier 可讀)
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
// ─────────────────────────────────────────────────────

type SamplePost = {
  id: string;
  user: string;
  team: string;
  hoursAgo: number;
  body: string;
  isFounder?: boolean;
};

const SAMPLE_POSTS: SamplePost[] = [
  {
    id: "sample-1",
    user: "Tim",
    team: "founder",
    hoursAgo: 2,
    body: "今晚兩位投手 ERA 都 sub-1.50 · pitcher duel 預期 · 中繼牛棚會 decide 結局。 Founders 27 + BLACK CARD 訂閱者 賽前 24hr 可發 1 post 200 字 · 我親手 moderate · 0 betting · 球迷 grammar only。",
    isFounder: true,
  },
  {
    id: "sample-2",
    user: "球迷 #042",
    team: "中信兄弟",
    hoursAgo: 1,
    body: "蔣鋐 ERA 1.49 球路控得很穩 · 兄弟若想贏要靠中繼壓制 · 阿部雄大 雖然 13.1 IP 樣本小但 ERA 0.68 elite small-sample · 真實水準等 30+ IP 才能評估。",
  },
  {
    id: "sample-3",
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
      data-game-id={gameId}
      id="game-thread"
    >
      {/* ── HEADER · big visible 賽事討論室 label · product-first ──── */}
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <span aria-hidden="true" className="text-2xl text-gold leading-none">
          💬
        </span>
        <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          賽事討論室
        </h2>
      </div>

      {/* ── STATS BAR · 3 posts · 24hr decay · BLACK CARD-gated ──── */}
      <div className="flex items-baseline gap-3 mb-6 flex-wrap font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-mute">
        <span className="text-gold">{SAMPLE_POSTS.length} POSTS</span>
        <span className="text-mute/40">·</span>
        <span>24hr 自動 archive</span>
        <span className="text-mute/40">·</span>
        <span>BLACK CARD 訂閱者 可發言</span>
        <span className="text-mute/40">·</span>
        <span>自由 tier 可讀</span>
      </div>

      {/* ── POSTS · product-first 看起來像 real discussion ───── */}
      <div className="space-y-3 mb-6">
        {SAMPLE_POSTS.map((p) => (
          <PostRow key={p.id} post={p} />
        ))}
      </div>

      {/* ── REPLY FORM · visible 但 disabled state ───── */}
      <div className="mt-2 mb-8 p-4 sm:p-5 border border-line/60 bg-slate/30">
        <label className="block">
          <span className="font-mono text-mute text-[10px] tracking-[0.3em] block mb-2">
            您的留言 · 200 字以內 · 球迷 grammar(0 betting)
          </span>
          <textarea
            disabled
            rows={3}
            placeholder="您必須 是 BLACK CARD 訂閱者 才能發言 · 點下方 →"
            className="w-full bg-ink/60 border border-line/70 text-bone px-3 py-2.5 outline-none placeholder:text-mute/60 font-mono text-sm leading-relaxed opacity-50 cursor-not-allowed"
          />
        </label>
        <div className="mt-3 flex items-baseline justify-between gap-3 flex-wrap">
          <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            🔒 BLACK CARD 訂閱者(NT$ 500/31 天)可發言
          </span>
          <Link
            href="/membership/black-card"
            className="inline-block px-4 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors"
          >
            → BLACK CARD 訂閱
          </Link>
        </div>
      </div>

      {/* ── PRE-LAUNCH STATUS + BRAND IP NARRATIVE · footer ── */}
      <div className="mt-2 p-4 border border-loss/30 bg-loss/[0.03]">
        <p
          lang="en"
          className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2"
        >
          ⏳ PRE-LAUNCH · STATUS Q3 2026
        </p>
        <p className="text-mute/85 text-xs sm:text-sm leading-relaxed mb-2">
          上方 3 posts 為 mockup 展示 · form 為 visual scaffold(disabled)· 真正
          posting 在 BLACK CARD payment system stable + Tim 親手 moderation tool
          ready 後 ship。 brand IP minimum-violation per R148 founder-dogfood-canary
          7-fire explicit override · per [[feedback-zone27-one-way-by-design]] iron
          rule narrowed · 其他 11 iron rules 全 hold。
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.22em] leading-relaxed">
          ⚓ 規則 binding(R148 6 constraints append-only)· 1 post per game · 200
          字以內 · 球迷 grammar(0 betting / 0 下注 / 0 賠率 / 0 莊家)· 24hr 自動
          archive · Tim 親手 moderate · 違規 first warn + second remove + third
          permanent ban · per /audit S05 PRE-COMMIT discipline 修改需 30 天前
          /changelog 公告 · per Pratfall axiom 公開 brand IP reversal 不藏。
        </p>
      </div>
    </section>
  );
}

function PostRow({ post: p }: { post: SamplePost }) {
  return (
    <article
      className={`p-4 sm:p-5 border ${
        p.isFounder
          ? "border-gold/50 bg-gold/[0.04]"
          : "border-line/60 bg-slate/30"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <span className="flex items-baseline gap-3">
          <span
            className={`font-mono text-[11px] sm:text-xs tracking-[0.2em] ${
              p.isFounder ? "text-gold" : "text-bone"
            }`}
          >
            {p.user}
          </span>
          <span className="font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.25em]">
            · {p.team}
          </span>
        </span>
        <span className="font-mono text-mute/60 text-[9px] tracking-[0.22em] tabular">
          {p.hoursAgo}hr ago
        </span>
      </div>
      <p className="text-bone/90 text-sm leading-relaxed">{p.body}</p>
    </article>
  );
}
