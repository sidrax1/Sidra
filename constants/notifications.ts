/**
 * SIDRA Notification Configuration
 */

export const NOTIFICATIONS = {
 CHANNELS: {
  EMAIL: "email",

      PUSH: "push",

      IN_APP: "inApp",

   SMS: "sms"
 },

 PRIORITY: {
  LOW: "low",

      NORMAL: "normal",

      HIGH: "high",

   CRITICAL: "critical"
 },

 DEFAULT_PAGE_SIZE: 20,

 MAX_PAGE_SIZE: 100,

 RETENTION_DAYS: 180,

 BATCH_SIZE: 500,

 MAX_TITLE_LENGTH: 120,

  MAX_BODY_LENGTH: 1000
} as const;
