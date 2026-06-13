"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── ZONE 27 · web-push 訂閱 client ────────────────────────────────────────
// 瀏覽器端:註冊 service worker → 要權限 → pushManager.subscribe → 把訂閱(endpoint +
// 兩把金鑰)存進 Supabase(走 SECURITY DEFINER RPC · 認 auth.uid()· 見 migration 0028)。
// 送出端(GitHub Action · web-push)用 anon key + push_secret token 走窄權限函式
// (get_pending_push_targets / record_push_delivery / prune_push_subscription)讀回來主動推播
// —— 刻意不用 service-role(service_role 留 Tim 本機 · 見 migration 0028 + /privacy 承諾)。
//
// 🔴 graceful:沒設 NEXT_PUBLIC_VAPID_PUBLIC_KEY(Tim 還沒貼金鑰)→ getPushState 回
//   'no-vapid' · UI 整顆隱藏(不給壞掉的「開啟提醒」鈕 = 不開空頭支票)。 套完金鑰即活。
// 🔴 0 PII:只存推播 endpoint + p256dh/auth(瀏覽器產的訂閱金鑰)· 不存 email / 任何個資。
// ─────────────────────────────────────────────────────

export type PushState =
  | "unsupported" // 瀏覽器不支援(無 SW / PushManager / Notification)
  | "no-vapid" // 站方還沒設 VAPID 公鑰 → 功能未啟用
  | "denied" // 使用者已封鎖通知權限
  | "subscribed" // 已訂閱
  | "subscribable"; // 可訂閱(支援 + 有金鑰 + 權限未封鎖 + 尚未訂閱)

function vapidPublicKey(): string {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// base64url VAPID 公鑰 → Uint8Array(pushManager.subscribe 的 applicationServerKey 要求)。
// 明確以 ArrayBuffer 為底(非 ArrayBufferLike)→ 滿足 BufferSource 型別。
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const arr = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function ensureServiceWorker(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration();
  if (existing) return existing;
  return navigator.serviceWorker.register("/sw.js");
}

export async function getPushState(): Promise<PushState> {
  if (!isPushSupported()) return "unsupported";
  if (!vapidPublicKey()) return "no-vapid";
  if (Notification.permission === "denied") return "denied";
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    return sub ? "subscribed" : "subscribable";
  } catch {
    return "subscribable";
  }
}

type Result = { ok: boolean; state: PushState; reason?: string };

export async function subscribeToPush(): Promise<Result> {
  if (!isPushSupported()) return { ok: false, state: "unsupported" };
  const key = vapidPublicKey();
  if (!key) return { ok: false, state: "no-vapid" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return {
      ok: false,
      state: permission === "denied" ? "denied" : "subscribable",
      reason: "permission",
    };
  }

  try {
    const reg = await ensureServiceWorker();
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });
    }
    const json = sub.toJSON();
    const endpoint = json.endpoint ?? "";
    const p256dh = json.keys?.p256dh ?? "";
    const auth = json.keys?.auth ?? "";
    if (!endpoint || !p256dh || !auth) {
      return { ok: false, state: "subscribable", reason: "bad_subscription" };
    }
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("save_push_subscription", {
      p_endpoint: endpoint,
      p_p256dh: p256dh,
      p_auth: auth,
    });
    if (error || data === "anon") {
      return { ok: false, state: "subscribable", reason: "store_failed" };
    }
    return { ok: true, state: "subscribed" };
  } catch {
    return { ok: false, state: "subscribable", reason: "subscribe_failed" };
  }
}

export async function unsubscribeFromPush(): Promise<Result> {
  if (!isPushSupported()) return { ok: false, state: "unsupported" };
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    if (sub) {
      const endpoint = sub.toJSON().endpoint ?? "";
      await sub.unsubscribe();
      if (endpoint) {
        const supabase = createSupabaseBrowserClient();
        await supabase.rpc("delete_push_subscription", { p_endpoint: endpoint });
      }
    }
    return { ok: true, state: "subscribable" };
  } catch {
    return { ok: false, state: "subscribed", reason: "unsubscribe_failed" };
  }
}
