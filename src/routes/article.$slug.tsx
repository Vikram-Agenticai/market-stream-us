import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getArticle } from "@/lib/news.functions";
import { categoryLabel } from "@/lib/categories";
import { formatUSDateTime } from "@/lib/format";
import { BriefItem } from "@/components/site/ArticleCard";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    const result = await getArticle({ data: { slug: params.slug } });
    if (!result.article) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.article) {
      return {
        meta: [{ title: "Story unavailable — US Business Forum" }, { name: "robots", content: "noindex" }],
      };
    }
    const { article } = loaderData;
    const description = (article.summary ?? article.title).slice(0, 155);
    return {
      meta: [
        { title: `${article.title.slice(0, 68)} — US Business Forum` },
        { name: "description", content: description },
        { property: "og:title", content: article.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: StoryNotFound,
  component: ArticlePage,
});

function StoryNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">This story is no longer available</h1>
      <p className="mt-3 text-muted-foreground">
        Wire stories rotate out of our archive. Return to the front page for the latest headlines.
      </p>
      <Link to="/" className="kicker mt-6 inline-block">
        Back to the front page
      </Link>
    </div>
  );
}

function ArticlePage() {
  const { article, related } = Route.useLoaderData();
  if (!article) return <StoryNotFound />;

  const displayTitle = article.is_original
    ? article.title
    : article.title.replace(/\s+-\s+[^-]{2,40}$/, "");

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div>
          <p className="kicker">
            {article.is_original ? "Exclusive" : categoryLabel(article.category)}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.1] font-bold sm:text-5xl">{displayTitle}</h1>
          {article.summary ? (
            <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{article.summary}</p>
          ) : null}

          <div className="hairline mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 pt-4">
            {article.author ? (
              <span className="font-sans text-sm font-semibold">By {article.author}</span>
            ) : null}
            <span className="meta-line">Published {formatUSDateTime(article.published_at)}</span>
            {article.source_name ? (
              <span className="meta-line">Source: {article.source_name}</span>
            ) : null}
          </div>

          {article.image_url ? (
            <figure className="mt-8">
              <img
                src={article.image_url}
                alt={displayTitle}
                className="w-full object-cover"
                loading="eager"
              />
            </figure>
          ) : null}

          <div className="article-prose mt-8">
            {article.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
            ) : (
              <p>{article.summary}</p>
            )}
          </div>

          {article.source_url ? (
            <p className="rule-top mt-10 pt-5">
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="kicker inline-flex items-center gap-2 hover:underline"
              >
                Read original at {article.source_name ?? "publisher"} &rarr;
              </a>
            </p>
          ) : null}
        </div>

        <aside className="lg:border-l lg:border-border lg:pl-8">
          <h2 className="kicker rule-top pt-3 pb-4">More in {categoryLabel(article.category)}</h2>
          {related.length > 0 ? (
            related.map((item) => <BriefItem key={item.slug} article={item} />)
          ) : (
            <p className="text-sm text-muted-foreground">No related stories yet.</p>
          )}
        </aside>
      </div>
    </article>
  );
}
