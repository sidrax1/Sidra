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
  serializeServicePartnerEvent,
} from "./servicePartnerEventRepository";
import type {
  ServicePartnerEventDocument,
  ServicePartnerEventEntity,
  ServicePartnerEventSeverity,
} from "./servicePartnerEventTypes";

interface ListServicePartnerEventsInput {
  readonly entityType?: ServicePartnerEventEntity;
  readonly entityId?: string;
  readonly partnerId?: string;
  readonly assignmentId?: string;
  readonly severity?: ServicePartnerEventSeverity;
  readonly pageSize?: number;
  readonly cursorId?: string;
}

const validEntityTypes =
  new Set<ServicePartnerEventEntity>(
    [
      "application",
      "partner",
      "assignment",
      "inspection",
      "verification",
      "settlement",
    ]
  );

const validSeverities =
  new Set<ServicePartnerEventSeverity>(
    [
      "info",
      "success",
      "warning",
      "critical",
    ]
  );

export const listServicePartnerEvents =
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

      if (
        !hasPermission(
          actor,
          "servicePartners.readEvents"
        ) &&
        !hasPermission(
          actor,
          "servicePartners.manageAssignments"
        )
      ) {
        throw new HttpsError(
          "permission-denied",
          "Service-partner event access is required."
        );
      }

      const input =
        (request.data ??
          {}) as ListServicePartnerEventsInput;

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

      let query:
        FirebaseFirestore.Query =
        firestore
          .collection(
            "servicePartnerEvents"
          )
          .orderBy(
            "occurredAt",
            "desc"
          );

      if (input.entityType) {
        if (
          !validEntityTypes.has(
            input.entityType
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Event entity type is invalid."
          );
        }

        query = query.where(
          "entityType",
          "==",
          input.entityType
        );
      }

      if (
        input.entityId?.trim()
      ) {
        query = query.where(
          "entityId",
          "==",
          input.entityId.trim()
        );
      }

      if (
        input.partnerId?.trim()
      ) {
        query = query.where(
          "partnerId",
          "==",
          input.partnerId.trim()
        );
      }

      if (
        input.assignmentId?.trim()
      ) {
        query = query.where(
          "assignmentId",
          "==",
          input.assignmentId.trim()
        );
      }

      if (input.severity) {
        if (
          !validSeverities.has(
            input.severity
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Event severity is invalid."
          );
        }

        query = query.where(
          "severity",
          "==",
          input.severity
        );
      }

      if (
        input.cursorId?.trim()
      ) {
        const cursorSnapshot =
          await firestore
            .collection(
              "servicePartnerEvents"
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
            "Event cursor is invalid."
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
        events: documents.map(
          (document) =>
            serializeServicePartnerEvent(
              document.id,
              document.data() as ServicePartnerEventDocument
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
