"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { S } from "./styles";
import { readerNotes } from "@/lib/notes";
import {
  DEVICES, TIER_TONE, anchorCharger, chargers, deviceById, inStockCharger, itemHref, rank, splitBuy, tierZh,
  type Charger, type Device, type Fit,
} from "@/lib/charger";
import ChargerSplit from "./ChargerSplit";

/**
 * 充電器挑選器。
 *
 * 2026-09-26 Tim：「直接我這款手機，推薦我去買哪一個能充最快，這樣就好。
 * 充電器就那點錢，大家不是在做研究。」
 *
 * 他說的是對的。幾百塊的東西，讀者要的是一個答案，外加「確定插上去會快」的那一點安心。
 * 所以這一頁只問一件事：你的手機是哪一支。點了就給：
 *   買這顆、多少錢、插上去多快（Apple、三星自己寫的時間）
 *   想買原廠的話是哪一顆
 *   家裡那顆舊的能不能用（大家心裡最先冒出來的那個問題）
 * 平板、筆電要一起充的人少，收在一個按鈕後面。AVS、PPS、幾瓦幾安全部不出現，
 * 想看的人去商品頁點開細節。
 */

const PHONES = DEVICES.filter((d) => d.group === "iPhone" || d.group === "Galaxy");

export default function ChargerPicker({ list = chargers, kind = "charger" }: { list?: Charger[]; kind?: "charger" | "powerbank" } = {}) {
  /*
   * 第一支手機一次一支（換一支就是換）；「還要一起充的」另外記，手機、平板、筆電都可以，
   * 也可以跟第一支同一個型號（兩支 iPhone 17 很常見）。
   * 2026-09-27 以前第二段只有平板、筆電，按鈕寫「要充平板或筆電？」，要算兩支手機的人找不到路
   */
  const [phone, setPhone] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [together, setTogether] = useState(true);
  const [more, setMore] = useState(false);

  // 文章裡的連結可以先幫他點好：/charger?d=ip18pro,mba
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("d");
    if (!d) return;
    const list = d.split(",").filter((x) => deviceById(x)).slice(0, 4);
    const first = list.find((x) => PHONES.some((p) => p.id === x)) ?? "";
    const rest = list.filter((x, i) => !(x === first && i === list.indexOf(first)));
    setPhone(first);
    setExtras(rest);
    if (rest.length) setMore(true);
  }, []);

  const ids = [phone, ...extras].filter(Boolean);
  const devices = ids.map((i) => deviceById(i)!);
  const fits = useMemo(() => (devices.length ? rank(devices, together, list) : []), [ids.join(","), together]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickPhone = (id: string) => setPhone((p) => (p === id ? "" : id));
  const pickOther = (id: string) =>
    setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : xs.length >= 3 ? xs : [...xs, id]));

  const all = devices.length;
  const winners = fits.filter((f) => f.got && f.fast === all);
  const top = winners[0];
  const shown = top ? winners : fits.slice(0, 1);
  // 「一樣最快的還有」只列現在買得到的，最多 3 顆（2026-09-27 走一遍網站：iPhone 17 列了 8 顆，含買不到的三星）
  const also = winners.slice(1).filter((w) => inStockCharger(w.charger)).slice(0, 3);
  const rest = fits.filter((f) => !shown.includes(f));

  /* 一起插沒有一顆全部最快：每一台各自挑一顆 */
  const split = !top && together && all > 1 ? splitBuy(devices, list) : null;

  const chip = (d: Device, on: boolean, onClick: () => void) => (
    <button key={d.id} type="button" aria-pressed={on} onClick={onClick} style={on ? { ...S.example, ...pickOn } : S.example}>
      {d.zh}
    </button>
  );

  return (
    <div>
      <p style={ask}>你的手機是哪一支？</p>
      <div style={S.chipRow}>{PHONES.map((d) => chip(d, phone === d.id, () => pickPhone(d.id)))}</div>

      {!more ? (
        <button type="button" onClick={() => setMore(true)} style={moreLink}>要一起充兩台以上？ →</button>
      ) : (
        <>
          <p style={{ ...ask, fontSize: 15.5, marginTop: 14 }}>還要一起充的（手機、平板、筆電都可以，可以多選）</p>
          <div style={S.chipRow}>{DEVICES.map((d) => chip(d, extras.includes(d.id), () => pickOther(d.id)))}</div>
        </>
      )}

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

      {all > 0 && (
        <div style={{ marginTop: 24 }}>
          {top ? (
            <>
              <p style={S.lbl}>買這顆</p>
              <Answer f={top} one={all === 1} />
              {also.length > 0 && (
                <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.85 }}>
                  <span style={{ color: "var(--muted)" }}>一樣最快的還有：</span>
                  {also.map((w, i) => {
                    const m = anchorCharger(w.charger);
                    return (
                      <span key={w.charger.id}>
                        {i ? "、" : ""}
                        <Link href={itemHref(w.charger.id)} style={{ color: "var(--accent)", fontWeight: 700 }}>
                          {w.charger.brand} {w.charger.name}
                        </Link>
                        {m ? `（$${m.amount.toLocaleString()}）` : ""}
                      </span>
                    );
                  })}
                </p>
              )}
            </>
          ) : (
            <div style={noneBox}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 17, lineHeight: 1.6 }}>
                沒有一顆能讓這{all > 1 ? "幾台" : "一台"}{all > 1 && together ? "一起插" : ""}都充最快
              </p>
              {split && (
                <p style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.85 }}>
                  <ChargerSplit groups={split} />
                </p>
              )}
              {fits[0]?.got && (
                <>
                  <p style={{ margin: "14px 0 6px", fontSize: 14, color: "var(--muted)" }}>只買一顆的話，最接近的是這顆：</p>
                  <Answer f={fits[0]} />
                </>
              )}
            </div>
          )}

          {all === 1 && kind === "charger" && <OldOne d={devices[0]} />}

          {devices.some((d) => d.cable) && (
            <p style={{ ...S.hint, marginTop: 12 }}>
              線也要對：{[...new Set(devices.filter((d) => d.cable).map((d) => `${d.zh} ${d.cable}`))].join("；")}。
            </p>
          )}

          {rest.length > 0 && (
            <details style={S.more}>
              <summary style={S.moreSummary}>
                <span>其他 {rest.length} 顆為什麼沒選</span>
                <span style={S.moreHint}>展開</span>
              </summary>
              <div style={{ ...listWrap, marginTop: 12 }}>
                {rest.map((f, i) => <Brief key={f.charger.id} f={f} first={i === 0} />)}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

/** 答案卡：名字、多少錢、插上去多快、買。一台的時候只講一句「插這顆，約 15 分鐘充到一半」 */
function Answer({ f, one }: { f: Fit; one?: boolean }) {
  const c = f.charger;
  const m = anchorCharger(c);
  return (
    <div style={card}>
      <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.brand}</span>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <Link href={itemHref(c.id)} style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.5, color: "inherit", textDecoration: "none" }}>
          {c.name}
        </Link>
        {m && <span className="mono" style={{ fontSize: 20, fontWeight: 800, whiteSpace: "nowrap" }}>${m.amount.toLocaleString()}{/組/.test(m.unit ?? "") && <span style={{ fontSize: 14, fontWeight: 400 }}> 一組</span>}</span>}
      </span>
      {f.got && (
        one ? (
          <p style={{ margin: "8px 0 0", fontSize: 17, lineHeight: 1.7 }}>
            {f.got[0].device.zh} 插這顆，<b style={{ color: `var(--${TIER_TONE[f.got[0].tier]})` }}>{f.got[0].why}</b>
          </p>
        ) : (
          <div style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.8 }}>
            {f.got.map((g, i) => (
              <div key={i}>
                {g.device.zh}：<b style={{ color: `var(--${TIER_TONE[g.tier]})` }}>{tierZh(g.device, g.tier)}</b>
                <span style={{ color: "var(--muted)" }}>，{g.why}</span>
              </div>
            ))}
          </div>
        )
      )}
      {m ? (
        <div style={S.buyRow}>
          <a href={`/go/${m.id}/${c.id}`} rel="nofollow sponsored" style={S.btnBuy}>去蝦皮看這一{/組/.test(m.unit ?? "") ? "組" : "顆"}</a>
          <p style={S.buyNote}>{[m.label, ...readerNotes(m.note, { keepVariant: true })].join(" · ")}</p>
        </div>
      ) : (
        <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--faint)" }}>購買連結還在補</p>
      )}
    </div>
  );
}

/** 家裡那顆舊的能不能用。讀者心裡第一個冒出來的問題，也是最常讓人多花錢的地方 */
function OldOne({ d }: { d: Device }) {
  let a: string;
  if (d.needs === "avs") {
    a = "可以充，只是沒這麼快。iPhone 18 Pro 要最快，充電器要有一種新的快充（盒子上寫 AVS），而且要給到 60W。很多舊的沒有，寫了 AVS 的也不一定給到 60W。";
  } else if (d.needs === "pps") {
    a = "可以充，只是不是超快速充電 3.0。S26 Ultra 要最快，要支援三星超快速充電 3.0 的充電器，連三星自己的 65W 三孔都只到 2.0。";
  } else if (d.noFast) {
    a = `可以。盒子附的 ${d.okW}W 就夠，買更大的，官方沒說會更快。`;
  } else if (d.laptop) {
    a = `看那顆幾瓦：${d.fastW}W 以上的一樣快；比 ${d.okW}W 小的，筆電會充很慢。`;
  } else {
    a = d.fastW > d.okW
      ? `可以。${d.fastW}W 以上的都一樣快，${d.okW}W 的也能充，慢一點。`
      : `可以。${d.fastW}W 以上的都一樣快，買更大的不會更快。`;
  }
  return (
    <div style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.85 }}>
      <b>家裡那顆舊的可以用嗎？</b>
      <span style={{ display: "block", color: "var(--muted)" }}>{a}</span>
    </div>
  );
}

/** 沒選上的那幾顆：一行名字、一行白話理由 */
function Brief({ f, first }: { f: Fit; first?: boolean }) {
  const c = f.charger;
  const worst = f.got?.reduce((a, g) => (TIER_RANK[g.tier] < TIER_RANK[a.tier] ? g : a));
  return (
    <Link href={itemHref(c.id)} style={{ display: "block", padding: "12px 16px", borderTop: first ? 0 : "1px solid var(--line)", textDecoration: "none", color: "inherit" }}>
      <span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.brand}</span>
          <b style={{ display: "block", fontSize: 15.5, lineHeight: 1.5 }}>{c.name}</b>
        </span>
        {worst && <b style={{ fontSize: 14, whiteSpace: "nowrap", color: `var(--${TIER_TONE[worst.tier]})` }}>{tierZh(worst.device, worst.tier)}</b>}
      </span>
      <span style={{ display: "block", fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
        {f.got ? (f.got.length === 1 ? worst!.why : f.got.map((g) => `${g.device.zh}${g.why.startsWith("一起插") ? "" : "："}${g.why}`).join("；")) : f.gap}
      </span>
    </Link>
  );
}

const TIER_RANK = { fast: 3, ok: 2, slow: 1, none: 0 } as const;

const ask: React.CSSProperties = { margin: "0 0 10px", fontSize: 17, fontWeight: 700 };
const moreLink: React.CSSProperties = {
  background: "none", border: 0, padding: "4px 0", font: "inherit", fontSize: 15.5, fontWeight: 700,
  color: "var(--accent)", cursor: "pointer",
};
const pickOn: React.CSSProperties = {
  background: "var(--accent-soft)", borderColor: "var(--accent)", color: "var(--accent)", fontWeight: 700,
};
const card: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--keep)", borderRadius: 14, boxShadow: "var(--sh-lift)", padding: "18px 20px",
};
const noneBox: React.CSSProperties = {
  background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 20px",
};
const listWrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
