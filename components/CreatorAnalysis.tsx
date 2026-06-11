"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getCreatorPosts,
  getMyCreatorPost,
  submitCreatorPost,
  getCreatorRecords,
  gradeAuthorRecords,
  type CreatorPost,
  type AuthorRecord,
} from "@/lib/creator-posts";
import {
  readTier,
  isPaid as isPaidTier,
  creatorTakePct,
  creatorFeePct,
  tierLabel,
  type MemberTier,
} from "@/lib/tier";
import { getWalletBalance, buyCreatorPost, type BuyResult } from "@/lib/wallet";
import {
  getCreatorComments,
  submitCreatorComment,
  type CreatorComment,
} from "@/lib/creator-comments";
import { matchHasStarted } from "@/lib/matches";
import { getMyPrediction } from "@/lib/predictions-market";
import { isProfileCode } from "@/lib/profile-code";
import Avatar from "@/components/Avatar";
import {
  mentionToken,
  creatorIdentity,
  type ResolvedCreatorIdentity,
} from "@/lib/identity";
import { resolveTierByCode } from "@/lib/tier-client";

// ── ZONE 27 · CreatorAnalysis · 創作者賣分析(migration 0005)──────
// Tim 2026-05-30 報馬仔/明燈 screenshot · 要:發文 + 推薦賽事(選邊)+ 寫分析 +
// (Phase 2)賣文章 · 賽後自動評勝敗。 ZONE 27 版 = 押的邊賽前鎖、賽後自動掛
// 準/不準、刪不掉 = 賴不掉的戰績(報馬仔輸了刪文 · 這裡刪不掉)。
//
// v1:免費分析 + 選邊 + 賽後自動 grade(對本場 finalWinner)。
// Phase 2:賣文章(price + 手動銀行轉帳購買)· 跨場戰績滾進海選天梯。
// GRACEFUL:migration 0005 未套用 / anon → 空狀態 · 不 crash。
// ─────────────────────────────────────────────────────

const T_MAX = 80;
const B_MAX = 2000;
// 賣文價位 · 勾選不自填 · 圓整誠實(不玩 99/168 賭場 charm pricing = 品牌宣言)。
// 上限綁會員階級:BLACK ≤ 200(衝動帶)· GOLD ≤ 500(頂級分析師
// premium · 年費會員的實質好處)。 免費會員只能免費發(建戰績 · 還不能賣)。
const PRICE_OPTIONS = [0, 50, 100, 200, 300, 500] as const;
function tierPriceMax(tier: MemberTier): number {
  return tier === "founder" ? 500 : 200; // black → 200 · founder → 500
}

type Status = "loading" | "anonymous" | "open" | "posted";

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  finalWinner?: "home" | "away" | "tie" | null;
  /** 全站已結算賽果 map · 給作者戰績 badge 評分用(賽果在 app 端 · 不在 DB)*/
  finalResults?: Record<string, "home" | "away" | "tie">;
  /** 已結算場的開賽時間 map(matchId→ISO)· 給徽章「先鎖後結」過濾(發文 ≥ 開賽不算進徽章)*/
  matchStarts?: Record<string, string>;
  /** 開賽 instant ISO · 開賽後關閉「發新分析」(選邊賽前鎖 · 賽後只能討論)· 缺則 fail-open */
  startISO?: string | null;
};

export default function CreatorAnalysis({
  matchId,
  homeName,
  awayName,
  finalWinner,
  finalResults = {},
  matchStarts = {},
  startISO,
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  // 先鎖後結:已開賽即不收新分析(選邊會進「已驗證準度」徽章 · 賽後補發=可造假
  // → 反轉品牌命門)· 留言討論不受影響(那層不評分)。 effect 內算 · 無 hydration 風險。
  const [started, setStarted] = useState(false);
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [records, setRecords] = useState<Record<string, AuthorRecord>>({});
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  // O2 · 你在這場押的那邊(getMyPrediction)· 用來預填分析推薦邊 → 解「選邊兩次」困惑。
  const [myBet, setMyBet] = useState<"home" | "away" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<MemberTier>("free"); // 付費會員才能標價賣
  const [price, setPrice] = useState(0); // NT$ · 0 = 免費發
  const [balance, setBalance] = useState(0); // 錢包餘額(NT$ · 1 點 = NT$1)

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) setStarted(matchHasStarted(startISO));
      const list = await getCreatorPosts(matchId);
      if (!cancelled) setPosts(list);
      // 作者公開戰績 · 撈全站選邊紀錄 → 對賽果評分 → 每位作者命中率(badge 用)
      getCreatorRecords().then((rows) => {
        if (!cancelled)
          setRecords(gradeAuthorRecords(rows, finalResults, matchStarts));
      });
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          setStatus("anonymous");
          return;
        }
        setTier(
          readTier(user.user_metadata as Record<string, unknown> | undefined)
        );
        getWalletBalance().then((b) => {
          if (!cancelled) setBalance(b);
        });
        // O2 · 撈你在這場押的那邊 → 開發表時預填同一邊(一鍵可改)= 不用「再選一次」
        const bet = await getMyPrediction(matchId);
        if (cancelled) return;
        setMyBet(bet);
        const my = await getMyCreatorPost(matchId);
        if (cancelled) return;
        if (my) {
          setStatus("posted");
        } else {
          setStatus("open");
          // 預填押注那邊(若有押)· pick 仍 null 才填 = 不蓋掉手動選擇
          if (bet) setPick((cur) => cur ?? bet);
        }
      } catch {
        if (!cancelled) setStatus("anonymous");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, startISO]);

  const submit = async () => {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b || !pick) return;
    setSaving(true);
    setError(null);
    // 付費會員才可標價(price>0)· 免費會員一律免費發(price 0)· 夾在該階級上限內
    const sellPrice = isPaidTier(tier)
      ? Math.min(tierPriceMax(tier), Math.max(0, Math.round(price)))
      : 0;
    const res = await submitCreatorPost(matchId, t, b, pick, sellPrice);
    if (res.ok) {
      setStatus("posted");
      setTitle("");
      setBody("");
      setPick(null);
      setPrice(0);
      const list = await getCreatorPosts(matchId);
      setPosts(list);
    } else if (res.reason === "already_posted") {
      setStatus("posted");
    } else if (res.reason === "not_logged_in") {
      setStatus("anonymous");
    } else if (res.reason === "invalid") {
      setError("標題 ≤80 字、內容 ≤2000 字,並選一邊。");
    } else {
      setError("送出失敗 · 請再試一次。");
    }
    setSaving(false);
  };

  // 用點數買付費分析(原子扣款 · 成功 → 重抓 posts 解鎖 + 更新餘額)
  const handleBuy = async (postId: string): Promise<BuyResult> => {
    const res = await buyCreatorPost(postId);
    if (res.ok) {
      setBalance(res.balance);
      const list = await getCreatorPosts(matchId);
      setPosts(list);
    } else if (res.reason === "insufficient") {
      setBalance(res.balance);
    }
    return res;
  };

  return (
    <section
      aria-label="創作者分析 · 發表分析 · 選邊 · 賽後自動評準度"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8"
      id="creator-analysis"
    >
      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <p className="font-mono text-gold text-[9px] tracking-[0.4em]">/ 看法 · 分析</p>
        <span className="font-mono text-mute/55 text-[9px] tracking-[0.25em]">
          {posts.length} 篇 · 選一邊 · 賽後自動評準度
        </span>
      </div>
      {/* displacement weapon · 報馬仔挑好看的窗 + 輸了刪文;這裡賽前鎖、賽後
          自動評、連輸的都掛、刪不掉 = 作者賴不掉的戰績 = 讀者敢信。 */}
      <p className="mb-5 text-mute/85 text-[13px] leading-relaxed max-w-2xl">
        每位作者名字旁那個 <span className="text-gold font-medium">✓ 已驗證準度</span> 章 ——
        是 ZONE 27 從他<span className="text-bone">每一手鎖死的紀錄</span>自動算的:賽前選邊鎖死、
        賽後自動掛準/不準、<span className="text-gold">連輸的全留著、刪不掉</span>。
        賣明牌的站掛「近 15 天 77 過 55」是自己挑窗、輸的刪掉;<span className="text-bone">這個章他永遠掛不出來</span>。
      </p>

      {/* posts */}
      {posts.length > 0 ? (
        <div className="space-y-3 mb-6">
          {posts.map((p, i) => {
            // 永久碼 key(改名洗不掉)· 戰績 lookup + 顯示身分都走 creatorIdentity 同一把
            const id = creatorIdentity(p);
            return (
              <PostCard
                key={`${id.key}-${i}`}
                post={p}
                identity={id}
                homeName={homeName}
                awayName={awayName}
                finalWinner={finalWinner}
                record={records[id.key]}
                loggedIn={status === "open" || status === "posted"}
                balance={balance}
                onBuy={handleBuy}
              />
            );
          })}
        </div>
      ) : (
        <p className="mb-6 font-mono text-mute/55 text-[11px] tracking-[0.2em]">
          還沒有人發表分析 · 當第一個。
        </p>
      )}

      {/* compose */}
      <div className="p-4 sm:p-5 border border-line/60 bg-slate/30">
        {status === "loading" && (
          <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">載入中...</p>
        )}

        {status === "anonymous" && (
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <span className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
              ▸ 登入就能發表你的分析(免費)
            </span>
            <Link
              href={`/login?next=${encodeURIComponent(`/matches/${matchId}#creator-analysis`)}`}
              className="inline-block px-4 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors"
            >
              → 登入後發表
            </Link>
          </div>
        )}

        {/* 已開賽 · 不收新分析(選邊賽前鎖死才算數)· 但討論不擋:到任一篇下面留言 */}
        {status === "open" && started && (
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
            ▸ 此場已開賽 · 不再收新分析 ——
            <span className="text-mute/85">推薦選邊賽前鎖死才算進「已驗證準度」</span>
            (賽後補發 = 報馬仔挑窗,正是這裡要擋的)。 想聊?到上面任一篇分析下面
            <span className="text-gold/80">留言、回覆作者</span>都可以。
          </p>
        )}

        {status === "open" && !started && (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              maxLength={T_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="一句話標題 · 例「今晚壓主隊,投手差很多」"
              className="w-full bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 placeholder:text-mute/60 font-mono text-sm transition-colors"
            />
            <textarea
              rows={4}
              value={body}
              maxLength={B_MAX}
              onChange={(e) => setBody(e.target.value)}
              placeholder="你的看法 / 分析"
              className="w-full bg-ink/60 border border-line/70 text-bone px-3 py-2.5 outline-none focus:border-gold/60 placeholder:text-mute/60 font-mono text-sm leading-relaxed transition-colors"
            />
            {/* R195 · 解「選邊兩次」困惑(押注用「押」、分析推薦用「看好」)。
                O2(R200)· 已押者把推薦邊預填成押注那邊(一鍵可改)→ 預設情況不用再選一次。 */}
            <div className="flex flex-col gap-2">
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.15em] leading-relaxed">
                這篇分析你看好哪邊?
                {myBet ? (
                  <span className="text-mute/55">
                    (已預填你押的那邊 · 想公開推薦另一邊直接點另一顆 · 賽後一樣自動掛準度)
                  </span>
                ) : (
                  <span className="text-mute/55">
                    (跟你上面的押注分開 · 這是公開給讀者看的推薦 · 賽後一樣自動掛準度)
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <PickBtn label={`看好 ${homeName.slice(0, 5)}`} active={pick === "home"} onClick={() => setPick("home")} />
                <PickBtn label={`看好 ${awayName.slice(0, 5)}`} active={pick === "away"} onClick={() => setPick("away")} />
                {myBet && pick === myBet && (
                  <span className="font-mono text-gold/55 text-[9px] tracking-[0.15em]">
                    ✓ 你押的那邊
                  </span>
                )}
              </div>
            </div>
            {/* 標價賣分析:付費會員可標價(你拿 90-95%)· 免費會員只能免費發 + 升級提示。
                買了才解鎖(migration 0008 · server 端 gate body)= 賣得出去的前提。 */}
            {isPaidTier(tier) ? (
              <div className="border-t border-line/40 pt-3 space-y-2">
                <label className="block font-mono text-mute/70 text-[10px] tracking-[0.2em]">
                  標價賣(NT$ · 0 = 免費):
                </label>
                {/* 預設價位 · 勾選不自填 · 圓整誠實(不玩 99 把戲)· 上限綁階級 */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRICE_OPTIONS.filter((p) => p <= tierPriceMax(tier)).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrice(p)}
                      aria-pressed={price === p}
                      className={`px-2.5 py-1.5 font-mono text-[11px] tracking-[0.15em] border transition-colors tabular ${
                        price === p
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-line/60 text-mute hover:border-gold/40"
                      }`}
                    >
                      {p === 0 ? "免費" : p}
                    </button>
                  ))}
                </div>
                {price > 0 ? (
                  <p className="font-mono text-mute/70 text-[10px] tracking-[0.12em] leading-relaxed">
                    ▸ 標題 + 推薦邊公開 · 完整內文買了才看得到(防免費複製)· 賣出 NT$ {price} · 你拿{" "}
                    <span className="text-gold tabular">
                      {Math.round((price * creatorTakePct(tier)) / 100)}
                    </span>{" "}
                    元(<span className="text-gold">{creatorTakePct(tier)}%</span> · 平台抽{" "}
                    {creatorFeePct(tier)}%)· 賽後一樣自動掛準度。
                  </p>
                ) : (
                  <p className="font-mono text-mute/60 text-[10px] tracking-[0.12em] leading-relaxed">
                    ▸ 免費發 · 點上面的數字即變付費分析(你是 {tierLabel(tier)} · 抽成{" "}
                    {creatorFeePct(tier)}%)。
                  </p>
                )}
                {/* 心理學 · 價格 = 證明(玩運彩給不了)· 不玩 99 把戲 = 品牌宣言 */}
                <p className="font-mono text-mute/45 text-[9px] tracking-[0.1em] leading-relaxed">
                  ▸ 我們不玩「99 元」那種心理把戲 · 價格乾淨。 賣越貴 · 越要你名字旁的{" "}
                  <span className="text-gold/70">✓ 已驗證準度</span> 撐得起(買家看的是真戰績 · 不是話術)。
                  新手先 0–50 建口碑 · 準度上來再升價。
                  {tier !== "founder" &&
                    "（BLACK 上限 NT$ 200;GOLD 可賣到 NT$ 500）"}
                </p>
              </div>
            ) : (
              <p className="border-t border-line/40 pt-3 font-mono text-mute/60 text-[10px] tracking-[0.12em] leading-relaxed">
                ▸ 先免費發 · 賽後自動掛準度(刪不掉)。 想
                <span className="text-gold/80">標價賣分析變現</span>?{" "}
                <Link
                  href="/membership"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  升級會員 →
                </Link>
              </p>
            )}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-mono text-mute/55 text-[10px] tracking-[0.2em] tabular">
                {title.trim().length}/{T_MAX} · {body.trim().length}/{B_MAX}
              </span>
              <button
                type="button"
                onClick={submit}
                disabled={saving || !title.trim() || !body.trim() || !pick}
                className="px-5 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "送出中..." : "發表分析"}
              </button>
            </div>
          </div>
        )}

        {status === "posted" && (
          <p className="font-mono text-gold text-[10px] tracking-[0.25em] leading-relaxed">
            ✓ 您已發表本場分析 · <span className="text-mute/80">預測一場一篇(鎖死、賽後自動評準度)· 但討論不限 —— 到任一篇分析下面留言、回覆讀者都可以。</span>
          </p>
        )}

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="font-mono text-loss text-[10px] tracking-[0.25em] mt-3"
          >
            ⚠ {error}
          </p>
        )}
      </div>
    </section>
  );
}

function PostCard({
  post: p,
  identity: id,
  homeName,
  awayName,
  finalWinner,
  record,
  loggedIn,
  balance,
  onBuy,
}: {
  post: CreatorPost;
  identity: ResolvedCreatorIdentity;
  homeName: string;
  awayName: string;
  finalWinner?: "home" | "away" | "tie" | null;
  record?: AuthorRecord;
  loggedIn: boolean;
  balance: number;
  onBuy: (postId: string) => Promise<BuyResult>;
}) {
  const pickName = p.pick === "home" ? homeName : awayName;
  const graded = finalWinner && finalWinner !== "tie";
  const correct = graded && p.pick === finalWinner;
  const [buying, setBuying] = useState(false);
  const [buyMsg, setBuyMsg] = useState<string | null>(null);
  const [insufficient, setInsufficient] = useState(false);
  // 作者付費身分(金環)· cache 去重 · graceful(0023 未套 → free 不顯示)· 永遠次於準度章
  const [authorTier, setAuthorTier] = useState<MemberTier>("free");
  useEffect(() => {
    let alive = true;
    resolveTierByCode(id.key).then((t) => {
      if (alive) setAuthorTier(t);
    });
    return () => {
      alive = false;
    };
  }, [id.key]);
  const authorSupporter = isPaidTier(authorTier);

  const doBuy = async () => {
    setBuying(true);
    setBuyMsg(null);
    setInsufficient(false);
    const res = await onBuy(p.postId);
    if (!res.ok) {
      if (res.reason === "insufficient") {
        setInsufficient(true);
        setBuyMsg(`餘額不足(餘額 NT$ ${res.balance})`);
      } else if (res.reason === "not_logged_in") {
        setBuyMsg("請先登入");
      } else {
        setBuyMsg("購買失敗 · 請重試");
      }
    }
    // ok → 父層 re-fetch posts → 本卡重繪成已解鎖
    setBuying(false);
  };

  return (
    // id=post-{postId} = per-post 錨點 · /member「你的東西」的「重看 →」直接捲到買的那篇
    // (同場多人發分析時不必再掃)· scroll-mt-24 避免被 sticky nav 蓋住。
    <article
      id={`post-${p.postId}`}
      className="scroll-mt-24 p-4 sm:p-5 border border-line/60 bg-slate/30"
    >
      <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
        <span className="flex items-center gap-2 flex-wrap">
          {/* 作者身分連到公開含輸檔案 /u/[code](永久碼)· 讀完分析 → 一鍵驗證「他到底多準·含輸」
              = 創作者可信度迴路(報馬仔換馬甲也賴不掉)。 舊 RPC 無永久碼 → 不連(graceful)。 */}
          {isProfileCode(id.key) ? (
            <Link
              href={`/u/${id.key}`}
              title="看這位的公開含輸戰績"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar seed={id.seed} glyph={id.glyph} size={26} supporter={authorSupporter} />
              <span className="font-mono text-bone text-[11px] tracking-[0.2em]">{id.label}</span>
              {id.code && (
                <span className="font-mono text-mute/45 text-[9px] tracking-[0.15em]">
                  {id.code}
                </span>
              )}
            </Link>
          ) : (
            <>
              <Avatar seed={id.seed} glyph={id.glyph} size={26} supporter={authorSupporter} />
              <span className="font-mono text-bone text-[11px] tracking-[0.2em]">{id.label}</span>
              {id.code && (
                <span
                  title="永久代號 · 改名也認得出同一人 · 戰績綁這個碼"
                  className="font-mono text-mute/45 text-[9px] tracking-[0.15em]"
                >
                  {id.code}
                </span>
              )}
            </>
          )}
          <span className="font-mono text-gold/80 text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/40">
            推薦 {pickName.slice(0, 5)}
          </span>
        </span>
        {graded && (
          <span
            className={`font-mono text-[10px] tracking-[0.2em] px-1.5 py-0.5 border ${
              correct ? "border-gold text-gold" : "border-loss/70 text-loss"
            }`}
          >
            {correct ? "✓ 準" : "✕ 不準"}
          </span>
        )}
      </div>

      {/* 作者公開戰績 badge · 玩運彩「近 N 過 Y」的誠實版(全撈 · 連輸的都算)*/}
      <AuthorBadge record={record} />

      <h4 className="text-bone text-base font-light tracking-tight mb-1.5">{p.title}</h4>
      {p.isPaid && !p.purchased ? (
        <div className="mt-2 border border-gold/30 bg-gold/5 px-3 py-3">
          <p className="font-mono text-gold/90 text-[11px] tracking-[0.2em] mb-1">
            完整分析 · 鎖定 · NT$ {p.priceNtd}
          </p>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.12em] leading-relaxed mb-3">
            標題 + 推薦哪一邊免費看 · 完整內文買了才解鎖。 賽後一樣自動掛準度(賣家賴不掉)。
          </p>
          {loggedIn ? (
            <>
              <button
                type="button"
                onClick={doBuy}
                disabled={buying}
                className="inline-block px-4 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buying ? "購買中..." : `用點數買 NT$ ${p.priceNtd}`}
              </button>
              <span className="ml-2 font-mono text-mute/60 text-[10px] tracking-[0.15em]">
                餘額 NT$ {balance}
              </span>
              {buyMsg && (
                <p
                  role="alert"
                  className="mt-2 font-mono text-loss/85 text-[10px] tracking-[0.15em] leading-relaxed"
                >
                  {buyMsg}
                  {insufficient && (
                    <>
                      {" · "}
                      <Link
                        href="/member"
                        className="text-gold underline-offset-4 hover:underline"
                      >
                        去儲值 →
                      </Link>
                    </>
                  )}
                </p>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] hover:bg-gold-soft transition-colors"
            >
              登入後用點數買 →
            </Link>
          )}
          <p className="mt-2 font-mono text-mute/50 text-[9px] tracking-[0.15em] leading-relaxed">
            點數買 · 不自動扣款 · 買了立即解鎖。
          </p>
        </div>
      ) : (
        <>
          {p.isPaid && p.purchased && (
            <p className="mb-1.5 font-mono text-gold/80 text-[9px] tracking-[0.25em]">
              ✓ 已購買 · 已解鎖
            </p>
          )}
          <p className="text-bone/85 text-sm leading-relaxed whitespace-pre-wrap">
            {p.body}
          </p>
        </>
      )}

      {/* 回覆串 · 分析下的對話層(讀者↔作者 · 買家↔賣家)· 預測仍鎖死一場一篇,
          回覆無上限不評分 = 拿到互動、不丟問責 · per Tim R185 dogfood · migration 0010 */}
      <CommentThread
        postId={p.postId}
        loggedIn={loggedIn}
        homeName={homeName}
        awayName={awayName}
      />
    </article>
  );
}

// 回覆 body 開頭若是 @某詞 → 染金 · 其餘原樣。 認「@ + 一串非空白」(regex)·
// 自動 @(@#xxxx / @名字)或手打的(@2b8e59f9)都亮 —— 比對完整 handle 太脆(原 bug)。
function renderCommentBody(body: string) {
  const m = body.match(/^@(\S+)/);
  if (m) {
    return (
      <>
        <span className="text-gold/80">@{m[1]}</span>
        {body.slice(m[0].length)}
      </>
    );
  }
  return body;
}

// ── 回覆串 · 分析下的對話層 ──────────────────────────────
// flat thread(不深層巢狀 · 乾淨)· 折疊預設(subtraction-first · 點開才載入)·
// 登入可回覆 · 作者本人的回覆標「作者」(解 Tim「賣家回覆買家」)。 GRACEFUL:
// 0010 未套用 → 空串 + 送出回「開通中」· 不 crash。 預測一場一篇不動,這只是對話。
// 留言者本場持倉的「押了哪邊」白話標籤(棒球 home/away · 足球 draw=和局 · 沒押→空)。
function positionSideLabel(
  pick: "home" | "away" | "draw" | null,
  homeName: string,
  awayName: string,
): string {
  if (pick === "home") return homeName.slice(0, 5);
  if (pick === "away") return awayName.slice(0, 5);
  if (pick === "draw") return "和局";
  return "";
}

function CommentThread({
  postId,
  loggedIn,
  homeName,
  awayName,
}: {
  postId: string;
  loggedIn: boolean;
  homeName: string;
  awayName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [comments, setComments] = useState<CreatorComment[]>([]);
  // 留言者付費身分(金環)· code → tier · 載入留言後一次解析(cache 去重)· graceful
  const [tierMap, setTierMap] = useState<Map<string, MemberTier>>(new Map());
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // 回覆某位留言者(非作者)· @ 標記扁平串(Polymarket/X 式 · 不做巢狀)
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const startReply = (handle: string) => {
    setReplyTo(handle);
    requestAnimationFrame(() => taRef.current?.focus());
  };

  const load = async () => {
    const list = await getCreatorComments(postId);
    setComments(list);
    setLoaded(true);
    // 留言者付費身分(金環)· 去重後逐碼解析 · resolveTierByCode 內含 cache/inflight 去重 ·
    // graceful(0023 未套 / 非永久碼 → free 不顯示)· 永遠次於問責(本場已押 / 永久碼)。
    const keys = Array.from(new Set(list.map((c) => creatorIdentity(c).key)));
    const pairs = await Promise.all(
      keys.map(async (k) => [k, await resolveTierByCode(k)] as const),
    );
    setTierMap(new Map(pairs));
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !loaded) load();
  };

  const send = async () => {
    const b = text.trim();
    if (!b) return;
    setSending(true);
    setErr(null);
    // 回覆某人 → body 前綴 @乾淨短碼(扁平串裡看得出在回誰 · 0 migration · 純文字)
    const finalBody = replyTo ? `@${mentionToken(replyTo)} ${b}` : b;
    const res = await submitCreatorComment(postId, finalBody);
    if (res.ok) {
      setText("");
      setReplyTo(null);
      await load();
    } else if (res.reason === "not_logged_in") {
      setErr("請先登入再回覆。");
    } else if (res.reason === "invalid") {
      setErr("回覆 1–500 字。");
    } else {
      setErr("送出失敗 · 請再試一次。");
    }
    setSending(false);
  };

  // 舊 RPC 沒回 post_id → 無法綁回覆 · 不顯示(graceful)
  if (!postId) return null;

  return (
    <div className="mt-3 pt-3 border-t border-line/30">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.2em] transition-colors"
      >
        {loaded ? `${comments.length} 則討論` : "留言 · 回覆作者"} {open ? "▾" : "▸"}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {loaded && comments.length === 0 && (
            <p className="font-mono text-mute/55 text-[10px] tracking-[0.2em]">
              還沒有人留言 · 留第一則。
            </p>
          )}
          {comments.map((c, i) => {
            const cid = creatorIdentity(c);
            return (
            <div key={i} className="border-l-2 border-line/40 pl-3">
              <p className="flex items-center gap-2 flex-wrap">
                {/* 留言者身分連到公開含輸檔案 /u/[code](永久碼)= 一鍵驗證「他到底多準·含輸」·
                    跟分析作者同一條迴路(報馬仔換馬甲也賴不掉)。 舊 RPC 無永久碼 → 不連(graceful)。 */}
                {isProfileCode(cid.key) ? (
                  <Link
                    href={`/u/${cid.key}`}
                    title="看這位的公開含輸戰績"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Avatar seed={cid.seed} glyph={cid.glyph} size={20} supporter={isPaidTier(tierMap.get(cid.key) ?? "free")} />
                    <span className="font-mono text-bone/90 text-[10px] tracking-[0.15em]">
                      {cid.label}
                    </span>
                    {cid.code && (
                      <span className="font-mono text-mute/45 text-[8px] tracking-[0.12em]">
                        {cid.code}
                      </span>
                    )}
                  </Link>
                ) : (
                  <>
                    <Avatar seed={cid.seed} glyph={cid.glyph} size={20} supporter={isPaidTier(tierMap.get(cid.key) ?? "free")} />
                    <span className="font-mono text-bone/90 text-[10px] tracking-[0.15em]">
                      {cid.label}
                    </span>
                    {/* 永久碼章 · 改名洗不掉(留言者也認得出同一人) */}
                    {cid.code && (
                      <span className="font-mono text-mute/45 text-[8px] tracking-[0.12em]">
                        {cid.code}
                      </span>
                    )}
                  </>
                )}
                {c.isAuthor && (
                  <span className="font-mono text-gold/90 text-[8px] tracking-[0.2em] px-1 py-0.5 border border-gold/40">
                    作者
                  </span>
                )}
                {/* 本場持倉徽章 · costly signal(有帳本 vs 嘴砲)· migration 0020 ·
                    這位在本場有鎖死的一注 = 不是嘴砲;沒押則不標(留白本身就是訊號)。 */}
                {c.hasPosition && (
                  <span
                    title="這位在本場有一注鎖死的押注(押了不能改 · 賽後當眾對帳)· 點頭像看他含輸的公開戰績"
                    className="inline-flex items-center font-mono text-gold/85 text-[8px] tracking-[0.18em] px-1 py-0.5 border border-gold/40 bg-gold/5 whitespace-nowrap"
                  >
                    ✓ 本場已押
                    {positionSideLabel(c.positionPick, homeName, awayName) &&
                      ` · ${positionSideLabel(c.positionPick, homeName, awayName)}`}
                  </span>
                )}
              </p>
              <p className="mt-1 text-bone/80 text-[13px] leading-relaxed whitespace-pre-wrap">
                {renderCommentBody(c.body)}
              </p>
              {/* 回覆鈕放內容下方(Twitter/X 慣例位置)+ 金色加底線 = 找得到
                  (原本灰 9px 藏在名字旁 · Tim「找不到」)*/}
              {loggedIn && (
                <button
                  type="button"
                  onClick={() => startReply(c.handle)}
                  className="mt-2 inline-flex items-center font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.2em] underline underline-offset-2 decoration-gold/40 hover:decoration-gold transition-colors"
                >
                  ↳ 回覆
                </button>
              )}
            </div>
            );
          })}

          {loggedIn ? (
            <div className="flex flex-col gap-1.5">
              {replyTo && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gold/80 text-[9px] tracking-[0.15em]">
                    ↳ 回覆 @{mentionToken(replyTo)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="font-mono text-mute/85 hover:text-loss text-[9px] tracking-[0.15em] transition-colors"
                  >
                    ✕ 取消
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  ref={taRef}
                  rows={2}
                  value={text}
                  maxLength={500}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={replyTo ? `回覆 ${replyTo}` : "回覆這篇分析 / 問作者問題"}
                  className="flex-1 bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 placeholder:text-mute/55 font-mono text-[13px] leading-relaxed transition-colors"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={sending || !text.trim()}
                  className="shrink-0 px-4 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.2em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "送出中" : "回覆"}
                </button>
              </div>
            </div>
          ) : (
            <p className="font-mono text-mute/60 text-[10px] tracking-[0.2em]">
              ▸ 登入後可回覆 / 問作者
            </p>
          )}
          {err && (
            <p role="alert" className="font-mono text-loss/85 text-[10px] tracking-[0.15em]">
              ⚠ {err}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── 作者「已驗證準度」徽章 · 誠實三態 ──────────────────────
// 這是 brand 的靈魂 mark(Substack Bestseller 式 · 但用真實準度換 · 不可造假):
// ZONE 27 從每一手鎖死的紀錄自動算 · 連輸的都算進去 · 報馬仔挑窗刪輸的 → 永遠掛不出。
// 把「數字」升級成「身分章」: ✓ 已驗證 = status · % = detail。
//   新分析師(0 結算)/ ✓ 已驗證·累積中(1-9)/ ✓ 已驗證準度 + 上天梯(≥10)。
function AuthorBadge({ record }: { record?: AuthorRecord }) {
  // 沒戰績(0007 未套用 / 新人 / 還沒結算)→ 誠實「新分析師」+ 從第一手起就賴不掉
  if (!record || record.n === 0) {
    return (
      <p className="mb-2 font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed">
        新分析師 · 從第一手起就鎖死 · 賽後自動掛準/不準 · 連輸的都算、刪不掉
      </p>
    );
  }
  const { n, hits, rate, onLadder } = record;
  const misses = n - hits;
  if (!onLadder) {
    // 1-9 場 · 已驗證但樣本不夠上天梯 · 不裸吹勝率(同 N≥10 才掛準度的誠實)
    return (
      <div className="mb-2 flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-baseline gap-1 px-1.5 py-0.5 border border-gold/40 bg-gold/5 font-mono text-gold/85 text-[9px] tracking-[0.18em] whitespace-nowrap">
          ✓ 已驗證 · 累積中
        </span>
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.15em]">
          近 <span className="text-bone tabular">{n}</span> 場 ·{" "}
          <span className="text-gold/80 tabular">✓{hits}</span>{" "}
          <span className="text-loss/70 tabular">✕{misses}</span> · 還差{" "}
          <span className="text-bone tabular">{10 - n}</span> 場上天梯
        </span>
      </div>
    );
  }
  // ≥10 場 · 已上海選天梯 · 「✓ 已驗證準度」章 = 報馬仔掛不出來的那個 mark
  return (
    <div className="mb-2 flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-baseline gap-1 px-1.5 py-0.5 border border-gold/60 bg-gold/10 glow-soft font-mono text-gold text-[9px] tracking-[0.18em] whitespace-nowrap">
        ✓ 已驗證準度
      </span>
      <Link
        href="/ladder"
        className="inline-flex items-baseline gap-2 flex-wrap font-mono text-[10px] tracking-[0.15em] group"
      >
        <span className="text-gold tabular text-[12px] font-medium">{rate}% 準</span>
        <span className="text-mute/70">
          近 <span className="text-bone tabular">{n}</span> 場 ·{" "}
          <span className="text-gold/80 tabular">✓{hits}</span>{" "}
          <span className="text-loss/70 tabular">✕{misses}</span>
        </span>
        <span className="text-gold/70 group-hover:text-gold transition-colors">· 海選天梯 →</span>
      </Link>
    </div>
  );
}

function PickBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] border transition-colors ${
        active
          ? "border-gold bg-gold/10 text-gold"
          : "border-line/60 text-mute hover:border-gold/40"
      }`}
    >
      {label}
    </button>
  );
}
