import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  partnerReference,
  requireAuthenticatedActor,
} from "../servicePartnerRepository";
import {
  hasPermission,
} from "../servicePartnerAuthorization";
import type {
  ServicePartnerDocument,
} from "../servicePartnerTypes";
import {
  serializeServicePartnerWalletEntry,
  servicePartnerWalletCollections,

} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletEntryDocument,
  ServicePartnerWalletEntryStatus,
  ServicePartnerWalletEntryType,
} from "./servicePartnerWalletTypes";

interface ListServicePartnerWalletEntriesInput {
  readonly partnerId?: string;
  readonly entryTypes?: readonly ServicePartnerWalletEntryType[];
  readonly statuses?: readonly ServicePartnerWalletEntryStatus[];
  readonly referenceType?:
   | "assignment"
   | "settlement"
   | "payout"
   | "refund"
   | "dispute"
   | "adjustment"
   | "system";
  readonly referenceId?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly minimumAmountPaise?: number;
  readonly maximumAmountPaise?: number;
  readonly pageSize?: number;
  readonly cursorId?: string;
}

const validEntryTypes =
 new Set<ServicePartnerWalletEntryType>([
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
 ]);

const validStatuses =
 new Set<ServicePartnerWalletEntryStatus>([
   "pending",
   "available",
   "held",
   "settled",
   "reversed",
   "cancelled",
 ]);

const validReferenceTypes = new Set([
  "assignment",
  "settlement",
  "payout",
  "refund",
  "dispute",
  "adjustment",
  "system",
]);

function parseOptionalTimestamp(
  value: unknown,
  label: string
): Timestamp | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ){
    return undefined;
  }

 if (typeof value !== "string") {
   throw new HttpsError(
     "invalid-argument",
     `${label} must be an ISO date-time string.`
   );
 }

 const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new HttpsError(
        "invalid-argument",
        `${label} is invalid.`
      );
    }

    return Timestamp.fromDate(date);
}

async function resolvePartnerForActor(
  actor: ReturnType<
   typeof requireAuthenticatedActor
  >,
  requestedPartnerId?: string
): Promise<{
  readonly partnerId: string;
  readonly partner: ServicePartnerDocument;
}> {
  const privileged =
   hasPermission(
     actor,
     "servicePartners.readWallets"
   ) ||
   hasPermission(
     actor,
     "servicePartners.manageWallets"
   );

    if (requestedPartnerId) {
      const snapshot =
        await partnerReference(
          requestedPartnerId
        ).get();

     if (!snapshot.exists) {
       throw new HttpsError(
         "not-found",
         "Service partner was not found."
       );
     }

     const partner =
      snapshot.data() as ServicePartnerDocument;

    if (
      !privileged &&
      partner.applicantUserId !== actor.uid
    ){
      throw new HttpsError(
         "permission-denied",
         "You cannot access wallet entries for this service partner."
      );
    }

    return {
      partnerId: snapshot.id,
      partner,
    };
}

if (privileged) {
  throw new HttpsError(
    "invalid-argument",
    "Partner ID is required for administrative wallet access."
  );
}

const snapshot =
 await firestore
  .collection("servicePartners")
  .where(
    "applicantUserId",
    "==",
    actor.uid
  )
  .limit(1)
  .get();

if (snapshot.empty) {
  throw new HttpsError(
    "not-found",
    "No service-partner profile is associated with this account."
  );
}

const document = snapshot.docs[0]!;

    return {
      partnerId: document.id,
      partner:
       document.data() as ServicePartnerDocument,
    };
}

export const listServicePartnerWalletEntries =
 onCall(
  {
    region: "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

      const input =
       (request.data ??
         {}) as ListServicePartnerWalletEntriesInput;

      const requestedPartnerId =
       input.partnerId?.trim();

      const {
       partnerId,
      }=
       await resolvePartnerForActor(
         actor,
         requestedPartnerId
       );

      const pageSize =
       Math.min(
        Math.max(
         Number.isInteger(
           input.pageSize
         )
           ? input.pageSize!

      : 25,
     1
   ),
   100
 );

if (
  input.entryTypes?.some(
     (entryType) =>
       !validEntryTypes.has(
         entryType
       )
  )
){
  throw new HttpsError(
     "invalid-argument",
     "One or more wallet entry types are invalid."
  );
}

if (
  input.statuses?.some(
     (status) =>
       !validStatuses.has(status)
  )
){
  throw new HttpsError(
     "invalid-argument",
     "One or more wallet entry statuses are invalid."
  );
}

if (
  input.referenceType &&
  !validReferenceTypes.has(
     input.referenceType
  )
){
  throw new HttpsError(
     "invalid-argument",
     "Wallet entry reference type is invalid."
  );
}

const dateFrom =
 parseOptionalTimestamp(
   input.dateFrom,
   "Start date"
 );

const dateTo =
 parseOptionalTimestamp(
   input.dateTo,
   "End date"
 );

if (
  dateFrom &&
  dateTo &&
  dateFrom.toMillis() >
     dateTo.toMillis()
){
  throw new HttpsError(
     "invalid-argument",
     "Start date cannot be after end date."
  );
}

const minimumAmountPaise =
 input.minimumAmountPaise;

const maximumAmountPaise =
 input.maximumAmountPaise;

if (
  minimumAmountPaise !== undefined &&
  (!Number.isInteger(
     minimumAmountPaise
  ) ||
     minimumAmountPaise < 0)
){
  throw new HttpsError(
     "invalid-argument",
     "Minimum wallet-entry amount must be a non-negative integer."
  );
}

if (

  maximumAmountPaise !== undefined &&
  (!Number.isInteger(
    maximumAmountPaise
  ) ||
    maximumAmountPaise < 0)
){
  throw new HttpsError(
    "invalid-argument",
    "Maximum wallet-entry amount must be a non-negative integer."
  );
}

if (
  minimumAmountPaise !== undefined &&
  maximumAmountPaise !== undefined &&
  minimumAmountPaise >
     maximumAmountPaise
){
  throw new HttpsError(
     "invalid-argument",
     "Minimum amount cannot exceed maximum amount."
  );
}

let query:
  FirebaseFirestore.Query =
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
      "desc"
    );

if (
  input.entryTypes?.length
){
  query = query.where(

      "entryType",
      "in",
      input.entryTypes.slice(
        0,
        10
      )
    );
}

if (
  input.statuses?.length
){
  query = query.where(
     "status",
     "in",
     input.statuses.slice(
       0,
       10
     )
  );
}

if (input.referenceType) {
  query = query.where(
    "referenceType",
    "==",
    input.referenceType
  );
}

if (
  input.referenceId?.trim()
){
  query = query.where(
     "referenceId",
     "==",
     input.referenceId.trim()
  );
}

if (dateFrom) {
  query = query.where(
    "createdAt",
    ">=",

      dateFrom
    );
}

if (dateTo) {
  query = query.where(
    "createdAt",
    "<=",
    dateTo
  );
}

if (
  minimumAmountPaise !== undefined
){
  query = query.where(
     "amountPaise",
     ">=",
     minimumAmountPaise
  );
}

if (
  maximumAmountPaise !== undefined
){
  query = query.where(
     "amountPaise",
     "<=",
     maximumAmountPaise
  );
}

if (
  input.cursorId?.trim()
){
  const cursorSnapshot =
     await firestore
      .collection(
        servicePartnerWalletCollections.entries
      )
      .doc(
        input.cursorId.trim()
      )
      .get();

    if (
      !cursorSnapshot.exists ||
      cursorSnapshot.data()
         ?.partnerId !== partnerId
    ){
      throw new HttpsError(
         "invalid-argument",
         "Wallet-entry cursor is invalid."
      );
    }

    query =
     query.startAfter(
       cursorSnapshot
     );
}

const snapshot =
 await query
  .limit(pageSize + 1)
  .get();

const documents =
 snapshot.docs.slice(
   0,
   pageSize
 );

return {
 entries:
   documents.map(
     (document) =>
      serializeServicePartnerWalletEntry(
        document.id,
        document.data() as ServicePartnerWalletEntryDocument
      )
   ),
 hasMore:
   snapshot.docs.length >
   pageSize,
 nextCursorId:
   snapshot.docs.length >
   pageSize

             ? documents.at(-1)?.id ??
               null
             : null,
        };
    }
  );
