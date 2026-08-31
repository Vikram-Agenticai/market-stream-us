CREATE OR REPLACE FUNCTION public.get_most_read(since timestamptz, limit_count integer)
RETURNS TABLE(slug text, view_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT av.slug, COUNT(*)::bigint AS view_count
  FROM public.article_views av
  WHERE av.viewed_at >= since
  GROUP BY av.slug
  ORDER BY view_count DESC, MAX(av.viewed_at) DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_most_read(timestamptz, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.get_most_read(timestamptz, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_most_read(timestamptz, integer) TO service_role;