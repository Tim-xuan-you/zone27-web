"use client";

import Link from "next/link";
import { useState } from "react";
import { DEVICES, TIER_TONE, anchorCharger, deviceById, fit, itemHref, rank, splitBuy, tierZh, type Charger } from "@/lib/charger";
import ChargerSplit from "./ChargerSplit";

/**
 * 商品頁上的「兩台一起插會怎樣」。
 *
 * 2026-09-27 Tim：「（兩台以上要一起充？點你的裝置算一次）點這個沒有用呀！進去又沒有幫我解決問題！」
 * 以前那一行連回 /charger，那一頁一開始只問「你的手機是哪一支」，要兩台一起算得自己找到下面的按鈕，
 * 而且原本在看的這一顆也不見了。讀者是在看這一顆的時候想到「我還有一台」，答案就該在這一頁。
 *
 * 所以直接在這裡選兩台：這一顆兩個孔一起插，各分到多少、快不快。
 * 不能兩台都最快的時候，直接說該買哪一顆（或分開兩顆），不要讓人再去找。
 * 同一個型號可以選兩次（兩支 iPhone 17 很常見），所以用兩個下拉選單，不用按鈕。
 */
export default function ChargerPair({ c, list }: { c: Charger; list: Charger[] }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const da = deviceById(a), db = deviceById(b);
  const pair = da && db ? [da, db] : null;
  const here = pair ? fit(c, pair, true) : null;
  const allFast = here?.got && here.fast === 2;

  // 這一顆不能兩台都最快：換哪一顆可以；一顆都沒有就分開買
  const better = pair && !allFast ? rank(pair, true, list).find((f) => f.got && f.fast === 2) : undefined;
  const split = pair && !allFast && !better ? splitBuy(pair, list) : null;

  const select = (v: string, set: (x: string) => void, label: string) => (
    <label style={{ display: "block", flex: 1, minWidth: 150 }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--faint)", marginBottom: 4 }}>{label}</span>
      <select value={v} onChange={(e) => set(e.target.value)} style={sel}>
        <option value="">選一台</option>
        {DEVICES.map((d) => <option key={d.id} value={d.id}>{d.zh}</option>)}
      </select>
    </label>
  );

  return (
    <div style={box}>
      <p style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700 }}>兩台一起插這一顆，會怎樣？</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {select(a, setA, "第一台")}
        {select(b, setB, "第二台")}
      </div>

      {here && (
        <div style={{ marginTop: 14 }}>
          {here.got ? (
            here.got.map((g, i) => (
              <div key={i} style={{ fontSize: 15.5, lineHeight: 1.8, marginTop: i ? 8 : 0 }}>
                {g.device.zh}：<b style={{ color: `var(--${TIER_TONE[g.tier]})` }}>{tierZh(g.device, g.tier)}</b>
                <span style={{ color: "var(--muted)" }}>，{g.why}</span>
              </div>
            ))
          ) : (
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.8 }}>{here.gap}，這兩台沒辦法一起算。</p>
          )}

          {!allFast && (better || split) && (
            <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.85 }}>
              {better ? (
                <>
                  要兩台一起插都最快，換這顆：
                  <Link href={itemHref(better.charger.id)} style={link}>{better.charger.brand} {better.charger.name}</Link>
                  {anchorCharger(better.charger) ? `（$${anchorCharger(better.charger)!.amount.toLocaleString()}）` : ""}
                </>
              ) : (
                <>
                  沒有一顆能讓這兩台一起插都最快。
                  <ChargerSplit groups={split!} here={c.id} />
                </>
              )}
            </p>
          )}
          {allFast && <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)" }}>兩台一起插都是最快，這一顆就夠了。</p>}
        </div>
      )}
    </div>
  );
}

const box: React.CSSProperties = {
  marginTop: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 18px",
};
const sel: React.CSSProperties = {
  width: "100%", font: "inherit", fontSize: 15.5, padding: "10px 12px", borderRadius: 8,
  border: "1px solid var(--line)", background: "var(--ground)", color: "var(--ink)",
};
const link: React.CSSProperties = { color: "var(--accent)", fontWeight: 700 };
