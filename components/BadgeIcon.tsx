// ── ZONE 27 · 徽章徽記(克制單線 insignia · R201)──────────────────────
// Tim「徽章好弱、認不出缺哪個」→ 每章一個獨特可辨的剪影,不是 10 個一樣的數字。
// 全 stroke=currentColor 單色(父層染金/藏青/幽靈驅動)· 0 emoji · 0 多色 · 0 外部資產。
// 母題刻意各不相同(紅隊:避免「越線×3」「環×3」認不出):插旗/階梯/帳冊/逾半弧/
// 七節環/雙柱對比/日曆/階差/雙環/盾牌。 24px 黑白要能兩兩分辨。
// ─────────────────────────────────────────────────────

const PATHS: Record<string, React.ReactNode> = {
  // 首戰登錄 · 插旗(押下第一手 · 進帳本)
  first: (
    <>
      <path d="M7 4 V20" />
      <path d="M7 5 H16 L13 8 L16 11 H7" />
      <path d="M4 20 H11" />
    </>
  ),
  // 上天梯 · 上升階梯(滿10場上排名)
  ladder: <path d="M4 20 H8 V16 H12 V12 H16 V8 H20 V4" />,
  // 帳本夠厚 · 直式帳冊 + 裝訂 + 內頁線(公信力 · 份量)
  thick: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="1" />
      <path d="M9 4 V20" />
      <path d="M11.5 9 H15.5" />
      <path d="M11.5 12 H15.5" />
    </>
  ),
  // 勝過亂猜 · 逾半弧 + 銅板50%虛線(含輸還比丟銅板準)
  coin: (
    <>
      <path d="M18.5 12 A6.5 6.5 0 1 0 12 18.5" />
      <line x1="4" y1="16.5" x2="20" y2="16.5" strokeDasharray="2 2.2" />
    </>
  ),
  // 連續對帳7日 · 七節環(週=7 · 連續但非數字)
  streak7: <circle cx="12" cy="12" r="7.5" strokeDasharray="4.6 1.9" />,
  // 贏過引擎 · 雙柱對比 你較高(你 vs 引擎 · 非「越線」)
  engine: (
    <>
      <line x1="5" y1="20" x2="19" y2="20" />
      <path d="M8 20 V7" />
      <path d="M15 20 V12" />
    </>
  ),
  // 本月勝引擎 · 日曆(時間限定 · 非「越線+月牙」)
  month: (
    <>
      <rect x="5" y="6" width="14" height="13" rx="1" />
      <path d="M5 10 H19" />
      <path d="M9 4 V8" />
      <path d="M15 4 V8" />
    </>
  ),
  // 大幅勝引擎 · 階差 + 上箭(領先≥10分 · 落差語彙 · 非「越線」)
  edge: (
    <>
      <path d="M5 19 H10 V11 H19" />
      <path d="M14 11 V5" />
      <path d="M11.5 7.5 L14 5 L16.5 7.5" />
    </>
  ),
  // 連續對帳30日 · 雙閉合環(比七節環明顯更滿/更閉合)
  streak30: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.3" />
    </>
  ),
  // 紀律百日 · 盾牌勳章(跳出環家族 · 全牆最隆重)
  discipline: (
    <>
      <path d="M12 3 L19 6 V11 C19 16 16 19 12 21 C8 19 5 16 5 11 V6 Z" />
      <path d="M12 8.5 V14" />
      <path d="M9.5 11.2 H14.5" />
    </>
  ),
};

export default function BadgeIcon({
  name,
  size = 18,
}: {
  name: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}
