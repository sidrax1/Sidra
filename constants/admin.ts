/**
 * SIDRA Founder Admin Constants

*/

export const ADMIN = {
 PAGINATION: {
  DEFAULT_LIMIT: 25,

   MAX_LIMIT: 100
 },

 CACHE: {
  SETTINGS_TTL: 300,

      CMS_TTL: 300,

   ANALYTICS_TTL: 600
 },

 DASHBOARD: {
  RECENT_ORDERS_LIMIT: 10,

      RECENT_USERS_LIMIT: 10,

   RECENT_PRODUCTS_LIMIT: 10
 },

 AUDIT: {
   RETENTION_DAYS: 365
 },

  MEDIA: {
    MAX_UPLOAD_SIZE_MB: 25
  }
} as const;
