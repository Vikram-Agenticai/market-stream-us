import { Link } from "@tanstack/react-router";

import type { Article } from "@/lib/news.functions";
import { categoryLabel } from "@/lib/categories";
import { formatUSDateTime, timeAgoUS } from "@/lib/format";

function cleanTitle(article: Article) {
  if (article.is_original) return article.title;
  return article.title.replace(/\s+-\s+[^-]{2,40}$/, "");
}

export function LeadStory({ article }: { article: Article }) {
  return (
    <article className="pb-8">
      {article.image_url ? (
        <Link to="/article/$slug" params={{ slug: article.slug }} className="block">
          <img
            src={article.image_url}
            alt={cleanTitle(article)}
            className="mb-5 aspect-[16/9] w-full object-cover"
            loading="eager"
          />
        </Link>
      ) : null}
      <p className="kicker mb-3">
        {article.is_original ? "Exclusive" : categoryLabel(article.category)}
      </p>
      <h2 className="text-3xl leading-tight font-bold sm:text-[2.6rem]">
        <Link to="/article/$slug" params={{ slug: article.slug }} className="headline-link">
          {cleanTitle(article)}
        </Link>
      </h2>
      {article.summary ? (
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {article.summary}
        </p>
      ) : null}
      <p className="meta-line mt-4">
        {article.author ? `By ${article.author} · ` : ""}
        {formatUSDateTime(article.published_at)}
      </p>
    </article>
  );
}

export function StoryCard({ article, showImage = true }: { article: Article; showImage?: boolean }) {
  return (
    <article className="flex flex-col gap-3 pb-6">
      {showImage && article.image_url ? (
        <Link to="/article/$slug" params={{ slug: article.slug }}>
          <img
            src={article.image_url}
            alt={cleanTitle(article)}
            className="aspect-[3/2] w-full object-cover"
            loading="lazy"
          />
        </Link>
      ) : null}
      <p className="kicker">{categoryLabel(article.category)}</p>
      <h3 className="text-xl leading-snug font-bold">
        <Link to="/article/$slug" params={{ slug: article.slug }} className="headline-link">
          {cleanTitle(article)}
        </Link>
      </h3>
      {article.summary ? (
        <p className="line-clamp-3 text-[0.98rem] leading-relaxed text-muted-foreground">
          {article.summary}
        </p>
      ) : null}
      <p className="meta-line">
        {article.source_name ?? "Wire"} &middot; {timeAgoUS(article.published_at)}
      </p>
    </article>
  );
}

export function BriefItem({ article }: { article: Article }) {
  return (
    <article className="hairline py-4 first:border-t-0 first:pt-0">
      <h4 className="text-base leading-snug font-semibold">
        <Link to="/article/$slug" params={{ slug: article.slug }} className="headline-link">
          {cleanTitle(article)}
        </Link>
      </h4>
      <p className="meta-line mt-2">
        {article.source_name ?? "Wire"} &middot; {timeAgoUS(article.published_at)}
      </p>
    </article>
  );
}
