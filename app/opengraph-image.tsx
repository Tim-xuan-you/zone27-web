import { ImageResponse } from "next/og";

// ── ZONE 27 · Global Open Graph Image ──────────────────
// 當任何人把 zone27-web.vercel.app 貼上 LINE、FB、Threads、Discord、Slack、Twitter
// 都會自動 fetch 這張圖,呈現在預覽卡片上 — 黑底冷金、極致品牌一致性。
// 1200 x 630 是 OG 標準尺寸。
// ─────────────────────────────────────────────────────

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ZONE 27 — 不靠直覺,只看演算法";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F1A2E",
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.08), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          position: "relative",
        }}
      >
        {/* TOP: Brand wordmark */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            display: "flex",
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 28,
              color: "#D4AF37",
              letterSpacing: "0.25em",
              fontWeight: 500,
            }}
          >
            ZONE
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#F5F2EA",
              letterSpacing: "0.25em",
              fontWeight: 500,
            }}
          >
            27
          </span>
        </div>

        {/* TOP RIGHT: tagline */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 80,
            fontSize: 18,
            color: "rgba(245,242,234,0.5)",
            letterSpacing: "0.3em",
            display: "flex",
          }}
        >
          QUANT SPORTS · EST. 2026
        </div>

        {/* CENTER: massive slogan */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 110,
              color: "#F5F2EA",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            不靠直覺,
          </div>
          <div
            style={{
              fontSize: 110,
              color: "#D4AF37",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 8,
              display: "flex",
            }}
          >
            只看演算法。
          </div>

          {/* hairline divider */}
          <div
            style={{
              width: 200,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
              marginTop: 48,
            }}
          />

          <div
            style={{
              fontSize: 22,
              color: "rgba(245,242,234,0.6)",
              letterSpacing: "0.35em",
              marginTop: 32,
              display: "flex",
            }}
          >
            WE DON&apos;T GUESS. WE COMPUTE.
          </div>
        </div>

        {/* BOTTOM LEFT: positioning */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            fontSize: 18,
            color: "rgba(245,242,234,0.55)",
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          全台最帥的暗黑黃金級體育預測社群
        </div>

        {/* BOTTOM RIGHT: live model badge */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#D4AF37",
            }}
          />
          <span
            style={{
              fontSize: 16,
              color: "#D4AF37",
              letterSpacing: "0.35em",
            }}
          >
            LIVE AI MODEL
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
