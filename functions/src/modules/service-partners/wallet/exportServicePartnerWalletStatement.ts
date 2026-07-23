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
  servicePartnerWalletCollections,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
} from "./servicePartnerWalletTypes";

interface ExportServicePartnerWalletStatementInput {
  readonly partnerId?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly format?: "csv";
}

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

    const date =
     new Date(value);

    if (
      Number.isNaN(
         date.getTime()
      )
    ){
      throw new HttpsError(
         "invalid-argument",
         `${label} is invalid.`
      );
    }

    return Timestamp.fromDate(
      date
    );
}

function escapeCSV(
  value: unknown
): string {
  const normalized =
   value === null ||
   value === undefined
     ? ""
     : String(value);

    return `"${normalized.replace(
      /"/g,
      '""'
    )}"`;
}

function rupees(
  paise: number
): string {
  return (
    paise / 100
  ).toFixed(2);
}

export const exportServicePartnerWalletStatement =

onCall(
 {
   region: "asia-south1",
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

  const input =
   (request.data ??
     {}) as ExportServicePartnerWalletStatementInput;

  if (
    input.format &&
    input.format !== "csv"
  ){
    throw new HttpsError(
       "invalid-argument",
       "Only CSV wallet statements are currently supported."
    );
  }

  const privileged =
   hasPermission(
     actor,
     "servicePartners.exportWallets"
   ) ||
   hasPermission(
     actor,
     "servicePartners.manageWallets"
   );

  let partnerId =
    input.partnerId?.trim();

  let partner:
    | ServicePartnerDocument
    | undefined;

if (partnerId) {
  const partnerSnapshot =
    await partnerReference(
      partnerId
    ).get();

 if (!partnerSnapshot.exists) {
   throw new HttpsError(
     "not-found",
     "Service partner was not found."
   );
 }

 partner =
  partnerSnapshot.data() as ServicePartnerDocument;

  if (
    !privileged &&
    partner.applicantUserId !==
       actor.uid
  ){
    throw new HttpsError(
       "permission-denied",
       "You cannot export the wallet statement for this service partner."
    );
  }
} else {
  if (privileged) {
    throw new HttpsError(
       "invalid-argument",
       "Partner ID is required for administrative wallet exports."
    );
  }

 const partnerSnapshot =
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

    if (
      partnerSnapshot.empty
    ){
      throw new HttpsError(
         "not-found",
         "No service-partner profile is associated with this account."
      );
    }

    partnerId =
     partnerSnapshot.docs[0]!
      .id;

    partner =
     partnerSnapshot.docs[0]!
      .data() as ServicePartnerDocument;
}

const walletSnapshot =
 await servicePartnerWalletReference(
   partnerId
 ).get();

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

const dateFrom =
 parseOptionalTimestamp(
   input.dateFrom,
   "Statement start date"
 );

const dateTo =
 parseOptionalTimestamp(
   input.dateTo,
   "Statement end date"
 );

if (
  dateFrom &&
  dateTo &&
  dateFrom.toMillis() >
     dateTo.toMillis()
){
  throw new HttpsError(
     "invalid-argument",
     "Statement start date cannot be after end date."
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
      "asc"
    );

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

const entrySnapshot =
 await query
  .limit(10_000)
  .get();

const entries =
 entrySnapshot.docs.map(
   (document) => ({
     id: document.id,
     ...(document.data() as ServicePartnerWalletEntryDocument),
   })
 );

const headers = [
  "Entry ID",
  "Entry Number",
  "Created At",
  "Type",
  "Direction",
  "Status",
  "Reference Type",
  "Reference ID",
  "Title",
  "Description",
  "Amount INR",
  "Balance Impact INR",
  "Available Before INR",
  "Available After INR",
  "Pending Before INR",
  "Pending After INR",
  "Held Before INR",
  "Held After INR",
];

const rows =
 entries.map((entry) =>
  [

      entry.id,
      entry.entryNumber,
      entry.createdAt
        .toDate()
        .toISOString(),
      entry.entryType,
      entry.direction,
      entry.status,
      entry.referenceType,
      entry.referenceId,
      entry.title,
      entry.description ??
        "",
      rupees(
        entry.amountPaise
      ),
      rupees(
        entry.balanceImpactPaise
      ),
      rupees(
        entry.availableBalanceBeforePaise
      ),
      rupees(
        entry.availableBalanceAfterPaise
      ),
      rupees(
        entry.pendingBalanceBeforePaise
      ),
      rupees(
        entry.pendingBalanceAfterPaise
      ),
      rupees(
        entry.heldBalanceBeforePaise
      ),
      rupees(
        entry.heldBalanceAfterPaise
      ),
  ]
      .map(escapeCSV)
      .join(",")
 );

const summary = [
 [],

[
  "WALLET SUMMARY",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Partner",
  partner.displayName,
],
[
  "WALLET SUMMARY",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Partner Number",
  partner.partnerNumber,
],
[
  "WALLET SUMMARY",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Available Balance INR",
  rupees(
    wallet.balances
      .availablePaise
  ),
],
[
  "WALLET SUMMARY",
  "",
  "",
  "",

  "",
  "",
  "",
  "",
  "Pending Balance INR",
  rupees(
    wallet.balances
      .pendingPaise
  ),
],
[
  "WALLET SUMMARY",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Held Balance INR",
  rupees(
    wallet.balances
      .heldPaise
  ),
],
[
  "WALLET SUMMARY",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "Lifetime Credits INR",
  rupees(
    wallet.balances
      .lifetimeCreditsPaise
  ),
],
[
  "WALLET SUMMARY",
  "",
  "",

    "",
    "",
    "",
    "",
    "",
    "Lifetime Debits INR",
    rupees(
      wallet.balances
        .lifetimeDebitsPaise
    ),
  ],
  [
    "WALLET SUMMARY",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Lifetime Paid INR",
    rupees(
      wallet.balances
        .lifetimePaidPaise
    ),
  ],
].map((row) =>
  row
    .map(escapeCSV)
    .join(",")
);

const csv = [
  headers
    .map(escapeCSV)
    .join(","),
  ...rows,
  ...summary,
].join("\n");

const generatedAt =
 new Date().toISOString();

return {

       statement: {
         format: "csv",
         mimeType:
           "text/csv;charset=utf-8",
         fileName:
`${partner.partnerNumber.toLowerCase()}-wallet-statement-${generatedAt.slice(
           0,
           10
         )}.csv`,
         content: csv,
         partnerId,
         partnerNumber:
           partner.partnerNumber,
         recordCount:
           entries.length,
         generatedAt,
         generatedBy:
           actor.uid,
         dateFrom:
           dateFrom
             ?.toDate()
             .toISOString() ??
           null,
         dateTo:
           dateTo
             ?.toDate()
             .toISOString() ??
           null,
       },
     };
   }
 );
