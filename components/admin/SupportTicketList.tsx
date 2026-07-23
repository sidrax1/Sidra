import type { ReactNode } from "react";

import { SupportTicketCard } from "@/components/admin/SupportTicketCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SupportTicket } from "@/types/support";

interface SupportTicketListProps {
  readonly tickets: readonly SupportTicket[];
  readonly emptyAction?: ReactNode;
  readonly onView: (ticket: SupportTicket) => void;
}

export function SupportTicketList({
  emptyAction,
  onView,
  tickets,
}: SupportTicketListProps): React.JSX.Element {
  if (tickets.length === 0) {
    return (
      <EmptyState
        title="Support queue is clear"
        description="No support requests match the selected filters."
        action={emptyAction}
      />
    );
  }

 return (
  <div className="grid gap-4">
    {tickets.map((ticket) => (
      <SupportTicketCard

        key={ticket.id}
        ticket={ticket}
        onView={onView}
      />
    ))}
   </div>
 );
}
