"use client";

import { useState } from "react";
import { parse } from "@/lib/parse";
import { adjudicate, anchorOf, auditCommission, pricePerKg } from "@/lib/engine";
import { catalog, constraintsFor } from "@/lib/catalog";
import type { Verdict } from "@/lib/types";

/**
 * 裁決器。整個引擎跑在瀏覽器裡 —— 沒有 API 呼叫、沒有網路來回、
 * 沒有 token 費用。資料只有 200 款上下，bundle 吃得下。
 * 之後 SKU 變多再把裁決搬到 server action。
 */

const EXAMPLES = [
  "我家柴犬 5 歲，最近一直抓癢，換過兩種雞肉飼料都沒改善",
  "12 歲老貓，腎指數偏高，獸醫說要控磷",
  "拉不拉多，吃了雞肉就會癢，也不能吃羊",
];

export default function Decider() {
  const [text, setText] = useState("");
  const [chips, setChips] = useState<{ label: string; kind: "info" | "avoid" }[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [empty, setEmpty] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [showAudit, setShowAudit] = useState(false);

  function run(input: string) {
    const src = input.trim() || EXAMPLES[0];
    setText(src);
    const parsed = parse(src);

    if (parsed.empty) {
      setEmpty(true);
      setVerdict(null);
      setChips([]);
      return;
    }
    setEmpty(false);
    parsed.situation.constraints = constraintsFor(parsed.situation);
    setChips(parsed.chips.map((c) => ({ label: c.label, kind: c.kind })));
    setVerdict(adjudicate(catalog, parsed.situation));
    setShowAudit(false);
    setOpen(null);
  }

  const audit = verdict ? auditCommission(verdict) : null;

  return (
    <>
      <div style={S.ask}>
        <textarea
          style={S.ta}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run(text);
          }}
          placeholder="例如：我家柴犬 5 歲，最近一直抓癢，換過兩種飼料都沒改善…"
          rows={3}
        />
        <button style={S.go} onClick={() => run(text)}>裁決</button>
      </div>

      <div style={S.chipRow}>
        {EXAMPLES.map((e) => (
          <button key={e} style={S.example} onClick={() => run(e)}>
            {e.slice(0, 12)}…
          </button>
        ))}
      </div>
      <p style={S.hint}>講得亂一點沒關係。「牠最近一直舔腳」這種也可以。</p>

      {empty && (
        <div style={S.emptyBox}>
          <p style={{ margin: 0, fontWeight: 700 }}>這句話我們讀不出條件</p>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 14 }}>
            試著講品種、年齡，還有你觀察到的狀況 —— 例如「柴犬五歲，一直抓癢」。
            或直接把毛孩的情形傳 LINE 給我們，真人看。
          </p>
        </div>
      )}

      {verdict && (
        <div style={S.stage}>
          <p style={S.lbl}>我們聽到的是</p>
          <div style={S.parsed}>
            {chips.map((c, i) => (
              <span key={i} style={c.kind === "avoid" ? S.consNeg : S.cons}>
                {c.kind === "avoid" ? "✕ " : ""}{c.label}
              </span>
            ))}
          </div>

          <p style={S.lbl}>怎麼刪的</p>
          <div style={S.cascade}>
            <div style={S.cascTop}>
              <span style={S.bignum} className="mono">{verdict.startCount}</span>
              <span style={S.cascCap}>款進入裁決</span>
            </div>
            {verdict.cuts.map((c, i) => (
              <div key={i} style={S.cutRow}>
                <span style={S.cutN} className="mono">− {c.count}</span>
                <span style={S.cutWhy}>{c.why}</span>
                <span style={S.cutTag} className="mono">{c.tag}</span>
              </div>
            ))}
            <div style={S.keepRow}>
              <span style={S.keepN} className="mono">{verdict.survivors.length}</span>
              <span style={{ fontWeight: 700 }}>
                {verdict.survivors.length > 0 ? "款留下。差在哪，往下看" : "款符合 —— 你的條件很嚴格"}
              </span>
            </div>
          </div>

          {verdict.survivors.length === 0 ? (
            <div style={S.emptyBox}>
              <p style={{ margin: 0, fontWeight: 700 }}>目前沒有一款同時滿足你的所有條件</p>
              <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 14 }}>
                這不是壞消息 —— 硬推一款不適合的才是。放寬其中一項，或把狀況傳 LINE 給我們。
              </p>
            </div>
          ) : (
            <>
              <p style={S.lbl}>剩下這幾款</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {verdict.survivors.map((p) => {
                  const isPick = p.id === verdict.pick?.id;
                  const safe = anchorOf(p, "safe");
                  const value = anchorOf(p, "value");
                  const perKg = pricePerKg(p.price.unit, value.amount);
                  return (
                    <article key={p.id} style={{ ...S.card, ...(isPick ? S.cardPick : {}) }}>
                      <button style={S.cardH} onClick={() => setOpen(open === p.id ? null : p.id)}>
                        <span style={S.thumb}>{isPick ? "🥇" : "🐾"}</span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={S.cardR1}>
                            <span style={S.pname}>{p.brand}｜{p.name}</span>
                            {isPick && <span style={S.badgeBest} className="mono">唯一推薦</span>}
                          </span>
                          <span style={S.specs}>
                            <span><span style={S.k}>粗蛋白</span> {p.spec.protein}%</span>
                            <span><span style={S.k}>碳水</span> {p.spec.carb}%</span>
                            <span><span style={S.k}>Omega-3</span> {p.spec.omega3}%</span>
                            {p.spec.singleSource && <span style={{ color: "var(--keep)" }}>單一蛋白源</span>}
                          </span>
                        </span>
                        <span style={S.cardR}>
                          <span style={S.price} className="mono">${value.amount}</span>
                          {perKg !== null && (
                            <span style={S.perKg} className="mono">${perKg}/kg</span>
                          )}
                          <span style={S.checked} className="mono">{p.price.unit} · {p.price.checkedAt} 查得</span>
                        </span>
                      </button>

                      <div style={S.deal}>
                        <span>✕</span>
                        <span><b>不要買，如果：</b>{p.dealbreaker}</span>
                      </div>

                      {open === p.id && (
                        <div style={S.drawer}>
                          {isPick && verdict.pickReason && (
                            <p style={S.why}><b>為什麼是這款：</b>{verdict.pickReason}</p>
                          )}
                          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                            <div style={S.anch}>
                              <span>
                                <span style={S.anchK} className="mono">最穩</span>
                                <span style={S.anchV}>{safe.label}</span>
                                <span style={S.anchN}>${safe.amount} · {safe.note}</span>
                              </span>
                              <a style={S.btn} href={`/go/${safe.id}/${p.id}`} rel="nofollow sponsored">前往</a>
                            </div>
                            {value.id !== safe.id && (
                              <div style={S.anch}>
                                <span>
                                  <span style={S.anchK} className="mono">最省</span>
                                  <span style={S.anchV}>{value.label}</span>
                                  <span style={S.anchN}>${value.amount} · 省 ${safe.amount - value.amount} · {value.note}</span>
                                </span>
                                <a style={S.btnGhost} href={`/go/${value.id}/${p.id}`} rel="nofollow sponsored">前往</a>
                              </div>
                            )}
                          </div>
                          <p style={S.reports}>
                            {p.reports.total} 位飼主回報中，{p.reports.palatability} 位反映適口性差、
                            {p.reports.looseStool} 位反映軟便。
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {audit && (
                <div style={{ margin: "16px 0 0" }}>
                  <button style={S.verifyBar} onClick={() => setShowAudit(!showAudit)}>
                    <span style={{ color: "var(--keep)", fontWeight: 700 }}>✓</span>
                    <span>排序沒看佣金</span>
                    <span style={S.verifyTag} className="mono">{showAudit ? "收合" : "驗證"}</span>
                  </button>
                  {showAudit && (
                    <div style={S.auditBox}>
                      <p style={{ margin: "0 0 12px", fontSize: 13.5 }}>
                        排序的時候我們只看四件事：<b>有沒有踩到你標記的過敏原</b>、
                        營養組成在不在建議區間、是不是單一蛋白源、其他飼主回報好不好吃。佣金不在裡面。
                      </p>
                      <table style={S.ctab}>
                        <tbody>
                          {audit.rows.map((r, i) => (
                            <tr key={i}>
                              <td style={S.ctd}>
                                {r.label}
                                {r.isPick && <b style={{ color: "var(--keep)" }}> ← 我們推薦</b>}
                              </td>
                              <td style={{ ...S.ctd, textAlign: "right" }} className="mono">{r.commission}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p style={S.ps}>
                        {audit.pickIsHighest === null
                          ? "本次留下的款式佣金相同，沒有比較基礎。"
                          : audit.pickIsHighest
                          ? "⚠️ 這次推薦的剛好是佣金最高的。演算法沒有讀佣金，但這種情況我們會另外複查。"
                          : <>順帶一提，本次佣金最高的是 {audit.highest}%，<b>我們推的這款是 {audit.pickRate}%</b> —— 賺最少的那個。</>}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <p style={S.lbl}>還是選不出來</p>
          <div style={S.landing}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: 16.5 }}>把你毛孩的狀況直接傳給我們</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)" }}>
                年齡、體重、現在吃什麼牌子、皮膚的照片。我們的人會看，不是罐頭回覆。
              </p>
            </div>
            <button style={S.btn}>傳 LINE 給我們</button>
          </div>
        </div>
      )}
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  ask: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", padding: 6, marginBottom: 14, display: "flex", gap: 6, alignItems: "flex-end" },
  ta: { flex: 1, border: 0, background: "transparent", color: "var(--ink)", resize: "none", font: "inherit", fontSize: 15.5, lineHeight: 1.6, padding: "12px 12px 10px", outline: "none" },
  go: { border: 0, borderRadius: 6, background: "var(--accent)", color: "var(--accent-ink)", fontWeight: 700, fontSize: 14, padding: "11px 18px", cursor: "pointer", margin: "0 4px 4px 0" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 8 },
  example: { border: "1px solid var(--line)", background: "var(--surface)", color: "var(--muted)", borderRadius: 99, padding: "5px 13px", fontSize: 12.5, cursor: "pointer" },
  hint: { fontSize: 12, color: "var(--faint)", margin: "0 0 34px" },
  stage: { marginTop: 8 },
  lbl: { fontFamily: "var(--font-mono), monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: "var(--faint)", margin: "34px 0 10px", textTransform: "uppercase" },
  parsed: { display: "flex", flexWrap: "wrap", gap: 7 },
  cons: { background: "var(--accent-soft)", color: "var(--accent)", borderRadius: 4, padding: "5px 11px", fontSize: 12.5, fontWeight: 600 },
  consNeg: { background: "var(--cut-soft)", color: "var(--cut)", borderRadius: 4, padding: "5px 11px", fontSize: 12.5, fontWeight: 600 },
  cascade: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", padding: "24px 24px 20px" },
  cascTop: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 },
  bignum: { fontSize: 46, fontWeight: 600, lineHeight: 1, letterSpacing: "-.03em" },
  cascCap: { fontSize: 13.5, color: "var(--muted)" },
  cutRow: { display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "baseline", padding: "9px 0", borderTop: "1px dashed var(--line)" },
  cutN: { fontWeight: 600, color: "var(--cut)", fontSize: 14, whiteSpace: "nowrap" },
  cutWhy: { fontSize: 14, color: "var(--muted)", textDecoration: "line-through", textDecorationColor: "var(--cut)" },
  cutTag: { fontSize: 10.5, fontWeight: 600, background: "var(--cut-soft)", color: "var(--cut)", padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap" },
  keepRow: { display: "flex", alignItems: "baseline", gap: 12, borderTop: "2px solid var(--ink)", marginTop: 12, paddingTop: 14 },
  keepN: { fontSize: 26, fontWeight: 600, color: "var(--keep)" },
  card: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", overflow: "hidden" },
  cardPick: { borderColor: "var(--keep)", borderWidth: 1.5 },
  cardH: { display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", cursor: "pointer", width: "100%", textAlign: "left", background: "none", border: 0, color: "inherit" },
  thumb: { width: 46, height: 46, borderRadius: 5, background: "var(--sunken)", flex: "none", display: "grid", placeItems: "center", fontSize: 21 },
  cardR1: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 },
  pname: { fontWeight: 700, fontSize: 15.5 },
  badgeBest: { fontSize: 10, fontWeight: 600, letterSpacing: ".09em", padding: "2.5px 7px", borderRadius: 3, background: "var(--keep-soft)", color: "var(--keep)" },
  specs: { display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12.5, color: "var(--muted)" },
  k: { color: "var(--faint)" },
  cardR: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flex: "none" },
  price: { fontWeight: 600, fontSize: 17 },
  checked: { fontSize: 10.5, color: "var(--faint)" },
  deal: { display: "flex", gap: 9, alignItems: "flex-start", background: "var(--cut-soft)", color: "var(--cut)", padding: "9px 18px", fontSize: 12.5, fontWeight: 600, lineHeight: 1.5 },
  drawer: { borderTop: "1px solid var(--line)", padding: 18, background: "var(--raise)" },
  why: { margin: "0 0 14px", fontSize: 13.5, color: "var(--muted)" },
  anch: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1px solid var(--line)", borderRadius: 6, padding: "12px 14px", background: "var(--surface)" },
  anchK: { display: "block", fontSize: 10, fontWeight: 600, letterSpacing: ".12em", color: "var(--faint)" },
  anchV: { display: "block", fontSize: 13.5, fontWeight: 600 },
  anchN: { display: "block", fontSize: 12, color: "var(--muted)" },
  btn: { border: "1px solid var(--accent)", background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 5, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" },
  btnGhost: { border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", borderRadius: 5, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" },
  reports: { fontSize: 12, color: "var(--faint)", marginTop: 12, paddingTop: 11, borderTop: "1px dashed var(--line)" },
  verifyBar: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "none", border: 0, padding: 0, color: "var(--muted)", fontSize: 12.5, cursor: "pointer" },
  verifyTag: { fontSize: 11, fontWeight: 600, letterSpacing: ".06em", color: "var(--accent)", border: "1px solid var(--line)", borderRadius: 4, padding: "2px 8px" },
  auditBox: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", padding: "18px 20px", marginTop: 12 },
  ctab: { width: "100%", borderCollapse: "collapse", fontSize: 12.5, marginBottom: 14 },
  ctd: { padding: "6px 0", borderBottom: "1px dashed var(--line)" },
  ps: { background: "var(--keep-soft)", borderLeft: "3px solid var(--keep)", borderRadius: "0 5px 5px 0", padding: "12px 14px", fontSize: 13.5, lineHeight: 1.65, margin: 0 },
  emptyBox: { background: "var(--warn-soft)", border: "1px solid var(--warn)", borderRadius: 8, padding: "16px 18px", margin: "16px 0" },
  landing: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", padding: "22px 24px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" },
};
