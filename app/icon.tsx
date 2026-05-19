import { ImageResponse } from "next/og";

// ── ZONE 27 favicon · Z monogram on navy ───────────────
// 取代預設 Next.js 三角形 favicon。瀏覽器分頁、書籤、Mac Dock
// 都會自動使用這顆圖示。
// ─────────────────────────────────────────────────────

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F1A2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4AF37",
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: -2,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        Z
        <span
          style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            fontSize: 12,
            color: "#F5F2EA",
            fontWeight: 500,
            letterSpacing: 0,
            display: "flex",
          }}
        >
          27
        </span>
      </div>
    ),
    { ...size }
  );
}
