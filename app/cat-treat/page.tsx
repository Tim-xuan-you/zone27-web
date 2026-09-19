import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Share from "@/components/Share";
import {
  treats, FORM_ZH, buyableTreat, anchorTreat, dailyLimit, packDays, pureeSpread,
  treatKcalCap, dailyKcal, hiddenChicken, DEFAULT_CAT_KG,
} from "@/lib/treat";

/**
 * 貓零食類目。
 *
 * 這一頁只回答一件事：一天可以給幾條。
 * 不放裁決器（那套規則是給正餐用的），因為零食的問題不是「能不能吃」，是「給多少」。
 *
 * 頁面上每一個數字都是算出來的，沒有一個寫死。
 * 第一版寫死「一天 200 大卡、兩條就到頂」，引擎算出來是 238 大卡、三條，兩個數字打架。
 * 寫死的數字遲早會跟資料對不上，所以一個都不留。
 */

const DAY = dailyKcal(DEFAULT_CAT_KG);
const CAP = treatKcalCap(DEFAULT_CAT_KG);
const SPREAD = pureeSpread();

/* 招牌那一句：一般肉泥可以給幾條 */
const PUREE = SPREAD ? dailyLimit(SPREAD.plain) : null;
const PUREE_PACK = SPREAD ? SPREAD.plain.spec.piecesPerPack : undefined;

/* 凍乾：水分只有 2.5%，同樣的熱量換算成公克會小到嚇人 */
const DRIED = treats.find((p) => p.spec.form === "freezeDried" && p.spec.kcalPer100g);
const DRIED_LIMIT = DRIED ? dailyLimit(DRIED) : null;

export const metadata: Metadata = {
  title: "貓零食一天可以給幾條",
  description:
    `獸醫的通則是零食不超過一天熱量的一成。一隻 ${DEFAULT_CAT_KG} 公斤的成貓一天大約 ${DAY} 大卡，零食上限 ${CAP} 大卡：` +
    (SPREAD && PUREE
      ? `一般肉泥一條 ${SPREAD.plain.spec.kcalPer} 大卡，${PUREE.label}就滿了；寫著綜合營養的一條 ${SPREAD.complete.spec.kcalPer} 大卡。`
      : "") +
    (DRIED && DRIED_LIMIT ? `凍乾一天只能給 ${DRIED_LIMIT.grams} 公克。` : "") +
    `我們讀過的 ${treats.length} 款都算好了。`,
  alternates: { canonical: "/cat-treat" },
};

export default function Page() {
  const buyable = treats.filter(buyableTreat);
  const dataOnly = treats.filter((p) => !buyableTreat(p));
  const list = [...buyable, ...dataOnly];
  const hidden = treats.filter(hiddenChicken);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="cat-treat" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        零食一天<br />可以給幾條
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 18px", maxWidth: "42ch" }}>
        包裝上不會寫。獸醫的通則是零食不超過一天熱量的一成，
        一隻 {DEFAULT_CAT_KG} 公斤的成貓一天大約 {DAY} 大卡，
        <b style={{ color: "var(--ink)" }}> 零食的上限就是 {CAP} 大卡</b>。
        {SPREAD && PUREE && (
          <>
            {" "}一條肉泥 {SPREAD.plain.spec.kcalPer} 大卡，{PUREE.label}就滿了
            {PUREE_PACK ? `，一包 ${PUREE_PACK} 條，等於一天的額度` : ""}。
          </>
        )}
      </p>

      {SPREAD && (
        <div style={{ ...box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>寫著「綜合營養」的那一款，熱量快兩倍</p>
          <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.9 }}>
            同一個牌子的肉泥，一般口味一條 {SPREAD.plain.spec.kcalPer} 大卡，
            綜合營養配方一條 {SPREAD.complete.spec.kcalPer} 大卡。
            差別在後者加了礦物質、維生素和牛磺酸，可以當正餐吃。
            你要是把它當零食加在正餐之外，額度會用得快一倍。
          </p>
          <Link href={`/cat-treat/p/${SPREAD.complete.id}`} style={{ display: "inline-block", marginTop: 10, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
            看這一款怎麼算 →
          </Link>
        </div>
      )}

      <div style={{ ...box, marginTop: 14 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>怎麼算的</p>
        <ol style={{ margin: "10px 0 0", paddingLeft: 20, fontSize: 14.5, color: "var(--muted)", lineHeight: 1.95 }}>
          <li>一天要幾大卡：照體重算，結紮的成貓用 1.2 倍基礎代謝，{DEFAULT_CAT_KG} 公斤是 {DAY} 大卡</li>
          <li>零食上限 = 一天熱量的一成，也就是 {CAP} 大卡</li>
          <li>有寫「一條幾大卡」的換算成幾條，除不盡往下算；只寫每 100 克的（凍乾）換算成幾公克</li>
          <li>兩個都沒寫的，我們就說沒公布，不編一個數字給你</li>
        </ol>
        <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--faint)", lineHeight: 1.85 }}>
          下面每一款都照 {DEFAULT_CAT_KG} 公斤的成貓算。你家的貓比較重就照比例加。
        </p>
      </div>

      {DRIED && DRIED_LIMIT && (
        <div style={{ ...box, marginTop: 14 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>凍乾能給的量比你想的少很多</p>
          <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            凍乾把水抽掉了，水分只剩 {DRIED.spec.moisture}%，每 100 公克 {DRIED.spec.kcalPer100g} 大卡。
            同樣 {CAP} 大卡的額度，換算下來一天只有 {DRIED_LIMIT.grams} 公克。
            抓一把就超過了。這種零食要秤，不要用抓的。
          </p>
        </div>
      )}

      {hidden.length > 0 && (
        <div style={{ ...box, marginTop: 14, borderColor: "var(--cut)", background: "var(--cut-soft)" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>名字寫魚，裡面有雞</p>
          <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.9 }}>
            {hidden.map((p) => `${p.brand} ${p.name}`).join("、")}。
            對雞過敏的貓，零食也要看成分，不是只有飼料要看。
          </p>
          <Link href="/check" style={{ display: "inline-block", marginTop: 10, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
            查飼料有沒有藏雞 →
          </Link>
        </div>
      )}

      <p style={lbl}>我們讀過的 {treats.length} 款</p>
      {list.map((p) => {
        const m = anchorTreat(p);
        const limit = dailyLimit(p);
        const days = packDays(p);
        return (
          <Link key={p.id} href={`/cat-treat/p/${p.id}`} style={row}>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</span>
              <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
              <span style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{FORM_ZH[p.spec.form]}</span>
                {p.spec.completeFood && (
                  <span style={{ fontSize: 12, color: "var(--keep)", background: "var(--keep-soft)", borderRadius: 6, padding: "2px 8px" }}>
                    綜合營養食
                  </span>
                )}
                {p.spec.moisture !== undefined && p.spec.moisture > 50 && (
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>水分 {p.spec.moisture}%</span>
                )}
                {!m && <span style={{ fontSize: 12.5, color: "var(--faint)" }}>還沒有連結</span>}
              </span>
            </span>
            <span className="mono" style={{ whiteSpace: "nowrap", fontSize: 13.5, textAlign: "right" }}>
              {limit ? (
                <>
                  <b>一天 {limit.label}</b>
                  {days !== null && <span style={{ display: "block", color: "var(--faint)", fontSize: 12 }}>一包約 {days} 天</span>}
                </>
              ) : (
                <span style={{ color: "var(--faint)", fontSize: 12.5 }}>沒公布熱量</span>
              )}
              <span aria-hidden style={{ color: "var(--faint)", marginLeft: 8 }}>›</span>
            </span>
          </Link>
        );
      })}

      <div style={{ marginTop: 30 }}>
        <Share path="/cat-treat" text="貓零食一天可以給幾條，我們照熱量算出來了：" label="把這頁傳給朋友" />
      </div>

      <footer style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--faint)", lineHeight: 1.9 }}>
        <p style={{ margin: 0 }}>
          熱量照包裝與品牌官網。一成是獸醫營養學的通則，不是法規。
          貓在減重、有慢性病，或一天吃的正餐本來就不夠，請照獸醫的指示。
        </p>
      </footer>
    </main>
  );
}

const lbl: React.CSSProperties = {
  margin: "34px 0 10px", fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em",
};
const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 20px",
};
const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "14px 0", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
