import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VerdictView from "@/components/VerdictView";
import { S } from "@/components/styles";
import { adjudicate } from "@/lib/engine";
import { catalog, constraintsFor } from "@/lib/catalog";
import {
  ALLERGENS, BREEDS, TYPICAL_KG, allPaths, descriptionOf, resolve, titleOf,
  type PageKind,
} from "@/lib/slugs";
import type { Situation } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPaths().map((slug) => ({ slug }));
}

/** 把頁面類型翻成引擎吃的情境。 */
function situationOf(p: PageKind): Situation {
  const breed = p.kind === "allergen" ? undefined : p.breed;
  const allergen = p.kind === "breed" ? undefined : p.allergen;
  return {
    species: "dog",
    breed: breed?.zh,
    ageYears: 3,               // 頁面預設成犬；使用者要細分就回裁決器
    avoid: allergen ? [allergen.protein] : [],
    symptoms: [],
    constraints: [],
  };
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
      <VerdictView
        verdict={verdict}
        chips={chipsOf(p)}
        dogKg={p.kind === "allergen" ? undefined : TYPICAL_KG[p.breed.size]}
      />

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
