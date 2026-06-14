import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "Terms of Service — 我們對您的承諾,您對我們的同意",
  description:
    "ZONE 27 服務條款 · pre-launch 階段的真實情境合約 · 不是模板 · AI 是娛樂用途 · GOLD waitlist 不收費不綁定 · 含台灣 14-day 退款主動延伸(消保法 § 19 distance-selling)。",
  ogTitle: "Terms of Service · 我們對您的承諾 · ZONE 27",
  ogDescription:
    "pre-launch 真實情境合約 · 不是模板 · 含台灣 14-day 退款主動延伸 · 消保法 § 19",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          TERMS OF SERVICE · MAY 2026 · UPDATED 2026-05-20
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          我們的<span className="text-gold">承諾</span>。
          <br />
          您的<span className="text-gold">同意</span>。
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          不是法務模板。是寫給 ZONE 27 pre-launch 真實情境的服務條款。
          能用人話寫就絕不用法律術語。
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── 01 ABOUT ─────────────────────────────── */}
      <Section no="01" label="ABOUT THE SERVICE" zh="關於本服務">
        <p>
          ZONE 27 是一個棒球進階數據與 AI 預測模型的資訊社群平台。
          目前由創辦人 Tim(Tim-xuan-you)以個人名義經營,尚未公司化。
        </p>
        <p>
          本服務不接受下注、不出彩金、不撮合任何形式的對賭。我們是
          「資訊與社群平台」,不是博彩公司。完整定位請見{" "}
          <Link href="/about" className="text-gold underline-offset-4 hover:underline">
            /about
          </Link>
          。
        </p>
      </Section>

      {/* ── 02 ELIGIBILITY ──────────────────────── */}
      <Section no="02" label="ELIGIBILITY" zh="使用資格">
        <p>
          您必須年滿 <strong className="text-bone">18 歲</strong>(中華民國民法成年年齡)才能使用本服務的會員功能。
          純瀏覽性質(讀文章、看 /lab 跑模擬)不受此限。
        </p>
      </Section>

      {/* ── 03 PRE-LAUNCH STATUS ────────────────── */}
      <Section no="03" label="PRE-LAUNCH STATUS" zh="Pre-launch 階段聲明">
        <p>
          本網站目前處於 <strong className="text-bone">stealth mode / pre-launch</strong> 階段。意即:
        </p>
        <ul className="space-y-3">
          <li>▸ 功能、文案、定價、UI 隨時可能調整</li>
          <li>▸ 部分元件標記 <Code>BETA</Code> 是正常狀態</li>
          <li>▸ 我們可能在不通知的情況下進行重大改版</li>
          <li>▸ 所有改動都會提前公開公告</li>
        </ul>
      </Section>

      {/* ── 04 GOLD WAITLIST ─────────────── */}
      <Section no="04" label="GOLD WAITLIST" zh="GOLD 等候名單聲明">
        <p>
          您加入 GOLD waitlist 時,請理解以下事項:
        </p>
        <ul className="space-y-3">
          <li>
            <strong className="text-bone">不收費。</strong>
            目前 waitlist 完全免費,不收取任何形式的款項或押金。
          </li>
          <li>
            <strong className="text-bone">不綁定。</strong>
            您留下 email 不構成任何形式的支付承諾或法律義務。
          </li>
          <li>
            <strong className="text-bone">不保證取得 #號碼。</strong>
            最終 GOLD 會員將以「正式付款完成」順序鎖定。
            waitlist 給予優先通知權,不保證最終取得位置。
          </li>
          <li>
            <strong className="text-bone">可隨時退出。</strong>
            寄信即可從 waitlist 移除,沒有任何違約金或保留期。
            您的 row 從{" "}
            <Code>Supabase</Code> 永久刪除,
            創辦人本機與雲端無任何備份。
          </li>
          <li>
            <strong className="text-bone">通道歸因標籤。</strong>
            若您透過某GOLD 會員的分享連結進入(<Code>?ref=reserve-NNN</Code>),
            該標籤會存進您的 waitlist row(<Code>source</Code> 欄位)。
            這是<strong className="text-bone">通道層的彙總</strong>,不是個人追蹤 —
            完整解釋見{" "}
            <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
              /privacy Section 02
            </Link>
            。
          </li>
        </ul>
      </Section>

      {/* R64 W-A · per Agent 3 R61 Ship #4 + Agent 5 R63 gap matrix · explicit
          REFUND POLICY section per Taiwan 消費者保護法 § 19 distance-selling
          7-day cooling-off rule。 ZONE 27 exceeds minimum at 14 days · 同
          /faq + /founders W-B trust block 已宣告 · 此 Section 4B codify in
          legal-findable location · brand IP「方法公開」 延伸到 refund
          terms · 不藏。 Section labeled 「4B」 to avoid renumbering 05-09
          downstream sections · low-risk inline amplification。 */}
      <Section no="4B" label="REFUND POLICY" zh="退款條款 · Taiwan 消保法 § 19">
        <p>
          中華民國消費者保護法 § 19 規定:消費者透過郵購、網購、訪問交易等
          通訊交易方式所為的商品或服務契約 · 享有自接受商品或服務 <strong className="text-bone">至少
          7 日</strong> 內無條件解除契約的權利。 ZONE 27 主動延伸到 <strong className="text-gold">14
          天</strong> · 翻倍法定下限。
        </p>

        <h3 className="text-bone text-lg mt-6 mb-3">GOLD(NT$ 2,700 / 365 天)</h3>
        <ul className="space-y-2">
          <li>
            <strong className="text-bone">14 天無條件退款</strong> · 從 Tim
            確認您的銀行轉帳入帳 + 您收到 365 天 access confirmation email
            那天起算 · 14 個自然日內可解除契約。
          </li>
          <li>
            <strong className="text-bone">退款流程</strong> ·
            寄信 <Code>tatayngiti@gmail.com</Code> · 主旨 <Code>REFUND · ZONE27-#NNN</Code>
            (NNN 為您的 founder 編號)· Tim 48 hr 內回覆確認 · 同步原匯款
            銀行戶頭退回 NT$ 2,700 全額。
          </li>
          <li>
            <strong className="text-bone">不問原因</strong> · 不嘗試挽留 ·
            不要求填問卷 · 不寄挽留文案 · 我們不裝挽留。
          </li>
          <li>
            <strong className="text-bone">您退款後仍保留</strong> · 已下載的 methodology
            docs · 全部 /audit + /methodology + /track-record 公開 trust artifacts ·
            這些不在退款範圍 · 我們無權收回。
          </li>
          <li>
            <strong className="text-bone">您退款後失去</strong> · #NNN 編號的
            ledger 入帳(/founders/ledger 上的 reserved 標記 release)· 365 天
            access flag · BLACK 免費 perk · BOTTOM 27 ecosystem
            cross-pass(未來 ship)。
          </li>
        </ul>

        <h3 className="text-bone text-lg mt-6 mb-3">BLACK(NT$ 500/31 天)</h3>
        <ul className="space-y-2">
          <li>
            <strong className="text-bone">每期 14 天退款</strong> · 您每 31 天手動
            轉帳當期 NT$ 500 入帳後 · 14 個自然日內可解除該期契約 · 全額
            退回 · 不按比例。
          </li>
          <li>
            <strong className="text-bone">沒有 auto-renew</strong> · 同 brand
            IP「倒置 SaaS · 不自動扣款」(per /membership/black-card + /integrity
            rule #13 binding · ECPay/TapPay/Stripe 自動扣款全 refused forever)·
            您不主動轉帳下季 · 服務自然停止 · 不需 cancel button · 不需 exit
            interview · 不寄 reactivation 文案。
          </li>
          <li>
            <strong className="text-bone">期中未滿</strong> · 您退款後當期
            access 立即停止 · ZONE 27 不會繼續發您 period-end newsletter ·
            您也不能 access BLACK-only content 直到下期主動轉帳。
          </li>
        </ul>

        <p className="mt-6 text-mute/85 text-sm">
          ▸ 完整 refund 政策同步顯示在 <Link href="/founders" className="text-gold underline-offset-4 hover:underline">/founders Payment Trust block</Link>
          + <Link href="/faq" className="text-gold underline-offset-4 hover:underline">/faq Q「14 天退款怎麼運作」</Link>
          + <Link href="/membership/black-card" className="text-gold underline-offset-4 hover:underline">/membership/black-card hero「14-DAY 退款保證」 chip</Link>
          · 三處 surface synchronized · 任何 update 需 30 天前先公告 · per
          /audit S05 PRE-COMMIT pattern。
        </p>
      </Section>

      {/* ── 05 AI DISCLAIMER ────────────────────── */}
      <Section no="05" label="AI DISCLAIMER" zh="AI 預測免責">
        <p>
          ZONE 27 提供的 AI 模擬、勝率分布、比分預測,本質上為:
        </p>
        <ul className="space-y-3">
          <li>▸ 統計模型輸出(基於萬次模擬採樣)</li>
          <li>▸ 機率分布,而非確定性結論</li>
          <li>▸ 娛樂、教育、研究用途</li>
        </ul>
        <p className="text-bone">
          <strong>不構成投資建議、不構成博彩建議、不構成任何形式的財務或法律意見。</strong>
        </p>
        <p>
          您若據此進行任何下注、賭博、投資、商業決策,風險與責任完全由您自行承擔。
          ZONE 27 對於使用本平台資訊所產生的任何盈虧、損失、刑事責任,概不負責。
        </p>
        <p>
          完整方法論與已知限制請見{" "}
          <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">
            /methodology
          </Link>
          。
        </p>
      </Section>

      {/* ── 06 ACCEPTABLE USE ───────────────────── */}
      <Section no="06" label="ACCEPTABLE USE" zh="合理使用">
        <p>使用本網站時,您同意:</p>
        <ul className="space-y-3">
          <li>▸ 不對伺服器發送惡意請求(DDoS、暴力枚舉、注入攻擊)</li>
          <li>▸ 不大規模 scrape 我們的內容或 endpoints</li>
          <li>▸ 不偽造身分或冒充他人加入 waitlist</li>
          <li>▸ 不利用本網站從事任何違反中華民國法律的行為</li>
        </ul>
        <p>
          違反上述使用將導致您的 access 被立即終止,且我們可能保留追究法律責任的權利。
        </p>
      </Section>

      {/* ── 07 INTELLECTUAL PROPERTY ────────────── */}
      <Section no="07" label="INTELLECTUAL PROPERTY" zh="智慧財產權">
        <p>
          ZONE 27 品牌名稱、設計、視覺系統、所有文案,皆為 Tim Hsu(Tim-xuan-you)
          所有,保留全部權利。
        </p>
        <p>
          引擎的<strong className="text-bone">方法完整公開</strong>(見{" "}
          <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">
            /methodology
          </Link>
          {" + "}
          <Link href="/audit" className="text-gold underline-offset-4 hover:underline">
            /audit
          </Link>
          )· 任何人都可以閱讀、引用、學習。但<strong className="text-bone">不得</strong>
          使用 ZONE 27 品牌名稱、Logo、設計系統再開發競品。
        </p>
      </Section>

      {/* ── 08 LIABILITY LIMITS ─────────────────── */}
      <Section no="08" label="LIABILITY LIMITS" zh="責任限制">
        <p>
          在台灣法律允許範圍內,ZONE 27、創辦人、及未來可能成立的公司實體,
          對於以下情況概不負責:
        </p>
        <ul className="space-y-3">
          <li>▸ 您因 AI 預測結果產生的任何金錢損失</li>
          <li>▸ 網站宕機或資料暫時無法取用</li>
          <li>
            ▸ 第三方平台(原始碼代管 · <Code>Vercel</Code> ·{" "}
            <Code>Supabase</Code>(Tokyo ap-northeast-1))的服務中斷或資料事故
          </li>
          <li>▸ 您自身違反本服務條款導致的後果</li>
        </ul>
      </Section>

      {/* ── 09 CHANGES + GOVERNING LAW ──────────── */}
      <Section no="09" label="CHANGES + GOVERNING LAW" zh="條款變更與管轄法律">
        <p>
          本服務條款可能隨產品演進而調整。所有重大變更都會提前公開公告。
          您繼續使用本網站即視為同意修訂後條款。
        </p>
        <p>
          本服務條款適用<strong className="text-bone">中華民國法律</strong>。
          任何爭議由台灣台北地方法院作為第一審管轄法院。
        </p>
      </Section>

      {/* ── FINAL ───────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          TERMS EFFECTIVE 2026 · 05 · 20 · SUPABASE MIGRATION
        </p>
        <p className="text-mute leading-relaxed max-w-md mx-auto">
          如有疑問請寫信給{" "}
          <a
            href="mailto:tatayngiti@gmail.com?subject=ZONE%2027%20%C2%B7%20terms"
            className="text-gold underline-offset-4 hover:underline"
          >
            tatayngiti@gmail.com
          </a>
          。
        </p>
        <Link
          href="/privacy"
          className="inline-block mt-10 px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
        >
          閱讀隱私政策 →
        </Link>
      </section>

      {/* Round 52 W-A · Agent 3 #7 fix · /terms 之前 ORPHAN · 無 sibling
          links · 加 RelatedReading 連到 /ethics + /privacy + /coverage
          完成 trust artifact connective tissue。 */}
      <RelatedReading currentPath="/terms" />

      </main>

      <Footer />
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────
// R69 W-G · Agent B audit F2 fix · Section accepts optional id prop ·
// slug derived from `no` ("4B" → "section-4b" · "02B" → "section-02b" ·
// "01" → "section-01")· enables cross-link anchor jumping(per
// PreTransferReceipt R68 W-G /terms#section-4b)· brand IP「方法公開」
// 延伸到 deep-link discoverability。
function slugFromSectionNo(no: string): string {
  return `section-${no.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function Section({
  no,
  label,
  zh,
  children,
}: {
  no: string;
  label: string;
  zh: string;
  children: React.ReactNode;
}) {
  const id = slugFromSectionNo(no);
  return (
    <section
      id={id}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14 pt-10 border-t border-line/40 scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-2">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {label}
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-8">{zh}</h2>
      <div className="space-y-5 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-gold/90 bg-ink/40 px-1.5 py-0.5 text-[0.9em] border border-line/60">
      {children}
    </code>
  );
}
