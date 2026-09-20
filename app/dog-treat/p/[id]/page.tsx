import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import Share from "@/components/Share";
import { CONTACT } from "@/lib/contact";
import {
  treatsOf, treatById, FORM_ZH, anchorTreat, liveOf, packDays, monthlyAtCap,
  treatKcalCap, dailyKcal, budgetShare, DEFAULT_KG,
} from "@/lib/treat";
import { meatsFrom, variantOf } from "@/lib/labels";

/** 畫面上要跑的幾個體重。涵蓋台灣最常見的小中大型犬 */
const SAMPLE_KG = [5, 8, 12, 20, 30];

export function generateStaticParams() {
  return treatsOf("dog").map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = treatById(id);
  if (!p) return {};
  const share = budgetShare(p, DEFAULT_KG.dog);
  return {
    title: `${p.brand} ${p.name}`,
    description: share
      ? `一支 ${p.spec.kcalPer} 大卡。一隻 ${DEFAULT_KG.dog} 公斤結紮的成犬，這一支佔一天零食額度的 ${share}%。`
      : `${FORM_ZH[p.spec.form]}。包裝沒公布熱量，佔多少額度算不出來。`,
    alternates: { canonical: `/dog-treat/p/${p.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = treatById(id);
  if (!p) notFound();

  const m = anchorTreat(p);
  const live = liveOf(p);
  const days = packDays(p);
  const cap30 = m ? monthlyAtCap(p, m) : null;
  const share = budgetShare(p, DEFAULT_KG.dog);
  const perPiece = m && p.spec.piecesPerPack ? Math.round((m.amount / p.spec.piecesPerPack) * 10) / 10 : null;
  /* 品牌標的體重範圍以內才列，超出去的數字沒有意義 */
  const rows = SAMPLE_KG.filter(
    (kg) => (!p.spec.forKgFrom || kg >= p.spec.forKgFrom) && (!p.spec.forKgTo || kg <= p.spec.forKgTo),
  );

  return (
    <main style={S.page}>
      <SiteHeader current="dog-treat" />

      <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</p>
      <h1 style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.45, margin: "0 0 14px" }}>{p.name}</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <span style={S.tag}>{FORM_ZH[p.spec.form]}</span>
        <span style={S.tag}>肉：{meatsFrom(p.spec.proteins)}</span>
        {p.spec.forKgFrom && <span style={S.tag}>品牌標 {p.spec.forKgFrom} 到 {p.spec.forKgTo} 公斤</span>}
        <span style={{ ...S.tag, color: "var(--warn)", background: "var(--warn-soft)" }}>零食，不能當主食</span>
      </div>

      <div style={S.box}>
        {share !== null ? (
          <>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
              一支 {p.spec.kcalPer} 大卡
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
              一隻 {DEFAULT_KG.dog} 公斤結紮的成犬一天 {dailyKcal(DEFAULT_KG.dog, "dog")} 大卡，
              零食上限 {treatKcalCap(DEFAULT_KG.dog, "dog")} 大卡，是一成。
              這一支就佔 <b style={{ color: share > 100 ? "var(--cut)" : "var(--ink)" }}>{share}%</b>。
              {days !== null && <> 一包大約可以給 {days} 天。</>}
            </p>
            {p.spec.brandPerDay && (
              <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                品牌自己寫一天 {p.spec.brandPerDay} 支，而且要把正餐扣掉 {p.spec.kcalPer} 大卡。
                扣了就沒問題，沒扣就是多出來的。
              </p>
            )}
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontWeight: 700 }}>包裝沒公布熱量</p>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
              所以佔掉多少額度算不出來。我們不編一個數字給你。
            </p>
          </>
        )}
      </div>

      {rows.length > 0 && share !== null && (
        <section style={{ marginTop: 26 }}>
          <p style={S.lbl}>你家的狗幾公斤</p>
          <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface)", padding: "6px 18px 14px" }}>
            {rows.map((kg) => {
              const s = budgetShare(p, kg)!;
              return (
                <div key={kg} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 15.5, lineHeight: 1.7 }}>
                  <span style={{ color: "var(--faint)", minWidth: "6.5em", fontSize: 14 }}>{kg} 公斤</span>
                  <span style={{ flex: 1 }}>
                    一天零食上限 {treatKcalCap(kg, "dog")} 大卡，這一支佔{" "}
                    <b style={{ color: s > 100 ? "var(--cut)" : "var(--ink)" }}>{s}%</b>
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
            只列品牌自己標的適用體重以內。超出去的數字沒有意義。
          </p>
        </section>
      )}

      {m ? (
        <section style={{ marginTop: 26 }}>
          <p style={S.priceBig}>
            ${m.amount.toLocaleString()}
            <span style={S.priceUnit}>
              {m.unit || p.price.unit}{perPiece ? ` · $${perPiece}/${p.spec.unitZh ?? "支"}` : ""}
            </span>
          </p>
          {cap30 !== null && (
            <p style={{ margin: "0 0 14px", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.85 }}>
              天天給到上限的話，一個月 <b style={{ color: "var(--ink)" }}>${cap30.toLocaleString()}</b>。
            </p>
          )}
          <a href={`/go/${m.id}/${p.id}`} rel="nofollow sponsored" style={S.buy}>去蝦皮看這一包</a>
          <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--faint)" }}>
            在 {m.label}{m.note ? ` · ${m.note}` : ""}
          </p>
          {variantOf(m.note) && (
            <p style={{
              margin: "14px 0 0", background: "var(--warn-soft)", color: "var(--warn)",
              borderRadius: 8, padding: "12px 14px", fontSize: 14, lineHeight: 1.85,
            }}>
              這個賣場一頁很多規格。點進去請自己選成
              <b>「{variantOf(m.note)}」</b>，預設的不一定是這一個。
            </p>
          )}
          {live.length > 1 && (
            <div style={{ marginTop: 18 }}>
              <p style={S.lbl}>全部 {new Set(live.map((x) => x.label)).size} 家的價格</p>
              {live.map((x) => (
                <a key={x.id} href={`/go/${x.id}/${p.id}`} rel="nofollow sponsored" style={S.storeRow}>
                  <span>{x.label}<span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{x.unit}{x.note ? ` · ${x.note}` : ""}</span></span>
                  <span className="mono" style={{ whiteSpace: "nowrap" }}>${x.amount.toLocaleString()} ›</span>
                </a>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div style={{ ...S.box, marginTop: 26 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>這一款還沒有購買連結</p>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
            我們只放自己的購買連結，還沒補到的就不放。資料照樣讀給你看。
          </p>
        </div>
      )}

      <section style={{ marginTop: 30 }}>
        <p style={S.lbl}>這一款是什麼</p>
        <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface)", padding: "6px 18px 14px" }}>
          <Row k="型態">{FORM_ZH[p.spec.form]}</Row>
          {p.spec.kcalPer && <Row k={`一${p.spec.unitZh ?? "支"}幾大卡`}>{p.spec.kcalPer} 大卡</Row>}
          {p.spec.forKgFrom && <Row k="品牌標的體重">{p.spec.forKgFrom} 到 {p.spec.forKgTo} 公斤</Row>}
          {p.spec.brandPerDay && <Row k="品牌建議">一天 {p.spec.brandPerDay} 支</Row>}
          {p.spec.packG && <Row k="一包">{p.spec.packG} 公克{p.spec.piecesPerPack ? `（${p.spec.piecesPerPack} ${p.spec.unitZh ?? "支"}）` : ""}</Row>}
          <Row k="能當主食嗎">不行，這是零食</Row>
          {p.spec.additives && <Row k="成分">{p.spec.additives}</Row>}
        </div>
        {p.note && (
          <p style={{ margin: "14px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
            <b style={{ color: "var(--ink)" }}>先知道這件事：</b>{p.note}
          </p>
        )}
      </section>

      <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Share
          path={`/dog-treat/p/${p.id}`}
          text={share !== null ? `${p.brand} ${p.name}：一支就佔一隻 ${DEFAULT_KG.dog} 公斤的狗一天零食額度的 ${share}%` : `${p.brand} ${p.name}`}
          label="分享這一款"
        />
        <Link href="/dog-treat" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>看全部狗零食 →</Link>
      </div>

      {CONTACT.email && (
        <p style={{ marginTop: 26, fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9 }}>
          資料寫錯了？
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`狗零食資料回報：${p.brand} ${p.name}`)}`}
            style={{ color: "var(--accent)", marginLeft: 6 }}
          >
            跟我們說
          </a>
          。配方會改版，以你手上那一包為準。
        </p>
      )}
    </main>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 15.5, lineHeight: 1.7 }}>
      <span style={{ color: "var(--faint)", minWidth: "6.5em", fontSize: 14 }}>{k}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}
