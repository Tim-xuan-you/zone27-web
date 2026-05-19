import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

const benefits = [
  {
    no: "01",
    zh: "終身會員資格",
    en: "LIFETIME ACCESS",
    body: "一次性 NT$ 2,700,永久解鎖未來所有功能。BLACK CARD 月費 NT$ 499 對您完全免費,終身。",
  },
  {
    no: "02",
    zh: "鑲金編號徽章",
    en: "NUMBERED BADGE · #001-#270",
    body: "個人 ID 永久鑲入創始編號徽章,在動態牆、明牌、聊天室都會顯示。是身分,也是勳章。",
  },
  {
    no: "03",
    zh: "創作者零抽成",
    en: "0% PLATFORM FEE",
    body: "如果您也是預測創作者,賣明牌 100% 全拿。一般黑金會員平台仍抽 5% — 您完全不抽。",
  },
  {
    no: "04",
    zh: "BOTTOM 27 共生",
    en: "ECOSYSTEM CROSS-PASS",
    body: "未來 BOTTOM 27 棒球手遊上線,自動空投創始限定球員卡、稀有球場代幣、終身贊助商徽章。",
  },
  {
    no: "05",
    zh: "AI 模型優先試用",
    en: "BETA-ACCESS",
    body: "每一次 AI 模型迭代(打席矩陣升級、新球種變數)創始會員提前 7 天試用,並可投票決定下一步迭代方向。",
  },
  {
    no: "06",
    zh: "實體尊榮招待",
    en: "PREMIUM HOSPITALITY",
    body: "出示創始會員 QR Code 至恆美攝影 × 伶 Kopi 旗艦店,免費招待一杯冰鎮頂級一品紅茶。終身有效。",
  },
];

export default function FoundersPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      {/* ── HERO ─────────────────────────── */}
      <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-8 font-mono text-[10px] tracking-[0.4em]">
          <span className="text-gold">FOUNDERS · 27</span>
          <span className="text-mute/60">·</span>
          <span className="px-1.5 py-0.5 border border-gold/40 text-gold">
            PRE-LAUNCH WAITLIST
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-bone">
          僅限<span className="text-gold mx-3">270</span>位
          <br />
          創始會員。
        </h1>

        <p className="font-mono text-mute text-sm tracking-[0.3em] mt-8">
          NT$ 2,700 · ONE-TIME · LIFETIME · NEVER REOPENS
        </p>

        <p className="mt-10 max-w-xl mx-auto text-mute leading-relaxed">
          這 270 個編號將是 ZONE 27 永遠的傳教士。
          <br />
          一次入會,終身免費。售完即永久關閉,不會有第二批。
        </p>
        <p className="mt-4 max-w-xl mx-auto text-mute/70 text-sm leading-relaxed">
          付款系統預計 2026 Q3 開放。先加入等候名單,優先取得購買權。
        </p>
      </section>

      {/* ── WAITLIST FORM (was: dead claim button) ── */}
      <section
        id="waitlist"
        className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-20 scroll-mt-20"
      >
        <WaitlistForm />
      </section>

      {/* ── BENEFITS GRID ────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 border-t border-line/40 pt-20">
        <h2 className="text-3xl sm:text-4xl text-bone font-light tracking-tight text-center mb-4">
          創始六大權益
        </h2>
        <p className="font-mono text-mute text-xs tracking-[0.3em] text-center mb-16">
          THE SIX UNLOCKS
        </p>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-14">
          {benefits.map((b) => (
            <div key={b.no}>
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3">
                / {b.no}
              </p>
              <h3 className="text-xl text-bone font-light tracking-tight mb-1">
                {b.zh}
              </h3>
              <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mb-4">
                {b.en}
              </p>
              <p className="text-mute text-sm leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-20 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          ONE NUMBER. ONE LIFETIME.
        </p>
        <h3 className="text-3xl sm:text-4xl text-bone font-light tracking-tight">
          當 #270 被認領,這扇門將永遠關閉。
        </h3>
        <p className="mt-6 text-mute max-w-md mx-auto text-sm leading-relaxed">
          現在加入等候名單,在正式開放預訂時擁有第一順位。
        </p>
        <Link
          href="#waitlist"
          className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          ↑ JOIN THE WAITLIST
        </Link>
        <Link
          href="/about"
          className="block mt-6 font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
        >
          READ THE MANIFESTO →
        </Link>
      </section>

      <Footer />
    </div>
  );
}
