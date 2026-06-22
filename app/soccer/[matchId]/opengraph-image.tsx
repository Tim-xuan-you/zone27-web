import { ImageResponse } from "next/og";
import { getSoccerMatchById } from "@/lib/soccer/football-data";
import { toDisplayPercents, enginePickOf } from "@/lib/soccer/engine";
import { kickoffTaipei } from "@/lib/soccer/locked";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /soccer/[matchId] · 足球單場 Dynamic OG ──────────
// R232「Polymarket go」· 棒球詳情頁早有專屬 OG 卡(app/matches/[gameId]),
// 足球詳情頁卻沒有 → 世界盃期間有人把 /soccer/fd-xxxx 貼到 LINE/FB,抓的是
// root 通用卡。 這張補上「分享一場比賽 = 分享引擎賽前鎖定的那條線」(Polymarket
// 的招牌:市場本身就是可外傳的物件),三向勝/平/負 + 賽前鎖死框架。
//
// 🔴 OG 房規(R223):next/og Satori 缺 Dingbat → 0 symbol glyph(✓✕▸★→ 全禁,
// 會變 LINE 豆腐字)。 全卡只用 CJK + 拉丁 + 數字 + 中點「·」+ VS。 不放箭頭。
// getSoccerMatchById:鎖定場直接讀 soccer-locked.json(0 API · 快),非鎖才打 API。
// 三種狀態:有預測 → 三向線卡 / 有場無預測(覆蓋建置中)→ 誠實素卡 / 查無 → 品牌卡。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 足球引擎賽前開盤";

export default async function SoccerMatchOgImage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const m = await getSoccerMatchById(matchId);

  if (!m) return brandFallback();

  const pred = m.prediction;
  const ko = kickoffTaipei(m.dateISO);

  // 共用版面外殼(brand 列 + 兩隊 + meta),中段內容依有無預測切換。
  const pick = pred ? enginePickOf(pred) : null;
  const d = pred ? toDisplayPercents(pred) : null;
  const favoredLabel =
    pick === "home" ? m.home : pick === "away" ? m.away : "和局";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.15), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* TOP ROW: brand + 聯賽 */}
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
          <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 17, color: "rgba(245,242,234,0.5)", letterSpacing: "0.28em" }}>
            <span style={{ display: "flex" }}>{m.competitionName}</span>
            <span style={{ color: "rgba(212,175,55,0.6)" }}>·</span>
            <span style={{ display: "flex" }}>足球引擎</span>
          </div>
        </div>

        {/* KICKOFF + 鎖定徽章 */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 18 }}>
          <span style={{ fontSize: 16, color: "rgba(212,175,55,0.75)", letterSpacing: "0.25em", display: "flex" }}>
            {ko} TPE
          </span>
          {m.locked && (
            <span
              style={{
                fontSize: 14,
                color: "rgba(212,175,55,0.9)",
                letterSpacing: "0.25em",
                border: "1px solid rgba(212,175,55,0.45)",
                padding: "3px 10px",
                display: "flex",
              }}
            >
              賽前鎖定
            </span>
          )}
        </div>

        {/* TEAMS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 460 }}>
            <span style={{ fontSize: 15, color: "rgba(245,242,234,0.45)", letterSpacing: "0.3em", marginBottom: 10 }}>
              主 HOME
            </span>
            <span style={{ fontSize: 56, color: pick === "home" ? BRAND.gold : BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              {m.home}
            </span>
          </div>
          <div style={{ fontSize: 28, color: "rgba(212,175,55,0.6)", letterSpacing: "0.3em", alignSelf: "center", display: "flex" }}>
            VS
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: 460 }}>
            <span style={{ fontSize: 15, color: "rgba(245,242,234,0.45)", letterSpacing: "0.3em", marginBottom: 10 }}>
              客 AWAY
            </span>
            <span style={{ fontSize: 56, color: pick === "away" ? BRAND.gold : BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, textAlign: "right" }}>
              {m.away}
            </span>
          </div>
        </div>

        {/* 引擎三向線 OR 覆蓋建置中 */}
        {pred && d ? (
          <div style={{ marginTop: 46, display: "flex", flexDirection: "column" }}>
            {/* 三個數字:主勝 · 和 · 客勝 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <ThreeWayNum label="主勝" value={d.homeWin} gold={pick === "home"} />
              <ThreeWayNum label="和" value={d.draw} gold={pick === "draw"} />
              <ThreeWayNum label="客勝" value={d.awayWin} gold={pick === "away"} />
            </div>
            {/* 三段條(home | draw | away)· 引擎看好的那段亮金發光 */}
            <div style={{ display: "flex", height: 6, width: "100%", overflow: "hidden", borderRadius: 4, background: "rgba(245,242,234,0.08)" }}>
              <div style={{ width: `${d.homeWin}%`, height: 6, background: pick === "home" ? BRAND.gold : "rgba(245,242,234,0.28)", boxShadow: pick === "home" ? "0 0 24px rgba(212,175,55,0.5)" : "none" }} />
              <div style={{ width: `${d.draw}%`, height: 6, background: pick === "draw" ? BRAND.gold : "rgba(138,147,168,0.4)", boxShadow: pick === "draw" ? "0 0 24px rgba(212,175,55,0.5)" : "none" }} />
              <div style={{ width: `${d.awayWin}%`, height: 6, background: pick === "away" ? BRAND.gold : "rgba(245,242,234,0.28)", boxShadow: pick === "away" ? "0 0 24px rgba(212,175,55,0.5)" : "none" }} />
            </div>
            <span style={{ fontSize: 20, color: "rgba(245,242,234,0.68)", letterSpacing: "0.04em", marginTop: 18, display: "flex" }}>
              引擎看好 {favoredLabel} · 預期進球 {pred.xgHome.toFixed(1)}–{pred.xgAway.toFixed(1)} · 自己算的,不是盤口
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 46, display: "flex" }}>
            <span style={{ fontSize: 24, color: "rgba(245,242,234,0.6)", letterSpacing: "0.03em", lineHeight: 1.5, display: "flex", maxWidth: 1000 }}>
              引擎覆蓋建置中 · 這個聯賽的戰績還不夠讓引擎誠實開盤。 賭場什麼都敢開,我們只開算得出的。
            </span>
          </div>
        )}

        {/* BOTTOM: framing + url */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 16,
            color: "rgba(245,242,234,0.5)",
            letterSpacing: "0.22em",
          }}
        >
          <span style={{ display: "flex" }}>賽前鎖死 · 賽後逐場對帳 · 含贏含輸</span>
          <span style={{ display: "flex", color: "rgba(212,175,55,0.65)" }}>zone27.com.tw</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function ThreeWayNum({
  label,
  value,
  gold,
}: {
  label: string;
  value: number;
  gold: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontSize: 60, fontWeight: 300, color: gold ? BRAND.gold : "rgba(245,242,234,0.55)", letterSpacing: "-0.02em", display: "flex" }}>
        {value}
        <span style={{ fontSize: 26, opacity: 0.6, marginLeft: 2 }}>%</span>
      </span>
      <span style={{ fontSize: 16, color: gold ? "rgba(212,175,55,0.8)" : "rgba(245,242,234,0.4)", letterSpacing: "0.25em", marginTop: 4, display: "flex" }}>
        {label}
      </span>
    </div>
  );
}

// ── Brand fallback ─────────────────────────────────────
function brandFallback() {
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
          gap: 18,
        }}
      >
        <span style={{ fontSize: 70, color: BRAND.gold, letterSpacing: "0.22em" }}>ZONE</span>
        <span style={{ fontSize: 70, color: BRAND.bone, letterSpacing: "0.22em" }}>27</span>
      </div>
    ),
    { ...size }
  );
}
