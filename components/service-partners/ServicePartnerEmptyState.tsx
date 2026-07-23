import type {
  ReactNode,
} from "react";
import {
  Building2,
} from "lucide-react";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

interface ServicePartnerEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export function ServicePartnerEmptyState({
  action,
  description = "Verified repair, inspection, restoration and logistics partners will appear here.",
  title = "No service partners found",
}: ServicePartnerEmptyStateProps): React.JSX.Element {
  return (
    <EmptyState
      icon={
        <Building2
          aria-hidden={true}
          className="size-10"
        />
      }
      title={title}
      description={
        description
      }
      action={action}
    />
  );
}
