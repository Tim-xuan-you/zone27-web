import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import PatronAsk from "@/components/PatronAsk";
import SportToggle from "@/components/SportToggle";
import ReliabilityDiagram from "@/components/ReliabilityDiagram";
import { getFinalizedMatches } from "@/lib/matches";
import {
  computeBaseballBins,
  summarizeBins,
  type CalibrationBin,
} from "@/lib/calibration";
import {
  computeSoccerBins,
  getSoccerGradedCount,
} from "@/lib/soccer/calibration";
import { getLockedSoccerPredictions } from "@/lib/soccer/locked";
import { getLatestMomentumReversal } from "@/lib/momentum-reversal";
import MomentumReversalExhibit from "@/components/MomentumReversal";

export const metadata: Metadata = {
  title: "引擎自評 · ZONE 27 公開準不準",
  description:
    "ZONE 27 引擎自評。 引擎賽前說幾成 · 賽後實際中幾成 · 一張圖攤開讓你看。 我們公開自己準不準 · 明牌站不會這樣做 · 因為一公開就會暴露他們嘴上的勝率和實際差很多。",
};

// ── ZONE 27 · /calibration ──────────────────────────────
// Round 39 W-A · Agent A R38 DEEPEST sharp call ship · 從 R38 deferred
// list 取出 · per [[feedback-no-waiting-rule]] 鐵律「不等 Q3 · 任何現在
// 能做就做」。
//
// FiveThirtyEight「Checking Our Work」 pattern · public engine self-
// grading page · 不 gated · 不需 login · 任何 visitor 都看得到。
//
// R189:這是站上唯一的校準頁。 舊的 /member/calibration(個人模式靠已死的
// 追蹤過濾 · 且二元押注畫不出校準曲線)已收合 redirect 到這頁。 會員自己的
// 命中率在 /member 儀表板 · 不在這。
//   - /calibration · public · ENGINE self-grading · ALL ZONE 27 公開
//     predictions · Brier score · coin-flip baseline 對照 · founder voice
//
// Brier score 公式 · Tetlock currency:
//   B = (1/N) Σ (forecast_probability - outcome)²
//   · outcome = 1 if favorite won · 0 if upset
//   · 0 = perfect · 0.25 = coin-flip baseline · 1 = perfectly wrong
//
// brand IP 物理 codify:
//   - displacement battle 對 玩運彩+報馬仔 fought on **realized outputs** ·
//     不是 static trust claims。 first-mover advantage 永久。
//   - 玩運彩 / 報馬仔 / FanGraphs / Pinnacle / Action Network 都從不公布
//     calibration · 因為公布等於 expose 50-52% realized rate vs 94%
//     stated「勝率」。 structurally 不可 copy。
//   - Tetlock 證明(Brier score 論文 2014-2018)「outcome accountability
//     alone improves forecaster accuracy by ~25%」 · 不只 marketing artifact ·
//     是 engine-improvement forcing function。
//
// Pratfall + Costly Signaling + Disclosure 三 axiom 同時 fire:
//   - Pratfall · 公開 over-confidence delta · 「我們欠你的差距」
//   - Costly Signaling · structurally non-copyable by tipster sites
//   - Disclosure · 延伸 /audit 公開 model → 公開 model accuracy 物理
//
// Routing: /calibration · public · 35th visitor-discoverable route。
// ─────────────────────────────────────────────────────

// R211 · 86400→3600:足球引擎卡的「未開賽 N / 開踢後待對帳 M」分流讀 ISR 快照時鐘 ·
// 1 天 ISR 會讓世界盃開踢後標籤最久延遲 24h(說謊)。 1h ISR 收緊到跟 /soccer 一致。
export const revalidate = 3600;

export default function CalibrationPublicPage() {
  const finalized = getFinalizedMatches();
  const n = finalized.length;
  const bins = computeBaseballBins(finalized);
  // R264 · 把「白話判決」一句提到 hero:h1 問「說 X% 時實際贏多少」,用棒球分箱壓出
  // 一句總結直接回答(同上方「已結算 N 場」badge 都是棒球為主)· 逐桶細節仍在圖下方。
  const summary = summarizeBins(bins);
  // 氣勢反轉證物(R239)· 從官方賽果自動撈最近一組「同兩隊、隔幾天、贏家換邊」的戲劇反轉,
  // 把上面「沒有神準 / 別跟氣勢」的論點換成一筆真資料。 找不到 → null → 整段不顯示(graceful)。
  const reversal = getLatestMomentumReversal();
  // 足球(soul R208 #4 · 跟棒球分開算 · 各運動各自套 N≥30 門檻)。 世界盃 6/11 才開賽 →
  // 目前 soccerN=0 已結算 → SportToggle 足球側顯示誠實「已鎖定、未結算」frame。
  const soccerBins = computeSoccerBins();
  const soccerN = getSoccerGradedCount();
  const soccerLockedN = getLockedSoccerPredictions().length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
              / 引擎自評 · 公開我們準不準
            </p>
            <span
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                n === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
              title={`已結算 ${n} 場 · 賽後逐場登錄`}
            >
              {n === 0 ? "等第一場結算" : `已結算 ${n} 場`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            我們的引擎{" "}
            <span className="text-gold">在說 70%</span> 的時候 ·
            <br className="hidden sm:inline" /> 實際上贏多少?
          </h1>

          <div className="mt-8 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              引擎賽前說幾成、賽後實際中幾成 ·{" "}
              <span className="text-gold">一張圖攤開</span>。 命中落空都算、刪不掉。
            </p>
          </div>

          {/* ── 答案先講 ─────────────────────────────────
              「白話判決」一句提到 hero(原本只藏在圖下方、SportToggle 後)· 直接回答 h1 的問題。
              decided>0 → 一句話講「喊看好的那邊、實際中幾成」;=0 → graceful 改成「第一場後寫在這」。 */}
          {summary.decided > 0 ? (
            <div className="mt-7 max-w-2xl">
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">
                / 答案先講
              </p>
              <p className="text-bone text-lg sm:text-xl leading-relaxed">
                到目前 · 引擎喊看好的那一邊,{" "}
                <span className="font-mono tabular text-gold">{summary.decided}</span> 場裡實際中了{" "}
                <span className="font-mono tabular text-gold">
                  {Math.round(summary.favoriteHitPct)}%
                </span>
                。
                {summary.decided < 30 && (
                  <span className="block mt-1.5 text-mute text-base">
                    還不到 30 場 · 先當暖身,多打幾場這個數字才真的算數。
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p className="mt-7 text-mute text-base leading-relaxed max-w-2xl">
              第一場結算後 · 這裡就直接用一句話寫出「引擎喊看好的、實際中了幾成」—— 命中落空都算進去。
            </p>
          )}
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 為什麼沒有「神準」這種引擎(57% 天花板)· LEAD ──────────
            設計審計(2026-06-04 · 3-agent):別讓 N<30 的空校準圖當第一印象
            (資料不足時它是 liability)· 改用「0 資料就成立」的 57% 論證打頭陣 ·
            校準圖退到下方當「我們兌現它的方式」。 engine-strategy memory #4:57%
            = 對手謊言的數學證據。 研究核對(不 render 給訪客):全世界最準的 MLB
            賽前模型 + Vegas 盤口單場命中率 ≈ 57-58%(Vegas 6 年 58.2%)· 理論上限
            ~60%。 學術文獻(Elfrink/Valero/Jia 等)57-59.5% · 少數 ML 宣稱 64% 多是
            in-sample 過擬合不可複製。 護城河 = 敢承認 57% + 逐場對帳 · plain words
            per [[feedback-zone27-pratfall-brand-ip]](不 render Brier/Tetlock/論文)。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 為什麼沒有「神準」這種引擎
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            全世界最準的模型 · 也只到大約{" "}
            <span className="text-gold">5 成 7</span>
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              全世界最準的棒球賽前預測 —— 包括拉斯維加斯的盤口、最頂尖的 AI ——
              單場命中率大約就是{" "}
              <strong className="text-bone">5 成 7(57%)</strong> ·
              理論上限也就 6 成上下。 因為棒球本質上就帶著大量洗不掉的運氣:
              王牌也會被打爆,墊底的也會爆冷。
            </p>
            <p>
              所以任何宣稱「<span className="text-loss/90">94% 勝率</span>」「鐵口神準」的,
              <strong className="text-bone">數學上不可能</strong>。
              我們不比別人準 —— 我們敢把這道 5 成 7 的天花板掛出來、還讓你逐場對帳。
            </p>
          </div>

          {/* R264 · 從 /how-we-grade「兩把尺」蒸餾一句到前線:純數學、不點名(Tim「別太樹敵」)——
              戰績越接近全中,通常不是越準,而是評分的尺越鬆。 解釋了為什麼這條校準線要嚴。 */}
          <div className="mt-8 border border-line/60 bg-slate/30 p-5 sm:p-6 max-w-2xl">
            <p className="text-bone leading-relaxed">
              還有一件事跟數學一樣硬:<strong>評分的尺越鬆 · 戰績就越漂亮</strong>。
            </p>
            <p className="mt-3 text-mute leading-relaxed">
              把「看好的隊只要沒輸、連和局都算中」,命中率自然就衝高 —— 但那是尺的功勞,不是準度。
              我們反過來:看好某隊「贏」、結果和局,一律算{" "}
              <span className="text-loss/90">落空</span>;真・五五波不算。 尺嚴到自己難看,
              這條校準線才量得到真的中、而不是被尺放大的中。{" "}
              <Link
                href="/how-we-grade"
                className="text-gold underline-offset-4 hover:underline"
              >
                看我們怎麼算贏輸
              </Link>
              。
            </p>
          </div>
        </section>

        {/* ── 氣勢的真面目 · 現實親手打臉「跟氣勢押」(R239)──────────
            把上面「沒有神準 / 別跟氣勢」的論點,換成一筆官方賽果真資料:同兩隊、隔幾天、
            贏家完全換邊。 🔴 不主張我們預測到 —— 只證「昨天的比分對今天幾乎沒有預測力」。
            找不到夠戲劇的反轉(門檻見 lib)→ reversal=null → 整段不顯示(graceful)。 */}
        {reversal && (
          <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
              / 氣勢的真面目
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
              昨天大勝 · 今天大敗 ·{" "}
              <span className="text-gold">同樣兩隊</span>
            </h2>
            <p className="text-mute leading-relaxed mb-6 max-w-2xl">
              不用我們講理論 —— 看最近這兩場。 同樣的兩支球隊、只隔幾天,結果完全顛倒。
              這不是哪個模型不夠強,是這項運動天生就帶著洗不掉的運氣。 賣「明牌、跟氣勢」的,
              最怕你看到這種畫面。
            </p>
            <MomentumReversalExhibit reversal={reversal} />
          </section>
        )}

        {/* ── 引擎說的 vs 實際發生 · 我們逐場兌現 57% 的方式 ──────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
            / 引擎說的 vs 實際發生
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6 max-w-2xl">
            上面那道 5 成 7 的天花板 · 這張圖就是我們逐場兌現它的地方 ——
            橫軸是引擎賽前看好的成數,直軸是實際真的中的成數。 點越靠近金色斜線 ·
            代表引擎「說幾成、就真的中幾成」。 滿 30 場才開始算數 ·{" "}
            <span className="text-mute/80">兩個運動分開算、各自對帳</span>。
          </p>
          {/* soul R208 #4 · 運動 filter(538 Checking-Our-Work 式)· 棒球 / 足球各自一張圖、
              各自套 N≥30 門檻 —— 絕不把兩運動混成一條曲線(會遮掉各運動的真實校準)。 */}
          <SportToggle
            containerClass="pt-1 pb-5"
            baseball={<BaseballCalView bins={bins} n={n} />}
            soccer={
              <SoccerCalView bins={soccerBins} n={soccerN} lockedN={soccerLockedN} />
            }
          />
        </section>

        {/* ── 這頁是「引擎」準不準 · 你自己準不準是另一回事 ───────────
            R189 收合:原本指「你的準度對照頁(/member/calibration)」· 那頁的
            個人模式靠已死的「追蹤賽事」過濾 · 且二元押注本來就畫不出校準曲線
            (要有機率預測才有 45° 校準)· 已收掉。 誠實重寫:校準圖是引擎的事 ·
            你押的有沒有中是「命中率」· 在儀表板從第一注算起 · 指向 /member。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 你自己準不準
          </p>
          <div className="bg-slate/30 border border-line/60 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-4">
              這頁攤開的是 <span className="text-gold">引擎</span> 準不準 ·{" "}
              <span className="text-gold">你</span> 準不準是另一回事
            </h3>
            <p className="text-mute leading-relaxed mb-4">
              這頁是全站公開預測的平均 · 任何人都看得到 · 不用登入 —— 它回答
              「引擎說七成的時候、是不是真的中七成」。 你自己押的那些場有沒有中,
              是<span className="text-bone">你的命中率</span> · 那在你的儀表板:
              從第一注開始算 · 每場賽後自動對照引擎 · 押了刪不掉。
            </p>
            {/* 缺的靈魂:讓訪客親手玩一次校準 —— 用打完的比賽藏住比分、滑信心、攤開
                對照「你以為的把握 vs 實際中」· 親身摸到 5 成 7 天花板(0 登入 · 純練習)*/}
            <div className="mb-5 border border-gold/40 bg-gold/5 p-4 sm:p-5">
              <p className="text-bone text-base sm:text-lg leading-relaxed mb-3">
                <strong>與其聽我們講「沒人是神」· 不如你自己試一次。</strong>{" "}
                拿幾場打完的比賽藏住比分 · 換你當引擎滑出把握 · 攤開看你有多準。
              </p>
              <Link
                href="/calibration/test"
                className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
              >
                → 玩一次校準練習 · 你有多準?
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login?next=/member"
                className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
              >
                → 登入看你的準度
              </Link>
              <Link
                href="/methodology"
                className="inline-block px-6 py-2.5 border border-line/60 text-mute font-mono text-[10px] tracking-[0.3em] hover:text-gold hover:border-gold/40 transition-colors"
              >
                → 完整算法說明
              </Link>
            </div>
          </div>
        </section>

        {/* 把這張「自評準度」傳出去 · 明牌站不敢公開的那張圖本身就是最強證據(分享卡已自帶命題)。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 text-center">
          <p className="text-mute text-sm leading-relaxed mb-4 max-w-md mx-auto">
            這張「我們說幾成、實際中幾成」的圖,<span className="text-bone">明牌站不敢公開</span>。
            把它丟給還在信「神準」的人 —— 讓他自己看一個敢攤開準度的長怎樣。
          </p>
          <div className="flex justify-center">
            <CopyLinkButton
              label="把這張自評準度傳出去"
              doneLabel="已複製 · 貼給他"
              shareText="ZONE 27 把自己引擎準不準一張圖攤開:說幾成把握、實際中幾成,命中落空都算、刪不掉。 明牌站不敢公開這個。 自己看:"
              refTag="calibration-share"
            />
          </div>
        </section>

        {/* 贊助之請(R248③)· 峰值價值面:這頁是引擎公開自己準不準的「最貴信任憑證」· 撐它免費的是會員。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <PatronAsk
            line={
              <>
                這頁是 ZONE 27 最貴的一張信任憑證 —— 公開自己準不準 ·{" "}
                <span className="text-bone">免費、沒有廣告</span>。 撐著它一直免費的,是
                <span className="text-gold">會員</span>。
              </>
            }
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// 棒球校準 view · 圖 + 低樣本誠實說明(N<30 任何偏移都可能是運氣 · 不算數)。
function BaseballCalView({ bins, n }: { bins: CalibrationBin[]; n: number }) {
  return (
    <div>
      <ReliabilityDiagram bins={bins} n={n} engineVersion="v0.2" />
      {n === 0 ? (
        <div className="mt-6 border border-dashed border-gold/30 bg-slate/30 p-6 sm:p-8 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
            還沒有資料 · 等第一場結算
          </p>
          <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            引擎還沒結算任何一場。 第一個落點 · 統一 vs 富邦(2026-05-21 新莊)。
          </p>
        </div>
      ) : n < 30 ? (
        <div className="mt-6 border border-loss/30 bg-loss/5 p-5 sm:p-6">
          <p className="font-mono text-loss text-[10px] tracking-[0.35em] mb-2">
            ⚠ 棒球資料還太少 · 目前 {n} 場 / 滿 30 場才算數
          </p>
          <p className="text-mute text-sm leading-relaxed">
            場數不到 30 之前,這張圖還看不出名堂 · 任何偏移都可能只是運氣、
            不是引擎的問題。 完整算法見{" "}
            <Link
              href="/methodology"
              className="text-gold underline-offset-4 hover:underline"
            >
              方法說明
            </Link>
            。
          </p>
        </div>
      ) : null}
    </div>
  );
}

// 足球校準 view · 0 場已結算(世界盃 6/11 才開賽)→ 誠實「已鎖未結算」frame
// (把「鎖了還沒對帳」當特色不是 bug · 同 /ladder 足球側)· 結算後才長出圖。
function SoccerCalView({
  bins,
  n,
  lockedN,
}: {
  bins: CalibrationBin[];
  n: number;
  lockedN: number;
}) {
  if (n === 0) {
    return (
      <div className="border border-gold/30 bg-slate/40 p-5 sm:p-6">
        <span className="inline-block font-mono text-gold/80 text-[9px] tracking-[0.3em] px-2 py-1 border border-gold/40 mb-3">
          足球 · 世界盃 6/12 凌晨開踢(台北)
        </span>
        <p className="text-bone text-base leading-relaxed">
          足球引擎已經<span className="text-gold">賽前鎖死 {lockedN} 場</span>
          預測 —— 但還沒有一場結算。
        </p>
        <p className="mt-2 text-mute text-sm leading-relaxed">
          這張校準圖,從世界盃第一場打完開始長(台北時間 6/12 凌晨開踢)。
          鎖在那裡的每一場、賽後逐場對帳,跟棒球<span className="text-bone">分開算</span> ——
          引擎說幾成、實際中幾成,連估錯的也照畫。
        </p>
      </div>
    );
  }
  return (
    <div>
      <ReliabilityDiagram bins={bins} n={n} engineVersion="v0.1" />
      {n < 30 ? (
        <div className="mt-6 border border-loss/30 bg-loss/5 p-5 sm:p-6">
          <p className="font-mono text-loss text-[10px] tracking-[0.35em] mb-2">
            ⚠ 足球資料還太少 · 目前 {n} 場 / 滿 30 場才算數
          </p>
          <p className="text-mute text-sm leading-relaxed">
            足球跟棒球分開算 · 場數不到 30 之前,任何偏移都可能只是運氣。
          </p>
        </div>
      ) : null}
    </div>
  );
}
