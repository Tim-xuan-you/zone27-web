/* ── ZONE 27 · Service Worker · 結算提醒推播 ──────────────────────────────
 * 只做一件事:收到 push → 顯示「你押的比賽結算了 · 回來對帳」· 點擊 → 開 /member/inbox。
 * 🔴 品牌:只播結算事件(命中+落空同權重)· 平靜對帳語氣 · 無 FOMO / 無慫恿再押。
 * 純前端 · 0 追蹤。 payload 由送出端(GitHub Action · web-push)帶來,壞掉時用安全預設。
 * ──────────────────────────────────────────────────────────────────── */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  const title = data.title || "ZONE 27 · 結算了";
  const body = data.body || "你押的比賽有結果了 · 回來對帳";
  const url = typeof data.url === "string" ? data.url : "/member/inbox";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon",
      badge: "/icon",
      // 同一波結算用同 tag → 不疊一堆通知(取代而非堆積)。
      tag: typeof data.tag === "string" ? data.tag : "zone27-settlement",
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target =
    (event.notification.data && event.notification.data.url) || "/member/inbox";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // 已有開著的分頁 → 聚焦它(不另開一個);否則開新視窗。
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate?.(target);
            return client.focus();
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(target);
      }),
  );
});
