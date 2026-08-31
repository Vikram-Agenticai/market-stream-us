import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/news.functions";
import { SectionPage } from "@/components/site/SectionPage";
import { SECTIONS } from "@/lib/categories";

const section = SECTIONS[2]!;

export const Route = createFileRoute("/economy")({
  head: () => ({
    meta: [
      { title: "Economy — US Business Forum" },
      { name: "description", content: section.blurb },
      { property: "og:title", content: "Economy — US Business Forum" },
      { property: "og:description", content: section.blurb },
    ],
  }),
  loader: () => listArticles({ data: { category: "economy", limit: 60 } }),
  component: EconomyPage,
});

function EconomyPage() {
  return <SectionPage title="Economy" blurb={section.blurb} articles={Route.useLoaderData()} />;
}
