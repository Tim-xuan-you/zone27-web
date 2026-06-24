import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import { getUser, createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchLadderRows } from "@/lib/ladder-rows";
import { computeAdminInsights, type KCount } from "@/lib/admin-insights";

// ── ZONE 27 · /admin/insights · 創辦人第一方洞察(admin-only)──────────────────────
// Tim「裝什麼工具收集大數據、知道客群」→ 不裝監視型追蹤(破站上「不追蹤你」鐵律),
// 挖自己的押注帳本算聚合訊號。 0 第三方、0 像素、0 PII。 數學全在 lib/admin-insights(純函式)。
//
// 🔴 gating:這頁把聚合資料直接 render 成 HTML → 必須 server 端真的擋(不能像 /admin 只驗登入、
//   把 admin gate 丟給 client)。 server 端跑 am_i_admin RPC,非 admin / 未登入 / RPC 錯 → 一律拒絕
//   分支(不跑任何聚合、不洩漏一個數字)。 noindex · 不進 Cmd-K / sitemap。
// ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "創辦人洞察 · ZONE 27",
  description: "你自己的押注帳本聚合 · 0 追蹤 · 只有你看得到。",
  robots: { index: false, follow: false },
};

// 趨勢頁 · 5 分鐘重抓(比 /admin 待辦頁的 60 秒鬆)。
export const revalidate = 300;

function kc(v: KCount): string {
  return v === null ? "<5" : String(v);
}

export default async function AdminInsightsPage() {
  const user = await getUser();
  // 🔴 server 端真 gate:這頁 render 真資料,client gate 擋不住「資料已在 server 算好送下去」。
  let isAdmin = false;
  if (user) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.rpc("am_i_admin");
      isAdmin =
        Array.isArray(data) &&
        (data[0] as { is_admin?: unknown })?.is_admin === true;
    } catch {
      /* graceful → 當作非 admin · 不洩漏 */
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Nav />
        <main id="main" className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-24 pb-24">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
            / 創辦人洞察
          </p>
          <div className="border border-line/60 bg-slate/30 p-8 sm:p-10 text-center">
            <p className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
              這頁只有管理員看得到。
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto mb-6">
              {user
                ? "你登入了,但這個帳號不是管理員 —— 後台聚合資料只給站主看。"
                : "先登入你的管理員帳號。"}
            </p>
            <Link
              href={user ? "/admin" : "/login?next=/admin/insights"}
              className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              {user ? "→ 回管理台" : "登入 →"}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const rows = await fetchLadderRows();
  const ins = computeAdminInsights(rows);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <main id="main">
        {/* ── 開頭 ── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pt-20 pb-8">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
              / 創辦人洞察
            </p>
            <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/40 text-gold/80">
              只有你看得到
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight max-w-3xl">
            你的資料庫,<span className="text-gold">就是你的後台</span>。
          </h1>
          <p className="mt-5 text-mute leading-relaxed max-w-2xl text-sm sm:text-base">
            這頁只跑<strong className="text-bone">你自己的押注帳本</strong> —— 0 追蹤、0 像素、0 第三方。
            它回答「誰在用、押什麼、會不會回來」· 不監視任何人。 小於 {5} 人的切片一律顯示「&lt;5」(不洩漏個體)。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-8" />

        {/* ── 區 A · 北極星帶(主角)── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-10">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-4">
            / 北極星 · 該天天看的就這幾個
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <Kpi
              zh="本週敢對帳的人"
              value={ins.wauPeople}
              hint={`過去 7 天有 ${ins.wauPeople} 個不同的人真的鎖了一手 · 共 ${ins.wauLocks} 筆`}
            />
            <Kpi
              zh="累積押過的人"
              value={ins.totalPeople}
              hint={`全期 ${ins.totalLocks} 筆賽前鎖定 · 含輸照掛、刪不掉`}
            />
            <Kpi
              zh="養成習慣的人"
              value={kc(ins.retention.fourPlus)}
              hint="回來對帳 ≥ 4 個不同日 = 真的在養成紀律,不是路過"
            />
          </div>

          {/* ④ 誠實護欄 · 緊貼北極星(剎車燈位置)*/}
          <div className="mt-4 border border-gold/25 bg-gold/[0.03] p-4 sm:p-5">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2">
              / 誠實護欄 · 量漲也別變柏青哥
            </p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              用戶已結算的「誰贏」押注:{" "}
              <span className="font-mono text-gold tabular">✓{ins.honesty.hits}</span>{" "}
              <span className="font-mono text-loss/85 tabular">✕{ins.honesty.misses}</span>
              {ins.honesty.lossRate !== null && (
                <>
                  {" "}· 含輸率{" "}
                  <span className="font-mono text-bone tabular">{ins.honesty.lossRate}%</span>{" "}
                  <span className="text-mute/60">(永不刪 → 這就是真實的含輸,逼近 0 才該擔心)</span>
                </>
              )}
              {" · 寫理由率 "}
              {ins.honesty.rationaleAvail && ins.honesty.rationaleRate !== null ? (
                <span className="font-mono text-bone tabular">{ins.honesty.rationaleRate}%</span>
              ) : (
                <span className="text-mute/55">(押注理由功能套用後才會亮)</span>
              )}
            </p>
          </div>
        </section>

        {/* ── 區 B · 分布細看 ── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-10">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-5">
            / 客群長什麼樣
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* ② 回訪頻率 */}
            <div>
              <p className="text-bone text-sm tracking-tight mb-1">回來對帳的頻率</p>
              <p className="font-mono text-mute/55 text-[10px] tracking-[0.1em] mb-3">
                每個人回來鎖手的不同日數 —— 右邊那塊愈大愈黏
              </p>
              <DistGroup
                rows={[
                  { label: "回 1 天", count: ins.retention.oneDay },
                  { label: "回 2–3 天", count: ins.retention.twoToThree },
                  { label: "回 4+ 天", count: ins.retention.fourPlus },
                ]}
              />
            </div>
            {/* ③ 投入度長尾 */}
            <div>
              <p className="text-bone text-sm tracking-tight mb-1">投入度(押過幾場)</p>
              <p className="font-mono text-mute/55 text-[10px] tracking-[0.1em] mb-3">
                右側 10+ 那塊在長大 = 有一塊死忠核心
              </p>
              <DistGroup
                rows={[
                  { label: "押 1 場", count: ins.engagement.b1 },
                  { label: "2–5 場", count: ins.engagement.b2to5 },
                  { label: "6–10 場", count: ins.engagement.b6to10 },
                  { label: "10+ 場", count: ins.engagement.b10plus },
                ]}
              />
            </div>
          </div>

          {/* ⑦ 新面孔(近 4 週)*/}
          <div className="mt-7">
            <p className="text-bone text-sm tracking-tight mb-1">新面孔 · 近 4 週</p>
            <p className="font-mono text-mute/55 text-[10px] tracking-[0.1em] mb-3">
              每週第一次出現的人(用「第一筆鎖定」當生命起點 · 精準「註冊→啟動」漏斗需另接帳號表 · 之後再做)
            </p>
            <DistGroup
              rows={ins.newFacesByWeek.map((w, i) => ({
                label: i === 3 ? "本週" : `${4 - i} 週前`,
                count: w.count,
              }))}
            />
          </div>
        </section>

        {/* ── 區 C · 命脈卡 · 群眾 vs 引擎 ── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-10">
          <div className="border border-gold/30 bg-slate/30 p-5 sm:p-6">
            <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-3">
              / 群眾 vs 引擎 · 裝 GA 永遠拿不到的金礦
            </p>
            {ins.crowdVsEngine ? (
              <>
                <p className="text-mute text-[13px] sm:text-sm leading-relaxed mb-3">
                  同一場 ≥ {5} 人押的 <span className="text-bone tabular">{ins.crowdVsEngine.matches}</span> 場裡 ·
                  群眾多數跟引擎<span className="text-bone tabular"> {ins.crowdVsEngine.sameSide}</span> 場同邊。
                </p>
                <div className="space-y-2 max-w-md">
                  <AccBar label="群眾命中率" pct={ins.crowdVsEngine.crowdAcc} />
                  <AccBar label="引擎命中率" pct={ins.crowdVsEngine.engineAcc} />
                </div>
                <p className="mt-3 font-mono text-mute/55 text-[10px] tracking-[0.1em] leading-snug">
                  群眾長期打不贏引擎 = 你最重要的真相之一 · 也是 /track-record 的彈藥(57% 天花板)。
                </p>
              </>
            ) : (
              <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
                樣本還太薄 —— 還沒有任何一場累積到 {5} 個人押。 先別讀這個訊號(小群假裝群眾共識
                = 報馬仔手法,我們不幹)· 等同一場有夠多人押,這塊自動亮。
              </p>
            )}
          </div>
        </section>

        {/* ── 區 D · 內容供給(策展待辦)── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-10">
          <p className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-1">
            / 大家在押什麼 · 你下一批 curate 的待辦
          </p>
          <p className="font-mono text-mute/55 text-[10px] tracking-[0.1em] mb-5">
            這是「往哪個聯賽/玩法擴」的訊號 · 不是給用戶看的人氣榜
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-bone text-sm tracking-tight mb-3">各運動占比</p>
              <DistGroup
                rows={ins.supply.bySport.map((s) => ({
                  label: `${s.label} ${s.pct}%`,
                  count: s.locks,
                }))}
              />
              <p className="mt-3 font-mono text-mute/65 text-[11px] tracking-[0.08em]">
                誰贏 <span className="text-bone tabular">{ins.supply.whoWins}</span> 筆 · 玩法(大小分/讓分){" "}
                <span className="text-bone tabular">{ins.supply.props}</span> 筆
              </p>
            </div>
            <div>
              <p className="text-bone text-sm tracking-tight mb-3">最熱的場(被最多人鎖)</p>
              {ins.supply.hotMatches.length > 0 ? (
                <ul className="space-y-1.5 list-none pl-0 m-0">
                  {ins.supply.hotMatches.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-3 border-b border-line/30 pb-1.5"
                    >
                      <span className="min-w-0 text-mute text-[13px] truncate">{h.label}</span>
                      <span className="shrink-0 font-mono text-gold tabular text-sm">
                        {kc(h.count)} 人
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-mute/55 text-sm">還沒有押注。</p>
              )}
            </div>
          </div>
        </section>

        {/* ── 區 E · 背景脈搏(最淡 · 刻意排最後)── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-10">
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.3em] mb-1">
            / 每日脈搏 · 近 30 天鎖定筆數
          </p>
          <p className="font-mono text-mute/45 text-[10px] tracking-[0.1em] mb-3">
            純生命徵象(最接近虛榮 → 只當背景,不當決策依據)
          </p>
          <Pulse30 data={ins.dailyPulse} />
        </section>

        {/* ── 流量誠實註(out-of-scope)── */}
        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-8">
          <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mb-2">
            / 這頁刻意沒有「流量」
          </p>
          <p className="text-mute/85 text-sm leading-relaxed max-w-2xl">
            這頁只挖你的押注帳本 —— 它<strong className="text-bone">算不出</strong>「多少訪客來、從哪來、看了哪頁」。
            那種流量數字必須裝分析工具,而能裝的<strong className="text-bone">只有不監視個人的隱私型</strong>
            (Cloudflare Web Analytics 免費 / Plausible)· 絕不是 GA4 / FB 像素 / 熱圖(那會讓頁尾「不追蹤你」變謊言)。
            就連那一步,也要你親手開帳號、我再把 /privacy 改誠實 —— 所以刻意不塞進這個第一方儀表板。
          </p>
        </section>

        <FounderSignOff>
          <p>
            這裡每個數字只有一個用途:幫我決定下一場 curate 哪一局、下一批 ingest 哪些賽事。
            <strong>它不是用來自我感覺良好的。</strong> 真正的記分牌不在這個後台,在公開的
            /track-record —— 任何人都能翻,輸的也照掛。
          </p>
          <p>
            哪天我盯這頁的時間,比盯自己公開戰績還多,就是這個反追蹤的站開始走偏的信號。
            一個能改變我下一個決定的數字才配看;不能的,關掉。
          </p>
        </FounderSignOff>

        <section className="mx-auto max-w-4xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/admin"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回管理台 · /admin
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// ── 大數字小卡(同 /admin KpiCard 語彙)──
function Kpi({
  zh,
  value,
  hint,
}: {
  zh: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="p-4 sm:p-5 border border-gold/30 bg-slate/30">
      <p className="font-mono text-mute text-[10px] tracking-[0.25em] mb-3">{zh}</p>
      <p className="font-mono text-bone tabular text-3xl sm:text-4xl font-light leading-none mb-2">
        {value}
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.18em] leading-relaxed">
        {hint}
      </p>
    </div>
  );
}

// null(<5)在縮放時當 4 估,顯示仍是 "<5"
const K_FOR_SCALE = 4;

// ── 分布條組(k-匿名:null → "<5" + 極細條)──
function DistGroup({ rows }: { rows: { label: string; count: KCount }[] }) {
  const max = Math.max(1, ...rows.map((r) => (r.count === null ? K_FOR_SCALE : r.count)));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => {
        const n = r.count === null ? K_FOR_SCALE : r.count;
        const pct = r.count === null ? 6 : Math.max(2, Math.round((n / max) * 100));
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="w-20 sm:w-24 shrink-0 font-mono text-mute text-[11px] tracking-[0.06em] truncate">
              {r.label}
            </span>
            <div className="flex-1 h-2 bg-line/40 rounded-sm overflow-hidden">
              <div className="h-full bg-gold/70" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-9 shrink-0 text-right font-mono text-bone tabular text-sm">
              {r.count === null ? "<5" : r.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
// ── 命中率條(0-100)──
function AccBar({ label, pct }: { label: string; pct: number | null }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 font-mono text-mute text-[11px] tracking-[0.06em]">{label}</span>
      <div className="flex-1 h-2 bg-line/40 rounded-sm overflow-hidden">
        <div className="h-full bg-gold/70" style={{ width: `${pct ?? 0}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-gold tabular text-sm">
        {pct === null ? "—" : `${pct}%`}
      </span>
    </div>
  );
}

// ── 30 天脈搏(極簡 inline 柱 · 無圖表庫)──
function Pulse30({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-[3px] h-16" aria-hidden="true">
      {data.map((d, i) => (
        <div
          key={i}
          title={`${d.day} · ${d.count}`}
          className="flex-1 bg-gold/45 min-h-[1px]"
          style={{ height: `${Math.max(2, Math.round((d.count / max) * 100))}%` }}
        />
      ))}
    </div>
  );
}
