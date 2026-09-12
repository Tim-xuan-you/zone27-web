"use client";

import { usePathname } from "next/navigation";
import { CONTACT, pageReport } from "@/lib/contact";

/**
 * 每一頁最底下那一行：看到寫錯的地方，寄信跟我們說。
 *
 * 放在 layout，任何頁面（包括以後新增的）都有，不會漏。
 * 刻意做成一行小字而不是飄在角落的按鈕：飄著的按鈕讀者不知道要回報什麼，
 * 最後收到的會是「什麼時候出貨」這種該問賣場的問題。
 * 真正的回報入口在發現問題的位置（購買按鈕旁、成分表每一筆），這一行只是保底。
 */
export default function PageReport() {
  const path = usePathname() ?? "/";
  // 維護台是給 Tim 自己看的
  if (path.startsWith("/status")) return null;
  const href = pageReport(path);
  if (!href) return null;

  return (
    <div style={wrap}>
      <p style={line}>
        看到寫錯、賣完或連結壞掉的地方？
        <a href={href} style={link}>寄信跟我們說</a>
        ，信裡會自動帶上這一頁。收到會改，也會標上新的查核日期。
        <span style={addr}>{CONTACT.email}</span>
      </p>
    </div>
  );
}

// 各頁 main 底部都留了 120px，往上拉一點，才不會離頁尾太遠像是另一個網站的東西
const wrap: React.CSSProperties = {
  maxWidth: 720, margin: "-88px auto 0", padding: "0 20px 48px", position: "relative",
};
const line: React.CSSProperties = {
  margin: 0, paddingTop: 16, borderTop: "1px dashed var(--line)",
  fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
};
const link: React.CSSProperties = { color: "var(--muted)", fontWeight: 600 };
const addr: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 12, marginTop: 2,
};
