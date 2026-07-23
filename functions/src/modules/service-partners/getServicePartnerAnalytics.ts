import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  requireAuthenticatedActor,
  requirePermission,
} from "./servicePartnerRepository";
import type {
  ServicePartnerAssignmentDocument,
  ServicePartnerDocument,
} from "./servicePartnerTypes";

interface AnalyticsRequest {
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly state?: string;
}

function parseOptionalDate(
  value: unknown,
  label: string
): Timestamp | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  if (
    typeof value !== "string"
  ) {
    throw new HttpsError(
      "invalid-argument",
      `${label} must be an ISO date string.`
    );
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new HttpsError(
      "invalid-argument",
      `${label} is invalid.`
    );
  }

  return Timestamp.fromDate(
    date
  );
}

export const getServicePartnerAnalytics =
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
        "servicePartners.viewAnalytics"
      );

      const input =
        (request.data ??
          {}) as AnalyticsRequest;

      const dateFrom =
        parseOptionalDate(
          input.dateFrom,
          "Start date"
        );

      const dateTo =
        parseOptionalDate(
          input.dateTo,
          "End date"
        );

      if (
        dateFrom &&
        dateTo &&
        dateFrom.toMillis() >
          dateTo.toMillis()
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Start date cannot be after end date."
        );
      }

      let partnerQuery:
        | FirebaseFirestore.Query
        | FirebaseFirestore.CollectionReference =
        firestore.collection(
          "servicePartners"
        );

      if (
        input.state?.trim()
      ) {
        partnerQuery =
          partnerQuery.where(
            "coverageStateKeys",
            "array-contains",
            input.state
              .trim()
              .toLowerCase()
          );
      }

      let assignmentQuery:
        | FirebaseFirestore.Query
        | FirebaseFirestore.CollectionReference =
        firestore.collection(
          "servicePartnerAssignments"
        );

      if (dateFrom) {
        assignmentQuery =
          assignmentQuery.where(
            "createdAt",
            ">=",
            dateFrom
          );
      }

      if (dateTo) {
        assignmentQuery =
          assignmentQuery.where(
            "createdAt",
            "<=",
            dateTo
          );
      }

      const [
        partnerSnapshot,
        assignmentSnapshot,
      ] = await Promise.all([
        partnerQuery.get(),
        assignmentQuery.get(),
      ]);

      const partners =
        partnerSnapshot.docs.map(
          (document) =>
            document.data() as ServicePartnerDocument
        );

      const partnerIds =
        new Set(
          partnerSnapshot.docs.map(
            (document) =>
              document.id
          )
        );

      const allAssignments =
        assignmentSnapshot.docs.map(
          (document) =>
            document.data() as ServicePartnerAssignmentDocument
        );

      const assignments =
        input.state?.trim()
          ? allAssignments.filter(
              (assignment) =>
                partnerIds.has(
                  assignment.partnerId
                )
            )
          : allAssignments;

      const activePartners =
        partners.filter(
          (partner) =>
            partner.status ===
            "active"
        ).length;

      const pendingVerification =
        partners.filter(
          (partner) =>
            partner.status ===
              "pendingVerification" ||
            [
              "documentsPending",
              "underReview",
              "siteInspectionPending",
            ].includes(
              partner.verification
                .status
            )
        ).length;

      const suspendedPartners =
        partners.filter(
          (partner) =>
            partner.status ===
            "suspended"
        ).length;

      const acceptingAssignments =
        partners.filter(
          (partner) =>
            partner.status ===
              "active" &&
            partner.acceptingAssignments &&
            partner.currentAssignmentCount <
              partner.maximumConcurrentAssignments
        ).length;

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
        ).length;

      const completedAssignments =
        assignments.filter(
          (assignment) =>
            assignment.status ===
            "completed"
        );

      const completedCount =
        completedAssignments.length;

      const averageCompletionHours =
        completedCount > 0
          ? completedAssignments.reduce(
              (
                total,
                assignment
              ) => {
                if (
                  !assignment.completedAt
                ) {
                  return total;
                }

                const startedAt =
                  assignment.startedAt ??
                  assignment.acceptedAt ??
                  assignment.createdAt;

                return (
                  total +
                  Math.max(
                    (assignment.completedAt.toMillis() -
                      startedAt.toMillis()) /
                      3_600_000,
                    0
                  )
                );
              },
              0
            ) / completedCount
          : 0;

      const averageQualityScore =
        partners.length > 0
          ? partners.reduce(
              (
                total,
                partner
              ) =>
                total +
                partner.performance
                  .qualityScore,
              0
            ) / partners.length
          : 0;

      const ratedPartners =
        partners.filter(
          (partner) =>
            partner.performance
              .customerReviewCount >
            0
        );

      const totalReviews =
        ratedPartners.reduce(
          (
            total,
            partner
          ) =>
            total +
            partner.performance
              .customerReviewCount,
          0
        );

      const averageCustomerRating =
        totalReviews > 0
          ? ratedPartners.reduce(
              (
                total,
                partner
              ) =>
                total +
                partner.performance
                  .customerRating *
                  partner.performance
                    .customerReviewCount,
              0
            ) / totalReviews
          : 0;

      const financialAssignments =
        assignments.filter(
          (assignment) =>
            ![
              "declined",
              "cancelled",
            ].includes(
              assignment.status
            )
        );

      const grossServiceValuePaise =
        financialAssignments.reduce(
          (
            total,
            assignment
          ) =>
            total +
            assignment.approvedCostPaise,
          0
        );

      const partnerPayableValuePaise =
        financialAssignments.reduce(
          (
            total,
            assignment
          ) =>
            total +
            assignment.platformPayablePaise,
          0
        );

      const platformRevenuePaise =
        Math.max(
          grossServiceValuePaise -
            partnerPayableValuePaise,
          0
        );

      return {
        totalPartners:
          partners.length,
        activePartners,
        pendingVerification,
        suspendedPartners,
        acceptingAssignments,
        activeAssignments,
        completedAssignments:
          completedCount,
        averageCompletionHours:
          Number(
            averageCompletionHours.toFixed(
              2
            )
          ),
        averageQualityScore:
          Number(
            averageQualityScore.toFixed(
              2
            )
          ),
        averageCustomerRating:
          Number(
            averageCustomerRating.toFixed(
              2
            )
          ),
        grossServiceValuePaise,
        partnerPayableValuePaise,
        platformRevenuePaise,
      };
    }
  );
