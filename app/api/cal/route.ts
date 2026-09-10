import { byId } from "@/lib/catalog";
import { liveMerchants, MER_FACTORS, type Stage, type TrialKind } from "@/lib/engine";
import { daysBetween, todayTW } from "@/lib/date";
import { eliminationEvents, toIcs, trialEvents } from "@/lib/reminder";

/**
 * iPhone／Mac／Outlook 用的行事曆檔。
 *
 * 只收代號和數字，文字一律由我們自己產生。
 * 如果讓網址帶標題和內文進來，任何人都能用我們的網域做出
 * 內容隨便寫的行事曆檔，那是釣魚的好材料。
 *
 * /api/ 在 robots 裡本來就擋掉了，這裡再加 noindex。
 */

export const dynamic = "force-dynamic";

const SYMPTOMS: Record<TrialKind, string[]> = {
  gut: ["腸胃"],
  skin: ["皮膚"],
  both: ["皮膚", "腸胃"],
  general: [],
};

function bad(msg: string) {
  return new Response(msg, {
    status: 400,
    headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;

  // 開始日期由使用者的手機帶進來；離今天太遠的一律當今天
  const today = todayTW();
  const d = q.get("d") ?? "";
  const gap = daysBetween(today, d);
  const start = Number.isFinite(gap) && Math.abs(gap) <= 30 ? d : today;

  let events;
  let seed: string;

  if (q.get("plan") === "elim") {
    events = eliminationEvents();
    seed = "elim";
  } else {
    const p = byId(q.get("p") ?? "");
    if (!p || liveMerchants(p).length === 0) return bad("找不到這款飼料");

    const kgRaw = Number(q.get("kg"));
    const kg = kgRaw > 0 && kgRaw < 120 ? kgRaw : undefined;
    const st = q.get("st") ?? "";
    const stage: Stage = st in MER_FACTORS ? (st as Stage) : "adultFixed";
    const sy = (q.get("sy") ?? "general") as TrialKind;

    events = trialEvents(p, kg, SYMPTOMS[sy] ?? [], stage);
    seed = p.id;
  }

  if (!events.length) return bad("沒有可以提醒的事");

  return new Response(toIcs(events, start, seed), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `inline; filename="zone27-${seed}.ics"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
