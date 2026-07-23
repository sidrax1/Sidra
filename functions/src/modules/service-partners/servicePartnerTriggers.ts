import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import {
  logger,
} from "firebase-functions";
import {
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";

import {
  firestore,
} from "./servicePartnerRepository";
import type {
  ServicePartnerAssignmentDocument,
  ServicePartnerDocument,
} from "./servicePartnerTypes";

function calculateQualityScore(
  partner: ServicePartnerDocument
): number {
  const ratingScore =
    partner.performance
      .customerReviewCount > 0
      ? (partner.performance
          .customerRating /
          5) *
        35
      : 35;

  const resolutionScore =
    (partner.performance
      .resolutionSuccessRate /
      100) *
    30;

  const disputePenalty =
    Math.min(
      partner.performance
        .disputeCount * 4,
      20
    );

  const cancellationRate =
    partner.performance
      .totalAssignments > 0
      ? partner.performance
          .cancelledAssignments /
        partner.performance
          .totalAssignments
      : 0;

  const cancellationScore =
    Math.max(
      20 -
        cancellationRate * 20,
      0
    );

  const responseScore =
    partner.performance
      .firstResponseMinutes <= 30
      ? 15
      : partner.performance
            .firstResponseMinutes <=
          120
        ? 10
        : 5;

  return Math.min(
    Math.max(
      Math.round(
        ratingScore +
          resolutionScore +
          cancellationScore +
          responseScore -
          disputePenalty
      ),
      0
    ),
    100
  );
}

export const onServicePartnerAssignmentUpdated =
  onDocumentUpdated(
    {
      region:
        "asia-south1",
      document:
        "servicePartnerAssignments/{assignmentId}",
      timeoutSeconds: 60,
      memory: "256MiB",
    },
    async (event) => {
      const before =
        event.data?.before.data() as
          | ServicePartnerAssignmentDocument
          | undefined;

      const after =
        event.data?.after.data() as
          | ServicePartnerAssignmentDocument
          | undefined;

      if (!before || !after) {
        return;
      }

      if (
        before.status ===
        after.status
      ) {
        return;
      }

      const partnerReference =
        firestore
          .collection(
            "servicePartners"
          )
          .doc(
            after.partnerId
          );

      await firestore.runTransaction(
        async (
          transaction
        ) => {
          const partnerSnapshot =
            await transaction.get(
              partnerReference
            );

          if (
            !partnerSnapshot.exists
          ) {
            logger.error(
              "Service partner missing during assignment trigger.",
              {
                assignmentId:
                  event.params
                    .assignmentId,
                partnerId:
                  after.partnerId,
              }
            );

            return;
          }

          const partner =
            partnerSnapshot.data() as ServicePartnerDocument;

          const updates: Record<
            string,
            unknown
          > = {
            updatedAt:
              Timestamp.now(),
          };

          if (
            after.status ===
              "accepted" &&
            after.acceptedAt
          ) {
            const responseMinutes =
              Math.max(
                (after.acceptedAt.toMillis() -
                  after.createdAt.toMillis()) /
                  60_000,
                0
              );

            const previousAssignments =
              Math.max(
                partner.performance
                  .totalAssignments -
                  1,
                0
              );

            const previousAverage =
              partner.performance
                .firstResponseMinutes;

            const nextAverage =
              (previousAverage *
                previousAssignments +
                responseMinutes) /
              Math.max(
                previousAssignments +
                  1,
                1
              );

            updates[
              "performance.firstResponseMinutes"
            ] = Number(
              nextAverage.toFixed(
                2
              )
            );
          }

          const projectedPartner: ServicePartnerDocument =
            {
              ...partner,
              performance: {
                ...partner.performance,
                firstResponseMinutes:
                  typeof updates[
                    "performance.firstResponseMinutes"
                  ] === "number"
                    ? (updates[
                        "performance.firstResponseMinutes"
                      ] as number)
                    : partner.performance
                        .firstResponseMinutes,
              },
            };

          updates[
            "performance.qualityScore"
          ] =
            calculateQualityScore(
              projectedPartner
            );

          transaction.update(
            partnerReference,
            updates
          );

          transaction.create(
            firestore
              .collection(
                "servicePartnerAssignmentEvents"
              )
              .doc(),
            {
              assignmentId:
                event.params
                  .assignmentId,
              assignmentNumber:
                after.assignmentNumber,
              partnerId:
                after.partnerId,
              previousStatus:
                before.status,
              status:
                after.status,
              note:
                after.lastStatusNote ??
                null,
              changedBy:
                after.updatedBy,
              createdAt:
                FieldValue.serverTimestamp(),
            }
          );
        }
      );
    }
  );
