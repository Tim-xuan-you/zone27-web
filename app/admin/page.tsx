import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import { matches, getFinalizedMatches } from "@/lib/matches";
import { getWaitlistCount } from "@/lib/waitlist-stats";
import { getUser } from "@/lib/supabase/server";
import AdminConsole from "@/components/AdminConsole";

export const metadata: Metadata = {
  title: "Tim 的 ZONE 27 管理台",
  description:
    "ZONE 27 後台 · 加點數、標付費會員、審文章,全部點按鈕完成(後端上鎖 · 只有你能動)。",
  // noindex:這頁不該出現在搜尋結果。
  robots: { index: false, follow: false },
};

// 即時數字每 60 秒重抓一次。
export const revalidate = 60;

// ── ZONE 27 · /admin · Tim 的單人管理台 ────────────────────────────────────
// 後台研究的一句話結論:後台是「待辦收件匣」不是「儀表板」—— 打開只回答「現在有
// 什麼需要我親手處理」,處理完就安靜下來。 所以這頁只放 Tim 真的會按的幾個按鈕:
//   · 加 / 扣點數(記手動轉帳入金)
//   · 標付費會員(含到期日 + 該提醒誰續費的清單)
//   · 審文章 / 留言(看全文 + 留痕刪)
//   · 幾個即時數字
// 碰錢一律親手按一次確認 + 留痕(鐵律 #13:不自動扣款)· 後端上鎖只有 Tim 能動。
// noindex · 不對搜尋引擎曝光。
//
// 2026-06-22 大整理:砍掉開發期的「身分預覽」三大塊(設計者問答 / 切換器 / 功能對照表
// + 安全模型小論文)= 對日常營運是純雜訊的工程黑話;全頁回到乾淨、安靜、看得懂。
// ─────────────────────────────────────────────────────

export default async function AdminPage() {
  // getUser() 再驗一次身分(不用可偽造的 getSession)· 並用它決定數字給不給看。
  const user = await getUser();
  const waitlistCount = await getWaitlistCount();
  const finalizedCount = getFinalizedMatches().length;
  const ingestedCount = matches.length;
  const pendingIngest = matches.filter((m) => !m.finalResult).length;

  const waitlistValue = !user ? "—" : waitlistCount === -1 ? "—" : waitlistCount;
  const waitlistHint = !user
    ? "登入後才看得到"
    : waitlistCount === -1
    ? "後台資料庫暫時連不上 · 稍後再試"
    : waitlistCount === 0
    ? "還沒有人加入 · 等第一個"
    : `${waitlistCount} 個 email`;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── 開頭 ── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-10">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
              / 你的管理台
            </p>
            <span
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80"
              title="只有你看得到 · 沒上 Google"
            >
              只有你看得到
            </span>
            {user && (
              <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold">
                ✓ 已登入 · {user.email}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            Tim 的 <span className="text-gold">ZONE 27 管理台</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            加點數、標付費會員、審文章 ——{" "}
            <strong className="text-bone">全部點按鈕完成</strong>:打 email、打金額、按按鈕,
            全程不用寫任何指令。 碰錢的動作要你
            <strong className="text-bone">親手按一次確認 + 留痕</strong>
            (你的鐵律:不自動扣款)· 不是限制,是紀律。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-10" />

        {/* ── 管理台(真正天天會用的營運工具)── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-14">
          <AdminConsole />
          <p className="mt-6 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed max-w-2xl">
            ▸ 第一次用:登入你的 email → 按「把我設為管理員」(只有第一個人能設,設完就鎖住)
            → 之後全是按鈕。 這些動作只有你能執行,別人就算想繞過也被擋下。
          </p>
        </section>

        {/* ── 幾個即時數字(只放會讓你動手、或你會想知道的)── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-4">
            / 即時數字
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <KpiCard zh="等候名單" value={waitlistValue} hint={waitlistHint} />
            <KpiCard
              zh="收錄的賽事"
              value={ingestedCount}
              hint={`${finalizedCount} 場已結算 · ${pendingIngest} 場待結算`}
            />
            <KpiCard zh="引擎版本" value="v0.2" hint="逐打席模型" />
          </div>
        </section>

        {/* ── 不裝追蹤(收合成一段)── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3">
            / 不裝追蹤
          </p>
          <p className="text-mute/85 text-sm leading-relaxed max-w-2xl">
            這個站<strong className="text-bone">不裝任何追蹤分析</strong>(Google Analytics、
            Facebook Pixel、熱圖錄影都不裝)—— 因為我們在{" "}
            <Link
              href="/privacy"
              className="text-gold underline-offset-4 hover:underline"
            >
              /privacy
            </Link>{" "}
            公開承諾不追蹤訪客,那本身就是品牌的一部分。 要看搜尋表現,用 Google Search
            Console 就好(它只看搜尋、不追蹤站上的人)。
          </p>
        </section>

        <FounderSignOff>
          <p>
            這頁是給<strong>你自己</strong>看的,不對外。 上面那個管理台是真的 ——
            加點數、標付費會員、審文章,全是點按鈕、後端上鎖,只有你能動。 碰錢的動作
            故意要你親手確認、而且留痕,不是限制,是你的鐵律。
          </p>
          <p>
            但別讓它長太大。 一個人做的階段,夠用就好。 哪天你盯這個後台的數字,
            比盯自己的公開戰績還多 —— 那是品牌走偏的信號。 這頁存在的一部分意義,
            也是提醒你這件事。
          </p>
        </FounderSignOff>

        {/* ── 回會員端 ── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/member"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回會員端 · /member
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── 即時數字小卡 ──
function KpiCard({
  zh,
  value,
  hint,
}: {
  zh: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="p-4 sm:p-5 border border-gold/30 bg-slate/30">
      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mb-3">{zh}</p>
      <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light leading-none mb-2">
        {value}
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
        {hint}
      </p>
    </div>
  );
}
