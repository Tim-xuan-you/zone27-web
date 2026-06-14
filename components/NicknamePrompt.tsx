"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── ZONE 27 · 取暱稱 onboarding 提示(R237)──────────────────────────────
// 研究結論(Apple Game Center / Reddit / Baymard):**別在註冊表單強制取名**(增加摩擦、
// 降轉換)· 改在「已投入的時刻」漸進邀請。 我們選「自己取的真名」而非自動產生的可愛代號
// (品牌:身分 = 你的真帳本)。 這顆只在「還沒設顯示名」且「沒按過之後再說」時出現在 /member
// 頂端,取了名 / 按了跳過就消失(守會員頁極簡)。
//
// 🔴 紅線:跳過 = 一律可以(匿名是權利)· 戰績綁永久碼不綁名(改名洗不掉)· 不強迫、不羞辱。
// dismissed 存 user_metadata(server 已讀 → 無閃爍 · 跨裝置)。 show 由 server 算(無 hydration 風險)。
// ─────────────────────────────────────────────────────

const MAX = 24;

export default function NicknamePrompt({
  show,
  anonHandle,
  code,
}: {
  /** server 算好:還沒設顯示名 && 沒按過「之後再說」才 true */
  show: boolean;
  /** 目前的匿名顯示「球迷 #碼」 */
  anonHandle: string;
  /** 永久代號(戰績 key) */
  code: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(show);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const save = async () => {
    const v = name.trim().slice(0, MAX);
    if (!v || busy) return;
    setBusy(true);
    setErr(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        data: { display_name: v },
      });
      if (error) {
        setErr("存檔失敗 · 請再試一次");
        setBusy(false);
        return;
      }
      setOpen(false);
      router.refresh(); // 讓全站(脈動/聯盟/收據)立刻換成新名字
    } catch {
      setErr("存檔失敗 · 請再試一次");
      setBusy(false);
    }
  };

  const skip = async () => {
    if (busy) return;
    setOpen(false); // 先收起(樂觀)· 寫旗標失敗也不再煩
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.updateUser({ data: { nick_prompt_dismissed: true } });
    } catch {
      // 寫旗標失敗 → 這次 session 仍收起(localStorage 退路)
      try {
        localStorage.setItem("zone27_nick_prompt_dismissed", "1");
      } catch {
        /* 無痕模式 · 略過 */
      }
    }
  };

  return (
    <div className="border border-gold/55 bg-gold/[0.06] p-5 sm:p-6 mb-6">
      <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-2">
        / 給自己一個名字
      </p>
      <h2 className="text-xl sm:text-2xl text-bone font-light tracking-tight leading-snug mb-2">
        脈動牆、聯盟、收據上,大家看到的是<span className="text-gold">你</span>
      </h2>
      <p className="text-mute/90 text-[13px] leading-relaxed mb-4 max-w-xl">
        現在你顯示成「<span className="text-bone font-mono">{anonHandle}</span>」。 取個名字,
        朋友才認得出哪一手是你押的。 改名永遠免費 —— 你的戰績綁的是永久代號{" "}
        <span className="font-mono text-mute/80">#{code}</span>,改名也洗不掉。
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={name}
          maxLength={MAX}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
          }}
          placeholder="你的公開名稱"
          aria-label="你的公開名稱"
          autoFocus
          className="flex-1 min-w-[11rem] bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 placeholder:text-mute/50 font-mono text-[13px] transition-colors"
        />
        <button
          type="button"
          onClick={save}
          disabled={busy || name.trim().length === 0}
          className="shrink-0 px-4 py-2 bg-gold text-navy font-mono text-[11px] tracking-[0.2em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "存…" : "就叫這個 →"}
        </button>
        <button
          type="button"
          onClick={skip}
          disabled={busy}
          className="shrink-0 font-mono text-mute/55 hover:text-bone text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors disabled:opacity-50"
        >
          之後再說
        </button>
      </div>
      {err && (
        <p
          role="alert"
          className="mt-2 font-mono text-loss/85 text-[10px] tracking-[0.12em]"
        >
          {err}
        </p>
      )}
    </div>
  );
}
