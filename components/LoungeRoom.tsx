"use client";

// ── ZONE 27 · 會員之間的房間 · 互動殼(client island)─────────────────────────────
// 上面發言框 + 下面留言牆。 feed 由 server 撈好傳進來(SSR · initialMessages)· 發 / 撤回後
// router.refresh() 讓 server 重撈(資料口徑單一 · 不在 client 重算身分)。 排序純時間,0 排名。
// 🔴 內文一律當純文字 render(React 預設跳脫 · whitespace-pre-wrap 保留換行)= 0 XSS · 無 HTML。
// ─────────────────────────────────────────────────────

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { LoungeMessage } from "@/lib/lounge";
import {
  postLoungeMessage,
  deleteLoungeMessage,
  loungeErrorText,
  type LoungeError,
} from "@/lib/lounge-client";

const MAX = 1000;

export default function LoungeRoom({
  initialMessages,
}: {
  initialMessages: LoungeMessage[];
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [err, setErr] = useState<LoungeError | null>(null);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const trimmed = body.trim();
  const canPost = trimmed.length > 0 && trimmed.length <= MAX && !busy && !pending;

  async function submit() {
    if (!canPost) return;
    setBusy(true);
    setErr(null);
    const res = await postLoungeMessage(trimmed);
    setBusy(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    setBody("");
    startTransition(() => router.refresh());
  }

  async function remove(id: string) {
    setBusy(true);
    const res = await deleteLoungeMessage(id);
    setBusy(false);
    if (res === "ok") startTransition(() => router.refresh());
  }

  return (
    <div>
      {/* 發言框 */}
      <div className="border border-gold/30 bg-slate/30 p-4 sm:p-5">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, MAX))}
          rows={3}
          placeholder="跟房間裡的人說點什麼 —— 聊球、聊判斷、打個招呼。"
          aria-label="在會員房間發言"
          className="w-full bg-navy/40 border border-line/60 focus:border-gold/50 outline-none text-bone text-sm leading-relaxed p-3 resize-y placeholder:text-mute/50"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span
            className={`font-mono text-[10px] tabular tracking-[0.15em] ${
              trimmed.length > MAX ? "text-loss" : "text-mute/50"
            }`}
          >
            {trimmed.length} / {MAX}
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={!canPost}
            className="px-6 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy || pending ? "送出中…" : "發言"}
          </button>
        </div>
        {err && (
          <p role="alert" className="mt-2 text-loss/90 text-[12px] leading-relaxed">
            {loungeErrorText(err)}
            {err === "members_only" && (
              <>
                {" "}
                <Link href="/membership" className="text-gold underline-offset-2 hover:underline">
                  看看會員
                </Link>
              </>
            )}
          </p>
        )}
      </div>

      {/* 留言牆 */}
      <div className="mt-6">
        {initialMessages.length === 0 ? (
          <div className="border border-line/60 bg-slate/20 p-6 text-center">
            <p className="text-bone text-sm font-light leading-relaxed">
              還沒有人開口。
            </p>
            <p className="mt-1.5 text-mute/80 text-[12px] leading-relaxed">
              你可以是第一個 —— 這間房間從你這句話開始。
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4 list-none pl-0 m-0">
            {initialMessages.map((m) => (
              <li key={m.id} className="flex gap-3">
                <Link href={`/u/${m.authorCode}`} className="shrink-0 mt-0.5">
                  <Avatar seed={m.authorCode} size={34} supporter={m.supporter} />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <Link
                      href={`/u/${m.authorCode}`}
                      className="text-bone text-sm font-light tracking-tight hover:text-gold transition-colors truncate"
                    >
                      {m.authorName}
                    </Link>
                    {m.supporter && (
                      <span className="font-mono text-gold/70 text-[9px] tracking-[0.25em]">
                        金環
                      </span>
                    )}
                    <span className="font-mono text-mute/45 text-[10px] tabular tracking-[0.12em]">
                      {m.timeLabel}
                    </span>
                    {m.isMine && (
                      <button
                        type="button"
                        onClick={() => remove(m.id)}
                        disabled={busy || pending}
                        className="ml-auto font-mono text-mute/45 hover:text-loss text-[10px] tracking-[0.15em] transition-colors disabled:opacity-40"
                        aria-label="撤回這則發言"
                      >
                        撤回
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-mute text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {m.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
