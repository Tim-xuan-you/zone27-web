import type { Product } from "./types";
import { dailyGrams, trialPlan, type Stage } from "./engine";
import { addDays } from "./date";

/**
 * 行事曆提醒。
 *
 * 靈感是一頂會「主動提醒」的安全帽：危險靠近之前就先講，
 * 不用等出事才靠它擋。換糧也一樣，最常失敗的兩個時間點是
 * 試到一半斷糧、還有忘了哪天該回頭看結果，這兩件事都發生在
 * 使用者離開網站很久以後，網站本身什麼都做不了。
 *
 * 所以把那兩個日子直接放進他自己的行事曆。
 * 不收 email、不加 LINE、我們這邊不存任何東西，一樣零維護。
 *
 * 畫面上的日期、Google 日曆連結、iPhone 行事曆檔，全部從這裡產生。
 * 同一件事只算一次，三個地方才不會對不起來。
 */

export const SITE = "https://zone27.com.tw";

export interface CalEvent {
  /** 從開始那天算的第幾天（0 = 當天） */
  day: number;
  /** 穩定的代號，組 UID 用：同一個檔案加兩次會蓋掉，不會重複 */
  key: string;
  title: string;
  details: string;
}

const ELIM_URL = `${SITE}/dog-food/elimination-diet`;

const SKIN_CHECK = (next: string): CalEvent => ({
  day: 56,
  key: "skin",
  title: "第 8 週了，看一下還抓不抓",
  details: [
    "跟剛開始的時候比，抓癢有明顯變少嗎？",
    `有：${next}，把原本的飼料餵回去一到兩週。又開始抓，才算確認是食物過敏。`,
    "沒什麼變：多半不是食物的問題。帶去給皮膚科獸醫看，把這八週的經過告訴醫生，那是有用的資訊。",
    `完整流程：${ELIM_URL}`,
  ].join("\n\n"),
});

function gutCheck(alsoSkin: boolean): CalEvent {
  const lines = [
    "便便有比較成形、次數比較正常嗎？",
    "有的話，這款就可以繼續吃。",
    "還是一樣軟或更糟，先帶去給獸醫看。先不要急著換下一款，連續換糧本身就會讓腸胃更亂。",
  ];
  if (alsoSkin) lines.push("抓癢的部分還早喔，皮膚要等到第 8 週才看得出來，那天會再提醒你。");
  return { day: 14, key: "gut", title: "換糧兩週了，看一下便便", details: lines.join("\n\n") };
}

/** 品牌只取英文那段，標題才不會長到被行事曆截掉 */
function shortName(p: Product): string {
  const latin = p.brand.match(/^[A-Za-z0-9!'&. -]+/)?.[0].trim();
  return `${latin || p.brand} ${p.name}`;
}

/** 換一款飼料之後的提醒：補貨，加上看結果的日子 */
export function trialEvents(
  p: Product,
  kg: number | undefined,
  symptoms: string[] | undefined,
  stage: Stage = "adultFixed",
): CalEvent[] {
  const t = trialPlan(p, kg, symptoms, stage);
  const out: CalEvent[] = [];

  const bagUnit = t.better?.unit ?? t.anchorUnit;
  const bagDays = t.better?.days ?? t.anchorDays;
  const bagId = t.better?.id ?? t.anchorId;

  if (kg && bagDays && bagUnit && bagId) {
    // 前幾天提醒，留時間到貨；小包本來就吃得快，提早量跟著縮
    const lead = Math.min(5, Math.max(1, Math.floor(bagDays / 3)));
    const g = Math.round(dailyGrams(kg, stage));
    const lines = [
      `照 ${kg} 公斤、一天大約 ${g} 克估的，${bagUnit} 那包再 ${lead} 天左右會吃完。網購到貨要幾天，現在下單剛好接得上。`,
    ];
    if (t.needDays > bagDays) {
      lines.push("試吃還沒跑完喔。中途斷糧或臨時換別款，前面的天數就白費了。");
    }
    lines.push(`同一包在這裡：${SITE}/go/${bagId}/${p.id}`);
    lines.push(`吃得比預期快或慢都正常，每一款的熱量不一樣，以包裝背面的餵食表為準。狗的體重變了，回 ${SITE} 重新算一次。`);
    out.push({
      day: Math.max(1, bagDays - lead),
      key: "reorder",
      title: `${shortName(p)} 快吃完了，記得補貨`,
      details: lines.join("\n\n"),
    });
  }

  if (t.kind === "gut" || t.kind === "both") out.push(gutCheck(t.kind === "both"));
  if (t.kind === "skin" || t.kind === "both") out.push(SKIN_CHECK("下一步是回測"));
  if (t.kind === "general") {
    out.push({
      day: 42,
      key: "check",
      title: "換糧六週了，這款合不合適",
      details: [
        "看三件事就好：愛不愛吃、便便正不正常、體重有沒有穩住。",
        "三個都沒問題，就是對的那一包。",
        `有一個不對，回 ${SITE} 把現在的狀況打進去，重新挑一次。`,
      ].join("\n\n"),
    });
  }

  return out.sort((a, b) => a.day - b.day);
}

/** 排除飲食法的八週 + 回測 */
export function eliminationEvents(): CalEvent[] {
  return [
    {
      day: 28,
      key: "elim-4w",
      title: "排除飲食第 4 週：零食真的都斷了嗎",
      details: [
        "過一半了。做失敗最常見的原因是零食沒斷：家人偷餵、潔牙骨、公園裡別人給的、雞肉口味的藥錠。跟家裡每個人再講一次吧。",
        "這時候還在抓很正常，皮膚要等滿八週。",
        `完整流程：${ELIM_URL}`,
      ].join("\n\n"),
    },
    SKIN_CHECK("明天開始回測"),
    {
      day: 70,
      key: "elim-recheck",
      title: "回測兩週了，症狀有沒有回來",
      details: [
        "把原本的飼料餵回去兩週了。",
        "又開始抓：確認是食物過敏。換回新的飼料，記下是哪一種肉，以後挑飼料避開它就好。",
        "沒回來：當初的改善另有原因，可能是季節、洗澡或跳蚤預防。這也是答案，至少不用再為這件事多花錢買特殊飼料。",
        "如果中間就又開始抓，不用撐滿兩週，直接換回新的飼料就好。",
      ].join("\n\n"),
    },
  ];
}

/* ------------------------------------------------------------------ */
/* 輸出格式                                                            */
/* ------------------------------------------------------------------ */

const compact = (ymd: string) => ymd.replaceAll("-", "");

/** Google 日曆的新增活動連結（全天活動，結束日不含） */
export function googleCalUrl(ev: CalEvent, start: string): string {
  const d = addDays(start, ev.day);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${compact(d)}/${compact(addDays(d, 1))}`,
    details: ev.details,
    ctz: "Asia/Taipei",
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** RFC 5545：一行不超過 75 bytes，中文一個字 3 bytes，要照 bytes 切 */
function fold(line: string): string {
  const enc = new TextEncoder();
  const parts: string[] = [];
  let cur = "", bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > (parts.length ? 74 : 75)) { parts.push(cur); cur = ""; bytes = 0; }
    cur += ch; bytes += b;
  }
  parts.push(cur);
  return parts.join("\r\n ");
}

/** iPhone／Mac／Outlook 都吃的 .ics */
export function toIcs(events: CalEvent[], start: string, seed: string): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ZONE 27//zone27.com.tw//ZH-TW",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const ev of events) {
    const d = addDays(start, ev.day);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${seed}-${ev.key}-${compact(start)}@zone27.com.tw`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(d)}`,
      `DTEND;VALUE=DATE:${compact(addDays(d, 1))}`,
      `SUMMARY:${esc(ev.title)}`,
      `DESCRIPTION:${esc(ev.details)}`,
      "TRANSP:TRANSPARENT",
      // 全天活動的提醒從當天零點起算，PT9H＝早上九點
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(ev.title)}`,
      "TRIGGER:PT9H",
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
