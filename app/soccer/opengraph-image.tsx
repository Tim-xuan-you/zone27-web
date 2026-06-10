import { ImageResponse } from "next/og";
import {
  BRAND,
  OG_SIZE,
  OG_CONTENT_TYPE,
  OG_BACKGROUND_IMAGE,
  goldRgba,
  boneRgba,
} from "@/lib/brand";
import { getLockedSoccerPredictions } from "@/lib/soccer/locked";

// ── ZONE 27 · /soccer 分享預覽卡 = 引擎賽前鎖定「誠實計分板」billboard ───────────
// 世界盃每一次轉傳,連結被貼到 LINE/FB 時第一個被看到的是這張卡(不是網站本身)。
// 把它做成品牌的招牌 costly signal:引擎賽前鎖了 N 場、一場都改不了、賽後逐場對帳、含輸照留。
// 🔴 明牌站做不出這張卡 —— 他們的促銷預覽得藏輸。 我們把「落空」用 loss 柔紅、跟「命中」等大
//    擺上 billboard = 把誠實當廣告。 隨今晚比賽結算,這張卡自己從「鎖了 N 場」長成真實戰績。
// 🔴 紅線:無 emoji(Satori 系統字缺 ✓/✕ → 用中文「命中 / 落空」· 同 /u OG 房規)· 無賠率 ·
//    暗金 · 落空非紅綠對撞(loss 柔紅 · 同站上既有色)· 不報命中率(滿 30 場才報 · 只擺事實計數)。
// 純讀打包的 soccer-locked.json(0 API · 0 secret)。 0 鎖定 → 乾淨品牌卡。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 足球引擎賽前鎖定 · 賽後逐場對帳 · 含輸照留";
// 資料隨 Action 賽後 commit 進 JSON → 重佈時這張卡跟著更新(鎖定數 / 對帳戰績)。
export const revalidate = 3600;

export default function SoccerOgImage() {
  const preds = getLockedSoccerPredictions();
  const total = preds.length;
  if (total === 0) return brandFallback();

  const decided = preds.filter(
    (p) => p.verdict === "proved" || p.verdict === "diverged",
  );
  const proved = decided.filter((p) => p.verdict === "proved").length;
  const diverged = decided.length - proved;
  const settledAny = decided.length > 0;

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
            <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>ZONE</span>
            <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>27</span>
          </div>
          <span style={{ fontSize: 18, color: boneRgba(0.5), letterSpacing: "0.3em" }}>
            足球引擎 · 賽前鎖定
          </span>
        </div>

        {/* HERO · 招牌 costly signal = 鎖了幾場、改不了 */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40 }}>
          <span style={{ fontSize: 20, color: boneRgba(0.5), letterSpacing: "0.28em", marginBottom: 14, display: "flex" }}>
            引擎賽前鎖定 · 一場都改不了
          </span>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 132, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1, display: "flex" }}>
              {total}
            </span>
            <span style={{ fontSize: 44, color: BRAND.bone, fontWeight: 300, marginLeft: 18, display: "flex" }}>
              場
            </span>
          </div>
        </div>

        {/* 對帳列:已結算就把「命中 / 落空」等大擺上(落空照掛 = 招牌)· 還沒結算就講對帳承諾 */}
        {settledAny ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 36, marginTop: 34 }}>
            <span style={{ fontSize: 22, color: boneRgba(0.5), letterSpacing: "0.2em", display: "flex" }}>
              已對帳 {decided.length}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 40, color: BRAND.gold, fontWeight: 400, display: "flex" }}>命中 {proved}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 40, color: BRAND.loss, fontWeight: 400, display: "flex" }}>落空 {diverged}</span>
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 30, color: boneRgba(0.78), letterSpacing: "0.04em", marginTop: 34, display: "flex" }}>
            賽後逐場對帳 · 命中與落空都留著
          </span>
        )}

        {/* BOTTOM */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 18,
            color: boneRgba(0.5),
            letterSpacing: "0.28em",
          }}
        >
          <span style={{ display: "flex" }}>賽前鎖死 · 含輸照留 · 不刪輸的</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>zone27-web.vercel.app</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

// 0 鎖定預測 → 乾淨品牌卡(不顯示「鎖定 0 場」)。
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
          足球引擎 · 賽前鎖定 · 賽後對帳
        </span>
      </div>
    ),
    { ...OG_SIZE },
  );
}
