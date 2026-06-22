"use client";

// ── ZONE 27 · Admin Console(WordPress 式點擊後台 · 零 SQL)──────────
// Tim 2026-06-02:「不會操作…沒辦法像 WordPress 點擊就行?」 → 打 email、打金額、
// 按按鈕。 完成。 全程 0 SQL。 後端 is_admin() gate 把關(migration 0011)·
// 非 admin 看不到工具(且就算硬打 RPC 也被 server 擋)。
// 「手動金流」(#13)= Tim 親自點按鈕確認每筆 · 不是自動扣款 · 不違反。
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAdminStatus,
  claimAdmin,
  adminGivePoints,
  adminSetTier,
  adminMembers,
  adminRecentContent,
  adminViewContent,
  adminDelete,
  adminAuditRecent,
  type AdminStatus,
  type AdminMember,
  type AdminContentRow,
  type AdminFullContent,
  type AdminAuditRow,
} from "@/lib/admin";
import { getMembershipStatus, formatUntilShort, nextMemberUntil } from "@/lib/membership";

const TIER_ZH: Record<string, string> = {
  free: "OPEN",
  black: "BLACK",
  // GOLD 付費層已收掉 · 只剩單一付費層 BLACK · 舊資料若仍是 founder 顯示為 BLACK
  founder: "BLACK(舊 GOLD)",
};
const KIND_ZH: Record<AdminContentRow["kind"], string> = {
  creator_post: "分析",
  creator_comment: "留言",
  game_post: "討論室",
};

export default function AdminConsole() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [content, setContent] = useState<AdminContentRow[]>([]);
  const [audit, setAudit] = useState<AdminAuditRow[]>([]);
  const [claiming, setClaiming] = useState(false);

  const reloadMembers = async () => setMembers(await adminMembers());
  const reloadAudit = async () => setAudit(await adminAuditRecent());
  // 刪除後同時刷新內容清單 + 審核留痕
  const reloadContent = async () => {
    setContent(await adminRecentContent());
    setAudit(await adminAuditRecent());
  };

  const loadAll = async () => {
    setMembers(await adminMembers());
    setContent(await adminRecentContent());
    setAudit(await adminAuditRecent());
  };

  useEffect(() => {
    (async () => {
      const s = await getAdminStatus();
      setStatus(s);
      if (s.isAdmin) await loadAll();
    })();
  }, []);

  const onClaim = async () => {
    setClaiming(true);
    const ok = await claimAdmin();
    setClaiming(false);
    if (ok) {
      const s = await getAdminStatus();
      setStatus(s);
      await loadAll();
    }
  };

  if (status === null) {
    return (
      <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">載入中...</p>
    );
  }

  if (!status.loggedIn) {
    return (
      <div className="border border-gold/30 bg-slate/30 p-6 text-center">
        <p className="text-bone text-base mb-4">先用你的 email 登入,才能管理。</p>
        <Link
          href="/login?next=/admin"
          className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
        >
          登入 →
        </Link>
      </div>
    );
  }

  if (!status.isAdmin) {
    if (!status.hasAnyAdmin) {
      return (
        <div className="border border-gold/50 bg-gold/5 p-6 text-center">
          <p className="text-bone text-base mb-2">還沒有人是管理員。</p>
          <p className="text-mute/85 text-sm mb-5 leading-relaxed max-w-md mx-auto">
            按一下把<strong className="text-gold">你自己</strong>設成管理員(只有第一個人能設,
            設完就鎖死、別人搶不走)。 <strong className="text-bone">現在就設,別等。</strong>
          </p>
          <button
            type="button"
            onClick={onClaim}
            disabled={claiming}
            className="inline-block px-6 py-3 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50"
          >
            {claiming ? "設定中..." : "把我設為管理員 →"}
          </button>
        </div>
      );
    }
    return (
      <div className="border border-loss/30 bg-loss/5 p-6 text-center">
        <p className="text-mute text-sm">這頁的管理功能只有管理員能用 · 你不是管理員。</p>
      </div>
    );
  }

  // ── ADMIN console ──
  return (
    <div className="space-y-5">
      <ExpiringCard members={members} />
      <GivePointsCard onDone={reloadMembers} />
      <SetTierCard onDone={reloadMembers} members={members} />
      <MembersCard members={members} onReload={reloadMembers} />
      <ModerationCard content={content} onReload={reloadContent} />
      <AuditCard audit={audit} onReload={reloadAudit} />
    </div>
  );
}

// ── 共用小元件 ──
function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gold/30 bg-slate/30 p-5 sm:p-6">
      <p className="font-mono text-gold/90 text-[11px] tracking-[0.3em] mb-1">{title}</p>
      {hint && (
        <p className="text-mute/70 text-[12px] leading-relaxed mb-4">{hint}</p>
      )}
      {!hint && <div className="mb-4" />}
      {children}
    </div>
  );
}

function Field({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 placeholder:text-mute/55 font-mono text-sm transition-colors ${className}`}
    />
  );
}

function ActionBtn({
  onClick,
  busy,
  label,
}: {
  onClick: () => void;
  busy: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="shrink-0 px-5 py-2 bg-gold text-navy font-mono text-xs tracking-[0.25em] hover:bg-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {busy ? "處理中" : label}
    </button>
  );
}

function ResultMsg({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null;
  return (
    <p
      role="status"
      className={`mt-3 font-mono text-[11px] tracking-[0.15em] ${
        msg.ok ? "text-gold/90" : "text-loss/85"
      }`}
    >
      {msg.ok ? "✓ " : "⚠ "}
      {msg.text}
    </p>
  );
}

// ── 加點數 ──
function GivePointsCard({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [ref, setRef] = useState("");
  const [mode, setMode] = useState<"add" | "deduct">("add"); // 加點 / 扣點(扣回加錯)
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async () => {
    // 點擊選方向(非工程師不用記負數)· abs 防使用者又自己打負號變雙重否定
    const raw = Math.abs(Number(amount));
    if (!email.trim() || !raw) {
      setMsg({ ok: false, text: "填對方 email + 點數。" });
      return;
    }
    const signed = mode === "deduct" ? -raw : raw;
    setBusy(true);
    setMsg(null);
    const res = await adminGivePoints(email.trim(), signed, ref.trim());
    setBusy(false);
    if (res.ok) {
      setMsg({
        ok: true,
        text:
          mode === "deduct"
            ? `已扣回 ${raw} 點 · ${email.trim()}`
            : `已加 ${raw} 點給 ${email.trim()}`,
      });
      setEmail("");
      setAmount("");
      setRef("");
      onDone();
    } else {
      setMsg({ ok: false, text: res.msg });
    }
  };

  return (
    <Card
      title="加 / 扣 點數"
      hint="加點 = 有人轉帳入金後記一筆;扣點 = 加錯了扣回。 點上面選方向 → 打 email + 點數 → 按按鈕。 帳本每筆都留痕(餘額 = 全部加總)· 這就是你的手動確認(不自動扣款)。"
    >
      {/* 加 / 扣 點擊選方向 · 不用記負數(per「營運動作一律點擊」)*/}
      <div className="flex gap-1.5 mb-3">
        <button
          type="button"
          onClick={() => setMode("add")}
          aria-pressed={mode === "add"}
          className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] border transition-colors ${
            mode === "add"
              ? "border-gold bg-gold/10 text-gold"
              : "border-line/60 text-mute hover:border-gold/40"
          }`}
        >
          ＋ 加點(入金)
        </button>
        <button
          type="button"
          onClick={() => setMode("deduct")}
          aria-pressed={mode === "deduct"}
          className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] border transition-colors ${
            mode === "deduct"
              ? "border-loss bg-loss/10 text-loss"
              : "border-line/60 text-mute hover:border-loss/40"
          }`}
        >
          − 扣點(扣回加錯)
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Field value={email} onChange={setEmail} placeholder="會員 email" className="flex-1 min-w-[180px]" />
        <Field value={amount} onChange={setAmount} placeholder="點數" type="number" className="w-24" />
        <Field
          value={ref}
          onChange={setRef}
          placeholder={mode === "deduct" ? "原因(選填)" : "轉帳末5碼(選填)"}
          className="w-40"
        />
        <ActionBtn onClick={submit} busy={busy} label={mode === "deduct" ? "扣回" : "加點"} />
      </div>
      <ResultMsg msg={msg} />
    </Card>
  );
}

// ── 標付費等級 ──
function SetTierCard({ onDone, members }: { onDone: () => void; members: AdminMember[] }) {
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<"free" | "black" | "founder">("black");
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async () => {
    if (!email.trim()) {
      setMsg({ ok: false, text: "填對方 email。" });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await adminSetTier(email.trim(), tier, ref.trim());
    setBusy(false);
    if (res.ok) {
      // 設 BLACK → 順手算到期日顯示給 Tim(可轉告對方「你的 BLACK 有效到 X」)· 鏡 SQL 同公式。
      let extra = "";
      if (tier !== "free") {
        const existing = members.find(
          (m) => m.email.toLowerCase() === email.trim().toLowerCase(),
        )?.memberUntil;
        extra = ` · 有效到 ${formatUntilShort(nextMemberUntil(existing))}`;
      }
      setMsg({
        ok: true,
        text: `${email.trim()} 設為「${TIER_ZH[tier]}」${extra} · 對方下次登入生效`,
      });
      setEmail("");
      setRef("");
      onDone();
    } else {
      setMsg({ ok: false, text: res.msg });
    }
  };

  return (
    <Card title="標記付費會員(收到會員費後)" hint="打對方 email、選等級、(可順手記轉帳末5碼)→ 按「設定」。 對方重新登入後就解鎖,這筆也會進下方「審核紀錄」對帳。">
      <div className="flex flex-wrap gap-2 items-stretch">
        <Field value={email} onChange={setEmail} placeholder="會員 email" className="flex-1 min-w-[180px]" />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as "free" | "black" | "founder")}
          className="bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 font-mono text-sm transition-colors"
        >
          <option value="black">BLACK</option>
          <option value="free">OPEN(取消付費)</option>
        </select>
        <Field
          value={ref}
          onChange={setRef}
          placeholder="轉帳末5碼(選填)"
          className="w-36"
        />
        <ActionBtn onClick={submit} busy={busy} label="設定" />
      </div>
      <ResultMsg msg={msg} />
    </Card>
  );
}

// 到期欄:付費 → 日期 + 剩幾天(快到期/已過用金色,讓 Tim 一眼看出該提醒誰)· 免費 → —
function MemberUntilCell({ tier, until }: { tier: string; until: string }) {
  const ms = getMembershipStatus({ tier, member_until: until });
  if (!ms.paid) return <span className="text-mute/40">—</span>;
  if (ms.state === "undated") return <span className="text-mute/55">未設定</span>;
  const d = formatUntilShort(until);
  if (ms.state === "expired") return <span className="text-gold">{d} · 已過</span>;
  if (ms.state === "expiring")
    return (
      <span className="text-gold">
        {d} · 剩 {ms.daysLeft} 天
      </span>
    );
  return (
    <span className="text-mute/80">
      {d} · 剩 {ms.daysLeft} 天
    </span>
  );
}

// ── 該提醒誰續費(快到期 / 已過期 的付費會員 · 平靜資訊、不催繳)──────────
// 後台研究結論:後台 = 待辦收件匣。 membership.ts 已算好 expiring/expired,但散在整份
// 會員表裡要用眼睛找金色字 → 這裡把「今天該提醒誰」濾出來放最上面。 沒有人快到期
// 就整塊隱藏(graceful)。 只給資訊 · 不紅字、不倒數、不催繳(平靜對帳語氣)。
function ExpiringCard({ members }: { members: AdminMember[] }) {
  const soon = members
    .map((m) => ({
      m,
      ms: getMembershipStatus({ tier: m.tier, member_until: m.memberUntil }),
    }))
    .filter(
      (x) => x.ms.paid && (x.ms.state === "expiring" || x.ms.state === "expired"),
    )
    .sort((a, b) => {
      const rank = (s: typeof a) => (s.ms.state === "expired" ? 0 : 1);
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      return (a.ms.daysLeft ?? 0) - (b.ms.daysLeft ?? 0);
    });
  if (soon.length === 0) return null; // 沒有人快到期 → 整塊不顯示

  return (
    <Card
      title={`該提醒續費(${soon.length})`}
      hint="快到期或已過期的付費會員 —— 你親手提醒一下就好(不自動扣款)。 只是資訊,沒有催繳。"
    >
      <div className="space-y-1.5">
        {soon.map(({ m, ms }) => (
          <div
            key={m.email}
            className="flex items-baseline justify-between gap-3 border-t border-line/30 pt-1.5 first:border-t-0 first:pt-0"
          >
            <span className="text-bone/90 text-[13px] break-all min-w-0">
              {m.email}
            </span>
            <span className="shrink-0 font-mono text-gold text-[11px] tabular tracking-[0.1em]">
              {ms.state === "expired"
                ? `${formatUntilShort(m.memberUntil)} · 已過`
                : `剩 ${ms.daysLeft} 天`}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── 會員列表 ──
function MembersCard({
  members,
  onReload,
}: {
  members: AdminMember[];
  onReload: () => void;
}) {
  return (
    <Card title={`會員(${members.length})`}>
      <button
        type="button"
        onClick={onReload}
        className="mb-3 font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
      >
        ↻ 重新整理
      </button>
      {members.length === 0 ? (
        <p className="font-mono text-mute/55 text-[11px] tracking-[0.2em]">還沒有會員。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="font-mono text-mute/60 text-[9px] tracking-[0.25em]">
                <th className="py-1.5 pr-3 font-normal">信箱</th>
                <th className="py-1.5 pr-3 font-normal">等級</th>
                <th className="py-1.5 pr-3 font-normal">到期</th>
                <th className="py-1.5 font-normal tabular">餘額</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.email} className="border-t border-line/30">
                  <td className="py-2 pr-3 text-bone/90 text-[13px] break-all">{m.email}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={`font-mono text-[10px] tracking-[0.15em] ${
                        m.tier === "free" ? "text-mute/70" : "text-gold"
                      }`}
                    >
                      {TIER_ZH[m.tier] ?? m.tier}
                    </span>
                  </td>
                  <td className="py-2 pr-3 font-mono text-[11px] tabular">
                    <MemberUntilCell tier={m.tier} until={m.memberUntil} />
                  </td>
                  <td className="py-2 font-mono text-bone/85 text-[13px] tabular">
                    {m.balanceNtd} 點
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ── 文章 / 留言審核 ──
function ModerationCard({
  content,
  onReload,
}: {
  content: AdminContentRow[];
  onReload: () => void;
}) {
  return (
    <Card
      title={`最近文章 / 留言(${content.length})· 違規就刪`}
      hint="點「看全文」讀完整內容(付費分析的內文也看得到 · 審核用)→ 違規填原因 → 刪除。 刪除會留痕(下方審核紀錄)。"
    >
      <button
        type="button"
        onClick={onReload}
        className="mb-3 font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
      >
        ↻ 重新整理
      </button>
      {content.length === 0 ? (
        <p className="font-mono text-mute/55 text-[11px] tracking-[0.2em]">還沒有人發表。</p>
      ) : (
        <div className="space-y-2">
          {content.map((row) => (
            <ModRow key={`${row.kind}-${row.id}`} row={row} onDeleted={onReload} />
          ))}
        </div>
      )}
    </Card>
  );
}

// 一則內容 · 可展開看全文(含付費)+ 填原因刪除(留痕)
function ModRow({
  row,
  onDeleted,
}: {
  row: AdminContentRow;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState<AdminFullContent | null>(null);
  const [loadingFull, setLoadingFull] = useState(false);
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && full === null && !loadingFull) {
      setLoadingFull(true);
      setFull(await adminViewContent(row.kind, row.id));
      setLoadingFull(false);
    }
  };

  const onDelete = async () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`確定刪除這則${KIND_ZH[row.kind]}?刪了救不回(會留痕)。`)
    ) {
      return;
    }
    setDeleting(true);
    setErr(null);
    const res = await adminDelete(row.kind, row.id, reason.trim());
    setDeleting(false);
    if (res.ok) onDeleted();
    else setErr(res.msg);
  };

  return (
    <div className="border-t border-line/30 pt-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-gold/80 text-[9px] tracking-[0.2em] px-1 py-0.5 border border-gold/30">
              {KIND_ZH[row.kind]}
            </span>
            <span className="font-mono text-mute/80 text-[10px] tracking-[0.15em]">
              {row.handle}
            </span>
          </p>
          <p className="mt-1 text-bone/80 text-[13px] leading-snug break-all">
            {row.snippet || "（無文字）"}
          </p>
        </div>
        <div className="shrink-0 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={toggle}
            className="px-3 py-1.5 border border-gold/40 text-gold/85 font-mono text-[10px] tracking-[0.2em] hover:bg-gold/10 transition-colors"
          >
            {open ? "收合" : "看全文"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-2 border border-line/50 bg-ink/40 p-3">
          {loadingFull ? (
            <p className="font-mono text-mute/55 text-[10px] tracking-[0.25em]">載入中...</p>
          ) : full === null ? (
            <p className="text-mute/70 text-[12px] leading-relaxed">
              讀不到全文(這功能還沒開通)· 上方摘要仍可審。
            </p>
          ) : (
            <>
              {full.title && (
                <p className="text-bone text-sm font-medium mb-1">{full.title}</p>
              )}
              {full.priceNtd !== null && full.priceNtd > 0 && (
                <p className="font-mono text-gold/70 text-[10px] tracking-[0.2em] mb-1">
                  付費分析 · {full.priceNtd} 點
                </p>
              )}
              <p className="text-bone/85 text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                {full.body || "（無內文）"}
              </p>
              {full.ref && (
                <p className="mt-2 font-mono text-mute/45 text-[9px] tracking-[0.15em] break-all">
                  {full.ref}
                </p>
              )}
            </>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line/40 pt-3">
            <Field
              value={reason}
              onChange={setReason}
              placeholder="刪除原因(選填 · 會留痕)"
              className="flex-1 min-w-[160px]"
            />
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="shrink-0 px-3 py-2 border border-loss/50 text-loss/85 font-mono text-[10px] tracking-[0.2em] hover:bg-loss/10 transition-colors disabled:opacity-50"
            >
              {deleting ? "刪除中" : "刪除這則"}
            </button>
          </div>
          {err && (
            <p className="mt-2 font-mono text-loss/85 text-[11px] tracking-[0.15em]">⚠ {err}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── 審核留痕(透明 · 自己對自己留痕 = 公開揭露的審核權)──
function AuditCard({
  audit,
  onReload,
}: {
  audit: AdminAuditRow[];
  onReload: () => void;
}) {
  return (
    <Card
      title={`紀錄(${audit.length})`}
      hint="你刪了什麼、改了誰的等級、何時、為什麼 —— 都留痕。 這就是「公開揭露 + 留痕」的審核權(不是秘密上帝視角 · 同你的 disclosure 護城河)。"
    >
      <button
        type="button"
        onClick={onReload}
        className="mb-3 font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.25em] transition-colors"
      >
        ↻ 重新整理
      </button>
      {audit.length === 0 ? (
        <p className="font-mono text-mute/55 text-[11px] tracking-[0.2em]">
          還沒有任何紀錄。
        </p>
      ) : (
        <div className="space-y-2">
          {audit.map((a, i) => {
            const isDelete = a.action === "delete";
            const actionLabel = isDelete
              ? `刪除 ${KIND_ZH[a.targetKind as AdminContentRow["kind"]] ?? a.targetKind}`
              : a.action === "set_tier"
              ? "設等級"
              : a.action || "動作";
            return (
              <div key={i} className="border-t border-line/30 pt-2">
                <p className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className={`font-mono text-[9px] tracking-[0.2em] px-1 py-0.5 border ${
                      isDelete
                        ? "text-loss/75 border-loss/30"
                        : "text-gold/75 border-gold/30"
                    }`}
                  >
                    {actionLabel}
                  </span>
                  <span className="font-mono text-mute/55 text-[9px] tracking-[0.15em] tabular">
                    {a.createdAt.slice(0, 16).replace("T", " ")}
                  </span>
                </p>
                <p className="mt-1 text-mute/80 text-[12px] leading-snug break-all">
                  {a.targetSnippet || "（無內容快照）"}
                </p>
                {a.reason && (
                  <p className="mt-0.5 font-mono text-mute/55 text-[10px] tracking-[0.1em]">
                    {isDelete ? "原因:" : "末5碼:"}
                    {a.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
