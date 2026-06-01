"use client";

// ── ZONE 27 · 點數錢包面板(/member)· migration 0009 ──────────
// 顯示餘額 + 儲值入口。 儲值 v1 = 手動轉帳(點金額 → email Tim → 他給帳號 →
// 轉帳後幫你加點)。 點數單向:只能買分析 · 不能提現 · 不能轉人(per
// zone27-legal-redline · Steam 錢包模式,不是賭場籌碼)。 0009 未套 → 餘額 0。
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { getWalletBalance } from "@/lib/wallet";

const TOPUP_AMOUNTS = [100, 300, 500, 1000];

function topupHref(amount: number): string {
  const subject = `我要儲值 NT$ ${amount}`;
  const body = `Tim 好,\n\n我要儲值 NT$ ${amount} 到我的 ZONE 27 點數錢包。\n請給我銀行轉帳帳號,轉帳後幫我加點。\n(已知:點數只能買分析、不能提現、不能轉人 · 0 自動扣款。)\n\n謝謝。`;
  return `mailto:tatayngiti@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

type State = { mounted: false } | { mounted: true; balance: number };

export default function WalletPanel() {
  const [state, setState] = useState<State>({ mounted: false });

  useEffect(() => {
    let cancelled = false;
    getWalletBalance().then((b) => {
      if (!cancelled) setState({ mounted: true, balance: b });
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
      <div className="flex flex-wrap gap-2 mb-3">
        {TOPUP_AMOUNTS.map((a) => (
          <a
            key={a}
            href={topupHref(a)}
            className="px-4 py-2.5 border border-gold/40 text-gold font-mono text-xs tracking-[0.2em] tabular hover:bg-gold/10 hover:border-gold transition-colors"
          >
            儲 NT$ {a}
          </a>
        ))}
      </div>
      <p className="font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed">
        ▸ 點任一個 = 寄信給 Tim → 他給你轉帳帳號 → 轉帳後幫你加點(手動 · v1)。
      </p>
    </section>
  );
}
