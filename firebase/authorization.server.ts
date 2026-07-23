import "server-only";

import {
  ADMIN_ROLES,
  ROLES,
  SELLER_ROLES,
  type UserRole,
} from "@/constants/roles";

import {
 requireVerifiedSession,
 type VerifiedSession,

} from "@/firebase/verify-session.server";

export class AuthorizationError extends Error {
 readonly code:
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "STUDIO_MISMATCH"
  | "FOUNDER_NOT_AUTHORIZED";

    constructor(
     code: AuthorizationError["code"],
     message: string
    ){
     super(message);

        this.name =
         "AuthorizationError";

        this.code = code;
    }
}

export async function requireAuthenticatedSession(): Promise<VerifiedSession> {
  try {
    return await requireVerifiedSession();
  } catch {
    throw new AuthorizationError(
      "UNAUTHENTICATED",
      "Authentication is required."
    );
  }
}

export async function requireAllowedRoles(
  allowedRoles: readonly UserRole[]
): Promise<VerifiedSession> {
  const session =
   await requireAuthenticatedSession();

    if (
      !allowedRoles.includes(
         session.role as UserRole
      )
    ){

        throw new AuthorizationError(
          "FORBIDDEN",
          "You are not authorized to access this resource."
        );
    }

    return session;
}

export async function requireSellerSession(
  expectedStudioId?: string
): Promise<VerifiedSession> {
  const session =
   await requireAllowedRoles(
     SELLER_ROLES
   );

    if (
      expectedStudioId &&
      session.studioId !==
         expectedStudioId
    ){
      throw new AuthorizationError(
         "STUDIO_MISMATCH",
         "You are not authorized to access this studio."
      );
    }

    return session;
}

export async function requireAdminSession(): Promise<VerifiedSession> {
  return requireAllowedRoles(
    ADMIN_ROLES
  );
}

export async function requireFounderSession(): Promise<VerifiedSession> {
 const session =
  await requireAllowedRoles([
    ROLES.FOUNDER,
    ROLES.SUPER_ADMIN,
  ]);

 if (
   session.role === ROLES.FOUNDER &&
   !session.founderAuthorized
 ){
   throw new AuthorizationError(
      "FOUNDER_NOT_AUTHORIZED",
      "Founder access has not been authorized."
   );
 }

 return session;
}
