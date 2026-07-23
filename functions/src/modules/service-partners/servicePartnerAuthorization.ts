import {
  HttpsError,
  type CallableRequest,
} from "firebase-functions/v2/https";

import type {
  AuthenticatedActor,
} from "./servicePartnerRepository";

const administratorRoles =
  new Set([
    "founder",
    "superAdmin",
    "admin",
  ]);

const operationsRoles =
  new Set([
    "founder",
    "superAdmin",
    "admin",
    "operations",
    "serviceOperations",
  ]);

export function isAdministrator(
  actor: AuthenticatedActor
): boolean {
  return Boolean(
    actor.role &&
      administratorRoles.has(
        actor.role
      )
  );
}

export function isOperationsActor(
  actor: AuthenticatedActor
): boolean {
  return Boolean(
    actor.role &&
      operationsRoles.has(
        actor.role
      )
  );
}

export function hasPermission(
  actor: AuthenticatedActor,
  permission: string
): boolean {
  return (
    isAdministrator(actor) ||
    actor.permissions.includes(
      permission
    )
  );
}

export function requireAnyPermission(
  actor: AuthenticatedActor,
  permissions: readonly string[]
): void {
  if (isAdministrator(actor)) {
    return;
  }

  const allowed =
    permissions.some(
      (permission) =>
        actor.permissions.includes(
          permission
        )
    );

  if (!allowed) {
    throw new HttpsError(
      "permission-denied",
      `One of the following permissions is required: ${permissions.join(
        ", "
      )}.`
    );
  }
}

export function requireOperationsActor(
  actor: AuthenticatedActor
): void {
  if (
    isOperationsActor(actor)
  ) {
    return;
  }

  throw new HttpsError(
    "permission-denied",
    "Service operations access is required."
  );
}

export function requireMatchingUser(
  actor: AuthenticatedActor,
  userId: string,
  permission?: string
): void {
  if (
    actor.uid === userId ||
    isAdministrator(actor) ||
    (permission &&
      actor.permissions.includes(
        permission
      ))
  ) {
    return;
  }

  throw new HttpsError(
    "permission-denied",
    "You are not authorised to access this resource."
  );
}

export function getRequestIPAddress(
  request: CallableRequest<unknown>
): string | undefined {
  const rawRequest =
    request.rawRequest;

  const forwardedFor =
    rawRequest.headers[
      "x-forwarded-for"
    ];

  if (
    typeof forwardedFor ===
    "string"
  ) {
    return forwardedFor
      .split(",")
      .at(0)
      ?.trim();
  }

  if (
    Array.isArray(
      forwardedFor
    )
  ) {
    return forwardedFor
      .at(0)
      ?.split(",")
      .at(0)
      ?.trim();
  }

  return rawRequest.ip;
}

export function getRequestUserAgent(
  request: CallableRequest<unknown>
): string | undefined {
  const userAgent =
    request.rawRequest.headers[
      "user-agent"
    ];

  return typeof userAgent ===
    "string"
    ? userAgent.slice(
        0,
        500
      )
    : undefined;
}
