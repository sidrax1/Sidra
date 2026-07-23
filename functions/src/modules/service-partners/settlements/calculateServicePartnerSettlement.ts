import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import type {
  ServicePartnerAssignmentDocument,
  ServicePartnerDocument,
} from "../servicePartnerTypes";
import {
  validateCalculateSettlementInput,
} from "./servicePartnerSettlementValidation";
import type {
  ServicePartnerSettlementAdjustmentDocument,
  ServicePartnerSettlementLine,
  ServicePartnerSettlementProfileDocument,
  ServicePartnerSettlementTotals,
} from "./servicePartnerSettlementTypes";
import {
  settlementCollections,
  settlementProfileReference,
} from "./servicePartnerSettlementRepository";

interface SettlementCalculationResult {
  readonly partner: {
    readonly id: string;
    readonly partnerNumber: string;
    readonly partnerName: string;
    readonly applicantUserId: string;
  };
  readonly profile: ServicePartnerSettlementProfileDocument;
  readonly totals: ServicePartnerSettlementTotals;
  readonly lines: readonly ServicePartnerSettlementLine[];
  readonly assignmentIds: readonly string[];
  readonly periodStart: string;
  readonly periodEnd: string;
}

function percentageAmount(
  amountPaise: number,
  percentage: number
): number {
  return Math.round(
    amountPaise *
      (percentage / 100)
  );
}

function emptyTotals(): ServicePartnerSettlementTotals {
  return {
    assignmentEarningsPaise:
      0,
    bonusPaise: 0,
    manualCreditsPaise:
      0,
    platformFeePaise:
      0,
    taxDeductionPaise:
      0,
    penaltiesPaise: 0,
    recoveriesPaise: 0,
    manualDebitsPaise:
      0,
    grossAmountPaise:
      0,
    totalDeductionsPaise:
      0,
    netPayablePaise:
      0,
  };
}

function defaultProfile(
  partnerId: string
): ServicePartnerSettlementProfileDocument {
  const now =
    Timestamp.now();

  return {
    partnerId,
    settlementCycle:
      "weekly",
    commissionPercentage:
      100,
    platformFeePercentage:
      0,
    taxDeductionPercentage:
      1,
    settlementHoldDays:
      7,
    minimumSettlementPaise:
      10_000,
    automaticSettlementEnabled:
      false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function calculateSettlementData(
  input: ReturnType<
    typeof validateCalculateSettlementInput
  >
): Promise<SettlementCalculationResult> {
  const partnerSnapshot =
    await partnerReference(
      input.partnerId
    ).get();

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

  const profileSnapshot =
    await settlementProfileReference(
      input.partnerId
    ).get();

  const profile =
    profileSnapshot.exists
      ? (profileSnapshot.data() as ServicePartnerSettlementProfileDocument)
      : defaultProfile(
          input.partnerId
        );

  const periodStart =
    Timestamp.fromDate(
      new Date(
        input.periodStart
      )
    );

  const periodEnd =
    Timestamp.fromDate(
      new Date(input.periodEnd)
    );

  const assignmentSnapshot =
    await firestore
      .collection(
        "servicePartnerAssignments"
      )
      .where(
        "partnerId",
        "==",
        input.partnerId
      )
      .where(
        "status",
        "==",
        "completed"
      )
      .where(
        "completedAt",
        ">=",
        periodStart
      )
      .where(
        "completedAt",
        "<=",
        periodEnd
      )
      .get();

  const assignments =
    assignmentSnapshot.docs.map(
      (document) => ({
        id: document.id,
        ...(document.data() as ServicePartnerAssignmentDocument),
      })
    );

  const alreadySettledSnapshot =
    assignments.length > 0
      ? await firestore
          .collectionGroup(
            "lines"
          )
          .where(
            "referenceType",
            "==",
            "assignment"
          )
          .where(
            "referenceId",
            "in",
            assignments
              .slice(0, 30)
              .map(
                (assignment) =>
                  assignment.id
              )
          )
          .get()
      : null;

  const settledAssignmentIds =
    new Set(
      alreadySettledSnapshot?.docs.map(
        (document) =>
          String(
            document.data()
              .referenceId
          )
      ) ?? []
    );

  const eligibleAssignments =
    assignments.filter(
      (assignment) =>
        !settledAssignmentIds.has(
          assignment.id
        )
    );

  const now =
    Timestamp.now();

  const lines: ServicePartnerSettlementLine[] =
    eligibleAssignments.map(
      (assignment) => {
        const grossAmountPaise =
          Math.max(
            assignment.platformPayablePaise,
            0
          );

        return {
          id: `assignment_${assignment.id}`,
          type:
            "assignmentEarning",
          referenceType:
            "assignment",
          referenceId:
            assignment.id,
          title:
            assignment.title,
          description: `Completed service assignment ${assignment.assignmentNumber}.`,
          grossAmountPaise,
          deductionAmountPaise:
            0,
          netAmountPaise:
            grossAmountPaise,
          taxable: true,
          taxRatePercentage:
            profile.taxDeductionPercentage,
          metadata: {
            assignmentNumber:
              assignment.assignmentNumber,
            sourceType:
              assignment.sourceType,
            sourceId:
              assignment.sourceId,
            customerId:
              assignment.customerId,
            studioId:
              assignment.studioId,
            completedAt:
              assignment.completedAt
                ?.toDate()
                .toISOString(),
          },
          createdAt: now,
        };
      }
    );

  if (
    input.includePendingAdjustments
  ) {
    const adjustmentSnapshot =
      await firestore
        .collection(
          settlementCollections.adjustments
        )
        .where(
          "partnerId",
          "==",
          input.partnerId
        )
        .where(
          "status",
          "==",
          "pending"
        )
        .get();

    for (const document of
      adjustmentSnapshot.docs) {
      const adjustment =
        document.data() as ServicePartnerSettlementAdjustmentDocument;

      const credit =
        adjustment.type ===
        "credit";

      lines.push({
        id: `adjustment_${document.id}`,
        type:
          adjustment.category ===
          "bonus"
            ? "bonus"
            : adjustment.category ===
                "penalty"
              ? "penalty"
              : adjustment.category ===
                  "refundRecovery"
                ? "refundRecovery"
                : adjustment.category ===
                    "disputeRecovery"
                  ? "disputeRecovery"
                  : credit
                    ? "manualCredit"
                    : "manualDebit",
        referenceType:
          adjustment.category ===
          "refundRecovery"
            ? "refund"
            : adjustment.category ===
                "disputeRecovery"
              ? "dispute"
              : "adjustment",
        referenceId:
          document.id,
        title:
          adjustment.title,
        description:
          adjustment.description,
        grossAmountPaise:
          credit
            ? adjustment.amountPaise
            : 0,
        deductionAmountPaise:
          credit
            ? 0
            : adjustment.amountPaise,
        netAmountPaise:
          credit
            ? adjustment.amountPaise
            : -adjustment.amountPaise,
        taxable:
          adjustment.taxable,
        taxRatePercentage:
          adjustment.taxable
            ? profile.taxDeductionPercentage
            : undefined,
        metadata: {
          adjustmentCategory:
            adjustment.category,
        },
        createdAt: now,
      });
    }
  }

  const totals =
    emptyTotals();

  for (const line of lines) {
    if (
      line.type ===
      "assignmentEarning"
    ) {
      totals.assignmentEarningsPaise +=
        line.grossAmountPaise;
    }

    if (
      line.type === "bonus"
    ) {
      totals.bonusPaise +=
        line.grossAmountPaise;
    }

    if (
      line.type ===
      "manualCredit"
    ) {
      totals.manualCreditsPaise +=
        line.grossAmountPaise;
    }

    if (
      line.type ===
      "penalty"
    ) {
      totals.penaltiesPaise +=
        line.deductionAmountPaise;
    }

    if (
      line.type ===
        "refundRecovery" ||
      line.type ===
        "disputeRecovery"
    ) {
      totals.recoveriesPaise +=
        line.deductionAmountPaise;
    }

    if (
      line.type ===
      "manualDebit"
    ) {
      totals.manualDebitsPaise +=
        line.deductionAmountPaise;
    }
  }

  totals.grossAmountPaise =
    totals.assignmentEarningsPaise +
    totals.bonusPaise +
    totals.manualCreditsPaise;

  totals.platformFeePaise =
    percentageAmount(
      totals.assignmentEarningsPaise,
      profile.platformFeePercentage
    );

  const taxableAmountPaise =
    lines
      .filter(
        (line) => line.taxable
      )
      .reduce(
        (
          total,
          line
        ) =>
          total +
          line.grossAmountPaise,
        0
      );

  totals.taxDeductionPaise =
    percentageAmount(
      taxableAmountPaise,
      profile.taxDeductionPercentage
    );

  totals.totalDeductionsPaise =
    totals.platformFeePaise +
    totals.taxDeductionPaise +
    totals.penaltiesPaise +
    totals.recoveriesPaise +
    totals.manualDebitsPaise;

  totals.netPayablePaise =
    Math.max(
      totals.grossAmountPaise -
        totals.totalDeductionsPaise,
      0
    );

  return {
    partner: {
      id: partnerSnapshot.id,
      partnerNumber:
        partner.partnerNumber,
      partnerName:
        partner.displayName,
      applicantUserId:
        partner.applicantUserId,
    },
    profile,
    totals,
    lines,
    assignmentIds:
      eligibleAssignments.map(
        (assignment) =>
          assignment.id
      ),
    periodStart:
      periodStart
        .toDate()
        .toISOString(),
    periodEnd:
      periodEnd
        .toDate()
        .toISOString(),
  };
}

export const calculateServicePartnerSettlement =
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
        "servicePartners.calculateSettlements"
      );

      const input =
        validateCalculateSettlementInput(
          request.data
        );

      const calculation =
        await calculateSettlementData(
          input
        );

      return {
        calculation: {
          ...calculation,
          profile: {
            ...calculation.profile,
            bankAccount:
              calculation.profile
                .bankAccount
                ? {
                    ...calculation.profile
                      .bankAccount,
                    verifiedAt:
                      calculation.profile.bankAccount.verifiedAt
                        ?.toDate()
                        .toISOString(),
                  }
                : undefined,
            createdAt:
              calculation.profile.createdAt
                .toDate()
                .toISOString(),
            updatedAt:
              calculation.profile.updatedAt
                .toDate()
                .toISOString(),
          },
          lines:
            calculation.lines.map(
              (line) => ({
                ...line,
                createdAt:
                  line.createdAt
                    .toDate()
                    .toISOString(),
              })
            ),
        },
      };
    }
  );
