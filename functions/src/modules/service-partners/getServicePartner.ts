import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  partnerReference,
  requireAuthenticatedActor,
} from "./servicePartnerRepository";
import {
  requireAnyPermission,
  requireMatchingUser,
} from "./servicePartnerAuthorization";
import {
  serializeServicePartner,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerDocument,
} from "./servicePartnerTypes";

interface GetServicePartnerInput {
  readonly partnerId: string;
}

export const getServicePartner =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 30,
      memory: "256MiB",
    },
    async (request) => {
      const actor =
        requireAuthenticatedActor(
          request
        );

      const input =
        request.data as Partial<GetServicePartnerInput>;

      const partnerId =
        typeof input.partnerId ===
          "string"
          ? input.partnerId.trim()
          : "";

      if (!partnerId) {
        throw new HttpsError(
          "invalid-argument",
          "Service partner ID is required."
        );
      }

      const snapshot =
        await partnerReference(
          partnerId
        ).get();

      if (!snapshot.exists) {
        throw new HttpsError(
          "not-found",
          "Service partner was not found."
        );
      }

      const partner =
        snapshot.data() as ServicePartnerDocument;

      const publicStatuses =
        new Set([
          "active",
          "temporarilyUnavailable",
        ]);

      if (
        !publicStatuses.has(
          partner.status
        )
      ) {
        try {
          requireMatchingUser(
            actor,
            partner.applicantUserId,
            "servicePartners.readRestricted"
          );
        } catch {
          requireAnyPermission(
            actor,
            [
              "servicePartners.read",
              "servicePartners.readRestricted",
            ]
          );
        }
      }

      return {
        partner:
          serializeServicePartner(
            snapshot.id,
            partner
          ),
      };
    }
  );
