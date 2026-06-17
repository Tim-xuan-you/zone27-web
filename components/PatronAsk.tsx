import Link from "next/link";

// ── ZONE 27 · 贊助之請(PatronAsk · R248③ · membership-appeal research 5 路一致結論)──
// 免費東西的會員「不是賣 perk」—— Wikipedia 給 0 功能照樣募到上億。 研究鐵律:在「感受到價值的
// 當下」誠實地請對方撐著它(Guardian「Epic」式 contextual ask · NPR member drive)= 全套裡最高
// 槓桿、又零踩紅線的一招。 放峰值價值時刻(這份公開含輸帳本本身)· 對所有人顯示(會員讀成「就是
// 我」的驕傲 · 非會員讀成邀請)。 🔴 賣的是「讓它一直免費」不是 access · 非 FOMO · 0 假稀缺 · 不指名。
export default function PatronAsk({
  line,
  cta = "成為其中一個",
  className = "",
}: {
  line?: React.ReactNode;
  cta?: string;
  className?: string;
}) {
  return (
    <aside className={`border-l-2 border-gold/40 pl-5 py-1 ${className}`}>
      <p className="text-mute text-sm sm:text-base leading-relaxed max-w-xl">
        {line ?? (
          <>
            你正在看的這份帳本 —— <span className="text-bone">免費、連輸都留著、沒有廣告</span> ——
            是<span className="text-gold">會員</span>撐著的。 引擎永遠免費,得有人付錢養它。
          </>
        )}
      </p>
      <Link
        href="/membership"
        className="inline-block mt-2 font-mono text-gold/75 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
      >
        {cta} →
      </Link>
    </aside>
  );
}
