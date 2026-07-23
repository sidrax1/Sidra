import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/EmptyState";

interface AdminEmptyStateProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}

export function AdminEmptyState({
  action,
  description,
  icon: Icon,
  title,
}: AdminEmptyStateProps): React.JSX.Element {
  return (
    <EmptyState
      title={title}
      description={description}
      action={action}
      icon={<Icon aria-hidden="true" className="size-6" />}
    />
  );
}
