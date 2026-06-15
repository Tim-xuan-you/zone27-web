import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import CopyLinkButton from "@/components/CopyLinkButton";
import FounderSignOff from "@/components/FounderSignOff";
import {
  getFinalizedMatches,
  getCalibration,
  getMatchDateIso,
  type Match,
} from "@/lib/matches";
import { getMlbLockedMatches } from "@/lib/mlb-matches";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "我們怎麼算你贏還是輸 · 一場都改不了",
  description:
    "ZONE 27 的結算規則:押下就鎖死、賽果照官方、同一把尺算所有運動、算完永久掛著連我們輸的都留。 不是叫你相信我們 —— 是把規則寫死到沒人能彎,連我們自己都不行。",
  ogTitle: "我們怎麼算贏輸 · 一場都刪不掉 · ZONE 27",
  ogDescription: "押下鎖死 · 賽果照官方 · 同一把尺 · 連我們輸的都永久留著 · 規則沒人能彎",
  path: "/how-we-grade",
});

export const revalidate = 3600;

const favPct = (m: Match) => Math.max(m.home.winRate, m.away.winRate);
const favName = (m: Match) =>
  m.home.winRate >= m.away.winRate ? m.home.name : m.away.name;
const winName = (m: Match) =>
  m.finalResult?.winner === "home"
    ? m.home.name
    : m.finalResult?.winner === "away"
      ? m.away.name
      : "平手";

// ── ZONE 27 · /how-we-grade · 結算規則(把最大聲的承諾從「信我」變「自己驗」)──────────
// Polymarket 2025-26 的信任危機全來自「賽果認定爭議 / 事後改規則」。 教訓:預測產品的命
// 就是「結果照一條沒人能彎的規則結算」。 我們到處喊「賽前鎖死、贏輸都掛、刪不掉」,但從沒把
// 那條規則攤開示範。 這頁就是:5 步白話規則 + 一個我們真的算錯、卻還掛著的例子。
// 純展示 server component · 例子取自真實已結算場(getFinalizedMatches · 0 捏造)· graceful。
// 🔴 訪客語言:不出現 GitHub / cron / commit / 術語(只說「送出時間」「官方賽果」)。
// ─────────────────────────────────────────────────────

export default function HowWeGradePage() {
  // 跨聯盟已結算(CPBL + MLB 永久鎖定源)· 找一個「引擎最有把握、卻算錯」的真實例子 =
  // 最強的「我們輸了還掛著」示範(引擎越敢喊、越打臉,卻刪不掉 = costly signal)。
  const finalized = [
    ...getFinalizedMatches(),
    ...getMlbLockedMatches().filter((m) => m.finalResult),
  ];
  const diverged = finalized
    .filter((m) => getCalibration(m) === "diverged" && favPct(m) > 50)
    .sort((a, b) => favPct(b) - favPct(a));
  const miss = diverged[0] ?? null;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 結算規則 · 一場都改不了
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1]">
            我們怎麼算你<span className="text-gold">贏還是輸</span>
          </h1>
          <div className="mt-7 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              賣明牌的,贏了截圖、輸了刪文 —— 因為<strong>他說了算</strong>。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              我們反過來:把規則寫死到<strong className="text-bone">沒人能彎,連我們自己都不行</strong>。
              不是叫你相信我們,是讓你自己驗。
            </p>
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 5 步規則 ─────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <ol className="space-y-7 list-none pl-0 m-0">
            <Step
              n="1"
              title="押下的那一刻就鎖死"
              body="你按下「鎖定」的那一秒,押哪邊、什麼時間,就被記下、改不了。 我們不能事後把比完的場填進來假裝「早就說了」—— 送出時間就是賽前的證據,任何人一對就拆穿。"
            />
            <Step
              n="2"
              title="「引擎看好誰」= 賽前就公開的線"
              body="每場開賽前,引擎先公開算出哪邊機率 > 50%。 那條線一旦鎖定,賽後絕不重算、不偷改。 賽前說 67%,事後就是 67%,不會變成「我們本來就看好對面」。"
            />
            <Step
              n="3"
              title="「贏沒贏」照官方賽果 · 不是我們說了算"
              body="誰贏,看官方聯盟的最終比分,不是我們的人去判。 沒有人工改判、沒有「這場不算」的後門。 規則認定,人不認定。"
            />
            <Step
              n="4"
              title="同一把尺算所有運動"
              body="中職、MLB、足球,同一套規則:賽前 > 50% 那邊賽後贏 = 命中 ✓、輸 = 落空 ✕、平手/五五波 = 不算 =。 不換標準、不挑對自己有利的算法。"
            />
            <Step
              n="5"
              title="算完永久掛著 · 連我們輸的都留"
              body="一旦結算,就永久進公開帳本 —— 命中跟落空一樣大、一樣亮、刪不掉。 我們算錯的那些,你現在就翻得到(下面就有一個)。"
              last
            />
          </ol>
        </section>

        {/* ── 一個我們真的算錯的例子(刪不掉)── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 看一個我們算錯的
          </p>
          {miss ? (
            <div className="bg-slate/30 border border-line/60 p-6 sm:p-8">
              <p className="text-mute text-sm leading-relaxed mb-5 max-w-xl">
                這場引擎賽前最有把握,結果還是看走眼 —— 它沒有消失,就掛在公開帳本上,標著{" "}
                <span className="text-loss/90">✕ 落空</span>。
              </p>
              <div className="border border-loss/30 bg-loss/5 p-5">
                <p className="text-bone text-base sm:text-lg font-light leading-snug">
                  引擎賽前看好{" "}
                  <span className="text-gold">{favName(miss)}</span>{" "}
                  <span className="font-mono tabular">{favPct(miss)}%</span>
                </p>
                <p className="mt-1.5 text-mute text-sm leading-snug">
                  結果 <span className="text-bone">{winName(miss)}</span> 贏了 ·{" "}
                  <span className="font-mono text-loss/90 text-[13px] tracking-[0.1em]">✕ 落空 · 刪不掉</span>
                </p>
                <p className="mt-2 font-mono text-mute/55 text-[10px] tracking-[0.15em]">
                  {(getMatchDateIso(miss) ?? "").slice(0, 10)}
                </p>
              </div>
              <p className="mt-5 text-mute/80 text-[13px] leading-relaxed max-w-xl">
                引擎越敢喊、看走眼時越打臉 —— 而我們連這種都留著。 賣明牌的做不到這件事,
                因為他靠的就是讓你忘記他輸過。
              </p>
            </div>
          ) : (
            <div className="bg-slate/30 border border-line/60 p-6 text-center">
              <p className="text-mute text-sm leading-relaxed">
                目前公開帳本還沒有落空的場可舉例(場數還少)。 等比賽打多了,算錯的會跟命中的
                一樣掛在這、刪不掉 —— 看{" "}
                <Link href="/track-record" className="text-gold underline-offset-4 hover:underline">
                  完整帳本
                </Link>
                。
              </p>
            </div>
          )}
        </section>

        <FounderSignOff>
          <p>
            這頁不是行銷話術 · 是規則。 規則寫死了,我跟你看到的就一樣 —— 我沒有「偷改一場」的權力。
          </p>
          <p>
            賣明牌的最怕你問「那你輸的呢」· 我們把輸的跟贏的掛在一起,還教你怎麼驗我們。
          </p>
        </FounderSignOff>

        {/* 把規則傳出去 · 還在信「神準截圖」的人,丟這頁給他看一個「規則綁死、輸了照掛」的長怎樣。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 text-center">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Link
              href="/track-record"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → 看完整含輸帳本
            </Link>
            <Link
              href="/calibration"
              className="inline-block px-6 py-3 border border-line/60 text-mute font-mono text-[10px] tracking-[0.3em] hover:text-gold hover:border-gold/40 transition-colors"
            >
              → 引擎到底準幾成
            </Link>
          </div>
          <div className="flex justify-center">
            <CopyLinkButton
              label="把這條規則傳出去"
              doneLabel="已複製 · 貼給他"
              shareText="ZONE 27 把「怎麼算贏輸」的規則寫死到沒人能彎:押下鎖死、賽果照官方、連他們自己算錯的都永久掛著刪不掉。 賣明牌的做不到。 自己看:"
              refTag="how-we-grade-share"
            />
          </div>
        </section>

        <RelatedReading currentPath="/how-we-grade" />
      </main>

      <Footer />
    </div>
  );
}

function Step({
  n,
  title,
  body,
  last = false,
}: {
  n: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <li className={last ? "" : "border-b border-line/40 pb-7"}>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-gold/70 text-lg font-light tabular shrink-0 w-7">
          {n}
        </span>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl text-bone font-light tracking-tight leading-snug mb-2">
            {title}
          </h2>
          <p className="text-mute text-base leading-relaxed max-w-2xl">{body}</p>
        </div>
      </div>
    </li>
  );
}
