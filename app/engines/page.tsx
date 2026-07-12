import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReliabilityDiagram from "@/components/ReliabilityDiagram";
import { getFinalizedMatches, getTrackRecordStats } from "@/lib/matches";
import {
  computeBaseballBins,
  computeMlbBins,
  computeTennisBins,
  type CalibrationBin,
} from "@/lib/calibration";
import { computeSoccerBins, getSoccerGradedCount } from "@/lib/soccer/calibration";
import { getLockedSoccerPredictions } from "@/lib/soccer/locked";
import { gradeTennisEngine } from "@/lib/tennis/matches";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /engines · 三套引擎攤在桌上(透明制霸)─────────────────────────────
// Tim「升級成三套運動深頁:白話方法 + 公開公式 + 活的校準曲線 + 57% 天花板當賣點 +
// 含贏含輸」。 框架 = 透明不是神祕(FiveThirtyEight「Checking Our Work」式;那種叫
// 『超級電腦』、只丟一個漂亮數字卻不對帳的黑箱是反例)。 賽事頁的方法說明砍成一行 +
// 連結進這裡(/engines#baseball / #soccer / #tennis)· 賽事頁乾淨、深度集中在這頁。
//
// 🔴 紅線(逐條對過):無「神準 / 最準 / 比莊家準」· 無付費=更準(引擎人人免費)·
//    站上不提 GitHub / 開源 / 原始碼 · 不指名 displacement 對手 · 不掛盤口賠率 ·
//    暗金無紅綠 emoji · 公式攤開但不裝物理常數(旋鈕誠實標「擬合出來的」)。
// 這頁是 /methodology(深技術版)的白話前門;深想看的人從這裡點進去。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "三套引擎 · 公式與活校準全攤開",
  description:
    "別人說「我家 AI 神準」卻不說怎麼算的。 ZONE 27 把方法的名字、真正的公式、會錯幾成、連沒中的全部寫給你看:棒球逐打席蒙地卡羅、足球 Dixon-Coles 雙變量卜瓦松、網球表面校正 Elo。 還掛上每套引擎的活校準曲線。 透明,不是神祕 —— 因為沒有神準這種事。",
  ogTitle: "三套引擎攤在桌上 · 公式 + 活校準 · ZONE 27",
  ogDescription:
    "棒球:逐打席蒙地卡羅 · 足球:Dixon-Coles · 網球:表面校正 Elo · 公式公開、校準曲線活的、57% 天花板掛出來 · 每場賽前鎖死、賽後對帳、連沒中的都掛",
  path: "/engines",
  type: "article",
});

export const revalidate = 3600;

export default function EnginesPage() {
  const tr = getTrackRecordStats();

  // ── 各運動的活校準資料(全部純函式 / 靜態 · 0 API · 與 /calibration 同源)──────
  // 棒球(CPBL · 同 /calibration 的 getFinalizedMatches)· N 取「實際畫進圖的場」(分箱總和)·
  // 與足球 getSoccerGradedCount / 網球 gradeTennisEngine().n 同口徑 → 曲線「已 N 場」永遠 = 散點 = 對帳數
  // (和局 / 真・五五波不進分箱,也就不進 N)。
  const baseballFinal = getFinalizedMatches();
  const baseballBins = computeBaseballBins(baseballFinal);
  const baseballN = baseballBins.reduce((s, b) => s + b.count, 0);
  // MLB(R296 · 段標寫著「CPBL / MLB」曲線卻只餵 CPBL = 標示與資料不符 · 補上第二張)·
  // 同一套引擎、各聯盟各畫各的(混池紅線 · 同 /calibration)。
  const mlbBins = computeMlbBins();
  const mlbN = mlbBins.reduce((s, b) => s + b.count, 0);

  // 足球(讀打包的賽前鎖定檔 · 同 /calibration 的 computeSoccerBins · 滿格才畫)
  const soccerLocked = getLockedSoccerPredictions();
  const soccerBins = computeSoccerBins();
  const soccerN = getSoccerGradedCount();
  const soccerLockedN = soccerLocked.length;
  const soccerProved = soccerLocked.filter((p) => p.verdict === "proved").length;
  const soccerDiverged = soccerLocked.filter((p) => p.verdict === "diverged").length;
  const soccerPending = soccerLocked.filter((p) => p.outcome === null).length;

  // 網球(賽果 Tim curate + ESPN 鏡像 · gradeTennisEngine 含輸照算)
  const tennisRec = gradeTennisEngine();
  const tennisBins = computeTennisBins();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-16 sm:pt-20 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 我們的引擎
          </p>
          <h1 className="text-3xl sm:text-5xl text-bone font-light tracking-tight leading-[1.12]">
            三套引擎 · <span className="text-gold">攤在桌上</span>
          </h1>
          <div className="zone27-rule max-w-[300px] mt-7 mb-7" aria-hidden="true" />
          <p className="text-mute text-base sm:text-lg leading-relaxed max-w-2xl">
            別人說「我家 AI 神準」,然後不告訴你怎麼算的。 我們相反 ——{" "}
            <span className="text-bone">
              方法的名字、真正的公式、會錯幾成,連沒中的,全部寫給你看。
            </span>
          </p>

          {/* 活證據:不是嘴上說透明,直接掛真戰績(含沒中的)*/}
          {tr.total > 0 && (
            <Link
              href="/track-record"
              className="mt-7 inline-flex items-baseline gap-2.5 sm:gap-3 font-mono tabular flex-wrap hover:opacity-80 transition-opacity"
              aria-label={`引擎公開戰績 · ${tr.total} 場已對帳 · 命中 ${tr.proved} · 沒中 ${tr.diverged}`}
            >
              <span className="text-mute text-[10px] tracking-[0.3em]">引擎戰績</span>
              <span className="text-bone text-sm">
                <strong className="text-gold">{tr.total}</strong> 場
              </span>
              <span className="text-gold text-sm">✓{tr.proved}</span>
              <span className="text-loss/85 text-sm">✕{tr.diverged}</span>
              <span className="text-mute text-[9px] tracking-[0.2em]">連沒中的也掛 →</span>
            </Link>
          )}
        </section>

        {/* ── 透明不是神祕(框架 LEAD)+ 57% 天花板 ──────────────────────
            538「Checking Our Work」式正面對照「超級電腦黑箱」反例。 不指名對手 ·
            FiveThirtyEight 是站上既有、正面的引用(tennis/engine 註解早有)· 黑箱 foil
            用通用描述不點名。 57% = 對手「神準」謊言的數學證據(plain words · 不 render
            Brier/論文)。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 透明,不是神祕
          </p>
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6 py-1 space-y-4">
            <p className="text-bone text-lg sm:text-xl font-light leading-relaxed">
              市面上有種東西叫「超級電腦預測」 —— 丟給你一個漂亮數字,卻
              <span className="text-gold">不告訴你怎麼算、也從不回頭對帳</span>。
              那不是科學,是包裝。
            </p>
            <p className="text-mute leading-relaxed">
              我們站在另一邊:像 FiveThirtyEight 那樣,把
              <span className="text-bone">方法、公式、準度</span>全部公開讓你檢查。
              下面三套引擎,每一套都寫出它的名字、攤開它的公式、掛上它「說幾成、實際中幾成」
              的<span className="text-bone">活校準曲線</span>。
            </p>
          </div>

          <div className="mt-8 bg-slate/30 border border-line/60 p-5 sm:p-6">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.4em] mb-3">
              / 為什麼沒有「神準」這種引擎
            </p>
            <p className="text-mute leading-relaxed">
              連全世界最強的引擎 —— 包括拉斯維加斯的盤口 —— 單場棒球也只到大約{" "}
              <span className="text-bone">5 成 7(57%)</span> · 足球三選一更低 ·
              理論上限就 6 成上下。 因為這些運動本質帶著洗不掉的運氣:王牌也會被打爆,
              墊底的也會爆冷。 任何宣稱「<span className="text-loss/90">94% 勝率</span>」
              「鐵口神準」的,<span className="text-bone">數學上不可能</span>。
            </p>
            <p className="mt-3 text-mute leading-relaxed">
              我們不比別人準 ——{" "}
              <span className="text-bone">我們敢把這道 5 成 7 的天花板掛出來、還讓你逐場對帳。</span>
            </p>
          </div>

          {/* 三套引擎跳轉 chip(深頁內導覽)*/}
          <nav
            aria-label="三套引擎"
            className="mt-8 flex flex-wrap gap-2.5 font-mono text-[10px] tracking-[0.3em]"
          >
            <JumpChip href="#baseball" label="棒球 · 蒙地卡羅" />
            <JumpChip href="#soccer" label="足球 · Dixon-Coles" />
            <JumpChip href="#tennis" label="網球 · Elo" />
          </nav>
        </section>

        {/* ════════════════ 棒球 ════════════════ */}
        <EngineSection
          id="baseball"
          sport="棒球 · CPBL / MLB"
          engine="逐打席蒙地卡羅模擬"
          version="v0.2"
        >
          <Plain>
            把整場球在電腦裡,用「每個打席會發生什麼」的真實機率,從第一局打到第九局 ——
            打一萬次。 哪一隊贏比較多次,那個比例就是我們給你的勝率。 你能按下按鈕、
            <span className="text-bone">親眼看它在電腦裡打那一萬場</span> —— 沒有黑箱、沒有玄學。
          </Plain>

          <FormulaCard caption="投入:兩隊先發投手的 K/9(三振率)· BB/9(保送率)· HR/9(被全壘打率)+ 主場優勢。">
            {`每個打席 ── 依先發投手的 K/9 · BB/9 · HR/9
            抽一個結果(三振 / 保送 / 安打 / 全壘打 / 出局 …)
壘上跑者依結果推進、得分累加 ── 打滿 9 局 = 一場
重複 10,000 場 ── 贏的場數 ÷ 10,000 = 勝率(再加主場優勢)`}
          </FormulaCard>
          <p className="text-mute text-[13px] leading-relaxed">
            跑滿一萬次後,引擎自己每次算出來的勝率只會差大約{" "}
            <span className="text-bone font-mono">±2%</span> —— 那是亂數採樣本身的天花板,
            不是它對 CPBL 比賽的準度。 完整虛擬碼 + 親手跑在{" "}
            <Link href="/methodology" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
              方法白皮書
            </Link>{" "}
            和{" "}
            <Link href="/lab" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
              實驗室
            </Link>
            。
          </p>

          <EngineCurve
            sport="中職 CPBL"
            bins={baseballBins}
            n={baseballN}
            engineVersion="v0.2"
            zeroNote="引擎還沒結算任何一場。 第一個落點 · 統一 vs 富邦(2026-05-21 新莊)。"
          />
          {/* MLB 第二張曲線(R296)· 同引擎、自動盤、樣本累積最快 —— 但跟中職各畫各的(混池紅線)。
              走同一個 EngineCurve(標頭 + N<30 警示 + 零狀態全都同款 · 不手排第二種版型)。 */}
          <div>
            <EngineCurve
              sport="美職 MLB"
              bins={mlbBins}
              n={mlbN}
              engineVersion="v0.2"
              zeroNote="MLB 自動盤還沒結算任何一場 · 曲線從第一場打完開始長。"
            />
            <p className="mt-3 text-mute text-[13px] leading-relaxed">
              MLB 跟中職同一套引擎(每天自動賽前鎖定、賽後對鎖定值結算)——
              曲線分開畫,混池會遮掉各聯盟自己的真實校準。
            </p>
          </div>
          <RecordLine
            proved={tr.proved}
            diverged={tr.diverged}
            pending={null}
            href="/track-record"
            note="中職(CPBL)逐場對帳 · 命中、落空都掛、刪不掉。"
          />
          <SportCtas board={{ href: "/matches", label: "看棒球引擎開盤 →" }} />
        </EngineSection>

        {/* ════════════════ 足球 ════════════════ */}
        <EngineSection
          id="soccer"
          sport="足球 · 世界盃 + 各大聯賽"
          engine="Dixon-Coles 雙變量卜瓦松"
          version="v0.1"
        >
          <Plain>
            用兩隊的「進攻力、防守力」算出各自大概會進幾球,再把
            <span className="text-bone">整張比分表</span>(0 比 0、1 比 0、2 比 1…)的機率全部加總,
            推出主隊贏 / 平手 / 客隊贏的機率。 足球進球少、平手多,這套數學是全世界足球分析公認
            最適合足球的底層方法。
          </Plain>

          <FormulaCard caption="這些旋鈕是擬合出來的、不是物理常數 —— 我們照實標,不裝神祕。">
            {`λ主 = 場均進球 × 兩隊攻防強弱(+ 主場優勢)
λ客 = 場均進球 × 兩隊攻防強弱
P(主進 x · 客進 y) = 卜瓦松(x ; λ主) × 卜瓦松(y ; λ客) × τ(x, y ; ρ)
把整張比分表(每邊 0..8 球)機率加總 ── 主勝 / 和 / 客勝`}
          </FormulaCard>
          <ul className="text-mute text-[13px] leading-relaxed space-y-1 font-mono tabular">
            <li>▸ 主場優勢 ≈ +60 實力分</li>
            <li>▸ 場均總進球 ≈ 2.6(世界盃口徑)</li>
            <li>▸ 低比分相依修正 ρ ≈ −0.08(Dixon-Coles 的招牌修正)</li>
            <li>▸ 每 100 分實力差 ≈ 0.45 球</li>
          </ul>
          <p className="text-mute text-[13px] leading-relaxed">
            大小球 / 讓球 / 兩隊進球那些玩法,全是從<span className="text-bone">同一張比分表</span>推的 ——
            跟主 / 和 / 客同源、零落差。 我們只秀自己算的機率,不接盤口、不轉賠率。
          </p>

          <EngineCurve
            sport="足球"
            bins={soccerBins}
            n={soccerN}
            engineVersion="v0.1"
            lockedN={soccerLockedN}
            zeroNote={
              <>
                足球引擎已經<span className="text-gold">賽前鎖死 {soccerLockedN} 場</span>預測,
                但還沒有一場結算。 這張校準圖從世界盃第一場打完開始長 —— 跟棒球
                <span className="text-bone">分開算</span>,連估錯的也照畫。
              </>
            }
          />
          <RecordLine
            proved={soccerProved}
            diverged={soccerDiverged}
            pending={soccerPending}
            href="/track-record#soccer"
            note="三選一(主 / 和 / 客)· 和局最難喊、連喊不出的和局都老實算自己落空 → 命中率天生比棒球低,真正的尺是校準。"
          />
          <SportCtas board={{ href: "/soccer", label: "看足球引擎開盤 →" }} />
        </EngineSection>

        {/* ════════════════ 網球 ════════════════ */}
        <EngineSection
          id="tennis"
          sport="網球 · 運彩在賣的場"
          engine="表面校正 Elo"
          version="v0.2"
        >
          <Plain>
            把每位球員的世界排名換算成實力分,加上草地 / 紅土的表面校正,再用標準 Elo
            邏輯算出兩人各自的勝率。 Elo 是網球分析最通用、最透明的底層方法
            (FiveThirtyEight、Tennis Abstract 都用這套)。
          </Plain>

          <FormulaCard caption="這是排名換算的「種子估計」,不是磨厚的戰績 Elo —— 隨真實賽果一場一場更新。">
            {`實力分 R = 2180 − 95 × ln(世界排名)
表面分 = 0.5 × 該表面分 + 0.5 × 總分
P(A 贏) = 1 / ( 1 + 10 ^ ((R對手 − RA) / 400) )
        ── 每 400 分 ≈ 勝率差 10 倍(標準 Elo)`}
          </FormulaCard>

          <EngineCurve
            sport="網球"
            bins={tennisBins}
            n={tennisRec.n}
            engineVersion="v0.2"
            lockedN={tennisRec.pending}
            zeroNote={
              <>
                網球引擎已對 <span className="text-gold">{tennisRec.pending} 場</span>賽前開盤、鎖死,
                但賽果還在逐場 curate。 這張校準圖從第一場對帳完開始長 —— 跟棒球、足球
                <span className="text-bone">三本帳分開算</span>。
              </>
            }
          />
          {/* 網球誠實層(永遠顯示 · Pratfall):好預測 ≠ 神準 → 真尺是校準 */}
          <div className="border-l-2 border-gold/50 pl-4 text-mute/85 text-[13px] sm:text-sm leading-relaxed">
            <p>
              網球會<span className="text-bone">看起來比棒球準很多</span> —— 那不是我們變天才,是網球
              <span className="text-bone">本來就好預測</span>(一個人控制每一球、五盤三勝磨平運氣)。
              所以網球更要看<span className="text-gold">校準</span>:喊 70%,長期就該中 70%,不是 85% 也不是 55%。
            </p>
          </div>
          <RecordLine
            proved={tennisRec.hits}
            diverged={tennisRec.misses}
            pending={tennisRec.pending}
            href="/tennis"
            note="排名換算的表面校正 Elo 賽前逐場開盤、賽後對帳 · 看好邊中沒中、落空照掛、永不刪。"
          />
          <SportCtas board={{ href: "/tennis", label: "看網球引擎開盤 →" }} />
        </EngineSection>

        {/* ── 深一層 + 自己測 ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-t border-line/40">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.4em] mb-5">
            / 還想更深
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] tracking-[0.3em]">
            <Link href="/methodology" className="text-gold/80 hover:text-gold transition-colors">
              完整技術白皮書 →
            </Link>
            <Link href="/calibration" className="text-mute hover:text-gold transition-colors">
              引擎自評 · 公開校準頁 →
            </Link>
            <Link href="/calibration/test" className="text-mute hover:text-gold transition-colors">
              先測你自己多準 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// 三套引擎跳轉 chip(頁內錨點)。
function JumpChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="border border-line/60 text-mute/80 hover:text-gold hover:border-gold/50 px-3 py-1.5 transition-colors"
    >
      {label}
    </a>
  );
}

// 一套引擎的深區塊外框(錨點 id · 賽事頁的「一行 + 連結」就指這裡)。
function EngineSection({
  id,
  sport,
  engine,
  version,
  children,
}: {
  id: string;
  sport: string;
  engine: string;
  version: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-t border-line/40 scroll-mt-20 cv-auto"
    >
      <div className="flex items-baseline gap-3 mb-3 flex-wrap section-reveal">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">{sport}</p>
        <span className="font-mono text-gold/60 text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30">
          {version}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-6">
        {engine}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

// 白話方法段(怎麼算 · 國小生看得懂)。
function Plain({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-mute text-[15px] sm:text-base leading-relaxed">
      <span className="text-bone/80">怎麼算:</span>
      {children}
    </p>
  );
}

// 公開公式卡(攤開 · 不裝神祕)· mono 等寬塊 · whitespace 保留排版。
function FormulaCard({
  caption,
  children,
}: {
  caption?: string;
  children: string;
}) {
  return (
    <div>
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">/ 公開公式</p>
      <pre className="bg-ink/40 border border-line/60 p-4 sm:p-5 overflow-x-auto font-mono text-[11.5px] sm:text-[12.5px] text-bone leading-[1.7] whitespace-pre-wrap">
        <code>{children}</code>
      </pre>
      {caption && (
        <p className="mt-2 font-mono text-mute text-[10px] tracking-[0.1em] leading-relaxed">
          ▸ {caption}
        </p>
      )}
    </div>
  );
}

// 活校準曲線 + 誠實 frame(N=0 / N<30 / ≥30)· 鏡 /calibration 的 BaseballCalView / SoccerCalView。
function EngineCurve({
  sport,
  bins,
  n,
  engineVersion,
  lockedN,
  zeroNote,
}: {
  sport: string;
  bins: CalibrationBin[];
  n: number;
  engineVersion: string;
  lockedN?: number;
  zeroNote: React.ReactNode;
}) {
  // N=0 · 還沒結算 → 誠實「已鎖未結算」frame(把鎖了還沒對帳當特色不是 bug)。
  if (n === 0) {
    return (
      <div>
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">/ 活校準曲線</p>
        <div className="border border-gold/30 bg-slate/40 p-5 sm:p-6">
          {lockedN !== undefined && lockedN > 0 ? null : (
            <span className="inline-block font-mono text-gold/80 text-[9px] tracking-[0.3em] px-2 py-1 border border-gold/40 mb-3">
              等第一場結算
            </span>
          )}
          <p className="text-bone text-base leading-relaxed">{zeroNote}</p>
          <p className="mt-2 text-mute text-[13px] leading-relaxed">
            校準問的是「引擎說七成的時候、是不是真的中七成」 ——{" "}
            <Link href="/calibration" className="text-gold underline-offset-4 hover:underline">
              公開校準頁
            </Link>{" "}
            逐運動攤開、滿 30 場才算數。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">/ 活校準曲線</p>
      <ReliabilityDiagram bins={bins} n={n} engineVersion={engineVersion} sportLabel={sport} />
      {n < 30 && (
        <div className="mt-4 border border-loss/30 bg-loss/5 p-4 sm:p-5">
          <p className="font-mono text-loss text-[10px] tracking-[0.35em] mb-2">
            ⚠ 資料還太少 · 目前 {n} 場 / 滿 30 場才算數
          </p>
          <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
            場數不到 30 之前,這張圖還看不出名堂 · 任何偏移都可能只是運氣、不是引擎的問題。
            各運動分開算、各自滿格。
          </p>
        </div>
      )}
    </div>
  );
}

// 含贏含輸戰績條(命中 ✓ / 落空 ✕ / 待結算)· 連到 /track-record。
function RecordLine({
  proved,
  diverged,
  pending,
  href,
  note,
}: {
  proved: number;
  diverged: number;
  pending: number | null;
  href: string;
  note: string;
}) {
  const settled = proved + diverged;
  return (
    <div>
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">/ 含贏含輸</p>
      <Link
        href={href}
        aria-label={`公開戰績 · 已對帳 ${settled} 場 · 命中 ${proved} · 落空 ${diverged}${
          pending !== null && pending > 0 ? ` · ${pending} 場待結算` : ""
        } · ${note}`}
        className="block bg-slate/30 border border-line/60 hover:border-gold/40 transition-colors p-4 sm:p-5 group"
      >
        <div className="flex items-baseline gap-3 sm:gap-4 font-mono tabular flex-wrap" aria-hidden="true">
          <span className="text-bone text-sm">
            已對帳 <strong className="text-gold">{settled}</strong> 場
          </span>
          <span className="text-gold text-sm">✓{proved}</span>
          <span className="text-loss/85 text-sm">✕{diverged}</span>
          {pending !== null && pending > 0 && (
            <span className="text-mute text-sm">· {pending} 場待結算</span>
          )}
          <span className="ml-auto font-mono text-mute/85 group-hover:text-gold text-[10px] tracking-[0.25em] transition-colors">
            逐場攤開 →
          </span>
        </div>
        <p className="mt-2.5 text-mute text-[12.5px] leading-relaxed" aria-hidden="true">{note}</p>
      </Link>
    </div>
  );
}

// 該運動的 CTA 列(去看板 + 校準)。
function SportCtas({ board }: { board: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.3em] pt-1">
      <Link href={board.href} className="text-gold/80 hover:text-gold transition-colors">
        {board.label}
      </Link>
      <Link href="/calibration" className="text-mute/70 hover:text-gold transition-colors">
        看引擎準不準 →
      </Link>
    </div>
  );
}
