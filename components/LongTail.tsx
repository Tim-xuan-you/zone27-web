import type { Metadata } from "next";
import Link from "next/link";
import Result from "@/components/Result";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { adjudicate, anchorOf, bagDuration, dailyGrams, pricePerKg, unitOf } from "@/lib/engine";
import { catalog, constraintsFor } from "@/lib/catalog";
import { categoryOf } from "@/lib/categories";
import {
  allergensOf, breedsOf, descriptionOf, resolve, situationOf, titleOf,
  type PageKind,
} from "@/lib/slugs";
import type { Species } from "@/lib/types";

/**
 * 長尾決策頁（品種、過敏原、品種 × 過敏原）。
 *
 * 狗跟貓共用這一份。之前首頁裁決器和長尾頁各有一份結果畫面，
 * 改了一邊另一邊就走樣 —— 那個坑踩過一次，第二個類目不要再踩。
 * app/dog-food/[...slug] 和 app/cat-food/[...slug] 只是薄薄的外殼。
 */

const ADULT: Record<Species, string> = { dog: "成犬", cat: "成貓" };
const ANIMAL: Record<Species, string> = { dog: "狗", cat: "貓" };

function chipsOf(p: PageKind, sp: Species): { label: string; kind: "info" | "avoid" }[] {
  const out: { label: string; kind: "info" | "avoid" }[] = [];
  if (p.kind !== "allergen") out.push({ label: `品種 · ${p.breed.zh}`, kind: "info" });
  out.push({ label: `年齡 · ${ADULT[sp]}`, kind: "info" });
  if (p.kind !== "breed") out.push({ label: `排除 · ${p.allergen.zh}`, kind: "avoid" });
  return out;
}

/** 「不適合」跟「還沒有購買連結」分開數，描述裡才不會把後者算成我們刪掉的 */
function tally(cuts: { count: number; tag: string }[]) {
  const pending = cuts.filter((c) => c.tag === "通路").reduce((s, c) => s + c.count, 0);
  const cut = cuts.reduce((s, c) => s + c.count, 0) - pending;
  return { cut, pending };
}

function run(p: PageKind, sp: Species) {
  const situation = situationOf(p, sp);
  situation.constraints = constraintsFor(situation);
  return adjudicate(catalog, situation);
}

export function longTailMetadata(sp: Species, slug: string[]): Metadata {
  const p = resolve(slug, sp);
  if (!p) return {};
  const cat = categoryOf(sp);

  const v = run(p, sp);
  const { cut, pending } = tally(v.cuts);
  const title = titleOf(p, sp);
  const description = descriptionOf(p, v.survivors.length, cut, sp, pending);

  return {
    title,
    description,
    alternates: { canonical: `/${cat.slug}/${slug.join("/")}` },
    openGraph: {
      title, description, type: "article",
      // catch-all 路由底下不能放 opengraph-image 檔，所以圖由 /og/{類目}/... 靜態產生
      images: [{ url: `/og/${cat.slug}/${slug.join("/")}`, width: 1200, height: 630 }],
    },
  };
}

export default function LongTail({ sp, slug }: { sp: Species; slug: string[] }) {
  const p = resolve(slug, sp)!;
  const cat = categoryOf(sp);
  const base = `/${cat.slug}`;
  const BREEDS = breedsOf(sp);
  const ALLERGENS = allergensOf(sp);

  const verdict = run(p, sp);
  const { cut, pending } = tally(verdict.cuts);
  const title = titleOf(p, sp);
  const description = descriptionOf(p, verdict.survivors.length, cut, sp, pending);

  /* 相關頁 —— 站內互連是多類目平台唯一拿得到的權重資產 */
  const related: { href: string; label: string }[] = [];
  if (p.kind === "breed") {
    for (const a of ALLERGENS) {
      related.push({ href: `${base}/${p.breed.slug}/${a.slug}`, label: `${p.breed.zh}・避${a.zh}` });
    }
  } else if (p.kind === "allergen") {
    for (const b of BREEDS.slice(0, 8)) {
      related.push({ href: `${base}/${b.slug}/${p.allergen.slug}`, label: `${b.zh}・避${p.allergen.zh}` });
    }
  } else {
    related.push({ href: `${base}/${p.breed.slug}`, label: `${p.breed.zh}飼料總覽` });
    related.push({ href: `${base}/${p.allergen.slug}`, label: `所有不含${p.allergen.zh}的飼料` });
    for (const a of ALLERGENS.filter((a) => a.slug !== p.allergen.slug).slice(0, 4)) {
      related.push({ href: `${base}/${p.breed.slug}/${a.slug}`, label: `${p.breed.zh}・避${a.zh}` });
    }
  }

  /* 排雞肉的頁面把成分表那一頁接上 —— 這批人正好就是會踩到「寫別的肉、其實有雞」的人 */
  if (p.kind !== "breed" && p.allergen.protein === "chicken") {
    related.unshift({
      href: `${base}/hidden-chicken`,
      label: sp === "cat" ? "寫著鮭魚、鴨肉、火雞，成分表裡有雞的那幾款" : "寫著低敏卻含雞的那幾款",
    });
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

      <SiteHeader current={cat.slug} />

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

      {/* 長尾頁沒有使用者輸入的體重，用品種推一個典型值估可吃天數 */}
      <Result
        verdict={verdict}
        chips={chipsOf(p, sp)}
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
              說真的，<b>沒有。</b>{p.breed.zh}這個條件沒有刪掉任何一款，
              以「避{p.allergen.zh}」來說，{p.breed.zh}跟其他品種的選擇是一樣的。
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>
              品種真正會影響的是<b>吃多少</b>和<b>該買哪個包裝</b>，那個下面算給你看。
              {sp === "dog"
                ? "只有體型專用配方（小型犬專用、大型犬專用）才會因為品種被刪掉，而符合你這次條件的款裡剛好沒有。"
                : "貓的品種在飼料上幾乎不影響，真正該看的是年紀、體重，還有牠吃了會不會抓、會不會吐。"}
            </p>
          </div>
        </>
      )}

      {/* 只屬於這個品種的數字。程序化頁面如果只差一個品種名，
          那在 Google 眼中就是 doorway page —— 每一頁至少要帶一組
          自己算出來、別頁沒有的真實資訊。 */}
      {p.kind !== "allergen" && verdict.pick && (() => {
        const pick = verdict.pick;
        const kg = p.breed.kg;
        const anchor = anchorOf(pick, "safe");
        const g = dailyGrams(kg, "adultFixed", sp, pick.spec.kcal);
        const per = pricePerKg(unitOf(pick, anchor), anchor.amount);
        const monthly = per !== null ? Math.round((g * 30 / 1000) * per) : null;
        const dur = bagDuration(unitOf(pick, anchor), kg, "adultFixed", sp, pick.spec.kcal);
        return (
          <>
            <p style={S.lbl}>{p.breed.zh}大概要吃多少</p>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
            }}>
              <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.95 }}>
                成年{p.breed.zh}的典型體重大約 <b>{kg} 公斤</b>，
                照獸醫的能量公式算，已結紮的話一天大約吃 <b>{g} 克</b>
                {pick.spec.kcal ? `（照這一款的熱量 ${pick.spec.kcal.toLocaleString()} 大卡算）` : "乾飼料"}。
              </p>
              <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.95 }}>
                以上面推薦的 <b>{pick.brand}</b>（{unitOf(pick, anchor)}）來算：
                {dur && <>這包大約吃 <b>{dur.days} 天</b>{dur.tooLong && "（超過 45 天，建議買小一點的）"}，</>}
                {monthly !== null && <>一個月大約 <b>${monthly.toLocaleString()}</b>。</>}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
                體重是典型值，不是標準，真正該看的是體態。
                想用你家的實際體重算，
                <Link href={`${base}/how-much`} style={{ color: "var(--accent)" }}>這裡可以自己輸入</Link>。
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
          這一頁預設{ADULT[sp]}。你的{ANIMAL[sp]}如果是{sp === "cat" ? "幼貓" : "幼犬"}、高齡或有其他狀況，
          <Link href="/" style={{ color: "var(--muted)" }}>回裁決器</Link>用講的比較快。
        </p>
        <p style={{ margin: "8px 0 0" }}>
          價格是人工查的，點進賣場以當下的標價為準。
        </p>
      </footer>
    </main>
  );
}
