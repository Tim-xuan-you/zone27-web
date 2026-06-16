import { ImageResponse } from "next/og";
import { BRAND, goldRgba, boneRgba } from "@/lib/brand";
import { getProfileByCode, getPredictionsByCode } from "@/lib/profile-server";
import { aggregateIdentity, type CalibrationIdentity } from "@/lib/predictions";
import { reckoningStar } from "@/lib/reckoning-star";
import {
  getEngineFavorite,
  getMatchStartIso,
  getCurrentTaipeiMonthKey,
  matches as allMatches,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { normalizeProfileCode } from "@/lib/profile-code";

// ── ZONE 27 · /u/[code]/badge · 可攜憑證徽章圖(貼到 bio / email 簽名 / LinkedIn / 論壇)─────
// 一張穩定網址的小圖 = 你的 ZONE 27 準度榮譽,貼到任何地方。 帶上「公開可驗證」+ /u 連結,
// 讓第三方點回來自己查(含輸帳本 = 報馬仔結構上偽造不出)。 對帳之星達標時掛幾何金星 = 最高 flex。
//
// 🔴 紅線:含輸照算(命中率含落空)· 校準/贏過引擎非 PnL/連勝 · 0 emoji · 0 symbol glyph
//   (星用 SVG polygon 非 ★ · 避 Satori 豆腐)· 暗金無紅綠 · 不灌水(無對照不喊贏引擎)。
// 快取:同 OG 卡走 next.config 對 /:path*/badge 的 immutable header(若未涵蓋則預設)。 0019 未套/查無 → 中性品牌徽章。
// ─────────────────────────────────────────────────────

export const runtime = "nodejs";
const SIZE = { width: 680, height: 200 } as const;
// 「贏過引擎」徽章門檻(同 OG 卡 ENGINE_FLEX_MIN · 小樣本不喊贏);對帳之星另走 reckoningStar(≥30)。
const ENGINE_FLEX_MIN = 8;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code: raw } = await ctx.params;
  const code = normalizeProfileCode(raw);
  if (!code) return brandBadge();

  const profile = await getProfileByCode(code);
  if (!profile) return brandBadge();

  const name = profile.displayName || `球迷 #${profile.authorCode}`;
  const { baseball } = await getPredictionsByCode(code);
  const mlbLive = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbLive, ...getMlbLockedMatches()];
  const id = aggregateIdentity(
    baseball,
    allWithMlb.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: getEngineFavorite(m),
      startISO: getMatchStartIso(m),
    })),
    getCurrentTaipeiMonthKey(),
  );

  return badge(name, profile.authorCode, id);
}

function StarGlyph({ size = 58 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <polygon
        points="16,2 19.5,11.5 29.5,11.5 21.5,18 24.5,29 16,22.5 7.5,29 10.5,18 2.5,11.5 12.5,11.5"
        fill={BRAND.gold}
        fillOpacity="0.95"
      />
    </svg>
  );
}

function badge(name: string, authorCode: string, id: CalibrationIdentity) {
  const hasDecided = id.accuracy !== null;
  const star = reckoningStar(id);
  const beatEngine =
    id.beatEngine === true && id.engine.decided >= ENGINE_FLEX_MIN;
  // 第二行的「資歷句」:對帳之星 > 贏過引擎 +N > 含輸場數 > 帳本剛開始。
  const credline = star.earned
    ? `對帳之星 · 贏過引擎${star.edge !== null && star.edge > 0 ? ` +${star.edge}` : ""}`
    : beatEngine
      ? `贏過公開引擎${id.edgeVsEnginePts !== null && id.edgeVsEnginePts > 0 ? ` +${id.edgeVsEnginePts} 分` : ""}`
      : hasDecided
        ? `押 ${id.total} 場 · 中 ${id.proved} · 沒中 ${id.diverged}`
        : "賽前鎖定 · 含贏含輸 · 刪不掉";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 90% at 12% 50%, rgba(212,175,55,0.16), transparent 60%)",
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          border: `1px solid ${goldRgba(0.3)}`,
        }}
      >
        {/* 左:對帳之星(達標)· 否則 ZONE 27 直排小標 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 78,
            height: 78,
            marginRight: 26,
          }}
        >
          {star.earned ? (
            <StarGlyph size={62} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 24, color: BRAND.gold, letterSpacing: "0.2em", fontWeight: 500 }}>Z</span>
              <span style={{ fontSize: 24, color: BRAND.bone, letterSpacing: "0.2em", fontWeight: 500 }}>27</span>
            </div>
          )}
        </div>

        {/* 中:名字 + THE number + 資歷句 */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 22, color: boneRgba(0.7), letterSpacing: "0.02em", display: "flex" }}>
            {name}
          </span>
          {hasDecided ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 2 }}>
              <span style={{ fontSize: 64, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
                {id.accuracy}
                <span style={{ fontSize: 30, opacity: 0.6 }}>%</span>
              </span>
              <span style={{ fontSize: 20, color: boneRgba(0.5), letterSpacing: "0.16em", marginBottom: 8, display: "flex" }}>
                含輸命中率
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 38, color: BRAND.bone, fontWeight: 300, marginTop: 4, display: "flex" }}>
              帳本已開始
            </span>
          )}
          <span style={{ fontSize: 21, color: goldRgba(0.85), letterSpacing: "0.03em", marginTop: 4, display: "flex" }}>
            {credline}
          </span>
        </div>

        {/* 右:ZONE 27 mark + 公開可驗證 + 連結 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            marginLeft: 22,
            borderLeft: `1px solid ${boneRgba(0.12)}`,
            paddingLeft: 22,
            height: 120,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 19, color: BRAND.gold, letterSpacing: "0.2em", fontWeight: 500 }}>ZONE</span>
            <span style={{ fontSize: 19, color: BRAND.bone, letterSpacing: "0.2em", fontWeight: 500 }}>27</span>
          </div>
          <span style={{ fontSize: 14, color: boneRgba(0.5), letterSpacing: "0.18em", marginTop: 10, display: "flex" }}>
            公開可驗證 · 含輸
          </span>
          <span style={{ fontSize: 13, color: goldRgba(0.7), letterSpacing: "0.04em", marginTop: 6, display: "flex" }}>
            /u/{authorCode}
          </span>
        </div>
      </div>
    ),
    { ...SIZE },
  );
}

function brandBadge() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          border: `1px solid ${goldRgba(0.3)}`,
        }}
      >
        <span style={{ fontSize: 40, color: BRAND.gold, letterSpacing: "0.22em" }}>ZONE</span>
        <span style={{ fontSize: 40, color: BRAND.bone, letterSpacing: "0.22em" }}>27</span>
        <span style={{ fontSize: 18, color: boneRgba(0.5), letterSpacing: "0.2em", marginLeft: 10 }}>
          公開可驗證戰績
        </span>
      </div>
    ),
    { ...SIZE },
  );
}
