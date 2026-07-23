/**
 * SIDRA Feature Flags
 * Production Feature Registry
 */

export const FEATURES = {
 AUTH: {

 GOOGLE_SIGN_IN: true,

 EMAIL_PASSWORD: false,

  PHONE_AUTH: false
},

MARKETPLACE: {
 DISCOVERY: true,

 PRODUCT_SEARCH: true,

 COLLECTIONS: true,

 CUSTOM_ORDERS: true,

 SELLER_STUDIOS: true,

  VERIFIED_SELLERS: true
},

USER: {
 WISHLIST: true,

 RECENTLY_VIEWED: true,

 REVIEWS: true,

  NOTIFICATIONS: true
},

ADMIN: {
 CMS: true,

 MEDIA_LIBRARY: true,

 ANALYTICS: true,

 AUDIT_LOGS: true,

  ROLE_MANAGEMENT: true
},

AI: {

      ASSISTANT: false,

      SMART_SEARCH: false
  }
} as const;
