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
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import type {
  ServicePartnerDocument,

} from "../servicePartnerTypes";
import {
  assertNonNegativeWalletBalances,
  nextWalletEntryNumber,
  serializeServicePartnerWallet,
  serializeServicePartnerWalletEntry,
  servicePartnerWalletCollections,
  servicePartnerWalletEntryReference,
  servicePartnerWalletHoldReference,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import {
  validateReleaseWalletHoldInput,
} from "./servicePartnerWalletValidation";
import type {
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
  ServicePartnerWalletHoldDocument,
  ServicePartnerWalletReferenceType,
} from "./servicePartnerWalletTypes";

function mapHoldReferenceType(
  referenceType:
    | "settlement"
    | "dispute"
    | "refund"
    | "investigation"
    | "manual"
): ServicePartnerWalletReferenceType {
  if (
    referenceType ===
       "settlement" ||
    referenceType ===
       "dispute" ||
    referenceType === "refund"
  ){
    return referenceType;
  }

 if (
   referenceType === "manual"
 ){
   return "adjustment";
 }

    return "system";
}

export const releaseServicePartnerWalletHold =
 onCall(
  {
    region: "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

      requirePermission(
        actor,
        "servicePartners.manageWalletHolds"
      );

      const input =
       validateReleaseWalletHoldInput(
         request.data
       );

      const holdRef =
       servicePartnerWalletHoldReference(
         input.holdId
       );

      const entryRef =
       servicePartnerWalletEntryReference(
         firestore
           .collection(
             servicePartnerWalletCollections.entries
           )
           .doc().id
       );

      const result =

await firestore.runTransaction(
 async (transaction) => {
  const holdSnapshot =
   await transaction.get(
     holdRef
   );

  if (!holdSnapshot.exists) {
    throw new HttpsError(
      "not-found",
      "Service-partner wallet hold was not found."
    );
  }

  const hold =
   holdSnapshot.data() as ServicePartnerWalletHoldDocument;

  if (
    hold.status !== "active"
  ){
    throw new HttpsError(
       "failed-precondition",
       `Wallet hold with status ${hold.status} cannot be released.`
    );
  }

  const walletRef =
   servicePartnerWalletReference(
     hold.partnerId
   );

  const partnerRef =
   partnerReference(
     hold.partnerId
   );

  const [
    walletSnapshot,
    partnerSnapshot,
  ] = await Promise.all([
    transaction.get(
      walletRef
    ),
    transaction.get(

    partnerRef
  ),
]);

if (!walletSnapshot.exists) {
  throw new HttpsError(
    "failed-precondition",
    "The wallet associated with this hold no longer exists."
  );
}

if (!partnerSnapshot.exists) {
  throw new HttpsError(
    "failed-precondition",
    "The service partner associated with this hold no longer exists."
  );
}

const wallet =
 walletSnapshot.data() as ServicePartnerWalletDocument;

const partner =
 partnerSnapshot.data() as ServicePartnerDocument;

if (
  wallet.balances
     .heldPaise <
  hold.amountPaise
){
  throw new HttpsError(
     "failed-precondition",
     "Wallet held balance is lower than the active hold amount.",
     {
       heldBalancePaise:
        wallet.balances
          .heldPaise,
       holdAmountPaise:
        hold.amountPaise,
     }
  );
}

const balances = {
 ...wallet.balances,

  availablePaise:
   wallet.balances
    .availablePaise +
   hold.amountPaise,
  heldPaise:
   wallet.balances
    .heldPaise -
   hold.amountPaise,
};

assertNonNegativeWalletBalances(
  balances
);

const now =
 Timestamp.now();

const entryNumber =
 await nextWalletEntryNumber(
   transaction
 );

const updatedHold: ServicePartnerWalletHoldDocument =
 {
   ...hold,
   status: "released",
   releaseNote:
     input.releaseNote,
   releasedBy:
     actor.uid,
   releasedAt: now,
   updatedAt: now,
 };

const entry: ServicePartnerWalletEntryDocument =
 {
   walletId:
    walletRef.id,
   partnerId:
    hold.partnerId,
   partnerNumber:
    partner.partnerNumber,
   applicantUserId:
    partner.applicantUserId,

entryNumber,
entryType:
  "holdReleased",
direction:
  "neutral",
status:
  "available",
currency: "INR",
amountPaise:
  hold.amountPaise,
balanceImpactPaise:
  0,
availableBalanceBeforePaise:
  wallet.balances
    .availablePaise,
availableBalanceAfterPaise:
  balances.availablePaise,
pendingBalanceBeforePaise:
  wallet.balances
    .pendingPaise,
pendingBalanceAfterPaise:
  balances.pendingPaise,
heldBalanceBeforePaise:
  wallet.balances
    .heldPaise,
heldBalanceAfterPaise:
  balances.heldPaise,
referenceType:
  mapHoldReferenceType(
    hold.referenceType
  ),
referenceId:
  hold.referenceId,
title:
  "Wallet Hold Released",
description:
  input.releaseNote,
idempotencyKey:
  `wallet-hold-release:${holdRef.id}`,
metadata: {
  holdId:
    holdRef.id,
  holdNumber:
    hold.holdNumber,

     originalReferenceType:
      hold.referenceType,
     originalReferenceId:
      hold.referenceId,
     originalHoldReason:
      hold.reason,
   },
   availableAt: now,
   createdBy:
     actor.uid,
   createdAt: now,
   updatedAt: now,
 };

transaction.update(
  holdRef,
  {
    status: "released",
    releaseNote:
     input.releaseNote,
    releasedBy:
     actor.uid,
    releasedAt: now,
    updatedAt: now,
  }
);

transaction.create(
  entryRef,
  entry
);

transaction.update(
  walletRef,
  {
    balances,
    lastEntryAt: now,
    updatedAt: now,
  }
);

await createAuditLog(
 {
   actor,

    action:
      "servicePartnerWallet.holdReleased",
    entityType:
      "partner",
    entityId:
      hold.partnerId,
    metadata: {
      walletId:
       walletRef.id,
      holdId:
       holdRef.id,
      holdNumber:
       hold.holdNumber,
      walletEntryId:
       entryRef.id,
      amountPaise:
       hold.amountPaise,
      referenceType:
       hold.referenceType,
      referenceId:
       hold.referenceId,
      releaseNote:
       input.releaseNote,
    },
  },
  transaction
);

await createNotification(
 {
   userId:
     partner.applicantUserId,
   title:
     "Wallet Hold Released",
   body: `₹${(
     hold.amountPaise /
     100
   ).toLocaleString(
     "en-IN",
     {
       minimumFractionDigits:
        2,
       maximumFractionDigits:
        2,

             }
           )} has been restored to your available wallet balance.`,
           type:
             "servicePartnerWalletHoldReleased",
           actionURL:
             "/partner/wallet",
           metadata: {
             partnerId:
               hold.partnerId,
             holdId:
               holdRef.id,
             holdNumber:
               hold.holdNumber,
             amountPaise:
               hold.amountPaise,
           },
         },
         transaction
       );

       return {
         wallet: {
           ...wallet,
           balances,
           lastEntryAt: now,
           updatedAt: now,
         },
         hold:
           updatedHold,
         entry,
       };
   }
 );

return {
 wallet:
   serializeServicePartnerWallet(
     result.wallet.partnerId,
     result.wallet
   ),
 hold: {
   id: holdRef.id,
   ...result.hold,
   placedAt:

         result.hold.placedAt
          .toDate()
          .toISOString(),
       releasedAt:
         result.hold.releasedAt
          ?.toDate()
          .toISOString(),
       createdAt:
         result.hold.createdAt
          .toDate()
          .toISOString(),
       updatedAt:
         result.hold.updatedAt
          .toDate()
          .toISOString(),
     },
     entry:
       serializeServicePartnerWalletEntry(
         entryRef.id,
         result.entry
       ),
   };
    }
  );
