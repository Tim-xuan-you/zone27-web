import Link from "next/link";
import { getRelatedLinks } from "@/lib/related-links";

// ── ZONE 27 · Related Reading ──────────────────────────
// Footer-only hub-and-spoke cross-link row for the 6 content-rich
// pages. Each card = kicker line (route name) + title line (helpful
// description). Hand-curated mapping in lib/related-links.ts.
//
// Design rules (Round 7 research):
//   - NEVER inline references beyond the one-per-page already in body
//   - NEVER a sidebar TOC / floating "in this article" widget
//   - NEVER algorithmic ranking or engagement-based recommendation
//   - Exactly 3 hand-picked cards per page, no more, no fewer
//   - Footer placement only — never mid-content
// ─────────────────────────────────────────────────────

export default function RelatedReading({ currentPath }: { currentPath: string }) {
  const links = getRelatedLinks(currentPath);
  if (links.length === 0) return null;

  return (
    <section
      aria-labelledby="related-reading-heading"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 border-t border-line/40"
    >
      <p
        id="related-reading-heading"
        className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-6"
      >
        <span lang="en">/ FURTHER READING</span>
        <span className="text-mute mx-2" aria-hidden="true">·</span>
        延伸閱讀
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-4 border border-line/60 hover:border-gold/60 hover:bg-slate/30 transition-colors group"
          >
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.25em] mb-2 group-hover:text-gold/80 transition-colors"
            >
              {link.kicker}
            </p>
            <p className="text-bone text-sm sm:text-base leading-snug group-hover:text-gold transition-colors">
              {link.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
