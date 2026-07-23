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
  assertNonNegativeWalletBalances,
  serializeServicePartnerWallet,
  servicePartnerWalletCollections,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletBalances,
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
} from "./servicePartnerWalletTypes";

interface ReconcileServicePartnerWalletInput {
  readonly partnerId: string;
  readonly reconciliationNote: string;
  readonly applyCorrection?: boolean;
}

function emptyBalances(): ServicePartnerWalletBalances {
  return {
    availablePaise: 0,
    pendingPaise: 0,
    heldPaise: 0,
    lifetimeCreditsPaise:
      0,
    lifetimeDebitsPaise:
      0,
    lifetimePaidPaise:
      0,
  };
}

function deriveBalancesFromEntries(
  entries: readonly ServicePartnerWalletEntryDocument[]
): ServicePartnerWalletBalances {
  const balances =
   emptyBalances();

for (const entry of
 entries) {
 if (
   entry.status ===
      "cancelled" ||
   entry.status ===
      "reversed"
 ){
   continue;
 }

 if (
   entry.direction ===
   "credit"
 ){
   balances.lifetimeCreditsPaise +=
      entry.amountPaise;
 }

 if (
   entry.direction ===
   "debit"
 ){
   balances.lifetimeDebitsPaise +=
      entry.amountPaise;
 }

 if (
   entry.entryType ===
   "payoutDebit"
 ){
   balances.lifetimePaidPaise +=
      entry.amountPaise;
 }

 balances.availablePaise =
  entry.availableBalanceAfterPaise;

 balances.pendingPaise =
  entry.pendingBalanceAfterPaise;

 balances.heldPaise =
  entry.heldBalanceAfterPaise;

    }

    return balances;
}

export const reconcileServicePartnerWallet =
 onCall(
  {
    region: "asia-south1",
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
          "servicePartners.reconcileWallets"
        );

        const input =
         request.data as Partial<ReconcileServicePartnerWalletInput>;

        const partnerId =
         typeof input.partnerId ===
         "string"
           ? input.partnerId.trim()
           : "";

        const reconciliationNote =
         typeof input.reconciliationNote ===
         "string"
           ? input.reconciliationNote.trim()
           : "";

        const applyCorrection =
         input.applyCorrection ===
         true;

if (!partnerId) {
  throw new HttpsError(
    "invalid-argument",
    "Partner ID is required."
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

const walletRef =
 servicePartnerWalletReference(
   partnerId
 );

const [
  walletSnapshot,
  entrySnapshot,
] = await Promise.all([
  walletRef.get(),
  firestore
    .collection(
      servicePartnerWalletCollections.entries
    )
    .where(
      "partnerId",
      "==",
      partnerId
    )
    .orderBy(
      "createdAt",
      "asc"
    )
    .limit(20_000)
    .get(),

]);

if (
  !walletSnapshot.exists
){
  throw new HttpsError(
     "not-found",
     "Service-partner wallet was not found."
  );
}

const wallet =
 walletSnapshot.data() as ServicePartnerWalletDocument;

const entries =
 entrySnapshot.docs.map(
   (document) =>
    document.data() as ServicePartnerWalletEntryDocument
 );

const calculatedBalances =
 deriveBalancesFromEntries(
   entries
 );

assertNonNegativeWalletBalances(
  calculatedBalances
);

const mismatchFields =
 (
   Object.keys(
     wallet.balances
   ) as Array<
     keyof ServicePartnerWalletBalances
   >
 ).filter(
   (key) =>
     wallet.balances[key] !==
     calculatedBalances[key]
 );

const mismatch =
 mismatchFields.length >

 0;

const now =
 Timestamp.now();

await firestore.runTransaction(
 async (transaction) => {
  const currentSnapshot =
   await transaction.get(
     walletRef
   );

  if (
    !currentSnapshot.exists
  ){
    throw new HttpsError(
       "not-found",
       "Wallet disappeared during reconciliation."
    );
  }

  const current =
   currentSnapshot.data() as ServicePartnerWalletDocument;

  if (
    current.updatedAt.toMillis() !==
    wallet.updatedAt.toMillis()
  ){
    throw new HttpsError(
       "aborted",
       "Wallet changed during reconciliation. Please retry."
    );
  }

  const updateData: Record<
   string,
   unknown
  >={
   lastReconciliationStatus:
     mismatch
      ? applyCorrection
        ? "corrected"
        : "mismatchDetected"
      : "verified",

  lastReconciliationNote:
    reconciliationNote,
  lastReconciledBy:
    actor.uid,
  lastReconciledAt:
    now,
  lastReconciliationEntryCount:
    entries.length,
  updatedAt: now,
};

if (
  mismatch &&
  applyCorrection
){
  updateData.balances =
     calculatedBalances;
}

transaction.update(
  walletRef,
  updateData
);

transaction.create(
  firestore
    .collection(
      "servicePartnerWalletReconciliations"
    )
    .doc(),
  {
    partnerId,
    walletId:
      walletRef.id,
    status:
      mismatch
       ? applyCorrection
         ? "corrected"
         : "mismatchDetected"
       : "verified",
    previousBalances:
      wallet.balances,
    calculatedBalances,
    mismatchFields,

            entryCount:
             entries.length,
            reconciliationNote,
            applyCorrection,
            reconciledBy:
             actor.uid,
            reconciledAt:
             now,
            createdAt: now,
        }
      );

      await createAuditLog(
        {
          actor,
          action:
            mismatch
             ? applyCorrection
               ? "servicePartnerWallet.reconciliationCorrected"
               : "servicePartnerWallet.reconciliationMismatchDetected"
             : "servicePartnerWallet.reconciliationVerified",
          entityType:
            "partner",
          entityId:
            partnerId,
          metadata: {
            walletId:
             walletRef.id,
            previousBalances:
             wallet.balances,
            calculatedBalances,
            mismatchFields,
            entryCount:
             entries.length,
            applyCorrection,
            reconciliationNote,
          },
        },
        transaction
      );
  }
);

const resultingWallet: ServicePartnerWalletDocument =

       {
         ...wallet,
         balances:
           mismatch &&
           applyCorrection
            ? calculatedBalances
            : wallet.balances,
         updatedAt: now,
       };

      return {
        reconciliation: {
          partnerId,
          walletId:
            walletRef.id,
          mismatch,
          mismatchFields,
          previousBalances:
            wallet.balances,
          calculatedBalances,
          correctionApplied:
            mismatch &&
            applyCorrection,
          entryCount:
            entries.length,
          reconciledAt:
            now
             .toDate()
             .toISOString(),
          reconciledBy:
            actor.uid,
        },
        wallet:
          serializeServicePartnerWallet(
            walletRef.id,
            resultingWallet
          ),
      };
  }
);
