"use client";

// ── ZONE 27 · 升級卡(直接轉帳 · 不用 email 去要帳號)──────────
// Tim canary(R187):點「立即升級」開的是 mailto 去「要」帳號 = 跟 R184 砍掉的
// 慢流程一樣蠢。 改成 = 點一下「立即升級」→ 直接秀收款帳號 + 複製 + 轉完一鍵
// 通知開通(完全同 WalletPanel 儲值的 UX)。 收款資料走 Vercel 私密 env
// (NEXT_PUBLIC_BANK_*)· 未設 → graceful「設定中」。 0 自動續扣(per /integrity #13)。
// ─────────────────────────────────────────────────────

import { useState } from "react";

const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME ?? "",
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "",
  holder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? "",
};
const BANK_SET = BANK.account.length > 0;

function notifyHref(name: string, priceLabel: string, period: string): string {
  const subject = `我已轉帳升級 ${name} · NT$ ${priceLabel}`;
  const body = `Tim 好,\n\n我已經轉帳 NT$ ${priceLabel}(${name} · ${period})。\n轉帳帳號末五碼:______(請填)\n\n請幫我開通。謝謝。`;
  return `mailto:tatayngiti@gmail.com?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

type Props = {
  name: string;
  kicker: string;
  priceLabel: string; // 預先格式化 · 避免 locale/hydration 問題("500" / "2,700")
  period: string; // "31 天" / "365 天"
  perks: { text: string; strong?: string }[];
  highlight?: boolean;
};

export default function MembershipUpgrade({
  name,
  kicker,
  priceLabel,
  period,
  perks,
  highlight = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard 不可用 · 帳號已可見 · 手動複製 */
    }
  };

  return (
    <article
      className={`flex flex-col border p-6 ${
        highlight
          ? "border-gold/60 bg-gold/5 glow-soft"
          : "border-line/60 bg-slate/30"
      }`}
    >
      <p
        className={`font-mono text-[10px] tracking-[0.3em] mb-1 ${
          highlight ? "text-gold/80" : "text-mute"
        }`}
      >
        {kicker}
      </p>
      <h2
        className={`text-xl font-light tracking-tight mb-3 ${
          highlight ? "text-gold" : "text-bone"
        }`}
      >
        {name}
      </h2>
      <p
        className={`font-mono tabular text-3xl font-light leading-none mb-1 ${
          highlight ? "text-gold" : "text-bone"
        }`}
      >
        NT$ {priceLabel}
      </p>
      <p className="font-mono text-mute text-[11px] tracking-[0.18em] mb-5">
        每 {period} · 手動轉帳 · 0 自動續扣
      </p>

      <ul className="space-y-2 mb-6 text-sm leading-relaxed flex-grow list-none pl-0">
        {perks.map((p, i) => (
          <li key={i} className="flex items-baseline gap-2">
            <span
              aria-hidden="true"
              className={`text-[11px] shrink-0 ${highlight ? "text-gold" : "text-gold/70"}`}
            >
              ✓
            </span>
            <span className="flex-1 text-bone/90">
              {p.text}
              {p.strong && <span className="text-gold"> {p.strong}</span>}
            </span>
          </li>
        ))}
      </ul>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`mt-auto block w-full text-center px-4 py-3.5 font-mono text-sm tracking-[0.3em] transition-colors ${
            highlight
              ? "bg-gold text-navy hover:bg-gold-soft"
              : "border border-gold/60 text-gold hover:bg-gold/10 hover:border-gold"
          }`}
        >
          立即升級 →
        </button>
      ) : (
        <div className="mt-auto border border-gold/40 bg-gold/5 p-4">
          {BANK_SET ? (
            <>
              <p className="font-mono text-gold/90 text-[10px] tracking-[0.3em] mb-3">
                轉帳 NT$ {priceLabel} 到 ↓
              </p>
              <dl className="space-y-1.5 font-mono text-sm mb-3">
                <Row label="銀行" value={BANK.name} />
                <Row
                  label="帳號"
                  value={BANK.account}
                  action={
                    <button
                      type="button"
                      onClick={copyAccount}
                      className="ml-2 px-2 py-0.5 border border-gold/50 text-gold text-[10px] tracking-[0.2em] hover:bg-gold/10 transition-colors"
                    >
                      {copied ? "已複製 ✓" : "複製"}
                    </button>
                  }
                />
                <Row label="戶名" value={BANK.holder} />
                <Row label="金額" value={`NT$ ${priceLabel}`} gold />
              </dl>
              <a
                href={notifyHref(name, priceLabel, period)}
                className="inline-block px-4 py-2.5 bg-gold text-navy font-mono text-[11px] tracking-[0.25em] hover:bg-gold-soft transition-colors"
              >
                我轉好了 · 通知開通 →
              </a>
              <p className="mt-2 font-mono text-mute/60 text-[9px] tracking-[0.15em] leading-relaxed">
                ▸ 我們確認入帳後幫你開通 {name} · 0 自動續扣 · 14 天無條件退款。
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-gold/90 text-[11px] tracking-[0.2em] mb-2">
                收款帳號設定中 · 先寄信給 Tim 開通
              </p>
              <a
                href={notifyHref(name, priceLabel, period)}
                className="inline-block px-4 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] hover:bg-gold-soft transition-colors"
              >
                寄信開通 {name} →
              </a>
            </>
          )}
        </div>
      )}
    </article>
  );
}

function Row({
  label,
  value,
  action,
  gold = false,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <dt className="text-mute/70 text-[11px] tracking-[0.2em] w-10 shrink-0">
        {label}
      </dt>
      <dd
        className={`flex-1 tabular tracking-wide break-all ${gold ? "text-gold" : "text-bone"}`}
      >
        {value}
        {action}
      </dd>
    </div>
  );
}
