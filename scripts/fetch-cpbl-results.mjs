#!/usr/bin/env node
// ── ZONE 27 · CPBL 官方賽果自動鏡像 script ────────────────
// 解的痛點:CPBL(旗艦聯盟)賽後比分一直靠 Tim 手動截圖 + Claude 打字進
// lib/matches.ts 的 finalResult。 MLB / 足球 早就 GitHub Action 自動結算,
// CPBL 卻是唯一還在手動的 —— 那是「發霉風險」(漏記、打錯、隔幾天才補)。
//
// 這支把官方 cpbl.com.tw 的「整季賽程含比分」一次抓下來,只留「真正打完」
// 的場次,寫成 lib/cpbl-results.json(官方比分鏡像)。 配對 + 計算 PROVED/
// DIVERGED 不在這裡做 —— 那留在 lib/matches.ts 的 resolveCpblResult()(TS
// 端有 curated 比賽物件 + 隊名正規化 + 賽前 slot frame),避免在 .mjs 裡
// 重做脆弱的字串配對。 這支只負責「忠實鏡像官方比分」。
//
// 資料來源(2026-06-09 實測 · 0 auth / 0 付費 / 官方公開):
//   POST https://www.cpbl.com.tw/schedule/getgamedatas
//   需要 CSRF 雙 token(GET /schedule 先拿 cookie + DOM token + header token)。
//   body: calendar=YYYY/01/01 → 回「整年」· GameResult==='0' = 已打完(含比分)。
//   GameResult: '0'=打完 · ''=未打 · '1'=延賽 stub · '2'=保留/suspended。
//   只信 GameResult==='0' && GameDateTimeE 有值 && 兩隊分數非 null。
//
// 紅線(守帳本誠實):
//   · fail-soft:抓失敗 / token 抓不到 / Success=false → 直接 throw,保留上一版
//     好的 json(絕不寫半截或空檔把歷史洗掉)。
//   · 只「聯集合併」:已在檔裡的 gameSno 永不刪,只新增 / 更新成已打完版本
//     → 官方某次短暫少回幾場也不會讓帳本縮水。 idempotent · 可重複跑。
//   · 只抓一軍例行賽(KindCode='A')· 熱身賽 G / 季後 E / 總冠軍 C 不混入。
//
// Run:   npm run fetch-cpbl-results       (或 GitHub Action 每 3h 跑)
// ─────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "lib", "cpbl-results.json");

const KIND = "A"; // 一軍例行賽 · per /coverage NEVER list(只官方公開 endpoint)
// CPBL 球季落在單一西元年。 用台北時區年份(GitHub Action 跑在 UTC,年初/年末不偏)。
const YEAR = Number(
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Taipei", year: "numeric" })
    .format(new Date())
);

const BASE = "https://www.cpbl.com.tw";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

// ── 1. 拿 CSRF token(DOM token + header token + cookie) ──
// ⚠️ 2026-06-25 修:cpbl.com.tw 又改防偽,把 cookie 加回來了 —— /schedule 現在是「cookie-gated
//    轉址」:第一次無 cookie 進來 302 轉回自己 + Set-Cookie(__chtcdn / __RequestVerificationToken),
//    沒帶 cookie 回去就無限轉。 Node 預設 redirect:"follow" **不跨轉址重送 cookie** → 永遠湊不到
//    cookie → 「redirect count exceeded · fetch failed」整支炸掉 = 賽果鏡像從 6/12 起凍結 12 天、
//    Action 每天寄失敗信的真因(推翻上一版「cookieless」假設)。
//    修法:redirect:"manual" 手動跟轉址、跨 hop 累積 cookie jar → 拿到 200 + 兩 token + cookie,
//    POST 再把 cookie 一起送(getSeason 已會帶)。 實測 200 / Success:true / 170 場已打完。
async function getWithCookies(startUrl, jar = {}) {
  let url = startUrl;
  for (let i = 0; i < 10; i++) {
    const cookieHdr = Object.entries(jar)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
    const res = await fetch(url, {
      headers: { "User-Agent": UA, ...(cookieHdr ? { Cookie: cookieHdr } : {}) },
      redirect: "manual",
    });
    for (const c of res.headers.getSetCookie?.() ?? []) {
      const kv = c.split(";")[0];
      const idx = kv.indexOf("=");
      if (idx > 0) jar[kv.slice(0, idx).trim()] = kv.slice(idx + 1);
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error(`redirect ${res.status} with no Location`);
      url = loc.startsWith("http") ? loc : new URL(loc, url).href;
      continue;
    }
    return { res, jar };
  }
  throw new Error("too many redirects on /schedule (cookie gate not clearing)");
}

async function getTokens() {
  const { res, jar } = await getWithCookies(`${BASE}/schedule`);
  if (!res.ok) throw new Error(`GET /schedule → HTTP ${res.status}`);
  const cookie = Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  const html = await res.text();
  const dom = html.match(/__RequestVerificationToken"[^>]*value="([^"]+)"/)?.[1];
  const hdr = html.match(/RequestVerificationToken:\s*'([^']+)'/)?.[1];
  if (!dom || !hdr) throw new Error("CSRF token scrape failed");
  return { cookie, dom, hdr };
}

// ── 2. POST 整年賽程(含比分) ──
async function getSeason(t) {
  const body = new URLSearchParams({
    calendar: `${YEAR}/01/01`, // Jan-1 → 回整年
    location: "",
    kindCode: KIND,
    __RequestVerificationToken: t.dom,
  });
  const headers = {
    "User-Agent": UA,
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    Origin: BASE,
    Referer: `${BASE}/schedule`,
    RequestVerificationToken: t.hdr,
  };
  // cookieless 防偽下 t.cookie = ""(別送空 Cookie 標頭)· 未來若又設 cookie 再帶上。
  if (t.cookie) headers.Cookie = t.cookie;
  const res = await fetch(`${BASE}/schedule/getgamedatas`, {
    method: "POST",
    headers,
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`POST getgamedatas → HTTP ${res.status}`);
  const j = await res.json();
  if (!j.Success) throw new Error("getgamedatas Success=false");
  const list = JSON.parse(j.GameDatas);
  if (!Array.isArray(list)) throw new Error("GameDatas not an array");
  return list;
}

function isFinishedRecord(g) {
  return (
    g.GameResult === "0" && // 已打完(非 ''未打 / '1'延賽 / '2'保留)
    g.GameDateTimeE != null && // 有結束時間
    Number.isFinite(Number(g.GameSno)) && // sno 是數字(配對 key)
    /^\d{4}[-/]\d{2}[-/]\d{2}/.test(String(g.GameDate)) && // 日期形狀對(防 markup 漂移寫垃圾日期)
    g.HomeScore != null &&
    g.VisitingScore != null &&
    Number.isFinite(Number(g.HomeScore)) &&
    Number.isFinite(Number(g.VisitingScore))
  );
}

function toRecord(g) {
  const home = Number(g.HomeScore);
  const away = Number(g.VisitingScore);
  return {
    gameSno: g.GameSno,
    // YYYY-MM-DD(官方賽程日 · 台灣 calendar)· 正規化斜線→破折號(官方有時回 2026/03/28)
    // → 跟 lib/matches.ts getMatchDateIso 的破折號格式對得起來,不會 silent 配不到。
    date: String(g.GameDate).slice(0, 10).replace(/\//g, "-"),
    kindCode: KIND,
    year: YEAR,
    homeName: g.HomeTeamName,
    homeCode: g.HomeTeamCode,
    homeScore: home,
    awayName: g.VisitingTeamName,
    awayCode: g.VisitingTeamCode,
    awayScore: away,
    // 平手不硬判勝方(CPBL 例行賽會和局)。 home/away 為「官方主客」· slot frame
    // 由 TS 端 resolveCpblResult 依隊名配對轉換,不在這裡假設。
    result: home === away ? "tie" : home > away ? "home" : "away",
    endedAt: g.GameDateTimeE,
    source: "cpbl/schedule",
  };
}

// 鏡像是否已 stale(最新一場 > STALE_DAYS 天前 · 台北日曆)· 用來分辨「抓不到但鏡像還新鮮
// = 容忍單次 blip」vs「抓不到且鏡像已凍結好幾天 = 管線真的壞了該報警」。 抓不到才會用到它,
// off-season / 正常情況 fetch 會成功、根本走不到這裡 → 不會誤報。
const STALE_DAYS = 3;
function mirrorStaleDays() {
  try {
    if (!existsSync(OUT)) return Infinity;
    const prev = JSON.parse(readFileSync(OUT, "utf8"));
    const games = prev.games ?? [];
    if (games.length === 0) return Infinity;
    const latest = games.reduce((mx, g) => (g.date > mx ? g.date : mx), "");
    if (!latest) return Infinity;
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    const ms = Date.parse(`${today}T00:00:00Z`) - Date.parse(`${latest}T00:00:00Z`);
    return Number.isFinite(ms) ? ms / 86400000 : Infinity;
  } catch {
    return 0; // 讀不動就別誤報(走容忍路徑)
  }
}

async function main() {
  let tokens, season;
  try {
    tokens = await getTokens();
    season = await getSeason(tokens);
  } catch (e) {
    // R241:不再「無聲 fail-soft」。 cpbl.com.tw 6/13 改了防偽 token 後又把鏡像凍結 8 天,
    //   workflow 卻一路綠燈、沒人發現 —— 那正是這個 silent-return 的陷阱。 改成:鏡像已 stale
    //   (最新一場 > STALE_DAYS 天前)還抓不到 = 管線真的壞了 → exit 1 讓 workflow 變紅、寄失敗信
    //   報警(同 soccer-engine「死管線有過期場故意 exit1」)· 也讓 Actions log 浮上來好查根因
    //   (token 改版 / GitHub runner IP 被擋)。 鏡像還新鮮(剛抓過 / off-season)時的單次 blip →
    //   仍容忍、保留上一版好 json、exit 0,不 cry wolf。 永遠不寫空檔/半截(帳本只增不毀)。
    const stale = mirrorStaleDays();
    if (stale > STALE_DAYS) {
      console.error(
        `[cpbl-results] fetch failed AND mirror is ${stale.toFixed(1)}d stale (> ${STALE_DAYS}d) — failing loud (exit 1) to alarm: ${e.message}`
      );
      process.exit(1);
    }
    console.error(
      `[cpbl-results] fetch failed (mirror still fresh ${stale.toFixed(1)}d · tolerating blip · keeping existing json): ${e.message}`
    );
    return;
  }

  const finals = season.filter(isFinishedRecord).map(toRecord);
  if (finals.length === 0) {
    console.error("[cpbl-results] 0 finished games parsed · keeping existing json");
    return;
  }

  // 合併策略 = 「本次官方回應對它有回的場有絕對權威 · 沒回到的場才保留舊值」:
  //   · 已 final → 覆蓋/新增(分數更正照吃)。
  //   · 本次官方有回但已不是 final(被改判延賽/保留/取消/撤回)→ 從帳本移除
  //     (防「曾 final 又被官方撤回,舊分數卻一直黏在帳本」= 真正的毒)。
  //   · 本次官方完全沒回到的 sno(短暫少回 / 別的年度)→ 保留舊值(防 transient 缺漏)。
  const prev = existsSync(OUT)
    ? JSON.parse(readFileSync(OUT, "utf8"))
    : { games: [] };
  const keyOf = (year, kind, sno) => `${year}-${kind}-${sno}`;
  // 本次回應裡「看到的」所有場(含非 final)· 用來分辨「有回但不再 final」vs「完全沒回」。
  const seenThisRun = new Set(
    season
      .filter((g) => Number.isFinite(Number(g.GameSno)))
      .map((g) => keyOf(YEAR, KIND, g.GameSno))
  );
  const finalKeys = new Set(finals.map((g) => keyOf(g.year, g.kindCode, g.gameSno)));

  const byKey = new Map();
  let removed = 0;
  for (const g of prev.games ?? []) {
    const k = keyOf(g.year, g.kindCode, g.gameSno);
    // 撤回偵測:本次官方有回到這場、但它已不在 finals → 丟掉舊的(stale)。
    if (seenThisRun.has(k) && !finalKeys.has(k)) {
      removed++;
      continue;
    }
    byKey.set(k, g);
  }
  let added = 0;
  for (const g of finals) {
    const k = keyOf(g.year, g.kindCode, g.gameSno);
    if (!byKey.has(k)) added++;
    byKey.set(k, g); // overwrite-equal · idempotent · 分數更正照吃
  }
  const merged = [...byKey.values()].sort((a, b) =>
    a.date === b.date ? a.gameSno - b.gameSno : a.date.localeCompare(b.date)
  );

  // 內容沒變就不重寫(否則 generatedAt 每跑都變 → GitHub Action 每 3h 推一筆
  // 純時間戳 commit = 噪音)。 只比「賽果內容」· 不比時間戳。
  const prevGames = JSON.stringify(prev.games ?? []);
  if (JSON.stringify(merged) === prevGames) {
    console.log(`✓ CPBL results · ${merged.length} finished games · no change`);
    return;
  }

  const out = {
    generatedAt: new Date().toISOString(),
    source: "cpbl.com.tw/schedule/getgamedatas (official · public · 0 auth)",
    year: YEAR,
    kindCode: KIND,
    count: merged.length,
    games: merged,
  };
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `✓ CPBL results · ${merged.length} finished games (+${added} new · -${removed} reverted) → lib/cpbl-results.json`
  );
}

main()
  // 工作做完強制乾淨退出:避免 undici keep-alive socket 在 Node teardown 時
  // 觸發 Windows-only libuv assertion(src/win/async.c)· 對結果無影響、純清場。
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[cpbl-results] fatal:", e);
    process.exit(1);
  });
