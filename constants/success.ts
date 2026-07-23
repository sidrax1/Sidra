/**
 * SIDRA Success Messages
 */

export const SUCCESS = {
 AUTH: {
  LOGIN:
   "Successfully signed in.",

   LOGOUT:
    "Successfully signed out."
 },

 PROFILE: {
   UPDATED:
    "Profile updated successfully."
 },

 PRODUCT: {
  CREATED:
   "Product created successfully.",

  UPDATED:
   "Product updated successfully.",

   DELETED:
    "Product deleted successfully."
 },

 ORDER: {
  CREATED:
   "Order placed successfully.",

   CANCELLED:
    "Order cancelled successfully."
 },

 REVIEW: {
  SUBMITTED:
   "Review submitted successfully."

 },

  SETTINGS: {
    SAVED:
     "Changes saved successfully."
  }
} as const;
