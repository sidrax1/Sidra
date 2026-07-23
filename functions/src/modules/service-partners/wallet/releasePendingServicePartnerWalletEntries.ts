import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  logger,
} from "firebase-functions";
import {
  onSchedule,
} from "firebase-functions/v2/scheduler";

import {
  firestore,
} from "../servicePartnerRepository";
import {
  assertNonNegativeWalletBalances,
  servicePartnerWalletCollections,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
} from "./servicePartnerWalletTypes";

export const releasePendingServicePartnerWalletEntries =
 onSchedule(
  {
    region: "asia-south1",
    schedule:
      "every 30 minutes",
    timeZone:
      "Asia/Kolkata",
    timeoutSeconds: 540,
    memory: "1GiB",
    retryCount: 3,
  },
  async () => {
    const now =
      Timestamp.now();

   const snapshot =
    await firestore

  .collection(
    servicePartnerWalletCollections.entries
  )
  .where(
    "status",
    "==",
    "pending"
  )
  .where(
    "availableAt",
    "<=",
    now
  )
  .orderBy(
    "availableAt",
    "asc"
  )
  .limit(300)
  .get();

let releasedCount = 0;
let skippedCount = 0;
let failedCount = 0;

for (const document of
 snapshot.docs) {
 try {
   await firestore.runTransaction(
     async (transaction) => {
      const currentEntrySnapshot =
       await transaction.get(
         document.ref
       );

    if (
      !currentEntrySnapshot.exists
    ){
      skippedCount += 1;
      return;
    }

    const entry =
     currentEntrySnapshot.data() as ServicePartnerWalletEntryDocument;

if (
  entry.status !==
  "pending"
){
  skippedCount += 1;
  return;
}

if (
  !entry.availableAt ||
  entry.availableAt.toMillis() >
     Date.now()
){
  skippedCount += 1;
  return;
}

if (
  entry.direction !==
  "credit"
){
  transaction.update(
     document.ref,
     {
       status:
        "cancelled",
       cancellationReason:
        "Only pending credit entries can be released automatically.",
       cancelledAt:
        now,
       updatedAt:
        now,
     }
  );

    skippedCount += 1;
    return;
}

const walletRef =
 servicePartnerWalletReference(
   entry.partnerId
 );

const walletSnapshot =
 await transaction.get(
   walletRef
 );

if (
  !walletSnapshot.exists
){
  throw new Error(
     `Wallet missing for partner ${entry.partnerId}.`
  );
}

const wallet =
 walletSnapshot.data() as ServicePartnerWalletDocument;

if (
  wallet.status !==
     "active" &&
  wallet.status !==
     "restricted"
){
  skippedCount += 1;
  return;
}

if (
  wallet.balances
     .pendingPaise <
  entry.amountPaise
){
  throw new Error(
     `Pending balance is lower than entry amount for ${document.id}.`
  );
}

const balances = {
 ...wallet.balances,
 pendingPaise:
   wallet.balances
    .pendingPaise -
   entry.amountPaise,
 availablePaise:
   wallet.balances

      .availablePaise +
     entry.amountPaise,
};

assertNonNegativeWalletBalances(
  balances
);

transaction.update(
  document.ref,
  {
    status:
     "available",
    pendingBalanceBeforePaise:
     wallet.balances
       .pendingPaise,
    pendingBalanceAfterPaise:
     balances.pendingPaise,
    availableBalanceBeforePaise:
     wallet.balances
       .availablePaise,
    availableBalanceAfterPaise:
     balances.availablePaise,
    releasedAt: now,
    updatedAt: now,
  }
);

transaction.update(
  walletRef,
  {
    balances,
    lastEntryAt: now,
    updatedAt: now,
  }
);

transaction.create(
  firestore
    .collection(
      "servicePartnerWalletEvents"
    )
    .doc(),
  {

      eventType:
       "pendingEntryReleased",
      walletId:
       walletRef.id,
      partnerId:
       entry.partnerId,
      walletEntryId:
       document.id,
      entryNumber:
       entry.entryNumber,
      amountPaise:
       entry.amountPaise,
      previousStatus:
       "pending",
      status:
       "available",
      occurredAt:
       now,
      createdAt:
       now,
  }
);

transaction.create(
  firestore
    .collection(
      "notifications"
    )
    .doc(),
  {
    userId:
      entry.applicantUserId,
    title:
      "Wallet Balance Available",
    body: `₹${(
      entry.amountPaise /
      100
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits:
         2,
        maximumFractionDigits:
         2,

                  }
                )} is now available in your service-partner wallet.`,
                type:
                  "servicePartnerWalletEntryReleased",
                actionURL:
                  "/partner/wallet",
                metadata: {
                  walletEntryId:
                    document.id,
                  entryNumber:
                    entry.entryNumber,
                  amountPaise:
                    entry.amountPaise,
                },
                read: false,
                createdAt: now,
                updatedAt: now,
            }
          );

          releasedCount += 1;
        }
      );
    } catch (error) {
      failedCount += 1;

        logger.error(
          "Pending wallet entry release failed.",
          {
            walletEntryId:
             document.id,
            error,
          }
        );
    }
}

logger.info(
  "Pending service-partner wallet entries processed.",
  {
    evaluatedEntries:
     snapshot.size,
    releasedCount,
    skippedCount,

             failedCount,
         }
       );
   }
 );
