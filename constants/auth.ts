/**
 * SIDRA Authentication Constants
 */

export const AUTH = {
 PROVIDERS: {
   GOOGLE: "google.com"
 },

 SESSION: {
  COOKIE_NAME: "__sidra_session",

  MAX_AGE: 60 * 60 * 24 * 30,

   REFRESH_THRESHOLD: 60 * 60 * 24
 },

 PASSWORD: {
  MIN_LENGTH: 8,

   MAX_LENGTH: 128
 },

 USERNAME: {
  MIN_LENGTH: 3,

   MAX_LENGTH: 30
 },

 DISPLAY_NAME: {
  MIN_LENGTH: 2,

   MAX_LENGTH: 60
 },

 USER_STATUS: {
  ACTIVE: "active",

      SUSPENDED: "suspended",

      PENDING: "pending",

      BLOCKED: "blocked",

   DELETED: "deleted"
 },

 EMAIL_VERIFICATION: {
   REQUIRED: true
 },

 LOGIN_METHODS: {
  GOOGLE: true,

      EMAIL_PASSWORD: false
  }
} as const;
