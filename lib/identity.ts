// ── ZONE 27 · Identity helpers(頭像 + 顯示名)──────────────
// 2026-06-04 R197 · Tim dogfood「球迷 #46f6741a 根本不知道是誰 · 網站很死板
// 很理工男 · 沒有圖像 · 像陰沉地獄」· Polymarket go。
//
// 解法 ≠ 抄玩運彩招財貓/紅綠/閃亮(踩爆品牌鐵律 = 變另一個玩運彩)。
// 解法 = 給「人」一張**幾何漸層臉**:深藍底 + 一個品牌色字符,seed 衍生、
// 人人不同、永遠一致 = Polymarket/Linear/GitHub identicon 的高級版。
// 把「一行等寬字」變成「一個有顏色有臉的人」= 討論區從試算表變有人氣。
//
// accent 全限定在金/琥珀/teal/古銅/鋼藍/鼠尾草「高級金屬」家族 ——
// 絕無純紅綠(守 /禁止紅綠對比 鐵律)· 變化夠 = 不死板,但不 garish。
// 純衍生 · 0 PII · 0 新資料。
// ─────────────────────────────────────────────────────

// djb2 · 確定性字串雜湊(不可用 Math.random:同 seed 每次同色)。
export function seedHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

// 高級金屬色盤 · 金 / 琥珀 / teal / 古銅 / 鋼藍 / 鼠尾草 / 暖金 · 無紅綠衝突。
const ACCENTS = [
  "#D4AF37", // 冷金(品牌主色)
  "#C99A3C", // 琥珀
  "#4FA595", // teal
  "#C2773E", // 古銅
  "#8AA0C4", // 鋼藍
  "#B0954E", // 暖金
  "#6FB39A", // 鼠尾草綠(柔 · 非號誌綠)
  "#C9A24E", // 黃銅
];

export type AvatarColors = { bg1: string; bg2: string; accent: string };

// seed → { 深藍漸層底, 品牌色 accent } · 底色 hue 微移(197–215 深藍帶)
// 讓每張臉的底也略不同 = 更有變化但仍是深藍家族。
export function avatarColors(seed: string): AvatarColors {
  const h = seedHash(seed);
  const accent = ACCENTS[h % ACCENTS.length];
  const hue = 206 + ((h >> 4) % 18) - 9; // ~197–215
  return {
    bg1: `hsl(${hue} 34% 15%)`,
    bg2: `hsl(${hue} 42% 9%)`,
    accent,
  };
}

// handle → 頭像上顯示的字符。
//   「球迷 #46f6741a」→「46」(代號前 2 碼 · 唯一可辨)
//   真名「王小明 / Tim」→ 中文取首字、英文取前 2 字大寫。
export function handleGlyph(handle: string): string {
  const hash = handle.match(/#\s*([0-9a-fA-F]{2})/);
  if (hash) return hash[1].toUpperCase();
  const name = handle.replace(/^球迷\s*#?\s*/, "").trim();
  if (!name) return "27";
  const first = [...name][0];
  if (/[㐀-鿿豈-﫿]/.test(first)) return first; // CJK 取首字
  return name.slice(0, 2).toUpperCase();
}

// 頭像配色的「穩定 seed」· 從 handle 抽出代號雜湊部分(#46f6741a)·
// 之後加了顯示名,顏色仍綁這個穩定碼 = 改名不換臉色。
export function stableSeed(handle: string): string {
  const hash = handle.match(/#\s*([0-9a-fA-F]+)/);
  return hash ? hash[1] : handle;
}

// 從 user_metadata 讀公開顯示名(會員自己填 · opt-in · 預設空 = 用匿名代號)。
export function readDisplayName(
  meta: Record<string, unknown> | null | undefined,
): string {
  if (!meta) return "";
  const n = meta["display_name"];
  return typeof n === "string" ? n.trim() : "";
}

// ── 隊伍視覺身分 · 真隊色(調過)+ 中文單字隊徽 ──────────────
// R197 Tim「隊徽要用各隊真隊色嗎?」→ 要(辨識度 · 球迷靠顏色秒認隊)· 但工藝處理:
//   · 富邦藍 #1E3A8A 跟深藍底幾乎隱形 → 提亮成天藍
//   · 樂天紅 / 味全紅 兩支撞色 → 味全偏緋紅、樂天偏橘紅,微分開
//   · 全部夠亮可在深藍底辨認 · 當「小重點(字+細框)」不當大色塊(守不變賭場)
// 中文單字隊徽(兄/統/樂/富/龍/台)· 台灣球迷秒懂 · 勝過模糊的拉丁字母(G/W/R)。
// 平面(非 3D 吉祥物)= ESPN/The Athletic/Polymarket 運動的高級語彙,非玩運彩立體 logo。
// keyword 比對(富邦/統一… 永遠是隊名子字串)· 比 getTeamByName 精確比對更耐名稱變體。
const TEAM_IDENTITY: { kw: string; color: string; glyph: string }[] = [
  { kw: "富邦", color: "#5E8FD8", glyph: "富" }, // 富邦藍 → 提亮天藍(原 #1E3A8A 會隱形)
  { kw: "統一", color: "#F0863C", glyph: "統" }, // 統一橘
  { kw: "兄弟", color: "#E6C04A", glyph: "兄" }, // 兄弟黃
  { kw: "樂天", color: "#E85C4A", glyph: "樂" }, // 樂天紅(偏橘紅)
  { kw: "味全", color: "#D44E6E", glyph: "龍" }, // 味全紅(偏緋 · 跟樂天分開)
  { kw: "台鋼", color: "#2FB08C", glyph: "台" }, // 台鋼綠(偏 teal · 提亮)
];

export function teamIdentity(
  name: string,
): { color: string; glyph: string } | null {
  return TEAM_IDENTITY.find((t) => name.includes(t.kw)) ?? null;
}

// ── MLB 30 隊真隊色 · 隊徽用英文官方縮寫(LAD/NYY/HOU)──────────────
// R199 Tim「MLB 隊徽很爛 · 沒象徵性 · 換英文?顏色改?」→ 兩個都對:
//   · 中文首字(休/匹/亞)對 MLB 隊毫無辨識度 + 生成色毫無意義。
//   · 全球球迷認 MLB 隊靠的就是官方縮寫 + 招牌色(道奇藍 LAD · 洋基藍 NYY)。
// 縮寫 keyed by abbr(lib/mlb.ts TEAM_ZH 的 abbr · 穩定)· 顏色 = 各隊真招牌色
// 調成「深藍底可辨 + 不 neon」(同 CPBL 隊徽紀律:小重點不大色塊 · 當字色+細框)。
// 紅藍橘多隊撞色是 MLB 現實 —— 縮寫負責區分 · 顏色是輔助識別。
const MLB_TEAM_COLORS: Record<string, string> = {
  LAA: "#D86470", ARI: "#C76B7E", BAL: "#E8843E", BOS: "#DB535D",
  CHC: "#5E8FD8", CIN: "#DC5560", CLE: "#CB5A66", COL: "#9B7BD4",
  DET: "#5E84C4", HOU: "#EE7E32", KC: "#4D8FCF", LAD: "#3E9BE0",
  WSH: "#CB5560", NYM: "#F0843C", ATH: "#E0B84C", PIT: "#F5C542",
  SD: "#C39A6B", SEA: "#3D9B8E", SF: "#F58C46", STL: "#DB535D",
  TB: "#7FB6E2", TEX: "#4D7FCF", TOR: "#5A8FD8", MIN: "#CC5E74",
  PHI: "#E2565F", ATL: "#D44E5E", CHW: "#AEB4BE", MIA: "#3AAEE0",
  NYY: "#6A9BD8", MIL: "#C9A24E",
};

/**
 * 隊徽身分(顏色 + 字符)· 跨聯盟:
 *   · MLB → 英文官方縮寫 + 真招牌色(en = abbr)。
 *   · CPBL → 中文單字 + 真隊色(keyword 比對 name)。
 *   · 不認得 → null(Avatar 退回 seed 衍生臉)。
 */
export function getTeamCrest(
  name: string,
  en: string | undefined,
  league: string | undefined,
): { color: string; glyph: string } | null {
  if (league === "MLB" && en) {
    const abbr = en.toUpperCase();
    const color = MLB_TEAM_COLORS[abbr];
    if (color) return { color, glyph: abbr };
  }
  return teamIdentity(name);
}

// @ 標記用的乾淨短碼:「球迷 #2b8e59f9」→「#2b8e59f9」(去「球迷 」前綴 + 空格 ·
// 不然 @ 出來是醜長的「@球迷 #2b8e59f9」且帶空格難 highlight)· 顯示名 → 原樣(@阿宏)。
export function mentionToken(handle: string): string {
  const hex = handle.match(/#\s*([0-9a-fA-F]+)/);
  if (hex) return "#" + hex[1];
  return handle.trim();
}
