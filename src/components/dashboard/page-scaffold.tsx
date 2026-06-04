import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { DashboardShell } from "./shell";

export function FeaturePage({
  role, eyebrow, title, description, image, stats, children,
}: {
  role: "student" | "recruiter";
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  stats?: { label: string; value: string; trend?: string }[];
  children?: ReactNode;
}) {
  return (
    <DashboardShell role={role}>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl glass-strong p-8 ring-1 ring-white/10">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">{eyebrow}</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">{description}</p>
          {stats && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-2xl font-bold">{s.value}</div>
                  {s.trend && <div className="text-xs text-accent-green">{s.trend}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        {image && (
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
            <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-background/20 to-transparent" />
          </div>
        )}
      </div>
      <div className="mt-8">{children}</div>
    </DashboardShell>
  );
}

export function Card({ title, subtitle, icon: Icon, children, className = "" }: {
  title?: string; subtitle?: string; icon?: LucideIcon; children?: ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl glass p-6 ring-1 ring-white/5 ${className}`}>
      {(title || Icon) && (
        <div className="mb-4 flex items-center gap-3">
          {Icon && <div className="flex size-9 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-purple"><Icon className="size-4" /></div>}
          <div>
            {title && <h3 className="text-sm font-semibold">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function Progress({ label, value, accent = "purple" }: { label: string; value: number; accent?: "purple" | "blue" | "green" }) {
  const color = accent === "blue" ? "bg-accent-blue" : accent === "green" ? "bg-accent-green" : "bg-accent-purple";
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export function PublicSection({ eyebrow, title, lead, image, children }: {
  eyebrow?: string; title: string; lead?: string; image?: string; children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {image && (
        <div className="mb-12 relative overflow-hidden rounded-3xl ring-1 ring-white/10">
          <img src={image} alt={title} className="h-72 w-full object-cover md:h-96" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            {eyebrow && <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">{eyebrow}</span>}
            <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            {lead && <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">{lead}</p>}
          </div>
        </div>
      )}
      {!image && (
        <div className="mb-12 text-center">
          {eyebrow && <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">{eyebrow}</span>}
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {lead && <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{lead}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
