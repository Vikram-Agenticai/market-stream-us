import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";

import { searchArticles } from "@/lib/news.functions";
import { categoryLabel } from "@/lib/categories";
import { timeAgoUS } from "@/lib/format";
import { cleanSummary } from "@/lib/text";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchArticles>>>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const data = await searchArticles({ data: { q, limit: 12 } });
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/60 p-4 pt-16 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-sm bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-4 py-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            placeholder="Search headlines, companies, markets..."
            className="w-full bg-transparent font-sans text-lg outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-4 py-3">
          {query.trim().length < 2 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Type at least two characters to search the archive.
            </p>
          ) : loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Searching...</p>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No stories found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((article) => {
                const summary = cleanSummary(article.summary, 120);
                return (
                  <li key={article.slug} className="py-4">
                    <Link
                      to="/article/$slug"
                      params={{ slug: article.slug }}
                      onClick={onClose}
                      className="group block"
                    >
                      <span className="kicker">{categoryLabel(article.category)}</span>
                      <h3 className="mt-1 text-lg font-bold leading-snug transition-colors group-hover:text-accent">
                        {article.title}
                      </h3>
                      {summary ? (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{summary}</p>
                      ) : null}
                      <p className="meta-line mt-2">
                        {article.source_name ?? "Wire"} · {timeAgoUS(article.published_at)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
