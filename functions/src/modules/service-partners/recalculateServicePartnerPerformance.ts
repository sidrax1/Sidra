import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  createAuditLog,
  firestore,
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
} from "./servicePartnerRepository";
import {
  serializeServicePartner,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerAssignmentDocument,
  ServicePartnerDocument,
  ServicePartnerPerformance,
} from "./servicePartnerTypes";

interface RecalculatePerformanceInput {
  readonly partnerId: string;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    Math.max(
      value,
      minimum
    ),
    maximum
  );
}

export const recalculateServicePartnerPerformance =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 120,
      memory: "1GiB",
    },
    async (request) => {
      const actor =
        requireAuthenticatedActor(
          request
        );

      requirePermission(
        actor,
        "servicePartners.recalculatePerformance"
      );

      const input =
        request.data as Partial<RecalculatePerformanceInput>;

      const partnerId =
        typeof input.partnerId ===
          "string"
          ? input.partnerId.trim()
          : "";

      if (!partnerId) {
        throw new HttpsError(
          "invalid-argument",
          "Partner ID is required."
        );
      }

      const partnerRef =
        partnerReference(
          partnerId
        );

      const [
        partnerSnapshot,
        assignmentSnapshot,
        reviewSnapshot,
      ] = await Promise.all([
        partnerRef.get(),
        firestore
          .collection(
            "servicePartnerAssignments"
          )
          .where(
            "partnerId",
            "==",
            partnerId
          )
          .get(),
        firestore
          .collection(
            "servicePartnerReviews"
          )
          .where(
            "partnerId",
            "==",
            partnerId
          )
          .where(
            "status",
            "==",
            "published"
          )
          .get(),
      ]);

      if (
        !partnerSnapshot.exists
      ) {
        throw new HttpsError(
          "not-found",
          "Service partner was not found."
        );
      }

      const partner =
        partnerSnapshot.data() as ServicePartnerDocument;

      const assignments =
        assignmentSnapshot.docs.map(
          (document) =>
            document.data() as ServicePartnerAssignmentDocument
        );

      const totalAssignments =
        assignments.length;

      const completedAssignments =
        assignments.filter(
          (assignment) =>
            assignment.status ===
            "completed"
        );

      const cancelledAssignments =
        assignments.filter(
          (assignment) =>
            assignment.status ===
              "cancelled" ||
            assignment.status ===
              "declined"
        );

      const activeAssignments =
        assignments.filter(
          (assignment) =>
            [
              "assigned",
              "accepted",
              "scheduled",
              "inProgress",
            ].includes(
              assignment.status
            )
        );

      const completionHours =
        completedAssignments
          .filter(
            (assignment) =>
              Boolean(
                assignment.completedAt
              )
          )
          .map((assignment) => {
            const startedAt =
              assignment.startedAt ??
              assignment.acceptedAt ??
              assignment.createdAt;

            return Math.max(
              (assignment.completedAt!.toMillis() -
                startedAt.toMillis()) /
                3_600_000,
              0
            );
          });

      const averageCompletionHours =
        completionHours.length > 0
          ? completionHours.reduce(
              (
                total,
                hours
              ) => total + hours,
              0
            ) /
            completionHours.length
          : 0;

      const responseMinutes =
        assignments
          .filter(
            (assignment) =>
              Boolean(
                assignment.acceptedAt
              )
          )
          .map((assignment) =>
            Math.max(
              (assignment.acceptedAt!.toMillis() -
                assignment.createdAt.toMillis()) /
                60_000,
              0
            )
          );

      const firstResponseMinutes =
        responseMinutes.length > 0
          ? responseMinutes.reduce(
              (
                total,
                minutes
              ) =>
                total + minutes,
              0
            ) /
            responseMinutes.length
          : 0;

      const reviews =
        reviewSnapshot.docs.map(
          (document) =>
            document.data()
        );

      const customerReviewCount =
        reviews.length;

      const customerRating =
        customerReviewCount > 0
          ? reviews.reduce(
              (
                total,
                review
              ) =>
                total +
                Number(
                  review.rating ??
                    0
                ),
              0
            ) /
            customerReviewCount
          : 0;

      const successfulAssignments =
        completedAssignments.filter(
          (assignment) =>
            !Boolean(
              (
                assignment as unknown as {
                  reopenedAt?: Timestamp;
                }
              ).reopenedAt
            )
        ).length;

      const resolutionSuccessRate =
        completedAssignments.length >
        0
          ? (successfulAssignments /
              completedAssignments.length) *
            100
          : 100;

      const repeatCustomers =
        new Map<string, number>();

      for (const assignment of
        completedAssignments) {
        repeatCustomers.set(
          assignment.customerId,
          (repeatCustomers.get(
            assignment.customerId
          ) ?? 0) + 1
        );
      }

      const repeatCustomerCount =
        [
          ...repeatCustomers.values(),
        ].filter(
          (count) => count > 1
        ).length;

      const repeatServiceRate =
        repeatCustomers.size > 0
          ? (repeatCustomerCount /
              repeatCustomers.size) *
            100
          : 0;

      const disputeSnapshot =
        await firestore
          .collection(
            "servicePartnerDisputes"
          )
          .where(
            "partnerId",
            "==",
            partnerId
          )
          .get();

      const disputeCount =
        disputeSnapshot.size;

      const cancellationRate =
        totalAssignments > 0
          ? cancelledAssignments.length /
            totalAssignments
          : 0;

      const ratingScore =
        customerReviewCount > 0
          ? (customerRating / 5) *
            35
          : 35;

      const resolutionScore =
        (resolutionSuccessRate /
          100) *
        30;

      const cancellationScore =
        Math.max(
          20 -
            cancellationRate * 20,
          0
        );

      const responseScore =
        firstResponseMinutes <= 30
          ? 15
          : firstResponseMinutes <=
              120
            ? 10
            : 5;

      const disputePenalty =
        Math.min(
          disputeCount * 4,
          20
        );

      const qualityScore =
        clamp(
          Math.round(
            ratingScore +
              resolutionScore +
              cancellationScore +
              responseScore -
              disputePenalty
          ),
          0,
          100
        );

      const performance: ServicePartnerPerformance =
        {
          totalAssignments,
          completedAssignments:
            completedAssignments.length,
          cancelledAssignments:
            cancelledAssignments.length,
          activeAssignments:
            activeAssignments.length,
          averageCompletionHours:
            Number(
              averageCompletionHours.toFixed(
                2
              )
            ),
          firstResponseMinutes:
            Number(
              firstResponseMinutes.toFixed(
                2
              )
            ),
          customerRating:
            Number(
              customerRating.toFixed(
                2
              )
            ),
          customerReviewCount,
          qualityScore,
          resolutionSuccessRate:
            Number(
              resolutionSuccessRate.toFixed(
                2
              )
            ),
          repeatServiceRate:
            Number(
              repeatServiceRate.toFixed(
                2
              )
            ),
          disputeCount,
        };

      const now =
        Timestamp.now();

      await partnerRef.update({
        performance,
        currentAssignmentCount:
          activeAssignments.length,
        performanceCalculatedAt:
          now,
        performanceCalculatedBy:
          actor.uid,
        updatedAt: now,
      });

      await createAuditLog({
        actor,
        action:
          "servicePartner.performanceRecalculated",
        entityType:
          "partner",
        entityId:
          partnerId,
        metadata: {
          previousPerformance:
            partner.performance,
          performance,
        },
      });

      const updatedPartner: ServicePartnerDocument =
        {
          ...partner,
          performance,
          currentAssignmentCount:
            activeAssignments.length,
          updatedAt: now,
        };

      return {
        partner:
          serializeServicePartner(
            partnerId,
            updatedPartner
          ),
      };
    }
  );
