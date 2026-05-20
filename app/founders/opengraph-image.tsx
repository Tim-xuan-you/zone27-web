import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
  FOUNDERS_NEXT,
  formatBadge,
} from "@/lib/founders-stats";

// ── ZONE 27 · /founders Dynamic OG ─────────────────────
// 當有人把 https://zone27-web.vercel.app/founders 貼到 LINE/FB,
// 顯示的不是通用品牌卡,而是「FOUNDERS · 27 · 270 lifetime」
// 銷售情境卡 — 直接是 sales pitch in image form。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Founders 27 · Lifetime Membership";

export default async function FoundersOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 70,
          position: "relative",
        }}
      >
        {/* TOP LEFT: brand */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 70,
            display: "flex",
            gap: 14,
          }}
        >
          <span
            style={{
              fontSize: 26,
              color: BRAND.gold,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            ZONE
          </span>
          <span
            style={{
              fontSize: 26,
              color: BRAND.bone,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            27
          </span>
        </div>

        {/* TOP RIGHT: tier */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 70,
            fontSize: 16,
            color: "rgba(212,175,55,0.7)",
            letterSpacing: "0.35em",
            display: "flex",
          }}
        >
          FOUNDERS · 27
        </div>

        {/* CENTER */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Tiny eyebrow */}
          <div
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 20,
              display: "flex",
            }}
          >
            LIMITED EDITION · NEVER REOPENS
          </div>

          {/* 270 big numeral */}
          <div
            style={{
              fontSize: 220,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textShadow: "0 0 80px rgba(212,175,55,0.35)",
              display: "flex",
            }}
          >
            {FOUNDERS_TOTAL}
          </div>

          <div
            style={{
              fontSize: 32,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 6,
              display: "flex",
            }}
          >
            LIFETIME MEMBERS
          </div>

          {/* divider */}
          <div
            style={{
              width: 200,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
              marginTop: 36,
            }}
          />

          {/* Price */}
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "baseline",
              marginTop: 30,
            }}
          >
            <span
              style={{
                fontSize: 48,
                color: BRAND.bone,
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              NT$ 2,700
            </span>
            <span
              style={{
                fontSize: 18,
                color: "rgba(245,242,234,0.5)",
                letterSpacing: "0.3em",
                display: "flex",
              }}
            >
              ONE-TIME
            </span>
          </div>
        </div>

        {/* BOTTOM: status bar */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 16,
            letterSpacing: "0.3em",
          }}
        >
          <span style={{ color: "rgba(245,242,234,0.55)", display: "flex" }}>
            {FOUNDERS_REMAINING} OF {FOUNDERS_TOTAL} REMAINING
          </span>
          <span
            style={{
              color: BRAND.gold,
              fontWeight: 500,
              display: "flex",
            }}
          >
            CLAIM {formatBadge(FOUNDERS_NEXT)} →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
