import blocked from "../data/no-affiliate.json";
import dogFood from "../data/dog-food.json";
import catFood from "../data/cat-food.json";
import catWet from "../data/cat-wet-food.json";
import dogWet from "../data/dog-wet-food.json";
import litter from "../data/cat-litter.json";
import treat from "../data/cat-treat.json";
import { channelOf, type Channel } from "./channel";

/**
 * 哪一種通路產得出分潤連結的機率高。
 *
 * 2026-09-20 算出來：商城 81%、優選 83%、一般賣家 33%。
 *
 * 這個數字會改策略。一般賣家常常便宜一半（臭味滾 7L 商城 $223、一般賣家 $100），
 * 所以不能不查；但三家裡只有一家開得出來，所以一般賣家要一次多給幾家，
 * 而且商城、優選要留著當保底。
 *
 * 數字自己從資料算，補一次連結、記一次失敗就會更新。
 */
export interface ChannelStat {
  channel: Channel;
  ok: number;
  fail: number;
  rate: number | null;
}

export function channelStats(): ChannelStat[] {
  const ok: Record<Channel, number> = { mall: 0, preferred: 0, seller: 0 };
  const fail: Record<Channel, number> = { mall: 0, preferred: 0, seller: 0 };

  for (const p of blocked.pairs as { shop: string }[]) fail[channelOf(p.shop)]++;

  // 同一款同一家有好幾條連結只算一次，不然備援連結會把成功率灌高
  const seen = new Set<string>();
  for (const src of [dogFood, catFood, catWet, litter, treat]) {
    for (const p of src.products as { id: string; price: { merchants: { label: string; dead?: boolean }[] } }[]) {
      for (const m of p.price.merchants) {
        if (m.dead) continue;
        const key = `${p.id}|${m.label}`;
        if (seen.has(key)) continue;
        seen.add(key);
        ok[channelOf(m.label)]++;
      }
    }
  }

  return (["mall", "preferred", "seller"] as Channel[]).map((channel) => {
    const total = ok[channel] + fail[channel];
    return { channel, ok: ok[channel], fail: fail[channel], rate: total ? Math.round((ok[channel] / total) * 100) : null };
  });
}
