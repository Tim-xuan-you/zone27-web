import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";

export const metadata: Metadata = {
  title: "FAQ — 預先掃雷的 15 個問題",
  description:
    "ZONE 27 是什麼?是博彩嗎?是傳銷嗎?Founders 27 跟 Black Card 差別?付款什麼時候開放?15 個誠實到不能再誠實的回答 — 包括「你們會追蹤我嗎?」(不會)+「跟 MLM 有什麼不同?」(全方位不同)。",
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
            全台第一個專為硬核棒球迷打造的暗黑黃金級體育預測社群。我們用蒙地卡羅 AI
            模擬器拆解每場 CPBL 比賽,讓「機率」取代「直覺」。社群與創作者收入透明、
            不可篡改,沒有任何宮廟風廣告。完整品牌方法論請見{" "}
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
            (27 上 27 下)。我們相信 270 位創始會員能用同樣的精準定義這個品牌。
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
    ],
  },
  {
    key: "pricing",
    label: "FOUNDERS 27 & PRICING",
    zh: "創始會員 / 定價",
    qas: [
      {
        q: "Founders 27 跟 BLACK CARD 季票會員有什麼差別?",
        a: (
          <>
            <strong className="text-bone">Founders 27</strong> 是限量 270 個名額的
            「一次性 NT$ 2,700 終身會員」。
            <strong className="text-bone">BLACK CARD</strong> 是 CPBL 季票 NT$ 1,500/season
            (March-November · 240 場 + 季後賽 · ≈ NT$ 6/場 · LIVE manual ECPay ·
            0 auto-renewal · per /integrity rule #13)。創始會員額外好處:creator 抽成 0%
            (BLACK CARD creators 5%)、AI 模型優先試用、實體招待。完整對照請見{" "}
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
            因為這是「品牌共建價」,不是「永久市場價」。270 位創始會員會永遠是 ZONE 27
            的傳教士;後續黑金會員 2 個 CPBL 季就 break-even(NT$ 1,500 × 2 = NT$ 3,000 vs Founders 27 NT$ 2,700 終身免費)。
            創始者扛了「品牌還沒驗證」的風險,所以拿一輩子的優惠回報。
          </>
        ),
      },
      {
        q: "付款系統現況?",
        a: (
          <>
            <span className="font-mono text-gold">BLACK CARD CPBL 季票 LIVE manual ECPay</span>
            (NT$ 1,500/season · 每季 explicit click + manual transfer · 0 auto-renewal)。
            <span className="font-mono text-gold mx-1">Founders 27 payment infra 就緒後開放</span>
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
            <strong className="text-bone">14 天無條件退款</strong> · Founders 27
            從 Tim 確認您的銀行轉帳入帳 + 您收到 lifetime access confirmation
            email 那天起算 · BLACK CARD 從您每月手動轉帳當月份入帳那天起算。
            <br />
            <br />
            <strong className="text-bone">流程:</strong>
            寄信 tatayngiti@gmail.com · 主旨「REFUND · ZONE27-#NNN」(NNN 為您的
            founder 編號 或 BLACK CARD month identifier)· Tim 48 hr 內回覆
            確認 · 同步原匯款銀行戶頭退回全額。
            <br />
            <br />
            <strong className="text-bone">不問原因 · 不嘗試挽留</strong> · 不
            要求填問卷 · 不寄 retention 文案 · per [[zone27-pratfall-brand-ip]]
            「不裝挽留」 axiom。
            <br />
            <br />
            ZONE 27 主動延伸到 14 天 · 翻倍中華民國消費者保護法 § 19 distance-
            selling 法定 7-day cooling-off 下限。 完整 refund 條款見{" "}
            <Link href="/terms" className="text-gold underline-offset-4 hover:underline">
              /terms Section 4B
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
            自己 NT$ 2,700(Founders 27)· 或 NT$ 1,500/season(BLACK CARD)· self-serve。
            <br />
            <br />
            完整 pricing rationale 見{" "}
            <Link href="/pricing/why" className="text-gold underline-offset-4 hover:underline">
              /pricing/why
            </Link>
            {" "}§04「為什麼這頁沒有比較表」 + §03「為什麼 Founders 27 是 NT$ 2,700」。
          </>
        ),
      },
      {
        q: "還會有第二批 270 個創始會員嗎?",
        a: (
          <>
            <strong className="text-gold">不會。</strong> 當 #270 被認領的那一秒,
            Founders 27 就永久關閉。這是承諾,寫在{" "}
            <Link href="/about" className="text-gold underline-offset-4 hover:underline">
              /about
            </Link>
            、
            <Link href="/founders" className="text-gold underline-offset-4 hover:underline">
              /founders
            </Link>
            、
            <Link href="/leaderboard" className="text-gold underline-offset-4 hover:underline">
              /leaderboard
            </Link>{" "}
            三處。
          </>
        ),
      },
      {
        q: "ZONE 27 跟傳銷(MLM / 直銷 / 安麗式)有什麼不同?",
        id: "mlm",
        a: (
          <>
            <strong className="text-bone">經濟結構完全相反。</strong>{" "}
            MLM 的核心收入靠下線抽佣 + 推薦獎金(您介紹的人賺多少 · 您拿一部分)·
            ZONE 27 完全
            <strong className="text-bone">沒有 downline 結構</strong>。
            <br />
            <br />
            <span className="block font-mono text-mute text-[10px] tracking-[0.3em] mb-3">
              ✕ 我們不做的 vs ZONE 27 對應結構
            </span>
            <ul className="space-y-2 list-none pl-0 text-sm">
              <li>
                <span className="text-loss/80 mr-2">✕</span>
                MLM 多層次抽佣 ·{" "}
                <span className="text-bone">ZONE 27 零 multi-level compensation</span>
              </li>
              <li>
                <span className="text-loss/80 mr-2">✕</span>
                MLM 推薦獎金 ·{" "}
                <span className="text-bone">ZONE 27 沒有任何 referral bonus</span>
              </li>
              <li>
                <span className="text-loss/80 mr-2">✕</span>
                MLM 業績 quota ·{" "}
                <span className="text-bone">Founders 27 一次性付款 · 沒 quota</span>
              </li>
              <li>
                <span className="text-loss/80 mr-2">✕</span>
                MLM 強制庫存 ·{" "}
                <span className="text-bone">沒實體商品 · 引擎免費</span>
              </li>
              <li>
                <span className="text-loss/80 mr-2">✕</span>
                MLM「成功學」訓練 ·{" "}
                <span className="text-bone">沒任何 sales-script · 沒洗腦營</span>
              </li>
              <li>
                <span className="text-loss/80 mr-2">✕</span>
                MLM 無限招募下線 ·{" "}
                <span className="text-bone">限量 270 · 一次性 · #270 認領那秒永久關閉</span>
              </li>
            </ul>
            <br />
            BLACK CARD 創作者抽成 5% 是 <strong className="text-bone">platform fee</strong>
            (類 Stripe / Spotify · 不是 multi-level)· Founders 27 創作者抽成 0%
            (把「未來不抽您佣」當 perk · 不是 referral kick-back)。
            <br />
            <br />
            表面 visual cue(限量 / 親手 onboard / LINE 群)有重疊 ·
            但結構是 <strong className="text-bone">Costly Signaling + 早期支持者補償</strong> ·
            不是招募階梯。完整 monetization philosophy 見{" "}
            <Link
              href="/manifesto"
              className="text-gold underline-offset-4 hover:underline"
            >
              /manifesto Section II
            </Link>
            。
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
            <Link href="/lab" className="text-gold underline-offset-4 hover:underline">
              /lab 方法論
            </Link>{" "}
            與{" "}
            <Link href="/glossary" className="text-gold underline-offset-4 hover:underline">
              /glossary
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
            並把這個變數寫進下一次模型迭代。模型在{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
              /changelog
            </Link>{" "}
            持續公開升級紀錄。
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
        q: "我的 email 會被怎麼處理?",
        a: (
          <>
            <strong className="text-bone">更新 2026-05-20:</strong>{" "}
            所有報名 email 存在{" "}
            <span className="font-mono text-gold/90">Supabase Tokyo</span> 加密 PostgreSQL,
            並啟用 Row-Level Security lock-down —{" "}
            <strong className="text-bone">沒有任何角色能直接讀全表</strong>,
            連我們的公開 publishable key 都無法繞過 RLS。所有讀取只能透過{" "}
            <span className="font-mono text-gold/90">SECURITY DEFINER</span>{" "}
            函式且該函式只回傳 COUNT,從不回傳 email/姓名。
            <br />
            <br />
            我們承諾<strong className="text-bone">不分享、不販售、不轉手</strong>
            任何第三方。完整 SQL schema 公開於{" "}
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/blob/main/supabase/migrations/0001_waitlist.sql"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              supabase/migrations/0001_waitlist.sql
            </a>
            ,任何人可審計 — 詳見{" "}
            <Link
              href="/privacy"
              className="text-gold underline-offset-4 hover:underline"
            >
              /privacy Section 04
            </Link>
            。
          </>
        ),
      },
      {
        q: "你們會追蹤我的使用行為嗎?",
        a: (
          <>
            <strong className="text-bone">不會。</strong>{" "}
            ZONE 27 沒有裝 Google Analytics、Facebook Pixel、Hotjar 錄影,
            也沒有任何第三方追蹤 cookies。
            <br />
            <br />
            您在{" "}
            <Link href="/lab" className="text-gold underline-offset-4 hover:underline">
              /lab
            </Link>{" "}
            跑過幾次 Monte Carlo、看了哪場比賽、停留多久 ——
            只存在您自己的瀏覽器(localStorage),沒有伺服器副本。
            <strong className="text-bone">我們連數都不數。</strong>
            <br />
            <br />
            這不是技術限制,是品牌哲學。在競爭對手都在追蹤的市場,我們刻意選了相反方向。
            完整清單見{" "}
            <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
              /privacy
            </Link>{" "}
            第 03 節。
          </>
        ),
      },
      {
        q: "我可以取消等候名單嗎?",
        a: (
          <>
            可以,隨時。目前(pre-launch)透過{" "}
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              GitHub Issues
            </a>
            {" "}留下您要刪除的 email · 創辦人 Tim 收到後 24 小時內
            從 Supabase 永久刪除您的 row(<strong className="text-bone">不留備份</strong>)。
            <br />
            <br />
            等候名單本身<strong className="text-bone">不收費、不簽約、不綁定</strong>,
            純粹是優先權的標記。退出沒有任何懲罰或保留期。
          </>
        ),
      },
      {
        q: "BOTTOM 27 是什麼?跟 ZONE 27 什麼關係?",
        a: (
          <>
            <strong className="text-bone">BOTTOM 27</strong> 是 Tim 同步開發的棒球經營手遊。
            兩者是雙生品牌,共用「27」概念與深藏青 × 冷金視覺系統。
            Founders 27 會員未來會自動獲得 BOTTOM 27 的獨家虛擬資產
            (專屬球員卡、稀有球場代幣、終身贊助商徽章),
            雙產品深度綁定同一群棒球迷的娛樂時間。
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
