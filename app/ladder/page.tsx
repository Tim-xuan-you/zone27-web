import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import { getTrackRecordStats } from "@/lib/matches";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "海選天梯 · THE LADDER",
  description:
    "ZONE 27 準度海選天梯。 三個聲音 —— 引擎、群眾、你。 從新秀爬到神諭 · 每一階是贏過更難的對手:丟硬幣 → 群眾市場線 → ZONE 27 引擎。 樣本加權排名 · 不裸勝率 · 押了不可改 · 0 金錢。 目前王座上只有機器 · 第一個登頂的人類還沒出現。",
  path: "/ladder",
});

// ── ZONE 27 · /ladder · 準度海選天梯(THE LADDER)──────────
// R174 Polymarket pivot · 第 4 根支柱「準度海選排行榜」的 marketing/
// design 落地頁。 per memory/project_zone27_polymarket_pivot.md。
//
// 設計核心(行銷洞察):Polymarket 只有「群眾」一個聲音。 ZONE 27 有
// 三個 —— 引擎(電腦算)+ 群眾(市場線)+ 你(賽前鎖的預測)。 所以
// 賣點不是「來預測」· 是「你敢不敢證明你比機器、又比群眾都準?」。
// 天梯(新秀→神諭)= 成長引擎:人為了爬名次、炫耀,自己幫忙宣傳。
// 名次做成一張會想截圖分享的「戰績卡」= 免費獲客。
//
// 誠實狀態(pre-launch):還沒有真人累積足夠樣本入榜(N=0 人類)。
// 唯一有真實 track record 的是「引擎自己」(getTrackRecordStats)·
// 所以王座目前由機器佔據 · 神諭 = 第一個把機器拉下來的人類。 同
// /calibration + /founders/ledger 的 honest N=0 scaffold brand pattern ·
// 不假裝有玩家 · 不 fake 排行榜名字。
//
// 後端計分(每個玩家 picks × 賽果 → 樣本加權準度 → tier)等 handle/
// 帳號系統 + 真實玩家就緒後接(Phase 2-3)· 此頁先 ship 規則 + status
// game design + 真實引擎 benchmark。
//
// 法律:0 金錢 · 0 兌獎 · 純點數準度遊戲 · per [[zone27-legal-redline]]。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // re-render daily · /track-record cadence

type Tier = {
  en: string;
  zh: string;
  beat: string;
  rule: string;
};

// 五段天梯 · 一個月只能往上爬一階 · 每階 = 那個月要清掉的關卡
const TIERS: Tier[] = [
  {
    en: "ROOKIE",
    zh: "新秀",
    beat: "第 1 階 · 入榜",
    rule: "累積 10 場已結算的預測 → 站上天梯第一階。 從這裡開始,一個月爬一階。",
  },
  {
    en: "ANALYST",
    zh: "分析師",
    beat: "第 2 階",
    rule: "某個月準度站上五成(贏過丟硬幣)→ 從新秀升上來。 證明你不是純運氣。",
  },
  {
    en: "TRADER",
    zh: "操盤手",
    beat: "第 3 階",
    rule: "某個月準度贏過「群眾市場線」→ 再往上一階。 你比大盤聰明。",
  },
  {
    en: "SHARP",
    zh: "神準手",
    beat: "第 4 階",
    rule: "某個月準度贏過 ZONE 27 引擎 → 再往上一階。 你比機器算得準。",
  },
  {
    en: "ORACLE",
    zh: "神諭",
    beat: "第 5 階 · 王座",
    rule: "連續贏過 引擎 + 群眾、且站上全站最高,才守得住。 一個月最多升一階 → 爬到這裡至少要連續四個月夠準。 一次到頂 · 不可能。",
  },
];

export default function LadderPage() {
  const stats = getTrackRecordStats();
  const decided = stats.proved + stats.diverged;
  const engineHitRate =
    decided > 0 ? Math.round((stats.proved / decided) * 100) : null;
  const HUMANS = 0; // pre-launch · 還沒有真人入榜 · 不假裝

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / THE LADDER · 準度海選天梯
            </p>
            <span
              lang="en"
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                HUMANS === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
              title="目前 0 人類登榜 · 王座由引擎佔據 · git commit 為 source of truth"
            >
              {HUMANS === 0 ? "WAITING · 0 人類登榜" : `${HUMANS} 人在榜`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            目前 · 王座上{" "}
            <span className="text-gold">只有機器。</span>
          </h1>

          {/* Founder voice opening · 三個聲音 framing(核心行銷洞察) */}
          <div className="mt-8 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              別的預測平台只有<strong>一個聲音</strong> —— 群眾在押什麼。
              ZONE 27 有<span className="text-gold">三個</span>:引擎算的、群眾押的、還有<strong className="text-bone">你</strong>。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              天梯只問一句話:你敢不敢證明 · 你比機器、又比群眾都準?
              從新秀爬到神諭 —— 第一個登頂的人類 · 還沒出現。
            </p>
          </div>

          <div className="mt-6">
            <ArticleMeta readingMin={4} sample={{ current: HUMANS, threshold: 30 }} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 01 · THE THREE VOICES ────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 01 · 三個聲音 · THE THREE VOICES
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <VoiceCard
              tag="引擎"
              en="THE MACHINE"
              body="10,000 次蒙地卡羅 · 賽前鎖一個機率。 公開、可重算、不刪文。"
            />
            <VoiceCard
              tag="群眾"
              en="THE CROWD"
              body="所有人進場押注 aggregate 出來的「市場線」。 大盤的即時共識。"
            />
            <VoiceCard
              tag="你"
              en="YOU"
              body="賽前鎖你自己的一邊 · 押了不可改。 賽後對帳 · 準度累積上天梯。"
              tone="gold"
            />
          </div>
          <p className="mt-6 text-mute text-sm leading-relaxed max-w-2xl">
            你的目標不是猜中一場 · 是<strong className="text-bone">長期同時贏過前面兩個</strong>。
            Polymarket 只能讓你跟群眾比 · ZONE 27 還讓你跟一台公開的機器正面對決。
          </p>
        </section>

        {/* ── 02 · THE LADDER · 五段天梯 ────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 02 · 五段天梯 · 一個月只能爬一階
          </p>
          <div className="mb-6 border-l-2 border-gold/60 pl-5 py-2">
            <p className="text-bone text-base sm:text-lg leading-relaxed">
              這不是「準度一夠就跳到頂」。{" "}
              <strong className="text-gold">每個月結算一次 · 達標就往上爬一階 —— 一次最多一階</strong>,退步也會掉階。
            </p>
            <p className="mt-2 text-mute text-sm leading-relaxed">
              所以從最底的新秀爬到頂端的神諭,最快也要<strong className="text-bone">連續四個月</strong>都夠準。
              一晚手氣、一場爆冷 · 升不上王座。
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {TIERS.slice()
              .reverse()
              .map((t, i) => (
                <LadderRow
                  key={t.en}
                  tier={t}
                  apex={i === 0}
                  step={TIERS.length - i}
                />
              ))}
          </div>
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ▸ <span className="text-bone">每月評分一次 · 達標升一階(一次最多升一階)· 退步會掉階</span>。
            爬到頂至少要連續幾個月都夠準 —— 一晚的手氣升不上去。
            名次靠的是<span className="text-bone">真實準度</span> · 不是付費 · 不是年資。
          </p>
        </section>

        {/* ── 03 · THE THRONE · 目前唯一一張卡 ───────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 03 · 王座 · THE THRONE
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            天梯上還沒有人類。 唯一的標準 · 是機器設下的。
          </h2>

          {/* 戰績卡 · 目前由「引擎」持有(真實 track record)· 同時是
              設計範本 + benchmark · 這是「會想截圖分享」的 status 物件 */}
          <RankCard
            holder="ENGINE v0.2"
            holderZh="現任王座 · 機器"
            hitRate={engineHitRate}
            proved={stats.proved}
            diverged={stats.diverged}
            n={decided}
          />

          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            這張卡是真的 —— 數字直接來自{" "}
            <Link
              href="/track-record"
              className="text-gold underline-offset-4 hover:underline"
            >
              /track-record
            </Link>{" "}
            公開戰績(引擎賽前鎖機率 · 賽後 PROVED / DIVERGED 等大公開)。
            <strong className="text-bone"> 目前全站只有這一張卡。 下一張 · 是你的。</strong>
          </p>
          <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.25em] leading-relaxed">
            ▸ 神諭(ORACLE)= 第一個長期把機器拉下王座的人類。 在那之前 · 機器守擂。
          </p>
        </section>

        {/* ── 04 · HOW SCORING WORKS · 透明規則 ──────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 04 · 怎麼算 · 規則公開(pre-commit · binding)
          </p>
          <ol className="space-y-4 text-mute leading-relaxed max-w-2xl">
            <RuleRow
              no="01"
              title="樣本加權 · 不裸勝率"
              body="7 戰全勝 排在 100 戰 60 勝 後面。 運氣騙得了一晚 · 騙不了一季。 樣本太小只會掛「樣本還太少」· 不會衝上神諭。"
            />
            <RuleRow
              no="02"
              title="先鎖後結 · 押了不可改"
              body="預測在開賽前鎖死 · 賽後不能改、不能補登(server 端強制 · migration 0003)。 跟引擎同一條規矩:鎖了才算。"
            />
            <RuleRow
              no="03"
              title="對手是動態的"
              body="贏過「丟硬幣」「群眾市場線」「引擎」是相對門檻 —— 引擎變準 · 你要跟著更準才守得住名次。 沒有躺著不動的神諭。"
            />
            <RuleRow
              no="04"
              title="每月一階 · 一步一步爬"
              body="天梯每月評分一次 · 達標就往上 —— 但一次最多升一階,退步也會掉階。 所以從新秀爬到神諭,至少要連續好幾個月都夠準。 一場爆冷、一晚手氣,升不上王座。 這是準度的擂台 · 不是資歷的牆。"
            />
            <RuleRow
              no="05"
              title="0 金錢 · 0 兌獎"
              body="純點數準度遊戲。 押對拿的是公開戰績 + 天梯名次 · 不是現金、不是實體獎品。 這條是法律底線 · 永遠不破。"
            />
          </ol>
          <p className="mt-8 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ <strong className="text-bone">PRE-COMMIT</strong> · 上述計分規則 binding ·
            修改需 30 天前{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
              /changelog
            </Link>{" "}
            公告 · 同{" "}
            <Link href="/audit" className="text-gold underline-offset-4 hover:underline">
              /audit
            </Link>{" "}
            S05 PRE-COMMIT pattern。 我們不會賽後偷改規則把誰捧上或拉下。
          </p>
        </section>

        {/* ── CTA · 怎麼開始爬 ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            怎麼開始爬?
          </h2>
          <p className="text-mute leading-relaxed max-w-2xl mb-6">
            到任何一場賽事頁 · 在引擎掀牌前先鎖你自己的一邊。 賽後自動對帳 ·
            準度開始累積。 累到 10 場登上新秀 —— 之後每個月評分一次 · 夠準就往上爬一階。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/matches"
              className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              → 去賽事頁進場
            </Link>
            <Link
              href="/calibration"
              className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → 看引擎自評(你的對手)
            </Link>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁今天是 <strong>誠實的空榜</strong> · 還沒有真人累積夠樣本登榜 ·
            所以王座先由引擎自己守著(數字是真的 · 來自公開戰績)。
          </p>
          <p>
            我沒有 fake 任何玩家名字、沒有預填假排行榜。 第一個真實玩家樣本夠了 ·
            天梯才會長出第一個人類名次 —— 從新秀開始 · 不 backdated、不 cherry-pick。
          </p>
          <p>
            計分規則(樣本加權 · 先鎖後結 · 每月升降 · 0 金錢)已 binding ·
            修改需 30 天前 /changelog 公告。 天梯比的是<strong>準度</strong> ·
            不是錢 · 不是人脈 · 不是年資。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/ladder" />

        {/* ── FINAL ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            BEAT THE MACHINE. BEAT THE CROWD.
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight">
            王座空著一半。 機器在守。 換你了。
          </h3>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function VoiceCard({
  tag,
  en,
  body,
  tone = "mute",
}: {
  tag: string;
  en: string;
  body: string;
  tone?: "mute" | "gold";
}) {
  return (
    <div
      className={`p-5 border ${
        tone === "gold"
          ? "border-gold/60 bg-gold/5"
          : "border-line/60 bg-slate/30"
      }`}
    >
      <div className="flex items-baseline justify-between mb-3">
        <span
          className={`font-mono text-base tracking-[0.1em] ${
            tone === "gold" ? "text-gold" : "text-bone"
          }`}
        >
          {tag}
        </span>
        <span
          lang="en"
          className="font-mono text-mute/60 text-[9px] tracking-[0.3em]"
        >
          {en}
        </span>
      </div>
      <p className="text-mute text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function LadderRow({
  tier,
  apex,
  step,
}: {
  tier: Tier;
  apex: boolean;
  step: number;
}) {
  return (
    <div
      className={`flex items-stretch gap-4 p-4 sm:p-5 border ${
        apex
          ? "border-gold/70 bg-gold/[0.07] glow-soft"
          : "border-line/60 bg-slate/30"
      }`}
    >
      <div className="flex flex-col items-center justify-center w-10 shrink-0">
        <span
          className={`font-mono text-2xl sm:text-3xl tabular font-light ${
            apex ? "text-gold" : "text-mute/70"
          }`}
        >
          {step}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
          <span
            className={`text-xl sm:text-2xl font-light tracking-tight ${
              apex ? "text-gold" : "text-bone"
            }`}
          >
            {tier.zh}
          </span>
          <span
            lang="en"
            className="font-mono text-mute/60 text-[10px] tracking-[0.3em]"
          >
            {tier.en}
          </span>
          <span
            className={`font-mono text-[9px] tracking-[0.25em] px-1.5 py-0.5 border ${
              apex
                ? "border-gold/60 text-gold"
                : "border-line/60 text-mute/70"
            }`}
          >
            {tier.beat}
          </span>
        </div>
        <p className="text-mute text-sm leading-relaxed">{tier.rule}</p>
      </div>
    </div>
  );
}

function RankCard({
  holder,
  holderZh,
  hitRate,
  proved,
  diverged,
  n,
}: {
  holder: string;
  holderZh: string;
  hitRate: number | null;
  proved: number;
  diverged: number;
  n: number;
}) {
  return (
    <div className="max-w-sm border border-gold/60 bg-navy/60 glow-gold p-6 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(212,175,55,0.14), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="flex items-baseline justify-between mb-5">
          <span
            lang="en"
            className="font-mono text-gold/80 text-[9px] tracking-[0.35em]"
          >
            ZONE 27 · 戰績卡
          </span>
          <span
            lang="en"
            className="font-mono text-[8px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/50 text-gold"
          >
            王座 · THRONE
          </span>
        </div>

        <p className="font-mono text-bone text-2xl tracking-[0.05em] mb-1">
          {holder}
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-6">
          {holderZh}
        </p>

        <div className="flex items-end gap-2 mb-1">
          <span className="font-mono text-gold text-5xl tabular font-light leading-none">
            {hitRate === null ? "—" : `${hitRate}%`}
          </span>
          <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mb-1">
            判對哪一邊
          </span>
        </div>
        <div className="mt-4 flex items-center gap-4 font-mono text-[11px] tracking-[0.2em] tabular">
          <span className="text-gold">✓ {proved} PROVED</span>
          <span className="text-loss/80">✕ {diverged} DIVERGED</span>
          <span className="text-mute/60">N = {n}</span>
        </div>

        <div className="mt-5 pt-4 border-t border-gold/20">
          <p className="font-mono text-mute/55 text-[9px] tracking-[0.25em] leading-relaxed">
            ▸ 下一張卡 · 寫的是你的名字 · 跟你贏過機器的那一天。
          </p>
        </div>
      </div>
    </div>
  );
}

function RuleRow({
  no,
  title,
  body,
}: {
  no: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-5">
      <span className="font-mono text-gold/70 text-sm tabular w-8 pt-1">
        {no}
      </span>
      <div className="flex-1">
        <h4 className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          {title}
        </h4>
        <p className="text-mute text-sm leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
