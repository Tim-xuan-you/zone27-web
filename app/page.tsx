import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { CatIcon, ChargerIcon, DogIcon } from "@/components/Icons";
import ReadList from "@/components/ReadList";
import { S } from "@/components/styles";
import { animalHref, categoriesOf } from "@/lib/categories";
import { checkItems, checkStats } from "@/lib/check";

const CHECK = checkStats(checkItems());

const ENTITY = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://zone27.com.tw/#org",
      name: "ZONE 27",
      url: "https://zone27.com.tw",
      description: "台灣的購物決策工具：狗、貓的飼料與用品，還有充電器。每一款的包裝背面都讀過，先刪掉不適合的，並寫清楚每一款什麼時候不要買。",
      logo: "https://zone27.com.tw/opengraph-image",
    },
    {
      "@type": "WebSite",
      "@id": "https://zone27.com.tw/#site",
      name: "ZONE 27",
      url: "https://zone27.com.tw",
      inLanguage: "zh-TW",
      publisher: { "@id": "https://zone27.com.tw/#org" },
    },
  ],
};

/**
 * 首頁。
 *
 * 版面的順序照一個人進來時腦子裡的順序排：
 *   1. 我要買的是哪一種東西 → 第一屏就是入口：養狗的、養貓的、充電器，點了就只看得到那一種
 *   2. 第一次養 → 直接給清單
 *   3. 想先看看這個站在幹嘛 → 我們翻背面翻到的那幾件事
 *
 * 2026-09-26 開了充電器，第一個不是寵物的類目。「你家的毛孩怎麼了」這種開頭就不對了，
 * 改成先問要買什麼。入口從兩扇並排的門改成一行一個：類目會一直加（Tim：只要能分潤的都做），
 * 並排的門到第三個就擠，一行一個加到第十個都還看得清楚。
 *
 * 2026-09-24 Tim：「點狗，就是只有養狗的人呀！貓的任何相關東西都不用出現吧？」
 * 原本下面還排了 7 張類目卡、5 篇狗貓混在一起的文章、6 個狗貓混在一起的算份量連結，
 * 手機上划將近 7 個畫面才到底。養貓的人要在裡面自己挑掉一半跟他無關的東西。
 * 現在首頁只做一件事：讓人先說「我養狗」還是「我養貓」，進去之後只看得到那一種。
 * 類目、文章、算份量，全部搬到 /dog、/cat 裡面。
 *
 * 裁決器也搬走了。首頁的裁決器一定要先預設一種動物，預設狗，
 * 養貓的人第一眼看到的就是「對雞過敏的成犬」。/dog、/cat 裡的裁決器已經鎖好物種，
 * 養貓的人點「養貓的」之後，看到的第一個問題就是「貓多大了」。多一下點擊，換來整頁都跟他有關。
 */
export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ENTITY) }}
      />
      <SiteHeader />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        要買什麼？<br />不適合的先幫你刪掉
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 24px", maxWidth: "40ch" }}>
        每一款的包裝背面我們都讀過：飼料看成分表，充電器看每個孔幾瓦。
        名字寫得再好聽，背面才算數。
      </p>

      {/* 先說要買什麼，進去只看那一種（2026-09-24 狗貓分開，2026-09-26 加充電器） */}
      <p style={S.lbl}>先選你要買的</p>
      <div style={doors}>
        {[
          { href: animalHref("dog"), icon: <DogIcon size={26} />, title: "養狗的", line: categoriesOf("dog").map((c) => c.short).join("、") },
          { href: animalHref("cat"), icon: <CatIcon size={26} />, title: "養貓的", line: categoriesOf("cat").map((c) => c.short).join("、") },
          { href: "/charger", icon: <ChargerIcon size={26} />, title: "充電器", line: "iPhone、iPad、MacBook、Galaxy" },
        ].map((d, i) => (
          <Link key={d.href} href={d.href} style={{ ...door, borderTop: i ? "1px solid var(--line)" : 0 }}>
            <span style={doorIcon}>{d.icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={doorTitle}>{d.title}</span>
              <span style={doorLine}>{d.line}</span>
            </span>
            <span aria-hidden style={{ fontSize: 20, color: "var(--faint)" }}>›</span>
          </Link>
        ))}
      </div>

      {/* 第一次養的人不知道要點什麼，給他一條直接的路 */}
      <p style={{ margin: "18px 0 0", fontSize: 15.5, fontWeight: 700, color: "var(--muted)" }}>
        第一次養？
        <Link href="/dog/first-time" style={{ color: "var(--accent)", marginLeft: 6 }}>狗要先買什麼 →</Link>
        <Link href="/cat/first-time" style={{ color: "var(--accent)", marginLeft: 14 }}>貓要先買什麼 →</Link>
      </p>

      {/* 這個站在幹嘛：每個類目翻背面翻到的那一件事。一行一件，標好是哪一類，讀者挑自己的 */}
      <p style={S.lbl}>我們翻背面翻到的</p>
      <ReadList items={[
        { href: "/check", kicker: "狗貓飼料", title: "你家那包，有沒有藏雞？", line: <>名字沒寫雞的 {CHECK.unnamed} 款，{CHECK.hidden} 款成分表裡有雞</> },
        { href: "/charger/iphone-18-pro", kicker: "充電器", title: "iPhone 18 Pro 要哪一顆充電器才會最快", line: "家裡那顆 65W 插上去，不一定最快" },
      ]} />

    </main>
  );
}

const doors: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "var(--sh)", overflow: "hidden",
};
const door: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", textDecoration: "none", color: "inherit",
};
const doorIcon: React.CSSProperties = {
  display: "inline-grid", placeItems: "center", width: 48, height: 48, borderRadius: 999, flex: "none",
  background: "var(--accent-soft)", color: "var(--accent)",
};
const doorTitle: React.CSSProperties = { display: "block", fontSize: 20, fontWeight: 700, lineHeight: 1.4 };
const doorLine: React.CSSProperties = { display: "block", fontSize: 14, color: "var(--muted)", lineHeight: 1.7 };
