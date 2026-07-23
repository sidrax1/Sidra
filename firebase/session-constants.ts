export const SESSION_COOKIE = {
  NAME: "__sidra_session",

 MAX_AGE_SECONDS: 60 * 60 * 24 * 14,

 REFRESH_THRESHOLD_SECONDS: 60 * 60 * 24,

 PATH: "/",

 SAME_SITE: "lax" as const,

 HTTP_ONLY: true,

  SECURE:
   process.env.NODE_ENV === "production",
} as const;

export const SESSION_ENDPOINT =
 "/api/auth/session" as const;
