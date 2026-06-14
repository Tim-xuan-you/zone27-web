import { ImageResponse } from "next/og";
import {
  BRAND,
  OG_SIZE,
  OG_CONTENT_TYPE,
  OG_BACKGROUND_IMAGE,
  goldRgba,
  boneRgba,
} from "@/lib/brand";
import { CORRECTIONS } from "@/lib/corrections";

// ── ZONE 27 · /corrections Dynamic OG ──────────────────
// 把 /corrections 貼到 LINE / FB:不是通用品牌卡,而是一張「我們搞砸過的事」
// 的認錯卡 —— 第一秒就傳達「這品牌把自己的錯做成一頁、永遠掛著」。
// 🔴 OG glyph 房規:0 symbol glyph(→ ✓ ✕ ▸ ★ 全禁 · Satori 缺字會變豆腐)·
//   只用 CJK + 拉丁 + 數字 + 中點 + 破折號。 件數讀 lib/corrections(永不 drift)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 我們搞砸過的事 · 公開認錯、不刪";

export default function CorrectionsOgImage() {
  const count = CORRECTIONS.length;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage: OG_BACKGROUND_IMAGE,
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
        }}
      >
        {/* TOP ROW · brand + label */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>
              ZONE
            </span>
            <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>
              27
            </span>
          </div>
          <span style={{ fontSize: 16, color: goldRgba(0.7), letterSpacing: "0.35em", display: "flex" }}>
            CORRECTIONS · 公開認錯
          </span>
        </div>

        {/* HEADLINE */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 46 }}>
          <span style={{ fontSize: 15, color: goldRgba(0.55), letterSpacing: "0.4em", marginBottom: 14, display: "flex" }}>
            公開記著 · 只增不刪
          </span>
          <span
            style={{
              fontSize: 88,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
            }}
          >
            我們<span style={{ color: BRAND.gold }}>搞砸過</span>的事
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 34,
            marginBottom: 26,
          }}
        />

        {/* SUBLINE + COUNT */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <span
            style={{
              fontSize: 24,
              color: boneRgba(0.7),
              fontWeight: 300,
              letterSpacing: "0.01em",
              lineHeight: 1.5,
              display: "flex",
              flexDirection: "column",
              maxWidth: 720,
            }}
          >
            <span style={{ display: "flex" }}>贏了晒單、輸了刪文,是別人的玩法。</span>
            <span style={{ display: "flex" }}>我們把搞砸的事做成一頁、永遠掛著。</span>
          </span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 96, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1, display: "flex" }}>
              {count}
            </span>
            <span style={{ fontSize: 16, color: boneRgba(0.5), letterSpacing: "0.2em", marginTop: 6, display: "flex" }}>
              件已公開
            </span>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span style={{ fontSize: 17, color: boneRgba(0.6), letterSpacing: "0.02em", display: "flex" }}>
            賣明牌的人,不會做這一頁。
          </span>
          <span style={{ fontSize: 15, color: goldRgba(0.7), letterSpacing: "0.3em", fontWeight: 500, display: "flex" }}>
            /corrections
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
