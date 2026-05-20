import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
  FOUNDERS_NEXT,
  isClaimed,
  formatBadge,
} from "@/lib/founders-stats";

// ── ZONE 27 · /leaderboard Dynamic OG ──────────────────
// 當有人把 /leaderboard 連結貼到 LINE,顯示一張「THE 27 WALL」
// 視覺化卡 — 270 個小方格(27 × 10 grid),已認領的填金、未認領的線框,
// 直接把「全台最稀缺 270 個席位」的視覺敘事傳遞出去。
//
// 跟 /founders OG(銷售卡 · 大字「270」+ 價格)清楚區隔 —
// 這張是視覺資產卡,焦點是「牆」本身。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · The 27 Wall · 270 lifetime founder seats";

// Grid: 27 columns × 10 rows = 270 cells (visual signature of the page)
const COLS = 27;
const ROWS = 10;
const CELL = 22;
const GAP = 4;

export default async function LeaderboardOgImage() {
  // Build the visual grid — render each slot
  const slots = Array.from({ length: FOUNDERS_TOTAL }, (_, i) => i + 1);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.12), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* TOP · brand + label */}
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
            THE 27 WALL
          </span>
        </div>

        {/* HEADLINE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 36,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            全台最稀缺的{" "}
            <span style={{ color: BRAND.gold, marginLeft: 12, display: "flex" }}>
              {FOUNDERS_TOTAL}
            </span>{" "}
            <span style={{ marginLeft: 12, display: "flex" }}>個席位</span>
          </span>
        </div>

        {/* THE WALL · 27 × 10 grid of 270 cells */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: GAP,
            marginBottom: 24,
          }}
        >
          {Array.from({ length: ROWS }, (_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              style={{ display: "flex", gap: GAP }}
            >
              {slots
                .slice(rowIdx * COLS, (rowIdx + 1) * COLS)
                .map((n) => (
                  <div
                    key={n}
                    style={{
                      width: CELL,
                      height: CELL,
                      background: isClaimed(n)
                        ? "rgba(212,175,55,0.18)"
                        : "transparent",
                      border: isClaimed(n)
                        ? "1px solid rgba(212,175,55,0.85)"
                        : `1px solid rgba(138,147,168,0.3)`,
                      display: "flex",
                    }}
                  />
                ))}
            </div>
          ))}
        </div>

        {/* STATUS LINE */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 18,
            letterSpacing: "0.18em",
            paddingTop: 18,
            borderTop: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <span
            style={{
              color: BRAND.bone,
              display: "flex",
            }}
          >
            <span style={{ color: BRAND.gold, marginRight: 6, display: "flex" }}>
              {FOUNDERS_CLAIMED}
            </span>
            <span style={{ marginRight: 6, display: "flex" }}>/</span>
            <span style={{ marginRight: 12, display: "flex" }}>
              {FOUNDERS_TOTAL}
            </span>
            <span
              style={{
                color: "rgba(245,242,234,0.6)",
                marginRight: 12,
                display: "flex",
              }}
            >
              FORGED
            </span>
            <span
              style={{
                color: "rgba(245,242,234,0.4)",
                marginRight: 12,
                display: "flex",
              }}
            >
              ·
            </span>
            <span style={{ marginRight: 6, display: "flex" }}>
              {FOUNDERS_REMAINING}
            </span>
            <span style={{ color: "rgba(245,242,234,0.6)", display: "flex" }}>
              REMAIN
            </span>
          </span>
          <span
            style={{
              color: BRAND.gold,
              fontWeight: 500,
              display: "flex",
            }}
          >
            NEXT {formatBadge(FOUNDERS_NEXT)} →
          </span>
        </div>

        {/* BOTTOM · tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            fontSize: 14,
            color: "rgba(245,242,234,0.55)",
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          一旦填滿,這扇門永遠關閉 · This wall fills only once.
        </div>
      </div>
    ),
    { ...size }
  );
}
