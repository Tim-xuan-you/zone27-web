import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import { PRODUCT_VERSION } from "@/lib/build-meta";

// ── ZONE 27 · /audit Dynamic OG ─────────────────────────
// 當有人把 https://zone27.com.tw/audit 貼到 LINE / FB / Discord,
// 不顯示通用品牌卡(那會誤導),而是顯示一張**像 Bloomberg snapshot**
// 的 model-report 概要卡 — 直接把「這頁不一樣 · 學術級透明」傳遞出去。
//
// 設計原則(Round 7 研究):
//   - Distinct from sales OG cards · 不是 marketing
//   - 像看到 trading terminal 截圖,不像看到行銷海報
//   - 數字當主角,不是 slogan
//   - 一行差異化 punchline 在底部
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `ZONE 27 · Model Report ${PRODUCT_VERSION} · Engine v0.2`;

export default async function AuditOgImage() {
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
        {/* ── TOP ROW · brand + label ───────────────── */}
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
            MODEL REPORT · {PRODUCT_VERSION}
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
            MODEL REPORT
          </span>
          <span
            style={{
              fontSize: 120,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
            }}
          >
            {PRODUCT_VERSION}
          </span>
          <span
            style={{
              fontSize: 26,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 8,
              display: "flex",
            }}
          >
            ZONE 27 Engine · Real At-Bat v0.2 · 全部假設公開可審
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

        {/* ── DATA TABLE · Bloomberg-style aligned rows ─ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 18,
            color: BRAND.bone,
          }}
        >
          <DataRow label="ENGINE" value="Real At-Bat v0.2" />
          <DataRow label="ITERATIONS / SIM" value="10,000" />
          <DataRow label="STANDARD ERROR" value="± 0.5%" />
          <DataRow label="LAST REVIEWED" value="2026-05-21" />
        </div>

        {/* ── COUNTS ROW · what we disclose ──────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          {/* Round 7 consolidated: was 7 USED + 10 EXCLUDED + 7 FAILURE
              MODES = 24 itemized stats. Now 3 (USED + SCOPE + ENV) ·
              Round 7 ledger shows compression numbers honestly. */}
          <Stat n="3" label="INPUTS · USED" />
          <Stat n="5" label="SCOPE BOUNDARY" />
          <Stat n="1" label="ENV. IMPACT" gold />
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
            98% of model cards skip the Environmental Impact section. We don&apos;t.
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
            /audit
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function DataRow({ label, value }: { label: string; value: string }) {
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

function Stat({
  n,
  label,
  gold = false,
}: {
  n: string;
  label: string;
  gold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
      }}
    >
      <span
        style={{
          color: gold ? BRAND.gold : BRAND.bone,
          fontSize: 40,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          display: "flex",
        }}
      >
        {n}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.5)",
          fontSize: 11,
          letterSpacing: "0.25em",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
