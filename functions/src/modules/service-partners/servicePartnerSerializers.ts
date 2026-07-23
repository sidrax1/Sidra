import type {
  Timestamp,
} from "firebase-admin/firestore";

import type {
  ServicePartnerApplicationDocument,
  ServicePartnerAssignmentDocument,
  ServicePartnerDocument,
} from "./servicePartnerTypes";

function serializeTimestamp(
  value:
    | Timestamp
    | undefined
    | null
): string | undefined {
  return value
    ? value
        .toDate()
        .toISOString()
    : undefined;
}

export function serializeServicePartnerApplication(
  id: string,
  application: ServicePartnerApplicationDocument
): Record<string, unknown> {
  return {
    id,
    ...application,
    submittedAt:
      serializeTimestamp(
        application.submittedAt
      ),
    reviewedAt:
      serializeTimestamp(
        application.reviewedAt
      ),
    createdAt:
      serializeTimestamp(
        application.createdAt
      ),
    updatedAt:
      serializeTimestamp(
        application.updatedAt
      ),
  };
}

export function serializeServicePartner(
  id: string,
  partner: ServicePartnerDocument
): Record<string, unknown> {
  return {
    id,
    ...partner,
    verification: {
      ...partner.verification,
      submittedAt:
        serializeTimestamp(
          partner.verification
            .submittedAt
        ),
      reviewedAt:
        serializeTimestamp(
          partner.verification
            .reviewedAt
        ),
      siteInspectionAt:
        serializeTimestamp(
          partner.verification
            .siteInspectionAt
        ),
      expiresAt:
        serializeTimestamp(
          partner.verification
            .expiresAt
        ),
    },
    activatedAt:
      serializeTimestamp(
        partner.activatedAt
      ),
    suspendedAt:
      serializeTimestamp(
        partner.suspendedAt
      ),
    archivedAt:
      serializeTimestamp(
        partner.archivedAt
      ),
    createdAt:
      serializeTimestamp(
        partner.createdAt
      ),
    updatedAt:
      serializeTimestamp(
        partner.updatedAt
      ),
  };
}

export function serializeServicePartnerAssignment(
  id: string,
  assignment: ServicePartnerAssignmentDocument
): Record<string, unknown> {
  return {
    id,
    ...assignment,
    responseDueAt:
      serializeTimestamp(
        assignment.responseDueAt
      ),
    completionDueAt:
      serializeTimestamp(
        assignment.completionDueAt
      ),
    scheduledAt:
      serializeTimestamp(
        assignment.scheduledAt
      ),
    acceptedAt:
      serializeTimestamp(
        assignment.acceptedAt
      ),
    startedAt:
      serializeTimestamp(
        assignment.startedAt
      ),
    completedAt:
      serializeTimestamp(
        assignment.completedAt
      ),
    declinedAt:
      serializeTimestamp(
        assignment.declinedAt
      ),
    cancelledAt:
      serializeTimestamp(
        assignment.cancelledAt
      ),
    createdAt:
      serializeTimestamp(
        assignment.createdAt
      ),
    updatedAt:
      serializeTimestamp(
        assignment.updatedAt
      ),
  };
}
