"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { S } from "./styles";
import {
  DEVICES, TIER_TONE, anchorCharger, tierZh, chargers, deviceById, rank,
  type Device, type Fit,
} from "@/lib/charger";

/**
 * 充電器挑選器。
 *
 * 飼料的裁決器問「牠幾歲、有什麼狀況」；充電器只要問一件事：你要充哪幾台。
 * 點了馬上算：這幾台插在每一顆上面，各拿到幾瓦、是不是官方寫的最快。
 *
 * 一次只給一個答案的規矩在這裡一樣：最上面是「買這個」，其他的收起來，
 * 收起來的那一段寫清楚為什麼被刷掉（「兩孔一起插只剩 45W＋20W」）。
 *
 * 沒有一顆能讓這幾台一起插都最快的時候，照實講，然後給「分開兩顆」的答案。
 * 不要為了有答案，把「能充」包裝成「最快」。
 */

const GROUPS: { key: Device["group"]; zh: string }[] = [
  { key: "iPhone", zh: "iPhone" },
  { key: "iPad", zh: "iPad" },
  { key: "Mac", zh: "Mac" },
  { key: "Galaxy", zh: "三星" },
];

export default function ChargerPicker() {
  const [ids, setIds] = useState<string[]>([]);
  const [together, setTogether] = useState(true);

  // 文章裡的連結可以先幫他點好：/charger?d=ip18pro,mba
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("d");
    if (d) setIds(d.split(",").filter((x) => deviceById(x)).slice(0, 4));
  }, []);

  const devices = ids.map((i) => deviceById(i)!);
  const fits = useMemo(() => (devices.length ? rank(devices, together) : []), [ids.join(","), together]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) =>
    setIds((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : xs.length >= 4 ? xs : [...xs, id]));

  const all = devices.length;
  const winners = fits.filter((f) => f.got && f.fast === all);
  const top = winners[0];
  // 上面已經講過的不再列：可以的那幾顆，或是沒有一顆可以時「最接近的」那顆
  const shown = top ? winners : fits.slice(0, 1);
  const rest = fits.filter((f) => !shown.includes(f));

  /* 一起插沒有一顆全部最快：每一台各自挑一顆最便宜的最快 */
  const split = !top && together && all > 1
    ? devices.map((d) => ({ d, f: rank([d], true).find((x) => x.fast === 1) }))
    : [];

  return (
    <div>
      <p style={{ margin: "0 0 10px", fontSize: 15.5, fontWeight: 700 }}>你要充哪幾台？可以多選</p>
      {GROUPS.map((g) => (
        <div key={g.key} style={{ marginBottom: 10 }}>
          <p style={groupLbl}>{g.zh}</p>
          <div style={S.chipRow}>
            {DEVICES.filter((d) => d.group === g.key).map((d) => {
              const on = ids.includes(d.id);
              return (
                <button key={d.id} type="button" aria-pressed={on} onClick={() => toggle(d.id)}
                  style={on ? { ...S.example, ...pickOn } : S.example}>
                  {d.zh}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {all > 1 && (
        <div role="radiogroup" aria-label="一起插還是輪流" style={{ ...S.chipRow, marginTop: 6 }}>
          {[{ v: true, zh: "一起插" }, { v: false, zh: "一台一台輪流插" }].map((o) => (
            <button key={o.zh} type="button" role="radio" aria-checked={together === o.v} onClick={() => setTogether(o.v)}
              style={together === o.v ? { ...S.example, ...pickOn } : S.example}>
              {o.zh}
            </button>
          ))}
        </div>
      )}

      {all === 0 && (
        <p style={{ ...S.hint, marginTop: 8 }}>
          點了就算：這幾台插上去，各拿到幾瓦、是不是官方寫的最快。我們讀過 {chargers.length} 顆的官方規格。
        </p>
      )}

      {all > 0 && (
        <div style={{ marginTop: 22 }}>
          {top ? (
            <>
              <p style={S.lbl}>{winners.length > 1 ? `${winners.length} 顆可以` : "只有這一顆可以"}</p>
              <Row f={top} pick />
              {winners.length > 1 && (
                <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
                  另外也可以：{winners.slice(1).map((w, i) => (
                    <span key={w.charger.id}>{i ? "、" : ""}<Link href={`/charger/p/${w.charger.id}`} style={{ color: "var(--accent)" }}>{w.charger.brand} {w.charger.name}</Link></span>
                  ))}
                </p>
              )}
            </>
          ) : (
            <div style={noneBox}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 17, lineHeight: 1.6 }}>
                我們讀過的 {chargers.length} 顆，沒有一顆能讓這{all > 1 ? "幾台" : "一台"}{all > 1 && together ? "一起插" : ""}都是最快
              </p>
              {split.length > 0 && split.every((x) => x.f) && (
                <p style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.85 }}>
                  要都最快，就分開兩顆：
                  {split.map((x, i) => (
                    <span key={x.d.id}>
                      {i ? "，" : ""}{x.d.zh}{" 用 "}
                      <Link href={`/charger/p/${x.f!.charger.id}`} style={{ color: "var(--accent)", fontWeight: 700 }}>
                        {x.f!.charger.brand} {x.f!.charger.name}
                      </Link>
                    </span>
                  ))}
                  。或是一台一台輪流插。
                </p>
              )}
              {fits[0]?.got && (
                <>
                  <p style={{ margin: "14px 0 6px", fontSize: 14, color: "var(--muted)" }}>一顆解決的話，最接近的是這顆：</p>
                  <Row f={fits[0]} />
                </>
              )}
            </div>
          )}

          {devices.some((d) => d.cable) && (
            <p style={{ ...S.hint, marginTop: 14 }}>
              線也要對：{devices.filter((d) => d.cable).map((d) => `${d.zh}${d.cable}`).join("；")}。
            </p>
          )}

          {rest.length > 0 && (
            <details style={S.more}>
              <summary style={S.moreSummary}>
                <span>其他 {rest.length} 顆，還有為什麼不是它</span>
                <span style={S.moreHint}>展開</span>
              </summary>
              <div style={{ ...listWrap, marginTop: 12 }}>
                {rest.map((f, i) => <Row key={f.charger.id} f={f} compact first={i === 0} />)}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

/** 一顆充電器、這幾台各拿到幾瓦 */
function Row({ f, pick, compact, first }: { f: Fit; pick?: boolean; compact?: boolean; first?: boolean }) {
  const c = f.charger;
  const m = anchorCharger(c);
  const body = (
    <>
      <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.brand}</span>
      <Link href={`/charger/p/${c.id}`} style={{ display: "block", fontSize: pick ? 20 : 15.5, fontWeight: 700, lineHeight: 1.5, color: "inherit", textDecoration: "none" }}>
        {c.name}
      </Link>
      {f.got ? (
        <div style={gotList}>
          {f.got.map((g) => (
            <div key={g.device.id} style={{ margin: "4px 0" }}>
              <b style={{ color: `var(--${TIER_TONE[g.tier]})` }}>{tierZh(g.device, g.tier)}</b>
              <span style={{ color: "var(--muted)" }}>　{g.device.zh}{c.ports.length > 1 ? `（${g.port}）` : ""}：{g.why}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--cut)" }}>{f.gap}</p>
      )}
    </>
  );
  if (compact) {
    return <div style={{ padding: "14px 18px", borderTop: first ? 0 : "1px solid var(--line)" }}>{body}</div>;
  }
  return (
    <div style={pick ? pickCard : card}>
      {body}
      {pick && (
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
          <b style={{ color: "var(--cut)" }}>什麼時候不要買：</b>{c.dealbreaker}
        </p>
      )}
      {pick && (m ? (
        <div style={S.buyRow}>
          <a href={`/go/${m.id}/${c.id}`} rel="nofollow sponsored" style={S.btnBuy}>去蝦皮看這一顆</a>
          <p style={S.buyNote}>{m.label} · ${m.amount.toLocaleString()}</p>
        </div>
      ) : (
        <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--faint)" }}>購買連結還在補。規格是官方寫的，先看有沒有適合你的</p>
      ))}
    </div>
  );
}

const groupLbl: React.CSSProperties = { margin: "0 0 6px", fontSize: 12.5, fontWeight: 700, color: "var(--faint)" };
const pickOn: React.CSSProperties = {
  background: "var(--accent-soft)", borderColor: "var(--accent)", color: "var(--accent)", fontWeight: 700,
};
const gotList: React.CSSProperties = { margin: "8px 0 0", fontSize: 14, lineHeight: 1.75 };
const card: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 18px",
};
const pickCard: React.CSSProperties = { ...card, borderColor: "var(--keep)", boxShadow: "var(--sh-lift)", padding: "20px 22px" };
const noneBox: React.CSSProperties = {
  background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 20px",
};
const listWrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
