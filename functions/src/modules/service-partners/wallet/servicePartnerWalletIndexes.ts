/**
 * Firestore Composite Index Definitions
 * -------------------------------------
 * Collection:
 * servicePartnerWalletEntries
 *
 * partnerId ASC
 * createdAt DESC
 *
 * partnerId ASC
 * status ASC
 * createdAt DESC
 *
 * partnerId ASC
 * referenceType ASC
 * createdAt DESC
 *
 * partnerId ASC
 * entryType ASC
 * createdAt DESC
 *
 * applicantUserId ASC
 * createdAt DESC
 *
 * status ASC
 * availableAt ASC
 *
 * -------------------------------------
 * Collection:
 * servicePartnerPayoutRequests
 *
 * partnerId ASC
 * requestedAt DESC
 *
 * partnerId ASC
 * status ASC
 * requestedAt DESC
 *
 * status ASC

* requestedAt DESC
*
* payoutMethod ASC
* requestedAt DESC
*
* paymentReference ASC
*
* idempotencyKey ASC
*
* -------------------------------------
* Collection:
* servicePartnerPayoutEvents
*
* payoutId ASC
* processedAt DESC
*
* partnerId ASC
* processedAt DESC
*
* -------------------------------------
* Collection:
* servicePartnerWalletReconciliations
*
* partnerId ASC
* reconciledAt DESC
*/

export const servicePartnerWalletIndexes = Object.freeze({
  walletEntries: [
     "partnerId_createdAt_desc",
     "partnerId_status_createdAt_desc",
     "partnerId_reference_createdAt_desc",
     "partnerId_entryType_createdAt_desc",
     "applicantUserId_createdAt_desc",
     "status_availableAt",
  ],
  payouts: [
     "partnerId_requestedAt_desc",
     "partnerId_status_requestedAt_desc",
     "status_requestedAt_desc",
     "method_requestedAt_desc",
     "paymentReference",
     "idempotencyKey",
  ],

      payoutEvents: [
         "payoutId_processedAt_desc",
         "partnerId_processedAt_desc",
      ],
      reconciliations: [
         "partnerId_reconciledAt_desc",
      ],
});
