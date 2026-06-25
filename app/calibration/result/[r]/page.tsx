import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { parseResult } from "@/lib/calibration-result";

// ── ZONE 27 · /calibration/result/[r] · 個人校準成績落地頁 ──────────────
// 朋友收到分享連結點進來的地方:先看到「他朋友以為 X% 實際只中 Y%」當社會證明 + 挑戰鉤,
// 再一鍵「換你測」進 /calibration/test。 OG 卡(opengraph-image.tsx)是預覽主角,這頁負責
// 把點進來的人轉成玩家。 🔴 練習成績、非戰績(URL 可改)→ 明說「練習 · 不是戰績」不背書。
// 參數壞掉 → graceful 通用邀請(不 404),任何 /calibration/result/* 都落得到地方。
// ─────────────────────────────────────────────────────

type Params = Promise<{ r: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { r } = await params;
  const res = parseResult(r);
  const ogTitle = res
    ? res.tone === "over"
      ? `我以為 ${res.conf}%,實際只中 ${res.hit}% · 換你測`
      : res.tone === "under"
        ? `我說 ${res.conf}%,結果中了 ${res.hit}% · 換你測`
        : `我說 ${res.conf}%、實際中 ${res.hit}% · 換你測`
    : "校準練習 · 換你當引擎";
  const description = res
    ? `有人測了自己判斷比賽有多準:以為 ${res.conf}% 把握、實際中 ${res.hit}%。 沒人是神,連最強引擎也才 5 成 7。 拿打完的比賽藏住比分,換你滑出把握、攤開對照 —— 30 秒、不用登入。`
    : "拿幾場打完的 CPBL 比賽藏住比分,你滑出把握、再攤開對照那道「沒人是神、5 成 7 是天花板」的牆。 30 秒、不用登入。";
  return {
    title: res ? `校準成績:以為 ${res.conf}% · 實際 ${res.hit}%` : "校準練習 · 換你當引擎",
    description,
    openGraph: {
      title: ogTitle,
      description,
      type: "website",
      locale: "zh_TW",
      siteName: "ZONE 27",
    },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  };
}

function CompareBar({ label, pct, gold }: { label: string; pct: number; gold: boolean }) {
  const w = Math.max(0, Math.min(100, pct));
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span
          className={`font-mono text-[10px] tracking-[0.2em] ${gold ? "text-gold/85" : "text-mute"}`}
        >
          {label}
        </span>
        <span
          className={`font-mono tabular text-2xl sm:text-3xl font-light ${gold ? "text-gold" : "text-mute"}`}
        >
          {w}
          <span className="text-base opacity-60">%</span>
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-line/50 overflow-hidden">
        <div
          className={`h-full ${gold ? "bg-gold glow-gold" : "bg-mute/55"}`}
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

export default async function CalibrationResultPage({ params }: { params: Params }) {
  const { r } = await params;
  const res = parseResult(r);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 sm:pt-20 pb-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            校準練習 · 換你當引擎
          </p>

          {res ? (
            <>
              <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-[1.15] mb-3">
                有人剛當了一次引擎 ——
                <br />
                {res.tone === "over" ? (
                  <span>
                    以為 <span className="text-gold">{res.conf}%</span> 把握,
                    實際只中 <span className="text-gold">{res.hit}%</span>。
                  </span>
                ) : res.tone === "under" ? (
                  <span>
                    說 <span className="text-gold">{res.conf}%</span> 把握,
                    結果中了 <span className="text-gold">{res.hit}%</span>。
                  </span>
                ) : (
                  <span>
                    說 <span className="text-gold">{res.conf}%</span>、
                    實際中 <span className="text-gold">{res.hit}%</span> —— 算準的。
                  </span>
                )}
              </h1>
              <p className="text-mute leading-relaxed mb-8 max-w-xl">
                {res.tone === "over"
                  ? "跟大多數人一樣 —— 以為的把握,比實際中的高出一截。 這不丟臉:這正是「過度自信」,也正是賣明牌的人利用的東西。"
                  : res.tone === "under"
                    ? "他其實比自己以為的準 —— 把握給太低了。 少數人會這樣。"
                    : "他說幾成、就真的中幾成 —— 這叫校準良好,多數人辦不到。"}
                {" "}
                沒人是神 · 連最強引擎也才 5 成 7。
              </p>

              <div className="bg-slate/40 border border-line/60 p-5 sm:p-7 space-y-5 mb-8">
                <CompareBar label="他以為的把握" pct={res.conf} gold={false} />
                <CompareBar label="實際中" pct={res.hit} gold={true} />
                <p className="font-mono text-mute/70 text-[10px] tracking-[0.18em] leading-relaxed pt-1">
                  ▸ {res.n} 場練習題 · 這是校準<span className="text-bone">練習</span>、不是戰績
                  (網址可改,別當憑證)· 想記真實的看下面。
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-[1.15] mb-4">
                別人都說自己多準。
                <br />
                <span className="text-gold">換你自己試一次。</span>
              </h1>
              <p className="text-mute leading-relaxed mb-8 max-w-xl">
                拿幾場已經打完的 CPBL 比賽、藏住比分,你來當引擎滑出把握,攤開對照
                「你以為的把握 vs 實際中的成數」。 沒人是神,連最強引擎也才 5 成 7。
              </p>
            </>
          )}

          <div className="flex flex-col items-start gap-3">
            <Link
              href="/calibration/test"
              className="inline-flex items-center gap-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] px-7 py-3 hover:bg-gold-soft transition-colors"
            >
              換你測 · 30 秒 →
            </Link>
            <p className="font-mono text-mute/60 text-[9px] tracking-[0.2em] leading-relaxed">
              不用登入 · 拿打完的比賽撞撞看你自己的那道牆
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-line/40">
            <Link
              href="/calibration"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← 看引擎自己準不準 · /calibration
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
