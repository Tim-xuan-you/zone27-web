"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import type { Match, PitcherStats, TeamSide } from "@/lib/matches";

// ── ZONE 27 · /lab/custom · Power User Mode ────────────
// 自訂任意兩位投手的 K/9 · BB/9 · HR/9,構造合成 Match
// 物件丟給 MatchSimulator 跑 10,000 場 + REPLAY。
// 證明引擎不是只能跑 hardcoded 3 場 CPBL 比賽,而是可以模擬
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
  const [home, setHome] = useState<PitcherInput>(() => ({
    name: params.get("h_name") ?? DEFAULT_HOME.name,
    k9: params.get("h_k9") ?? DEFAULT_HOME.k9,
    bb9: params.get("h_bb9") ?? DEFAULT_HOME.bb9,
    hr9: params.get("h_hr9") ?? DEFAULT_HOME.hr9,
  }));
  const [away, setAway] = useState<PitcherInput>(() => ({
    name: params.get("a_name") ?? DEFAULT_AWAY.name,
    k9: params.get("a_k9") ?? DEFAULT_AWAY.k9,
    bb9: params.get("a_bb9") ?? DEFAULT_AWAY.bb9,
    hr9: params.get("a_hr9") ?? DEFAULT_AWAY.hr9,
  }));
  const [builtMatch, setBuiltMatch] = useState<Match | null>(null);
  const [copied, setCopied] = useState(false);

  // If user arrived with URL params, auto-build immediately so they
  // see the simulator without needing to press the button
  useEffect(() => {
    if (params.toString().length > 0 && !builtMatch) {
      setBuiltMatch(buildCustomMatch(home, away));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.35em]">
          <span className="text-gold">LIVE AI LABORATORY</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            CUSTOM MODE
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
      </section>

      {/* ── PRESETS ──────────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-8">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
          / 01 · QUICK PRESETS
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
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
          / 02 · PITCHER STATS
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
            onClick={build}
            disabled={builtMatch !== null}
            className={`flex-1 min-w-[200px] py-4 text-xs tracking-[0.3em] font-medium transition-colors ${
              builtMatch
                ? "bg-gold/30 text-navy/60 cursor-not-allowed"
                : "bg-gold text-navy hover:bg-gold-soft"
            }`}
          >
            {builtMatch ? "MATCH BUILT" : "▶ BUILD & SIMULATE"}
          </button>
          {builtMatch && (
            <button
              onClick={reset}
              className="px-6 py-4 border border-line/60 text-mute hover:border-gold/40 hover:text-gold text-xs tracking-[0.3em] transition-colors"
            >
              RESET
            </button>
          )}
        </div>
      </section>

      {/* ── THE SIMULATOR + SHARE ────────────────── */}
      {builtMatch && (
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-6">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
              / 03 · YOUR SIMULATION
            </p>
            <button
              onClick={copyShareLink}
              className={`px-5 py-2.5 font-mono text-[10px] tracking-[0.3em] transition-colors border ${
                copied
                  ? "border-gold bg-gold text-navy"
                  : "border-gold/40 text-gold hover:bg-gold/10"
              }`}
              aria-label="Copy a shareable link to this scenario"
            >
              {copied ? "✓ COPIED" : "🔗 COPY SCENARIO LINK"}
            </button>
          </div>
          <MatchSimulator key={builtMatch.id} match={builtMatch} />
        </section>
      )}

      {/* ── BACK + ROADMAP NOTE ──────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          POWER USER MODE · v0.16
        </p>
        <p className="text-mute text-sm max-w-md mx-auto leading-relaxed">
          目前自訂模式只接受投手 K/9 · BB/9 · HR/9 三項。
          v0.4 路線圖將開放打者個別 OPS、左右打對左右投拆解、Trackman 球速。
          詳見{" "}
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
            ← BACK TO PRESET LAB
          </Link>
        </div>
      </section>

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
        {side} PITCHER
      </p>

      <label className="block mb-4">
        <span className="font-mono text-mute text-[9px] tracking-[0.3em] block mb-1.5">
          NAME
        </span>
        <input
          type="text"
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
