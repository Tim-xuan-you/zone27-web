"use client";

import { useState } from "react";
import { parse } from "@/lib/parse";
import { adjudicate, FRESH_DAYS, anchorOf, auditCommission, commissionLine, bagDuration, pricePerKg, sharedListings, storesOf, unitOf } from "@/lib/engine";
import { catalog, constraintsFor } from "@/lib/catalog";
import { priceStat, timingAdvice } from "@/lib/history";
import type { Verdict } from "@/lib/types";
import { S } from "./styles";

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
  // 使用者講了體重才估「這包吃得完嗎」
  const [dogKg, setDogKg] = useState<number | undefined>(undefined);

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
    setDogKg(parsed.situation.weightKg);
    setVerdict(adjudicate(catalog, parsed.situation));
    setShowAudit(false);
    setOpen(null);
    // 結果在摺線下方時，不捲過去會看起來像沒反應
    requestAnimationFrame(() => {
      document.getElementById("verdict")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  const audit = verdict ? auditCommission(verdict) : null;
  const shared = verdict ? sharedListings(verdict.survivors) : new Set<string>();

  return (
    <>
      <div style={S.ask}>
        <textarea
          style={S.ta}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter 直接送出，Shift+Enter 才換行。
            // 原本設計成 Ctrl+Enter 是工程師的習慣 —— 一般人打完字就是按 Enter，
            // 按了沒反應會以為網站壞掉。
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              run(text);
            }
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
      <p style={S.hint}>講得亂一點沒關係。「牠最近一直舔腳」這種也可以。打完按 Enter 就行。</p>

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
        <div id="verdict" style={S.stage}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {verdict.survivors.map((p, i) => {
                  const isPick = p.id === verdict.pick?.id;
                  const safe = anchorOf(p, "safe");
                  // 卡片標題顯示「入門規格」的價格與每公斤，細節在展開後的賣場表
                  const safeKg = pricePerKg(unitOf(p, safe), safe.amount);
                  const multi = shared.has(safe.affiliateUrl);
                  return (
                    <article key={p.id} style={{ ...S.card, ...(isPick ? S.cardPick : {}) }}>
                      <button style={S.cardH} onClick={() => setOpen(open === p.id ? null : p.id)}>
                      <div style={S.rankRow}>
                        <span style={S.rank} className="mono">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {isPick && <span style={S.badgeBest} className="mono">唯一推薦</span>}
                      </div>
                      <span style={S.brand}>{p.brand}</span>
                      <span style={S.pname}>{p.name}</span>
                      <div style={S.priceRow}>
                        <span style={S.price} className="mono">${safe.amount}</span>
                        {safeKg !== null && (
                          <span style={S.perKg} className="mono">${safeKg}/kg</span>
                        )}
                        <span style={S.checked} className="mono">
                          {unitOf(p, safe)} · {p.price.checkedAt} 查得
                        </span>
                      </div>
                      <div style={S.specRow}>
                        <span style={S.spec}>粗蛋白 {p.spec.protein}%</span>
                        <span style={S.spec}>碳水 {p.spec.carb}%</span>
                        {p.spec.omega3 > 0 && <span style={S.spec}>Omega-3 {p.spec.omega3}%</span>}
                        {p.spec.singleSource && <span style={S.specGood}>單一蛋白源</span>}
                      </div>
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
                          {storesOf(p).map((store) => (
                            <div key={store.label} style={S.store}>
                              <div style={S.storeHead}>
                                <span style={S.storeName}>{store.label}</span>
                                {/* 所有規格同一個商品頁 → 標題一個按鈕就好；
                                    賣家把尺寸拆成獨立商品 → 每一行各自一個按鈕 */}
                                {store.singleUrl && (
                                  <a
                                    style={S.btn}
                                    href={`/go/${store.options[0].id}/${p.id}`}
                                    rel="nofollow sponsored"
                                  >前往賣場</a>
                                )}
                              </div>
                              <table style={S.optTable}>
                                <tbody>
                                  {store.options.map((o) => (
                                    <tr key={o.id}>
                                      <td style={S.optUnit} className="mono">
                                        {o.unit}
                                        {(() => {
                                          const dur = bagDuration(o.unit, dogKg);
                                          if (!dur) return null;
                                          return (
                                            <span style={{
                                              ...S.dur,
                                              color: dur.tooLong ? "var(--cut)" : "var(--faint)",
                                            }}>
                                              約 {dur.days} 天{dur.tooLong ? " ⚠" : ""}
                                            </span>
                                          );
                                        })()}
                                      </td>
                                      <td style={S.optAmt} className="mono">${o.amount}</td>
                                      <td style={S.optKg} className="mono">
                                        {o.perKg !== null ? `$${o.perKg}/kg` : ""}
                                      </td>
                                      <td
                                        style={{
                                          ...S.optSave,
                                          color:
                                            o.savingPct === null || Math.abs(o.savingPct) < 3
                                              ? "var(--faint)"
                                              : o.savingPct > 0
                                              ? "var(--keep)"
                                              : "var(--cut)",
                                        }}
                                        className="mono"
                                      >
                                        {/* 差三個百分點以內就是「差不多」——「反而貴 1%」太瑣碎，
                                            「差不多」直接告訴使用者不用為了這包多花錢 */}
                                        {o.savingPct === null || Math.abs(o.savingPct) < 3
                                          ? o.savingPct === null ? "" : "每公斤差不多"
                                          : o.savingPct > 0
                                          ? `每公斤省 ${o.savingPct}%`
                                          : `每公斤反而貴 ${-o.savingPct}%`}
                                      </td>
                                      {!store.singleUrl && (
                                        <td style={{ textAlign: "right", paddingLeft: 12 }}>
                                          <a
                                            style={S.btnSmall}
                                            href={`/go/${o.id}/${p.id}`}
                                            rel="nofollow sponsored"
                                          >前往</a>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {/* 有規格會放太久就解釋一次 —— 不然使用者看到 ⚠ 不知道是什麼意思 */}
                              {store.options.some((o) => bagDuration(o.unit, dogKg)?.tooLong) && (
                                <p style={S.freshWarn}>
                                  ⚠️ 標記的規格，你的狗要吃超過 {FRESH_DAYS} 天才吃得完。
                                  開封後的乾飼料油脂會氧化，放久了狗會越來越不愛吃 ——
                                  很多人以為是「這牌子不好」，其實是放太久。<b>大包便宜，但不一定適合你的狗。</b>
                                </p>
                              )}
                              {/* 只顯示入門包的備註 —— 那一欄放賣家層級的資訊（出貨、鑑賞期）。
                              每個規格各自的備註串起來會變成一長串雜訊。 */}
                          {store.options[0]?.note && (
                            <p style={S.storeNote}>{store.options[0].note}</p>
                          )}
                            </div>
                          ))}
                        {multi && (
                          <p style={S.variantWarn}>
                            ⚠️ 這個賣場一頁多口味。點進去請自己把規格選成
                            <b>「{p.name}」</b>—— 預設可能不是這個。
                          </p>
                        )}
                        {/* 沒有回報就不要顯示 —— 「0 位飼主回報中，0 位反映…」
                            看起來像壞掉，而且它其實是在講「我們還沒查」，
                            不如老實講那句。 */}
                        <p style={S.reports}>
                          {p.reports.total > 0
                            ? `${p.reports.total} 位飼主回報中，${p.reports.palatability} 位反映適口性差、${p.reports.looseStool} 位反映軟便。`
                            : "這款我們還沒整理飼主回報。有買過的話，歡迎把心得傳 LINE 給我們。"}
                        </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {audit && (() => {
                const line = commissionLine(audit);
                return (
                  <div style={{ margin: "24px 0 0" }}>
                    <button style={S.verifyBar} onClick={() => setShowAudit(!showAudit)}>
                      <span style={{ color: "var(--keep)" }}>✓</span>
                      <span>排序沒看佣金</span>
                      <span style={S.verifyTag} className="mono">{showAudit ? "收合" : "驗證"}</span>
                    </button>
                    {showAudit && (
                      <div style={{
                        ...S.emptyBox,
                        background: line.tone === "warn" ? "var(--warn-soft)" : "var(--keep-soft)",
                        borderColor: line.tone === "warn" ? "var(--warn)" : "var(--keep)",
                      }}>
                        <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.9 }}>
                          我們只看四件事：有沒有踩到你標記的過敏原、營養組成在不在建議區間、
                          是不是單一蛋白源、其他飼主回報好不好吃。
                        </p>
                        <table style={S.auditTable}>
                          <tbody>
                            {audit.rows.map((r, k) => (
                              <tr key={k}>
                                <td style={S.auditName}>
                                  {r.label}
                                  {r.isPick && (
                                    <b style={{ color: "var(--keep)", whiteSpace: "nowrap" }}> · 我們推薦</b>
                                  )}
                                </td>
                                <td style={S.auditRate} className="mono">{r.commission}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p style={{
                          margin: "16px 0 0", fontSize: 14, lineHeight: 1.9,
                          color: line.tone === "warn" ? "var(--warn)" : "var(--ink)",
                        }}>
                          {line.text}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
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
