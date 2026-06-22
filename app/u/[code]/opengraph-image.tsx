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
import { reckoningStar } from "@/lib/reckoning-star";
import {
  getEngineFavorite,
  getMatchStartIso,
  getCurrentTaipeiMonthKey,
  matches as allMatches,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbLockedMatches } from "@/lib/mlb-matches";
import { normalizeProfileCode } from "@/lib/profile-code";

// ── ZONE 27 · /u/[code] 動態 OG 卡 = 含輸收據(soul-roadmap #3 收斂進 P0)─────
// 把 https://zone27.com.tw/u/{code} 貼到 LINE/FB/Threads/X/Discord/Slack,
// 預覽卡自動帶上「這個人的含輸命中率 + 賽前鎖定」黑金收據 —— 不是只選贏的曬單,
// 是含贏含輸、刪不掉的證物(報馬仔結構上做不出這張)。
//
// 🔴 紅線:絕不只選贏(含 ✕ 沒中數)· 校準排非 PnL · 無賠率 · 無 emoji · 無 glyph
//   (OG 系統字常缺 ✓/✕ → 用中文「中 / 沒中」)。 暗金 · 無紅綠(輸不上紅 · 只是數字)。
// 快取:next.config headers 對 /:path*/opengraph-image 套 24h immutable(社群爬蟲不重燒)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 公開含輸戰績";

// 「贏過引擎」金章只在樣本夠穩(≥ 此數的同場引擎對照)才出 —— 防小樣本(押 2 場贏 1)
// 就喊贏過機器=過度宣稱(燒 57% 誠實王牌)。 8 = 全站「數字才不跳」的 FIRM 門檻(同
// ProfileView FIRM / CalibrationIdentityCard SAMPLE_FIRM)· 比 /ladder 上榜 10 略寬,
// 但已足以讓「贏過公開引擎」這句話站得住。 含輸照算(沒中數仍印在卡上 · 不是只選贏)。
const ENGINE_FLEX_MIN = 8;

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
  // ⚠️ MLB 賽果用永久鎖定源(getMlbLockedMatches 放最後 → 下游 new Map『後者勝出』· 永久源蓋過 live)·
  // live 窗只在永久源缺該場時補 —— 分享預覽卡是最會被外傳的「廣告」· 用 2 天 live 窗 → 招牌數字每天
  // 亂跳少算 + 「locked 已 grade 但 live 回非 final → null 蓋掉 winner」窄反例倒退 pending(同頁面修法)。
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

  return receiptResponse(name, profile.authorCode, id);
}

// ── 收據卡本體 ──────────────────────────────────────────
function receiptResponse(name: string, authorCode: string, id: CalibrationIdentity) {
  const hasDecided = id.accuracy !== null;
  const showVs = id.engine.decided > 0 && id.engine.accuracy !== null;
  // 贏過引擎金章:真贏(含輸對照)+ 樣本夠穩才出 · 同頁面 standingVerdict「贏過引擎」一致,
  // 但門檻更嚴(viral 卡不靠小樣本喊贏)· 報馬仔結構上掛不出這句(他們沒有公開引擎當靶)。
  const beatEngine = id.beatEngine === true && id.engine.decided >= ENGINE_FLEX_MIN;
  // 對帳之星(≥30 含輸贏過引擎)· 比下面「+N 分」金章更高一階的米其林榮譽 —— 分享卡上的最高 flex。
  const star = reckoningStar(id);

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
        <div style={{ display: "flex", flexDirection: "column", marginTop: 38 }}>
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
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26 }}>
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
            {/* 贏過引擎金章 vs 準度條 · 二擇一(贏了引擎就掛金章 · 進度條變多餘噪音)·
                金章只在真贏 + 樣本夠穩才出(否則照常顯示準度條 · 不喊空話)·
                無 ✓ glyph(OG 字缺 → 純中文)· navy on gold = 全卡最亮的一句。
                R234:帶上「+N 分」具體數字(edgeVsEnginePts 已算好)—— 分享卡上「贏過引擎」是口號,
                「贏過引擎 +9 分」是無法反駁的證物(Strava 永遠把數字放最大)· 只在 >0 才印,守誠實。 */}
            {star.earned ? (
              // 對帳之星 = 分享卡最高榮譽(米其林式 · ≥30 含輸贏過引擎)· 幾何金星(SVG polygon ·
              // 🔴 絕不用 ★ glyph → Satori 豆腐)· 比「+N 分」金章更稀有、更想要。
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18 }}>
                <svg width="48" height="48" viewBox="0 0 32 32">
                  <polygon
                    points="16,2 19.5,11.5 29.5,11.5 21.5,18 24.5,29 16,22.5 7.5,29 10.5,18 2.5,11.5 12.5,11.5"
                    fill={BRAND.gold}
                    fillOpacity="0.95"
                  />
                </svg>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 36, color: BRAND.gold, letterSpacing: "0.06em", fontWeight: 500, display: "flex" }}>
                    對帳之星
                  </span>
                  <span style={{ fontSize: 22, color: boneRgba(0.6), letterSpacing: "0.04em", marginTop: 2, display: "flex" }}>
                    {id.decided} 場含輸贏過引擎
                    {star.edge !== null && star.edge > 0 ? ` +${star.edge} 分` : ""} · 全站極少人有
                  </span>
                </div>
              </div>
            ) : beatEngine ? (
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
                  {id.edgeVsEnginePts !== null && id.edgeVsEnginePts > 0
                    ? `贏過公開引擎 +${id.edgeVsEnginePts} 分`
                    : "贏過公開引擎"}
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
          {/* 贏過引擎金章已掛時 · 隱去此標語(留白給金章呼吸 · 含輸訊息上方已有 3 處)·
              空 span 仍占 space-between 左槽 → URL 維持靠右。 */}
          <span style={{ display: "flex" }}>{beatEngine ? "" : "賽前鎖定 · 含輸 · 刪不掉"}</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>
            zone27.com.tw/u/{authorCode}
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
