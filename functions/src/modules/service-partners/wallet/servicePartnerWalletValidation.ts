import {
  HttpsError,
} from "firebase-functions/v2/https";

import type {
  CreateServicePartnerWalletEntryInput,
  PlaceServicePartnerWalletHoldInput,
  ReleaseServicePartnerWalletHoldInput,
  ServicePartnerWalletEntryDirection,
  ServicePartnerWalletEntryStatus,
  ServicePartnerWalletEntryType,
  ServicePartnerWalletReferenceType,
  ServicePartnerWalletStatus,
  UpdateServicePartnerWalletStatusInput,
} from "./servicePartnerWalletTypes";

function invalid(
  message: string,
  details?: unknown
): never {
  throw new HttpsError(

      "invalid-argument",
      message,
      details
    );
}

function requireObject(
  value: unknown,
  label: string
): Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ){
    invalid(
       `${label} must be an object.`
    );
  }

    return value as Record<
     string,
     unknown
    >;
}

function requireString(
  value: unknown,
  label: string,
  minimumLength = 1,
  maximumLength = 2000
): string {
  if (
    typeof value !== "string"
  ){
    invalid(
       `${label} must be a string.`
    );
  }

    const normalized =
     value.trim();

    if (

      normalized.length <
        minimumLength ||
      normalized.length >
        maximumLength
    ){
      invalid(
        `${label} must contain between ${minimumLength} and ${maximumLength} characters.`
      );
    }

    return normalized;
}

function optionalString(
  value: unknown,
  label: string,
  maximumLength = 2000
): string | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ){
    return undefined;
  }

    return requireString(
      value,
      label,
      1,
      maximumLength
    );
}

function requirePositiveInteger(
  value: unknown,
  label: string,
  maximum = 100_000_000
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value <= 0 ||
    value > maximum

    ){
      invalid(
        `${label} must be a positive integer not exceeding ${maximum}.`
      );
    }

    return value;
}

function parseOptionalISODate(
  value: unknown,
  label: string
): string | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ){
    return undefined;
  }

    const normalized =
     requireString(
       value,
       label,
       20,
       40
     );

    const parsed =
     Date.parse(normalized);

    if (
      Number.isNaN(parsed)
    ){
      invalid(
         `${label} must be a valid ISO date-time value.`
      );
    }

    return new Date(
      parsed
    ).toISOString();
}

const entryTypes =
 new Set<ServicePartnerWalletEntryType>(
   [
     "settlementCredit",
     "assignmentCredit",
     "bonusCredit",
     "manualCredit",
     "refundRecoveryDebit",
     "disputeRecoveryDebit",
     "penaltyDebit",
     "platformFeeDebit",
     "taxDeductionDebit",
     "manualDebit",
     "payoutDebit",
     "payoutReversalCredit",
     "holdPlaced",
     "holdReleased",
     "adjustment",
   ]
 );

const entryDirections =
 new Set<ServicePartnerWalletEntryDirection>(
   [
     "credit",
     "debit",
     "neutral",
   ]
 );

const entryStatuses =
 new Set<ServicePartnerWalletEntryStatus>(
   [
     "pending",
     "available",
     "held",
     "settled",
     "reversed",
     "cancelled",
   ]
 );

const referenceTypes =

 new Set<ServicePartnerWalletReferenceType>(
   [
     "assignment",
     "settlement",
     "payout",
     "refund",
     "dispute",
     "adjustment",
     "system",
   ]
 );

const walletStatuses =
 new Set<ServicePartnerWalletStatus>(
   [
     "active",
     "restricted",
     "suspended",
     "closed",
   ]
 );

export function validateCreateWalletEntryInput(
  value: unknown
): CreateServicePartnerWalletEntryInput {
  const input =
   requireObject(
     value,
     "Request data"
   );

 const entryType =
  requireString(
    input.entryType,
    "Wallet entry type"
  ) as ServicePartnerWalletEntryType;

 const direction =
  requireString(
    input.direction,
    "Wallet entry direction"
  ) as ServicePartnerWalletEntryDirection;

 const status =

 requireString(
   input.status,
   "Wallet entry status"
 ) as ServicePartnerWalletEntryStatus;

const referenceType =
 requireString(
   input.referenceType,
   "Wallet reference type"
 ) as ServicePartnerWalletReferenceType;

if (
  !entryTypes.has(
     entryType
  )
){
  invalid(
     "Wallet entry type is invalid."
  );
}

if (
  !entryDirections.has(
     direction
  )
){
  invalid(
     "Wallet entry direction is invalid."
  );
}

if (
  !entryStatuses.has(
     status
  )
){
  invalid(
     "Wallet entry status is invalid."
  );
}

if (
  !referenceTypes.has(
     referenceType

  )
){
  invalid(
    "Wallet reference type is invalid."
  );
}

if (
  direction === "neutral" &&
  ![
     "holdPlaced",
     "holdReleased",
  ].includes(entryType)
){
  invalid(
     "Neutral wallet entries are only valid for hold operations."
  );
}

if (
  direction === "credit" &&
  [
     "refundRecoveryDebit",
     "disputeRecoveryDebit",
     "penaltyDebit",
     "platformFeeDebit",
     "taxDeductionDebit",
     "manualDebit",
     "payoutDebit",
  ].includes(entryType)
){
  invalid(
     "Selected wallet entry type requires a debit direction."
  );
}

if (
  direction === "debit" &&
  [
     "settlementCredit",
     "assignmentCredit",
     "bonusCredit",
     "manualCredit",
     "payoutReversalCredit",

  ].includes(entryType)
){
  invalid(
    "Selected wallet entry type requires a credit direction."
  );
}

const metadata =
 input.metadata ===
   undefined
   ? {}
   : requireObject(
       input.metadata,
       "Wallet entry metadata"
     );

return {
 partnerId:
   requireString(
     input.partnerId,
     "Partner ID",
     1,
     200
   ),
 entryType,
 direction,
 status,
 amountPaise:
   requirePositiveInteger(
     input.amountPaise,
     "Wallet entry amount"
   ),
 referenceType,
 referenceId:
   requireString(
     input.referenceId,
     "Reference ID",
     1,
     200
   ),
 title:
   requireString(
     input.title,
     "Wallet entry title",

          3,
          180
        ),
      description:
        optionalString(
          input.description,
          "Wallet entry description",
          3000
        ),
      idempotencyKey:
        requireString(
          input.idempotencyKey,
          "Idempotency key",
          8,
          250
        ),
      availableAt:
        parseOptionalISODate(
          input.availableAt,
          "Available date"
        ),
      metadata,
    };
}

export function validatePlaceWalletHoldInput(
  value: unknown
): PlaceServicePartnerWalletHoldInput {
  const input =
   requireObject(
     value,
     "Request data"
   );

    const referenceType =
     requireString(
       input.referenceType,
       "Hold reference type"
     );

    if (
      ![
         "settlement",
         "dispute",

        "refund",
        "investigation",
        "manual",
      ].includes(referenceType)
    ){
      invalid(
        "Wallet hold reference type is invalid."
      );
    }

    return {
      partnerId:
       requireString(
         input.partnerId,
         "Partner ID",
         1,
         200
       ),
      referenceType:
       referenceType as PlaceServicePartnerWalletHoldInput["referenceType"],
      referenceId:
       requireString(
         input.referenceId,
         "Reference ID",
         1,
         200
       ),
      amountPaise:
       requirePositiveInteger(
         input.amountPaise,
         "Hold amount"
       ),
      reason:
       requireString(
         input.reason,
         "Hold reason",
         10,
         2500
       ),
    };
}

export function validateReleaseWalletHoldInput(
 value: unknown

): ReleaseServicePartnerWalletHoldInput {
  const input =
   requireObject(
     value,
     "Request data"
   );

    return {
      holdId:
       requireString(
         input.holdId,
         "Wallet hold ID",
         1,
         200
       ),
      releaseNote:
       requireString(
         input.releaseNote,
         "Hold release note",
         10,
         2500
       ),
    };
}

export function validateUpdateWalletStatusInput(
  value: unknown
): UpdateServicePartnerWalletStatusInput {
  const input =
   requireObject(
     value,
     "Request data"
   );

    const status =
     requireString(
       input.status,
       "Wallet status"
     ) as ServicePartnerWalletStatus;

    if (
      !walletStatuses.has(
         status
      )

 ){
   invalid(
     "Wallet status is invalid."
   );
 }

 return {
   partnerId:
    requireString(
      input.partnerId,
      "Partner ID",
      1,
      200
    ),
   status,
   reason:
    requireString(
      input.reason,
      "Wallet status reason",
      10,
      2500
    ),
 };
}
