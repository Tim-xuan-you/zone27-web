import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import { Tri } from "@/lib/og-marks";

// ── ZONE 27 · /ladder Dynamic OG ───────────────────────
// R174 Polymarket pivot · 準度海選天梯 share card。 行銷洞察物理化:
// 三個聲音(引擎/群眾/你)· 王座目前由機器佔據 · 神諭 = 第一個登頂的人類。
// 誠實標「0 人類登榜」(同 page hero status badge)· 不假裝已有玩家。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · 海選天梯 THE LADDER · 三個聲音(引擎/群眾/你)· 從新秀爬到神諭 · 王座目前只有機器 · 0 人類登榜";

const RUNGS = ["新秀", "分析師", "操盤手", "神準手", "神諭"];

export default async function LadderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(212,175,55,0.14), transparent 60%)",
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
            / LADDER · 海選天梯
          </span>
        </div>

        {/* ── STATUS BADGE · 誠實 0 人類 ─────────────── */}
        <div style={{ display: "flex", marginTop: 30 }}>
          <span
            style={{
              fontSize: 13,
              color: BRAND.gold,
              letterSpacing: "0.4em",
              padding: "6px 14px",
              border: `1px solid rgba(212,175,55,0.6)`,
              display: "flex",
            }}
          >
            WAITING · 0 人類登榜 · 王座由機器佔據
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
          <span
            style={{
              fontSize: 62,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            目前 · 王座上只有機器。
          </span>
          <span
            style={{
              fontSize: 22,
              color: "rgba(245,242,234,0.7)",
              fontWeight: 300,
              letterSpacing: "0.01em",
              marginTop: 16,
              display: "flex",
            }}
          >
            三個聲音 —— 引擎、群眾、你。 第一個登頂的人類還沒出現。
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
            marginBottom: 24,
          }}
        />

        {/* ── LADDER RUNGS · 新秀 → 神諭 ──────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {RUNGS.map((r, i) => {
            const apex = i === RUNGS.length - 1;
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 26,
                    color: apex ? BRAND.gold : "rgba(245,242,234,0.55)",
                    fontWeight: apex ? 500 : 300,
                    letterSpacing: "0.05em",
                    padding: apex ? "6px 14px" : "0",
                    border: apex ? `1px solid rgba(212,175,55,0.7)` : "none",
                    display: "flex",
                  }}
                >
                  {r}
                </span>
                {i < RUNGS.length - 1 && (
                  <Tri size={13} color={BRAND.gold} opacity={0.6} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM · punchline ─────────────────────── */}
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
            Beat the machine. Beat the crowd.
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
            /ladder
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
