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
 */

type Props =
  | { plan: "trial"; p: Product; kg?: number; symptoms?: string[]; stage?: Stage }
  | { plan: "elim" };

export default function Remind(props: Props) {
  const [start, setStart] = useState<string | null>(null);
  useEffect(() => setStart(todayTW()), []);

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
      ? "八週很長，最常失敗的就是撐不到最後，或是忘了回測。把關鍵的日子先排進行事曆，到時候手機會跳出來，告訴你那天該看什麼。"
      : "換糧最常卡在兩件事：試到一半斷糧，還有忘了哪天該回頭看結果。這些日子交給手機記就好。";

  return (
    <div style={box}>
      <p style={head}>讓手機幫你記</p>
      <p style={sub}>
        {intro}
        <br />
        不用留 email，也不用加 LINE，我們這邊什麼都不存。
      </p>

      <div style={{ marginTop: 14 }}>
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

      <p style={foot}>
        {props.plan === "elim"
          ? "從今天開始算。還沒開始的話，等開始那天再回來按一次就好。"
          : "從今天開封算。哪天開始不一樣的話，在行事曆裡把日期拖一下就好。"}
      </p>
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
const foot: React.CSSProperties = {
  margin: "12px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.8,
};
