import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import handshake from "@/assets/handshake-office.asset.json";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  head: () => ({ meta: [{ title: "Profile Settings — DevScan AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Settings"
      title="Your account."
      description="Profile, integrations, notifications and privacy."
      image={handshake.url}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field l="Full name" v="Alex Rivera" />
            <Field l="Email" v="alex@mit.edu" />
            <Field l="College" v="MIT" />
            <Field l="Graduation" v="2026" />
            <Field l="GitHub" v="alexrivera" />
            <Field l="LinkedIn" v="/in/alexrivera" />
          </div>
          <button className="mt-5 rounded-lg gradient-primary px-5 py-2 text-sm font-semibold text-white glow-purple">Save changes</button>
        </Card>
        <Card title="Notifications">
          <div className="space-y-3">
            {["Weekly profile digest", "New high-match jobs", "Mock interview reminders", "Marketing & product updates"].map((l, i) => (
              <label key={l} className="flex items-center justify-between rounded-lg bg-white/[0.02] p-3 ring-1 ring-white/5">
                <span className="text-sm">{l}</span>
                <input type="checkbox" defaultChecked={i < 3} className="size-4" />
              </label>
            ))}
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}

function Field({ l, v }: { l: string; v: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{l}</label>
      <input defaultValue={v} className="mt-1.5 w-full rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" />
    </div>
  );
}
