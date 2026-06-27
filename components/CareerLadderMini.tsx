import Link from "next/link";
import type { CareerTier } from "@/lib/reckoning-star";

// ── ZONE 27 · 操盤室 · 個人天梯爬升視圖(R280)─────────────────────────────────────
// R279 把已算好的天梯階級「鏡回本人」成一行抬頭(你現在是 X · 第 N 階)。 這支把那一行
// 展開成「整段爬升」:五階一次攤開、標出「你在這」、已過的階是「目前達到」、上面的階是
// 還沒摸到的門檻 —— 讓登入像「走進我的操盤室、看見整條職涯路」而非只讀一個數字。
//
// 🔴 紅線(別把職涯路燒成賭場/虛榮榜 · 全程守住 R279 litmus):
//   ① 計分軸 = 校準命中率(非 PnL/連勝/粉絲)· 直接 render careerTier 算好的階,不重算。
//   ② 上面的階是「尚未達到的準度門檻」不是「解鎖的獎」—— 用門檻白話,絕無「解鎖/限時/名額/
//      還差 X 就能拿!」那種 FOMO 賭場話術;落差只報赤裸的 nextHint。
//   ③ 可收回要看得見:已過的階是「目前達到」(非永久獎盃)+「守不住會掉階 · 每次都重算」一行 ——
//      報馬仔能截一張假抬頭,但這個階是 on-read 從刪不掉的帳本重算、滑下去自動掉,他做不到。
//   ④ 視覺克制:當前階只給「適度」金邊(不抄 /ladder 王座 glow);上面的階是最安靜的元素
//      (mute/dim · 無填色 · 無金 · 無獎勵鉤),climb 看得見但不吊蘿蔔。
//   ⑤ 神諭(第 5 階)本人面永遠摸不到(careerTier 最高到 4 · 神諭需跨用戶全站第一)→ 永遠灰著、
//      永不標「你在這」、永不當「你的下一步」· 只掛一行「全站第一才有 · 看天梯」連 /ladder。
//   ⑥ tier 0(<10 場 / 無命中率):不攤五階空牆(最像賭場「看你能贏到什麼」誘餌)· 維持
//      原 graceful「還沒上榜 + 押滿 10 場」+ 最多露第一階「新秀」一格預覽。
// ─────────────────────────────────────────────────────

// 五階(由低到高)· 文字「逐字」抄自 /ladder TIERS + careerTier nextHint 口徑 → 永不漂移。
// one = 該階的客觀門檻白話(量尺,不是獎);apex 第 5 階本人面永遠摸不到。
const RUNGS = [
  { n: 1, zh: "新秀", en: "ROOKIE", one: "上榜:押滿 10 場已分勝負。" },
  { n: 2, zh: "分析師", en: "ANALYST", one: "命中率過半(50%)。" },
  { n: 3, zh: "操盤手", en: "TRADER", one: "命中率守上 55%。" },
  { n: 4, zh: "神準手", en: "SHARP", one: "≥30 場裡守住 60% · 連引擎都還沒站上。" },
  { n: 5, zh: "神諭", en: "ORACLE", one: "全站第一 · 把機器拉下王座(只留給人)。" },
] as const;

function Eyebrow() {
  return (
    <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-2.5">
      你的操盤室
    </p>
  );
}

export default function CareerLadderMini({
  career,
  accuracy,
  decided,
}: {
  career: CareerTier;
  accuracy: number | null;
  decided: number;
}) {
  // ── tier 0 · 還沒上榜(<10 場 / 全平手無命中率)· 不攤空牆 ──────────────────────
  if (career.tier === 0) {
    return (
      <div className="mt-6">
        <Eyebrow />
        <p className="text-bone text-lg font-light leading-snug">
          你的操盤生涯 · <span className="text-mute">還沒上榜</span>
        </p>
        <p className="mt-1.5 font-mono text-mute/85 text-[11px] tracking-[0.1em] leading-relaxed">
          {career.nextHint}
        </p>
        {/* 只露第一階一格(量尺,不是空牆)· 安靜 locked 樣式,不吊蘿蔔 */}
        <div className="mt-3 flex items-center gap-3 p-3 border border-line/40">
          <span className="font-mono text-xl tabular w-6 shrink-0 text-center text-mute/45">
            1
          </span>
          <div className="flex-1 min-w-0">
            <p className="flex items-baseline gap-2 flex-wrap">
              <span className="text-mute/55 text-base font-light tracking-tight">新秀</span>
              <span lang="en" className="font-mono text-mute/40 text-[9px] tracking-[0.3em]">
                ROOKIE
              </span>
            </p>
            <p className="text-mute/45 text-[12px] leading-snug mt-0.5">
              上榜:押滿 10 場已分勝負。
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── tier 1-4 · 攤開整條爬升(低→高 · 你在這 / 目前達到 / 尚未達到)──────────────────
  return (
    <div className="mt-6">
      <Eyebrow />
      <div className="flex flex-col gap-1.5">
        {RUNGS.map((r) => {
          // careerTier 最高到 4 → 第 5 階(神諭)本人面永遠是「上面」,永不標你在這。
          const isCurrent = r.n === career.tier && r.n <= 4;
          const isPassed = r.n < career.tier;
          const isOracle = r.n === 5;

          const rowCls = isCurrent
            ? "border-gold/60 bg-gold/[0.06]"
            : isPassed
              ? "border-line/50"
              : "border-line/40";
          const numCls = isCurrent
            ? "text-gold"
            : isPassed
              ? "text-mute/60"
              : "text-mute/45";
          const labelCls = isCurrent
            ? "text-gold text-lg font-light tracking-tight"
            : isPassed
              ? "text-bone/80 text-base font-light tracking-tight"
              : "text-mute/55 text-base font-light tracking-tight";

          return (
            <div key={r.n} className={`flex items-center gap-3 p-3 border ${rowCls}`}>
              <span
                className={`font-mono text-xl tabular w-6 shrink-0 text-center ${numCls}`}
              >
                {r.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="flex items-baseline gap-2 flex-wrap">
                  <span className={labelCls}>{r.zh}</span>
                  <span
                    lang="en"
                    className={`font-mono text-[9px] tracking-[0.3em] ${
                      isCurrent ? "text-gold/60" : isPassed ? "text-mute/55" : "text-mute/40"
                    }`}
                  >
                    {r.en}
                  </span>
                  {isCurrent && (
                    <span className="font-mono text-gold text-[9px] tracking-[0.25em] px-1.5 py-0.5 border border-gold/50">
                      你在這
                    </span>
                  )}
                  {isPassed && (
                    <span className="font-mono text-gold/70 text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/30">
                      目前達到
                    </span>
                  )}
                </p>

                {isCurrent ? (
                  <>
                    {accuracy !== null && (
                      <p className="font-mono text-gold/70 text-[11px] tracking-[0.1em] tabular mt-1">
                        命中率 {accuracy}% · {decided} 場
                      </p>
                    )}
                    {/* 落差 = careerTier nextHint「逐字」· 赤裸 delta,不加驚嘆、不加倒數 */}
                    <p className="font-mono text-mute/85 text-[11px] tracking-[0.1em] leading-relaxed mt-1.5">
                      {career.nextHint}
                    </p>
                  </>
                ) : (
                  <p
                    className={`text-[12px] leading-snug mt-0.5 ${
                      isPassed ? "text-mute" : "text-mute/45"
                    }`}
                  >
                    {r.one}
                  </p>
                )}

                {/* 神諭:本人面永遠摸不到 → 一行 muted 連天梯(唯一的 /ladder 橋)*/}
                {isOracle && (
                  <Link
                    href="/ladder"
                    className="mt-1.5 inline-block font-mono text-mute/45 hover:text-gold/70 text-[10px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
                  >
                    全站第一才有 · 看天梯 →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 可收回看得見:已過的階是「目前達到」非永久獎盃 —— 守不住 on-read 自動掉(litmus 防線)*/}
      <p className="font-mono text-mute/55 text-[10px] tracking-[0.15em] mt-3">
        守不住會掉階 · 每次都重算
      </p>
    </div>
  );
}
