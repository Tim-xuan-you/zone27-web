import Link from "next/link";
import Remind from "./Remind";
import {
  anchorOf, bagDuration, canPlan, canWord, cansOf, checkedOf, formOf, freshness, mer, sharedListings, storesOf, trialPlan,
  unitOf, unitPrice, wetMonthly,
  FRESH_DAYS, type Stage,
} from "@/lib/engine";
import { categoryOf } from "@/lib/categories";
import { priceStat, timingAdvice } from "@/lib/history";
import type { Product, Verdict } from "@/lib/types";
import { linkReport } from "@/lib/contact";
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
  stage,
  chipsLabel = "條件",
}: {
  verdict: Verdict;
  chips: { label: string; kind: "info" | "avoid" }[];
  dogKg?: number;
  /** 決定試糧要跑多久 —— 皮膚 8 週、腸胃 2 週 */
  symptoms?: string[];
  /** 生命階段。幼犬幼貓的食量接近同體重成年的兩倍，不帶會高估這包能吃幾天。 */
  stage?: Stage;
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
              這其實不是壞消息啦，硬推一款不適合的才是。可以放寬其中一個條件再試試看。
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
              <Answer p={verdict.pick} verdict={verdict} dogKg={dogKg} stage={stage} multi={shared} />
            </>
          )}

          {/* ── 換了之後會怎樣。給了答案不給後續，等於把人送到結帳頁就不管 ── */}
          {verdict.pick && (
            <>
              <p style={S.lbl}>換了之後會怎樣</p>
              <Trial p={verdict.pick} dogKg={dogKg} symptoms={symptoms} stage={stage} />
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
                  <Alt key={p.id} p={p} dogKg={dogKg} stage={stage} multi={shared} />
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
      {/* 停下來的時候（還在上架、要先看醫生）這一塊不對題：我們根本沒給選項，談不上合不合適 */}
      {!verdict.stop && (<>
      <p style={S.lbl}>都不合適？</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>換個講法再跑一次</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            多講一點通常就不一樣了，像是體重、現在吃什麼、症狀多久了。
            出貨和庫存要問賣場，牠不舒服要看醫生，<Link href="/ask" style={{ color: "var(--accent)" }}>哪個問題該問誰</Link>寫在這裡。
          </p>
        </div>
        <Link style={S.btn} href="/">回裁決器</Link>
      </div>
      </>)}
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
  // 「還在上架」不是拒絕，是還沒準備好。不打叉，也不用警告色。
  const soon = stop.kind === "soon";
  return (
    <div style={soon ? { ...S.stopBox, borderColor: "var(--line)", background: "var(--surface)" } : S.stopBox}>
      {!soon && <p style={S.stopMark}>✕</p>}
      <h2 style={S.stopTitle}>{stop.title}</h2>
      <p style={S.stopBody}>{stop.body}</p>
      <p style={S.stopNext}>{stop.next}</p>
      <div style={S.stopActions}>
        {stop.link && <Link style={S.btnSmall} href={stop.link.href}>{stop.link.label}</Link>}
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
          {verdict.survivors.length > 0 ? "款留下" : "款符合，條件太嚴格了"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 主答案                                                              */
/* ------------------------------------------------------------------ */

function Answer({
  p, verdict, dogKg, stage, multi,
}: {
  p: Product; verdict: Verdict; dogKg?: number; stage?: Stage; multi: Set<string>;
}) {
  const safe = anchorOf(p, "safe");
  const up = unitPrice(p, unitOf(p, safe), safe.amount);
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
            {unitOf(p, safe)}{up && ` · ${up}`}
          </span>
        </div>

        {freshness(checkedOf(p, safe)).note && (
          <p style={S.freshNote}>{freshness(checkedOf(p, safe)).note}</p>
        )}

        {verdict.pickReason && (
          <p style={S.answerWhy}>{verdict.pickReason}</p>
        )}

        <SpecChips p={p} />

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
        {main && <ReportLine p={p} where={whereOf(main, checkedOf(p, safe))} />}
      </div>

      <div style={S.deal}>
        <p style={S.dealHead}>✕　這款什麼時候不要買</p>
        <p style={S.dealBody}>{p.dealbreaker}</p>
      </div>

      {manyInOne(safe, multi) && (
        <p style={{ ...S.variantWarn, borderRadius: 0 }}>
          ⚠️ 這個賣場一頁多口味。點進去請自己把規格選成
          <b>「{p.name}」</b>，預設的不一定是這個喔。
        </p>
      )}

      <details style={S.detailBlock}>
        <summary style={S.detailSummary}>其他規格與價格</summary>
        <div style={{ padding: `0 ${24}px ${24}px` }}>
          <Stores p={p} dogKg={dogKg} stage={stage} />
          {p.knownIssues && <Issues text={p.knownIssues} />}
        </div>
      </details>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* 換了之後會怎樣                                                      */
/* ------------------------------------------------------------------ */

function Trial({
  p, dogKg, symptoms, stage,
}: { p: Product; dogKg?: number; symptoms?: string[]; stage?: Stage }) {
  const t = trialPlan(p, dogKg, symptoms, stage);
  const cat = p.species === "cat";
  const animal = cat ? "貓" : "狗";
  const wet = formOf(p) === "wet";
  const anchor = anchorOf(p, "safe");
  // 罐頭沒講體重就用 4 公斤算，而且標題上講出來。不講體重就什麼都不算，讀者連一天幾罐都不知道
  const cp = wet && anchor ? canPlan(p, unitOf(p, anchor), anchor.amount, dogKg ?? 4, stage) : null;
  // 一個月的錢照最省的規格算（通常是整箱），跟裁決器的預算那一刀用同一個函式
  const monthly = wet ? wetMonthly(p, mer(dogKg ?? 4, stage, p.species)) : null;
  const hasStep3 = wet ? cp !== null : t.anchorDays !== null;
  const howMuch = `/${categoryOf(p.species, formOf(p)).slug}/how-much`;

  return (
    <div style={tBox}>
      <Step n={1} title="前 7 到 10 天慢慢換">
        第 1–3 天新的加四分之一，第 4–6 天一半，第 7–10 天四分之三，之後才全換。
        一次全換掉幾乎一定會軟便。那是換糧造成的，不是牠對這款過敏。
      </Step>

      <Step n={2} title={`多久看得出來：${t.needLabel}`}>
        {t.needWhy}
      </Step>

      {wet && cp && (
        <Step n={3} title={`${dogKg ? "" : "照 4 公斤的貓算，"}全吃罐頭一天大約 ${cp.perDay} ${canWord(p)}`}>
          一{canWord(p)} {cp.kcalPerCan} 大卡。乾濕混餵的話，一天的熱量先扣掉罐頭這一份，剩下的才給乾糧。
          {monthly !== null && <> 照最省的規格算，全吃罐頭一個月大約 <b>${monthly.toLocaleString()}</b>。</>}
          <span style={tBetter}>
            要跑完 {t.needLabel}，大約要 {Math.ceil(cp.perDay * t.needDays)} {canWord(p)}。整箱買通常比較省，沒開的放得住。
          </span>
          <span style={{ ...tBetter, color: "var(--muted)" }}>
            開了沒吃完的蓋起來冰冷藏，一天內吃完。冰過的先回溫再給，很多貓不吃冷的。
          </span>
        </Step>
      )}

      {!wet && t.anchorDays !== null && (
        <Step n={3} title={`這包大約吃 ${t.anchorDays} 天`}>
          {t.needsTwoBags ? (
            <>
              週期要 {t.needDays} 天，但一包開封放超過 {FRESH_DAYS} 天油脂會氧化，
              所以這個長度本來就要分兩次買。重點是<b>不要買太小的</b>，
              還沒看出結果就斷糧，你會以為是這款沒用。
            </>
          ) : (
            <>週期要 {t.needDays} 天。這包的長度剛好夠你判斷。</>
          )}
          {t.better && (
            <span style={tBetter}>
              同一款有 <b>{t.better.unit}</b> 的，你的{animal}大約吃 {t.better.days} 天
              {t.better.savingPct !== null && t.better.savingPct >= 3
                ? `，每公斤還省 ${t.better.savingPct}%`
                : ""}
              。展開下面的「其他規格與價格」可以看到。
            </span>
          )}
        </Step>
      )}

      <Step n={hasStep3 ? 4 : 3} title="這段期間不要給零食">
        一根雞肉零食就毀了整個測試。{cat ? "肉泥、凍乾、逗貓用的小零食、人的食物" : "潔牙骨、人的食物、公園裡別人給的"}，都算。
        要測就測乾淨的，不然跑完八週你還是不知道答案。
      </Step>

      <Step n={hasStep3 ? 5 : 4} title="什麼情況要停" last>
        連續軟便超過三天、抓得比以前更兇、開始吐。
        這時候該看醫生，不是再換下一款飼料。
        {cat && (
          <>
            <br />
            <b>貓還有一條：完全不吃超過一天，就先換回原本的。</b>
            貓不吃東西撐不久，餓個兩三天可能傷到肝，這不是比耐心的時候。
          </>
        )}
      </Step>

      <Remind plan="trial" p={p} kg={dogKg} symptoms={symptoms} stage={stage} />

      <p style={tNote}>
        {!cat && (
          <>
            <Link href="/dog-food/elimination-diet" style={{ color: "var(--accent)" }}>完整的排除飲食法流程（含最多人跳過的回測）→</Link>
            <br />
          </>
        )}
        <Link href={howMuch} style={{ color: "var(--accent)" }}>
          {wet ? "想自己算一天幾罐、一個月多少錢 →" : "想自己算一天幾克、一個月多少錢 →"}
        </Link>
        <br />
        我們不是獸醫，上面是一般的換糧做法，不是診斷。
        牠一直不舒服的話，帶去看醫生比換飼料重要。
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

function Alt({ p, dogKg, stage, multi }: { p: Product; dogKg?: number; stage?: Stage; multi: Set<string> }) {
  const safe = anchorOf(p, "safe");
  const up = unitPrice(p, unitOf(p, safe), safe.amount);
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
            {unitOf(p, safe)}{up && ` · ${up}`}
          </span>
        </div>
        <SpecChips p={p} />
        {main && (
          <div style={{ ...S.buyRow, marginTop: 20 }}>
            <a
              style={S.btnSmall}
              href={`/go/${main.options[0].id}/${p.id}`}
              rel="nofollow sponsored"
            >去{main.label.replace(/（.*/, "")}買</a>
          </div>
        )}
        {main && <ReportLine p={p} where={whereOf(main, checkedOf(p, safe))} />}
      </div>

      <div style={S.deal}>
        <p style={S.dealHead}>✕　這款什麼時候不要買</p>
        <p style={S.dealBody}>{p.dealbreaker}</p>
      </div>

      {manyInOne(safe, multi) && (
        <p style={{ ...S.variantWarn, borderRadius: 0 }}>
          ⚠️ 一頁多口味，點進去請選成<b>「{p.name}」</b>
        </p>
      )}

      <details style={S.detailBlock}>
        <summary style={S.detailSummary}>其他規格與價格</summary>
        <div style={{ padding: `0 ${24}px ${24}px` }}>
          <Stores p={p} dogKg={dogKg} stage={stage} />
          {p.knownIssues && <Issues text={p.knownIssues} />}
        </div>
      </details>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* 共用零件                                                            */
/* ------------------------------------------------------------------ */

function Stores({ p, dogKg, stage }: { p: Product; dogKg?: number; stage?: Stage }) {
  const stores = storesOf(p);
  // 「吃不完」的警告整款講一次就好。一家一次的話，五家賣場就是同一段話重複五遍
  const anyTooLong = stores.some((s) =>
    s.options.some((o) => bagDuration(o.unit, dogKg, stage, p.species, p.spec.kcal, formOf(p))?.tooLong),
  );
  return (
    <>
      {stores.map((store) => {
        const notes = splitNotes(store.options.map((o) => o.note));
        return (
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
            {store.options.map((o, i) => {
              const dur = bagDuration(o.unit, dogKg, stage, p.species, p.spec.kcal, formOf(p));
              // 罐頭講「每罐」：同一款罐子一樣大，每罐省幾 % 就是每公斤省幾 %
              const per = formOf(p) === "wet" ? "每罐" : "每公斤";
              const save =
                o.savingPct === null || Math.abs(o.savingPct) < 3
                  ? o.savingPct === null ? null : { text: `${per}差不多`, tone: "faint" as const }
                  : o.savingPct > 0
                  ? { text: `${per}省 ${o.savingPct}%`, tone: "keep" as const }
                  : { text: `${per}反而貴 ${-o.savingPct}%`, tone: "cut" as const };
              const up = unitPrice(p, o.unit, o.amount);
              return (
                <div key={o.id} style={S.optRow}>
                  <div style={S.optMain}>
                    <span style={S.optUnit} className="mono">{o.unit}</span>
                    <span style={S.optAmt} className="mono">${o.amount}</span>
                    {up && (
                      <span style={S.optKg} className="mono">{up}</span>
                    )}
                  </div>
                  {(dur || save || !store.singleUrl || o.checkedAt !== p.price.checkedAt || notes.own[i]) && (
                    <div style={S.optMeta}>
                      {/* 只屬於這個規格的備註：「超取限 3 包」「限宅配」「送肉泥和抓板」 */}
                      {notes.own[i] && <span style={{ color: "var(--muted)", flexBasis: "100%" }}>{notes.own[i]}</span>}
                      {/* 備援的價格可能比較舊，照實標日期，讀者點進去以賣場為準 */}
                      {o.checkedAt !== p.price.checkedAt && (
                        <span style={{ color: "var(--faint)" }}>{o.checkedAt.slice(5).replace("-", "/")} 查的價</span>
                      )}
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

          {/* 每個規格都有的備註放這裡，只屬於某個規格的放在那一行底下 */}
          {notes.common && <p style={S.storeNote}>{notes.common}</p>}
          <ReportLine p={p} where={whereOf(store, store.options[0]?.checkedAt ?? p.price.checkedAt)} short />
        </div>
        );
      })}

      {anyTooLong && (
        <p style={S.freshWarn}>
          ⚠️ 標記的規格，你的{p.species === "cat" ? "貓" : "狗"}要吃超過 {FRESH_DAYS} 天才吃得完。開封後的乾飼料油脂會氧化，
          放久了會越來越不愛吃，很多人以為是這牌子不好，其實只是放太久了。
        </p>
      )}

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
              {advice.wait ? "現在不是好時機，建議先等等" : "現在買不吃虧"}
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

/**
 * 卡片上那一排小字。
 *
 * 乾糧：粗蛋白、碳水，照包裝。
 * 罐頭：蛋白質照罐子背面印的（讀者翻過來對得上），再加一罐幾大卡。
 * 罐頭的碳水多半算不準，這裡不放；水分比較有用，全吃罐頭的貓喝水比較少也沒關係。
 */
function SpecChips({ p }: { p: Product }) {
  if (formOf(p) === "wet") {
    const can = anchorOf(p, "safe");
    const c = cansOf(can ? unitOf(p, can) : p.price.unit);
    const perCan = p.spec.kcal && c ? Math.round((c.g / 1000) * p.spec.kcal) : null;
    return (
      <div style={S.specRow}>
        <span style={S.spec}>蛋白質 {p.spec.asFed?.protein ?? p.spec.protein}%</span>
        {p.spec.moisture !== undefined && <span style={S.spec}>水分 {p.spec.moisture}%</span>}
        {perCan !== null && <span style={S.spec}>一{canWord(p)} {perCan} 大卡</span>}
        {p.spec.singleSource && <span style={S.specGood}>單一蛋白源</span>}
      </div>
    );
  }
  return (
    <div style={S.specRow}>
      <span style={S.spec}>粗蛋白 {p.spec.protein}%</span>
      <span style={S.spec}>碳水 {p.spec.carb}%</span>
      {p.spec.singleSource && <span style={S.specGood}>單一蛋白源</span>}
    </div>
  );
}

/**
 * 同一家賣場各規格的備註，拆成「每個規格都有的」跟「只屬於這個規格的」。
 *
 * 備註是一條一條貼進來的：「全系列一頁多款 · 免運無限次 · 超取限 3 包」。
 * 以前賣場底下只秀第一個規格的備註，1.13kg 的「超取限 3 包」看起來像整家都這樣，
 * 兩包組的「送肉泥和抓板」則完全沒出現。
 */
function splitNotes(list: string[]): { common: string; own: string[] } {
  const parts = list.map((n) => n.split("·").map((x) => x.trim()).filter(Boolean));
  const common = parts[0]?.filter((x) => parts.every((p) => p.includes(x))) ?? [];
  return {
    common: common.join(" · "),
    own: parts.map((p) => p.filter((x) => !common.includes(x)).join(" · ")),
  };
}

/**
 * 「連結有問題？」那一行。
 *
 * 放在讀者發現問題的那個位置：他點進賣場發現賣完、跳到別的商品、價格差很多，
 * 回到這一頁的時候，按鈕就在剛剛那顆購買按鈕底下。信件內容自動帶好是哪一款、哪一家、哪個規格。
 */
function ReportLine({ p, where, short }: { p: Product; where: string; short?: boolean }) {
  const href = linkReport(p, where);
  if (!href) return null;
  return (
    <p style={{ margin: short ? "8px 0 0" : "10px 0 0", fontSize: 12.5, color: "var(--faint)" }}>
      <a href={href} style={{ color: "var(--faint)", textDecoration: "underline", textUnderlineOffset: 3 }}>
        {short ? "這家有問題？跟我們說" : "點進去發現賣完、或規格對不上？跟我們說"}
      </a>
    </p>
  );
}

/** 信裡「賣場」那一行：哪一家、哪幾個規格、多少錢、哪天查的價 */
function whereOf(store: { label: string; options: { unit: string; amount: number }[] }, checkedAt: string): string {
  const opts = store.options.map((o) => `${o.unit} $${o.amount}`).join("、");
  return `${store.label}｜${opts}（查價 ${checkedAt}）`;
}

/**
 * 這個賣場一頁賣很多款，要提醒讀者自己選規格。
 *
 * 兩種情況：我們有兩款共用同一條連結（程式自己看得出來），
 * 或是賣家把整個系列放在同一頁（只有我們知道，寫在備註裡的「一頁多款」）。
 * 第二種以前不會跳警告，讀者點進去，預設選到的可能是幼貓配方。
 */
function manyInOne(m: { affiliateUrl: string; note: string; sharedPage?: boolean }, multi: Set<string>): boolean {
  if (m.sharedPage) return true;
  return multi.has(m.affiliateUrl) || /一頁多款/.test(m.note);
}

function Issues({ text }: { text: string }) {
  return (
    <p style={{ ...S.reports, marginTop: 16 }}>
      <b style={{ color: "var(--muted)" }}>先知道這件事：</b>{text}
      <span style={{ display: "block", marginTop: 4, fontSize: 12 }}>
        這一欄寫的是查得到、對得上的事實，不是飼主評價的統計。
        台灣網路上這幾款的評價幾乎都是分潤文，我們不拿那種東西充數。
      </span>
    </p>
  );
}
