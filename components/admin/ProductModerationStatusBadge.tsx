import { Badge } from "@/components/ui/Badge";

export type ProductModerationStatus =
 | "pending"

 | "approved"
 | "rejected"
 | "archived";

interface ProductModerationStatusBadgeProps {
  readonly status: ProductModerationStatus;
}

const labels: Record<ProductModerationStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

export function ProductModerationStatusBadge({
  status,
}: ProductModerationStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "approved"
     ? "success"
     : status === "rejected"
       ? "error"
       : status === "pending"
         ? "warning"
         : "neutral";

 return <Badge variant={variant}>{labels[status]}</Badge>;
}
