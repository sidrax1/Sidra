import "server-only";

import type {
  DecodedIdToken,
} from "firebase-admin/auth";

import {
  adminAuth,
} from "@/firebase/index.server";

import {
  getSessionCookie,
} from "@/firebase/session-cookie.server";

export interface VerifiedSession {
 uid: string;

    email: string | null;

    displayName: string | null;

    emailVerified: boolean;

    role: string;

    studioId: string | null;

    founderAuthorized: boolean;

    issuedAt: number;

    expiresAt: number;

    decodedToken: DecodedIdToken;
}

function readStringClaim(
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

function mapDecodedToken(
  decodedToken: DecodedIdToken
): VerifiedSession {
  return {
   uid: decodedToken.uid,

     email:
      readStringClaim(
        decodedToken.email
      ),

     displayName:
      readStringClaim(
        decodedToken.name
      ),

     emailVerified:
      decodedToken.email_verified ===
      true,

     role:
      readStringClaim(
        decodedToken.role
      ) ?? "customer",

     studioId:
      readStringClaim(
        decodedToken.studioId
      ),

     founderAuthorized:
      decodedToken.founderAuthorized ===
      true,

     issuedAt:
       decodedToken.iat,

     expiresAt:
      decodedToken.exp,

      decodedToken,
    };
}

export async function verifySessionCookie(
  sessionCookie: string,
  checkRevoked = true
): Promise<VerifiedSession> {
  const normalizedSessionCookie =
   sessionCookie.trim();

    if (!normalizedSessionCookie) {
      throw new Error(
        "Session cookie is required."
      );
    }

    const decodedToken =
     await adminAuth.verifySessionCookie(
       normalizedSessionCookie,
       checkRevoked
     );

    return mapDecodedToken(
      decodedToken
    );
}

export async function getVerifiedSession(): Promise<
 VerifiedSession | null
>{
 const sessionCookie =
  await getSessionCookie();

    if (!sessionCookie) {
      return null;
    }

    try {
      return await verifySessionCookie(
        sessionCookie
      );
    } catch {
      return null;
    }
}

export async function requireVerifiedSession(): Promise<VerifiedSession> {
 const session =
  await getVerifiedSession();

    if (!session) {
      throw new Error(
        "Authentication is required."
      );
    }

  return session;
}
