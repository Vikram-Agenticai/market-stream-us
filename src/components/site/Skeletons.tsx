import { useRouterState } from "@tanstack/react-router";

function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-muted ${className}`} aria-hidden="true" />;
}

/** Small inline status pill shown while a route loader is fetching. */
export function LoadingIndicator({ label = "Loading" }: { label?: string }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
    >
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-accent" />
      {label}…
    </span>
  );
}

/** Renders the indicator only while the router is loading a new match. */
export function RouteStatus({ label = "Updating" }: { label?: string }) {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading });
  if (!isLoading) return null;
  return <LoadingIndicator label={label} />;
}

function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Bar className="aspect-[3/2] w-full" />
      <Bar className="h-3 w-24" />
      <Bar className="h-5 w-full" />
      <Bar className="h-5 w-4/5" />
      <Bar className="h-3 w-2/3" />
    </div>
  );
}

function BriefSkeleton() {
  return (
    <div className="space-y-2 py-3">
      <Bar className="h-4 w-11/12" />
      <Bar className="h-3 w-1/3" />
    </div>
  );
}

/** Full-page skeleton for the archive route. */
export function ArchiveSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" role="status" aria-live="polite">
      <span className="sr-only">Loading archive stories</span>
      <div className="rule-top pt-4 pb-6 space-y-3">
        <Bar className="h-3 w-28" />
        <Bar className="h-10 w-2/3" />
        <Bar className="h-4 w-full max-w-2xl" />
      </div>
      <div className="hairline flex flex-wrap items-end gap-4 py-5">
        <Bar className="h-10 w-44" />
        <Bar className="h-10 w-56" />
        <Bar className="h-10 w-40" />
      </div>
      <div className="py-6">
        <LoadingIndicator label="Retrieving stories" />
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="mt-10 divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <BriefSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Full-page skeleton for an article detail route. */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" role="status" aria-live="polite">
      <span className="sr-only">Loading story</span>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <Bar className="h-3 w-32" />
          <Bar className="h-10 w-full" />
          <Bar className="h-10 w-4/5" />
          <Bar className="h-4 w-1/2" />
          <Bar className="aspect-[16/9] w-full" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Bar key={i} className={`h-4 ${i % 4 === 3 ? "w-3/5" : "w-full"}`} />
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <LoadingIndicator label="Loading story" />
          <Bar className="h-64 w-full" />
          <Bar className="h-40 w-full" />
        </aside>
      </div>
    </div>
  );
}

/** Compact skeleton list used by sidebar rails. */
export function RailSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <span className="sr-only">Loading stories</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Bar className="h-4 w-full" />
          <Bar className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
