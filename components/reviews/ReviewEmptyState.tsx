import type {
  ReactNode,
} from "react";
import {
  MessageSquareText,
  Star,
} from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";

interface ReviewEmptyStateProps {
  readonly filtered?: boolean;
  readonly action?: ReactNode;
}

export function ReviewEmptyState({
  action,
  filtered = false,
}: ReviewEmptyStateProps): React.JSX.Element {
  return (
    <EmptyState
      icon={
        filtered ? (
          <MessageSquareText
            aria-hidden={true}
            className="size-7"
          />
        ) : (
          <Star
            aria-hidden={true}
            className="size-7"
          />
        )
      }
      title={
        filtered
          ? "No matching reviews"
          : "No verified reviews yet"
      }
      description={
        filtered
          ? "Adjust the selected filters to discover more collector experiences."
          : "Verified collector experiences will appear after completed orders."
      }
      action={action}
    />
  );
}
