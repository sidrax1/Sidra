import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  requireAuthenticatedActor,
  requirePermission,
} from "./servicePartnerRepository";
import type {
  ServicePartnerDocument,
} from "./servicePartnerTypes";

interface ExportServicePartnerReportInput {
  readonly statuses?: readonly string[];
  readonly state?: string;
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

export const exportServicePartnerReport =
  onCall(
    {
      region:
        "asia-south1",
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

      requirePermission(
        actor,
        "servicePartners.export"
      );

      const input =
        (request.data ??
          {}) as ExportServicePartnerReportInput;

      if (
        input.format &&
        input.format !== "csv"
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Only CSV export is currently supported."
        );
      }

      let query:
        FirebaseFirestore.Query =
        firestore.collection(
          "servicePartners"
        );

      if (
        input.statuses?.length
      ) {
        const statuses =
          input.statuses
            .filter(
              (status) =>
                typeof status ===
                  "string" &&
                status.trim()
            )
            .slice(0, 10);

        query = query.where(
          "status",
          "in",
          statuses
        );
      }

      if (
        input.state?.trim()
      ) {
        query = query.where(
          "coverageStateKeys",
          "array-contains",
          input.state
            .trim()
            .toLowerCase()
        );
      }

      const snapshot =
        await query
          .orderBy(
            "createdAt",
            "desc"
          )
          .limit(5000)
          .get();

      const partners =
        snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...(document.data() as ServicePartnerDocument),
          })
        );

      const headers = [
        "Partner ID",
        "Partner Number",
        "Display Name",
        "Legal Name",
        "Partner Type",
        "Status",
        "Verification Status",
        "Risk Score",
        "City",
        "State",
        "Email",
        "Phone",
        "Accepting Assignments",
        "Current Assignments",
        "Maximum Assignments",
        "Quality Score",
        "Customer Rating",
        "Completed Assignments",
        "Capabilities",
        "Created At",
      ];

      const rows =
        partners.map((partner) =>
          [
            partner.id,
            partner.partnerNumber,
            partner.displayName,
            partner.legalName,
            partner.partnerType,
            partner.status,
            partner.verification
              .status,
            partner.verification
              .riskScore,
            partner.registeredAddress
              .city,
            partner.registeredAddress
              .state,
            partner.contact.email,
            partner.contact
              .phoneNumber,
            partner.acceptingAssignments
              ? "Yes"
              : "No",
            partner.currentAssignmentCount,
            partner.maximumConcurrentAssignments,
            partner.performance
              .qualityScore,
            partner.performance
              .customerRating,
            partner.performance
              .completedAssignments,
            partner.capabilityKeys.join(
              " | "
            ),
            partner.createdAt
              .toDate()
              .toISOString(),
          ]
            .map(escapeCSV)
            .join(",")
        );

      const csv = [
        headers
          .map(escapeCSV)
          .join(","),
        ...rows,
      ].join("\n");

      const generatedAt =
        new Date().toISOString();

      return {
        report: {
          format: "csv",
          fileName: `sidra-service-partners-${generatedAt.slice(
            0,
            10
          )}.csv`,
          mimeType:
            "text/csv;charset=utf-8",
          content: csv,
          recordCount:
            partners.length,
          generatedAt,
          generatedBy:
            actor.uid,
        },
      };
    }
  );
