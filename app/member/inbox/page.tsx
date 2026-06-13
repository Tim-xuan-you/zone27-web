import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MarkInboxSeen from "@/components/MarkInboxSeen";
import { getMySettlementInbox } from "@/lib/settlement-data";
import type { SettlementItem } from "@/lib/settlement-inbox";

// ── ZONE 27 · /member/inbox · 結算收件匣 ──────────────────────────────────────
// 「你不在時結算的押注」的逐筆對帳隊列(R230 #1 大工程的不卡網域、不卡 migration 那半)。
// Nav 鈴鐺(SettlementBell)點進來的家。 跟 /member/collection(戰功卡畫廊「瀏覽全部」)
// 是不同工作:這裡是「最近結算了什麼 · 哪些是新的」的時間序隊列(像 email 收件匣),
// collection 是「我所有卡」的相簿。 逐筆連到 /receipts(可外傳的單場收據 = 病毒迴路)。
//
// 🔴 含輸照攤(命中 ✓ 落空 ✕ 同權重)· 平靜對帳語氣 · 無 PnL/紅綠/confetti。
//   逆風(你對、引擎看走眼)= 唯一加亮的高光 —— 那是贏過機器的證明,不是賭場的連勝煙火。
//   0 已結算 → 平靜空狀態(去看今晚可押 / 收藏)· 不是死路。
// 純本人(on-read · 0 migration)· 未登入 → 登入邀請。
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "結算收件匣",
  description:
    "你不在的時候,押過的場結算了 —— 命中、落空都在這裡逐筆對帳。賽前鎖死、賽後攤開,改不了。",
};

// 收件匣是本人即時資料(讀 cookie)· 不可靜態快取。
export const dynamic = "force-dynamic";

// 「更早」只在有新結算時當脈絡墊一小段(不是再貼一次收藏畫廊)· 對齊「收件匣 ≠ 相簿」分工。
const EARLIER_CAP = 6;

function SettlementRow({ item }: { item: SettlementItem }) {
  const sportTag = item.sport === "soccer" ? "足球" : "棒球";
  return (
    <Link
      href={`/receipts/${item.matchId}`}
      className="flex items-center justify-between gap-3 border-b border-line/40 py-3.5 hover:border-gold/40 transition-colors group"
    >
      <div className="min-w-0">
        <p className="text-sm sm:text-base leading-snug">
          {item.youHit ? (
            <span className="font-mono text-gold mr-1.5">✓</span>
          ) : (
            <span className="font-mono text-loss/85 mr-1.5">✕</span>
          )}
          <span className="text-bone">你押 {item.myPickName}</span>
          {item.beatEngine && (
            <span className="ml-2 align-middle inline-block px-1.5 py-px border border-gold/50 text-gold font-mono text-[9px] tracking-[0.2em]">
              逆風 · 贏過引擎
            </span>
          )}
        </p>
        {/* 隊名 + 結果是真內容(非裝飾微字)→ mute/85 過 WCAG AA(mute/70 ≈ CR 3.4 不過)。
            不 truncate:長中文隊名會把尾巴「結果 X」吃掉,而贏家在這列沒別的地方露 → 允許折行。 */}
        <p className="mt-1 font-mono text-mute/85 text-[11px] tracking-[0.04em] leading-snug">
          <span className="text-mute/70">{sportTag}</span>
          {" · "}
          {item.home} vs {item.away}
          {" · "}
          {item.youHit ? "命中" : "落空"}
          {" · 結果 "}
          {item.outcomeName}
        </p>
      </div>
      <span className="shrink-0 font-mono text-gold/60 group-hover:text-gold text-[10px] tracking-[0.3em] transition-colors">
        收據 →
      </span>
    </Link>
  );
}

export default async function InboxPage() {
  const inbox = await getMySettlementInbox();

  // 未登入 → 登入邀請(同 /member/collection 的牆)。
  if (!inbox) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Nav active="member" />
        <main
          id="main"
          className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24"
        >
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
            / 結算收件匣
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
            你不在時,<span className="text-gold">結算了什麼。</span>
          </h1>
          <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center mt-6">
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
              登入(免費)後,你押過、賽前鎖死的每一手結算了,都會在這裡逐筆對帳 —— 含輸照攤。
            </p>
            <Link
              href={`/login?next=${encodeURIComponent("/member/inbox")}`}
              className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              免費登入 →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const newItems = inbox.items.filter((i) => i.isNew);
  const earlierItems = inbox.items.filter((i) => !i.isNew).slice(0, EARLIER_CAP);
  const newHits = newItems.reduce((n, i) => n + (i.youHit ? 1 : 0), 0);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />
      {/* 看過 = 對過帳:把 last_seen 推到現在 + 鈴鐺歸零(純副作用 island)。 */}
      <MarkInboxSeen />

      <main
        id="main"
        className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-12 pb-24"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 結算收件匣
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-3">
          你不在時,<span className="text-gold">結算了什麼。</span>
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-10 max-w-xl">
          押過、賽前鎖死的場,賽後在站上即時對帳 —— 命中、落空都逐筆攤在這。
          <span className="text-bone">逆風</span>(你對、引擎看走眼)會標出來,那是贏過機器的證明。
        </p>

        {inbox.total === 0 ? (
          // 平靜空狀態 —— 還沒有結算過的押注(不是死路)。
          <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
            <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
              還沒有結算的押注。
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
              你押過、賽前鎖死的場一旦打完,就會在這裡逐筆對帳。先去鎖一手?
            </p>
            <Link
              href="/member"
              className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              回儀表板看今晚可押 →
            </Link>
          </div>
        ) : newItems.length === 0 ? (
          // 都對完帳了 —— 純對帳隊列的「收件匣零」狀態。 不再貼一次「已結算」全清單(那是
          // 收藏畫廊的工作)→ 收件匣只負責「新的、待對帳的」· 對齊「收件匣 ≠ 相簿」分工。
          <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-3">
              / 都對完帳了
            </p>
            <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
              沒有新結算 · 你都對過帳了。
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
              你押過、賽前鎖死的 <span className="text-bone tabular">{inbox.total}</span> 場都已逐筆對完。
              新的結算會回到這裡 · 也會在每頁右上角亮一個數字提醒你。
            </p>
            <Link
              href="/member/collection"
              className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              看完整戰功卡收藏 →
            </Link>
          </div>
        ) : (
          <>
            {/* 新結算(你不在時才結算的)· 含輸誠實掛總帳(✓ 中 · ✕ 沒中 同權重)*/}
            <section className="mb-10">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <p className="font-mono text-gold/90 text-[11px] tracking-[0.3em]">
                  新結算 · {newItems.length} 場
                </p>
                <p className="font-mono text-mute/80 text-[11px] tracking-[0.04em] tabular">
                  <span className="text-gold">✓{newHits}</span> 中 ·{" "}
                  <span className="text-loss/85">✕{newItems.length - newHits}</span> 沒中
                </p>
              </div>
              <div>
                {newItems.map((item) => (
                  <SettlementRow key={item.matchId} item={item} />
                ))}
              </div>
            </section>

            {/* 更早(已對過帳的)· 只墊一小段脈絡(cap 6)· mute 不搶新結算的主角 ·
                要看全部 → 下方「看完整收藏」(那才是相簿)。 */}
            {earlierItems.length > 0 && (
              <section className="mb-8">
                <p className="font-mono text-mute/60 text-[10px] tracking-[0.3em] mb-1">
                  更早
                </p>
                <div className="opacity-80">
                  {earlierItems.map((item) => (
                    <SettlementRow key={item.matchId} item={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* 收件匣(時間序對帳)→ 收藏(全部畫廊)· 兩個不同的家 */}
        <div className="mt-10 pt-6 border-t border-line/40 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/member/collection"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
          >
            看完整收藏 →
          </Link>
          <Link
            href="/member"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
          >
            ← 回你的儀表板
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
