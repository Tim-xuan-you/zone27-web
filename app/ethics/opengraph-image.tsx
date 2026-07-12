import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /ethics Dynamic OG · 量力而為 ─────────────────────────
// Tim 2026-07-13 極簡拍板:舊卡(9 條宣言 · 英文行話)全換 —— 分享出去的卡
// 只講訪客用得到的三句:不是賭場 · 沒人保證獲利 · 停不下來打這幾支電話。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · 量力而為 · 我們不是賭場 · 沒有人能保證獲利 · 1925 安心專線 · 1995 生命線 · 1980 張老師";

export default async function EthicsOgImage() {
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
        {/* TOP ROW */}
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
            量力而為
          </span>
        </div>

        {/* HEADLINE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 48,
          }}
        >
          <span
            style={{
              fontSize: 88,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
            }}
          >
            玩得起,才玩。
          </span>
          <span
            style={{
              fontSize: 24,
              color: BRAND.bone,
              fontWeight: 300,
              marginTop: 18,
              display: "flex",
            }}
          >
            我們不是賭場 · 不收注 · 沒有人能保證獲利
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 44,
            marginBottom: 30,
          }}
        />

        {/* 三支免費專線 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Hotline n="1925" label="安心專線 · 24 小時" gold />
          <Hotline n="1995" label="生命線" />
          <Hotline n="1980" label="張老師專線" />
        </div>

        {/* BOTTOM */}
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
              display: "flex",
            }}
          >
            用「輸了也不心痛」的錢 · 未滿 18 歲依法不能買運動彩券
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
            zone27.com.tw
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function Hotline({ n, label, gold = false }: { n: string; label: string; gold?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        flex: 1,
        padding: 20,
        border: gold
          ? "1px solid rgba(212,175,55,0.6)"
          : "1px solid rgba(138,147,168,0.3)",
        background: gold ? "rgba(212,175,55,0.06)" : "rgba(245,242,234,0.02)",
      }}
    >
      <span
        style={{
          color: gold ? BRAND.gold : BRAND.bone,
          fontSize: 56,
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
          color: "rgba(245,242,234,0.7)",
          fontSize: 14,
          letterSpacing: "0.1em",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
