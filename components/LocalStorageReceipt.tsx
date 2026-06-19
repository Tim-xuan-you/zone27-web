import Link from "next/link";
import {
  LOCAL_STORAGE_INVENTORY,
  LOCAL_STORAGE_KEY_COUNT,
} from "@/lib/local-storage-inventory";

// ── ZONE 27 · LocalStorage Receipt ──────────────────────
// R74 W-D · Agent A R73 SHIP 1 · Loewenstein & Issacharoff endowment-via-
// inventory(1994)· surface the 11-key localStorage inventory as a NAVIGABLE
// receipt rather than a buried /audit S06 DataTable。 visitor's own browser
// state listed in 1 place · same client-state-as-receipt grammar as Letterboxd
// diary(R70 W-B DailyReturnRail)+ Pinboard archive(R70 W-C SilentReceiptStream)·
// activates ownership cognition without tracking visitor activity。
//
// Single-source architecture(per R74 W-D refactor):
//   - lib/local-storage-inventory.ts = canonical 11-key ground truth
//   - components/LocalStorageReceipt.tsx = render layer · 2 variants
//   - app/audit/page.tsx S06 uses variant="audit"(inline · drop-in)
//   - app/member/page.tsx uses variant="receipt"(compact · top of dashboard)
//
// Variants:
//   - "receipt"(compact) · /member dashboard · top-of-page endowment surface
//     · shows count + 3-line stack + cross-link to /audit S06 detail
//   - "audit"(table) · /audit S06 detail · full DataTable-style render of
//     all 11 keys with notes + shipped round · replaces inline DataRow stack
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · /audit S06 「方法公開 · 延伸
//     到 client-side state」 grammar 物理 codify · 升級 component-level
//   - per /audit S05 PRE-COMMIT clause · content fidelity verified · this
//     is REFACTOR not POLICY MODIFICATION · same 11 keys + labels + notes
//   - per [[feedback-zone27-pratfall-brand-ip]] · publish full inventory =
//     5-second DevTools self-debunk if drift · drift impossible by design
//
// 不做 anti-pattern:
//   ✕ NO「CLEAR ALL ZONE 27 DATA」 button(brand IP「不會在您 clear 後
//     重新寫入」 · clear is browser-level operation · we don't intervene)
//   ✕ NO「export your data」 CTA(localStorage IS your data · DevTools
//     right-click → copy is the export · 不誇大 GDPR theater)
//   ✕ NO actual value preview(component shows SCHEMA not VALUE · 不藏
//     不假裝 ≠ leak visitor state)
//   ✕ NO localStorage USAGE telemetry(brand IP「0 telemetry」 · we cannot
//     and will not count visitor's localStorage activity)
// ─────────────────────────────────────────────────────

type Props = {
  /** Visual density · "receipt"(compact · /member)or "audit"(full table ·
   *  /audit S06)· same architecture as R73 W-D NoPushManifest + R74 W-A
   *  ReciprocityLedger 2-variant pattern。 */
  variant?: "receipt" | "audit";
};

export default function LocalStorageReceipt({ variant = "receipt" }: Props) {
  if (variant === "audit") {
    // R74 W-G · C3 fix · audit variant rewritten as <table> matching /audit
    // S06 existing DataTable + DataRow visual exactly · zero visual change
    // for visitor scrolling /audit before vs after R74 W-D · preserves
    // /audit S05 PRE-COMMIT visual continuity · single-source from lib
    // closes drift risk · brand-pure refactor per [[zone27-disclosure-
    // philosophy]] axiom · 不假裝 + 不藏 + drift impossible by design。
    return (
      <table
        aria-label={`Local Storage Inventory · ${LOCAL_STORAGE_KEY_COUNT} canonical keys · audit-table variant`}
        className="w-full text-sm font-mono border-collapse my-2"
      >
        <tbody>
          {LOCAL_STORAGE_INVENTORY.map((entry, idx) => (
            <tr key={idx} className="border-b border-line/30">
              <td className="py-3 pr-4 text-mute text-[11px] tracking-[0.15em] w-1/3 align-top">
                {entry.key}
              </td>
              <td className="py-3 pr-4 text-bone tabular align-top">
                {entry.value}
              </td>
              <td className="py-3 text-mute/70 text-[11px] tracking-[0.1em] align-top">
                {entry.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Default · compact receipt variant · /member dashboard top-of-page
  // endowment-via-inventory surface
  return (
    <section
      aria-label={`Local Storage Receipt · your ${LOCAL_STORAGE_KEY_COUNT} device-local data points · Loewenstein/Issacharoff endowment-via-inventory`}
      className="border border-line/60 bg-slate/30 p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em]"
        >
          / YOUR DEVICE · {LOCAL_STORAGE_KEY_COUNT} LOCALSTORAGE KEYS
        </p>
        <p
          lang="en"
          className="font-mono text-mute/60 text-[9px] tracking-[0.3em]"
        >
          0 SERVER · 0 TRACKING · YOUR BROWSER ONLY
        </p>
      </div>

      <p className="text-mute text-sm leading-relaxed mb-4">
        ZONE 27 在您裝置寫了{" "}
        <strong className="text-bone">{LOCAL_STORAGE_KEY_COUNT} 個 localStorage keys</strong>
        {" "}· 0 cookies(auth session 例外明示 in /privacy)· 0 server-side write ·
        0 PII transit。 開 DevTools → Application → Local Storage → zone27-web.vercel.app
        · 您看到的 keys 跟下表一致 · 我們不藏(同 /audit S06 R43 W-B verified)。
      </p>

      <ul className="font-mono text-mute/85 text-[10px] sm:text-[11px] tracking-[0.18em] leading-relaxed space-y-1 tabular">
        {LOCAL_STORAGE_INVENTORY.map((entry, idx) => (
          <li
            key={idx}
            className="flex items-baseline gap-2 sm:gap-3 flex-wrap"
          >
            <span className="text-gold/85" aria-hidden="true">
              ▸
            </span>
            <code className="text-gold/80 text-[10px] sm:text-[11px] flex-shrink-0">
              {entry.key}
            </code>
            <span className="text-mute/70 flex-1 text-[9px] sm:text-[10px] tracking-[0.16em]">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>

      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mt-4 pt-4 border-t border-line/40">
        ⚓ 這份清單是存在你裝置上的資料 · 不是我們伺服器的備份 ·
        資料一直在你自己的瀏覽器裡 · 你隨時可以一鍵清除全部 · 我們不會
        在伺服器留備份 · 不會用追蹤技術還原 · 完整說明在{" "}
        <Link
          href="/audit#section-06"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
        >
          /audit § 06
        </Link>。
      </p>
    </section>
  );
}
