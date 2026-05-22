import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /membership/black-card Dynamic OG ────────
// Round 32 W-A · Wire-up sync for Round 31 W-X3 new route。
//
// /membership/black-card 是 BLACK CARD UI mockup · 預計 Q3 2026 上線。
// OG card 必須誠實標 PRE-LAUNCH(同 page 上 status badge)否則 visitor
// 從 LINE/FB 點進來會誤以為現在可訂閱。 brand IP「方法公開」延伸到
// preview state itself。
//
// 設計原則:
//   - PRE-LAUNCH · UI MOCKUP badge 顯眼(同 page hero)
//   - 5 unlocks 條列(球迷 grammar:明牌 / voting / Tim 筆記 / LINE 群)
//   - NT$ 299 / 月 + 5% 創作者抽成(vs 業界 30-50% 是降維打擊)
//   - 反向 marketing punchline:「Subscription preview. We don't take
//     money until Q3.」
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · BLACK CARD · 訂閱會員 UI preview · NT$ 299/月 · Q3 2026 上線 · 5 unlocks · 5% 創作者抽成";

export default async function BlackCardOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.12), transparent 60%)",
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
            / MEMBERSHIP / BLACK-CARD
          </span>
        </div>

        {/* ── PRE-LAUNCH BADGE ─────────────────────── */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: BRAND.loss,
              letterSpacing: "0.4em",
              padding: "6px 14px",
              border: `1px solid ${BRAND.loss}`,
              display: "flex",
            }}
          >
            PRE-LAUNCH · UI MOCKUP · Q3 2026
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 64,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            BLACK CARD
          </span>
          <span
            style={{
              fontSize: 44,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 8,
              display: "flex",
            }}
          >
            NT$ 299 / 月
          </span>
          <span
            style={{
              fontSize: 18,
              color: "rgba(245,242,234,0.65)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              marginTop: 14,
              display: "flex",
            }}
          >
            訂閱會員 · 5 unlocks · 5% 創作者抽成(vs 業界 30-50%)
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 28,
            marginBottom: 22,
          }}
        />

        {/* ── 5 UNLOCKS · 2-col stack ─────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <UnlockRow label="賽事討論室發言 · 球迷分享預測" />
          <UnlockRow label="創作者抽成 5%(業界 30-50% 降維打擊)" />
          <UnlockRow label="每月 voting 影響引擎下個 ship 方向" />
          <UnlockRow label="Tim 每週工程筆記 full 版" />
          <UnlockRow label="Founders 27 LINE 群 read-only access" />
        </div>

        {/* ── BOTTOM · differentiator punchline ──────── */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
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
            Subscription preview. We don&apos;t take money until Q3.
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
            /membership/black-card →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function UnlockRow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          color: BRAND.gold,
          fontSize: 18,
          fontWeight: 500,
          display: "flex",
          width: 16,
        }}
      >
        ▸
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.85)",
          fontSize: 17,
          letterSpacing: "0.03em",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
