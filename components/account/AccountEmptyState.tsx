import type {
  ReactNode,
} from "react";
import {
  Gem,
} from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";

interface AccountEmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}

export function AccountEmptyState({
  action,
  description,
  title,
}: AccountEmptyStateProps): React.JSX.Element {
  return (
    <EmptyState
      icon={
        <Gem
          aria-hidden={true}
          className="size-7"
        />
      }
      title={title}
      description={description}
      action={action}
    />
  );
}
