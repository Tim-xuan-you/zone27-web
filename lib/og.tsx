import { ImageResponse } from "next/og";

/**
 * 分享卡片（og:image）。
 *
 * 在這之前，有人把我們的連結貼到 LINE，對方看到的只是一行網址 ——
 * 沒有圖、沒有卡片。而 LINE 群組正是台灣寵物內容的主要傳播管道：
 * 「欸你看這個，那包寫火雞的其實是雞肉」就是這樣被轉出去的。
 *
 * 所以這張圖的工作只有一個：讓人在群組裡看到的時候想點開。
 * 不放產品照、不放 logo 牆 —— 放那個反直覺的發現本身。
 *
 * 字型：Satori 不內建中文字，要自己載。用 Google Fonts 的 text= 參數
 * 只抓這張圖用到的字，檔案小、建置快。抓不到就退回純英文版，
 * 不要讓一張分享圖把整個建置拖垮。
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#1C1A17";
const MUTED = "#6B655C";
const GROUND = "#FBFAF7";
const ACCENT = "#1F6F5C";
const CUT = "#A4432F";

async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&text=" +
      encodeURIComponent(text);
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function ogCard({
  kicker,
  headline,
  sub,
  tone = "accent",
}: {
  /** 最上面那一小行，例如「我們自己讀成分表」 */
  kicker: string;
  /** 大字。那個讓人想點開的發現 */
  headline: string;
  /** 補一句，給還在猶豫的人 */
  sub: string;
  /** 大字裡強調色：accent 綠、cut 紅 */
  tone?: "accent" | "cut";
}) {
  const all = kicker + headline + sub + "ZONE 27zone27.com.tw";
  const font = await loadFont(all);

  // 抓不到字型：退回英文版，至少不要讓建置失敗
  if (!font) {
    return new ImageResponse(
      (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", background: GROUND, color: INK,
          fontSize: 88, fontWeight: 700,
        }}>
          ZONE 27
        </div>
      ),
      OG_SIZE,
    );
  }

  const hl = tone === "cut" ? CUT : ACCENT;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", background: GROUND,
          padding: "64px 72px", fontFamily: "NotoTC",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: ACCENT }} />
          <div style={{ fontSize: 34, color: INK, letterSpacing: 1 }}>ZONE 27</div>
          <div style={{ fontSize: 28, color: MUTED, marginLeft: 20 }}>{kicker}</div>
        </div>

        <div style={{
          display: "flex", fontSize: headline.length > 16 ? 76 : 92,
          color: hl, lineHeight: 1.25, maxWidth: 1050,
        }}>
          {headline}
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          borderTop: `3px solid ${INK}`, paddingTop: 28,
        }}>
          <div style={{ display: "flex", fontSize: 34, color: INK, maxWidth: 860, lineHeight: 1.45 }}>
            {sub}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>zone27.com.tw</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "NotoTC", data: font, weight: 700, style: "normal" }],
    },
  );
}
