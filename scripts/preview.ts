import { adjudicate } from "../lib/engine";
import { catalog, constraintsFor } from "../lib/catalog";
import { resolve } from "../lib/slugs";
import type { Situation } from "../lib/types";

for (const slug of [["shiba-inu"], ["shiba-inu", "no-chicken"], ["poodle", "no-chicken"]]) {
  const p = resolve(slug)!;
  const s: Situation = {
    species: "dog",
    breed: p.kind === "allergen" ? undefined : p.breed.zh,
    ageYears: 3,
    avoid: p.kind === "breed" ? [] : [p.allergen.protein],
    symptoms: [], constraints: [],
  };
  s.constraints = constraintsFor(s);
  const v = adjudicate(catalog, s);
  console.log(`\n/${slug.join("/")}`);
  console.log(`  ${v.startCount} 款進入裁決`);
  for (const c of v.cuts) console.log(`   − ${c.count}  ${c.why}   [${c.tag}]`);
  console.log(`  ${v.survivors.length} 款留下 → 推 ${v.pick?.brand ?? "（無）"}`);
}
