import type { BaseEntity } from "@/types/common";

export interface Banner extends BaseEntity {
 readonly title: string;

 readonly subtitle?: string;

 readonly image: string;

 readonly mobileImage?: string;

 readonly buttonLabel?: string;

 readonly buttonUrl?: string;

 readonly active: boolean;

  readonly priority: number;
}
