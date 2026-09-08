import Link from "next/link";
import {
  anchorOf, bagDuration, pricePerKg, sharedListings, storesOf, unitOf, FRESH_DAYS,
} from "@/lib/engine";
import { priceStat, timingAdvice } from "@/lib/history";
import type { Product, Verdict } from "@/lib/types";
import { S } from "./styles";

/**
 * 裁決結果。
 *
 * v1 把留下來的每一款都做成同樣大小的卡片 —— 使用者問「我該買哪個」，
 * 我們給他五張長得一樣的卡。那就是選擇癱瘓，正好是這個站說要解決的問題。
 *
 * v2 的結構是：**一個答案，很大，在最上面。其他全部收起來。**
 *
 * 展開用原生的 <details>，不用 JS —— 這樣 SSG 也能用，
 * 而且收起來的內容仍然在 HTML 裡，爬蟲讀得到。
 *
 * 另外 v1 在每次裁決後列出所有佣金百分比。那個設計收回了：
 * 幾乎沒有網站這樣做，而且他們的顧慮是對的 —— 在最需要信任的那一刻
 * 把錢推到台前，反而是在提醒對方「這個人有動機」。
 * 改成講規則（程式碼讀不到佣金欄位）與行為（我們放棄了什麼）。
 *
 * v2.1 調換順序。原本先放「怎麼刪的」再放答案 —— 在 375px 的螢幕上，
 * 使用者落地看到的是一個很高的刪除過程，答案被推到第一屏外面。
 * 不想動腦的人不會滑。答案先給，過程放後面當佐證。
 */

export default function Result({
  verdict,
  chips,
  dogKg,
  chipsLabel = "條件",
}: {
  verdict: Verdict;
  chips: { label: string; kind: "info" | "avoid" }[];
  dogKg?: number;
  chipsLabel?: string;
}) {
  const shared = sharedListings(verdict.survivors);
  const others = verdict.survivors.filter((p) => p.id !== verdict.pick?.id);

  return (
    <>
      <p style={S.lbl}>{chipsLabel}</p>
      <div style={S.parsed}>
        {chips.map((c, i) => (
          <span key={i} style={c.kind === "avoid" ? S.consNeg : S.cons}>
            {c.kind === "avoid" ? "✕ " : ""}{c.label}
          </span>
        ))}
      </div>

      {verdict.survivors.length === 0 ? (
        <>
          <Cascade verdict={verdict} />
          <div style={S.emptyBox}>
            <p style={{ margin: 0, fontWeight: 700 }}>目前沒有一款同時滿足這些條件</p>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 15 }}>
              這不是壞消息 —— 硬推一款不適合的才是。放寬其中一項，或把狀況傳 LINE 給我們。
            </p>
          </div>
        </>
      ) : (
        <>
          {/* ── 一個答案，最上面 ── */}
          {verdict.pick && (
            <>
              <p style={S.lbl}>買這個</p>
              <Answer p={verdict.pick} verdict={verdict} dogKg={dogKg} multi={shared} />
            </>
          )}

          {/* ── 備選收成一行 ── */}
          {others.length > 0 && (
            <details style={S.more}>
              <summary style={S.moreSummary}>
                <span>如果上面那個不合，還有 {others.length} 款</span>
                <span style={S.moreHint}>展開</span>
              </summary>
              <div style={S.moreBody}>
                {others.map((p) => (
                  <Alt key={p.id} p={p} dogKg={dogKg} multi={shared} />
                ))}
              </div>
            </details>
          )}

          {/* ── 過程放後面：想知道憑什麼的人才會看到這裡 ── */}
          <p style={S.lbl}>為什麼是這款</p>
          <Cascade verdict={verdict} />
        </>
      )}

      <p style={S.lbl}>還是選不出來</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把你毛孩的狀況直接傳給我們</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            年齡、體重、現在吃什麼牌子、皮膚的照片。我們的人會看，不是罐頭回覆。
          </p>
        </div>
        <Link style={S.btn} href="/">回裁決器</Link>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 刪除過程                                                            */
/* ------------------------------------------------------------------ */

function Cascade({ verdict }: { verdict: Verdict }) {
  return (
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
  );
}

/* ------------------------------------------------------------------ */
/* 主答案                                                              */
/* ------------------------------------------------------------------ */

function Answer({
  p, verdict, dogKg, multi,
}: {
  p: Product; verdict: Verdict; dogKg?: number; multi: Set<string>;
}) {
  const safe = anchorOf(p, "safe");
  const perKg = pricePerKg(unitOf(p, safe), safe.amount);
  const stores = storesOf(p);
  const main = stores[0];

  return (
    <article style={S.answer}>
      <div style={S.answerBody}>
        <span style={S.brand}>{p.brand}</span>
        <h2 style={S.answerName}>{p.name}</h2>

        <div style={S.priceRow}>
          <span style={S.price} className="mono">${safe.amount}</span>
          <span style={S.perKg} className="mono">
            {unitOf(p, safe)}{perKg !== null && ` · $${perKg}/kg`}
          </span>
        </div>

        {verdict.pickReason && (
          <p style={S.answerWhy}>{verdict.pickReason}</p>
        )}

        <div style={S.specRow}>
          <span style={S.spec}>粗蛋白 {p.spec.protein}%</span>
          <span style={S.spec}>碳水 {p.spec.carb}%</span>
          {p.spec.singleSource && <span style={S.specGood}>單一蛋白源</span>}
        </div>

        {main && (
          <div style={S.buyRow}>
            <a
              style={S.btnBuy}
              href={`/go/${main.options[0].id}/${p.id}`}
              rel="nofollow sponsored"
            >
              去{main.label.replace(/（.*/, "")}買
            </a>
            <span style={S.buyNote}>{main.options[0].note || main.label}</span>
          </div>
        )}
      </div>

      <div style={S.deal}>
        <span>✕</span>
        <span><b>不要買，如果：</b>{p.dealbreaker}</span>
      </div>

      {multi.has(safe.affiliateUrl) && (
        <p style={{ ...S.variantWarn, borderRadius: 0 }}>
          ⚠️ 這個賣場一頁多口味。點進去請自己把規格選成
          <b>「{p.name}」</b>—— 預設可能不是這個。
        </p>
      )}

      <details style={S.detailBlock}>
        <summary style={S.detailSummary}>其他規格與價格</summary>
        <div style={{ padding: `0 ${24}px ${24}px` }}>
          <Stores p={p} dogKg={dogKg} />
          {p.knownIssues && <Issues text={p.knownIssues} />}
        </div>
      </details>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* 備選                                                                */
/* ------------------------------------------------------------------ */

function Alt({ p, dogKg, multi }: { p: Product; dogKg?: number; multi: Set<string> }) {
  const safe = anchorOf(p, "safe");
  const perKg = pricePerKg(unitOf(p, safe), safe.amount);
  const stores = storesOf(p);
  const main = stores[0];

  return (
    <article style={S.card}>
      <div style={S.cardH}>
        <span style={S.brand}>{p.brand}</span>
        <h3 style={S.pname}>{p.name}</h3>
        <div style={S.priceRow}>
          <span style={{ ...S.price, fontSize: 22 }} className="mono">${safe.amount}</span>
          <span style={S.perKg} className="mono">
            {unitOf(p, safe)}{perKg !== null && ` · $${perKg}/kg`}
          </span>
        </div>
        <div style={S.specRow}>
          <span style={S.spec}>粗蛋白 {p.spec.protein}%</span>
          <span style={S.spec}>碳水 {p.spec.carb}%</span>
          {p.spec.singleSource && <span style={S.specGood}>單一蛋白源</span>}
        </div>
        {main && (
          <div style={{ ...S.buyRow, marginTop: 20 }}>
            <a
              style={S.btnSmall}
              href={`/go/${main.options[0].id}/${p.id}`}
              rel="nofollow sponsored"
            >去{main.label.replace(/（.*/, "")}買</a>
          </div>
        )}
      </div>

      <div style={S.deal}>
        <span>✕</span>
        <span><b>不要買，如果：</b>{p.dealbreaker}</span>
      </div>

      {multi.has(safe.affiliateUrl) && (
        <p style={{ ...S.variantWarn, borderRadius: 0 }}>
          ⚠️ 一頁多口味，點進去請選成<b>「{p.name}」</b>
        </p>
      )}

      <details style={S.detailBlock}>
        <summary style={S.detailSummary}>其他規格與價格</summary>
        <div style={{ padding: `0 ${24}px ${24}px` }}>
          <Stores p={p} dogKg={dogKg} />
          {p.knownIssues && <Issues text={p.knownIssues} />}
        </div>
      </details>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* 共用零件                                                            */
/* ------------------------------------------------------------------ */

function Stores({ p, dogKg }: { p: Product; dogKg?: number }) {
  return (
    <>
      {storesOf(p).map((store) => (
        <div key={store.label} style={S.store}>
          <div style={S.storeHead}>
            <span style={S.storeName}>{store.label}</span>
            {store.singleUrl && (
              <a
                style={S.btnSmall}
                href={`/go/${store.options[0].id}/${p.id}`}
                rel="nofollow sponsored"
              >前往賣場</a>
            )}
          </div>

          <div style={S.optList}>
            {store.options.map((o) => {
              const dur = bagDuration(o.unit, dogKg);
              const save =
                o.savingPct === null || Math.abs(o.savingPct) < 3
                  ? o.savingPct === null ? null : { text: "每公斤差不多", tone: "faint" as const }
                  : o.savingPct > 0
                  ? { text: `每公斤省 ${o.savingPct}%`, tone: "keep" as const }
                  : { text: `每公斤反而貴 ${-o.savingPct}%`, tone: "cut" as const };
              return (
                <div key={o.id} style={S.optRow}>
                  <div style={S.optMain}>
                    <span style={S.optUnit} className="mono">{o.unit}</span>
                    <span style={S.optAmt} className="mono">${o.amount}</span>
                    {o.perKg !== null && (
                      <span style={S.optKg} className="mono">${o.perKg}/kg</span>
                    )}
                  </div>
                  {(dur || save || !store.singleUrl) && (
                    <div style={S.optMeta}>
                      {dur && (
                        <span style={{ color: dur.tooLong ? "var(--cut)" : "var(--faint)" }}>
                          約 {dur.days} 天{dur.tooLong ? " ⚠" : ""}
                        </span>
                      )}
                      {save && (
                        <span style={{ color: `var(--${save.tone})` }}>{save.text}</span>
                      )}
                      {!store.singleUrl && (
                        <a
                          style={{ ...S.btnSmall, marginLeft: "auto" }}
                          href={`/go/${o.id}/${p.id}`}
                          rel="nofollow sponsored"
                        >前往</a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {store.options.some((o) => bagDuration(o.unit, dogKg)?.tooLong) && (
            <p style={S.freshWarn}>
              ⚠️ 標記的規格，你的狗要吃超過 {FRESH_DAYS} 天才吃得完。開封後的乾飼料油脂會氧化，
              放久了狗會越來越不愛吃 —— 很多人以為是「這牌子不好」，其實是放太久。
            </p>
          )}

          {store.options[0]?.note && (
            <p style={S.storeNote}>{store.options[0].note}</p>
          )}
        </div>
      ))}

      {(() => {
        const safe = anchorOf(p, "safe");
        const stat = priceStat(p.id, safe.amount);
        if (!stat) return null;
        const advice = timingAdvice(stat, safe.amount);
        return (
          <div style={{
            ...S.store, marginTop: 12,
            borderColor: advice.wait ? "var(--warn)" : "var(--keep)",
            background: advice.wait ? "var(--warn-soft)" : "var(--keep-soft)",
          }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
              {advice.wait ? "現在不是好時機 — 建議等" : "現在買不吃虧"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--muted)" }}>
              {advice.verdict}
            </p>
          </div>
        );
      })()}
    </>
  );
}

function Issues({ text }: { text: string }) {
  return (
    <p style={{ ...S.reports, marginTop: 16 }}>
      <b style={{ color: "var(--muted)" }}>飼主常提到：</b>{text}
      <span style={{ display: "block", marginTop: 4, fontSize: 12 }}>
        整理自公開評價與討論區，不是系統性統計。
      </span>
    </p>
  );
}
