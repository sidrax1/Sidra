export const PUBLIC_ROUTES = {
  HOME: "/",
  STUDIOS: "/studios",
  STUDIO: (slug: string) => `/studio/${encodeURIComponent(slug)}`,
  PRODUCT: (slug: string) => `/product/${encodeURIComponent(slug)}`,
  CATEGORY: (slug: string) => `/category/${encodeURIComponent(slug)}`,
  COLLECTION: (slug: string) => `/collection/${encodeURIComponent(slug)}`,
  SEARCH: "/search",
  CUSTOM_ORDERS: "/custom-orders",
  CORPORATE: "/corporate",
  JOURNAL: "/journal",
  JOURNAL_ARTICLE: (slug: string) =>
   `/journal/${encodeURIComponent(slug)}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  SUPPORT: "/support",
  FAQ: "/support/faq",
  SHIPPING_POLICY: "/policies/shipping",
  RETURNS_POLICY: "/policies/returns",
  PRIVACY_POLICY: "/policies/privacy",
  TERMS_POLICY: "/policies/terms",
  SELL_ON_SIDRA: "/sell-on-sidra",
  LOGIN: "/login",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: (orderId: string) =>
   `/order/${encodeURIComponent(orderId)}/confirmation`,
  LANDING_PAGE: (slug: string) => `/lp/${encodeURIComponent(slug)}`,
  CAMPAIGN: (slug: string) => `/campaign/${encodeURIComponent(slug)}`,
} as const;

export const ACCOUNT_ROUTES = {
 ROOT: "/account",
 OVERVIEW: "/account/overview",
 ORDERS: "/account/orders",
 ORDER_DETAILS: (orderId: string) =>
  `/account/orders/${encodeURIComponent(orderId)}`,

  WISHLIST: "/account/wishlist",
  SAVED_STUDIOS: "/account/saved-studios",
  ADDRESSES: "/account/addresses",
  NOTIFICATIONS: "/account/notifications",
  CUSTOM_ORDERS: "/account/custom-orders",
  CUSTOM_ORDER_DETAILS: (customOrderId: string) =>
   `/account/custom-orders/${encodeURIComponent(customOrderId)}`,
  REVIEWS: "/account/reviews",
  RECENTLY_VIEWED: "/account/recently-viewed",
  PROFILE: "/account/profile",
  SECURITY: "/account/security",
} as const;

export const STUDIO_ADMIN_ROUTES = {
  ROOT: "/studio-admin",
  OVERVIEW: "/studio-admin/overview",
  PRODUCTS: "/studio-admin/products",
  NEW_PRODUCT: "/studio-admin/products/new",
  EDIT_PRODUCT: (productId: string) =>
   `/studio-admin/products/${encodeURIComponent(productId)}/edit`,
  COLLECTIONS: "/studio-admin/collections",
  ORDERS: "/studio-admin/orders",
  ORDER_DETAILS: (orderId: string) =>
   `/studio-admin/orders/${encodeURIComponent(orderId)}`,
  CUSTOM_ORDERS: "/studio-admin/custom-orders",
  CUSTOM_ORDER_DETAILS: (customOrderId: string) =>
   `/studio-admin/custom-orders/${encodeURIComponent(customOrderId)}`,
  CUSTOMERS: "/studio-admin/customers",
  REVIEWS: "/studio-admin/reviews",
  FOLLOWERS: "/studio-admin/followers",
  ANALYTICS: "/studio-admin/analytics",
  REVENUE: "/studio-admin/revenue",
  PAYOUTS: "/studio-admin/payouts",
  BRANDING: "/studio-admin/branding",
  SUBSCRIPTION: "/studio-admin/subscription",
  SETTINGS: "/studio-admin/settings",
} as const;

export const SELLER_ROUTES = {
  ROOT: "/seller",
  OVERVIEW: "/seller/overview",
  PRODUCTS: "/seller/products",
  NEW_PRODUCT: "/seller/products/new",
  EDIT_PRODUCT: (productId: string) =>
   `/seller/products/${encodeURIComponent(productId)}/edit`,
  ORDERS: "/seller/orders",
  ORDER_DETAILS: (orderId: string) =>
   `/seller/orders/${encodeURIComponent(orderId)}`,
  INVENTORY: "/seller/inventory",
  CUSTOM_ORDERS: "/seller/custom-orders",
  CUSTOM_ORDER_DETAILS: (customOrderId: string) =>
   `/seller/custom-orders/${encodeURIComponent(customOrderId)}`,
  CUSTOMERS: "/seller/customers",
  MESSAGES: "/seller/messages",
  ANALYTICS: "/seller/analytics",
  PAYOUTS: "/seller/payouts",
  STORE_DESIGN: "/seller/store-design",
  STUDIO: "/seller/studio",
  SETTINGS: "/seller/settings",
} as const;

export const ADMIN_ROUTES = {
 ROOT: "/admin",
 OVERVIEW: "/admin/overview",
 USERS: "/admin/users",
 PAYOUTS: "/admin/payouts",
 CONTENT: "/admin/cms",
 CONTENT_PAGES: "/admin/cms/pages",
 CONTENT_SECTIONS: "/admin/cms/sections",
 BANNERS: "/admin/cms/banners",
 SEO: "/admin/cms/seo",
 FAQ: "/admin/cms/faq",
 MEDIA: "/admin/media-library",
 CMS_HOMEPAGE: "/admin/cms/homepage",
 CMS_NAVIGATION: "/admin/cms/navigation",
 CMS_PAGES: "/admin/cms/pages",

  CMS_THEME: "/admin/cms/theme",
  SELLERS: "/admin/sellers",
  SELLER_APPLICATIONS: "/admin/sellers/applications",
  STUDIOS: "/admin/studios",
  PRODUCTS: "/admin/products",
  CATEGORIES: "/admin/categories",
  COLLECTIONS: "/admin/collections",
  CUSTOMERS: "/admin/customers",
  ORDERS: "/admin/orders",
  CUSTOM_ORDERS: "/admin/custom-orders",
  REVIEWS: "/admin/reviews",
  SUPPORT: "/admin/support",
  SUPPORT_TICKET: (ticketId: string) =>
   `/admin/support/${encodeURIComponent(ticketId)}`,
  CAMPAIGNS: "/admin/marketing/campaigns",
  COUPONS: "/admin/marketing/coupons",
  CORPORATE_LEADS: "/admin/marketing/corporate-leads",
  JOURNAL: "/admin/journal",
  MEDIA_LIBRARY: "/admin/media-library",
  ANALYTICS: "/admin/analytics",
  FINANCE: "/admin/finance",
  NOTIFICATIONS: "/admin/notifications",
  AUTOMATION: "/admin/automation",
  ROLES: "/admin/roles",
  AUDIT_LOGS: "/admin/audit-logs",
  SETTINGS: "/admin/settings",
} as const;

export const AUTHENTICATED_ROUTE_PREFIXES = [
  ACCOUNT_ROUTES.ROOT,
  STUDIO_ADMIN_ROUTES.ROOT,
  ADMIN_ROUTES.ROOT,
  PUBLIC_ROUTES.CHECKOUT,
] as const;

export const SELLER_ROUTE_PREFIXES = [
  STUDIO_ADMIN_ROUTES.ROOT,
] as const;

export const ADMIN_ROUTE_PREFIXES = [
  ADMIN_ROUTES.ROOT,
] as const;
