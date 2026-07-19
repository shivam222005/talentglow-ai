import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shell";
import { MessagesView } from "@/components/chat/messages-view";

export const Route = createFileRoute("/_authenticated/dashboard/messages")({
  head: () => ({ meta: [{ title: "Messages — DevScan AI" }] }),
  component: () => (
    <DashboardShell role="student">
      <MessagesView role="student" />
    </DashboardShell>
  ),
});
