import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  createAuditLog,
  createNotification,
  firestore,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import {
  serializeSettlement,
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
} from "./servicePartnerSettlementTypes";
import {
  validateReviewSettlementInput,
} from "./servicePartnerSettlementValidation";

export const reviewServicePartnerSettlement =
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
        "servicePartners.reviewSettlements"
      );

      const input =
        validateReviewSettlementInput(
          request.data
        );

      const reference =
        settlementReference(
          input.settlementId
        );

      const settlement =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const snapshot =
              await transaction.get(
                reference
              );

            if (!snapshot.exists) {
              throw new HttpsError(
                "not-found",
                "Service-partner settlement was not found."
              );
            }

            const current =
              snapshot.data() as ServicePartnerSettlementDocument;

            if (
              ![
                "calculated",
                "underReview",
                "onHold",
              ].includes(
                current.status
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                `Settlement with status ${current.status} cannot be reviewed.`
              );
            }

            const now =
              Timestamp.now();

            if (
              input.decision ===
              "approve"
            ) {
              if (
                current.totals
                  .netPayablePaise <=
                0
              ) {
                throw new HttpsError(
                  "failed-precondition",
                  "Settlement payable amount must be greater than zero."
                );
              }

              if (
                !current.bankSnapshot
                  ?.verified
              ) {
                throw new HttpsError(
                  "failed-precondition",
                  "A verified settlement bank account is required before approval."
                );
              }

              const updated: ServicePartnerSettlementDocument =
                {
                  ...current,
                  status:
                    "approved",
                  reviewedBy:
                    actor.uid,
                  reviewedAt: now,
                  approvedBy:
                    actor.uid,
                  approvedAt: now,
                  approvedNote:
                    input.note,
                  holdReason:
                    undefined,
                  updatedAt: now,
                };

              transaction.update(
                reference,
                {
                  status:
                    "approved",
                  reviewedBy:
                    actor.uid,
                  reviewedAt: now,
                  approvedBy:
                    actor.uid,
                  approvedAt: now,
                  approvedNote:
                    input.note,
                  holdReason:
                    null,
                  updatedAt: now,
                }
              );

              await createAuditLog(
                {
                  actor,
                  action:
                    "servicePartnerSettlement.approved",
                  entityType:
                    "partner",
                  entityId:
                    current.partnerId,
                  metadata: {
                    settlementId:
                      reference.id,
                    settlementNumber:
                      current.settlementNumber,
                    netPayablePaise:
                      current.totals
                        .netPayablePaise,
                    note:
                      input.note,
                  },
                },
                transaction
              );

              await createNotification(
                {
                  userId:
                    current.applicantUserId,
                  title:
                    "Settlement Approved",
                  body: `Settlement ${current.settlementNumber} has been approved for payment.`,
                  type:
                    "servicePartnerSettlementApproved",
                  actionURL:
                    `/partner/settlements/${reference.id}`,
                  metadata: {
                    settlementId:
                      reference.id,
                    settlementNumber:
                      current.settlementNumber,
                  },
                },
                transaction
              );

              return updated;
            }

            if (
              input.decision ===
              "hold"
            ) {
              const updated: ServicePartnerSettlementDocument =
                {
                  ...current,
                  status:
                    "onHold",
                  reviewedBy:
                    actor.uid,
                  reviewedAt: now,
                  reviewNote:
                    input.note,
                  holdReason:
                    input.note,
                  updatedAt: now,
                };

              transaction.update(
                reference,
                {
                  status:
                    "onHold",
                  reviewedBy:
                    actor.uid,
                  reviewedAt: now,
                  reviewNote:
                    input.note,
                  holdReason:
                    input.note,
                  updatedAt: now,
                }
              );

              await createAuditLog(
                {
                  actor,
                  action:
                    "servicePartnerSettlement.held",
                  entityType:
                    "partner",
                  entityId:
                    current.partnerId,
                  metadata: {
                    settlementId:
                      reference.id,
                    settlementNumber:
                      current.settlementNumber,
                    reason:
                      input.note,
                  },
                },
                transaction
              );

              await createNotification(
                {
                  userId:
                    current.applicantUserId,
                  title:
                    "Settlement Review Required",
                  body: `Settlement ${current.settlementNumber} has been placed on hold.`,
                  type:
                    "servicePartnerSettlementHeld",
                  actionURL:
                    `/partner/settlements/${reference.id}`,
                  metadata: {
                    settlementId:
                      reference.id,
                  },
                },
                transaction
              );

              return updated;
            }

            const updated: ServicePartnerSettlementDocument =
              {
                ...current,
                status:
                  "cancelled",
                reviewedBy:
                  actor.uid,
                reviewedAt: now,
                cancelledReason:
                  input.note,
                cancelledAt: now,
                updatedAt: now,
              };

            transaction.update(
              reference,
              {
                status:
                  "cancelled",
                reviewedBy:
                  actor.uid,
                reviewedAt: now,
                cancelledReason:
                  input.note,
                cancelledAt: now,
                updatedAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerSettlement.cancelled",
                entityType:
                  "partner",
                entityId:
                  current.partnerId,
                metadata: {
                  settlementId:
                    reference.id,
                  settlementNumber:
                    current.settlementNumber,
                  reason:
                    input.note,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  current.applicantUserId,
                title:
                  "Settlement Cancelled",
                body: `Settlement ${current.settlementNumber} has been cancelled.`,
                type:
                  "servicePartnerSettlementCancelled",
                actionURL:
                  `/partner/settlements/${reference.id}`,
                metadata: {
                  settlementId:
                    reference.id,
                },
              },
              transaction
            );

            return updated;
          }
        );

      return {
        settlement:
          serializeSettlement(
            reference.id,
            settlement
          ),
      };
    }
  );
