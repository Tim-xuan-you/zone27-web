import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";

export const metadata: Metadata = {
  title: "FAQ — 預先掃雷的 15 個問題",
  description:
    "ZONE 27 是什麼?是博彩嗎?是傳銷嗎?GOLD 跟 BLACK 差別?付款什麼時候開放?15 個誠實到不能再誠實的回答 — 包括「你們會追蹤我嗎?」(不會)+「跟 MLM 有什麼不同?」(全方位不同)。",
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
            <strong className="text-bone">ZONE 27 = 賭徒的 Bloomberg Terminal。</strong> 客群 = 會下注的 sports 迷(包括賭徒)· 對標靠賣明牌賺錢的對手 · 提供更好的資訊層。 不同他們的是:引擎永遠免費 · 不賣明牌 · PROVED + DIVERGED 等大公開 · 方法完整公開(見 /methodology + /audit)。 您拿我們的資料自己決定下哪個 platform · ZONE 27 自己不接受下注(我們不是賭場)。 老實認:訂閱者寫文章賣 · ZONE 27 抽 5–10% commission(BLACK 10% · GOLD 5% · 業界最低 · Substack 10% / OnlyFans 20% / YouTube 45%)· 不假裝「我們不抽傭」。 Phase 1 CPBL · Phase 2 NBA + 未來 leagues · Tim 親手 curate。 完整 brand 方法論見{" "}
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
            (27 上 27 下)。我們相信 GOLD 會員能用同樣的精準定義這個品牌。
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
            ZONE 27 是「資訊與社群平台」 — 出售 AI 分析的訂閱權限與會員身分,
            模式類似 Bloomberg、TradingView、Action Network,而非運彩公司。
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
            <Link href="/matches/cpbl-260526-01#creator-analysis" className="text-gold underline-offset-4 hover:underline">
              賽事頁
            </Link>
            {" "}的「看法 · 分析」· <strong className="text-bone">免費看 · 登入發言</strong>(不必付費)·
            一場一篇 · 押一邊賽後自動掛準/不準(刪不掉)。 高手的完整分析未來可賣(平台抽 5–10%)。
          </>
        ),
      },
      {
        q: "為何 visitor 不能 推薦賽事?",
        id: "no-user-recommendations",
        a: (
          <>
            Tim 是唯一 curator · 目前先做 CPBL · 同 Stratechery / Ben Thompson 親手 curate 所有內容。
            靠賣明牌的生意抽傭 model 需要 user 推薦 · ZONE 27 結構性相反 · 不接受 third-party 內容。
            您可以到{" "}
            <Link href="/member/submit" className="text-gold underline-offset-4 hover:underline">
              /member/submit
            </Link>
            {" "}投稿給 Tim · 或用 LensFocusVote 投票 lens 優先序。
          </>
        ),
      },
      {
        q: "不抽下注佣金 · 那怎麼賺錢?",
        id: "no-commission",
        a: (
          <>
            <strong className="text-bone">GOLD</strong> NT$ 2,700/365 天 · 會員不限量
            。
            <strong className="text-bone">BLACK</strong> NT$ 500/31 天 × N 訂戶
            (不自動續扣 · 每 31 天 explicit click)。
            再加上創作者賣分析 · 平台抽 5–10%(業界最低,老實認、不假裝不抽)。
            不抽真錢下注的傭 · 不接廣告 / 業配 / 導購分潤。
          </>
        ),
      },
    ],
  },
  {
    key: "pricing",
    label: "GOLD & PRICING",
    zh: "GOLD 會員 / 定價",
    qas: [
      {
        q: "GOLD 跟 BLACK 一般會員有什麼差別?",
        a: (
          <>
            <strong className="text-bone">GOLD</strong> 是會員不限量的
            「NT$ 2,700/365 天 年度會員」。
            <strong className="text-bone">BLACK</strong> 是 31-day pass NT$ 500/31 天
            (3 月–11 月 · 240 場 + 季後賽 · ≈ NT$ 6/場 · 手動銀行轉帳 ·
            不自動續扣 · per /integrity rule #13)。GOLD 會員額外好處:creator 抽成 5%
            (BLACK creators 10%)、AI 模型優先試用、實體招待。完整對照請見{" "}
            <Link href="/founders" className="text-gold underline-offset-4 hover:underline">
              /founders
            </Link>
            。
          </>
        ),
      },
      {
        q: "NT$ 2,700 為什麼這麼便宜?",
        a: (
          <>
            因為 GOLD 是年費 · 抽成 5% 全站最低 —— 你賣分析賺最多 · 而且每年
            續訂價永遠不漲。 跟 BLACK 比:黑卡一年約 12 期 × NT$ 500 = NT$ 6,000 ·
            GOLD NT$ 2,700/年(含 BLACK 全部功能)等於省 55%。
          </>
        ),
      },
      {
        q: "付款系統現況?",
        a: (
          <>
            <span className="font-mono text-gold">BLACK CPBL 季票 · 手動銀行轉帳</span>
            (NT$ 500/31 天 · 每 31 天你主動轉帳一次 · 不自動續扣)。
            <span className="font-mono text-gold mx-1">GOLD payment infra 就緒後開放</span>
            (milestone-triggered · 不綁日期)。 在此之前,加入等候名單 =
            排隊優先權,<strong className="text-bone">完全免費</strong>,
            不收任何資料以外的東西。下方按鈕直接加入:
            <br />
            <Link
              href="/founders"
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
            寄信 tatayngiti@gmail.com · 主旨「REFUND · ZONE27-#NNN」 · Tim 48h 回覆
            確認 · 原戶頭退全額。 不問原因 · 不挽留 · 不問卷 · 不 retention 文案。
            翻倍消保法 § 19 法定 7-day 下限。 完整條款{" "}
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
            <strong className="text-gold">不接。</strong> 不存在 enterprise tier
            · 不存在「talk to our team」 form · ZONE 27 brand IP = 個人
            audience-fans · 不接 corporate B2B。
            <br />
            <br />
            如果您是 corporate 想用 ZONE 27 · 同 rates 同 access:
            自己 NT$ 2,700(GOLD)· 或 NT$ 500/31 天(BLACK)· self-serve。
            <br />
            <br />
            完整 pricing rationale 見{" "}
            <Link href="/founders" className="text-gold underline-offset-4 hover:underline">
              /founders
            </Link>
            {" "}hero + §定價推導(R164 collapsed 自 /pricing/why 詳細頁)。
          </>
        ),
      },
      {
        q: "跟傳銷(MLM)有什麼不同?",
        id: "mlm",
        a: (
          <>
            <strong className="text-bone">沒 downline 結構。</strong>{" "}
            0 推薦獎金 · 0 多層抽佣 · 0 業績 quota · 0 招募下線 · 會員不限量但零金字塔抽佣 ·
            GOLD 會員。 BLACK 10% 抽成是 platform fee(類 Stripe / Spotify)
            · GOLD 5%。
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
            目前 Lab v0.2 使用逐打席對決模型(Real At-Bat),
            10,000 次模擬的收斂結果通常與歷史鎖定 AI 預測落在
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
            ,選一場比賽,按 ▶ RUN 10,000 SIMULATIONS,看真實的
            Poisson 採樣在瀏覽器端跑出收斂結果,然後按 REPLAY MODE
            看一場 9 局逐打席文字直播。<strong className="text-bone">眼見為憑。</strong>
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
            RLS 鎖住 · 連 publishable key 都讀不到全表 · 只能透過 SECURITY DEFINER 回傳 COUNT。
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
            0 Google Analytics · 0 Facebook Pixel · 0 Hotjar · 0 third-party cookies。
            localStorage 只在您自己瀏覽器 · 沒伺服器副本。 完整清單{" "}
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
            {" "}· Tim 24h 內從 Supabase 永久刪除 · 不留備份。
            等候名單不收費 · 不簽約 · 不綁定。
          </>
        ),
      },
      {
        q: "BOTTOM 27 是什麼?",
        a: (
          <>
            Tim 同步開發的棒球經營手遊 · 雙生品牌 · 共用「27」概念與深藏青 × 冷金視覺。
            GOLD 會員未來自動獲得 BOTTOM 27 獨家虛擬資產。
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
            href="/founders"
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
