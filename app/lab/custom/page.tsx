"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import RecentSims from "@/components/RecentSims";
import EngineFreeBrandBlock from "@/components/EngineFreeBrandBlock";
import type { Match, PitcherStats, TeamSide } from "@/lib/matches";

// ── ZONE 27 · /lab/custom · Power User Mode ────────────
// 自訂任意兩位投手的 K/9 · BB/9 · HR/9,構造合成 Match
// 物件丟給 MatchSimulator 跑 10,000 場 + REPLAY。
// 證明引擎不是只能跑 Tim 親手 ingest 的 CPBL 比賽,而是可以模擬
// 任何合法投手組合。
// ─────────────────────────────────────────────────────

type PitcherInput = {
  name: string;
  k9: string;
  bb9: string;
  hr9: string;
};

const DEFAULT_HOME: PitcherInput = {
  name: "Home Ace",
  k9: "9.0",
  bb9: "2.5",
  hr9: "0.8",
};

const DEFAULT_AWAY: PitcherInput = {
  name: "Away Ace",
  k9: "8.5",
  bb9: "3.0",
  hr9: "1.0",
};

type Preset = {
  label: string;
  zh: string;
  home: PitcherInput;
  away: PitcherInput;
};

const PRESETS: Preset[] = [
  {
    label: "FLAMETHROWER vs CONTACT",
    zh: "三振王 對 控球派",
    home: { name: "Flamethrower", k9: "12.0", bb9: "4.0", hr9: "0.8" },
    away: { name: "Contact Pitcher", k9: "6.0", bb9: "2.0", hr9: "1.0" },
  },
  {
    label: "STAR vs ROOKIE",
    zh: "球星 對 菜鳥",
    home: { name: "Veteran Star", k9: "10.0", bb9: "2.0", hr9: "0.6" },
    away: { name: "Rookie Call-up", k9: "7.5", bb9: "3.5", hr9: "1.4" },
  },
  {
    label: "ACE DUEL",
    zh: "雙王牌對決",
    home: { name: "Ace 1", k9: "10.0", bb9: "2.0", hr9: "0.6" },
    away: { name: "Ace 2", k9: "10.0", bb9: "2.0", hr9: "0.6" },
  },
  {
    label: "MIDDLE OF PACK",
    zh: "中段班雙方",
    home: { name: "Average Starter", k9: "8.5", bb9: "3.0", hr9: "1.0" },
    away: { name: "Average Starter", k9: "8.5", bb9: "3.0", hr9: "1.0" },
  },
];

// Build a synthetic Match object from custom inputs
function buildCustomMatch(home: PitcherInput, away: PitcherInput): Match {
  const homePitcher: PitcherStats = {
    name: home.name || "Home Pitcher",
    era: "—",
    k9: home.k9,
    whip: "—",
    bb9: home.bb9,
    hr9: home.hr9,
  };
  const awayPitcher: PitcherStats = {
    name: away.name || "Away Pitcher",
    era: "—",
    k9: away.k9,
    whip: "—",
    bb9: away.bb9,
    hr9: away.hr9,
  };

  const homeSide: TeamSide = {
    name: "HOME TEAM",
    en: "HOME",
    pitcher: homePitcher,
    recent: ["W", "L", "W", "L", "W"],
    winRate: 50, // placeholder; the engine produces the real one
  };
  const awaySide: TeamSide = {
    name: "AWAY TEAM",
    en: "AWAY",
    pitcher: awayPitcher,
    recent: ["L", "W", "L", "W", "L"],
    winRate: 50,
  };

  return {
    id: `custom-${Date.now()}`,
    league: "CPBL",
    date: "Custom Simulation",
    startTime: "—",
    venue: "Synthetic Matchup",
    home: homeSide,
    away: awaySide,
    topScores: [],
    aiConfidence: 0,
  };
}

// Wrap the page in Suspense so useSearchParams works in production
export default function CustomLabPage() {
  return (
    <Suspense fallback={null}>
      <CustomLabInner />
    </Suspense>
  );
}

function CustomLabInner() {
  const params = useSearchParams();

  // Read URL params once on mount, fall back to defaults
  const initialHome: PitcherInput = {
    name: params.get("h_name") ?? DEFAULT_HOME.name,
    k9: params.get("h_k9") ?? DEFAULT_HOME.k9,
    bb9: params.get("h_bb9") ?? DEFAULT_HOME.bb9,
    hr9: params.get("h_hr9") ?? DEFAULT_HOME.hr9,
  };
  const initialAway: PitcherInput = {
    name: params.get("a_name") ?? DEFAULT_AWAY.name,
    k9: params.get("a_k9") ?? DEFAULT_AWAY.k9,
    bb9: params.get("a_bb9") ?? DEFAULT_AWAY.bb9,
    hr9: params.get("a_hr9") ?? DEFAULT_AWAY.hr9,
  };
  const arrivedWithParams = params.toString().length > 0;

  const [home, setHome] = useState<PitcherInput>(initialHome);
  const [away, setAway] = useState<PitcherInput>(initialAway);
  // If user arrived with URL params, auto-build on mount so they see the
  // simulator immediately without pressing the button. Lazy init pattern —
  // no useEffect needed.
  const [builtMatch, setBuiltMatch] = useState<Match | null>(() =>
    arrivedWithParams ? buildCustomMatch(initialHome, initialAway) : null
  );
  const [copied, setCopied] = useState(false);

  function applyPreset(p: Preset) {
    setHome(p.home);
    setAway(p.away);
    setBuiltMatch(null);
  }

  function build() {
    setBuiltMatch(buildCustomMatch(home, away));
  }

  function reset() {
    setHome(DEFAULT_HOME);
    setAway(DEFAULT_AWAY);
    setBuiltMatch(null);
    setCopied(false);
  }

  async function copyShareLink() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.origin + "/lab/custom");
    url.searchParams.set("h_name", home.name);
    url.searchParams.set("h_k9", home.k9);
    url.searchParams.set("h_bb9", home.bb9);
    url.searchParams.set("h_hr9", home.hr9);
    url.searchParams.set("a_name", away.name);
    url.searchParams.set("a_k9", away.k9);
    url.searchParams.set("a_bb9", away.bb9);
    url.searchParams.set("a_hr9", away.hr9);

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers / iframes — fallback select
      prompt("Copy this link:", url.toString());
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="lab" />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.35em]">
          <span className="text-gold">即時 AI 實驗室</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            自訂模式
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          自己當
          <span className="text-gold">總教練</span>
          。
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed text-base">
          輸入任何兩位投手的 K/9 · BB/9 · HR/9,
          引擎會即時構造一場完整虛擬比賽。
          想看「3000 三振王」對上「火球菜鳥」的勝率分布?
          一鍵就跑。
        </p>

        {/* Pre-emptive trust artifact #1: WHY PITCHERS ONLY?
            The interface asks only for pitcher stats. Visitors silently
            wonder "where's the hitter input?" — answering that here
            (instead of burying it in /audit) prevents the doubt from
            becoming a conversion drag. */}
        <div className="mt-10 max-w-xl mx-auto pt-6 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold/80 text-[10px] tracking-[0.38em] mb-3"
          >
            WHY PITCHERS ONLY · 為什麼只看投手?
          </p>
          <p className="text-mute text-sm leading-relaxed mb-3">
            sabermetric 累積研究(Bill James 1985 起始 ·
            Tango/Lichtman/Dolphin 2007 THE BOOK 系統化)指出 ——
            短期棒球比賽方差,
            <span className="text-bone font-medium">投手品質佔最大宗(估 ~50-60%)</span>,
            其他(打者、守備、場、氣、審)合計 40-50%。
          </p>
          <p className="text-mute text-sm leading-relaxed">
            ZONE 27 對最大宗那部分做
            <span className="text-bone font-medium">精準計算</span>,
            不是對 100% 做
            <span className="text-bone font-medium">不準計算</span>。
            加入打者 = 模型複雜度 ×3 + 錯誤 bar 從 ±1% 放大到 ±5% —
            雜訊吃掉訊號。少做,做好 →{" "}
            <Link
              href="/audit"
              className="text-gold hover:text-gold-soft transition-colors"
            >
              /audit Section 03 完整 10 項排除清單
            </Link>
          </p>
        </div>

        {/* Pre-emptive trust artifact #2: shared engine-free brand block.
            Same component is used on /lab so the message appears at the
            engine entry point too — visitors who land here via deep link
            still see it. Algorithm Step 3 SIMPLIFY: one source of truth. */}
        <EngineFreeBrandBlock />
      </section>

      {/* ── PRESETS ──────────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-8">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / 01 · 快速範本
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left p-4 border border-line/60 text-mute hover:border-gold/40 hover:text-bone transition-colors"
            >
              <p className="font-mono text-[9px] text-gold/70 tracking-[0.25em] mb-2">
                {p.label}
              </p>
              <p className="text-bone text-sm font-light">{p.zh}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── INPUT FORM ───────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-8">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / 02 · 投手數據
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <PitcherForm
            side="HOME"
            data={home}
            onChange={setHome}
            disabled={builtMatch !== null}
          />
          <PitcherForm
            side="AWAY"
            data={away}
            onChange={setAway}
            disabled={builtMatch !== null}
          />
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={build}
            disabled={builtMatch !== null}
            className={`flex-1 min-w-[200px] py-4 text-xs tracking-[0.3em] font-medium transition-colors ${
              builtMatch
                ? "bg-gold/30 text-navy/60 cursor-not-allowed"
                : "bg-gold text-navy hover:bg-gold-soft"
            }`}
          >
            {builtMatch ? "已建立比賽" : "▶ 建立比賽並開始模擬"}
          </button>
          {builtMatch && (
            <button
              type="button"
              onClick={reset}
              className="px-6 py-4 border border-line/60 text-mute hover:border-gold/40 hover:text-gold text-xs tracking-[0.3em] transition-colors"
            >
              重置
            </button>
          )}
        </div>
      </section>

      {/* ── THE SIMULATOR + SHARE ────────────────── */}
      {builtMatch && (
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-6">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
              / 03 · 您的模擬
            </p>
            <button
              type="button"
              onClick={copyShareLink}
              className={`px-5 py-2.5 font-mono text-[10px] tracking-[0.3em] transition-colors border ${
                copied
                  ? "border-gold bg-gold text-navy"
                  : "border-gold/40 text-gold hover:bg-gold/10"
              }`}
              aria-label="Copy a shareable link to this scenario"
            >
              {copied ? "✓ 已複製" : "🔗 複製分享連結"}
            </button>
          </div>
          <MatchSimulator key={builtMatch.id} match={builtMatch} />
        </section>
      )}

      {/* ── RECENT SIMS (local history) ──────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10">
        <RecentSims />
      </section>

      {/* ── BACK + ROADMAP NOTE ──────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          進階模式 · ENGINE v0.2
        </p>
        <p className="text-mute text-sm max-w-md mx-auto leading-relaxed">
          目前自訂模式只接受投手 K/9 · BB/9 · HR/9 三項。
          v0.3 計畫加入打者個別 OPS / wRC+ · v0.5 模型先發換投與牛棚切換。
          路線圖屬於計畫 · 非承諾,詳見{" "}
          <Link
            href="/methodology"
            className="text-gold underline-offset-4 hover:underline"
          >
            /methodology
          </Link>
          。
        </p>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            href="/lab"
            className="px-6 py-2.5 border border-gold/40 text-gold text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
          >
            ← 回到預設比賽
          </Link>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── PitcherForm sub-component ──────────────────────────
function PitcherForm({
  side,
  data,
  onChange,
  disabled,
}: {
  side: "HOME" | "AWAY";
  data: PitcherInput;
  onChange: (p: PitcherInput) => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-slate/60 border border-line/70 p-6">
      <p className="font-mono text-gold text-[10px] tracking-[0.35em] mb-5">
        {side === "HOME" ? "主隊投手" : "客隊投手"}
      </p>

      <label className="block mb-4">
        <span className="font-mono text-mute text-[9px] tracking-[0.3em] block mb-1.5">
          姓名
        </span>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          disabled={disabled}
          maxLength={30}
          className="w-full bg-ink/60 border border-line/70 focus:border-gold/70 disabled:opacity-50 text-bone px-3 py-2.5 outline-none transition-colors font-mono text-sm"
        />
      </label>

      <div className="grid grid-cols-3 gap-3">
        <NumberField
          label="K / 9"
          value={data.k9}
          onChange={(v) => onChange({ ...data, k9: v })}
          disabled={disabled}
          min={0}
          max={20}
          step={0.1}
        />
        <NumberField
          label="BB / 9"
          value={data.bb9}
          onChange={(v) => onChange({ ...data, bb9: v })}
          disabled={disabled}
          min={0}
          max={10}
          step={0.1}
        />
        <NumberField
          label="HR / 9"
          value={data.hr9}
          onChange={(v) => onChange({ ...data, hr9: v })}
          disabled={disabled}
          min={0}
          max={5}
          step={0.1}
        />
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  disabled,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-mute text-[9px] tracking-[0.3em] block mb-1.5">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="w-full bg-ink/60 border border-line/70 focus:border-gold/70 disabled:opacity-50 text-bone px-2 py-2.5 outline-none transition-colors font-mono text-sm tabular text-center"
      />
    </label>
  );
}
