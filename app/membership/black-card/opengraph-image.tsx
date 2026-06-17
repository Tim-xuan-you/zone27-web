import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/brand";

// ── ZONE 27 · /membership/black-card Dynamic OG ────────
// R245 · 對齊 /membership/black-card 誠實重寫:BLACK 不解鎖任何功能(引擎、押注、
// 天梯、對帳、含輸命中率、校準、驗證準度標章 —— 全部免費)· BLACK 唯一加的就一樣:
// 一圈金色支持環。 舊版 OG 把「6 unlocks(engine variants / 驗證準度標章 / voting /
// Tim 筆記 / LINE 群)」當付費解鎖條列 —— 踩了「付費≠比較準·準是免費的」紅線,且與
// 重寫後的 page 自打臉(page 說全免費、OG 說 BLACK 解鎖)。 此 OG 改成跟 page 同一把
// 尺:先講「全免費」,再講 BLACK 唯一加的金環。
//
// 守紅線:付費=身分非功能 · 準是免費的 · 0 假稀缺 · 守暗金(OG render 不用 emoji /
//   ✓✕▸★→ 等 symbol glyph · 金色圓點用純 CSS 幾何,0 字型依賴)。
// ─────────────────────────────────────────────────────

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt =
  "ZONE 27 · BLACK · NT$ 500/31 天 · 引擎永遠免費 · BLACK 不解鎖功能 · 你買的是一圈金色支持環 · 手動轉帳 · 不自動續扣";

export default async function BlackCardOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.navy,
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 50% -10%, rgba(212,175,55,0.12), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          padding: 70,
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* ── TOP ROW · brand + path ─────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                fontSize: 24,
                color: BRAND.gold,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              ZONE
            </span>
            <span
              style={{
                fontSize: 24,
                color: BRAND.bone,
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              27
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              color: "rgba(212,175,55,0.7)",
              letterSpacing: "0.35em",
              display: "flex",
            }}
          >
            / MEMBERSHIP / BLACK-CARD
          </span>
        </div>

        {/* ── PRE-LAUNCH BADGE ─────────────────────── */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: BRAND.loss,
              letterSpacing: "0.4em",
              padding: "6px 14px",
              border: `1px solid ${BRAND.loss}`,
              display: "flex",
            }}
          >
            NT$ 500 / 31 天 · 手動 · 不自動續扣
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 64,
              color: BRAND.bone,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            BLACK
          </span>
          <span
            style={{
              fontSize: 44,
              color: BRAND.gold,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              marginTop: 8,
              display: "flex",
            }}
          >
            NT$ 500 / 31 天
          </span>
          <span
            style={{
              fontSize: 18,
              color: "rgba(245,242,234,0.65)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              marginTop: 14,
              display: "flex",
            }}
          >
            引擎永遠免費 · BLACK 不解鎖功能,你買的是金環
          </span>
        </div>

        {/* ── DIVIDER ──────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            marginTop: 28,
            marginBottom: 22,
          }}
        />

        {/* ── 先講「全免費」· 再講 BLACK 唯一加的金環(R245 · 對齊 page)─────
            舊版列「6 unlocks」當付費解鎖 = 踩「準是免費的」紅線 + 與 page 自打臉。
            金色圓點是純 CSS 幾何(0 字型依賴)· 只是條列符號、不是付費 checkmark · 守暗金。 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <UnlockRow label="押注 · 引擎 · 爬天梯 · 賽前鎖死賽後對帳:全部免費" />
          <UnlockRow label="含輸命中率 · 校準 · 哪一場贏過引擎:免費標出來" />
          <UnlockRow label="BLACK 加的就一樣:一圈金色支持環,造不了假" />
          <UnlockRow label="你付的是身分,不是解鎖功能" />
        </div>

        {/* ── BOTTOM · differentiator punchline ──────────
            🔴 R223:原本 position:absolute bottom:50 · 6 條 unlock 流排下來會壓到這行 punchline
            (實機驗證:文字相疊)。 改 marginTop:auto 讓它在 flex column 內被推到底、不被內容壓到
            (同 /receipts OG 既有房規「flow · marginTop auto · 不用 absolute 以免被內容壓到」)。 */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "rgba(245,242,234,0.6)",
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            準是免費的。 撐著它,是金環。
          </span>
          <span
            style={{
              fontSize: 14,
              color: BRAND.gold,
              letterSpacing: "0.3em",
              fontWeight: 500,
              display: "flex",
            }}
          >
            /membership/black-card
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

// ── Sub-components ─────────────────────────────────────

function UnlockRow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* 🔴 OG glyph 硬化(R223):原本的 ▸(U+25B8)Satori 系統字缺 → 分享卡 render 成豆腐方塊
          (實機驗證屬實)。 改用純 CSS 金色圓點(0 字型依賴 · 幾何形狀=品牌允許例外)·
          同 /u·soccer OG「OG 不靠 glyph」房規。 */}
      <span
        style={{
          width: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 7,
            background: BRAND.gold,
            display: "flex",
          }}
        />
      </span>
      <span
        style={{
          color: "rgba(245,242,234,0.85)",
          fontSize: 17,
          letterSpacing: "0.03em",
          display: "flex",
        }}
      >
        {label}
      </span>
    </div>
  );
}
