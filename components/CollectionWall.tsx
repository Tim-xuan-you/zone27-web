"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { getMyPredictionsClient } from "@/lib/predictions-market";
import { isLatePick } from "@/lib/predictions";
import { getMySoccerPicks } from "@/lib/soccer/predictions";

// ── ZONE 27 · 戰功卡收藏牆(個人 · 含輸)─────────────────────────────────
// soul-roadmap 願景3 ·「把誠實做成遊戲」北極星最純的落地:收的不是中獎彩券,是
// 「賽前鎖死、改不了、偽造不了」的單場收據。 一場結算 = 一張刪不掉的戰功卡。
//
// 🔴 紅線:
//   · 只讀展示物 · 0 交易/0 鑄幣/0 二級市場/0「市值·估價·出售」字眼 —— 稀缺在「買不到、
//     改不了」(賽前鎖定時戳=我們的 Topps Now 印量鎖死),不在限量轉售。 絕不變 NFT。
//   · 收「自己的 call」非球員(卡面是你的押注 + 鎖定時戳,無球員肖像)。
//   · 含輸照掛 —— ✕落空跟 ✓命中同視覺重量、同字級(Pratfall),絕不自動只選贏。
//   · 「逆風」徽章=你押了引擎沒看好的那邊、而且你對了(贏過機器=有眼光的證明),非連勝。
//   · 先鎖後結:開賽後才補登的(isLatePick)不算進收藏(同戰績剔除)。
//   · 暗金 · 無紅綠(✕用既有收據色 text-loss 非號誌紅)· render 無 emoji(✓/✕ 例外)· 純中文。
//   · 本人 picks 用 session client 端讀(不破頁面 ISR)· 沒已結算 / 未登入 → graceful 空狀態。
// ─────────────────────────────────────────────────────

export type SettledCard = {
  /** matchId(cpbl-* / mlb-* / fd-*)· 連到既有 /receipts/[receiptId] */
  id: string;
  sport: "baseball" | "soccer";
  /** 聯賽 / 賽事顯示標(CPBL / MLB / 世界盃) */
  tag: string;
  home: string;
  away: string;
  homeGlyph?: string;
  homeColor?: string;
  awayGlyph?: string;
  awayColor?: string;
  /** 賽後真實結果 · 棒球 home/away/tie · 足球 home/draw/away */
  result: "home" | "away" | "draw" | "tie";
  /** 開賽 ISO · 先鎖後結 late-pick 剔除 */
  startISO: string;
  /** 賽事日(台北 MM/DD · server 預格式 deterministic) */
  dateLabel: string;
  /** 引擎當初看好邊 · 給「逆風」徽章(你押了引擎沒看好的邊且贏) */
  engineFav: "home" | "away" | "draw" | null;
};

type Trophy = {
  card: SettledCard;
  pick: "home" | "away" | "draw";
  ts: string;
  hit: boolean;
  upset: boolean; // 贏過引擎(押了引擎沒看好的邊且命中)
};

function fmtLockTaipei(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  try {
    return new Intl.DateTimeFormat("zh-Hant", {
      timeZone: "Asia/Taipei",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(t));
  } catch {
    return "";
  }
}

export default function CollectionWall({ settled }: { settled: SettledCard[] }) {
  const [ready, setReady] = useState(false);
  const [trophies, setTrophies] = useState<Trophy[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const byId = new Map(settled.map((c) => [c.id, c]));
      const out: Trophy[] = [];

      // 棒球(cpbl-* / mlb-*)· getMyPredictionsClient 已排除 fd-*
      const bb = await getMyPredictionsClient();
      for (const [matchId, entry] of Object.entries(bb)) {
        const card = byId.get(matchId);
        if (!card) continue; // 還沒結算 / 不在收藏
        if (isLatePick(entry.ts, card.startISO)) continue; // 開賽後補登不算
        const pick = entry.pick;
        if (pick !== "home" && pick !== "away") continue; // 棒球只認 home/away
        const hit = pick === card.result;
        out.push({
          card,
          pick,
          ts: entry.ts,
          hit,
          upset: hit && card.engineFav !== null && pick !== card.engineFav,
        });
      }

      // 足球(fd-*)· 三向 · 押和+結果和=命中
      const sc = await getMySoccerPicks();
      for (const row of sc) {
        const card = byId.get(row.matchId);
        if (!card) continue;
        const t = Date.parse(row.ts);
        const k = Date.parse(card.startISO);
        if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) continue; // late-pick 剔除
        const hit = row.pick === card.result;
        out.push({
          card,
          pick: row.pick,
          ts: row.ts,
          hit,
          upset: hit && card.engineFav !== null && row.pick !== card.engineFav,
        });
      }

      // 最近結算的排前面(賽事日新→舊)
      out.sort((a, b) => (b.card.startISO || "").localeCompare(a.card.startISO || ""));
      if (alive) {
        setTrophies(out);
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [settled]);

  if (!ready) {
    return (
      <p className="font-mono text-mute/40 text-[10px] tracking-[0.3em]">··· 載入你的收藏</p>
    );
  }

  if (trophies.length === 0) {
    return (
      <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
        <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          你的戰功卡牆,還是空的。
        </p>
        <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
          押一手、賽前鎖死 —— 那一場結算後,你鎖死的這手就變成第一張
          <span className="text-bone">刪不掉、改不了</span>的戰功卡。 含輸照收,因為
          <span className="text-gold">敢留輸的</span>,本身就是別人偽造不了的東西。
        </p>
        <Link
          href="/matches"
          className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
        >
          去押第一手 →
        </Link>
      </div>
    );
  }

  const hits = trophies.filter((t) => t.hit).length;
  const misses = trophies.length - hits;
  const upsets = trophies.filter((t) => t.upset).length;

  return (
    <div>
      {/* 收藏總覽 · 含輸 · 逆風贏過引擎 = 最稀有(有眼光的證明) */}
      <p className="text-mute/90 text-sm leading-relaxed mb-4">
        <span className="font-mono text-bone tabular">{trophies.length}</span> 張戰功卡 ·{" "}
        <span className="font-mono text-gold tabular">✓{hits}</span>{" "}
        <span className="font-mono text-loss/85 tabular">✕{misses}</span>
        {upsets > 0 && (
          <>
            {" "}
            · 其中 <span className="font-mono text-gold tabular">{upsets}</span> 張
            <span className="text-gold">逆風贏過引擎</span>
          </>
        )}
        <span className="block mt-1 font-mono text-mute/55 text-[10px] tracking-[0.12em]">
          每張都賽前鎖死、改不了 —— 收的是自己的眼光,不是中獎彩券。
        </span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {trophies.map((t) => (
          <TrophyCard key={t.card.id} t={t} />
        ))}
      </div>
    </div>
  );
}

function TrophyCard({ t }: { t: Trophy }) {
  const { card } = t;
  const pickName =
    t.pick === "home" ? card.home : t.pick === "away" ? card.away : "和局";
  const verdictColor = t.hit ? "text-gold" : "text-loss/85";
  const verdictBorder = t.hit ? "border-gold/40" : "border-loss/40";
  const lock = fmtLockTaipei(t.ts);
  return (
    <Link
      href={`/receipts/${card.id}`}
      className={`block border ${verdictBorder} bg-slate/30 hover:bg-slate/40 transition-colors p-3.5 group`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-gold/70 text-[9px] tracking-[0.25em]">{card.tag}</span>
        <span className="font-mono text-mute/55 text-[9px] tracking-[0.2em] tabular shrink-0">
          {card.dateLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5 mb-2.5">
        <span className="flex items-center gap-1.5 min-w-0">
          <Avatar seed={card.home} glyph={card.homeGlyph} color={card.homeColor} size={20} />
          <span className="text-bone text-sm font-light tracking-tight truncate">{card.home}</span>
        </span>
        <span className="font-mono text-mute/40 text-[9px] shrink-0">vs</span>
        <span className="flex items-center gap-1.5 min-w-0 justify-end">
          <span className="text-bone text-sm font-light tracking-tight truncate text-right">
            {card.away}
          </span>
          <Avatar seed={card.away} glyph={card.awayGlyph} color={card.awayColor} size={20} />
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line/40 pt-2">
        <span className="font-mono text-mute/75 text-[10px] tracking-[0.08em]">
          你押 <span className="text-bone">{pickName}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {t.upset && (
            <span className="font-mono text-gold/90 text-[8px] tracking-[0.15em] border border-gold/45 px-1 py-[2px] leading-none">
              逆風 ✓
            </span>
          )}
          <span className={`font-mono ${verdictColor} text-[11px] tabular`}>
            {t.hit ? "✓ 命中" : "✕ 落空"}
          </span>
        </span>
      </div>

      {lock && (
        <p className="mt-2 font-mono text-mute/45 text-[8px] tracking-[0.12em] tabular group-hover:text-gold/70 transition-colors">
          鎖定於 {lock} · 收據 →
        </p>
      )}
    </Link>
  );
}
