import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import Share from "@/components/Share";
import { CONTACT } from "@/lib/contact";
import { CHANNEL_NOTE, channelOf } from "@/lib/channel";
import {
  litters, litterById, MATERIAL_ZH, FLUSH, FLUSH_LINE, flushGap,
  anchorLitter, liveOf, monthlyCost, unitPriceOf,
} from "@/lib/litter";

export function generateStaticParams() {
  return litters.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = litterById(id);
  if (!p) return {};
  const f = FLUSH[p.spec.flushable];
  return {
    title: `${p.brand} ${p.name}`,
    description: `${f.zh}。${MATERIAL_ZH[p.spec.material]}，${FLUSH_LINE[p.spec.flushable]}`,
    alternates: { canonical: `/cat-litter/p/${p.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = litterById(id);
  if (!p) notFound();

  const f = FLUSH[p.spec.flushable];
  const gap = flushGap(p);
  const m = anchorLitter(p);
  const live = liveOf(p);
  const per = m ? unitPriceOf(p, m) : null;
  const month = m ? monthlyCost(p, m) : null;
  const dustZh = p.spec.dust ? { low: "少", medium: "中等", high: "多" }[p.spec.dust] : null;
  const grainZh = p.spec.grain ? { fine: "細", medium: "中", coarse: "粗" }[p.spec.grain] : null;

  return (
    <main style={S.page}>
      <SiteHeader current="cat-litter" />

      <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</p>
      <h1 style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.45, margin: "0 0 14px" }}>{p.name}</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: f.fg, background: f.bg, borderRadius: 8, padding: "5px 12px" }}>{f.zh}</span>
        <span style={S.tag}>{MATERIAL_ZH[p.spec.material]}</span>
        <span style={S.tag}>{p.spec.clumping ? "會結團" : "不結團"}</span>
        {dustZh && <span style={S.tag}>粉塵{dustZh}</span>}
        {p.spec.scented && <span style={S.tag}>有香味</span>}
      </div>

      <div style={S.box}>
        <p style={{ margin: 0, fontWeight: 700, color: f.fg }}>{FLUSH_LINE[p.spec.flushable]}</p>
        {gap && <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--cut)", fontWeight: 700 }}>{gap}</p>}
        <Link href="/cat-litter/flush" style={{ display: "inline-block", marginTop: 12, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
          看其他款能不能沖 →
        </Link>
      </div>

      {m ? (
        <section style={{ marginTop: 26 }}>
          <p style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 800 }}>
            ${m.amount.toLocaleString()}
            <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500, marginLeft: 10 }}>
              {/* 整組賣的要寫整組（1.25kg×8），不然 $792 配 1.25kg 會看成一包的價 */}
              {m.unit || p.price.unit}{per ? ` · $${per.n}/${per.unit}` : ""}
            </span>
          </p>
          {month && (
            <p style={{ margin: "0 0 14px", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.85 }}>
              一隻貓一個月大約用 {month.use} {month.unit}，<b style={{ color: "var(--ink)" }}>${month.cost.toLocaleString()}</b>。
              用量是照材質推估的，每隻貓差很多，拿來比不同款就好。
            </p>
          )}
          <a href={`/go/${m.id}/${p.id}`} rel="nofollow sponsored" style={S.buy}>去蝦皮看這一包</a>
          <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--faint)" }}>
            在 {m.label}
            {m.note ? ` · ${m.note}` : ""}
          </p>
          {live.length > 1 && (
            <div style={{ marginTop: 18 }}>
              {/* 同一家店的整箱價也是一列。只有一家的時候寫「幾家」很怪 */}
              <p style={S.lbl}>
                {new Set(live.map((x) => x.label)).size > 1
                  ? `全部 ${new Set(live.map((x) => x.label)).size} 家的價格`
                  : "這一家的幾種買法"}
              </p>
              {[...live].sort((a, b) => a.amount - b.amount).map((x) => {
                /* 光寫標價會誤導：一包 7L $249 看起來比兩包 $399 便宜，換算成一個月其實貴一百多 */
                const xPer = unitPriceOf(p, x);
                const xMonth = monthlyCost(p, x);
                const more = xMonth && month ? xMonth.cost - month.cost : 0;
                return (
                  <a key={x.id} href={`/go/${x.id}/${p.id}`} rel="nofollow sponsored" style={S.storeRow}>
                    <span style={{ minWidth: 0 }}>
                      {x.label}
                      <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{x.unit}{x.note ? ` · ${x.note}` : ""}</span>
                      {more > 0 && (
                        <span style={{ display: "block", fontSize: 12.5, color: "var(--cut)", marginTop: 2 }}>
                          一個月多 ${more.toLocaleString()}
                        </span>
                      )}
                      {/* 整箱買比較便宜的，要把省下來的算出來，不然沒人看得出差在哪 */}
                      {more < 0 && (
                        <span style={{ display: "block", fontSize: 12.5, color: "var(--keep)", marginTop: 2 }}>
                          一個月省 ${Math.abs(more).toLocaleString()}
                        </span>
                      )}
                    </span>
                    <span className="mono" style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                      ${x.amount.toLocaleString()}
                      {xPer && <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)" }}>${xPer.n}/{xPer.unit}</span>}
                    </span>
                  </a>
                );
              })}
              {/* 同一款同時有商城和商城以外的，差別要講一句，不然只看到價差 */}
              {new Set(live.map((x) => channelOf(x.label))).size > 1 && (
                <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
                  {CHANNEL_NOTE}
                </p>
              )}
            </div>
          )}
        </section>
      ) : (
        <div style={{ ...S.box, marginTop: 26 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>這一款還沒有購買連結</p>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
            我們只放自己的購買連結，還沒補到的就不放。資料還是照樣讀給你看。
          </p>
        </div>
      )}

      <section style={{ marginTop: 30 }}>
        <p style={S.lbl}>這一款是什麼</p>
        <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface)", padding: "6px 18px 14px" }}>
          <Row k="材質">{MATERIAL_ZH[p.spec.material]}</Row>
          <Row k="結團">{p.spec.clumping ? "會結團，可以只鏟結塊" : "不結團，要整盆換或用雙層砂盆"}</Row>
          <Row k="沖馬桶">{f.zh}{p.spec.flushClaim === "yes" ? "（包裝寫可以沖）" : ""}</Row>
          {dustZh && <Row k="粉塵">{dustZh}（品牌與評比的說法）</Row>}
          {grainZh && <Row k="顆粒">{grainZh}</Row>}
          {p.spec.deodorizer && <Row k="怎麼除臭">{p.spec.deodorizer}</Row>}
          {p.spec.tracking && <Row k="落砂">{{ low: "少", medium: "中等", high: "多" }[p.spec.tracking]}</Row>}
          {p.price.unit && <Row k="一包">{p.price.unit}</Row>}
        </div>
        {p.note && (
          <p style={{ margin: "14px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
            <b style={{ color: "var(--ink)" }}>先知道這件事：</b>{p.note}
          </p>
        )}
      </section>

      <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Share path={`/cat-litter/p/${p.id}`} text={`${p.brand} ${p.name}：${f.zh}`} label="分享這一款" />
        <Link href="/cat-litter" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>看全部貓砂 →</Link>
      </div>

      {CONTACT.email && (
        <p style={{ marginTop: 26, fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9 }}>
          資料寫錯了？
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`貓砂資料回報：${p.brand} ${p.name}`)}`}
            style={{ color: "var(--accent)", marginLeft: 6 }}
          >
            跟我們說
          </a>
          。材質與包裝會改版，以你手上那一包為準。
        </p>
      )}
    </main>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 15.5, lineHeight: 1.7 }}>
      <span style={{ color: "var(--faint)", minWidth: "5.5em", fontSize: 14 }}>{k}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}

