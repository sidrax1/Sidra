import { Badge } from "@/components/ui/Badge";
import type { CampaignStatus } from "@/types/campaign";

interface CampaignStatusBadgeProps {
  readonly status: CampaignStatus;
}

const labels: Record<
  CampaignStatus,
  string
>={
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

export function CampaignStatusBadge({
  status,
}: CampaignStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "active"
     ? "success"
     : status === "scheduled"
       ? "gold"
       : status === "paused"
         ? "warning"
         : status === "archived"
           ? "neutral"
           : "outline";

 return (
   <Badge variant={variant}>
    {labels[status]}
   </Badge>
 );
}
