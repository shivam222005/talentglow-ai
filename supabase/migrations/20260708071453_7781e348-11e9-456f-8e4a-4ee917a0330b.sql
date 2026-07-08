
-- =====================================================
-- STUDENT CORE TABLES
-- =====================================================

CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  extracted_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own resumes" ON public.resumes FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX resumes_user_idx ON public.resumes(user_id, created_at DESC);

CREATE TABLE public.ats_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  ats_score INTEGER NOT NULL DEFAULT 0,
  grammar_score INTEGER NOT NULL DEFAULT 0,
  keyword_match INTEGER NOT NULL DEFAULT 0,
  hard_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  soft_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ats_reports TO authenticated;
GRANT ALL ON public.ats_reports TO service_role;
ALTER TABLE public.ats_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ats" ON public.ats_reports FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX ats_user_idx ON public.ats_reports(user_id, created_at DESC);

CREATE TABLE public.github_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  public_repos INTEGER,
  followers INTEGER,
  total_stars INTEGER,
  top_languages JSONB NOT NULL DEFAULT '[]'::jsonb,
  top_repos JSONB NOT NULL DEFAULT '[]'::jsonb,
  commit_activity JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_insights TEXT,
  quality_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.github_reports TO authenticated;
GRANT ALL ON public.github_reports TO service_role;
ALTER TABLE public.github_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own github" ON public.github_reports FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX github_user_idx ON public.github_reports(user_id, created_at DESC);

CREATE TABLE public.skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  frontend INTEGER NOT NULL DEFAULT 0,
  backend INTEGER NOT NULL DEFAULT 0,
  dsa INTEGER NOT NULL DEFAULT 0,
  system_design INTEGER NOT NULL DEFAULT 0,
  database INTEGER NOT NULL DEFAULT 0,
  devops INTEGER NOT NULL DEFAULT 0,
  ai_ml INTEGER NOT NULL DEFAULT 0,
  cloud INTEGER NOT NULL DEFAULT 0,
  composite INTEGER NOT NULL DEFAULT 0,
  strongest TEXT,
  weakest TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_scores TO authenticated;
GRANT ALL ON public.skill_scores TO service_role;
ALTER TABLE public.skill_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own skills" ON public.skill_scores FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.project_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  repo_url TEXT,
  stack TEXT,
  quality INTEGER DEFAULT 0,
  documentation INTEGER DEFAULT 0,
  innovation INTEGER DEFAULT 0,
  scalability INTEGER DEFAULT 0,
  maintainability INTEGER DEFAULT 0,
  security INTEGER DEFAULT 0,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_reports TO authenticated;
GRANT ALL ON public.project_reports TO service_role;
ALTER TABLE public.project_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own projects" ON public.project_reports FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX project_user_idx ON public.project_reports(user_id, created_at DESC);

CREATE TABLE public.generated_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_job TEXT,
  template TEXT NOT NULL DEFAULT 'modern',
  content_markdown TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_resumes TO authenticated;
GRANT ALL ON public.generated_resumes TO service_role;
ALTER TABLE public.generated_resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own generated" ON public.generated_resumes FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX gen_resume_user_idx ON public.generated_resumes(user_id, created_at DESC);

-- =====================================================
-- STORAGE POLICIES for a "resumes" bucket
-- Bucket itself is created via the storage tool separately.
-- Path convention: {user_id}/{uuid}-{filename}
-- =====================================================
CREATE POLICY "resume own read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "resume own write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "resume own update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "resume own delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
