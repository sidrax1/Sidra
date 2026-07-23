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
  timestampFromISO,
} from "../servicePartnerRepository";
import {
  createPaymentEventReference,
  serializeSettlement,
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
} from "./servicePartnerSettlementTypes";
import {
  validateMarkSettlementPaidInput,
} from "./servicePartnerSettlementValidation";

export const markServicePartnerSettlementPaid =
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
        "servicePartners.markSettlementsPaid"
      );

      const input =
        validateMarkSettlementPaidInput(
          request.data
        );

      const reference =
        settlementReference(
          input.settlementId
        );

      const paymentEventReference =
        createPaymentEventReference();

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
                "approved",
                "processing",
                "failed",
              ].includes(
                current.status
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                `Settlement with status ${current.status} cannot be marked as paid.`
              );
            }

            if (
              current.status ===
              "paid"
            ) {
              throw new HttpsError(
                "already-exists",
                "Settlement has already been marked as paid."
              );
            }

            const duplicatePaymentSnapshot =
              await transaction.get(
                firestore
                  .collection(
                    "servicePartnerSettlementPaymentEvents"
                  )
                  .where(
                    "paymentReference",
                    "==",
                    input.paymentReference
                  )
                  .limit(1)
              );

            if (
              !duplicatePaymentSnapshot.empty
            ) {
              throw new HttpsError(
                "already-exists",
                "Payment reference has already been used."
              );
            }

            const paidAt =
              input.paidAt
                ? timestampFromISO(
                    input.paidAt
                  )
                : Timestamp.now();

            const now =
              Timestamp.now();

            const updated: ServicePartnerSettlementDocument =
              {
                ...current,
                status: "paid",
                paymentMethod:
                  input.paymentMethod,
                paymentReference:
                  input.paymentReference,
                paymentProvider:
                  input.paymentProvider,
                paidAt,
                paymentFailureReason:
                  undefined,
                updatedAt: now,
              };

            transaction.update(
              reference,
              {
                status: "paid",
                paymentMethod:
                  input.paymentMethod,
                paymentReference:
                  input.paymentReference,
                paymentProvider:
                  input.paymentProvider ??
                  null,
                paidAt,
                paymentFailureReason:
                  null,
                updatedAt: now,
              }
            );

            transaction.create(
              paymentEventReference,
              {
                settlementId:
                  reference.id,
                settlementNumber:
                  current.settlementNumber,
                partnerId:
                  current.partnerId,
                partnerNumber:
                  current.partnerNumber,
                applicantUserId:
                  current.applicantUserId,
                eventType:
                  "paymentCompleted",
                status:
                  "paid",
                amountPaise:
                  current.totals
                    .netPayablePaise,
                currency:
                  current.currency,
                paymentMethod:
                  input.paymentMethod,
                paymentReference:
                  input.paymentReference,
                paymentProvider:
                  input.paymentProvider ??
                  null,
                processedBy:
                  actor.uid,
                processedAt: paidAt,
                createdAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerSettlement.paid",
                entityType:
                  "partner",
                entityId:
                  current.partnerId,
                metadata: {
                  settlementId:
                    reference.id,
                  settlementNumber:
                    current.settlementNumber,
                  paymentMethod:
                    input.paymentMethod,
                  paymentReference:
                    input.paymentReference,
                  amountPaise:
                    current.totals
                      .netPayablePaise,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  current.applicantUserId,
                title:
                  "Settlement Paid",
                body: `Settlement ${current.settlementNumber} has been transferred successfully.`,
                type:
                  "servicePartnerSettlementPaid",
                actionURL:
                  `/partner/settlements/${reference.id}`,
                metadata: {
                  settlementId:
                    reference.id,
                  settlementNumber:
                    current.settlementNumber,
                  paymentReference:
                    input.paymentReference,
                  amountPaise:
                    current.totals
                      .netPayablePaise,
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
