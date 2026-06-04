import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { PublicSection } from "@/components/dashboard/page-scaffold";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import clipboard from "@/assets/clipboard-handoff.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DevScan AI" },
      { name: "description", content: "Talk to our team about campus pilots, enterprise deals, or partnership." },
      { property: "og:title", content: "Contact — DevScan AI" },
      { property: "og:description", content: "Reach the DevScan AI team." },
      { property: "og:url", content: "/contact" },
      { property: "og:image", content: clipboard.url },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <PublicSection eyebrow="Contact" title="Let's talk." lead="Pilot, partnership, or just questions — we read every message." image={clipboard.url}>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_1.4fr]">
            <div className="space-y-6">
              {[
                { i: Mail, l: "Email", v: "hello@devscan.ai" },
                { i: Phone, l: "Phone", v: "+1 (415) 555-0142" },
                { i: MapPin, l: "HQ", v: "San Francisco · Bengaluru · Berlin" },
              ].map((c) => (
                <div key={c.l} className="rounded-2xl glass p-5 ring-1 ring-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-purple"><c.i className="size-4" /></div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.l}</div>
                      <div className="text-sm font-semibold">{c.v}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="rounded-2xl glass-strong p-8 ring-1 ring-white/10"
            >
              {sent ? (
                <div className="py-16 text-center">
                  <div className="text-5xl">✦</div>
                  <h3 className="mt-3 text-xl font-semibold">Message received.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">We'll reply within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">Send us a message</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Input label="Full name" placeholder="Alex Rivera" />
                    <Input label="Work email" type="email" placeholder="you@company.com" />
                  </div>
                  <div className="mt-4">
                    <Input label="Company / Institution" placeholder="MIT" />
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-muted-foreground">Message</label>
                    <textarea required rows={5} placeholder="How can we help?" className="mt-1.5 w-full rounded-lg bg-white/5 px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/50" />
                  </div>
                  <button type="submit" className="mt-6 w-full rounded-lg gradient-primary py-2.5 text-sm font-semibold text-white glow-purple">
                    Send message
                  </button>
                </>
              )}
            </form>
          </div>
        </PublicSection>
      </main>
      <SiteFooter />
    </div>
  );
}

function Input({ label, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input required {...p} className="mt-1.5 w-full rounded-lg bg-white/5 px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/50" />
    </div>
  );
}
