import type {
  ReactNode,
} from "react";
import {
  ClipboardCheck,
} from "lucide-react";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

interface ServicePartnerAssignmentEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export function ServicePartnerAssignmentEmptyState({
  action,
  description = "Warranty, repair, inspection, logistics and quality-audit assignments will appear here.",
  title = "No service assignments",
}: ServicePartnerAssignmentEmptyStateProps): React.JSX.Element {
  return (
    <EmptyState
      icon={
        <ClipboardCheck
          aria-hidden="true"
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
