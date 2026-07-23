import { Badge } from "@/components/ui/Badge";
import type { SellerApplicationStatus } from "@/types/seller-application";

interface SellerApplicationStatusBadgeProps {
  readonly status: SellerApplicationStatus;
}

const labels: Record<SellerApplicationStatus, string> = {
  pending: "Pending",
  underReview: "Under Review",
  moreInfoRequested: "More Information",
  held: "On Hold",
  approved: "Approved",
  rejected: "Rejected",
};

export function SellerApplicationStatusBadge({
  status,
}: SellerApplicationStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "approved"
     ? "success"
     : status === "rejected"
       ? "error"
       : status === "pending" || status === "held"
         ? "warning"
         : "gold";

    return <Badge variant={variant}>{labels[status]}</Badge>;
}
