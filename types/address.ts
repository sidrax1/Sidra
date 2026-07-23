import type { BaseEntity } from "@/types/common";

export interface Address extends BaseEntity {
 readonly fullName: string;
 readonly phone: string;
 readonly email?: string;

 readonly line1: string;
 readonly line2?: string;

 readonly landmark?: string;

 readonly city: string;
 readonly district?: string;
 readonly state: string;
 readonly country: string;
 readonly postalCode: string;

 readonly latitude?: number;
 readonly longitude?: number;

 readonly defaultShipping: boolean;
 readonly defaultBilling: boolean;
}
