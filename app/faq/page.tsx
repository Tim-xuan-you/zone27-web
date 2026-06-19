import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";

export const metadata: Metadata = {
  title: "FAQ — 預先掃雷的 15 個問題",
  description:
    "ZONE 27 是什麼?是博彩嗎?是傳銷嗎?BLACK 會員是什麼?付款什麼時候開放?誠實到不能再誠實的回答 — 包括「你們會追蹤我嗎?」(不會)+「跟 MLM 有什麼不同?」(全方位不同)。",
};

type QA = {
  q: string;
  a: React.ReactNode;
  /** Optional anchor id · enables /faq#mlm style deep links */
  id?: string;
};

type Category = {
  key: string;
  label: string;
  zh: string;
  qas: QA[];
};

const CATEGORIES: Category[] = [
  {
    key: "about",
    label: "ABOUT ZONE 27",
    zh: "關於 ZONE 27",
    qas: [
      {
        q: "什麼是 ZONE 27?",
        a: (
          <>
            <strong className="text-bone">ZONE 27 = 賭徒的彭博終端機(專業金融資訊台)。</strong> 我們的對象是會下注的運動迷 · 對手是那些靠賣明牌賺錢的人。 不同的是:引擎永遠免費 · 不賣明牌 · PROVED + DIVERGED 等大公開 · 方法完整公開(見 /methodology + /audit)。 你拿我們的資料自己決定 · ZONE 27 不接受下注(我們不是賭場)。 怎麼靠這活下來?見下面「怎麼賺錢」。 Phase 1 CPBL · Phase 2 NBA · Tim 親手 curate。 完整方法論見{" "}
            <Link href="/about" className="text-gold underline-offset-4 hover:underline">
              /about
            </Link>
            。
          </>
        ),
      },
      {
        q: "為什麼是「27」這個數字?",
        a: (
          <>
            棒球場上的最後一個 OUT — 9 局 × 3 個出局數 = 27,也是完美比賽的數字
            (27 上 27 下)。我們相信 BLACK 會員能用同樣的精準定義這個品牌。
            詳見{" "}
            <Link href="/about" className="text-gold underline-offset-4 hover:underline">
              /about 第 6 章 Why 27
            </Link>
            。
          </>
        ),
      },
      {
        q: "ZONE 27 是博彩平台嗎?",
        a: (
          <>
            不是。我們不接受下注、不出彩金、不撮合對賭。
            ZONE 27 是「資訊與社群平台」 —— 引擎與分析都免費,賣的是<strong className="text-bone">會員身分</strong>
            (出錢養著免費引擎),模式類似專業財經與運動數據資訊台,而不是運彩公司。
            我們嚴格遵守台灣法規邊界,所有經濟系統皆為單向(虛擬點數無法兌回新台幣)。
          </>
        ),
      },
      {
        q: "有 賽事討論室嗎?",
        id: "no-community",
        a: (
          <>
            有 · 每場{" "}
            <Link href="/matches" className="text-gold underline-offset-4 hover:underline">
              賽事頁
            </Link>
            {" "}的「看法 · 分析」· <strong className="text-bone">免費看 · 登入發言</strong>(不必付費)·
            一場一篇 · 押一邊賽後自動掛準/不準(刪不掉)。 高手的分析免費公開發 · 賺的是地位(賽後自動對帳、爬天梯、被追蹤)· 不藏在付費牆後。
          </>
        ),
      },
      {
        q: "為何 visitor 不能 推薦賽事?",
        id: "no-user-recommendations",
        a: (
          <>
            Tim 是唯一挑選內容的人 · 目前先做 CPBL · 所有內容由 Tim 一個人親手挑選。
            靠賣明牌抽傭的生意需要使用者互相推薦 · ZONE 27 的結構正好相反 · 不接受外部投稿直接上架。
            您可以到{" "}
            <Link href="/member/submit" className="text-gold underline-offset-4 hover:underline">
              /member/submit
            </Link>
            {" "}投稿給 Tim。
          </>
        ),
      },
      {
        q: "不抽下注佣金 · 那怎麼賺錢?",
        id: "no-commission",
        a: (
          <>
            <strong className="text-bone">BLACK</strong> NT$ 500/31 天 × N 訂戶
            · 會員不限量(不自動續扣 · 每 31 天主動轉帳一次)。
            付費的唯一理由是身分:出錢養著免費引擎 · 戴上一圈支持者金環,還能寫信給 Tim 本人親手回。 準是免費的 —— 含輸命中率、校準、驗證準度標章全靠公開戰績賺,不靠付費解鎖。 創作者只免費公開發 · 平台 0 抽創作者傭。
            不抽真錢下注的傭 · 不接廣告 / 業配 / 導購分潤。
          </>
        ),
      },
    ],
  },
  {
    key: "pricing",
    label: "BLACK & PRICING",
    zh: "BLACK 會員 / 定價",
    qas: [
      {
        q: "付款系統現況?",
        a: (
          <>
            <span className="font-mono text-gold">BLACK CPBL 季票 · 手動銀行轉帳</span>
            (NT$ 500/31 天 · 每 31 天你主動轉帳一次 · 不自動續扣)。
            <span className="font-mono text-gold mx-1">付款系統準備好後就開放</span>
            (看進度,不綁定日期)。 在此之前,加入等候名單 =
            排隊優先權,<strong className="text-bone">完全免費</strong>,
            不收任何資料以外的東西。下方按鈕直接加入:
            <br />
            <Link
              href="/membership"
              className="inline-block mt-3 font-mono text-gold text-[10px] tracking-[0.3em] underline underline-offset-4"
            >
              加入等候名單 →
            </Link>
          </>
        ),
      },
      {
        q: "14 天退款怎麼運作?",
        id: "refund",
        a: (
          <>
            <strong className="text-bone">14 天無條件退款。</strong>{" "}
            寄信 tatayngiti@gmail.com · 主旨「REFUND · ZONE 27 BLACK」 · Tim 48h 回覆
            確認 · 原戶頭退全額。 不問原因 · 不挽留 · 不發問卷 · 不寄催你回來的信。
            比消保法 § 19 規定的 7 天最低標準多一倍。 完整條款{" "}
            <Link href="/terms" className="text-gold underline-offset-4 hover:underline">
              /terms §4B
            </Link>
            。
          </>
        ),
      },
      {
        q: "ZONE 27 接 corporate / 企業客戶?",
        id: "corporate",
        a: (
          <>
            <strong className="text-gold">不接。</strong> 沒有企業方案
            · 沒有「聯絡業務團隊」表單 · ZONE 27 就是做給個人球迷的
            · 不接企業客戶。
            <br />
            <br />
            如果您是企業想用 ZONE 27 · 價格和權限都一樣:
            自己加入 BLACK NT$ 500/31 天 · 自助辦理。
            <br />
            <br />
            完整的定價理由見{" "}
            <Link href="/membership" className="text-gold underline-offset-4 hover:underline">
              /membership
            </Link>
            {" "}的定價推導。
          </>
        ),
      },
      {
        q: "跟傳銷(MLM)有什麼不同?",
        id: "mlm",
        a: (
          <>
            <strong className="text-bone">沒有下線結構。</strong>{" "}
            沒有推薦獎金 · 沒有多層抽佣 · 沒有業績目標 · 沒有招募下線 · 會員不限量,但完全沒有金字塔式抽佣。
            我們的收入只有一條腿:會員自己出錢的身分訂閱(BLACK NT$ 500/31 天)·
            出錢養著免費引擎 · 沒有下線、沒有層層分潤。
          </>
        ),
      },
    ],
  },
  {
    key: "ai",
    label: "AI MODEL",
    zh: "AI 模型",
    qas: [
      {
        q: "你們的 AI 預測準確率多高?",
        a: (
          <>
            目前實驗室 v0.2 用的是逐打席對決模型,
            跑 10,000 次模擬的收斂結果,通常和先前鎖定的 AI 預測落在
            <span className="font-mono text-gold mx-1">±2%</span>
            內。我們不宣稱「鐵口直斷」 — AI 給的是機率分布,不是必勝牌。
            背後的數學基礎請見{" "}
            <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">
              /methodology
            </Link>
            。
          </>
        ),
      },
      {
        q: "預測不準的時候會怎樣?",
        a: (
          <>
            賽後我們會自動生成「AI 偏差值報告」,公開告訴會員模型在哪個變數失算
            (例如:「先發投手第 3 局變化球轉速高於賽季平均 15%」),
            並把這個變數寫進下一次模型迭代。模型升級紀錄持續公開在{" "}
            <Link href="/methodology/diff" className="text-gold underline-offset-4 hover:underline">
              /methodology/diff
            </Link>
            。
          </>
        ),
      },
      {
        q: "我可以信任這些數字嗎?",
        a: (
          <>
            我們建議您不要「相信」我們 — 而是親自驗證。打開{" "}
            <Link href="/lab" className="text-gold underline-offset-4 hover:underline">
              /lab
            </Link>
            ,選一場比賽,按下「跑 10,000 次模擬」,看真實的
            隨機抽樣在你的瀏覽器裡跑出收斂結果,然後按「重播模式」
            看一場 9 局逐打席的文字直播。<strong className="text-bone">眼見為憑。</strong>
          </>
        ),
      },
    ],
  },
  {
    key: "privacy",
    label: "PRIVACY & ECOSYSTEM",
    zh: "隱私與生態系",
    qas: [
      {
        q: "我的 email 會怎麼處理?",
        a: (
          <>
            存{" "}
            <span className="font-mono text-gold/90">Supabase Tokyo</span> 加密 PostgreSQL ·
            資料庫上鎖 · 連我們公開的金鑰都讀不到整張表 · 只能透過受控函式回傳「總人數」。
            不分享 · 不販售 · 不轉手。 完整儲存方式見{" "}
            <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
              /privacy §04
            </Link>
            。
          </>
        ),
      },
      {
        q: "你們會追蹤我嗎?",
        a: (
          <>
            <strong className="text-bone">不會。</strong>{" "}
            沒有 Google Analytics · 沒有 Facebook Pixel · 沒有 Hotjar · 沒有第三方追蹤 cookie。
            你的瀏覽紀錄只存在你自己的瀏覽器裡 · 我們的伺服器沒有副本。 完整清單{" "}
            <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
              /privacy
            </Link>
            。
          </>
        ),
      },
      {
        q: "怎麼取消等候名單?",
        a: (
          <>
            隨時 · 寄信到{" "}
            <a
              href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20UNSUBSCRIBE"
              className="text-gold underline-offset-4 hover:underline"
            >
              tatayngiti@gmail.com
            </a>
            {" "}· Tim 24 小時內從資料庫永久刪除 · 不留備份。
            等候名單不收費 · 不簽約 · 不綁定。
          </>
        ),
      },
      {
        q: "BOTTOM 27 是什麼?",
        a: (
          <>
            Tim 同步開發的棒球經營手遊 · 雙生品牌 · 共用「27」概念與深藏青 × 冷金視覺。
            BLACK 會員未來自動獲得 BOTTOM 27 獨家虛擬資產。
          </>
        ),
      },
    ],
  },
];

const TOTAL_QAS = CATEGORIES.reduce((sum, c) => sum + c.qas.length, 0);

export default function FaqPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          FAQ · {TOTAL_QAS} HONEST ANSWERS
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          預先掃雷的
          <br />
          <span className="text-gold tabular">{TOTAL_QAS}</span>{" "}
          個問題
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          您在 30 秒內可能會猶豫的所有問題,我們在這裡先回答完。
          沒有公關語言,沒有迴避。
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-16" />

      {/* ── TABLE OF CONTENTS ────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <a
              key={c.key}
              href={`#${c.key}`}
              className="block p-5 border border-line/70 hover:border-gold/60 transition-colors group"
            >
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2 group-hover:text-gold transition-colors">
                {c.label}
              </p>
              <p className="text-bone text-base font-light tracking-tight">
                {c.zh}
              </p>
              <p className="font-mono text-mute text-xs tabular mt-2">
                {c.qas.length} 個問題 →
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────── */}
      {CATEGORIES.map((c, ci) => (
        <section
          key={c.key}
          id={c.key}
          className={`mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 scroll-mt-20 ${
            ci > 0 ? "border-t border-line/40" : ""
          }`}
        >
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
              / {String(ci + 1).padStart(2, "0")}
            </span>
            <span
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.35em]"
            >
              {c.label}
            </span>
          </div>
          <h2 className="text-3xl text-bone font-light tracking-tight mb-10">
            {c.zh}
          </h2>

          <div className="space-y-10">
            {c.qas.map((qa, qi) => (
              <QAEntry
                key={qi}
                num={qi + 1}
                q={qa.q}
                a={qa.a}
                anchorId={qa.id}
              />
            ))}
          </div>
        </section>
      ))}

      <RelatedReading currentPath="/faq" />

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          STILL NOT SURE?
        </p>
        <h3 className="text-3xl text-bone font-light tracking-tight">
          打開 Lab,親手跑一場。
        </h3>
        <p className="mt-6 text-mute text-sm max-w-md mx-auto">
          任何解釋都不如自己看見演算法收斂的那一刻。
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/lab"
            className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            進入實驗室 →
          </Link>
          <Link
            href="/membership"
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            加入等候名單 →
          </Link>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── Sub-component ──────────────────────────────────────
function QAEntry({
  num,
  q,
  a,
  anchorId,
}: {
  num: number;
  q: string;
  a: React.ReactNode;
  anchorId?: string;
}) {
  return (
    <article
      id={anchorId}
      className={`border-l-2 border-gold/30 pl-5 sm:pl-6 ${
        anchorId ? "scroll-mt-24" : ""
      }`}
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.3em] tabular">
          Q · {String(num).padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-xl text-bone font-light tracking-tight mb-4 leading-snug">
        {q}
      </h3>
      <div className="text-mute text-base leading-relaxed">{a}</div>
    </article>
  );
}
