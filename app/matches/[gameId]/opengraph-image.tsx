import { ImageResponse } from "next/og";
import { getMatchById } from "@/lib/matches";

// ── ZONE 27 · Per-match Dynamic Open Graph Image ───────
// 當有人把 https://zone27-web.vercel.app/matches/cpbl-260521-01
// 貼到 LINE / FB / Threads / X / Slack / Discord 等任何平台,
// 預覽卡片會自動帶上「統一獅 40% vs 富邦悍將 60%」這場
// 比賽的專屬黑金預測卡 — 不再是全站通用 slogan 卡。
// ─────────────────────────────────────────────────────

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ZONE 27 · AI Match Prediction";

export default async function MatchOgImage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const match = getMatchById(gameId);

  // Defensive fallback: if somehow no match, show the brand card
  if (!match) {
    return brandFallback();
  }

  const homeFavored = match.home.winRate >= match.away.winRate;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F1A2E",
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.15), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
        }}
      >
        {/* TOP ROW: brand + meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 50,
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                fontSize: 26,
                color: "#D4AF37",
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              ZONE
            </span>
            <span
              style={{
                fontSize: 26,
                color: "#F5F2EA",
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              27
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              fontSize: 18,
              color: "rgba(245,242,234,0.5)",
              letterSpacing: "0.3em",
            }}
          >
            <span>{match.league}</span>
            <span style={{ color: "rgba(212,175,55,0.6)" }}>·</span>
            <span>AI MODEL</span>
          </div>
        </div>

        {/* TEAMS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 60,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 16,
                color: "rgba(245,242,234,0.45)",
                letterSpacing: "0.3em",
                marginBottom: 12,
              }}
            >
              HOME
            </span>
            <span
              style={{
                fontSize: 64,
                color: "#F5F2EA",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {match.home.name}
            </span>
            <span
              style={{
                fontSize: 22,
                color: "rgba(212,175,55,0.65)",
                letterSpacing: "0.3em",
                marginTop: 8,
              }}
            >
              {match.home.en}
            </span>
          </div>

          <div
            style={{
              fontSize: 32,
              color: "rgba(212,175,55,0.6)",
              letterSpacing: "0.3em",
              alignSelf: "center",
              marginBottom: 12,
              display: "flex",
            }}
          >
            VS
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: "rgba(245,242,234,0.45)",
                letterSpacing: "0.3em",
                marginBottom: 12,
              }}
            >
              AWAY
            </span>
            <span
              style={{
                fontSize: 64,
                color: "#F5F2EA",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {match.away.name}
            </span>
            <span
              style={{
                fontSize: 22,
                color: "rgba(212,175,55,0.65)",
                letterSpacing: "0.3em",
                marginTop: 8,
              }}
            >
              {match.away.en}
            </span>
          </div>
        </div>

        {/* THE SIGNATURE WIN BAR */}
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column" }}>
          {/* numbers row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 64,
                fontWeight: 300,
                color: homeFavored ? "#D4AF37" : "rgba(245,242,234,0.55)",
                letterSpacing: "-0.02em",
              }}
            >
              {match.home.winRate}
              <span style={{ fontSize: 28, opacity: 0.6, marginLeft: 2 }}>%</span>
            </span>
            <span
              style={{
                fontSize: 64,
                fontWeight: 300,
                color: !homeFavored ? "#D4AF37" : "rgba(245,242,234,0.55)",
                letterSpacing: "-0.02em",
              }}
            >
              {match.away.winRate}
              <span style={{ fontSize: 28, opacity: 0.6, marginLeft: 2 }}>%</span>
            </span>
          </div>

          {/* the bar */}
          <div
            style={{
              position: "relative",
              height: 4,
              background: "rgba(245,242,234,0.1)",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${match.home.winRate}%`,
                height: 4,
                background: "#D4AF37",
                boxShadow: "0 0 24px rgba(212,175,55,0.45)",
              }}
            />
          </div>
        </div>

        {/* BOTTOM ROW: methodology + URL */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 16,
            color: "rgba(245,242,234,0.5)",
            letterSpacing: "0.3em",
          }}
        >
          <span style={{ display: "flex" }}>
            引擎 · 10,000 SIMS
          </span>
          <span style={{ display: "flex", color: "rgba(212,175,55,0.65)" }}>
            zone27-web.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
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
          background: "#0F1A2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          <span style={{ fontSize: 70, color: "#D4AF37", letterSpacing: "0.22em" }}>
            ZONE
          </span>
          <span style={{ fontSize: 70, color: "#F5F2EA", letterSpacing: "0.22em" }}>
            27
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
