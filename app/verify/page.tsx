import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { normalizeProfileCode } from "@/lib/profile-code";
import { getProfileByCode } from "@/lib/profile-server";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /verify · 公開查驗頁(貼碼 → 落回 live 含輸帳本)──────────────────
// 可攜憑證的「信任機制」入口(米其林「查官方指南而非信門牌」):有人亮出「我在 ZONE 27 準度 X」或一張
// 徽章圖 → 招募者 / 對手 / 贊助商 貼上碼或 /u 連結,直接落回那人 live 的公開含輸帳本自己驗。
// 🔴 憑證不靠那張圖:複製的徽章圖若解析不到一份真 /u 帳本 = 自證偽造。 截圖能造假,即時重算的含輸帳本不行。
// 查無 → 誠實「查不到 · 真憑證一定解析得到一份含輸帳本」。 0 migration · 純讀既有 RPC · 訪客面 0 提 GitHub。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "查驗一份戰績",
  description:
    "貼上 ZONE 27 永久碼或公開檔連結,看一個人賽前鎖死、含贏含輸、刪不掉的整本帳,自己驗他多準。憑證不靠那張圖。",
  path: "/verify",
});

export const dynamic = "force-dynamic";

async function verifyAction(formData: FormData) {
  "use server";
  const raw = String(formData.get("q") ?? "").trim();
  // 接受裸碼或貼整條 /u/CODE 連結 —— 先把碼從連結抽出來。
  const m = raw.match(/u\/([0-9a-zA-Z]{4,})/);
  const code = normalizeProfileCode(m ? m[1] : raw);
  if (!code) redirect("/verify?err=1");
  const profile = await getProfileByCode(code);
  if (!profile) redirect("/verify?err=1");
  redirect(`/u/${code}`);
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const { err } = await searchParams;
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main" className="flex-1 flex items-center">
        <section className="mx-auto max-w-md w-full px-6 sm:px-10 py-24">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 查驗一份戰績
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight mb-4">
            憑證不靠那張<span className="text-gold">圖</span>。
          </h1>
          <p className="text-mute text-sm sm:text-base leading-relaxed mb-7">
            有人跟你說「我在 ZONE 27 的準度是 X」、或亮出一張徽章? 貼上他的永久碼或公開檔連結 ——
            你會看到他<span className="text-bone">賽前鎖死、含贏含輸、刪不掉</span>的整本帳,自己驗他到底多準。
            截圖能造假,這本帳不行。
          </p>
          <form action={verifyAction} className="flex flex-col gap-3">
            <input
              type="text"
              name="q"
              required
              placeholder="貼上永久碼 或 .../u/xxxxxxxx"
              aria-label="永久碼或公開檔連結"
              className="w-full bg-slate/40 border border-line/60 focus:border-gold/60 outline-none px-4 py-3 text-bone font-mono text-sm tracking-wide placeholder:text-mute/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              查這份帳本 →
            </button>
          </form>
          {err && (
            <p className="mt-4 font-mono text-loss/85 text-[12px] leading-relaxed">
              查不到這個碼。 真的憑證一定解析得到一份公開含輸帳本 —— 查不到,就別信那張圖。
            </p>
          )}
          <p className="mt-8 text-mute/60 text-[12px] leading-relaxed">
            為什麼信得過:每個人的準度都是<span className="text-mute">即時、含輸</span>算出來的,
            守不住會掉、也刪不掉。 想知道怎麼算的?{" "}
            <a
              href="/audit"
              className="text-gold/75 hover:text-gold underline-offset-4 hover:underline"
            >
              看引擎報告 →
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
