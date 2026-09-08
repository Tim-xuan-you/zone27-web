import Link from "next/link";
import { FRESH_DAYS, anchorOf, auditCommission, commissionLine, bagDuration, pricePerKg, sharedListings, storesOf, unitOf } from "@/lib/engine";
import { priceStat, timingAdvice } from "@/lib/history";
import type { Verdict } from "@/lib/types";
import { S } from "./styles";

/**
 * 裁決結果的伺服器端呈現。
 *
 * 這個元件存在的唯一理由：**Google 和 AI 必須讀得到內容**。
 * 純前端篩選器只會被爬蟲看到一個空 div，可索引內容為零。
 * 所以每一個決策組合都是一個 SSG 的實體網址，內容是真的 HTML。
 */
export default function VerdictView({
  verdict,
  chips,
  dogKg,
}: {
  verdict: Verdict;
  chips: { label: string; kind: "info" | "avoid" }[];
  /** 用來估「這包吃得完嗎」。沒有就不顯示 —— 猜一個數字比不講更糟。 */
  dogKg?: number;
}) {
  const audit = auditCommission(verdict);
  // 哪些連結被多款商品共用 —— 蝦皮一頁多口味，使用者點進去要自己選
  const shared = sharedListings(verdict.survivors);

  return (
    <>
      <p style={S.lbl}>條件</p>
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
            {verdict.survivors.length > 0 ? "款留下" : "款符合 —— 條件太嚴格"}
          </span>
        </div>
      </div>

      {verdict.survivors.length === 0 ? (
        <div style={S.emptyBox}>
          <p style={{ margin: 0, fontWeight: 700 }}>目前沒有一款同時滿足這些條件</p>
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
                  <div style={S.cardH}>
                    <div style={S.rankRow}>
                      <span style={S.rank} className="mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {isPick && <span style={S.badgeBest} className="mono">唯一推薦</span>}
                    </div>
                    <span style={S.brand}>{p.brand}</span>
                    <h3 style={S.pname}>{p.name}</h3>
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
                  </div>

                  <div style={S.deal}>
                    <span>✕</span>
                    <span><b>不要買，如果：</b>{p.dealbreaker}</span>
                  </div>

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
                                      const d = bagDuration(o.unit, dogKg);
                                      if (!d) return null;
                                      return (
                                        <span style={{
                                          ...S.dur,
                                          color: d.tooLong ? "var(--cut)" : "var(--faint)",
                                        }}>
                                          約 {d.days} 天{d.tooLong ? " ⚠" : ""}
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

                    {(() => {
                      /* 現在該不該買。紀錄不滿 7 天就不顯示 ——
                         樣本太小的「史低」是誤導，而誤導比沒有資訊糟糕得多。 */
                      const stat = priceStat(p.id, safe.amount);
                      if (!stat) return null;
                      const advice = timingAdvice(stat, safe.amount);
                      return (
                        <div style={{
                          ...S.store,
                          marginTop: 9,
                          borderColor: advice.wait ? "var(--warn)" : "var(--keep)",
                          background: advice.wait ? "var(--warn-soft)" : "var(--keep-soft)",
                        }}>
                          <span style={{ ...S.anchK, color: advice.wait ? "var(--warn)" : "var(--keep)" }} className="mono">
                            最佳時機
                          </span>
                          <span style={S.anchV}>
                            {advice.wait ? "現在不是好時機 — 建議等" : "現在買不吃虧"}
                          </span>
                          <span style={{ ...S.anchN, color: advice.wait ? "var(--warn)" : "var(--muted)" }}>
                            {advice.verdict}
                          </span>
                        </div>
                      );
                    })()}
                    {multi && (
                      <p style={S.variantWarn}>
                        ⚠️ 這個賣場一頁多口味。點進去請自己把規格選成
                        <b>「{p.name}」</b>—— 預設可能不是這個。
                      </p>
                    )}
                    <p style={S.reports}>
                      {p.reports.total > 0
                        ? `${p.reports.total} 位飼主回報中，${p.reports.palatability} 位反映適口性差、${p.reports.looseStool} 位反映軟便。`
                        : "這款我們還沒整理飼主回報。有買過的話，歡迎把心得傳 LINE 給我們。"}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {audit && (() => {
            const line = commissionLine(audit);
            return (
              <div style={{
                ...S.emptyBox,
                background: line.tone === "warn" ? "var(--warn-soft)" : "var(--keep-soft)",
                borderColor: line.tone === "warn" ? "var(--warn)" : "var(--keep)",
              }}>
                <p style={{
                  margin: "0 0 12px", fontSize: 13.5, fontWeight: 600,
                  color: line.tone === "warn" ? "var(--warn)" : "var(--keep)",
                }}>
                  排序沒看佣金
                </p>
                <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.9 }}>
                  我們只看四件事：有沒有踩到過敏原、營養組成在不在建議區間、
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
            );
          })()}
        </>
      )}

      <p style={S.lbl}>還是選不出來</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 16.5 }}>把你毛孩的狀況直接傳給我們</h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)" }}>
            年齡、體重、現在吃什麼牌子、皮膚的照片。我們的人會看，不是罐頭回覆。
          </p>
        </div>
        <Link style={S.btn} href="/">回裁決器</Link>
      </div>
    </>
  );
}
