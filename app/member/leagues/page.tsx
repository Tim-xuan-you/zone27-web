import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getUser } from "@/lib/supabase/server";
import { getMyLeagues } from "@/lib/leagues";
import CreateLeagueForm from "@/components/CreateLeagueForm";
import JoinLeagueForm from "@/components/JoinLeagueForm";

export const metadata: Metadata = {
  title: "私人預測聯盟",
  description:
    "揪一群朋友開一個盟,整季比誰最會讀 CPBL + MLB。 貨幣不是錢、不是連勝,是公開含輸帳本 + 校準。 終身免費。",
};

// ── ZONE 27 · /member/leagues · 私人預測聯盟 hub(R236)─────────────────────
// 我在哪些盟 + 開一個 + 用邀請碼加入。 authed(getUser · 動態 ƒ(cookies))· 0029 未套 → leagues=null
// → 顯示「建置中」· 表單仍在(submit 會 graceful 報「建置中」)。 ?join=CODE 預填加入表單。
// ─────────────────────────────────────────────────────

function LoginGate() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />
      <main id="main" className="flex-1 flex items-center">
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 py-24 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 私人預測聯盟
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            揪朋友,<span className="text-gold">整季比誰最會讀球</span>
          </h1>
          <p className="mt-5 text-mute leading-relaxed">
            開一個盟、傳邀請碼給朋友 · 用公開含輸帳本 + 校準分高下。 不是錢、不是連勝。 終身免費。
          </p>
          <Link
            href="/login?next=/member/leagues"
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

export default async function LeaguesHubPage({
  searchParams,
}: {
  searchParams: Promise<{ join?: string }>;
}) {
  const user = await getUser();
  if (!user) return <LoginGate />;

  const sp = await searchParams;
  const joinCode =
    typeof sp.join === "string"
      ? sp.join.toUpperCase().replace(/[^0-9A-F]/g, "").slice(0, 6)
      : "";

  const leagues = await getMyLeagues(); // null = RPC 不可用(0029 未套)

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="member" />
      <main
        id="main"
        className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-10 pb-24"
      >
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
          / 私人預測聯盟
        </p>
        <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
          你的<span className="text-gold">盟</span>
        </h1>
        <p className="mt-3 text-mute text-sm leading-relaxed max-w-xl">
          揪一群朋友,整季比「誰最會讀球」。 排名按公開含輸帳本 + 校準(贏過引擎的幅度)·
          不是錢、不是連勝。 棒球(CPBL + MLB)同一個榜;足球之後當獨立賽道。
        </p>

        {/* 我的盟列表 */}
        <section className="mt-8">
          {leagues === null ? (
            <div className="border border-line/60 bg-slate/30 p-5 text-center">
              <p className="text-bone text-sm font-light leading-relaxed">
                聯盟功能<span className="text-gold">建置中</span>。
              </p>
              <p className="mt-1.5 text-mute/80 text-[12px] leading-relaxed">
                後台資料表套用後即開通 · 開一個盟試試(暫時會提示建置中)。
              </p>
            </div>
          ) : leagues.length === 0 ? (
            <div className="border border-line/60 bg-slate/30 p-5 text-center">
              <p className="text-bone text-sm font-light leading-relaxed">
                你還沒加入任何盟。
              </p>
              <p className="mt-1.5 text-mute/80 text-[12px] leading-relaxed">
                開一個揪朋友,或用朋友給的邀請碼加入 ↓
              </p>
            </div>
          ) : (
            <>
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                你在的盟 · {leagues.length}
              </p>
              <ul className="flex flex-col gap-2 list-none pl-0 m-0">
                {leagues.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/member/leagues/${l.id}`}
                      className="flex items-center justify-between gap-3 border border-line/60 bg-slate/30 hover:border-gold/45 hover:bg-slate/40 transition-colors p-4 group"
                    >
                      <span className="min-w-0">
                        <span className="block text-bone text-base font-light tracking-tight truncate group-hover:text-gold transition-colors">
                          {l.name}
                        </span>
                        <span className="block font-mono text-mute/60 text-[10px] tracking-[0.18em] mt-0.5">
                          {l.memberCount} 人{l.isCreator ? " · 你建的" : ""} · 碼{" "}
                          <span className="text-mute/80">{l.inviteCode}</span>
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-gold/60 group-hover:text-gold text-[10px] tracking-[0.25em] transition-colors">
                        看天梯 →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* 開盟 + 加入 */}
        <section className="mt-8 flex flex-col gap-4">
          <CreateLeagueForm />
          <JoinLeagueForm initialCode={joinCode} />
        </section>

        <p className="mt-8 font-mono text-mute/45 text-[10px] tracking-[0.15em] leading-relaxed text-center">
          純精神預測 = 遊戲 · 0 金錢、0 點數、0 入會費 · 我們不接受下注。
        </p>
      </main>
      <Footer />
    </div>
  );
}
