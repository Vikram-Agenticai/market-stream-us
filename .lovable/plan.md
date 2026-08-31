# UI/UX Enhancement Roadmap — US Business Forum

Current site: a clean broadsheet-style news front page, article detail page, and five section pages. The visual identity is strong, but there are clear UX gaps around discovery, wayfinding, content density, and reader engagement. Below are improvements grouped by impact and effort.

## Tier 1 — Readability & trust (highest payoff, low risk)

1. **Article truncation cleanup**
   Some summaries show raw cookie-policy text or cut off mid-sentence. Add a smarter summary trim that ends on a complete sentence, strips legal/boilerplate text, and never shows fewer than 40 characters.

2. **Consistent image handling**
   Enforce a uniform aspect ratio for all card images so the grid rhythm stays intact. Add a small placeholder/background color while images load to prevent layout shift.

3. **Reading progress & reading time**
   On article pages show an estimated reading time and a thin progress bar fixed under the header as the user scrolls. This is expected behavior in modern news sites.

4. **Byline/source clarity**
   Separate author, source, and timestamp into distinct visual tokens (e.g. "By Dave Sebastian · Bloomberg · Aug 30, 2026, 7:39 PM EDT"). Right now the meta line is one long uppercase string that is hard to scan.

5. **Topic tags / company tickers**
   Auto-extract likely companies, sectors, or tickers from each headline and show them as clickable tags beneath summaries. Gives readers a fast scan layer and creates archive pages.

## Tier 2 — Discovery & navigation

6. **Global search**
   Add a search icon in the masthead that opens an overlay. Search across titles, summaries, and full content; return instant results with section filters. This is the single biggest discovery win for a growing archive.

7. **"Most Read" / "Trending" rail**
   Replace or augment part of the "Latest Business Wire" sidebar with a "Most Read" list ranked by page views over the last 24 hours. Add a small flame/trending badge for fast-rising stories.

8. **Breadcrumb + section context**
   On article pages show a breadcrumb (e.g. "Markets > IPOs") and a sticky sub-nav that lets readers jump to the next story in the same section.

9. **Section landing refinement**
   Markets, Technology, Economy, Companies, and Opinion currently mirror the front page. Add sub-section chips (e.g. Markets → Stocks, Bonds, Commodities, Crypto) so readers can filter within a section.

10. **Pagination / infinite scroll choice**
    Right now each page caps at 60 stories. Add a "Load more" button or numbered pagination so power users can dig deeper without feeling the site is shallow.

## Tier 3 — Engagement & retention

11. **Save / read-later**
    Let signed-in users bookmark articles. Add a "Saved Stories" page. Even a simple localStorage version raises return-visit rate.

12. **Newsletter signup modules**
    Inline signup at the end of articles and a sticky footer banner for the daily "US Business Forum Morning Brief." Keep it minimal: email + one-click subscribe.

13. **Share actions**
    Add copy-link, X/Twitter, LinkedIn, and email share buttons on article pages. Use Web Share API on mobile where available.

14. **Commenting on originals**
    Enable comments only on original USBF reporting (e.g. the Kenect piece). Aggregated wire stories stay read-only to avoid moderation burden.

15. **Personalized "For You" feed**
    After a user reads a few articles, surface a "Recommended for You" rail based on category affinity. Start simple: most-read from the categories they visit most.

## Tier 4 — Polish & accessibility

16. **Dark mode toggle**
    Add a sun/moon toggle in the header. The current paper-and-ink palette maps naturally to a sepia or true-dark theme.

17. **Mobile navigation drawer**
    The horizontal nav will break on small screens. Replace it with a hamburger drawer plus a visible search icon.

18. **Focus states & keyboard navigation**
    Ensure all article links, nav items, and form controls have visible focus rings and logical tab order. This is required for accessibility and ad-network quality checks.

19. **Reduced-motion respect**
    Honor `prefers-reduced-motion` for any hover transitions or loading skeletons.

20. **Skeleton loaders & empty states**
    Show elegant skeleton placeholders while the front page fetches, and a richer empty state when a section has no stories.

## Suggested first build

Tier 1 plus global search and a "Most Read" rail. These are visible, low-risk improvements that make the existing content easier to read and easier to find, and they set up the data model (page views, search index) needed for later personalization.
