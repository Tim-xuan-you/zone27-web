import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /member Dynamic OG ───────────────────────
// Round 29 Wave 2 · 當 /member 連結被分享 · 預覽顯示
// "FREE TIER 會員儀表板 · 預覽版" + 4 個 cognitive bias chip
// (ENDOWMENT · IKEA · LOSS · COLLECTION) — visitor 看圖就知道
// 這頁是會員預覽 + 心理學設計 driven。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 你的會員儀表板";

export default async function MemberOgImage() {
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
            / MEMBER
          </span>
        </div>

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
            FREE TIER · 會員儀表板預覽
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
            您的引擎時間軸 ·
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
            您自己的 trophy
          </span>
        </div>

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

        {/* 4 cognitive bias chips · equal weight */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
          }}
        >
          <BiasChip label="你的資料" zh="只在你手上" />
          <BiasChip label="你親手押的" zh="你投票 · 你決定" />
          <BiasChip label="你的戰績" zh="離開就帶不走" />
          <BiasChip label="你的準度蒐藏" zh="一場一場累積" />
        </div>

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
            黏住會員的是「資料屬於你」· 不是功能。
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
            /member →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function BiasChip({ label, zh }: { label: string; zh: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          background: BRAND.gold,
          display: "flex",
        }}
      />
      <span
        style={{
          color: BRAND.gold,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.18em",
          display: "flex",
        }}
      >
        ψ {label}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 13,
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
