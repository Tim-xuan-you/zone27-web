import Link from "next/link";
import type { CalibrationIdentity } from "@/lib/predictions";

// ── ZONE 27 · 你的榮譽牆(soul-roadmap #5 · 「靠誠實賺來的地位」· 三樓第一塊)──────
// Tim 看玩運彩的徽章/殺手榜 → 要「景仰 / 收藏 / 優越」。 但他們的章獎勵連勝 + 人氣 +
// 挑好看的窗(全部裝得出來)。 我們的章**全部從含輸的帳本自動算** —— 刪不掉、裝不來、
// 報馬仔結構上掛不出來(他們的生意建立在藏輸之上)= 抄不走的 costly signal。
//
// 🔴 紅線:絕不獎勵「連勝 / 人氣 / 發文量」· 只獎勵「校準 / 含輸 / 贏引擎 / 紀律」
//   (一獎勵連勝就變成另一個玩運彩 · 護城河當場燒掉)。 勝過亂猜要先過樣本門檻
//   (防 1-2 場僥倖 = 守「不獎勵挑窗」)。
// 🍎 Apple 紀律:只放 5 個真正賺得來的章 · 不做玩運彩那種一整面徽章動物園。
// 排版:章是配角(三樓)· 首頁 / 二樓不動 · 框用 mute(讓上面的金色校準卡當唯一主角)·
//   你要爬進 /member 才看得到 = 稀缺才有份量、才值得景仰。
//
// 純展示 server component · 計算全部來自 lib/predictions.ts aggregateIdentity(單一真相)。
// ─────────────────────────────────────────────────────

const ROOKIE_MIN = 10; // 上天梯門檻 · 同 /ladder · CalibrationIdentityCard
const FIRM = 8; // 「勝過亂猜」最低樣本 · 同 CalibrationIdentityCard SAMPLE_FIRM

type Honor = {
  key: string;
  glyph: string; // 幾何 / 數字字符(無 emoji · 無星等 · 守品牌)
  name: string;
  earned: boolean;
  detail: string; // 點亮:你怎麼賺到的;未點亮:怎麼解鎖(不只是灰掉 = 給目標)
};

function buildHonors(id: CalibrationIdentity): Honor[] {
  const firm = id.decided >= FIRM;
  const beatCoin = id.vsCoinPts !== null && id.vsCoinPts > 0 && firm;
  return [
    {
      key: "first",
      glyph: "1",
      name: "首戰登錄",
      earned: id.total >= 1,
      detail: "押下第一手 · 進了刪不掉的帳本",
    },
    {
      key: "ladder",
      glyph: "10",
      name: "上天梯",
      earned: id.total >= ROOKIE_MIN,
      detail:
        id.total >= ROOKIE_MIN
          ? "累積滿 10 場 · 夠資格上海選天梯排名"
          : `再 ${ROOKIE_MIN - id.total} 場 · 上天梯排名`,
    },
    {
      key: "coin",
      glyph: "△",
      name: "勝過亂猜",
      earned: beatCoin,
      detail: beatCoin
        ? `含輸還是比丟銅板準 ${id.vsCoinPts} 分`
        : firm
          ? "含輸命中率要先過 50%(亂猜線)"
          : `先累到 ${FIRM} 場結算 · 數字才算數`,
    },
    {
      key: "engine",
      glyph: "◆",
      name: "贏過引擎",
      earned: id.beatEngine === true,
      detail:
        id.beatEngine === true
          ? "同一批場 · 你比免費引擎還準"
          : "同一批已結算場 · 命中率要超過引擎",
    },
    {
      key: "month",
      glyph: "↑",
      name: "本月勝引擎",
      earned: id.month.beatEngine === true,
      detail:
        id.month.beatEngine === true
          ? "這個月領先引擎 = 升階要的那一條"
          : "這個月命中率贏過引擎(每月重算)",
    },
  ];
}

export default function HonorWall({
  identity: id,
}: {
  identity: CalibrationIdentity;
}) {
  // 還沒押任何一場 → 不顯示(上面校準卡已有「去押第一注」· 不擺一面灰章嚇新人)
  if (id.total === 0) return null;

  const honors = buildHonors(id);
  const earned = honors.filter((h) => h.earned).length;

  return (
    <section className="mt-8 bg-slate/40 border border-line/50 p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">你的榮譽</p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] tabular">
          已點亮 <span className="text-gold">{earned}</span> / {honors.length}
        </p>
      </div>

      {/* 誠實 frame · 這面牆抄不走 = 護城河(玩運彩靠連勝/人氣發章 · 結構上掛不出這個) */}
      <p className="mb-5 text-mute/85 text-[13px] leading-relaxed max-w-xl">
        每個章都從你<span className="text-bone">含輸的帳本</span>自動算 —— 刪不掉、裝不來。
        賣明牌的站靠連勝、人氣、挑好看的窗發章;
        <span className="text-gold">這面牆,他們掛不出來</span>。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {honors.map((h) => (
          <div
            key={h.key}
            className={`flex items-center gap-3 px-3 py-3 border transition-colors ${
              h.earned
                ? "border-gold/55 bg-gold/[0.06] glow-soft"
                : "border-line/50 bg-ink/30"
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-flex shrink-0 items-center justify-center w-9 h-9 rounded-[30%] font-mono text-sm font-medium tabular leading-none ring-1 ring-inset ${
                h.earned
                  ? "bg-gold/15 text-gold ring-gold/50"
                  : "bg-line/20 text-mute/40 ring-line/40"
              }`}
            >
              {h.earned ? h.glyph : "·"}
            </span>
            <span className="min-w-0">
              <span
                className={`flex items-center gap-1.5 font-mono text-[12px] tracking-[0.15em] ${
                  h.earned ? "text-bone" : "text-mute/55"
                }`}
              >
                {h.name}
                {h.earned && <span className="text-gold/80 text-[10px]">✓</span>}
              </span>
              <span
                className={`block text-[11px] leading-snug mt-0.5 ${
                  h.earned ? "text-mute/80" : "text-mute/45"
                }`}
              >
                {h.detail}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* 三樓出口 · 地位的歸宿(公開天梯)· 安靜次要 · 不搶上面校準卡的金色主角 */}
      <p className="mt-5">
        <Link
          href="/ladder"
          className="font-mono text-gold/80 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
        >
          這些章怎麼換到天梯排名 →
        </Link>
      </p>
    </section>
  );
}
