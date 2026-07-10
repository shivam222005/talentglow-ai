
CREATE TABLE public.learning_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal TEXT,
  weeks JSONB NOT NULL DEFAULT '[]'::jsonb,
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_roadmaps TO authenticated;
GRANT ALL ON public.learning_roadmaps TO service_role;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roadmaps" ON public.learning_roadmaps FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX learning_roadmaps_user_created ON public.learning_roadmaps (user_id, created_at DESC);
CREATE TRIGGER trg_learning_roadmaps_updated BEFORE UPDATE ON public.learning_roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
