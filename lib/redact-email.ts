// ── ZONE 27 · PII redaction for logs ──────────────────
// PII 不入 server log:Vercel log 看得到的人不只 Tim · email 能直接識別本人。
// 只留網域(同 lib/founders-apply.ts 既有房規 · 守 /privacy「0 追蹤」)· 除錯靠 queue#/id 不靠 email。
// 獨立非「use server」模組:lib/email.ts 與 lib/waitlist.ts 都是 server action 檔(所有 export 必須 async)·
// 純同步 helper 不能掛在那兩個檔上 → 抽到這裡共用(同 lib/waitlist-types.ts 非 async helper 的處理)。
// ─────────────────────────────────────────────────────

export function redactEmail(email: string): string {
  const at = typeof email === "string" ? email.lastIndexOf("@") : -1;
  return at > 0 ? `***@${email.slice(at + 1)}` : "***";
}
