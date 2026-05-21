# 🔧 Supabase Project · One-time setup checklist

> Round 30 Wave 12+ · 2026-05-22 · 寫於 Tim 第一次真實 register 觸發
> Site URL bug 後 · 永久 reference doc 防再踩同坑。

ZONE 27 用 Supabase Tokyo (ap-northeast-1) project name `zone27-prod`。
本檔列 Tim 必須在 Supabase Dashboard 設好的 project config · 不能從 code
改、必須 Tim 親手點。 每次有結構性變化(新 domain · 新 auth flow ·
custom email template 等)都該回來 update。

---

## 🚨 CRITICAL · Auth URL Configuration

**位置:** Dashboard → Authentication → URL Configuration

**為什麼重要:** Supabase 寄 magic link / confirmation email 時 · 用
`{{ .SiteURL }}` 變數構造連結。 如果 Site URL 是 `localhost:3000` ·
真實 visitor 在手機 / 別電腦點 link 會死。 這是 **預設值** · 必須在
上 production 前改。

### 1. Site URL

```
https://zone27-web.vercel.app
```

(將來換 brand domain · 例如 zone27.tw · 改這裡。)

### 2. Redirect URLs (allowlist)

加以下 patterns(`**` wildcard 支援所有 sub-path):

```
https://zone27-web.vercel.app/**
http://localhost:3000/**
```

第 2 行保留 dev 用。 Production deploy 不影響 · Supabase 兩個都
allow · safe。

---

## 📧 CRITICAL · Email Template · Linear pattern · BOTH link AND 6-digit code

**位置:** Dashboard → Authentication → Email Templates

**為什麼這個是 critical:** Per Round 30 W13b agent research(2026 auth UX 統計)·
Supabase `@supabase/ssr` PKCE flow 強制 magic link 必須在 same browser 開 ·
cross-device(desktop 填 form · phone 開 email)= 100% fail。

**解法 = Linear pattern:** 同封 email 寄 **magic link + 6-digit OTP code 兩個** ·
visitor 同 device 可點 link · 跨 device 可貼 6-碼 code 到 /login SentState 的
verify form(Wave 13b ship)。 Same brand axiom(0 password / 0 OAuth / 1-field
/login)· 純 SentState 多 1 個 OTP input · 解 cross-device PKCE constraint。

### "Magic Link" template(visitor 已 register · 後續 sign in)

**「Message」欄位:**
```html
<h2 style="color:#F5F2EA;font-family:'SF Mono',monospace;">
  歡迎回 ZONE 27 · 2 個 path 任選
</h2>

<p style="color:#8A93A8;font-size:14px;line-height:1.7;">
  您剛在 zone27-web.vercel.app/login 申請 sign in · 兩個 path 任選一個:
</p>

<h3 style="color:#D4AF37;font-family:'SF Mono',monospace;font-size:11px;letter-spacing:3px;">
  ① CLICK LINK · 同 device 開 email
</h3>
<p>
  <a href="{{ .ConfirmationURL }}"
     style="display:inline-block;padding:14px 32px;background:#D4AF37;color:#0F1A2E;font-family:'SF Mono',monospace;text-decoration:none;font-weight:500;letter-spacing:2px;">
    → 進 ZONE 27 dashboard
  </a>
</p>

<h3 style="color:#D4AF37;font-family:'SF Mono',monospace;font-size:11px;letter-spacing:3px;">
  ② TYPE CODE · 跨 device 也 work
</h3>
<p style="color:#8A93A8;font-size:13px;">
  把這 6 碼貼到剛剛 /login 頁面的「TYPE CODE」 input:
</p>
<p style="font-family:'SF Mono',monospace;color:#D4AF37;font-size:36px;letter-spacing:8px;font-weight:300;text-align:center;padding:20px;background:#131F38;border:1px solid #D4AF37;">
  {{ .Token }}
</p>

<hr style="border:0;border-top:1px solid #1E2A47;margin:24px 0;">

<p style="color:#8A93A8;font-size:11px;line-height:1.6;">
  ▸ Link + code 同 1 小時內有效 · 過期回 /login Resend<br>
  ▸ 若非本人申請 · 直接忽略此 email<br>
  ▸ ZONE 27 · 0 tracking · 0 password · 1 個 email = 1 個帳號<br>
  ▸ FUNDED BY FOUNDERS · NO GA · NO PIXEL · NO HOTJAR
</p>
```

**「Subject heading」 欄位:**
```
ZONE 27 · 您的 sign-in link + code
```

### "Confirm signup" template(第一次 register · 同樣 dual-path)

同上格式 · h2 改成:
```html
<h2 style="color:#F5F2EA;font-family:'SF Mono',monospace;">
  歡迎加入 ZONE 27 FREE TIER · 2 個 path 任選
</h2>
```

Subject:
```
ZONE 27 · 確認 email · FREE TIER 註冊
```

### 關鍵 template 變數(Supabase docs)

- `{{ .ConfirmationURL }}` → magic link URL(包含 token · 點開驗證)
- `{{ .Token }}` → 6-digit OTP code(同 token 的 numeric encoding)
- `{{ .Email }}` → 收件人 email(可用於 「您剛剛 as X」 framing)
- `{{ .SiteURL }}` → 您 project 的 Site URL(per URL Configuration)

兩個 templates 都用同樣的 token / hash · 所以 link 跟 code **驗證任一個 ·
另一個自動失效**(防 replay attack)。

### Save 完後測試 checklist

1. /login 輸入 Tim email · 點寄
2. Gmail 收到 email · 確認看到大 6-碼 code(36pt gold)+ 紫色 link button
3. **Path A test:** 同 browser tab 點 link → 應自動轉 /member?welcome=true
4. **Path B test:** 另 device(or 另 browser)Resend → 拿新 code · 貼到 /login
   sentState 「② TYPE CODE」 input · 點 → Verify 應 session set · redirect
   /member
5. 如 path B fail · 看 error · 可能是 token 不 numeric(老 template)or 過期

---

## 💡 Optional · Custom SMTP via Resend

**位置:** Dashboard → Authentication → SMTP Settings

**為什麼考慮:** Supabase 預設 SMTP 用自己的 mail.app.supabase.io 寄信 ·
free tier **2 emails/hour** rate limit · 量起來就卡。 ZONE 27 已 production
Resend(Round 16)· 切到 custom SMTP via Resend 解 rate limit + 統一寄件
人 identity。

### 設定值(等 ready 才動 · Tim explicit cued)

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: re_xxxxxxxxxxxxxxx (your RESEND_API_KEY)
SMTP Sender: ZONE 27 <onboarding@resend.dev>
SMTP Sender Name: ZONE 27
```

(將來換 brand domain 後 · sender email 改 `tim@zone27.tw` 或類似 ·
需 Resend domain verification。)

---

## 🗄️ Migrations to apply manually

Supabase migrations 在 `supabase/migrations/` · Tim 需在 Studio SQL
Editor 手動 paste + run(per [[zone27_supabase_architecture]]:
RLS-locked · auto-expose OFF · Tim controls schema)。

| File | Apply 後解鎖 |
|---|---|
| `0001_waitlist.sql` | ✅ Round 28 已 apply · waitlist table + 2 RPCs |
| `0002_founder_reservations.sql` | ⏳ Wave 12 ship · Tim apply 解鎖 Founder Number Reservation feature |

**Apply 步驟:**
1. Dashboard → SQL Editor → New query
2. Paste 整個 migration .sql 檔
3. Run(or Cmd+Enter)
4. 「Success. No rows returned.」 = apply 成功
5. Feature 自動 functional · web app 不需 redeploy

---

## 🔐 Service Role Key (敏感 · 不外洩)

**位置:** Dashboard → Project Settings → API

`service_role` key 跟 `anon` key 不同 · 完全 bypass RLS · **絕對不要** 貼到
chat、 commit、 client code 或任何公開地方。 ZONE 27 目前 code 不需要 ·
未來如果要從 server-side 跑 admin queries(例如 /admin Stage 2)再從
env vars 接(Vercel Settings → Environment Variables)。

---

## 🧪 Test checklist after config change

每次改 Auth URL config 後 · Tim 應該 run 以下 test:

1. 打開 `https://zone27-web.vercel.app/login`(或 localhost dev)
2. 輸入 Tim email · 點寄 magic link
3. 收到 email · 檢查連結是 `https://zone27-web.vercel.app/...` 不是
   `localhost`
4. 點連結 · 應 redirect 到 `/member?welcome=true`
5. 看到 ✓ AUTHENTICATED · FREE TIER chip · session 啟用

如失敗:
- 連結還是 localhost? → Site URL 沒改成功 · 重 Step 2
- 點連結出「redirect mismatch」 → Redirect URLs 沒加 wildcard · 重 Step 3
- 點連結出「expired」 → Magic link 30 分鐘有效 · 再寄一次

---

## Versioning

- v0.1 · 2026-05-22 · Round 30 Wave 12+ · 寫於 Tim Site URL bug · 永久 reference
