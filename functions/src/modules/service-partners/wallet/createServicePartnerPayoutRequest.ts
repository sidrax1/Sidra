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
 formatSequence,
 nextSequenceNumber,

  partnerReference,
  requireAuthenticatedActor,
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
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
} from "./servicePartnerWalletTypes";

type ServicePartnerPayoutRequestStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

type ServicePartnerPayoutMethod =
  | "bankTransfer"
  | "upi"
  | "manualBankTransfer";

interface CreateServicePartnerPayoutRequestInput {
  readonly partnerId?: string;
  readonly amountPaise: number;
  readonly payoutMethod: ServicePartnerPayoutMethod;
  readonly accountReference: string;
  readonly note?: string;
  readonly idempotencyKey: string;
}

interface ServicePartnerPayoutRequestDocument {

    readonly payoutNumber: string;
    readonly walletId: string;
    readonly partnerId: string;
    readonly partnerNumber: string;
    readonly partnerName: string;
    readonly applicantUserId: string;
    readonly status: ServicePartnerPayoutRequestStatus;
    readonly currency: "INR";
    readonly amountPaise: number;
    readonly payoutMethod: ServicePartnerPayoutMethod;
    readonly accountReference: string;
    readonly requestNote?: string;
    readonly idempotencyKey: string;
    readonly walletEntryId: string;
    readonly requestedBy: string;
    readonly requestedAt: Timestamp;
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

const payoutCollection =
 "servicePartnerPayoutRequests";

const payoutMethods =
 new Set<ServicePartnerPayoutMethod>([
   "bankTransfer",
   "upi",
   "manualBankTransfer",
 ]);

function requireString(
  value: unknown,
  label: string,
  minimumLength: number,
  maximumLength: number
): string {
  if (typeof value !== "string") {
    throw new HttpsError(
      "invalid-argument",
      `${label} must be a string.`
    );
  }

    const normalized = value.trim();

    if (
      normalized.length < minimumLength ||
      normalized.length > maximumLength
    ){
      throw new HttpsError(
         "invalid-argument",
         `${label} must contain between ${minimumLength} and ${maximumLength} characters.`
      );
    }

    return normalized;
}

export const createServicePartnerPayoutRequest =
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

      const input =
       request.data as Partial<CreateServicePartnerPayoutRequestInput>;

      let partnerId =
        typeof input.partnerId === "string"
          ? input.partnerId.trim()
          : "";

      if (!partnerId) {
        const ownedPartnerSnapshot =
          await firestore
            .collection(
              "servicePartners"
            )
            .where(

        "applicantUserId",
        "==",
        actor.uid
      )
      .limit(1)
      .get();

    if (ownedPartnerSnapshot.empty) {
      throw new HttpsError(
        "not-found",
        "No service-partner profile is associated with this account."
      );
    }

    partnerId =
     ownedPartnerSnapshot.docs[0]!.id;
}

const amountPaise =
 input.amountPaise;

if (
  !Number.isInteger(
     amountPaise
  ) ||
  amountPaise! <= 0 ||
  amountPaise! >
     100_000_000
){
  throw new HttpsError(
     "invalid-argument",
     "Payout amount must be a positive integer not exceeding ₹10,00,000."
  );
}

if (
  !input.payoutMethod ||
  !payoutMethods.has(
     input.payoutMethod
  )
){
  throw new HttpsError(
     "invalid-argument",
     "Payout method is invalid."

    );
}

const accountReference =
 requireString(
   input.accountReference,
   "Payout account reference",
   3,
   200
 );

const idempotencyKey =
 requireString(
   input.idempotencyKey,
   "Idempotency key",
   8,
   250
 );

const note =
 typeof input.note === "string" &&
 input.note.trim()
   ? requireString(
       input.note,
       "Payout note",
       5,
       1500
     )
   : undefined;

const partnerRef =
 partnerReference(
   partnerId
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

if (
  partner.applicantUserId !==
  actor.uid
){
  throw new HttpsError(
     "permission-denied",
     "You cannot request a payout for another service partner."
  );
}

if (
  partner.status !== "active"
){
  throw new HttpsError(
     "failed-precondition",
     "Only active service partners can request wallet payouts."
  );
}

const walletRef =
 servicePartnerWalletReference(
   partnerId
 );

const payoutRef =
 firestore
   .collection(
     payoutCollection
   )
   .doc();

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
        `Wallet with status ${wallet.status} cannot request payouts.`
     );
   }

   if (
     amountPaise! <
     wallet.minimumPayoutPaise
   ){
     throw new HttpsError(
        "failed-precondition",
        "Requested amount is below the wallet minimum payout threshold.",
        {
          minimumPayoutPaise:
           wallet.minimumPayoutPaise,
          requestedAmountPaise:
           amountPaise,
        }
     );
   }

if (
  wallet.balances.availablePaise <
  amountPaise!
){
  throw new HttpsError(
     "failed-precondition",
     "Wallet does not have sufficient available balance.",
     {
       availablePaise:
        wallet.balances.availablePaise,
       requestedPaise:
        amountPaise,
     }
  );
}

const duplicateSnapshot =
 await transaction.get(
   firestore
     .collection(
       payoutCollection
     )
     .where(
       "idempotencyKey",
       "==",
       idempotencyKey
     )
     .limit(1)
 );

if (!duplicateSnapshot.empty) {
  throw new HttpsError(
    "already-exists",
    "A payout request already exists for this idempotency key."
  );
}

const activePayoutSnapshot =
 await transaction.get(
  firestore
    .collection(
      payoutCollection
    )
    .where(

       "partnerId",
       "==",
       partnerId
      )
      .where(
        "status",
        "in",
        [
          "requested",
          "approved",
          "processing",
        ]
      )
      .limit(1)
 );

if (!activePayoutSnapshot.empty) {
  throw new HttpsError(
    "failed-precondition",
    "An active payout request already exists for this wallet."
  );
}

const balances = {
  ...wallet.balances,
  availablePaise:
    wallet.balances.availablePaise -
    amountPaise!,
  heldPaise:
    wallet.balances.heldPaise +
    amountPaise!,
};

assertNonNegativeWalletBalances(
  balances
);

const sequence =
 await nextSequenceNumber(
   transaction,
   "servicePartnerPayoutRequests"
 );

const payoutNumber =

 formatSequence(
   "SPP",
   sequence,
   9
 );

const entryNumber =
 await nextWalletEntryNumber(
   transaction
 );

const now =
 Timestamp.now();

const entry: ServicePartnerWalletEntryDocument =
 {
   walletId:
    walletRef.id,
   partnerId,
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
    amountPaise!,
   balanceImpactPaise:
    0,
   availableBalanceBeforePaise:
    wallet.balances.availablePaise,
   availableBalanceAfterPaise:
    balances.availablePaise,
   pendingBalanceBeforePaise:
    wallet.balances.pendingPaise,
   pendingBalanceAfterPaise:
    balances.pendingPaise,
   heldBalanceBeforePaise:
    wallet.balances.heldPaise,

   heldBalanceAfterPaise:
     balances.heldPaise,
   referenceType:
     "payout",
   referenceId:
     payoutRef.id,
   title:
     "Payout Amount Reserved",
   description:
     `Funds reserved for payout request ${payoutNumber}.`,
   idempotencyKey:
     `payout-reserve:${idempotencyKey}`,
   metadata: {
     payoutId:
       payoutRef.id,
     payoutNumber,
     payoutMethod:
       input.payoutMethod,
     accountReference,
   },
   createdBy:
     actor.uid,
   createdAt: now,
   updatedAt: now,
 };

const payout: ServicePartnerPayoutRequestDocument =
 {
   payoutNumber,
   walletId:
    walletRef.id,
   partnerId,
   partnerNumber:
    partner.partnerNumber,
   partnerName:
    partner.displayName,
   applicantUserId:
    partner.applicantUserId,
   status:
    "requested",
   currency: "INR",
   amountPaise:
    amountPaise!,
   payoutMethod:

     input.payoutMethod!,
   accountReference,
   requestNote:
     note,
   idempotencyKey,
   walletEntryId:
     entryRef.id,
   requestedBy:
     actor.uid,
   requestedAt: now,
   createdAt: now,
   updatedAt: now,
 };

transaction.create(
  payoutRef,
  payout
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
    "servicePartnerPayout.requested",
   entityType:
    "partner",
   entityId:
    partnerId,
   metadata: {
    payoutId:

           payoutRef.id,
          payoutNumber,
          walletEntryId:
           entryRef.id,
          amountPaise,
          payoutMethod:
           input.payoutMethod,
        },
      },
      transaction
    );

    await createNotification(
      {
        userId:
          partner.applicantUserId,
        title:
          "Payout Requested",
        body: `Payout request ${payoutNumber} has been submitted for review.`,
        type:
          "servicePartnerPayoutRequested",
        actionURL:
          `/partner/wallet/payouts/${payoutRef.id}`,
        metadata: {
          payoutId:
            payoutRef.id,
          payoutNumber,
          amountPaise,
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
      payout,
      entry,
    };
}

         );

        return {
          payout: {
            id: payoutRef.id,
            ...result.payout,
            requestedAt:
              result.payout.requestedAt
                .toDate()
                .toISOString(),
            createdAt:
              result.payout.createdAt
                .toDate()
                .toISOString(),
            updatedAt:
              result.payout.updatedAt
                .toDate()
                .toISOString(),
          },
          wallet:
            serializeServicePartnerWallet(
              walletRef.id,
              result.wallet
            ),
          entry:
            serializeServicePartnerWalletEntry(
              entryRef.id,
              result.entry
            ),
        };
    }
  );
