import {
  VERDICT_MIN,
  type CalibrationReport,
} from "@/lib/calibration-master";

// ── ZONE 27 · 校準大師「呈現層」(純展示 · 無 hook)──────────────────────────────
// 「你說的把握 vs 實際中的」逐桶圖。 抽成純 presentational 元件 → /member 的客戶端卡
// (CalibrationMasterCard · 自己抓本人 picks 算 report)+ /u 公開檔(server 端從 0027 公開
// confidence 算好 report 傳進來)共用同一張臉,口徑/視覺零漂移。
//
// subject 預設「你」(會員自己看)· 公開檔傳「TA」(看別人的校準)→ 其餘文案不變。
// graceful:report 為 null / total=0 / 既無已結算也無待結算 → 回 null(呼叫端不顯示)。
// 🔴 含輸照算 · 小樣本不下判語(verdict ≥ VERDICT_MIN)· 暗金無紅綠。
// ─────────────────────────────────────────────────────

export default function CalibrationMasterView({
  report,
  subject = "你",
  wrapperClass = "mt-6",
}: {
  report?: CalibrationReport | null;
  /** 主詞:「你」(本人)或「TA」(公開檔看別人)· 只換稱呼、不換口徑。 */
  subject?: string;
  wrapperClass?: string;
}) {
  if (!report || report.total === 0) return null;
  if (report.decided === 0 && report.pending === 0) return null;

  const { decided, pending, late, push, buckets, statedAvg, actualAvg, verdict } =
    report;

  return (
    <section className={wrapperClass}>
      <div className="border border-gold/30 bg-slate/30 p-5 sm:p-6">
        <div className="flex items-baseline gap-3 flex-wrap mb-1">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
            {subject}的校準 · {subject}說的 vs 實際中的
          </p>
        </div>
        <p className="text-mute/85 text-[13px] leading-relaxed mb-4">
          押注時{subject}宣告的把握 · 對上賽後真的中沒中 ——{" "}
          <span className="text-bone">
            {subject}說 8 成的場,是不是真的中 8 成?
          </span>{" "}
          這比「贏幾場」更難、也更誠實。
        </p>

        {decided === 0 ? (
          // 還沒有結算的把握紀錄 → 誠實「累積中」(同站上其他空狀態 · 不假裝有資料)。
          <div className="border border-dashed border-gold/30 bg-slate/40 p-5">
            <p className="text-bone text-sm leading-relaxed">
              {subject}宣告過{" "}
              <span className="font-mono text-gold tabular">{pending}</span>{" "}
              場把握 · 還沒結算。
            </p>
            <p className="mt-2 text-mute text-[13px] leading-relaxed">
              等這些場一場場打完對帳,這裡就會長出{subject}的校準 —— {subject}說的把握、跟實際中的並排攤開。
            </p>
          </div>
        ) : (
          <>
            {/* 整體判語(夠場數才下 · 含輸照算)*/}
            {verdict && statedAvg !== null && actualAvg !== null ? (
              <p className="text-bone text-base sm:text-lg leading-relaxed mb-4">
                {verdict === "over" && (
                  <>
                    {subject}偏向<span className="text-gold">過度自信</span> —— 平均說{" "}
                    <span className="font-mono tabular">
                      {Math.round(statedAvg)}%
                    </span>{" "}
                    把握,實際中{" "}
                    <span className="font-mono tabular">
                      {Math.round(actualAvg)}%
                    </span>
                    。
                  </>
                )}
                {verdict === "under" && (
                  <>
                    {subject}偏<span className="text-gold">保守</span> —— 平均說{" "}
                    <span className="font-mono tabular">
                      {Math.round(statedAvg)}%
                    </span>
                    ,實際中{" "}
                    <span className="font-mono tabular">
                      {Math.round(actualAvg)}%
                    </span>{" "}
                    · {subject}可以更敢一點。
                  </>
                )}
                {verdict === "good" && (
                  <>
                    <span className="text-gold">蠻準的</span> —— {subject}說平均{" "}
                    <span className="font-mono tabular">
                      {Math.round(statedAvg)}%
                    </span>
                    ,實際也中{" "}
                    <span className="font-mono tabular">
                      {Math.round(actualAvg)}%
                    </span>
                    。 說幾成、就真的幾成。
                  </>
                )}
              </p>
            ) : (
              <p className="text-mute text-[13px] leading-relaxed mb-4">
                目前{" "}
                <span className="font-mono text-bone tabular">{decided}</span> 場有結算 ·
                滿 <span className="tabular">{VERDICT_MIN}</span>{" "}
                場才開始講「{subject}偏自信還是偏保守」—— 幾場的準不準是運氣。
              </p>
            )}

            {/* 逐把握桶:金 fill = 實際中的 · 骨白 marker = 說的 · 差距一眼看出 */}
            <div className="space-y-3">
              {buckets.map((b) => (
                <div key={b.confidence}>
                  <div className="flex items-baseline justify-between gap-2 mb-1 font-mono text-[10px] tracking-[0.12em]">
                    <span className="text-mute/85">
                      {subject}說{" "}
                      <span className="text-bone tabular">{b.confidence / 10} 成</span>{" "}
                      把握 · <span className="tabular">{b.n}</span> 場
                    </span>
                    <span className="text-gold tabular">
                      實際中 {Math.round(b.actualPct)}%
                    </span>
                  </div>
                  {/* 0-100% track · 金 fill 到實際命中率 · 骨白豎線在「說的把握」位置 */}
                  <div className="relative h-2 bg-line/50 rounded-full overflow-visible">
                    <div
                      className="absolute left-0 top-0 h-full bg-gold/55 rounded-full"
                      style={{ width: `${Math.max(0, Math.min(100, b.actualPct))}%` }}
                    />
                    <div
                      className="absolute -top-[3px] h-[14px] w-[2px] bg-bone"
                      style={{
                        left: `calc(${Math.max(0, Math.min(100, b.confidence))}% - 1px)`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 font-mono text-mute/55 text-[9px] tracking-[0.15em] leading-relaxed">
              ▸ 骨白線 = {subject}說的把握 · 金 = 實際中的 · 兩個越貼近,{subject}越「說幾成就真幾成」。
              {decided < 30 && <> 才 {decided} 場 · 多打幾場才更準。</>}
              {late > 0 && <> {late} 場開賽後才押 · 不計入。</>}
              {push > 0 && <> {push} 場平手 · 不計入(同戰績口徑)。</>}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
