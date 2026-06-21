import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { TableSummary } from "@/lib/table-picks";

// ── ZONE 27 · 首頁「今晚這桌」條 ─────────────────────────────────────────
// Tim「Tim/Ron/Lewi 推的怎麼找不到?不是該在主頁就明顯?」→ 把「今晚這桌 · 誠實收據」
// 拉上前門。 一塊低調的 liveness 訊號:真人賽前鎖了幾注 + 賽後對帳的誠實成績(含落空照亮)·
// 整塊一個連結 → /table。 跟首頁頭條「贏輸都掛」同一口氣 —— 但收斂成只敢講機制扛得住的那句:
//   「連輸的都留著」(Tim 手記的桌 · 名字還沒接公開碼 · 不假裝「個人帳本不可竄改」)。
// 🔴 graceful:空桌(total 0)→ 整塊不渲染(守首頁極簡)· 無 PnL/排名/粉絲數 · 暗金無紅綠 emoji。
//   落空數用 text-loss(柔紅 · 非號誌紅)誠實亮出來 —— 那正是跟「只曬贏」最不一樣的地方。
// ─────────────────────────────────────────────────────
export default function HomepageTableStrip({ summary }: { summary: TableSummary }) {
  if (summary.total === 0) return null;
  const { total, settled, win, lose, faces } = summary;
  const faceList = faces.slice(0, 4);
  return (
    <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-2 pb-2">
      <Link
        href="/table"
        aria-label={`今晚這桌 · ${total} 注賽前鎖死${
          settled > 0 ? ` · 已對帳 ${settled} 注(${win} 中、${lose} 沒中)· 看這桌` : " · 看這桌"
        }`}
        className="block border border-gold/30 bg-gold/[0.04] hover:border-gold/50 hover:bg-gold/[0.06] transition-colors px-4 py-3 group"
      >
        <div className="flex items-center gap-3">
          {faceList.length > 0 && (
            <div className="flex shrink-0">
              {faceList.map((h, i) => (
                <span
                  key={h}
                  className={`inline-flex rounded-[30%] ring-2 ring-navy ${i === 0 ? "" : "-ml-2"}`}
                >
                  <Avatar seed={h} size={26} />
                </span>
              ))}
            </div>
          )}
          <p className="text-bone text-sm leading-snug min-w-0">
            今晚這桌 · <span className="text-gold font-medium">{total}</span> 注賽前鎖死
          </p>
          <span className="ml-auto shrink-0 font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em]">
            看這桌 →
          </span>
        </div>
        <p className="mt-1.5 font-mono text-mute/60 text-[10px] sm:text-[11px] tracking-[0.1em]">
          {settled > 0 ? (
            <>
              已對帳 <span className="text-bone/80 tabular">{settled}</span> 注 ·{" "}
              <span className="text-gold/90 tabular">{win} 中</span> ·{" "}
              <span className="text-loss/85 tabular">{lose} 沒中</span> · 連輸的都留著
            </>
          ) : (
            <>賽後一筆一筆對帳 · 中的、沒中的都留著</>
          )}
        </p>
      </Link>
    </section>
  );
}
