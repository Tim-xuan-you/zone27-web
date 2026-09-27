import Link from "next/link";
import { anchorCharger, itemHref, type Charger, type Device } from "@/lib/charger";

const NUM = ["", "一", "兩", "三", "四"];
// 英文、數字後面接中文才空一格；「（M5）用」這種不空
const gap = (s: string) => (/[A-Za-z0-9]$/.test(s) ? " " : "");

/**
 * 「要都最快，就分開買」那一句。/charger 跟商品頁的「兩台一起插」共用。
 * here：現在這一頁的充電器，指到它就寫「這一顆」，不用再連回自己。
 */
export default function ChargerSplit({ groups, here }: { groups: { charger: Charger; devices: Device[] }[]; here?: string }) {
  const name = (c: Charger, many = false) =>
    c.id === here ? (
      many ? "這款" : "這一顆"
    ) : (
      <>
        <Link href={itemHref(c.id)} style={{ color: "var(--accent)", fontWeight: 700 }}>{c.brand} {c.name}</Link>
        {anchorCharger(c) ? `（$${anchorCharger(c)!.amount.toLocaleString()}）` : ""}
      </>
    );

  if (groups.length === 1) {
    const g = groups[0];
    return (
      <>
        要都最快，就買{NUM[g.devices.length] ?? g.devices.length}顆{g.charger.id === here ? "這款" : " "}
        {g.charger.id === here ? null : name(g.charger)}，一台插一顆。不然就一台一台輪流插。
      </>
    );
  }
  return (
    <>
      要都最快，就分開買：
      {groups.map((g, i) => {
        const zh = [...new Set(g.devices.map((d) => d.zh))];
        const who = g.devices.length > 1 && zh.length === 1 ? `${NUM[g.devices.length]}台 ${zh[0]}` : zh.join("、");
        return (
          <span key={g.charger.id}>
            {i ? "，" : ""}{who}{gap(who)}{g.devices.length > 1 ? "各用一顆" : "用"}{g.charger.id === here ? "" : " "}{name(g.charger, g.devices.length > 1)}
          </span>
        );
      })}
      。不然就一台一台輪流插。
    </>
  );
}
