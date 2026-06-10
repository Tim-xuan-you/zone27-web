"use client";

import { useEffect, useState } from "react";

// ── ZONE 27 · 開賽倒數(把「賽前鎖死、改不了」從靜態宣稱變成會跳動的對帳張力)──────
// 🔴 反轉框架:賭場 / 明牌站的倒數 = 逼你買(製造 FOMO);我們的倒數 = 逼我們自己對帳 ——
//    倒數歸零,這條鎖死的線就拿去對現實、改不了。 同樣機制、相反意義。 放賽前收據的焦點
//    (最會被截圖外傳那張)· 卡在世界盃四年一次的注意力高峰。
//
// · client-only(讀時鐘)· mount 前回靜態開賽時間(SSR 一致 · 無 hydration 落差)。
// · prefers-reduced-motion → 不跳動,顯示靜態開賽時間(守品牌「不 frantic / 不閃爍」紀律)。
// · 開賽後自動翻「已開賽 · 待對帳」(viewing 中跨越開賽也優雅切 · 不需重整 · 比 10 分鐘 ISR 更即時)。
// · 暗金:數字金、標籤 mute、無 emoji、tabular。
// ─────────────────────────────────────────────────────

type Props = {
  /** 開賽 UTC ISO */
  kickoffISO: string;
  /** SSR / mount 前 / 降噪模式的靜態回退(台北 MM/DD HH:mm) */
  fallbackTPE: string;
};

const CAPTION = "倒數歸零,這條鎖死的線就拿去對現實 —— 我們改不了了。";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function KickoffCountdown({ kickoffISO, fallbackTPE }: Props) {
  const ko = Date.parse(kickoffISO);
  const [now, setNow] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (Number.isNaN(ko)) return;
    const mq =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    // 所有 setState 都推進 timer callback(不在 effect body 同步 setState · 避免 cascading-render ·
    // 同 SoccerBetStrip 房規)。 0ms 那拍立即先設一次 → 倒數即時出現、無感延遲。
    if (mq?.matches) {
      const t = setTimeout(() => {
        setReduced(true);
        setNow(Date.now()); // 讀一次判斷開賽了沒 · 不開 interval(不跳動)
      }, 0);
      return () => clearTimeout(t);
    }
    const tick = () => setNow(Date.now());
    const t0 = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(id);
    };
  }, [ko]);

  // 無法解析開賽時間 → 中性「待對帳」(極少數 · 不顯示假時間)。
  if (Number.isNaN(ko)) {
    return (
      <p className="font-mono text-mute tabular text-2xl sm:text-3xl font-light tracking-tight leading-none">
        待對帳
      </p>
    );
  }

  // mount 前 → 靜態開賽時間(SSR / 無 JS 也是一行有意義的事實 · 不跳動 · hydration 一致)。
  if (now === null) {
    return <StaticOpen fallbackTPE={fallbackTPE} caption />;
  }

  // 已開賽 → 誠實翻面(不假裝還在倒數 · 對齊收據「live = 待對帳」)。
  if (ko - now <= 0) {
    return (
      <p className="font-mono text-mute tabular text-2xl sm:text-3xl font-light tracking-tight leading-none">
        已開賽 · 待對帳
      </p>
    );
  }

  // 降噪模式 → 靜態開賽時間 + 對帳結語(不跳動 · 守不 frantic)。
  if (reduced) {
    return <StaticOpen fallbackTPE={fallbackTPE} caption />;
  }

  // 倒數中 → 跳動時鐘 + 對帳結語。
  const totalSec = Math.floor((ko - now) / 1000);
  const days = Math.floor(totalSec / 86400);
  const hh = pad(Math.floor((totalSec % 86400) / 3600));
  const mm = pad(Math.floor((totalSec % 3600) / 60));
  const ss = pad(totalSec % 60);

  return (
    <div>
      <p className="font-mono tabular leading-none">
        <span className="text-mute/70 text-[10px] tracking-[0.35em] mr-2">距開賽</span>
        {days > 0 && (
          <span className="text-gold text-2xl sm:text-3xl font-light">
            {days}
            <span className="text-mute text-base mx-1">天</span>
          </span>
        )}
        <span className="text-gold text-2xl sm:text-3xl font-light tracking-tight">
          {hh}:{mm}:{ss}
        </span>
      </p>
      <p className="mt-2 font-mono text-mute/60 text-[10px] sm:text-[11px] tracking-[0.15em] leading-relaxed">
        {CAPTION}
      </p>
    </div>
  );
}

function StaticOpen({ fallbackTPE, caption }: { fallbackTPE: string; caption?: boolean }) {
  return (
    <div>
      <p className="font-mono text-gold tabular text-2xl sm:text-3xl font-light tracking-tight leading-none">
        開賽 {fallbackTPE} <span className="text-mute text-base">TPE</span>
      </p>
      {caption && (
        <p className="mt-2 font-mono text-mute/60 text-[10px] sm:text-[11px] tracking-[0.15em] leading-relaxed">
          {CAPTION}
        </p>
      )}
    </div>
  );
}
