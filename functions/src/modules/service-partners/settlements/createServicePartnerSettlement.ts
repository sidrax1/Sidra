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
  formatSequence,
  firestore,
  nextSequenceNumber,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import {
  calculateSettlementData,
} from "./calculateServicePartnerSettlement";
import {
  assertSettlementNumberUnique,
  serializeSettlement,
  settlementCollections,
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
} from "./servicePartnerSettlementTypes";
import {
  validateCreateSettlementInput,
} from "./servicePartnerSettlementValidation";

export const createServicePartnerSettlement =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 180,
      memory: "1GiB",
    },
    async (request) => {
      const actor =
        requireAuthenticatedActor(
          request
        );

      requirePermission(
        actor,
        "servicePartners.createSettlements"
      );

      const input =
        validateCreateSettlementInput(
          request.data
        );

      const calculation =
        await calculateSettlementData(
          input
        );

      if (
        calculation.lines.length ===
        0
      ) {
        throw new HttpsError(
          "failed-precondition",
          "No eligible assignments or adjustments were found for this settlement period."
        );
      }

      if (
        calculation.totals
          .netPayablePaise <= 0
      ) {
        throw new HttpsError(
          "failed-precondition",
          "Settlement net payable must be greater than zero."
        );
      }

      if (
        calculation.totals
          .netPayablePaise <
        calculation.profile
          .minimumSettlementPaise
      ) {
        throw new HttpsError(
          "failed-precondition",
          "Settlement amount is below the partner's minimum settlement threshold.",
          {
            netPayablePaise:
              calculation.totals
                .netPayablePaise,
            minimumSettlementPaise:
              calculation.profile
                .minimumSettlementPaise,
          }
        );
      }

      const duplicateSnapshot =
        await firestore
          .collection(
            settlementCollections.settlements
          )
          .where(
            "partnerId",
            "==",
            input.partnerId
          )
          .where(
            "periodStart",
            "==",
            Timestamp.fromDate(
              new Date(
                input.periodStart
              )
            )
          )
          .where(
            "periodEnd",
            "==",
            Timestamp.fromDate(
              new Date(
                input.periodEnd
              )
            )
          )
          .where(
            "status",
            "not-in",
            [
              "cancelled",
              "failed",
            ]
          )
          .limit(1)
          .get();

      if (
        !duplicateSnapshot.empty
      ) {
        throw new HttpsError(
          "already-exists",
          "A settlement already exists for this partner and period."
        );
      }

      const reference =
        settlementReference(
          firestore
            .collection(
              settlementCollections.settlements
            )
            .doc().id
        );

      const settlement =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const sequence =
              await nextSequenceNumber(
                transaction,
                "servicePartnerSettlements"
              );

            const settlementNumber =
              formatSequence(
                "SPS",
                sequence,
                8
              );

            await assertSettlementNumberUnique(
              transaction,
              settlementNumber
            );

            const now =
              Timestamp.now();

            const document: ServicePartnerSettlementDocument =
              {
                settlementNumber,
                partnerId:
                  calculation.partner.id,
                partnerNumber:
                  calculation.partner
                    .partnerNumber,
                partnerName:
                  calculation.partner
                    .partnerName,
                applicantUserId:
                  calculation.partner
                    .applicantUserId,
                cycle:
                  input.cycle,
                periodStart:
                  Timestamp.fromDate(
                    new Date(
                      input.periodStart
                    )
                  ),
                periodEnd:
                  Timestamp.fromDate(
                    new Date(
                      input.periodEnd
                    )
                  ),
                status:
                  "underReview",
                currency: "INR",
                totals:
                  calculation.totals,
                lineCount:
                  calculation.lines.length,
                assignmentIds:
                  calculation.assignmentIds,
                bankSnapshot:
                  calculation.profile
                    .bankAccount,
                reviewNote:
                  input.reviewNote,
                calculatedBy:
                  actor.uid,
                calculatedAt: now,
                createdAt: now,
                updatedAt: now,
              };

            transaction.create(
              reference,
              document
            );

            for (const line of
              calculation.lines) {
              transaction.create(
                reference
                  .collection(
                    "lines"
                  )
                  .doc(line.id),
                line
              );

              if (
                line.referenceType ===
                "adjustment"
              ) {
                transaction.update(
                  firestore
                    .collection(
                      settlementCollections.adjustments
                    )
                    .doc(
                      line.referenceId
                    ),
                  {
                    status:
                      "consumed",
                    settlementId:
                      reference.id,
                    consumedAt: now,
                    updatedAt: now,
                  }
                );
              }
            }

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerSettlement.created",
                entityType:
                  "partner",
                entityId:
                  calculation.partner.id,
                metadata: {
                  settlementId:
                    reference.id,
                  settlementNumber,
                  periodStart:
                    input.periodStart,
                  periodEnd:
                    input.periodEnd,
                  lineCount:
                    calculation.lines.length,
                  netPayablePaise:
                    calculation.totals
                      .netPayablePaise,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  calculation.partner
                    .applicantUserId,
                title:
                  "Settlement Prepared",
                body: `Settlement ${settlementNumber} has been prepared and is under review.`,
                type:
                  "servicePartnerSettlementCreated",
                actionURL:
                  `/partner/settlements/${reference.id}`,
                metadata: {
                  settlementId:
                    reference.id,
                  settlementNumber,
                  netPayablePaise:
                    calculation.totals
                      .netPayablePaise,
                },
              },
              transaction
            );

            return document;
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
