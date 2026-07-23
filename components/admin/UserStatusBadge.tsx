import { Badge } from "@/components/ui/Badge";
import type { User } from "@/types/user";

interface UserStatusBadgeProps {
  readonly status: User["status"];
}

const labels: Record<User["status"], string> = {
  active: "Active",
  suspended: "Suspended",
  blocked: "Blocked",
  pending: "Pending",
};

export function UserStatusBadge({
  status,
}: UserStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "active"
     ? "success"
     : status === "suspended"
       ? "warning"
       : status === "blocked"
         ? "error"
         : "neutral";

  return <Badge variant={variant}>{labels[status]}</Badge>;
}
