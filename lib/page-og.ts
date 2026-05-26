import type { Metadata } from "next";

// ── ZONE 27 · Page Metadata Helper ─────────────────────
// R79 W-A · single-source for per-page OG + Twitter card metadata ·
// 防 drift across 54 visitor-discoverable routes when sharing
// LINE / PTT / IG / Threads / Discord / Slack。
//
// Why this exists:
//   - Root layout sets fallback openGraph(generic ZONE 27 card)
//   - Without per-page openGraph override · all 54 routes share
//     SAME generic title/description on LINE preview
//   - Fan grammar fails:  /pricing/why shared looks identical to
//     /heritage which looks identical to /year-zero
//   - 12+ routes were falling back to generic root card pre-R79
//
// Architecture:
//   - createPageMetadata({ title, description, path }) returns
//     a full Metadata object with openGraph + twitter + canonical
//   - title: tab title(root layout template appends「 · ZONE 27」)
//   - ogTitle: defaults to `${title} · ZONE 27`(share cards are
//     viewed in isolation · need full brand suffix)
//   - description: 100-200 chars · fan-grammar voice · NOT engineer
//   - ogDescription: optional shorter share-ready cut(<= 100 chars)
//   - path: canonical URL fragment(used for alternates.canonical
//     and openGraph.url)· must start with /
//   - type: defaults to「article」(per Schema.org · content pages
//     are articles · NOT「website」)
//
// What this does NOT do:
//   - Does NOT generate openGraph.images · Next.js auto-attaches
//     from app/{route}/opengraph-image.tsx convention
//   - Does NOT manage robots / sitemap / analytics(SEO frozen
//     per AGENTS.md until launch-ready)
//   - Does NOT inject schema.org JSON-LD(same SEO freeze)
//
// Brand IP fit:
//   - per [[feedback-zone27-audience-fans-not-engineers]] · fan
//     grammar share preview not engineer jargon
//   - per [[zone27-disclosure-philosophy]] · canonical helper
//     IS disclosure axis(prevents drift between page content
//     and share preview · 同 7-ledger family pattern)
//   - per [[feedback-zone27-pratfall-brand-ip]] · description
//     can include limit/refusal language(NonRoom for marketing
//     fluff)· same axis as /audit Section 05 PRE-COMMIT
// ─────────────────────────────────────────────────────

export interface PageMetadataInput {
  /** Page tab title — root layout appends " · ZONE 27" via template. */
  title: string;
  /** Page description — 100-200 chars · fan-grammar voice. */
  description: string;
  /** Canonical URL path — must start with /. */
  path: string;
  /**
   * Optional OG card title — defaults to `${title} · ZONE 27`.
   * Share cards viewed in isolation · brand suffix helps recognition.
   */
  ogTitle?: string;
  /**
   * Optional OG/Twitter description — defaults to description.
   * Use a shorter cut(≤ 100 chars)for tighter share-preview rendering.
   */
  ogDescription?: string;
  /** Schema.org type — defaults to "article". */
  type?: "website" | "article";
}

export function createPageMetadata(input: PageMetadataInput): Metadata {
  const ogTitle = input.ogTitle ?? `${input.title} · ZONE 27`;
  const ogDescription = input.ogDescription ?? input.description;

  return {
    title: input.title,
    description: input.description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: input.type ?? "article",
      url: input.path,
      // R159 W4.L · Agent L · Next.js shallow merge replaces openGraph entirely
      // when page declares its own block · root layout's locale + siteName are
      // LOST · explicitly restore here · 影響 all 12+ pages using createPageMetadata
      // · per Open Graph Protocol spec + LINE/Slack/Twitter platform docs。
      locale: "zh_TW",
      siteName: "ZONE 27",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
    alternates: {
      canonical: input.path,
    },
  };
}
