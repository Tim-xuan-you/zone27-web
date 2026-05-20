import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — 我們收什麼、不收什麼、永遠不會做什麼",
  description:
    "ZONE 27 隱私政策。我們只收 waitlist 的 email,暫存在 Vercel 後台 logs,永遠不分享、不販售、不轉手。",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          PRIVACY POLICY · UPDATED MAY 2026
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          我們<span className="text-gold">收什麼</span>。
          <br />
          也誠實寫清楚我們<span className="text-gold">不會做什麼</span>。
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          不是法務模板。是寫給 ZONE 27 真實情境的隱私政策。
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── 01 SCOPE ─────────────────────────────── */}
      <Section no="01" label="SCOPE" zh="適用範圍">
        <p>
          本政策適用於 <Code>zone27-web.vercel.app</Code> 與其所有子路徑。
          當您訪問本網站、加入 Founders 27 等候名單,或使用任何互動功能時,
          皆受本政策約束。
        </p>
      </Section>

      {/* ── 02 WHAT WE COLLECT ──────────────────── */}
      <Section no="02" label="WHAT WE COLLECT" zh="我們收集什麼">
        <p>
          當您主動使用功能時,我們會收集:
        </p>
        <ul className="space-y-3">
          <li>
            <strong className="text-bone">Founders 27 等候名單 email</strong> ─
            您主動填寫的 email,以及您選擇填寫的稱呼(可選)。
            時間戳記與 queue position 一併紀錄。
          </li>
        </ul>
        <p className="text-mute/80 mt-6">
          就這樣。我們沒有任何其他資料收集機制。
        </p>
      </Section>

      {/* ── 03 WHAT WE DON'T COLLECT ────────────── */}
      <Section no="03" label="WHAT WE DON'T COLLECT" zh="我們不收什麼">
        <p>列出我們<strong className="text-bone">沒有</strong>做的事很重要:</p>
        <ul className="space-y-3">
          <li>❌ 沒有 Google Analytics</li>
          <li>❌ 沒有 Facebook Pixel</li>
          <li>❌ 沒有第三方追蹤 cookies</li>
          <li>❌ 沒有 IP 蒐集(Vercel 預設不對外公開)</li>
          <li>❌ 沒有信用卡(我們還沒開放付款)</li>
          <li>❌ 沒有個人身分資料(姓名/電話/地址全部不收)</li>
          <li>❌ 沒有瀏覽行為紀錄(您在 /lab 跑幾次 simulation 我們不知道)</li>
        </ul>
        <p className="text-mute/80 mt-6">
          這也代表:目前的 ZONE 27 是一個「客戶端透明」的網站,所有互動(Monte
          Carlo 模擬、REPLAY 動畫、自訂引擎)全部在您的瀏覽器執行,
          資料從不離開您的裝置。
        </p>
      </Section>

      {/* ── 04 HOW WE STORE ─────────────────────── */}
      <Section no="04" label="HOW WE STORE" zh="儲存方式">
        <p>
          目前 pre-launch 階段,所有 waitlist email 暫存在
          <Code>Vercel 後台 logs</Code> ── 僅創辦人 Tim 可存取的服務端日誌。
          這是過渡方案。
        </p>
        <p>
          當正式付款系統開放(預計 2026 Q3),所有 email 將遷移至 Supabase
          加密資料庫,並以 row-level security 保護。
        </p>
      </Section>

      {/* ── 05 WHO WE SHARE WITH ────────────────── */}
      <Section no="05" label="WHO WE SHARE WITH" zh="誰能看到您的資料">
        <p className="text-bone text-lg">
          <strong>沒有任何第三方。</strong>
        </p>
        <p>
          我們承諾:
        </p>
        <ul className="space-y-3">
          <li>▸ 不分享給廣告平台(我們也沒有廣告)</li>
          <li>▸ 不販售給數據經紀商</li>
          <li>▸ 不交換給合作品牌</li>
          <li>▸ 不交給 LINE / FB / Google 進行受眾再行銷</li>
        </ul>
        <p>
          唯二例外是法律強制:(a) 台灣法院的搜索票/調查令、(b) 跨境執法 MLAT
          請求。若發生此類情況,我們會在法律允許範圍內盡可能通知當事人。
        </p>
      </Section>

      {/* ── 06 YOUR RIGHTS ──────────────────────── */}
      <Section no="06" label="YOUR RIGHTS" zh="您的權利">
        <p>您隨時可以:</p>
        <ul className="space-y-3">
          <li>
            <strong className="text-bone">查詢</strong> ─
            問我們存了您什麼資料(目前只可能有:email、稱呼、加入時間、queue 位置)。
          </li>
          <li>
            <strong className="text-bone">更正</strong> ─
            如果您 typo 了 email,告訴我們即可更新。
          </li>
          <li>
            <strong className="text-bone">刪除</strong> ─
            完全把您的 email 從 waitlist 移除。
            刪除後您將無法收到正式開賣通知。
          </li>
          <li>
            <strong className="text-bone">資料攜出</strong> ─
            索取一份您所有資料的 JSON 副本。
          </li>
        </ul>
        <p className="mt-4">
          以上請求請寄至我們的官方聯絡管道(launch 後公布)。
          我們承諾在收到請求後 14 天內處理完畢。
        </p>
      </Section>

      {/* ── 07 SECURITY ─────────────────────────── */}
      <Section no="07" label="SECURITY" zh="資料安全">
        <p>
          我們把 Vercel 與 Supabase(未來)當成基礎設施,
          享有它們提供的企業級加密與存取控制。具體來說:
        </p>
        <ul className="space-y-3">
          <li>▸ 所有傳輸採 HTTPS / TLS 1.3 加密</li>
          <li>▸ Vercel logs 採 SOC 2 Type II 級別保護</li>
          <li>▸ 創辦人本機不留任何 email 副本</li>
          <li>▸ 若發生資料外洩,72 小時內公開揭露於 /changelog</li>
        </ul>
      </Section>

      {/* ── 08 CONTACT ──────────────────────────── */}
      <Section no="08" label="CONTACT" zh="聯絡我們">
        <p>
          官方聯絡 email 將於正式 launch 時公布。在此之前,
          任何隱私相關詢問可透過 GitHub Issues 提出:
        </p>
        <p>
          ▸{" "}
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            github.com/Tim-xuan-you/zone27-web/issues
          </a>
        </p>
      </Section>

      {/* ── FINAL ───────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          POLICY EFFECTIVE 2026 · 05 · 19
        </p>
        <p className="text-mute leading-relaxed max-w-md mx-auto">
          所有政策變動會公開於{" "}
          <Link href="/changelog" className="text-gold underline-offset-4 hover:underline">
            /changelog
          </Link>
          。
        </p>
        <Link
          href="/terms"
          className="inline-block mt-10 px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
        >
          閱讀服務條款 →
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
