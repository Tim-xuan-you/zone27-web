"use client";

import { useState, useSyncExternalStore } from "react";

// ── ZONE 27 · 公開戰績運動切換(等寬 segmented control)─────────────────
// 等寬兩段 = 等尊嚴:每個運動拿到「整個內容舞台」,不再是棒球厚段壓著足球薄片
// (堆疊會讓資料少的運動結構性地讀成殘渣)。 server 直出兩 view 完整 DOM,client 只切
// CSS display(守 ISR + SSR 一致 · 無 hash/無 localStorage → 不污染 canonical · 關 JS 兩 view 皆顯示)。
// 預設 baseball(成熟、最可信的 view)。 暗金、無紅綠、無 emoji。
// ─────────────────────────────────────────────────────

// 深連結 #soccer → 開足球視圖的水合安全讀取(R239)。
// 走 useSyncExternalStore:server / 水合期一律回 getServerSnapshot("baseball"),
// 水合完成後 React 才讀 client 端 hash —— 這是官方對「server/client 不同值」的解,
// 不觸發 hydration mismatch、也不用在 effect 內同步 setState(過 react-hooks/set-state-in-effect)。
type Sport = "baseball" | "soccer" | "tennis";
function subscribeHash(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
function getHashSport(): Sport {
  if (typeof window === "undefined") return "baseball";
  const h = window.location.hash;
  return h === "#soccer" ? "soccer" : h === "#tennis" ? "tennis" : "baseball";
}
// SSR / 水合的回退 = 預設棒球(無 hash context · 守 canonical 不分歧)。
function getServerSport(): Sport {
  return "baseball";
}

export default function SportToggle({
  baseball,
  soccer,
  tennis,
  containerClass = "mx-auto max-w-5xl w-full px-6 sm:px-10 pt-4 pb-8",
}: {
  baseball: React.ReactNode;
  soccer: React.ReactNode;
  /** 網球(選填)· 有資料才傳 → 三段;沒傳 → 維持兩段(/ladder、/calibration 等不變)。 */
  tennis?: React.ReactNode;
  /** 外層定位/寬度(預設給寬頁 · 窄頁如 /ladder 傳無 max-w/px 的縮版,避免雙重 padding) */
  containerClass?: string;
}) {
  // R234 · 從足球賽事板的「引擎公開戰績」條進來會帶 #soccer → 直接開足球視圖。
  // hashSport = 深連結來源(SSR 一律 baseball · 水合後才讀 hash · 訂 hashchange 跟著切)。
  const hashSport = useSyncExternalStore(subscribeHash, getHashSport, getServerSport);
  // 手動覆寫:任一按鈕點過後,使用者的選擇優先於網址 hash(深連結只決定初始視圖)。
  const [override, setOverride] = useState<Sport | null>(null);
  // 沒傳網球時,#tennis 落回棒球(避免空視圖)。
  const sport =
    override ?? (hashSport === "tennis" && !tennis ? "baseball" : hashSport);

  return (
    <>
      <section className={containerClass}>
        <div
          role="tablist"
          aria-label="選擇運動"
          className={`grid ${tennis ? "grid-cols-3" : "grid-cols-2"} gap-1 p-1 bg-slate/40 border border-line/70`}
        >
          <SegBtn
            active={sport === "baseball"}
            onClick={() => setOverride("baseball")}
            label="棒球"
            sub="CPBL + MLB · 已對帳"
          />
          <SegBtn
            active={sport === "soccer"}
            onClick={() => setOverride("soccer")}
            label="足球"
            sub="世界盃 6/12–7/20 · 台北時間"
          />
          {tennis && (
            <SegBtn
              active={sport === "tennis"}
              onClick={() => setOverride("tennis")}
              label="網球"
              sub="溫網會外賽 · 草地"
            />
          )}
        </div>
      </section>

      {/* 各 view 都在 DOM(server 直出)· 只切 display · 無 JS 時皆顯示(graceful) */}
      <div className={sport === "baseball" ? "" : "hidden"}>{baseball}</div>
      <div className={sport === "soccer" ? "" : "hidden"}>{soccer}</div>
      {tennis && <div className={sport === "tennis" ? "" : "hidden"}>{tennis}</div>}
    </>
  );
}

function SegBtn({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-3 text-center transition-colors ${
        active
          ? "bg-gold/15 border border-gold/50"
          : "border border-transparent hover:bg-slate/60"
      }`}
    >
      <span className={`block text-sm ${active ? "text-gold" : "text-bone"}`}>{label}</span>
      <span className="block font-mono text-mute/70 text-[9px] tracking-[0.2em] mt-1">
        {sub}
      </span>
    </button>
  );
}
