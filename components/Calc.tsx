"use client";

import { useState } from "react";
import { dailyGrams, mer, FRESH_DAYS, KCAL_PER_KG, MER_FACTORS, type Stage } from "@/lib/engine";
import { S } from "./styles";

/**
 * 一包吃多久、一個月多少錢。
 *
 * 算式跟商品卡上的「這包大約吃 N 天」是同一個函式（lib/engine 的
 * dailyGrams）—— 兩個介面對同一隻狗給不一樣的答案，是這個站已經
 * 犯過太多次的錯，不要再犯第三次。
 *
 * 誠實的邊界寫在畫面上，不藏在小字裡：
 * 熱量密度取中間值、體態評分才是真的依據、包裝背面的餵食表比我們準。
 */

const STAGES: Stage[] = ["puppyYoung", "puppy", "adultFixed", "adultWhole", "senior", "slimming"];

export default function Calc() {
  const [kg, setKg] = useState("10");
  const [stage, setStage] = useState<Stage>("adultFixed");
  const [bag, setBag] = useState("6");
  const [price, setPrice] = useState("2640");

  const w = Number(kg);
  const bagKg = Number(bag);
  const p = Number(price);
  const ok = w > 0 && w < 120;

  const grams = ok ? dailyGrams(w, stage) : 0;
  const kcal = ok ? Math.round(mer(w, stage)) : 0;
  // 熱量密度有區間，克數就該是區間 —— 給一個精確到個位數的假象比較不誠實
  const low = ok ? Math.round((mer(w, stage) / 4200) * 1000) : 0;
  const high = ok ? Math.round((mer(w, stage) / 3300) * 1000) : 0;

  const days = ok && bagKg > 0 ? Math.round((bagKg * 1000) / grams) : null;
  const tooLong = days !== null && days > FRESH_DAYS;
  const monthly = ok && bagKg > 0 && p > 0 ? Math.round((grams * 30 / (bagKg * 1000)) * p) : null;

  return (
    <div>
      <div style={grid}>
        <Field label="體重">
          <input style={input} inputMode="decimal" value={kg}
                 onChange={(e) => setKg(e.target.value)} />
          <span style={unit}>公斤</span>
        </Field>

        <Field label="階段">
          <select style={{ ...input, paddingRight: 8 }} value={stage}
                  onChange={(e) => setStage(e.target.value as Stage)}>
            {STAGES.map((k) => (
              <option key={k} value={k}>{MER_FACTORS[k].zh}</option>
            ))}
          </select>
        </Field>

        <Field label="包裝">
          <input style={input} inputMode="decimal" value={bag}
                 onChange={(e) => setBag(e.target.value)} />
          <span style={unit}>公斤</span>
        </Field>

        <Field label="這包多少錢">
          <span style={{ ...unit, marginRight: 4 }}>$</span>
          <input style={input} inputMode="numeric" value={price}
                 onChange={(e) => setPrice(e.target.value)} />
        </Field>
      </div>

      {!ok ? (
        <p style={{ ...S.hint, marginTop: 20 }}>填一個合理的體重就會算了。</p>
      ) : (
        <>
          <div style={outBox}>
            <Row big label="一天大約" value={`${low}–${high} 克`} />
            <p style={sub}>
              熱量需求約 <b>{kcal}</b> 大卡／天。克數會有區間，是因為每一款乾糧的
              熱量密度不一樣（台灣市售多在 3,300–4,200 kcal/kg，我們取
              {" "}{KCAL_PER_KG.toLocaleString()} 當中間值）。
              <b>包裝背面的餵食表比我們準</b> —— 那是照那一包的實際熱量算的。
            </p>

            {days !== null && (
              <>
                <Row label="這包吃得完嗎" value={`大約 ${days} 天`} tone={tooLong ? "cut" : "keep"} />
                {tooLong && (
                  <p style={{ ...sub, color: "var(--cut)" }}>
                    超過 {FRESH_DAYS} 天。開封後的乾飼料油脂會氧化，放久了狗會越來越不愛吃 ——
                    很多人以為是「這牌子不好」，其實是放太久。這個體重建議買小一點的包裝。
                  </p>
                )}
              </>
            )}

            {monthly !== null && (
              <Row label="一個月大約" value={`$${monthly.toLocaleString()}`} />
            )}
          </div>

          <p style={caveat}>
            這是估算，不是餵食指示。真正該看的是<b>體態</b> ——
            從上面看得出腰身、摸得到肋骨但不明顯，那個體重就是對的。
            照著數字餵卻越來越胖或越來越瘦，相信你的眼睛，不要相信這個計算機。
            要減重請先問獸醫，那不是少餵一點就好的事。
          </p>
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={field}>
      <span style={fieldLabel}>{label}</span>
      <span style={fieldRow}>{children}</span>
    </label>
  );
}

function Row({
  label, value, big, tone,
}: { label: string; value: string; big?: boolean; tone?: "keep" | "cut" }) {
  return (
    <div style={row}>
      <span style={{ fontSize: 14.5, color: "var(--muted)" }}>{label}</span>
      <span
        className="mono"
        style={{
          fontSize: big ? 26 : 19, fontWeight: 700,
          color: tone ? `var(--${tone})` : "var(--ink)",
        }}
      >{value}</span>
    </div>
  );
}

const grid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12,
};
const field: React.CSSProperties = { display: "block" };
const fieldLabel: React.CSSProperties = {
  display: "block", fontSize: 12.5, color: "var(--muted)", marginBottom: 6,
};
const fieldRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 10, padding: "10px 14px",
};
const input: React.CSSProperties = {
  flex: 1, minWidth: 0, border: 0, background: "transparent",
  color: "var(--ink)", font: "inherit", fontSize: 16, outline: "none",
};
const unit: React.CSSProperties = { fontSize: 13.5, color: "var(--muted)", whiteSpace: "nowrap" };

const outBox: React.CSSProperties = {
  marginTop: 24, background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};
const row: React.CSSProperties = {
  display: "flex", alignItems: "baseline", justifyContent: "space-between",
  gap: 12, padding: "10px 0", flexWrap: "wrap",
};
const sub: React.CSSProperties = {
  margin: "0 0 6px", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.9,
};
const caveat: React.CSSProperties = {
  marginTop: 16, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.95,
};
