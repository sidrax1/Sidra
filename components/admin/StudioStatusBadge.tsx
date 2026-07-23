import { Badge } from "@/components/ui/Badge";

export type AdminStudioStatus =
 | "active"
 | "suspended"
 | "closed"
 | "pending";

interface StudioStatusBadgeProps {
  readonly status: AdminStudioStatus;
}

const labels: Record<AdminStudioStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  closed: "Closed",
  pending: "Pending",
};

export function StudioStatusBadge({
  status,
}: StudioStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "active"

    ? "success"
    : status === "suspended"
      ? "warning"
      : status === "closed"
        ? "error"
        : "neutral";

  return <Badge variant={variant}>{labels[status]}</Badge>;
}
