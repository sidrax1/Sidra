/**
 * SIDRA API Endpoints
 */

export const API = {
 AUTH: {
   LOGIN: "/api/auth/login",
   LOGOUT: "/api/auth/logout",
   SESSION: "/api/auth/session",
   REFRESH: "/api/auth/refresh"
 },

 USERS: "/api/users",

 PRODUCTS: "/api/products",

 STUDIOS: "/api/studios",

 SEARCH: "/api/search",

 CART: "/api/cart",

 WISHLIST: "/api/wishlist",

 ORDERS: "/api/orders",

 PAYMENTS: "/api/payments",

 CUSTOM_ORDERS: "/api/custom-orders",

 REVIEWS: "/api/reviews",

 NOTIFICATIONS: "/api/notifications",

 MEDIA: "/api/media",

 CMS: "/api/cms",

 ADMIN: {
  ROOT: "/api/admin",

  PRODUCTS: "/api/admin/products",

  USERS: "/api/admin/users",

  SELLERS: "/api/admin/sellers",

  SETTINGS: "/api/admin/settings",

  ANALYTICS: "/api/admin/analytics",

    AUDIT_LOGS: "/api/admin/audit-logs"
  }
} as const;
