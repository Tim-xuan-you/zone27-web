import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Result from "@/components/Result";
import { S } from "@/components/styles";
import { adjudicate, anchorOf, bagDuration, dailyGrams, pricePerKg, unitOf } from "@/lib/engine";
import { catalog, constraintsFor } from "@/lib/catalog";
import {
  ALLERGENS, BREEDS, allPaths, descriptionOf, resolve, situationOf, titleOf,
  type PageKind,
} from "@/lib/slugs";
import type { Situation } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPaths().map((slug) => ({ slug }));
}

function chipsOf(p: PageKind): { label: string; kind: "info" | "avoid" }[] {
  const out: { label: string; kind: "info" | "avoid" }[] = [];
  if (p.kind !== "allergen") out.push({ label: `品種 · ${p.breed.zh}`, kind: "info" });
  out.push({ label: "年齡 · 成犬", kind: "info" });
  if (p.kind !== "breed") out.push({ label: `排除 · ${p.allergen.zh}`, kind: "avoid" });
  return out;
}

function run(p: PageKind) {
  const situation = situationOf(p);
  situation.constraints = constraintsFor(situation);
  return adjudicate(catalog, situation);
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = resolve(slug);
  if (!p) return {};

  const v = run(p);
  const cut = v.cuts.reduce((s, c) => s + c.count, 0);
  const title = titleOf(p);
  const description = descriptionOf(p, v.survivors.length, cut);

  return {
    title,
    description,
    alternates: { canonical: `/dog-food/${slug.join("/")}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const p = resolve(slug);
  if (!p) notFound();

  const verdict = run(p);
  const cut = verdict.cuts.reduce((s, c) => s + c.count, 0);
  const title = titleOf(p);
  const description = descriptionOf(p, verdict.survivors.length, cut);

  /* 相關頁 —— 站內互連是多類目平台唯一拿得到的權重資產 */
  const related: { href: string; label: string }[] = [];
  if (p.kind === "breed") {
    for (const a of ALLERGENS) {
      related.push({ href: `/dog-food/${p.breed.slug}/${a.slug}`, label: `${p.breed.zh}・避${a.zh}` });
    }
  } else if (p.kind === "allergen") {
    for (const b of BREEDS.slice(0, 8)) {
      related.push({ href: `/dog-food/${b.slug}/${p.allergen.slug}`, label: `${b.zh}・避${p.allergen.zh}` });
    }
  } else {
    related.push({ href: `/dog-food/${p.breed.slug}`, label: `${p.breed.zh}飼料總覽` });
    related.push({ href: `/dog-food/${p.allergen.slug}`, label: `所有不含${p.allergen.zh}的飼料` });
    for (const a of ALLERGENS.filter((a) => a.slug !== p.allergen.slug).slice(0, 4)) {
      related.push({ href: `/dog-food/${p.breed.slug}/${a.slug}`, label: `${p.breed.zh}・避${a.zh}` });
    }
  }

  /* 排雞肉的頁面把成分表那一頁接上 —— 這批人正好就是會踩到「火雞其實是雞」的人 */
  if (p.kind !== "breed" && p.allergen.protein === "chicken") {
    related.unshift({ href: "/dog-food/hidden-chicken", label: "寫著低敏卻含雞的那幾款" });
  }

  /* 結構化資料。AI 引用時最愛這種有明確前提的形態。 */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: title,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            verdict.pick
              ? `${description} 目前的建議是「${verdict.pick.brand}｜${verdict.pick.name}」，理由：${verdict.pickReason}`
              : description,
        },
      },
      ...verdict.cuts.map((c) => ({
        "@type": "Question",
        name: `為什麼排除「${c.why}」的飼料？`,
        acceptedAnswer: { "@type": "Answer", text: `${c.tag}。這一條刪掉了 ${c.count} 款。` },
      })),
    ],
  };

  const aliases =
    p.kind === "allergen" ? [] : [p.breed.zh, ...p.breed.alias];

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 40,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
        <Link href="/dog-food" style={{ fontSize: 12.5, color: "var(--muted)", textDecoration: "none" }}>
          全部狗飼料
        </Link>
      </div>

      <h1 style={{
        fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 16px",
      }}>
        {title}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 8px", maxWidth: "42ch" }}>
        {description}
      </p>
      {aliases.length > 1 && (
        <p style={{ color: "var(--faint)", fontSize: 12.5, margin: "0 0 20px" }}>
          也有人叫牠：{aliases.join("、")}
        </p>
      )}

      {/* 長尾頁沒有使用者輸入的體重，用品種體型推一個典型值估可吃天數 */}
      <Result
        verdict={verdict}
        chips={chipsOf(p)}
        dogKg={p.kind === "allergen" ? undefined : p.breed.kg}
        // 會搜「避雞肉」的人就是在做排除飲食法 —— 那是皮膚的時程，不是腸胃的
        symptoms={p.kind === "breed" ? undefined : ["皮膚搔癢"]}
      />

      {p.kind === "both" && !verdict.cuts.some((c) => c.tag === "體型不符") && verdict.survivors.length > 0 && (
        <>
          <p style={S.lbl}>品種在這一題有沒有影響</p>
          <div style={{
            background: "var(--sunken)", border: "1px solid var(--line)",
            borderRadius: 14, padding: "18px 22px",
          }}>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
              老實說：<b>沒有。</b>{p.breed.zh}這個條件沒有刪掉任何一款 ——
              以「避{p.allergen.zh}」來說，{p.breed.zh}跟其他品種的選擇是一樣的。
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>
              品種真正會影響的是<b>吃多少</b>和<b>該買哪個包裝</b>，那個下面算給你看。
              只有體型專用配方（小型犬專用、大型犬專用）才會因為品種被刪掉，
              而符合你這次條件的款裡剛好沒有。
            </p>
          </div>
        </>
      )}

      {/* 只屬於這個品種的數字。程序化頁面如果只差一個品種名，
          那在 Google 眼中就是 doorway page —— 每一頁至少要帶一組
          自己算出來、別頁沒有的真實資訊。 */}
      {p.kind !== "allergen" && verdict.pick && (() => {
        const kg = p.breed.kg;
        const g = dailyGrams(kg);
        const anchor = anchorOf(verdict.pick, "safe");
        const per = pricePerKg(unitOf(verdict.pick, anchor), anchor.amount);
        const monthly = per !== null ? Math.round((g * 30 / 1000) * per) : null;
        const dur = bagDuration(unitOf(verdict.pick, anchor), kg);
        return (
          <>
            <p style={S.lbl}>{p.breed.zh}大概要吃多少</p>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
            }}>
              <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.95 }}>
                成年{p.breed.zh}的典型體重大約 <b>{kg} 公斤</b>，
                照獸醫的能量公式算，一天大約吃 <b>{g} 克</b>乾飼料。
              </p>
              <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.95 }}>
                以上面推薦的 <b>{verdict.pick.brand}</b>（{unitOf(verdict.pick, anchor)}）來算：
                {dur && <>這包大約吃 <b>{dur.days} 天</b>{dur.tooLong && "（超過 45 天，建議買小一點的）"}，</>}
                {monthly !== null && <>一個月大約 <b>${monthly.toLocaleString()}</b>。</>}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
                體重是典型值，不是標準 —— 真正該看的是體態。
                想用你家的實際體重算，
                <Link href="/dog-food/how-much" style={{ color: "var(--accent)" }}>這裡可以自己輸入</Link>。
              </p>
            </div>
          </>
        );
      })()}

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        {related.map((r) => (
          <Link key={r.href} href={r.href} style={S.relLink}>{r.label}</Link>
        ))}
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          這一頁預設成犬。你的狗如果是幼犬、高齡或有其他狀況，
          <Link href="/" style={{ color: "var(--muted)" }}>回裁決器</Link>用講的比較快。
        </p>
        <p style={{ margin: "8px 0 0" }}>
          價格為人工複查，每張卡片都標了查價日期。點進賣場請以當下標價為準。本站透過購買連結取得分潤，這不影響推薦排序。
        </p>
      </footer>
    </main>
  );
}
