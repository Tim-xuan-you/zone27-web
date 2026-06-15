import { ImageResponse } from "next/og";

// ── ZONE 27 · 512×512 PWA install icon ─────────────────
// R238 · app/manifest.ts 的 icons 引用(Android 安裝 + 啟動畫面)。
// iOS 主畫面圖示走 app/apple-icon.tsx(180 · apple-touch-icon);
// 這顆是 manifest icons 的高解析項(Chrome / Android 建議 ≥192 ·
// 提供 512 = 最佳安裝體驗)。 鏡 apple-icon 視覺:navy + 金 Z +
// 骨白 27 + 徑向金暈。 purpose:"any"(角落 "27" 不被 maskable
// 遮罩裁掉,故不標 maskable)。 dot-segment 路由同 app/feed.xml。
// ─────────────────────────────────────────────────────

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F1A2E",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,0.18), transparent 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#D4AF37",
          fontSize: 320,
          fontWeight: 600,
          letterSpacing: -12,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        Z
        <span
          style={{
            position: "absolute",
            bottom: 70,
            right: 70,
            fontSize: 88,
            color: "#F5F2EA",
            fontWeight: 500,
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
