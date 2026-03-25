CREATE TABLE IF NOT EXISTS public.claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id uuid NOT NULL REFERENCES public.planners(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  description text,
  image_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Planners can manage own claims" ON public.claims;
CREATE POLICY "Planners can manage own claims" ON public.claims FOR ALL USING (auth.uid() = planner_id);

-- updated_at trigger
DROP TRIGGER IF EXISTS set_claims_updated_at ON public.claims;
CREATE TRIGGER set_claims_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Note: We assume the 'planner-assets' bucket already exists, as it's used for planner profile/card images.
