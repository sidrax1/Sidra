"use client";

import {
  ArrowRight,
  CalendarClock,
  MessageCircle,
} from "lucide-react";

import {
  SupportPriorityBadge,
} from "@/components/support/SupportPriorityBadge";
import {
  SupportTicketStatusBadge,
} from "@/components/support/SupportTicketStatusBadge";
import {
  Button,
} from "@/components/ui/Button";
import {
  Card,
} from "@/components/ui/Card";
import {
  formatDateTime,
} from "@/lib/date";
import type {

  SupportTicket,
} from "@/types/support";

interface SupportTicketCardProps {
  readonly ticket: SupportTicket;
  readonly onView: (
    ticket: SupportTicket
  ) => void;
}

export function SupportTicketCard({
  onView,
  ticket,
}: SupportTicketCardProps): React.JSX.Element {
  return (
    <Card className="p-6">
     <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]
text-foreground">
           {ticket.subject}
          </h3>

       <SupportTicketStatusBadge
        status={ticket.status}
       />

       <SupportPriorityBadge
        priority={ticket.priority}
       />
      </div>

      <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-7 text-muted">
       {ticket.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
       <span className="inline-flex items-center gap-2">
        <MessageCircle
          aria-hidden={true}
          className="size-3.5"
        />
        Ticket #{ticket.ticketNumber}

        </span>

        <span className="inline-flex items-center gap-2">
         <CalendarClock
           aria-hidden={true}
           className="size-3.5"
         />
         Updated{" "}
         {formatDateTime(
           ticket.updatedAt
         )}
        </span>

        <span>
          Category: {ticket.category}
        </span>
       </div>
      </div>

     <Button
      variant="outline"
      className="shrink-0"
      onClick={() =>
        onView(ticket)
      }
     >
      Open Ticket
      <ArrowRight
        aria-hidden={true}
        className="size-4"
      />
     </Button>
    </div>
   </Card>
 );
}
