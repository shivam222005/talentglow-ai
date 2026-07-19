## Pack 1 — Auth Hardening & Foundations (this turn)

**Deliverables**
- Add "Forgot password?" link on `/auth` → sends reset email via `supabase.auth.resetPasswordForEmail` with `redirectTo` = `${origin}/reset-password`.
- Create public route `/reset-password` that reads the recovery token from URL hash, shows a "Set new password" form with confirm field + strength check, calls `supabase.auth.updateUser({ password })`, then redirects to `/dashboard`.
- Scaffold auth email templates (Lovable-managed) so the reset email is branded — includes calling `email_domain--check_email_domain_status` first; if no email domain, show setup dialog and stop.
- Fix session persistence + protected-route gating:
  - Move `/dashboard/*` and `/recruiter/*` under `src/routes/_authenticated/` so the integration-managed gate redirects unauthenticated users to `/auth` (currently every dashboard route is publicly reachable).
  - Root `onAuthStateChange` listener with filter (SIGNED_IN / SIGNED_OUT / USER_UPDATED) → `router.invalidate()` + `queryClient.invalidateQueries()` so the header reflects session state.
- Sign-out hygiene: `cancelQueries → clear → signOut → navigate('/auth', {replace:true})` from the dashboard shell.
- Redirect-back after login: preserve `?redirect=` on `/auth` and honor it post-signin (both password + Google).
- Fix Google `redirect_uri` to `window.location.origin` (never a protected path) and store intended dest separately.
- Add roles: create `app_role` enum + `user_roles` table + `has_role()` security-definer function (via migration, with GRANTs). Seed no rows — you promote your account manually after.
- Global error/loading polish: ensure every route with a loader has `errorComponent` + `notFoundComponent` (already wired defaults in `router.tsx`, verify no gaps).

**Out of scope this pack** (queued for later packs, one per turn):
- Pack 2 — Student features audit (resume, github, skills, projects, roadmap, interviews, jobs, internships, placement, resume-builder, mock-interview, assistant, settings): fix broken CRUD, wire empty states, remove mock data, add validation + loading.
- Pack 3 — Recruiter features (candidates, ranking, compare, analytics, reports, messages): real Supabase queries against student data, filters, search, pagination.
- Pack 4 — Chat & Notifications: verify realtime, typing/read receipts, unread counts, block/report flows.
- Pack 5 — Minimal Admin (`/admin/users`): list users, promote/demote role, disable — gated by `has_role('admin')`.
- Pack 6 — Perf, mobile, a11y, dead-code cleanup, security scan pass.

**Technical notes**
- New file: `src/routes/reset-password.tsx` (public, SSR ok, reads `#access_token`/`type=recovery` from hash).
- Move existing files: `src/routes/dashboard*.tsx` → `src/routes/_authenticated/dashboard*.tsx`; same for `recruiter*.tsx`. Update any internal `Link to` — TS will surface mismatches.
- Migration adds: `app_role` enum, `user_roles` table with `(user_id, role)` unique, GRANTs (`authenticated` SELECT, `service_role` ALL), RLS + `has_role(_user_id uuid, _role app_role)` SECURITY DEFINER.
- `src/routes/auth.tsx`: add forgot-password mode toggle, wire `redirect` search param, ensure Google `redirect_uri = window.location.origin`.
- Dashboard shell logout replaces current `<Link>` icon (if still stale) with the 4-step signOut handler.

Each subsequent pack is one turn; I'll pause and wait for your ✅ before starting the next.