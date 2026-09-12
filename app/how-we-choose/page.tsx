import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { CONTACT } from "@/lib/contact";

/**
 * 我們怎麼挑。
 *
 * 這一頁以前叫「我們怎麼挑，錢從哪裡來」，一半的篇幅在講佣金：
 * 為什麼不公布抽多少、欄位拿掉了、主動放棄了哪些錢。
 * 2026-09-13 Tim：「一直寫分潤、抽多少，到底在幹嘛？看到就直接覺得你在賺錢，不會想用你的網站。」
 *
 * 他是對的。拚命證明自己沒有動機，反而一直在提醒讀者「這個人有動機」。
 * 讀者點進來，想知道的只有兩件事：你們憑什麼刪、資料可不可靠。
 * 所以這一頁只講這兩件事。利益關係照規矩揭露一句，全站統一放在每頁最底下，不加粗、不解釋。
 *
 * 結構上的保證（排序讀不到佣金、連欄位都沒有）還是真的，寫在 lib/engine.ts 的註解裡，給我們自己看。
 */

export const metadata: Metadata = {
  title: "我們怎麼挑",
  description: "先刪掉不適合的，剩下的才給你看。每一款的成分表都自己讀過，也都寫了什麼時候不要買。",
  alternates: { canonical: "/how-we-choose" },
};

export default function Page() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="how-we-choose" />

      <h1 style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 28px" }}>
        我們怎麼挑
      </h1>

      <Point n={1} title="先刪掉不適合的">
        你講過敏、年紀、症狀，我們照這些條件一刀一刀刪，每一刀刪了幾款都給你看。剩下的才是選項。
      </Point>
      <Point n={2} title="成分表自己讀">
        不看名字，看成分表。名字寫鮭魚的，我們會去看第一項是不是雞。
      </Point>
      <Point n={3} title="每一款都寫什麼時候不要買">
        適合誰、不適合誰一起講。沒寫的不會上架。
      </Point>
      <Point n={4} title="價格是人工查的" last>
        每個價格旁邊都有查價日期，點進賣場以當下的標價為準。
        {CONTACT.email && (
          <>
            {" "}看到寫錯的，<a href={`mailto:${CONTACT.email}`} style={{ color: "var(--accent)" }}>寄信跟我們說</a>。
          </>
        )}
      </Point>

      {/* 利益關係的那一句在每頁最底下（components/PageReport.tsx），這裡不再講第二次 */}
      <p style={{ marginTop: 36 }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>← 回裁決器</Link>
      </p>
    </main>
  );
}

function Point({ n, title, children, last }: { n: number; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "0 0 22px", marginBottom: 22, borderBottom: last ? 0 : "1px solid var(--line)" }}>
      <span className="mono" style={{
        flexShrink: 0, width: 26, height: 26, borderRadius: 999, marginTop: 2,
        background: "var(--accent-soft)", color: "var(--accent)", fontSize: 13, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{n}</span>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 15.5, color: "var(--muted)", lineHeight: 1.9 }}>{children}</p>
      </div>
    </div>
  );
}
