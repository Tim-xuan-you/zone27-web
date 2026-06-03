import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import {
  FOUNDERS_TOTAL,
  FOUNDERS_CLAIMED,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

// ── ZONE 27 · /founders/ledger Dynamic OG ──────────────
// Round 32 W-A · Wire-up sync for Round 31 W-S new route。
//
// 當 visitor 把 /founders/ledger 貼到 LINE / FB,顯示「OPEN ALLOCATION
// LEDGER」 trust artifact snapshot — 不是 sales pitch · 是 brand IP
// statement「沒有 luxury 品牌做這件事」。
//
// 設計原則:
//   - 4 axiom chips 等大列出(Pratfall · Costly Signaling · Disclosure ·
//     倒置 SaaS) · 這頁的 brand IP 是「4 個同時 fire」
//   - 累計 stats 用 Bloomberg-terminal aesthetic · 不是 marketing
//   - 反向 marketing punchline:「Most luxury brands publish process. We
//     publish rejections.」 · 同 /track-record「Most prediction sites hide
//     their misses.」 inversion pattern
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · FOUNDER 公開名額帳本 · 連被拒的原因都公布";

export default async function FoundersLedgerOgImage() {
  const forged = FOUNDERS_CLAIMED;
  const remaining = FOUNDERS_REMAINING;
  const total = FOUNDERS_TOTAL;

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
            / FOUNDERS / LEDGER
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
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
            OPEN ALLOCATION LEDGER
          </span>
          <span
            style={{
              fontSize: 60,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            分配公開帳本
          </span>
          <span
            style={{
              fontSize: 20,
              color: "rgba(245,242,234,0.65)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              marginTop: 12,
              display: "flex",
            }}
          >
            公布拒絕原因 · 公布通過率 · 公布規則 · 每週手寫更新
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 30,
            marginBottom: 22,
          }}
        />

        {/* ── 4 AXIOM CHIPS · equal weight ─────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <AxiomChip label="公開拒絕" />
          <AxiomChip label="別人不敢" />
          <AxiomChip label="規則全攤" />
          <AxiomChip label="反著做" />
        </div>

        {/* ── STATS BLOCK ─────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
            marginTop: 36,
          }}
        >
          <StatBlock n={forged} label="FORGED · 已認領" tone="gold" />
          <StatBlock
            n={remaining}
            label="REMAINING · 待認領"
            tone="bone"
          />
          <StatBlock n={total} label="1ST EDITION 編號" tone="mute" />
        </div>

        {/* ── BOTTOM · differentiator punchline ──────── */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
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
            Most luxury brands publish process. We publish rejections.
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
            /founders/ledger →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function AxiomChip({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        padding: "12px 8px",
        border: "1px solid rgba(212,175,55,0.45)",
        color: BRAND.gold,
        fontSize: 13,
        letterSpacing: "0.22em",
        textAlign: "center",
      }}
    >
      {label}
    </div>
  );
}

function StatBlock({
  n,
  label,
  tone,
}: {
  n: number;
  label: string;
  tone: "gold" | "bone" | "mute";
}) {
  const color =
    tone === "gold"
      ? BRAND.gold
      : tone === "bone"
      ? BRAND.bone
      : "rgba(245,242,234,0.5)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          color,
          fontSize: 84,
          fontWeight: 300,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          display: "flex",
        }}
      >
        {n}
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.55)",
          fontSize: 13,
          letterSpacing: "0.22em",
          textAlign: "center",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
