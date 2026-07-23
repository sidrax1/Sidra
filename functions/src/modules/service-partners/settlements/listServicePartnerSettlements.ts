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
import {
  serializeSettlement,
  settlementCollections,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementCycle,
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementStatus,
} from "./servicePartnerSettlementTypes";

interface ListServicePartnerSettlementsInput {
  readonly partnerId?: string;
  readonly statuses?: readonly ServicePartnerSettlementStatus[];
  readonly cycles?: readonly ServicePartnerSettlementCycle[];
  readonly periodStart?: string;
  readonly periodEnd?: string;
  readonly pageSize?: number;
  readonly cursorId?: string;
}

const validStatuses =
  new Set<ServicePartnerSettlementStatus>(
    [
      "draft",
      "calculated",
      "underReview",
      "approved",
      "processing",
      "paid",
      "failed",
      "cancelled",
      "onHold",
    ]
  );

const validCycles =
  new Set<ServicePartnerSettlementCycle>(
    [
      "weekly",
      "fortnightly",
      "monthly",
      "manual",
    ]
  );

export const listServicePartnerSettlements =
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
          {}) as ListServicePartnerSettlementsInput;

      const privileged =
        hasPermission(
          actor,
          "servicePartners.readSettlements"
        ) ||
        hasPermission(
          actor,
          "servicePartners.manageSettlements"
        );

      const requestedPartnerId =
        input.partnerId?.trim();

      let partnerId =
        requestedPartnerId;

      if (
        requestedPartnerId &&
        !privileged
      ) {
        const partnerSnapshot =
          await partnerReference(
            requestedPartnerId
          ).get();

        if (
          !partnerSnapshot.exists ||
          partnerSnapshot.data()
            ?.applicantUserId !==
            actor.uid
        ) {
          throw new HttpsError(
            "permission-denied",
            "You cannot access settlements for this partner."
          );
        }
      }

      if (
        !partnerId &&
        !privileged
      ) {
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

        if (
          ownedPartnerSnapshot.empty
        ) {
          return {
            settlements: [],
            hasMore: false,
            nextCursorId: null,
          };
        }

        partnerId =
          ownedPartnerSnapshot.docs[0]!
            .id;
      }

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
            settlementCollections.settlements
          )
          .orderBy(
            "periodEnd",
            "desc"
          )
          .orderBy(
            "createdAt",
            "desc"
          );

      if (partnerId) {
        query = query.where(
          "partnerId",
          "==",
          partnerId
        );
      }

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
            "One or more settlement statuses are invalid."
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
        input.cycles?.length
      ) {
        if (
          input.cycles.some(
            (cycle) =>
              !validCycles.has(
                cycle
              )
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "One or more settlement cycles are invalid."
          );
        }

        query = query.where(
          "cycle",
          "in",
          input.cycles.slice(
            0,
            10
          )
        );
      }

      if (
        input.periodStart
      ) {
        const periodStart =
          new Date(
            input.periodStart
          );

        if (
          Number.isNaN(
            periodStart.getTime()
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Settlement period start is invalid."
          );
        }

        query = query.where(
          "periodEnd",
          ">=",
          FirebaseFirestore.Timestamp.fromDate(
            periodStart
          )
        );
      }

      if (
        input.periodEnd
      ) {
        const periodEnd =
          new Date(
            input.periodEnd
          );

        if (
          Number.isNaN(
            periodEnd.getTime()
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Settlement period end is invalid."
          );
        }

        query = query.where(
          "periodEnd",
          "<=",
          FirebaseFirestore.Timestamp.fromDate(
            periodEnd
          )
        );
      }

      if (
        input.cursorId?.trim()
      ) {
        const cursorSnapshot =
          await firestore
            .collection(
              settlementCollections.settlements
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
            "Settlement cursor is invalid."
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
        settlements:
          documents.map(
            (document) =>
              serializeSettlement(
                document.id,
                document.data() as ServicePartnerSettlementDocument
              )
          ),
        hasMore:
          snapshot.docs.length >
          pageSize,
        nextCursorId:
          snapshot.docs.length >
          pageSize
            ? documents.at(-1)
                ?.id ?? null
            : null,
      };
    }
  );
