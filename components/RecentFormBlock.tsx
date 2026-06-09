// ── 近期戰績 + 本季對戰(賽前 context)──────────────────
// soul:賽前卡原本只有投手 + 開盤線,沒有「最近狀態 / 兩隊本季交手」這種球迷
// 一定想看的脈絡。 以前砍掉是因為 TeamSide.recent 是 placeholder 假資料;現在
// 整季官方賽果在 lib/cpbl-results.json,可以算真實的 → 補回來、且是真的。
// 全 mute 不上金(焦點留給上方開盤線 · 守 Apple 一焦點)· 純官方資料、含輸、可查。
// CPBL 限定(MLB/足球隊名對不到 → helper 回 null → 整塊不顯示 · graceful)。
import {
  getCpblTeamForm,
  getCpblH2H,
  getMatchDateIso,
  type Match,
  type TeamForm,
} from "@/lib/matches";

function FormPips({ form }: { form: TeamForm }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label="近期戰績">
      {form.results.map((r, i) => (
        <span
          key={i}
          title={r === "W" ? "勝" : r === "L" ? "敗" : "和"}
          className={`inline-flex h-4 w-4 items-center justify-center font-mono text-[9px] leading-none border ${
            r === "W"
              ? "border-bone/50 text-bone"
              : r === "L"
                ? "border-line/60 text-mute/55"
                : "border-line/50 text-mute/70"
          }`}
        >
          {r === "W" ? "勝" : r === "L" ? "敗" : "和"}
        </span>
      ))}
    </span>
  );
}

function FormRow({ name, form }: { name: string; form: TeamForm | null }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-bone/90 text-sm truncate">{name}</span>
      <span className="flex items-center gap-3 shrink-0">
        {form ? (
          <>
            <FormPips form={form} />
            <span className="font-mono text-mute/70 text-[11px] tabular">
              本季 {form.record.w}-{form.record.l}
              {form.record.t ? `-${form.record.t}` : ""}
            </span>
          </>
        ) : (
          <span className="font-mono text-mute/40 text-[11px]">—</span>
        )}
      </span>
    </div>
  );
}

export default function RecentFormBlock({ match }: { match: Match }) {
  const iso = getMatchDateIso(match);
  if (!iso) return null;
  const homeForm = getCpblTeamForm(match.home.name, iso);
  const awayForm = getCpblTeamForm(match.away.name, iso);
  if (!homeForm && !awayForm) return null; // 非 CPBL / 無官方資料 → 整塊隱藏
  const h2h = getCpblH2H(match.home.name, match.away.name, iso);

  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-8 border-t border-line/40 pt-8">
      <p className="font-mono text-mute text-[9px] tracking-[0.4em] mb-5">
        / 近期戰績 · 本季官方
      </p>
      <div className="divide-y divide-line/30">
        <FormRow name={match.home.name} form={homeForm} />
        <FormRow name={match.away.name} form={awayForm} />
      </div>
      {h2h && (
        <p className="mt-4 font-mono text-mute/75 text-[11px] tracking-wide">
          本季交手 {h2h.total} 場 ·{" "}
          <span className="text-bone/85">
            {match.home.name} {h2h.homeWins}
          </span>
          <span className="text-mute/50"> – </span>
          <span className="text-bone/85">
            {h2h.awayWins} {match.away.name}
          </span>
          {h2h.ties ? (
            <span className="text-mute/50"> · 和 {h2h.ties}</span>
          ) : null}
        </p>
      )}
      <p className="mt-3 font-mono text-mute/45 text-[9px] tracking-[0.15em]">
        近 5 場 · 新→舊 · 取自官方賽果 · 含輸 · 刪不掉
      </p>
    </section>
  );
}
