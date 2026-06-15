"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/lib/use-mounted";

// ── ZONE 27 · Admin Tier Switcher ───────────────────────
// Round 36 W-D · Tim founder dogfood designer dev tool requirement:
// 切換 4 個 tier 身份 · 看 UI 在每個 tier 怎樣 render · 「功能有沒有到位」。
//
// 4 tier(對齊 /membership 4-tier ladder):
//   - anonymous · 匿名訪客 · 未登入
//   - free · OPEN · 已登入 · 終身免費
//   - black-card · BLACK · NT$ 500/31 天(每 31 天手動 ECPay · 不自動續扣 per rule #13)
//   - founders27 · GOLD · NT$ 2,700/年
//
// localStorage-based · 跟 PreviewModeBanner 共享 zone27_preview_tier key。
// Tim 切換 → reload → 全 page client-side tier-aware components 切換
// (server-rendered content 不變 · 為 Phase 2 cookie-based 升級保留)。
//
// /admin only · noindex page · 不 expose to anonymous · 即使 expose 也只
// 影響 visual preview · 不破真實 auth state。
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_preview_tier";

const TIERS: { value: string; label: string; body: string; price: string }[] = [
  {
    value: "anonymous",
    label: "匿名訪客",
    body: "未登入 · 全引擎可跑 · 5 unlocks 隱藏",
    price: "NT$ 0",
  },
  {
    value: "free",
    label: "OPEN",
    body: "已登入 · 5 unlocks 解鎖 · 終身免費",
    price: "NT$ 0",
  },
  {
    value: "black-card",
    label: "BLACK",
    body: "每 31 天手動 ECPay · 6 unlocks(Engine + Lens + 討論 + 金環 + voting + 筆記)· 不自動續扣",
    price: "NT$ 500/31 天",
  },
  {
    value: "founders27",
    label: "GOLD",
    body: "年度 · 全 unlocks + 搶先試 + 投票權 + 未來所有 lenses/engines 解鎖",
    price: "NT$ 2,700/年",
  },
];

export default function AdminTierSwitcher() {
  const [current, setCurrent] = useState<string | null>(null);
  // R162 W1 · useMounted canonical hook · separated from localStorage side-effect
  const mounted = useMounted();

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(localStorage.getItem(STORAGE_KEY));
    } catch {
      // ignore
    }
  }, []);

  const handleSet = (tier: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, tier);
    } catch {
      return;
    }
    setCurrent(tier);
    window.location.reload();
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
    setCurrent(null);
    window.location.reload();
  };

  if (!mounted) {
    return (
      <div className="bg-slate/40 border border-gold/40 p-5">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
        >
          / TIER SWITCHER · 載入中 ...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate/40 border border-gold/40 glow-soft p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] sm:text-[11px] tracking-[0.4em]"
        >
          / TIER SWITCHER · designer preview mode
        </p>
        {current && (
          <p className="font-mono text-loss/80 text-[10px] tracking-[0.3em] tabular">
            ⚠ ACTIVE · {current}
          </p>
        )}
      </div>

      {/* R60 W-C · Tim 第 3 次 canary fire 同問題「設計者怎麼切換查看?」 ·
          founder dogfood discoverability gap · per [[feedback-founder-dogfood-canary]]
          第 1 次 trust · 第 3 次 must surface 物理 fix。 keyboard shortcut 在
          PreviewModeBanner 已存在 R47 W-B · 但 banner 沒 active 之前 invisible。
          此 block 在 /admin AdminTierSwitcher visible-永久 · Tim 一進來就看到。 */}
      <div className="mb-5 border border-gold/40 bg-gold/5 px-4 py-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.3em] mb-2"
        >
          ⌨ KEYBOARD SHORTCUT · 從任何 page 切換
        </p>
        <p className="text-bone text-[13px] leading-relaxed">
          按{" "}
          <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
            Cmd
          </kbd>
          {" "}+{" "}
          <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
            Shift
          </kbd>
          {" "}+{" "}
          <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
            P
          </kbd>
          {" "}(Mac)或{" "}
          <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
            Ctrl
          </kbd>
          {" "}+{" "}
          <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
            Shift
          </kbd>
          {" "}+{" "}
          <kbd className="font-mono text-gold bg-navy/60 border border-gold/40 px-1.5 py-0.5 text-[11px] tracking-tight">
            P
          </kbd>
          {" "}(Win)= 從任何頁面開啟 preview mode banner · 預設「匿名訪客」
          身份 · 再點 banner 4 tier button 切換 · 不需要登入 · 不需要回此頁。
        </p>
      </div>

      <p className="text-mute text-sm leading-relaxed mb-5">
        切換 4 個 tier 身份 · 整站 client-side tier-aware components 跟著切。
        Effect:localStorage override · banner sticky-top 顯示 mode · server-rendered
        content 不變(為 Phase 2 cookie-based 升級保留)。 您 click 任 tier
        立即切換 + reload · 再點 banner「取消」 回真實 session。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {TIERS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => handleSet(t.value)}
            className={`text-left p-4 border transition-colors ${
              current === t.value
                ? "border-gold bg-gold/10 text-gold"
                : "border-line/60 text-mute hover:border-gold/40 hover:bg-gold/5"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <p className="font-mono text-bone text-[11px] sm:text-xs tracking-[0.3em]">
                {t.label}
              </p>
              <p className="font-mono text-gold/80 text-[10px] tracking-[0.25em] tabular">
                {t.price}
              </p>
            </div>
            <p className="text-mute/85 text-[11px] leading-relaxed">{t.body}</p>
            {current === t.value && (
              <p className="font-mono text-gold text-[9px] tracking-[0.3em] mt-2">
                ✓ ACTIVE PREVIEW
              </p>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="font-mono text-loss/80 hover:text-loss text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
          >
            ✕ Reset · 回真實 session
          </button>
        </div>
      )}

      <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mt-5 leading-relaxed">
        ▸ Phase 1 MVP localStorage · client-side visual preview only ·
        sufficient for design verification
        <br />
        ▸ Phase 2 future · cookie-based + server-side tier-aware rendering
        (BLACK-only thread / Lens variety unlock / etc.)
        <br />
        ▸ 切到 BLACK / GOLD 看 /member · /membership ·
        /matches/[gameId] · 全 tier-aware components 跟著切
      </p>
    </div>
  );
}
