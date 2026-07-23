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
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import {

  settlementProfileReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementBankSnapshot,
  ServicePartnerSettlementCycle,
  ServicePartnerSettlementProfileDocument,
} from "./servicePartnerSettlementTypes";

interface UpdateSettlementProfileInput {
  readonly partnerId: string;
  readonly settlementCycle: ServicePartnerSettlementCycle;
  readonly commissionPercentage: number;
  readonly platformFeePercentage: number;
  readonly taxDeductionPercentage: number;
  readonly settlementHoldDays: number;
  readonly minimumSettlementPaise: number;
  readonly automaticSettlementEnabled: boolean;
  readonly bankAccount?: {
    readonly accountHolderName: string;
    readonly bankName: string;
    readonly accountNumberLastFour: string;
    readonly ifscCode: string;
    readonly accountType:
     | "savings"
     | "current";
    readonly verified: boolean;
  };
}

const allowedCycles =
 new Set<ServicePartnerSettlementCycle>(
   [
     "weekly",
     "fortnightly",
     "monthly",
     "manual",
   ]
 );

function validatePercentage(
  value: unknown,
  label: string
): number {
  if (

      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ){
      throw new HttpsError(
        "invalid-argument",
        `${label} must be between 0 and 100.`
      );
    }

    return Number(
      value.toFixed(4)
    );
}

export const updateServicePartnerSettlementProfile =
 onCall(
  {
    region:
      "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 90,
    memory: "512MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

      requirePermission(
        actor,
        "servicePartners.manageSettlementProfiles"
      );

      const input =
       request.data as Partial<UpdateSettlementProfileInput>;

      const partnerId =
       typeof input.partnerId ===
         "string"
         ? input.partnerId.trim()

  : "";

if (!partnerId) {
  throw new HttpsError(
    "invalid-argument",
    "Partner ID is required."
  );
}

if (
  !input.settlementCycle ||
  !allowedCycles.has(
     input.settlementCycle
  )
){
  throw new HttpsError(
     "invalid-argument",
     "Settlement cycle is invalid."
  );
}

const commissionPercentage =
 validatePercentage(
   input.commissionPercentage,
   "Commission percentage"
 );

const platformFeePercentage =
 validatePercentage(
   input.platformFeePercentage,
   "Platform fee percentage"
 );

const taxDeductionPercentage =
 validatePercentage(
   input.taxDeductionPercentage,
   "Tax deduction percentage"
 );

if (
  commissionPercentage +
     platformFeePercentage >
  100
){

    throw new HttpsError(
      "invalid-argument",
      "Commission and platform fee percentages cannot exceed 100% when combined."
    );
}

if (
  !Number.isInteger(
     input.settlementHoldDays
  ) ||
  input.settlementHoldDays! <
     0 ||
  input.settlementHoldDays! >
     180
){
  throw new HttpsError(
     "invalid-argument",
     "Settlement hold days must be an integer between 0 and 180."
  );
}

if (
  !Number.isInteger(
     input.minimumSettlementPaise
  ) ||
  input.minimumSettlementPaise! <
     0 ||
  input.minimumSettlementPaise! >
     100_000_000
){
  throw new HttpsError(
     "invalid-argument",
     "Minimum settlement amount is invalid."
  );
}

if (
  typeof input.automaticSettlementEnabled !==
  "boolean"
){
  throw new HttpsError(
     "invalid-argument",
     "Automatic settlement enabled must be a boolean."
  );

}

const partnerSnapshot =
 await partnerReference(
   partnerId
 ).get();

if (
  !partnerSnapshot.exists
){
  throw new HttpsError(
     "not-found",
     "Service partner was not found."
  );
}

let bankAccount:
  | ServicePartnerSettlementBankSnapshot
  | undefined;

if (input.bankAccount) {
  const accountHolderName =
    input.bankAccount
      .accountHolderName
      ?.trim();

    const bankName =
     input.bankAccount
       .bankName
       ?.trim();

    const accountNumberLastFour =
     input.bankAccount
       .accountNumberLastFour
       ?.trim();

    const ifscCode =
     input.bankAccount
       .ifscCode
       ?.trim()
       .toUpperCase();

    if (
      !accountHolderName ||

  accountHolderName.length <
    2 ||
  accountHolderName.length >
    120
){
  throw new HttpsError(
    "invalid-argument",
    "Bank account holder name is invalid."
  );
}

if (
  !bankName ||
  bankName.length < 2 ||
  bankName.length > 120
){
  throw new HttpsError(
     "invalid-argument",
     "Bank name is invalid."
  );
}

if (
  !/^\d{4}$/.test(
     accountNumberLastFour
  )
){
  throw new HttpsError(
     "invalid-argument",
     "Bank account last four digits must contain exactly four numbers."
  );
}

if (
  !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
     ifscCode
  )
){
  throw new HttpsError(
     "invalid-argument",
     "IFSC code is invalid."
  );
}

    if (
      ![
         "savings",
         "current",
      ].includes(
         input.bankAccount
           .accountType
      )
    ){
      throw new HttpsError(
         "invalid-argument",
         "Bank account type is invalid."
      );
    }

    bankAccount = {
      accountHolderName,
      bankName,
      accountNumberLastFour,
      ifscCode,
      accountType:
        input.bankAccount
          .accountType,
      verified:
        input.bankAccount
          .verified,
      verifiedAt:
        input.bankAccount
          .verified
          ? Timestamp.now()
          : undefined,
    };
}

const profileRef =
 settlementProfileReference(
   partnerId
 );

const profile =
 await firestore.runTransaction(
  async (transaction) => {
   const existingSnapshot =
    await transaction.get(

   profileRef
 );

const now =
 Timestamp.now();

const existing =
 existingSnapshot.exists
  ? (existingSnapshot.data() as ServicePartnerSettlementProfileDocument)
  : undefined;

const document: ServicePartnerSettlementProfileDocument =
 {
   partnerId,
   settlementCycle:
    input.settlementCycle!,
   commissionPercentage,
   platformFeePercentage,
   taxDeductionPercentage,
   settlementHoldDays:
    input.settlementHoldDays!,
   minimumSettlementPaise:
    input.minimumSettlementPaise!,
   automaticSettlementEnabled:
    input.automaticSettlementEnabled!,
   bankAccount:
    bankAccount ??
    existing?.bankAccount,
   createdAt:
    existing?.createdAt ??
    now,
   updatedAt: now,
 };

transaction.set(
  profileRef,
  document,
  {
    merge: false,
  }
);

await createAuditLog(
 {

           actor,
           action:
             "servicePartnerSettlementProfile.updated",
           entityType:
             "partner",
           entityId:
             partnerId,
           metadata: {
             previousProfile:
              existing ?? null,
             settlementCycle:
              document.settlementCycle,
             commissionPercentage:
              document.commissionPercentage,
             platformFeePercentage:
              document.platformFeePercentage,
             taxDeductionPercentage:
              document.taxDeductionPercentage,
             settlementHoldDays:
              document.settlementHoldDays,
             minimumSettlementPaise:
              document.minimumSettlementPaise,
             automaticSettlementEnabled:
              document.automaticSettlementEnabled,
             bankAccountUpdated:
              Boolean(bankAccount),
           },
         },
         transaction
       );

       return document;
   }
 );

return {
 profile: {
   ...profile,
   bankAccount:
     profile.bankAccount
      ?{
         ...profile.bankAccount,
         verifiedAt:
           profile.bankAccount

                  .verifiedAt
                  ?.toDate()
                  .toISOString(),
                 }
               : undefined,
            createdAt:
             profile.createdAt
               .toDate()
               .toISOString(),
            updatedAt:
             profile.updatedAt
               .toDate()
               .toISOString(),
          },
        };
    }
  );
