import type {
  BaseEntity,
} from "@/types/common";

export type AccountRole =
  | "customer"
  | "seller"
  | "support"
  | "contentManager"
  | "financeManager"
  | "marketingManager"
  | "founder"
  | "superAdmin";

export interface AccountProfile
  extends BaseEntity {
  readonly uid: string;
  readonly email: string;
  readonly displayName: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly photoURL?: string | null;
  readonly role: AccountRole;
  readonly studioId?: string;
  readonly emailVerified: boolean;
  readonly disabled: boolean;
  readonly preferredLanguage: "en";
  readonly lastLoginAt?: string;
}

export interface AccountNotificationPreferences {
  readonly orderUpdates: boolean;
  readonly customOrderUpdates: boolean;
  readonly studioUpdates: boolean;
  readonly reviewUpdates: boolean;
  readonly supportUpdates: boolean;
  readonly marketingEmail: boolean;
  readonly transactionalEmail: true;
  readonly inAppNotifications: boolean;
  readonly updatedAt: string;
}

export interface AccountSecuritySummary {
  readonly emailVerified: boolean;
  readonly googleConnected: boolean;
  readonly passwordEnabled: boolean;
  readonly lastPasswordChangeAt?: string;
  readonly lastLoginAt?: string;
  readonly activeSessionCount: number;
}

export type AccountActivityType =
  | "login"
  | "profileUpdated"
  | "passwordChanged"
  | "addressAdded"
  | "orderPlaced"
  | "reviewSubmitted"
  | "studioFollowed"
  | "customOrderSubmitted";

export interface AccountActivity
  extends BaseEntity {
  readonly userId: string;
  readonly type: AccountActivityType;
  readonly title: string;
  readonly description?: string;
  readonly metadata?: Readonly<
    Record<string, unknown>
  >;
}
