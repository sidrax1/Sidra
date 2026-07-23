import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  normalizeLookupKey,
  requireAuthenticatedActor,
} from "./servicePartnerRepository";
import {
  serializeServicePartner,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerCapability,
  ServicePartnerDocument,
  ServicePartnerStatus,
  ServicePartnerType,
} from "./servicePartnerTypes";

interface ListServicePartnersInput {
  readonly statuses?: readonly ServicePartnerStatus[];
  readonly partnerTypes?: readonly ServicePartnerType[];
  readonly capabilities?: readonly ServicePartnerCapability[];
  readonly state?: string;
  readonly city?: string;
  readonly acceptingAssignments?: boolean;
  readonly minimumQualityScore?: number;
  readonly pageSize?: number;
  readonly cursorId?: string;
}

const validStatuses =
  new Set<ServicePartnerStatus>(
    [
      "pendingVerification",
      "active",
      "temporarilyUnavailable",
      "suspended",
      "rejected",
      "archived",
    ]
  );

const validPartnerTypes =
  new Set<ServicePartnerType>(
    [
      "repairStudio",
      "inspectionCentre",
      "logisticsPartner",
      "installationPartner",
      "restorationSpecialist",
      "qualityAssuranceCentre",
      "multiServicePartner",
    ]
  );

export const listServicePartners =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 60,
      memory: "512MiB",
    },
    async (request) => {
      requireAuthenticatedActor(
        request
      );

      const input =
        (request.data ??
          {}) as ListServicePartnersInput;

      const pageSize =
        Math.min(
          Math.max(
            Number.isInteger(
              input.pageSize
            )
              ? input.pageSize!
              : 20,
            1
          ),
          50
        );

      let query:
        FirebaseFirestore.Query =
        firestore
          .collection(
            "servicePartners"
          )
          .orderBy(
            "performance.qualityScore",
            "desc"
          )
          .orderBy(
            "createdAt",
            "desc"
          );

      if (
        input.statuses?.length
      ) {
        if (
          input.statuses.some(
            (status) =>
              !validStatuses.has(
                status
              )
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "One or more service-partner statuses are invalid."
          );
        }

        query = query.where(
          "status",
          "in",
          input.statuses.slice(
            0,
            10
          )
        );
      }

      if (
        input.partnerTypes
          ?.length
      ) {
        if (
          input.partnerTypes.some(
            (partnerType) =>
              !validPartnerTypes.has(
                partnerType
              )
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "One or more service-partner types are invalid."
          );
        }

        query = query.where(
          "partnerType",
          "in",
          input.partnerTypes.slice(
            0,
            10
          )
        );
      }

      if (
        input.capabilities
          ?.length
      ) {
        query = query.where(
          "capabilityKeys",
          "array-contains-any",
          input.capabilities.slice(
            0,
            10
          )
        );
      }

      if (input.state?.trim()) {
        query = query.where(
          "coverageStateKeys",
          "array-contains",
          normalizeLookupKey(
            input.state
          )
        );
      }

      if (input.city?.trim()) {
        query = query.where(
          "coverageCityKeys",
          "array-contains",
          normalizeLookupKey(
            input.city
          )
        );
      }

      if (
        typeof input.acceptingAssignments ===
        "boolean"
      ) {
        query = query.where(
          "acceptingAssignments",
          "==",
          input.acceptingAssignments
        );
      }

      if (
        typeof input.minimumQualityScore ===
        "number"
      ) {
        if (
          input.minimumQualityScore <
            0 ||
          input.minimumQualityScore >
            100
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Minimum quality score must be between 0 and 100."
          );
        }

        query = query.where(
          "performance.qualityScore",
          ">=",
          input.minimumQualityScore
        );
      }

      if (
        input.cursorId?.trim()
      ) {
        const cursorSnapshot =
          await firestore
            .collection(
              "servicePartners"
            )
            .doc(
              input.cursorId.trim()
            )
            .get();

        if (
          !cursorSnapshot.exists
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Service-partner cursor is invalid."
          );
        }

        query =
          query.startAfter(
            cursorSnapshot
          );
      }

      const snapshot =
        await query
          .limit(
            pageSize + 1
          )
          .get();

      const documents =
        snapshot.docs.slice(
          0,
          pageSize
        );

      return {
        partners:
          documents.map(
            (document) =>
              serializeServicePartner(
                document.id,
                document.data() as ServicePartnerDocument
              )
          ),
        nextCursorId:
          snapshot.docs.length >
          pageSize
            ? documents.at(-1)
                ?.id ?? null
            : null,
        hasMore:
          snapshot.docs.length >
          pageSize,
      };
    }
  );
