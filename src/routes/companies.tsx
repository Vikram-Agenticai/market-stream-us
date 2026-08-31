import { createFileRoute } from "@tanstack/react-router";

import { listArticles } from "@/lib/news.functions";
import { SectionPage } from "@/components/site/SectionPage";
import { SECTIONS } from "@/lib/categories";

const section = SECTIONS[3]!;

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — US Business Forum" },
      { name: "description", content: section.blurb },
      { property: "og:title", content: "Companies — US Business Forum" },
      { property: "og:description", content: section.blurb },
    ],
  }),
  loader: () => listArticles({ data: { category: "companies", limit: 60 } }),
  component: CompaniesPage,
});

function CompaniesPage() {
  return <SectionPage title="Companies" blurb={section.blurb} articles={Route.useLoaderData()} />;
}
