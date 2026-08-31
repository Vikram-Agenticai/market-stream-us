# Monetization Roadmap — US Business Forum

Today the site has a front page, five section pages, article detail pages, and an automated scraper. There is no audience capture, no ads, and no paid product. Below are the revenue levers, ordered by effort-to-payoff.

## Tier 1 — Foundations (build first, everything else depends on them)

1. **Email newsletter capture**
   Inline signup in the header, end of every article, and a footer block. Store subscribers in the backend. A daily "US Business Forum Morning Brief" auto-assembled from the top stories of the last 24 hours, sent via the platform's email service. Newsletters are the highest-CPM inventory in business media.

2. **Analytics + consent**
   Page-view and article-level tracking so we can prove traffic to advertisers, plus a cookie consent banner (required before ad networks and required in the EU).

3. **SEO depth**
   Article JSON-LD (NewsArticle schema), sitemap.xml and news-sitemap.xml auto-generated from the article table, RSS output feed, canonical tags pointing to our page, and tag/topic archive pages. Organic search is the cheapest traffic and all ad revenue scales with it.

## Tier 2 — Direct revenue

4. **Ad slots**
   Reserved, layout-stable ad units: leaderboard under the masthead, in-feed unit after the 4th story, sidebar rectangle on article pages, and a sticky mobile footer. Start with a house-ad component that can later be swapped to Google AdSense/Ad Manager without touching layout.

5. **Sponsored content**
   A "Partner Content" article type with its own label, badge styling, and section — sold directly, far higher margin than programmatic.

6. **Affiliate/lead-gen modules**
   Contextual widgets in Markets and Companies (brokerage comparisons, business banking, SaaS tools) with disclosure text.

7. **Job board**
   Paid business/finance job postings with a self-serve submit form, checkout via Stripe, admin approval, and a `/jobs` page. Niche job boards monetize well against a professional audience.

## Tier 3 — Recurring revenue

8. **Memberships (Stripe)**
   "USBF Pro" tier: ad-free reading, full archive search, daily/weekly PDF briefing, saved articles, and email alerts on companies or keywords. Metered paywall (e.g. 5 free articles/month) on original reporting only — never on aggregated wire content.

9. **Original reporting expansion**
   The ShelVey piece proves the format. A steady cadence of in-house exclusives is what people actually pay for and what earns backlinks; aggregation alone cannot sustain a paid tier.

10. **Data products**
    Company pages, market snapshot widgets, and a weekly "US Business Data" digest — sellable as a premium add-on and strong SEO surface.

## Tier 4 — Growth multipliers

11. Personalization: follow topics/companies, "For You" feed, saved-articles list (drives accounts, which drive email + paid conversion).
12. Search + archive: full-text search over all ingested articles.
13. Social/AMP-friendly share cards, per-article OG images.
14. Reader engagement: comments on original pieces, reading-time estimates, most-read rail.
15. Media Kit page: traffic stats, audience profile, ad specs, contact form — how advertisers actually reach you.

## Technical notes

- Newsletter, memberships, and jobs all need auth; that means adding sign-in (email + Google) and a users/profiles table with role separation.
- Payments via Stripe for memberships and job postings.
- Ad units must be fixed-height placeholders to avoid layout shift hurting Core Web Vitals.
- Legal pages required before any ad network or payment: Privacy Policy, Terms, Cookie Policy, Advertising Disclosure.
- Aggregated third-party content must stay free and attributed; only original USBF work goes behind the paywall.

## Suggested first build

Tier 1 in full (newsletter capture + daily brief, analytics/consent, SEO schema and sitemaps) plus the ad-slot component from Tier 2 as house ads. That makes the site sellable to advertisers and starts compounding an email list immediately.
