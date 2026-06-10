import Link from "next/link";
import Avatar from "@/components/Avatar";
import { fmtLockTaipei, type Trophy } from "@/lib/trophies";

// ── ZONE 27 · 戰功卡格(純展示 · server-safe · 兩處共用)──────────────────
// /member/collection(本人)+ /u/[code](公開檔案)共用同一張卡。 含輸照掛(✓✕同重量)·
// 「逆風」徽章=贏過引擎 · 每卡連 /receipts/[receiptId] · 暗金無紅綠 render 無 emoji(✓/✕ 例外)。
// 空陣列 → 回 null(呼叫端各自決定空狀態)。
// ─────────────────────────────────────────────────────

export default function TrophyGrid({
  trophies,
  showSummary = true,
}: {
  trophies: Trophy[];
  /** 顯示上方「N 張 · ✓X ✕Y · Z 張逆風」總覽(本人收藏牆用 · 公開檔案可關) */
  showSummary?: boolean;
}) {
  if (trophies.length === 0) return null;

  const hits = trophies.filter((t) => t.hit).length;
  const misses = trophies.length - hits;
  const upsets = trophies.filter((t) => t.upset).length;

  return (
    <div>
      {showSummary && (
        <p className="text-mute/90 text-sm leading-relaxed mb-4">
          <span className="font-mono text-bone tabular">{trophies.length}</span> 張戰功卡 ·{" "}
          <span className="font-mono text-gold tabular">✓{hits}</span>{" "}
          <span className="font-mono text-loss/85 tabular">✕{misses}</span>
          {upsets > 0 && (
            <>
              {" "}
              · 其中 <span className="font-mono text-gold tabular">{upsets}</span> 張
              <span className="text-gold">逆風贏過引擎</span>
            </>
          )}
          <span className="block mt-1 font-mono text-mute/55 text-[10px] tracking-[0.12em]">
            每張都賽前鎖死、改不了 —— 收的是自己的眼光,不是中獎彩券。
          </span>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {trophies.map((t) => (
          <TrophyCard key={t.card.id} t={t} />
        ))}
      </div>
    </div>
  );
}

function TrophyCard({ t }: { t: Trophy }) {
  const { card } = t;
  const pickName =
    t.pick === "home" ? card.home : t.pick === "away" ? card.away : "和局";
  const verdictColor = t.hit ? "text-gold" : "text-loss/85";
  const verdictBorder = t.hit ? "border-gold/40" : "border-loss/40";
  const lock = fmtLockTaipei(t.ts);
  return (
    <Link
      href={`/receipts/${card.id}`}
      className={`block border ${verdictBorder} bg-slate/30 hover:bg-slate/40 transition-colors p-3.5 group`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-gold/70 text-[9px] tracking-[0.25em]">{card.tag}</span>
        <span className="font-mono text-mute/55 text-[9px] tracking-[0.2em] tabular shrink-0">
          {card.dateLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5 mb-2.5">
        <span className="flex items-center gap-1.5 min-w-0">
          <Avatar seed={card.home} glyph={card.homeGlyph} color={card.homeColor} size={20} />
          <span className="text-bone text-sm font-light tracking-tight truncate">{card.home}</span>
        </span>
        <span className="font-mono text-mute/40 text-[9px] shrink-0">vs</span>
        <span className="flex items-center gap-1.5 min-w-0 justify-end">
          <span className="text-bone text-sm font-light tracking-tight truncate text-right">
            {card.away}
          </span>
          <Avatar seed={card.away} glyph={card.awayGlyph} color={card.awayColor} size={20} />
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line/40 pt-2">
        <span className="font-mono text-mute/75 text-[10px] tracking-[0.08em]">
          押 <span className="text-bone">{pickName}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {t.upset && (
            <span className="font-mono text-gold/90 text-[8px] tracking-[0.15em] border border-gold/45 px-1 py-[2px] leading-none">
              逆風 ✓
            </span>
          )}
          <span className={`font-mono ${verdictColor} text-[11px] tabular`}>
            {t.hit ? "✓ 命中" : "✕ 落空"}
          </span>
        </span>
      </div>

      {lock && (
        <p className="mt-2 font-mono text-mute/45 text-[8px] tracking-[0.12em] tabular group-hover:text-gold/70 transition-colors">
          鎖定於 {lock} · 收據 →
        </p>
      )}
    </Link>
  );
}
