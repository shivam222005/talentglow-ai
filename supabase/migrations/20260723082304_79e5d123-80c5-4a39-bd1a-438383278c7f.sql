
-- Security definer helper: is the given user a recruiter?
CREATE OR REPLACE FUNCTION public.is_recruiter(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'recruiter'
  );
$$;

-- Recruiter SELECT policies on candidate signal tables
CREATE POLICY "recruiters read skills"
  ON public.skill_scores FOR SELECT TO authenticated
  USING (public.is_recruiter(auth.uid()));

CREATE POLICY "recruiters read github"
  ON public.github_reports FOR SELECT TO authenticated
  USING (public.is_recruiter(auth.uid()));

CREATE POLICY "recruiters read projects"
  ON public.project_reports FOR SELECT TO authenticated
  USING (public.is_recruiter(auth.uid()));

-- Indexes for ranking and lookups
CREATE INDEX IF NOT EXISTS skill_scores_composite_idx
  ON public.skill_scores (composite DESC);
CREATE INDEX IF NOT EXISTS github_reports_user_created_idx
  ON public.github_reports (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS project_reports_user_created_idx
  ON public.project_reports (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_role_idx
  ON public.profiles (role);
