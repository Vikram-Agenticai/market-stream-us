import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/news.functions";
import { SectionPage } from "@/components/site/SectionPage";
import { SECTIONS } from "@/lib/categories";

const section = SECTIONS[4]!;

export const Route = createFileRoute("/opinion")({
  head: () => ({
    meta: [
      { title: "Opinion — US Business Forum" },
      { name: "description", content: section.blurb },
      { property: "og:title", content: "Opinion — US Business Forum" },
      { property: "og:description", content: section.blurb },
    ],
  }),
  loader: () => listArticles({ data: { category: "opinion", limit: 60 } }),
  component: OpinionPage,
});

function OpinionPage() {
  return <SectionPage title="Opinion" blurb={section.blurb} articles={Route.useLoaderData()} />;
}
