type AdFormat = "leaderboard" | "rectangle" | "in-article" | "footer";

const SIZES: Record<AdFormat, { className: string; label: string }> = {
  leaderboard: { className: "min-h-[90px] sm:min-h-[100px]", label: "728 × 90" },
  rectangle: { className: "min-h-[250px]", label: "300 × 250" },
  "in-article": { className: "min-h-[120px]", label: "Native / 580 × 120" },
  footer: { className: "min-h-[90px]", label: "970 × 90" },
};

/**
 * Reserved advertising inventory. Each slot keeps its space in the layout so
 * a served creative (Google Ad Manager, AdSense, or a direct-sold campaign)
 * can be injected into the container without shifting the page.
 */
export function AdSlot({
  format = "leaderboard",
  slotId,
  className = "",
}: {
  format?: AdFormat;
  slotId: string;
  className?: string;
}) {
  const size = SIZES[format];

  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={slotId}
      className={`my-8 ${className}`}
    >
      <p className="meta-line mb-2 text-center text-[0.6rem] tracking-[0.22em]">Advertisement</p>
      <div
        className={`flex flex-col items-center justify-center gap-1 border border-dashed border-border bg-muted/40 px-4 py-6 text-center ${size.className}`}
      >
        <span className="meta-line text-[0.62rem]">{slotId}</span>
        <span className="font-sans text-xs text-muted-foreground">{size.label} ad unit</span>
      </div>
    </aside>
  );
}
