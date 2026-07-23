/**
 * SIDRA Date & Time Constants
 */

export const DATE = {
 TIMEZONE: "Asia/Kolkata",

 LOCALE: "en-IN",

 DATE_FORMAT: "dd MMM yyyy",

 DATE_TIME_FORMAT: "dd MMM yyyy, hh:mm a",

 TIME_FORMAT: "hh:mm a",

 ISO_FORMAT: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",

 RELATIVE_UPDATE_INTERVAL: 60_000,

 CACHE_TTL: {

      SHORT: 60,
      MEDIUM: 300,
      LONG: 3600
  }
} as const;
