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
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import {
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementLine,
  ServicePartnerSettlementTotals,
} from "./servicePartnerSettlementTypes";

interface ReconcileServicePartnerSettlementInput {

    readonly settlementId: string;
    readonly reconciliationNote: string;
}

function createEmptyTotals(): ServicePartnerSettlementTotals {
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

function calculateTotals(
  lines: readonly ServicePartnerSettlementLine[]
): ServicePartnerSettlementTotals {
  const totals =
    createEmptyTotals();

    for (const line of lines) {
     switch (line.type) {
       case "assignmentEarning":
         totals.assignmentEarningsPaise +=
          line.grossAmountPaise;
         break;

      case "bonus":
       totals.bonusPaise +=
        line.grossAmountPaise;

 break;

case "manualCredit":
 totals.manualCreditsPaise +=
  line.grossAmountPaise;
 break;

case "platformFee":
 totals.platformFeePaise +=
  line.deductionAmountPaise;
 break;

case "taxDeduction":
 totals.taxDeductionPaise +=
  line.deductionAmountPaise;
 break;

case "penalty":
 totals.penaltiesPaise +=
  line.deductionAmountPaise;
 break;

case "refundRecovery":
case "disputeRecovery":
 totals.recoveriesPaise +=
  line.deductionAmountPaise;
 break;

case "manualDebit":
 totals.manualDebitsPaise +=
  line.deductionAmountPaise;
 break;

case "adjustment":
 if (
   line.netAmountPaise >=
   0
 ){
   totals.manualCreditsPaise +=
      line.netAmountPaise;
 } else {
   totals.manualDebitsPaise +=
      Math.abs(
        line.netAmountPaise

              );
            }
            break;
        }
    }

    totals.grossAmountPaise =
     totals.assignmentEarningsPaise +
     totals.bonusPaise +
     totals.manualCreditsPaise;

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

    return totals;
}

export const reconcileServicePartnerSettlement =
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
  "servicePartners.reconcileSettlements"
);

const input =
 request.data as Partial<ReconcileServicePartnerSettlementInput>;

const settlementId =
 typeof input.settlementId ===
   "string"
   ? input.settlementId.trim()
   : "";

const reconciliationNote =
 typeof input.reconciliationNote ===
   "string"
   ? input.reconciliationNote.trim()
   : "";

if (!settlementId) {
  throw new HttpsError(
    "invalid-argument",
    "Settlement ID is required."
  );
}

if (
  reconciliationNote.length <
     10 ||
  reconciliationNote.length >
     3000
){
  throw new HttpsError(
     "invalid-argument",
     "Reconciliation note must contain between 10 and 3000 characters."
  );
}

const reference =
 settlementReference(
   settlementId
 );

const [
  settlementSnapshot,
  linesSnapshot,
] = await Promise.all([
  reference.get(),
  reference
    .collection("lines")
    .get(),
]);

if (
  !settlementSnapshot.exists
){
  throw new HttpsError(
     "not-found",
     "Service-partner settlement was not found."
  );
}

const settlement =
 settlementSnapshot.data() as ServicePartnerSettlementDocument;

if (
  [
    "paid",
    "cancelled",
  ].includes(
    settlement.status
  )
){
  throw new HttpsError(
    "failed-precondition",
    "Paid or cancelled settlements cannot be recalculated."
  );
}

const lines =
 linesSnapshot.docs.map(
   (document) =>
    document.data() as ServicePartnerSettlementLine
 );

const calculatedTotals =
 calculateTotals(lines);

const mismatch =
 JSON.stringify(
   calculatedTotals
 ) !==
 JSON.stringify(
   settlement.totals
 );

const now =
 Timestamp.now();

await firestore.runTransaction(
 async (transaction) => {
  const currentSnapshot =
   await transaction.get(
     reference
   );

  if (
    !currentSnapshot.exists
  ){
    throw new HttpsError(
       "not-found",
       "Settlement disappeared during reconciliation."
    );
  }

  const current =
   currentSnapshot.data() as ServicePartnerSettlementDocument;

  if (
    current.updatedAt.toMillis() !==
    settlement.updatedAt.toMillis()
  ){
    throw new HttpsError(
       "aborted",
       "Settlement changed during reconciliation. Please retry."
    );
  }

  transaction.update(
    reference,
    {

          totals:
            calculatedTotals,
          lineCount:
            lines.length,
          reconciliationStatus:
            mismatch
              ? "corrected"
              : "verified",
          reconciliationNote,
          reconciledBy:
            actor.uid,
          reconciledAt:
            now,
          updatedAt: now,
      }
    );

    await createAuditLog(
      {
        actor,
        action:
          mismatch
            ? "servicePartnerSettlement.reconciliationCorrected"
            : "servicePartnerSettlement.reconciliationVerified",
        entityType:
          "partner",
        entityId:
          settlement.partnerId,
        metadata: {
          settlementId:
            reference.id,
          settlementNumber:
            settlement.settlementNumber,
          previousTotals:
            settlement.totals,
          calculatedTotals,
          lineCount:
            lines.length,
          reconciliationNote,
        },
      },
      transaction
    );
}

        );

        return {
          reconciliation: {
            settlementId:
              reference.id,
            settlementNumber:
              settlement.settlementNumber,
            mismatch,
            previousTotals:
              settlement.totals,
            calculatedTotals,
            lineCount:
              lines.length,
            reconciledAt:
              now
                .toDate()
                .toISOString(),
            reconciledBy:
              actor.uid,
          },
        };
    }
  );
