import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /roadmap Dynamic OG ───────────────────────
// 當有人把 https://zone27-web.vercel.app/roadmap 貼出去 · 預覽顯示
// 一張「公開路線圖 · 含永遠不做清單」snapshot。
//
// 設計關鍵:三段 LOCKED · EXPLORING · EXPLICIT NO 等大陳列。
// 重點 punchline:「公開說 NO 比公開說 YES 更難」— 對標 Anthropic
// Responsible Scaling Policy 的 transparency signal。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · /roadmap · 公開路線圖 · LOCKED / EXPLORING / BRAND BOUNDARIES 三段";

export default async function RoadmapOgImage() {
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
            / ROADMAP
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
            PUBLIC ROADMAP · 公開路線圖
          </span>
          <span
            style={{
              fontSize: 56,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            接下來在做什麼 · 在評估什麼 ·
          </span>
          <span
            style={{
              fontSize: 56,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 4,
              display: "flex",
              textShadow: "0 0 60px rgba(212,175,55,0.25)",
            }}
          >
            不變的鐵律是什麼
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 40,
            marginBottom: 32,
          }}
        />

        {/* ── 3-stage status row · equal visual weight ─ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
          }}
        >
          <Stage
            label="LOCKED"
            zh="時程 + 邏輯都已定"
            tone="full"
          />
          <Stage
            label="EXPLORING"
            zh="在研究的 · 可能 NO"
            tone="dim"
          />
          <Stage
            label="BOUNDARIES"
            zh="不變的鐵律 · 品牌守則"
            tone="line"
          />
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
            Saying NO publicly is harder than saying YES.
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
            /roadmap
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-component ────────────────────────────────────

function Stage({
  label,
  zh,
  tone,
}: {
  label: string;
  zh: string;
  tone: "full" | "dim" | "line";
}) {
  const dotColor =
    tone === "full"
      ? BRAND.gold
      : tone === "dim"
      ? "rgba(212,175,55,0.45)"
      : "rgba(138,147,168,0.6)";
  const textColor =
    tone === "full"
      ? BRAND.gold
      : tone === "dim"
      ? "rgba(212,175,55,0.7)"
      : "rgba(138,147,168,0.85)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          background: dotColor,
          display: "flex",
        }}
      />
      <span
        style={{
          color: textColor,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "0.15em",
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 14,
          letterSpacing: "0.05em",
          textAlign: "center",
          display: "flex",
        }}
      >
        {zh}
      </span>
    </div>
  );
}
