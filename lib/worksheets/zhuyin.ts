/**
 * 學習單上的注音：字的右邊直排注音，聲調在最後一個符號的右上，輕聲的點在第一個符號上面。
 * 跟國小課本的排法一樣。
 *
 * 只收學習單上真的用到的字，每個字的讀音都是查過的（教育部國語辭典）。
 * 「一」「不」標本調（課本的做法，唸的時候再變調）。
 * 同一個字在不同詞裡讀音不同，寫成 {字|注音} 指定，例如 {得|˙ㄉㄜ}。
 *
 * 2026-10-01 Tim：孩子讀的字，用詞要照那張學習單的年紀（memory: kids-worksheet-wording）。
 * 規則句子改之前先看那份紀錄。
 */

export const ZHUYIN: Record<string, string> = {
  // 撿松果回家
  撿: "ㄐㄧㄢˇ", 松: "ㄙㄨㄥ", 果: "ㄍㄨㄛˇ", 回: "ㄏㄨㄟˊ", 家: "ㄐㄧㄚ",
  幫: "ㄅㄤ", 小: "ㄒㄧㄠˇ", 鼠: "ㄕㄨˇ", 每: "ㄇㄟˇ", 一: "ㄧ", 顆: "ㄎㄜ", 都: "ㄉㄡ", 要: "ㄧㄠˋ", 到: "ㄉㄠˋ",
  格: "ㄍㄜˊ", 只: "ㄓˇ", 能: "ㄋㄥˊ", 走: "ㄗㄡˇ", 次: "ㄘˋ", 這: "ㄓㄜˋ", 樣: "ㄧㄤˋ",
  // 共用
  名: "ㄇㄧㄥˊ", 字: "ㄗˋ", 日: "ㄖˋ", 期: "ㄑㄧˊ", 第: "ㄉㄧˋ", 關: "ㄍㄨㄢ",
  提: "ㄊㄧˊ", 示: "ㄕˋ", 答: "ㄉㄚˊ", 案: "ㄢˋ", 和: "ㄏㄜˊ",
};

const TONES = "ˊˇˋ";
const FONT_KAI = "Iansui, 'Iansui Fallback', DFKai-SB, BiauKai, serif";
const FONT_SANS = "'Noto Sans TC', 'Noto Sans TC Fallback', sans-serif";

type Unit = { ch: string; zy?: string };
function units(text: string): Unit[] {
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
