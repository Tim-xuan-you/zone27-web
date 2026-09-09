import Link from "next/link";
import {
  anchorOf, bagDuration, freshness, pricePerKg, sharedListings, storesOf, trialPlan, unitOf,
  FRESH_DAYS,
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
  symptoms,
  chipsLabel = "條件",
}: {
  verdict: Verdict;
  chips: { label: string; kind: "info" | "avoid" }[];
  dogKg?: number;
  /** 決定試糧要跑多久 —— 皮膚 8 週、腸胃 2 週 */
  symptoms?: string[];
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

      {/* 讀到了但幫不上的，講出來。靜靜吞掉會讓人以為我們考慮過了。 */}
      {verdict.unusedSignals && verdict.unusedSignals.length > 0 && (
        <ul style={S.unusedList}>
          {verdict.unusedSignals.map((t, i) => (
            <li key={i} style={S.unusedItem}>{t}</li>
          ))}
        </ul>
      )}

      {verdict.stop ? (
        <StopBox stop={verdict.stop} />
      ) : verdict.survivors.length === 0 ? (
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
          {verdict.notice && (
            <p style={S.noticeBar}>{verdict.notice}</p>
          )}

          {/* ── 一個答案，最上面 ── */}
          {verdict.pick && (
            <>
              <p style={S.lbl}>買這個</p>
              <Answer p={verdict.pick} verdict={verdict} dogKg={dogKg} multi={shared} />
            </>
          )}

          {/* ── 換了之後會怎樣。給了答案不給後續，等於把人送到結帳頁就不管 ── */}
          {verdict.pick && (
            <>
              <p style={S.lbl}>換了之後會怎樣</p>
              <Trial p={verdict.pick} dogKg={dogKg} symptoms={symptoms} />
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

      {/* 這裡曾經是「把狀況傳給我們，我們的人會看」——
          一個一人網站守不住的承諾，而且按鈕還是回首頁。
          改成告訴他下一步自己怎麼走：換個講法、或者去問真正答得了的人。
          零人力，而且比一個三天才回的訊息管道有用。 */}
      <p style={S.lbl}>都不合適？</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>換個講法再跑一次</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            多講一點通常就不一樣了 —— 體重、現在吃什麼、症狀多久了。
            出貨和庫存要問賣場，牠不舒服要看醫生，<Link href="/ask" style={{ color: "var(--accent)" }}>哪個問題該問誰</Link>寫在這裡。
          </p>
        </div>
        <Link style={S.btn} href="/">回裁決器</Link>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 不回答                                                              */
/*                                                                    */
/* 這一塊出現的時候，畫面上不會有任何商品。                            */
/*                                                                    */
/* 一個導購站主動說「這題我不該賣你東西」，看起來像放棄一筆生意，     */
/* 但那正是整個站唯一真正值錢的東西。願意在這裡收手的人，             */
/* 講其他話才有人信。                                                  */
/* ------------------------------------------------------------------ */

function StopBox({ stop }: { stop: NonNullable<Verdict["stop"]> }) {
  return (
    <div style={S.stopBox}>
      <p style={S.stopMark}>✕</p>
      <h2 style={S.stopTitle}>{stop.title}</h2>
      <p style={S.stopBody}>{stop.body}</p>
      <p style={S.stopNext}>{stop.next}</p>
      <div style={S.stopActions}>
        <Link style={S.btnSmall} href="/dog-food">看我們有的狗飼料</Link>
        <Link style={S.btnSmall} href="/ask">哪個問題該問誰</Link>
      </div>
    </div>
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

        {freshness(p.price.checkedAt).note && (
          <p style={S.freshNote}>{freshness(p.price.checkedAt).note}</p>
        )}

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
        <p style={S.dealHead}>✕　這款什麼時候不要買</p>
        <p style={S.dealBody}>{p.dealbreaker}</p>
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
/* 換了之後會怎樣                                                      */
/* ------------------------------------------------------------------ */

function Trial({ p, dogKg, symptoms }: { p: Product; dogKg?: number; symptoms?: string[] }) {
  const t = trialPlan(p, dogKg, symptoms);

  return (
    <div style={tBox}>
      <Step n={1} title="前 7 到 10 天慢慢換">
        第 1–3 天新的加四分之一，第 4–6 天一半，第 7–10 天四分之三，之後才全換。
        整包直接換掉幾乎一定軟便 —— 那是換糧造成的，不是牠對這款過敏。
      </Step>

      <Step n={2} title={`多久看得出來：${t.needLabel}`}>
        {t.needWhy}
      </Step>

      {t.anchorDays !== null && (
        <Step n={3} title={`這包大約吃 ${t.anchorDays} 天`}>
          {t.needsTwoBags ? (
            <>
              週期要 {t.needDays} 天，但一包開封放超過 {FRESH_DAYS} 天油脂會氧化，
              所以這個長度本來就要分兩次買。重點是<b>不要買太小的</b> ——
              還沒看出結果就斷糧，你會以為是這款沒用。
            </>
          ) : (
            <>週期要 {t.needDays} 天。這包的長度剛好夠你判斷。</>
          )}
          {t.better && (
            <span style={tBetter}>
              同一款有 <b>{t.better.unit}</b> 的，你的狗大約吃 {t.better.days} 天
              {t.better.savingPct !== null && t.better.savingPct >= 3
                ? `，每公斤還省 ${t.better.savingPct}%`
                : ""}
              。展開下面的「其他規格與價格」可以看到。
            </span>
          )}
        </Step>
      )}

      <Step n={t.anchorDays !== null ? 4 : 3} title="這段期間不要給零食">
        一根雞肉零食就毀了整個測試。潔牙骨、人的食物、公園裡別人給的，都算。
        要測就測乾淨的，不然跑完八週你還是不知道答案。
      </Step>

      <Step n={t.anchorDays !== null ? 5 : 4} title="什麼情況要停" last>
        連續軟便超過三天、抓得比以前更兇、開始吐。
        這時候該看醫生，不是再換下一款飼料。
      </Step>

      <p style={tNote}>
        <Link href="/dog-food/elimination-diet" style={{ color: "var(--accent)" }}>完整的排除飲食法流程（含最多人跳過的回測）→</Link>
        <br />
        <Link href="/dog-food/how-much" style={{ color: "var(--accent)" }}>想自己算一天幾克、一個月多少錢 →</Link>
        <br />
        我們不是獸醫。上面是一般的換糧做法，不是診斷 ——
        牠一直不舒服，帶去看醫生比換飼料重要。
      </p>
    </div>
  );
}

function Step({
  n, title, children, last,
}: { n: number; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ ...tStep, ...(last ? { borderBottom: 0, paddingBottom: 0 } : null) }}>
      <span style={tNum} className="mono">{n}</span>
      <div>
        <p style={tTitle}>{title}</p>
        <p style={tBody}>{children}</p>
      </div>
    </div>
  );
}

const tBox: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "22px 22px 18px",
};

const tStep: React.CSSProperties = {
  display: "flex", gap: 14, alignItems: "flex-start",
  paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--line)",
};

const tNum: React.CSSProperties = {
  flexShrink: 0, width: 24, height: 24, borderRadius: 999,
  background: "var(--accent-soft)", color: "var(--accent)",
  fontSize: 12.5, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
  marginTop: 2,
};

const tTitle: React.CSSProperties = {
  margin: "0 0 5px", fontSize: 15.5, fontWeight: 700, lineHeight: 1.6,
};

const tBody: React.CSSProperties = {
  margin: 0, fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9,
};

const tBetter: React.CSSProperties = {
  display: "block", marginTop: 8, fontSize: 14.5,
  color: "var(--keep)", lineHeight: 1.9,
};

const tNote: React.CSSProperties = {
  margin: "18px 0 0", paddingTop: 14, borderTop: "1px solid var(--line)",
  fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85,
};

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
        <p style={S.dealHead}>✕　這款什麼時候不要買</p>
        <p style={S.dealBody}>{p.dealbreaker}</p>
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
      <b style={{ color: "var(--muted)" }}>先知道這件事：</b>{text}
      <span style={{ display: "block", marginTop: 4, fontSize: 12 }}>
        這一欄寫的是查得到、對得上的事實 —— 不是飼主評價統計。
        台灣網路上這幾款的評價幾乎都是分潤文，我們不拿那種東西充數。
      </span>
    </p>
  );
}
