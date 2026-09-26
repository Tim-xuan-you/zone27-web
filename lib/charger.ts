import data from "@/data/charger.json";
import type { Merchant, Price } from "./types";

/**
 * 充電器。2026-09-26 開的第八個類目，第一個不是寵物的。
 *
 * 這個類目的「藏雞」是瓦數：包裝正面寫的瓦數，常常不是你的手機拿到的瓦數。三種情況，全部是官方自己寫的：
 *   1. 寫的是總和。三星自己的 65W 三孔，三個孔一起插是 35W＋25W＋5W；
 *      Apple 的 35W 雙孔，同時充 Mac 跟 iPhone，每一台 17.5W
 *   2. iPhone 18 Pro 要 AVS。Apple 寫：要 60W 以上、支援可調式電壓供電（AVS）的轉接器，
 *      約 15 分鐘到 50%。包裝上寫 AVS 的也要看那一檔幾瓦：KINYO 60W 的 AVS 是 20V 2A，最多 40W
 *   3. Galaxy S26 Ultra 要 PPS 60W。三星官網自己寫：三星的 65W 三孔只支援到 PPS 45W
 *
 * 所以這一頁不比「誰的瓦數大」，比「你那幾台插上去，各拿到幾瓦」。
 * 我們沒有儀器、不做實測，只讀官方寫的規格。官方沒寫的（像兩孔一起插時 AVS 還在不在）一律當不知道，不猜。
 */

export type PortKind = "C" | "A";

export interface Port {
  id: string;
  kind: PortKind;
  /** 這個孔單獨插，一般 USB PD 最多幾瓦 */
  w: number;
  /** PPS 那一檔最多幾瓦。官方沒寫就不填 */
  pps?: number;
  /** AVS 那一檔最多幾瓦。官方沒寫就不填 */
  avs?: number;
}

/** 官方寫的「同時插」分配。use 裡的孔全部插著的時候，各孔最多幾瓦 */
export interface Combo {
  use: string[];
  w: Record<string, number>;
  pps?: Record<string, number>;
  avs?: Record<string, number>;
}

export interface Charger {
  id: string;
  brand: string;
  name: string;
  model?: string;
  totalW: number;
  ports: Port[];
  combos: Combo[];
  avsNote?: string;
  /** 官方建議售價。只拿來在還沒有購買連結時排順序，不顯示 */
  listPrice?: number;
  weightG?: number;
  sizeMm?: string;
  bsmi?: string;
  /** 背面那一句：包裝正面沒講、規格表上才看得到的那件事 */
  back: string;
  dealbreaker: string;
  knownIssues?: string;
  searchAs?: string;
  /** 研究來源。只留在資料檔，不連出去 */
  refs: string[];
  checkedAt: string;
  price: Price;
  awaitingLink?: boolean;
}

export const chargers = data.products as unknown as Charger[];
export const chargerById = (id: string): Charger | undefined => chargers.find((c) => c.id === id);
export const CHARGER_SUB_ID = "charger";

/* ------------------------------------------------------------------ */
/* 裝置：官方寫要幾瓦才是最快                                           */
/* ------------------------------------------------------------------ */

export interface Device {
  id: string;
  zh: string;
  group: "iPhone" | "iPad" | "Mac" | "Galaxy";
  /** 官方寫的快速充電門檻 */
  fastW: number;
  /** 快速充電另外要的協定。avs：Apple 要 AVS；pps：三星超快速充電要 PPS */
  needs?: "avs" | "pps";
  /** 至少要這麼多才算「正常充」。低於這個，比盒子裡附的那顆或官方基本門檻還小 */
  okW: number;
  laptop?: boolean;
  /** 官方沒寫快速充電，只知道盒子裡附幾瓦。這種不能說「最快」，只能說「夠用」 */
  noFast?: boolean;
  /** 線也要對。官方有寫的才填 */
  cable?: string;
  /** 官方原文的重點，給讀者看為什麼 */
  line: string;
  refs: string[];
}

/**
 * 2026-09-26 從 Apple 台灣、Apple 支援、三星台灣官網讀的。
 * Switch 2 沒收：只找得到第三方賣場的說法，找不到任天堂自己寫的數字。
 */
export const DEVICES: Device[] = [
  {
    id: "ip18pro", zh: "iPhone 18 Pro／Pro Max", group: "iPhone", fastW: 60, needs: "avs", okW: 20,
    cable: "線要能跑 60W 以上（盒子裡附的那條可以）",
    line: "約 15 分鐘到 50%，要 60W 以上、支援可調式電壓供電（AVS）的轉接器",
    refs: ["https://www.apple.com/tw/iphone-18-pro/specs/", "https://support.apple.com/en-us/102574"],
  },
  {
    id: "ipduo", zh: "iPhone Duo", group: "iPhone", fastW: 60, okW: 20,
    line: "約 20 分鐘到 50%，要 60W 以上的轉接器",
    refs: ["https://www.apple.com/tw/iphone-duo/specs/"],
  },
  {
    id: "ip17", zh: "iPhone 17／17 Pro／17 Pro Max", group: "iPhone", fastW: 40, okW: 20,
    line: "約 20 分鐘到 50%，要 40W 以上的轉接器",
    refs: ["https://www.apple.com/tw/iphone-17/specs/", "https://support.apple.com/en-us/102574"],
  },
  {
    id: "ipair", zh: "iPhone Air／17e", group: "iPhone", fastW: 20, okW: 20,
    line: "30 分鐘到 50%，要 20W 以上的轉接器",
    refs: ["https://www.apple.com/tw/iphone-air/specs/", "https://www.apple.com/tw/iphone-17e/specs/"],
  },
  {
    id: "ip16", zh: "iPhone 16 或更早", group: "iPhone", fastW: 20, okW: 20,
    line: "約 30 分鐘到 50%，要 20W 以上的轉接器（iPhone 12 以後）",
    refs: ["https://support.apple.com/zh-tw/102574"],
  },
  {
    id: "ipadpro", zh: "iPad Pro（M5）", group: "iPad", fastW: 60, okW: 20,
    line: "約 30 分鐘到 50%，要 60W 以上的轉接器",
    refs: ["https://www.apple.com/tw/ipad-pro/specs/"],
  },
  {
    id: "ipadair", zh: "iPad Air", group: "iPad", fastW: 20, okW: 20, noFast: true,
    line: "盒子裡附 20W，官方沒寫更快的充法",
    refs: ["https://www.apple.com/tw/ipad-air/specs/"],
  },
  {
    id: "mbneo", zh: "MacBook Neo", group: "Mac", fastW: 20, okW: 20, laptop: true, noFast: true,
    line: "盒子裡附 20W，官方沒寫快速充電",
    refs: ["https://www.apple.com/tw/macbook-neo/specs/"],
  },
  {
    id: "mba", zh: "MacBook Air（M5）", group: "Mac", fastW: 70, okW: 35, laptop: true,
    line: "70W 以上才能快速充電；盒子裡附的是 35W 雙孔、40W 動態或 70W",
    refs: ["https://www.apple.com/tw/macbook-air/specs/"],
  },
  {
    id: "mbp14", zh: "MacBook Pro 14 吋（M5 系列）", group: "Mac", fastW: 96, okW: 70, laptop: true,
    line: "96W 以上才能快速充電；盒子裡附 70W 或 140W",
    refs: ["https://www.apple.com/tw/macbook-pro/specs/"],
  },
  {
    id: "mbp16", zh: "MacBook Pro 16 吋", group: "Mac", fastW: 140, okW: 140, laptop: true,
    cable: "用 USB-C 充要 240W 的線，或用 MagSafe 3 連接線",
    line: "140W 以上才能快速充電，盒子裡附的就是 140W",
    refs: ["https://www.apple.com/tw/macbook-pro/specs/"],
  },
  {
    id: "s26u", zh: "Galaxy S26 Ultra", group: "Galaxy", fastW: 60, needs: "pps", okW: 20,
    cable: "線要 5A 的（三星、ONPRO 官網都有寫）",
    line: "超快速充電 3.0 最高 60W，約 30 分鐘到 75%，要支援 PPS 60W 的轉接器",
    refs: [
      "https://www.samsung.com/tw/smartphones/galaxy-s26-ultra/",
      "https://www.samsung.com/hk/mobile-accessories/65w-power-adapter-trio-black-ep-t6530nbeggb/",
    ],
  },
];

export const deviceById = (id: string): Device | undefined => DEVICES.find((d) => d.id === id);

/* ------------------------------------------------------------------ */
/* 插上去各拿到幾瓦                                                     */
/* ------------------------------------------------------------------ */

/** fast：官方寫的最快速度；ok：正常充；slow：比基本門檻小，會充很久；none：這個孔充不了它 */
export type Tier = "fast" | "ok" | "slow" | "none";

export const TIER_ZH: Record<Tier, string> = { fast: "最快", ok: "能充，不是最快", slow: "會慢", none: "不建議" };
export const TIER_TONE: Record<Tier, "keep" | "muted" | "warn" | "cut"> = { fast: "keep", ok: "muted", slow: "warn", none: "cut" };
/** 畫面上那兩三個字。官方沒寫快充的裝置，最好的情況只能叫「夠用」 */
export const tierZh = (d: Device, t: Tier): string => (t === "fast" && d.noFast ? "夠用" : TIER_ZH[t]);

export interface Got {
  device: Device;
  port: string;
  w: number;
  tier: Tier;
  why: string;
}

/** 某個孔在「這幾個孔一起插」的時候，官方寫的上限。null 代表官方沒寫這個組合 */
function limitsOf(c: Charger, used: string[]): { w: number; pps?: number; avs?: number }[] | null {
  if (used.length === 1) {
    const p = c.ports.find((x) => x.id === used[0])!;
    return [{ w: p.w, pps: p.pps, avs: p.avs }];
  }
  const key = [...used].sort().join("+");
  const combo = c.combos.find((k) => [...k.use].sort().join("+") === key);
  if (!combo) return null;
  return used.map((id) => ({ w: combo.w[id] ?? 0, pps: combo.pps?.[id], avs: combo.avs?.[id] }));
}

function judge(d: Device, kind: PortKind, lim: { w: number; pps?: number; avs?: number }, alone: boolean): { tier: Tier; why: string } {
  const w = lim.w;
  // USB-A 沒有 USB PD，筆電充不動；手機充得進去但很慢
  if (kind === "A") {
    return d.laptop
      ? { tier: "none", why: "USB-A 孔沒有 USB PD，筆電不要插這個孔" }
      : { tier: "slow", why: `USB-A 孔最多 ${w}W，而且沒有 USB PD` };
  }
  if (d.needs === "avs") {
    if (lim.avs !== undefined && lim.avs >= d.fastW && w >= d.fastW) return { tier: "fast", why: `${w}W，AVS 到 ${lim.avs}W，Apple 寫的最快` };
    if (w >= d.okW) {
      const avs = lim.avs === undefined
        ? (alone ? "規格上沒寫 AVS" : "官方沒寫同時插的時候還有沒有 AVS")
        : `AVS 最多 ${lim.avs}W`;
      return { tier: "ok", why: `${w}W，但${/^[A-Z]/.test(avs) ? " " : ""}${avs}；Apple 要 ${d.fastW}W 的 AVS 才是最快` };
    }
  } else if (d.needs === "pps") {
    if (lim.pps !== undefined && lim.pps >= d.fastW) return { tier: "fast", why: `PPS ${lim.pps}W，超快速充電 3.0` };
    if (w >= d.okW) {
      const pps = lim.pps === undefined ? (alone ? "規格上沒寫 PPS" : "官方沒寫同時插的時候 PPS 剩多少") : `PPS 只到 ${lim.pps}W`;
      return { tier: "ok", why: `${w}W，但${/^[A-Z]/.test(pps) ? " " : ""}${pps}；三星要 PPS ${d.fastW}W 才是超快速充電 3.0` };
    }
  } else {
    if (w >= d.fastW && d.noFast) return { tier: "fast", why: `${w}W，比盒子裡附的 ${d.okW}W 大；官方沒寫再大會不會更快` };
    if (w >= d.fastW) return { tier: "fast", why: `${w}W，官方寫的最快` };
    if (w >= d.okW) return { tier: "ok", why: `${w}W，要 ${d.fastW}W 以上才是最快` };
  }
  return { tier: "slow", why: `只有 ${w}W，比${d.laptop ? "盒子裡附的" : "官方基本的"} ${d.okW}W 還小` };
}

const SCORE: Record<Tier, number> = { fast: 3, ok: 2, slow: 1, none: 0 };

export interface Fit {
  charger: Charger;
  /** 每一台拿到的；null 代表孔不夠，或官方沒寫這樣插會怎麼分 */
  got: Got[] | null;
  /** 為什麼沒辦法判斷 */
  gap?: string;
  fast: number;
  score: number;
  /** 這幾台加起來拿到幾瓦。同一級裡比這個 */
  watts: number;
}

/** 所有「裝置 → 孔」的排法 */
function* arrangements(n: number, ports: string[], prefix: string[] = []): Generator<string[]> {
  if (prefix.length === n) { yield prefix; return; }
  for (const p of ports) if (!prefix.includes(p)) yield* arrangements(n, ports, [...prefix, p]);
}

/**
 * 這幾台一起插在這一顆上，最好的插法是什麼。
 * together=false：一台一台輪流插，每一台都拿單孔的最大值
 */
export function fit(c: Charger, devices: Device[], together = true): Fit {
  if (devices.length === 0) return { charger: c, got: [], fast: 0, score: 0, watts: 0 };
  if (!together || devices.length === 1) {
    const got = devices.map((d) => {
      // 輪流插：挑對這一台最好的那個孔
      let best: Got | null = null;
      for (const p of c.ports) {
        const j = judge(d, p.kind, { w: p.w, pps: p.pps, avs: p.avs }, true);
        const g = { device: d, port: p.id, w: p.w, ...j };
        if (!best || SCORE[g.tier] > SCORE[best.tier] || (g.tier === best.tier && g.w > best.w)) best = g;
      }
      return best!;
    });
    return summarize(c, got);
  }
  if (devices.length > c.ports.length) {
    return { charger: c, got: null, gap: `只有 ${c.ports.length} 個孔`, fast: 0, score: -1, watts: 0 };
  }
  let best: Got[] | null = null;
  let bestScore = -1;
  let unknown = false;
  for (const arr of arrangements(devices.length, c.ports.map((p) => p.id))) {
    const lims = limitsOf(c, arr);
    if (!lims) { unknown = true; continue; }
    const got = devices.map((d, i) => {
      const port = c.ports.find((p) => p.id === arr[i])!;
      return { device: d, port: port.id, w: lims[i].w, ...judge(d, port.kind, lims[i], false) };
    });
    const s = got.reduce((a, g) => a + SCORE[g.tier] * 10 + g.w / 100, 0);
    if (s > bestScore) { bestScore = s; best = got; }
  }
  if (!best) return { charger: c, got: null, gap: unknown ? "官方沒寫這樣一起插，每個孔各剩幾瓦" : "插不下", fast: 0, score: -1, watts: 0 };
  return summarize(c, best);
}

function summarize(c: Charger, got: Got[]): Fit {
  return {
    charger: c,
    got,
    fast: got.filter((g) => g.tier === "fast").length,
    score: got.reduce((a, g) => a + SCORE[g.tier], 0),
    watts: got.reduce((a, g) => a + g.w, 0),
  };
}

/**
 * 照你的裝置排：全部最快的在前，再來是最快的台數多的。
 * 同一級裡：全部都最快的，買得到的、便宜的在前（多花錢買更大的瓦數沒有用）；
 * 還沒到最快的，拿到瓦數多的在前（60W 沒 AVS 還是比 20W 快）。
 */
export function rank(devices: Device[], together = true): Fit[] {
  const all = devices.length;
  return chargers
    .map((c) => fit(c, devices, together))
    .sort((a, b) =>
      b.score - a.score || b.fast - a.fast ||
      (a.fast === all ? 0 : b.watts - a.watts) ||
      (liveCharger(a.charger).length > 0 ? 0 : 1) - (liveCharger(b.charger).length > 0 ? 0 : 1) ||
      (a.charger.listPrice ?? 1e9) - (b.charger.listPrice ?? 1e9));
}

/* ------------------------------------------------------------------ */
/* 買得到嗎                                                             */
/* ------------------------------------------------------------------ */

export const liveCharger = (c: Charger): Merchant[] => c.price.merchants.filter((m) => !m.dead && !m.soldOut);
export const buyableCharger = (c: Charger): boolean => liveCharger(c).length > 0;
/** 同一顆最便宜的那一家 */
export function anchorCharger(c: Charger): Merchant | undefined {
  const live = liveCharger(c);
  return live.length ? live.reduce((a, b) => (b.amount < a.amount ? b : a)) : undefined;
}

/** 這一顆的孔：「2 個 USB-C」「2 個 USB-C、1 個 USB-A」 */
export function portsZh(c: Charger): string {
  const n = (k: PortKind) => c.ports.filter((p) => p.kind === k).length;
  return [n("C") && `${n("C")} 個 USB-C`, n("A") && `${n("A")} 個 USB-A`].filter(Boolean).join("、");
}
