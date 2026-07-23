import { Badge } from "@/components/ui/Badge";
import type { SupportTicketStatus } from "@/types/support";

interface SupportTicketStatusBadgeProps {
  readonly status: SupportTicketStatus;
}

const labels: Record<SupportTicketStatus, string> = {
  open: "Open",
  inProgress: "In Progress",
  waitingForCustomer: "Waiting for Customer",
  resolved: "Resolved",
  closed: "Closed",
};

export function SupportTicketStatusBadge({
  status,
}: SupportTicketStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "resolved" || status === "closed"
     ? "success"
     : status === "open"
       ? "warning"
       : "gold";

 return <Badge variant={variant}>{labels[status]}</Badge>;
}
