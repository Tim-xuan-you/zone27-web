import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import CanCalc from "@/components/CanCalc";
import Share from "@/components/Share";
import { S } from "@/components/styles";
import { catalogOf } from "@/lib/catalog";
import { anchorOf, unitOf, pricePerKg, recommendable, mer, KCAL_PER_KG } from "@/lib/engine";

/**
 * 狗吃主食罐，一天要幾罐。
 *
 * 這一頁不是類目，是一題。
 *
 * 2026-09-19 想收「狗主食罐」當類目，查品牌官網發現讀不到：
 * 汪喵星球、怪獸部落的官網都只有「符合 AAFCO」四個字，
 * 沒有粗蛋白、沒有每罐大卡，於是先做了這一頁，把算式給人。
 *
 * 2026-09-20 更正：讀不到的是品牌官網，不是台灣通路。
 * 台灣通路的商品頁把成分表和保證分析整段打成文字，
 * 12 款狗主食罐的粗蛋白、水分、代謝能全部找得到。
 * 所以類目開了（/dog-wet-food），下面那個「為什麼還沒收」的段落也改掉了。
 *
 * 教訓：查不到資料的時候，先確認是「沒有這個資料」還是「我只查了一個地方」。
 *
 * 這一頁留著，因為它回答的是另一題：一天要幾罐、跟乾糧比貴多少。
 * 算式我們有，一罐幾大卡罐子背面有寫，讀者自己填就算得出來。
 *
 * 乾糧那一邊的數字全部從我們自己讀過的那幾款算，不是抓來的。
 */

/** 我們讀過的狗主食罐。下面那段「原本寫錯了」的款數從這裡算，不寫死 */
const CANS = catalogOf("dog", "wet");
const CANS_NO_CHICKEN_NAME = CANS.filter((p) => !/(?<!火)雞/.test(p.name));
const CANS_HIDDEN = CANS_NO_CHICKEN_NAME.filter((p) => p.chicken?.status === "hidden");
const WATER_LO = Math.min(...CANS.map((p) => p.spec.moisture ?? 100));
const WATER_HI = Math.max(...CANS.map((p) => p.spec.moisture ?? 0));

const DOGS = catalogOf("dog")
  .filter(recommendable)
  .map((p) => pricePerKg(unitOf(p, anchorOf(p, "safe")), anchorOf(p, "safe").amount) ?? 0)
  .filter((n) => n > 0)
  .sort((a, b) => a - b);

const LOW = DOGS[0];
const HIGH = DOGS[DOGS.length - 1];
const MID = DOGS[Math.floor(DOGS.length / 2)];

/** 示範用的狗：12 公斤、結紮的成犬。台灣最多的中型米克斯差不多這個體重 */
const KG = 12;
const DAY = Math.round(mer(KG, "adultFixed", "dog"));
const DRY_G = Math.round((DAY / KCAL_PER_KG) * 1000);
const dryMonth = (perKg: number) => Math.round((DRY_G / 1000) * perKg * 30);

export const metadata: Metadata = {
  title: "狗吃主食罐，一天要幾罐",
  description:
    `一隻 ${KG} 公斤結紮的成犬一天大約 ${DAY} 大卡。要全吃主食罐，就是這個數字除以一罐幾大卡。` +
    `罐子背面有寫，我們把算式和計算機給你。乾糧那邊的錢從我們讀過的 ${DOGS.length} 款算：` +
    `每公斤 $${LOW} 到 $${HIGH}，一個月 $${dryMonth(LOW).toLocaleString()} 到 $${dryMonth(HIGH).toLocaleString()}。`,
  alternates: { canonical: "/dog-food/cans" },
};

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="dog-food" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        狗吃主食罐<br />一天要幾罐
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 18px", maxWidth: "42ch" }}>
        一罐看起來像一餐，其實差很遠。
        一隻 {KG} 公斤的狗一天要 <b style={{ color: "var(--ink)" }}>{DAY} 大卡</b>，
        我們讀過的狗罐頭，水分從 {WATER_LO}% 到 {WATER_HI}%，所以要的罐數會比你想的多很多。
      </p>

      <div style={S.box}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>算式只有一行</p>
        <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.95 }}>
          一天要幾罐 ＝ <b>一天的熱量</b> ÷ <b>一罐幾大卡</b>
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
          一天的熱量照體重算：基礎代謝乘上階段係數，結紮的成犬是 1.6 倍。
          {KG} 公斤就是 {DAY} 大卡。
          一罐幾大卡<b style={{ color: "var(--ink)" }}>罐子背面有寫</b>，那個數字才準，
          我們不替你猜。下面的計算機填進去就會算。
        </p>
      </div>

      <div style={{ ...S.box, marginTop: 14, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>先看罐子上有沒有寫「完全」兩個字</p>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.9 }}>
          蝦皮上寫「狗主食罐」的，很多是賣場自己打的。
          真正能當正餐的會標「完全寵物食品」，或寫符合 AAFCO 成犬標準。
          沒寫的那種，肉再多也只是配菜，長期單吃會缺鈣和微量元素。
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.9 }}>
          舉一個實際的：有一款台灣賣得很好的「99% 純肉犬罐」，品牌公布的成分表第二項是
          禽肉副產物，後面還有蒟蒻粉、植物纖維和食用色素紅色。
          狗是紅綠色盲，那個顏色是加給人看的。
        </p>
      </div>

      <p style={S.lbl}>乾糧那邊多少錢</p>
      <p style={{ fontSize: 15.5, color: "var(--muted)", lineHeight: 1.9, margin: "0 0 14px" }}>
        要比就要有對照組。下面的數字是從我們自己讀過的 {DOGS.length} 款狗飼料算的，
        不是網路上抓的：一隻 {KG} 公斤結紮的成犬一天吃 <b style={{ color: "var(--ink)" }}>{DRY_G} 克</b> 乾糧。
      </p>
      <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface)", padding: "6px 18px 14px" }}>
        <Row k="最便宜的一款">每公斤 ${LOW.toLocaleString()}　一個月約 ${dryMonth(LOW).toLocaleString()}</Row>
        <Row k="中間那一款">每公斤 ${MID.toLocaleString()}　一個月約 ${dryMonth(MID).toLocaleString()}</Row>
        <Row k="最貴的一款">每公斤 ${HIGH.toLocaleString()}　一個月約 ${dryMonth(HIGH).toLocaleString()}</Row>
      </div>
      <p style={{ fontSize: 14, color: "var(--faint)", lineHeight: 1.9, margin: "12px 0 0" }}>
        乾糧照每公斤 {KCAL_PER_KG.toLocaleString()} 大卡換算，包裝上有寫的照包裝。
        我們收的都是中高價位那一段，賣場的便宜乾糧會比這個低不少。
      </p>

      <p style={S.lbl}>算你家的</p>
      <CanCalc species="dog" />

      <div style={{ ...S.box, marginTop: 30 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>這一頁原本寫「我們讀不到狗罐頭的資料」</p>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
          那是 2026-09-19 寫的，而且寫錯了。讀不到的是品牌官網，
          官網確實只寫「符合 AAFCO」四個字。但台灣通路的商品頁把成分表和保證分析
          整段打成文字，粗蛋白、水分、每 100 克幾大卡全部都有。
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
          隔天我們去那裡讀了 {CANS.length} 款，類目就開了。
          裡面有一件事我們自己看了也意外：名字沒寫雞的 {CANS_NO_CHICKEN_NAME.length} 款，{CANS_HIDDEN.length} 款成分表裡有雞。
        </p>
        <Link href="/dog-wet-food" style={{ display: "inline-block", marginTop: 12, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
          去看我們讀過的 {CANS.length} 款狗主食罐 →
        </Link>
      </div>

      <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Share
          path="/dog-food/cans"
          text={`一隻 ${KG} 公斤的狗一天要 ${DAY} 大卡。改吃主食罐要幾罐，算給你看：`}
          label="把這頁傳給朋友"
        />
        <Link href="/dog-food/how-much" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
          狗一天要吃多少乾糧 →
        </Link>
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          這一頁是估算，不是餵食指示。真正該看的是體態，還有獸醫怎麼說。
          幼犬、懷孕、哺乳、慢性病的狗都不適用上面的係數。
        </p>
      </footer>
    </main>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 15.5, lineHeight: 1.7 }}>
      <span style={{ color: "var(--faint)", minWidth: "6.5em", fontSize: 14 }}>{k}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}
