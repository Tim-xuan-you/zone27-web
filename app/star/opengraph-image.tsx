import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /star Dynamic OG ─────────────────────────
// 對帳之星 share card。 把「獎本身」當頭條:一顆買不到的星 · 比機器準才贏得來 · 守不住會被收回。
// 🔴 OG glyph 房規:next/og(Satori)render,絕不用 symbol glyph(✓✕▸★→ 會變豆腐)——
//    星用 inline <polygon>(Satori 可靠 raster · 同 lib/og-marks Tri)· 分隔只用中點 ·。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · 對帳之星 THE RECKONING STAR · 一顆買不到的星 · 比機器準才贏得來 · 守不住會被收回";

export default async function StarOgImage() {
  const GOLD = BRAND.gold;
  const BONE = BRAND.bone;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(212,175,55,0.16), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* ── TOP ROW · brand + path ─────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 24, color: GOLD, letterSpacing: "0.22em", fontWeight: 500 }}>ZONE</span>
            <span style={{ fontSize: 24, color: BONE, letterSpacing: "0.22em", fontWeight: 500 }}>27</span>
          </div>
          <span style={{ fontSize: 14, color: "rgba(212,175,55,0.7)", letterSpacing: "0.35em", display: "flex" }}>
            / 對帳之星 · THE RECKONING STAR
          </span>
        </div>

        {/* ── STAR + HEADLINE ────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 54 }}>
          <svg width={92} height={92} viewBox="0 0 32 32">
            <polygon
              points="16,2 19.5,11.5 29.5,11.5 21.5,18 24.5,29 16,22.5 7.5,29 10.5,18 2.5,11.5 12.5,11.5"
              fill={GOLD}
              fillOpacity={0.18}
              stroke={GOLD}
              strokeWidth={1.3}
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, color: BONE, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, display: "flex" }}>
              一顆,買不到的星。
            </span>
            <span style={{ fontSize: 22, color: "rgba(245,242,234,0.7)", fontWeight: 300, marginTop: 14, display: "flex" }}>
              ZONE 27 唯一的榮譽 · 比機器準才贏得來
            </span>
          </div>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 40,
            marginBottom: 26,
          }}
        />

        {/* ── CRITERIA ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontSize: 40, color: GOLD, fontWeight: 300, display: "flex" }}>30 場</span>
          <span style={{ fontSize: 20, color: "rgba(245,242,234,0.6)", letterSpacing: "0.04em", display: "flex" }}>
            含輸照算 · 賽前鎖死 · 準度贏過只敢喊 57% 的引擎
          </span>
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
          <span style={{ fontSize: 16, color: "rgba(245,242,234,0.6)", letterSpacing: "0.04em", display: "flex" }}>
            沒有付費通道 · 沒有限量名額 · 守不住會被收回
          </span>
          <span style={{ fontSize: 14, color: GOLD, letterSpacing: "0.3em", fontWeight: 500, display: "flex" }}>
            /star
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
