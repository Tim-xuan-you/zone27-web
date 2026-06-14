import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /founders Dynamic OG ─────────────────────
// 當有人把 https://zone27-web.vercel.app/founders 貼到 LINE/FB,
// 顯示的是 GOLD 銷售情境卡(最高階年度 · 最低抽成 · NT$ 2,700/年)。
// R189「全砍前270編號」· 不再 render 數字/編號/REMAINING/CLAIM(純開放)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · GOLD · Annual Founding Class";

export default async function FoundersOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 70,
          position: "relative",
        }}
      >
        {/* TOP LEFT: brand */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 70,
            display: "flex",
            gap: 14,
          }}
        >
          <span
            style={{
              fontSize: 26,
              color: BRAND.gold,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            ZONE
          </span>
          <span
            style={{
              fontSize: 26,
              color: BRAND.bone,
              letterSpacing: "0.22em",
              fontWeight: 500,
            }}
          >
            27
          </span>
        </div>

        {/* TOP RIGHT: tier */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 70,
            fontSize: 16,
            color: "rgba(212,175,55,0.7)",
            letterSpacing: "0.35em",
            display: "flex",
          }}
        >
          GOLD · 27
        </div>

        {/* CENTER */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Tiny eyebrow */}
          <div
            style={{
              fontSize: 16,
              color: "rgba(212,175,55,0.55)",
              letterSpacing: "0.4em",
              marginBottom: 20,
              display: "flex",
            }}
          >
            最高階年度 · 抽成全站最低
          </div>

          {/* GOLD 字標(取代舊的 270 大數字)*/}
          <div
            style={{
              fontSize: 140,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              textShadow: "0 0 80px rgba(212,175,55,0.35)",
              display: "flex",
            }}
          >
            GOLD
          </div>

          <div
            style={{
              fontSize: 30,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 10,
              display: "flex",
            }}
          >
            賣分析賺最多的人
          </div>

          {/* divider */}
          <div
            style={{
              width: 200,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
              marginTop: 36,
            }}
          />

          {/* Price */}
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "baseline",
              marginTop: 30,
            }}
          >
            <span
              style={{
                fontSize: 48,
                color: BRAND.bone,
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              NT$ 2,700
            </span>
            <span
              style={{
                fontSize: 18,
                color: "rgba(245,242,234,0.5)",
                letterSpacing: "0.3em",
                display: "flex",
              }}
            >
              PER YEAR
            </span>
          </div>
        </div>

        {/* BOTTOM: status bar */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 16,
            letterSpacing: "0.3em",
          }}
        >
          <span style={{ color: "rgba(245,242,234,0.55)", display: "flex" }}>
            賣分析抽成 5% · 全站最低 · 不限量
          </span>
          <span
            style={{
              color: BRAND.gold,
              fontWeight: 500,
              display: "flex",
            }}
          >
            立即加入
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
