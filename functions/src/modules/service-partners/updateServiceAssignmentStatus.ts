import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  assignmentReference,
  createAuditLog,
  createNotification,
  firestore,
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
  timestampFromISO,
} from "./servicePartnerRepository";
import type {
  ServicePartnerAssignmentDocument,
  ServicePartnerAssignmentStatus,
  ServicePartnerDocument,
} from "./servicePartnerTypes";
import {
  validateAssignmentStatusInput,
} from "./servicePartnerValidation";

const allowedTransitions: Readonly<
  Record<
    ServicePartnerAssignmentStatus,
    readonly ServicePartnerAssignmentStatus[]
  >
> = {
  assigned: [
    "accepted",
    "declined",
    "cancelled",
  ],
  accepted: [
    "scheduled",
    "inProgress",
    "cancelled",
  ],
  declined: [],
  scheduled: [
    "scheduled",
    "inProgress",
    "cancelled",
  ],
  inProgress: [
    "completed",
    "cancelled",
  ],
  completed: [],
  cancelled: [],
};

function serializeAssignment(
  id: string,
  assignment: ServicePartnerAssignmentDocument
): Record<string, unknown> {
  return {
    id,
    ...assignment,
    createdAt:
      assignment.createdAt
        .toDate()
        .toISOString(),
    updatedAt:
      assignment.updatedAt
        .toDate()
        .toISOString(),
    responseDueAt:
      assignment.responseDueAt
        .toDate()
        .toISOString(),
    completionDueAt:
      assignment.completionDueAt
        ?.toDate()
        .toISOString(),
    scheduledAt:
      assignment.scheduledAt
        ?.toDate()
        .toISOString(),
    acceptedAt:
      assignment.acceptedAt
        ?.toDate()
        .toISOString(),
    startedAt:
      assignment.startedAt
        ?.toDate()
        .toISOString(),
    completedAt:
      assignment.completedAt
        ?.toDate()
        .toISOString(),
    declinedAt:
      assignment.declinedAt
        ?.toDate()
        .toISOString(),
    cancelledAt:
      assignment.cancelledAt
        ?.toDate()
        .toISOString(),
  };
}

export const updateServiceAssignmentStatus =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 90,
      memory: "512MiB",
    },
    async (request) => {
      const actor =
        requireAuthenticatedActor(
          request
        );

      const input =
        validateAssignmentStatusInput(
          request.data
        );

      const assignmentRef =
        assignmentReference(
          input.assignmentId
        );

      const result =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const assignmentSnapshot =
              await transaction.get(
                assignmentRef
              );

            if (
              !assignmentSnapshot.exists
            ) {
              throw new HttpsError(
                "not-found",
                "Service assignment was not found."
              );
            }

            const assignment =
              assignmentSnapshot.data() as ServicePartnerAssignmentDocument;

            const partnerRef =
              partnerReference(
                assignment.partnerId
              );

            const partnerSnapshot =
              await transaction.get(
                partnerRef
              );

            if (
              !partnerSnapshot.exists
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Assigned service partner no longer exists."
              );
            }

            const partner =
              partnerSnapshot.data() as ServicePartnerDocument;

            const isPartnerOwner =
              partner.applicantUserId ===
              actor.uid;

            if (!isPartnerOwner) {
              requirePermission(
                actor,
                "servicePartners.manageAssignments"
              );
            }

            if (
              !allowedTransitions[
                assignment.status
              ].includes(
                input.status
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                `Assignment cannot move from ${assignment.status} to ${input.status}.`
              );
            }

            const now =
              Timestamp.now();

            const updateData: Record<
              string,
              unknown
            > = {
              status:
                input.status,
              lastStatusNote:
                input.note,
              updatedBy:
                actor.uid,
              updatedAt: now,
            };

            if (
              input.status ===
              "accepted"
            ) {
              updateData.acceptedAt =
                now;
            }

            if (
              input.status ===
              "declined"
            ) {
              updateData.declinedAt =
                now;
            }

            if (
              input.status ===
              "scheduled"
            ) {
              updateData.scheduledAt =
                timestampFromISO(
                  input.scheduledAt!
                );
            }

            if (
              input.status ===
              "inProgress"
            ) {
              updateData.startedAt =
                assignment.startedAt ??
                now;
            }

            if (
              input.status ===
              "completed"
            ) {
              updateData.completedAt =
                now;
              updateData.completionNote =
                input.completionNote;
            }

            if (
              input.status ===
              "cancelled"
            ) {
              updateData.cancelledAt =
                now;
            }

            transaction.update(
              assignmentRef,
              updateData
            );

            const terminalStatus =
              input.status ===
                "completed" ||
              input.status ===
                "declined" ||
              input.status ===
                "cancelled";

            if (terminalStatus) {
              const partnerUpdates: Record<
                string,
                unknown
              > = {
                currentAssignmentCount:
                  FieldValue.increment(
                    -1
                  ),
                "performance.activeAssignments":
                  FieldValue.increment(
                    -1
                  ),
                updatedAt: now,
              };

              if (
                input.status ===
                "completed"
              ) {
                partnerUpdates[
                  "performance.completedAssignments"
                ] =
                  FieldValue.increment(
                    1
                  );

                const startedAt =
                  assignment.startedAt ??
                  assignment.acceptedAt ??
                  assignment.createdAt;

                const completionHours =
                  Math.max(
                    (now.toMillis() -
                      startedAt.toMillis()) /
                      3_600_000,
                    0
                  );

                const previousCompleted =
                  partner.performance
                    .completedAssignments;

                const previousAverage =
                  partner.performance
                    .averageCompletionHours;

                const newAverage =
                  (previousAverage *
                    previousCompleted +
                    completionHours) /
                  (previousCompleted +
                    1);

                partnerUpdates[
                  "performance.averageCompletionHours"
                ] =
                  Number(
                    newAverage.toFixed(
                      2
                    )
                  );
              }

              if (
                input.status ===
                "cancelled" ||
                input.status ===
                "declined"
              ) {
                partnerUpdates[
                  "performance.cancelledAssignments"
                ] =
                  FieldValue.increment(
                    1
                  );
              }

              transaction.update(
                partnerRef,
                partnerUpdates
              );
            }

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerAssignment.statusUpdated",
                entityType:
                  "assignment",
                entityId:
                  assignmentRef.id,
                metadata: {
                  assignmentNumber:
                    assignment.assignmentNumber,
                  previousStatus:
                    assignment.status,
                  status:
                    input.status,
                  note:
                    input.note,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  assignment.customerId,
                title:
                  "Service Assignment Updated",
                body: `Assignment ${assignment.assignmentNumber} is now ${input.status}.`,
                type:
                  "servicePartnerAssignmentStatusUpdated",
                actionURL:
                  `/account/service-assignments/${assignmentRef.id}`,
                metadata: {
                  assignmentId:
                    assignmentRef.id,
                  previousStatus:
                    assignment.status,
                  status:
                    input.status,
                },
              },
              transaction
            );

            if (!isPartnerOwner) {
              await createNotification(
                {
                  userId:
                    partner.applicantUserId,
                  title:
                    "Assignment Status Updated",
                  body: `Assignment ${assignment.assignmentNumber} was changed to ${input.status}.`,
                  type:
                    "partnerAssignmentStatusUpdated",
                  actionURL:
                    `/partner/assignments/${assignmentRef.id}`,
                  metadata: {
                    assignmentId:
                      assignmentRef.id,
                    status:
                      input.status,
                  },
                },
                transaction
              );
            }

            const updatedAssignment: ServicePartnerAssignmentDocument =
              {
                ...assignment,
                ...updateData,
                status:
                  input.status,
                scheduledAt:
                  input.status ===
                  "scheduled"
                    ? timestampFromISO(
                        input.scheduledAt!
                      )
                    : assignment.scheduledAt,
                acceptedAt:
                  input.status ===
                  "accepted"
                    ? now
                    : assignment.acceptedAt,
                startedAt:
                  input.status ===
                  "inProgress"
                    ? assignment.startedAt ??
                      now
                    : assignment.startedAt,
                completedAt:
                  input.status ===
                  "completed"
                    ? now
                    : assignment.completedAt,
                declinedAt:
                  input.status ===
                  "declined"
                    ? now
                    : assignment.declinedAt,
                cancelledAt:
                  input.status ===
                  "cancelled"
                    ? now
                    : assignment.cancelledAt,
                completionNote:
                  input.status ===
                  "completed"
                    ? input.completionNote
                    : assignment.completionNote,
                lastStatusNote:
                  input.note,
                updatedBy:
                  actor.uid,
                updatedAt: now,
              };

            return updatedAssignment;
          }
        );

      return {
        assignment:
          serializeAssignment(
            assignmentRef.id,
            result
          ),
      };
    }
  );
