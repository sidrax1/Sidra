import type { BaseEntity } from "@/types/common";

export interface AutomationCondition {
  readonly field: string;
  readonly operator:
   | "equals"
   | "notEquals"
   | "greaterThan"
   | "lessThan"
   | "contains"
   | "in";
  readonly value: unknown;
}

export interface AutomationAction {
  readonly type:
   | "sendEmail"
   | "createNotification"
   | "updateDocument"
   | "writeAuditLog";
  readonly configuration: Record<string, unknown>;
}

export interface AutomationRule extends BaseEntity {
  readonly name: string;
  readonly trigger: string;
  readonly enabled: boolean;
  readonly conditions: readonly AutomationCondition[];
  readonly actions: readonly AutomationAction[];
  readonly lastExecutedAt?: string;
  readonly executionCount: number;
}
