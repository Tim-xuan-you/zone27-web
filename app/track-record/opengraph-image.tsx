import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import { getFinalizedMatches, getCalibration } from "@/lib/matches";

// ── ZONE 27 · /track-record Dynamic OG ──────────────────
// 當有人把 https://zone27.com.tw/track-record 貼到 LINE / FB,
// 不顯示通用品牌卡,而是顯示一張「公開戰績 ledger」snapshot —
// PROVED ✓ 跟 DIVERGED ✕ 等大等亮地擺一起 · 第一秒就傳達「這品牌
// 把 miss 跟 hit 公開放在同一張卡」。
//
// 設計原則:
//   - Bloomberg-terminal aesthetic · 不是 marketing
//   - PROVED 跟 DIVERGED 用相同字體大小 · 不刻意 hide miss
//   - Headline 強調品牌定位 · 不是 N 數
//   - 反向 marketing punchline:「Most prediction sites hide their misses.」
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · 公開戰績 ledger · PROVED vs DIVERGED 等大列出 · 不藏 miss";

// OG glyph hardening · ImageResponse 的 default system font 不一定
// 包含 ✓ ✕ unicode · build 時會跑 dynamic font download 然後 fallback
// 成方塊。對於 OG 卡片這種一次性截圖,改用純文字 PROVED / DIVERGED
// 標籤(不帶符號)更穩。HeroLiveCard 跟 /track-record page 仍可用
// ✓ ✕,因為訪客瀏覽器系統字型包含這些 glyphs。

export default async function TrackRecordOgImage() {
  const finalized = getFinalizedMatches();
  const proved = finalized.filter((m) => getCalibration(m) === "proved").length;
  const diverged = finalized.filter(
    (m) => getCalibration(m) === "diverged"
  ).length;
  const total = finalized.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.10), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* ── TOP ROW · brand + path ─────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                fontSize: 24,
                color: BRAND.gold,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              ZONE
            </span>
            <span
              style={{
                fontSize: 24,
                color: BRAND.bone,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              27
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,175,55,0.7)",
              letterSpacing: "0.35em",
              display: "flex",
            }}
          >
            / TRACK-RECORD
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 12,
              display: "flex",
            }}
          >
            PUBLIC TRACK RECORD
          </span>
          <span
            style={{
              fontSize: 60,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            引擎預測 vs 實際
          </span>
          <span
            style={{
              fontSize: 20,
              color: "rgba(245,242,234,0.65)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              marginTop: 12,
              display: "flex",
            }}
          >
            PROVED 與 DIVERGED 等大等亮地列出 · 不刪、不修飾、不過濾
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 36,
            marginBottom: 28,
          }}
        />

        {/* ── LEDGER STATS · 3-column equal-weight ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
          }}
        >
          <StatBlock
            n={proved}
            label="PROVED · 引擎命中"
            tone="gold"
          />
          <StatBlock
            n={diverged}
            label="DIVERGED · 引擎落空"
            tone="loss"
          />
          <StatBlock n={total} label="TOTAL · 已收錄" tone="bone" />
        </div>

        {/* ── BOTTOM · differentiator punchline ──────── */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(245,242,234,0.6)",
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            Most prediction platforms hide their misses. We file them.
          </span>
          <span
            style={{
              fontSize: 14,
              color: BRAND.gold,
              letterSpacing: "0.3em",
              fontWeight: 500,
              display: "flex",
            }}
          >
            /track-record
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function StatBlock({
  n,
  label,
  tone,
}: {
  n: number;
  label: string;
  tone: "gold" | "loss" | "bone";
}) {
  const color =
    tone === "gold" ? BRAND.gold : tone === "loss" ? BRAND.loss : BRAND.bone;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          color,
          fontSize: 96,
          fontWeight: 300,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          display: "flex",
        }}
      >
        {n}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 13,
          letterSpacing: "0.22em",
          textAlign: "center",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
