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
  settlementProfileReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementProfileDocument,
} from "./servicePartnerSettlementTypes";

interface GetServicePartnerSettlementProfileInput {
  readonly partnerId?: string;
}

function serializeProfile(
  profile: ServicePartnerSettlementProfileDocument
): Record<string, unknown> {
  return {
    ...profile,
    bankAccount:
      profile.bankAccount
       ?{
           ...profile.bankAccount,
           verifiedAt:
             profile.bankAccount.verifiedAt
              ?.toDate()
              .toISOString(),
         }
       : undefined,
    createdAt:
      profile.createdAt
       .toDate()
       .toISOString(),
    updatedAt:
      profile.updatedAt
       .toDate()
       .toISOString(),
  };
}

export const getServicePartnerSettlementProfile =
 onCall(
  {
    region:
      "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 45,
    memory: "256MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
       request

    );

const input =
 (request.data ??
   {}) as GetServicePartnerSettlementProfileInput;

const privileged =
 hasPermission(
   actor,
   "servicePartners.readSettlementProfiles"
 ) ||
 hasPermission(
   actor,
   "servicePartners.manageSettlementProfiles"
 );

let partnerId =
  input.partnerId?.trim();

if (
  partnerId &&
  !privileged
){
  const partnerSnapshot =
     await partnerReference(
       partnerId
     ).get();

    if (
      !partnerSnapshot.exists ||
      partnerSnapshot.data()
         ?.applicantUserId !==
         actor.uid
    ){
      throw new HttpsError(
         "permission-denied",
         "You cannot access the settlement profile for this partner."
      );
    }
}

if (
  !partnerId &&
  !privileged

){
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
}

if (!partnerId) {
  throw new HttpsError(
    "invalid-argument",
    "Partner ID is required."
  );
}

const profileSnapshot =
 await settlementProfileReference(
   partnerId
 ).get();

if (
  !profileSnapshot.exists
){
  return {

              profile: null,
            };
        }

        return {
          profile: serializeProfile(
            profileSnapshot.data() as ServicePartnerSettlementProfileDocument
          ),
        };
    }
  );
