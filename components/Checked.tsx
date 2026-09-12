import { shopLink } from "@/lib/catalog";
import { claimReport } from "@/lib/contact";

/**
 * 成分表逐筆核對，每一筆底下那一小段：哪天查的、照什麼查的、寫錯了怎麼跟我們說。
 *
 * 這裡以前放的是來源網址，點下去是別家的賣場。讀者在那裡買，Tim 一毛都拿不到，
 * 等於我們花力氣查證，最後把人送去別人的店（2026-09-12 Tim 抓到，全站拿掉）。
 *
 * 規矩：
 *   1. 來源只寫「是什麼」（台灣代理商的中文標示），不放網址、不點名別家通路
 *   2. 想自己核對的人，給他我們自己的購買連結（走 /go/），進賣場一樣看得到成分表
 *   3. 這一款還沒有我們的購買連結，就什麼連結都不放。寧可沒有，也不要連去別家
 */
export default function Checked({
  checkedAt, sources, productId, path, item,
}: {
  checkedAt: string;
  sources?: { label: string }[];
  /** 對到商品編號，而且那一款有購買連結，才會出現按鈕 */
  productId?: string;
  /** 勘誤信裡要帶的頁面 */
  path: string;
  /** 勘誤信裡要帶的項目名稱 */
  item: string;
}) {
  const buy = shopLink(productId);
  const report = claimReport(path, item);
  const from = (sources ?? []).map((s) => s.label).join("、");

  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
        查核 {checkedAt}{from && ` · 照${from}`}
      </p>
      {buy && (
        <a
          href={buy}
          rel="nofollow sponsored"
          style={{ display: "inline-block", marginTop: 6, fontSize: 13.5, fontWeight: 600, color: "var(--accent)" }}
        >
          去賣場看這一款的成分表 →
        </a>
      )}
      {report && (
        <a
          href={report}
          style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "var(--faint)", textDecoration: "underline", textUnderlineOffset: 3 }}
        >這一筆寫錯了？跟我們說</a>
      )}
    </div>
  );
}
