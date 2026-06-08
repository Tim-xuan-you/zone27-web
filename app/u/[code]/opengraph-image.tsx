import { ImageResponse } from "next/og";
import {
  BRAND,
  OG_SIZE,
  OG_CONTENT_TYPE,
  OG_BACKGROUND_IMAGE,
  goldRgba,
  boneRgba,
} from "@/lib/brand";
import { getProfileByCode, getPredictionsByCode } from "@/lib/profile-server";
import { aggregateIdentity, type CalibrationIdentity } from "@/lib/predictions";
import {
  getEngineFavorite,
  getMatchStartIso,
  getCurrentTaipeiMonthKey,
  matches as allMatches,
} from "@/lib/matches";
import { getMlbAsMatches } from "@/lib/mlb-matches";
import { normalizeProfileCode } from "@/lib/profile-code";

// ── ZONE 27 · /u/[code] 動態 OG 卡 = 含輸收據(soul-roadmap #3 收斂進 P0)─────
// 把 https://zone27-web.vercel.app/u/{code} 貼到 LINE/FB/Threads/X/Discord/Slack,
// 預覽卡自動帶上「這個人的含輸命中率 + 賽前鎖定」黑金收據 —— 不是只選贏的晒單,
// 是含贏含輸、刪不掉的證物(報馬仔結構上做不出這張)。
//
// 🔴 紅線:絕不只選贏(含 ✕ 沒中數)· 校準排非 PnL · 無賠率 · 無 emoji · 無 glyph
//   (OG 系統字常缺 ✓/✕ → 用中文「中 / 沒中」)。 暗金 · 無紅綠(輸不上紅 · 只是數字)。
// 快取:next.config headers 對 /:path*/opengraph-image 套 24h immutable(社群爬蟲不重燒)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 公開含輸戰績";

export default async function ProfileOgImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = normalizeProfileCode(raw);
  if (!code) return brandFallback();

  const profile = await getProfileByCode(code);
  if (!profile) return brandFallback();

  const name = profile.displayName || `球迷 #${profile.authorCode}`;

  // 棒球校準身分(同頁面 · OG 只取頭條數字 · 不打 football-data)。
  const { baseball } = await getPredictionsByCode(code);
  const mlbMatches = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbMatches];
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

  return receiptResponse(name, profile.authorCode, id);
}

// ── 收據卡本體 ──────────────────────────────────────────
function receiptResponse(name: string, authorCode: string, id: CalibrationIdentity) {
  const hasDecided = id.accuracy !== null;
  const showVs = id.engine.decided > 0 && id.engine.accuracy !== null;

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
        {/* TOP ROW · brand + tag */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>
              ZONE
            </span>
            <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>
              27
            </span>
          </div>
          <span style={{ fontSize: 18, color: boneRgba(0.5), letterSpacing: "0.3em" }}>
            公開戰績 · 含贏含輸
          </span>
        </div>

        {/* NAME + CODE */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 48 }}>
          <span
            style={{
              fontSize: 60,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {name}
          </span>
          <span style={{ fontSize: 22, color: goldRgba(0.7), letterSpacing: "0.22em", marginTop: 10 }}>
            #{authorCode}
          </span>
        </div>

        {/* THE NUMBER */}
        {hasDecided ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontSize: 150, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {id.accuracy}
                <span style={{ fontSize: 64, opacity: 0.6 }}>%</span>
              </span>
              <span style={{ fontSize: 26, color: boneRgba(0.55), letterSpacing: "0.2em", marginBottom: 18, display: "flex" }}>
                含輸命中率
              </span>
            </div>
            <span style={{ fontSize: 30, color: BRAND.bone, marginTop: 8, display: "flex" }}>
              押 {id.total} 場 · 中 {id.proved} · 沒中 {id.diverged}
              {showVs ? ` · 同 ${id.engine.decided} 場 引擎 ${id.engine.accuracy}%` : ""}
            </span>
            {/* the bar */}
            <div style={{ position: "relative", height: 5, background: boneRgba(0.1), marginTop: 26, display: "flex" }}>
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, id.accuracy ?? 0))}%`,
                  height: 5,
                  background: BRAND.gold,
                  boxShadow: "0 0 24px rgba(212,175,55,0.45)",
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
            <span style={{ fontSize: 64, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {id.total > 0 ? `${id.total} 手已鎖定 · 等結算` : "帳本已開始"}
            </span>
            <span style={{ fontSize: 28, color: boneRgba(0.55), marginTop: 16, display: "flex" }}>
              賽前就鎖死、含贏含輸、刪不掉。
            </span>
          </div>
        )}

        {/* BOTTOM ROW */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 18,
            color: boneRgba(0.5),
            letterSpacing: "0.28em",
          }}
        >
          <span style={{ display: "flex" }}>賽前鎖定 · 含輸 · 刪不掉</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>
            zone27-web.vercel.app/u/{authorCode}
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

// ── Brand fallback(查無此碼 / 未套 0019)──────────────────────
function brandFallback() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage: OG_BACKGROUND_IMAGE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          <span style={{ fontSize: 70, color: BRAND.gold, letterSpacing: "0.22em" }}>ZONE</span>
          <span style={{ fontSize: 70, color: BRAND.bone, letterSpacing: "0.22em" }}>27</span>
        </div>
        <span style={{ fontSize: 24, color: boneRgba(0.5), letterSpacing: "0.3em", marginTop: 24 }}>
          公開戰績 · 含贏含輸
        </span>
      </div>
    ),
    { ...OG_SIZE },
  );
}
