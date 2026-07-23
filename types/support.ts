import type { BaseEntity } from "@/types/common";

export type SupportTicketPriority =
 | "low"
 | "normal"
 | "high"
 | "urgent";

export type SupportTicketStatus =
 | "open"
 | "inProgress"
 | "waitingForCustomer"
 | "resolved"
 | "closed";

export interface SupportTicket extends BaseEntity {
 readonly ticketNumber: string;
 readonly requesterId: string;
 readonly requesterEmail: string;
 readonly subject: string;
 readonly category:
  | "account"
  | "order"
  | "payment"

  | "product"
  | "studio"
  | "customOrder"
  | "technical"
  | "other";
 readonly description: string;
 readonly priority: SupportTicketPriority;
 readonly status: SupportTicketStatus;
 readonly assignedTo?: string;
 readonly orderId?: string;
 readonly studioId?: string;
 readonly resolvedAt?: string;
 readonly closedAt?: string;
}
