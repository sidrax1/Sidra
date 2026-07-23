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
  nextWalletHoldNumber,
  serializeServicePartnerWallet,
  serializeServicePartnerWalletEntry,
  servicePartnerWalletCollections,
  servicePartnerWalletEntryReference,
  servicePartnerWalletHoldReference,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import {
  validatePlaceWalletHoldInput,
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

export const placeServicePartnerWalletHold =
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
       validatePlaceWalletHoldInput(
         request.data
       );

      const partnerRef =
       partnerReference(
         input.partnerId
       );

const partnerSnapshot =
 await partnerRef.get();

if (!partnerSnapshot.exists) {
  throw new HttpsError(
    "not-found",
    "Service partner was not found."
  );
}

const partner =
 partnerSnapshot.data() as ServicePartnerDocument;

const walletRef =
 servicePartnerWalletReference(
   input.partnerId
 );

const holdRef =
 servicePartnerWalletHoldReference(
   firestore
     .collection(
       servicePartnerWalletCollections.holds
     )
     .doc().id
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
   const walletSnapshot =
    await transaction.get(
      walletRef
    );

if (!walletSnapshot.exists) {
  throw new HttpsError(
    "failed-precondition",
    "Service-partner wallet has not been created."
  );
}

const wallet =
 walletSnapshot.data() as ServicePartnerWalletDocument;

if (
  wallet.status !==
  "active"
){
  throw new HttpsError(
     "failed-precondition",
     `Wallet with status ${wallet.status} cannot receive a new hold.`
  );
}

const duplicateSnapshot =
 await transaction.get(
  firestore
    .collection(
      servicePartnerWalletCollections.holds
    )
    .where(
      "partnerId",
      "==",
      input.partnerId
    )
    .where(
      "referenceType",
      "==",
      input.referenceType
    )
    .where(
      "referenceId",
      "==",
      input.referenceId
    )
    .where(
      "status",

       "==",
       "active"
      )
      .limit(1)
 );

if (
  !duplicateSnapshot.empty
){
  throw new HttpsError(
     "already-exists",
     "An active wallet hold already exists for this reference."
  );
}

if (
  wallet.balances
     .availablePaise <
  input.amountPaise
){
  throw new HttpsError(
     "failed-precondition",
     "Wallet does not have sufficient available balance for this hold.",
     {
       availablePaise:
        wallet.balances
          .availablePaise,
       requestedPaise:
        input.amountPaise,
     }
  );
}

const balances = {
  ...wallet.balances,
  availablePaise:
    wallet.balances
      .availablePaise -
    input.amountPaise,
  heldPaise:
    wallet.balances
      .heldPaise +
    input.amountPaise,
};

assertNonNegativeWalletBalances(
  balances
);

const now =
 Timestamp.now();

const holdNumber =
 await nextWalletHoldNumber(
   transaction
 );

const entryNumber =
 await nextWalletEntryNumber(
   transaction
 );

const hold: ServicePartnerWalletHoldDocument =
 {
   walletId:
    walletRef.id,
   partnerId:
    input.partnerId,
   holdNumber,
   referenceType:
    input.referenceType,
   referenceId:
    input.referenceId,
   amountPaise:
    input.amountPaise,
   status: "active",
   reason:
    input.reason,
   placedBy:
    actor.uid,
   placedAt: now,
   createdAt: now,
   updatedAt: now,
 };

const entry: ServicePartnerWalletEntryDocument =
 {
   walletId:

  walletRef.id,
partnerId:
  input.partnerId,
partnerNumber:
  partner.partnerNumber,
applicantUserId:
  partner.applicantUserId,
entryNumber,
entryType:
  "holdPlaced",
direction:
  "neutral",
status: "held",
currency: "INR",
amountPaise:
  input.amountPaise,
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
    input.referenceType
  ),
referenceId:
  input.referenceId,
title:
  "Wallet Balance Hold",
description:
  input.reason,
idempotencyKey:

     `wallet-hold:${holdRef.id}`,
   metadata: {
     holdId:
      holdRef.id,
     holdNumber,
     originalReferenceType:
      input.referenceType,
     originalReferenceId:
      input.referenceId,
   },
   createdBy:
     actor.uid,
   createdAt: now,
   updatedAt: now,
 };

transaction.create(
  holdRef,
  hold
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
    "servicePartnerWallet.holdPlaced",
   entityType:
    "partner",
   entityId:
    input.partnerId,

    metadata: {
      walletId:
       walletRef.id,
      holdId:
       holdRef.id,
      holdNumber,
      walletEntryId:
       entryRef.id,
      amountPaise:
       input.amountPaise,
      referenceType:
       input.referenceType,
      referenceId:
       input.referenceId,
      reason:
       input.reason,
    },
  },
  transaction
);

await createNotification(
 {
   userId:
     partner.applicantUserId,
   title:
     "Wallet Amount Placed on Hold",
   body: `₹${(
     input.amountPaise /
     100
   ).toLocaleString(
     "en-IN",
     {
       minimumFractionDigits:
        2,
       maximumFractionDigits:
        2,
     }
   )} has been placed on hold in your service-partner wallet.`,
   type:
     "servicePartnerWalletHoldPlaced",
   actionURL:
     "/partner/wallet",
   metadata: {

             partnerId:
              input.partnerId,
             holdId:
              holdRef.id,
             holdNumber,
             amountPaise:
              input.amountPaise,
             referenceType:
              input.referenceType,
             referenceId:
              input.referenceId,
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
         hold,
         entry,
       };
   }
 );

return {
 wallet:
   serializeServicePartnerWallet(
     walletRef.id,
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
