"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { readAnonPicks, removeAnonPicks } from "@/lib/anon-picks";
import { submitPrediction } from "@/lib/predictions-market";

// ── ZONE 27 · Anon Pick Migrator ────────────────────────
// Fixes the core funnel bug: every anon→login CTA promises「登入 → 存成
// 永久戰績、進群眾市場、爬天梯」(CardBetStrip · UserPredictionPicker ·
// LadderPosition · AnonCalibrationStrip)· 但登入後沒有任何一行程式把
// localStorage 的 picks 重放進共享 predictions 表 → 押了 8 手的訪客登入後
// /member 仍顯示「0 場 · 還沒押任何一場」。 產品裡被講最多次的留存承諾是假的。
//
// 此 island 全站掛載(layout.tsx)· 首次帶 session 的 render 時:讀 anon
// picks → 對「尚未結算」的場用 submitPrediction 重放(冪等 · server 以
// already_predicted 擋重複)→ 把已遷移的從 localStorage 移除 → router.refresh()
// 讓 server-rendered 的「你的準度」立刻點亮。
//
// 誠信護欄(品牌護城河 · 同 /audit calibration honesty):**只遷移尚未結算的
// 場**。 submit_prediction 沒有 server 端的賽事時間檢查(賽事資料在 client 端
// lib/matches.ts · 不在 DB)· 若把「已知結果」的場補進共享市場 = 賽後補單 =
// 正是天梯/準度禁止的造假。 已結算的 anon picks 留在本地(仍顯示在 anon 戰績條)·
// 永久戰績從「還沒開的那幾手」開始接續。
// ─────────────────────────────────────────────────────

export default function AnonPickMigrator({
  nonFinalMatchIds,
}: {
  nonFinalMatchIds: string[];
}) {
  const router = useRouter();

  useEffect(() => {
    const picks = readAnonPicks();
    if (picks.length === 0) return;
    const eligible = new Set(nonFinalMatchIds);
    const toMigrate = picks.filter((p) => eligible.has(p.matchId));
    if (toMigrate.length === 0) return;

    let cancelled = false;
    (async () => {
      // Only act for a logged-in visitor · anon users have nothing to migrate.
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      if (cancelled || !data.session) return;

      const migratedIds: string[] = [];
      for (const p of toMigrate) {
        if (cancelled) return;
        const res = await submitPrediction(p.matchId, p.pickedSide);
        if (res.ok || res.reason === "already_predicted") {
          // newly written, or already in the table (another device) — either
          // way it now lives in the DB · safe to drop the local copy.
          migratedIds.push(p.matchId);
        } else if (res.reason === "not_logged_in") {
          return; // session vanished mid-flight · abort, retry next load
        }
        // invalid / error → skip this one, keep it local for a later retry
      }
      if (cancelled || migratedIds.length === 0) return;
      removeAnonPicks(migratedIds);
      router.refresh(); // repaint server-rendered counts (e.g. /member 你的準度)
    })();

    return () => {
      cancelled = true;
    };
  }, [nonFinalMatchIds, router]);

  return null;
}
