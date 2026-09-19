import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Share from "@/components/Share";
import { CONTACT } from "@/lib/contact";
import {
  treats, treatById, FORM_ZH, anchorTreat, liveOf, dailyLimit, packDays,
  treatKcalCap, dailyKcal, hiddenChicken, DEFAULT_CAT_KG,
} from "@/lib/treat";
import { meatsFrom } from "@/lib/labels";

export function generateStaticParams() {
  return treats.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = treatById(id);
  if (!p) return {};
  const limit = dailyLimit(p);
  return {
    title: `${p.brand} ${p.name}`,
    description: limit
      ? `一隻 ${DEFAULT_CAT_KG} 公斤的成貓，當零食給一天最多 ${limit.label}。${FORM_ZH[p.spec.form]}，${p.spec.completeFood ? "綜合營養食" : "零食，不能當主食"}。`
      : `${FORM_ZH[p.spec.form]}。包裝沒公布熱量，一天可以給幾條算不出來。`,
    alternates: { canonical: `/cat-treat/p/${p.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = treatById(id);
  if (!p) notFound();

  const m = anchorTreat(p);
  const live = liveOf(p);
  const limit = dailyLimit(p);
  const days = packDays(p);
  const cap = treatKcalCap(DEFAULT_CAT_KG);
  const perPiece = m && p.spec.piecesPerPack ? Math.round((m.amount / p.spec.piecesPerPack) * 10) / 10 : null;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="cat-treat" />

      <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--muted)" }}>{p.brand}</p>
      <h1 style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.45, margin: "0 0 14px" }}>{p.name}</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <span style={tag}>{FORM_ZH[p.spec.form]}</span>
        <span style={tag}>肉：{meatsFrom(p.spec.proteins)}</span>
        {p.spec.completeFood ? (
          <span style={{ ...tag, color: "var(--keep)", background: "var(--keep-soft)" }}>綜合營養食</span>
        ) : (
          <span style={{ ...tag, color: "var(--warn)", background: "var(--warn-soft)" }}>零食，不能當主食</span>
        )}
      </div>

      <div style={box}>
        {limit ? (
          <>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
              一天最多 {limit.label}
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
              照一隻 {DEFAULT_CAT_KG} 公斤的成貓算：一天 {dailyKcal(DEFAULT_CAT_KG)} 大卡，零食上限 {cap} 大卡，是一成。
              {p.spec.kcalPer && <>這一款一{p.spec.unitZh ?? "條"} {p.spec.kcalPer} 大卡。</>}
              {p.spec.kcalPer100g && <>這一款每 100 公克 {p.spec.kcalPer100g} 大卡。</>}
              {days !== null && <> 一包大約可以給 {days} 天。</>}
            </p>
            {p.spec.completeFood && (
              <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                這一款是綜合營養食，當正餐餵就不受這個上限，照正餐的份量算。
                上面的數字是「加在正餐之外」的算法。
              </p>
            )}
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontWeight: 700 }}>包裝沒公布熱量</p>
            <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
              所以「一天可以給幾條」算不出來。我們不編一個數字給你。
            </p>
          </>
        )}
        <Link href="/cat-treat" style={{ display: "inline-block", marginTop: 12, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
          看其他款一天可以給幾條 →
        </Link>
      </div>

      {m ? (
        <section style={{ marginTop: 26 }}>
          <p style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 800 }}>
            ${m.amount.toLocaleString()}
            <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500, marginLeft: 10 }}>
              {m.unit || p.price.unit}{perPiece ? ` · $${perPiece}/${p.spec.unitZh ?? "條"}` : ""}
            </span>
          </p>
          <a href={`/go/${m.id}/${p.id}`} rel="nofollow sponsored" style={buy}>去蝦皮看這一包</a>
          <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--faint)" }}>
            在 {m.label}{m.note ? ` · ${m.note}` : ""}
          </p>
          {live.length > 1 && (
            <div style={{ marginTop: 18 }}>
              <p style={lbl}>全部 {new Set(live.map((x) => x.label)).size} 家的價格</p>
              {live.map((x) => (
                <a key={x.id} href={`/go/${x.id}/${p.id}`} rel="nofollow sponsored" style={storeRow}>
                  <span>{x.label}<span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{x.unit}{x.note ? ` · ${x.note}` : ""}</span></span>
                  <span className="mono" style={{ whiteSpace: "nowrap" }}>${x.amount.toLocaleString()} ›</span>
                </a>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div style={{ ...box, marginTop: 26 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>這一款還沒有購買連結</p>
          <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.85 }}>
            我們只放自己的購買連結，還沒補到的就不放。資料照樣讀給你看。
          </p>
        </div>
      )}

      {hiddenChicken(p) && (
        <div style={{ ...box, marginTop: 20, borderColor: "var(--cut)", background: "var(--cut-soft)" }}>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--cut)" }}>名字沒寫雞，裡面有雞</p>
          <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.9 }}>
            對雞過敏的貓，零食也要看成分。
          </p>
          <Link href="/check" style={{ display: "inline-block", marginTop: 8, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
            查飼料有沒有藏雞 →
          </Link>
        </div>
      )}

      <section style={{ marginTop: 30 }}>
        <p style={lbl}>這一款是什麼</p>
        <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface)", padding: "6px 18px 14px" }}>
          <Row k="型態">{FORM_ZH[p.spec.form]}</Row>
          {p.spec.kcalPer && <Row k={`一${p.spec.unitZh ?? "條"}幾大卡`}>{p.spec.kcalPer} 大卡</Row>}
          {p.spec.kcalPer100g && <Row k="每 100 克">{p.spec.kcalPer100g} 大卡</Row>}
          {p.spec.protein !== undefined && <Row k="粗蛋白">{p.spec.protein}%</Row>}
          {p.spec.moisture !== undefined && <Row k="水分">{p.spec.moisture}%</Row>}
          {p.spec.packG && <Row k="一包">{p.spec.packG} 公克{p.spec.piecesPerPack ? `（${p.spec.piecesPerPack} ${p.spec.unitZh ?? "條"}）` : ""}</Row>}
          <Row k="能當主食嗎">{p.spec.completeFood ? "可以，這款是綜合營養食" : "不行，這是零食"}</Row>
          {p.spec.additives && <Row k="添加物">{p.spec.additives}</Row>}
        </div>
        {p.note && (
          <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            <b style={{ color: "var(--ink)" }}>先知道這件事：</b>{p.note}
          </p>
        )}
      </section>

      <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Share
          path={`/cat-treat/p/${p.id}`}
          text={limit ? `${p.brand} ${p.name}：當零食給，一天最多 ${limit.label}` : `${p.brand} ${p.name}`}
          label="分享這一款"
        />
        <Link href="/cat-treat" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>看全部零食 →</Link>
      </div>

      {CONTACT.email && (
        <p style={{ marginTop: 26, fontSize: 13, color: "var(--faint)", lineHeight: 1.9 }}>
          資料寫錯了？
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`貓零食資料回報：${p.brand} ${p.name}`)}`}
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
    <div style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 15, lineHeight: 1.7 }}>
      <span style={{ color: "var(--faint)", minWidth: "6.5em", fontSize: 13.5 }}>{k}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}

const tag: React.CSSProperties = {
  fontSize: 12.5, color: "var(--muted)", background: "var(--sunken)", borderRadius: 8, padding: "5px 10px",
};
const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 20px",
};
const lbl: React.CSSProperties = {
  margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em",
};
const buy: React.CSSProperties = {
  display: "inline-block", padding: "13px 28px", borderRadius: 999, background: "var(--accent)",
  color: "var(--accent-ink)", fontWeight: 700, fontSize: 16, textDecoration: "none",
};
const storeRow: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "12px 0", borderTop: "1px solid var(--line)", textDecoration: "none", color: "inherit", fontSize: 14.5,
};
