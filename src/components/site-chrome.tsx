import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md gradient-primary glow-purple" />
          <span className="text-sm font-bold tracking-tight">DevScan AI</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="/#analytics" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Intelligence</a>
          <a href="/#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          <a href="/#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
          <Link to="/signup" className="rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]">
            Get Started Free
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/5 bg-background/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="/#features" className="text-sm text-muted-foreground">Features</a>
            <a href="/#pricing" className="text-sm text-muted-foreground">Pricing</a>
            <a href="/#faq" className="text-sm text-muted-foreground">FAQ</a>
            <Link to="/login" className="text-sm">Log in</Link>
            <Link to="/signup" className="rounded-full gradient-primary px-4 py-2 text-center text-sm font-semibold text-white">
              Get Started Free
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
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded gradient-primary" />
          <span className="text-xs font-semibold">DevScan AI</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Privacy</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Terms</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Status</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Docs</a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 DevScan Technologies</p>
      </div>
    </footer>
  );
}
