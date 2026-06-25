"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getFollowState,
  toggleFollow,
  type FollowState,
} from "@/lib/follows-client";

// ── ZONE 27 · 追蹤這份帳本(/u/[code] 上的追蹤鈕)──────────────────────────
// liveness 層:讓你把一份信得過的含輸帳本加進「我追蹤的」· 之後在 /pulse 切「只看我追的」
// 就能一眼看到他剛在哪場賽前鎖了手。
//
// 🔴 紅線(同 0025 / liveness 設計):
//   · 追的是「校準曲線」不是人氣 —— 這顆鈕旁永遠不放粉絲數 / 追蹤數。
//   · 追蹤名單私密 —— 你追了誰只有你自己看得到(server 端 RLS 保證)。
//   · 絕不一鍵跟單 —— 只是「追這份帳本」· 不碰押注、不複製單。
//
// graceful:載入中 / 自己的檔案 / 0025 未套 → 整顆不佔版面(回 null)· 未登入 → 安靜登入提示。
// 自我認定全在 server(get_follow_state 用 auth.uid())· 這裡不算 md5、不知道任何人是誰。
// ─────────────────────────────────────────────────────

export default function FollowLedgerButton({
  targetCode,
}: {
  targetCode: string;
}) {
  const [state, setState] = useState<FollowState | null>(null); // null = 載入中
  const [busy, setBusy] = useState(false);
  // 掛載旗標 · 初次查詢與點擊切換的 await 回來後都先確認還沒卸載才 setState。
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    getFollowState(targetCode).then((s) => {
      if (mountedRef.current) setState(s);
    });
    return () => {
      mountedRef.current = false;
    };
  }, [targetCode]);

  // 載入中 / 自己的檔案 / 0025 未套 → 不佔版面
  if (state === null || state === "self" || state === "unavailable") return null;

  // 未登入:安靜的登入提示(誠實 · 不假裝已能追蹤 · 順帶轉換)
  if (state === "anon") {
    return (
      <div className="mt-5">
        <Link
          href={`/login?next=${encodeURIComponent(`/u/${targetCode}`)}`}
          className="inline-flex items-center font-mono text-mute/60 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
        >
          登入後可追蹤這份帳本 →
        </Link>
      </div>
    );
  }

  const following = state === "following";

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    const prev = state;
    // 樂觀切換(回應即時)· 失敗則退回原狀態
    setState(following ? "not_following" : "following");
    const res = await toggleFollow(targetCode);
    if (!mountedRef.current) return; // 切換途中已卸載 → 不對已卸載元件 setState
    // 正常切換 → 套新狀態;session 中途過期(res='anon')→ 重現登入提示(不假裝成功);
    // 其餘(unavailable/self)→ 退回點擊前狀態。
    setState(
      res === "following" || res === "not_following" || res === "anon"
        ? res
        : prev,
    );
    setBusy(false);
  };

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-pressed={following}
        className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] px-3.5 py-2 transition-colors disabled:opacity-50 ${
          following
            ? "border border-gold/45 text-gold/85 hover:border-gold/75"
            : "border border-line/70 text-mute hover:text-gold hover:border-gold/50"
        }`}
      >
        {following ? "已追蹤這份帳本" : "追蹤這份帳本"}
      </button>
      <p className="mt-1.5 font-mono text-mute/45 text-[9px] tracking-[0.12em] leading-relaxed max-w-xs">
        {following
          ? "他賽前鎖手時,會出現在你「只看我追的」脈動裡 · 你追了誰只有你自己看得到、隨時可取消。"
          : "把這份帳本加進你的觀察名單 —— 他下次賽前鎖手,你第一個看到。 追的是準度,不是人氣 · 名單私密、不公開。"}
      </p>
    </div>
  );
}
