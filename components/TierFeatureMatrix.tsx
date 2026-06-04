"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";

// ── ZONE 27 · Tier Feature Matrix ──────────────────────
// R111 W1 · per Tim 2026-05-25 critique:
//   「我們目前到底有哪些方案？您現在給我切換的方案很難使用 · 我怎麼
//    切換都沒動作 · 看不到變化！」
//   「最高階有哪些功能 · 最低階也顯現出來 · 只是不能讓他點擊 · 等等
//    這樣低階的人才知道可以解鎖哪些功能 · 誘惑他們花錢」
//
// 4 tier(anonymous · free · black-card · founders27)side-by-side
// feature matrix · 每個 cell 同 unlock-state visualization:
//   ✓ UNLOCKED · 可使用 · gold accent
//   🔒 LOCKED · padlock + 升級 tier label · muted + slight blur
//   — N/A · 此 feature 此 tier 不存在
//
// Brand IP fit:
//   - per /integrity rule · ENGINE features never paywalled → all 4 tiers
//     show ENGINE row as ✓ UNLOCKED · no locked padlock for engine
//   - per [[zone27-monetization-philosophy]] · IDENTITY features 在 BLACK
//     CARD + GOLD 才解鎖 · 此 component 把 identity-tier feature
//     locked-state visualize 給 lower-tier user · Loss Aversion + Goal
//     Gradient psychology · 不違反 brand IP(不藏 · 顯式 surface tier
//     unlock path)
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 球迷-grammar
//     Chinese feature labels · NOT engineering jargon
//
// Conversion psychology:
//   - Loss Aversion(Kahneman 1979)· 看到 locked feature = 知道 missing
//   - Goal Gradient(Hull 1932)· 接近 unlock 加速 motivation
//   - Curiosity Gap(Loewenstein 1994)· locked = 「what's inside?」
//   - 不 dark pattern · 顯式 price + unlock path · no FOMO countdown
//
// 不做 anti-pattern:
//   ✕ NO modal paywall blocking content
//   ✕ NO live FOMO「X people unlocked this today」
//   ✕ NO countdown timer to fake urgency
//   ✕ NO 「Try free for 7 days」 reverse-trial dark pattern
// ─────────────────────────────────────────────────────

type TierKey = "anonymous" | "free" | "black-card" | "founders27";

type Feature = {
  /** Feature label · 球迷 grammar · NOT engineering jargon */
  label: string;
  /** Optional inline detail · short caption under label */
  detail?: string;
  /** Per-tier unlock state · null = N/A in that tier */
  unlock: Record<TierKey, "unlocked" | "locked" | "na">;
};

const FEATURES: Feature[] = [
  {
    label: "全引擎可跑(10K 推演引擎模擬)",
    detail: "/lab · /lab/custom · per /integrity rule engine FREE 永遠",
    unlock: {
      anonymous: "unlocked",
      free: "unlocked",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "全 trust artifact 可讀",
    detail: "/audit · /methodology · /track-record · /steelman · /ethics",
    unlock: {
      anonymous: "unlocked",
      free: "unlocked",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "GitHub MIT 開源可 fork",
    detail: "全 model code public · 不藏 algorithm",
    unlock: {
      anonymous: "unlocked",
      free: "unlocked",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "模型重大迭代通知",
    detail: "Email · 不寄行銷信 · 隨時 reply UNSUBSCRIBE",
    unlock: {
      anonymous: "locked",
      free: "unlocked",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "GOLD 預售優先通知",
    detail: "付款通道開放時 · OPEN 先收到",
    unlock: {
      anonymous: "locked",
      free: "unlocked",
      "black-card": "unlocked",
      founders27: "na",
    },
  },
  {
    label: "賽事頁討論室發言 / 分享預測",
    detail: "/matches/[gameId] · 球迷 grammar 「明牌」 不導向莊家",
    unlock: {
      anonymous: "locked",
      free: "locked",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "每月 voting 影響引擎迭代方向",
    detail: "v0.4 + 未來 lens 優先級 · BLACK + GOLD vote",
    unlock: {
      anonymous: "locked",
      free: "locked",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "每週 Tim 工程筆記 full 版",
    detail: "閃光剪輯 · 失敗實驗 · 不公開部分 · 從 craft journal /now 抽出",
    unlock: {
      anonymous: "locked",
      free: "locked",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "創作者抽成",
    detail: "您發文 · ZONE 27 抽 · 業界收費老師 30-50% · 我們 ↓↓",
    unlock: {
      anonymous: "na",
      free: "na",
      "black-card": "unlocked",
      founders27: "unlocked",
    },
  },
  {
    label: "年度 access · 續訂價永遠鎖定(不自動續扣)",
    detail: "GOLD NT$ 2,700/年 手動續訂 · 月卡 / 季票永遠不會自動綁您",
    unlock: {
      anonymous: "locked",
      free: "locked",
      "black-card": "locked",
      founders27: "unlocked",
    },
  },
  {
    label: "BOTTOM 27 早鳥獨家虛擬資產",
    detail: "ZONE 27 ↔ BOTTOM 27 雙生品牌 cross-promotion · GOLD only",
    unlock: {
      anonymous: "locked",
      free: "locked",
      "black-card": "locked",
      founders27: "unlocked",
    },
  },
  {
    label: "恆美 × 伶 Kopi 紅茶招待 QR(台南)",
    detail: "實體 ecosystem 整合 · GOLD 持卡實體驗證",
    unlock: {
      anonymous: "locked",
      free: "locked",
      "black-card": "locked",
      founders27: "unlocked",
    },
  },
];

const TIER_META: Record<
  TierKey,
  {
    label: string;
    en: string;
    price: string;
    priceUnit: string;
    href: string | null;
    accent: string;
  }
> = {
  anonymous: {
    label: "匿名訪客",
    en: "ANONYMOUS",
    price: "NT$ 0",
    priceUnit: "您現在 default",
    href: null,
    accent: "text-mute",
  },
  free: {
    label: "OPEN",
    en: "OPEN",
    price: "NT$ 0",
    priceUnit: "永久免費 · email only",
    href: "/login",
    accent: "text-bone",
  },
  "black-card": {
    label: "BLACK",
    en: "BLACK",
    price: "NT$ 500",
    priceUnit: "每 31 天 · 手動 ECPay · 0 auto-renew",
    href: "/membership/black-card",
    accent: "text-bone",
  },
  founders27: {
    label: "GOLD",
    en: "GOLD",
    price: "NT$ 2,700",
    priceUnit: "/ 年 · GOLD 會員",
    href: "/founders",
    accent: "text-gold",
  },
};

const TIER_ORDER: TierKey[] = ["anonymous", "free", "black-card", "founders27"];

const STORAGE_KEY = "zone27_preview_tier";

function isTierKey(v: string): v is TierKey {
  return v === "anonymous" || v === "free" || v === "black-card" || v === "founders27";
}

export default function TierFeatureMatrix() {
  const [activeTier, setActiveTier] = useState<TierKey | null>(null);
  // R162 W1 · useMounted canonical hook · separated from localStorage side-effect
  const mounted = useMounted();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isTierKey(stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveTier(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleHighlight = (tier: TierKey) => {
    // R114 W1 · click already-active tier = clear preview(escape hatch UX
    // fix)· 之前 Tim 需 scroll 到 banner ✕ 才能 cancel · 現在 matrix click
    // 已 active = toggle off · 一致 toggle 行為 · 同 Linear/GitHub「click
    // active filter = clear」 pattern。
    if (activeTier === tier) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        return;
      }
      setActiveTier(null);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: null,
        })
      );
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, tier);
    } catch {
      return;
    }
    setActiveTier(tier);
    // Trigger PreviewModeBanner storage event in same tab(StorageEvent
    // only fires for OTHER tabs · same-tab needs reload OR custom event)。
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: tier,
      })
    );
  };

  return (
    <div className="border border-gold/30 bg-slate/20 p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-3 mb-5 flex-wrap">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em]"
        >
          / TIER FEATURE MATRIX · 4 tiers 並列
        </p>
        {mounted && activeTier && (
          <p className="font-mono text-loss/80 text-[10px] tracking-[0.3em]">
            ⚠ ACTIVE PREVIEW · {TIER_META[activeTier].label}
          </p>
        )}
      </div>

      <p className="text-mute text-sm leading-relaxed mb-6 max-w-3xl">
        4 tier 並列 feature matrix · 每個 cell 顯示該 tier 的 unlock 狀態。
        看到 🔒 表示「升級到此 tier 才解鎖」 ·{" "}
        <span className="text-gold">點 tier header</span>{" "}
        切換 active preview ·{" "}
        <span className="text-mute/85">再點 active tier = 取消 preview</span>
        (toggle 行為 · 不需 scroll 到 banner ✕)。
      </p>

      {/* ── Tier headers · clickable per-tier preview switch ── */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-3">
        {TIER_ORDER.map((tierKey) => {
          const meta = TIER_META[tierKey];
          const isActive = activeTier === tierKey;
          return (
            <button
              key={tierKey}
              type="button"
              onClick={() => handleHighlight(tierKey)}
              aria-pressed={isActive}
              className={`p-2 sm:p-3 border text-left transition-colors ${
                isActive
                  ? "border-gold bg-gold/15"
                  : "border-line/60 bg-slate/40 hover:border-gold/50 hover:bg-slate/60"
              }`}
            >
              <p
                lang="en"
                className={`font-mono text-[8px] sm:text-[9px] tracking-[0.25em] mb-1 ${meta.accent}`}
              >
                {meta.en}
              </p>
              <p
                className={`text-[10px] sm:text-xs font-light leading-tight mb-1 ${
                  isActive ? "text-gold" : "text-bone"
                }`}
              >
                {meta.label}
              </p>
              <p className="font-mono text-mute text-[9px] sm:text-[10px] tabular tracking-tight">
                {meta.price}
              </p>
              {/* R112 W1 · priceUnit hidden on mobile per 91px column 太擠 ·
                  Apple/Stripe responsive pattern · 完整 priceUnit only visible
                  at sm+(640px+)· mobile 訪客 still sees price · 詳情 in card-
                  level tier pages。 */}
              <p className="hidden sm:block font-mono text-mute/60 text-[7px] sm:text-[8px] tracking-[0.15em] mt-0.5">
                {meta.priceUnit}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Feature matrix ── R112 W1 · grid ratio 2fr label + 4 × minmax(0,1fr)
          tier cells · mobile 375px label gets 120px + 4 × 60px cells · 不 wrap
          中文 feature label 太多 · sm+ wider tier cells for full UNLOCKED/升級 text。 */}
      <div className="border border-line/40">
        {FEATURES.map((feature, idx) => (
          <div
            key={feature.label}
            className={`grid grid-cols-[2fr_repeat(4,minmax(0,1fr))] gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-3 text-[11px] sm:text-xs ${
              idx % 2 === 0 ? "bg-slate/10" : "bg-transparent"
            }`}
          >
            <div className="min-w-0">
              <p className="text-bone font-light leading-snug">
                {feature.label}
              </p>
              {feature.detail && (
                <p className="hidden sm:block font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.15em] leading-snug mt-0.5">
                  {feature.detail}
                </p>
              )}
            </div>
            {TIER_ORDER.map((tierKey) => {
              const state = feature.unlock[tierKey];
              return (
                <UnlockCell
                  key={tierKey}
                  state={state}
                  tierKey={tierKey}
                  isActive={activeTier === tierKey}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* R112 W2 · navigation hint · Tim 切完 tier 後問「切換都沒動作」 root cause:
          tier change 是 localStorage state · 需要 visit tier-aware pages 才看到 visible
          difference · /admin 此 matrix 是 comparison view 不會 self-change · 此 hint
          surface「verify visible difference 該去哪些 page」 · 同 GitHub Copilot
          dashboard「here's where to verify」 pattern。 */}
      <div className="mt-5 grid sm:grid-cols-3 gap-2">
        <Link
          href="/member"
          className="border border-gold/40 bg-slate/30 hover:bg-slate/50 hover:border-gold/60 px-3 py-2 transition-colors group"
        >
          <p className="font-mono text-gold/85 text-[9px] tracking-[0.3em] mb-1">
            → /member dashboard
          </p>
          <p className="text-mute group-hover:text-bone text-[11px] leading-snug transition-colors">
            tier-aware <strong className="text-bone">PaidTierLockedGrid</strong> · BLACK + GOLD unlock preview
          </p>
        </Link>
        <Link
          href="/membership/black-card"
          className="border border-gold/40 bg-slate/30 hover:bg-slate/50 hover:border-gold/60 px-3 py-2 transition-colors group"
        >
          <p className="font-mono text-gold/85 text-[9px] tracking-[0.3em] mb-1">
            → /membership/black-card
          </p>
          <p className="text-mute group-hover:text-bone text-[11px] leading-snug transition-colors">
            「引擎永久免費 · 您付的是身份」 inverse-paywall single-line(R111 W3)
          </p>
        </Link>
        <Link
          href="/founders"
          className="border border-gold/40 bg-slate/30 hover:bg-slate/50 hover:border-gold/60 px-3 py-2 transition-colors group"
        >
          <p className="font-mono text-gold/85 text-[9px] tracking-[0.3em] mb-1">
            → /founders
          </p>
          <p className="text-mute group-hover:text-bone text-[11px] leading-snug transition-colors">
            Patek-style 270 limited founder seat allocation · GOLD sales page
          </p>
        </Link>
      </div>

      {/* R113 W1 · 4 bookmarkable URL deep links · per Tim 2026-05-25「我要
          怎麼分別登入?」 · 答案:不是 4 個 login account(per [[zone27-payment-
          architecture]] manual ECPay · 沒 paid auth gate by design)· 而是 4
          個 URL bookmarkable preview deep link · click 直接進入該 tier
          preview · 同 Stripe Connect ?env=test / Linear team switcher pattern。 */}
      <div className="mt-6 border border-gold/30 bg-navy/40 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.35em]"
          >
            🔗 4 BOOKMARKABLE TIER PREVIEW DEEP LINKS
          </p>
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em]">
            click → instant tier preview · 不需先 navigate
          </p>
        </div>
        <p className="text-mute text-[12px] leading-relaxed mb-4">
          Bookmark 4 個 URL · 替代「4 個 login account」 mental model。
          Click 任一 → URL param 自動 set localStorage + 啟動 PreviewModeBanner ·
          無需先訪問 /admin。 適合 dogfood 切換體驗。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIER_ORDER.map((tierKey) => {
            const meta = TIER_META[tierKey];
            return (
              <Link
                key={tierKey}
                href={`/admin?tier=${tierKey}`}
                className="border border-line/60 bg-slate/40 hover:border-gold/60 hover:bg-slate/60 p-2 sm:p-3 transition-colors group text-left"
              >
                <p
                  lang="en"
                  className={`font-mono text-[9px] tracking-[0.25em] mb-1 ${meta.accent}`}
                >
                  {meta.en}
                </p>
                <p className="text-bone group-hover:text-gold text-[11px] font-light leading-tight mb-1 transition-colors">
                  {meta.label}
                </p>
                <p className="font-mono text-mute/70 text-[9px] tabular tracking-tight">
                  ?tier={tierKey}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* R113 W1 · security model honest disclosure · per Tim 2026-05-25
          「怎樣才不會被駭客或者懂程式的人也這樣破解?」 · per Disclosure +
          Pratfall axiom 顯式 surface 為什麼 preview 可 spoof 但 0 風險 ·
          同 Kerckhoffs' principle「security through obscurity = bad design」
          + Anthropic model card「我們 know our limits」 pattern。 */}
      <div className="mt-6 border border-loss/30 bg-loss/5 p-4 sm:p-5">
        <p
          lang="en"
          className="font-mono text-loss/90 text-[10px] tracking-[0.35em] mb-3"
        >
          🛡 SECURITY MODEL · 為什麼 preview 可 spoof 但 0 風險
        </p>
        <p className="text-mute text-[12px] leading-relaxed mb-3">
          <strong className="text-bone">Honest disclosure</strong>:
          tier preview 是 client-side localStorage state · 工程師 1 分鐘
          DevTools 即可 spoof(設{" "}
          <code className="font-mono text-bone bg-navy/60 px-1 py-0.5 text-[11px]">
            zone27_preview_tier = founders27
          </code>{" "}
          )。 任何 client-side state 都會 spoof · 同 Stripe Connect ?env=test ·
          同 Linear dev banner · 不是 bug 是 dev/QA designer tool。
        </p>
        <p className="text-mute text-[12px] leading-relaxed mb-3">
          <strong className="text-bone">為什麼 0 風險</strong>:
          ZONE 27 目前 0 paid features have been built · 「BLACK 月 voting」 ·
          「Tim 工程筆記 full」 · 「創作者抽成」 全沒 ship · spoof preview 後
          看到的只是 visual UI mockup · 沒實際 paid functionality 可以「unlock」 ·
          per `/integrity` rule #13 + `[[zone27-payment-architecture]]` manual
          ECPay flow · 沒 paid auth gate by design。 連 GOLD 編號 #001-#270
          都是 Tim 親手 add ledger · spoof preview 不會 add 您名字到 ledger。
        </p>
        <p className="text-mute text-[12px] leading-relaxed">
          <strong className="text-bone">未來 real defense</strong>:
          當 paid features 真實 ship(R200+ GOLD launch · BLACK
          recurring)· real gate 由{" "}
          <span className="text-bone">Supabase RLS(Row-Level Security)</span>
          {" + "}
          <span className="text-bone">JWT signed claims</span> 提供 · 同 industry
          standard SaaS auth pattern · hacker 無法 spoof 因為 Supabase secret key
          沒人知道(包括 Tim)· 不靠 client-side obscurity · per Kerckhoffs&apos;
          principle 「security through obscurity = bad design」。
        </p>
      </div>

      <p className="mt-5 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
        ⚓ 此 matrix 是「方法公開」 延伸到 tier-comparison layer · 不藏哪個
        feature 在哪個 tier · 不靠 dark pattern · 顯式 surface unlock path +
        security model · 每個 ✓ UNLOCKED + 🔒 LOCKED + — N/A + spoofable
        preview 都是 brand IP statement。
      </p>
    </div>
  );
}

// ── UnlockCell sub-component · cell 顯示 unlock/locked/N/A state ──
function UnlockCell({
  state,
  tierKey,
  isActive,
}: {
  state: "unlocked" | "locked" | "na";
  tierKey: TierKey;
  isActive: boolean;
}) {
  const tierMeta = TIER_META[tierKey];

  if (state === "unlocked") {
    return (
      <div
        className={`flex items-center justify-center min-h-[44px] border ${
          isActive
            ? "border-gold bg-gold/10"
            : "border-gold/30 bg-gold/5"
        }`}
        title={`${tierMeta.label} 解鎖此 feature`}
      >
        {/* R112 W1 · mobile-first responsive · icon-only on 375px · full text
            on sm+ · per Tim「走極簡風格 + Apple/Google」 mandate · 行寬 56px
            放不下「✓ UNLOCKED」 11 字 tracking-0.2em · 拆 icon + text。 */}
        <span
          className={`font-mono tabular text-base sm:text-[11px] tracking-[0.2em] ${
            isActive ? "text-gold" : "text-gold/85"
          }`}
          aria-label={`${tierMeta.label} 解鎖`}
        >
          <span aria-hidden="true">✓</span>
          <span className="hidden sm:inline ml-1">UNLOCKED</span>
        </span>
      </div>
    );
  }
  if (state === "locked") {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[44px] border ${
          isActive
            ? "border-mute/50 bg-slate/40"
            : "border-line/50 bg-slate/30"
        } gap-0.5`}
        title={`此 feature 在 ${tierMeta.label} 鎖住 · 升級到此 tier 才解鎖`}
      >
        <span
          aria-hidden="true"
          className="text-mute/60 text-base sm:text-[12px] leading-none"
        >
          🔒
        </span>
        {tierMeta.href && (
          <Link
            href={tierMeta.href}
            className="hidden sm:inline font-mono text-mute/70 hover:text-gold text-[9px] tracking-[0.18em] underline-offset-2 hover:underline transition-colors"
            aria-label={`升級到 ${tierMeta.label} 解鎖此 feature`}
          >
            升級 →
          </Link>
        )}
      </div>
    );
  }
  // N/A
  return (
    <div
      className={`flex items-center justify-center min-h-[44px] border ${
        isActive ? "border-line/30" : "border-line/20"
      } bg-transparent`}
      title={`此 feature 在 ${tierMeta.label} 不存在(N/A · 不適用)`}
    >
      <span className="font-mono text-mute/40 text-base sm:text-[10px] tabular">
        —
      </span>
    </div>
  );
}
