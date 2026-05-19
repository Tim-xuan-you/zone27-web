import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ — 預先掃雷的 12 個問題",
  description:
    "ZONE 27 是什麼?是博彩嗎?Founders 27 跟 Black Card 差別?付款什麼時候開放?12 個誠實到不能再誠實的回答。",
};

type QA = {
  q: string;
  a: React.ReactNode;
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
        q: "Founders 27 跟 BLACK CARD 月費會員有什麼差別?",
        a: (
          <>
            <strong className="text-bone">Founders 27</strong> 是限量 270 個名額的
            「一次性 NT$ 2,700 終身會員」。
            <strong className="text-bone">BLACK CARD</strong> 是每月 NT$ 499 的訂閱制
            (預計 Q3 2026 開放)。創始會員額外好處:賣明牌 0% 抽成
            (黑金 5%)、AI 模型優先試用、實體招待。完整對照請見{" "}
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
            的傳教士;後續黑金會員年費將會是 NT$ 4,990(每月 499 × 10 折扣)。
            創始者扛了「品牌還沒驗證」的風險,所以拿一輩子的優惠回報。
          </>
        ),
      },
      {
        q: "付款系統什麼時候開放?",
        a: (
          <>
            預計 <span className="font-mono text-gold tabular">2026 Q3</span>。
            在此之前,加入等候名單 =排隊優先權,
            <strong className="text-bone">完全免費</strong>,
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
            Founders 27 等候名單期間,所有報名 email 暫存在 Vercel 後台 logs
            (僅創辦人 Tim 可存取)。正式付款開放後會遷移到 Supabase 加密儲存。
            我們承諾<strong className="text-bone">不分享、不販售、不轉手</strong>
            任何第三方。隨時可寄信要求刪除。
          </>
        ),
      },
      {
        q: "我可以取消等候名單嗎?",
        a: (
          <>
            可以,隨時。寄信給我們任何官方聯絡管道(launch 後公布)即可。
            等候名單本身<strong className="text-bone">不收費、不簽約、不綁定</strong>,
            純粹是優先權的標記。
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

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          FAQ · {TOTAL_QAS} HONEST ANSWERS
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          預先掃雷的
          <br />
          <span className="text-gold">12 個問題</span>
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
            <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
              {c.label}
            </span>
          </div>
          <h2 className="text-3xl text-bone font-light tracking-tight mb-10">
            {c.zh}
          </h2>

          <div className="space-y-10">
            {c.qas.map((qa, qi) => (
              <QAEntry key={qi} num={qi + 1} q={qa.q} a={qa.a} />
            ))}
          </div>
        </section>
      ))}

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

      <Footer />
    </div>
  );
}

// ── Sub-component ──────────────────────────────────────
function QAEntry({
  num,
  q,
  a,
}: {
  num: number;
  q: string;
  a: React.ReactNode;
}) {
  return (
    <article className="border-l-2 border-gold/30 pl-5 sm:pl-6">
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
