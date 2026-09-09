"use client";

import { useState } from "react";
import { parse } from "@/lib/parse";
import { adjudicate, stageForAge, type Stage } from "@/lib/engine";
import { catalog, constraintsFor } from "@/lib/catalog";
import type { Verdict } from "@/lib/types";
import { CONTACT } from "@/lib/contact";
import Result from "./Result";
import { S } from "./styles";

/**
 * 裁決器。引擎跑在瀏覽器裡 —— 沒有 API 呼叫、沒有 token 費用。
 *
 * 結果的呈現全部交給 <Result>，跟長尾頁共用同一個元件。
 * 之前兩邊各有一份，改了一邊另一邊就走樣 —— 那個坑踩過一次就夠了。
 */

/*
 * 範例句要挑我們真的答得出來的。
 *
 * 這裡原本放了「12 歲老貓，腎指數偏高」—— 我們一款貓飼料都沒有，
 * 而引擎當時又沒有讀物種，所以點下去會推一款狗飼料給貓主人。
 * 自己在首頁掛一個會出錯的示範，是最貴的那種錯。
 */
const EXAMPLES = [
  "我家柴犬 5 歲，最近一直抓癢，換過兩種雞肉飼料都沒改善",
  "柯基快 8 歲了，有點胖，最近一直軟便",
  "拉不拉多，吃了雞肉就會癢，也不能吃羊",
];

export default function Decider() {
  const [text, setText] = useState("");
  const [chips, setChips] = useState<{ label: string; kind: "info" | "avoid" }[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [empty, setEmpty] = useState(false);
  const [dogKg, setDogKg] = useState<number | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>("adultFixed");

  function run(input: string) {
    const src = input.trim() || EXAMPLES[0];
    setText(src);
    const parsed = parse(src);

    if (parsed.empty) {
      setEmpty(true);
      setVerdict(null);
      setChips([]);
      return;
    }
    setEmpty(false);
    parsed.situation.constraints = constraintsFor(parsed.situation);
    setChips(parsed.chips.map((c) => ({ label: c.label, kind: c.kind })));
    setDogKg(parsed.situation.weightKg);
    setSymptoms(parsed.situation.symptoms);
    setStage(stageForAge(parsed.situation.ageYears));
    setVerdict(adjudicate(catalog, parsed.situation));
    requestAnimationFrame(() => {
      document.getElementById("verdict")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <>
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
          placeholder="例如：我家柴犬 5 歲，最近一直抓癢，換過兩種飼料都沒改善…"
          rows={3}
        />
        <button style={S.go} onClick={() => run(text)}>裁決</button>
      </div>

      <div style={S.chipRow}>
        {EXAMPLES.map((e) => (
          <button key={e} style={S.example} onClick={() => run(e)}>
            {e.slice(0, 12)}…
          </button>
        ))}
      </div>
      <p style={S.hint}>
        講得亂一點沒關係。「牠最近一直舔腳」這種也可以。打完按 Enter 就行。
        <br />
        <span style={{ color: "var(--faint)" }}>目前只有狗飼料，貓的還在做。</span>
      </p>

      {empty && (
        <div style={S.emptyBox}>
          <p style={{ margin: 0, fontWeight: 700 }}>這句話我們讀不出條件</p>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 15, lineHeight: 1.85 }}>
            試著講品種、年齡，還有你觀察到的狀況 —— 例如「柴犬五歲，一直抓癢」。
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
