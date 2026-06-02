import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";

export const metadata: Metadata = {
  title: "反 ZONE 27 最強論證",
  description:
    "ZONE 27 自己寫出反對我們最強的 6 個論點 · 自己當反方 · 把你最可能拿來質疑我們的話先講出來。靠賣明牌的生意,結構上不會公開反對自己的論證,因為他們的每一條質疑都同時是他們的訃聞。",
};

// ── ZONE 27 · /steelman ─────────────────────────────────
// Round 42 W-A · Agent H #3 ship · per [[feedback-no-waiting-rule]] 鐵律。
// R108 W7 · Tim raised 6th objection via Quark App x NBA China LLM「AI 看球」
//   2026-05 launch · triggered binding rule「6th objection 提出 必須 publish」 ·
//   /steelman 從 5 → 6 OBJECTIONS · dual-track「engine integrity + web polish
//   2026-grade」 concession 生成 + Year 1 web baseline binding 加入 PRE-COMMIT。
//
// 6 strongest arguments against ZONE 27 · ZONE 27 自己寫 · steelman tier
// (不 strawman · 不 weakman)· 寫完 NOT 反駁 to win argument · 寫完 respond
// honest assessment + Pratfall acknowledgment + concrete commitment when
// applicable。
//
// Adversarial collaboration pattern transplant(PLOS · arXiv adversarial-
// collab protocol · Tetlock superforecaster discipline)· 倒置「自己當
// 反方」 · brand IP 物理層 maximum Pratfall(Aronson 1966 + Spence 1973):
// - reader 看到我們先 publish strongest objection 等於 disarm 99% 抗辯
// - 同時 prove brand 不 fragile to scrutiny · 真實 truth-seeking discipline
// - 玩運彩+報馬仔 結構性 not publish 同樣 page · 因為他們的 steelman
//   同時是他們的 obituary(每個 objection 都 lethal · 商業自殺)
//
// Brand IP 物理 codify:
//   - Pratfall · 極限版 · 主動 publish 反方 strongest argument
//   - Costly Signaling · steelman 寫得越好 反方 看了越覺「他們 know
//     this」 trust signal · 寫差 反方 看了覺「strawman」 反信號
//   - Disclosure Philosophy · 延伸 /audit S05 到 epistemic layer
//   - 倒置 SaaS · 「自己當批評者」 vs SaaS「自己當銷售」 倒置
//
// Routing: /steelman · public · 38th visitor-discoverable route。
// ─────────────────────────────────────────────────────

const STEELMAN_OBJECTIONS: {
  num: string;
  title: string;
  objection: string;
  response: string;
  concession: string;
}[] = [
  {
    num: "01",
    title: "只有 12 隊的中職 · 資料量根本撐不起這麼複雜的模型",
    objection:
      "中職只有 12 隊 · 每隊一年最多約 120 場常規賽 · 整個聯盟一年大約 720 場 · 樣本量遠遠小於美國職棒(2,430 場)或日本職棒(858 場)。 用這麼少的資料去跑那種複雜的綜合模型 · 只會「過度配適」 · 也就是把雜訊當成規律 · 結果反而更不準。 就算 ZONE 27 把這種模型做出來 · 資料量本質上就撐不住。 不懂統計的人看不出來 · 懂的人一眼看穿。",
    response:
      "這個質疑是對的。 v0.4 上線前 ZONE 27 承諾:(1) v0.4 釋出說明必須明寫「CPBL 一季樣本只有約 720 場 · v0.4 跟 v0.3 的準度差距要通過統計顯著性檢定 · 否則 v0.4 標記為 INCONCLUSIVE 不上線」 ·(2) v0.4 在新舊引擎間的加權方式公開 · 不假裝資料量比實際多 ·(3) 完整的驗證結果在 v0.4 上線前先發布在 /methodology。",
    concession:
      "如果一年 720 場不夠支撐這種模型 · ZONE 27 就應該多等 2-3 季、累積足夠樣本再上線 · 不該為了講「準度一直在進步」這個故事而硬把新版推出去。 這個質疑是合理的限制 · 不是抹黑。",
  },
  {
    num: "02",
    title: "桃園、新莊、大巨蛋、澄清湖的場地係數 · 樣本太少全是雜訊",
    objection:
      "ZONE 27 那 4 個場館的場地係數標明是「推估」 · 沒有引用真正的場地數據來源。 中職一年每個場館大約只辦 60 場 · ZONE 27 是用「場地尺寸 + 海拔 + 公開觀察」推估 · 不是讀真實的場地數據。 新版引擎拿這個推估值去微調全壘打率 · 等於「小雜訊 × 小幅度 × 少資料」 · 結果根本就是雜訊。 場次累積到 30 場之前 · 新版跟舊版的差距永遠看不出來。",
    response:
      "完全同意。 這個質疑我們寫成承諾:(1) /audit 已經白紙黑字承認這些是「推估、由可觀察的因素推導」 · 不是真實場地數據 ·(2) /track-record 和 /calibration 會把新舊版的紀錄分開記 · 每版累積到 30 場後公開對照 ·(3) 若新版準度比舊版差 · /methodology 會把新版從「上線中」改標「較差、待汰換」 · 不會偷偷換掉 ·(4) 真正懂中職場地的人(球評、數據分析師、球隊分析師)可以直接提交修正 · 我們立刻換上真實數據。",
    concession:
      "在累積到 30 場之前 · 老實說新版就是「雜訊 + 推估 + 小幅度」的綜合 · 短期內跟舊版的差距預期就是 0 上下、誤差還很大。 我們不假裝新版是進步 · 它是為了讓引擎將來可以擴充而打的地基。",
  },
  {
    num: "03",
    title: "「投手疲勞」鏡頭只是行銷話術 · 不是真的工程",
    objection:
      "投手疲勞鏡頭寫著「用 WHIP + BB9 + K9 整季累計來推算控球穩定度」 · 但「控球穩定度」跟「疲勞」是完全不同的東西。 整季累計的數字反映的是這位投手整季的實力 · 不反映「這位投手距離上次先發是否累了」。 用「疲勞」這個詞就是貼錯標籤 · 就算註明「這不是真正的疲勞」 · 訪客心裡預設仍然是「這個鏡頭在告訴我投手累不累嗎」 · 我們把它上線等於鑽免責聲明的漏洞 · 拿「疲勞」當賣點。",
    response:
      "這個質疑很尖銳 · 接近我們不可踩的底線。 我們已經把這個鏡頭從「投手疲勞」改名為「投球負荷量」 · 名稱跟它實際用到的數據對齊 · 並且在賽事頁、/methodology 和元件標籤都改掉了。 我們把一條規則寫死:任何新鏡頭的對外名稱都必須對得上它實際用到的數據範圍 · 不可以掛「完整角度」的名卻只做了部分。 等到我們真的升級成讀取休息天數和整季用球數、做出真正的疲勞判斷之前 · 這個鏡頭就維持「投球負荷量」的名字 · 不冒充。",
    concession:
      "「疲勞」這個名字是從早期規劃表裡沿用下來的 · 上線時就應該改成對得上實際範圍的名稱 · 我們一度承諾要改卻沒立刻執行 · 後來自己抓到並修正 · 這一頁也同步更新反映這件事。 這個質疑逼我們把用詞紀律做成必要的稽核 · 對品牌是健康的壓力測試。",
  },
  {
    num: "04",
    title: "「方法公開」是基本款 · 不算真正的差異化",
    objection:
      "ZONE 27 通篇講「方法公開」 + GitHub 連結 + 「我們不藏」 · 但很多獨立網站都做開源或公開方法論。 在這個圈子裡「方法公開」是基本款 · 不是真正的護城河。 真正的護城河必須是別人結構上學不來的東西 · ZONE 27 的「方法公開」跟其他公開透明的網站太像了 · 稱不上差異化。",
    response:
      "對一半 · 要分開講。 (1) ZONE 27 要取代的不是那些本來就標榜透明的獨立網站 · 而是靠賣明牌賺錢的對手 · 在台灣棒球這塊 · 「方法公開」對他們來說仍然是學不來的護城河(他們公開等於商業自殺) ·(2) 但對更廣的讀者來說 · 透明確實是基本款 · 所以我們要講清楚「我們真正的護城河是利益不衝突 · 不是透明本身」 ·(3) 透明是必要但不夠的條件 · 真正學不來的是「靠賣明牌的生意結構上做不到的那種透明」 — 公開自我打分、公開承諾、公開抽成帳本。",
    concession:
      "光講「方法公開」確實不夠差異化。 ZONE 27 應該把說法升級成「對手結構上做不到的那種透明」 · 而不是泛泛的開源故事。 這個質疑加速了我們把品牌講清楚。",
  },
  {
    num: "05",
    title: "現在 0 付費、收入 NT$ 0、只結算過 1 場 · 這真的是「品牌力」 · 還是其實還沒做出成績?",
    objection:
      "ZONE 27 通篇公開「0 個 BLACK CARD 付費會員」 · 「年收入 NT$ 0」 · 「只結算過 1 場預測」 · 還把這包裝成「徹底透明」。 但「有實力的人承認自己會犯錯」會贏得好感 · 跟「還沒做出成績的人承認自己還沒做出成績」是兩回事。 ZONE 27 公開這個起步狀態 · 到底是坦誠 · 還是把弱點美化成美德?",
    response:
      "這個質疑很狠 · 但很重要。 我們誠實回答:(1) 「承認犯錯」會加分的前提是你本來就有實力 · 不是「還沒證明就先自誇透明」 ·(2) ZONE 27 現在公開 0 付費 · 唯一說得過去的條件是 — 之後真的要做出付費會員、真的要累積結算過的預測 · 否則這套說法就垮了 ·(3) 因此我們在這裡先把話講死:第一年(2027)至少要有 10 個 BLACK CARD 付費會員、30 場結算過的預測、3 位真實認領的 Founders 27。 若第一年沒達標 · /annual/2027 必須明寫「我們行銷透明 · 但沒做出真正的成績」 · 不能藏 ·(4) /annual/2026 的年度報告也要先公開這組第一年標準。",
    concession:
      "起步階段的徹底透明 · 唯一成立的前提是之後真的做起來 · 否則就只是「公開承認自己在用一套輸的策略」。 這個質疑逼我們必須公開具體的 2027 成功門檻 · 不能無限期停在起步狀態。 質疑成立 · 我們給出具體承諾。",
  },
  // R108 W7 · NEW Objection 06 · Quark App x NBA China 2026-05 「AI 看球」 launch
  // triggered binding rule「reader / agent / skeptic 提出 6th objection 必須
  // publish 不可 dismiss」 · per 此 page META section binding · Tim raised the
  // LLM / 多模態 sports companion 對立面 critique · steelman tier 寫成 + 4-layer
  // honest response + dual-track「engine integrity + web polish 2026-grade」
  // concession 物理 codify。
  {
    num: "06",
    title: "為什麼不做像「AI 看球」那種對話式體驗?",
    objection:
      "現在很多 app 推出「AI 看球」 — 賽前賽後 AI 簡報 + 聊天機器人隨問隨答 + 相機認球員 + AI 生成球場圖片 · 還整合即時賠率預測勝負 · 全部塞在一個手機 app 裡。 這是現在流行的看球玩法 · 用自然語言聊、邊看邊問、不卡頓。 ZONE 27 只做一個靜態網站 · 7 個固定鏡頭 · 沒有聊天機器人、沒有自然語言問答、沒有相機、沒有圖片生成、沒有手機 app、沒有賠率整合。 在大家都搶注意力、又是手機優先的年代 · ZONE 27 看起來像個十年前的網站。 「方法公開」這個賣點 · 對比「用 AI 包成自然對話」 · 多數球迷會選後者。 五年內 AI 看球助手變成標配 · ZONE 27 會像個學術展品 · 不像個活著的產品。",
    response:
      "這個質疑很尖銳 · 我們分 4 層誠實回答。 (1) 引擎的可信度不能妥協:AI 聊天機器人會「一本正經地胡說」 · 拿來預測球賽 · 訪客永遠不知道答案怎麼來的。 你問它「分析今天 A 隊對 B 隊」 · 它回的「勝率」是語言模型臨時生成的 · 同一個問題問兩次可能給你兩個答案。 ZONE 27 每場是固定快照 · 每次結果一樣 · 連到底是哪一版程式跑出來的都查得到。 用聊天機器人 · 我們就做不出「可以重現的預測」 · 這違反我們最核心的原則。 (2) 賠率整合永遠拒絕:那類 app 主打「結合即時賠率預測勝負」 — 一旦在畫面上放賠率(就算不抽成) · 就變成賭博周邊的體驗 · 違反我們白紙黑字的承諾(不把數據賣給博彩、不跟賭博平台整合)。 這條我們結構上就不做。 (3) 那些花俏功能是在養黏著度 · 不是在幫你判斷:AI 生成球場大圖 + 相機認球員 + 聊天側欄 · 都是讓你多停留 · 不是讓你預測得更準。 ZONE 27 要取代的是賣明牌這種賣希望的東西 · 不是陪你看球的娛樂 app。 兩種根本是不同的東西 — 我們真正的用戶是賽前認真讀準度報告、看歷史戰績後拿來練預測的人 · 不是邊看球邊問 AI 球員薪水的娛樂用戶。 (4) 但「看起來像十年前」這點要認:ZONE 27 的網站必須持續吸收現代網頁技術 · 不能拿「我們紀律強」當不更新技術的藉口。 引擎的可信度不變、網站質感持續跟上時代 · 這兩件事我們同時做 · 互不衝突。",
    concession:
      "ZONE 27 不做聊天機器人、不做手機 app、不整合賠率 — 這是我們刻意的取捨 · 不是做不到 · 跟我們那串「永遠不做」的清單一致。 但「網站看起來像十年前」這個質疑很準 · 逼我們把話講死:第一年(2027-05-31)前 · 網站必須(a)做到至少 8 項現代網頁技術的基本盤 ·(b)至少加一個現代互動效果 ·(c)維持頁面載入速度與穩定度全綠。 若沒做到 · /annual/2027 必須明寫「ZONE 27 內容紮實 · 但網站技術落後」 · 不能藏。 引擎與質感兩條腿都要顧 · 不能顧一邊丟一邊。",
  },
];

export default function SteelmanPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / STEELMAN · 反 ZONE 27 最強論證
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-loss/60 text-loss/85"
            >
              6 OBJECTIONS · 自己當反方
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            6 個我們<span className="text-loss">最怕</span>的論證 ·
            <br className="hidden sm:inline" />我們自己 <span className="text-gold">先寫</span>
          </h1>

          <div className="mt-8 border-l-2 border-loss/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              <strong>多數網站寫 FAQ 是預先反駁訪客可能的反對</strong> ·
              ZONE 27 反過來:這頁是反對 ZONE 27 最強的 6 個論點 · 我們自己
              用最強的版本寫出來 · 不是隨便找個軟弱版來打。 其中第 6 條 ·
              回應「為什麼不做 AI 看球那種對話式體驗」。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              寫出來不是為了把對方駁倒 · 而是誠實回應 · 該認的就認。
              靠賣明牌的生意,結構上做不出這樣一頁 · 因為他們最強的反對論點
              · 同時就是他們的訃聞。
            </p>
          </div>

          {/* Round 44 W-C · Agent K DEEPEST canonical sentence · 同 /about
              Prologue · /ethics hero · /annual hero。 */}
          <p className="mt-6 text-bone text-base sm:text-lg leading-relaxed border-l-4 border-gold pl-5 py-2 max-w-2xl">
            <strong>每一個承諾 Tim 簽名 · 可被驗證 · 違反任何一條 = <Link href="/ethics" className="text-gold underline-offset-4 hover:underline">/ethics</Link> 紅字
            永久標 · 不可刪</strong> · 包括這頁 6 條反對論點的回應與承諾 ·
            同樣有效。
          </p>

          <div className="mt-6">
            <ArticleMeta readingMin={8} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── OBJECTIONS ──────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          {STEELMAN_OBJECTIONS.map((obj, idx) => (
            <article
              key={obj.num}
              className={`pb-12 ${
                idx < STEELMAN_OBJECTIONS.length - 1
                  ? "mb-12 border-b border-line/40"
                  : ""
              }`}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  lang="en"
                  className="font-mono text-loss/85 text-[14px] tracking-[0.35em] tabular"
                >
                  ✕ {obj.num}
                </span>
                <span
                  lang="en"
                  className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
                >
                  OBJECTION
                </span>
              </div>
              <h2 className="text-bone text-2xl sm:text-3xl font-light tracking-tight mb-6 leading-tight">
                {obj.title}
              </h2>

              {/* The objection · steelman tier · render in loss-tinted block */}
              <div className="bg-loss/5 border border-loss/30 p-5 sm:p-6 mb-5">
                <p
                  lang="en"
                  className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-3"
                >
                  ⚔ THE STRONGEST FORM OF THIS ARGUMENT
                </p>
                <p className="text-mute leading-relaxed">{obj.objection}</p>
              </div>

              {/* Our response · NOT a rebuttal · honest assessment + commitments */}
              <div className="bg-slate/40 border border-gold/30 p-5 sm:p-6 mb-5">
                <p
                  lang="en"
                  className="font-mono text-gold text-[10px] tracking-[0.3em] mb-3"
                >
                  ↩ OUR HONEST RESPONSE
                </p>
                <p className="text-mute leading-relaxed">{obj.response}</p>
              </div>

              {/* Concession · what we agree IS valid in the objection */}
              <div className="bg-slate/30 border border-line/60 p-5 sm:p-6">
                <p
                  lang="en"
                  className="font-mono text-bone text-[10px] tracking-[0.3em] mb-3"
                >
                  ✓ WHAT WE CONCEDE
                </p>
                <p className="text-mute leading-relaxed">{obj.concession}</p>
              </div>
            </article>
          ))}
        </section>

        {/* ── WHY THIS PAGE EXISTS ─────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 為什麼寫這一頁
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            多數網站自己當銷售 · 我們自己當批評者
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              多數網站的 FAQ 都是「先安撫訪客最常見的疑慮」 · 本質是替自己
              辯護。 ZONE 27 反過來:我們自己把反對我們最強的 6 個論點寫出來 ·
              而且寫成最強的版本。
            </p>
            <p>
              <strong className="text-bone">公開自己最大的弱點 · 本身就是訊號</strong>:
              我們把自己看得比訪客還清楚、還狠。 訪客看到我們先講了 ·
              大半的對立情緒就消了。
            </p>
            <p>
              <strong className="text-bone">為什麼靠賣明牌的站,結構上做不出這頁</strong> ·
              因為他們最強的反對論點每一條都會要命(「你們輸了就刪文」 /
              「你們跟莊家利益綁在一起」 / 「你們真實勝率其實只有五成」 …
              每一條都是商業訃聞)。 ZONE 27 這 6 條是讓我們把品牌做得更好的
              機會 · 不是訃聞 · 這就是結構上的差別。
            </p>
            <p className="font-mono text-mute/80 text-sm tracking-[0.18em] leading-relaxed">
              ⚓ 這頁反對論點的數量只能增不能減 · 任何人提出我們無法反駁的
              新論點 · 我們就必須加上去。 論點的文字若要修改 · 需提前 30 天
              在 /changelog 公告。
            </p>
          </div>
        </section>

        {/* ── 2027 BINDING SUCCESS CRITERIA ───────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 2027 我們先講死的成功門檻
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            從第 5 條反對論點衍生 · ZONE 27 第一年最低標準
          </h2>
          <div className="border border-gold/40 bg-slate/40 p-5 sm:p-7 glow-soft">
            <p className="text-bone mb-4">
              呼應上面第 5 條質疑 · ZONE 27 先把話講死:
            </p>
            <ul className="space-y-3 list-disc pl-6 text-mute leading-relaxed">
              <li>
                到 2027-05-31 · 至少 <strong className="text-bone">10 位</strong>
                BLACK CARD 付費會員
              </li>
              <li>
                到 2027-05-31 · 至少 <strong className="text-bone">30 場</strong>
                結算過的預測(這樣準度統計才有意義)
              </li>
              <li>
                至少 <strong className="text-bone">3 位</strong> 真實訪客認領
                Founders 27(目前 7 個都還是系統測試用的佔位)
              </li>
            </ul>
            <p className="mt-5 font-mono text-mute/80 text-sm tracking-[0.18em] leading-relaxed">
              ⚓ 若第一年(2027-05-31)沒達到上述最低標準 · /annual/2027
              年度報告必須明寫「ZONE 27 行銷透明 · 但沒做出真正的成績」 ·
              不能藏。
            </p>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 最貴的一份信任證明 · 因為公布等於把自己暴露在
            6 個最尖銳的質疑之下 · 然後一條一條誠實認下來。
          </p>
          <p>
            多數網站自己當銷售 · ZONE 27 自己當批評者。 靠賣明牌的生意,
            結構上做不出同樣一頁 · 因為他們最強的反對論點同時就是他們的訃聞。
          </p>
          <p>
            這 6 條反對論點的文字要修改 · 需提前 30 天在 /changelog 公告。
            有人提出我們無法反駁的新論點時 · 必須加上去 · 不可忽略。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/steelman" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            最強的反方 · 不是稻草人。
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight mb-4">
            6 條最強反對 · 6 個誠實認領 · 0 個迴避。
          </h3>
          {/* Round 51 W-C · Agent 3 HIGH #6 fix · /steelman conversion CTA
              at page end · 同 /ethics pattern · 訪客讀完 6 strongest
              objections + Tim 自己 concede = strongest warm-up state ·
              trust loop must close to Founders 27 / BLACK CARD entry。 */}
          <p className="text-mute text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            這 6 條最強反對沒勸退您嗎? 加入 ZONE 27 ·
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link
              href="/founders"
              className="inline-block px-6 py-3 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              → Founders 27 · NT$ 2,700 / 年
            </Link>
            <Link
              href="/membership/black-card"
              className="inline-block px-6 py-3 border border-gold text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → BLACK CARD · NT$ 500/31 天
            </Link>
          </div>
          <p
            lang="en"
            className="font-mono text-mute/85 text-[10px] tracking-[0.35em] mb-6"
          >
            OR DIG DEEPER ·
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/ethics"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /ethics 9 條公開承諾
            </Link>
            <Link
              href="/audit"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /audit 我們為什麼全部公開
            </Link>
            <Link
              href="/calibration"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /calibration 我們自己幫自己打分
            </Link>
            {/* Round 51 W-B · Agent 3 missing cross-link #1 fix · /steelman
                → /annual/2026 不藏 Year 0 honest empty state(0 paid · NT$0
                rev)· Year 0 是 strongest pratfall · 跟 5 strongest objections
                同 pratfall pattern · 應在 FINAL CTA 並列 surface · 不只
                ethics/audit/calibration 三條。 */}
            <Link
              href="/annual/2026"
              className="inline-block px-6 py-3 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
            >
              → /annual/2026 第 0 年誠實空白
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
