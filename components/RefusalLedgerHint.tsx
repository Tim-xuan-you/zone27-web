import Link from "next/link";

// ── ZONE 27 · Refusal Ledger Hint ───────────────────────
// R74 W-B · Agent A R73 SHIP 5 · Cialdini Reject-then-Retreat(1975)·
// refusal-as-reciprocity scaffold · publish the rejection grammar BEFORE
// any rejection lands · same Costly Signaling 100× pattern as /audit
// S05 PRE-COMMIT clause · 「we PUBLISH what gets rejected」 is a
// non-fakeable trust signal that LINE 老師 / 報馬仔 structurally cannot
// replicate(they don't reject anyone · they take all money)。
//
// Inversion mechanic:
//   - Cialdini classic: ask big → reject → ask small → higher acceptance
//   - ZONE 27 inversion: PUBLISH「we will reject these 5 types」 → applicant
//     sees self-selection grammar BEFORE applying → reciprocity-via-
//     transparent-gatekeeping · same axis as Patek dealer's quiet 「we
//     won't sell this Patek to a scalper」 implicit promise · ZONE 27
//     makes it EXPLICIT in 5 rules
//
// Placement(per Agent A R73 SHIP 5 spec):
//   - /founders/ledger NEW #refusals section · below FoundingMemberLedger
//   - TimResponseSLA chip footer already cross-links here(R72 W-B)
//   - Pre-launch: all 5 rationale-types have count 0 · 「pending first real
//     refusal post-Founder-#001 onboard window」
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · publish rejection grammar = 同
//     publish methodology + ENGINE_DIFF_BEACONS pattern · disclosure axis
//     extends to gatekeeping process
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「we will reject you」 是
//     publish-weakness Costly Signaling · CPBL fan audience pattern-match
//     「Tim 不 sell everyone」 as honest filter
//   - per /audit S05 PRE-COMMIT · 修改任一 rationale-type 需 30 天 /changelog
//     公告 · same append-only discipline
//   - per [[zone27-payment-architecture]] · Tim manual review IS the spam
//     filter · this component IS the operational scaffold of the filter
//
// 不做 anti-pattern:
//   ✕ NO「we approve 99% of applicants」 vanity stat(would imply scarcity
//     theater · violates Costly Signaling axiom)
//   ✕ NO「premium tier auto-approved」 implicit bias(brand IP 「Tim 一手
//     review」 · no tier privilege at application gate)
//   ✕ NO「if you have credentials X · you skip review」 (per CPBL fan
//     audience-not-engineers axiom · credentials don't fast-track)
//   ✕ NO「rejection appeal process」 lawyer-style escalation(brand IP
//     「Tim final call · transparent rationale」 · 不開 appeals court)
// ─────────────────────────────────────────────────────

type RefusalRationale = {
  /** Short label · what this rationale type covers · max ~30 chars zh */
  pattern: string;
  /** 2-3 sentence rationale + brand-IP axiom anchor */
  rationale: string;
  /** Brand IP axiom citation for skeptic to verify · cross-link target */
  axiomLink: string;
  /** Display label for axiom cite */
  axiomLabel: string;
};

const REFUSAL_RATIONALES: ReadonlyArray<RefusalRationale> = [
  {
    pattern: "「投資 / 賺錢」 動機 framing",
    rationale:
      "申請動機僅含「投資」 / 「賺錢」 / 「明牌」 字眼 · 未通過。 ZONE 27 brand IP「不靠賠率」 + epistemic discipline 7-tier badge · per /audit S05 PRE-COMMIT · 申請 grammar 必須 align「probability + craft + 不靠運氣 framing」 · 不是「我幫您看明牌」 customer expectation。",
    axiomLink: "/discipline",
    axiomLabel: "/discipline · epistemic discipline rules",
  },
  {
    pattern: "Commercial intent · 賣 ZONE 27 receipt / Member ID",
    rationale:
      "申請者 commercial intent — 明示 / 暗示要 resell ZONE 27 receipt screenshots / 賣 BLACK CARD 月卡 access / 賣 #NNN Member ID 給 LINE 老師 community · 未通過。 brand IP「不寄生 gambling 平台」 + receipt 是 personal trust artifact · 不是 商品。",
    axiomLink: "/audit#section-02",
    axiomLabel: "/audit § 02 · 11-item NEVER list",
  },
  {
    pattern: "Discount / Bundling 要求",
    rationale:
      "申請者要求 NT$ 2,700 折扣 / BLACK CARD subscription bundling / grandfather 既有客戶 / corporate volume discount · 未通過。 brand IP SHADOWLESS RUN axiom · 同 Pokemon 1st Edition 1999 Base Set · NT$ 2,700 是 closed-state price · 不開折扣 · 不混合 tier 經濟學 · per /founders/ledger#shadowless-run。",
    axiomLink: "/founders/ledger#shadowless-run",
    axiomLabel: "/founders/ledger#shadowless-run",
  },
  {
    pattern: "Governance / Voting / DAO 要求",
    rationale:
      "申請者要求加入 product voting / governance / DAO / Founders 27 holders 投票權 · 未通過。 brand IP「Tim 一手 product direction」 + 270 holders 不 vote · 不裝 community 民主 · /now journal 公開 + /roadmap LOCKED/EXPLORING 兩段透明 = the actual transparency · 不是 voting theater · per /founders 「Founders 27 投票權」 NOT-DO list。",
    axiomLink: "/roadmap",
    axiomLabel: "/roadmap · LOCKED + EXPLORING + BRAND BOUNDARIES",
  },
  {
    pattern: "Spam-style cadence · 重複申請",
    rationale:
      "已寄出申請 4+ 次 · 5+ 不同 email · 或同申請 modified 後重複送(per /privacy retention policy)· 未通過。 brand IP「Tim manual review = spam filter」 + brand IP「客戶 ≠ 朋友 · 不 push」 inverse · 申請者 cadence pattern 顯示 ZONE 27 是 sales target 不是 epistemic fit。",
    axiomLink: "/privacy",
    axiomLabel: "/privacy · retention + anti-spam policy",
  },
];

const PRE_LAUNCH_REFUSAL_COUNT = 0;

export default function RefusalLedgerHint() {
  return (
    <section
      id="refusals"
      aria-label="Refusal Ledger · 5 published refusal rationales · 先公開拒絕標準"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14 pt-10 border-t border-line/40 scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <span
          lang="en"
          className="font-mono text-loss/85 text-[10px] tracking-[0.4em]"
        >
          / REFUSAL LEDGER · PRE-COMMITTED RATIONALES
        </span>
        {/* R74 W-G · M2 fix · role=status + aria-live for screen reader
            dynamic count announcement when weekly counts start landing
            post-Founder-#001 onboard · same WCAG 2.1 SC 4.1.3 Status
            Messages pattern as R56 W-A WaitlistForm + R67 W-A LensFocusVote
            VOTED state + R68 W-D LensFocusVote a11y。 */}
        <span
          lang="en"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="font-mono text-mute text-[10px] tracking-[0.3em] tabular"
        >
          5 RATIONALES · {PRE_LAUNCH_REFUSAL_COUNT} REFUSALS COUNT(pre-launch)
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-4">
        我們{" "}
        <span className="text-loss/85">永遠會 reject</span> 您的 5 種情況
      </h2>

      <p className="text-mute leading-relaxed mb-4">
        多數平台先誘你進門再加碼推銷。 ZONE 27 反過來:{" "}
        <strong className="text-bone">
          publish refusal grammar BEFORE 任何 refusal land
        </strong>{" "}
        · 申請者 read 完 5 條 self-select 自己 fit · 不浪費您 + Tim 1-3 days
        review window。 LINE 老師 / 報馬仔 結構性無法 ship 此 page · 它們
        不 reject 任何人 · 它們 take all money · 此 page = the differential。
      </p>
      <p className="text-mute/85 leading-relaxed mb-6">
        Pre-launch state · 5 rationale-types{" "}
        <strong className="text-bone">已 binding pre-commit</strong>{" "}
        · 第一筆真實 refusal land 後 · Tim 親手 update weekly count + sample
        rationale(去 PII)· 修改任一 rationale-type 需 30 天前 /changelog
        事前公告 · 同站上其他 append-only 公開帳本一樣的紀律 · 只增不刪。
      </p>

      <ol className="space-y-3 mt-6">
        {REFUSAL_RATIONALES.map((item, idx) => (
          <li
            key={idx}
            className="border-l-2 border-loss/40 pl-4 py-2 bg-slate/20"
          >
            <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
              <span
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] tabular"
              >
                ✕ {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                <strong>{item.pattern}</strong>
              </p>
              <span
                lang="en"
                className="font-mono text-mute/70 text-[9px] tracking-[0.25em] tabular"
                title="Pre-launch state · 第一筆真實 refusal land 後 Tim 親手 update"
              >
                COUNT · {PRE_LAUNCH_REFUSAL_COUNT}
              </span>
            </div>
            <p className="text-mute text-[12px] sm:text-sm leading-relaxed mb-1.5">
              {item.rationale}
            </p>
            <p className="font-mono text-mute/60 text-[9px] tracking-[0.22em] flex items-baseline gap-2 flex-wrap">
              <span aria-hidden="true">→</span>
              <Link
                href={item.axiomLink}
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                {item.axiomLabel}
              </Link>
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-8 pt-6 border-t border-line/40">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mb-3">
          ⚓ 此 5-rationale ledger pairs with{" "}
          <Link
            href="/founders/apply"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
          >
            /founders/apply
          </Link>{" "}
          TimResponseSLA chip(R72 W-B)· 申請 form 提交前已可 audit·{" "}
          <strong className="text-bone">不藏 rejection rationale</strong> · 同
          /audit S05 disclosure parity。 Tim 親手 reply 「未通過 · per § 0X」 +
          完整 rationale paragraph · 不是 boilerplate「您此次未通過」。
        </p>
        <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] leading-relaxed">
          ⚓ 此 page 是{" "}
          <strong className="text-bone">先公開拒絕標準</strong> 的善意 ·
          您 read 完{" "}
          {REFUSAL_RATIONALES.length} 條 rationale · 您自己判斷是否 fit · ZONE
          27 不 sell · 您 self-select。
        </p>
      </div>
    </section>
  );
}
