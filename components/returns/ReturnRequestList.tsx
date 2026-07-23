import type { ReactNode } from "react";

import { ReturnRequestCard } from "@/components/returns/ReturnRequestCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ReturnRequest } from "@/types/return";

interface ReturnRequestListProps {
  readonly requests: readonly ReturnRequest[];
  readonly emptyAction?: ReactNode;
  readonly getHref?: (request: ReturnRequest) => string;
}

export function ReturnRequestList({
  emptyAction,
  getHref,
  requests,
}: ReturnRequestListProps): React.JSX.Element {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No return requests"
        description="Approved return, replacement and refund workflows will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Return requests"
      className="grid gap-5"
    >
      {requests.map((request) => (
        <ReturnRequestCard
          key={request.id}
          request={request}
          href={getHref?.(request)}
        />
      ))}
    </section>
  );
}
