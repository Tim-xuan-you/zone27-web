import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";

export const metadata: Metadata = {
  title: "公開訂閱者帳本 · 目前 0 位 · 第 1 位就是你",
  description:
    "ZONE 27 BLACK 的訂閱者名冊,整份公開 —— 包括「現在一個付費訂閱者都還沒有」這件事。我們不灌水、不假裝有客戶。第 1 位的名字會永久留在這頁第一行。靠賣明牌賺錢的生意,沒有一家敢把付錢的客戶名單攤出來。",
};

// ── ZONE 27 · /membership/black-card/ledger · 公開訂閱者帳本 ─────────
// 公開到「連 0 位付費訂閱者都掛出來」的誠實帳本(GOLD 名冊 /founders/ledger 已收掉,
// 只此 BLACK 帳本保留)。 手動轉帳 = 連流失都敢攤(自動扣款的對手攤了會露餡)。
//
// 🔴 R241 改寫:這頁原本把「為什麼敢公開」寫成策略簡報 —— 一堆英文 + 後設
//   術語(churn / retention / incentive alignment / structural moat /
//   「empty state IS the point」)直接 render 給訪客 = 既不是人話、又踩到
//   「解釋手法的後設層永不外洩」紅線。 全部改成一個人在跟你講話的口吻;
//   5 條規矩 + 0 位誠實公開的 substance 一字不改、只換語氣。
// ─────────────────────────────────────────────────────

export const revalidate = 86400;

// 0 位付費訂閱者 · 上線前的誠實空名冊。 付款功能開通後第 1 位寫進第一行。
// (未來改成從 Supabase SECURITY DEFINER aggregate read · 同 waitlist 口徑。)
const BLACK_CARD_SUBSCRIBERS: {
  handle: string | null;
  firstMonth: string;
  monthsSustained: number;
}[] = [];

const BLACK_CARD_LAUNCH_DATE = "付款功能開通後";

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
            <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
              / 公開訂閱者帳本
            </p>
            <span
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                totalSubs === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
            >
              {totalSubs === 0
                ? "目前 0 位 · 第 1 位就是你"
                : `目前 ${totalSubs} 位訂閱者`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            目前 <span className="text-gold">{totalSubs}</span> 位 BLACK 訂閱者 ·
            <br className="hidden sm:inline" /> 第 {totalSubs + 1} 位的名字{" "}
            <span className="text-gold">永久</span> 留在這一行
          </h1>

          <div className="mt-8 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              <strong>每個訂閱頁都在跟你說「25,000 家公司都信任我們」</strong>{" "}
              · 我們反過來:現在就是{" "}
              <span className="text-gold">{totalSubs} 位 BLACK 訂閱者</span> ·
              一個都沒灌水 · 也沒假裝有客戶。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              這頁會列出每一位訂閱者願意公開的名字、從哪個月開始、撐了幾個月。
              第 1 位永遠是第一行 · 號碼不重排。
            </p>
          </div>

          <div className="mt-6">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── LEDGER TABLE ─────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 01 · 名冊 · 目前 {totalSubs} 位
          </p>
          {totalSubs === 0 ? (
            <div className="border-2 border-dashed border-gold/30 bg-slate/30 p-8 sm:p-12 text-center">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
                空名冊 · 故意留著
              </p>
              <p className="text-bone text-xl sm:text-2xl font-light tracking-tight mb-4 leading-tight">
                目前 0 位 BLACK 訂閱者
              </p>
              <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-5">
                等{BLACK_CARD_LAUNCH_DATE} · 第 1 位的名字就會永久留在這頁第一行。
                在那之前 · 這裡就是空的 —— 我們不會放機器人 · 也不會假裝有客戶。
                一個誠實的空名冊 · 本來就比一張漂亮的假成績單更值得信。
              </p>
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
                坦承還沒人付錢 · 比吹噓滿堂客更能換到信任。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/membership/black-card"
                  className="inline-block px-6 py-3 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
                >
                  → BLACK 完整介紹
                </Link>
              </div>
            </div>
          ) : (
            <div className="border border-line/60 bg-slate/30 overflow-hidden">
              <table className="w-full font-mono text-[11px] sm:text-xs tabular">
                <thead>
                  <tr className="border-b border-line/60 bg-slate/60">
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      序號
                    </th>
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      名字
                    </th>
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      起始月份
                    </th>
                    <th className="text-left text-gold/90 tracking-[0.2em] px-3 py-3 text-[10px]">
                      撐了幾個月
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

        {/* ── 為什麼敢把這頁攤開 ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 02 · 為什麼敢把這頁攤開
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            靠賣明牌的生意 · 沒有一家敢公開<span className="text-gold">付錢的客戶名單</span>
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              收費報明牌的站、收費明牌群組 · 從來不公布付錢的客戶名單。
              不是做不到 · 是不敢 —— 攤開來會露餡:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  他們跟賭博綁在一起 · 公開客戶名單會惹上一堆法規麻煩
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  願意買明牌的人 · 名字被掛出來風險太高 · 根本不會同意公開
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  最致命的是「撐了幾個月」那一欄 —— 一攤開 · 就看到客人付一兩個月就跑 ·
                  等於自爆「留不住人」
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  他們靠自動扣款悄悄留住「忘了取消」的人 · 名單一公開 · 這套就玩不下去了
                </span>
              </li>
            </ul>
            <p className="pt-3">
              <strong className="text-bone">ZONE 27 敢</strong> · 是因為:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  我們是做數據的 · 不沾賭博 · 沒有那些法規包袱
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  願意公開名字的才掛 · 不想公開就顯示「—」 · 一樣算一位 · 隱私顧到
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-gold/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  我們是手動轉帳 · 每個月由你自己決定要不要再來 —— 所以連「誰走了」都敢攤 ·
                  這就是把「方法公開」一路延伸到經營數字
                </span>
              </li>
            </ul>
            <p className="mt-2 border-l-2 border-gold/50 pl-4 py-1 text-bone leading-relaxed">
              說到底:養活這台免費引擎的錢 · 只來自會員。 所以我們只欠會員一個交代 ——
              不是廣告主 · 不是創投 · 不是莊家。 沒有別的老闆要討好 ·
              我們才敢連「0」都攤給你看。
            </p>
          </div>
        </section>

        {/* ── 這頁的規矩 ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 03 · 這頁的規矩 · 要改要先公告 30 天
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            5 條規矩 · 改之前先公告 30 天
          </h2>
          <ol className="space-y-4">
            {[
              "名字完全自願公開 · 不想公開就顯示「—」 · 第一行永遠是第 1 位 · 號碼不重排",
              "退訂不刪除那一行 —— 狀態改成「已退訂」 · 歷史留著",
              "頁面上的總人數 · 永遠跟這份名冊的行數一致 · 不在別頁寫一個兜不攏的數字",
              "新訂閱的登記時間 = 你付款確認的那一刻 · 不能往前灌水 · 公開紀錄就是準",
              "就算 0 位付費會員 · 這份空名冊也永遠留在頁面上 · 不藏 · 不假裝",
            ].map((rule, i) => (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr] gap-3 items-baseline"
              >
                <span className="font-mono text-gold text-[12px] tracking-[0.35em] tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-mute leading-relaxed">{rule}</p>
              </li>
            ))}
          </ol>
        </section>

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 最貴的一張誠實 —— 連「現在一個付費訂閱者都還沒有」都掛在這裡。
            BLACK 第 1 位從加入那天起就是第一行 · 永久。 就算退訂 · 我也留著那一行 ·
            只把狀態標成「已退訂」。 不藏 · 不假裝。
          </p>
          <p>
            養活這台免費引擎的錢只來自會員 · 所以我只需要對會員誠實 ——
            不對廣告主 · 不對創投 · 不對任何莊家交代。 你贏你輸 · 我賺的都一樣。
            正因為這樣 · 我才敢連「誰走了」都攤開給你看。
          </p>
          <p>
            這頁的 5 條規矩 · 要改的話 · 我會提前 30 天公開公告。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/membership/black-card/ledger" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
            第一行 · 等第一個名字。
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight mb-8">
            你會是第 {totalSubs + 1} 位。
          </h3>
          <Link
            href="/membership/black-card"
            className="inline-block px-8 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            → BLACK 完整介紹
          </Link>
          <p className="mt-4 font-mono text-mute/70 text-[10px] tracking-[0.25em]">
            願意公開名字的:{opted_in_handles} 位 · 總計 {totalSubs} 位 ·
            此帳本首次公開:2026-05-22
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
