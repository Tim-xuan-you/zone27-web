"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  readBellCache,
  writeBellCache,
  markBellSeen,
} from "@/lib/settlement-bell-cache";

// ── ZONE 27 · Nav 結算鈴鐺(跨頁回訪觸發 · R230 #1 大工程的不卡網域那半)──────────
// 缺口:會員賽前鎖了一手就離開,picks 在他不在時結算了 —— 但除了 /member,站上**任何頁面
// 都沒有訊號**告訴他「去對帳」。 沒 email / 沒 push 的現在,這顆鈴鐺就是唯一全站可見的
// 「你有新結算」回訪鉤(R208 回訪卡只在 /member · 這顆把它升成跨頁訊號)。
//
// R207 鐵律:Nav 是 server component,render 時不可 fetch(uncached promise 會讓 client
// 頁打字失焦)。 所以這顆是 client island:mount 後才打 /api/settlements 拿數字,不擋 Nav 的
// 同步 render。 anon → 完全不打(getSession 探一下)。 sessionStorage 短快取(90s)→ SPA
// 連續換頁不重打。
//
// 🔴 紀律語氣,不是賭場:
//   · 金色不是紅色(品牌無紅綠)· 不閃爍、不跳動、不催。 數字 = 待你順手對帳的場數,不是「快回來!」。
//   · 命中、落空同權重 —— 鈴鐺只說「有 N 場結算了」,不說輸贏(輸贏在收件匣裡含輸照攤)。
//   · 0 場 / 未登入 / 讀失敗 → 不顯示(graceful · 不發空頭)。
// 快取 / key 收進 lib/settlement-bell-cache(對過帳的兩個面共用 · 不漂移)。
// ─────────────────────────────────────────────────────

export default function SettlementBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 永遠先探 session(本地讀 · 不打網路)→ 登出/anon 一律清快取 + 不顯示
        // (修「登入時拿到數字、登出後徽章還殘留 90s」的跨狀態自打臉)。
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          markBellSeen(); // 快取歸零
          if (!cancelled) setCount(0);
          return;
        }
        // 已登入:快取新鮮 → 直接用,不打 API(SPA 連換頁不重打 · 貴的是 /api 那趟)。
        const cached = readBellCache();
        if (cached !== null) {
          if (!cancelled) setCount(cached);
          return;
        }
        const res = await fetch("/api/settlements", {
          headers: { accept: "application/json" },
        });
        if (!res.ok) return;
        const json = (await res.json()) as { newCount?: unknown };
        const n =
          typeof json.newCount === "number" && json.newCount > 0
            ? json.newCount
            : 0;
        writeBellCache(n);
        if (!cancelled) setCount(n);
      } catch {
        // 網路 / Supabase 不可達 → 靜默 · 鈴鐺維持隱藏
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (count <= 0) return null;

  const shown = count > 9 ? "9+" : String(count);
  const aria = `${count} 場押注在你不在時結算了 · 點開結算收件匣對帳`;

  // 金色實心小徽章(navy 數字)· 跟會員金 CTA 同語彙 · 醒目但不報警(無紅、無閃)。
  return (
    <Link
      href="/member/inbox"
      aria-label={aria}
      title="結算收件匣"
      /* 隱形 tap padding:視覺徽章仍 20px,但 hit area 撐到 ~40px(p 補、-m 抵銷 → 零位移)·
         對齊行動版 Nav 其它鈕的 ≥ 44px tap target 紀律(WCAG 2.5.5)。 */
      className="inline-flex items-center shrink-0 p-2.5 -m-2.5"
    >
      <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-gold text-navy font-mono text-[10px] font-semibold tabular leading-none transition-opacity hover:opacity-80">
        {shown}
      </span>
    </Link>
  );
}
