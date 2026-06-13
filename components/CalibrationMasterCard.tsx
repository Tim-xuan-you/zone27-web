"use client";

import { useEffect, useState } from "react";
import { getMyCalibrationPicks } from "@/lib/predictions-market";
import {
  computeConfidenceCalibration,
  type CalibrationResult,
  type CalibrationReport,
} from "@/lib/calibration-master";
import CalibrationMasterView from "@/components/CalibrationMasterView";

// ── ZONE 27 · 校準大師卡(你說的把握 vs 實際中的 · /member 本人版)──────────────
// 北極星「把誠實做成遊戲」最高級的一塊:押注時宣告「幾成把握」→ 攤開「你說 8 成的場、
// 是不是真的中 8 成」。 把「贏不贏」升級成「準不準」。
//
// · client island:讀本人 confidence 押注(get_my_calibration_picks)· server 傳賽果結果進來
//   (results · 跨運動 · 含開賽時間做先鎖後結)。
// · 視覺/口徑/空狀態全在共用呈現層 CalibrationMasterView(同 /u 公開檔同一張臉)·
//   沒填過把握 / 沒結算也沒待結算 → view 自己回 null(整卡隱藏 · 守會員極簡)。
// ─────────────────────────────────────────────────────

export default function CalibrationMasterCard({
  results,
  wrapperClass = "mt-6",
}: {
  /** matchId → { result, startISO } · server 端用同一份賽果建(棒球 finalWinner + 足球 outcome) */
  results: Record<string, CalibrationResult>;
  wrapperClass?: string;
}) {
  const [report, setReport] = useState<CalibrationReport | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const picks = await getMyCalibrationPicks();
      if (!alive) return;
      setReport(computeConfidenceCalibration(picks, results));
    })();
    return () => {
      alive = false;
    };
  }, [results]);

  // report=null(還沒抓完)/ total=0(沒填過把握)→ view 回 null · 整卡隱藏。 subject 預設「你」。
  return <CalibrationMasterView report={report} wrapperClass={wrapperClass} />;
}
