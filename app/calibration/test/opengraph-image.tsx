import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /calibration/test Dynamic OG ───────────────
// R232 · Agent-K-pattern OG-gap fix。 /calibration/test 是全站最強的
// 免登入病毒鉤(30 秒、自己當引擎、Wordle 式不洩題分享鈕),但它原本
// 沒有自己的 OG 卡 → 貼到 LINE/FB 抓的是 root 通用卡。 分享連結的
// 「預覽長相」就是點閱率本身,這張卡補上那個缺口。
//
// 命題 = 鏡子,不是引擎自評(/calibration 那張才是自評):這張賣的是
// 「連我們引擎也只有 5 成 7 · 換你測你自己的過度自信」—— 主動戳破
// 過度自信,正是明牌站靠來收錢的心理弱點。 他們不敢讓你測自己。
//
// 🔴 房規(R223):next/og 的 Satori 缺 Dingbat 字 → 絕不放 ✓✕▸★→ 等
// symbol glyph(會在 LINE/FB 變豆腐方塊)。 全卡只用 CJK + 拉丁 + 數字
// + 中點「·」(既有卡證實可 render)。 不放箭頭。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 校準練習 · 換你當引擎 · 測你自己有多準";

export default async function CalibrationTestOgImage() {
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
        {/* TOP ROW · brand + label */}
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
            校準練習 · 換你當引擎
          </span>
        </div>

        {/* HEADLINE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
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
            30 秒 · 不用登入 · 先照個鏡子
          </span>
          <span
            style={{
              fontSize: 76,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textShadow: "0 0 80px rgba(212,175,55,0.3)",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            你以為的把握,真有那麼準?
          </span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 40,
            marginBottom: 28,
          }}
        />

        {/* SUBTITLE · 球迷白話 */}
        <span
          style={{
            fontSize: 26,
            color: "rgba(245,242,234,0.72)",
            letterSpacing: "0.02em",
            lineHeight: 1.5,
            marginTop: 8,
            display: "flex",
            maxWidth: 980,
          }}
        >
          拿幾場打完的 CPBL 比賽藏住比分 · 你滑出把握 · 攤開對照 —— 親手摸到那道「沒人是神 · 5 成 7 是天花板」的牆。
        </span>

        {/* BOTTOM · differentiator */}
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
              letterSpacing: "0.04em",
              display: "flex",
              maxWidth: 760,
            }}
          >
            明牌站只敢喊自己神準 · 不敢讓你測你自己。
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
            /calibration/test
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
