"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { handleGlyph } from "@/lib/identity";
import { getMyFollowing, type FollowingResult } from "@/lib/follows-client";
import type { PulseEvent } from "@/lib/pulse";

// ── ZONE 27 · 活動脈動 UI(中央對帳牆 · 只讀)──────────────────────────────
// 一面會動的牆:會員賽前鎖定 + 引擎結算,按時間流下來。 R210 設計、R226 有真人才建。
// 🔴 只讀廣播(無發言框 · 不是論壇)· 每格連那人的 /u 公開校準檔(熱鬧靠被看見的對帳)·
//   含輸照播(✕落空跟 ✓命中同權重 · loss 柔紅非紅綠)· 無 PnL/連勝/排名 · 無 emoji(✓✕= 例外)。
//
// R229「只看我追的」:登入且已套 0025 時,頂端出現「全部 / 只看我追的」切換 —— 只留你追蹤的人
//   的鎖定(引擎結算不是人 · 不入此視圖)。 追蹤名單私密(server 端 get_my_following 只回自己的)·
//   永遠不顯示粉絲數 / 追蹤數(紅線)。 graceful:未登入 / 0025 未套 → 切換鈕整個不出現,牆照常全顯示。
// ─────────────────────────────────────────────────────

// 事件時間 → 台北「M/D HH:mm」(鎖定帶時間)或「M/D」(結算只有日期)· 格式化的是事件時間戳
// (非 now)· locale + timeZone 都釘死 → server / client 渲染一致 · 無 hydration 風險。
function fmtTPE(iso: string, withTime: boolean): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  // 🔴 Asia/Taipei = 固定 UTC+8(無 DST)→ 手動格式化,避免 Intl.DateTimeFormat 在
  //   Node(server)與瀏覽器(client)之間 ICU 版本差異造成 hydration mismatch
  //   (同 timeZone 但輸出可能差一個分隔字元 → React 整棵 client 重建 + console 報錯)。
  //   純算術 + 字串 = server/client 逐位元一致。
  const d = new Date(t + 8 * 60 * 60 * 1000);
  const mo = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  if (!withTime) return `${mo}/${day}`;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${mo}/${day} ${hh}:${mm}`;
}

export default function ActivityPulse({ events }: { events: PulseEvent[] }) {
  // 一次性偵測「我追蹤的」· null = 偵測中。 未登入 → {anon}(0 網路請求)· 0025 未套 → {unavailable}。
  // 只有 status==='ok'(已登入且功能可用)才出現切換鈕 —— 半套 / 未登入永遠不顯示破 UI。
  const [follow, setFollow] = useState<FollowingResult | null>(null);
  const [mineOnly, setMineOnly] = useState(false);

  useEffect(() => {
    let alive = true;
    getMyFollowing().then((r) => {
      if (alive) setFollow(r);
    });
    return () => {
      alive = false;
    };
  }, []);

  const canFilter = follow?.status === "ok";
  const codes = follow?.status === "ok" ? follow.codes : null;

  // 只看我追的:只留「我追蹤的人」的鎖定事件(引擎結算沒有人 · 不在此視圖)。
  const mine =
    mineOnly && codes
      ? events.filter((e) => e.kind === "lock" && codes.has(e.authorCode))
      : [];
  const showingMine = mineOnly && canFilter;

  if (events.length === 0) return null;

  return (
    <div>
      {/* 切換:全部 / 只看我追的(只在登入且 0025 可用時出現)*/}
      {canFilter && (
        <div
          role="group"
          aria-label="脈動篩選"
          className="mb-4 inline-flex border border-line/50 divide-x divide-line/50"
        >
          <button
            type="button"
            onClick={() => setMineOnly(false)}
            aria-pressed={!mineOnly}
            className={`font-mono text-[10px] tracking-[0.2em] px-3.5 py-1.5 transition-colors ${
              !mineOnly
                ? "bg-gold/10 text-gold"
                : "text-mute/65 hover:text-bone"
            }`}
          >
            全部
          </button>
          <button
            type="button"
            onClick={() => setMineOnly(true)}
            aria-pressed={mineOnly}
            className={`font-mono text-[10px] tracking-[0.2em] px-3.5 py-1.5 transition-colors ${
              mineOnly ? "bg-gold/10 text-gold" : "text-mute/65 hover:text-bone"
            }`}
          >
            只看我追的
          </button>
        </div>
      )}

      {showingMine ? (
        mine.length > 0 ? (
          <PulseList events={mine} />
        ) : (
          <MineEmpty followsNobody={codes !== null && codes.size === 0} />
        )
      ) : (
        <PulseList events={events} />
      )}
    </div>
  );
}

// ── 牆本體 · 鎖定 + 結算事件列(原樣)──────────────────────────────────────
function PulseList({ events }: { events: PulseEvent[] }) {
  return (
    <ul className="divide-y divide-line/40 border-y border-line/40">
      {events.map((e, i) =>
        e.kind === "lock" ? (
          <li
            key={`l-${e.authorCode}-${e.matchId}-${i}`}
            className="flex items-start gap-3 py-3.5"
          >
            <Avatar
              seed={`#${e.authorCode}`}
              glyph={handleGlyph(e.handle)}
              size={28}
            />
            <div className="min-w-0 flex-1">
              <p className="text-bone text-sm leading-snug">
                <Link
                  href={`/u/${e.authorCode}`}
                  className="text-bone hover:text-gold underline-offset-4 hover:underline transition-colors"
                >
                  {e.handle}
                </Link>{" "}
                <span className="text-mute/70">賽前鎖定 · 看好</span>{" "}
                <span className="text-gold">{e.teamLabel}</span>
              </p>
              <p className="mt-0.5 font-mono text-mute/55 text-[10px] tracking-[0.12em]">
                {/* R263:看到「誰賽前鎖了這場」→ 一鍵落在那場的「看法 / 分析」討論區(發言要掛自己戰績)·
                    不是連到某個人的貼文(不造神 · 連 section 不連名)。
                    棒球 → /matches/<id>#say(永久單場頁 · CreatorAnalysis 在 id="say" · 各階段都在)·
                    足球 → /receipts/<id>(三階段都解析得到;⚠️ /soccer/<id> 對已踢完場會 404,故不深連討論)·
                    群眾盤 mkt-* → /markets#m-<id> · 網球 tn-* → /tennis/<id>(無討論層)。 */}
                <Link
                  href={
                    e.matchId.startsWith("fd-")
                      ? `/receipts/${e.matchId}`
                      : e.matchId.startsWith("mkt-")
                        ? `/markets#m-${e.matchId}`
                        : e.matchId.startsWith("tn-")
                          ? `/tennis/${e.matchId}`
                          : e.matchId.startsWith("bd-")
                            ? `/badminton/${e.matchId}`
                            : `/matches/${e.matchId}#say`
                  }
                  className="hover:text-gold transition-colors"
                >
                  {e.matchup}
                </Link>{" "}
                · {fmtTPE(e.whenISO, true)}
              </p>
            </div>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.25em] shrink-0 mt-1">
              鎖定
            </span>
          </li>
        ) : (
          <li
            key={`s-${e.matchId}-${i}`}
            className="flex items-start gap-3 py-3.5"
          >
            {/* 引擎標記 · 純 CSS 幾何方塊(無字型依賴)· 跟用戶頭像區隔開 */}
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 items-center justify-center border border-gold/40"
            >
              <span className="font-mono text-gold/80 text-[9px] tracking-[0.1em]">
                引擎
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-bone text-sm leading-snug">
                <span className="text-mute/70">引擎結算 ·</span>{" "}
                {e.verdict === "proved" ? (
                  <span className="text-gold">✓ 命中</span>
                ) : e.verdict === "diverged" ? (
                  <span className="text-loss/85">✕ 落空</span>
                ) : (
                  <span className="text-mute">= 平</span>
                )}
              </p>
              <p className="mt-0.5 font-mono text-mute/55 text-[10px] tracking-[0.12em]">
                <Link
                  href={`/receipts/${e.matchId}`}
                  className="hover:text-gold transition-colors"
                >
                  {e.matchup}
                </Link>{" "}
                · {fmtTPE(e.whenISO, false)}
              </p>
            </div>
            <span className="font-mono text-mute/45 text-[9px] tracking-[0.25em] shrink-0 mt-1">
              對帳
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

// ── 「只看我追的」空狀態(誠實 · 不假裝牆很滿)────────────────────────────────
function MineEmpty({ followsNobody }: { followsNobody: boolean }) {
  return (
    <div className="border border-dashed border-gold/25 bg-slate/30 p-7 text-center">
      <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-3">
        {followsNobody ? "你還沒追蹤任何人" : "你追蹤的人最近還沒鎖手"}
      </p>
      <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
        {followsNobody ? (
          <>
            打開任何一個人的公開帳本,按「
            <span className="text-bone">追蹤這份帳本</span>」—— 之後他賽前鎖手,就會出現在這裡。
            追的是準度,不是人氣。
          </>
        ) : (
          <>
            這面牆只顯示<span className="text-bone">最近</span>的鎖定 ——
            你追的人最近還沒有新動作。 切回「全部」看看大家在押什麼。
          </>
        )}
      </p>
    </div>
  );
}
