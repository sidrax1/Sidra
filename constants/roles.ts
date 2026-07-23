export const ROLES = {
  GUEST: "guest",

 CUSTOMER: "customer",

 SELLER: "seller",

 SELLER_MANAGER: "seller_manager",

 MODERATOR: "moderator",

 SUPPORT: "support",

 CONTENT_MANAGER: "content_manager",

 FINANCE_MANAGER: "finance_manager",

 ADMIN: "admin",

 SUPER_ADMIN: "super_admin",

  FOUNDER: "founder"
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<UserRole, number> = {
 guest: 0,
 customer: 10,
 seller: 20,
 seller_manager: 30,
 moderator: 40,
 support: 45,
 content_manager: 50,
 finance_manager: 60,
 admin: 90,
 super_admin: 95,
 founder: 100

};

export const ADMIN_ROLES: readonly UserRole[] = [
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.FOUNDER
];

export const SELLER_ROLES: readonly UserRole[] = [
  ROLES.SELLER,
  ROLES.SELLER_MANAGER
];

export const STAFF_ROLES: readonly UserRole[] = [
  ROLES.MODERATOR,
  ROLES.SUPPORT,
  ROLES.CONTENT_MANAGER,
  ROLES.FINANCE_MANAGER,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.FOUNDER
];
