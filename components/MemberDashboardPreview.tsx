"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getSimHistory,
  relativeTime,
  type SimHistoryEntry,
} from "@/lib/sim-history";

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
  // Mount flag for SSR hydration safety · single setState in useEffect
  // (acceptable pattern per React docs for one-time mount transitions ·
  // alternative is useSyncExternalStore but localStorage doesn't emit
  // change events so subscribe would be noop).
  const [mounted, setMounted] = useState(false);

  // One-time mount transition for SSR-safe localStorage access.
  // useSyncExternalStore would be the lint-preferred alternative but
  // localStorage doesn't emit same-window change events · subscribe would
  // be a noop · and getSnapshot returning a new array each render would
  // cause Object.is comparison thrash. Mount flag pattern is the
  // canonical approach for SSR-safe browser-API access per React docs.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Derive history from mounted state · only reads localStorage post-mount ·
  // avoids hydration mismatch on initial render.
  const history = useMemo<SimHistoryEntry[]>(
    () => (mounted ? getSimHistory() : []),
    [mounted]
  );

  // SSR fallback — show "what your dashboard will contain" generic version
  // Mounted state guards localStorage access for hydration safety.
  if (!mounted) {
    return (
      <div className="font-mono text-mute/60 text-[10px] tracking-[0.3em] tabular py-12 text-center">
        ▸ 載入您的本地引擎時間軸 ...
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* ── 01 · 您的引擎時間軸 ───────────────────── */}
      <Section
        no="01"
        en="YOUR ENGINE TIMELINE"
        zh="您的引擎時間軸"
        psychology="Endowment Effect"
        kicker="您在 /lab + /lab/custom 跑過的所有 Monte Carlo 收斂"
      >
        {history.length === 0 ? (
          <EmptyState
            zh="您還沒跑過任何 sim · 去 /lab 跑一場"
            cta={{ label: "→ 去 /lab 跑一場", href: "/lab" }}
            hint="跑完一場 · 這裡會自動長一筆。10K Monte Carlo 在您瀏覽器跑完 · localStorage 保留 10 筆歷史。"
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
        psychology="IKEA Effect"
        kicker="從 /roadmap EXPLORING 區拉出來 · BLACK CARD + Founders 27 會員投票決定 priority"
      >
        <div className="space-y-3">
          <VoteRow
            title="v0.3 · 加入球場因素 (park factor)"
            body="目前所有球場用聯盟均值 · 加入 park factor 後 · 統一桃園 vs 統一新莊 主場優勢會有真實 home/away winRate 影響。"
            tier="BLACK CARD + Founders 27"
          />
          <VoteRow
            title="v0.3 · 加入打者個別品質 (隊伍 wOBA)"
            body="目前所有打者假設聯盟平均 · 加入隊伍 wOBA 後 · 強打線 vs 二軍 winRate gap 會反映真實。"
            tier="BLACK CARD + Founders 27"
          />
          <VoteRow
            title="v0.4 · 球速 + 轉軸物理 (待 CPBL 公開 Statcast)"
            body="aspirational · 等 CPBL 開始公開 PA 級 K/BB + EV/LA 等 Statcast 資料 · 我們才接得上去。"
            tier="尚未開放投票 · 等資料就緒"
            disabled
          />
        </div>
        <FootNote>
          <strong className="text-bone">這不是 marketing「我們會聽您的」</strong> ·
          是 Founders 27 / BLACK CARD 會員每月 voting 真實 input ·
          結果寫進 /roadmap LOCKED · /changelog commit 公開所有 vote tally。
          <strong className="text-bone">您投票 = 您是這引擎共同建造者</strong>(IKEA Effect)。
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

function VoteRow({
  title,
  body,
  tier,
  disabled,
}: {
  title: string;
  body: string;
  tier: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`border ${disabled ? "border-line/30 bg-slate/10" : "border-line/60 bg-slate/20"} p-4 sm:p-5`}
    >
      <p
        className={`text-base sm:text-lg ${disabled ? "text-mute/70" : "text-bone"} font-light tracking-tight mb-2`}
      >
        {title}
      </p>
      <p className="text-mute text-sm leading-relaxed mb-3">{body}</p>
      <div className="flex items-baseline justify-between flex-wrap gap-3 pt-3 border-t border-line/30">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em]">
          投票權 · {tier}
        </p>
        <button
          type="button"
          disabled
          className={`font-mono text-[10px] tracking-[0.3em] px-3 py-1.5 border ${
            disabled
              ? "border-mute/30 text-mute/40 cursor-not-allowed"
              : "border-gold/30 text-gold/60 cursor-not-allowed"
          }`}
          title="voting 待 BLACK CARD 上線後啟用 · 目前是 preview"
        >
          {disabled ? "等資料" : "投票中(尚未啟用)"}
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
