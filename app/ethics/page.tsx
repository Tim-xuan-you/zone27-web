import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";

export const metadata: Metadata = {
  title: "Ethics Policy · 9 binding commitments",
  description:
    "ZONE 27 的 9 條「我永遠不做」承諾,Tim 親筆簽名。對標、取代賣明牌的站、收費明牌群組。每一條都公開、可追蹤,修改任何一條都要 30 天前先公告。違反 = 品牌信用崩盤。",
};

// /ethics · Stratechery About page transplant · 9 ZONE 27 binding NOT-DO
// commitments · 修改任 commitment 需 30 天 /changelog 公告。

const COMMITMENTS: { num: string; title: string; body: string; tier: "displacement" | "subscriber" | "brand"; }[] = [
  {
    num: "01",
    title: "我不把引擎預測賣給博彩業者或爬資料的人",
    body: "如果有任何博彩平台 / 爬資料的人 / 賭博公司來開價,想授權拿 ZONE 27 的引擎結果 · 我會把對方開的條件 + 我的拒絕公開在 /audit · 不私下交易 · 不簽保密協議。",
    tier: "displacement",
  },
  {
    num: "02",
    title: "我永遠不接賭博平台的廣告,也不靠引薦分潤賺它們的錢",
    body: "ZONE 27 不接賭博公司的廣告 · 不在站上放任何導去賭博平台的引薦連結 · 不收「點進去就抽成」的佣金 · 不收賠率/明牌的引流費。",
    tier: "displacement",
  },
  {
    num: "03",
    title: "我不接受任何形式的「收錢幫人推薦」",
    body: "任何想付錢、要 ZONE 27 推薦它的服務、產品、球員、球隊、媒體的贊助商 · 都會被公開拒絕 · 不接付費置入 · 不寫業配 · 不收「幫我們講好話」的錢。",
    tier: "displacement",
  },
  {
    num: "04",
    title: "我不接受把資料授權賣給賭博公司的邀約",
    body: "ZONE 27 各個分析角度算出的結果(氣勢檢查、場地係數、投球負荷、黑馬指數、牛棚深度、對戰歷史、勝率)+ 引擎的計算結果 · 永遠不賣、不授權、不開放介接給任何賭博公司或賭博相關生意。",
    tier: "displacement",
  },
  {
    num: "05",
    title: "我不持有中職球隊／球員經紀的股份,也不接他們的顧問案",
    body: "ZONE 27 跟中職球隊／球員／經紀人之間永遠沒有金錢關係 · 不持任何球隊股份 · 不收顧問費 · 不收代言費 · 任何利益衝突都會公開講在 /audit。",
    tier: "displacement",
  },
  {
    num: "06",
    title: "我永遠不在 ZONE 27 上跑廣告、引薦分潤、或付費置入",
    body: "整個 ZONE 27 站上 · 0 廣告 · 0 業配 · 0 付費置入 · 0 贊助內容 · 0 合作推廣。 訂閱費(BLACK)就是全部的收入來源 · 一開始就刻意這樣設計。",
    tier: "subscriber",
  },
  {
    num: "07",
    title: "我每年 5 月公開全年收入 + 開銷 + 訂閱人數",
    body: "每年 5/31 公開年度報告 · 含全年收入 · 全年開銷 · BLACK 訂閱數 · 對照 /audit 第 5 節的事前承諾 · 要改公開的時間表,需提前 30 天公告。",
    tier: "subscriber",
  },
  {
    num: "08",
    title: "我永遠不收賭博公司的引流抽成或引薦佣金",
    body: "如果訪客從 ZONE 27 連出去、自己去開了賭博平台帳號 · ZONE 27 不收任何引薦佣金 · 不在網址裡偷加追蹤碼 · 不抽任何引流費。 訪客的選擇是訪客自己的事。",
    tier: "displacement",
  },
  {
    num: "09",
    title: "引擎每一筆預測都一定公開 · 不挑好的講 · 事後絕不刪",
    body: "引擎每一筆賽前鎖定的 CPBL 預測,都一定進 /track-record、一定有一個永久查得到的收據連結,並標上「猜中／算錯／平手」· 不挑好的講 · 事後絕不刪 · 不只挑高把握的留 · 就算引擎 100% 算錯也照樣公開。 因為你一旦看到預測,就有權看到結果;只挑好的公開,信任就垮了。",
    // R119 W4 · redline patch · tier corrected displacement → brand · #09 是
    // ZONE 27 internal brand discipline(Berkshire 70-year + Geneva Seal
    // pattern · per body cite)· NOT displacement of 玩運彩 (那 1-5 + 8 在
    // 做)· OG card TierStat 6+2+1=9 結構之前 silent assumed brand=1 但 array
    // mistagged 7+2+0 · per [[feedback-zone27-pratfall-brand-ip]] self-
    // falsifiable count drift 永遠 patch · 不藏。
    tier: "brand",
  },
];

export default function EthicsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / 我們永遠不做的 9 件事
            </p>
            <span
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold"
            >
              9 條 · Tim 簽名
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            9 件 ZONE 27 <span className="text-gold">永遠不做</span> 的事
          </h1>

          <p className="mt-8 text-bone text-lg sm:text-xl leading-relaxed border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            每一條 Tim 簽名 · 違反任何一條,這頁就用紅字永久標記。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── 01 COMMITMENTS ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 9 條承諾 · Tim 簽名 · 2026-05-23
          </p>

          <ol className="space-y-6">
            {COMMITMENTS.map((c) => (
              <li
                key={c.num}
                className="border border-gold/30 bg-slate/30 p-5 sm:p-6 hover:border-gold/50 transition-colors"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span
                    lang="en"
                    className="font-mono text-gold text-[14px] tracking-[0.35em] tabular"
                  >
                    {c.num}
                  </span>
                  <span
                    className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                      c.tier === "displacement"
                        ? "border-gold/60 text-gold"
                        : "border-line/60 text-mute"
                    }`}
                  >
                    {c.tier === "displacement"
                      ? "取代明牌"
                      : c.tier === "subscriber"
                      ? "保護會員"
                      : "品牌信用"}
                  </span>
                </div>
                <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight mb-3 leading-snug">
                  {c.title}
                </h3>
                <p className="text-mute leading-relaxed zh-body">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 玩家保護 · 量力而為(R216 · 借鑑對手的責任投注頁,但說得更大聲——
            我們沒有他「一邊喊投注 -EV、一邊收月費賣明牌」的矛盾)· 純中文 · 無 emoji。
            上面 9 條是「我們不做的壞事」· 這段是「我們為玩家做的事」—— 客群是賭徒,
            站上卻沒有任何玩家保護 = 既是道德缺口、也是信任/法律攻擊面。 ───────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
            / 玩家保護 · 量力而為
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            我們站在<span className="text-gold">你</span>這邊,不是莊家那邊
          </h2>
          <div className="space-y-4 text-mute leading-relaxed zh-body">
            <p>
              說清楚:<strong className="text-bone">我們不是莊家</strong> ——
              不收賭注、不參與任何投注交易、不抽你下注的傭。 引擎永遠免費,我們賺的是
              會員身分費(手動轉帳、0 自動續扣)。 你贏你輸我們一樣賺,所以
              <strong className="text-bone">沒有動機騙你押</strong>。
            </p>
            <p>
              也說一件莊家不會大聲講的事:<strong className="text-bone">莊家的賠率裡
              含他的抽水,長期跟著任何明牌押,數學期望上對玩家不利。</strong> 這正是
              我們<span className="text-gold">不秀盤口、不叫你押哪邊</span>的原因 ——
              我們給你自己算的機率 + 誠實的對帳紀錄,押不押、押多少,是你自己的決定。
            </p>
            <p>
              預測是<strong className="text-bone">分析工具,不是收入來源</strong>。
              別借錢押、別把它當提款機。 如果下注已經影響到你的生活、或身邊的人有
              賭博困擾,請找人聊聊 —— 這不丟臉:
            </p>
          </div>
          <div className="mt-6 p-5 sm:p-6 border border-gold/30 bg-slate/30">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-3">
              求助資源 · 台灣 · 免費
            </p>
            <ul className="space-y-2 text-mute leading-relaxed list-none pl-0">
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-bone tabular text-base shrink-0">1925</span>
                <span className="text-sm">衛福部 安心專線 · 24 小時免費心理諮詢</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-bone tabular text-base shrink-0">1995</span>
                <span className="text-sm">生命線協談專線</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-bone tabular text-base shrink-0">1980</span>
                <span className="text-sm">張老師輔導專線</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── BUS_FACTOR · solo-founder contingency disclosure ── */}
        <section
          id="bus-factor"
          className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-14 border-t border-line/40 scroll-mt-20"
        >
          <div className="flex items-baseline gap-4 mb-2">
            <span
              className="font-mono text-gold/70 text-[10px] tracking-[0.35em]"
            >
              / 單人風險
            </span>
            <span
              className="font-mono text-mute text-[10px] tracking-[0.35em]"
            >
              萬一 Tim 不在了
            </span>
          </div>
          <h2 className="text-3xl text-bone font-light tracking-tight mb-6">
            如果 Tim 失蹤了 · 全靠他一個人
          </h2>
          <p className="text-mute leading-relaxed mb-4">
            ZONE 27 只有 Tim 一個人做 · 如果他出車禍 / 失蹤 / 健康垮掉,運作會中斷。 你的資料不會被綁死:
          </p>
          <h3 className="text-bone text-lg mt-6 mb-3">你的資料 · 不會被我們綁死</h3>
          <ul className="space-y-3 text-mute leading-relaxed zh-body">
            <li>
              <strong className="text-bone">您的公開戰績與會員身分</strong>{" "}
              · 在您的公開檔 /u/你的公開碼 · 含輸的對帳紀錄任何人都查得到、隨時可截圖留存
            </li>
            <li>
              <strong className="text-bone">你的 PDF 證書 + 歡迎包</strong>{" "}
              · 存在你自己裝置 · 下載後永久是你的 · 不需要靠 ZONE 27 的伺服器才能打開
            </li>
            <li>
              <strong className="text-bone">你的申請信 + Tim 的回信</strong>{" "}
              · 在你的 Gmail 信箱 + Tim 的 Gmail 信箱 · 兩邊各一份 · 就算 Tim
              的帳號被凍結 · 你信箱裡的完整往來紀錄都還在
            </li>
            <li>
              <strong className="text-bone">你的資料庫資料</strong> · 存在
              東京機房 · 上了權限鎖 · 就算 Tim 那邊網站停止部署 · 資料庫
              在沒人接管時會在 90 天後自動暫停、但不會刪掉 · 你還是能透過
              信箱重設、直接把帳號救回來。
            </li>
            <li>
              <strong className="text-bone">你付的 NT$ 500 黑卡</strong>{" "}
              · 14 天鑑賞期內隨時可退款 · 依 /terms 第 4B 條與
              消保法第 19 條。 如果遇到 Tim 失蹤、服務中斷 · 你可以
              寫信到{" "}
              <a
                href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20service%20interruption%20refund"
                className="text-gold underline-offset-4 hover:underline"
              >
                tatayngiti@gmail.com
              </a>{" "}
              · 由 Tim 的家人 / 遺產代理人協助退款(依 /privacy 第 06B 節的
              緊急聯絡人條款)
            </li>
          </ul>
        </section>

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            這是規矩 · 不是行銷話術。
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight mb-4">
            9 條說到做到 · 沒有模糊空間 · 沒有小字。
          </h3>
          {/* Round 51 W-C · Agent 3 HIGH #6 fix · /ethics 缺 conversion
              CTA at page end · 讀完 9 commitments 訪客是 strongest possible
              warm-up state · trust loop must close to BLACK CARD entry ·
              不 dump 到 navigation 即跑路。 加 explicit BLACK chip · 同 trust
              artifacts 並列 surface · 訪客可 1-tap action。 GOLD(founder)
              付費層已收掉 · 只剩 BLACK 一層。 */}
          <p className="text-mute text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            這 9 條 commitment 改變了您的判斷嗎? 加入 ZONE 27 ·
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              href="/membership/black-card"
              className="inline-block px-6 py-3 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              → BLACK · NT$ 500/31 天
            </Link>
          </div>
          <p
            className="font-mono text-mute/85 text-[10px] tracking-[0.35em] mb-6"
          >
            或繼續深入了解 ·
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/audit"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /audit
            </Link>
            <Link
              href="/coverage"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /coverage 我們不碰的清單
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
