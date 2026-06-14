import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /coverage Dynamic OG ──────────────────────
// Bloomberg-grade ledger snapshot. Lists active / tracked /
// requested / never-cover leagues — the visual proof of
// [[zone27-coverage-philosophy]]: curation = brand.
// Distinct from /audit OG (data table) and /manifesto OG (2x2
// axiom grid). This is a TABLE OF DECISIONS, terminal-style.
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · Coverage · 我們覆蓋什麼,不覆蓋什麼";

export default async function CoverageOgImage() {
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
            COVERAGE LEDGER
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
          }}
        >
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
            我們覆蓋什麼,
          </span>
          <span
            style={{
              fontSize: 56,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 6,
              display: "flex",
            }}
          >
            不覆蓋什麼。
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 28,
            marginBottom: 24,
          }}
        />

        {/* Ledger rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 18,
          }}
        >
          <LedgerRow
            status="READY"
            league="MLB"
            note="官方 API · 全季 ~2,430 場"
            statusColor={BRAND.gold}
          />
          <LedgerRow
            status="HAND-CURATED"
            league="CPBL"
            note="創辦人親手 curate · 自動化等 F27 滿員"
            statusColor={BRAND.gold}
          />
          <LedgerRow
            status="ON QUEUE"
            league="NPB · KBO · NCAA"
            note="GOLD 會員投票決定優先順序"
            statusColor="rgba(245,242,234,0.6)"
          />
          <LedgerRow
            status="NEVER"
            league="下注平台 · 賣明牌 · 抽佣莊家"
            note="與品牌信用相反 · 永遠不寄生"
            statusColor={BRAND.loss}
          />
        </div>

        {/* Bottom punchline */}
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
            覆蓋率可以慢慢長 · 信任一旦丟就回不來
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
            /coverage
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function LedgerRow({
  status,
  league,
  note,
  statusColor,
}: {
  status: string;
  league: string;
  note: string;
  statusColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 20,
      }}
    >
      <span
        style={{
          color: statusColor,
          fontSize: 11,
          letterSpacing: "0.22em",
          fontWeight: 500,
          width: 180,
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 10,
          paddingRight: 10,
          border: `1px solid ${statusColor}`,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {status}
      </span>
      <span
        style={{
          color: BRAND.bone,
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: "-0.01em",
          minWidth: 200,
          display: "flex",
        }}
      >
        {league}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.5)",
          fontSize: 14,
          letterSpacing: "0.02em",
          flex: 1,
          display: "flex",
        }}
      >
        {note}
      </span>
    </div>
  );
}
