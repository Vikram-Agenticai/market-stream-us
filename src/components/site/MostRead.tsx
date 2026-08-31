import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { getMostRead } from "@/lib/news.functions";
import { categoryLabel } from "@/lib/categories";
import { timeAgoUS } from "@/lib/format";

export function MostRead({ limit = 6 }: { limit?: number }) {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getMostRead>>>([]);

  useEffect(() => {
    getMostRead({ data: { hours: 24, limit } }).then(setItems).catch(() => setItems([]));
  }, [limit]);

  if (items.length === 0) return null;

  return (
    <div className="rule-top pt-3">
      <h2 className="kicker mb-4 flex items-center gap-2">
        <span>Most Read</span>
        <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
      </h2>
      <ol className="list-decimal space-y-4 pl-4 marker:font-sans marker:text-sm marker:font-bold marker:text-muted-foreground">
        {items.map((article) => (
          <li key={article.slug} className="pl-2">
            <Link to="/article/$slug" params={{ slug: article.slug }} className="group block">
              <h4 className="text-sm leading-snug font-semibold transition-colors group-hover:text-accent">
                {article.title}
              </h4>
              <p className="meta-line mt-1">
                {categoryLabel(article.category)} · {timeAgoUS(article.published_at)}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
