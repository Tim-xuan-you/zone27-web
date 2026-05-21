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

## 📧 Optional · Email Template Customization

**位置:** Dashboard → Authentication → Email Templates

**為什麼建議改:** Supabase 預設 template 是 English · 跟 ZONE 27 brand
(中文 + 冷金 + Geist Mono)不一致 · visitor 收信 dissonant。
不過 Tim 真實要動 brand 的話 · 也可以先用預設 · 後續再改。

### "Confirm signup" template(magic-link 第一次 register 時用)

建議改為 ZONE 27 brand · 對齊 lib/email.ts sendWaitlistConfirmation:

```html
<h2>歡迎加入 ZONE 27 FREE TIER</h2>
<p>請點擊下方連結確認您的 email · 完成註冊:</p>
<p><a href="{{ .ConfirmationURL }}">確認 → 加入 ZONE 27</a></p>
<p style="color:#8A93A8;font-size:11px;">
  Magic link 30 分鐘內有效 · 過期可重發 ·
  您 0 個密碼 / 0 個 OAuth · 1 個 email = 1 個帳號
</p>
<hr>
<p style="color:#8A93A8;font-size:10px;">
  ZONE 27 · 0 tracking · FUNDED BY FOUNDERS · NO GA · NO PIXEL
</p>
```

### "Magic Link" template(已 register · 後續 sign in 用)

```html
<h2>歡迎回 ZONE 27</h2>
<p>點以下連結 · session 自動啟用:</p>
<p><a href="{{ .ConfirmationURL }}">→ 進 ZONE 27 dashboard</a></p>
```

### Subject lines

```
Confirm signup: ZONE 27 · 確認 email · FREE TIER 註冊
Magic Link:     ZONE 27 · 您的 sign-in link
```

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
