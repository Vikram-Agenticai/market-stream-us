import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { ORIGINAL_ARTICLES } from "@/content/original-articles";

export type Article = {
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  author: string | null;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  category: string;
  published_at: string;
  is_original: boolean;
  is_featured: boolean;
};

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function originals(): Article[] {
  return ORIGINAL_ARTICLES.map((a) => ({ ...a }));
}

export const listArticles = createServerFn({ method: "GET" })
  .inputValidator((data: { category?: string; limit?: number }) => data ?? {})
  .handler(async ({ data }) => {
    const limit = Math.min(data.limit ?? 60, 120);
    const supabase = publicClient();
    let query = supabase
      .from("articles")
      .select(
        "slug,title,summary,content,author,source_name,source_url,image_url,category,published_at,is_original,is_featured",
      )
      .order("published_at", { ascending: false })
      .limit(limit);

    if (data.category) query = query.eq("category", data.category);

    const { data: rows, error } = await query;
    if (error) console.error("listArticles", error.message);

    const scraped = (rows ?? []) as Article[];
    const local = data.category
      ? originals().filter((a) => a.category === data.category)
      : originals();

    return [...local, ...scraped]
      .sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at))
      .slice(0, limit);

  });

export const getArticle = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const local = originals().find((a) => a.slug === data.slug);
    const supabase = publicClient();

    if (local) {
      const { data: localRelated } = await supabase
        .from("articles")
        .select(
          "slug,title,summary,content,author,source_name,source_url,image_url,category,published_at,is_original,is_featured",
        )
        .eq("category", local.category)
        .order("published_at", { ascending: false })
        .limit(5);
      return { article: local, related: (localRelated ?? []) as Article[] };
    }


    const { data: row } = await supabase
      .from("articles")
      .select(
        "slug,title,summary,content,author,source_name,source_url,image_url,category,published_at,is_original,is_featured",
      )
      .eq("slug", data.slug)
      .maybeSingle();

    if (!row) return { article: null, related: [] as Article[] };

    const { data: related } = await supabase
      .from("articles")
      .select(
        "slug,title,summary,content,author,source_name,source_url,image_url,category,published_at,is_original,is_featured",
      )
      .eq("category", (row as Article).category)
      .neq("slug", data.slug)
      .order("published_at", { ascending: false })
      .limit(5);

    return { article: row as Article, related: (related ?? []) as Article[] };
  });

export const getIngestStatus = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase
    .from("ingest_runs")
    .select("started_at,finished_at,status,inserted_count,updated_count")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
});
