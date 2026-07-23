import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  partnerReference,
  requireAuthenticatedActor,
} from "../servicePartnerRepository";
import {
  hasPermission,
} from "../servicePartnerAuthorization";
import {

  getSettlementWithLines,
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
} from "./servicePartnerSettlementTypes";

interface ExportSettlementStatementInput {
  readonly settlementId: string;
  readonly format?: "csv";
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

function rupeesFromPaise(
  value: number
): string {
  return (
    value / 100
  ).toFixed(2);
}

export const exportServicePartnerSettlementStatement =
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

 const input =
  request.data as Partial<ExportSettlementStatementInput>;

 const settlementId =
  typeof input.settlementId ===
    "string"
    ? input.settlementId.trim()
    : "";

 if (!settlementId) {
   throw new HttpsError(
     "invalid-argument",
     "Settlement ID is required."
   );
 }

 if (
   input.format &&
   input.format !== "csv"
 ){
   throw new HttpsError(
      "invalid-argument",
      "Only CSV settlement statements are currently supported."
   );
 }

 const settlementSnapshot =
  await settlementReference(
    settlementId
  ).get();

 if (
   !settlementSnapshot.exists
 ){
   throw new HttpsError(
      "not-found",
      "Service-partner settlement was not found."

    );
}

const settlement =
 settlementSnapshot.data() as ServicePartnerSettlementDocument;

const privileged =
 hasPermission(
   actor,
   "servicePartners.exportSettlements"
 ) ||
 hasPermission(
   actor,
   "servicePartners.manageSettlements"
 );

if (!privileged) {
  const partnerSnapshot =
    await partnerReference(
      settlement.partnerId
    ).get();

    if (
      actor.uid !==
         settlement.applicantUserId &&
      actor.uid !==
         partnerSnapshot.data()
          ?.applicantUserId
    ){
      throw new HttpsError(
         "permission-denied",
         "You are not authorised to export this settlement."
      );
    }
}

const result =
 await getSettlementWithLines(
   settlementId
 );

const headers = [
 "Settlement Number",
 "Partner Number",

  "Partner Name",
  "Period Start",
  "Period End",
  "Status",
  "Line ID",
  "Line Type",
  "Reference Type",
  "Reference ID",
  "Title",
  "Gross Amount INR",
  "Deduction INR",
  "Net Amount INR",
  "Taxable",
  "Created At",
];

const rows =
 result.lines.map(
  (line) =>
    [
      result.settlement
        .settlementNumber,
      result.settlement
        .partnerNumber,
      result.settlement
        .partnerName,
      result.settlement
        .periodStart,
      result.settlement
        .periodEnd,
      result.settlement
        .status,
      line.id,
      line.type,
      line.referenceType,
      line.referenceId,
      line.title,
      rupeesFromPaise(
        line.grossAmountPaise
      ),
      rupeesFromPaise(
        line.deductionAmountPaise
      ),
      rupeesFromPaise(

            line.netAmountPaise
          ),
          line.taxable
            ? "Yes"
            : "No",
          line.createdAt,
      ]
          .map(escapeCSV)
          .join(",")
 );

const summaryRows = [
 [],
 [
   "SUMMARY",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "Gross Amount",
   rupeesFromPaise(
     result.settlement.totals
       .grossAmountPaise
   ),
 ],
 [
   "SUMMARY",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "Total Deductions",
   rupeesFromPaise(
     result.settlement.totals

     .totalDeductionsPaise
    ),
  ],
  [
    "SUMMARY",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Net Payable",
    rupeesFromPaise(
      result.settlement.totals
        .netPayablePaise
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
  ...summaryRows,
].join("\n");

const generatedAt =
 new Date().toISOString();

return {
 statement: {
   fileName: `${result.settlement.settlementNumber.toLowerCase()}-statement.csv`,
   mimeType:
     "text/csv;charset=utf-8",
   format: "csv",
   content: csv,

            generatedAt,
            generatedBy:
              actor.uid,
            lineCount:
              result.lines.length,
            settlementId,
            settlementNumber:
              result.settlement
               .settlementNumber,
          },
        };
    }
  );
