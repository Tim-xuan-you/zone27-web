import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import CopyLinkButton from "@/components/CopyLinkButton";
import ArticleMeta from "@/components/ArticleMeta";
import SportToggle from "@/components/SportToggle";
import { getFinalizedMatches, type Match } from "@/lib/matches";
import {
  computeSoccerBins,
  getSoccerGradedCount,
} from "@/lib/soccer/calibration";
import { getLockedSoccerPredictions } from "@/lib/soccer/locked";

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

type Bin = {
  centerPct: number;
  count: number;
  favoriteActualPct: number; // 0-100
};

// Bin finalized matches by engine probability on favorite(10-wide bins)。
// Center positions: 5, 15, ..., 95(10-wide bins from 0-10, 10-20, ..., 90-100)。
function computeBins(finalized: Match[]): Bin[] {
  const buckets: Map<number, { favoriteWins: number; total: number }> = new Map();

  for (const m of finalized) {
    if (!m.finalResult) continue;
    const fr = m.finalResult;
    const enginePctFav = Math.max(m.home.winRate, m.away.winRate);
    if (enginePctFav <= 50) continue; // 排除真・五五波(50)· 不讓銅板局假裝有 favorite
    const binIndex = Math.min(Math.floor(enginePctFav / 10), 9);
    const centerPct = binIndex * 10 + 5;

    const homeFav = m.home.winRate >= m.away.winRate;
    const favoriteWon =
      (homeFav && fr.winner === "home") || (!homeFav && fr.winner === "away");

    if (!buckets.has(centerPct))
      buckets.set(centerPct, { favoriteWins: 0, total: 0 });
    const b = buckets.get(centerPct)!;
    b.total++;
    if (favoriteWon) b.favoriteWins++;
  }

  return Array.from(buckets.entries())
    .map(
      ([centerPct, { favoriteWins, total }]): Bin => ({
        centerPct,
        count: total,
        favoriteActualPct: (favoriteWins / total) * 100,
      })
    )
    .sort((a, b) => a.centerPct - b.centerPct);
}

export default function CalibrationPublicPage() {
  const finalized = getFinalizedMatches();
  const n = finalized.length;
  const bins = computeBins(finalized);
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

          {/* Founder voice opening · Tim 親手姿態 · NOT institutional voice */}
          <div className="mt-8 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              <strong>每個拿明牌賺錢的網站都說自己多準</strong>{" "}
              · 沒有一家告訴你「說 70% 的時候、實際只中 67%」的那{" "}
              <span className="text-gold">3% 落差</span> ·
              因為一公開就露餡。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              ZONE 27 公開。 這頁的數字 · 是我們欠你的一筆帳。
            </p>
          </div>

          <div className="mt-6">
            <ArticleMeta
              readingMin={4}
              sample={{ current: n, threshold: 30 }}
            />
          </div>
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
              這是一件幾乎沒人在台灣跟你講白的事:全世界最準的棒球賽前預測 ——
              包括拉斯維加斯的盤口、最頂尖的 AI 模型 —— 單場命中率大約就是{" "}
              <strong className="text-bone">5 成 7(57%)</strong> ·
              理論上限也就 6 成上下。 再多的數據、再強的 AI · 都打不破這道牆。
            </p>
            <p>
              為什麼?因為棒球本質上就帶著大量{" "}
              <strong className="text-bone">洗不掉的運氣</strong> ——
              王牌也會被打爆,墊底的也會爆冷。 這不是模型不夠強 ·
              是這項運動天生就長這樣。
            </p>
            <p>
              所以任何宣稱「<span className="text-loss/90">94% 勝率</span>」「鐵口神準」的老師 ·
              <strong className="text-bone">數學上不可能</strong>。
              那不是厲害 · 那是話術 —— 用一個本來就不存在的準度當賣點。
            </p>
            <div className="border-l-2 border-gold/60 pl-5 sm:pl-6 py-1 my-2">
              <p className="text-bone text-lg leading-relaxed">
                ZONE 27 的護城河 · 從來不是「比別人準」。
              </p>
              <p className="mt-2 text-mute leading-relaxed">
                沒有人能準多少 —— 是我們敢把這道 5 成 7 的天花板 ·
                當成招牌掛出來、還讓你逐場對帳。 誠實 · 是唯一抄不走的東西。
              </p>
            </div>
            <p className="text-mute/80 text-sm">
              那我們怎麼變更準?靠<strong className="text-bone">更好的「輸入」</strong> ——
              更細的擊球數據、球場、牛棚狀況 —— 不是換一個「更神」的引擎。
              引擎這東西全世界都差不多 · 差別在誰餵的料更乾淨、誰更敢認帳。
            </p>
          </div>
        </section>

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

        {/* ── 為什麼明牌站不敢做這頁 ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 為什麼明牌站不敢做這頁
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            這頁,他們抄不走
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              自稱很準的老師掛著 55-59% 勝率 · 收費明牌群組自稱連勝八九場。
              沒有一家敢攤開這種對照圖 · 因為一攤開就露餡:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  嘴上「94% 勝率」· 實際只有 50-52% · 足足差了四十幾個百分點。
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  靠「連勝 X 天」行銷 · 輸的那幾週默默刪文、只截贏的那幾張 ·
                  挑著給你看的紀錄當然漂亮。
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  靠賣明牌賺錢 · 一旦公開真實準度就砸自己招牌 · 所以永遠不公開。
                </span>
              </li>
            </ul>
            <p className="pt-2">
              <strong className="text-bone">ZONE 27 敢公開</strong>{" "}
              · 因為我們的訂閱費跟「引擎準不準」沒關係。 你贏你輸 · 我們都一樣。
              正因為賺錢方式跟「你有沒有贏」脫鉤 · 我們才敢這樣攤開 ·{" "}
              <span className="text-gold">這就是明牌站學不來的地方</span>。
            </p>
          </div>
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

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 最貴的一張信任憑證 · 因為公布它等於
            <strong>把自己攤在「準不準大家看得到」之下</strong>。
          </p>
          <p>
            我們公開自己準不準 · 一張圖就攤開 ·
            明牌站不會這樣做 — 因為一公開就會暴露他們嘴上的勝率和實際差很多。
          </p>
          <p>
            這頁的計算方式要改,得先在更新紀錄公告 30 天才動 · 不偷改。
          </p>
        </FounderSignOff>

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

        <RelatedReading currentPath="/calibration" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
            用結果說話 · 不是用行銷話術
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight">
            這頁不會消失 · 不會偷偷換掉 · 也不會藏起我們高估的地方。
          </h3>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// 棒球校準 view · 圖 + 低樣本誠實說明(N<30 任何偏移都可能是運氣 · 不算數)。
function BaseballCalView({ bins, n }: { bins: Bin[]; n: number }) {
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
  bins: Bin[];
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

// Inline SVG reliability diagram · same math as /member/calibration
// (Round 30 W2B agent deepest call)· copied here intentionally instead
// of import → public page is independently shippable + auditable · 不
// share local state · 不 share component complexity edge cases。 將來
// 若 extract 為 shared <ReliabilityDiagram /> component · 同時 refactor
// /member/calibration 來 import。
function ReliabilityDiagram({
  bins,
  n,
  engineVersion,
}: {
  bins: Bin[];
  n: number;
  engineVersion: string;
}) {
  // SVG coordinate system: 400x400 with 40px left/bottom margin · 20px top/right
  const px = (pct: number) => 40 + (pct / 100) * 340;
  const py = (pct: number) => 360 - (pct / 100) * 340;

  return (
    <div className="bg-slate/30 border border-line/60 p-5 sm:p-8">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          / 引擎說的 vs 實際發生
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
          引擎 {engineVersion} · 已 {n} 場
        </p>
      </div>
      <div className="aspect-square max-w-md mx-auto">
        <svg
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          role="img"
          aria-label={
            n === 0
              ? "引擎準度對照圖 · 引擎說的成數對上實際中的成數 · 目前還沒有資料"
              : `引擎準度對照圖 · 已畫上 ${n} 場 · 引擎說的成數對上實際中的成數`
          }
        >
          {/* Grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={px(0)}
                y1={py(v)}
                x2={px(100)}
                y2={py(v)}
                stroke="rgba(138, 147, 168, 0.12)"
                strokeWidth="1"
              />
              <line
                x1={px(v)}
                y1={py(0)}
                x2={px(v)}
                y2={py(100)}
                stroke="rgba(138, 147, 168, 0.12)"
                strokeWidth="1"
              />
            </g>
          ))}
          {/* Axes */}
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(100)}
            y2={py(0)}
            stroke="rgba(138, 147, 168, 0.6)"
            strokeWidth="1"
          />
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(0)}
            y2={py(100)}
            stroke="rgba(138, 147, 168, 0.6)"
            strokeWidth="1"
          />
          {/* 45° perfect calibration line */}
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(100)}
            y2={py(100)}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Bins */}
          {n === 0
            ? [55, 65, 75, 85].map((v) => (
                <circle
                  key={v}
                  cx={px(v)}
                  cy={py(v)}
                  r="3"
                  fill="none"
                  stroke="rgba(138, 147, 168, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              ))
            : bins.map((b) => {
                const radius = Math.min(3 + b.count * 1.5, 12);
                return (
                  <circle
                    key={b.centerPct}
                    cx={px(b.centerPct)}
                    cy={py(b.favoriteActualPct)}
                    r={radius}
                    fill="#D4AF37"
                    fillOpacity={0.85}
                    stroke="#0F1A2E"
                    strokeWidth="1"
                  />
                );
              })}
          {/* Axis tick labels */}
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <text
                x={px(v)}
                y={py(0) + 18}
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(138, 147, 168, 0.85)"
                textAnchor="middle"
              >
                {v}%
              </text>
              <text
                x={px(0) - 8}
                y={py(v) + 3}
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(138, 147, 168, 0.85)"
                textAnchor="end"
              >
                {v}%
              </text>
            </g>
          ))}
          {/* Axis labels */}
          <text
            x={px(50)}
            y={py(0) + 36}
            fontSize="9"
            fontFamily="monospace"
            fill="rgba(212, 175, 55, 0.85)"
            textAnchor="middle"
            letterSpacing="0.18em"
          >
            引擎看好幾成
          </text>
          <text
            x={px(0) - 32}
            y={py(50)}
            fontSize="9"
            fontFamily="monospace"
            fill="rgba(212, 175, 55, 0.85)"
            textAnchor="middle"
            letterSpacing="0.18em"
            transform={`rotate(-90 ${px(0) - 32} ${py(50)})`}
          >
            實際中幾成
          </text>
        </svg>
      </div>

      {/* ── 白話判決層(538「Checking Our Work」caption · R222)─────────────────
          散點圖只有座標軸 + 金點,賭徒(非分析師)讀不出本頁 hero 問的那句
          「引擎說 70% 的時候、實際贏多少?」。 這層用「一句一桶」的白話直接回答 ——
          引擎喊幾成看好、那幾場真的中幾成。 把校準護城河從統計層降到情緒層。
          🔴 誠實:每行掛場數(讀者自己判斷樣本大小)+ 沿用 N<30 caveat · 不下精確結論 ·
          純白話不出現 Brier / 校準 等術語 · 無紅綠(實際命中率一律金)。 */}
      {n > 0 && bins.length > 0 && (
        <div className="mt-5 pt-5 border-t border-line/40">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-3">
            / 白話講 · 喊幾成、真的中幾成
          </p>
          <ul className="space-y-1.5">
            {bins.map((b) => {
              const low = Math.max(0, b.centerPct - 5);
              const high = Math.min(100, b.centerPct + 5);
              return (
                <li
                  key={b.centerPct}
                  className="text-mute text-[13px] sm:text-sm leading-relaxed"
                >
                  引擎喊{" "}
                  <span className="font-mono tabular text-bone">
                    {low}–{high}%
                  </span>{" "}
                  看好的那 <span className="font-mono tabular text-bone">{b.count}</span> 場
                  —— 真的中了{" "}
                  <span className="font-mono tabular text-gold">
                    {Math.round(b.favoriteActualPct)}%
                  </span>
                  。
                </li>
              );
            })}
          </ul>
          <p className="mt-3 font-mono text-mute/55 text-[9px] tracking-[0.15em] leading-relaxed">
            ▸ 「喊幾成」越貼近「中幾成」· 引擎就越誠實 —— 這正是上面那條金色斜線的意思。
            {n < 30 && <> 目前才 {n} 場 · 還看不出穩定名堂,多打幾場才算數。</>}
          </p>
        </div>
      )}
    </div>
  );
}
