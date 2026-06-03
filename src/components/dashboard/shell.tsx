import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, FileText, BookOpen, Calendar, Briefcase, Bell, Search, LogOut } from "lucide-react";
import type { ReactNode } from "react";

export function DashboardShell({ role, children }: { role: "student" | "recruiter"; children?: ReactNode }) {
  const studentNav = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/dashboard/resume", icon: FileText, label: "Resume Analysis" },
    { to: "/dashboard/github", icon: BookOpen, label: "GitHub Insights" },
    { to: "/dashboard/roadmap", icon: Calendar, label: "Learning Roadmap" },
    { to: "/dashboard/interviews", icon: Briefcase, label: "Interview Tracker" },
  ];
  const recruiterNav = [
    { to: "/recruiter", icon: LayoutDashboard, label: "Overview" },
    { to: "/recruiter/candidates", icon: Users, label: "Candidates" },
    { to: "/recruiter/pipeline", icon: Briefcase, label: "Pipeline" },
  ];
  const nav = role === "student" ? studentNav : recruiterNav;
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed top-0 left-1/3 -z-10 h-[500px] w-[800px] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_295/0.08),transparent_60%)] blur-3xl" />
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 flex-col border-r border-white/5 bg-background/60 backdrop-blur-xl p-5 lg:flex">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 rounded-md gradient-primary glow-purple" />
            <span className="text-sm font-bold">DevScan AI</span>
          </Link>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {role === "student" ? "Student" : "Recruiter"}
          </div>
          <nav className="mt-4 space-y-1">
            {nav.map((n) => {
              const active = path === n.to || (n.to !== "/dashboard" && n.to !== "/recruiter" && path.startsWith(n.to));
              const isHome = (role === "student" && n.to === "/dashboard" && path === "/dashboard") ||
                             (role === "recruiter" && n.to === "/recruiter" && path === "/recruiter");
              const isActive = active || isHome;
              return (
                <Link
                  key={n.to} to={n.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-accent-purple/15 text-foreground ring-1 ring-accent-purple/30" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-lg glass p-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">AR</div>
              <div className="flex-1 text-xs">
                <div className="font-semibold">Alex Rivera</div>
                <div className="text-muted-foreground">Pro plan</div>
              </div>
              <Link to="/" className="text-muted-foreground hover:text-foreground"><LogOut className="size-4" /></Link>
            </div>
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <Link to="/dashboard" className="flex-1 rounded-md bg-white/5 px-2 py-1 text-center hover:bg-white/10">Student</Link>
            <Link to="/recruiter" className="flex-1 rounded-md bg-white/5 px-2 py-1 text-center hover:bg-white/10">Recruiter</Link>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-background/70 px-6 backdrop-blur-xl">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search candidates, repos, skills..."
                className="w-full rounded-lg bg-white/5 px-9 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40"
              />
            </div>
            <button className="relative rounded-lg bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent-purple" />
            </button>
          </header>
          <main className="p-6 lg:p-10">{children ?? <Outlet />}</main>
        </div>
      </div>
    </div>
  );
}
