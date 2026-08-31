import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { listArticlesByDate, getArchiveDays } from "@/lib/news.functions";
import { StoryCard, BriefItem } from "@/components/site/ArticleCard";
import { AdSlot } from "@/components/site/AdSlot";
import { SECTIONS } from "@/lib/categories";
import {
  todayUS,
  shiftUSDate,
  usDateRangeToIso,
  formatArchiveDate,
} from "@/lib/format";

type ArchiveSearch = { date?: string; range?: "day" | "week" | "month"; category?: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const Route = createFileRoute("/archive")({
  validateSearch: (search: Record<string, unknown>): ArchiveSearch => {
    const date = typeof search["date"] === "string" && DATE_RE.test(search["date"] as string)
      ? (search["date"] as string)
      : undefined;
    const rangeRaw = search["range"];
    const range =
      rangeRaw === "day" || rangeRaw === "week" || rangeRaw === "month" ? rangeRaw : "day";
    const category =
      typeof search["category"] === "string" && SECTIONS.some((s) => s.key === search["category"])
        ? (search["category"] as string)
        : undefined;
    return { ...(date ? { date } : {}), range, ...(category ? { category } : {}) };
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const end = deps.date ?? todayUS();
    const span = deps.range === "month" ? 29 : deps.range === "week" ? 6 : 0;
    const start = shiftUSDate(end, -span);
    const { from, to } = usDateRangeToIso(start, end);
    const [articles, days] = await Promise.all([
      listArticlesByDate({
        data: { from, to, limit: 200, ...(deps.category ? { category: deps.category } : {}) },
      }),
      getArchiveDays({ data: { days: 60 } }),
    ]);
    return { articles, days, start, end };
  },
  head: () => ({
    meta: [
      { title: "News Archive — Browse U.S. Business News by Date | US Business Forum" },
      {
        name: "description",
        content:
          "Browse the past month of United States business news, or pick any custom date to load that day's markets, economy, technology and company headlines.",
      },
      { property: "og:title", content: "News Archive — US Business Forum" },
      {
        property: "og:description",
        content: "Browse U.S. business headlines by day, week or month, back through our archive.",
      },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const { articles, days, start, end } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/archive" });
  const range = search.range ?? "day";

  const update = (next: Partial<ArchiveSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });

  const [lead, ...rest] = articles;
  const grid = rest.slice(0, 9);
  const briefs = rest.slice(9);
  const dayCounts = new Map(days.map((d) => [d.date, d.count]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="rule-top pt-4 pb-6">
        <p className="kicker">The Archive</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Business News by Date</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Every story we have published, retrievable by day. Choose a custom date or widen the
          window to a full week or month of United States business coverage.
        </p>
      </header>

      <div className="hairline flex flex-wrap items-end gap-4 py-5">
        <label className="flex flex-col gap-1">
          <span className="meta-line">Date</span>
          <input
            type="date"
            value={search.date ?? todayUS()}
            max={todayUS()}
            onChange={(e) => update({ date: e.target.value })}
            className="border border-input bg-background px-3 py-2 font-sans text-sm"
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="meta-line">Window</span>
          <div className="flex">
            {(["day", "week", "month"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update({ range: r })}
                className={`border border-input px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                  range === r
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:text-accent"
                }`}
              >
                {r === "day" ? "That day" : r === "week" ? "7 days" : "30 days"}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="meta-line">Section</span>
          <select
            value={search.category ?? ""}
            onChange={(e) => update({ category: e.target.value || undefined })}
            className="border border-input bg-background px-3 py-2 font-sans text-sm"
          >
            <option value="">All sections</option>
            {SECTIONS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update({ date: shiftUSDate(search.date ?? todayUS(), -1) })}
            className="border border-input px-3 py-2 font-sans text-xs uppercase tracking-[0.12em] hover:text-accent"
          >
            ← Previous day
          </button>
          <button
            type="button"
            onClick={() => update({ date: todayUS(), range: "day" })}
            className="border border-input px-3 py-2 font-sans text-xs uppercase tracking-[0.12em] hover:text-accent"
          >
            Today
          </button>
        </div>
      </div>

      <p className="meta-line py-4">
        {range === "day"
          ? formatArchiveDate(end)
          : `${formatArchiveDate(start)} — ${formatArchiveDate(end)}`}
        {" · "}
        {articles.length} {articles.length === 1 ? "story" : "stories"}
      </p>

      <AdSlot slotId="archive-top" format="leaderboard" />

      {!lead ? (
        <div className="hairline py-16 text-center">
          <p className="text-muted-foreground">
            No stories were published to the forum on this date.
          </p>
          {days.length > 0 ? (
            <div className="mt-6">
              <p className="kicker mb-3">Recent days with coverage</p>
              <div className="flex flex-wrap justify-center gap-2">
                {days.slice(0, 14).map((d) => (
                  <Link
                    key={d.date}
                    to="/archive"
                    search={{ date: d.date, range: "day" as const }}
                    className="border border-input px-3 py-1.5 font-sans text-xs hover:text-accent"
                  >
                    {d.date} ({d.count})
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="rule-top grid gap-8 pt-8 md:grid-cols-3">
            {[lead, ...grid].map((article) => (
              <StoryCard key={article.slug} article={article} />
            ))}
          </div>

          {briefs.length > 0 ? (
            <section className="rule-top mt-12 pt-6">
              <h2 className="kicker mb-4">More from this period</h2>
              <div className="grid gap-x-10 md:grid-cols-2">
                {briefs.map((article) => (
                  <BriefItem key={article.slug} article={article} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      {dayCounts.size > 0 ? (
        <section className="rule-top mt-12 pt-6">
          <h2 className="kicker mb-4">Jump to a recent day</h2>
          <div className="flex flex-wrap gap-2">
            {days.slice(0, 30).map((d) => (
              <Link
                key={d.date}
                to="/archive"
                search={{ date: d.date, range: "day" as const }}
                className={`border px-3 py-1.5 font-sans text-xs transition-colors hover:text-accent ${
                  d.date === end ? "border-accent text-accent" : "border-input"
                }`}
              >
                {d.date}
                <span className="ml-1.5 text-muted-foreground">{d.count}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AdSlot slotId="archive-bottom" format="footer" />
    </div>
  );
}
