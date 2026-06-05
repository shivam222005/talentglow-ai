import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md gradient-primary glow-purple" />
          <span className="text-sm font-bold tracking-tight">DevScan AI</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
          <Link to="/auth" className="rounded-full gradient-primary px-4 py-1.5 text-sm font-semibold text-white glow-purple transition-transform hover:scale-[1.03]">
            Get Started
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/5 bg-background/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
                {n.label}
              </Link>
            ))}
            <Link to="/auth" onClick={() => setOpen(false)} className="text-sm">Log in</Link>
            <Link to="/auth" onClick={() => setOpen(false)} className="rounded-full gradient-primary px-4 py-2 text-center text-sm font-semibold text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-background py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md gradient-primary glow-purple" />
            <span className="text-sm font-bold">DevScan AI</span>
          </div>
          <p className="mt-3 max-w-xs text-xs text-muted-foreground">
            Developer portfolio intelligence — resume, GitHub, projects and placement readiness analyzed by AI.
          </p>
        </div>
        <FooterCol title="Product" links={[["Features","/features"],["Solutions","/solutions"],["Pricing","/pricing"]]} />
        <FooterCol title="Company" links={[["About","/about"],["Contact","/contact"],["Careers","/about"]]} />
        <FooterCol title="Account" links={[["Log in","/login"],["Sign up","/signup"],["Student Dashboard","/dashboard"],["Recruiter Portal","/recruiter"]]} />
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-white/5 px-6 pt-6 text-xs text-muted-foreground">
        <span>© 2026 DevScan Technologies</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Status</a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-xs text-muted-foreground hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
