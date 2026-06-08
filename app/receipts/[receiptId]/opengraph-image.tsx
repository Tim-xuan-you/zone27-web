import { ImageResponse } from "next/og";
import {
  BRAND,
  OG_SIZE,
  OG_CONTENT_TYPE,
  OG_BACKGROUND_IMAGE,
  goldRgba,
  boneRgba,
} from "@/lib/brand";
import { getMatchById, getCalibration } from "@/lib/matches";

// ── ZONE 27 · /receipts/[id] 動態 OG 卡 = 單場引擎收據 ──────────────────
// 之前收據頁共用 /track-record 的通用 OG → 貼到 LINE/FB 看不出是「哪一場·命中還落空」。
// 這張卡帶上:對戰 + 引擎賽前鎖的線 + 實際比分 + 命中/落空(含輸 · 落空照掛)。
// 🔴 紅線:命中與落空同等揭露(引擎自己的收據也含輸)· 無 emoji · 無賠率 · 暗金。
//   落空用 loss 柔紅(站上 ✕ 既有色 · 非紅綠對比)· 命中用金。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 引擎收據(含輸)";

export default async function ReceiptOgImage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const { receiptId } = await params;
  const match = getMatchById(receiptId);
  if (!match || !match.finalResult) return brandFallback();

  const cal = getCalibration(match);
  if (!cal) return brandFallback();

  const fr = match.finalResult;
  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);

  const verdictText =
    cal === "proved" ? "引擎命中" : cal === "diverged" ? "引擎落空" : "平";
  const verdictColor =
    cal === "proved" ? BRAND.gold : cal === "diverged" ? BRAND.loss : BRAND.mute;

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
            引擎收據 · 賽前鎖定
          </span>
        </div>

        {/* MATCHUP */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.3em", marginBottom: 12, display: "flex" }}>
            {match.league} · {match.date}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ fontSize: 52, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>
              {match.home.name}
            </span>
            <span style={{ fontSize: 28, color: goldRgba(0.6), letterSpacing: "0.2em", margin: "0 20px", display: "flex" }}>
              vs
            </span>
            <span style={{ fontSize: 52, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>
              {match.away.name}
            </span>
          </div>
        </div>

        {/* ENGINE LINE + ACTUAL */}
        <div style={{ display: "flex", gap: 60, marginTop: 32 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              引擎賽前鎖定
            </span>
            <span style={{ fontSize: 54, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {favoritePct}
              <span style={{ fontSize: 26, opacity: 0.6 }}>%</span>
            </span>
            <span style={{ fontSize: 20, color: boneRgba(0.55), marginTop: 6, display: "flex" }}>
              {favoriteName}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              實際結果
            </span>
            <span style={{ fontSize: 54, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {fr.homeScore}:{fr.awayScore}
            </span>
            <span style={{ fontSize: 20, color: boneRgba(0.55), marginTop: 6, display: "flex" }}>
              {fr.winner === "home"
                ? `${match.home.name} 勝`
                : fr.winner === "away"
                  ? `${match.away.name} 勝`
                  : "平局"}
            </span>
          </div>
        </div>

        {/* VERDICT · 一個詞 · 命中與落空同色階規則(落空用 loss 柔紅 · 非紅綠對比)*/}
        <div style={{ display: "flex", marginTop: 34 }}>
          <span style={{ fontSize: 76, color: verdictColor, fontWeight: 400, letterSpacing: "0.08em", display: "flex" }}>
            {verdictText}
          </span>
        </div>

        {/* BOTTOM(flow · marginTop auto 推到底 · 不用 absolute 以免被內容壓到)*/}
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
          <span style={{ display: "flex" }}>賽前鎖定 · 含輸 · 改不了</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>
            zone27-web.vercel.app
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
          引擎收據 · 含輸
        </span>
      </div>
    ),
    { ...OG_SIZE },
  );
}
