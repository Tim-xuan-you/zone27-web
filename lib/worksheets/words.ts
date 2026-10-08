/**
 * 注音猜猜看用的詞（2026-10-01，點子是 Tim 家的大班生出的：上面寫注音、猜是什麼東西）。
 *
 * 每一個詞的注音都對過教育部《國語辭典簡編本》（scripts/worksheets-zhuyin-check.ts 會自動去查）。
 * 同一個字辭典有兩種讀音、或學校課本常見另一種念法的，不收：
 * 例如「骨頭」辭典寫 ㄍㄨˊ ˙ㄊㄡ，孩子自己寫的是 ㄍㄨˇ ㄊㄡˊ，大人也常念 ㄍㄨˇ。這種會讓孩子跟學校教的打架，先不用。
 *
 * 每個詞都要有一張一眼就認得出來的圖（lib/worksheets/icons.ts）。認不出來的圖，錯的是圖不是孩子，所以寧可不收。
 */

export interface Word {
  /** 圖示編號（icons.ts） */
  icon: string;
  zh: string;
  /** 每一個字的注音，輕聲寫成 ˙ㄗ */
  zy: string[];
  /** 辭典有兩種以上讀音、我們看過確定用第一個的：寫原因 */
  multiOk?: string;
}

export const WORDS: Word[] = [
  // 一個字
  { icon: "cat", zh: "貓", zy: ["ㄇㄠ"] },
  { icon: "fish", zh: "魚", zy: ["ㄩˊ"] },
  { icon: "rain", zh: "雨", zy: ["ㄩˇ"], multiOk: "另一個 ㄩˋ 是文言的動詞（雨雪），孩子遇不到" },
  { icon: "book", zh: "書", zy: ["ㄕㄨ"] },
  { icon: "tree", zh: "樹", zy: ["ㄕㄨˋ"] },
  { icon: "soup", zh: "湯", zy: ["ㄊㄤ"], multiOk: "另一個 ㄕㄤ 只用在「湯湯」（水流很大）" },
  { icon: "candy", zh: "糖", zy: ["ㄊㄤˊ"] },
  { icon: "duck", zh: "鴨", zy: ["ㄧㄚ"] },
  { icon: "tooth", zh: "牙", zy: ["ㄧㄚˊ"] },
  { icon: "pig", zh: "豬", zy: ["ㄓㄨ"] },
  { icon: "bamboo", zh: "竹", zy: ["ㄓㄨˊ"] },
  { icon: "flower", zh: "花", zy: ["ㄏㄨㄚ"] },
  { icon: "painting", zh: "畫", zy: ["ㄏㄨㄚˋ"] },
  { icon: "star", zh: "星", zy: ["ㄒㄧㄥ"] },
  { icon: "heart", zh: "心", zy: ["ㄒㄧㄣ"] },
  { icon: "mountain", zh: "山", zy: ["ㄕㄢ"] },
  { icon: "umbrella", zh: "傘", zy: ["ㄙㄢˇ"] },
  { icon: "cow", zh: "牛", zy: ["ㄋㄧㄡˊ"] },
  { icon: "bird", zh: "鳥", zy: ["ㄋㄧㄠˇ"] },
  { icon: "dog", zh: "狗", zy: ["ㄍㄡˇ"] },
  { icon: "drum", zh: "鼓", zy: ["ㄍㄨˇ"] },
  { icon: "boat", zh: "船", zy: ["ㄔㄨㄢˊ"] },
  { icon: "bed", zh: "床", zy: ["ㄔㄨㄤˊ"] },
  { icon: "shoe", zh: "鞋", zy: ["ㄒㄧㄝˊ"] },
  { icon: "shrimp", zh: "蝦", zy: ["ㄒㄧㄚ"], multiOk: "另一個 ㄏㄚˊ 只用在「蝦蟆」" },
  { icon: "ball", zh: "球", zy: ["ㄑㄧㄡˊ"] },
  { icon: "fire", zh: "火", zy: ["ㄏㄨㄛˇ"] },
  { icon: "door", zh: "門", zy: ["ㄇㄣˊ"] },
  { icon: "egg", zh: "蛋", zy: ["ㄉㄢˋ"] },
  { icon: "sheep", zh: "羊", zy: ["ㄧㄤˊ"], multiOk: "辭典先列的 ㄒㄧㄤˊ 是古書裡通「祥」，孩子遇不到" },
  { icon: "lock", zh: "鎖", zy: ["ㄙㄨㄛˇ"] },
  // 兩個字
  { icon: "car", zh: "車子", zy: ["ㄔㄜ", "˙ㄗ"] },
  { icon: "fork", zh: "叉子", zy: ["ㄔㄚ", "˙ㄗ"] },
  { icon: "cup", zh: "杯子", zy: ["ㄅㄟ", "˙ㄗ"] },
  { icon: "apple", zh: "蘋果", zy: ["ㄆㄧㄥˊ", "ㄍㄨㄛˇ"] },
  { icon: "banana", zh: "香蕉", zy: ["ㄒㄧㄤ", "ㄐㄧㄠ"] },
  { icon: "watermelon", zh: "西瓜", zy: ["ㄒㄧ", "ㄍㄨㄚ"] },
  { icon: "sun", zh: "太陽", zy: ["ㄊㄞˋ", "ㄧㄤˊ"] },
  { icon: "moon", zh: "月亮", zy: ["ㄩㄝˋ", "ㄌㄧㄤˋ"] }, // 辭典寫 ㄌㄧㄤˋ，不是輕聲（2026-10-09 對過才改）
  { icon: "butterfly", zh: "蝴蝶", zy: ["ㄏㄨˊ", "ㄉㄧㄝˊ"] },
  { icon: "chair", zh: "椅子", zy: ["ㄧˇ", "˙ㄗ"] },
  { icon: "balloon", zh: "氣球", zy: ["ㄑㄧˋ", "ㄑㄧㄡˊ"] },
  { icon: "clock", zh: "時鐘", zy: ["ㄕˊ", "ㄓㄨㄥ"] },
  { icon: "glasses", zh: "眼鏡", zy: ["ㄧㄢˇ", "ㄐㄧㄥˋ"] },
  { icon: "toothbrush", zh: "牙刷", zy: ["ㄧㄚˊ", "ㄕㄨㄚ"] },
  { icon: "umbrella", zh: "雨傘", zy: ["ㄩˇ", "ㄙㄢˇ"] },
  { icon: "shoe", zh: "鞋子", zy: ["ㄒㄧㄝˊ", "˙ㄗ"] },
  { icon: "cat", zh: "貓咪", zy: ["ㄇㄠ", "ㄇㄧ"] },
  { icon: "rabbit", zh: "兔子", zy: ["ㄊㄨˋ", "˙ㄗ"] },
  { icon: "coconut", zh: "椰子", zy: ["ㄧㄝˊ", "˙ㄗ"] },
  { icon: "leaf", zh: "葉子", zy: ["ㄧㄝˋ", "˙ㄗ"] },
];

export const wordByZh = (zh: string): Word => {
  const w = WORDS.find((x) => x.zh === zh);
  if (!w) throw new Error(`詞庫沒有「${zh}」`);
  return w;
};
