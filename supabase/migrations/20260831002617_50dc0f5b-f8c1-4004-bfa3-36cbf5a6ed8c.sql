CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  content text,
  author text,
  source_name text,
  source_url text,
  image_url text,
  category text NOT NULL DEFAULT 'business',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_featured boolean NOT NULL DEFAULT false,
  is_original boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX articles_published_idx ON public.articles (published_at DESC);
CREATE INDEX articles_category_idx ON public.articles (category, published_at DESC);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articles are publicly readable" ON public.articles FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.ingest_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  inserted_count integer NOT NULL DEFAULT 0,
  updated_count integer NOT NULL DEFAULT 0,
  message text
);
GRANT SELECT ON public.ingest_runs TO anon;
GRANT SELECT ON public.ingest_runs TO authenticated;
GRANT ALL ON public.ingest_runs TO service_role;
ALTER TABLE public.ingest_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ingest runs are publicly readable" ON public.ingest_runs FOR SELECT TO anon, authenticated USING (true);