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
  formatSequence,
  firestore,
  nextSequenceNumber,
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
  timestampFromISO,
} from "./servicePartnerRepository";
import type {
  ServicePartnerAssignmentDocument,
  ServicePartnerDocument,
} from "./servicePartnerTypes";
import {
  validateAssignPartnerInput,
} from "./servicePartnerValidation";

export const assignServicePartner =
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

      requirePermission(
        actor,
        "servicePartners.assign"
      );

      const input =
        validateAssignPartnerInput(
          request.data
        );

      const partnerRef =
        partnerReference(
          input.partnerId
        );

      const assignmentRef =
        assignmentReference(
          firestore
            .collection(
              "servicePartnerAssignments"
            )
            .doc().id
        );

      const result =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const partnerSnapshot =
              await transaction.get(
                partnerRef
              );

            if (
              !partnerSnapshot.exists
            ) {
              throw new HttpsError(
                "not-found",
                "Selected service partner was not found."
              );
            }

            const partner =
              partnerSnapshot.data() as ServicePartnerDocument;

            if (
              partner.status !==
              "active"
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Only active service partners can receive assignments."
              );
            }

            if (
              !partner.acceptingAssignments
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Selected partner is not accepting new assignments."
              );
            }

            if (
              partner.currentAssignmentCount >=
              partner.maximumConcurrentAssignments
            ) {
              throw new HttpsError(
                "resource-exhausted",
                "Selected partner has reached maximum assignment capacity."
              );
            }

            if (
              !partner.capabilityKeys.includes(
                input.capability
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Selected partner does not support the required capability."
              );
            }

            if (
              partner.verification
                .status !== "verified"
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Selected partner is not verified."
              );
            }

            if (
              partner.verification
                .expiresAt &&
              partner.verification
                .expiresAt.toMillis() <
                Date.now()
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Selected partner verification has expired."
              );
            }

            const duplicateQuery =
              firestore
                .collection(
                  "servicePartnerAssignments"
                )
                .where(
                  "sourceType",
                  "==",
                  input.sourceType
                )
                .where(
                  "sourceId",
                  "==",
                  input.sourceId
                )
                .where(
                  "status",
                  "in",
                  [
                    "assigned",
                    "accepted",
                    "scheduled",
                    "inProgress",
                  ]
                )
                .limit(1);

            const duplicateSnapshot =
              await transaction.get(
                duplicateQuery
              );

            if (
              !duplicateSnapshot.empty
            ) {
              throw new HttpsError(
                "already-exists",
                "An active service assignment already exists for this source."
              );
            }

            const sequence =
              await nextSequenceNumber(
                transaction,
                "servicePartnerAssignments"
              );

            const assignmentNumber =
              formatSequence(
                "SPA",
                sequence,
                8
              );

            const now =
              Timestamp.now();

            const assignment: ServicePartnerAssignmentDocument =
              {
                assignmentNumber,
                partnerId:
                  partnerRef.id,
                partnerName:
                  partner.displayName,
                sourceType:
                  input.sourceType,
                sourceId:
                  input.sourceId,
                customerId:
                  input.customerId,
                studioId:
                  input.studioId,
                capability:
                  input.capability,
                status:
                  "assigned",
                priority:
                  input.priority,
                title:
                  input.title,
                description:
                  input.description,
                responseDueAt:
                  timestampFromISO(
                    input.responseDueAt
                  ),
                completionDueAt:
                  input.completionDueAt
                    ? timestampFromISO(
                        input.completionDueAt
                      )
                    : undefined,
                estimatedCostPaise:
                  input.estimatedCostPaise,
                approvedCostPaise:
                  input.approvedCostPaise,
                customerPayablePaise:
                  input.customerPayablePaise,
                platformPayablePaise:
                  input.platformPayablePaise,
                createdBy:
                  actor.uid,
                updatedBy:
                  actor.uid,
                createdAt: now,
                updatedAt: now,
              };

            transaction.create(
              assignmentRef,
              assignment
            );

            transaction.update(
              partnerRef,
              {
                currentAssignmentCount:
                  FieldValue.increment(
                    1
                  ),
                "performance.totalAssignments":
                  FieldValue.increment(
                    1
                  ),
                "performance.activeAssignments":
                  FieldValue.increment(
                    1
                  ),
                updatedAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerAssignment.created",
                entityType:
                  "assignment",
                entityId:
                  assignmentRef.id,
                metadata: {
                  assignmentNumber,
                  partnerId:
                    partnerRef.id,
                  sourceType:
                    input.sourceType,
                  sourceId:
                    input.sourceId,
                  capability:
                    input.capability,
                  approvedCostPaise:
                    input.approvedCostPaise,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  partner.applicantUserId,
                title:
                  "New Service Assignment",
                body: `${input.title} has been assigned to ${partner.displayName}.`,
                type:
                  "servicePartnerAssignmentCreated",
                actionURL:
                  `/partner/assignments/${assignmentRef.id}`,
                metadata: {
                  assignmentId:
                    assignmentRef.id,
                  assignmentNumber,
                  partnerId:
                    partnerRef.id,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  input.customerId,
                title:
                  "Service Partner Assigned",
                body: `${partner.displayName} has been assigned to your service request.`,
                type:
                  "customerServicePartnerAssigned",
                actionURL:
                  `/account/service-assignments/${assignmentRef.id}`,
                metadata: {
                  assignmentId:
                    assignmentRef.id,
                  assignmentNumber,
                  partnerId:
                    partnerRef.id,
                },
              },
              transaction
            );

            return assignment;
          }
        );

      return {
        assignment: {
          id:
            assignmentRef.id,
          ...result,
          createdAt:
            result.createdAt
              .toDate()
              .toISOString(),
          updatedAt:
            result.updatedAt
              .toDate()
              .toISOString(),
          responseDueAt:
            result.responseDueAt
              .toDate()
              .toISOString(),
          completionDueAt:
            result.completionDueAt
              ?.toDate()
              .toISOString(),
        },
      };
    }
  );
