"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getMyMmaPrediction,
  getMmaTally,
  submitMmaPrediction,
  setMmaConfidence,
  setMmaRationale,
  crowdPercents,
  MMA_CROWD_MIN,
  type MmaPick,
  type MmaTally,
} from "@/lib/mma/predictions";
import ConfidencePicker from "@/components/ConfidencePicker";
import RationalePicker from "@/components/RationalePicker";

// ── ZONE 27 · MMA 兩向押注條(A 勝 / B 勝)──────────────────────────────────────
// 押了不可改(先鎖後結)· 登入才能押 · 開賽後鎖手。 純精神預測 = 遊戲 · 0 金額。 賽後自動掛
// 準/不準進你的 UFC 準度(跟棒球/足球/網球/羽球分開算)。 守暗金:選中上金 · 其餘 mute · 無紅綠。
// 樂觀 UI:點下即翻「已鎖」· server 確認前只說「鎖定中…」。 鏡 BadmintonBetStrip / TennisBetStrip。
// ─────────────────────────────────────────────────────

type State = "loading" | "anon" | "open" | "picked" | "started";

function startedAt(startISO: string): boolean {
  const t = Date.parse(startISO);
  return !Number.isNaN(t) && t <= Date.now();
}

export default function MmaBetStrip({
  matchId,
  startISO,
  aLabel,
  bLabel,
  returnTo = "/mma",
}: {
  matchId: string;
  startISO: string;
  aLabel: string;
  bLabel: string;
  returnTo?: string;
}) {
  const [state, setState] = useState<State>("loading");
  const [pick, setPick] = useState<MmaPick | null>(null);
  const [tally, setTally] = useState<MmaTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [kickedOff, setKickedOff] = useState(false);
  const [pending, setPending] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [justPicked, setJustPicked] = useState(false);

  useEffect(() => {
    const t = Date.parse(startISO);
    if (Number.isNaN(t)) return;
    const ms = t - Date.now();
    if (ms > 24 * 3600 * 1000) return;
    const id = setTimeout(() => setKickedOff(true), Math.max(ms, 0));
    return () => clearTimeout(id);
  }, [startISO]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const startedNow = startedAt(startISO);
      getMmaTally(matchId).then((t) => {
        if (!cancelled) setTally(t);
      });
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          setState(startedNow ? "started" : "anon");
          return;
        }
        const mine = await getMyMmaPrediction(matchId);
        if (cancelled) return;
        if (mine) {
          setPick(mine);
          setState("picked");
        } else {
          setState(startedNow ? "started" : "open");
        }
      } catch {
        if (!cancelled) setState(startedNow ? "started" : "anon");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, startISO]);

  const choose = async (p: MmaPick) => {
    if (saving) return;
    if (startedAt(startISO)) {
      setKickedOff(true);
      setState("started");
      return;
    }
    const prev = state;
    setErrMsg(null);
    setPick(p);
    setState("picked");
    setPending(true);
    setSaving(true);
    const res = await submitMmaPrediction(matchId, p);
    if (res.ok) {
      setPending(false);
      setJustPicked(true);
      getMmaTally(matchId).then(setTally);
    } else if (res.reason === "already_predicted") {
      const mine = await getMyMmaPrediction(matchId);
      if (mine) setPick(mine);
      setPending(false);
      getMmaTally(matchId).then(setTally);
    } else if (res.reason === "not_logged_in") {
      setPick(null);
      setPending(false);
      setState("anon");
    } else {
      setPick(null);
      setPending(false);
      setState(prev === "picked" ? "open" : prev);
      setErrMsg("沒鎖成功 · 再試一次");
    }
    setSaving(false);
  };

  const displayState: State =
    state === "picked"
      ? "picked"
      : kickedOff && (state === "open" || state === "anon")
        ? "started"
        : state;

  const pickLabel = (p: MmaPick) => (p === "a" ? aLabel : bLabel);

  return (
    <div className="mt-3 pt-2.5 border-t border-line/40">
      <div role="status" aria-live="polite" className="sr-only">
        {displayState === "picked" && pick && !pending
          ? `賽前鎖定 · 你押了 ${pickLabel(pick)} · 刪不掉`
          : ""}
      </div>
      {displayState === "loading" && (
        <p className="font-mono text-mute/40 text-[9px] tracking-[0.3em]">···</p>
      )}

      {displayState === "anon" && (
        <Link
          href={`/login?next=${encodeURIComponent(`${returnTo}#m-${matchId}`)}`}
          className="flex items-center justify-between gap-2 border border-gold/40 px-3 py-2.5 min-h-[44px] hover:border-gold/70 hover:bg-gold/5 transition-colors group"
        >
          <span className="font-mono text-gold/75 text-[11px] tracking-[0.15em]">
            ▸ 登入就能押這場(免費 · 押了鎖死、賽後對帳)
          </span>
          <span className="font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em] shrink-0">
            登入 →
          </span>
        </Link>
      )}

      {(displayState === "open" || displayState === "started") && (
        <>
          <p
            className={`font-mono text-[10px] tracking-[0.2em] mb-1.5 ${
              displayState === "started" ? "text-mute/60" : "text-gold/80"
            }`}
          >
            {displayState === "started" ? "已開賽 · 封盤 · 押注賽前才收" : "你押哪邊贏?(押了不可改)"}
          </p>
          <div className="flex items-stretch gap-1.5">
            <BetBtn
              label={`看好 ${aLabel.slice(0, 7)}`}
              disabled={displayState === "started" || saving}
              onClick={() => choose("a")}
            />
            <BetBtn
              label={`看好 ${bLabel.slice(0, 7)}`}
              disabled={displayState === "started" || saving}
              onClick={() => choose("b")}
            />
          </div>
          <p className="mt-1.5 font-mono text-mute/55 text-[9px] tracking-[0.12em] leading-snug">
            以該場勝負對帳 · 和局 / 無效比賽不計任何一方
          </p>
          {errMsg && (
            <p role="alert" className="mt-1.5 font-mono text-loss/80 text-[9px] tracking-[0.15em]">
              {errMsg}
            </p>
          )}
        </>
      )}

      {displayState === "picked" && pick && (
        <div className="enter-fade-up border border-gold/40 bg-gold/5 px-3 py-2.5">
          <p className="font-mono text-mute/55 text-[8px] tracking-[0.3em] mb-1">
            {pending ? "鎖定中…" : "✓ 賽前鎖定 · 刪不掉"}
          </p>
          <p className="text-gold text-sm sm:text-base font-light tracking-tight leading-none">
            你押了 {pickLabel(pick)}
          </p>
          {!pending && justPicked && (
            <>
              <ConfidencePicker matchId={matchId} submit={setMmaConfidence} />
              <RationalePicker matchId={matchId} submit={setMmaRationale} />
            </>
          )}
          {!pending && (
            <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
              <span className="font-mono text-mute/55 text-[9px] tracking-[0.15em]">
                賽後逐場對帳 · 連輸的都留著
              </span>
              <Link
                href="/member"
                className="font-mono text-gold/70 hover:text-gold text-[9px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors shrink-0"
              >
                進你的帳本 →
              </Link>
            </div>
          )}
        </div>
      )}

      <CrowdLine tally={tally} aLabel={aLabel} bLabel={bLabel} state={displayState} />
    </div>
  );
}

function BetBtn({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 px-2 py-2.5 min-h-[40px] font-mono text-[10px] tracking-[0.1em] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {label}
    </button>
  );
}

function CrowdLine({
  tally,
  aLabel,
  bLabel,
  state,
}: {
  tally: MmaTally | null;
  aLabel: string;
  bLabel: string;
  state: State;
}) {
  if (!tally || tally.total === 0) {
    if (state === "open") {
      return (
        <p className="mt-2 font-mono text-gold/70 text-[9px] tracking-[0.2em]">
          群眾市場 · 還沒人押這場 · 第一手是你的 ▸
        </p>
      );
    }
    return null;
  }
  if (tally.total < MMA_CROWD_MIN) {
    return (
      <p className="mt-2 font-mono text-mute/45 text-[9px] tracking-[0.15em]">
        {tally.total} 人押了 · 滿 {MMA_CROWD_MIN} 人才畫群眾市場線 —— 不拿幾個人假裝是大盤
      </p>
    );
  }
  const p = crowdPercents(tally);
  return (
    <p className="mt-2 font-mono text-mute/55 text-[9px] tracking-[0.12em] tabular">
      群眾:{aLabel.slice(0, 6)} {p.a}% · {bLabel.slice(0, 6)} {p.b}%{" "}
      <span className="text-mute/40">({tally.total} 人)</span>
    </p>
  );
}
