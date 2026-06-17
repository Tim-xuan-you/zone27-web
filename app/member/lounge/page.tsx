import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getUser } from "@/lib/supabase/server";
import { getLoungeMessages } from "@/lib/lounge";
import LoungeRoom from "@/components/LoungeRoom";

export const metadata: Metadata = {
  title: "會員房間",
  description:
    "出錢養著免費引擎的那一群,有一間只有他們進得去的客廳。 聊球、聊判斷、彼此打招呼。 不是功能、不押注 —— 是歸屬。",
};

// ── ZONE 27 · /member/lounge · 會員之間的房間(R248 · migration 0030)──────────────
// Defector 式「會員專屬空間」。 authed(getUser · 動態 ƒ(cookies))· 用 RPC 結果判身分:
//   member → 房間(發言 + 留言牆)· locked(登入非會員)→ 房間介紹 + 升級邀請 · unbuilt(0030 未套)→ 建置中。
// 🔴 引擎/押注/天梯/校準/戰績永遠對所有人免費;這間房間是身分制不是功能制,進不去不影響任何預測能力。
// ─────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />
      <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-10 pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function LoginGate() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />
      <main id="main" className="flex-1 flex items-center">
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 py-24 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 會員房間
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            出錢養著它的人,<span className="text-gold">有一間自己的客廳</span>
          </h1>
          <p className="mt-5 text-mute leading-relaxed">
            先登入(免費),看看這扇門後面是什麼。
          </p>
          <Link
            href="/login?next=/member/lounge"
            className="mt-7 inline-block px-7 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            登入 / 註冊 →
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// 房間是什麼(member 頂端 + locked 介紹共用一句)。
function RoomKicker() {
  return (
    <>
      <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
        / 會員房間
      </p>
      <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
        養著免費引擎那群人的<span className="text-gold">客廳</span>
      </h1>
    </>
  );
}

export default async function LoungePage() {
  const user = await getUser();
  if (!user) return <LoginGate />;

  const result = await getLoungeMessages();

  // 登入但不是付費會員 → 房間介紹 + 升級邀請(誠實 · 0 假稀缺)。
  if (result.state === "locked") {
    return (
      <Shell>
        <RoomKicker />
        <p className="mt-4 text-mute text-sm leading-relaxed max-w-xl">
          這扇門後面,是出錢讓引擎永遠免費的那一群人。 他們在這裡聊球、聊判斷、彼此打招呼 ——
          不是明牌、不押注,就是一間客廳。
        </p>
        <div className="mt-7 border border-gold/30 bg-gold/[0.04] p-5 sm:p-6">
          <p className="text-bone text-base sm:text-lg font-light leading-relaxed">
            你付的不是功能 —— 引擎、押注、天梯、校準、戰績,你現在就全部免費用。
          </p>
          <p className="mt-3 text-mute text-sm leading-relaxed">
            你付的是<span className="text-gold">歸屬</span>:一圈所有人看得見的金環、一間自己人的房間、
            把這台引擎對下一個懷疑的人也免費撐下去的那份重量。
          </p>
          <Link
            href="/membership"
            className="mt-5 inline-block px-7 py-3 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            看看會員是什麼 →
          </Link>
        </div>
        <p className="mt-6 font-mono text-mute/45 text-[10px] tracking-[0.15em] leading-relaxed">
          進不去不影響任何預測能力 —— 引擎與準度永遠對所有人免費。 這間房間是身分,不是功能。
        </p>
      </Shell>
    );
  }

  // 0030 未套 → 誠實建置中。
  if (result.state === "unbuilt") {
    return (
      <Shell>
        <RoomKicker />
        <div className="mt-7 border border-line/60 bg-slate/30 p-5 text-center">
          <p className="text-bone text-sm font-light leading-relaxed">
            房間<span className="text-gold">建置中</span>。
          </p>
          <p className="mt-1.5 text-mute/80 text-[12px] leading-relaxed">
            後台資料表套用後即開通。
          </p>
        </div>
      </Shell>
    );
  }

  // 付費會員 → 房間本體。
  return (
    <Shell>
      <RoomKicker />
      <p className="mt-3 text-mute text-sm leading-relaxed max-w-xl">
        只有付費會員進得來。 聊球、聊判斷、彼此打招呼 —— 不是明牌、不押注,就是一間客廳。
        最新的在最上面。
      </p>
      <div className="mt-7">
        <LoungeRoom initialMessages={result.messages} />
      </div>
      <p className="mt-8 font-mono text-mute/45 text-[10px] tracking-[0.15em] leading-relaxed text-center">
        這裡是身分不是功能 · 0 連勝、0 排名、0 按讚數 · 只是一間自己人的客廳。
      </p>
    </Shell>
  );
}
