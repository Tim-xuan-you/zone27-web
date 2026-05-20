import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — 我們對您的承諾,您對我們的同意",
  description:
    "ZONE 27 服務條款。pre-launch 階段的真實情境合約 — 不是模板。AI 是娛樂用途,Founders 27 waitlist 不收費不綁定。",
};

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
          <li>▸ 所有改動會公開於{" "}
            <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
              /changelog
            </Link>
          </li>
        </ul>
      </Section>

      {/* ── 04 FOUNDERS 27 WAITLIST ─────────────── */}
      <Section no="04" label="FOUNDERS 27 WAITLIST" zh="Founders 27 等候名單聲明">
        <p>
          您加入 Founders 27 waitlist 時,請理解以下事項:
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
            最終 270 個正式創始會員將以「正式付款完成」順序鎖定。
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
            若您透過某創始會員的分享連結進入(<Code>?ref=reserve-NNN</Code>),
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

      {/* ── 05 AI DISCLAIMER ────────────────────── */}
      <Section no="05" label="AI DISCLAIMER" zh="AI 預測免責">
        <p>
          ZONE 27 提供的 AI 模擬、勝率分布、比分預測,本質上為:
        </p>
        <ul className="space-y-3">
          <li>▸ 統計模型輸出(基於蒙地卡羅採樣)</li>
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
          網站原始碼<strong className="text-bone">完全開源</strong>於 GitHub
          (採用 MIT 授權):
        </p>
        <p>
          ▸{" "}
          <a
            href="https://github.com/Tim-xuan-you/zone27-web"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            github.com/Tim-xuan-you/zone27-web
          </a>
        </p>
        <p>
          您可在 MIT 授權範圍內自由 fork、引用、學習。但<strong className="text-bone">不得</strong>
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
            ▸ 第三方平台(<Code>GitHub</Code> · <Code>Vercel</Code> ·{" "}
            <Code>Supabase</Code>(Tokyo ap-northeast-1))的服務中斷或資料事故
          </li>
          <li>▸ 您自身違反本服務條款導致的後果</li>
        </ul>
      </Section>

      {/* ── 09 CHANGES + GOVERNING LAW ──────────── */}
      <Section no="09" label="CHANGES + GOVERNING LAW" zh="條款變更與管轄法律">
        <p>
          本服務條款可能隨產品演進而調整。所有重大變更會公開於{" "}
          <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
            /changelog
          </Link>
          。您繼續使用本網站即視為同意修訂後條款。
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
          如有疑問請開{" "}
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            GitHub Issue
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

      </main>

      <Footer />
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────
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
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14 pt-10 border-t border-line/40">
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
