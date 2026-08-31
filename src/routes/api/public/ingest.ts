import { createFileRoute } from "@tanstack/react-router";

import { classifyCategory } from "@/lib/categories";

// News sources scraped on a schedule. RSS gives us the headline, the
// description/full content block and (where the publisher provides it) an image.
const FEEDS: { url: string; source: string }[] = [
  {
    url: "https://feeds.content.dowjones.io/public/rss/WSJcomUSBusiness",
    source: "The Wall Street Journal",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSMarketsMain",
    source: "The Wall Street Journal",
  },
  {
    url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en",
    source: "Google News",
  },
  {
    url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en",
    source: "Google News",
  },
  { url: "https://feeds.a.dj.com/rss/RSSWSJD.xml", source: "The Wall Street Journal" },
  { url: "https://www.cnbc.com/id/10001147/device/rss/rss.html", source: "CNBC" },
  { url: "https://www.cnbc.com/id/20910258/device/rss/rss.html", source: "CNBC" },
];

const MAX_ITEMS_PER_FEED = 30;

const NAMED_ENTITIES: Record<string, string> = {
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "\u2019",
  lsquo: "\u2018",
  ldquo: "\u201C",
  rdquo: "\u201D",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
  amp: "&",
};

function decodeOnce(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_m, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (m, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

function decodeEntities(input: string): string {
  // Feeds frequently double-encode (&amp;#x2019;), so decode twice.
  return decodeOnce(decodeOnce(input)).trim();
}


function stripTags(input: string): string {
  return decodeEntities(
    input
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function pick(block: string, tag: string): string | null {
  const match = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i").exec(block);
  return match?.[1] ? decodeEntities(match[1]) : null;
}

function pickAttr(block: string, tag: string, attr: string): string | null {
  const match = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i").exec(block);
  return match?.[1] ?? null;
}

function slugify(title: string, fallback: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return base.length > 8 ? base : `story-${fallback.slice(0, 24)}`;
}

function hash(value: string): string {
  let h = 5381;
  for (let i = 0; i < value.length; i += 1) h = ((h << 5) + h + value.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

type ParsedItem = {
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  author: string | null;
  source_name: string;
  source_url: string;
  image_url: string | null;
  category: string;
  published_at: string;
};

function parseFeed(xml: string, sourceName: string): ParsedItem[] {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const items: ParsedItem[] = [];

  for (const block of blocks.slice(0, MAX_ITEMS_PER_FEED)) {
    const rawTitle = pick(block, "title");
    const link = pick(block, "link") ?? pickAttr(block, "link", "href");
    if (!rawTitle || !link) continue;

    const title = stripTags(rawTitle);
    const encoded = pick(block, "content:encoded");
    const description = pick(block, "description");
    const summarySource = description ?? encoded ?? "";
    const contentSource = encoded ?? description ?? "";

    const image =
      pickAttr(block, "media:content", "url") ??
      pickAttr(block, "media:thumbnail", "url") ??
      pickAttr(block, "enclosure", "url") ??
      /<img[^>]+src=["']([^"']+)["']/i.exec(contentSource)?.[1] ??
      null;

    const pubDate = pick(block, "pubDate") ?? pick(block, "dc:date");
    const published = pubDate ? new Date(pubDate) : new Date();
    const publishedAt = Number.isNaN(published.getTime())
      ? new Date().toISOString()
      : published.toISOString();

    const author =
      pick(block, "dc:creator") ??
      pick(block, "author") ??
      (sourceName === "Google News"
        ? (/-\s([^-]+)$/.exec(title)?.[1]?.trim() ?? null)
        : null);

    const summaryText = stripTags(summarySource);
    const contentText = stripTags(contentSource);

    items.push({
      slug: `${slugify(title, hash(link))}-${hash(link)}`,
      title,
      summary: summaryText ? summaryText.slice(0, 600) : null,
      content: contentText || null,
      author: author ? author.slice(0, 120) : null,
      source_name: sourceName,
      source_url: link.trim(),
      image_url: image,
      category: classifyCategory(`${title} ${summaryText}`),
      published_at: publishedAt,
    });
  }

  return items;
}

async function runIngest() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Single-flight lock: bail out if another run started in the last 4 minutes.
  const { data: recent } = await supabaseAdmin
    .from("ingest_runs")
    .select("id, started_at, status")
    .eq("status", "running")
    .gte("started_at", new Date(Date.now() - 4 * 60_000).toISOString())
    .limit(1);

  if (recent && recent.length > 0) {
    return { skipped: true, reason: "another run in progress" };
  }

  const { data: run } = await supabaseAdmin
    .from("ingest_runs")
    .insert({ status: "running" })
    .select("id")
    .single();

  let inserted = 0;
  let updated = 0;
  const problems: string[] = [];

  try {
    const results = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const res = await fetch(feed.url, {
            headers: {
              "user-agent":
                "Mozilla/5.0 (compatible; USBusinessForumBot/1.0; +https://usbusinessforum.com)",
              accept: "application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8",
            },
          });
          if (!res.ok) {
            problems.push(`${feed.url} -> ${res.status}`);
            return [] as ParsedItem[];
          }
          return parseFeed(await res.text(), feed.source);
        } catch (error) {
          problems.push(`${feed.url} -> ${(error as Error).message}`);
          return [] as ParsedItem[];
        }
      }),
    );

    const bySlug = new Map<string, ParsedItem>();
    for (const item of results.flat()) {
      if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
    }
    const items = [...bySlug.values()];

    if (items.length > 0) {
      const { data: existing } = await supabaseAdmin
        .from("articles")
        .select("slug")
        .in(
          "slug",
          items.map((i) => i.slug),
        );
      const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

      const { error } = await supabaseAdmin
        .from("articles")
        .upsert(
          items.map((item) => ({ ...item, updated_at: new Date().toISOString() })),
          { onConflict: "slug" },
        );
      if (error) throw new Error(error.message);

      inserted = items.filter((i) => !existingSlugs.has(i.slug)).length;
      updated = items.length - inserted;
    }

    if (run) {
      await supabaseAdmin
        .from("ingest_runs")
        .update({
          status: "success",
          finished_at: new Date().toISOString(),
          inserted_count: inserted,
          updated_count: updated,
          message: problems.length ? problems.join("; ").slice(0, 500) : null,
        })
        .eq("id", run.id);
    }

    return { ok: true, inserted, updated, feeds: FEEDS.length, problems };
  } catch (error) {
    if (run) {
      await supabaseAdmin
        .from("ingest_runs")
        .update({
          status: "failed",
          finished_at: new Date().toISOString(),
          message: (error as Error).message.slice(0, 500),
        })
        .eq("id", run.id);
    }
    throw error;
  }
}

export const Route = createFileRoute("/api/public/ingest")({
  server: {
    handlers: {
      POST: async () => {
        try {
          return Response.json(await runIngest());
        } catch (error) {
          return Response.json({ ok: false, error: (error as Error).message }, { status: 500 });
        }
      },
      GET: async () => {
        try {
          return Response.json(await runIngest());
        } catch (error) {
          return Response.json({ ok: false, error: (error as Error).message }, { status: 500 });
        }
      },
    },
  },
});
