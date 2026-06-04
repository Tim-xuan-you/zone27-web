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
