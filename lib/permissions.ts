import {
  ADMIN_ROLES,
  ROLES,
  SELLER_ROLES,
  type UserRole,
} from "@/constants/roles";

export type Permission =
 | "account.read"
 | "account.update"
 | "studio.read"
 | "studio.update"
 | "product.create"
 | "product.update"
 | "product.archive"
 | "order.read"
 | "order.fulfil"
 | "admin.read"
 | "admin.manageUsers"
 | "admin.manageContent"
 | "admin.manageFinance"
 | "admin.manageSettings";

const permissionMap: Readonly<Record<UserRole, readonly Permission[]>> = {
 guest: [],
 customer: ["account.read", "account.update", "order.read"],
 seller: [
  "account.read",
  "account.update",
  "studio.read",

    "studio.update",
    "product.create",
    "product.update",
    "product.archive",
    "order.read",
    "order.fulfil",
  ],
  seller_manager: [
    "account.read",
    "account.update",
    "studio.read",
    "studio.update",
    "product.create",
    "product.update",
    "product.archive",
    "order.read",
    "order.fulfil",
  ],
  moderator: ["admin.read", "admin.manageContent"],
  support: ["admin.read", "order.read"],
  content_manager: ["admin.read", "admin.manageContent"],
  finance_manager: ["admin.read", "admin.manageFinance"],
  admin: [
    "admin.read",
    "admin.manageUsers",
    "admin.manageContent",
    "admin.manageFinance",
    "admin.manageSettings",
  ],
  super_admin: [
    "admin.read",
    "admin.manageUsers",
    "admin.manageContent",
    "admin.manageFinance",
    "admin.manageSettings",
  ],
  founder: [
    "admin.read",
    "admin.manageUsers",
    "admin.manageContent",
    "admin.manageFinance",
    "admin.manageSettings",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return permissionMap[role].includes(permission);
}

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function isSellerRole(role: UserRole): boolean {
  return SELLER_ROLES.includes(role);
}

export function isFounderRole(role: UserRole): boolean {
  return role === ROLES.FOUNDER;
}
