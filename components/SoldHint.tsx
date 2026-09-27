import type { Merchant } from "@/lib/types";

/**
 * 賣完的連結照樣給讀者，但要講清楚。
 *
 * 2026-09-27 Tim：「在還沒找到新商家之前，還是會展示給使用者吧！說不定他點擊進去的時候，已經先行補貨了！」
 * 對。而且就算還沒補貨，他在同一家買別的，也是從我們這裡進去的。
 * 只有全部賣完、沒有別家可以給的時候才會輪到它（有貨的一律排前面，見 lib/stock.ts）。
 * 不假裝有貨：寫出我們哪一天看是賣完的，讓他點進去之前就知道。
 */
export default function SoldHint({ m, style }: { m?: Pick<Merchant, "soldOut" | "checkedAt">; style?: React.CSSProperties }) {
  if (!m?.soldOut) return null;
  const d = m.checkedAt && /^\d{4}-\d{2}-\d{2}/.test(m.checkedAt) ? ` ${Number(m.checkedAt.slice(5, 7))}/${Number(m.checkedAt.slice(8, 10))} ` : "上次";
  return (
    <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.7, color: "var(--warn)", ...style }}>
      我們{d}看的時候賣完了，點進去看有沒有補貨。
    </p>
  );
}
