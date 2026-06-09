# DevScan AI — Developer Portfolio Intelligence

AI-powered resume, GitHub, and project analysis for students, developers, and recruiters.

## Overview

DevScan AI helps developers understand and improve their portfolio through automated analysis of resumes, GitHub activity, and coding projects. It provides actionable insights, skill gap identification, personalized learning roadmaps, and interview preparation tools.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, SSR/SSG) |
| Styling | Tailwind CSS v4 with custom OKLCH design tokens |
| UI Components | Radix UI primitives + custom shadcn-style components |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Backend | Lovable Cloud / Supabase (PostgreSQL + RLS) |
| Charts | Recharts (skill radar, GitHub activity, contribution heatmaps) |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod validation |
| Icons | Lucide React |

## Features

### Landing Page
- Hero with animated stats and value proposition
- Feature sections: AI Resume Analysis, GitHub Insights, Project Scoring, Interview Prep
- Live analytics demo, testimonials, pricing tiers, FAQ, and CTA

### Authentication
- **Email/password** sign-up and login with validation
- **Google OAuth** one-click sign-in
- Password strength meter on sign-up
- Session persistence across page refreshes
- Graceful error handling with user-friendly messages

### Student Dashboard (Dark Theme)
- **Resume Score** — ATS compatibility, formatting, keyword analysis
- **Skill Radar** — interactive radar chart of technical strengths
- **GitHub Activity** — commit history, repo stats, contribution heatmap
- **Project Analyzer** — code quality, documentation, innovation scoring
- **Learning Roadmap** — personalized weekly study plans
- **Interview Tracker** — application pipeline and upcoming interviews

### Recruiter Portal
- Candidate ranking, resume comparison, analytics reports

## Project Structure

```
src/
├── routes/                  # TanStack file-based routes
│   ├── index.tsx            # Landing page
│   ├── auth.tsx             # Sign in / Sign up page
│   ├── dashboard.tsx        # Student dashboard (client-only, SSR disabled)
│   ├── dashboard.*.tsx      # Dashboard sub-pages
│   ├── recruiter.tsx        # Recruiter dashboard (client-only)
│   └── ...
├── components/
│   ├── landing/             # Hero, features, analytics, sections
│   ├── dashboard/           # Shell, navigation, page scaffold
│   ├── ui/                  # Reusable UI primitives
│   └── site-chrome.tsx      # Nav + Footer
├── integrations/
│   ├── supabase/            # Auth clients, middleware, attacher
│   └── lovable/             # Lovable Cloud auth helpers
├── lib/                     # Utilities, API functions, config
├── hooks/                   # Custom React hooks
├── assets/                  # Generated AI images (JSON metadata)
└── styles.css               # Global styles, Tailwind theme, utilities
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+)
- A Supabase project (for auth and database)

### Installation

```bash
# Install dependencies
bun install

# Configure environment variables
cp .env .env.local
# Edit .env.local with your Supabase credentials:
#   VITE_SUPABASE_URL=
#   VITE_SUPABASE_PUBLISHABLE_KEY=
```

### Development

```bash
# Start the dev server
bun run dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
# Production build
bun run build

# Development build (with SSR)
bun run build:dev
```

## Authentication

Auth is handled via Supabase with the following flow:

1. **Sign Up** — `supabase.auth.signUp()` with email/password, stores `full_name` in user metadata
2. **Sign In** — `supabase.auth.signInWithPassword()`
3. **Google OAuth** — `lovable.auth.signInWithOAuth("google")` with redirect to origin
4. **Session** — Supabase `onAuthStateChange` listener handles redirects to `/dashboard`
5. **Sign Out** — `supabase.auth.signOut()` + navigate to `/auth`

The `attachSupabaseAuth` middleware ensures bearer tokens are attached to all server function calls.

## Design System

- **Dark dashboard** — Deep zinc background (`oklch(0.145 0.005 285)`) with purple/blue/cyan/green accents
- **Light auth pages** — Clean SaaS aesthetic with blue gradients
- **Glassmorphism** — `glass` and `light-glass` utility classes for elevated surfaces
- **Custom utilities** — `gradient-primary`, `glow-purple`, `text-gradient`, `animate-float`

## License

Private — All rights reserved.
