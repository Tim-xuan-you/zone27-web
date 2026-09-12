"use client";

import { useState } from "react";
import { CAT_MER_FACTORS, KCAL_PER_KG, mer, type Stage } from "@/lib/engine";
import { S } from "./styles";

/**
 * 一天幾罐、一個月多少錢。
 *
 * 跟乾糧的計算機用同一條能量公式（lib/engine 的 mer），
 * 只是最後除的是「一罐幾大卡」而不是「每公斤幾大卡」。
 *
 * 罐頭多一個選項：全吃罐頭、一半一半、一天一罐。
 * 台灣大部分的貓是乾濕混餵，只算全吃罐頭的答案，對多數人沒有用。
 */

const STAGES: Stage[] = ["puppyYoung", "puppy", "adultFixed", "adultWhole", "senior", "slimming"];

type Mix = "all" | "half" | "one";
const MIX: { key: Mix; zh: string }[] = [
  { key: "all", zh: "全吃罐頭" },
  { key: "half", zh: "罐頭跟乾糧各一半" },
  { key: "one", zh: "一天一罐，其他吃乾糧" },
];

export default function CanCalc() {
  const [kg, setKg] = useState("4");
  const [stage, setStage] = useState<Stage>("adultFixed");
  const [kcal, setKcal] = useState("90");
  const [price, setPrice] = useState("50");
  const [mix, setMix] = useState<Mix>("all");

  const w = Number(kg);
  const k = Number(kcal);
  const p = Number(price);
  const ok = w > 0 && w < 15 && k > 0;

  const day = ok ? mer(w, stage, "cat") : 0;
  // 罐頭這一份的熱量
  const canKcal = mix === "all" ? day : mix === "half" ? day / 2 : Math.min(k, day);
  const cans = ok ? canKcal / k : 0;
  // 剩下的從乾糧補，乾糧用中間值 3,800 大卡／公斤換成克數
  const dryG = ok ? Math.max(0, Math.round(((day - canKcal) / KCAL_PER_KG) * 1000)) : 0;
  const monthly = ok && p > 0 ? Math.round(cans * 30 * p) : null;

  return (
    <div>
      <div style={grid}>
        <Field label="體重">
          <input style={input} inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} />
          <span style={unit}>公斤</span>
        </Field>

        <Field label="階段">
          <select style={{ ...input, paddingRight: 8 }} value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
            {STAGES.map((s) => <option key={s} value={s}>{CAT_MER_FACTORS[s].zh}</option>)}
          </select>
        </Field>

        <Field label="一罐幾大卡（背面有寫）">
          <input style={input} inputMode="numeric" value={kcal} onChange={(e) => setKcal(e.target.value)} />
          <span style={unit}>大卡</span>
        </Field>

        <Field label="一罐多少錢">
          <span style={{ ...unit, marginRight: 4 }}>$</span>
          <input style={input} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
      </div>

      <div role="radiogroup" aria-label="罐頭給多少" style={mixRow}>
        {MIX.map((m) => (
          <button
            key={m.key}
            role="radio"
            aria-checked={mix === m.key}
            onClick={() => setMix(m.key)}
            style={mix === m.key ? { ...mixBtn, ...mixOn } : mixBtn}
          >
            {m.zh}
          </button>
        ))}
      </div>

      {!ok ? (
        <p style={{ ...S.hint, marginTop: 20 }}>填一個合理的體重和一罐的熱量就會算了。</p>
      ) : (
        <>
          <div style={outBox}>
            <Row big label={mix === "one" ? "罐頭" : "一天大約"} value={`${(Math.round(cans * 10) / 10)} 罐`} />
            <p style={sub}>
              一天的熱量需求約 <b>{Math.round(day)}</b> 大卡。
              {mix !== "all" && (
                <> 罐頭給 {Math.round(canKcal)} 大卡，剩下的從乾糧補，大約 <b>{dryG} 克</b>（乾糧照每公斤 {KCAL_PER_KG.toLocaleString()} 大卡算，包裝上有寫的照包裝）。</>
              )}
              {mix === "one" && k >= day && <> 一罐的熱量已經超過一整天，這一罐就夠了，不用再給乾糧。</>}
            </p>
            {monthly !== null && (
              <Row label={mix === "all" ? "一個月大約" : "罐頭一個月大約"} value={`$${monthly.toLocaleString()}`} />
            )}
          </div>

          <p style={caveat}>
            這是估算，不是餵食指示。真正該看的是<b>體態</b>：
            從上面看得出腰身、摸得到肋骨但不明顯，那個體重就是對的。
            貓減重要慢，一個禮拜掉超過體重的 2% 就太快了，會傷肝，要減重先問獸醫。
          </p>
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={fieldLabel}>{label}</span>
      <span style={fieldRow}>{children}</span>
    </label>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div style={row}>
      <span style={{ fontSize: 14.5, color: "var(--muted)" }}>{label}</span>
      <span className="mono" style={{ fontSize: big ? 26 : 19, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

const grid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12,
};
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
const mixRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 };
const mixBtn: React.CSSProperties = {
  font: "inherit", fontSize: 14, padding: "7px 14px", borderRadius: 999, cursor: "pointer",
  color: "var(--muted)", background: "var(--sunken)", border: "1px solid var(--line)",
};
const mixOn: React.CSSProperties = {
  color: "var(--ink)", background: "var(--surface)", fontWeight: 700, boxShadow: "var(--sh)",
};
const outBox: React.CSSProperties = {
  marginTop: 20, background: "var(--surface)", border: "1px solid var(--line)",
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
