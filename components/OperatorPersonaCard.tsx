import type { OperatorPersona } from "@/lib/operator-persona";
import { PERSONA_MIN } from "@/lib/operator-persona";

// ── ZONE 27 · 操盤風格卡 ───────────────────────────────────────────────
// 玄學(星座/塔羅)的破壞式正解:同樣「這超像我」的身分快感,但材料是你真實押注紀錄、可驗證。
// 純展示 · 無 client JS · 暗金 · 無 emoji · 無動畫。 subject:你(會員自己)/ TA(公開檔第三人稱)。
//
// 🔴 守死:① 這是「風格」不是「準度」(底下明寫 · 準度看上面/操盤室階級)② 全描述過去、不預測未來
//   (不是玄學)③ 不褒貶任何風格(逆風 ≠ 比較聰明、順勢 ≠ 比較笨)· 純中性描述。
// ─────────────────────────────────────────────────────

export default function OperatorPersonaCard({
  persona,
  subject = "你",
}: {
  persona: OperatorPersona;
  /** 「你」= 會員自己看(/member)·「TA」= 公開檔第三人稱(/u/[code]) */
  subject?: "你" | "TA";
}) {
  const { kind, sidesWithEnginePct: pct, styleN } = persona;

  let label: string;
  let line: string;
  if (kind === "forming" || pct === null) {
    label = "還在成形";
    line = `再押幾場,${subject}的操盤風格就會浮出來 —— 目前 ${styleN} 場可判,滿 ${PERSONA_MIN} 場開始顯示。`;
  } else if (kind === "trend") {
    label = "順勢派";
    line = `這 ${styleN} 場裡,${subject} ${pct}% 跟機器站同一邊 —— 信數據、押開盤強隊的穩健派。`;
  } else if (kind === "fade") {
    label = "逆風派";
    line = `這 ${styleN} 場裡,${subject} ${100 - pct}% 跟機器唱反調 —— 專挑黑馬的逆風派。`;
  } else {
    label = "雙面派";
    line = `順勢逆風各半(跟機器同手 ${pct}%)—— ${subject}看場下手,不盲跟也不為反而反。`;
  }

  return (
    <section className="mt-6 border border-gold/25 bg-gold/[0.04] p-4 sm:p-5">
      <p className="font-mono text-gold/80 text-[10px] tracking-[0.4em] mb-1.5">
        操盤風格
      </p>
      <p className="text-bone text-base sm:text-lg font-light tracking-tight">
        {label}
      </p>
      <p className="mt-1.5 text-mute/85 text-[13px] leading-relaxed">{line}</p>
      {/* 風格 ≠ 準度:把「這超像我」的身分快感跟「我多準」的計分板明確分開(守紅線)。 */}
      {kind !== "forming" && (
        <p className="mt-2.5 font-mono text-mute/50 text-[10px] tracking-[0.15em] leading-relaxed">
          這是「風格」· 不是「準度」—— 準不準看上面 / 操盤室階級
        </p>
      )}
    </section>
  );
}
