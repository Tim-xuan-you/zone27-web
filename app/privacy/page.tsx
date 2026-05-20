import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — 我們收什麼、不收什麼、永遠不會做什麼",
  description:
    "ZONE 27 隱私政策。我們只收 waitlist 的 email + 稱呼 + 通道標籤,存在 Supabase Tokyo 區 RLS-locked 資料庫,永遠不分享、不販售、不轉手。",
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
            <strong className="text-bone">Email · 必填</strong> ─
            您填的 email 字串,正規化為小寫並 trim。用於正式開賣時通知您。
          </li>
          <li>
            <strong className="text-bone">稱呼 · 選填</strong> ─
            如果您填寫,我們會存。不填就是 <Code>null</Code>。
          </li>
          <li>
            <strong className="text-bone">Queue position</strong> ─
            您加入時系統自動分配的順序號(<Code>bigint generated always as identity</Code>),
            用於告訴您「您是第 N 位」。
          </li>
          <li>
            <strong className="text-bone">Created timestamp</strong> ─
            您加入的時間(UTC),用於排序與「最近 24 小時新增多少」這類匿名彙總。
          </li>
          <li>
            <strong className="text-bone">Channel source(若有)</strong> ─
            如果您點進來的 URL 帶有 <Code>?ref=reserve-NNN</Code> 參數,
            <strong className="text-bone">我們會把該標籤存下</strong>(例如:
            <Code>reserve-001</Code>)。這是<strong className="text-bone">通道歸因</strong>,
            告訴創辦人「#001 那位會員的分享連結帶來了多少新報名」。
            <strong className="text-bone">這 NOT 是個人追蹤</strong>:我們不知道
            <em>哪位特定訪客</em>透過該連結進來,只知道「總共多少報名來自該通道」。
            sanitize regex 限制 <Code>[a-z0-9-]{"{1,40}"}</Code>,防止 injection 與超長字串。
          </li>
        </ul>
        <p className="text-mute/80 mt-6">
          就這 5 個欄位。我們沒有任何其他資料收集機制。
          完整 schema 開放在{" "}
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/blob/main/supabase/migrations/0001_waitlist.sql"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            supabase/migrations/0001_waitlist.sql
          </a>
          ,任何人都可以審計。
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
          <strong className="text-bone">更新 2026-05-20:</strong>{" "}
          waitlist 資料庫已從 Vercel logs(過渡方案)遷移至{" "}
          <Code>Supabase Tokyo (ap-northeast-1)</Code> PostgreSQL,
          並啟用 <strong className="text-bone">Row-Level Security (RLS) lock-down</strong>:
        </p>
        <ul className="space-y-3">
          <li>
            ▸ <strong className="text-bone">沒有任何角色能直接讀 / 寫 waitlist 表</strong>。
            連我們的公開 <Code>publishable key</Code>(放在前端 JS 裡)
            都無法繞過 RLS。
          </li>
          <li>
            ▸ 所有寫入只能透過{" "}
            <Code>SECURITY DEFINER</Code> 函式{" "}
            <Code>reserve_waitlist_spot()</Code> ──
            該函式驗證 email 格式 + 去重 + sanitize source tag,
            然後 INSERT。
          </li>
          <li>
            ▸ 所有讀取也只能透過{" "}
            <Code>SECURITY DEFINER</Code> 函式 <Code>get_waitlist_count()</Code> ──
            <strong className="text-bone">永遠只回傳 COUNT,從不回傳 email/姓名</strong>。
          </li>
          <li>
            ▸ 只有 <Code>service_role</Code>(僅創辦人 Tim 透過 Supabase Studio 持有)
            能繞過 RLS 看全部資料。瀏覽器端永遠拿不到這把鑰匙。
          </li>
        </ul>
        <p>
          這個架構代表:即使我們公開的 <Code>NEXT_PUBLIC_SUPABASE_ANON_KEY</Code>{" "}
          被任何人撿到,他<strong className="text-bone">依然無法 exfiltrate
          任何一個 email</strong>。RLS 是物理防線,不是嘴炮。完整 SQL schema 公開於{" "}
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/blob/main/supabase/migrations/0001_waitlist.sql"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            supabase/migrations/0001_waitlist.sql
          </a>
          。
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
          POLICY EFFECTIVE 2026 · 05 · 20 · SUPABASE MIGRATION
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
