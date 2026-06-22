"use client";

import { useState } from "react";
import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/brand-constants";

// ── ZONE 27 · 回報表單(任何人 · 含匿名訪客 · 0 登入摩擦)──────────────────────
// 一句話就能回報。 不用登入、不用留個資(聯絡方式選填)。 送出 → /api/feedback → 寄給站長。
// honeypot(隱藏 website 欄)擋 bot。 送出當下抓 document.referrer 當「在哪一頁發現的」。
// 失敗 → 不讓回報石沉大海:顯示直接寄信的後備(SUPPORT_EMAIL)。
// ─────────────────────────────────────────────────────

type FormState = "idle" | "sending" | "sent" | "error";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // honeypot · 真人留空
  const [state, setState] = useState<FormState>("idle");

  const tooShort = message.trim().length < 4;

  const submit = async () => {
    if (tooShort) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          contact: contact.trim() || null,
          path:
            typeof document !== "undefined" ? document.referrer || null : null,
          website,
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (res.ok && json?.ok) {
        setState("sent");
        setMessage("");
        setContact("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="border border-gold/40 bg-gold/[0.04] p-6 sm:p-8 text-center">
        <p className="text-bone text-lg font-light tracking-tight mb-2">
          收到了 · 謝謝你 🙏
        </p>
        <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
          你讓 ZONE 27 更好了一點。 我們修好的問題,會公開記在{" "}
          <Link
            href="/corrections"
            className="text-gold underline-offset-4 hover:underline"
          >
            我們搞砸過的事
          </Link>
          。
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-5 font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
        >
          再回報一個 →
        </button>
      </div>
    );
  }

  return (
    <div className="border border-line/60 bg-slate/30 p-5 sm:p-7">
      <label
        htmlFor="fb-message"
        className="block mb-2 font-mono text-gold/80 text-[10px] tracking-[0.3em]"
      >
        你發現了什麼?
      </label>
      <textarea
        id="fb-message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (state === "error") setState("idle");
        }}
        rows={5}
        placeholder="算錯了?壞了?看不懂?跑不動?哪裡怪怪的都可以 —— 越具體越好(在哪一頁、按了什麼、看到什麼)。"
        className="w-full bg-ink/60 border border-line/70 text-bone px-4 py-3 outline-none focus:border-gold/60 placeholder:text-mute/50 text-sm leading-relaxed resize-y transition-colors"
      />

      <label
        htmlFor="fb-contact"
        className="block mt-4 mb-2 font-mono text-mute/70 text-[10px] tracking-[0.3em]"
      >
        想讓我們回覆?留個 email 或 LINE(選填)
      </label>
      <input
        id="fb-contact"
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="選填 · 不留也沒關係"
        className="w-full bg-ink/60 border border-line/70 text-bone px-4 py-2.5 outline-none focus:border-gold/60 placeholder:text-mute/50 font-mono text-sm transition-colors"
      />

      {/* honeypot · 真人看不到(推到畫面外)· bot 填了就被後端擋掉 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
      />

      {state === "error" && (
        <p className="mt-3 text-loss/85 text-[12px] leading-relaxed">
          {tooShort ? (
            "多寫一點點(至少幾個字),我才知道怎麼修。"
          ) : (
            <>
              暫時送不出去 · 你也可以直接寄到{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-gold underline-offset-4 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              。
            </>
          )}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={state === "sending"}
        className="mt-5 inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[11px] tracking-[0.3em] hover:bg-gold-soft transition-colors disabled:opacity-50"
      >
        {state === "sending" ? "送出中…" : "送出回報 →"}
      </button>

      <p className="mt-4 font-mono text-mute/45 text-[9px] tracking-[0.15em] leading-relaxed">
        ▸ 不用登入 · 不用留個資 · 我們不存你的資料(只把這則寄給站長)。
      </p>
    </div>
  );
}
