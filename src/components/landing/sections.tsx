import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function TrustedBy() {
  const logos = ["GOOGLE", "MICROSOFT", "AMAZON", "ADOBE", "IBM", "STRIPE"];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        Trusted by technical teams at
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 opacity-50 grayscale">
        {logos.map((l) => (
          <span key={l} className="text-xl font-bold tracking-tight">{l}</span>
        ))}
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Sarah Chen", role: "Head of Talent, Vercel", quote: "DevScan cut our screening time by 70%. We hire 3x faster and the bar is higher than ever.", rating: 5, init: "SC" },
  { name: "Marcus Rivera", role: "Engineering Director, Stripe", quote: "The GitHub intelligence is unreal. We surface senior signals our recruiters used to miss completely.", rating: 5, init: "MR" },
  { name: "Priya Patel", role: "CTO, Linear", quote: "Finally, a hiring tool that understands engineering. Our offers convert at 89% now.", rating: 5, init: "PP" },
  { name: "Jonas Müller", role: "VP People, Framer", quote: "The candidate ranking is freakishly accurate. Our last 6 hires all came from the top 10 ranked profiles.", rating: 5, init: "JM" },
];

export function Testimonials() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-purple">Loved by teams</span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            Built for the world's best engineering orgs.
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl glass p-8 ring-1 ring-white/5"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="size-3.5 fill-accent-purple text-accent-purple" />
                ))}
              </div>
              <p className="mt-4 text-lg leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
                  {t.init}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Free", price: "$0", suf: "/mo", desc: "For individual developers",
    cta: "Get Started", featured: false,
    feats: ["5 scans per month", "Basic GitHub summary", "PDF reports", "Resume parsing", "Community support"],
  },
  {
    name: "Pro", price: "$49", suf: "/mo", desc: "For growing recruiting teams",
    cta: "Start free trial", featured: true,
    feats: ["Unlimited scans", "Deep repo analysis", "AI career chatbot", "Candidate ranking", "Priority support", "Custom branding"],
  },
  {
    name: "Enterprise", price: "Custom", suf: "", desc: "For scale orgs",
    cta: "Contact Sales", featured: false,
    feats: ["SSO & SCIM", "Custom ML models", "White-label portal", "Dedicated CSM", "SLA & security review", "API access"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">Pricing</span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            Ready to optimize your pipeline?
          </h2>
          <p className="mt-4 text-muted-foreground">Simple, transparent pricing for teams of every size.</p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-8 ${
                p.featured
                  ? "glass-strong ring-2 ring-accent-purple/40 glow-purple"
                  : "glass ring-1 ring-white/5"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}
              <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gradient">{p.price}</span>
                <span className="text-muted-foreground">{p.suf}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-8 space-y-3">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-accent-green" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-10 block rounded-full py-3 text-center text-sm font-semibold transition-all ${
                  p.featured
                    ? "gradient-primary text-white hover:scale-[1.02]"
                    : "bg-white/5 text-foreground ring-1 ring-white/10 hover:bg-white/10"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "How does DevScan AI analyze GitHub profiles?", a: "We connect to the GitHub API and run static analysis on repos: commit cadence, code quality, language depth, project structure, documentation, and collaboration signals — all condensed into an objective score." },
  { q: "Is my data secure?", a: "Yes. SOC2 Type II, encryption at rest and in transit, and we never train models on candidate PII. Enterprise plans include private deployment options." },
  { q: "Can I cancel anytime?", a: "Absolutely. No contracts on Free or Pro. Enterprise plans are annual with flexible exit terms." },
  { q: "Does the platform support students and entry-level devs?", a: "Yes — Placement Readiness Predictor is built specifically for students to assess gaps and generate a personalized roadmap." },
  { q: "What integrations are supported?", a: "GitHub, GitLab, Bitbucket, Greenhouse, Lever, Workday, Slack, Linear, and over 30 ATS systems." },
  { q: "How accurate is the AI scoring?", a: "Our scoring engine is benchmarked at 94% correlation with senior-engineer manual review across 50,000+ profiles." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan">FAQ</span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            Questions, answered.
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-xl glass ring-1 ring-white/5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-semibold">{f.q}</span>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="px-6 py-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl glass-strong p-16 text-center ring-1 ring-white/10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.7_0.22_295/0.3),transparent_70%)]" />
        <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
          Start hiring smarter today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join 500+ engineering teams using DevScan AI to find their next great hire.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-white glow-purple hover:scale-[1.03] transition-transform">
            Get Started Free
          </Link>
          <Link to="/login" className="rounded-full glass px-6 py-3 text-sm font-semibold">
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
