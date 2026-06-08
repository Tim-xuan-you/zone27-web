"use client";

import { useState } from "react";

// ── ZONE 27 · 公開戰績運動切換(等寬 segmented control)─────────────────
// 等寬兩段 = 等尊嚴:每個運動拿到「整個內容舞台」,不再是棒球厚段壓著足球薄片
// (堆疊會讓資料少的運動結構性地讀成殘渣)。 server 直出兩 view 完整 DOM,client 只切
// CSS display(守 ISR + SSR 一致 · 無 hash/無 localStorage → 不污染 canonical · 關 JS 兩 view 皆顯示)。
// 預設 baseball(成熟、最可信的 view)。 暗金、無紅綠、無 emoji。
// ─────────────────────────────────────────────────────

export default function SportToggle({
  baseball,
  soccer,
}: {
  baseball: React.ReactNode;
  soccer: React.ReactNode;
}) {
  const [sport, setSport] = useState<"baseball" | "soccer">("baseball");

  return (
    <>
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-4 pb-8">
        <div
          role="tablist"
          aria-label="選擇運動"
          className="grid grid-cols-2 gap-1 p-1 bg-slate/40 border border-line/70"
        >
          <SegBtn
            active={sport === "baseball"}
            onClick={() => setSport("baseball")}
            label="棒球"
            sub="CPBL + MLB · 已對帳"
          />
          <SegBtn
            active={sport === "soccer"}
            onClick={() => setSport("soccer")}
            label="足球"
            sub="世界盃 · 6/11 開賽"
          />
        </div>
      </section>

      {/* 兩 view 都在 DOM(server 直出)· 只切 display · 無 JS 時兩者皆顯示(graceful) */}
      <div className={sport === "baseball" ? "" : "hidden"}>{baseball}</div>
      <div className={sport === "soccer" ? "" : "hidden"}>{soccer}</div>
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
