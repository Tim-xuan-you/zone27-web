"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CheckItem, CheckStatus } from "@/lib/check";
import { STAMP, STAMP_LINE } from "@/lib/chicken";
import { CONTACT } from "@/lib/contact";
import { CatIcon, DogIcon } from "./Icons";
import Share from "./Share";

/**
 * 你家那包有沒有藏雞：打名字篩、點開看。
 *
 * 清單整張在伺服器就畫好（每一款都是 <details>），搜尋引擎讀得到「XX 有雞嗎」的答案；
 * 瀏覽器這邊只負責篩選、還有打開朋友傳來的那一款（/check#cf-07）。
 */

// 標章的字、顏色、那一句話，全站共用一份（lib/chicken.ts）
const BADGE = STAMP;
const LINE = STAMP_LINE;

export default function Checker({ items }: { items: CheckItem[] }) {
  const [q, setQ] = useState("");
  const [sp, setSp] = useState<"all" | "dog" | "cat">("all");
  // 對雞過敏的人最想知道的是「那到底哪些能吃」：一鍵只看沒有雞的
  const [only, setOnly] = useState<"all" | "hidden" | "clean">("all");

  // 朋友傳來 /check#cf-07：打開那一款、捲過去
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el instanceof HTMLDetailsElement) {
      el.open = true;
      requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
    }
  }, []);

  const byName = useMemo(() => {
    const tokens = q.toLowerCase().split(/[\s,，、]+/).filter(Boolean);
    return items.filter((x) => tokens.every((t) => `${x.brand} ${x.name}`.toLowerCase().includes(t)));
  }, [items, q]);
  const shown = byName.filter((x) => (sp === "all" || x.species === sp) && (only === "all" || x.status === only));

  // 同一類裡，藏雞的排最前面：這一頁要講的就是這件事。名字就寫了雞的最沒意外，放最後
  const ORDER: CheckStatus[] = ["hidden", "fat", "unsure", "clean", "chicken"];
  const groups = [...new Set(items.map((x) => x.cat))].map((cat) => ({
    cat,
    list: shown.filter((x) => x.cat === cat).sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status)),
  }));

  return (
    <>
      <div style={searchBox}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="打品牌或名字，像「ACANA 鴨」「汪喵」"
          aria-label="搜尋飼料"
          style={input}
        />
      </div>
      {/* 按鈕不跟著搜尋框黏在上面：手機上黏住的區塊太高，會擋住清單 */}
      <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
        {([["all", "全部"], ["dog", "狗"], ["cat", "貓"]] as const).map(([k, zh]) => (
          <button key={k} type="button" onClick={() => setSp(k)} aria-pressed={sp === k} style={sp === k ? { ...chip, ...chipOn } : chip}>
            {k === "dog" && <DogIcon size={15} />}
            {k === "cat" && <CatIcon size={15} />}
            {zh}
          </button>
        ))}
        <span style={{ width: 1, background: "var(--line)", margin: "4px 2px" }} aria-hidden />
        {/* 點一下只看那一種，再點一次回到全部 */}
        {([["hidden", "只看藏雞的"], ["clean", "只看沒有雞的"]] as const).map(([k, zh]) => (
          <button key={k} type="button" onClick={() => setOnly(only === k ? "all" : k)} aria-pressed={only === k} style={only === k ? { ...chip, ...chipOn } : chip}>
            {only === k ? "✓ " : ""}{zh}
          </button>
        ))}
      </div>

      {groups.map((g) => g.list.length > 0 && (
        <section key={g.cat} style={{ marginTop: 26 }}>
          <p style={groupHead}>{g.cat}</p>
          <div style={{ display: "grid", gap: 8 }}>
            {g.list.map((x) => <Row key={x.id} x={x} />)}
          </div>
        </section>
      ))}

      {/* 名字對得到，只是被上面的篩選藏起來了：不能講成「還沒讀過」 */}
      {shown.length === 0 && byName.length > 0 && (
        <div style={emptyBox}>
          <p style={{ margin: 0, fontWeight: 700 }}>有這一款，只是被上面的篩選藏起來了</p>
          <button type="button" onClick={() => { setSp("all"); setOnly("all"); }} style={{ ...chip, marginTop: 12 }}>清掉篩選</button>
        </div>
      )}

      {byName.length === 0 && (
        <div style={emptyBox}>
          <p style={{ margin: 0, fontWeight: 700 }}>這一包我們還沒讀過</p>
          <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
            把名字寄給我們，我們去讀成分表，讀完放上來。越多人問的越先讀。
          </p>
          {CONTACT.email && (
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`請讀這一包：${q}`)}&body=${encodeURIComponent(`我家在吃：${q}\n（可以的話，附上包裝背面成分表的照片）`)}`}
              style={{ display: "inline-block", marginTop: 12, color: "var(--accent)", fontWeight: 700 }}
            >
              寄給我們 →
            </a>
          )}
        </div>
      )}
    </>
  );
}

function Row({ x }: { x: CheckItem }) {
  const b = BADGE[x.status];
  return (
    <details id={x.id} style={row}>
      <summary style={summary}>
        <span style={{ ...badge, color: b.fg, background: b.bg }}>{b.zh}</span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{x.brand}</span>
          <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.5 }}>{x.name}</span>
        </span>
      </summary>
      <div style={body}>
        <p style={{ margin: 0, fontWeight: 700, color: b.fg === "var(--muted)" ? "var(--ink)" : b.fg }}>{LINE[x.status]}</p>
        <p style={meatLine}>
          名字上寫：{x.nameMeats || "沒寫是什麼肉"}
          <br />
          成分表裡：{x.meats}
        </p>
        {x.found && x.found.length > 0 && (
          <ul style={foundList}>
            {x.found.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        )}
        {x.verdict && <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.8, color: "var(--muted)" }}>{x.verdict}</p>}

        {x.status !== "clean" && x.alts && x.alts.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <p style={{ margin: "0 0 6px", fontSize: 13.5, fontWeight: 700, color: "var(--keep)" }}>完全不含雞、我們讀過的：</p>
            {x.alts.map((a) => (
              <Link key={a.id} href={a.href} style={altRow}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{a.brand} </span>
                  <span style={{ fontWeight: 700 }}>{a.name}</span>
                </span>
                <span className="mono" style={{ fontSize: 13, color: "var(--keep)", whiteSpace: "nowrap" }}>
                  {a.per ? `$${a.per}/kg` : ""} ›
                </span>
              </Link>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 14 }}>
          {x.status === "clean" && x.buyId ? (
            <a href={`/go/${x.buyId}/${x.id}`} rel="nofollow sponsored" style={buy}>去蝦皮看</a>
          ) : null}
          <Link href={x.href} style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>看這一款的完整說明 →</Link>
          <Share
            path={`/check#${x.id}`}
            text={`${x.brand} ${x.name}：${BADGE[x.status].zh}。${LINE[x.status]}`}
            label="傳給朋友"
          />
        </div>
      </div>
    </details>
  );
}

const searchBox: React.CSSProperties = {
  position: "sticky", top: 0, zIndex: 2, background: "var(--ground)", padding: "12px 0 6px",
};
const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", font: "inherit", fontSize: 16, padding: "14px 16px",
  borderRadius: 14, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)",
};
const chip: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", font: "inherit", fontSize: 14,
  padding: "6px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--muted)",
};
const chipOn: React.CSSProperties = { borderColor: "var(--accent)", color: "var(--accent)", background: "var(--accent-soft)", fontWeight: 700 };
const groupHead: React.CSSProperties = { margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em" };
const row: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14 };
const summary: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", listStyle: "none",
};
const badge: React.CSSProperties = {
  flex: "none", minWidth: 64, textAlign: "center", fontSize: 13, fontWeight: 800, padding: "5px 8px", borderRadius: 8,
};
const body: React.CSSProperties = { padding: "4px 16px 16px", borderTop: "1px solid var(--line)", paddingTop: 14, fontSize: 15, lineHeight: 1.8 };
const meatLine: React.CSSProperties = { margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.8 };
const foundList: React.CSSProperties = { margin: "8px 0 0", paddingLeft: 20, fontSize: 14, lineHeight: 1.8 };
const altRow: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "8px 0",
  borderTop: "1px solid var(--line)", textDecoration: "none", color: "inherit", fontSize: 14,
};
const buy: React.CSSProperties = {
  display: "inline-block", padding: "8px 18px", borderRadius: 999, background: "var(--accent)", color: "var(--accent-ink)",
  fontWeight: 700, fontSize: 14, textDecoration: "none",
};
const emptyBox: React.CSSProperties = {
  marginTop: 24, background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 20px",
};
