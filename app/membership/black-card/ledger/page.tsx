import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";

export const metadata: Metadata = {
  title: "BLACK Public Ledger · 0 paid · 第 1 位 = 您",
  description:
    "ZONE 27 BLACK 公開訂閱者帳本 · Aftermath subscriber goals + Patek allocation ledger pattern · 0 paid sub state honest publish · 第 1 位的 handle 永久顯示在這裡 · 我們不會用機器人灌水 · 也不會假裝有客戶。 靠賣明牌的生意結構上無法 publish 訂閱者帳本(regulatory + privacy + churn 暴露)· structurally 不可 copy。",
};

// ── ZONE 27 · /membership/black-card/ledger ──────────────
// Round 39 W-G · Agent D DEEPEST sharp call ship · per [[feedback-no-
// waiting-rule]] 鐵律「不等 Q3 · 任何現在能做就做」。
//
// Aftermath「Subscriber Goals 2026」 + Hell Gate ledger + Patek allocation
// transparency 三 pattern 合一 · 同 /founders/ledger structure transplant
// 到 monthly BLACK tier。
//
// Pre-launch state(post-R81 pivot):
//   - 0 BLACK subscribers · CPBL Season Pass LIVE manual ECPay
//   - 「第 1 位的 handle 會永久顯示在這裡」 inverse-FOMO
//   - empty state IS the point per Aronson 1966 Pratfall
//
// 4 brand IP axiom 同時 fire:
//   - Pratfall · 公開 0 paid · 不假裝有客戶
//   - Costly Signaling · structurally non-copyable by tipster sites
//     (玩運彩 regulatory + privacy + churn 暴露 不可 publish)
//   - Disclosure Philosophy · 延伸 /founders/ledger 同 ledger discipline
//   - 倒置 SaaS · manual subscription = visible ledger possible · auto-
//     charge = ledger 暴露 churn 商業自殺 · ZONE 27 結構上可以做
//
// Routing: /membership/black-card/ledger · public · 36th visitor-
// discoverable route。
// ─────────────────────────────────────────────────────

export const revalidate = 86400;

// ── Empty state · 0 paid · pre-launch ────────────────
// 未來 schema:Supabase Migration 0003 將加 `public.black_card_subscribers`
// table · RLS-locked + SECURITY DEFINER aggregate read · 同 0001_waitlist
// + 0002_founder_reservations pattern。 此 page 第一階段 import constant
// 從本地檔 · Q3 payment launch 時 swap 為 SECURITY DEFINER read function。
const BLACK_CARD_SUBSCRIBERS: {
  handle: string | null;
  firstMonth: string;
  monthsSustained: number;
}[] = [];

const BLACK_CARD_LAUNCH_DATE = "payment infra 就緒後啟用(milestone-triggered)";

export default function BlackCardLedgerPage() {
  const totalSubs = BLACK_CARD_SUBSCRIBERS.length;
  const opted_in_handles = BLACK_CARD_SUBSCRIBERS.filter(
    (s) => s.handle !== null
  ).length;

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
              / BLACK · PUBLIC LEDGER · 公開訂閱者帳本
            </p>
            <span
              lang="en"
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                totalSubs === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
            >
              {totalSubs === 0
                ? "WAITING · N=0 · 您會是第 1 位"
                : `N=${totalSubs} 位訂閱者`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            目前 <span className="text-gold">{totalSubs}</span> 位 BLACK 訂閱者 ·
            <br className="hidden sm:inline" /> 第 {totalSubs + 1} 位的 handle{" "}
            <span className="text-gold">永久</span> 顯示在這裡
          </h1>

          <div className="mt-8 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              <strong>每個 SaaS 訂閱頁面都告訴您「25,000 公司信任我們」</strong>{" "}
              · ZONE 27 倒置:目前{" "}
              <span className="text-gold">{totalSubs} 位 BLACK 訂閱者</span> ·
              我們不會用機器人灌水 · 也不會假裝有客戶。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              這頁 publish 當前訂閱者 handle(opt-in)+ 第一個月 + 已 sustain
              幾個月。 第 1 位的 handle 永久 row 1 · 同 GOLD allocation
              ledger 邏輯延伸到 monthly tier。
            </p>
          </div>

          <div className="mt-6">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── LEDGER TABLE ─────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 01 · LEDGER · {totalSubs} 位訂閱者
          </p>
          {totalSubs === 0 ? (
            <div className="border-2 border-dashed border-gold/30 bg-slate/30 p-8 sm:p-12 text-center">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
              >
                EMPTY LEDGER · BY DESIGN
              </p>
              <p className="text-bone text-xl sm:text-2xl font-light tracking-tight mb-4 leading-tight">
                目前 0 位 BLACK 訂閱者
              </p>
              <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-5">
                payment 基礎建設 {BLACK_CARD_LAUNCH_DATE} 啟用後 · 第 1 位的
                handle 會永久顯示在此 row 1。 我們不會用機器人灌水 · 也不會
                假裝有客戶 · 此 empty state IS the point。
              </p>
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
                坦承不完美比宣稱完美更能贏得信任。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/membership/black-card"
                  className="inline-block px-6 py-3 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
                >
                  → BLACK 完整介紹
                </Link>
                <Link
                  href="/founders/ledger"
                  className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
                >
                  → GOLD ledger
                </Link>
              </div>
            </div>
          ) : (
            <div className="border border-line/60 bg-slate/30 overflow-hidden">
              <table className="w-full font-mono text-[11px] sm:text-xs tabular">
                <thead>
                  <tr className="border-b border-line/60 bg-slate/60">
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      ROW
                    </th>
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      HANDLE
                    </th>
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      FIRST MONTH
                    </th>
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      MONTHS SUSTAINED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BLACK_CARD_SUBSCRIBERS.map((s, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-line/40 last:border-b-0"
                    >
                      <td className="px-3 py-3 text-mute tabular">
                        #{String(idx + 1).padStart(3, "0")}
                      </td>
                      <td className="px-3 py-3 text-bone">
                        {s.handle ?? <span className="text-mute/60">—</span>}
                      </td>
                      <td className="px-3 py-3 text-mute">{s.firstMonth}</td>
                      <td className="px-3 py-3 text-gold tabular">
                        {s.monthsSustained}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── WHY THIS PAGE EXISTS ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 02 · WHY THIS PAGE EXISTS
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            靠賣明牌的生意 · structurally <span className="text-gold">不可</span> publish
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              現有 sports prediction / tipster 平台 從不 publish 訂閱者名單 ·
              不是技術問題 · 是結構性問題:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Regulatory · 訂閱博彩附屬 service 可能觸發財務監管揭露要求
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Privacy · gambling-adjacent identity 被 publish 風險過高 ·
                  訂閱者不會 opt-in
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Churn 暴露 · 「months sustained = 0」 columns publish 等於
                  暴露 retention 災難 · 自殺商業模式
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Auto-charge incentive 反向 · 自動扣款的訂閱模式靠 hidden
                  passive churn · public ledger 暴露 = 結構性對 revenue 模型
                  傷害
                </span>
              </li>
            </ul>
            <p className="pt-3">
              <strong className="text-bone">ZONE 27 structurally 可以</strong> ·
              因為:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Data publisher · 不是 gambling-adjacent · 0 regulatory friction
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  訂閱者 opt-in handle · 默認「—」 · row 仍 counts · privacy 守
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Manual monthly · 不依賴 hidden churn · 顯示流失率 =
                  把「方法公開」延伸到經營數字 · 對手做不到
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  GOLD ledger 已 ship · pattern + brand IP 已建立 ·
                  BLACK ledger = 同 ledger discipline 延伸到 monthly tier
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── PRE-COMMIT ALLOCATION RULES ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 03 · PRE-COMMIT LEDGER RULES
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            5 rules · 修改需 30 天前先公告
          </h2>
          <ol className="space-y-4">
            {[
              "Handle 完全 opt-in · 默認顯示「—」 · row 1 永遠是第 1 位 · 編號不重排",
              "Months sustained · cancel 後不 delete row · state 從 active 改 cancelled · 保留歷史",
              "Aggregate count 數字 sync 此 ledger row count · 不在其他 page hardcode 矛盾數字",
              "新訂閱 batch 寫入時間 = payment confirmation 時間 · 不可 backdate · 公開紀錄為 source of truth",
              "就算 0 付費會員 · 空名冊也永遠留在頁面上 · 不藏不假裝",
            ].map((rule, i) => (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] gap-3 items-baseline"
              >
                <span
                  lang="en"
                  className="font-mono text-gold text-[12px] tracking-[0.35em] tabular"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-mute leading-relaxed">{rule}</p>
              </li>
            ))}
          </ol>
        </section>

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 commercial model 最 expensive 的 trust artifact ·
            BLACK 訂閱者 from day 1 是 row 1 · 永久。 cancel 也保留 row ·
            state 標 cancelled。 不藏 churn · 不假裝。
          </p>
          <p>
            Aftermath 公布 subscriber goals · 賣明牌的站不公布 paying VIP 名單 ·
            兩者結構性差別:incentive alignment。 ZONE 27 訂閱費 = 整個 revenue
            model · 您贏您輸我都一樣賺。 ledger 公布 跟 incentive 完全 align ·
            這個 page 是 structural moat 不是 marketing decoration。
          </p>
          <p>
            修改這頁的 5 條規則 · 需要 30 天前先公開公告。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/membership/black-card/ledger" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            FIRST ROW WAITS FOR FIRST NAME.
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight mb-8">
            您會是第 {totalSubs + 1} 位。
          </h3>
          <Link
            href="/membership/black-card"
            className="inline-block px-8 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            → BLACK 完整介紹
          </Link>
          <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            opted-in handles: {opted_in_handles} · total: {totalSubs} ·
            ledger first published: 2026-05-22
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
