"use client";

import { useState } from "react";

// ── ZONE 27 · 押注理由(押完那刻寫一句「我為什麼看好」· 賽前鎖死)──────────────────
// Polymarket / Manifold DNA:不只押一邊,還把你的論點公開壓上去。 對一個賣「誠實對帳」的
// 品牌,賽前鎖死、改不了的『理由』比單純選邊更重的 costly signal —— 報馬仔事後才編故事,
// 我們賽前就把話講死、賽後攤開看打不打臉。 也讓單場收據從「我押了 X」升級成「我押了 X,因為 Y」。
//
// · 選填:預設收合成一行小連結,不逼人、不洗版(信心值才是主追問 · 這是次要的選配)。
// · 一次性:設了就不能改(server set_prediction_rationale 已寫過不覆蓋 = 先鎖後結誠信)·
//   所以也只在「剛押完這一刻」出現 · reload 不再追問。
// · 樂觀:鎖下立刻顯示「✓ 已鎖死」· 背景送 · 失敗回滾 + 輕提示。
// · 暗金:mute → 金 · 無紅綠 · 無 emoji(✓ 例外)· ≤200 字(一句話,不是一篇文)。
// ─────────────────────────────────────────────────────

const MAX = 200;

export default function RationalePicker({
  matchId,
  submit,
}: {
  matchId: string;
  /** 寫理由的 RPC 包裝(setPredictionRationale)· 回 true = 成功 */
  submit: (matchId: string, rationale: string) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);

  const save = async () => {
    const v = text.trim().slice(0, MAX);
    if (saving || locked !== null || v.length === 0) return;
    setErr(false);
    setLocked(v); // 樂觀:立刻顯示已鎖
    setSaving(true);
    const ok = await submit(matchId, v);
    if (!ok) {
      setLocked(null); // 回滾
      setErr(true);
    }
    setSaving(false);
  };

  // 已鎖 → 確認版(賽前鎖死、改不了 · 同收據語彙)。
  if (locked !== null) {
    return (
      <div className="mt-2.5">
        <p className="font-mono text-gold/85 text-[10px] tracking-[0.12em] mb-1">
          ✓ 賽前鎖死你的理由 · 公開 · 改不了
        </p>
        <p className="text-bone/90 text-[13px] leading-relaxed">「{locked}」</p>
      </div>
    );
  }

  // 收合:一行小連結(不佔版面 · 不逼人)。
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2.5 inline-flex items-center font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
      >
        ▸ 寫一句你為什麼看好(選填 · 公開 · 賽前鎖死)
      </button>
    );
  }

  // 展開:輸入 + 鎖死。
  const remaining = MAX - text.length;
  return (
    <div className="mt-2.5">
      <p className="font-mono text-mute/70 text-[9px] tracking-[0.18em] mb-1.5">
        你為什麼看好這一手?(選填 · 鎖下就改不了)
      </p>
      <p className="text-mute/60 text-[11px] leading-snug mb-1.5">
        這句會<span className="text-gold/80">公開</span>掛在這場、連著你的校準檔 —— 賽後攤開看打不打臉。
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        rows={2}
        maxLength={MAX}
        disabled={saving}
        placeholder="例:先發投手近況壓制 + 對手客場打線冷,低分膠著我吃主隊。"
        aria-label="你為什麼看好這一手(選填)"
        className="w-full resize-none bg-slate/40 border border-gold/30 focus:border-gold/60 text-bone text-[13px] leading-relaxed px-2.5 py-2 outline-none transition-colors placeholder:text-mute/40"
      />
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="font-mono text-mute/45 text-[9px] tracking-[0.12em] tabular">
          還可打 {remaining} 字
        </span>
        <button
          type="button"
          disabled={saving || text.trim().length === 0}
          onClick={save}
          className="font-mono text-[10px] tracking-[0.15em] border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/70 px-3 py-1.5 min-h-[44px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          鎖死這一句 →
        </button>
      </div>
      {err && (
        <p className="mt-1 font-mono text-loss/75 text-[9px] tracking-[0.15em]">
          沒記下 · 再鎖一次
        </p>
      )}
    </div>
  );
}
