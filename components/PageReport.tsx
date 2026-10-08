"use client";

import Link from "next/link";
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

  /*
   * 2026-10-01 網站改成孩子的學習單：學習單這幾頁講的是「注音標錯、題目有問題」，
   * 以前的狗貓飼料、充電器收在這裡一行，頁面都還在，從這裡、從搜尋引擎都找得到。
   * 學習單頁沒有購買連結，所以不放聯盟行銷那一句。
   */
  const kids = path === "/" || path.startsWith("/worksheets") || path.startsWith("/about");
  if (kids) {
    return (
      <div style={wrap}>
        <p style={line}>
          注音標錯、題目有兩個答案、哪一關太難？
          <a href={href} style={link}>寫信跟我說</a>
          ，收到會改。
          <span style={addr}>{CONTACT.email}</span>
          <span style={{ display: "block", marginTop: 8 }}>
            以前做的：
            <Link href="/dog" style={link}>狗</Link>、<Link href="/cat" style={link}>貓</Link>、
            <Link href="/charger" style={link}>充電器</Link>、<Link href="/power-bank" style={link}>行動電源</Link>
          </span>
        </p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <p style={line}>
        看到寫錯、賣完或連結壞掉的地方？
        <a href={href} style={link}>寄信跟我們說</a>
        ，信裡會自動帶上這一頁。收到會改，也會標上新的查核日期。
        <span style={addr}>{CONTACT.email}</span>
        {/* 利益關係全站只講這一句（2026-09-13 Tim：一直講分潤，讀者只會覺得你在賺錢） */}
        <span style={{ display: "block", marginTop: 8 }}>購買連結是聯盟行銷連結，透過連結下單，你付的價格一樣。</span>
        {/* 2026-10-09 以前的 600 多頁都連到學習單：站內連結告訴搜尋引擎，這個網站現在的重點在這裡 */}
        <span style={{ display: "block", marginTop: 8 }}>
          現在主要在做：<Link href="/worksheets" style={link}>孩子的免費學習單（幼兒迷宮 PDF 下載）</Link>
        </span>
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
  fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9,
};
const link: React.CSSProperties = { color: "var(--muted)", fontWeight: 600 };
const addr: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 12.5, marginTop: 2,
};
