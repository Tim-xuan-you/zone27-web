import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE, OG_BACKGROUND_IMAGE } from "@/lib/brand";

// ── ZONE 27 · /how-we-grade Dynamic OG ───────────────────
// R263 · 全站最強的「嚴格評分」武器頁(押下鎖死、賽果照官方、連我們算錯的都刪不掉)分享時
// 原本退回通用卡。 補一張:把「我們連自己落空的都掛著」做成可外傳的收據縮影。
// 🔴 OG glyph 房規(R223):next/og PNG 絕不用 ✓✕▸★→ 等 symbol glyph(豆腐方塊)。
//   ✕ 一律純 CSS 幾何(兩條旋轉長條)· 文案零箭頭 · marginTop:auto 不用 position:absolute。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 結算規則 · 連我們自己算錯的都刪不掉";

export default async function HowWeGradeOgImage() {
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
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        {/* TOP ROW · brand + label */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 24, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>
              ZONE
            </span>
            <span style={{ fontSize: 24, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>
              27
            </span>
          </div>
          <span style={{ fontSize: 14, color: "rgba(212,175,55,0.7)", letterSpacing: "0.32em", display: "flex" }}>
            結算規則 · 一場都改不了
          </span>
        </div>

        {/* HEADLINE */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40 }}>
          <span
            style={{
              fontSize: 60,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
            }}
          >
            押下鎖死 · 賽果照官方
          </span>
          <span style={{ fontSize: 30, color: "rgba(245,242,234,0.82)", marginTop: 14, display: "flex" }}>
            連我們自己算錯的,都刪不掉。
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 36,
            marginBottom: 30,
          }}
        />

        {/* ✕-落空 收據縮影(純 CSS ✕ · 零 symbol glyph) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            border: "1px solid rgba(248,113,113,0.3)",
            background: "rgba(248,113,113,0.08)",
            padding: "20px 26px",
            borderRadius: 4,
          }}
        >
          {/* 純 CSS ✕(兩條旋轉長條) */}
          <div style={{ position: "relative", display: "flex", width: 46, height: 46, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 21,
                width: 38,
                height: 5,
                background: BRAND.loss,
                borderRadius: 2,
                transform: "rotate(45deg)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 21,
                width: 38,
                height: 5,
                background: BRAND.loss,
                borderRadius: 2,
                transform: "rotate(-45deg)",
              }}
            />
          </div>
          <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.02em", display: "flex" }}>
            引擎賽前看好的場,看走眼了 —— 落空照掛、刪不掉。
          </span>
        </div>

        {/* BOTTOM · punchline + url(marginTop:auto 不用 absolute) */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span style={{ fontSize: 18, color: "rgba(245,242,234,0.62)", letterSpacing: "0.03em", display: "flex" }}>
            賣明牌的贏了截圖、輸了刪文。 我們連算錯的都掛著。
          </span>
          <span style={{ fontSize: 14, color: BRAND.gold, letterSpacing: "0.3em", fontWeight: 500, display: "flex" }}>
            /how-we-grade
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
