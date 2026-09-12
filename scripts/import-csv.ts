/**
 * CSV → JSON，每個類目一份（dog-food.csv → dog-food.json、cat-food.csv → cat-food.json、cat-wet-food.csv → cat-wet-food.json）
 *
 * 罐頭那一份的營養欄位填「罐子背面印的數字」（原物基），另外多填水分、纖維、灰分、主食還是副食。
 * 換算成乾物基是這支程式的事，不要叫人自己算 —— 手算一定會有一款算錯。
 *
 * 為什麼要這個：真正的瓶頸不是程式，是那 200 款商品資料。
 * 而建資料的人（員工）不該去手改 JSON —— 少一個逗號整個站就掛。
 *
 * 流程：
 *   1. 員工在 Google Sheet 填資料（欄位照 data/_template.csv）
 *   2. 下載成 CSV，存成 data/dog-food.csv 或 data/cat-food.csv
 *   3. npm run data:import
 *   4. 有錯它會用中文告訴你哪一份、第幾列、哪一欄不對，而且一列都不會寫進去
 *
 * 驗證是刻意嚴格的。寫錯一款飼料的過敏原，賠掉的是這個站唯一的資產。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { todayTW } from "../lib/date";
import { CATEGORIES, type Category } from "../lib/categories";
import { MAX_MERCHANTS } from "../lib/types";

/** 1～MAX_MERCHANTS */
const SLOTS = Array.from({ length: MAX_MERCHANTS }, (_, i) => i + 1);

const PROTEINS = [
  "chicken", "beef", "lamb", "salmon", "whitefish", "fish", "duck", "turkey",
  "pork", "venison", "insect", "poultry", "animal",
];
// kitten 是給填貓資料的人好認的寫法，程式裡一律存成 puppy（幼年期）
const STAGES = ["puppy", "kitten", "adult", "senior", "all"];
const SIZES = ["small", "medium", "large"];
const PULSES = ["high", "low", "none", "unknown"];

type Row = Record<string, string>;
let errors: string[] = [];
let where = "";

function fail(line: number, col: string, msg: string) {
  errors.push(`${where} 第 ${line} 列 · ${col}：${msg}`);
}

/** 逗號分隔，支援雙引號包住的欄位（描述裡有逗號時會用到）。 */
function parseCsv(text: string): Row[] {
  /*
   * 編碼防呆。
   *
   * Excel 在 Windows 上存 CSV 預設會用 Big5，讀進來變成一堆 �。
   * 如果不擋，中文會全部變亂碼寫進網站 —— 而且是靜靜地壞掉，
   * 因為數字欄位都還是對的，驗證全過。
   */
  if (text.includes("�")) {
    console.error(`\n✗ ${where} 不是 UTF-8，中文會變亂碼。\n`);
    console.error("  如果你是用 Excel 編輯的：");
    console.error("    另存新檔 → 檔案類型選「CSV UTF-8 (逗號分隔)」");
    console.error("    不要選只寫「CSV (逗號分隔)」的那個\n");
    console.error("  更省事的做法：改用 Google Sheet 編輯，");
    console.error("  下載時選「逗號分隔值檔案 (.csv)」，編碼不會出問題。\n");
    process.exit(1);
  }

  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error(`${where} 至少要有標題列和一列資料`);

  const head = splitLine(lines[0]);
  return lines.slice(1).map((l) => {
    const cells = splitLine(l);
    const row: Row = {};
    head.forEach((h, i) => (row[h.trim()] = (cells[i] ?? "").trim()));
    return row;
  });
}

function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      out.push(cur); cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function num(row: Row, key: string, line: number, opts: { min?: number; max?: number } = {}): number {
  const raw = row[key];
  if (raw === undefined || raw === "") { fail(line, key, "沒填"); return 0; }
  const n = Number(raw);
  if (Number.isNaN(n)) { fail(line, key, `「${raw}」不是數字`); return 0; }
  if (opts.min !== undefined && n < opts.min) fail(line, key, `${n} 太小（最少 ${opts.min}）`);
  if (opts.max !== undefined && n > opts.max) fail(line, key, `${n} 太大（最多 ${opts.max}）`);
  return n;
}

function yn(row: Row, key: string, line: number): boolean {
  const v = (row[key] ?? "").toUpperCase();
  if (v === "Y" || v === "TRUE" || v === "1") return true;
  if (v === "N" || v === "FALSE" || v === "0" || v === "") return false;
  fail(line, key, `「${row[key]}」看不懂，請填 Y 或 N`);
  return false;
}

function list(row: Row, key: string, line: number, allowed: string[]): string[] {
  const raw = row[key] ?? "";
  if (!raw) { fail(line, key, "沒填"); return []; }
  const items = raw.split(/[|,、]/).map((s) => s.trim()).filter(Boolean);
  for (const it of items) {
    if (!allowed.includes(it)) {
      fail(line, key, `「${it}」不在允許清單內。可用：${allowed.join(" / ")}`);
    }
  }
  return items;
}

/** 規格字串換算成公斤。跟 lib/engine 的 kgOf 同一套規則，這裡只需要數字。 */
function kgOfUnit(unit: string): number | null {
  // 罐頭整箱「80g×24」要乘起來，不然一箱會被當成 80 克，每公斤價格差 24 倍
  const cans = unit.replace(/\s/g, "").match(/^([\d.]+)(?:g|公克|克)[×xX*](\d+)/i);
  if (cans) return (parseFloat(cans[1]) * parseInt(cans[2], 10)) / 1000;
  // 兩包組「5.4kg×2」一樣要乘
  const packs = unit.replace(/\s/g, "").match(/^([\d.]+)(?:kg|公斤)[×xX*](\d+)/i);
  if (packs) return parseFloat(packs[1]) * parseInt(packs[2], 10);
  const m = unit.match(/([\d.]+)\s*(kg|公斤|g|公克|磅|lb|lbs|oz)/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (u === "kg" || u === "公斤") return n;
  if (u === "g" || u === "公克") return n / 1000;
  if (u === "磅" || u === "lb" || u === "lbs") return n * 0.4536;
  if (u === "oz") return n * 0.02835;
  return null;
}

function merchant(row: Row, n: number, line: number) {
  const p = `m${n}`;
  if (!row[`${p}Label`]) return null;

  const url = row[`${p}Url`] ?? "";
  if (!/^https?:\/\//.test(url)) fail(line, `${p}Url`, "不是有效的網址（要用 http:// 或 https:// 開頭）");
  if (url.includes("PLACEHOLDER")) {
    console.warn(`  ⚠ ${where} 第 ${line} 列 ${p}Url 還是佔位連結，上線前要換成真的分潤連結`);
  }

  return {
    id: "m" + n,
    label: row[`${p}Label`],
    // 大包裝當「最省」時規格不同，沒填就沿用整列的 unit
    ...(row[`${p}Unit`] ? { unit: row[`${p}Unit`] } : {}),
    amount: num(row, `${p}Amount`, line, { min: 1 }),
    note: row[`${p}Note`] ?? "",
    affiliateUrl: url,
    anchor: (n === 1 ? "safe" : "value") as "safe" | "value",
    // 連結死掉不是刪掉那一列 —— 刪掉就沒有紀錄，下次又會重新收一次同一家。
    // 標記起來，引擎跳過，資料還在。
    ...(/^(1|true|yes|y|是|死)$/i.test((row[`${p}Dead`] ?? "").trim()) ? { dead: true } : {}),
    // 這一家自己的查價日期。備援的價格可能比整款的日期舊，要分開記
    ...(/^\d{4}-\d{2}-\d{2}$/.test(row[`${p}Checked`] ?? "") ? { checkedAt: row[`${p}Checked`] } : {}),
  };
}

/* ---------------------------------------------------------------- */

function readCategory(cat: Category) {
  const SRC = resolve(cat.csv);
  const rows = parseCsv(readFileSync(SRC, "utf8"));
  const seen = new Set<string>();

  const products = rows.map((row, i) => {
    const line = i + 2; // 標題列算第 1 列

    if (!row.id) fail(line, "id", "沒填");
    if (seen.has(row.id)) fail(line, "id", `「${row.id}」重複了`);
    seen.add(row.id);
    // 編號前綴決定這款屬於哪個類目，paste 也靠它找檔案。放錯檔案要擋下來。
    if (row.id && !row.id.startsWith(cat.idPrefix + "-")) {
      fail(line, "id", `「${row.id}」要用 ${cat.idPrefix}- 開頭，這份是${cat.zh}`);
    }

    if (!row.dealbreaker) {
      fail(line, "dealbreaker", "沒填 —— 每一款都必須有一句「不要買，如果⋯」，這是產品的核心");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.checkedAt ?? "")) {
      fail(line, "checkedAt", `「${row.checkedAt}」格式要像 2026-09-05`);
    }
    if (row.pulses && !PULSES.includes(row.pulses)) {
      fail(line, "pulses", `「${row.pulses}」看不懂，可用：${PULSES.join(" / ")}`);
    }

    // m1..m16。Tim 給過的連結不刪（2026-09-13），新的在前、舊的往後當備援，所以要留得夠多格。
    const merchants = SLOTS.map((n) => merchant(row, n, line)).filter(Boolean);

    /*
     * 送贈品的賣場：看每公斤，不看有沒有「送」。
     *
     * 以前看到「送」「贈」一律擋。起因是 ORIJEN 高齡犬 6kg 在某家賣 $6,500，
     * 規格寫「送 6 包舒潔」，另一家同樣 6kg 只要 $3,570：贈品把價錢灌高了。
     *
     * 2026-09-13 Tim 糾正：紐頓 T22 有一家兩包組更便宜，還送肉泥和抓板。
     * 「他不只送東西，還更便宜耶！不能死板板看到送東西就不要！」他是對的。
     * 真正要擋的是「贈品把每公斤灌高」，不是「有贈品」。
     *
     * 所以改成：有贈品的規格，每公斤比同一款最便宜的那一條貴兩成以上，才提醒一聲。
     * 不擋 —— 畫面上本來就會顯示「每公斤反而貴 X%」，讀者看得到。
     * 更便宜又送東西的，備註照實寫送什麼，那是讀者該知道的好處。
     */
    {
      const all: { n: number; unit: string; kg: number; per: number; gift: boolean }[] = [];
      for (const n of SLOTS) {
        const label = row[`m${n}Label`] ?? "";
        if (!label || /^(1|true|yes|y|是|死)$/i.test((row[`m${n}Dead`] ?? "").trim())) continue;
        const unit = row[`m${n}Unit`] || row.unit || "";
        const kg = kgOfUnit(unit);
        const amount = Number(row[`m${n}Amount`] ?? 0);
        if (!kg || !amount) continue;
        all.push({ n, unit, kg, per: amount / kg, gift: /送|贈/.test(label + unit + (row[`m${n}Note`] ?? "")) });
      }
      // 跟「同樣大小」的比。小包本來就比大包貴，拿 1.13kg 去比兩包組的每公斤，一定會誤報
      for (const x of all.filter((x) => x.gift)) {
        const low = Math.min(...all.filter((y) => Math.abs(y.kg - x.kg) / x.kg < 0.05).map((y) => y.per));
        if (x.per <= low * 1.2) continue;
        console.warn(
          `  ⚠ ${where} 第 ${line} 列 m${x.n}（${x.unit}）有贈品，每公斤 ${Math.round(x.per)} 元，` +
          `比同樣大小最便宜的貴 ${Math.round((x.per / low - 1) * 100)}%。價錢可能被贈品灌高了，確認一下值不值得留。`,
        );
      }
    }

    /* 每公斤價格離譜 = 規格或價格打錯。
       大包比小包便宜是正常的，但正常的量販折扣落在一到四成 ——
       便宜超過六成，多半是公斤數少打一位數或多打一位數。

       只跟「同一家」的其他規格比。以前是跟整款最貴的那一條比，
       一家賣很貴的商城（1.13kg $1,250）會讓別家正常的價錢看起來像打錯。 */
    {
      const byStore = new Map<string, { unit: string; per: number }[]>();
      for (const n of SLOTS) {
        const label = row[`m${n}Label`];
        if (!label) continue;
        const unit = row[`m${n}Unit`] || row.unit || "";
        const amount = Number(row[`m${n}Amount`] ?? 0);
        const kg = kgOfUnit(unit);
        if (!kg || !amount) continue;
        byStore.set(label, [...(byStore.get(label) ?? []), { unit, per: amount / kg }]);
      }
      for (const sized of byStore.values()) {
        if (sized.length < 2) continue;
        const hi = Math.max(...sized.map((x) => x.per));
        for (const x of sized) {
          if (x.per < hi * 0.4) {
            fail(line, "mNAmount",
              `「${x.unit}」換算下來每公斤 ${Math.round(x.per)} 元，比同一款最貴的規格便宜超過六成 —— ` +
              `正常的量販折扣是一到四成。多半是公斤數或價格打錯（例如 1.8kg 打成 18kg），先回去對一次`);
          }
        }
      }
    }

    const isRef = yn(row, "referenceOnly", line);
    const isAwait = yn(row, "awaitingLink", line);
    // 對照款的工作是被刪掉；待補連結的是還沒拿到連結。兩種都可以沒有通路。
    if (merchants.length === 0 && !isRef && !isAwait) {
      fail(line, "m1Label", "至少要有一個通路（對照款填 referenceOnly=1，等連結的填 awaitingLink=1）");
    }
    if (merchants.length > 0 && isAwait) {
      fail(line, "awaitingLink", "已經有通路了，把 awaitingLink 清空");
    }
    // 沒有台灣上架頁的證據，就不准進採購清單 —— 這條擋的是「讓人白跑一趟」
    if (isAwait && !row.twSource) {
      fail(line, "twSource", "要放進待補清單，必須先指出一個台灣通路實際上架這個 SKU 的頁面網址");
    }

    const stages = list(row, "lifeStage", line, STAGES).map((s) => (s === "kitten" ? "puppy" : s));
    const wet = cat.form === "wet";

    return {
      id: row.id,
      species: cat.species,
      ...(wet ? { form: "wet" as const } : {}),
      brand: row.brand,
      name: row.name,
      spec: {
        ...(wet ? wetNutrition(row, line) : {
          protein: num(row, "protein", line, { min: 0, max: 100 }),
          fat: num(row, "fat", line, { min: 0, max: 100 }),
          carb: num(row, "carb", line, { min: 0, max: 100 }),
          omega3: num(row, "omega3", line, { min: 0, max: 20 }),
          // 0 = 查不到。允許留白，但引擎會把它當成「不通過磷上限」。
          phosphorus: row.phosphorus ? num(row, "phosphorus", line, { min: 0, max: 10 }) : 0,
        }),
        proteinSources: list(row, "proteinSources", line, PROTEINS),
        singleSource: yn(row, "singleSource", line),
        ...(row.pulses ? { pulses: row.pulses as "high" | "low" | "none" | "unknown" } : {}),
        grainFree: yn(row, "grainFree", line),
        lifeStage: stages,
        bodySize: list(row, "bodySize", line, SIZES),
        prescription: yn(row, "prescription", line),
        // 熱量有公布才填。沒填的就用引擎的中間值估，不假裝知道。
        // 罐頭是連水一起算的每公斤熱量，範圍差很多：乾糧 2,500–5,500，罐頭 400–2,000
        ...(row.kcal ? { kcal: num(row, "kcal", line, wet ? { min: 400, max: 2000 } : { min: 2500, max: 5500 }) } : {}),
      },
      reports: {
        total: num(row, "reportsTotal", line, { min: 0 }),
        palatability: num(row, "reportsPalatability", line, { min: 0 }),
        looseStool: num(row, "reportsLooseStool", line, { min: 0 }),
      },
      price: { unit: row.unit, checkedAt: row.checkedAt, merchants },
      dealbreaker: row.dealbreaker,
      ...(row.knownIssues ? { knownIssues: row.knownIssues } : {}),
      ...(yn(row, "discontinued", line) ? { discontinued: true } : {}),
      ...(isRef ? { referenceOnly: true } : {}),
      ...(isAwait ? { awaitingLink: true } : {}),
      ...(row.searchAs ? { searchAs: row.searchAs } : {}),
      // twSource 只留在 CSV：那是我們確認台灣買得到的證據，是別家通路的網址。
      // 寫進 JSON 就會被打包進網頁，哪天有人把它顯示出來就是在幫別家導流（2026-09-12 Tim）
    };
  });

  /*
   * 同一商品頁多口味的偵測。
   *
   * 蝦皮的分享連結指向整個商品頁，不是特定規格 —— 賣家把鹿肉/火雞/鮭魚
   * 放同一頁，兩款拿到同一條連結是必然，不是填錯。
   *
   * 所以不擋。改成印出來提醒，前端會在「前往」按鈕旁警告使用者自己
   * 選對規格 —— 那才是風險真正發生的地方。
   */
  const urlOwners = new Map<string, string[]>();
  for (const p of products) {
    // 同一款的大小包本來就共用連結，那不算多口味 —— 只看有幾「款」共用
    for (const url of new Set(p.price.merchants.map((m) => m!.affiliateUrl))) {
      const owners = urlOwners.get(url) ?? [];
      owners.push(p.id + "（" + p.spec.proteinSources.join("+") + "）");
      urlOwners.set(url, owners);
    }
  }
  const shared = [...urlOwners].filter(([, o]) => o.length > 1);
  if (shared.length) {
    console.log(`\n  ${cat.zh}：同一商品頁多口味（前端會提醒使用者選規格）：`);
    for (const [, owners] of shared) console.log("    " + owners.join(" · "));
  }

  /* 跨列的合理性檢查 —— 單列看不出來的問題 */
  products.forEach((p, i) => {
    const line = i + 2;
    if (p.spec.singleSource && p.spec.proteinSources.length > 1) {
      fail(line, "singleSource", `標了單一蛋白源，但 proteinSources 填了 ${p.spec.proteinSources.length} 種`);
    }
    if (p.reports.palatability > p.reports.total || p.reports.looseStool > p.reports.total) {
      fail(line, "reports", "回報人數比總回報數還多");
    }
    const sum = p.spec.protein + p.spec.fat + p.spec.carb;
    if (sum > 100.5) fail(line, "protein/fat/carb", `加起來 ${sum}% 超過 100%`);
  });

  return products;
}

/* ---------------------------------------------------------------- */
/* 罐頭的營養欄位                                                     */
/*                                                                    */
/* CSV 填罐子背面的數字，這裡換成乾物基（扣掉水分）存進 spec，          */
/* 原始數字另外存在 asFed，畫面上給讀者對照。                          */
/*                                                                    */
/* 碳水三種來源分開記（見 lib/types 的 carbBasis）：                    */
/*   品牌有公布 → 用品牌的                                             */
/*   蛋白、脂肪、纖維、灰分、水分都有 → 用減法算                        */
/*   缺灰分 → 不算。罐頭扣掉八成水分之後，1% 的誤差會變成 5%。           */
/* ---------------------------------------------------------------- */

function wetNutrition(row: Row, line: number) {
  const c = (row.complete ?? "").toUpperCase();
  if (!["Y", "N", "1", "0", "TRUE", "FALSE"].includes(c)) {
    fail(line, "complete", "罐頭一定要填：主食罐填 Y，副食罐填 N。這是罐頭類目的第一刀，不能空著");
  }
  const complete = c === "Y" || c === "1" || c === "TRUE";

  const moisture = num(row, "moisture", line, { min: 50, max: 92 });
  const protein = num(row, "protein", line, { min: 0, max: 40 });
  const fat = num(row, "fat", line, { min: 0, max: 30 });
  const fiber = row.fiber ? num(row, "fiber", line, { min: 0, max: 10 }) : undefined;
  const ash = row.ash ? num(row, "ash", line, { min: 0, max: 10 }) : undefined;
  const phosphorus = row.phosphorus ? num(row, "phosphorus", line, { min: 0, max: 3 }) : undefined;
  const omega3 = row.omega3 ? num(row, "omega3", line, { min: 0, max: 5 }) : 0;

  if (protein + fat + moisture > 100) {
    fail(line, "protein/fat/moisture", `蛋白 + 脂肪 + 水分加起來 ${protein + fat + moisture}%，超過 100%`);
  }

  const dry = 100 - moisture;
  const dm = (x: number) => Math.round((x / dry) * 1000) / 10;

  let carb = 0;
  let carbAsFed: number | undefined;
  let carbBasis: "published" | "computed" | "unknown" = "unknown";
  if (row.carb) {
    carbAsFed = num(row, "carb", line, { min: 0, max: 30 });
    carb = dm(carbAsFed);
    carbBasis = "published";
  } else if (fiber !== undefined && ash !== undefined) {
    carb = dm(Math.max(0, 100 - protein - fat - fiber - ash - moisture));
    carbBasis = "computed";
  }

  return {
    protein: dm(protein),
    fat: dm(fat),
    carb,
    omega3: dm(omega3),
    // 0 = 查不到，跟乾糧同一個規矩
    phosphorus: phosphorus !== undefined ? dm(phosphorus) : 0,
    complete,
    moisture,
    asFed: {
      protein, fat,
      ...(fiber !== undefined ? { fiber } : {}),
      ...(ash !== undefined ? { ash } : {}),
      ...(phosphorus !== undefined ? { phosphorus } : {}),
      ...(carbAsFed !== undefined ? { carb: carbAsFed } : {}),
    },
    carbBasis,
  };
}

/* ---------------------------------------------------------------- */
/* 先把每一份都驗完，全部沒問題才寫。一份有錯，哪一份都不動。          */
/* ---------------------------------------------------------------- */

errors = [];
const results: { cat: Category; products: ReturnType<typeof readCategory> }[] = [];

for (const cat of CATEGORIES) {
  if (!existsSync(resolve(cat.csv))) {
    // 狗飼料一定要有；其他類目還沒開始做就跳過
    if (cat.slug === "dog-food") {
      console.error(`\n找不到 ${cat.csv}`);
      console.error(`\n請把 Google Sheet 下載成 CSV，存成 ${cat.csv}`);
      console.error(`欄位格式看 data/_template.csv\n`);
      process.exit(1);
    }
    continue;
  }
  where = cat.csv;
  results.push({ cat, products: readCategory(cat) });
}

/*
 * 賣場名稱：同一家蝦皮賣場只能有一個名字，而且要跟 data/stores.json 登記的一樣。
 *
 * 2026-09-13 我從截圖把「萬倍富」讀成「萬信富」，Tim 照著我寫的回傳，錯字就上線了。
 * 讀者會拿這個名字去蝦皮搜，名字錯了就是找不到。
 *
 * 賣場編號是連結健檢查到的（短網址轉到哪個賣場），所以新賣場要先跑 npm run links:check。
 * 登記過的名字不一樣 → 擋下來；沒登記過的 → 提醒要請 Tim 核對名字。
 */
{
  const HEALTH = resolve("data/link-health.json");
  const STORES = resolve("data/stores.json");
  if (existsSync(HEALTH) && existsSync(STORES)) {
    const health = JSON.parse(readFileSync(HEALTH, "utf8")) as { rows: { url: string; item: string | null }[] };
    const shopOfUrl = new Map(health.rows.filter((r) => r.item).map((r) => [r.url, (r.item as string).split("/")[0]]));
    const reg = (JSON.parse(readFileSync(STORES, "utf8")) as { stores: Record<string, { name: string; confirmed: boolean }> }).stores;
    const fresh = new Set<string>();
    for (const { cat, products } of results) {
      for (const p of products) {
        for (const m of p.price.merchants) {
          const shop = shopOfUrl.get(m!.affiliateUrl);
          if (!shop) continue;
          const s = reg[shop];
          if (s && s.name !== m!.label) {
            errors.push(`${cat.csv} · ${p.id}：蝦皮賣場 ${shop} 登記的名字是「${s.name}」，這裡寫成「${m!.label}」。同一家只能有一個名字`);
          }
          if (!s) fresh.add(`${m!.label}（蝦皮賣場 ${shop}）`);
        }
      }
    }
    if (fresh.size) {
      console.warn(`\n  新賣場，名字還沒登記。請 Tim 在蝦皮 App 看一眼賣場名稱，對了再加進 data/stores.json：\n    ${[...fresh].join("\n    ")}`);
    }
  }
}

if (errors.length) {
  console.error(`\n✗ 有 ${errors.length} 個問題，一列都沒有寫入：\n`);
  errors.forEach((e) => console.error("  " + e));
  console.error(`\n改完再跑一次 npm run data:import\n`);
  process.exit(1);
}

/*
 * 共用同一個蝦皮商品頁的連結。
 *
 * 短網址每產生一次就不一樣，所以「兩款用同一條網址」這種檢查抓不到它們。
 * 連結健檢記下了每條短網址轉到哪個商品，兩款商品落在同一頁，就標 sharedPage。
 * 沒跑過健檢就跳過，不影響匯入。
 */
{
  const HEALTH = resolve("data/link-health.json");
  if (existsSync(HEALTH)) {
    const health = JSON.parse(readFileSync(HEALTH, "utf8")) as { rows: { url: string; item: string | null }[] };
    const itemOfUrl = new Map(health.rows.filter((r) => r.item).map((r) => [r.url, r.item as string]));
    const owners = new Map<string, Set<string>>();
    for (const { products } of results) {
      for (const p of products) {
        for (const m of p.price.merchants) {
          const item = itemOfUrl.get(m!.affiliateUrl);
          if (item) owners.set(item, new Set([...(owners.get(item) ?? []), p.id]));
        }
      }
    }
    const shared: string[] = [];
    for (const { products } of results) {
      for (const p of products) {
        for (const m of p.price.merchants) {
          const item = itemOfUrl.get(m!.affiliateUrl);
          if (item && (owners.get(item)?.size ?? 0) > 1) {
            (m as { sharedPage?: boolean }).sharedPage = true;
            shared.push(`${p.id} ${m!.label}`);
          }
        }
      }
    }
    if (shared.length) {
      console.log(`\n  共用同一個蝦皮商品頁（購買按鈕旁會提醒讀者選對規格）：\n    ${[...new Set(shared)].join("\n    ")}`);
    }
  }
}

for (const { cat, products } of results) {
  const json = {
    _meta: {
      category: cat.slug,
      note: `由 ${cat.csv} 產生，不要直接改這個檔。改 CSV 之後跑 npm run data:import。`,
      generatedAt: todayTW(),
      count: products.length,
      pricePolicy: "人工複查，不爬蟲。checkedAt 誠實顯示於前端。",
    },
    products,
  };
  writeFileSync(resolve(cat.json), JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`\n✓ ${cat.zh} ${products.length} 款寫入 ${cat.json}`);
}

/* ---------------------------------------------------------------- */
/* 價格快照 —— 每次匯入追加一筆                                       */
/*                                                                    */
/* 價格史是唯一抄不走的護城河（別人一週能複製規格庫，但複製不了三年份   */
/* 的波動），而且晚一天開始就永遠少一天。所以在只有 8 筆示範資料、      */
/* 一個使用者都沒有的現在就先記。                                      */
/*                                                                    */
/* 所有類目共用一份，用商品編號區分。同一天重跑只蓋掉這次有匯入的款，  */
/* 別的類目那天的價格不能被洗掉。                                      */
/* ---------------------------------------------------------------- */

const HIST = resolve("data/price-history.json");
const hist = JSON.parse(readFileSync(HIST, "utf8"));
const today = todayTW();

const fresh: Record<string, number> = Object.fromEntries(
  results
    .flatMap((r) => r.products)
    // 標失效的那一家不算：讀者買不到的價格，不能拿來當「最低價」
    .filter((p) => p.price.merchants.some((m) => !m!.dead))
    .map((p) => [p.id, Math.min(...p.price.merchants.filter((m) => !m!.dead).map((m) => m!.amount))])
);

const idx = hist.snapshots.findIndex((s: { d: string }) => s.d === today);
if (idx >= 0) {
  hist.snapshots[idx] = { d: today, p: { ...hist.snapshots[idx].p, ...fresh } };
  console.log(`  價格快照 ${today} 已更新（共 ${hist.snapshots.length} 天）`);
} else {
  hist.snapshots.push({ d: today, p: fresh });
  console.log(`  價格快照 ${today} 已追加（共 ${hist.snapshots.length} 天）`);
}

hist.snapshots.sort((a: { d: string }, b: { d: string }) => a.d.localeCompare(b.d));
writeFileSync(HIST, JSON.stringify(hist, null, 2) + "\n", "utf8");

if (hist.snapshots.length < 7) {
  console.log(`  （滿 7 天之後，網站才會開始顯示「現在該不該買」）`);
}
console.log(`\n  記得跑 npm run build 確認頁面生得出來\n`);
