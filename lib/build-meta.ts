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

/** Short 7-char commit SHA. "local" during dev. Refreshes each deploy. */
export const COMMIT_SHA =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

/** Full commit SHA — for the GitHub permalink. */
export const COMMIT_SHA_FULL =
  process.env.VERCEL_GIT_COMMIT_SHA ?? "local";

/** Branch ref · "main" in production. */
export const COMMIT_BRANCH = process.env.VERCEL_GIT_COMMIT_REF ?? "main";

/** YYYY-MM-DD when this build evaluated. Module-eval time on each
 *  build = effectively "deploy timestamp" for static-rendered pages.
 *  ISR-revalidated pages will refresh on their own cadence. */
export const DEPLOYED_AT = new Date().toISOString().slice(0, 10);

/** Owner/repo for constructing GitHub permalinks. */
export const GH_OWNER_REPO = "Tim-xuan-you/zone27-web";

/** Direct link to the commit that produced this bundle. */
export const COMMIT_PERMALINK = `https://github.com/${GH_OWNER_REPO}/commit/${COMMIT_SHA_FULL}`;

/** Direct link to the changelog showing all commits. */
export const COMMITS_PERMALINK = `https://github.com/${GH_OWNER_REPO}/commits/${COMMIT_BRANCH}`;
