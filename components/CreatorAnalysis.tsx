"use client";

import { useEffect, useState } from "react";
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

type Status = "loading" | "anonymous" | "open" | "posted";

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  finalWinner?: "home" | "away" | "tie" | null;
  /** 全站已結算賽果 map · 給作者戰績 badge 評分用(賽果在 app 端 · 不在 DB)*/
  finalResults?: Record<string, "home" | "away" | "tie">;
};

export default function CreatorAnalysis({
  matchId,
  homeName,
  awayName,
  finalWinner,
  finalResults = {},
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [records, setRecords] = useState<Record<string, AuthorRecord>>({});
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<MemberTier>("free"); // 付費會員才能標價賣
  const [price, setPrice] = useState(0); // NT$ · 0 = 免費發
  const [balance, setBalance] = useState(0); // 錢包餘額(NT$ · 1 點 = NT$1)

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await getCreatorPosts(matchId);
      if (!cancelled) setPosts(list);
      // 作者公開戰績 · 撈全站選邊紀錄 → 對賽果評分 → 每位作者命中率(badge 用)
      getCreatorRecords().then((rows) => {
        if (!cancelled) setRecords(gradeAuthorRecords(rows, finalResults));
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
        const my = await getMyCreatorPost(matchId);
        if (cancelled) return;
        if (my) {
          setStatus("posted");
        } else {
          setStatus("open");
        }
      } catch {
        if (!cancelled) setStatus("anonymous");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const submit = async () => {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b || !pick) return;
    setSaving(true);
    setError(null);
    // 付費會員才可標價(price>0)· 免費會員一律免費發(price 0)
    const sellPrice = isPaidTier(tier) ? Math.max(0, Math.round(price)) : 0;
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
      setError("發表系統正在開通中 · 請稍後再試。");
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
        每位作者旁邊掛的是<span className="text-bone">真實累積戰績</span> —— 賽前選邊鎖死、賽後自動掛準/不準、
        <span className="text-gold">連輸的都留著、刪不掉</span>。 不是「近 15 天挑好看的」,是全部。
      </p>

      {/* posts */}
      {posts.length > 0 ? (
        <div className="space-y-3 mb-6">
          {posts.map((p, i) => (
            <PostCard
              key={`${p.handle}-${i}`}
              post={p}
              homeName={homeName}
              awayName={awayName}
              finalWinner={finalWinner}
              record={records[p.handle]}
              loggedIn={status === "open" || status === "posted"}
              balance={balance}
              onBuy={handleBuy}
            />
          ))}
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

        {status === "open" && (
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em]">推薦:</span>
              <PickBtn label={`押 ${homeName.slice(0, 5)}`} active={pick === "home"} onClick={() => setPick("home")} />
              <PickBtn label={`押 ${awayName.slice(0, 5)}`} active={pick === "away"} onClick={() => setPick("away")} />
            </div>
            {/* 標價賣分析:付費會員可標價(你拿 90-95%)· 免費會員只能免費發 + 升級提示。
                買了才解鎖(migration 0008 · server 端 gate body)= 賣得出去的前提。 */}
            {isPaidTier(tier) ? (
              <div className="border-t border-line/40 pt-3 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="font-mono text-mute/70 text-[10px] tracking-[0.2em]">
                    標價賣(NT$ · 0 = 免費):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={2000}
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 bg-ink/60 border border-line/70 text-bone px-2 py-1.5 outline-none focus:border-gold/60 font-mono text-sm tabular transition-colors"
                  />
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
                    ▸ 0 = 免費發 · 填金額即變付費分析(你是 {tierLabel(tier)} · 抽成{" "}
                    {creatorFeePct(tier)}%)。
                  </p>
                )}
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
          <p className="font-mono text-gold text-[10px] tracking-[0.3em]">
            ✓ 您已發表本場分析 · 一場一篇 · 賽後自動評準度
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
  homeName,
  awayName,
  finalWinner,
  record,
  loggedIn,
  balance,
  onBuy,
}: {
  post: CreatorPost;
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
    <article className="p-4 sm:p-5 border border-line/60 bg-slate/30">
      <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-bone text-[11px] tracking-[0.2em]">{p.handle}</span>
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
            🔒 完整分析 · NT$ {p.priceNtd}
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
            點數買 · 0 自動扣款 · 買了立即解鎖。
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
    </article>
  );
}

// ── 作者戰績 badge · 誠實三態 ────────────────────────────
// 新分析師(0 結算)/ 累積中(1-9)/ 已上天梯(≥10)。 報馬仔掛「近 16 日
// 77 過 55」挑窗 + 刪輸的;這裡全撈、連輸的都算 · 賴不掉。
function AuthorBadge({ record }: { record?: AuthorRecord }) {
  // 沒戰績(0007 未套用 / 新人 / 還沒結算)→ 誠實「新分析師」
  if (!record || record.n === 0) {
    return (
      <p className="mb-2 font-mono text-mute/60 text-[10px] tracking-[0.15em]">
        新分析師 · 戰績從這場開始累積 · 賽後自動掛、刪不掉
      </p>
    );
  }
  const { n, hits, rate, onLadder } = record;
  const misses = n - hits;
  if (!onLadder) {
    // 1-9 場 · 樣本還不夠上天梯 · 不裸吹勝率(同 SAMPLE DEBT 誠實)
    return (
      <p className="mb-2 font-mono text-mute/70 text-[10px] tracking-[0.15em]">
        近 <span className="text-bone tabular">{n}</span> 場 ·{" "}
        <span className="text-gold/80 tabular">✓{hits}</span>{" "}
        <span className="text-loss/70 tabular">✕{misses}</span> · 還差{" "}
        <span className="text-bone tabular">{10 - n}</span> 場上天梯
      </p>
    );
  }
  // ≥10 場 · 已上海選天梯 · 命中率可掛
  return (
    <Link
      href="/ladder"
      className="mb-2 inline-flex items-baseline gap-2 flex-wrap font-mono text-[10px] tracking-[0.15em] group"
    >
      <span className="text-gold tabular text-[12px] font-medium">{rate}% 準</span>
      <span className="text-mute/70">
        近 <span className="text-bone tabular">{n}</span> 場 ·{" "}
        <span className="text-gold/80 tabular">✓{hits}</span>{" "}
        <span className="text-loss/70 tabular">✕{misses}</span>
      </span>
      <span className="text-gold/70 group-hover:text-gold transition-colors">· 海選天梯 →</span>
    </Link>
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
