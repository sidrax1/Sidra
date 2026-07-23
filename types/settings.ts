import type { BaseEntity } from "@/types/common";

export interface PlatformSettings extends BaseEntity {
  readonly maintenanceMode: boolean;
  readonly sellerApplicationsEnabled: boolean;
  readonly productApprovalRequired: boolean;
  readonly reviewModerationRequired: boolean;
  readonly defaultCommissionPercentage: number;
  readonly defaultShippingFeePaise: number;
  readonly freeShippingThresholdPaise?: number;
  readonly supportEmail: string;
  readonly legalEntityName: string;
  readonly currency: "INR";
  readonly country: "IN";
  readonly timezone: "Asia/Kolkata";
}

export interface StoreCustomizationOptions extends BaseEntity {
  readonly themeIds: readonly string[];
  readonly layoutIds: readonly string[];
  readonly fontPairIds: readonly string[];
  readonly spacingIds: readonly string[];
  readonly backgroundIds: readonly string[];
  readonly animationIds: readonly string[];
}
