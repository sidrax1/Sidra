export interface AuditLog {
  readonly id: string;
  readonly actorId: string;

 readonly actorRole: string;
 readonly action: string;
 readonly entityType: string;
 readonly entityId: string;
 readonly studioId?: string;
 readonly before?: Record<string, unknown>;
 readonly after?: Record<string, unknown>;
 readonly metadata?: Record<string, unknown>;
 readonly ipHash?: string;
 readonly userAgent?: string;
 readonly createdAt: string;
}
