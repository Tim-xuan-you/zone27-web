// ── ZONE 27 · Build-time Metadata ───────────────────────
// Per [[zone27-disclosure-philosophy]]: turn 「方法公開」 from
// rhetoric into literal numbers. Each deploy stamps the build
// with commit hash + deploy date + branch ref · those constants
// are then surfaced on /audit (and anywhere else that benefits).
//
// Values come from Vercel's auto-set env vars on production
// builds: VERCEL_GIT_COMMIT_SHA · VERCEL_GIT_COMMIT_REF.
// Local dev falls back to "local" so the page never crashes
// during npm run dev.
//
// Reference: https://vercel.com/docs/projects/environment-variables/system-environment-variables
// ─────────────────────────────────────────────────────

/** 站台/報告版本號(milestone · Tim 拍板才 bump)。 單一來源 —— Footer、/audit、
 *  /coverage、/discipline、/manifesto 與各自 OG 卡全部 import 這一個常數,物理上
 *  不可能各頁顯示不同版號(「同站兩個版號」= 自打「數字不漂移」的臉)。 */
export const PRODUCT_VERSION = "v0.29";

/** Short 7-char commit SHA. "local" during dev. Refreshes each deploy. */
export const COMMIT_SHA =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

/** Full commit SHA — for the GitHub permalink. */
export const COMMIT_SHA_FULL =
  process.env.VERCEL_GIT_COMMIT_SHA ?? "local";

/** Branch ref · "main" in production. */
export const COMMIT_BRANCH = process.env.VERCEL_GIT_COMMIT_REF ?? "main";

/** YYYY-MM-DD (Asia/Taipei) when this build evaluated. Module-eval
 *  time on each build = effectively "deploy timestamp" for static-
 *  rendered pages. Uses Taipei TZ for consistency with the rest of
 *  the codebase (matches lib/matches.ts getTodayTaipei pattern) —
 *  raw UTC would drift up to 8h behind for morning-Taipei deploys. */
export const DEPLOYED_AT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
}).format(new Date());

/** Owner/repo for constructing GitHub permalinks. */
export const GH_OWNER_REPO = "Tim-xuan-you/zone27-web";

/** Direct link to the commit that produced this bundle.
 *  Fallback to repo root when SHA is "local" (npm run dev) — clicking
 *  the BUILD chip on /audit would 404 otherwise.  */
export const COMMIT_PERMALINK =
  COMMIT_SHA === "local"
    ? `https://github.com/${GH_OWNER_REPO}`
    : `https://github.com/${GH_OWNER_REPO}/commit/${COMMIT_SHA_FULL}`;

/** Direct link to the changelog showing all commits. */
export const COMMITS_PERMALINK = `https://github.com/${GH_OWNER_REPO}/commits/${COMMIT_BRANCH}`;
