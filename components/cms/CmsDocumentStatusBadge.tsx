import { Badge } from "@/components/ui/Badge";
import type { CmsDocumentStatus } from "@/types/cms";

interface CmsDocumentStatusBadgeProps {

    readonly status: CmsDocumentStatus;
}

const labels: Record<CmsDocumentStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

export function CmsDocumentStatusBadge({
  status,
}: CmsDocumentStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "published"
     ? "success"
     : status === "scheduled"
       ? "gold"
       : status === "archived"
         ? "neutral"
         : "warning";

    return (
      <Badge variant={variant}>
       {labels[status]}
      </Badge>
    );
}
