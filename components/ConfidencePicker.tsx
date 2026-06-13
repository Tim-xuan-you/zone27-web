"use client";

import { useState } from "react";

// ── ZONE 27 · 信心值選擇器(校準大師 · 押完那刻宣告「我幾成把握」)──────────────
// 538/Metaculus 那種誠實預測平台的核心:不只押哪邊,還宣告你的把握 → 賽後攤開
// 「你說 8 成的場、是不是真的中 8 成」。 把「贏不贏」轉成「準不準」(玩運彩不敢做)。
//
// · 選填:不填完全 OK(不計入校準)· 不逼人。
// · 一次性:設了就不能改(server 端 set_prediction_confidence 已設過不覆蓋 = 先鎖後結誠信)·
//   所以也只在「剛押完這一刻」出現(declare conviction at lock time)· reload 不再追問。
// · 樂觀:點下立刻顯示「✓ 你說 X 成」· 背景送 · 失敗回滾 + 輕提示。
// · 暗金:選項 mute → hover/選中金 · 無紅綠 · 無 emoji(✓ 例外)。
// ─────────────────────────────────────────────────────

// 「幾成把握」· 5-9 成(50-90%)· 兩運動共用 · DB 允許 1-99,UI 給有意義的區間。
const LEVELS = [50, 60, 70, 80, 90];

export default function ConfidencePicker({
  matchId,
  submit,
}: {
  matchId: string;
  /** 寫信心值的 RPC 包裝(soccer / baseball 各自傳入)· 回 true = 成功 */
  submit: (matchId: string, confidence: number) => Promise<boolean>;
}) {
  const [conf, setConf] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);

  const choose = async (v: number) => {
    if (saving || conf !== null) return;
    setErr(false);
    setConf(v); // 樂觀:立刻顯示已選
    setSaving(true);
    const ok = await submit(matchId, v);
    if (!ok) {
      setConf(null); // 回滾
      setErr(true);
    }
    setSaving(false);
  };

  if (conf !== null) {
    // 確認 + 教「校準」是什麼(538/Metaculus 信心識讀):不是賽後看這一場準不準,
    // 是把你所有「同把握」的場收一起,看你說的把握是不是真的(高估 = 過度自信)。
    return (
      <div className="mt-2.5">
        <p className="font-mono text-gold/85 text-[10px] tracking-[0.12em]">
          ✓ 你說 {conf / 10} 成把握
        </p>
        <p className="mt-1 font-mono text-mute/55 text-[9px] tracking-[0.1em] leading-relaxed">
          賽後跟你其他「{conf / 10} 成」的場一起對 —— 看你是真的 {conf / 10} 成、還是高估了。
          這條校準曲線公開掛在你的戰績檔。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2.5">
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.18em] mb-1.5">
        你幾成把握?(選填 · 公開 · 賽後算「你說的 vs 實際中的」)
      </p>
      <div className="flex items-stretch gap-1">
        {LEVELS.map((v) => (
          <button
            key={v}
            type="button"
            disabled={saving}
            onClick={() => choose(v)}
            className="flex-1 min-h-[40px] font-mono text-[10px] tracking-[0.05em] border border-gold/30 text-mute hover:text-gold hover:border-gold/60 hover:bg-gold/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {v / 10}成
          </button>
        ))}
      </div>
      {/* 把握尺的兩端講白話(新手不知道為何從 5 成起跳)= 信心識讀 · 賽後一場場誠實對帳。 */}
      <p className="mt-1.5 font-mono text-mute text-[9px] tracking-[0.12em] leading-relaxed">
        5 成 = 跟丟銅板一樣沒把握 · 9 成 = 幾乎篤定。
      </p>
      {err && (
        <p className="mt-1 font-mono text-loss/75 text-[9px] tracking-[0.15em]">
          沒記下 · 再點一次
        </p>
      )}
    </div>
  );
}
