import type { Match } from "@/lib/matches";

// ── ZONE 27 · 結算規則開賽前鎖定(soul-roadmap #4 · Kalshi 式信任武器)──────
// 把原本一段被刻意降調的「這題怎麼算贏」散文 · 升級成可掃描的結算規格表 ——
// 賭徒最怕的就是模糊結算 · 規格化 = 把「我們改不了計分」攤成結構。
//
// 信任武器 = 精確,不是搶眼:四列規格(具名官方來源 + 開賽前鎖定的時間戳 +
// 不可改的對帳 + 爭議怎麼裁),全程 mute/bone 不上金(守 gold discipline ·
// 焦點留給上方金色開盤線)。 收費明牌站給不出「具名來源 + 賽後改不了」這組 ——
// 這是它結構上學不來的(他們靠賽後刪文 / 自己說了算)。
//
// 全部誠實:結算依據是真・官方計分(我們不控制)· 規則是全站每場固定的公開政策
// (不是賽後才捏的)· 押對 ✓ 押錯 ✕ 都留著刪不掉(同先鎖後結 + 不可造假帳本)。
// ─────────────────────────────────────────────────────

type Props = {
  league: Match["league"];
  /** 開賽 instant ISO(Taipei +08:00)· 當「開賽前鎖定」的可見時間戳 · null 則省略 */
  startISO?: string | null;
};

// "2026-06-04T18:35:00+08:00" → "2026-06-04 18:35"(開賽 = 一切鎖定的死線)
function lockLabel(startISO: string | null | undefined): string | null {
  if (!startISO) return null;
  const m = startISO.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  return m ? `${m[1]} ${m[2]}` : null;
}

function Em({ children }: { children: React.ReactNode }) {
  return <span className="text-bone">{children}</span>;
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 sm:gap-4 items-baseline">
      <dt className="w-14 shrink-0 font-mono text-mute/55 text-[9px] tracking-[0.15em] leading-relaxed">
        {k}
      </dt>
      <dd className="flex-1 text-mute/85 text-[12px] sm:text-[13px] leading-relaxed">
        {children}
      </dd>
    </div>
  );
}

export default function SettlementResolution({ league, startISO }: Props) {
  const source = league === "MLB" ? "MLB 官方計分" : "CPBL 官網最終比分";
  const lock = lockLabel(startISO);

  return (
    <div className="mt-4 border border-line/60 bg-slate/30 px-4 py-3.5">
      <p className="font-mono text-mute text-[9px] tracking-[0.35em] mb-3">
        這題怎麼算贏 · 結算規則開賽前鎖定
      </p>
      <dl className="space-y-2.5">
        <Row k="結算依據">
          以 <Em>{source}</Em> 為準 · 分數高的隊贏 —— <Em>不是我們說了算</Em>
        </Row>
        <Row k="規則鎖定">
          {lock ? (
            <>
              <Em>{lock}</Em> 開賽前就定死
            </>
          ) : (
            "開賽前就定死"
          )}{" "}
          · 全站每場同一套 · 不會賽後才改
        </Row>
        <Row k="押注對帳">
          押對掛 <span className="text-gold">✓</span> · 押錯掛{" "}
          <span className="text-loss/85">✕</span> · <Em>命中、落空都留著 · 刪不掉</Em>
        </Row>
        <Row k="爭議裁定">
          延賽 → 順延到補賽日才算 · 和局 → 兩邊都不算贏
        </Row>
      </dl>
    </div>
  );
}
