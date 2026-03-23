CREATE TABLE IF NOT EXISTS public.site_visits (
  visit_date date PRIMARY KEY,
  visit_count integer NOT NULL DEFAULT 0
);

-- RLS Policy
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site visits" ON public.site_visits;
CREATE POLICY "Public can view site visits" 
ON public.site_visits FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Service role can insert/update site visits" ON public.site_visits;
CREATE POLICY "Service role can insert/update site visits" 
ON public.site_visits FOR ALL 
USING (true);

-- RPC Function for atomic increment
CREATE OR REPLACE FUNCTION public.increment_site_visit()
RETURNS void AS $$
BEGIN
  INSERT INTO public.site_visits (visit_date, visit_count)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (visit_date)
  DO UPDATE SET visit_count = site_visits.visit_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
