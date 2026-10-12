import { G, R, T } from "@/components/styles";
import { testedLabel } from "@/lib/worksheets/kid";

/**
 * 「我家大班生 10 月 12 日寫過」：只有資料裡有日期的那一張才會出現。
 * 這是網站最重要的一句話，寫在預覽圖下面，不藏在角落。
 */
export default function TestedNote({ tested }: { tested?: string }) {
  const text = testedLabel(tested);
  if (!text) return null;
  return (
    <p style={{ margin: `${G.sm}px 0 0`, fontSize: T.sm, fontWeight: 700, color: "var(--keep)" }}>
      <span style={{ display: "inline-block", background: "var(--keep-soft)", borderRadius: R.pill, padding: "4px 12px" }}>✓ {text}</span>
    </p>
  );
}
