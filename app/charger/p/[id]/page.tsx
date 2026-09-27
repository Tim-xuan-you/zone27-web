import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChargerProduct from "@/components/ChargerProduct";
import { DEVICES, chargerById, chargers, fit } from "@/lib/charger";

/**
 * 一顆充電器的頁面。
 *
 * 2026-09-26 Tim：「好多用詞都有看沒有懂，大家就只是想要能快速充電。」
 * 所以最上面只回答讀者真的想知道的：哪些手機插它充最快、多少錢、在哪買、什麼時候不要買。
 * 每個孔幾瓦、同時插怎麼分、AVS、PPS 這些，收在「想看細節」裡，想研究的人點開。
 *
 * 來源在頁尾講一次就好，不要每一行都寫「官方寫的」。
 */

export function generateStaticParams() {
  return chargers.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = chargerById(id);
  if (!c) return {};
  const fast = DEVICES.filter((d) => fit(c, [d]).got![0].tier === "fast" && !d.noFast).map((d) => d.zh);
  return {
    title: `${c.brand} ${c.name}：哪些手機插它充最快`,
    description: `${c.back}。${fast.length ? `插它充最快的：${fast.slice(0, 4).join("、")}。` : ""}兩台一起插、筆電能不能用，一頁看完。`,
    alternates: { canonical: `/charger/p/${c.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = chargerById(id);
  if (!c) notFound();
  return <ChargerProduct c={c} list={chargers} />;
}
