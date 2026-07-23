import type { BaseEntity } from "./common";
import type { UserRole } from "@/constants";

export interface User extends BaseEntity {
 uid: string;

    email: string;

 displayName: string;

 photoURL?: string;

 phoneNumber?: string;

 role: UserRole;

 status:
  | "active"
  | "pending"
  | "blocked"
  | "suspended";

 emailVerified: boolean;

 onboardingCompleted: boolean;

 wishlistCount: number;

 cartCount: number;

 lastLoginAt?: string;
}
