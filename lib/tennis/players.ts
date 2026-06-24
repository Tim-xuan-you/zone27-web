import { blendedRating, type TennisPlayerRating } from "@/lib/tennis/engine";

// ── ZONE 27 · 網球球員實力分種子表(編輯判斷 · 草地 v0.1)──────────────────────
// 🔴 誠實揭露:下面的分數是「種子估計值」—— 從公開世界排名 + 近年草地戰績,用我們的
//   編輯判斷起手(完全等同足球國家隊的種子分 teams-data)。 它們不是官方數據、不是
//   Tennis Abstract 的 Elo 檔(那是非商業授權 · 我們不轉載)· 而是我們自己的起點,
//   會隨溫網 2026 真實賽果一場一場更新。 引擎只看實力分:沒看臨場傷停 / 天氣 / 心理。
//
// 時點 = 2026-06-24(溫網前 · 籤表 6/26 出爐)· 已剔除確定傷退者(阿爾卡拉斯手腕 /
//   姆博科膝蓋)—— 我們不列不會上場的人(不灌名單)。 Elo 尺:~1500 巡迴賽中段、
//   ~2000 頂尖、~2150 球王。 草地分 vs 總分的差 = 該球員草地相對強 / 弱(大發球手 +、
//   紅土型 −)。
// ─────────────────────────────────────────────────────

// engine.ts 不認得 TennisTour(屬球員域)· 在這裡定義 + re-export 給頁面用。
export type TennisTourKey = "atp" | "wta";
export type TennisTier = "elite" | "strong" | "solid" | "darkhorse";

export type TennisPlayer = {
  /** slug · 頭像 seed + 之後鎖定的 player key */
  id: string;
  /** 顯示名(台灣媒體常用譯名 · 無公認譯名者用音譯並於 read 誠實) */
  name: string;
  /** 英文全名 */
  en: string;
  tour: TennisTourKey;
  /** 約略世界排名(2026-06 · 種子估計 · 籤表前) */
  rank: number;
  rating: TennisPlayerRating;
  /** 草地實力等級(我們的誠實讀法 · 非官方種子) */
  tier: TennisTier;
  /** 一句草地讀法(誠實 · 含弱點) */
  read: string;
};

// ── 男子(ATP)· 草地實力種子(2026-06)── 阿爾卡拉斯傷退已剔除 ──────────────
const ATP: TennisPlayer[] = [
  { id: "sinner", name: "辛納", en: "Jannik Sinner", tour: "atp", rank: 1,
    rating: { overall: 2160, grass: 2180 }, tier: "elite",
    read: "衛冕冠軍 · 球王 · 草地頂尖,本屆最大熱門。" },
  { id: "djokovic", name: "喬科維奇", en: "Novak Djokovic", tour: "atp", rank: 8,
    rating: { overall: 2000, grass: 2075 }, tier: "elite",
    read: "七座溫網 · 全場草地履歷最深;年齡校正後仍是真威脅,但不再是頭號熱門。" },
  { id: "fritz", name: "弗里茨", en: "Taylor Fritz", tour: "atp", rank: 7,
    rating: { overall: 1955, grass: 2005 }, tier: "strong",
    read: "大發球 · 2026 哈勒草地亞軍 · 草地是他最舒服的場地之一。" },
  { id: "zverev", name: "茲韋列夫", en: "Alexander Zverev", tour: "atp", rank: 3,
    rating: { overall: 2055, grass: 1975 }, tier: "solid",
    read: "排名高、但草地是他相對最弱的場地(無溫網決賽)· 引擎據此誠實扣分。" },
  { id: "shelton", name: "謝爾頓", en: "Ben Shelton", tour: "atp", rank: 5,
    rating: { overall: 1925, grass: 1975 }, tier: "strong",
    read: "左手巨砲發球 · 打法吃草地 · 上升中。" },
  { id: "fap", name: "奧傑-阿利亞辛", en: "Félix Auger-Aliassime", tour: "atp", rank: 4,
    rating: { overall: 1905, grass: 1960 }, tier: "strong",
    read: "大發球、草地友善打法 · 哈勒一路殺進後段。" },
  { id: "deminaur", name: "德米納爾", en: "Alex de Minaur", tour: "atp", rank: 6,
    rating: { overall: 1930, grass: 1945 }, tier: "solid",
    read: "移動快、草地腳程好 · 女王盃有資歷。" },
  { id: "medvedev", name: "梅德韋傑夫", en: "Daniil Medvedev", tour: "atp", rank: 9,
    rating: { overall: 1940, grass: 1930 }, tier: "solid",
    read: "2023 溫網四強 · 草地打法彆扭但能贏。" },
  { id: "tiafoe", name: "提亞佛", en: "Frances Tiafoe", tour: "atp", rank: 16,
    rating: { overall: 1860, grass: 1955 }, tier: "darkhorse",
    read: "剛奪 2026 哈勒草地冠軍(擊敗弗里茨)· 排名外但草地當下手感火燙。" },
  { id: "bublik", name: "布布利克", en: "Alexander Bublik", tour: "atp", rank: 11,
    rating: { overall: 1855, grass: 1930 }, tier: "darkhorse",
    read: "大發球、鬼神球路 · 草地真黑馬,誰抽到他都頭痛。" },
  { id: "cerundolo", name: "塞倫多洛", en: "Francisco Cerúndolo", tour: "atp", rank: 17,
    rating: { overall: 1850, grass: 1925 }, tier: "darkhorse",
    read: "剛奪 2026 女王盃草地冠軍 · 草地近況證明自己。" },
  { id: "ruud", name: "魯德", en: "Casper Ruud", tour: "atp", rank: 12,
    rating: { overall: 1950, grass: 1820 }, tier: "solid",
    read: "紅土型球員 · 草地歷史偏弱 —— 引擎大幅扣草地分,不被總排名騙。" },
];

// ── 女子(WTA)· 草地實力種子(2026-06)── 姆博科傷退已剔除 ────────────────
const WTA: TennisPlayer[] = [
  { id: "sabalenka", name: "莎芭蓮卡", en: "Aryna Sabalenka", tour: "wta", rank: 1,
    rating: { overall: 2150, grass: 2120 }, tier: "elite",
    read: "世界第一 · 多次溫網四強 · 強力打法吃草地。" },
  { id: "rybakina", name: "雷巴金娜", en: "Elena Rybakina", tour: "wta", rank: 2,
    rating: { overall: 2050, grass: 2150 }, tier: "elite",
    read: "2022 溫網冠軍 · 巨砲發球 · 全場頭號草地殺手(草地分比總分還高)。" },
  { id: "swiatek", name: "史瓦特克", en: "Iga Świątek", tour: "wta", rank: 3,
    rating: { overall: 2095, grass: 2085 }, tier: "elite",
    read: "衛冕冠軍(2025 溫網)· 全面、草地已證明。" },
  { id: "anisimova", name: "阿尼西莫娃", en: "Amanda Anisimova", tour: "wta", rank: 6,
    rating: { overall: 1955, grass: 2010 }, tier: "strong",
    read: "2025 溫網亞軍 · 平擊強、吃草地。" },
  { id: "gauff", name: "高芙", en: "Coco Gauff", tour: "wta", rank: 7,
    rating: { overall: 2005, grass: 2010 }, tier: "strong",
    read: "運動能力頂級、草地移動好 · 溫網八強級。" },
  { id: "pegula", name: "佩古拉", en: "Jessica Pegula", tour: "wta", rank: 4,
    rating: { overall: 1985, grass: 2000 }, tier: "strong",
    read: "草地穩 · 2026 柏林草地亞軍。" },
  { id: "andreeva", name: "安德烈耶娃", en: "Mirra Andreeva", tour: "wta", rank: 5,
    rating: { overall: 1990, grass: 1975 }, tier: "strong",
    read: "年輕、進步快 · 草地深入過 · 上升曲線陡。" },
  { id: "noskova", name: "諾斯科娃", en: "Linda Nosková", tour: "wta", rank: 10,
    rating: { overall: 1900, grass: 1975 }, tier: "strong",
    read: "剛奪 2026 柏林草地冠軍(擊敗佩古拉)· 草地當下手感最熱之一。" },
  { id: "paolini", name: "保里尼", en: "Jasmine Paolini", tour: "wta", rank: 14,
    rating: { overall: 1950, grass: 1985 }, tier: "strong",
    read: "2024 溫網亞軍 · 草地有底,排名略外但別小看。" },
  { id: "svitolina", name: "斯維托麗娜", en: "Elina Svitolina", tour: "wta", rank: 8,
    rating: { overall: 1920, grass: 1960 }, tier: "solid",
    read: "兩度溫網四強 · 經驗豐富的草地老手。" },
  { id: "muchova", name: "穆霍娃", en: "Karolína Muchová", tour: "wta", rank: 11,
    rating: { overall: 1930, grass: 1930 }, tier: "solid",
    read: "球路多變、草地能打 · 隱憂是傷病史。" },
  { id: "bencic", name: "本西奇", en: "Belinda Bencic", tour: "wta", rank: 12,
    rating: { overall: 1880, grass: 1920 }, tier: "solid",
    read: "草地移動好、奧運級資歷。" },
];

export const TENNIS_PLAYERS: TennisPlayer[] = [...ATP, ...WTA];

/** 查一位球員(slug)。 */
export function getTennisPlayer(id: string): TennisPlayer | undefined {
  return TENNIS_PLAYERS.find((p) => p.id === id);
}

/** 英文名 → 頭像字符(首名 + 姓 首字母 · 例 "Jannik Sinner" → "JS")· 對戰卡 / 實力榜共用。 */
export function initials(en: string): string {
  const parts = en.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

/** 某巡迴賽的草地排行(依「草地混合分」由高到低 · board 用 · deterministic)。 */
export function grassContenders(tour: TennisTourKey): TennisPlayer[] {
  return TENNIS_PLAYERS.filter((p) => p.tour === tour)
    .slice()
    .sort(
      (a, b) =>
        blendedRating(b.rating.overall, b.rating.grass) -
        blendedRating(a.rating.overall, a.rating.grass),
    );
}
