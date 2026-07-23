import {
  Timestamp,
  type DocumentReference,
  type Transaction,
} from "firebase-admin/firestore";
import {
  HttpsError,
} from "firebase-functions/v2/https";

import {
 firestore,
 formatSequence,
 nextSequenceNumber,

} from "../servicePartnerRepository";
import type {
  SerializedServicePartnerWallet,
  SerializedServicePartnerWalletEntry,
  ServicePartnerWalletBalances,
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
  ServicePartnerWalletHoldDocument,
} from "./servicePartnerWalletTypes";

export const servicePartnerWalletCollections = {
  wallets:
   "servicePartnerWallets",
  entries:
   "servicePartnerWalletEntries",
  holds:
   "servicePartnerWalletHolds",
} as const;

export function servicePartnerWalletReference(
  partnerId: string
): DocumentReference<ServicePartnerWalletDocument> {
  return firestore
   .collection(
     servicePartnerWalletCollections.wallets
   )
   .doc(
     partnerId
   ) as DocumentReference<ServicePartnerWalletDocument>;
}

export function servicePartnerWalletEntryReference(
  entryId: string
): DocumentReference<ServicePartnerWalletEntryDocument> {
  return firestore
   .collection(
     servicePartnerWalletCollections.entries
   )
   .doc(
     entryId
   ) as DocumentReference<ServicePartnerWalletEntryDocument>;
}

export function servicePartnerWalletHoldReference(

  holdId: string
): DocumentReference<ServicePartnerWalletHoldDocument> {
  return firestore
   .collection(
     servicePartnerWalletCollections.holds
   )
   .doc(
     holdId
   ) as DocumentReference<ServicePartnerWalletHoldDocument>;
}

export function emptyServicePartnerWalletBalances(): ServicePartnerWalletBalances {
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

export async function ensureServicePartnerWallet(
  transaction: Transaction,
  input: {
    readonly partnerId: string;
    readonly partnerNumber: string;
    readonly applicantUserId: string;
    readonly minimumPayoutPaise?: number;
  }
): Promise<ServicePartnerWalletDocument> {
  const reference =
    servicePartnerWalletReference(
      input.partnerId
    );

 const snapshot =
  await transaction.get(
    reference
  );

    if (snapshot.exists) {
      return snapshot.data()!;
    }

    const now =
     Timestamp.now();

    const wallet: ServicePartnerWalletDocument =
     {
       partnerId:
        input.partnerId,
       partnerNumber:
        input.partnerNumber,
       applicantUserId:
        input.applicantUserId,
       currency: "INR",
       status: "active",
       balances:
        emptyServicePartnerWalletBalances(),
       minimumPayoutPaise:
        input.minimumPayoutPaise ??
        10_000,
       automaticPayoutEnabled:
        false,
       createdAt: now,
       updatedAt: now,
     };

    transaction.create(
      reference,
      wallet
    );

    return wallet;
}

export async function nextWalletEntryNumber(
  transaction: Transaction
): Promise<string> {
  const sequence =
    await nextSequenceNumber(
      transaction,
      "servicePartnerWalletEntries"
    );

    return formatSequence(
      "SPW",
      sequence,
      10
    );
}

export async function nextWalletHoldNumber(
  transaction: Transaction
): Promise<string> {
  const sequence =
    await nextSequenceNumber(
      transaction,
      "servicePartnerWalletHolds"
    );

    return formatSequence(
      "SPH",
      sequence,
      9
    );
}

function serializeOptionalTimestamp(
  value?: Timestamp
): string | undefined {
  return value
   ? value
       .toDate()
       .toISOString()
   : undefined;
}

export function serializeServicePartnerWallet(
  id: string,
  wallet: ServicePartnerWalletDocument
): SerializedServicePartnerWallet {
  return {
    id,
    ...wallet,
    lastEntryAt:
      serializeOptionalTimestamp(
        wallet.lastEntryAt

        ),
      lastPayoutAt:
        serializeOptionalTimestamp(
          wallet.lastPayoutAt
        ),
      restrictedAt:
        serializeOptionalTimestamp(
          wallet.restrictedAt
        ),
      suspendedAt:
        serializeOptionalTimestamp(
          wallet.suspendedAt
        ),
      closedAt:
        serializeOptionalTimestamp(
          wallet.closedAt
        ),
      createdAt:
        wallet.createdAt
          .toDate()
          .toISOString(),
      updatedAt:
        wallet.updatedAt
          .toDate()
          .toISOString(),
    };
}

export function serializeServicePartnerWalletEntry(
  id: string,
  entry: ServicePartnerWalletEntryDocument
): SerializedServicePartnerWalletEntry {
  return {
    id,
    ...entry,
    availableAt:
      serializeOptionalTimestamp(
        entry.availableAt
      ),
    settledAt:
      serializeOptionalTimestamp(
        entry.settledAt
      ),
    reversedAt:

       serializeOptionalTimestamp(
         entry.reversedAt
       ),
      cancelledAt:
       serializeOptionalTimestamp(
         entry.cancelledAt
       ),
      createdAt:
       entry.createdAt
         .toDate()
         .toISOString(),
      updatedAt:
       entry.updatedAt
         .toDate()
         .toISOString(),
    };
}

export async function assertWalletEntryIdempotency(
  transaction: Transaction,
  idempotencyKey: string
): Promise<void> {
  const snapshot =
    await transaction.get(
      firestore
        .collection(
          servicePartnerWalletCollections.entries
        )
        .where(
          "idempotencyKey",
          "==",
          idempotencyKey
        )
        .limit(1)
    );

    if (!snapshot.empty) {
      throw new HttpsError(
        "already-exists",
        "A wallet entry already exists for this idempotency key."
      );
    }
}

export function assertNonNegativeWalletBalances(
  balances: ServicePartnerWalletBalances
): void {
  const invalidBalance =
   Object.entries(
     balances
   ).find(
     ([, value]) =>
       !Number.isInteger(
         value
       ) ||
       value < 0
   );

 if (invalidBalance) {
   throw new HttpsError(
     "failed-precondition",
     `Wallet balance ${invalidBalance[0]} would become invalid.`
   );
 }
}
