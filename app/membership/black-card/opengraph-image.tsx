import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /membership/black-card Dynamic OG ────────
// Round 32 W-A · Wire-up sync for Round 31 W-X3 new route。
// R62 W-A · Q3 2026 → milestone-trigger language(per Agent A R59 Vector 10)。
//
// /membership/black-card 是 BLACK UI mockup · payment infra 就緒後上線。
// OG card 必須誠實標 PRE-LAUNCH(同 page 上 status badge)否則 visitor
// 從 LINE/FB 點進來會誤以為現在可訂閱。 brand IP「方法公開」延伸到
// preview state itself。
//
// 設計原則:
//   - PRE-LAUNCH · UI MOCKUP badge 顯眼(同 page hero)
//   - 6 unlocks 條列(球迷 grammar:engine variants + 賽事討論 + 創作者抽成 + voting + Tim 筆記 + LINE 群 read-only)· R76 W-A count drift fix
//   - NT$ 500 / 31 天 + 10% 創作者抽成(vs 業界 30-50% 是降維打擊)
//   - 反向 marketing punchline:「Subscription preview. milestone-triggered.」
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · BLACK · 訂閱會員 UI preview · NT$ 500/31 天 · PRE-LAUNCH milestone-triggered · 6 unlocks · 10% 創作者抽成";

export default async function BlackCardOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.12), transparent 60%)",
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
            / MEMBERSHIP / BLACK-CARD
          </span>
        </div>

        {/* ── PRE-LAUNCH BADGE ─────────────────────── */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: BRAND.loss,
              letterSpacing: "0.4em",
              padding: "6px 14px",
              border: `1px solid ${BRAND.loss}`,
              display: "flex",
            }}
          >
            NT$ 500 / 31 天 · 手動 · 不自動續扣
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 64,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            BLACK
          </span>
          <span
            style={{
              fontSize: 44,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 8,
              display: "flex",
            }}
          >
            NT$ 500 / 31 天
          </span>
          <span
            style={{
              fontSize: 18,
              color: "rgba(245,242,234,0.65)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              marginTop: 14,
              display: "flex",
            }}
          >
            訂閱會員 · 6 unlocks · 10% 創作者抽成(vs 業界 30-50%)
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 28,
            marginBottom: 22,
          }}
        />

        {/* ── 6 UNLOCKS · R77 W-G C-1 fix · Agent B R77 audit 🔴 ·
            之前 array 有 5 UnlockRow 但 alt + visible text 都 claim「6
            unlocks」 · 5-second self-debunk · Agent A R75 SHIP 7
            OutputArtifactSwitcher 主 page UNLOCKS array 是 6 entries
            including #1 v0.3/v0.4 engine variants · OG card 之前 missing
            #1 · 此 fix add the missing first UnlockRow · count drift
            真實 close · brand IP「方法公開 · drift = 5-second self-debunk」
            axiom 物理 codify。 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <UnlockRow label="v0.3 + v0.4 engine variants(BLACK 解鎖)" />
          <UnlockRow label="/hey-tim 賽前 BLACK 優先通道 · Tim 直答" />
          <UnlockRow label="創作者抽成 10%(業界 30-50% 降維打擊)" />
          <UnlockRow label="每月 voting 影響引擎下個 ship 方向" />
          <UnlockRow label="Tim 每週工程筆記 full 版" />
          <UnlockRow label="GOLD LINE 群 read-only access" />
        </div>

        {/* ── BOTTOM · differentiator punchline ──────── */}
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
            Subscription preview. We don&apos;t take money until Q3.
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
            /membership/black-card →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function UnlockRow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          color: BRAND.gold,
          fontSize: 18,
          fontWeight: 500,
          display: "flex",
          width: 16,
        }}
      >
        ▸
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.85)",
          fontSize: 17,
          letterSpacing: "0.03em",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
