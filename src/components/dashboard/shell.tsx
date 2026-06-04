import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, Github, Brain, Target, FolderGit2, Calendar, Map,
  FileEdit, Mic, Sparkles, Briefcase, GraduationCap, Settings,
  Users, ListOrdered, GitCompare, BarChart3, FileDown,
  Bell, Search, LogOut,
} from "lucide-react";
import type { ReactNode } from "react";

const STUDENT_NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/resume", icon: FileText, label: "Resume Analyzer" },
  { to: "/dashboard/github", icon: Github, label: "GitHub Intelligence" },
  { to: "/dashboard/skills", icon: Brain, label: "Skill Intelligence" },
  { to: "/dashboard/placement", icon: Target, label: "Placement Readiness" },
  { to: "/dashboard/projects", icon: FolderGit2, label: "Project Analyzer" },
  { to: "/dashboard/interviews", icon: Calendar, label: "Interview Tracker" },
  { to: "/dashboard/roadmap", icon: Map, label: "Learning Roadmap" },
  { to: "/dashboard/resume-builder", icon: FileEdit, label: "Resume Builder" },
  { to: "/dashboard/mock-interview", icon: Mic, label: "Mock Interview" },
  { to: "/dashboard/assistant", icon: Sparkles, label: "AI Career Assistant" },
  { to: "/dashboard/jobs", icon: Briefcase, label: "Job Matches" },
  { to: "/dashboard/internships", icon: GraduationCap, label: "Internships" },
  { to: "/dashboard/settings", icon: Settings, label: "Profile Settings" },
];

const RECRUITER_NAV = [
  { to: "/recruiter", icon: LayoutDashboard, label: "Overview" },
  { to: "/recruiter/candidates", icon: Users, label: "Candidate Search" },
  { to: "/recruiter/ranking", icon: ListOrdered, label: "Ranking" },
  { to: "/recruiter/compare", icon: GitCompare, label: "Comparison" },
  { to: "/recruiter/analytics", icon: BarChart3, label: "Hiring Analytics" },
  { to: "/recruiter/reports", icon: FileDown, label: "Reports & Exports" },
];

export function DashboardShell({ role, children }: { role: "student" | "recruiter"; children?: ReactNode }) {
  const nav = role === "student" ? STUDENT_NAV : RECRUITER_NAV;
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed top-0 left-1/3 -z-10 h-[500px] w-[800px] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_295/0.08),transparent_60%)] blur-3xl" />
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-white/5 bg-background/60 p-5 backdrop-blur-xl lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 rounded-md gradient-primary glow-purple" />
            <span className="text-sm font-bold">DevScan AI</span>
          </Link>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {role === "student" ? "Student workspace" : "Recruiter workspace"}
          </div>
          <nav className="mt-4 space-y-0.5">
            {nav.map((n) => {
              const root = role === "student" ? "/dashboard" : "/recruiter";
              const isActive = n.to === root ? path === root : path === n.to || path.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to} to={n.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-accent-purple/15 text-foreground ring-1 ring-accent-purple/30" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <n.icon className="size-4 shrink-0" />
                  <span className="truncate">{n.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-lg glass p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">AR</div>
              <div className="flex-1 text-xs">
                <div className="font-semibold">Alex Rivera</div>
                <div className="text-muted-foreground">Pro plan</div>
              </div>
              <Link to="/login" className="text-muted-foreground hover:text-foreground" aria-label="Sign out"><LogOut className="size-4" /></Link>
            </div>
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <Link to="/dashboard" className={`flex-1 rounded-md px-2 py-1 text-center ${role === "student" ? "bg-accent-purple/20 text-accent-purple" : "bg-white/5 hover:bg-white/10"}`}>Student</Link>
            <Link to="/recruiter" className={`flex-1 rounded-md px-2 py-1 text-center ${role === "recruiter" ? "bg-accent-purple/20 text-accent-purple" : "bg-white/5 hover:bg-white/10"}`}>Recruiter</Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-background/70 px-6 backdrop-blur-xl">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder={role === "student" ? "Search skills, jobs, courses..." : "Search candidates, roles, stacks..."}
                className="w-full rounded-lg bg-white/5 px-9 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40"
              />
            </div>
            <button className="relative rounded-lg bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent-purple" />
            </button>
            <div className="flex size-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">AR</div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
