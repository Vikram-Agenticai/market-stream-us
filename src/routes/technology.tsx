import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/news.functions";
import { SectionPage } from "@/components/site/SectionPage";
import { SECTIONS } from "@/lib/categories";

const section = SECTIONS[1]!;

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology — US Business Forum" },
      { name: "description", content: section.blurb },
      { property: "og:title", content: "Technology — US Business Forum" },
      { property: "og:description", content: section.blurb },
    ],
  }),
  loader: () => listArticles({ data: { category: "technology", limit: 60 } }),
  component: TechnologyPage,
});

function TechnologyPage() {
  return <SectionPage title="Technology" blurb={section.blurb} articles={Route.useLoaderData()} />;
}
