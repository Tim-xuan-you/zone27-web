"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { trialLength, type Stage } from "@/lib/engine";
import { addDays, fmtShort, todayTW } from "@/lib/date";
import { eliminationEvents, googleCalUrl, trialEvents } from "@/lib/reminder";

/**
 * 讓手機幫你記。
 *
 * 心理學上這叫「執行意圖」：只說「八週後要記得看」幾乎沒人做得到，
 * 說「11/5 早上九點手機會跳出來，告訴你該看什麼」，做到的人多很多。
 *
 * 日期要在使用者的手機上算。這個元件也會出現在 build 時就產生好的
 * 長尾頁裡，如果在伺服器上算，日期會停在 build 的那一天。
 * 所以第一次畫面先顯示「第 N 天」，掛上去之後才換成真正的日期。
 *
 * 開始日期讓讀者自己選（2026-09-13 Tim 提的）。多數人是看完才下單，
 * 飼料隔天、甚至三天後才到，從「今天」算，每一個提醒都早了幾天。
 * 以前叫他「到行事曆裡把日期拖一下」，那是把我們該做的事丟給他。
 * 前後 30 天內都可以選：/api/cal 也只收這個範圍，太遠的一律當今天。
 */

type Props =
  | { plan: "trial"; p: Product; kg?: number; symptoms?: string[]; stage?: Stage }
  | { plan: "elim" };

export default function Remind(props: Props) {
  const [today, setToday] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  useEffect(() => {
    const t = todayTW();
    setToday(t);
    setStart(t);
  }, []);

  const events =
    props.plan === "elim"
      ? eliminationEvents()
      : trialEvents(props.p, props.kg, props.symptoms, props.stage);
  if (!events.length) return null;

  const params = new URLSearchParams(
    props.plan === "elim"
      ? { plan: "elim" }
      : {
          plan: "trial",
          p: props.p.id,
          kg: props.kg ? String(props.kg) : "",
          st: props.stage ?? "adultFixed",
          sy: trialLength(props.symptoms).kind,
        },
  );
  if (start) params.set("d", start);

  const n = events.length;
  const intro =
    props.plan === "elim"
      ? "八週很長，最常失敗的就是撐不到最後，或是忘了回測。關鍵的日子排進行事曆，到時候手機會跳出來。"
      : "換糧最常卡在兩件事：試到一半斷糧，還有忘了哪天該回頭看結果。這些日子交給手機記就好。";

  return (
    <div style={box}>
      <p style={head}>讓手機幫你記</p>
      <p style={sub}>{intro}不用註冊，也不用留資料。</p>

      {start && today && (
        <label style={pickRow}>
          <span style={pickLabel}>{props.plan === "elim" ? "哪天開始？" : "哪天開始換？"}</span>
          <input
            type="date"
            value={start}
            min={addDays(today, -30)}
            max={addDays(today, 30)}
            // 手機的日期選單按「清除」會給空字串，那時候就回到今天
            onChange={(e) => setStart(e.target.value || today)}
            style={dateInput}
          />
          {start !== today && (
            <button type="button" onClick={() => setStart(today)} style={resetBtn}>改回今天</button>
          )}
        </label>
      )}
      {props.plan === "trial" && (
        <p style={hint}>飼料還沒到的話，選到貨那天。</p>
      )}

      <div style={{ marginTop: 10 }}>
        {events.map((ev, i) => (
          <div key={ev.key} style={{ ...row, ...(i === n - 1 ? { borderBottom: 0 } : null) }}>
            <span className="mono" style={date}>
              {start ? fmtShort(addDays(start, ev.day)) : `第 ${ev.day} 天`}
            </span>
            <span style={title}>{ev.title}</span>
            {start && (
              <a
                href={googleCalUrl(ev, start)}
                target="_blank"
                rel="noopener noreferrer"
                style={pill}
              >加到 Google 日曆</a>
            )}
          </div>
        ))}
      </div>

      {start && (
        <a href={`/api/cal?${params}`} style={pillStrong}>
          {n > 1 ? `iPhone 行事曆：${n} 個一次加` : "加到 iPhone 行事曆"}
        </a>
      )}
    </div>
  );
}

const box: React.CSSProperties = {
  marginTop: 20, background: "var(--sunken)", border: "1px solid var(--line)",
  borderRadius: 14, padding: "18px 20px",
};
const head: React.CSSProperties = { margin: "0 0 6px", fontSize: 16, fontWeight: 700 };
const sub: React.CSSProperties = {
  margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.9,
};
const pickRow: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 12px", marginTop: 14,
};
const pickLabel: React.CSSProperties = { fontSize: 14.5, fontWeight: 700 };
const dateInput: React.CSSProperties = {
  font: "inherit", fontSize: 15, color: "var(--ink)", background: "var(--surface)",
  border: "1px solid var(--line)", borderRadius: 10, padding: "7px 12px",
  colorScheme: "light dark",
};
const resetBtn: React.CSSProperties = {
  font: "inherit", fontSize: 13, color: "var(--accent)", background: "transparent",
  border: 0, padding: 0, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3,
};
const hint: React.CSSProperties = { margin: "6px 0 0", fontSize: 12.5, color: "var(--faint)" };
const row: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px",
  padding: "11px 0", borderBottom: "1px dashed var(--line)",
};
const date: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: "var(--accent)", minWidth: 76,
};
const title: React.CSSProperties = { flex: "1 1 180px", fontSize: 14.5, lineHeight: 1.7 };
const pill: React.CSSProperties = {
  border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)",
  borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 600,
  textDecoration: "none", whiteSpace: "nowrap",
};
const pillStrong: React.CSSProperties = {
  ...pill, display: "inline-block", marginTop: 14, padding: "9px 18px", fontSize: 14,
};
