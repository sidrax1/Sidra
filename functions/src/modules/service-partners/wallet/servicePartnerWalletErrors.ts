import { HttpsError } from "firebase-functions/v2/https";

export const walletErrors = {

      walletNotFound() {
         return new HttpsError(
            "not-found",
            "Service partner wallet not found."
         );
      },

      payoutNotFound() {
         return new HttpsError(
            "not-found",
            "Payout request not found."
         );
      },

     insufficientBalance() {
        return new HttpsError(
           "failed-precondition",
           "Insufficient wallet balance."
        );
     },

     heldBalanceMismatch() {
        return new HttpsError(
           "failed-precondition",
           "Held balance mismatch detected."
        );
     },

     invalidStatus(status: string) {
        return new HttpsError(
           "failed-precondition",
           `Operation is not allowed while wallet is ${status}.`
        );
     },

     duplicatePaymentReference() {
        return new HttpsError(
           "already-exists",
           "Payment reference already exists."
        );
     },

     invalidAmount() {
        return new HttpsError(
           "invalid-argument",
           "Wallet amount is invalid."
        );
     },

     reconciliationMismatch() {
        return new HttpsError(
           "aborted",
           "Wallet reconciliation mismatch detected."
        );
     },
};
