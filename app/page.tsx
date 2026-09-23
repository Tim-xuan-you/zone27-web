import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { CatIcon, DogIcon } from "@/components/Icons";
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
      description: "台灣的狗飼料、貓飼料、貓主食罐決策工具。先刪掉不適合的，並寫清楚每一款什麼時候不要買。",
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
 *   1. 我養的是狗還是貓 → 第一屏就是兩扇門，點了就只看得到那一種
 *   2. 第一次養 → 直接給清單
 *   3. 手上已經有一包 → 打名字查有沒有藏雞
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
        你家的毛孩怎麼了？<br />點幾下就好
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 24px", maxWidth: "40ch" }}>
        光是低敏飼料，市面上就上百款。點一下年紀和狀況，我們先幫你
        <span style={{ color: "var(--cut)", fontWeight: 700 }}>刪掉</span>
        不適合的，剩下的才給你看。
      </p>

      {/* 先說自己養什麼，進去只看那一種（2026-09-24） */}
      <p style={S.lbl}>先選你家那一隻</p>
      <div style={doors}>
        <Link href={animalHref("dog")} style={door}>
          <span style={doorIcon}><DogIcon size={30} /></span>
          <span style={doorTitle}>養狗的</span>
          <span className="keep" style={doorLine}>{categoriesOf("dog").map((c) => c.short).join("、")}</span>
        </Link>
        <Link href={animalHref("cat")} style={door}>
          <span style={doorIcon}><CatIcon size={30} /></span>
          <span style={doorTitle}>養貓的</span>
          <span className="keep" style={doorLine}>{categoriesOf("cat").map((c) => c.short).join("、")}</span>
        </Link>
      </div>

      {/* 第一次養的人不知道要點什麼，給他一條直接的路 */}
      <p style={{ margin: "18px 0 0", fontSize: 15.5, fontWeight: 700, color: "var(--muted)" }}>
        第一次養？
        <Link href="/dog/first-time" style={{ color: "var(--accent)", marginLeft: 6 }}>狗要先買什麼 →</Link>
        <Link href="/cat/first-time" style={{ color: "var(--accent)", marginLeft: 14 }}>貓要先買什麼 →</Link>
      </p>

      {/* 全站最有辨識度的東西：打名字，查你家那包有沒有藏雞 */}
      <Link href="/check" style={checkCard}>
        <span style={{ ...kicker, color: "var(--cut)" }}>查成分</span>
        <h2 style={{ ...featureTitle, fontSize: 22 }}>你家那包，有沒有藏雞？</h2>
        <p style={featureBody}>
          名字沒寫雞的 {CHECK.unnamed} 款，有 <b style={{ color: "var(--cut)" }}>{CHECK.hidden} 款</b>成分表裡有雞。
          打名字就查得到你家那一包，有雞的直接給你不含雞的。
        </p>
        <span style={{ display: "inline-block", marginTop: 10, fontWeight: 700, color: "var(--accent)" }}>打名字查 →</span>
      </Link>

    </main>
  );
}

const doors: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
};
const door: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "var(--sh)",
  padding: "22px 18px 20px", textDecoration: "none", color: "inherit",
};
const doorIcon: React.CSSProperties = {
  display: "inline-grid", placeItems: "center", width: 52, height: 52, borderRadius: 999,
  background: "var(--accent-soft)", color: "var(--accent)", marginBottom: 4,
};
const doorTitle: React.CSSProperties = { fontSize: 22, fontWeight: 700, lineHeight: 1.4 };
const doorLine: React.CSSProperties = { fontSize: 14, color: "var(--muted)", lineHeight: 1.7 };
const checkCard: React.CSSProperties = {
  display: "block", marginTop: 40, background: "var(--surface)", border: "1px solid var(--line)",
  borderLeft: "4px solid var(--cut)", borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
  textDecoration: "none", color: "inherit",
};
const kicker: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", fontSize: 12.5, fontWeight: 600,
  letterSpacing: ".14em", color: "var(--faint)",
};
const featureTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "6px 0 8px", lineHeight: 1.5,
};
const featureBody: React.CSSProperties = {
  margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.85,
};
