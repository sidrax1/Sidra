import { Badge } from "@/components/ui/Badge";

export type SellerProductStatus =
 | "draft"
 | "pendingReview"
 | "active"
 | "rejected"
 | "archived"
 | "soldOut";

interface ProductStatusBadgeProps {

    readonly status: SellerProductStatus;
}

const labels: Record<SellerProductStatus, string> = {
  draft: "Draft",
  pendingReview: "Pending Review",
  active: "Live",
  rejected: "Rejected",
  archived: "Archived",
  soldOut: "Sold Out",
};

export function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "active"
     ? "success"
     : status === "pendingReview"
       ? "warning"
       : status === "rejected"
         ? "error"
         : status === "soldOut"
           ? "neutral"
           : "outline";

    return (
      <Badge variant={variant}>
       {labels[status]}
      </Badge>
    );
}
