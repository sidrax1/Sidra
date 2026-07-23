export const COLLECTIONS = {
  USERS: "users",
  USER_SETTINGS: "userSettings",
  USER_DEVICES: "userDevices",
  USER_SESSIONS: "userSessions",
  ADDRESSES: "addresses",

SELLER_APPLICATIONS: "sellerApplications",
STUDIOS: "studios",
STUDIO_MEMBERS: "studioMembers",
STUDIO_FOLLOWERS: "studioFollowers",

PRODUCTS: "products",
PRODUCT_IMAGES: "productImages",
PRODUCT_VARIANTS: "productVariants",
PRODUCT_CATEGORIES: "productCategories",
PRODUCT_COLLECTIONS: "productCollections",
INVENTORY: "inventory",

CARTS: "carts",
WISHLISTS: "wishlists",
RECENTLY_VIEWED: "recentlyViewed",

ORDERS: "orders",
ORDER_ITEMS: "orderItems",
ORDER_HISTORY: "orderHistory",
CUSTOM_ORDERS: "customOrders",

PAYMENTS: "payments",
PAYOUTS: "payouts",

REVIEWS: "reviews",
REVIEW_REPORTS: "reviewReports",

NOTIFICATIONS: "notifications",
CONVERSATIONS: "conversations",
MESSAGES: "messages",
SUPPORT_TICKETS: "supportTickets",

SEARCH_INDEX: "searchIndex",
ANALYTICS: "analytics",

COUPONS: "coupons",
CAMPAIGNS: "campaigns",

CMS: "cms",
SETTINGS: "settings",
JOURNAL: "journal",
SEO: "seo",

MEDIA: "media",

 BANNERS: "banners",
 FAQ: "faq",

 CONTACT_REQUESTS: "contactRequests",
 CORPORATE_LEADS: "corporateLeads",
 NEWSLETTER: "newsletter",

 AUTOMATION_RULES: "automationRules",
 AUDIT_LOGS: "auditLogs",

  AFFILIATES: "affiliates",
  GIFT_CARDS: "giftCards",
  LOYALTY_LEDGER: "loyaltyLedger",
  SUBSCRIPTIONS_BILLING: "subscriptionsBilling",
} as const;

export type CollectionName =
  (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
