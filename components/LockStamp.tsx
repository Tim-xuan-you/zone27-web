// ── ZONE 27 · 賽前鎖定戳記(把最強的「抄不走」信任訊號從小字升成招牌徽章)──────────
// 全球研究(burned bettor 信任機制)結論:一個「在結果還沒發生前就公開、且事後改不了」的
// 承諾 = 唯一造假做不到的 costly signal(贏單截圖、刪輸文都偽造得了,賽前鎖定時戳不行)。
// 之前這個時戳只是收據 REF 帶裡的一行小字 —— 把全站最強的差異化武器藏起來了。 升成招牌徽章:
// 幾何鎖頭 SVG(無 emoji 例外)+ 鎖定時間 + 「開賽前寫死、改不了」一句白話。
//
// 🔴 紅線:幾何 SVG(非 emoji)· 冷金 · 無紅綠 · 純中文 · 不指名對手(只講我們做了什麼)。
// 競爭力學「先競後拙」:擺在引擎線(競:看得到我們開的值)之後 → 鎖定徽章(拙/誠實:且改不了)。
// ─────────────────────────────────────────────────────

export default function LockStamp({ lockedAtTPE }: { lockedAtTPE: string }) {
  if (!lockedAtTPE) return null;
  return (
    <div className="flex items-center gap-3 border border-gold/35 bg-gold/[0.04] px-4 py-3">
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold shrink-0"
        aria-hidden="true"
      >
        <rect x="5" y="11" width="14" height="9" rx="1.5" />
        <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" />
        <path d="M12 14.5 V17" />
      </svg>
      <div className="min-w-0">
        <p className="font-mono text-gold/90 text-[11px] sm:text-xs tracking-[0.15em] tabular">
          賽前鎖定 · {lockedAtTPE} TPE
        </p>
        <p className="mt-1 font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.1em] leading-relaxed">
          開賽前就寫死的線 · 結果還沒發生時就鎖了 · 賽後一個字都改不了
        </p>
      </div>
    </div>
  );
}
