import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /methodology Dynamic OG ──────────────────
// 當有人把 /methodology 連結貼到 LINE / Discord(對棒球量化有興趣的朋友),
// 顯示的是一張 engineering-whitepaper 風格的論文標題頁:
// 大字「The ZONE 27 Engine」+ 4 行對齊 datapoints。
//
// 跟 /audit OG(snapshot 風)+ /founders OG(sales 風)清楚區隔。
// 目標受眾:會仔細讀 paper 的硬核棒球迷。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Engineering Whitepaper · Real At-Bat Monte Carlo";

export default async function MethodologyOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.08), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* TOP ROW · brand + label */}
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
            ENGINEERING WHITEPAPER · v0.2
          </span>
        </div>

        {/* HEADLINE · paper title style */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 60,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 14,
              display: "flex",
            }}
          >
            THE ZONE 27 ENGINE
          </span>
          <span
            style={{
              fontSize: 90,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            Real At-Bat
          </span>
          <span
            style={{
              fontSize: 90,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginTop: 6,
              display: "flex",
            }}
          >
            Monte Carlo
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginBottom: 32,
          }}
        />

        {/* DATA TABLE · paper-style aligned rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontSize: 20,
          }}
        >
          <PaperRow label="ITERATIONS / SIM" value="10,000" />
          <PaperRow label="STANDARD ERROR" value="± 0.5%" />
          <PaperRow label="EVENT MODEL" value="8-outcome PA · Markov" />
          <PaperRow label="OPEN SOURCE" value="github.com/Tim-xuan-you/zone27-web" />
        </div>

        {/* BOTTOM · CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 16,
            letterSpacing: "0.3em",
          }}
        >
          <span style={{ color: "rgba(245,242,234,0.6)", display: "flex" }}>
            10 sections · n=1 CPBL start · honest limitations
          </span>
          <span style={{ color: BRAND.gold, fontWeight: 500, display: "flex" }}>
            親手驗證 → /lab
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function PaperRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 24,
      }}
    >
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          letterSpacing: "0.2em",
          fontSize: 14,
          display: "flex",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: BRAND.bone,
          letterSpacing: "-0.01em",
          fontSize: 22,
          display: "flex",
        }}
      >
        {value}
      </span>
    </div>
  );
}
