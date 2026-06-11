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
import {
  getSoccerReceipt,
  type SoccerReceiptSettled,
  type SoccerReceiptPending,
} from "@/lib/soccer/receipt";
import {
  getBaseballPendingReceipt,
  type BaseballReceiptPending,
} from "@/lib/baseball-receipt";

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
  // 足球收據(fd-*)· 三向 OG 卡 · 賽前(locked/live)= 賽前鎖定中卡 · 賽後 = 含輸判決卡。
  if (receiptId.startsWith("fd-")) {
    const sr = await getSoccerReceipt(receiptId);
    if (!sr) return brandFallback();
    return sr.phase === "settled" ? soccerOgCard(sr) : soccerOgCardPending(sr);
  }
  const match = getMatchById(receiptId);
  if (!match || !match.finalResult) {
    // 賽前 / 進行中(CPBL · 尚未結算)→ 賽前鎖定中卡(押完當下就能外傳的那張 · R220)。
    const bp = getBaseballPendingReceipt(receiptId);
    if (bp) return baseballOgCardPending(bp);
    return brandFallback();
  }

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

// 足球三向收據 OG 卡(鏡棒球 · 命中金/落空 loss 柔紅 · 無 emoji · 無賠率)。
function soccerOgCard(sr: SoccerReceiptSettled) {
  const verdictText =
    sr.verdict === "proved" ? "引擎命中" : sr.verdict === "diverged" ? "引擎落空" : "平";
  const verdictColor =
    sr.verdict === "proved" ? BRAND.gold : sr.verdict === "diverged" ? BRAND.loss : BRAND.mute;
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>ZONE</span>
            <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>27</span>
          </div>
          <span style={{ fontSize: 18, color: boneRgba(0.5), letterSpacing: "0.3em" }}>
            足球引擎收據 · 賽前鎖定
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.3em", marginBottom: 12, display: "flex" }}>
            {sr.competitionName}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>{sr.home}</span>
            <span style={{ fontSize: 26, color: goldRgba(0.6), letterSpacing: "0.2em", margin: "0 20px", display: "flex" }}>vs</span>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>{sr.away}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 60, marginTop: 30 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              引擎賽前看好
            </span>
            <span style={{ fontSize: 50, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {sr.favoredPct}
              <span style={{ fontSize: 24, opacity: 0.6 }}>%</span>
            </span>
            <span style={{ fontSize: 20, color: boneRgba(0.55), marginTop: 6, display: "flex" }}>{sr.favoredLabel}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              90 分鐘結果
            </span>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {sr.finalHome}:{sr.finalAway}
            </span>
            <span style={{ fontSize: 20, color: boneRgba(0.55), marginTop: 6, display: "flex" }}>
              {sr.outcome === "home" ? `${sr.home} 勝` : sr.outcome === "away" ? `${sr.away} 勝` : "和局"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 30 }}>
          <span style={{ fontSize: 72, color: verdictColor, fontWeight: 400, letterSpacing: "0.08em", display: "flex" }}>
            {verdictText}
          </span>
        </div>

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
          <span style={{ display: "flex", color: goldRgba(0.65) }}>zone27-web.vercel.app</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

// 賽前(locked)/ 已開賽待對帳(live)足球收據 OG 卡 = 押完當下就能外傳的那張。
// 沒有結果/判決 → 不假裝命中:右欄改秀「開賽時間」· 大字改「賽前鎖定中」(金 · 不是 verdict)。
function soccerOgCardPending(sr: SoccerReceiptPending) {
  const locked = sr.phase === "locked";
  const bigWord = locked ? "賽前鎖定中" : "待對帳";
  const rightLabel = locked ? "開賽時間" : "賽況";
  const rightValue = locked ? `${sr.kickoffTPE}` : "已開賽 · 終場後揭曉";
  // 已開賽(live)的卡絕不掛「賽前鎖定」標頭/「結果還不存在」結語 = 對已開踢的場說謊(honesty redline)。
  const headerTag = locked ? "賽前鎖定" : "待對帳";
  const footerLine = locked
    ? "鎖在結果還不存在的時候 · 改不了"
    : "賽前鎖死 · 終場後對帳 · 改不了";
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>ZONE</span>
            <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>27</span>
          </div>
          <span style={{ fontSize: 18, color: boneRgba(0.5), letterSpacing: "0.3em" }}>
            足球引擎收據 · {headerTag}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.3em", marginBottom: 12, display: "flex" }}>
            {sr.competitionName}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>{sr.home}</span>
            <span style={{ fontSize: 26, color: goldRgba(0.6), letterSpacing: "0.2em", margin: "0 20px", display: "flex" }}>vs</span>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>{sr.away}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 60, marginTop: 30 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              引擎賽前看好
            </span>
            <span style={{ fontSize: 50, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {sr.favoredPct}
              <span style={{ fontSize: 24, opacity: 0.6 }}>%</span>
            </span>
            <span style={{ fontSize: 20, color: boneRgba(0.55), marginTop: 6, display: "flex" }}>{sr.favoredLabel}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              {rightLabel}
            </span>
            <span style={{ fontSize: 30, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.01em", marginTop: 14, display: "flex" }}>
              {rightValue}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 30 }}>
          <span style={{ fontSize: 66, color: BRAND.gold, fontWeight: 400, letterSpacing: "0.06em", display: "flex" }}>
            {bigWord}
          </span>
        </div>

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
          <span style={{ display: "flex" }}>{footerLine}</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>zone27-web.vercel.app</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

// 賽前(locked)/ 已開賽待對帳(live)CPBL 收據 OG 卡 = 押完當下就能外傳的那張(R220)。
// 鏡 soccerOgCardPending:沒有結果/判決 → 不假裝命中(右欄改秀「開賽時間」· 大字「賽前鎖定中」金)。
// 🔴 已開賽(live)絕不掛「賽前鎖定」標頭/「結果還不存在」結語 = 對已開打的場說謊。
function baseballOgCardPending(bp: BaseballReceiptPending) {
  const locked = bp.phase === "locked";
  const bigWord = locked ? "賽前鎖定中" : "待對帳";
  const rightLabel = locked ? "開賽時間" : "賽況";
  const rightValue = locked ? bp.startDisplay : "已開賽 · 終場後揭曉";
  const favLabel = bp.favoriteName ?? "引擎難分 · 約五五波";
  const headerTag = locked ? "賽前鎖定" : "待對帳";
  const footerLine = locked
    ? "鎖在結果還不存在的時候 · 改不了"
    : "賽前鎖死 · 終場後對帳 · 改不了";
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>ZONE</span>
            <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>27</span>
          </div>
          <span style={{ fontSize: 18, color: boneRgba(0.5), letterSpacing: "0.3em" }}>
            引擎收據 · {headerTag}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.3em", marginBottom: 12, display: "flex" }}>
            {bp.league} · {bp.dateIso}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>{bp.homeName}</span>
            <span style={{ fontSize: 26, color: goldRgba(0.6), letterSpacing: "0.2em", margin: "0 20px", display: "flex" }}>vs</span>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>{bp.awayName}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 60, marginTop: 30 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              引擎賽前看好
            </span>
            <span style={{ fontSize: 50, color: BRAND.gold, fontWeight: 300, letterSpacing: "-0.02em", display: "flex" }}>
              {bp.favoritePct}
              <span style={{ fontSize: 24, opacity: 0.6 }}>%</span>
            </span>
            <span style={{ fontSize: 20, color: boneRgba(0.55), marginTop: 6, display: "flex" }}>{favLabel}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, color: boneRgba(0.45), letterSpacing: "0.25em", marginBottom: 6, display: "flex" }}>
              {rightLabel}
            </span>
            <span style={{ fontSize: 30, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.01em", marginTop: 14, display: "flex" }}>
              {rightValue}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 30 }}>
          <span style={{ fontSize: 66, color: BRAND.gold, fontWeight: 400, letterSpacing: "0.06em", display: "flex" }}>
            {bigWord}
          </span>
        </div>

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
          <span style={{ display: "flex" }}>{footerLine}</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>zone27-web.vercel.app</span>
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
