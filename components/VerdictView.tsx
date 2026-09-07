import Link from "next/link";
import { anchorOf, auditCommission } from "@/lib/engine";
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
}: {
  verdict: Verdict;
  chips: { label: string; kind: "info" | "avoid" }[];
}) {
  const audit = auditCommission(verdict);

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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {verdict.survivors.map((p) => {
              const isPick = p.id === verdict.pick?.id;
              const safe = anchorOf(p, "safe");
              const value = anchorOf(p, "value");
              return (
                <article key={p.id} style={{ ...S.card, ...(isPick ? S.cardPick : {}) }}>
                  <div style={S.cardH}>
                    <span style={S.thumb}>{isPick ? "🥇" : "🐾"}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={S.cardR1}>
                        <h3 style={{ ...S.pname, margin: 0 }}>{p.brand}｜{p.name}</h3>
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
                      <span style={S.checked} className="mono">{p.price.checkedAt} 查得</span>
                    </span>
                  </div>

                  <div style={S.deal}>
                    <span>✕</span>
                    <span><b>不要買，如果：</b>{p.dealbreaker}</span>
                  </div>

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
                            <span style={S.anchN}>
                              ${value.amount} · 省 ${safe.amount - value.amount} · {value.note}
                            </span>
                          </span>
                          <a style={S.btnGhost} href={`/go/${value.id}/${p.id}`} rel="nofollow sponsored">前往</a>
                        </div>
                      )}
                      {(() => {
                        /* 第三錨點：現在該不該買。
                           紀錄不滿 7 天就不顯示 —— 樣本太小的「史低」是誤導，
                           而誤導比沒有資訊糟糕得多。 */
                        const stat = priceStat(p.id, value.amount);
                        if (!stat) return null;
                        const advice = timingAdvice(stat, value.amount);
                        return (
                          <div style={{
                            ...S.anch,
                            borderColor: advice.wait ? "var(--warn)" : "var(--keep)",
                            background: advice.wait ? "var(--warn-soft)" : "var(--keep-soft)",
                          }}>
                            <span>
                              <span style={{ ...S.anchK, color: advice.wait ? "var(--warn)" : "var(--keep)" }} className="mono">
                                最佳時機
                              </span>
                              <span style={S.anchV}>
                                {advice.wait ? "現在不是好時機 — 建議等" : "現在買不吃虧"}
                              </span>
                              <span style={{ ...S.anchN, color: advice.wait ? "var(--warn)" : "var(--muted)" }}>
                                {advice.verdict}
                              </span>
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                    <p style={S.reports}>
                      {p.reports.total} 位飼主回報中，{p.reports.palatability} 位反映適口性差、
                      {p.reports.looseStool} 位反映軟便。
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {audit && (
            <div style={{ ...S.emptyBox, background: "var(--keep-soft)", borderColor: "var(--keep)" }}>
              <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "var(--keep)", fontWeight: 700 }}>
                ✓ 排序沒看佣金
              </p>
              <p style={{ margin: 0, fontSize: 13.5 }}>
                我們只看四件事：有沒有踩到過敏原、營養組成在不在建議區間、是不是單一蛋白源、
                其他飼主回報好不好吃。
                {audit.pickIsHighest === false && (
                  <> 本次佣金最高的是 {audit.highest}%，<b>我們推的這款是 {audit.pickRate}%</b>。</>
                )}
              </p>
            </div>
          )}
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
