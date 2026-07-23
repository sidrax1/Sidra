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
import type {
  ServicePartnerDocument,
} from "../servicePartnerTypes";
import {
  serializeServicePartnerWalletEntry,
  servicePartnerWalletEntryReference,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
} from "./servicePartnerWalletTypes";

interface GetServicePartnerWalletEntryInput {
  readonly entryId: string;
}

export const getServicePartnerWalletEntry =
 onCall(

{
  region: "asia-south1",
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
     request.data as Partial<GetServicePartnerWalletEntryInput>;

    const entryId =
     typeof input.entryId ===
     "string"
       ? input.entryId.trim()
       : "";

    if (!entryId) {
      throw new HttpsError(
        "invalid-argument",
        "Wallet entry ID is required."
      );
    }

    const entrySnapshot =
     await servicePartnerWalletEntryReference(
       entryId
     ).get();

    if (!entrySnapshot.exists) {
      throw new HttpsError(
        "not-found",
        "Service-partner wallet entry was not found."
      );
    }

    const entry =
     entrySnapshot.data() as ServicePartnerWalletEntryDocument;

const [
  partnerSnapshot,
  walletSnapshot,
] = await Promise.all([
  partnerReference(
    entry.partnerId
  ).get(),
  servicePartnerWalletReference(
    entry.partnerId
  ).get(),
]);

if (!partnerSnapshot.exists) {
  throw new HttpsError(
    "failed-precondition",
    "The service partner associated with this wallet entry no longer exists."
  );
}

const partner =
 partnerSnapshot.data() as ServicePartnerDocument;

const privileged =
 hasPermission(
   actor,
   "servicePartners.readWallets"
 ) ||
 hasPermission(
   actor,
   "servicePartners.manageWallets"
 );

if (
  !privileged &&
  partner.applicantUserId !==
     actor.uid
){
  throw new HttpsError(
     "permission-denied",
     "You are not authorised to view this wallet entry."
  );
}

const wallet =

 walletSnapshot.exists
  ? (walletSnapshot.data() as ServicePartnerWalletDocument)
  : null;

const integrity = {
  walletExists:
   walletSnapshot.exists,
  partnerMatches:
   entry.partnerId ===
   partnerSnapshot.id,
  applicantMatches:
   entry.applicantUserId ===
   partner.applicantUserId,
  walletMatches:
   wallet
    ? entry.walletId ===
      walletSnapshot.id
    : false,
  availableBalanceSnapshotValid:
   entry.availableBalanceAfterPaise >=
    0 &&
   entry.availableBalanceBeforePaise >=
    0,
  pendingBalanceSnapshotValid:
   entry.pendingBalanceAfterPaise >=
    0 &&
   entry.pendingBalanceBeforePaise >=
    0,
  heldBalanceSnapshotValid:
   entry.heldBalanceAfterPaise >=
    0 &&
   entry.heldBalanceBeforePaise >=
    0,
};

return {
 entry:
   serializeServicePartnerWalletEntry(
     entrySnapshot.id,
     entry
   ),
 partner: {
   id:
     partnerSnapshot.id,

            partnerNumber:
              partner.partnerNumber,
            displayName:
              partner.displayName,
            applicantUserId:
              partner.applicantUserId,
          },
          wallet: wallet
            ?{
                id:
                  walletSnapshot.id,
                status:
                  wallet.status,
                currency:
                  wallet.currency,
                balances:
                  wallet.balances,
              }
            : null,
          integrity: {
            ...integrity,
            valid:
              Object.values(
                integrity
              ).every(Boolean),
          },
        };
    }
  );
