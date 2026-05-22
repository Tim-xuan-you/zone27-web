import { FEED_META, FEED_ENTRIES, type FeedEntry } from "@/lib/feed-items";

// ── ZONE 27 · /feed.xml Atom RSS feed ──────────────────
// Round 51 W-E · 2026-05-22 evening · Agent 1 ship synthesize · Stratechery
// + FanGraphs + Baseball Savant RSS pattern · hardcore fan audience use
// RSS reader subscription · 訪客 1 micro-action add to Feedly / NetNewsWire
// / Reeder · 之後 Tim ship 新 round 自動 surface · 不靠 email · 0 tracking。
//
// Atom 1.0 format(RFC 4287)· 對齊 modern RSS reader 標準 · 比 RSS 2.0
// 更明確 metadata schema · 同 Anthropic news feed pattern。
//
// Static route · revalidate at deploy time · 不需 ISR · 每次 Tim git push
// 觸發 Vercel rebuild = feed updated。
//
// Brand IP fire:
//   - Audience-fans-not-engineers · RSS = hardcore fan demographic
//   - Disclosure(canonical)· ship cycle entries syndicatable format
//   - 0 tracking · RSS poll client-initiated · 0 server analytics
//   - Anti-email-dependency · 訪客不需 give email 即可 stay updated
//   - Anti-push-notification · RSS = subscriber-pulled · 不 push
// ─────────────────────────────────────────────────────

export const dynamic = "force-static";
export const revalidate = false;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc3339(iso: string): string {
  // ISO YYYY-MM-DD → RFC 3339 datetime · Atom <updated> requires datetime
  // not date · default to 12:00:00 Taipei time(+08:00)· Tim ship 時刻
  // approximation · 不需精確 timestamp(每日 1 entry rollup acceptable)。
  return `${iso}T12:00:00+08:00`;
}

function entryToAtomXml(entry: FeedEntry): string {
  const updated = formatRfc3339(entry.updated);
  const url = `${FEED_META.link.replace(/\/$/, "")}${entry.href}`;
  const id = `${FEED_META.link.replace(/\/$/, "")}/feed/${entry.id}`;
  return `  <entry>
    <id>${escapeXml(id)}</id>
    <title type="text">${escapeXml(entry.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(url)}" />
    <published>${updated}</published>
    <updated>${updated}</updated>
    <author>
      <name>${escapeXml(FEED_META.authorName)}</name>
      <email>${escapeXml(FEED_META.authorEmail)}</email>
    </author>
    <summary type="text">${escapeXml(entry.summary)}</summary>
    <content type="text">${escapeXml(entry.content)}</content>
  </entry>`;
}

export async function GET() {
  const mostRecentUpdated =
    FEED_ENTRIES.length > 0 ? FEED_ENTRIES[0].updated : "2026-05-22";
  const feedUpdated = formatRfc3339(mostRecentUpdated);

  const entries = FEED_ENTRIES.map(entryToAtomXml).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${FEED_META.language}">
  <title>${escapeXml(FEED_META.title)}</title>
  <subtitle>${escapeXml(FEED_META.subtitle)}</subtitle>
  <link rel="alternate" type="text/html" href="${escapeXml(FEED_META.link)}" />
  <link rel="self" type="application/atom+xml" href="${escapeXml(FEED_META.selfLink)}" />
  <id>${escapeXml(FEED_META.selfLink)}</id>
  <updated>${feedUpdated}</updated>
  <rights>${escapeXml(FEED_META.rights)}</rights>
  <author>
    <name>${escapeXml(FEED_META.authorName)}</name>
    <email>${escapeXml(FEED_META.authorEmail)}</email>
  </author>
${entries}
</feed>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      // Cache aggressively · static feed · Vercel rebuild on deploy
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
