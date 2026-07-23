import type {
  Timestamp,
} from "firebase-admin/firestore";

export type ServicePartnerEventEntity =
  | "application"
  | "partner"
  | "assignment"
  | "inspection"
  | "verification"
  | "settlement";

export type ServicePartnerEventSeverity =
  | "info"
  | "success"
  | "warning"
  | "critical";

export interface ServicePartnerEventDocument {
  readonly eventType: string;
  readonly entityType: ServicePartnerEventEntity;
  readonly entityId: string;
  readonly partnerId?: string;
  readonly applicationId?: string;
  readonly assignmentId?: string;
  readonly actorId: string;
  readonly actorEmail?: string;
  readonly actorRole?: string;
  readonly title: string;
  readonly description: string;
  readonly severity: ServicePartnerEventSeverity;
  readonly metadata: Readonly<
    Record<string, unknown>
  >;
  readonly occurredAt: Timestamp;
  readonly createdAt: Timestamp;
}

export interface CreateServicePartnerEventInput {
  readonly eventType: string;
  readonly entityType: ServicePartnerEventEntity;
  readonly entityId: string;
  readonly partnerId?: string;
  readonly applicationId?: string;
  readonly assignmentId?: string;
  readonly title: string;
  readonly description: string;
  readonly severity: ServicePartnerEventSeverity;
  readonly metadata?: Readonly<
    Record<string, unknown>
  >;
}

export interface SerializedServicePartnerEvent {
  readonly id: string;
  readonly eventType: string;
  readonly entityType: ServicePartnerEventEntity;
  readonly entityId: string;
  readonly partnerId?: string;
  readonly applicationId?: string;
  readonly assignmentId?: string;
  readonly actorId: string;
  readonly actorEmail?: string;
  readonly actorRole?: string;
  readonly title: string;
  readonly description: string;
  readonly severity: ServicePartnerEventSeverity;
  readonly metadata: Readonly<
    Record<string, unknown>
  >;
  readonly occurredAt: string;
  readonly createdAt: string;
}
