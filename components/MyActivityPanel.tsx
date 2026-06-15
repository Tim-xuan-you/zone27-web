import Link from "next/link";
import type { MyCommentRow } from "@/lib/creator-activity-server";

// ── ZONE 27 · 你的足跡 · 回過的留言──────────────────────────────────────
// Tim 2026-06-05 dogfood:「回了留言找不到在哪 · 賽事太多!」 賭場讓你做完即蒸發;
// 帳戶讓你說過的話有個家、一鍵回到那串。
// ⚠ R239 Defector pivot:「買過的分析」書架已隨點數錢包一起收掉(Tim 拍板移除錢包 · 分析免費不賣)·
//   這一塊現在只留「回過的留言」足跡。
//
// 🍎 排版:三樓 status 配角 · 框 mute 不搶校準卡金色主角 · 沒回過自動隱藏。
// 純展示 server component · 資料來自 lib/creator-activity-server(0016 RPC)。
// ─────────────────────────────────────────────────────

// ISO → 台北「MM/DD」· 純伺服器端 · 壞值回 ""。
function mmdd(iso: string): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(t));
}

function snippet(s: string, n = 42): string {
  // 收掉換行/連續空白 → 留言含換行也不會把單行排版撐爆
  const t = (s ?? "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

export default function MyActivityPanel({
  comments,
}: {
  comments: MyCommentRow[];
}) {
  // 沒回過 → 不顯示(不擺空殼)
  if (comments.length === 0) return null;

  return (
    <section className="mt-8">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        你的足跡
      </p>
      <div className="bg-slate/40 border border-line/50 p-5 sm:p-6 flex flex-col gap-6">
        {/* ── 你回過的留言 · 你的足跡(說過的話找得回 · 一鍵回到那串)────── */}
        {comments.length > 0 && (
          <div>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] mb-3">
              你回過的留言 · <span className="text-mute">{comments.length}</span>
            </p>
            <div className="flex flex-col border-t border-line/40">
              {comments.map((c) => {
                const date = mmdd(c.createdAt);
                return (
                  <Link
                    key={c.commentId}
                    href={`/matches/${c.matchId}#post-${c.postId}`}
                    className="flex items-baseline justify-between gap-3 py-2.5 border-b border-line/40 last:border-b-0 group"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="text-bone text-sm leading-snug group-hover:text-gold transition-colors">
                        {snippet(c.body)}
                      </span>
                      <span className="block font-mono text-mute/60 text-[10px] tracking-[0.15em] mt-0.5">
                        回在 {snippet(c.postTitle, 18) || "一篇分析"}
                        {date ? ` · ${date}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-gold/55 group-hover:text-gold text-[10px] tracking-[0.2em] transition-colors">
                      回去 →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
