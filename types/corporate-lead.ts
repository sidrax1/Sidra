import type { BaseEntity } from "@/types/common";

export type CorporateLeadStatus =
 | "new"
 | "contacted"

 | "qualified"
 | "proposalSent"
 | "won"
 | "lost";

export interface CorporateLead extends BaseEntity {
  readonly companyName: string;
  readonly contactName: string;
  readonly email: string;
  readonly phone: string;
  readonly city: string;
  readonly requirement: string;
  readonly estimatedQuantity: number;
  readonly estimatedBudgetPaise?: number;
  readonly requiredBy?: string;
  readonly status: CorporateLeadStatus;
  readonly assignedTo?: string;
  readonly notes?: string;
}
