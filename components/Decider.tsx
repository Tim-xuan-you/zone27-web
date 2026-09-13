"use client";

import { useState } from "react";
import Link from "next/link";
import { parse } from "@/lib/parse";
import { adjudicate, anchorOf, formOf, pricePerKg, stageForAge, unitOf, type Stage } from "@/lib/engine";
import { mentionedProducts } from "@/lib/mentions";
import { productHref } from "@/lib/labels";
import { catalog, catalogOf, constraintsFor, isLive } from "@/lib/catalog";
import { CATEGORIES, categoriesOf, categoryOf, type CategorySlug } from "@/lib/categories";
import type { Form, Product, Species, Verdict } from "@/lib/types";
import { CONTACT } from "@/lib/contact";
import Result from "./Result";
import { S } from "./styles";

/**
 * 裁決器。引擎跑在瀏覽器裡 —— 沒有 API 呼叫、沒有 token 費用。
 *
 * 結果的呈現全部交給 <Result>，跟長尾頁共用同一個元件。
 * 之前兩邊各有一份，改了一邊另一邊就走樣 —— 那個坑踩過一次就夠了。
 *
 * 狗跟貓用同一個輸入框。上面的切換鈕是預設值，句子裡講了「貓」「英短」
 * 就照句子走，切換鈕跟著跳過去 —— 使用者不用先選再打字，打完我們自己判斷，
 * 判斷錯了他一眼看得到、一鍵改得回來。
 *
 * 選了貓，下面多一排「乾糧／主食罐」。一樣是預設值：句子裡講了罐頭，就跳去主食罐。
 * 這一排只有在那個動物有兩個以上的類目時才出現，狗現在只有飼料，就不佔位置。
 */

/*
 * 範例句要挑我們真的答得出來的。
 *
 * 這裡曾經放了「12 歲老貓，腎指數偏高」，那時候我們一款貓飼料都沒有，
 * 引擎又沒有讀物種，點下去會推一款狗飼料給貓主人。
 * 自己在首頁掛一個會出錯的示範，是最貴的那種錯。
 */
const EXAMPLES: Record<CategorySlug, string[]> = {
  "dog-food": [
    "我家柴犬 5 歲，最近一直抓癢，換過兩種雞肉飼料都沒改善",
    "柯基快 8 歲了，有點胖，最近一直軟便",
    "拉不拉多，吃了雞肉就會癢，也不能吃羊",
  ],
  "cat-food": [
    "英短 3 歲，對雞肉過敏，一直抓脖子",
    "米克斯貓 5 公斤，有點胖，已結紮",
    "3 個月大的小貓，第一次養",
  ],
  "cat-wet-food": [
    "英短 3 歲，對雞肉過敏，想找主食罐",
    "12 歲老貓，想改吃罐頭",
    "4 公斤的貓想全吃罐頭，每月預算 3000",
  ],
};

/*
 * 點一下就好的條件。
 *
 * 2026-09-13 Tim：「裁決器有夠爛，常常搜不到東西。」實測 43 句台灣飼主真的會打的話，
 * 7 句讀不出來（「不要有雞肉的」「過敏」「腸胃不好」…）。詞彙可以一直補，但補不完；
 * 更根本的是：要人先想一句話再打出來，本身就是門檻。
 *
 * 所以最常見的條件做成按鈕，點一下就重算，不用打字。
 * 按鈕做的事就是把那幾個字加進句子裡，跟打字走同一條路，不會有兩套邏輯。
 * 年紀那一排只能選一個。
 */
type Pick = { label: string; phrase: string; group?: "age" };
const AGE: Record<Species, Pick[]> = {
  dog: [
    { label: "幼犬", phrase: "幼犬", group: "age" },
    { label: "成犬", phrase: "成犬", group: "age" },
    { label: "老犬", phrase: "老狗", group: "age" },
  ],
  cat: [
    { label: "幼貓", phrase: "幼貓", group: "age" },
    { label: "成貓", phrase: "成貓", group: "age" },
    { label: "老貓", phrase: "老貓", group: "age" },
  ],
};
const PICKS: Record<CategorySlug, Pick[]> = {
  "dog-food": [
    { label: "對雞過敏", phrase: "對雞肉過敏" }, { label: "一直抓癢", phrase: "一直抓癢" },
    { label: "軟便", phrase: "軟便" }, { label: "有點胖", phrase: "有點胖" }, { label: "挑食", phrase: "挑食" },
    { label: "要無穀", phrase: "無穀" }, { label: "想省錢", phrase: "想省錢" },
  ],
  "cat-food": [
    { label: "對雞過敏", phrase: "對雞肉過敏" }, { label: "對魚過敏", phrase: "對魚過敏" },
    { label: "一直抓", phrase: "一直抓" }, { label: "軟便", phrase: "軟便" }, { label: "有點胖", phrase: "有點胖" },
    { label: "不愛喝水", phrase: "不愛喝水" }, { label: "想省錢", phrase: "想省錢" },
  ],
  "cat-wet-food": [
    { label: "對雞過敏", phrase: "對雞肉過敏" }, { label: "對魚過敏", phrase: "對魚過敏" },
    { label: "有點胖", phrase: "有點胖" }, { label: "想省錢", phrase: "想省錢" },
  ],
};

/*
 * 還沒問之前，先把常見情況的答案攤開。
 *
 * 很多人不知道要講什麼。看到「對雞過敏的成犬 → 這一包，每公斤 600 元」，
 * 馬上知道這個網站在做什麼，而且常常剛好就是他家的狀況。
 * 答案是引擎照那句話當場算的，點下去就是那句話的完整裁決，跟打字、點按鈕走同一條路。
 * 同一款已經出現過就不再列：好幾行都是同一包，看起來就像在推銷那一包。
 */
const COMMON: Record<CategorySlug, { label: string; phrase: string }[]> = {
  "dog-food": [
    { label: "對雞過敏的成犬", phrase: "成犬，對雞肉過敏" },
    { label: "小型犬", phrase: "成犬，小型犬" },
    { label: "幼犬", phrase: "幼犬" },
    { label: "老狗", phrase: "老狗" },
    { label: "老狗，預算有限", phrase: "老狗，想省錢" },
    { label: "想省錢", phrase: "成犬，想省錢" },
  ],
  "cat-food": [
    { label: "對雞過敏的成貓", phrase: "成貓，對雞肉過敏" },
    { label: "對魚過敏的成貓", phrase: "成貓，對魚過敏" },
    { label: "幼貓", phrase: "幼貓" },
    { label: "老貓", phrase: "老貓" },
    { label: "想省錢", phrase: "成貓，想省錢" },
  ],
  "cat-wet-food": [
    { label: "對雞過敏的成貓", phrase: "成貓，對雞肉過敏" },
    { label: "有點胖", phrase: "成貓，有點胖" },
    { label: "想省錢", phrase: "成貓，想省錢" },
  ],
};

type Answer = { label: string; phrase: string; p: Product; per: number | null };
const answerCache = new Map<CategorySlug, Answer[]>();
function answersFor(slug: CategorySlug): Answer[] {
  const hit = answerCache.get(slug);
  if (hit) return hit;
  const c = CATEGORIES.find((x) => x.slug === slug)!;
  const seen = new Set<string>();
  const out: Answer[] = [];
  for (const row of COMMON[slug]) {
    const s = parse(row.phrase, c.species, c.form).situation;
    s.constraints = constraintsFor(s);
    const v = adjudicate(catalog, s);
    // 還在上架、或這一句剛好停下來（醫療、沒貨），就不列
    if (!v.pick || v.stop || seen.has(v.pick.id)) continue;
    seen.add(v.pick.id);
    const m = anchorOf(v.pick, "safe");
    out.push({ ...row, p: v.pick, per: m && c.form === "dry" ? pricePerKg(unitOf(v.pick, m), m.amount) : null });
  }
  answerCache.set(slug, out);
  return out;
}

/** 把一段字從句子裡拿掉，順便收拾多出來的逗號 */
function without(text: string, phrase: string): string {
  return text.split(phrase).join("").replace(/[，,、\s]*[，,、][，,、\s]*/g, "，").replace(/^[，,、\s]+|[，,、\s]+$/g, "");
}

const PLACEHOLDER: Record<CategorySlug, string> = {
  "dog-food": "例如：我家柴犬 5 歲，最近一直抓癢，換過兩種飼料都沒改善...",
  "cat-food": "例如：英短 3 歲，一直抓下巴，換過兩種雞肉的都沒改善...",
  "cat-wet-food": "例如：英短 3 歲，對雞肉過敏，想找不含雞的主食罐...",
};

/** 還在上架的類目：切換鈕旁邊標「上架中」，下面講讀完幾款 */
const STATUS = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, { live: isLive(c.species, c.form), read: catalogOf(c.species, c.form).length }]),
) as Record<CategorySlug, { live: boolean; read: number }>;

export default function Decider({
  defaultSpecies = "dog",
  defaultForm = "dry",
  soonHint = true,
}: {
  defaultSpecies?: Species;
  defaultForm?: Form;
  /** 頁面自己已經講了「還在上架」的話就關掉，同一句話不要講兩次 */
  soonHint?: boolean;
}) {
  const [species, setSpecies] = useState<Species>(defaultSpecies);
  const [form, setForm] = useState<Form>(defaultForm);
  const [text, setText] = useState("");
  const [chips, setChips] = useState<{ label: string; kind: "info" | "avoid" }[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [empty, setEmpty] = useState(false);
  const [dogKg, setDogKg] = useState<number | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>("adultFixed");
  // 句子裡提到的商品（「我家吃紐頓 T22」），連同它照這句話的條件會不會被刪
  const [mentions, setMentions] = useState<Mention[]>([]);

  const cat = categoryOf(species, form);
  const forms = categoriesOf(species);
  const status = STATUS[cat.slug];

  /** 點條件按鈕：把那幾個字加進句子（或拿掉），馬上重算，不捲動畫面，讓他可以連點好幾個 */
  function toggle(pk: Pick) {
    let t = text;
    const on = t.includes(pk.phrase);
    if (pk.group === "age") for (const a of AGE[species]) t = without(t, a.phrase);
    t = on ? without(t, pk.phrase) : [t.trim(), pk.phrase].filter(Boolean).join("，");
    setText(t);
    if (t.trim()) run(t, species, form, false);
    else { setVerdict(null); setChips([]); setMentions([]); setEmpty(false); }
  }

  function run(input: string, sp: Species = species, fm: Form = form, scroll = true) {
    // 這個動物沒有這種形態（狗現在沒有罐頭），就回到乾糧
    const f = categoriesOf(sp).some((c) => c.form === fm) ? fm : "dry";
    const slug = categoryOf(sp, f).slug;
    const src = input.trim() || EXAMPLES[slug][0];
    setText(src);
    const parsed = parse(src, sp, f);
    const found = mentionedProducts(src, parsed.speciesFromText ? parsed.situation.species : undefined);

    if (parsed.empty) {
      // 只打了品名、沒講狀況：直接給那一款，不要回「讀不出條件」
      setEmpty(found.length === 0);
      setVerdict(null);
      setChips([]);
      setMentions(found.map((p) => ({ p, text: "講一下牠的狀況（年紀、過敏、症狀），我們會告訴你這款適不適合。", tone: "faint" })));
      if (found.length && scroll) scrollTo("mentions");
      return;
    }
    const s = parsed.situation;
    // 句子裡讀出的物種、乾糧罐頭跟切換鈕不一樣，就讓切換鈕跟著句子走
    if (s.species !== species) setSpecies(s.species);
    const sf = s.form ?? "dry";
    // 狗講了罐頭：切換鈕沒有那一格，就不動它，讓裁決結果去講「狗罐頭還沒收」
    if (sf !== form && categoriesOf(s.species).some((c) => c.form === sf)) setForm(sf);

    setEmpty(false);
    s.constraints = constraintsFor(s);
    setChips(parsed.chips.map((c) => ({ label: c.label, kind: c.kind })));
    setDogKg(s.weightKg);
    setSymptoms(s.symptoms);
    setStage(stageForAge(s.ageYears, s.species));
    const v = adjudicate(catalog, s);
    setVerdict(v);
    setMentions(found.map((p) => judge(p, v, s.species, s.form ?? "dry")));
    if (scroll) scrollTo(found.length ? "mentions" : "verdict");
  }

  function scrollTo(id: string) {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function pick(sp: Species) {
    setSpecies(sp);
    // 換動物的時候，如果新的動物沒有目前這種形態，就回到乾糧
    const f = categoriesOf(sp).some((c) => c.form === form) ? form : "dry";
    setForm(f);
    // 已經有結果的話，用同一句話換物種再跑一次，不用重打
    if (verdict && text.trim()) run(text, sp, f);
  }

  function pickForm(f: Form) {
    setForm(f);
    if (verdict && text.trim()) run(text, species, f);
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <div role="radiogroup" aria-label="狗還是貓" style={seg}>
          {(["dog", "cat"] as const).map((sp) => {
            const on = species === sp;
            // 這個動物所有類目都還沒開張，才標「上架中」
            const soon = categoriesOf(sp).every((c) => !STATUS[c.slug].live);
            return (
              <button
                key={sp}
                role="radio"
                aria-checked={on}
                onClick={() => pick(sp)}
                style={on ? { ...segBtn, ...segOn } : segBtn}
              >
                {sp === "dog" ? "狗" : "貓"}
                {soon && <span style={soonTag}>上架中</span>}
              </button>
            );
          })}
        </div>

        {forms.length > 1 && (
          <div role="radiogroup" aria-label="乾糧還是罐頭" style={{ ...seg, padding: 3 }}>
            {forms.map((c) => {
              const on = form === c.form;
              return (
                <button
                  key={c.slug}
                  role="radio"
                  aria-checked={on}
                  onClick={() => pickForm(c.form)}
                  style={on ? { ...segBtn, ...segSmall, ...segOn } : { ...segBtn, ...segSmall }}
                >
                  {c.short}
                  {!STATUS[c.slug].live && <span style={soonTag}>上架中</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={S.ask}>
        <textarea
          style={S.ta}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter 直接送出，Shift+Enter 才換行。
            // 寫成 Ctrl+Enter 是工程師的習慣 —— 一般人按 Enter 沒反應會以為壞了。
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              run(text);
            }
          }}
          placeholder={PLACEHOLDER[cat.slug]}
          rows={3}
          aria-label={species === "cat" ? "描述你家的貓" : "描述你家的狗"}
        />
        <button style={S.go} onClick={() => run(text)}>裁決</button>
      </div>

      <div style={pickWrap}>
        <span style={pickHead}>點一下就好，可以多選</span>
        <div style={S.chipRow}>
          {[...AGE[species], ...PICKS[cat.slug]].map((pk) => {
            const on = text.includes(pk.phrase);
            return (
              <button
                key={pk.label}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(pk)}
                style={on ? { ...S.example, ...pickOn } : S.example}
              >
                {on ? "✓ " : ""}{pk.label}
              </button>
            );
          })}
        </div>
      </div>
      <p style={S.hint}>
        也可以用講的，像「柴犬 5 歲，一直舔腳」，或直接打品名「紐頓 T22」。打完按 Enter。
        {soonHint && !status.live && (
          <>
            <br />
            <span style={{ color: "var(--faint)" }}>
              {cat.zh}還在上架：{status.read} 款的成分表讀完了，購買連結還在補。
            </span>
          </>
        )}
      </p>

      {!verdict && mentions.length === 0 && !empty && answersFor(cat.slug).length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p style={S.lbl}>常見的情況，答案先算好了</p>
          <div style={{ display: "grid", gap: 10 }}>
            {answersFor(cat.slug).map((a) => (
              <button key={a.phrase} type="button" onClick={() => run(a.phrase)} style={answerRow}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "var(--accent)" }}>{a.label}</span>
                  <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.55, marginTop: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>{a.p.brand} </span>
                    {a.p.name}
                  </span>
                </span>
                {a.per && (
                  <span className="mono" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--keep)", whiteSpace: "nowrap" }}>
                    ${a.per}/kg
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {mentions.length > 0 && (
        <div id="mentions" style={{ marginTop: 28 }}>
          <p style={S.lbl}>你提到的</p>
          <div style={{ display: "grid", gap: 10 }}>
            {mentions.map((m) => (
              <Link key={m.p.id} href={productHref(m.p)} style={mentionRow}>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{m.p.brand}</span>
                <span style={{ display: "block", fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>{m.p.name}</span>
                <span style={{ display: "block", marginTop: 4, fontSize: 14, lineHeight: 1.7, color: `var(--${m.tone})`, fontWeight: m.tone === "faint" ? 400 : 700 }}>
                  {m.text}
                </span>
                <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--accent)" }}>看這一款 →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {empty && (
        <div style={S.emptyBox}>
          <p style={{ margin: 0, fontWeight: 700 }}>這句話我們讀不出條件</p>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 15, lineHeight: 1.85 }}>
            試著講品種、年齡，還有你觀察到的狀況，
            像是「{species === "cat" ? "英短三歲，一直抓下巴" : "柴犬五歲，一直抓癢"}」這樣就可以了。
          </p>
          {CONTACT.email && (
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.85 }}>
              <a
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("裁決器讀不懂這句")}&body=${encodeURIComponent(text)}`}
                style={{ color: "var(--accent)", fontWeight: 600 }}
              >
                把這句寄給我們 →
              </a>
              <span style={{ color: "var(--faint)" }}>
                　讀不懂是我們的問題。你寄來，我們就把這種講法加進去。
              </span>
            </p>
          )}
        </div>
      )}

      {verdict && (
        <div id="verdict" style={S.stage}>
          <Result
            verdict={verdict}
            chips={chips}
            dogKg={dogKg}
            symptoms={symptoms}
            stage={stage}
            chipsLabel="我們聽到的是"
            fromDecider
          />
        </div>
      )}
    </>
  );
}

type Mention = { p: Product; text: string; tone: "keep" | "cut" | "faint" };

/**
 * 提到的那一款，照這句話的條件會怎樣。
 * 刪掉的講是哪一刀刪的；留下來的講有沒有被推薦。這比給一張商品卡有用：他要的是「我家這包行不行」。
 */
function judge(p: Product, v: Verdict, species: Species, form: Form): Mention {
  if (p.species !== species || formOf(p) !== form) {
    return { p, text: `這款是${categoryOf(p.species, formOf(p)).zh}，跟上面問的不是同一類。`, tone: "faint" };
  }
  if (v.stop) return { p, text: "這一題我們先不推薦商品，原因寫在下面。", tone: "faint" };
  if (v.pick?.id === p.id) return { p, text: "照你講的條件，這款就是我們推薦的那一款。", tone: "keep" };
  if (v.survivors.some((x) => x.id === p.id)) return { p, text: "照你講的條件，這款沒問題，在下面「還有幾款」裡。", tone: "keep" };
  const cut = v.cuts.find((c) => c.ids.includes(p.id));
  if (cut && cut.tag !== "通路") return { p, text: `照你講的條件，這款會被刪：${cut.why}。`, tone: "cut" };
  return { p, text: p.referenceOnly ? "這款我們不推薦，放進來是為了比較。" : "這款的購買連結還在補。", tone: "faint" };
}

const pickWrap: React.CSSProperties = { marginTop: 14 };
const pickHead: React.CSSProperties = { display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 8 };
const pickOn: React.CSSProperties = {
  background: "var(--accent-soft)", borderColor: "var(--accent)", color: "var(--accent)", fontWeight: 700,
};

const answerRow: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12,
  padding: "12px 16px", font: "inherit", color: "inherit", cursor: "pointer",
};

const mentionRow: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "14px 18px", textDecoration: "none", color: "inherit",
};

const seg: React.CSSProperties = {
  display: "inline-flex", gap: 4, padding: 4,
  background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 999,
};
const segBtn: React.CSSProperties = {
  border: 0, background: "transparent", color: "var(--muted)", cursor: "pointer",
  font: "inherit", fontSize: 15, fontWeight: 600, padding: "7px 20px", borderRadius: 999,
  display: "inline-flex", alignItems: "center", gap: 6,
};
const segSmall: React.CSSProperties = { fontSize: 14, padding: "6px 14px" };
const segOn: React.CSSProperties = {
  background: "var(--surface)", color: "var(--ink)", boxShadow: "var(--sh)",
};
const soonTag: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "var(--faint)",
};
