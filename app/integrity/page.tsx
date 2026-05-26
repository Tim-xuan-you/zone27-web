import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReadingProgress from "@/components/ReadingProgress";

export const metadata: Metadata = {
  title: "Integrity · 22 永久不會變的 · Owner's Manual at Year 0",
  description:
    "Berkshire Hathaway 1996 Owner's Manual Buffett published and never changed · applied to ZONE 27 at Year 0 · single canonical proof page · 13 brand-IP redlines「永遠不做」 + 9 binding ethics commitments = 22 永久 binding rules · dated · Tim signature · per /audit S05 PRE-COMMIT clause · violations trigger /receipts entry · public bond not implicit · R80 加 scope + discipline 配對 binding(rule 12 CPBL-only-forever + rule 09 mandatory-ledger-no-cherry-pick)· R81 加 rule 13 永遠不 subscription auto-renewal binding(ECPay/TapPay/Stripe 自動扣款 全 refused · Defector 85% explicit renewal + Pinboard 一次性 pattern · Loss aversion FOR ZONE 27 axiom)· 為 years 2-5 brand consistency 物理 codify。",
  openGraph: {
    title: "Integrity · ZONE 27 永久不會變的 22 條",
    description:
      "Berkshire 1996 Owner's Manual pattern · 13 redlines + 9 ethics = 22 永久 binding · scope + discipline + renewal 三軸 close brand IP loop · public bond not implicit",
    type: "article",
    url: "/integrity",
  },
  twitter: {
    card: "summary_large_image",
    title: "Integrity · ZONE 27 永久不會變的 22 條",
    description:
      "Berkshire 1996 Owner's Manual pattern · 13 redlines + 9 ethics = 22 永久 binding · scope + discipline + renewal 三軸 close brand IP loop · public bond not implicit",
  },
  alternates: {
    canonical: "/integrity",
  },
};

// /integrity · Berkshire 1996 Owner's Manual pattern · 22 永久 binding rules
// (13 redlines + 9 ethics)· public bond not implicit · 修改 needs 30-day
// /changelog notice per /audit S05 PRE-COMMIT clause。

export const revalidate = 86400; // daily revalidate

const SIGNED_AT = "2026-05-23";

// 13 brand-IP redlines · single-source canonical · same axis as /transparency § 02。
const REDLINES: ReadonlyArray<{ no: string; rule: string; basis: string }> = [
  {
    no: "01",
    rule: "不 ship user-to-user social platform",
    basis: "no community / no forum / no DM / no chat · brand IP「epistemic mirror not engagement loop」 axiom · per /membership 倒置 SaaS pattern",
  },
  {
    no: "02",
    rule: "不 ship streak / daily-login farming / Days Followed badge",
    basis: "engagement-for-engagement redline · per Tetlock R53 7-tier discipline badge IS the brand-pure substitute · per Duolingo / Snapchat / Robinhood anti-pattern",
  },
  {
    no: "03",
    rule: "不 ship 儲值 wallet / in-app currency",
    basis: "no virtual currency · no points-economy · no in-app credit · per Taiwan 多層次傳銷法 § 29 implicit risk · 不 build pseudo-finance layer",
  },
  {
    no: "04",
    rule: "不 ship cash referral / 多層次傳銷法 § 29 affiliate",
    basis: "no referral codes · no commission · no UTM · no referral bonus · 11-NEVER #4 strictest redline · per Taiwan legal compliance",
  },
  {
    no: "05",
    rule: "不 ship「X of 270 sold」 live FOMO counter",
    basis: "ledger 是 weekly 手寫 不是 live · 0 live count · 0 countdown · per Booking.com / Stripe Atlas applicants ticker anti-pattern · 同 Pinboard ratchet 不適用 axiom",
  },
  {
    no: "06",
    rule: "不 寄生 gambling 平台",
    basis: "0 scrape 玩運彩 / 報馬仔 / 投顧老師 · 0 affiliate / commission · ZONE 27 displacement target NOT enable · per /audit Section 02 displacement axiom",
  },
  {
    no: "07",
    rule: "不 接 AdMob 廣告營收",
    basis: "AdMob 永久封殺 · 0 ads · 0 sponsored content · per /privacy + /audit DISCLOSURE block 「ADS 0」 axiom · /ethics commitment #2 binding",
  },
  {
    no: "08",
    rule: "不 multi-step onboarding wizard",
    basis: "1 個動作 / 1 個 email · 不 multi-screen sign-up · 不 progressive disclosure form · per Stratechery 「1 form 1 button」 + DHH HEY single-action axiom",
  },
  {
    no: "09",
    rule: "不 modal paywall scroll-lock",
    basis: "0 modal · 0 scroll-lock · 0「subscribe to read more」 overlay · per /audit S05 PRE-COMMIT clause + Medium subscribe modal anti-pattern · /transparency NO_PUSH_MANIFEST #10",
  },
  {
    no: "10",
    rule: "不 ship「管它準不準包裝」 fake methodology",
    basis: "engine v0.2/v0.3/v0.4 全 publish · 不藏 estimate · 不藏 DIVERGED · 不藏 sample debt N<30 · per /audit S05 + /methodology Section 04 binding · brand IP soul redline",
  },
  {
    no: "11",
    rule: "不 ship fake testimonials / 偽造 social proof",
    basis: "等真實 Founders Q3+ onboard 後才 publish letter · 0 ghostwritten quote · 0 mock social proof · 0「join 1000+」 inflation · per FoundingMemberLedger R72 W-C + /founders/from-one-current-founder R69 W-B empty scaffold pattern",
  },
  {
    no: "12",
    rule: "不 ship engine prediction outside CPBL · MLB / NPB / KBO / 任何外國職棒 / 任何台灣運彩 bettable events 全部 refuse",
    basis: "solo founder CPBL niche dominance = costly signal 100× per Spence 1973 · MLB me-too = noise · 對標玩運彩 + 報馬仔 displacement mission = CPBL sharpness NOT reach · 同 Patek 不做 Apple Watch / Defector 不做 ESPN / Cegłowski Pinboard 不做 Facebook pattern · /matches/mlb 保留為純 viewer 工具(MLB Stats API 即時資料 + 排程 only · 0 engine prediction surface)· /lab + /lab/custom 是 user-driven Monte Carlo simulator · 不算 engine pre-commit · /track-record 永久 CPBL only · R80 加入 per Tim's R80 explicit signature(覆蓋過去 R-era 假設 implicit binding · 現在 explicit binding)",
  },
  {
    no: "13",
    rule: "不 ship subscription auto-renewal · 永遠 · ECPay / TapPay / 綠界定期定額 / Stripe / 藍新 / 任何 payment gateway 自動扣款 全 refused",
    basis: "訪客每次 commit 必須 explicit click + manual transfer · auto-renewal = 「忘記取消 → 持續扣款」 implicit dark pattern · 同 Duolingo / Snapchat / Robinhood anti-pattern · per Loss aversion FOR ZONE 27 axiom(Kahneman/Tversky 1979 倒置:auto-renewal 利用 loss aversion AGAINST visitor · explicit renewal 利用 loss aversion FOR ZONE 27 · 每 season visitor 主動「我還在乎」 重新 commit · costly signal 100×)· 業界數據 · 月費 auto-renew industry churn 30-40% within 12 months · explicit annual renewal 70-85% retention(Defector 公開 Year-5 報告 85% renew · Pinboard $25 一次性 17 年 100% lifetime)· 同 倒置 SaaS axiom([[zone27-monetization-philosophy]])scarce-handmade tier discipline · BLACK CARD pivots from NT$ 299/月 auto → NT$ 1,500/season explicit one-time per CPBL season(March-November)· R81 加入 per Tim's R81 explicit signature 後綠界沒定期定額 = brand opportunity NOT 限制 · 違反 = brand dark-pattern collapse 永久 audit trail",
  },
];

// 9 binding ethics commitments · single-source canonical · same axis as /ethics 9 commitments。
const ETHICS_COMMITMENTS: ReadonlyArray<{
  no: string;
  rule: string;
  basis: string;
}> = [
  {
    no: "01",
    rule: "0 betting affiliate / 不分潤博彩平台",
    basis: "0 sportsbook commission · 0 affiliate revenue · per /ethics commitment #1 binding · 違反 = brand 信用 collapse 永久 audit trail",
  },
  {
    no: "02",
    rule: "0 ads · AdMob 永久封殺",
    basis: "no Google AdSense · no AdMob · no Meta ads · no display banner · per /ethics commitment #2 + /privacy + /audit DISCLOSURE「ADS 0」 axis",
  },
  {
    no: "03",
    rule: "0 user tracking · GA / Pixel / Hotjar 永遠 0",
    basis: "0 Google Analytics · 0 Facebook Pixel · 0 Hotjar · 0 Plausible · 0 tracking pixel · per /privacy 0-tracker promise + /audit S06 LocalStorage Transparency 11-key inventory binding",
  },
  {
    no: "04",
    rule: "0 fake testimonials · 公開 founders 全名清單(Q3+ onboard 後)",
    basis: "等真實 Founder 6 個月後 publish letter · 0 mock testimonial · /founders/from-one-current-founder R69 W-B empty scaffold pattern · per /audit S05 PRE-COMMIT",
  },
  {
    no: "05",
    rule: "0 DIVERGED 隱藏 · 賽後 receipt 等大列出 · 7 天 ingest SLA",
    basis: "PROVED + DIVERGED same visual weight · 不藏 miss · per /track-record + /audit Section 03 + /steelman pattern · CPBL pipeline ingest deadline",
  },
  {
    no: "06",
    rule: "0 silently model rotation · Lens Lifetime Pledge · 每 ship 過的 engine 永久 viewable",
    basis: "engine v0.2 永久 viewable · v0.3 EXPANSION 永久 viewable · 不 rotate · 不 deprecate · per /methodology Section 04 + Lens Lifetime Pledge canonical",
  },
  {
    no: "07",
    rule: "0「明牌」 framing · prediction = probability 不是 picks",
    basis: "不販售「鐵口直斷」 · 不顯示賠率 · 純機率分布 + Brier score · per /audit + /manifesto + /coverage NEVER list + 11-NEVER #10 fake methodology binding",
  },
  {
    no: "08",
    rule: "0 fine print · 任何 rule modification 30 天前 /changelog 公告",
    basis: "/audit S05 PRE-COMMIT clause · 修改任一 rule 需 30 天前 /changelog 公告 · 此 page integrity 同 binding · 違反 = brand 信用 collapse",
  },
  {
    no: "09",
    rule: "0 cherry-pick · 每筆 CPBL engine prediction → mandatory /track-record entry + /receipts/[receiptId] permalink · 0 retroactive delete",
    basis: "顯示 prediction 後 visitor endowment(Kahneman/Knetsch/Thaler 1990)在「我會看到結果」 上 · selective publishing = trust 物理崩 · PROVED + DIVERGED + PUSH 等大 visual weight 不藏 miss · 同 Berkshire 70-year annual letter「無論好年壞年 都 mandatory publish」 + Geneva Seal「每只 watch 都印 serial」 pattern · per /audit S05 PRE-COMMIT clause 升級到 /integrity binding rule layer · 即使 engine 100% 錯也 binding publish · R80 加入 per Tim's R80 explicit signature · 配對 redline #12(scope) = 完整 scope + discipline closure",
  },
];

export default function IntegrityPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            INTEGRITY · OWNER&apos;S MANUAL AT YEAR 0 · BERKSHIRE 1996 PATTERN
          </p>
          <h1
            className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            22 件 ZONE 27 永久{" "}
            <span className="text-gold">不會變</span>{" "}
            的事
          </h1>
          {/* Cold Gold Hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[280px] mb-6" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs tracking-[0.3em] tabular mb-6"
          >
            SIGNED · TIM · {SIGNED_AT} · APPEND-ONLY · 30-DAY /CHANGELOG NOTICE TO MODIFY
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4 zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            Berkshire Hathaway 1996 「Owner&rsquo;s Manual」 · Warren
            Buffett 寫了一頁列「Berkshire will and will NOT do」 · 30+ 年
            從未改過 · 公開 binding 不是 implicit assumption。 ZONE 27 採同
            axis at Year 0:13 brand-IP「永遠不做」 redlines + 9 binding
            ethics commitments = 22 件永久不會變的事。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            為什麼結構性重要:當未來 fan 懷疑 ZONE 27 會不會「graduate into」
            GA / analytics / 社群帳號 / paid-engine after launch · 整個
            Pratfall + Costly Signaling brand 會 collapse。 此 page 是
            years 2-5 brand consistency 的 missing organ · 不只 launch
            week 用。
          </p>
          <div className="mt-5">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · 13 永遠不做 redlines ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §01 · 13 BRAND-IP REDLINES · 永遠不做
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            這 13 件「永遠不做」 是 ZONE 27 displacement-mission against 玩運彩
            + 報馬仔 + LINE 老師生態 的 binding signal。 違反任一 = brand
            自殺 · 修改需 30 天前 /changelog 公告。
          </p>
          <ol className="space-y-4 mt-4">
            {REDLINES.map((item) => (
              <RuleEntry key={item.no} no={item.no} rule={item.rule} basis={item.basis} negative />
            ))}
          </ol>
        </section>

        {/* ── §02 · 9 binding ethics ────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §02 · 9 BINDING ETHICS COMMITMENTS · 永遠會做
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            這 9 件 ethics commitments 是 ZONE 27 brand IP「方法公開」 8 字
            grammar 物理 codify · canonical single-source 同步 /ethics + /audit
            Section 04。 違反 = Tim 親手 在 /ethics 紅字標永久 audit trail ·
            不可 retroactively rebrand。
          </p>
          <ol className="space-y-4 mt-4">
            {ETHICS_COMMITMENTS.map((item) => (
              <RuleEntry key={item.no} no={item.no} rule={item.rule} basis={item.basis} />
            ))}
          </ol>
        </section>

        {/* ── §02B · EDITORIAL-COMMERCE WALL ─────────────
            R156 W3.D2 · Wirecutter editorial-commerce wall covenant ·
            per Agent D R156 research · NYT Wirecutter 2026 redesign
            transparency wall pattern transplanted · solo-founder paradox
            registered as binding covenant since no org-chart structural wall
            possible · per [[zone27-disclosure-philosophy]] + [[zone27-
            monetization-philosophy]] + [[feedback-zone27-pratfall-brand-ip]]
            三 axiom 同時 fire · brand IP minimum-violation form。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §02B · EDITORIAL-COMMERCE WALL · ENGINE 與 IDENTITY
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            引擎 FREE forever · 識別 tier PAID · 兩條線之間有一道<span className="text-gold">牆</span>
          </h2>

          <div className="space-y-5 text-mute leading-relaxed zh-body">
            <p>
              Wirecutter(NYT 旗下評測站)2026 年 3 月 redesign 公開
              transparency wall:「editorial picks based solely on quality ·
              commerce team handles affiliate links AFTER picks made · 兩邊
              不互通」。 ZONE 27 採同 axis · 但因 solo founder · 無 org chart
              可以結構性隔離 · 必須以<strong className="text-bone">登記 covenant 形式</strong>
              替代 · 不假裝有 wall 而是公開 wall 怎麼維持。
            </p>

            <p>
              <strong className="text-bone">這道牆的具體形狀:</strong>
              ZONE 27 引擎 output(K/9 · BB/9 · HR/9 推 Monte Carlo · 7-LENS
              CANVAS · /audit S02 全部 estimation disclosure)對<strong className="text-bone">
              FREE tier 訪客 = BLACK CARD 訂閱者 = Founders 27 永久會員</strong>
              · 物理上同一份 lib/simulator.ts 跑出來。 paid tier 買的是 IDENTITY
              + 創作者抽成 + Founders 27 LINE 群 · 不買 engine accuracy
              升級 · 不買 secret edge · 不買 paywall predictions。
            </p>

            <p>
              <strong className="text-bone">Boundary case ZONE 27 已 pre-commit:</strong>
              若 sportsbook / 玩運彩 / 報馬仔 / LINE 老師生態 / 任何 betting
              platform 主動 contact 提出 NT$ X K 買 engine API · whitelabel
              · co-branded launch · affiliate program · sponsored content · 任何
              形式 commerce relationship · Tim 將: (1) 公開 disavow on /audit ·
              (2) email decline 不洽談 · (3) 收 PII 不 leak · 不 negotiation 不
              counter-offer。 Wirecutter 對應 boundary 是「best retailer 沒有
              affiliate program · 仍 send readers 去 · 自己賺 NT$ 0」 · ZONE 27
              對應 boundary 是「sportsbook fork 我們 MIT-licensed engine · 我們
              /audit 公開 fork 事實 + disavow + 收 NT$ 0」(per /ethics §02B MIT
              LICENSE LIMIT 已 codify)。
            </p>
          </div>

          <div className="mt-8 border border-gold/30 bg-slate/30 p-5 sm:p-7">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
            >
              ⚓ 3 BINDING COVENANTS · APPEND-ONLY · 30-DAY /CHANGELOG NOTICE
            </p>
            <ol className="space-y-4 mt-4">
              <li className="border-l-2 border-gold/40 pl-4 py-2">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span
                    lang="en"
                    className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                  >
                    ✓ W-01
                  </span>
                  <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                    <strong>引擎 output 對所有 tier 物理相同 · 0 paywall on prediction</strong>
                  </p>
                </div>
                <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                  FREE tier 訪客看到的 win probability = BLACK CARD 訂閱者 = Founders 27 永久會員
                  · 同一份 lib/simulator.ts 同一份 lib/matches.ts 跑出來 · 任何時刻 fork repo
                  可驗證 · 違反 = Tim 親手 在 /ethics 紅字標永久 audit trail
                </p>
              </li>
              <li className="border-l-2 border-gold/40 pl-4 py-2">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span
                    lang="en"
                    className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                  >
                    ✓ W-02
                  </span>
                  <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                    <strong>0 sportsbook revenue 永久 · 任何 betting 生態 commerce relationship 全 decline</strong>
                  </p>
                </div>
                <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                  玩運彩 / 報馬仔 / sportsbook / LINE 老師 / betting platform / affiliate
                  / sponsored content / API license / whitelabel / 任何形式 incentive 全
                  decline · 不 counter-offer 不 negotiation · email refuse 收 PII 不 leak ·
                  違反 = brand 信用永久 collapse · /ethics 紅字
                </p>
              </li>
              <li className="border-l-2 border-gold/40 pl-4 py-2">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span
                    lang="en"
                    className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular"
                  >
                    ✓ W-03
                  </span>
                  <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                    <strong>identity tier 不 unlock engine accuracy · 不 unlock secret edge · paid tier = SUPPORT/IDENTITY 不 features</strong>
                  </p>
                </div>
                <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                  per [[feedback-zone27-paid-model-is-support-not-features]] · BLACK CARD
                  unlocks(per /membership/black-card R141 W1 公開 1 LIVE · 2 PARTIAL · 3
                  PROMISE)全是 IDENTITY 層(LINE 群 + Tim 工程筆記 full + voting + 創作者
                  抽成 + Founders 27 LINE 群)· 0 unlock = engine more accurate · 違反 =
                  brand IP iron rule 直接 collapse
                </p>
              </li>
            </ol>
          </div>

          <p className="mt-6 text-mute/85 text-sm leading-relaxed zh-body">
            <strong className="text-bone">為什麼這道牆必須 explicit codify:</strong>
            solo founder 結構不能依靠 org chart 隔離 · 必須以 public covenant
            形式維持 · 同 Costco 14% 毛利上限 · Patek Generations 200-yr Reference
            permanence · Berkshire 1996 Owner&rsquo;s Manual · Defector worker-owned
            launch commitment · 全採同 axis:public bond not implicit assumption。
            ZONE 27 在 Year 0 採同 axis · 不裝 30+ yrs earned · publish commitments
            before earning · per /year-zero R77 W-C「我們 publish commitments not
            results」 axiom · 此 wall 同 axis。
          </p>

          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ Source · Wirecutter 2026-03-03 redesign editorial-commerce
            transparency wall · Tim 親手 transplant pattern to ZONE 27 ·
            solo-founder physical limit converted to public covenant
          </p>
        </section>

        {/* ── §03 · BERKSHIRE 1996 PATTERN explanation ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §03 · BERKSHIRE 1996 PATTERN
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4 zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            Warren Buffett 1996 年寫了一頁「Owner&rsquo;s Manual」 · 列出
            Berkshire Hathaway will and will NOT do。 30+ 年從未改過。 沒有
            「we COULD change if necessary」 weasel · 沒有「subject to
            change」 footer · 沒有「except in cases of...」 conditional。
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4 zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            其他 commitment 模式(Costco 14% 毛利上限自綁 · Patek 200-yr
            Reference permanence · Defector worker-owned launch
            commitment)都採同 axis:public bond not implicit assumption。
            讀者 read 完後 audit-able · 違反 = brand 自殺。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed zh-body"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            ZONE 27 在 Year 0 採同 axis · 但 honestly 不裝 30+ yrs earned。
            Buffett earned 1996 公信力 from 1965 起算 31 yrs Berkshire
            shareholder letter cadence · ZONE 27 從 2026-05-21 launch ·
            目前 N=4 PROVED · 0 paying customer · 整 brand 是「commitments
            published before earning」 per /year-zero R77 W-C「我們 publish
            commitments not results」 axiom · 此 page 同 axis。
          </p>
        </section>

        {/* ── §04 · PRE-COMMIT MECHANISM ─────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §04 · PRE-COMMIT MECHANISM · 修改 protocol
          </p>
          <p className="text-mute text-sm leading-relaxed mb-3">
            如果 ZONE 27 future 需要修改任一條 22 binding rule · 唯一允許
            mechanism 是:
          </p>
          <ol className="space-y-2.5 text-mute text-sm leading-relaxed ml-4">
            <li>
              <strong className="text-bone">1.</strong> Tim 親手寫 /changelog
              entry · 註明 modify which rule · 為什麼 · 30 天 notice period
              開始 dated。
            </li>
            <li>
              <strong className="text-bone">2.</strong> 30 天內 fan 可以
              read /changelog entry · 公開反對 via GitHub Issue OR email
              tatayngiti@gmail.com · Tim 親手 reply 解釋 reasoning。
            </li>
            <li>
              <strong className="text-bone">3.</strong> 30 天後 IF Tim 仍
              堅持 modify · /integrity page entry 更新 · 並 append /changelog
              second entry「modified, effective YYYY-MM-DD」。
            </li>
            <li>
              <strong className="text-bone">4.</strong> 違反 protocol(silently
              modify · skip 30-day notice · backdate)= brand 信用 collapse
              永久 audit trail · per /ethics commitment #8。
            </li>
            <li>
              <strong className="text-bone">5.</strong> 加 NEW binding rule
              同 protocol · Tim 親手 signature 一句即決 · /changelog entry
              「added, effective YYYY-MM-DD」· 「擴」 protocol 跟「改」
              protocol 同 axis · 不藏 hidden expansion。
            </li>
          </ol>
          <p className="text-mute/85 text-sm leading-relaxed mt-5">
            此 protocol IS the bond。 Buffett never used Berkshire 1996
            modify mechanism(no rules changed since 1996)· Tim 採同
            discipline at Year 0 · per Pratfall「不藏 modify path · 但
            commit to never use it」 axis。
          </p>
        </section>

        <FounderSignOff signedAt={SIGNED_AT}>
          <p>
            這 22 件不是 marketing copy · 不是 sales pitch · 不是 commitment
            theater · 是 Tim 親手在 {SIGNED_AT} 公開簽名的 binding bond。
            Berkshire 1996 Owner&rsquo;s Manual 30+ 年從未改過 · ZONE 27 採
            同 axis from Year 0。
          </p>
          <p>
            如果未來您看到 ZONE 27 違反任一條 22 binding rule · 您 right to
            challenge · email tatayngiti@gmail.com 直接質問 Tim · 或開
            GitHub Issue 公開 audit trail · 或在 /faq 留言記錄。 brand IP
            「方法公開 · 品味私藏」 8 字 grammar 物理 codify 到 commitment
            bond 層 · 沒有 hidden flexibility。
          </p>
          <p>
            修改任一 rule per /audit S05 PRE-COMMIT clause 30-day /changelog
            notice mechanism。 違反 protocol = brand 信用 collapse · 您
            擁有 永久 audit trail right · 公開 right to challenge。
          </p>
        </FounderSignOff>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/transparency"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /transparency · audit aggregator
            </Link>
            <Link
              href="/ethics"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /ethics · 9 commitments source →
            </Link>
            <Link
              href="/transparency#section-02"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /transparency § 02 · 13 NEVER source →
            </Link>
            <Link
              href="/changelog"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /changelog · modify protocol →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── RuleEntry · negative or positive variant ──
function RuleEntry({
  no,
  rule,
  basis,
  negative = false,
}: {
  no: string;
  rule: string;
  basis: string;
  negative?: boolean;
}) {
  const colorClass = negative ? "text-loss/85" : "text-gold/85";
  const borderClass = negative ? "border-loss/40" : "border-gold/40";

  return (
    <li className={`border-l-2 ${borderClass} pl-4 py-2`}>
      <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
        <span
          lang="en"
          className={`font-mono ${colorClass} text-[10px] tracking-[0.3em] tabular`}
        >
          {negative ? "✕" : "✓"} {no}
        </span>
        <p className="text-bone text-sm sm:text-base leading-snug flex-1">
          <strong>{rule}</strong>
        </p>
      </div>
      <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
        {basis}
      </p>
    </li>
  );
}
