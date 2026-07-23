import type { BaseEntity } from "@/types/common";

export type CampaignStatus =
 | "draft"
 | "scheduled"
 | "active"
 | "paused"
 | "completed"
 | "archived";

export interface Campaign extends BaseEntity {
 readonly name: string;
 readonly slug: string;
 readonly status: CampaignStatus;
 readonly headline: string;
 readonly description?: string;

 readonly heroImageURL?: string;
 readonly startsAt: string;
 readonly endsAt: string;
 readonly featuredStudioIds: readonly string[];
 readonly featuredProductIds: readonly string[];
 readonly couponId?: string;
 readonly landingPageId?: string;
}
