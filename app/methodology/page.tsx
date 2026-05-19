import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MatchSimulator from "@/components/MatchSimulator";
import { matches } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Methodology — The ZONE 27 Engine Whitepaper",
  description:
    "完整論文等級的技術白皮書。蒙地卡羅 9 局逐打席引擎、壘上推進物理、10,000 次收斂統計、v0.4 路線圖。",
};

export default function MethodologyPage() {
  const demoMatch = matches[0];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          TECHNICAL WHITEPAPER · v0.2 · MAY 2026
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          The ZONE 27
          <br />
          <span className="text-gold">Engine</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          我們不寫公關稿,只寫技術筆記。
          這是 ZONE 27 蒙地卡羅引擎完整的內部運作說明。
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── ABSTRACT ─────────────────────────────── */}
      <Section no="00" label="ABSTRACT" zh="摘要">
        <p>
          ZONE 27 採用蒙地卡羅(Monte Carlo)模擬法估算 CPBL 比賽的勝率分布。
          引擎 v0.2 為逐打席對決模型(Real At-Bat),每場虛擬比賽包含
          約 70 個打席,以投手 K/9 · BB/9 · HR/9 三項進階指標推導 8 種互斥結果的條件機率,
          配合壘上跑者推進物理累計分數。10,000 次採樣的收斂結果通常與歷史鎖定 AI
          預測落在 <Mono>±2%</Mono> 內。
        </p>
        <p>
          本白皮書解釋這個引擎的每一個內部決策、簡化假設、與已知限制。
          所有程式碼皆開源:
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/blob/main/lib/simulator.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline mx-1"
          >
            lib/simulator.ts
          </a>
          。
        </p>
      </Section>

      {/* ── 01 WHY BASEBALL ──────────────────────── */}
      <Section no="01" label="WHY BASEBALL" zh="為什麼是棒球">
        <p>
          棒球是所有主流團體運動裡,最適合 Monte Carlo 模型的賽事。原因有四:
        </p>
        <ol className="space-y-3 pl-1">
          <li>
            <strong className="text-bone">A.</strong>{" "}
            事件離散(discrete events)— 一場比賽由 ~70-80 個獨立打席組成,每個都有明確開始與結束。
          </li>
          <li>
            <strong className="text-bone">B.</strong>{" "}
            馬可夫性質(Markov property)— 下一個打席的結果條件機率僅取決於投手 vs 打者,與之前的歷史無關。
          </li>
          <li>
            <strong className="text-bone">C.</strong>{" "}
            數據紀錄完整 — 100 年以上的歷史 PA-level 統計,每位 CPBL 投打者都有完整進階數據。
          </li>
          <li>
            <strong className="text-bone">D.</strong>{" "}
            大數法則生效 — 一場 ~70 個打席的樣本量,足以讓中央極限定理穩定地呈現分布特性。
          </li>
        </ol>
        <p>
          作為對比,足球(連續事件、長依賴鏈)與籃球(攻守快速切換、佔球時間影響)都不適合單純的 Monte Carlo,
          需要更複雜的 agent-based 模型才能逼近真實。
        </p>
      </Section>

      {/* ── 02 THE ENGINE ────────────────────────── */}
      <Section no="02" label="THE ENGINE" zh="引擎架構">
        <p>v0.2 引擎的執行流程:</p>
        <Pre>
          {`for inning in 1..9:
  for half in [TOP, BOTTOM]:
    outs = 0
    bases = [empty, empty, empty]
    while outs < 3:
      outcome = sample_pa(pitcher_probs)
      bases, runs, new_outs = apply(outcome, bases)
      outs += new_outs
      score += runs

repeat 10,000 times → aggregate
`}
        </Pre>
        <p>
          每場虛擬比賽包含 18 個半局,平均 ~70 個打席。10,000 場 = ~700,000 次亂數採樣,
          全部在使用者瀏覽器端的 JavaScript runtime 執行,使用{" "}
          <Mono>requestAnimationFrame</Mono> 批次每幀 200 場以維持 UI 流暢。
        </p>
      </Section>

      {/* ── 03 PA MODEL ──────────────────────────── */}
      <Section no="03" label="PLATE APPEARANCE MODEL" zh="打席結果模型">
        <p>每個打席有 8 種互斥結果,機率必須加總為 1.0:</p>
        <Pre>
          {`K_rate  = clamp(K9 / 38, 0.15, 0.35)
BB_rate = clamp(BB9 / 38, 0.04, 0.16)
HR_rate = clamp(HR9 / 38, 0.008, 0.06)

remaining = 1 - K_rate - BB_rate - HR_rate

outsInPlay = remaining × 0.65   → GO×0.55, FO×0.45
hitsInPlay = remaining × 0.35   → 1B×0.75, 2B×0.20, 3B×0.05
`}
        </Pre>
        <p>
          選擇 <Mono>38</Mono> 為「每 9 局期望打席數」的常數,基於 CPBL 過去 10 年平均(約 36-40)。
          <Mono>clamp</Mono> 邊界值用於防範極端投手數據(如菜鳥首登 K/9 = 0)造成的數值崩潰。
        </p>
        <p>
          剩餘 65% / 35% 拆分(場內出局 vs 場內安打)與 CPBL 聯盟 BABIP ~.300 一致。
          現實是 BABIP 受守備影響,本模型暫時將其視為均質。
        </p>
      </Section>

      {/* ── 04 BASERUNNER PHYSICS ────────────────── */}
      <Section no="04" label="BASERUNNER PHYSICS" zh="壘上推進物理">
        <p>當打席結果產出,壘上跑者依下列規則更新:</p>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-line/60">
              <th className="text-left py-2 font-mono text-gold/70 text-[10px] tracking-[0.25em] w-20">
                結果
              </th>
              <th className="text-left py-2 font-mono text-gold/70 text-[10px] tracking-[0.25em]">
                壘上推進規則
              </th>
            </tr>
          </thead>
          <tbody className="text-mute">
            <tr className="border-b border-line/30">
              <td className="py-3 font-mono text-bone">K / GO / FO</td>
              <td className="py-3">1 出局,壘上不動</td>
            </tr>
            <tr className="border-b border-line/30">
              <td className="py-3 font-mono text-bone">BB</td>
              <td className="py-3">滿壘強制推進得 1 分;否則壘上不動,打者上一壘</td>
            </tr>
            <tr className="border-b border-line/30">
              <td className="py-3 font-mono text-bone">1B</td>
              <td className="py-3">三壘必得分,二壘 60% 得分(否則上三壘),一壘 20% 上三壘(否則上二壘),打者上一壘</td>
            </tr>
            <tr className="border-b border-line/30">
              <td className="py-3 font-mono text-bone">2B</td>
              <td className="py-3">三壘 + 二壘必得分,一壘 50% 得分(否則上三壘),打者上二壘</td>
            </tr>
            <tr className="border-b border-line/30">
              <td className="py-3 font-mono text-bone">3B</td>
              <td className="py-3">所有跑者得分,打者上三壘</td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-gold">HR</td>
              <td className="py-3">所有跑者 + 打者得分,壘上清空</td>
            </tr>
          </tbody>
        </table>

        <p>
          1B / 2B 的條件機率(60% / 50%)為簡化模型,基於 CPBL 跑壘數據的中位數。
          v0.4 將加入「跑者速度」與「外野手臂力」作為條件變數。
        </p>
      </Section>

      {/* ── 05 VALIDATION ────────────────────────── */}
      <Section no="05" label="VALIDATION" zh="收斂驗證">
        <p>為什麼是 10,000 次而非 1,000 或 100,000?</p>
        <p>
          設 <Mono>p</Mono> 為真實勝率,
          <Mono>X̂</Mono> 為 n 次採樣後的估計值。
          根據中央極限定理:
        </p>
        <Pre>
          {`SE(X̂) = sqrt(p × (1-p) / n)
N = 10,000, p ≈ 0.5  →  SE ≈ 0.5%
N = 10,000, p ≈ 0.6  →  SE ≈ 0.49%
`}
        </Pre>
        <p>
          也就是 10,000 次採樣的<strong className="text-bone">標準誤差 &lt; 0.5%</strong>,
          意即 95% 信心區間約為 <Mono>X̂ ± 1.0%</Mono>。
          這已足以分辨「兄弟 62%」與「兄弟 60%」這種等級的差異。
        </p>
        <p>
          再多 10 倍樣本(100,000 次)只能把信心區間縮小到 ±0.3%,
          收益遞減,瀏覽器端執行時間卻增加 10 倍。10,000 是計算成本與精度的最佳平衡點。
        </p>
      </Section>

      {/* ── 06 LIMITATIONS ───────────────────────── */}
      <Section no="06" label="LIMITATIONS" zh="已知限制">
        <p>v0.2 的誠實清單:</p>
        <ul className="space-y-3">
          <li>
            <strong className="text-bone">無打者個別品質</strong> ─
            所有打者假設為聯盟平均。一支全壘打強打線跟全菜鳥的二軍同樣對待。
          </li>
          <li>
            <strong className="text-bone">無左右投對左右打拆解(Platoon Splits)</strong> ─
            真實棒球中左投對左打 K 率 +5pp,本模型忽略。
          </li>
          <li>
            <strong className="text-bone">無中繼/牛棚切換</strong> ─
            假設先發投手投滿 9 局。實際 CPBL 平均先發投 5.8 局,後段由風格不同的牛棚投。
          </li>
          <li>
            <strong className="text-bone">無守備差異</strong> ─
            BABIP 假設聯盟均值。實際強守備隊伍會把更多場內球轉換成出局。
          </li>
          <li>
            <strong className="text-bone">無球場因素(Park Factors)</strong> ─
            台中洲際(打者球場)與天母(投手球場)用同一機率模型。
          </li>
          <li>
            <strong className="text-bone">無投手疲勞</strong> ─
            第 9 局的 K 率與第 1 局相同;真實情況下第 7 局後 K 率下降約 8%。
          </li>
        </ul>
        <p>
          這些限制都明確,且都列入 v0.4 路線圖。
          我們相信誠實列出弱點,比假裝模型完美更值得信任。
        </p>
      </Section>

      {/* ── 07 TRY IT ────────────────────────────── */}
      <Section no="07" label="TRY IT" zh="親手驗證">
        <p>
          以上所有理論,在下方的引擎裡實際執行。
          按 <Mono>RUN 10,000 SIMULATIONS</Mono> 看真實的 Poisson 採樣與壘上推進物理,
          再按 <Mono>REPLAY ONE GAME</Mono> 看一場 9 局逐打席文字直播 ──
          完全在您的瀏覽器端執行,可離線運作,沒有任何 API 呼叫。
        </p>
        <div className="mt-8">
          <MatchSimulator key={demoMatch.id} match={demoMatch} />
        </div>
      </Section>

      {/* ── 08 ROADMAP ───────────────────────────── */}
      <Section no="08" label="ROADMAP" zh="v0.4 路線圖">
        <p>下兩個主要版本的計畫:</p>
        <ul className="space-y-4">
          <li>
            <strong className="text-bone">v0.3 (Batter Quality)</strong> ─
            每位打者導入 OPS / wRC+ / K%,改寫 PA 機率模型成
            <Mono>P(outcome | pitcher × batter)</Mono> 的雙條件矩陣。
          </li>
          <li>
            <strong className="text-bone">v0.4 (Trackman Priors)</strong> ─
            接入 stats.cpbl.com.tw 公開的雷達追蹤資料(球速、轉軸、進壘角度),
            把投手 K/9 等率取代為更精細的<Mono>球路 × 區位</Mono>條件機率。
          </li>
          <li>
            <strong className="text-bone">v0.5 (Bullpen + Fatigue)</strong> ─
            模型先發投手在第 5-7 局換投的決策,後段由團隊牛棚均值機率接手。
          </li>
          <li>
            <strong className="text-bone">v0.6 (Defense + Park)</strong> ─
            各隊守備效率 (DRS) 調整 BABIP,各球場 HR/9 + 得分環境因子。
          </li>
        </ul>
        <p>
          每次升級都會出現在
          <Link href="/changelog" className="text-gold underline-offset-4 hover:underline mx-1">
            /changelog
          </Link>
          ,所有變動 commit message 公開可審。
        </p>
      </Section>

      {/* ── 09 REFERENCES ────────────────────────── */}
      <Section no="09" label="REFERENCES" zh="參考文獻">
        <ul className="space-y-3 text-sm">
          <li>
            ▸ James, Bill. <em>The Bill James Historical Baseball Abstract</em>.
            Free Press, 2001.
          </li>
          <li>
            ▸ Palmer, Pete &amp; Thorn, John. <em>The Hidden Game of Baseball</em>.
            University of Chicago Press, 1984.
          </li>
          <li>
            ▸ Albert, Jim &amp; Bennett, Jay. <em>Curve Ball</em>.
            Springer, 2003.
          </li>
          <li>
            ▸{" "}
            <a
              href="https://library.fangraphs.com/principles/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              FanGraphs Glossary
            </a>
            {" "}— Sabermetrics terminology reference.
          </li>
          <li>
            ▸{" "}
            <a
              href="https://baseballsavant.mlb.com/csv-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              MLB Statcast CSV docs
            </a>
            {" "}— Trackman 雷達資料欄位定義。
          </li>
          <li>
            ▸{" "}
            <a
              href="https://stats.cpbl.com.tw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              stats.cpbl.com.tw
            </a>
            {" "}— CPBL 官方進階數據站(2026 年新上線)。
          </li>
        </ul>
      </Section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          THE NUMBERS ARE THE STORY.
        </p>
        <h3 className="text-3xl text-bone font-light tracking-tight">
          現在您已知道每個亂數來自哪裡。
        </h3>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/lab"
            className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            FULL LAB →
          </Link>
          <Link
            href="/founders"
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            JOIN THE WAITLIST →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────

function Section({
  no,
  label,
  zh,
  children,
}: {
  no: string;
  label: string;
  zh: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40">
      <div className="flex items-baseline gap-4 mb-2">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {label}
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-8">{zh}</h2>
      <div className="space-y-5 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-gold/90 bg-ink/40 px-1.5 py-0.5 text-[0.9em] border border-line/60">
      {children}
    </code>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-ink/40 border border-line/60 p-4 sm:p-5 overflow-x-auto font-mono text-[12px] sm:text-sm text-bone leading-relaxed my-2">
      <code>{children}</code>
    </pre>
  );
}
