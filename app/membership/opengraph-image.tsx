import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /membership Dynamic OG ──────────────────
// 當有人把 https://zone27-web.vercel.app/membership 貼到 LINE/FB,
// 顯示的不是通用品牌卡 · 也不是 /founders 「270 年度」scarcity
// 卡 · 而是「4-TIER LADDER 全景」 — visitor 看圖就知道這頁有從免費
// 到 NT$ 2,700 的階梯 · 不是 paywall。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 會員制 · 4-TIER MEMBERSHIP LADDER";

export default async function MembershipOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.14), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.05), transparent 60%)",
          display: "flex",
          flexDirection: "column",
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

        {/* TOP RIGHT: route tag */}
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
          / MEMBERSHIP
        </div>

        {/* CENTER: title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginTop: 40,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.6)",
              letterSpacing: "0.4em",
              marginBottom: 20,
              display: "flex",
            }}
          >
            4-TIER MEMBERSHIP LADDER
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: 90,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              marginBottom: 8,
              display: "flex",
            }}
          >
            ZONE 27{" "}
            <span style={{ color: BRAND.gold, marginLeft: 18 }}>會員制</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              color: "rgba(245,242,234,0.65)",
              fontWeight: 300,
              letterSpacing: "0em",
              marginTop: 20,
              display: "flex",
            }}
          >
            從免費到 NT$ 2,700 / 年 · 任時自由升級 · 我們不催
          </div>

          {/* divider */}
          <div
            style={{
              width: 280,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
              marginTop: 44,
              marginBottom: 44,
            }}
          />

          {/* 4 tier row */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "baseline",
              fontSize: 18,
              letterSpacing: "0.18em",
            }}
          >
            <span style={{ color: "rgba(245,242,234,0.5)", display: "flex" }}>
              ANONYMOUS
            </span>
            <span style={{ color: "rgba(245,242,234,0.3)", display: "flex" }}>
              ·
            </span>
            <span
              style={{
                color: BRAND.gold,
                fontWeight: 500,
                display: "flex",
              }}
            >
              OPEN
            </span>
            <span style={{ color: "rgba(245,242,234,0.3)", display: "flex" }}>
              ·
            </span>
            <span style={{ color: BRAND.bone, display: "flex" }}>
              BLACK
            </span>
            <span style={{ color: "rgba(245,242,234,0.3)", display: "flex" }}>
              ·
            </span>
            <span style={{ color: BRAND.bone, display: "flex" }}>
              GOLD
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
            FREE · NT$ 500/31天 · NT$ 2,700/年
          </span>
          <span
            style={{
              color: BRAND.gold,
              fontWeight: 500,
              display: "flex",
            }}
          >
            JOIN OPEN
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
