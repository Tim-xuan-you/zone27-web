"use client";

import { useState } from "react";
import { parse } from "@/lib/parse";
import { adjudicate, stageForAge, type Stage } from "@/lib/engine";
import { catalog, catalogOf, constraintsFor, isLive } from "@/lib/catalog";
import { CATEGORIES, categoriesOf, categoryOf, type CategorySlug } from "@/lib/categories";
import type { Form, Species, Verdict } from "@/lib/types";
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

  const cat = categoryOf(species, form);
  const forms = categoriesOf(species);
  const status = STATUS[cat.slug];

  function run(input: string, sp: Species = species, fm: Form = form) {
    // 這個動物沒有這種形態（狗現在沒有罐頭），就回到乾糧
    const f = categoriesOf(sp).some((c) => c.form === fm) ? fm : "dry";
    const slug = categoryOf(sp, f).slug;
    const src = input.trim() || EXAMPLES[slug][0];
    setText(src);
    const parsed = parse(src, sp, f);

    if (parsed.empty) {
      setEmpty(true);
      setVerdict(null);
      setChips([]);
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
    setVerdict(adjudicate(catalog, s));
    requestAnimationFrame(() => {
      document.getElementById("verdict")?.scrollIntoView({
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

      <div style={S.chipRow}>
        {EXAMPLES[cat.slug].map((e) => (
          <button key={e} style={S.example} onClick={() => run(e)}>
            {e.slice(0, 12)}...
          </button>
        ))}
      </div>
      <p style={S.hint}>
        講得亂一點沒關係。「牠最近一直舔腳」這種也可以。打完按 Enter 就行。
        {soonHint && !status.live && (
          <>
            <br />
            <span style={{ color: "var(--faint)" }}>
              {cat.zh}還在上架：{status.read} 款的成分表讀完了，購買連結還在補。
            </span>
          </>
        )}
      </p>

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
          />
        </div>
      )}
    </>
  );
}

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
