import { ImageResponse } from "next/og";
import {
  BRAND,
  OG_SIZE,
  OG_CONTENT_TYPE,
  OG_BACKGROUND_IMAGE,
  goldRgba,
  boneRgba,
} from "@/lib/brand";
import { resolveChallenge } from "@/lib/challenge";
import { normalizeProfileCode } from "@/lib/profile-code";
import { duelStartLabel } from "@/lib/daily-duel";
import { getTodayTaipei } from "@/lib/matches";

// ── ZONE 27 · /vs/[code] 動態 OG 卡 = 戰帖(散播命門)──────────────────────
// 貼到 LINE/FB 的不是裸網址,是一張戰帖卡:是誰下的 + 哪一場 + 機器賽前鎖的線 + 「你敢同場對帳?」。
// 「具體的戰帖」在聊天列點閱率遠勝通用標語 —— 卡片本身就是那句邀請。
// 🔴 OG 房規:next/og 絕不用 symbol glyph(✓✕▸★)· 中文 + 中點(·)· 無 emoji · 暗金。
//   不揭 challenger 那手(賽前封盤 · 賽後才在頁面揭)· 只秀機器公開的線。
// 解析走 lib/challenge(同 /vs 頁 → 卡片跟頁面永遠同一場)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 戰帖";

export default async function VsOgImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = normalizeProfileCode(raw);
  if (!code) return brandFallback();
  const res = await resolveChallenge(code, null);
  if (!res) return brandFallback();

  const name = res.profile.displayName || `球迷 #${res.profile.authorCode}`;
  const match = res.match;

  // 沒可應戰的場 → 只秀「誰下了戰帖」的品牌卡(不假裝有對戰)。
  if (!match) return challengerOnlyCard(name);

  // 對決卡顯示順序(籃球客先 · 其餘 home/a 先)· 同 /vs 頁。
  const leftName = match.leftIsHome ? match.homeName : match.awayName;
  const rightName = match.leftIsHome ? match.awayName : match.homeName;
  const leagueLabel =
    match.sport === "baseball"
      ? match.league
      : `${match.sportLabel} · ${match.league}`;
  const startLabel = match.startISO
    ? `${duelStartLabel(match.startISO, getTodayTaipei())} 開賽`
    : "";

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
            戰帖 · 賽前封盤
          </span>
        </div>

        {/* WHO + 戰帖 */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
          <span style={{ fontSize: 30, color: BRAND.gold, fontWeight: 400, letterSpacing: "0.02em", display: "flex" }}>
            {name}
          </span>
          <span style={{ fontSize: 22, color: boneRgba(0.55), letterSpacing: "0.18em", marginTop: 8, display: "flex" }}>
            下了一張戰帖
          </span>
        </div>

        {/* MATCHUP */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 26 }}>
          <span style={{ fontSize: 15, color: boneRgba(0.4), letterSpacing: "0.3em", marginBottom: 10, display: "flex" }}>
            {leagueLabel}
            {startLabel ? ` · ${startLabel}` : ""}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>
              {leftName}
            </span>
            <span style={{ fontSize: 26, color: goldRgba(0.6), letterSpacing: "0.2em", margin: "0 20px", display: "flex" }}>
              vs
            </span>
            <span style={{ fontSize: 50, color: BRAND.bone, fontWeight: 300, letterSpacing: "-0.02em" }}>
              {rightName}
            </span>
          </div>
        </div>

        {/* 機器線(公開 · 不揭 challenger 那手)*/}
        {match.engine && (
          <div style={{ display: "flex", marginTop: 26 }}>
            <span style={{ fontSize: 22, color: boneRgba(0.6), letterSpacing: "0.06em", display: "flex" }}>
              機器已鎖{" "}
              <span style={{ color: BRAND.gold, marginLeft: 10, marginRight: 10 }}>
                {match.engine.name} {match.engine.pct}%
              </span>{" "}
              · 賽前不翻牌
            </span>
          </div>
        )}

        {/* CALL */}
        <div style={{ display: "flex", marginTop: 30 }}>
          <span style={{ fontSize: 60, color: BRAND.gold, fontWeight: 400, letterSpacing: "0.06em", display: "flex" }}>
            你敢同場對帳?
          </span>
        </div>

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
          <span style={{ display: "flex" }}>先自己押 · 賽後見真章 · 看不到他押誰</span>
          <span style={{ display: "flex", color: goldRgba(0.65) }}>zone27.com.tw</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

// 沒可應戰的場 → 只秀「誰下了戰帖」(品牌卡 · 不假裝有對戰)。
function challengerOnlyCard(name: string) {
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
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ fontSize: 26, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>ZONE</span>
          <span style={{ fontSize: 26, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>27</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <span style={{ fontSize: 56, color: BRAND.gold, fontWeight: 400, letterSpacing: "0.02em", display: "flex" }}>
            {name}
          </span>
          <span style={{ fontSize: 30, color: boneRgba(0.6), letterSpacing: "0.18em", marginTop: 14, display: "flex" }}>
            站到機器對面 · 賽前鎖死、賽後對帳、含贏含輸
          </span>
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 18,
            color: goldRgba(0.65),
            letterSpacing: "0.28em",
          }}
        >
          <span style={{ display: "flex" }}>zone27.com.tw</span>
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
          戰帖 · 你 vs 機器
        </span>
      </div>
    ),
    { ...OG_SIZE },
  );
}
