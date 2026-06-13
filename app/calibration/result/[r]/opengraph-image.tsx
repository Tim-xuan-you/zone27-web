import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";
import { parseResult } from "@/lib/calibration-result";

// ── ZONE 27 · /calibration/result/[r] · 個人校準成績 Dynamic OG ──────
// R232「您決定」· 校準鏡子病毒回路最後一塊。 /calibration/test 的分享鈕原本只把
// 「個人成績」放在訊息文字、預覽卡退回通用卡。 這條 /calibration/result/{把握}-{實際}-{場數}
// 讓每個玩過的人的「成績」變成 server-render 的專屬預覽卡 —— 賣的是「我以為 70% 實際只中 55%」
// 這種自嘲式誠實(明牌站結構上抄不走:他們只曬連勝,不敢曬自己高估)。
//
// 🔴 OG 房規(R223):next/og 0 symbol glyph(✓✕▸★→ 全禁 · LINE 豆腐字)· 只 CJK+拉丁+數字+中點。
// 🔴 練習成績、非戰績(URL 可改 = 像 Wordle 分享分數 · 不是可驗證憑證)→ 文案不可暗示是真戰績。
// 參數壞掉 / 越界 → 退通用「校準練習」卡(不 crash、不 500)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "ZONE 27 · 我的校準練習成績 · 換你當引擎";

export default async function ResultOgImage({
  params,
}: {
  params: Promise<{ r: string }>;
}) {
  const { r } = await params;
  const res = parseResult(r);

  // 壞參數 → 通用鏡子卡(等同 /calibration/test 的命題 · 不洩、不 crash)
  const headline = res
    ? res.tone === "over"
      ? `我以為 ${res.conf}% · 實際只中 ${res.hit}%`
      : res.tone === "under"
        ? `我說 ${res.conf}% · 結果中了 ${res.hit}%`
        : `我說 ${res.conf}% · 實際中 ${res.hit}%`
    : "你以為的把握,真有那麼準?";

  const sub = res
    ? res.tone === "over"
      ? "連我都沒那麼準 —— 過度自信,正是明牌站靠來收錢的東西。"
      : res.tone === "under"
        ? "原來我太保守 —— 把握其實可以再敢一點。"
        : "說幾成、就真的中幾成 —— 這叫校準良好,多數人辦不到。"
    : "拿打完的比賽藏住比分 · 你滑出把握 · 攤開對照那道 5 成 7 的牆。";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.10), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* TOP ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 24, color: BRAND.gold, letterSpacing: "0.22em", fontWeight: 500 }}>ZONE</span>
            <span style={{ fontSize: 24, color: BRAND.bone, letterSpacing: "0.22em", fontWeight: 500 }}>27</span>
          </div>
          <span style={{ fontSize: 14, color: "rgba(212,175,55,0.7)", letterSpacing: "0.35em", display: "flex" }}>
            校準練習 · 我剛當了一次引擎
          </span>
        </div>

        {/* HEADLINE */}
        <span
          style={{
            fontSize: res ? 60 : 68,
            color: BRAND.gold,
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            textShadow: "0 0 80px rgba(212,175,55,0.3)",
            marginTop: 36,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {headline}
        </span>

        {/* TWO-BAR COMPARE(只有有效成績才畫)· 你以為 vs 實際 = 一眼看到落差 */}
        {res ? (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22 }}>
            <CompareBar label="你以為的把握" pct={res.conf} tone="mute" />
            <CompareBar label="實際中" pct={res.hit} tone="gold" />
          </div>
        ) : (
          <span style={{ fontSize: 26, color: "rgba(245,242,234,0.72)", lineHeight: 1.5, marginTop: 34, display: "flex", maxWidth: 980 }}>
            {sub}
          </span>
        )}

        {/* SUB punchline(有成績時放這)*/}
        {res && (
          <span style={{ fontSize: 24, color: "rgba(245,242,234,0.7)", letterSpacing: "0.02em", lineHeight: 1.5, marginTop: 34, display: "flex", maxWidth: 1000 }}>
            {sub}
          </span>
        )}

        {/* BOTTOM */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 70,
            right: 70,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span style={{ fontSize: 16, color: "rgba(245,242,234,0.6)", letterSpacing: "0.04em", display: "flex", maxWidth: 760 }}>
            沒人是神 · 連最強引擎也才 5 成 7 · 換你測測你有多準。
          </span>
          <span style={{ fontSize: 14, color: BRAND.gold, letterSpacing: "0.3em", fontWeight: 500, display: "flex" }}>
            /calibration/test
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

function CompareBar({
  label,
  pct,
  tone,
}: {
  label: string;
  pct: number;
  tone: "gold" | "mute";
}) {
  const gold = tone === "gold";
  const w = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 18, color: gold ? "rgba(212,175,55,0.85)" : "rgba(245,242,234,0.55)", letterSpacing: "0.22em", display: "flex" }}>
          {label}
        </span>
        <span style={{ fontSize: 40, fontWeight: 300, color: gold ? BRAND.gold : "rgba(245,242,234,0.6)", letterSpacing: "-0.02em", display: "flex" }}>
          {w}
          <span style={{ fontSize: 20, opacity: 0.6, marginLeft: 2 }}>%</span>
        </span>
      </div>
      <div style={{ width: "100%", height: 14, background: "rgba(245,242,234,0.08)", borderRadius: 7, display: "flex", overflow: "hidden" }}>
        <div
          style={{
            width: `${w}%`,
            height: 14,
            background: gold ? BRAND.gold : "rgba(138,147,168,0.55)",
            boxShadow: gold ? "0 0 26px rgba(212,175,55,0.5)" : "none",
          }}
        />
      </div>
    </div>
  );
}
