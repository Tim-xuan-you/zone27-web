"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Avatar from "@/components/Avatar";

// ── ZONE 27 · DisplayNameSetting · 公開顯示名 ──────────────
// Tim dogfood「球迷 #46f6741a 不知道是誰 · 能不能自己設名字」。
// 會員設公開名稱 → 存 auth user_metadata.display_name → migration 0014 讓三支
// RPC 把 handle 換成顯示名(沒設則維持匿名代號 · 隱私 opt-in 不變)。
// 預設一行(頭像 + 名 + 改名)= 守 /member 極簡 · 點「改名」才展開輸入。
// ─────────────────────────────────────────────────────

const MAX = 16;

export default function DisplayNameSetting({
  initialName,
  anonHandle,
  tierLabel,
}: {
  initialName: string;
  /** 沒設名字時用的匿名代號「球迷 #xxxx」· 也當頭像穩定 seed */
  anonHandle: string;
  tierLabel?: string;
}) {
  const [name, setName] = useState(initialName);
  const [draft, setDraft] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const shown = name.trim() || anonHandle;

  const save = async () => {
    const v = draft.trim().slice(0, MAX);
    setSaving(true);
    setErr(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        data: { display_name: v },
      });
      if (error) {
        setErr("存檔失敗 · 請再試一次");
      } else {
        setName(v);
        setEditing(false);
      }
    } catch {
      setErr("存檔失敗 · 請再試一次");
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Avatar seed={shown} size={26} />
        <span className="font-mono text-bone text-[12px] tracking-[0.1em]">
          {shown}
        </span>
        {tierLabel && (
          <span className="font-mono text-mute/70 text-[11px] tracking-[0.2em]">
            · {tierLabel}
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            setDraft(name);
            setEditing((v) => !v);
            setErr(null);
          }}
          className="font-mono text-mute/55 hover:text-gold text-[9px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
        >
          {editing ? "取消" : "改名"}
        </button>
      </div>

      {editing && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draft}
              maxLength={MAX}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="你的公開名稱"
              className="bg-ink/60 border border-line/70 text-bone px-3 py-1.5 outline-none focus:border-gold/60 placeholder:text-mute/50 font-mono text-[13px] w-44 transition-colors"
            />
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="shrink-0 px-3.5 py-1.5 bg-gold text-navy font-mono text-[10px] tracking-[0.2em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "存..." : "存"}
            </button>
          </div>
          <p className="font-mono text-mute/55 text-[9px] tracking-[0.1em] leading-relaxed max-w-xs">
            會顯示在你發表的分析、留言旁(取代代號)。 留空 = 用匿名代號 {anonHandle}。
          </p>
          {err && (
            <p
              role="alert"
              className="font-mono text-loss/85 text-[9px] tracking-[0.15em]"
            >
              {err}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
