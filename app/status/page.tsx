import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/catalog";
import {
  buyable, maintenanceRows, shopeeSubId, CATEGORY_SUB_ID,
  PRICE_FRESH_DAYS, PRICE_STALE_DAYS,
} from "@/lib/engine";
import { impactMap, overallCutRate, ruleAudit, TIER_WEIGHT, type Impact } from "@/lib/impact";

/**
 * 維護台。給 Tim 一個人看的，不給讀者、不給搜尋引擎。
 *
 * v2 的重點是**排序**，不是清單。
 *
 * 一份 300 條的待辦跟沒有待辦一樣 —— 打開就想關掉。
 * 所以先用 impactMap() 算出哪幾款其實在撐這個站，
 * 再把「今天非做不可」跟「先放著沒關係」分開，
 * 而且按賣場分組（同一家一次開一個分頁查完，不要來回跳）。
 *
 * 目標：每次打開只做最上面那一段，剩下的可以安心關掉。
 */

export const metadata: Metadata = {
  title: "維護台",
  robots: { index: false, follow: false },
};

export const revalidate = 86400;

const LEVEL = {
  dead: { bg: "var(--cut-soft)", fg: "var(--cut)", zh: "連結已死" },
  stale: { bg: "var(--warn-soft)", fg: "var(--warn)", zh: "過期" },
  aging: { bg: "var(--sunken)", fg: "var(--muted)", zh: "快過期" },
  fresh: { bg: "var(--keep-soft)", fg: "var(--keep)", zh: "新的" },
} as const;

const TIER = {
  主力: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  會被看到: { bg: "var(--sunken)", fg: "var(--muted)" },
  目前沒機會: { bg: "transparent", fg: "var(--faint)" },
} as const;

export default function Page() {
  const impact = impactMap();
  const rows = maintenanceRows(catalog).map((r) => ({
    ...r,
    impact: impact.get(r.productId) as Impact,
  }));

  /* 要做的 vs 可以放著。判準是「有沒有人看得到」加上「資料還新不新」。 */
  const todo = rows.filter(
    (r) => r.level === "dead" || (r.impact.tier !== "目前沒機會" && r.level !== "fresh"),
  );
  const later = rows.filter((r) => !todo.includes(r));

  /* 同一家賣場一次查完 —— 來回跳分頁才是真正花時間的地方 */
  const byStore = new Map<string, typeof todo>();
  for (const r of todo) byStore.set(r.label, [...(byStore.get(r.label) ?? []), r]);
  const groups = [...byStore].sort(
    (a, b) => TIER_WEIGHT[a[1][0].impact.tier] - TIER_WEIGHT[b[1][0].impact.tier],
  );

  const core = catalog.filter((p) => impact.get(p.id)?.tier === "主力");
  const idle = catalog.filter((p) => impact.get(p.id)?.tier === "目前沒機會");
  const waiting = catalog.filter((p) => p.awaitingLink);
  // 對照款是故意不賣的，不算「買不到」的問題
  const unbuyable = catalog.filter((p) => !p.referenceOnly && !p.awaitingLink && (!buyable(p) || p.discontinued));
  const noIssues = catalog.filter((p) => !p.knownIssues?.trim());
  const oldest = Math.max(0, ...rows.map((r) => r.days));
  const cut = overallCutRate();
  const audit = ruleAudit();
  const dead = audit.filter((r) => r.catches === 0);

  return (
    <main style={{ maxWidth: 940, margin: "0 auto", padding: "0 20px 120px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 36,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
        <span style={{ fontSize: 12.5, color: "var(--faint)" }}>維護台 · 不對外</span>
      </div>

      <h1 style={{ fontSize: "clamp(24px,5vw,32px)", lineHeight: 1.4, margin: "0 0 12px" }}>
        今天要處理什麼
      </h1>

      {todo.length === 0 ? (
        <div style={{ ...box, borderColor: "var(--keep)", background: "var(--keep-soft)" }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>今天沒事，可以關掉了</p>
          <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
            {catalog.length} 款、{rows.length} 條連結全部在期限內，最舊的一筆 {oldest} 天。
            另外 {idle.length} 款目前不會被推薦到，不用管。
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.9, margin: "0 0 24px", maxWidth: "48ch" }}>
            <b style={{ color: "var(--ink)" }}>{todo.length} 條</b>要處理，
            已經按賣場分好組 —— 同一家一次開一個分頁查完，不要來回跳。
            下面「先放著」那一段今天可以完全不看。
          </p>

          {groups.map(([label, items]) => (
            <div key={label} style={box}>
              <div style={{
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
                gap: 12, marginBottom: 14, flexWrap: "wrap",
              }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{label}</h2>
                <span style={{ fontSize: 13, color: "var(--faint)" }}>{items.length} 條</span>
              </div>
              {items.map((r) => (
                <div key={r.merchantId + r.productId} style={line}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{r.brand}</span>
                    {r.name}
                  </div>
                  <span className="mono" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                    {r.unit} · ${r.amount}
                  </span>
                  <Chip {...LEVEL[r.level]}>{LEVEL[r.level].zh} {r.days} 天</Chip>
                  <Chip {...TIER[r.impact.tier]}>
                    {r.impact.tier}{r.impact.picks > 0 ? ` · 主答案 ${r.impact.picks} 頁` : ""}
                  </Chip>
                  <a href={r.affiliateUrl} target="_blank" rel="noopener nofollow"
                     style={{ color: "var(--accent)", fontSize: 13.5, whiteSpace: "nowrap" }}>
                    開連結 ↗
                  </a>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* ── 這一段是重點：告訴他什麼可以不做 ── */}
      <H>可以不管的</H>
      <div style={box}>
        <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.9 }}>
          裁決器一次只給一個答案。所以商品一多，<b>多數款根本不會出現在任何人的畫面上</b> ——
          那些款的價格複不複查，沒有人會知道，也沒有人會受影響。
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Chip {...TIER["主力"]}>主力 {core.length} 款 · 要顧</Chip>
          <Chip {...TIER["會被看到"]}>會被看到 {catalog.length - core.length - idle.length} 款</Chip>
          <Chip {...TIER["目前沒機會"]}>目前沒機會 {idle.length} 款 · 先放著</Chip>
        </div>
        {idle.length > 0 && (
          <ul style={{ ...ul, marginTop: 14, color: "var(--faint)" }}>
            {idle.map((p) => <li key={p.id}>{p.brand}｜{p.name}</li>)}
          </ul>
        )}
        <p style={{ margin: "14px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
          「目前沒機會」不是說它不好，是說以現在的規則，沒有任何一個組合會推到它。
          等它有機會被推薦，它自己就會跳到上面那一段。
        </p>
      </div>

      {/* ── 這一段回答的是「下一款該進什麼」，不是「要修什麼」 ── */}
      <H>裁決器有沒有在做事</H>
      <div style={{
        ...box,
        borderColor: cut.avgKeep > 0.7 ? "var(--warn)" : "var(--line)",
        background: cut.avgKeep > 0.7 ? "var(--warn-soft)" : "var(--surface)",
      }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
          全站 {cut.pages} 頁，平均只刪掉 {Math.round((1 - cut.avgKeep) * 100)}%
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.9 }}>
          這個站的說服力來自「我們刪掉了什麼」。
          {cut.avgKeep > 0.7 ? (
            <>
              {" "}現在幾乎沒刪到東西 —— 品種頁是 {catalog.length} 進 {catalog.length} 留，
              那個刪除過程看起來就像在演。
            </>
          ) : (
            <>{" "}目前的排除幅度是合理的。</>
          )}
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>
          原因是選品全部同一種：低敏、單一蛋白、無穀、全齡。它們之間沒有對比，
          所以任何規則都刪不掉東西。<b style={{ color: "var(--ink)" }}>
          下一批該補的不是更多「好的」，是會被刪掉的那些。</b>
        </p>
      </div>

      <H>每條規則刪得掉幾款</H>
      <div style={box}>
        {audit.map((r) => (
          <div key={r.rule} style={{
            ...line,
            borderTop: "1px solid var(--line)",
            color: r.catches === 0 ? "var(--cut)" : "inherit",
          }}>
            <span className="mono" style={{ minWidth: 48, fontWeight: 700 }}>{r.catches} 款</span>
            <span style={{ flex: 1, minWidth: 160 }}>{r.rule}</span>
            {r.catches === 0 && (
              <span style={{ fontSize: 13, color: "var(--muted)", flexBasis: "100%" }}>
                要補：{r.need}
              </span>
            )}
          </div>
        ))}
        {dead.length > 0 && (
          <p style={{ margin: "14px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
            <b style={{ color: "var(--cut)" }}>{dead.length} 條規則目前是空的</b> ——
            不是規則寫錯，是選品裡缺了它本來要擋的東西。
            補進去之後，那一刀才會出現在使用者看到的「怎麼刪的」裡面。
          </p>
        )}
      </div>

      {/* ── 採購清單。連結以外的東西都做完了，這一段是唯一需要 Tim 動手的 ── */}
      <H>等你補連結的（{waiting.length} 款）</H>
      {waiting.length === 0 ? (
        <p style={ok}>沒有。選好的都上架了。</p>
      ) : (
        <>
          <p style={{ margin: "0 0 14px", fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>
            規格、成分、文案都寫好了，<b style={{ color: "var(--ink)" }}>只差分潤連結</b>。
            照下面的關鍵字去蝦皮找賣家，產生連結時把 Sub_id 填上，
            再把那一行貼進 <code style={code}>data/paste.txt</code>，跑 <code style={code}>npm run data:paste</code>。
          </p>
          {waiting.map((p) => (
            <div key={p.id} style={box}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block" }}>{p.brand}</span>
                  <b style={{ fontSize: 16.5 }}>{p.name}</b>
                </div>
                <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>{p.id}</span>
              </div>

              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <Line k="去蝦皮搜這個">
                  <span className="mono" style={{ fontSize: 14 }}>{p.searchAs ?? `${p.brand} ${p.name}`}</span>
                </Line>
                <Line k="產生連結時填">
                  <span className="mono" style={{ fontSize: 14 }}>
                    Sub id 1 = <b>{shopeeSubId(p.id)}</b>　Sub id 2 = <b>{CATEGORY_SUB_ID}</b>
                  </span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                    蝦皮這個欄位只收英數字，連字號會被擋 —— 所以是 {shopeeSubId(p.id)} 不是 {p.id}
                  </span>
                </Line>
                <Line k="挑賣家的優先順序">
                  官方直營 / 品牌旗艦 &gt; 蝦皮優選 &gt; 一般賣家 —— 官方店的連結活得久很多
                </Line>
                <Line k="一款留幾家">一到兩家就好。賣場數量直接等於維護成本</Line>
              </div>
            </div>
          ))}
        </>
      )}

      <H>整款買不到的</H>
      {unbuyable.length === 0
        ? <p style={ok}>沒有。每一款都至少還有一家能買。</p>
        : <ul style={ul}>{unbuyable.map((p) => (
            <li key={p.id}>{p.brand}｜{p.name} —— {p.discontinued ? "已標記停產" : "所有賣場都失效"}</li>
          ))}</ul>}

      <H>還沒寫「先知道這件事」的</H>
      {noIssues.length === 0
        ? <p style={ok}>都寫了。</p>
        : <ul style={ul}>{noIssues.map((p) => <li key={p.id}>{p.brand}｜{p.name}</li>)}</ul>}

      <H>先放著的（{later.length} 條）</H>
      <details>
        <summary style={{ cursor: "pointer", fontSize: 14.5, color: "var(--muted)", padding: "6px 0" }}>
          展開看全部
        </summary>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse", fontSize: 13.5 }}>
            <tbody>
              {later.map((r) => (
                <tr key={r.merchantId + r.productId} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={td}>{r.brand}｜{r.name}</td>
                  <td style={{ ...td, color: "var(--muted)" }}>{r.label}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }} className="mono">{r.unit} · ${r.amount}</td>
                  <td style={{ ...td, whiteSpace: "nowrap", color: "var(--faint)" }}>{r.days} 天</td>
                  <td style={{ ...td, color: "var(--faint)" }}>{r.impact.tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <H>規則</H>
      <ul style={ul}>
        <li>{PRICE_FRESH_DAYS} 天內查過 = 新的，價格照常顯示。</li>
        <li>超過 {PRICE_FRESH_DAYS} 天 = 快過期，卡片上多一行「這個價格是 N 天前查的」。</li>
        <li>超過 {PRICE_STALE_DAYS} 天 = 過期，明講我們把它當參考不當承諾。</li>
        <li>賣場標成 <code style={code}>mNDead=1</code>，引擎完全跳過；全部賣場都死，整款不進裁決。</li>
        <li>連結健檢在自己電腦上跑：<code style={code}>npm run links:check</code>。</li>
        <li>新增商品用貼的：把行貼進 <code style={code}>data/paste.txt</code>，跑 <code style={code}>npm run data:paste</code>。</li>
      </ul>

      <p style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>← 回裁決器</Link>
      </p>
    </main>
  );
}

function Line({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "5px 0", fontSize: 14, lineHeight: 1.8 }}>
      <span style={{ color: "var(--faint)", minWidth: "9em", fontSize: 13 }}>{k}</span>
      <span style={{ flex: 1, minWidth: 200 }}>{children}</span>
    </div>
  );
}

function Chip({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <span style={{
      background: bg, color: fg, borderRadius: 999, padding: "4px 12px",
      fontSize: 12.5, whiteSpace: "nowrap", fontWeight: 600,
      border: bg === "transparent" ? "1px solid var(--line)" : "none",
    }}>{children}</span>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 17, fontWeight: 700, margin: "40px 0 14px",
      paddingTop: 20, borderTop: "1px solid var(--line)",
    }}>{children}</h2>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px", marginBottom: 14,
};
const line: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
  padding: "12px 0", borderTop: "1px solid var(--line)", fontSize: 14.5, lineHeight: 1.6,
};
const td: React.CSSProperties = { padding: "10px 12px 10px 0", verticalAlign: "top" };
const ul: React.CSSProperties = { paddingLeft: 20, margin: 0, fontSize: 15, lineHeight: 1.95 };
const ok: React.CSSProperties = { margin: 0, fontSize: 15, color: "var(--keep)" };
const code: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", fontSize: "0.9em",
  background: "var(--sunken)", padding: "1px 5px", borderRadius: 3,
};
