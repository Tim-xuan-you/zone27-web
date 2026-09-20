import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Share from "@/components/Share";
import { S } from "@/components/styles";
import {
  treatsOf, FORM_ZH, buyableTreat, anchorTreat, dailyKcal, treatKcalCap,
  budgetShare, shareAtLowEnd, monthlyAtCap, DEFAULT_KG,
} from "@/lib/treat";

/**
 * 狗零食類目。
 *
 * 貓零食問「一天可以給幾條」，因為肉泥一條七大卡，給得完。
 * 狗的潔牙骨不一樣：品牌自己就印了「一天一支」，一支八十八大卡，
 * 所以問題不是能給幾支，是**那一支已經佔掉多少**。
 *
 * 而且答案很難看。照 Greenies 自己標的適用體重下限算，四個尺寸每一支
 * 都超過那隻狗一整天的零食額度。品牌在同一張標籤上寫「請把正餐扣掉 88 大卡」，
 * 所以他們知道。知道的只有品牌跟算過的人。
 */

const DOGS = treatsOf("dog");
const KG = DEFAULT_KG.dog;
const DAY = dailyKcal(KG, "dog");
const CAP = treatKcalCap(KG, "dog");

/* 照品牌自己標的體重下限算，最輕的那隻狗額度最小，也最容易超標 */
const LOW_END = DOGS.map((p) => ({ p, low: shareAtLowEnd(p) })).filter((x) => x.low !== null);
const OVER = LOW_END.filter((x) => (x.low?.share ?? 0) > 100).length;

export const metadata: Metadata = {
  title: "狗零食一支佔一天額度的幾成",
  description:
    `獸醫的通則是零食不超過一天熱量的一成。一隻 ${KG} 公斤結紮的成犬一天 ${DAY} 大卡，零食上限 ${CAP} 大卡。` +
    `潔牙骨一支 25 到 142 大卡，照品牌自己標的適用體重下限算，${OVER} 款一支就超過一整天的額度。` +
    `我們讀過的 ${DOGS.length} 款都算好了。`,
  alternates: { canonical: "/dog-treat" },
};

export default function Page() {
  const buyable = DOGS.filter(buyableTreat);
  const list = [...buyable, ...DOGS.filter((p) => !buyableTreat(p))];

  return (
    <main style={S.page}>
      <SiteHeader current="dog-treat" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        一支潔牙骨<br />佔掉一天多少額度
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 18px", maxWidth: "42ch" }}>
        潔牙骨是為了健康才買的，所以沒有人把它當零食算。
        但一支 25 到 142 大卡，比整包肉乾還高。
        一隻 {KG} 公斤結紮的成犬一天 {DAY} 大卡，
        <b style={{ color: "var(--ink)" }}> 零食的上限是 {CAP} 大卡</b>。
      </p>

      {OVER > 0 && (
        <div style={{ ...S.box, borderColor: "var(--cut)", background: "var(--cut-soft)" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>
            照品牌自己標的體重算，{OVER} 款一支就超過一整天的額度
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.9 }}>
            每一款潔牙骨都會標「適用幾公斤的狗」。我們拿那個範圍裡<b>最輕的那隻</b>來算，
            因為牠的額度最小。結果是這樣：
          </p>
          <div style={{ marginTop: 12 }}>
            {LOW_END.map(({ p, low }) => (
              <div key={p.id} style={rowSplit}>
                <span style={{ minWidth: 0 }}>
                  {p.name}
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>
                    一支 {p.spec.kcalPer} 大卡 · 適用 {p.spec.forKgFrom} 到 {p.spec.forKgTo} 公斤
                  </span>
                </span>
                <span className="mono" style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                  <b style={{ color: (low?.share ?? 0) > 100 ? "var(--cut)" : "var(--ink)" }}>
                    {low?.share}%
                  </b>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)" }}>
                    照 {low?.kg} 公斤算
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.9 }}>
            品牌在同一張標籤上寫「每餵一支，請把正餐扣掉 N 大卡」。
            所以他們知道。問題是幾乎沒有人真的去扣。
          </p>
        </div>
      )}

      <div style={{ ...S.box, marginTop: 14, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>潔牙骨不是肉做的</p>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.9 }}>
          它長得像肉骨頭，顏色是綠的，很多人以為是某種肉乾。
          成分表第一項是<b>小麥麵粉</b>，第二項是甘油，第三項是小麥麩質。
          整張表沒有一項是肉。排在第八的「天然禽肉風味」是風味劑。
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.9 }}>
          這不代表它沒用。潔牙骨靠的是質地跟咀嚼時間，不是靠成分。
          但你要是為了「補充蛋白質」在給，那買錯東西了。
          對小麥或禽肉過敏的狗也要留意。
        </p>
      </div>

      <div style={{ ...S.box, marginTop: 14 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>怎麼算的</p>
        <ol style={{ margin: "10px 0 0", paddingLeft: 20, fontSize: 14, color: "var(--muted)", lineHeight: 1.95 }}>
          <li>一天要幾大卡：照體重算，結紮的成犬用 1.6 倍基礎代謝</li>
          <li>零食上限 = 一天熱量的一成</li>
          <li>一支佔幾成 = 一支的大卡 ÷ 那個上限</li>
          <li>一支幾大卡照品牌公布的。沒公布的我們就說沒公布，不編數字</li>
        </ol>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
          下面每一款都照 {KG} 公斤的成犬算。你家的狗不是這個體重，點進去有各自的算法。
        </p>
      </div>

      <div style={{ ...S.box, marginTop: 14 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>超過了怎麼辦</p>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
          不是叫你不要給。潔牙骨對牙結石是有數據的，那是它的價值。
          做法是把正餐扣掉同樣的熱量，或者隔天給一次。
          最怕的是正餐照舊、潔牙骨照給，一年下來體重就上去了。
        </p>
        <Link href="/dog-food/how-much" style={{ display: "inline-block", marginTop: 10, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
          算一天該吃多少乾糧 →
        </Link>
      </div>

      <p style={S.lbl}>我們讀過的 {DOGS.length} 款</p>
      {list.map((p) => {
        const m = anchorTreat(p);
        const share = budgetShare(p, KG);
        const cap30 = m ? monthlyAtCap(p, m) : null;
        return (
          <Link key={p.id} href={`/dog-treat/p/${p.id}`} style={S.listRow}>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</span>
              <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
              <span style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{FORM_ZH[p.spec.form]}</span>
                {p.spec.kcalPer && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>一支 {p.spec.kcalPer} 大卡</span>}
                {!m && <span style={{ fontSize: 12.5, color: "var(--faint)" }}>還沒有連結</span>}
              </span>
            </span>
            <span className="mono" style={{ whiteSpace: "nowrap", fontSize: 14, textAlign: "right" }}>
              {share !== null ? (
                <>
                  <b style={{ color: share > 100 ? "var(--cut)" : "var(--ink)" }}>佔 {share}%</b>
                  <span style={{ display: "block", color: "var(--faint)", fontSize: 12.5 }}>{KG} 公斤的狗</span>
                  {cap30 !== null && <span style={{ display: "block", color: "var(--faint)", fontSize: 12.5 }}>給滿一個月 ${cap30.toLocaleString()}</span>}
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
        <Share
          path="/dog-treat"
          text={`一支潔牙骨佔一隻狗一天零食額度的幾成，算出來比想的高很多：`}
          label="把這頁傳給朋友"
        />
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          熱量照品牌官網公布的數字。一成是獸醫營養學的通則，不是法規。
          狗在減重、有慢性病，或一天吃的正餐本來就不夠，請照獸醫的指示。
        </p>
      </footer>
    </main>
  );
}

const rowSplit: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "10px 0", borderTop: "1px solid var(--line)", fontSize: 14,
};
