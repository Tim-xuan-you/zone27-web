import Link from "next/link";

// ── ZONE 27 · 拒絕標準(申請前先公開)─────────────────────
// 申請 GOLD 之前 · 先把「我們會拒絕哪 5 種人」攤開講清楚。
// 申請者讀完自己判斷合不合 · 不用浪費你跟 Tim 的審核時間。
// 多數平台先誘你進門再推銷 · ZONE 27 反過來 · 先講拒絕條件。
// ─────────────────────────────────────────────────────

type RefusalRationale = {
  /** 簡短標籤 · 這條拒絕的是哪種申請 */
  pattern: string;
  /** 2-3 句說明 · 為什麼不通過 */
  rationale: string;
  /** 延伸閱讀連結 */
  seeHref: string;
  /** 延伸閱讀標籤 */
  seeLabel: string;
};

const REFUSAL_RATIONALES: ReadonlyArray<RefusalRationale> = [
  {
    pattern: "動機只寫「投資 / 賺錢 / 明牌」",
    rationale:
      "申請動機只有「投資」「賺錢」「報明牌」這類字眼 · 不通過。ZONE 27 不是幫你看明牌的地方 · 我們做的是公開機率與方法 · 你自己看、自己判斷。把我們當「老師報牌」的期待 · 一開始就對不上。",
    seeHref: "/discipline",
    seeLabel: "/discipline · 我們的紀律",
  },
  {
    pattern: "想轉賣收據 / 會員卡 / 身分",
    rationale:
      "明示或暗示要把賽後收據截圖、BLACK 月卡 access、或 GOLD 身分轉賣給收費明牌群組 · 不通過。收據是你個人的信任憑證 · 不是拿來賣的商品 · 我們也不寄生任何下注平台。",
    seeHref: "/audit#section-02",
    seeLabel: "/audit § 02 · 我們永遠不做的事",
  },
  {
    pattern: "要求折扣 / 綁約 / 團購價",
    rationale:
      "要求 NT$ 2,700 打折、跟 BLACK 綁約混價、老客戶特價、或公司團購量大折扣 · 不通過。NT$ 2,700 是固定價 · 對每一位都一樣 · 不開折扣、不混不同會員的價格。",
    seeHref: "/founders",
    seeLabel: "/founders · 定價邏輯",
  },
  {
    pattern: "要求投票權 / 治理權 / DAO",
    rationale:
      "要求加入產品投票、治理權、DAO、或 GOLD 會員的決策投票權 · 不通過。產品方向由 Tim 一個人扛 · GOLD 會員不投票。真正的透明 · 是把開發日誌(/now)跟路線圖(/roadmap)公開給你看 · 不是搞一個投票的形式。",
    seeHref: "/roadmap",
    seeLabel: "/roadmap · 鎖定 / 探索 / 不做的事",
  },
  {
    pattern: "重複灌爆申請",
    rationale:
      "同一個人寄了 4 次以上、換 5 個以上 email、或同一份申請改一改重複送 · 不通過。Tim 親手一封一封看 · 這種洗版式的送件 · 代表把 ZONE 27 當推銷對象 · 而不是真的在問合不合。",
    seeHref: "/privacy",
    seeLabel: "/privacy · 資料保留與防洗版",
  },
];

const PRE_LAUNCH_REFUSAL_COUNT = 0;

export default function RefusalLedgerHint() {
  return (
    <section
      id="refusals"
      aria-label="拒絕標準 · 5 種我們會拒絕的申請 · 先公開"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14 pt-10 border-t border-line/40 scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <span
          lang="en"
          className="font-mono text-loss/85 text-[10px] tracking-[0.4em]"
        >
          / REFUSAL STANDARDS · PUBLISHED UP FRONT
        </span>
        {/* role=status + aria-live for screen reader 動態 count announcement
            when weekly counts start landing post-Founder-#001 onboard。 */}
        <span
          lang="en"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="font-mono text-mute text-[10px] tracking-[0.3em] tabular"
        >
          5 種情況 · 目前已拒絕 {PRE_LAUNCH_REFUSAL_COUNT} 件(上線前)
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-4">
        我們{" "}
        <span className="text-loss/85">會拒絕</span> 你的 5 種情況
      </h2>

      <p className="text-mute leading-relaxed mb-4">
        多數平台先誘你進門 · 再加碼推銷。ZONE 27 反過來:{" "}
        <strong className="text-bone">
          在任何人被拒絕之前 · 先把拒絕的標準公開
        </strong>{" "}
        · 你讀完這 5 條 · 自己判斷合不合 · 不用浪費你跟 Tim 1-3 天的審核時間。
        靠賣明牌的生意結構上做不出這一頁 · 因為他們不拒絕任何人 ·
        來者不拒只想收錢 · 這一頁就是差別。
      </p>
      <p className="text-mute/85 leading-relaxed mb-6">
        上線前狀態 · 這 5 條{" "}
        <strong className="text-bone">已經是綁定的承諾</strong>{" "}
        · 第一筆真實拒絕發生後 · Tim 會親手更新每週件數 + 拒絕原因範例(去個資)·
        要修改任何一條 · 都得 30 天前先在 /changelog 公告 · 只增不刪。
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
                title="上線前狀態 · 第一筆真實拒絕發生後 Tim 親手更新"
              >
                件數 · {PRE_LAUNCH_REFUSAL_COUNT}
              </span>
            </div>
            <p className="text-mute text-[12px] sm:text-sm leading-relaxed mb-1.5">
              {item.rationale}
            </p>
            <p className="font-mono text-mute/60 text-[9px] tracking-[0.22em] flex items-baseline gap-2 flex-wrap">
              <span aria-hidden="true">→</span>
              <Link
                href={item.seeHref}
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline"
              >
                {item.seeLabel}
              </Link>
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-8 pt-6 border-t border-line/40">
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mb-3">
          ⚓ 這 5 條拒絕標準搭配{" "}
          <Link
            href="/founders/apply"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
          >
            /founders/apply
          </Link>{" "}
          一起看 · 你在送出申請表之前就能先看清楚 ·{" "}
          <strong className="text-bone">我們不藏拒絕的理由</strong> · Tim 會親手回
          「未通過 · 因為哪一條」+ 完整理由 · 不是罐頭式的「您此次未通過」。
        </p>
        <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em] leading-relaxed">
          ⚓ 先把拒絕標準攤開 · 是一種善意 · 你讀完{" "}
          {REFUSAL_RATIONALES.length} 條 · 自己判斷合不合 · ZONE 27 不推銷 ·
          你自己選。
        </p>
      </div>
    </section>
  );
}
