"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getSimHistory,
  relativeTime,
  type SimHistoryEntry,
} from "@/lib/sim-history";

// ── Roadmap voting state · Round 29 Wave 5B(Agent A Pattern #5)──
// Linear / PostHog 2025-2026 從 upvote 轉 drag-rank · 「ranked
// prioritization」比 thumb-up 心理投資高 · 訪客 think like an engineer.
// 因 mobile drag-drop 不穩 + brand「no deps」axiom · 用 ▲▼ arrow
// buttons swap-with-neighbor 取代 HTML5 drag(Linear column reorder
// 同模式 · mobile-safe)。localStorage 持久 · auth 上線後 sync。

type RoadmapItem = {
  id: string;
  title: string;
  body: string;
  tier: string;
  disabled?: boolean;
};

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "v3-park",
    title: "v0.3 · 加入球場因素 (park factor)",
    body: "目前所有球場用聯盟均值 · 加入 park factor 後 · 統一桃園 vs 統一新莊 主場優勢會有真實 home/away winRate 影響。",
    tier: "BLACK CARD + Founders 27",
  },
  {
    id: "v3-batter",
    title: "v0.3 · 加入打者個別品質 (隊伍 wOBA)",
    body: "目前所有打者假設聯盟平均 · 加入隊伍 wOBA 後 · 強打線 vs 二軍 winRate gap 會反映真實。",
    tier: "BLACK CARD + Founders 27",
  },
  {
    id: "v4-statcast",
    title: "v0.4 · 球速 + 轉軸物理 (待 CPBL 公開 Statcast)",
    body: "aspirational · 等 CPBL 開始公開 PA 級 K/BB + EV/LA 等 Statcast 資料 · 我們才接得上去。",
    tier: "尚未開放投票 · 等資料就緒",
    disabled: true,
  },
];

const VOTE_STORAGE_KEY = "zone27_engine_voting_v1";

type VotingState = {
  order: string[];
  because: string;
};

function defaultVotingState(): VotingState {
  return { order: ROADMAP_ITEMS.map((r) => r.id), because: "" };
}

function loadVotingState(): VotingState {
  if (typeof window === "undefined") return defaultVotingState();
  try {
    const raw = window.localStorage.getItem(VOTE_STORAGE_KEY);
    if (!raw) return defaultVotingState();
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.order) &&
      parsed.order.every((id: unknown) => typeof id === "string") &&
      typeof parsed.because === "string"
    ) {
      // Re-validate IDs match current roadmap (drop unknown · add missing at end)
      const validIds = new Set(ROADMAP_ITEMS.map((r) => r.id));
      const filtered = parsed.order.filter((id: string) => validIds.has(id));
      const missing = ROADMAP_ITEMS.map((r) => r.id).filter(
        (id) => !filtered.includes(id)
      );
      return {
        order: [...filtered, ...missing],
        because: parsed.because.slice(0, 280),
      };
    }
  } catch {
    /* fall through */
  }
  return defaultVotingState();
}

function saveVotingState(state: VotingState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

// ── ZONE 27 · Member Dashboard Preview ─────────────────
// Round 29 Wave 2 · Tim 直擊:「會員他們自己的頁面又在哪裡?」
//
// /member 預覽頁 client-side 區塊。把 visitor 在 localStorage 已經
// 有的 sim history(/lab + /lab/custom + /matches/[gameId] 跑過的)
// 直接以「您的引擎時間軸」 framing 顯示 — Endowment Effect 活用:
// visitor 看到「我的 data」就有 ownership feeling · 即使尚未 auth-
// gated 也已建立 brand-IP-level 心理連結。
//
// 4 個 cognitive bias 同時 fire(per Tim「多以心理學角度」 ask):
//   1. Endowment Effect · 給會員他「自己已累積」的資料
//   2. IKEA Effect · 讓他投票引擎下一步(用 /roadmap items)
//   3. Loss Aversion · 顯示「離開 = 失去 history」
//   4. Collection / Status · personal calibration scorecard
//
// 不做 auth · framing 為「您的本地預覽 · launch 後同步雲端」 · Pratfall
// surface 顯示工程進度 · 不假裝 functionality already exists。
// ─────────────────────────────────────────────────────

export default function MemberDashboardPreview() {
  // Mount flag + capture-once timestamp for SSR hydration safety.
  // Date.now() can't live in useMemo (react-hooks/purity rule) so we
  // capture it once on mount into state · then derive daysSinceFirst
  // from it. Single useEffect setState is the canonical SSR-safe pattern
  // for browser-API access(localStorage 沒 same-window change events ·
  // useSyncExternalStore subscribe 是 noop · Object.is comparison thrash).
  const [mounted, setMounted] = useState(false);
  const [mountTime, setMountTime] = useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setMountTime(Date.now());
  }, []);

  // Derive history from mounted state · only reads localStorage post-mount ·
  // avoids hydration mismatch on initial render.
  const history = useMemo<SimHistoryEntry[]>(
    () => (mounted ? getSimHistory() : []),
    [mounted]
  );

  // Days since oldest sim · used in memory resurfacing strip
  // (Pattern #1 lightweight · Day One「what I have accumulated」framing).
  // Math.max(1, ...) avoids 「0 天」 framing for same-day runs.
  // Uses mountTime captured at mount(react-hooks/purity rule prevents
  // Date.now() inside useMemo).
  // ALL hooks must run BEFORE any early return (rules-of-hooks).
  const daysSinceFirst = useMemo<number>(() => {
    if (!mounted || mountTime === 0 || history.length === 0) return 0;
    const oldest = Math.min(...history.map((h) => h.ranAt));
    return Math.max(
      1,
      Math.floor((mountTime - oldest) / (1000 * 60 * 60 * 24))
    );
  }, [mounted, mountTime, history]);

  // SSR fallback — show "what your dashboard will contain" generic version
  // Mounted state guards localStorage access for hydration safety.
  if (!mounted) {
    return (
      <div className="font-mono text-mute/60 text-[10px] tracking-[0.3em] tabular py-12 text-center">
        ▸ 載入您的本地引擎時間軸 ...
      </div>
    );
  }

  // Last-write timestamp from most recent sim · used in Context Strip
  // (Pattern #2 · Agent A 2026 research · privacy-led UX trust signal).
  const lastWrittenLabel =
    history.length > 0 ? relativeTime(history[0].ranAt) : "尚未寫入";

  return (
    <div className="space-y-12">
      {/* ── CONTEXT STRIP ─────────────────────────
          Agent A 2026 research Pattern #2 · privacy-led UX trust signal.
          Costly Signaling: visible data-location + last-access disclosure
          beats absence-of-tracker invisibility. Replaces early-2020s
          pattern of stuffing badges into footer. Atlassian + Vercel +
          MIT Tech Review April 2026 piece converging on this. */}
      <div
        className="font-mono text-mute/60 text-[10px] tracking-[0.25em] tabular leading-relaxed py-3 px-4 sm:px-5 border border-line/30 bg-slate/20"
        aria-label="此頁面的資料來源 + 隱私狀態說明"
      >
        ▌ 資料位置 · 您的瀏覽器 localStorage{" "}
        <span className="text-mute/40">·</span> 上次寫入 ·{" "}
        <span className="text-bone/70">{lastWrittenLabel}</span>{" "}
        <span className="text-mute/40">·</span>{" "}
        <span lang="en">我們看不到 · 0 cookies · 0 GA · 0 pixel</span>
      </div>

      {/* ── MEMORY RESURFACING STRIP ─────────────────
          Agent A 2026 research Pattern #1 lightweight · Day One
         「On This Day」accumulating-over-time framing。Loss aversion
          says「don't lose this」· memory resurfacing 升一級 says
         「look how much you already own」。Strava Annual Best Efforts
          + GitHub contribution graph 同邏輯 · 視覺化 visitor 已累積的
          投入(Endowment Effect 真正的 trigger 是「我擁有 X 」 ·
          不是「我可能會擁有 X」)。
          只在 history.length > 0 才 render · first-time visitor 不看見。 */}
      {history.length > 0 && (
        <div className="border-l-2 border-gold/50 pl-4 sm:pl-5 py-3 bg-gold/5">
          <p
            lang="en"
            className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-1"
          >
            ▌ YOU&apos;VE ACCUMULATED · 您已累積
          </p>
          <p className="text-bone text-base sm:text-lg leading-snug">
            <span className="font-mono text-gold tabular text-2xl sm:text-3xl">
              {history.length}
            </span>
            <span className="ml-2 text-mute">場引擎 sim</span>
            {daysSinceFirst > 0 && (
              <>
                {" · over "}
                <span className="font-mono text-bone tabular text-xl sm:text-2xl">
                  {daysSinceFirst}
                </span>
                <span className="ml-1 text-mute">{daysSinceFirst === 1 ? " day" : " 天"}</span>
              </>
            )}
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mt-2 leading-relaxed">
            ▸ <span lang="en">ENDOWMENT + MEMORY</span> · 這是您的累積 ·
            離開帳號 = 失去這份 history(per /manifesto Section II MONETIZATION)
          </p>
        </div>
      )}

      {/* ── 01 · 您的引擎時間軸 ───────────────────── */}
      <Section
        no="01"
        en="YOUR ENGINE TIMELINE"
        zh="您的引擎時間軸"
        psychology="Endowment Effect"
        kicker="您在 /lab + /lab/custom 跑過的所有 Monte Carlo 收斂"
      >
        {history.length === 0 ? (
          // Agent A 2026 research Pattern #3 · NN/g empty-state guidelines:
          // first-time visitor sees one sentence of context + one concrete
          // action + learning cue. No marketing copy · no exhortation.
          <EmptyState
            zh="這格將顯示您本機跑過的 Monte Carlo · 跑一場它就會填上。"
            cta={{ label: "→ 進 /lab 跑一場 10K sims", href: "/lab" }}
            hint="您看到「您還沒跑過任何 sim」不是 bug · 是這頁的 first-time empty state。我們不在這裡放 marketing copy 引導您 · 您要不要跑 sim 是您決定。 (per NN/g 2026 empty-state guidelines · 倒置 SaaS dashboard 預設 onboarding 話術)"
          />
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <SimHistoryRow key={`${entry.matchId}-${entry.ranAt}`} entry={entry} />
            ))}
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.3em] tabular pt-3">
              ▸ {history.length} / 10 筆(localStorage 上限 10 筆 · 自動 rotate)
            </p>
          </div>
        )}
        <FootNote>
          雲端版上線後 · 這個時間軸會 sync 到您的 ZONE 27 帳號 · 跨裝置存留 ·
          無筆數上限。離開帳號 = 失去 history(<strong className="text-bone">Loss Aversion</strong>)。
        </FootNote>
      </Section>

      {/* ── 02 · 您 follow 的賽事 + 個人 calibration record ─── */}
      <Section
        no="02"
        en="YOUR FOLLOWED MATCHES · PERSONAL CALIBRATION"
        zh="您 follow 的賽事 + 個人 calibration record"
        psychology="Collection · Loss Aversion · Status"
        kicker="預覽版 · launch 後可 follow 任何賽事 · 賽後自動算您個人的 PROVED rate"
      >
        <div className="border border-line/60 bg-slate/20 p-5 sm:p-6 space-y-4">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2">
            ▸ 預覽 · 您 follow 的賽事(尚未 auth · 顯示為 ZONE 27 公開預測)
          </p>
          <div className="border-l-2 border-gold/50 pl-4 sm:pl-5">
            <p className="font-mono text-mute text-[10px] tracking-[0.25em] mb-1">
              2026-05-21 · 18:35 · 新莊
            </p>
            <p className="text-bone text-lg">統一獅 vs 富邦悍將</p>
            <p className="font-mono text-mute text-xs tabular mt-1">
              引擎預測 · 統一獅 ~62% / 富邦 ~38%
            </p>
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mt-3">
              ▸ 賽後狀態 · PENDING(22:00 後 Tim 親手 ingest)
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-line/40">
            <CalibrationStat label="您 follow" value="1" deficit="" />
            <CalibrationStat label="PROVED ✓" value="—" deficit="" mute />
            <CalibrationStat label="DIVERGED ✕" value="—" deficit="" mute />
          </div>
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.3em] mt-2">
            ▸ 個人 PROVED rate · launch 後累積 · 您專屬的 calibration score
          </p>
        </div>
        <FootNote>
          每場 follow 過的賽事都會在賽後計入「您的 personal scorecard」 ·
          Strava activity log + GitHub contribution graph 模式 ·
          <strong className="text-bone">您自己的 trophy</strong>(Collection effect)。
        </FootNote>
      </Section>

      {/* ── 03 · 您能投票決定的引擎下一步 ─────────── */}
      <Section
        no="03"
        en="VOTE THE ENGINE FORWARD"
        zh="您能投票決定的引擎下一步"
        psychology="IKEA Effect · drag-rank"
        kicker="如果您是 ZONE 27 工程師 · 您會先做哪個?"
      >
        <RoadmapVotingPanel mounted={mounted} />
        <FootNote>
          <strong className="text-bone">這不是 marketing「我們會聽您的」</strong> ·
          是 Founders 27 / BLACK CARD 會員每月 voting 真實 input ·
          結果寫進 /roadmap LOCKED · /changelog commit 公開所有 vote tally。
          drag-rank(per Linear / PostHog 2025-2026)比 thumb-up 心理投資高 ·{" "}
          <strong className="text-bone">您排序 = 您是這引擎共同建造者</strong>
          (IKEA Effect cranked)。
        </FootNote>
      </Section>

      {/* ── 04 · LAUNCH TIMELINE · 誠實工程進度 ───── */}
      <Section
        no="04"
        en="LAUNCH TIMELINE"
        zh="這頁什麼時候真的 functional"
        psychology="Pratfall + Costly Signaling"
        kicker="現在是 preview · 不是 mock · 不是 marketing"
      >
        <TimelineRow
          label="現在 · 2026-05-21"
          status="PREVIEW"
          tone="full"
          body="您正在看的這頁是 public preview · 任何訪客可進 · 沒 auth · localStorage data 用 visitor 自己的。Pratfall surface 工程現狀 · 不假裝已 functional。"
        />
        <TimelineRow
          label="Phase 1 · 2026 Q3(預估)"
          status="AUTH + DB SYNC"
          tone="exploring"
          body="Supabase magic link 接入 · 您的 sim history + follow list 從 localStorage 同步雲端。FREE TIER 會員 / member auth 上線 · /member 變 auth-gated。"
        />
        <TimelineRow
          label="Phase 2 · 2026 Q3+(TapPay setup 後)"
          status="BLACK CARD LIVE"
          tone="exploring"
          body="TapPay 訂閱 NT$ 499/月接入 · BLACK CARD 會員可在 /matches/[gameId] 賽事頁討論室發言 / 賣明牌 / 創作者抽成 5%(per /membership Creator Permissions FAQ)。"
        />
        <TimelineRow
          label="Phase 3 · 2026 Q4+(規劃中)"
          status="ARTICLE CMS"
          tone="exploring"
          body="會員投稿系統 · 文章 CRUD + Tim 親手 curate(Stratechery Guest Post pattern)· /signal-board 部分內容由 BLACK CARD + Founders 27 會員產出。"
        />
        <FootNote>
          ZONE 27 的 product 仍在建。網站是 brand + trust artifacts + waitlist capture
          層 · member functions 是<strong className="text-bone">下一層</strong> ·
          shipping incrementally · 不一次性 big-bang launch(per
          {" "}
          <Link
            href="/manifesto"
            className="text-gold underline-offset-4 hover:underline"
          >
            /manifesto Section I DISCLOSURE
          </Link>
          )。
        </FootNote>
      </Section>

      {/* ── 近況 · 引擎 ──────────────────────────
          Agent A 2026 research Pattern #4 · Stratechery Plus + Patreon
          + GitHub release-info-in-sidebar pattern。3 dated lines · plain
          text · 不是 gamification · 不是 FOMO · 不是 streak counter ·
          是 dated facts visitor 可一眼看到「project velocity」 · 不需
          外部 Twitter / blog / changelog 跳轉。
          Mobile + desktop 同 layout · /member 沒 right-rail 所以 inline。 */}
      <section
        aria-labelledby="recent-engine-heading"
        className="border-l-2 border-gold/40 pl-4 sm:pl-5"
      >
        <p
          id="recent-engine-heading"
          lang="en"
          className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3"
        >
          / 近況 · 引擎
        </p>
        <ul className="space-y-2 text-mute text-sm list-none pl-0">
          <RecentEngineLine
            date="2026-05-21"
            body="/member NEW · Round 29 Wave 2 上線(您正在看的這頁)"
          />
          <RecentEngineLine
            date="2026-05-21"
            body="Uncertainty Stripe 上線 · HeroLiveCard + MatchSimulator(Round 28 Wave 3)"
          />
          <RecentEngineLine
            date="2026-05-21"
            body="Founders 27 開放申請預售 · NEXT IS #008 · 263 席剩"
          />
        </ul>
        <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em] mt-3 pt-3 border-t border-line/30">
          ▸ 完整 git history · /changelog · GitHub commits 為 source of truth
        </p>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────

function Section({
  no,
  en,
  zh,
  kicker,
  psychology,
  children,
}: {
  no: string;
  en: string;
  zh: string;
  kicker: string;
  psychology: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-2 flex-wrap">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {en}
        </span>
        <span
          className="font-mono text-loss/80 text-[9px] tracking-[0.25em] px-1.5 py-0.5 border border-loss/30"
          title="心理學原則 · 為什麼這個 section 存在"
        >
          ψ {psychology}
        </span>
      </div>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
        {zh}
      </h3>
      <p className="font-mono text-mute text-xs tracking-[0.25em] mb-6">
        {kicker}
      </p>
      <div className="space-y-4 text-mute text-sm sm:text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function SimHistoryRow({ entry }: { entry: SimHistoryEntry }) {
  const homeWon = entry.homePct >= entry.awayPct;
  return (
    <Link
      href={
        entry.matchId.startsWith("custom-")
          ? "/lab/custom"
          : `/matches/${entry.matchId}`
      }
      className="block border-l-2 border-gold/40 hover:border-gold pl-4 sm:pl-5 py-3 hover:bg-slate/10 transition-colors group"
    >
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
        <p className="text-bone text-base group-hover:text-gold transition-colors">
          {entry.matchupName}
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.25em] tabular">
          {relativeTime(entry.ranAt)}
        </p>
      </div>
      <div className="flex items-baseline gap-4">
        <span
          className={`font-mono text-sm tabular ${homeWon ? "text-gold" : "text-mute"}`}
        >
          {entry.homePct.toFixed(1)}%
        </span>
        <span className="font-mono text-mute/50 text-[9px] tracking-[0.3em]">
          VS
        </span>
        <span
          className={`font-mono text-sm tabular ${!homeWon ? "text-gold" : "text-mute"}`}
        >
          {entry.awayPct.toFixed(1)}%
        </span>
        <span className="font-mono text-mute/60 text-[9px] tracking-[0.25em] ml-auto">
          {entry.totalSims.toLocaleString()} sims
          {entry.isCustom && " · CUSTOM"}
        </span>
      </div>
    </Link>
  );
}

function EmptyState({
  zh,
  cta,
  hint,
}: {
  zh: string;
  cta: { label: string; href: string };
  hint: string;
}) {
  return (
    <div className="bg-slate/30 border border-line/60 p-8 text-center">
      <p className="text-mute text-base mb-4">{zh}</p>
      <Link
        href={cta.href}
        className="inline-block px-6 py-2.5 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
      >
        {cta.label}
      </Link>
      <p className="font-mono text-mute/60 text-[10px] tracking-[0.3em] mt-5 leading-relaxed">
        {hint}
      </p>
    </div>
  );
}

function RoadmapVotingPanel({ mounted }: { mounted: boolean }) {
  const [order, setOrder] = useState<string[]>(() =>
    ROADMAP_ITEMS.map((r) => r.id)
  );
  const [because, setBecause] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);
  // Round 29 Wave 7 self-audit fix: previously persist useEffect fired
  // on initial hydration setOrder/setBecause from localStorage · which
  // re-saved the just-loaded value AND flashed「✓ saved local」on page
  // mount even though user didn't change anything. hydrated flag gates
  // persist to only fire after hydration completes(user-action saves only).
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage post-mount (avoids SSR hydration mismatch).
  useEffect(() => {
    if (!mounted) return;
    const state = loadVotingState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(state.order);
    setBecause(state.because);
    setHydrated(true);
  }, [mounted]);

  // Persist whenever state changes(only AFTER hydration done · skips
  // the initial localStorage → state load that would falsely trigger
  // saved indicator).
  useEffect(() => {
    if (!hydrated) return;
    saveVotingState({ order, because });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(true);
    const t = window.setTimeout(() => setSaved(false), 1200);
    return () => window.clearTimeout(t);
  }, [order, because, hydrated]);

  // Find item by id with current position.
  const orderedItems = useMemo(() => {
    return order
      .map((id) => ROADMAP_ITEMS.find((r) => r.id === id))
      .filter((r): r is RoadmapItem => Boolean(r));
  }, [order]);

  // Move handlers respect disabled lock(disabled items can't move · also
  // a non-disabled item can't swap INTO a disabled position).
  const moveUp = useCallback(
    (idx: number) => {
      if (idx <= 0) return;
      const item = orderedItems[idx];
      const above = orderedItems[idx - 1];
      if (item.disabled || above.disabled) return;
      setOrder((prev) => {
        const next = [...prev];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      });
    },
    [orderedItems]
  );

  const moveDown = useCallback(
    (idx: number) => {
      if (idx >= orderedItems.length - 1) return;
      const item = orderedItems[idx];
      const below = orderedItems[idx + 1];
      if (item.disabled || below.disabled) return;
      setOrder((prev) => {
        const next = [...prev];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        return next;
      });
    },
    [orderedItems]
  );

  return (
    <div className="space-y-3">
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-2">
        ▸ 用 ▲▼ 按鈕排序 · 第 1 名 = 您最想引擎先做的 · 結果只存您本機 · launch 後 sync
      </p>
      {orderedItems.map((item, idx) => (
        <RankedItemRow
          key={item.id}
          item={item}
          rank={idx + 1}
          canMoveUp={
            idx > 0 && !item.disabled && !orderedItems[idx - 1].disabled
          }
          canMoveDown={
            idx < orderedItems.length - 1 &&
            !item.disabled &&
            !orderedItems[idx + 1].disabled
          }
          onMoveUp={() => moveUp(idx)}
          onMoveDown={() => moveDown(idx)}
        />
      ))}

      {/* ── BECAUSE textarea ──────────────────── */}
      <div className="mt-6 border border-line/60 bg-slate/20 p-4 sm:p-5">
        <label
          htmlFor="vote-because"
          className="font-mono text-mute/80 text-[10px] tracking-[0.3em] block mb-3"
        >
          因為 ___ <span className="text-mute/50">(optional · 一行解釋 · 1-280 字)</span>
        </label>
        <textarea
          id="vote-because"
          value={because}
          onChange={(e) => setBecause(e.target.value.slice(0, 280))}
          placeholder="例如:強打線 vs 二軍 winRate gap 是我最常 raise 的 question · 想看真實數字"
          rows={2}
          maxLength={280}
          className="w-full bg-navy/40 border border-line/40 focus:border-gold/60 px-3 py-2 text-bone text-sm font-mono leading-relaxed outline-none transition-colors placeholder:text-mute/40"
        />
        <div className="flex items-baseline justify-between mt-2 flex-wrap gap-2">
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] tabular">
            {because.length} / 280
          </p>
          <p
            className={`font-mono text-[10px] tracking-[0.3em] transition-opacity ${
              saved ? "text-gold opacity-100" : "text-mute/40 opacity-60"
            }`}
            aria-live="polite"
          >
            {saved ? "✓ saved local" : "auto-saved · localStorage"}
          </p>
        </div>
      </div>
    </div>
  );
}

function RankedItemRow({
  item,
  rank,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: {
  item: RoadmapItem;
  rank: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const isDisabled = Boolean(item.disabled);
  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 items-start border ${
        isDisabled
          ? "border-line/30 bg-slate/10"
          : "border-line/60 bg-slate/20 hover:border-gold/40 transition-colors"
      } p-4 sm:p-5`}
    >
      {/* Rank badge */}
      <div
        className={`flex flex-col items-center font-mono tabular ${
          isDisabled ? "text-mute/40" : "text-gold"
        }`}
      >
        <span className="text-[9px] tracking-[0.25em] mb-1">RANK</span>
        <span className="text-2xl leading-none">
          {isDisabled ? "—" : rank}
        </span>
      </div>

      {/* Body */}
      <div>
        <p
          className={`text-base sm:text-lg font-light tracking-tight mb-2 ${
            isDisabled ? "text-mute/70" : "text-bone"
          }`}
        >
          {item.title}
        </p>
        <p className="text-mute text-sm leading-relaxed mb-3">{item.body}</p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em]">
          投票權 · {item.tier}
        </p>
      </div>

      {/* Arrow controls */}
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label={`把「${item.title}」往上移`}
          className={`w-10 h-10 border font-mono text-xs flex items-center justify-center transition-colors ${
            canMoveUp
              ? "border-gold/40 text-gold hover:border-gold hover:bg-gold/10 cursor-pointer"
              : "border-line/30 text-mute/30 cursor-not-allowed"
          }`}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label={`把「${item.title}」往下移`}
          className={`w-10 h-10 border font-mono text-xs flex items-center justify-center transition-colors ${
            canMoveDown
              ? "border-gold/40 text-gold hover:border-gold hover:bg-gold/10 cursor-pointer"
              : "border-line/30 text-mute/30 cursor-not-allowed"
          }`}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

function CalibrationStat({
  label,
  value,
  deficit,
  mute,
}: {
  label: string;
  value: string;
  deficit: string;
  mute?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={`font-mono text-[10px] tracking-[0.3em] mb-1 ${mute ? "text-mute/60" : "text-mute"}`}
      >
        {label}
      </p>
      <p
        className={`font-mono tabular text-2xl ${mute ? "text-mute/60" : "text-bone"}`}
      >
        {value}
      </p>
      {deficit && (
        <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mt-1">
          {deficit}
        </p>
      )}
    </div>
  );
}

function TimelineRow({
  label,
  status,
  tone,
  body,
}: {
  label: string;
  status: string;
  tone: "full" | "exploring";
  body: string;
}) {
  const labelColor = tone === "full" ? "text-gold" : "text-gold/50";
  const statusColor =
    tone === "full" ? "border-gold text-gold" : "border-gold/40 text-gold/60";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 py-4 border-b border-line/30 last:border-b-0">
      <div>
        <p
          className={`font-mono ${labelColor} text-[10px] tracking-[0.3em] mb-1`}
        >
          {label}
        </p>
        <span
          className={`inline-block font-mono text-[9px] tracking-[0.25em] px-1.5 py-0.5 border ${statusColor}`}
        >
          {status}
        </span>
      </div>
      <p className="text-mute text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function FootNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-mute/60 text-[10px] tracking-[0.3em] leading-relaxed mt-4 pt-3 border-t border-line/30">
      ▸ {children}
    </p>
  );
}

function RecentEngineLine({ date, body }: { date: string; body: string }) {
  return (
    <li className="flex items-baseline gap-3 leading-relaxed">
      <span
        lang="en"
        className="font-mono text-gold/60 text-[10px] tracking-[0.25em] tabular shrink-0"
      >
        {date}
      </span>
      <span className="flex-1 text-mute">{body}</span>
    </li>
  );
}
