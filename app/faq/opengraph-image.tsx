import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /faq Dynamic OG ──────────────────────────
// Specific to the FAQ page. Distinct from sales / disclosure OG.
// Featured pattern: 4 sample questions in muted gray, one
// highlighted in gold ("是博彩平台嗎?") with the answer "❌ 不是".
// Tells visitor: "we answer the hardest question first · no
// hiding behind marketing copy."
//
// Why this OG matters: /faq is the page visitors share when
// privately recommending ZONE 27 — "before you ask, here's
// what they say." Need a visual that's instantly readable.
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · FAQ · 14 個誠實到不能再誠實的回答";

export default async function FaqOgImage() {
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
        {/* TOP */}
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
            FAQ · 14 HONEST ANSWERS
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 30,
            marginBottom: 30,
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
            BEFORE YOU ASK
          </span>
          <span
            style={{
              fontSize: 72,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            14 個誠實到
          </span>
          <span
            style={{
              fontSize: 72,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 4,
              display: "flex",
            }}
          >
            不能再誠實的回答
          </span>
        </div>

        {/* Featured Q · answered with red X */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "18px 22px",
            border: `1px solid ${BRAND.gold}`,
            background: "rgba(212,175,55,0.08)",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              color: BRAND.gold,
              fontSize: 11,
              letterSpacing: "0.3em",
              marginBottom: 6,
              display: "flex",
            }}
          >
            Q3 · 最常被問
          </span>
          <span
            style={{
              color: BRAND.bone,
              fontSize: 24,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              marginBottom: 8,
              display: "flex",
            }}
          >
            ZONE 27 是博彩平台嗎?
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <span
              style={{
                color: BRAND.loss,
                fontSize: 26,
                fontWeight: 700,
                display: "flex",
              }}
            >
              ×
            </span>
            <span
              style={{
                color: BRAND.bone,
                fontSize: 20,
                letterSpacing: "-0.01em",
                display: "flex",
              }}
            >
              不是。不接受下注 · 不出彩金 · 不撮合對賭。
            </span>
          </div>
        </div>

        {/* 3 more sample questions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <FaqLine n="Q6" q="引擎免費,那我付什麼?" />
          <FaqLine n="Q9" q="你們的 AI 預測準確率多高?" />
          <FaqLine n="Q14" q="你們會追蹤我嗎?" highlight />
        </div>

        {/* Bottom */}
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
              letterSpacing: "0.02em",
              display: "flex",
            }}
          >
            最硬的問題,在頁面前 3 個就答完
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
            /faq
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function FaqLine({
  n,
  q,
  highlight = false,
}: {
  n: string;
  q: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 18,
        padding: "10px 22px",
        background: highlight ? "rgba(212,175,55,0.04)" : "transparent",
        borderBottom: "1px solid rgba(212,175,55,0.08)",
      }}
    >
      <span
        style={{
          color: highlight ? BRAND.gold : "rgba(212,175,55,0.6)",
          fontSize: 11,
          letterSpacing: "0.25em",
          minWidth: 36,
          display: "flex",
        }}
      >
        {n}
      </span>
      <span
        style={{
          color: highlight ? BRAND.bone : "rgba(245,242,234,0.55)",
          fontSize: 18,
          letterSpacing: "-0.01em",
          flex: 1,
          display: "flex",
        }}
      >
        {q}
      </span>
    </div>
  );
}
