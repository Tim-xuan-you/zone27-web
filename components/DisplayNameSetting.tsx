"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Avatar from "@/components/Avatar";
import { creatorIdentity, mentionToken } from "@/lib/identity";

// ── ZONE 27 · DisplayNameSetting · 公開顯示名 ──────────────
// Tim dogfood「球迷 #46f6741a 不知道是誰 · 能不能自己設名字」。
// 會員設公開名稱 → 存 auth user_metadata.display_name → migration 0014/0015 讓三支
// RPC 回顯示名 + 永久碼(沒設則維持匿名代號 · 隱私 opt-in 不變)。
// 預設一行(頭像 + 名 + 永久碼 + 改名)= 守 /member 極簡 · 點「改名」才展開輸入。
//
// 🔑 問責命門(0015):名字只是「標籤」· 戰績綁**永久碼**(改名洗不掉、同名不撞)·
//   永久碼一直顯示在名字旁 → 改名免費無限次也賴不掉戰績 = 報馬仔刪輸文的反面。
//   這裡的頭像/署名 reuse creatorIdentity → 跟公開分析署名「同一張臉、同一把碼」。
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

  // 永久碼 = anonHandle「球迷 #xxxx」裡的 #xxxx(= md5(uid) 前 8 碼 · 跟 SQL author_code 一致)。
  // reuse creatorIdentity → /member 自己的臉/碼 = 公開分析署名同一張(改名不換臉色)。
  const code = mentionToken(anonHandle).replace(/^#/, "");
  const id = creatorIdentity({
    handle: anonHandle,
    authorCode: code,
    displayName: name,
  });

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
        <Avatar seed={id.seed} glyph={id.glyph} size={26} />
        <span className="font-mono text-bone text-[12px] tracking-[0.1em]">
          {id.label}
        </span>
        {/* 永久代號 · 改名也認得出同一人 · 戰績綁這個碼(問責命門) */}
        {id.code && (
          <span
            title="永久代號 · 改名也認得出同一人 · 你的戰績綁這個碼、洗不掉"
            className="font-mono text-mute/45 text-[10px] tracking-[0.15em]"
          >
            {id.code}
          </span>
        )}
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
            名字只是標籤 · 你的永久代號{" "}
            <span className="text-mute/75">#{code}</span>{" "}
            一直跟著(改名也認得出同一人 · 戰績綁這個碼、洗不掉)。 改名免費、改幾次都行 · 留空 = 只顯示代號。
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
