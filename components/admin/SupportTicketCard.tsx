"use client";

import {
  ArrowRight,
  Clock3,
  Mail,
  MessageSquareWarning,
} from "lucide-react";

import { SupportTicketStatusBadge } from "@/components/admin/SupportTicketStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/date";
import type { SupportTicket } from "@/types/support";

interface SupportTicketCardProps {
  readonly ticket: SupportTicket;
  readonly onView: (ticket: SupportTicket) => void;
}

export function SupportTicketCard({
  onView,
  ticket,
}: SupportTicketCardProps): React.JSX.Element {
  const priorityVariant =
    ticket.priority === "urgent"
      ? "error"
      : ticket.priority === "high"
        ? "warning"
        : "neutral";

 return (
   <Card className="p-6">
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex min-w-0 items-start gap-4">
       <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
        <MessageSquareWarning

   aria-hidden={true}
   className="size-5"
  />
 </span>

 <div className="min-w-0">
  <div className="flex flex-wrap items-center gap-3">
   <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]">
     {ticket.subject}
   </h3>

   <SupportTicketStatusBadge status={ticket.status} />

   <Badge variant={priorityVariant}>
    {ticket.priority}
   </Badge>
  </div>

  <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-muted">
   {ticket.description}
  </p>

  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
   <span className="inline-flex items-center gap-2">
    <Mail aria-hidden={true} className="size-3.5" />
    {ticket.requesterEmail}
   </span>

   <span className="inline-flex items-center gap-2">
    <Clock3 aria-hidden={true} className="size-3.5" />
    {formatDateTime(ticket.createdAt)}
   </span>

    <span>#{ticket.ticketNumber}</span>
  </div>
 </div>
</div>

<Button
 variant="outline"
 className="shrink-0"
 onClick={() => onView(ticket)}
>
 Open Ticket

      <ArrowRight aria-hidden={true} className="size-4" />
     </Button>
    </div>
   </Card>
 );
}
