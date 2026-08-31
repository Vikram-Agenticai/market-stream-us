CREATE TABLE public.article_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX article_views_slug_idx ON public.article_views (slug);
CREATE INDEX article_views_viewed_at_idx ON public.article_views (viewed_at DESC);

GRANT SELECT, INSERT ON public.article_views TO anon;
GRANT SELECT, INSERT ON public.article_views TO authenticated;
GRANT ALL ON public.article_views TO service_role;

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article views are publicly readable" ON public.article_views
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Article views are publicly insertable" ON public.article_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);