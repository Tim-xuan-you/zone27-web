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
  matches as allMatches,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { normalizeProfileCode } from "@/lib/profile-code";
import {
  normalizeSeasonPeriod,
  filterBaseballByMonth,
  monthLabel,
} from "@/lib/season-recap";

// ── ZONE 27 · /u/[code]/season/[YYYY-MM] 動態 OG 卡 = 月度含輸收據 ──────────────
// 把賽季回顧連結貼到 LINE/FB/Threads/X,預覽自動帶上「這個月含輸命中率 + 賽前鎖定」
// 黑金月度收據。 同 /u/[code] OG 同一套視覺 · 只是換成單月 + 月份標。 報馬仔結構上做不出
//(他們靠藏輸活)。 🔴 絕不只選贏(含沒中數)· 無賠率 · 無 emoji/glyph · 暗金無紅綠。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 月度賽季回顧 · 含贏含輸";

// 「贏過引擎」金章門檻(同 /u OG)· 單月達 8 場同場引擎對照才喊贏(否則顯示準度條)。
const ENGINE_FLEX_MIN = 8;

export default async function SeasonOgImage({
  params,
}: {
  params: Promise<{ code: string; period: string }>;
}) {
  const { code: rawCode, period: rawPeriod } = await params;
  const code = normalizeProfileCode(rawCode);
  const period = normalizeSeasonPeriod(rawPeriod);
  if (!code || !period) return brandFallback();

  const profile = await getProfileByCode(code);
  if (!profile) return brandFallback();

  const name = profile.displayName || `球迷 #${profile.authorCode}`;
  const label = monthLabel(period);

  // 棒球本月校準身分(同 /u OG · picks 先按月切片)。 MLB 永久源放最後蓋過 live。
  const { baseball } = await getPredictionsByCode(code);
  const mBaseball = filterBaseballByMonth(baseball, period);
  const mlbLive = await getMlbAsMatches();
  const allWithMlb = [...allMatches, ...mlbLive, ...getMlbLockedMatches()];
  const id = aggregateIdentity(
    mBaseball,
    allWithMlb.map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      engineFav: getEngineFavorite(m),
      startISO: getMatchStartIso(m),
    })),
    period,
  );

  return receiptResponse(name, label, id);
}

function receiptResponse(name: string, label: string, id: CalibrationIdentity) {
  const hasDecided = id.accuracy !== null;
  const showVs = id.engine.decided > 0 && id.engine.accuracy !== null;
  const beatEngine = id.beatEngine === true && id.engine.decided >= ENGINE_FLEX_MIN;

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
        {/* TOP ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>
              ZONE
            </span>
            <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>
              27
            </span>
          </div>
          <span style={{ fontSize: 18, color: boneRgba(0.5), letterSpacing: "0.3em" }}>
            賽季回顧 · 含贏含輸
          </span>
        </div>

        {/* NAME + MONTH */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 38 }}>
          <span style={{ fontSize: 60, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            {name}
          </span>
          <span style={{ fontSize: 26, color: goldRgba(0.75), letterSpacing: "0.18em", marginTop: 10 }}>
            {label} · 回顧
          </span>
        </div>

        {/* THE NUMBER */}
        {hasDecided ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontSize: 142, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {id.accuracy}
                <span style={{ fontSize: 62, opacity: 0.6 }}>%</span>
              </span>
              <span style={{ fontSize: 26, color: boneRgba(0.55), letterSpacing: "0.2em", marginBottom: 18, display: "flex" }}>
                本月含輸命中率
              </span>
            </div>
            <span style={{ fontSize: 30, color: BRAND.bone, marginTop: 8, display: "flex" }}>
              押 {id.total} 場 · 中 {id.proved} · 沒中 {id.diverged}
              {showVs ? ` · 同 ${id.engine.decided} 場 引擎 ${id.engine.accuracy}%` : ""}
            </span>
            {beatEngine ? (
              <div style={{ display: "flex", marginTop: 16 }}>
                <span
                  style={{
                    fontSize: 27,
                    color: BRAND.navy,
                    background: BRAND.gold,
                    padding: "9px 24px",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  本月贏過公開引擎
                </span>
              </div>
            ) : (
              <div style={{ position: "relative", height: 5, background: boneRgba(0.1), marginTop: 18, display: "flex" }}>
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, id.accuracy ?? 0))}%`,
                    height: 5,
                    background: BRAND.gold,
                    boxShadow: "0 0 24px rgba(212,175,55,0.45)",
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
            <span style={{ fontSize: 60, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {id.total > 0 ? `${id.total} 手鎖在這個月 · 等結算` : "這個月的帳本剛開始"}
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
          <span style={{ display: "flex" }}>{beatEngine ? "" : "賽前鎖定 · 含輸 · 刪不掉"}</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>
            zone27.com.tw
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

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
          賽季回顧 · 含贏含輸
        </span>
      </div>
    ),
    { ...OG_SIZE },
  );
}
