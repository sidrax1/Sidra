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

interface GetServicePartnerSettlementInput {
  readonly settlementId: string;
}

export const getServicePartnerSettlement =
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
        request.data as Partial<GetServicePartnerSettlementInput>;

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

      const settlementSnapshot =
        await settlementReference(
          settlementId
        ).get();

      if (
        !settlementSnapshot.exists
      ) {
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
          "servicePartners.readSettlements"
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

        const partnerOwnerId =
          partnerSnapshot.data()
            ?.applicantUserId;

        if (
          actor.uid !==
            settlement.applicantUserId &&
          actor.uid !==
            partnerOwnerId
        ) {
          throw new HttpsError(
            "permission-denied",
            "You are not authorised to view this settlement."
          );
        }
      }

      const result =
        await getSettlementWithLines(
          settlementId
        );

      return result;
    }
  );
