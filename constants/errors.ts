/**
 * SIDRA Standard Error Messages
 * Single source of truth for user-facing errors.
 */

export const ERRORS = {
 COMMON: {
  UNKNOWN:
   "Something went wrong. Please try again.",

  NETWORK:
   "Network connection unavailable.",

  SERVER:
   "Server is temporarily unavailable.",

  UNAUTHORIZED:
   "You are not authorized to perform this action.",

  FORBIDDEN:
   "Access denied.",

  NOT_FOUND:
   "Requested resource was not found.",

  TIMEOUT:
   "Request timed out. Please try again.",

   VALIDATION:
    "Please check the entered information."
 },

 AUTH: {
  LOGIN_FAILED:
   "Unable to sign in.",

  SESSION_EXPIRED:
   "Your session has expired.",

  GOOGLE_FAILED:
   "Google Sign-In failed.",

      ACCOUNT_DISABLED:
       "This account has been disabled.",

   EMAIL_NOT_VERIFIED:
    "Please verify your email."
 },

 PRODUCT: {
  NOT_FOUND:
   "Product not found.",

      OUT_OF_STOCK:
       "Product is out of stock.",

   INVALID_PRICE:
    "Invalid product price."
 },

 ORDER: {
  NOT_FOUND:
   "Order not found.",

      PAYMENT_FAILED:
       "Payment could not be completed.",

   CANCEL_NOT_ALLOWED:
    "Order can no longer be cancelled."
 },

 STUDIO: {
  NOT_FOUND:
   "Studio not found.",

      NOT_APPROVED:
       "Studio is pending approval."
  }
} as const;
