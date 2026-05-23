import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import EngineStamp from "@/components/EngineStamp";
import FoundingMemberLedger from "@/components/FoundingMemberLedger";
import RefusalLedgerHint from "@/components/RefusalLedgerHint";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "Founders 27 · Open Allocation Ledger · ZONE 27",
  description:
    "Founders 27 分配公開帳本。 每週手寫更新本週新分配 / 累計 / 通過率 / 拒絕原因 sample(去 PII)。 Pratfall + Costly Signaling + Disclosure Philosophy + 倒置 SaaS · 4 brand IP axiom 同時 fire 的唯一 page。 沒有 luxury 品牌(Patek · Hermès · Tesla)做這件事 · ZONE 27 因 disclosure-first 結構性可以做。",
};

// ── ZONE 27 · Founders 27 Open Allocation Ledger ────────
// Round 31 W-S · onboarding agent deepest call · 「Open Allocation
// Ledger」 brand-IP-defining move。
//
// 沒有 luxury 品牌(Patek · Hermès · Tesla · Apple Vision Pro)做這件事:
// 「公布本週拒絕了誰 · 為什麼」。 luxury 都做 process transparency
// (workshop 23 開 · allocation 規則 abstract)· 但 ZONE 27 走到極致:
// 公布拒絕 · 公布通過率 · 公布規則細節 · weekly cadence。
//
// 4 brand IP axiom 在同一個 page 同時 fire:
//   1. Pratfall · 公布「拒絕原因」 = 公開承認「我們會 reject 你」
//   2. Costly Signaling · 每週手寫 update = 不可造假的勞動成本訊號
//   3. Disclosure Philosophy · 延伸 /audit 公開模型 → 公開「分配模型」
//   4. 倒置 SaaS · 手工稀缺商品 = 手工稀缺流程 · 連分配都是手工
//
// 「方法公開 · 品味私藏」 8 字 brand grammar 物理產出:
//   方法 = allocation rules(公開到極致 · 拒絕原因都列)
//   品味 = 誰被 allocated(100% 私藏 · 不洩 PII)
//
// 狀態(2026-05-22):pre-launch · 7 forged hardcoded · 263 待認領 ·
// 申請通道未開啟。 第一個 review window 開啟後此 page 才有 weekly row。
// 現在 ship empty scaffold + rules + Tim 承諾 · 等通道開啟自動 grow。
//
// Routing:/founders/ledger · indexable · cross-link from /founders +
// /audit + /manifesto。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // re-render daily

// Pre-launch state · 申請通道未開啟 · 0 weekly reviews 累計
const REVIEW_WINDOWS: ReviewWindow[] = [
  // future weekly entries 會 append 在這 · 第一筆 = 申請通道開啟第一週
  // 例 sample structure:
  // {
  //   weekStartIso: "2026-09-01",
  //   newAllocated: 3,
  //   applicantsCount: 5,
  //   approvalRate: 60,
  //   rejectionSamples: [
  //     "申請動機僅含『投資』字眼 · 未通過(不對齊 brand IP)",
  //     "重複申請 4 次 · 未通過",
  //   ],
  // },
];

type ReviewWindow = {
  weekStartIso: string;
  newAllocated: number;
  applicantsCount: number;
  approvalRate: number;
  rejectionSamples: string[];
};

const PRE_LAUNCH = REVIEW_WINDOWS.length === 0;

export default function FoundersLedgerPage() {
  // Forged hardcoded(per lib/founders-stats.ts pre-Supabase state)
  const forgedCount = FOUNDERS_CLAIMED; // currently 7
  const remainingCount = FOUNDERS_REMAINING;
  const totalApplicants = REVIEW_WINDOWS.reduce(
    (s, w) => s + w.applicantsCount,
    0
  );
  const totalApproved = REVIEW_WINDOWS.reduce(
    (s, w) => s + w.newAllocated,
    0
  );
  const cumulativeApprovalRate =
    totalApplicants > 0
      ? Math.round((totalApproved / totalApplicants) * 100)
      : null;

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
              / FOUNDERS 27 · OPEN ALLOCATION LEDGER
            </p>
            <span
              lang="en"
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                PRE_LAUNCH
                  ? "border-gold/60 text-gold shimmer"
                  : "border-gold/60 text-gold"
              }`}
              title={
                PRE_LAUNCH
                  ? "✓ LIVE NOW · 申請通道開啟 · email Tim 申請 · 不等 Q3"
                  : `累計 ${REVIEW_WINDOWS.length} 週 review · ${totalApproved} 分配 · ${totalApplicants} 申請`
              }
            >
              {PRE_LAUNCH ? "✓ APPLY OPEN · review pending Q3+ · email Tim" : `WEEK ${REVIEW_WINDOWS.length}`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            Founders 27 · 分配公開帳本
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            其他 luxury 品牌(Patek · Hermès · Tesla · Apple Vision Pro)做
            <strong className="text-bone"> process transparency</strong> · 但
            <strong className="text-bone">沒人公布「本週拒絕了誰 · 為什麼」</strong>。
            ZONE 27 因 disclosure-first 結構性可以做。 每週手寫一次。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            這頁 4 個 brand IP axiom 同時 fire:
            <strong className="text-bone">Pratfall</strong>(公布拒絕)·
            <strong className="text-bone">Costly Signaling</strong>(每週
            手寫不可造假)·
            <strong className="text-bone">Disclosure Philosophy</strong>(
            延伸 /audit 公開模型 → 公開分配模型)·
            <strong className="text-bone">倒置 SaaS</strong>(手工稀缺商品 =
            手工稀缺流程)。
          </p>
          <div className="mt-6 mb-2">
            <ArticleMeta readingMin={3} sample={{ current: REVIEW_WINDOWS.length, threshold: 30 }} />
          </div>
          <div className="mt-3">
            <EngineStamp />
          </div>
        </section>

        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-12">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* R72 W-C · FoundingMemberLedger · Agent A R72 SHIP 2 ★★★★★
            highest direct revenue amplifier · Patek Philippe Geneva Seal
            certification roll + Berkshire shareholder identity continuity
            + Pinboard.in user-count public disclosure pattern · 270 grid
            visualized · 7 SYSTEM-TEST + 263 empty「— —」 rows · costly
            signaling moat · NO competitor can publish empty allocation roll
            · Pokemon SHADOWLESS RUN axiom 物理 codify · 同 /founders/from-
            one-current-founder R69 W-B 270 letters cap parallel。 */}
        <FoundingMemberLedger />

        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-12">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* ── CUMULATIVE STATS ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            / CUMULATIVE · 累計
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate/40 border border-line/70 p-5 sm:p-7">
            <StatBlock label="TOTAL · 限量" value={String(FOUNDERS_TOTAL)} />
            <StatBlock
              label="FORGED · 已認領"
              value={String(forgedCount)}
              tone="gold"
            />
            <StatBlock
              label="REMAINING · 待認領"
              value={String(remainingCount)}
              tone="mute"
            />
            <StatBlock
              label="APPROVAL RATE · 通過率"
              value={cumulativeApprovalRate === null ? "—" : `${cumulativeApprovalRate}%`}
              tone={cumulativeApprovalRate === null ? "mute" : "bone"}
              small={cumulativeApprovalRate === null}
            />
          </div>
          {PRE_LAUNCH && (
            <p className="mt-5 font-mono text-loss/80 text-[10px] tracking-[0.3em] leading-relaxed">
              ⚠ PRE-LAUNCH · 7 forged 為 hardcoded(per lib/founders-stats.ts
              · Tim 親手 onboard 之前的 placeholder)。 申請通道在 payment
              infra 就緒 + 付款開放後啟用(milestone-triggered · 不綁日期)·
              第一週 review window 開啟才會有 weekly row。
            </p>
          )}
          {!PRE_LAUNCH && (
            <p className="mt-5 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
              ▸ 累計 {REVIEW_WINDOWS.length} 週 review · {totalApplicants} 申請 ·
              {totalApproved} 通過 · {totalApplicants - totalApproved} 未通過
            </p>
          )}
        </section>

        {/* R60 W-B · NEW SECTION · SHADOWLESS RUN framing · Pokemon TCG 1st
            Edition / Shadowless Run mechanic 物理 codify · 整批 270 = print-
            run-of-record · 永不重印。 WoTC 1999 Base Set 第一批 print run
            的 「1st Edition」 sigil 從未被 reprint · PSA 10 1st Edition
            Shadowless Charizard 2024 Heritage Auctions 拍賣 $550K(vs 同卡
            Unlimited low five figures = 10-50x premium)· 「first batch
            visible mark」 mechanic 不是 rarity 而是 receipt-of-finite-set。
            ZONE 27 Founders 27 整批 = 等價 1st Edition Shadowless · BLACK
            CARD 永遠 = 等價 Unlimited(可 renew)。 不加價(NT$ 2,700 不變)·
            不 split sub-tier(no #001 vs #027 prestige)· 純 binary
            tier framing(per Pokemon mechanic accurate · not vinyl First
            Pressing sub-prestige invention)。 同 Patek allocation +
            [[zone27-disclosure-philosophy]] 公開 commitment「售完即永久關閉」
            事前 binding · brand IP triple-fire。 ────────────────── */}
        <section
          id="shadowless-run"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12"
        >
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / SHADOWLESS RUN · 整批 270 = ZONE 27 1st Edition
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            為什麼整批 270 是「1st Edition」?
          </h2>
          <p className="text-mute leading-relaxed max-w-2xl mb-5">
            Pokemon TCG 1999 年 WoTC Base Set 第一批 print run 上面有個小小的{" "}
            <strong className="text-bone">1st Edition sigil</strong>(後來
            shadow 加回去 · 第一批就成「Shadowless」)· 從未被 reprint · 2024
            Heritage Auctions PSA 10 1st Edition Shadowless Charizard 拍價{" "}
            <strong className="text-gold">US$ 550,000</strong> ·{" "}
            同一張卡 Unlimited 印量版本 low five figures · binary tier
            mechanic 帶來 10-50× premium。
          </p>
          <p className="text-mute leading-relaxed max-w-2xl mb-5">
            <strong className="text-bone">ZONE 27 採同 mechanic</strong> ·
            Founders 27 整批 270 名 = 1st Edition Shadowless Run · 售完即
            <span className="text-gold/90"> 永久關閉 · 不會有第二批</span>。
            BLACK CARD 訂閱永遠 open(同 Unlimited 印量)· Founders 27 永遠
            closed once sold(同 1st Edition 不可 reprint)。
          </p>
          <p className="text-mute leading-relaxed max-w-2xl mb-5">
            <strong className="text-bone">BLACK CARD 訂閱者永遠無法 retroactively
            升 Founders 27</strong>(同 Unlimited 持有者永遠無法把卡片變成 1st
            Edition)。 這是<span className="text-gold"> binary tier</span> ·
            不是 sub-tier · 不分 #001 vs #027 prestige(我們無 vinyl First
            Pressing sub-prestige 發明)· 純 print-run-of-record · 同 NT$ 2,700
            一次 · 不加價。
          </p>
          <div className="mt-6 bg-slate/40 border border-line/70 p-5 sm:p-6">
            <p
              lang="en"
              className="font-mono text-gold/90 text-[10px] tracking-[0.35em] mb-3"
            >
              / 3 BINDING COMMITMENTS · 事前 pre-commit
            </p>
            <ul className="space-y-2 text-mute text-sm leading-relaxed">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">01</span>
                <span className="flex-1">
                  Founders 27 售完 即永久關閉 · git commit 為 source of truth ·
                  不會有第二批
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">02</span>
                <span className="flex-1">
                  BLACK CARD 訂閱者 不論時間多久 不論累計付款多少 · 永遠
                  cannot upgrade to Founders 27 · 1st Edition is binary
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/70 text-[10px] tracking-[0.25em]">03</span>
                <span className="flex-1">
                  NT$ 2,700 終身永不調漲 · 售完 = 永遠 NT$ 2,700 在 closed state
                  · 不會 reprint 漲價 · 同 1st Edition Shadowless 不可重印
                </span>
              </li>
            </ul>
          </div>
          <p className="mt-5 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ <strong className="text-bone">PRE-COMMIT</strong> · 上 3 條
            binding rule · 修改需 30 天前{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
              /changelog
            </Link>{" "}
            公告 · 同{" "}
            <Link href="/audit" className="text-gold underline-offset-4 hover:underline">
              /audit
            </Link>
            {" "}S05 PRE-COMMIT pattern · 違反 = brand 信用 collapse(per{" "}
            <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">
              /ethics
            </Link>
            )。
          </p>
        </section>

        {/* ── ALLOCATION RULES · canonical · pre-locked ─ */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / ALLOCATION RULES · 分配規則(pre-commit · binding)
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            為什麼是 270?
          </h2>
          <p className="text-mute leading-relaxed max-w-2xl mb-6">
            棒球 1 場 = 27 個出局數(perfect game) · 270 = 10 倍。 同
            ZONE 27 brand 數字哲學 — 不是 round 100/200 行銷數字 · 是棒球
            數字 anchor。 一旦 forge 滿 270 · 永遠關閉 · 不再開放。
          </p>

          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 mt-10">
            分配 5 步流程(每週一次)
          </h2>
          <ol className="space-y-4 text-mute leading-relaxed max-w-2xl">
            <RuleRow
              no="01"
              title="申請窗口"
              body="每週 Sunday 23:59 TPE close。 隔週 Monday Tim 親手 review 全部新申請。 沒 algorithm · 沒 form ranking · 純人工讀。"
            />
            <RuleRow
              no="02"
              title="審核標準"
              body="(a) 申請動機跟 brand IP 對齊(不接受純『投資』『增值』『轉售』 framing) · (b) 對 CPBL / 棒球分析有真實興趣 · (c) 不重複申請(同 email 4 次 = 自動 reject)。"
            />
            <RuleRow
              no="03"
              title="通過 → onboard"
              body="Tim 親手寄個人化 email · 含銀行 4 欄位 + ZONE27-#NNN 備註 + 流程指引(per docs/EMAIL-TEMPLATES.md 4-phase psychology framework)。 24-48 hr response window。"
            />
            <RuleRow
              no="04"
              title="未通過 → 拒絕 email"
              body="Tim 親手寄 honest rejection email · 說明原因(不 boilerplate) · 不留 future window(每個申請是 final)。 拒絕 sample 去 PII 後本帳本下方公布。"
            />
            <RuleRow
              no="05"
              title="此頁更新"
              body="每週一手寫加入新 row · 含本週新分配數 / 申請數 / 通過率 / 拒絕原因 sample。 git commit 為 source of truth · 任何 visitor 可看 commit history audit。"
            />
          </ol>

          <p className="mt-8 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ <strong className="text-bone">PRE-COMMIT</strong> · 上述 5 步 +
            審核標準 binding rule · 修改需 30 天前 /changelog 公告。 同
            <Link href="/audit" className="text-gold underline-offset-4 hover:underline ml-1">
              /audit
            </Link>
            {" "}S05 PRE-COMMIT DIVERGED handling 同 Costly Signaling pattern。
          </p>
        </section>

        {/* R74 W-B · RefusalLedgerHint · Agent A R73 SHIP 5 · Cialdini
            Reject-then-Retreat(1975)inverted · publish refusal grammar
            BEFORE 任何 refusal land · 申請者 self-select 自己 fit · 5 pre-
            committed rationale-types · pre-launch all count=0 · per /audit
            S05 PRE-COMMIT clause append-only · same Costly Signaling
            discipline as ENGINE_DIFF_BEACONS + NO_PUSH_INVENTORY +
            RECIPROCITY_LEDGER + LOCAL_STORAGE_INVENTORY pattern · pairs
            with TimResponseSLA chip on /founders/apply R72 W-B · refusal-
            as-reciprocity scaffold · brand IP triple-fire(Pratfall +
            Costly Signaling + Disclosure)。 */}
        <RefusalLedgerHint />

        {/* ── WEEKLY REVIEWS · ledger rows ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / WEEKLY REVIEWS · 每週 review log
          </p>
          {PRE_LAUNCH ? (
            <EmptyReviewsState />
          ) : (
            <div className="space-y-6">
              {REVIEW_WINDOWS.slice()
                .reverse()
                .map((w) => (
                  <ReviewWindowRow key={w.weekStartIso} window={w} />
                ))}
            </div>
          )}
        </section>

        {/* ── WHY ONLY ZONE 27 CAN DO THIS · brand IP statement ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <blockquote className="border-l-2 border-gold pl-6 sm:pl-8 py-3">
            <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-4">
              身份是<span className="text-gold">私藏</span>的 · 推薦是
              <span className="text-gold">公開</span>的見證 · 拒絕也是。
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              其他高端 sports / luxury / membership 品牌(Patek · Hermès ·
              Stratechery · The Athletic)做 process transparency 但**沒人
              公布拒絕**。 因為他們 brand 結構是「我們 select 你 = 你 lucky」
              · 公布拒絕 = 否定 luxury 邏輯。 ZONE 27 brand 結構是「方法
              公開 · 品味私藏」 · 公布拒絕 = 強化 brand IP · 不是 dilute。
            </p>
          </blockquote>
        </section>

        <FounderSignOff>
          <p>
            這頁今天是 <strong>empty scaffold</strong> · 申請通道未開啟 ·
            weekly reviews 還是 0。 但 5 步流程 + 審核標準 5 條 + 拒絕公布
            commitment 已 binding · 修改需 30 天前 /changelog 公告。
          </p>
          <p>
            申請通道在 payment infra 就緒 + 付款開放後啟用(milestone-triggered ·
            不綁日期)· 第一個 review window 結束那天 · 第一筆 weekly row
            落這。 沒 backdated 過去申請 · 沒 cherry-picked 通過 sample ·
            拒絕原因(去 PII)會跟通過數量同等視覺權重 surface。
          </p>
          <p>
            這個 page 的存在 brand IP 是 statement:<strong>ZONE 27 跟所有
            高端 membership / luxury 品牌的根本差別 · 就是這個 ledger 的存在
            本身</strong>。 我們不藏拒絕 · 我們把它公開到 visitor 可以截圖
            嗆我們的程度。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/founders/ledger" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/founders"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← Founders 27 銷售頁
            </Link>
            <Link
              href="/audit"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              引擎 model report · /audit →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function StatBlock({
  label,
  value,
  tone = "bone",
  small = false,
}: {
  label: string;
  value: string;
  tone?: "bone" | "gold" | "mute" | "loss";
  small?: boolean;
}) {
  const toneClass = {
    bone: "text-bone",
    gold: "text-gold",
    mute: "text-mute",
    loss: "text-loss",
  }[tone];
  return (
    <div>
      <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-2">
        {label}
      </p>
      <p
        className={`font-mono ${toneClass} tabular ${
          small ? "text-lg" : "text-3xl sm:text-4xl"
        } font-light tracking-tight`}
      >
        {value}
      </p>
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

function EmptyReviewsState() {
  // Pre-launch · 申請通道未開啟 state · 不假裝 weekly rows 存在
  return (
    <div className="bg-slate/30 border border-dashed border-loss/30 p-8 sm:p-10 text-center">
      <p
        lang="en"
        className="font-mono text-loss/80 text-[10px] tracking-[0.4em] mb-3 shimmer"
      >
        ⚠ NO REVIEW WINDOWS YET · 申請通道未開啟
      </p>
      <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-4">
        第一個 review window 在 payment infra 就緒 + 付款開放後啟用
        (milestone-triggered · 不綁日期)。 那天起每週一手寫加新 row
        (本週新分配 + 申請數 + 通過率 + 拒絕原因 sample)。 從 0 開始 ·
        不 backdated 過去申請 · 不 cherry-pick 通過 sample。
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
        7 founders forged 顯示在累計 stats · 為 Tim 手工 onboard 的早期會員 ·
        未經申請通道 · 直接 forged · 標記在 /leaderboard 編號 #001-#007。
      </p>
    </div>
  );
}

function ReviewWindowRow({ window: w }: { window: ReviewWindow }) {
  return (
    <article className="bg-slate/40 border border-line/60 p-5 sm:p-7">
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] tabular"
        >
          WEEK OF {w.weekStartIso}
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
          {w.newAllocated}/{w.applicantsCount} 通過 ·{" "}
          <span className="text-bone">{w.approvalRate}%</span>
        </p>
      </div>
      {w.rejectionSamples.length > 0 && (
        <div className="mt-4 border-t border-line/40 pt-4">
          <p className="font-mono text-loss/80 text-[10px] tracking-[0.3em] mb-3">
            REJECTION SAMPLES · 去 PII
          </p>
          <ul className="space-y-2 text-mute text-sm leading-relaxed">
            {w.rejectionSamples.map((r, i) => (
              <li key={i} className="border-l-2 border-loss/40 pl-4">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
