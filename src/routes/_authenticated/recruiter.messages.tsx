import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shell";
import { MessagesView } from "@/components/chat/messages-view";

export const Route = createFileRoute("/_authenticated/recruiter/messages")({
  head: () => ({ meta: [{ title: "Messages — DevScan AI" }] }),
  component: () => (
    <DashboardShell role="recruiter">
      <MessagesView role="recruiter" />
    </DashboardShell>
  ),
});
