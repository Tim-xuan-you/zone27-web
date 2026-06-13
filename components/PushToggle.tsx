"use client";

import { useEffect, useState } from "react";
import {
  getPushState,
  subscribeToPush,
  unsubscribeFromPush,
  type PushState,
} from "@/lib/push-client";

// ── ZONE 27 · 結算提醒開關(web-push)─────────────────────────────────────
// /member 上的「開啟結算提醒」· 賽果結算後主動把你帶回來對帳(含贏含輸 · 隨時可關)。
// 🔴 graceful:瀏覽器不支援 / 站方還沒設 VAPID 金鑰 → 整顆隱藏(不開壞掉的鈕 = 不開空頭支票)。
// 🔴 品牌:只提醒「結算」這件事 · 不催你再押 · 不曬連勝 · 不嚇你「錯過了」。
// ─────────────────────────────────────────────────────

export default function PushToggle() {
  const [state, setState] = useState<PushState | "loading">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPushState().then((s) => {
      if (!cancelled) setState(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 不支援 / 站方未啟用 / 還在判斷 → 整顆不顯示(不開空頭支票)。
  if (state === "loading" || state === "unsupported" || state === "no-vapid") {
    return null;
  }

  const onSubscribe = async () => {
    setBusy(true);
    const r = await subscribeToPush();
    setState(r.state);
    setBusy(false);
  };
  const onUnsubscribe = async () => {
    setBusy(true);
    const r = await unsubscribeFromPush();
    setState(r.state);
    setBusy(false);
  };

  return (
    <div className="bg-slate/40 border border-line/60 p-5 sm:p-6">
      <p className="font-mono text-gold/80 text-[9px] tracking-[0.4em] mb-3">
        / 結算提醒
      </p>

      {state === "subscribed" ? (
        <>
          <p className="text-bone/90 text-sm leading-relaxed mb-4">
            <span className="text-gold">已開啟</span> —— 賽果一結算,我們會在這個裝置提醒你回來對帳。
            含贏含輸,不催你再押。
          </p>
          <button
            type="button"
            onClick={onUnsubscribe}
            disabled={busy}
            className="font-mono text-mute/80 hover:text-loss text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors disabled:opacity-50"
          >
            {busy ? "關閉中…" : "關閉提醒"}
          </button>
        </>
      ) : state === "denied" ? (
        <p className="text-mute text-sm leading-relaxed">
          通知被這個瀏覽器封鎖了。 到瀏覽器的網站設定,把 ZONE 27 的通知改成「允許」,
          就能在賽果結算後收到對帳提醒。
        </p>
      ) : (
        <>
          <p className="text-mute text-sm leading-relaxed mb-4">
            賽果一結算,在這個裝置<span className="text-bone">提醒你回來對帳</span> ——
            含贏含輸、隨時可關。 不催你再押、不曬連勝、不嚇你錯過。
          </p>
          <button
            type="button"
            onClick={onSubscribe}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-gold/45 hover:border-gold hover:bg-gold/5 text-gold font-mono text-[11px] tracking-[0.2em] px-5 py-2.5 transition-colors disabled:opacity-50"
          >
            {busy ? "開啟中…" : "開啟結算提醒"}
          </button>
        </>
      )}
    </div>
  );
}
