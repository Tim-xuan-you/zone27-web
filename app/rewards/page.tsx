import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";
import { getSession } from "@/lib/supabase/server";
import { aggregatePredictionStats } from "@/lib/predictions";
import { getMyPredictionsMap } from "@/lib/predictions-server";
import { getFinalizedMatches, type Match } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Rewards · 預測兌換獎品",
  description:
    "ZONE 27 PROVED 預測 → 累計點數 → 兌換實體獎品(底片 / 伶 Kopi 咖啡 / 沖洗服務 / 護照代辦折抵)。 取貨來店(恆美攝影 × 伶 Kopi 台南東區)或郵寄(NT$ 100)。 PRE-LAUNCH · Q4 2026 上線 · 0 cash · 0 referral · 0 wallet · skill-based fantasy league prize 結構 · brand-pure 集點 mechanism。",
};

// ── ZONE 27 · /rewards ─────────────────────────────────
// Round 35 W-A · Tim 11+ canary 同方向 push「集點兌換」 axiom revisit ·
// 之前 Round 31 W-V agent reject 的是「daily login engagement farming」 ·
// Tim 提議的是「PROVED 預測 → 累計點 → 兌換實體獎品(恆美攝影 ecosystem)」
// = skill-based fantasy league prize 結構(Metaculus / Manifold Markets /
// WSOP main event prize pattern)· 完全不同 mechanism · 不衝突 brand IP。
//
// Brand IP check 全 ✓:
//   - Engine FREE forever · 不動
//   - 0 cash referral(no 推薦碼分潤)
//   - 0 user-to-user social(點數 user-to-platform-only · 不互換)
//   - 0 MLM(同 7-11 集點換貼紙 retail promotion 邏輯 · 不觸 § 29)
//   - 0 寄生 gambling(沒下注 · 沒抽佣 · 沒明牌)
//   - 0 金管會(retail loyalty · 不是 financial product)
//   - Pratfall(PROVED + DIVERGED 等大公開 · skill mechanical)
//
// ZONE 27 ↔ 恆美攝影 × 伶 Kopi cross-promotion(雙生品牌 synergy):
//   - 棒球分析 → 累計 points → 兌換底片 → 實體店流量
//   → 體驗 伶 Kopi 咖啡 → 沖洗服務 → 再來看 ZONE 27 · 完美 ecosystem loop
//
// Implementation lightweight:
//   - 點數 = aggregatePredictionStats(...).proved · derived 不新 field
//   - 0 Supabase migration · 0 server cost · 純 read-time compute
//   - Catalogue PRE-LAUNCH state · Q4 2026 上線 等 Tim 恆美 inventory 對接
//   - 規則 binding · 30-day notice via /changelog 同 /audit S05 PRE-COMMIT
//
// 4 心理 hook 同時 fire:
//   1. Sunk cost · 累計 50 預測 → 越多越 commitment
//   2. Status · 準度公開累積上 /ladder 海選天梯(新秀 → 神諭)
//   3. Operant conditioning · variable reward(只 PROVED 才 +1)· Skinner positive
//   4. Tangible reward > digital · 實體底片 / 咖啡 > virtual badge
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily refresh · 兌換目錄 stable

const CATALOGUE = [
  {
    icon: "🎞️",
    name: "底片 1 卷",
    detail: "柯達 Gold 200 · 富士 200 · Ilford HP5 之一(隨機 OR 您指定)",
    points: 20,
    note: "恆美攝影 ecosystem · 您 mailbox 收到 · 或來店面交",
  },
  {
    icon: "☕",
    name: "伶 Kopi 咖啡 1 杯",
    detail: "義式咖啡 / 手沖 / 拿鐵 之一(menu 內任選)",
    points: 5,
    note: "限來店兌換 · 台南東區 · 無郵寄(咖啡會壞)",
  },
  {
    icon: "🔬",
    name: "底片沖洗服務 1 卷",
    detail: "135 / 120 / 全片幅 · 含掃描成數位檔案",
    points: 10,
    note: "底片您寄來 · 沖完寄回 · 或來店面交",
  },
  {
    icon: "📘",
    name: "護照證件代辦折抵 NT$ 200",
    detail: "恆美攝影 ecosystem 護照 / 台胞證 / 簽證代辦折抵券",
    points: 15,
    note: "電子折抵券 email 寄您 · 限恆美店面實體流程使用",
  },
];

const RULES = [
  {
    no: "01",
    title: "計分方式",
    body: "每場 CPBL 賽事 finalResult ingested 後 · 您 prediction matches actual winner = +1 PROVED · ✕ DIVERGED 不扣分 · = PUSH(skip / 平局)不計。 計分 mechanical · 不可 retroactively edit(賽前 lock-in 您 prediction · 賽後對照)。 「贏家不能砍輸家」 brand IP 永遠守住。",
  },
  {
    no: "02",
    title: "兌換流程",
    body: "您累計足夠 PROVED → /rewards 點選兌換 → email 收到確認 + 取貨選項(來店 OR 郵寄 NT$ 100)→ Tim 親手 fulfill。 不自動扣款 · 0 cash · 0 wallet · 0 訂閱。 來店 = 恆美攝影 × 伶 Kopi(台南東區)免費。 郵寄 = NT$ 100 小額 covers shipping cost · 不賺錢 · 純物流。",
  },
  {
    no: "03",
    title: "規則 PRE-COMMIT binding",
    body: "此 catalogue + 計分 rule 修改需 30 天前 /changelog 公告 · 同 /audit S05 PRE-COMMIT pattern + /founders/ledger allocation rules pattern · 您累計的 PROVED 永遠 honor 至兌換完。 brand IP「方法公開」 延伸到 reward mechanism 本身。",
  },
  {
    no: "04",
    title: "PRE-LAUNCH 狀態",
    body: "預計 2026 Q4 啟用 · 等 Tim 恆美攝影 inventory 對接 + 郵寄物流流程 setup。 現在累計 PROVED 完全保留 · Q4 啟用第一天您所有累計 points 直接可兌換。 跟 /membership/black-card UI mockup 同 pattern · 不催 · 不假承諾 · 不消失。",
  },
];

export default async function RewardsPage() {
  const session = await getSession();
  // 接通押注電線(Wave 2)· 點數改讀 0003 predictions 表(0006 RPC)·
  // 不再讀已無人寫入的 user_metadata = 修「押了卻 0 點」死讀。
  const predictionsMap = session ? await getMyPredictionsMap() : {};
  const finalized: Match[] = getFinalizedMatches();
  const matchSummaries = finalized.map((m) => ({
    id: m.id,
    finalWinner: m.finalResult?.winner ?? null,
  }));
  const stats = aggregatePredictionStats(predictionsMap, matchSummaries);

  // Points = PROVED count · derived not new field · 0 migration
  const points = stats.proved;
  const pending = stats.pending; // 等賽後 ingest 才能 +1

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / REWARDS · PROVE-IT-YOURSELF
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold"
              title="押中即時累計 PROVED 點數 · 實體兌換 fulfillment 2026 Q4 開放(等恆美 inventory + 物流 setup)· 累計的點永遠保留不歸零"
            >
              點數即時累計 · 兌換 Q4
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            預測 PROVED · 兌換實體獎品
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            您 ZONE 27 累計的 PROVED prediction · 兌換 恆美攝影 × 伶 Kopi 實體
            獎品(底片 / 咖啡 / 沖洗 / 護照代辦折抵)。
            <strong className="text-bone"> 0 cash · 0 訂閱 · 0 推薦碼分潤</strong>
            · skill-based fantasy league prize 結構 · 同 Metaculus / WSOP main
            event prize pattern · brand-pure。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            「使用者要的是炫耀預測成功」 founder directive · ZONE 27 brand-pure
            版本 = mechanical PROVED 計分(不可造假)+ 兌換實體獎品(恆美攝影
            ecosystem)+ 公開規則(30-day notice 修改)+ 連同失準的場次(DIVERGED)
            同等大公布。
          </p>
          <div className="mt-6 mb-2">
            <ArticleMeta readingMin={3} />
          </div>
          <div className="mt-3">
            <EngineStamp />
          </div>
        </section>

        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-12">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* ── YOUR POINTS · auth-aware ──────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            / YOUR POINTS · 您累計
          </p>
          {session ? (
            <AuthedPointsBlock
              points={points}
              pending={pending}
              total={stats.total}
            />
          ) : (
            <AnonymousPointsBlock />
          )}
        </section>

        {/* ── CATALOGUE ─────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / CATALOGUE · 兌換目錄
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATALOGUE.map((item) => (
              <RewardCard
                key={item.name}
                icon={item.icon}
                name={item.name}
                detail={item.detail}
                points={item.points}
                note={item.note}
                userPoints={points}
              />
            ))}
          </div>
        </section>

        {/* ── PICKUP OPTIONS ────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / PICKUP · 取貨選項
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PickupOption
              icon="📍"
              title="來店面交"
              cost="免費"
              detail="恆美攝影 × 伶 Kopi · 台南東區 · 順便喝杯咖啡聊棒球分析"
              tone="gold"
            />
            <PickupOption
              icon="📮"
              title="郵寄"
              cost="NT$ 100"
              detail="意思意思運費 · 純 covers shipping cost · 不賺錢 · 純物流"
              tone="bone"
            />
          </div>
          <p className="mt-5 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ 郵寄費 NT$ 100 是 cost-recovery · 不是 profit · 同 /audit S05
            PRE-COMMIT pattern · 修改需 30-day notice via /changelog 公告。
          </p>
        </section>

        {/* ── RULES · canonical · pre-committed ──────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / RULES · 規則 PRE-COMMIT binding
          </p>
          <ol className="space-y-5">
            {RULES.map((r) => (
              <RuleRow key={r.no} no={r.no} title={r.title} body={r.body} />
            ))}
          </ol>
        </section>

        {/* ── ECOSYSTEM EXPLAINER ───────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <blockquote className="border-l-2 border-gold pl-6 sm:pl-8 py-3">
            <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-4">
              ZONE 27 ↔ 恆美攝影 × 伶 Kopi · 雙生品牌 ecosystem
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              Tim 同時擁有 ZONE 27(棒球量化分析)+ 恆美攝影 × 伶 Kopi(台南
              實體店 · 底片沖洗 / 咖啡 / 護照代辦)+ Bottom 27(棒球手遊)。
              三個 brand 共用 client base 偏好(「精準 + 工藝」 audience)·
              兌換 mechanism 把線上分析 →線下實體體驗 串起來 · 不是抽佣 ·
              是 ecosystem flow。
            </p>
          </blockquote>
        </section>

        {/* ── WHAT THIS IS NOT · brand-IP defense ───── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / WHAT THIS IS NOT · 不是什麼
          </p>
          <ul className="space-y-3 text-mute leading-relaxed">
            <NotItem text="不是 daily login 集點(engagement farming antipattern)· 只 PROVED 預測才 +1 · skill-based" />
            <NotItem text="不是 cash referral(觸 § 29 多層次傳銷管理法)· 0 cash · 0 推薦分潤" />
            <NotItem text="不是 wallet / 儲值(金管會 financial product)· retail loyalty 同 7-11 集點換貼紙" />
            <NotItem text="不是 user-to-user 互換點數(0 social transfer)· 點數 user-to-platform-only" />
            <NotItem text="不是寄生賭博平台(0 odds · 0 下注佣)· 預測本身 0 money · 純精神 + 實體 reward" />
          </ul>
        </section>

        <FounderSignOff>
          <p>
            這頁今天是 <strong>PRE-LAUNCH catalogue scaffold</strong> · 兌換
            fulfillment 等 2026 Q4 恆美攝影 inventory 對接 + 郵寄物流 setup
            完成才啟用。 但 5 條 rules + 4 個 catalogue items + 計分邏輯 已
            binding · 修改需 30-day notice via /changelog 同 /audit S05
            PRE-COMMIT pattern。
          </p>
          <p>
            您現在 ZONE 27 累計的 PROVED 100% 保留 · Q4 啟用第一天您所有累積
            points 直接可兌換 · 不歸零 · 不過期 · 不打折。 brand IP「方法
            公開」 延伸到 reward mechanism layer · 同 /annual Year 0 NT$ 0
            honest pattern · /track-record DIVERGED publish · /founders/ledger
            rejection samples · /coverage NEVER list 全套 radical-transparency
            鐵律。
          </p>
          <p>
            這個 page brand IP statement:<strong>使用者要炫耀預測成功的需求
            真實 · ZONE 27 用 mechanical PROVED 計分 + 實體獎品(恆美 ecosystem)
            + 規則公開(binding 30-day notice)+ 連同失準的場次(DIVERGED)同等大公布
            滿足 · 不靠 cash · 不靠 referral · 不靠 social transfer</strong>。
            「displacement mission · 對標取代靠賣明牌的生意」 brand-pure 路徑。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/rewards" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/matches"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← 賽事板 · /matches
            </Link>
            <Link
              href="/membership"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              4-tier ladder · /membership →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function AuthedPointsBlock({
  points,
  pending,
  total,
}: {
  points: number;
  pending: number;
  total: number;
}) {
  return (
    <div className="bg-gold/5 border border-gold/60 glow-soft p-6 sm:p-8">
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em]"
        >
          ✓ AUTHENTICATED · 您累計
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.25em] tabular">
          {total} 預測 · {pending} 等開獎
        </p>
      </div>
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-gold tabular text-5xl sm:text-6xl font-light tracking-tight leading-none">
          {points}
        </span>
        <span className="font-mono text-mute text-sm tracking-[0.2em]">
          PROVED points
        </span>
      </div>
      <p className="text-mute text-sm leading-relaxed">
        每 PROVED 預測 = 1 點 · DIVERGED 不扣 · skip / 平局 不計。
        <Link
          href="/member"
          className="text-gold underline-offset-4 hover:underline ml-1"
        >
          /member · 您 calibration mirror
        </Link>
        看完整 accuracy breakdown。
      </p>
    </div>
  );
}

function AnonymousPointsBlock() {
  return (
    <div className="bg-slate/40 border border-gold/30 p-6 sm:p-8">
      <p
        lang="en"
        className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-3"
      >
        / ANONYMOUS · 您未登入
      </p>
      <p className="text-mute text-sm sm:text-base leading-relaxed mb-5">
        登入 FREE TIER 解鎖 prediction tracker · 賽前 lock-in 您預測 · 賽後
        對照 actual · 累計 PROVED 兌換實體獎品(底片 / 咖啡 / 沖洗 / 護照
        代辦折抵)。 0 cash · 0 訂閱 · skill-based fantasy league prize 結構。
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/login?next=/rewards"
          className="inline-block px-5 py-2.5 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          → 登入解鎖 prediction tracker
        </Link>
        <Link
          href="/matches"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.35em] transition-colors"
        >
          先看今日賽事 /matches →
        </Link>
      </div>
    </div>
  );
}

function RewardCard({
  icon,
  name,
  detail,
  points,
  note,
  userPoints,
}: {
  icon: string;
  name: string;
  detail: string;
  points: number;
  note: string;
  userPoints: number;
}) {
  const affordable = userPoints >= points;
  const progress = Math.min(100, (userPoints / points) * 100);
  return (
    <article
      className={`bg-slate/40 border ${
        affordable ? "border-gold/60" : "border-line/60"
      } p-5 sm:p-6`}
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span aria-hidden="true" className="text-2xl leading-none">
          {icon}
        </span>
        <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight">
          {name}
        </h3>
      </div>
      <p className="text-mute text-sm leading-relaxed mb-3">{detail}</p>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <p className="font-mono text-gold tabular text-xl tracking-tight">
          {points}
          <span className="text-mute text-[10px] ml-1 tracking-[0.25em]">
            POINTS
          </span>
        </p>
        {affordable && (
          <span
            lang="en"
            className="font-mono text-gold text-[9px] tracking-[0.3em] border border-gold/60 px-2 py-0.5"
          >
            ✓ AFFORDABLE
          </span>
        )}
      </div>
      <div className="relative h-[3px] bg-line/60 overflow-visible mb-3">
        <div
          className="absolute top-0 left-0 h-full bg-gold/70"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.22em] leading-relaxed">
        {note}
      </p>
    </article>
  );
}

function PickupOption({
  icon,
  title,
  cost,
  detail,
  tone,
}: {
  icon: string;
  title: string;
  cost: string;
  detail: string;
  tone: "gold" | "bone";
}) {
  const borderClass = tone === "gold" ? "border-gold/60" : "border-line/60";
  const costClass = tone === "gold" ? "text-gold" : "text-bone";
  return (
    <article
      className={`bg-slate/40 border ${borderClass} p-5 sm:p-6`}
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span aria-hidden="true" className="text-2xl leading-none">
          {icon}
        </span>
        <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight">
          {title}
        </h3>
      </div>
      <p
        className={`font-mono ${costClass} tabular text-2xl tracking-tight mb-3`}
      >
        {cost}
      </p>
      <p className="text-mute text-sm leading-relaxed">{detail}</p>
    </article>
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

function NotItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-baseline">
      <span
        className="font-mono text-loss/70 text-xs tabular shrink-0"
        aria-hidden="true"
      >
        ✕
      </span>
      <span className="flex-1 text-sm leading-relaxed">{text}</span>
    </li>
  );
}
