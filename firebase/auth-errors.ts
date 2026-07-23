import {
  FirebaseError,
} from "firebase/app";

export interface AuthErrorDetails {
  code: string;
  message: string;
  retryable: boolean;
}

const AUTH_ERROR_MESSAGES: Readonly<
 Record<string, string>
>={
 "auth/account-exists-with-different-credential":
  "An account already exists with this email using another sign-in method.",

 "auth/credential-already-in-use":
  "This Google account is already linked to another Sidra account.",

 "auth/invalid-credential":
  "The authentication credential is invalid or has expired.",

 "auth/network-request-failed":
  "Unable to connect. Check your internet connection and try again.",

 "auth/operation-not-allowed":
  "Google Sign-In is currently unavailable.",

 "auth/popup-blocked":
  "Your browser blocked the Google Sign-In window.",

 "auth/popup-closed-by-user":
  "Google Sign-In was cancelled.",

 "auth/too-many-requests":
  "Too many attempts were made. Please wait before trying again.",

 "auth/unauthorized-domain":
  "This website domain is not authorized for Google Sign-In.",

 "auth/user-disabled":
  "This Sidra account has been disabled.",

 "auth/user-token-expired":
  "Your session has expired. Please sign in again.",

  "auth/web-storage-unsupported":
   "Your browser does not allow the secure storage required for sign-in.",
};

const RETRYABLE_AUTH_ERRORS =
 new Set<string>([
   "auth/internal-error",
   "auth/network-request-failed",
   "auth/timeout",
   "auth/too-many-requests",
 ]);

export function parseAuthError(
  error: unknown
): AuthErrorDetails {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,

     message:
      AUTH_ERROR_MESSAGES[
        error.code
      ] ??
      "Unable to complete authentication. Please try again.",

       retryable:
        RETRYABLE_AUTH_ERRORS.has(
          error.code
        ),
     };
 }

 if (error instanceof Error) {
   return {
     code: "auth/unknown",

      message: error.message,

       retryable: false,
     };
 }

 return {
  code: "auth/unknown",

     message:
      "Unable to complete authentication. Please try again.",

   retryable: false,
 };
}
