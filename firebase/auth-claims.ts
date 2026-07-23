import type { IdTokenResult } from "firebase/auth";

import { ROLES, type UserRole } from "@/constants/roles";
import { getCurrentFirebaseUser } from "@/firebase/auth-state";

export interface SidraAuthClaims {
  role: UserRole;
  studioId: string | null;
  emailVerified: boolean;
  founderAuthorized: boolean;
}

const VALID_ROLES = new Set<UserRole>(
  Object.values(ROLES)
);

function parseRole(value: unknown): UserRole {
 if (
   typeof value === "string" &&
   VALID_ROLES.has(value as UserRole)
 ){
   return value as UserRole;
 }

    return ROLES.CUSTOMER;
}

function parseOptionalString(
  value: unknown
): string | null {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ){
    return null;
  }

    return value.trim();
}

export function parseAuthClaims(

  tokenResult: IdTokenResult
): SidraAuthClaims {
  return {
   role: parseRole(tokenResult.claims.role),

     studioId: parseOptionalString(
       tokenResult.claims.studioId
     ),

     emailVerified:
      tokenResult.claims.email_verified === true,

      founderAuthorized:
       tokenResult.claims.founderAuthorized === true,
    };
}

export async function getCurrentAuthClaims(
  forceRefresh = false
): Promise<SidraAuthClaims | null> {
  const user =
   await getCurrentFirebaseUser();

    if (!user) {
      return null;
    }

    const tokenResult =
     await user.getIdTokenResult(forceRefresh);

    return parseAuthClaims(tokenResult);
}

export async function requireAuthClaims(
  forceRefresh = false
): Promise<SidraAuthClaims> {
  const claims =
   await getCurrentAuthClaims(forceRefresh);

    if (!claims) {
      throw new Error(
        "Authentication is required."
      );
    }

    return claims;
}

export function hasRequiredRole(
  claims: SidraAuthClaims,
  allowedRoles: readonly UserRole[]
): boolean {
  return allowedRoles.includes(claims.role);
}

export function requireRole(
  claims: SidraAuthClaims,
  allowedRoles: readonly UserRole[]
): void {
  if (!hasRequiredRole(claims, allowedRoles)) {
    throw new Error(
      "You are not authorized to access this resource."
    );
  }
}

export function requireStudioAccess(
  claims: SidraAuthClaims,
  studioId: string
): void {
  const normalizedStudioId =
   studioId.trim();

    if (!normalizedStudioId) {
      throw new Error(
        "A valid studio ID is required."
      );
    }

    if (
      claims.role !== ROLES.SELLER ||
      claims.studioId !== normalizedStudioId
    ){
      throw new Error(
         "You are not authorized to access this studio."
      );
    }
}
