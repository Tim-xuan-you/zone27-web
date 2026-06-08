// ── ZONE 27 · 足球 PENDING 尊嚴框 ──────────────────────────────────
// 足球現在 11 鎖、0 結算(結果要等世界盃 6/11 開踢才有)。 不寫「還沒有結果」(讀成空洞)·
// 改成前瞻、已設計的狀態框:把「0 結算」翻成全頁最強的誠實示範 —— 你在結果還不存在時
// 就當眾鎖死了預測。 只在 decided===0 時 render(第一場結算後自動消失,讓位給真實校準)。
// dark-navy + 冷金 · 無 emoji · 無紅綠 · plain 中文。
// ─────────────────────────────────────────────────────

export default function SoccerPendingFrame({ locked }: { locked: number }) {
  return (
    <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-3">
      <div className="bg-slate/40 border border-gold/30 p-5 sm:p-7">
        <span className="inline-block font-mono text-gold/80 text-[9px] tracking-[0.3em] px-2 py-1 border border-gold/40 mb-4">
          賽後對帳即將開始 · 世界盃 6/11
        </span>
        <h2 className="text-bone text-2xl sm:text-3xl font-light tracking-tight">
          第一個足球預測 · 已經鎖死了
        </h2>
        <p className="mt-4 text-mute/90 text-sm leading-relaxed max-w-2xl">
          <span className="font-mono text-gold tabular">{locked}</span> 場世界盃預測,
          在開賽前就公開鎖死、改不了。 結果從 6/11 第一顆球開賽起算 —— 每一場都會當眾對帳,
          贏或輸照掛。 我們把預測押在結果還不存在的時候 ——
          <span className="text-bone"> 這正是 ZONE 27 賣的東西。</span>
        </p>
      </div>
    </section>
  );
}
