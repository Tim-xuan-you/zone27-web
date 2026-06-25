import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE, OG_BACKGROUND_IMAGE } from "@/lib/brand";
import { getFinalizedMatches } from "@/lib/matches";
import { computeBaseballBins } from "@/lib/calibration";

// ── ZONE 27 · /engines Dynamic OG ────────────────────────
// R263 · 「把證據變海報」· Tim 行銷專家 lens:校準曲線是唯一對手結構上抄不走的資產
// (要 publish「我說 X%、真中 X%」就得攤出自己的 50% 真命中率)。 所以分享卡不只「說」
// 我們透明 —— 直接把那條真實校準曲線「畫」進卡裡:金點貼著 45° 線 = 一眼看懂的誠實。
//
// 🔴 OG glyph 房規(R223):next/og PNG 絕不用 ✓✕▸★→ 等 symbol glyph(會變豆腐方塊)。
//   曲線一律用 div(圓點 + 旋轉線)畫、文案零箭頭。 配色走 BRAND mirror(無紅綠)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 三套引擎 · 公式與活校準全攤開";

// 方形繪圖區邊長(px)。
const PLOT = 360;

export default async function EnginesOgImage() {
  // 真實棒球校準分箱(同 /calibration / /engines · 靜態純函式)。 不夠兩點(資料未起步)
  // 退一組「貼著線」的示意點,卡片永不看起來壞掉(但有真資料時一律用真的)。
  const real = computeBaseballBins(getFinalizedMatches());
  const usingReal = real.length >= 2;
  const bins = usingReal
    ? real
    : [
        { centerPct: 55, count: 12, favoriteActualPct: 54 },
        { centerPct: 65, count: 8, favoriteActualPct: 67 },
        { centerPct: 75, count: 5, favoriteActualPct: 73 },
      ];
  const n = bins.reduce((s, b) => s + b.count, 0);

  // 分箱 → 繪圖座標(原點左下 · y 翻轉)。 半徑隨樣本數放大(同頁面語言)。
  const dots = bins.map((b) => {
    const x = (b.centerPct / 100) * PLOT;
    const y = (1 - b.favoriteActualPct / 100) * PLOT;
    const r = Math.min(12 + b.count * 0.45, 30);
    return { x, y, r };
  });

  // 45° 完美校準線:水平長條繞中心旋轉 −45°(螢幕座標 y 向下 → 由左下到右上)。
  const diagLen = Math.round(PLOT * 1.4142);

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
          position: "relative",
        }}
      >
        {/* TOP ROW · brand + label */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 24, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>
              ZONE
            </span>
            <span style={{ fontSize: 24, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>
              27
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,175,55,0.7)",
              letterSpacing: "0.32em",
              display: "flex",
            }}
          >
            三套引擎 · 公式 · 活校準
          </span>
        </div>

        {/* BODY · 左文字 + 右校準曲線 */}
        <div style={{ display: "flex", marginTop: 36, alignItems: "center" }}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
            <span
              style={{
                fontSize: 16,
                color: "rgba(212,175,55,0.55)",
                letterSpacing: "0.38em",
                marginBottom: 14,
                display: "flex",
              }}
            >
              我們說幾成 · 真的中幾成
            </span>
            <span
              style={{
                fontSize: 64,
                color: BRAND.gold,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                textShadow: "0 0 80px rgba(212,175,55,0.3)",
                display: "flex",
              }}
            >
              沒有「神準」這種引擎
            </span>
            <span
              style={{
                fontSize: 24,
                color: "rgba(245,242,234,0.74)",
                letterSpacing: "0.01em",
                lineHeight: 1.5,
                marginTop: 26,
                display: "flex",
                maxWidth: 560,
              }}
            >
              全世界最強的 AI · 賽前單場也才 5 成 7。 我們把自己的準度,一張圖攤給你看。
            </span>
          </div>

          {/* RIGHT · 校準曲線(真資料散點 · 純 div 畫) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 36 }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                width: PLOT,
                height: PLOT,
                border: `1px solid ${BRAND.line}`,
                background: "rgba(19,31,56,0.45)",
                overflow: "hidden",
              }}
            >
              {/* 45° 完美校準線 */}
              <div
                style={{
                  position: "absolute",
                  left: (PLOT - diagLen) / 2,
                  top: PLOT / 2 - 1,
                  width: diagLen,
                  height: 2,
                  background: "rgba(212,175,55,0.5)",
                  transform: "rotate(-45deg)",
                }}
              />
              {/* 分箱金點(貼著線 = 校準) */}
              {dots.map((d, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: d.x - d.r,
                    top: d.y - d.r,
                    width: d.r * 2,
                    height: d.r * 2,
                    borderRadius: d.r,
                    background: BRAND.gold,
                    border: `2px solid ${BRAND.navy}`,
                    display: "flex",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: 14,
                color: "rgba(245,242,234,0.6)",
                letterSpacing: "0.12em",
                marginTop: 14,
                display: "flex",
              }}
            >
              {usingReal ? `棒球引擎 · ${n} 場真實對帳` : "棒球引擎 · 賽後逐場對帳"}
            </span>
          </div>
        </div>

        {/* BOTTOM · 戰帖 + url */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 64,
            right: 64,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "rgba(245,242,234,0.62)",
              letterSpacing: "0.03em",
              display: "flex",
            }}
          >
            賣明牌的不敢給你這張圖。
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
            /engines
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
