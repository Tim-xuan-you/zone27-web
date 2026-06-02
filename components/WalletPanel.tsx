"use client";

// ── ZONE 27 · 點數錢包面板(/member)· migration 0009 ──────────
// 餘額 + 儲值。 R184 W3(Tim canary「email 去要帳號太慢太蠢」):點金額 →
// 直接秀轉帳帳號 + 複製鈕 + 轉完一鍵通知(不再 email 去「要」帳號)。
//
// 收款帳號走 Vercel 環境變數(NEXT_PUBLIC_BANK_*)· 不寫進公開 GitHub repo
// (per memory/zone27-payment-architecture)。 未設 → graceful「設定中」。
// 點數單向:只能買分析 · 不能提現 · 不能轉人(per zone27-legal-redline)。
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { getWalletBalance } from "@/lib/wallet";

// Tim R187:最低儲值 500 · 最高 30,000 · 中間 preset 我決定
const TOPUP_AMOUNTS = [500, 1000, 3000, 10000, 30000];
const TOPUP_MIN = 500;
const TOPUP_MAX = 30000;

// 收款資料 · Vercel 私密 env(不在 GitHub)· 未設則 fallback
const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME ?? "",
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "",
  holder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? "",
};
const BANK_SET = BANK.account.length > 0;

function notifyHref(amount: number): string {
  const subject = `我已轉帳儲值 NT$ ${amount}`;
  const body = `Tim 好,\n\n我已經轉帳 NT$ ${amount} 到 ZONE 27 儲值。\n轉帳帳號末五碼:______(請填)\n\n請幫我加點。謝謝。`;
  return `mailto:tatayngiti@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

type State = { mounted: false } | { mounted: true; balance: number };

export default function WalletPanel() {
  const [state, setState] = useState<State>({ mounted: false });
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState(0);
  const [copied, setCopied] = useState(false);
  const customOk = custom >= TOPUP_MIN && custom <= TOPUP_MAX;

  useEffect(() => {
    let cancelled = false;
    getWalletBalance().then((b) => {
      if (!cancelled) setState({ mounted: true, balance: b });
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    <section className="mt-6 bg-slate/40 border border-gold/30 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">點數錢包</p>
        <p className="font-mono text-bone text-sm">
          餘額{" "}
          <span className="text-gold text-xl tabular">
            NT$ {state.mounted ? state.balance : "—"}
          </span>
        </p>
      </div>
      <p className="text-mute/85 text-sm leading-relaxed mb-4">
        儲值點數買付費分析。點數只能買分析 ·{" "}
        <span className="text-bone">不能提現、不能轉人</span> · 0 自動扣款(像 Steam 錢包)。
      </p>

      {/* 1 · 選金額 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {TOPUP_AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmount(a)}
            className={`px-4 py-2.5 border font-mono text-xs tracking-[0.2em] tabular transition-colors ${
              amount === a
                ? "border-gold bg-gold/10 text-gold"
                : "border-gold/40 text-gold hover:bg-gold/10 hover:border-gold"
            }`}
          >
            儲 NT$ {a.toLocaleString("en-US")}
          </button>
        ))}
      </div>

      {/* 1b · 自訂金額 · NT$ 500–30,000 */}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em] shrink-0">
          或自訂:
        </span>
        <input
          type="number"
          min={TOPUP_MIN}
          max={TOPUP_MAX}
          step={100}
          value={custom || ""}
          onChange={(e) => setCustom(Number(e.target.value) || 0)}
          placeholder="500 – 30000"
          aria-label="自訂儲值金額 · NT$ 500 到 30000"
          className="w-32 bg-ink/60 border border-line/70 text-bone px-2 py-2 outline-none focus:border-gold/60 placeholder:text-mute/55 font-mono text-sm tabular transition-colors"
        />
        <button
          type="button"
          onClick={() => customOk && setAmount(custom)}
          disabled={!customOk}
          className="px-3 py-2 border border-gold/50 text-gold font-mono text-[11px] tracking-[0.2em] hover:bg-gold/10 hover:border-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          儲值 →
        </button>
      </div>
      <p className="font-mono text-mute/50 text-[9px] tracking-[0.15em] mb-3">
        最低 NT$ 500 · 最高 NT$ 30,000
      </p>

      {/* 2 · 選了金額 → 直接秀轉帳資訊(不用 email 去要)*/}
      {amount !== null && (
        <div className="mt-2 border border-gold/40 bg-gold/5 p-4">
          {BANK_SET ? (
            <>
              <p className="font-mono text-gold/90 text-[10px] tracking-[0.3em] mb-3">
                轉帳 NT$ {amount} 到 ↓
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
                <Row label="金額" value={`NT$ ${amount}`} gold />
              </dl>
              <a
                href={notifyHref(amount)}
                className="inline-block px-4 py-2.5 bg-gold text-navy font-mono text-[11px] tracking-[0.25em] hover:bg-gold-soft transition-colors"
              >
                轉好了 · 通知加點 →
              </a>
              <p className="mt-2 font-mono text-mute/60 text-[9px] tracking-[0.15em] leading-relaxed">
                ▸ 我們確認入帳後幫你加 {amount} 點 · 0 自動扣款 · 點數只能買分析。
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-gold/90 text-[11px] tracking-[0.2em] mb-2">
                收款帳號設定中
              </p>
              <a
                href={notifyHref(amount)}
                className="inline-block px-4 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] hover:bg-gold-soft transition-colors"
              >
                先 email Tim 儲值 NT$ {amount} →
              </a>
            </>
          )}
        </div>
      )}
    </section>
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
