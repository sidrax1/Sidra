import type {
  ReactNode,
} from "react";
import {
  FileSearch,
} from "lucide-react";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

interface ServicePartnerApplicationEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export function ServicePartnerApplicationEmptyState({
  action,
  description = "Submitted service-partner applications and verification reviews will appear here.",
  title = "No service partner applications",
}: ServicePartnerApplicationEmptyStateProps): React.JSX.Element {
  return (
    <EmptyState
      icon={
        <FileSearch
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
