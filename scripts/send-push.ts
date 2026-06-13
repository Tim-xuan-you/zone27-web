/* ── ZONE 27 · 結算推播送出端(web-push)· R233 ───────────────────────────────
 * 由 .github/workflows/push-settlements.yml 在 CPBL 賽果鏡像成功後跑(tsx 執行)。
 * 流程:已結算 CPBL 場(近 N 天)→ 撈「押了、還沒推過」的人 → 一人一則平靜對帳推播。
 *
 * 🔴 隱私(Tim 拍板):不用 service_role(留本機)。 用 anon key + PUSH_FUNCTION_SECRET token
 *   走窄權限 SECURITY DEFINER 函式(migration 0028):get_pending_push_targets / record_push_delivery
 *   / prune_push_subscription —— 只能做這三件事,碰不到別的。
 * 🔴 資安:絕不 log endpoint / 金鑰 / user_id / 回應 body(GitHub log 公開可見)· 只 log 計數 + 錯誤 status。
 * 🔴 品牌:文案只說「結算了 · 回來對帳」· 命中落空同權重 · 0 PnL/連勝/紅綠/FOMO/慫恿再押 · 0 PII in payload。
 * 🔴 graceful:任一 env 未設(Tim 還沒設金鑰)→ no-op exit 0(不讓 Action 變紅)。
 * 🔴 鐵律:本腳本對結算「顯示」唯讀無副作用 —— 只讀 getFinalizedMatches + 寫 push 專屬表,
 *   絕不碰 matches/predictions/user_metadata。 推播送不送都不影響站上顯示。
 * ──────────────────────────────────────────────────────────────────────── */

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { getFinalizedMatches } from "@/lib/matches";

const RECENT_DAYS = 3; // 只推近 3 天結算的場 → 防上線時把陳年舊場一次轟炸 + 收斂查詢量。

type Target = {
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  match_id: string;
};

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const secret = process.env.PUSH_FUNCTION_SECRET;
  const vapidPublic = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;

  // graceful:未設定齊全 → 安靜跳過(Action 不變紅 · 讓 Tim 設好金鑰前一切 dormant)。
  if (!url || !anon || !secret || !vapidPublic || !vapidPrivate || !vapidSubject) {
    console.log("push: not configured (missing env) — skipping, no-op.");
    return;
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
  const sb = createClient(url, anon, { auth: { persistSession: false } });

  // 近 N 天已結算的 CPBL 場(用站上同一份權威結算判定 getFinalizedMatches · 零 drift)。
  const cutoff = new Date(Date.now() + 8 * 3600e3 - RECENT_DAYS * 86400e3)
    .toISOString()
    .slice(0, 10); // 台北日 YYYY-MM-DD
  const matchIds = getFinalizedMatches()
    .filter(
      (m) =>
        m.id.startsWith("cpbl-") &&
        m.finalResult &&
        typeof m.finalResult.ingestedAt === "string" &&
        m.finalResult.ingestedAt >= cutoff,
    )
    .map((m) => m.id);

  if (matchIds.length === 0) {
    console.log("push: no recent CPBL settlements — nothing to send.");
    return;
  }

  const { data, error } = await sb.rpc("get_pending_push_targets", {
    p_secret: secret,
    p_match_ids: matchIds,
  });
  if (error) {
    // 不 log error 內容(可能含 detail)· 只 log code → exit 1 讓 Tim 收到 Action 失敗信。
    console.error("push: get_pending_push_targets failed, code=", error.code ?? "unknown");
    process.exitCode = 1;
    return;
  }
  const targets = (data ?? []) as Target[];
  if (targets.length === 0) {
    console.log(`push: recent=${matchIds.length} · no pending targets.`);
    return;
  }

  // 按 user 聚合:去重 endpoint(同人多裝置)+ 收集待推 match。
  const byUser = new Map<
    string,
    { endpoints: Map<string, { p256dh: string; auth: string }>; matches: Set<string> }
  >();
  for (const t of targets) {
    let u = byUser.get(t.user_id);
    if (!u) {
      u = { endpoints: new Map(), matches: new Set() };
      byUser.set(t.user_id, u);
    }
    u.endpoints.set(t.endpoint, { p256dh: t.p256dh, auth: t.auth });
    u.matches.add(t.match_id);
  }

  let sent = 0;
  let pruned = 0;
  let failedUsers = 0;

  for (const [userId, info] of byUser) {
    const n = info.matches.size;
    const payload = JSON.stringify({
      title: `你押的 ${n} 場有結果了`,
      body: "回來對帳 · 命中與落空都在收件匣裡。",
      url: "/member/inbox",
      tag: "zone27-settlement",
    });

    let anySuccess = false;
    for (const [endpoint, keys] of info.endpoints) {
      try {
        await webpush.sendNotification({ endpoint, keys }, payload);
        anySuccess = true;
        sent++;
      } catch (e: unknown) {
        const code = (e as { statusCode?: number } | null)?.statusCode;
        if (code === 404 || code === 410) {
          // 訂閱永久失效 → 清掉(窄權限函式 · 不 log endpoint)。
          await sb.rpc("prune_push_subscription", { p_secret: secret, p_endpoint: endpoint });
          pruned++;
        } else {
          // 暫時性錯誤(429/5xx 等)→ 保留訂閱 · 只 log status · 不中斷整批。
          console.error("push: send error, status=", code ?? "unknown");
        }
      }
    }

    // 至少一個裝置送成功 → 記下這些 (user,match) 已推(冪等 · 防下輪重推)。
    if (anySuccess) {
      for (const mid of info.matches) {
        const { error: recErr } = await sb.rpc("record_push_delivery", {
          p_secret: secret,
          p_user_id: userId,
          p_match_id: mid,
        });
        // 記「已推」失敗 = 去重缺口(下輪可能重推一次)→ 報警讓 Tim 看到,不靜默。
        if (recErr) {
          console.error("push: record_push_delivery failed, code=", recErr.code ?? "unknown");
          process.exitCode = 1;
        }
      }
    } else {
      failedUsers++;
    }
  }

  console.log(
    `push: recent=${matchIds.length} users=${byUser.size} sent=${sent} pruned=${pruned} failedUsers=${failedUsers}`,
  );
}

main().catch((e: unknown) => {
  // 最外層:只 log 型別/訊息摘要 · 不 dump 物件(避免任何敏感欄位入 log)· exit 1 報警。
  console.error("push: fatal —", e instanceof Error ? e.message : "unknown error");
  process.exitCode = 1;
});
