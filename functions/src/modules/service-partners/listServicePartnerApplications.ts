import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  requireAuthenticatedActor,
} from "./servicePartnerRepository";
import {
  hasPermission,
} from "./servicePartnerAuthorization";
import {
  serializeServicePartnerApplication,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerApplicationDocument,
  ServicePartnerApplicationStatus,
  ServicePartnerType,
} from "./servicePartnerTypes";

interface ListServicePartnerApplicationsInput {
  readonly applicantUserId?: string;
  readonly statuses?: readonly ServicePartnerApplicationStatus[];
  readonly partnerTypes?: readonly ServicePartnerType[];
  readonly reviewerId?: string;
  readonly pageSize?: number;
  readonly cursorId?: string;
}

const validStatuses =
  new Set<ServicePartnerApplicationStatus>(
    [
      "draft",
      "submitted",
      "underReview",
      "additionalInformationRequired",
      "approved",
      "rejected",
      "withdrawn",
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

export const listServicePartnerApplications =
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
      const actor =
        requireAuthenticatedActor(
          request
        );

      const input =
        (request.data ??
          {}) as ListServicePartnerApplicationsInput;

      const canReview =
        hasPermission(
          actor,
          "servicePartners.review"
        ) ||
        hasPermission(
          actor,
          "servicePartners.readApplications"
        );

      const applicantUserId =
        canReview
          ? input.applicantUserId?.trim()
          : actor.uid;

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
            "servicePartnerApplications"
          )
          .orderBy(
            "createdAt",
            "desc"
          );

      if (applicantUserId) {
        query = query.where(
          "applicantUserId",
          "==",
          applicantUserId
        );
      }

      if (
        input.statuses?.length
      ) {
        const statuses =
          input.statuses.filter(
            (status) =>
              validStatuses.has(
                status
              )
          );

        if (
          statuses.length !==
          input.statuses.length
        ) {
          throw new HttpsError(
            "invalid-argument",
            "One or more application statuses are invalid."
          );
        }

        query = query.where(
          "status",
          "in",
          statuses.slice(
            0,
            10
          )
        );
      }

      if (
        input.partnerTypes
          ?.length
      ) {
        const partnerTypes =
          input.partnerTypes.filter(
            (partnerType) =>
              validPartnerTypes.has(
                partnerType
              )
          );

        if (
          partnerTypes.length !==
          input.partnerTypes.length
        ) {
          throw new HttpsError(
            "invalid-argument",
            "One or more partner types are invalid."
          );
        }

        query = query.where(
          "partnerType",
          "in",
          partnerTypes.slice(
            0,
            10
          )
        );
      }

      if (
        input.reviewerId?.trim()
      ) {
        if (!canReview) {
          throw new HttpsError(
            "permission-denied",
            "Reviewer filtering is restricted."
          );
        }

        query = query.where(
          "reviewerId",
          "==",
          input.reviewerId.trim()
        );
      }

      if (
        input.cursorId?.trim()
      ) {
        const cursorSnapshot =
          await firestore
            .collection(
              "servicePartnerApplications"
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
            "Application cursor is invalid."
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
        applications:
          documents.map(
            (document) =>
              serializeServicePartnerApplication(
                document.id,
                document.data() as ServicePartnerApplicationDocument
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
