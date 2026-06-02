import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";

export const metadata: Metadata = {
  title: "我們的訃聞 · 寫在 ZONE 27 倒下前 2 年",
  description:
    "Tim 親手用過去式寫下 2028 年 ZONE 27 最可能倒下的 5 種劇本 · 每個劇本包含失敗的故事、早期警訊、觸發後要做的事 · 不藏未來可能死掉的方式。 若這 5 個劇本到 2028-05-26 都沒發生 · ZONE 27 活了下來 · 若有一個發生 · 這頁就變成證據。 靠賣明牌的生意結構上做不出這樣一頁 · 因為他們不公布失敗劇本 · 也不替自己的失敗先立下承諾。",
  openGraph: {
    title: "我們的訃聞 · 寫在 ZONE 27 倒下前 2 年",
    description:
      "Tim 親手寫下 2028 失敗劇本 · 5 種最可能倒下的方式 + 早期警訊 + 觸發後要做的事",
    type: "article",
    url: "/founders/postmortem-2028",
  },
  twitter: {
    card: "summary_large_image",
    title: "我們的訃聞 · 寫在 ZONE 27 倒下前 2 年",
    description:
      "Tim 親手寫下 2028 失敗劇本 · 5 種最可能倒下的方式 + 早期警訊 + 觸發後要做的事",
  },
  alternates: {
    canonical: "/founders/postmortem-2028",
  },
};

// ── ZONE 27 · /founders/postmortem-2028 · Premortem Artifact ────────
// R140 W6 · Agent C R140 TOP psychology recommendation · Premortem
// (Klein 1998「Sources of Power」 ch.7 · HBR 2007「Performing a Project
// Premortem」)· prospective hindsight(Mitchell/Russo/Pennington 1989
// JBDM 2(1):25-38)· 假設 project HAS already failed 2 years from now ·
// 寫 obituary · 30% better ability to identify failure causes vs forward-
// looking risk analysis · 因為 converts ambiguous future risk(System 2
// effortful)to concrete past narrative(System 1 fluent)。
//
// brand IP fit · 6th Pratfall surface · 平行於:
//   - /audit EXCLUDE(model limits)
//   - /methodology LIMITS(technical bounds)
//   - /roadmap BOUNDARIES(scope refused)
//   - /track-record DIVERGED(receipt misses)
//   - /steelman(external objections)
//   - /founders/postmortem-2028(Tim's own obituary · THIS file)
//
// 結構性 LINE 老師 / 報馬仔 永遠無法 ship 此 page · 他們 business model
// 要求 perpetual confidence · ZONE 27 公開 own obituary = brand 信任 act
// that competitors CANNOT mimic · same Costly Signaling 100× axiom as
// /audit S05 PRE-COMMIT 第一筆 DIVERGED 處理規則。
//
// 不做 anti-pattern:
//   ✕ NO「我們不會失敗」 perpetual-confidence framing(會 trigger reactance)
//   ✕ NO「failure 可能性低 · 但我們已 plan B」 marketing-hedge(undermines pratfall)
//   ✕ NO「您訂閱可降低 failure 概率」 implicit pressure(violates「不 dark pattern」)
//   ✕ NO「failure 後 refund 條款」 transactional escape(violates identity-not-features)
//
// 若 5 個 scenarios 全 2028-05-26 前未 fire · ZONE 27 survived · 此 page
// 變 historical artifact。 若 1 個 fire · 此 page 變 self-fulfilled receipt
// · 同 R130 W-CRITICAL 「自己 introduced 自己 fixed」 + R135 W1「broken anchor
// silent」 + R139 W2「賽事討論室 brand IP contradiction」 cumulative「不藏
// mistake」 axiom 物理 codify to prospective-failure 層。
// ─────────────────────────────────────────────────────

const PUBLISHED_DATE = "2026-05-26";
const PROSPECTIVE_DATE = "2028-05-26";

type Scenario = {
  no: string;
  enKicker: string;
  zhTitle: string;
  narrative: string;
  signal: string;
  canary: string;
};

const SCENARIOS: Scenario[] = [
  {
    no: "01",
    enKicker: "SUSTAINABILITY COLLAPSE",
    zhTitle: "Tim 燃燒殆盡 · 一個人回 270 人 + 每週工程筆記 · 撐不下去",
    narrative:
      "我在 2027 Q2 開始出貨速度減半。 Founders 27 的 270 人都已經加入 · 但每週要寫工程筆記、回訊息、處理 CPBL 資料、維護準度報告 · 一個人全包扛不住。 一開始我以為再撐一下就好。 接著我開始略過某幾週的工程筆記 · 然後回訊息從 24 小時變 72 小時變一週。 BLACK CARD 訂戶看到品質下降 · 下一季就不續訂了。 2027 Q4 · 我才發現「能不能持續維持速度」是這個模式藏起來的死穴 · 不是可有可無的事。",
    signal:
      "WATCHING · 每週工程筆記延遲 3 天以上 · 回訊息的中位時間超過 48 小時 · 進度日誌連續 2 週沒更新。",
    canary:
      "FIRE IF · 2026-12-31 前任一指標觸發 · 立即公開一封「調整更新節奏」的信 · 暫停 Founders 27 新申請 · 重新評估我一個人能負荷的量。",
  },
  {
    no: "02",
    enKicker: "REVENUE BRIDGE GAP",
    zhTitle: "Founders 27 賣完 · 光靠 BLACK CARD NT$ 500/31 天 養不起一個人的工程進度",
    narrative:
      "Founders 27 的 270 席在 2027 Q1 賣完 · 年度收入 NT$ 729,000 入帳。 我以為這就打平了。 結果 BLACK CARD NT$ 500/31 天 的轉換率比預期低 · 一年大約 12 期 × 100 訂戶 ≈ NT$ 600,000/年 · 一個人扛工程 + CPBL 數據 + 客服的成本超過收入 · 2027 年底我發現自己在補貼 · 不是在維持。 「引擎永遠免費」是不能破的原則 · 不能拿引擎收費。 我只剩三個選擇:(a)放棄全職、兼差維持 · 但出貨速度掉到三分之一 ·(b)增加 Founders 27 名額 · 但這破壞了原本的稀缺承諾 ·(c)加付費功能 · 但訂閱本來就該是支持、不是把功能鎖起來。 三個都傷品牌。",
    signal:
      "WATCHING · 2027 Q2 有效 BLACK CARD 訂戶低於 80 · 接下來半年的花費超過半年的存糧 · 到 2027-06-30 Founders 27 賣出不到 200。",
    canary:
      "FIRE IF · 2027-06-30 BLACK CARD 不到 80 且 Founders 27 不到 200 · 立即在 /founders/ledger 公開一封財務誠實信 · 邀請 Founders 27 票選 4 個維持下去的方案 · 不偷偷轉向。",
  },
  {
    no: "03",
    enKicker: "ENGINE CALIBRATION DRIFT",
    zhTitle: "引擎 v0.3 累積 30 場真實跑出來 · 準度比 v0.2 還差",
    narrative:
      "2026 Q4 · CPBL 累積到 30 場樣本。 v0.3 上線。 結果 v0.3 的準度比 v0.2 還差了 8 個百分點 · 舊版反而更準。 在我們白紙黑字的規則下 · 我必須:(a)公開失準比例變高了 · (b)決定要不要把 v0.3 退回舊版 · (c)寫一份「新版更差」的檢討。 訂戶看到準度退步 · 信任動搖。 就算我全部公開、全部誠實 · 觀感的傷害已經造成。 「方法公開」這件事這時候是雙面刃 · 透明會累積信任 · 也會把退步攤在陽光下。",
    signal:
      "WATCHING · v0.3 前 30 場結算後的準度比 v0.2 差超過 5 個百分點 · /track-record 失準比例連續 4 週上升。",
    canary:
      "FIRE IF · v0.3 第 30 場準度比 v0.2 差 · 立即在 /methodology/diff 加上 v0.3 退版的理由說明 · 自己出的問題自己公開修 · 不藏。",
  },
  {
    no: "04",
    enKicker: "DATA PIPELINE HALT",
    zhTitle: "CPBL 真實數據 pipeline 中斷 · Tim 手動 screenshot 不可持續",
    narrative:
      "2026 Q3 · CPBL 賽程衝到一年 240 場 + 季後賽 + 台灣大賽。 我每天截 2-3 場 · 一週 14-21 場 · 一年一千多張截圖 · 就算半自動處理也要每場 30 分鐘。 一千多場 × 30 分鐘 = 一年 500 小時純粹在輸入資料 · 等於一個全職人力。 我做不下去。 但自動爬 CPBL 官網違反我們「不爬資料」的紅線。 不自動化就撐不住 · 紅線把我逼進死胡同 · 2027 我只剩三個選擇:(a)破戒開始爬資料 · (b)只收重大場次 · (c)放棄「每天更新」的說法。 三個都傷品牌。",
    signal:
      "WATCHING · 每週實際處理的場次低於排定場次的 8 成 · /track-record 累積速度低於一天一場 · Tim 處理資料的時間超過每日工時 4 成。",
    canary:
      "FIRE IF · 2026-10-31 前連續 3 週處理量低於 8 成 · 立即在 /coverage 公開一封信、說明改成只收重大場次 · 不偷偷縮小範圍 · 並提前 30 天公告。",
  },
  {
    no: "05",
    enKicker: "STEALTH MODE BROKEN",
    zhTitle: "太早衝行銷上線 · 半成品的第一印象打壞定位",
    narrative:
      "2026 Q4 · 因為 Founders 27 轉換比預期慢 · 我慌了、提早衝行銷。 上了網站地圖、開放搜尋引擎、註冊社群帳號、寫了上線文。 結果第一波流量在還沒準備好的狀態下湧進來。 訪客看到的是只有 15 場的準度樣本、還是舊版引擎、0 筆真實付費紀錄 · 半成品的印象就這樣烙進腦海。 之後真的做出成熟版本 · 但第一印象已經定型 · 定位被打壞了。 我自己破了「域名與行銷等時機成熟再動」的原則 · 跟之前那些「明天再做」的拖延承諾、以及自打嘴巴的功能一樣 · 都是我自己埋的坑自己跳。",
    signal:
      "WATCHING · Tim 自己主動說「我們現在上線吧」 · 違反「不躁進」原則和 SEO 凍結規則 · 這是我自己察覺到的急躁訊號 · 或訪客不重複人數突然暴增 5 成以上、又找不到原因。",
    canary:
      "FIRE IF · 在 5 個基礎條件全綠之前做了任何行銷、社群帳號、網站地圖的動作 · 立即在 /transparency 公開一封「提早上線、自我修正」的信 · 暫停推廣 · 自己抓到自己。",
  },
];

export default function PostmortemPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/founders"
              className="hover:text-gold transition-colors"
            >
              FOUNDERS
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">POSTMORTEM 2028</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-10">
          <p
            lang="en"
            className="font-mono text-loss/85 text-[10px] tracking-[0.45em] mb-6"
          >
            POSTMORTEM · DATED {PROSPECTIVE_DATE} · WRITTEN {PUBLISHED_DATE}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight text-bone">
            ZONE 27 的{" "}
            <span className="text-loss/85">訃聞</span> · 寫在它倒下前{" "}
            <span className="text-gold">2 年</span>
          </h1>
          <div className="zone27-rule max-w-[320px] mt-5" aria-hidden="true" />
          <p className="text-mute text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
            這份訃聞假設今天是 2028-05-26 · ZONE 27 已經倒下 · 我用過去式
            寫下 5 個最可能倒下的方式。 不是預測 · 不是擔心 · 是
            <strong className="text-bone">先寫好自己的死法</strong>。
            把模糊的未來風險 · 變成一個具體、寫死的故事 · 反而更容易看清
            自己會敗在哪裡。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={7} />
          </div>
        </section>

        {/* ── WHY THIS EXISTS ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 為什麼寫這一頁
          </p>
          <div className="space-y-4 zh-body text-mute text-base leading-relaxed">
            <p>
              靠賣明牌的生意都宣稱自己永遠會贏。 這種生意要靠{" "}
              <strong className="text-bone">永遠看起來很有把握</strong> ·
              結構上做不出這樣一頁。 ZONE 27 反過來 ·{" "}
              <strong className="text-bone">公開自己的訃聞</strong> · 這是
              對手學不來的信任證明。
            </p>
            <p>
              這頁是 ZONE 27 公開自己弱點的其中一面 · 跟 /audit 列出模型限制、
              /methodology 列出技術邊界、/roadmap 列出不做的範圍、/track-record
              把失準跟命中一樣公開、以及 /steelman 自己寫反方論證 · 是同一套做法。
              一旦發布 · 要修改必須提前 30 天在{" "}
              <Link
                href="/changelog"
                className="text-gold underline-offset-4 hover:underline"
              >
                /changelog
              </Link>
              {" "}公告。
            </p>
            <p>
              若這 5 個劇本到 2028-05-26 都沒發生 ·{" "}
              <strong className="text-bone">ZONE 27 活了下來</strong> · 這頁
              就變成一段歷史紀錄。 若有一個發生 ·{" "}
              <strong className="text-bone">這頁就變成自己預言成真的證據</strong>
              · 我猜對了 · 但猜對救不了這個專案 · 連未來可能怎麼死 · 我都不藏。
            </p>
          </div>
        </section>

        {/* ── 5 SCENARIOS ────────────────────────── */}
        {SCENARIOS.map((s) => (
          <ScenarioSection key={s.no} scenario={s} />
        ))}

        {/* ── CANARY SUMMARY ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-12 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-loss/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / 早期警訊清單
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            以下 5 個指標到 2028-05-26 都沒觸發 · ZONE 27 就活了下來
          </h2>
          <ol className="space-y-3 text-mute text-sm leading-relaxed list-decimal pl-6">
            {SCENARIOS.map((s) => (
              <li key={s.no} className="leading-relaxed">
                <strong className="text-bone">#{s.no} · {s.enKicker}</strong>
                {" · "}
                {s.canary}
              </li>
            ))}
          </ol>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed mt-6">
            這 5 個劇本與觸發條件只能增、不能改弱或刪除 · 修改任一條都需
            提前 30 天在 /changelog 公告。
          </p>
        </section>

        {/* ── CROSS LINKS ────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 其他公開弱點的頁面
          </p>
          <ul className="space-y-2 text-mute text-sm leading-relaxed">
            <li>
              <Link
                href="/audit"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /audit
              </Link>
              {" · 模型限制 + 樣本不足 + 哪些數字是推估的"}
            </li>
            <li>
              <Link
                href="/methodology"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /methodology
              </Link>
              {" · 技術邊界 + 還沒累積到足夠樣本"}
            </li>
            <li>
              <Link
                href="/roadmap"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /roadmap
              </Link>
              {" · 哪些功能我們刻意不做"}
            </li>
            <li>
              <Link
                href="/track-record"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /track-record
              </Link>
              {" · 失準跟命中一樣大方公開"}
            </li>
            <li>
              <Link
                href="/steelman"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /steelman
              </Link>
              {" · 自己先寫出反對我們最強的論點"}
            </li>
          </ul>
        </section>

        <FounderSignOff signedAt={PUBLISHED_DATE}>
          這份訃聞不是預測。 是一個承諾:連未來可能怎麼倒下 · 我都不藏。
          若您讀完仍想加入 Founders 27 · 您清楚自己在加入什麼。
          若您讀完選擇離開 · 我謝謝您誠實的評估 · 不會回頭追蹤您 ·
          不會寄信 · 不會推銷。
        </FounderSignOff>

        <Footer />
      </main>
    </div>
  );
}

function ScenarioSection({ scenario: s }: { scenario: Scenario }) {
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40 scroll-mt-20" id={`scenario-${s.no}`}>
      <div className="flex items-baseline gap-4 mb-3">
        <span className="font-mono text-loss/85 text-[10px] tabular tracking-[0.4em]">
          #{s.no}
        </span>
        <h2
          lang="en"
          className="font-mono text-bone text-[11px] tracking-[0.35em]"
        >
          {s.enKicker}
        </h2>
      </div>
      <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight mb-6">
        {s.zhTitle}
      </h3>

      <p
        lang="en"
        className="font-mono text-mute/80 text-[10px] tracking-[0.3em] mb-2"
      >
        OBITUARY · first-person past-tense
      </p>
      <p className="zh-body text-mute text-base leading-relaxed mb-6">
        {s.narrative}
      </p>

      <div className="border-l-2 border-loss/40 pl-4 sm:pl-5 py-2 mb-4 bg-loss/5">
        <p
          lang="en"
          className="font-mono text-loss/85 text-[9px] tracking-[0.3em] mb-1"
        >
          EARLY-WARNING SIGNAL · currently watching
        </p>
        <p className="text-mute text-sm leading-relaxed">{s.signal}</p>
      </div>

      <div className="border-l-2 border-gold/60 pl-4 sm:pl-5 py-2 bg-gold/5">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[9px] tracking-[0.3em] mb-1"
        >
          CANARY FIRE TRIGGER · what I will do
        </p>
        <p className="text-mute text-sm leading-relaxed">{s.canary}</p>
      </div>
    </section>
  );
}
