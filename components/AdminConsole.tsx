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
  adminDelete,
  type AdminStatus,
  type AdminMember,
  type AdminContentRow,
} from "@/lib/admin";

const TIER_ZH: Record<string, string> = {
  free: "OPEN",
  black: "BLACK",
  founder: "FOUNDER",
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
  const [claiming, setClaiming] = useState(false);

  const reloadMembers = async () => setMembers(await adminMembers());
  const reloadContent = async () => setContent(await adminRecentContent());

  useEffect(() => {
    (async () => {
      const s = await getAdminStatus();
      setStatus(s);
      if (s.isAdmin) {
        setMembers(await adminMembers());
        setContent(await adminRecentContent());
      }
    })();
  }, []);

  const onClaim = async () => {
    setClaiming(true);
    const ok = await claimAdmin();
    setClaiming(false);
    if (ok) {
      const s = await getAdminStatus();
      setStatus(s);
      setMembers(await adminMembers());
      setContent(await adminRecentContent());
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
      <GivePointsCard onDone={reloadMembers} />
      <SetTierCard onDone={reloadMembers} />
      <MembersCard members={members} onReload={reloadMembers} />
      <ModerationCard content={content} onReload={reloadContent} />
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
function SetTierCard({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<"free" | "black" | "founder">("black");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async () => {
    if (!email.trim()) {
      setMsg({ ok: false, text: "填對方 email。" });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await adminSetTier(email.trim(), tier);
    setBusy(false);
    if (res.ok) {
      setMsg({
        ok: true,
        text: `${email.trim()} 設為「${TIER_ZH[tier]}」· 對方下次登入生效`,
      });
      setEmail("");
      onDone();
    } else {
      setMsg({ ok: false, text: res.msg });
    }
  };

  return (
    <Card title="標記付費會員(收到會員費後)" hint="打對方 email、選等級 → 按「設定」。 對方重新登入後就解鎖。">
      <div className="flex flex-wrap gap-2 items-stretch">
        <Field value={email} onChange={setEmail} placeholder="會員 email" className="flex-1 min-w-[180px]" />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as "free" | "black" | "founder")}
          className="bg-ink/60 border border-line/70 text-bone px-3 py-2 outline-none focus:border-gold/60 font-mono text-sm transition-colors"
        >
          <option value="black">BLACK</option>
          <option value="founder">FOUNDER</option>
          <option value="free">OPEN(取消付費)</option>
        </select>
        <ActionBtn onClick={submit} busy={busy} label="設定" />
      </div>
      <ResultMsg msg={msg} />
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
                <th className="py-1.5 pr-3 font-normal">EMAIL</th>
                <th className="py-1.5 pr-3 font-normal">等級</th>
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
  const [deleting, setDeleting] = useState<string | null>(null);

  const onDelete = async (row: AdminContentRow) => {
    if (typeof window !== "undefined" && !window.confirm(`確定刪除這則${KIND_ZH[row.kind]}?刪了救不回。`)) {
      return;
    }
    setDeleting(row.id);
    const res = await adminDelete(row.kind, row.id);
    setDeleting(null);
    if (res.ok) onReload();
    else if (typeof window !== "undefined") window.alert(res.msg);
  };

  return (
    <Card title={`最近文章 / 留言(${content.length})· 違規就刪`}>
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
            <div
              key={`${row.kind}-${row.id}`}
              className="flex items-start justify-between gap-3 border-t border-line/30 pt-2"
            >
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
              <button
                type="button"
                onClick={() => onDelete(row)}
                disabled={deleting === row.id}
                className="shrink-0 px-3 py-1.5 border border-loss/50 text-loss/85 font-mono text-[10px] tracking-[0.2em] hover:bg-loss/10 transition-colors disabled:opacity-50"
              >
                {deleting === row.id ? "刪除中" : "刪除"}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
