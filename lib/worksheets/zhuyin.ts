/**
 * 學習單上的注音：字的右邊直排注音，聲調在最後一個符號的右上，輕聲的點在第一個符號上面。
 * 跟國小課本的排法一樣。
 *
 * 只收學習單上真的用到的字，每個字的讀音都是查過的（教育部國語辭典）。
 * 「一」「不」標本調（課本的做法，唸的時候再變調）。「個」當量詞是輕聲 ˙ㄍㄜ（辭典：一個、這個、幾個都是）。
 * 同一個字在不同詞裡讀音不同，寫成 {字|注音} 指定，例如 {得|˙ㄉㄜ}。
 *
 * 2026-10-01 Tim：孩子讀的字，用詞要照那張學習單的年紀（memory: kids-worksheet-wording）。
 * 規則句子改之前先看那份紀錄。
 */

export const ZHUYIN: Record<string, string> = {
  // 撿松果回家
  撿: "ㄐㄧㄢˇ", 松: "ㄙㄨㄥ", 果: "ㄍㄨㄛˇ", 回: "ㄏㄨㄟˊ", 家: "ㄐㄧㄚ",
  幫: "ㄅㄤ", 像: "ㄒㄧㄤˋ", 小: "ㄒㄧㄠˇ", 鼠: "ㄕㄨˇ", 每: "ㄇㄟˇ", 一: "ㄧ", 顆: "ㄎㄜ", 都: "ㄉㄡ", 要: "ㄧㄠˋ", 到: "ㄉㄠˋ",
  格: "ㄍㄜˊ", 個: "˙ㄍㄜ", 子: "˙ㄗ", 只: "ㄓˇ", 能: "ㄋㄥˊ", 走: "ㄗㄡˇ", 次: "ㄘˋ", 這: "ㄓㄜˋ", 樣: "ㄧㄤˋ",
  // 出題紙（2026-10-01）
  換: "ㄏㄨㄢˋ", 你: "ㄋㄧˇ", 出: "ㄔㄨ", 題: "ㄊㄧˊ", 目: "ㄇㄨˋ", 的: "˙ㄉㄜ", 人: "ㄖㄣˊ", 寫: "ㄒㄧㄝˇ",
  在: "ㄗㄞˋ", 虛: "ㄒㄩ", 線: "ㄒㄧㄢˋ", 上: "ㄕㄤˋ", 畫: "ㄏㄨㄚˋ", 牆: "ㄑㄧㄤˊ", 裡: "ㄌㄧˇ",
  自: "ㄗˋ", 己: "ㄐㄧˇ", 先: "ㄒㄧㄢ", 看: "ㄎㄢˋ", 再: "ㄗㄞˋ", 給: "ㄍㄟˇ", 別: "ㄅㄧㄝˊ",
  下: "ㄒㄧㄚˋ", 面: "ㄇㄧㄢˋ", 往: "ㄨㄤˇ", 後: "ㄏㄡˋ", 摺: "ㄓㄜˊ", 不: "ㄅㄨˋ", 偷: "ㄊㄡ",
  // 注音猜猜看（2026-10-09）。圈：畫圈的 ㄑㄩㄢ，不是豬圈的 ㄐㄩㄢˋ
  注: "ㄓㄨˋ", 音: "ㄧㄣ", 猜: "ㄘㄞ", 唸: "ㄋㄧㄢˋ", 左: "ㄗㄨㄛˇ", 邊: "ㄅㄧㄢ", 圈: "ㄑㄩㄢ", 對: "ㄉㄨㄟˋ", 圖: "ㄊㄨˊ",
  說: "ㄕㄨㄛ", 它: "ㄊㄚ",
  // 共用
  名: "ㄇㄧㄥˊ", 字: "ㄗˋ", 日: "ㄖˋ", 期: "ㄑㄧˊ", 第: "ㄉㄧˋ", 關: "ㄍㄨㄢ",
  提: "ㄊㄧˊ", 示: "ㄕˋ", 答: "ㄉㄚˊ", 案: "ㄢˋ", 和: "ㄏㄜˊ",
};

const TONES = "ˊˇˋ";
const FONT_KAI = "Iansui, 'Iansui Fallback', DFKai-SB, BiauKai, serif";
const FONT_SANS = "'Noto Sans TC', 'Noto Sans TC Fallback', sans-serif";

type Unit = { ch: string; zy?: string };
/**
 * 詞裡面讀音跟單字不一樣的（多半是輕聲）。寫到這些詞會自動換成對的讀音，不用每次記得寫 {字|注音}。
 * 每一個都對過教育部國語辭典（2026-10-09：「名字」以前標成 ㄗˋ，辭典是輕聲 ˙ㄗ，已經上線的學習單一起改了）。
 */
export const PHRASES: Record<string, string[]> = {
  名字: ["ㄇㄧㄥˊ", "˙ㄗ"],
};

function units(text: string): Unit[] {
  // 先把詞換成 {字|注音}，再一個字一個字拆
  for (const [w, zy] of Object.entries(PHRASES)) text = text.split(w).join([...w].map((c, i) => `{${c}|${zy[i]}}`).join(""));
  const out: Unit[] = [];
  for (const m of text.matchAll(/\{(.)\|([^}]+)\}|(.)/gu)) {
    if (m[1]) out.push({ ch: m[1], zy: m[2] });
    else out.push({ ch: m[3], zy: ZHUYIN[m[3]] });
  }
  return out;
}

/** 這個字沒有收注音、又是中文字：出題的人漏查了，build 前就要發現 */
export function missingZhuyin(text: string): string[] {
  return units(text).filter((u) => !u.zy && /[㐀-鿿]/.test(u.ch)).map((u) => u.ch);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/**
 * 一行有注音的字，畫成 SVG（單位：公釐）。
 * x 是這一行的左邊，y 是字的中線，size 是國字的大小。
 * 回傳 SVG 片段和這一行的寬度。
 */
export function zyLine(text: string, x: number, y: number, size: number, color = "#3E4348"): { svg: string; width: number } {
  const s = size;
  const b = s * 0.33; // 注音符號的大小
  const lineH = b * 1.04;
  let cx = x;
  const parts: string[] = [];
  for (const u of units(text)) {
    if (!u.zy && /[㐀-鿿]/.test(u.ch) && typeof window === "undefined") {
      // 孩子讀的字一定要有注音。漏查的字在 build 的時候就擋下來，不要印出一個沒有注音的字
      throw new Error(`學習單上的「${u.ch}」（在「${text}」裡）還沒有注音，先加進 lib/worksheets/zhuyin.ts 的 ZHUYIN`);
    }
    if (!u.zy) {
      // 標點、數字：沒有注音
      const isAscii = /[0-9A-Za-z]/.test(u.ch);
      parts.push(`<text x="${cx}" y="${y}" font-size="${s}" font-family="${isAscii ? FONT_SANS : FONT_KAI}" dominant-baseline="central" fill="${color}">${esc(u.ch)}</text>`);
      cx += isAscii ? s * 0.62 : s * 0.9;
      continue;
    }
    const light = u.zy.startsWith("˙");
    const body = u.zy.replace("˙", "");
    const last = body[body.length - 1] ?? "";
    const tone = TONES.includes(last) ? last : "";
    const syms = [...(tone ? body.slice(0, -1) : body)];
    parts.push(`<text x="${cx}" y="${y}" font-size="${s}" font-family="${FONT_KAI}" dominant-baseline="central" fill="${color}">${esc(u.ch)}</text>`);
    const col = cx + s * 1.03 + b / 2;
    const top = y - (syms.length * lineH) / 2;
    syms.forEach((sym, k) => {
      parts.push(`<text x="${col}" y="${top + (k + 0.5) * lineH}" font-size="${b}" font-family="${FONT_KAI}" text-anchor="middle" dominant-baseline="central" fill="${color}">${sym}</text>`);
    });
    if (tone) {
      const ly = top + (syms.length - 0.5) * lineH;
      parts.push(`<text x="${col + b * 0.46}" y="${ly + b * 0.02}" font-size="${b}" font-family="${FONT_KAI}" dominant-baseline="central" fill="${color}">${tone}</text>`);
    }
    if (light) {
      parts.push(`<text x="${col}" y="${top - b * 0.18}" font-size="${b}" font-family="${FONT_KAI}" text-anchor="middle" dominant-baseline="central" fill="${color}">˙</text>`);
    }
    cx += s * 1.03 + b + s * 0.3;
  }
  return { svg: parts.join(""), width: cx - x };
}

/**
 * 只畫注音、不畫國字（注音猜猜看用）：每個字一直排，從左到右排開，置中在 (cx, cy)。
 * b 是注音符號的大小。聲調在最後一個符號右上，輕聲的點在最上面，跟課本一樣。
 */
export function zyBlock(syllables: string[], cx: number, cy: number, b: number, color = "#3E4348"): { svg: string; width: number; height: number } {
  const lineH = b * 1.08;
  const colW = b * 1.0, gap = b * 0.95;
  const cols = syllables.map((zy) => {
    const light = zy.startsWith("˙");
    const body = zy.replace("˙", "");
    const last = body[body.length - 1] ?? "";
    const tone = TONES.includes(last) ? last : "";
    return { light, tone, syms: [...(tone ? body.slice(0, -1) : body)] };
  });
  const height = Math.max(...cols.map((c) => c.syms.length)) * lineH;
  const width = cols.length * colW + (cols.length - 1) * gap + b * 0.5;
  let x = cx - width / 2 + colW / 2;
  const parts: string[] = [];
  for (const c of cols) {
    const top = cy - (c.syms.length * lineH) / 2;
    c.syms.forEach((sym, k) => {
      parts.push(`<text x="${x}" y="${top + (k + 0.5) * lineH}" font-size="${b}" font-family="${FONT_KAI}" text-anchor="middle" dominant-baseline="central" fill="${color}">${sym}</text>`);
    });
    if (c.tone) {
      const ly = top + (c.syms.length - 0.5) * lineH;
      parts.push(`<text x="${x + b * 0.5}" y="${ly + b * 0.02}" font-size="${b}" font-family="${FONT_KAI}" dominant-baseline="central" fill="${color}">${c.tone}</text>`);
    }
    if (c.light) parts.push(`<text x="${x}" y="${top - b * 0.32}" font-size="${b}" font-family="${FONT_KAI}" text-anchor="middle" dominant-baseline="central" fill="${color}">˙</text>`);
    x += colW + gap;
  }
  return { svg: parts.join(""), width, height };
}
