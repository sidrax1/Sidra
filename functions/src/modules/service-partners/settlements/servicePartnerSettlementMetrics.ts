import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementStatus,
  ServicePartnerSettlementTotals,
} from "./servicePartnerSettlementTypes";

export interface ServicePartnerSettlementMetrics {
  readonly settlementCount: number;
  readonly grossAmountPaise: number;
  readonly totalDeductionsPaise: number;
  readonly netPayablePaise: number;
  readonly paidAmountPaise: number;
  readonly pendingAmountPaise: number;
  readonly failedAmountPaise: number;
  readonly averageSettlementPaise: number;
  readonly medianSettlementPaise: number;
  readonly paymentSuccessRate: number;
  readonly averageApprovalHours: number;
  readonly averagePaymentHours: number;
  readonly statusCounts: Readonly<
   Record<
     ServicePartnerSettlementStatus,
     number
   >
  >;
  readonly totals: ServicePartnerSettlementTotals;
}

const statuses: readonly ServicePartnerSettlementStatus[] =
 [
   "draft",
   "calculated",
   "underReview",
   "approved",
   "processing",
   "paid",
   "failed",
   "cancelled",
   "onHold",
 ];

function average(
  values: readonly number[]
): number {
  if (values.length === 0) {
    return 0;
  }

 return (
  values.reduce(

      (
          total,
          value
        ) => total + value,
        0
      ) / values.length
    );
}

function median(
  values: readonly number[]
): number {
  if (values.length === 0) {
    return 0;
  }

    const sorted = [
      ...values,
    ].sort(
      (
        first,
        second
      ) => first - second
    );

    const midpoint =
     Math.floor(
       sorted.length / 2
     );

    if (
      sorted.length % 2 ===
      0
    ){
      return Math.round(
         (sorted[midpoint - 1]! +
          sorted[midpoint]!) /
          2
      );
    }

    return sorted[midpoint]!;
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

export function calculateServicePartnerSettlementMetrics(
  settlements: readonly ServicePartnerSettlementDocument[]
): ServicePartnerSettlementMetrics {
  const included =
   settlements.filter(
     (settlement) =>
      settlement.status !==
      "cancelled"
   );

 const paid =
  included.filter(
    (settlement) =>
     settlement.status ===
     "paid"
  );

 const failed =
  included.filter(
    (settlement) =>

      settlement.status ===
      "failed"
 );

const pending =
 included.filter(
   (settlement) =>
    [
      "draft",
      "calculated",
      "underReview",
      "approved",
      "processing",
      "onHold",
    ].includes(
      settlement.status
    )
 );

const statusCounts =
 Object.fromEntries(
   statuses.map(
     (status) => [
       status,
       settlements.filter(
         (settlement) =>
           settlement.status ===
           status
       ).length,
     ]
   )
 ) as Record<
   ServicePartnerSettlementStatus,
   number
 >;

const totals =
 emptyTotals();

for (const settlement of
 included) {
 totals.assignmentEarningsPaise +=
   settlement.totals
     .assignmentEarningsPaise;

    totals.bonusPaise +=
     settlement.totals
       .bonusPaise;

    totals.manualCreditsPaise +=
     settlement.totals
       .manualCreditsPaise;

    totals.platformFeePaise +=
     settlement.totals
       .platformFeePaise;

    totals.taxDeductionPaise +=
     settlement.totals
       .taxDeductionPaise;

    totals.penaltiesPaise +=
     settlement.totals
       .penaltiesPaise;

    totals.recoveriesPaise +=
     settlement.totals
       .recoveriesPaise;

    totals.manualDebitsPaise +=
     settlement.totals
       .manualDebitsPaise;

    totals.grossAmountPaise +=
     settlement.totals
       .grossAmountPaise;

    totals.totalDeductionsPaise +=
     settlement.totals
       .totalDeductionsPaise;

    totals.netPayablePaise +=
     settlement.totals
       .netPayablePaise;
}

const approvalHours =
 included

  .filter(
    (settlement) =>
      Boolean(
        settlement.approvedAt
      )
  )
  .map((settlement) =>
    Math.max(
      (settlement.approvedAt!.toMillis() -
        settlement.createdAt.toMillis()) /
        3_600_000,
      0
    )
  );

const paymentHours =
 paid
  .filter(
    (settlement) =>
      Boolean(
        settlement.paidAt
      )
  )
  .map((settlement) =>
    Math.max(
      (settlement.paidAt!.toMillis() -
        (settlement.approvedAt?.toMillis() ?? 0)) /
        3_600_000,
      0
    )
  )
  .filter(
    Number.isFinite
  );

const paymentAttempts =
 paid.length +
 failed.length;

return {
 settlementCount:
   included.length,
 grossAmountPaise:
   totals.grossAmountPaise,

totalDeductionsPaise:
 totals.totalDeductionsPaise,
netPayablePaise:
 totals.netPayablePaise,
paidAmountPaise:
 paid.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
       .netPayablePaise,
   0
 ),
pendingAmountPaise:
 pending.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
       .netPayablePaise,
   0
 ),
failedAmountPaise:
 failed.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
       .netPayablePaise,
   0
 ),
averageSettlementPaise:
 included.length > 0
   ? Math.round(
       totals.netPayablePaise /
        included.length
     )
   : 0,

   medianSettlementPaise:
    median(
      included.map(
        (settlement) =>
          settlement.totals
            .netPayablePaise
      )
    ),
   paymentSuccessRate:
    paymentAttempts > 0
      ? Number(
          (
            (paid.length /
             paymentAttempts) *
            100
          ).toFixed(2)
        )
      : 100,
   averageApprovalHours:
    Number(
      average(
        approvalHours
      ).toFixed(2)
    ),
   averagePaymentHours:
    Number(
      average(
        paymentHours
      ).toFixed(2)
    ),
   statusCounts,
   totals,
 };
}
