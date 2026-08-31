import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/news.functions";
import { SectionPage } from "@/components/site/SectionPage";
import { SECTIONS } from "@/lib/categories";

const section = SECTIONS[0]!;

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — US Business Forum" },
      { name: "description", content: section.blurb },
      { property: "og:title", content: "Markets — US Business Forum" },
      { property: "og:description", content: section.blurb },
    ],
  }),
  loader: () => listArticles({ data: { category: "markets", limit: 60 } }),
  component: MarketsPage,
});

function MarketsPage() {
  return <SectionPage title="Markets" blurb={section.blurb} articles={Route.useLoaderData()} />;
}
