import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CalibrationGame, { type QuizMatch } from "@/components/CalibrationGame";
import { getFinalizedMatches } from "@/lib/matches";

export const metadata: Metadata = {
  title: "你有多準?· 校準練習 · ZONE 27",
  description:
    "別人都在告訴你他多準。 ZONE 27 讓你自己試一次:拿幾場已經打完的 CPBL 比賽、藏住比分,你滑出把握、再攤開對照。 你會親手摸到那道「沒人是神、5 成 7 是天花板」的牆。 不是押注、不進戰績,純自我校準練習。",
};

export const revalidate = 86400; // 隨賽事結算更新題庫

const QUIZ_SIZE = 8;

// "2026 · 06 · 03  ·  星期三" → "06/03（三）"
function compactDate(dateStr: string): string {
  const parts = dateStr.split("·").map((s) => s.trim());
  if (parts.length >= 4 && parts[1] && parts[2]) {
    return `${parts[1]}/${parts[2]}（${parts[3].replace("星期", "")}）`;
  }
  return dateStr;
}

export default function CalibrationTestPage() {
  // 已結算、非平手(平手沒有贏家、評不了你猜對沒)· 取最近 QUIZ_SIZE 場
  const quiz: QuizMatch[] = getFinalizedMatches()
    .filter((m) => m.finalResult && m.finalResult.winner !== "tie")
    .slice(0, QUIZ_SIZE)
    .map((m) => ({
      id: m.id,
      date: compactDate(m.date),
      venue: m.venue.replace(/棒球場$/, ""),
      homeName: m.home.name,
      awayName: m.away.name,
      homePitcher: m.home.pitcher.name,
      homeEra: m.home.pitcher.era,
      awayPitcher: m.away.pitcher.name,
      awayEra: m.away.pitcher.era,
      homeRecent: m.home.recent,
      awayRecent: m.away.recent,
      winner: m.finalResult!.winner as "home" | "away",
      engineHomePct: m.home.winRate,
      engineAwayPct: m.away.winRate,
    }));

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-16 sm:pt-20 pb-8">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
              / 校準練習 · 換你當引擎
            </p>
            <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80">
              純練習 · 不是押注
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.12]">
            別人都說自己多準。
            <br className="hidden sm:inline" />{" "}
            <span className="text-gold">換你自己試一次。</span>
          </h1>
          <div className="mt-7 border-l-2 border-gold/60 pl-5 sm:pl-6 py-1 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              下面是 {quiz.length} 場<strong>已經打完</strong>的 CPBL 比賽 —— 比分藏起來了。
              只給你兩隊、先發投手、近況。
            </p>
            <p className="mt-3 text-mute leading-relaxed">
              你來當引擎:每一場滑出「主隊贏的機率」。 全部滑完、按攤開 ——
              我們把<span className="text-bone">你以為的把握</span>和
              <span className="text-bone">實際中的成數</span>擺在一起給你看。
            </p>
          </div>
          <p className="mt-5 font-mono text-mute/55 text-[10px] tracking-[0.2em] leading-relaxed max-w-2xl">
            ▸ 這不是押注 · 不進你的戰績 · 不上天梯 —— 純粹照鏡子。 想記真實戰績?攤開後有入口。
          </p>
        </section>

        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 mb-8">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* ── 遊戲 ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20">
          {quiz.length >= 4 ? (
            <CalibrationGame matches={quiz} />
          ) : (
            <div className="border border-dashed border-gold/30 bg-slate/30 p-6 sm:p-8 text-center">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                題庫還在累積
              </p>
              <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                校準練習需要幾場已經打完的比賽當題目 · 目前還不夠。
                等更多 CPBL 賽事結算就開。 先去看{" "}
                <Link
                  href="/calibration"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  引擎自己的準度
                </Link>
                。
              </p>
            </div>
          )}
        </section>

        {/* ── 接轉換:剛測完那刻是最熱的線索,別只給一條 back-link 就放生 ──────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            你摸到的那道牆 · 我們天天對帳
          </p>
          <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-5">
            剛剛是練習題。 想把你自己<span className="text-bone">真實</span>的準度,
            記成一份別人刪不掉的戰績?押一手真的、賽後逐場幫你對帳。
          </p>
          <Link
            href="/login?next=/member"
            className="inline-block font-mono text-gold border border-gold/45 hover:border-gold hover:bg-gold/5 text-[11px] tracking-[0.2em] px-5 py-2.5 transition-colors"
          >
            記下我真實的戰績 · 免費註冊 →
          </Link>
          <div className="mt-5">
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
