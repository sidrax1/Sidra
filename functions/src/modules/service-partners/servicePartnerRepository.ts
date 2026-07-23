import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import {
  FieldValue,
  Timestamp,
  getFirestore,
  type DocumentReference,
  type Firestore,
  type Transaction,
} from "firebase-admin/firestore";
import {
  HttpsError,
  type CallableRequest,
} from "firebase-functions/v2/https";

import type {
  ServicePartnerApplicationDocument,
  ServicePartnerAssignmentDocument,
  ServicePartnerDocument,
} from "./servicePartnerTypes";

function getAdminApp(): ReturnType<
  typeof initializeApp
> {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId =
    process.env.GCLOUD_PROJECT ??
    process.env.GCP_PROJECT;

  if (
    process.env.FIREBASE_CONFIG
  ) {
    return initializeApp();
  }

  if (projectId) {
    return initializeApp({
      credential:
        applicationDefault(),
      projectId,
    });
  }

  const serviceAccountJSON =
    process.env
      .FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJSON) {
    const serviceAccount =
      JSON.parse(
        serviceAccountJSON
      ) as {
        readonly project_id: string;
        readonly client_email: string;
        readonly private_key: string;
      };

    return initializeApp({
      credential: cert({
        projectId:
          serviceAccount.project_id,
        clientEmail:
          serviceAccount.client_email,
        privateKey:
          serviceAccount.private_key.replace(
            /\\n/g,
            "\n"
          ),
      }),
    });
  }

  return initializeApp();
}

const adminApp =
  getAdminApp();

export const firestore =
  getFirestore(adminApp);

export const collections = {
  applications:
    "servicePartnerApplications",
  partners: "servicePartners",
  assignments:
    "servicePartnerAssignments",
  auditLogs:
    "servicePartnerAuditLogs",
  counters:
    "systemCounters",
  notifications:
    "notifications",
} as const;

export interface AuthenticatedActor {
  readonly uid: string;
  readonly email?: string;
  readonly role?: string;
  readonly permissions: readonly string[];
}

export function requireAuthenticatedActor(
  request: CallableRequest<unknown>
): AuthenticatedActor {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Authentication is required."
    );
  }

  const permissionsClaim =
    request.auth.token
      .permissions;

  const permissions =
    Array.isArray(
      permissionsClaim
    )
      ? permissionsClaim.filter(
          (
            permission
          ): permission is string =>
            typeof permission ===
            "string"
        )
      : [];

  return {
    uid: request.auth.uid,
    email:
      typeof request.auth.token
        .email === "string"
        ? request.auth.token
            .email
        : undefined,
    role:
      typeof request.auth.token
        .role === "string"
        ? request.auth.token
            .role
        : undefined,
    permissions,
  };
}

export function requirePermission(
  actor: AuthenticatedActor,
  permission: string
): void {
  const privilegedRoles =
    new Set([
      "admin",
      "superAdmin",
      "operations",
      "founder",
    ]);

  if (
    actor.role &&
    privilegedRoles.has(
      actor.role
    )
  ) {
    return;
  }

  if (
    actor.permissions.includes(
      permission
    )
  ) {
    return;
  }

  throw new HttpsError(
    "permission-denied",
    `Missing required permission: ${permission}.`
  );
}

export function applicationReference(
  applicationId: string
): DocumentReference<ServicePartnerApplicationDocument> {
  return firestore
    .collection(
      collections.applications
    )
    .doc(
      applicationId
    ) as DocumentReference<ServicePartnerApplicationDocument>;
}

export function partnerReference(
  partnerId: string
): DocumentReference<ServicePartnerDocument> {
  return firestore
    .collection(
      collections.partners
    )
    .doc(
      partnerId
    ) as DocumentReference<ServicePartnerDocument>;
}

export function assignmentReference(
  assignmentId: string
): DocumentReference<ServicePartnerAssignmentDocument> {
  return firestore
    .collection(
      collections.assignments
    )
    .doc(
      assignmentId
    ) as DocumentReference<ServicePartnerAssignmentDocument>;
}

export async function nextSequenceNumber(
  transaction: Transaction,
  counterName: string
): Promise<number> {
  const counterReference =
    firestore
      .collection(
        collections.counters
      )
      .doc(counterName);

  const snapshot =
    await transaction.get(
      counterReference
    );

  const currentValue =
    snapshot.exists
      ? Number(
          snapshot.data()?.value ??
            0
        )
      : 0;

  const nextValue =
    currentValue + 1;

  transaction.set(
    counterReference,
    {
      value: nextValue,
      updatedAt:
        FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return nextValue;
}

export function formatSequence(
  prefix: string,
  sequence: number,
  minimumLength = 7
): string {
  return `${prefix}-${String(
    sequence
  ).padStart(
    minimumLength,
    "0"
  )}`;
}

export function createSlug(
  value: string,
  fallback: string
): string {
  const normalized = value
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
    .slice(0, 80);

  return normalized || fallback;
}

export function normalizeLookupKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function timestampFromISO(
  value: string
): Timestamp {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new HttpsError(
      "invalid-argument",
      "Date-time value is invalid."
    );
  }

  return Timestamp.fromDate(
    date
  );
}

export async function createAuditLog(
  input: {
    readonly actor: AuthenticatedActor;
    readonly action: string;
    readonly entityType:
      | "application"
      | "partner"
      | "assignment";
    readonly entityId: string;
    readonly metadata?: Readonly<
      Record<string, unknown>
    >;
  },
  transaction?: Transaction
): Promise<void> {
  const auditReference =
    firestore
      .collection(
        collections.auditLogs
      )
      .doc();

  const auditData = {
    actorId: input.actor.uid,
    actorEmail:
      input.actor.email ?? null,
    actorRole:
      input.actor.role ?? null,
    action: input.action,
    entityType:
      input.entityType,
    entityId: input.entityId,
    metadata:
      input.metadata ?? {},
    createdAt:
      FieldValue.serverTimestamp(),
  };

  if (transaction) {
    transaction.create(
      auditReference,
      auditData
    );

    return;
  }

  await auditReference.create(
    auditData
  );
}

export async function createNotification(
  input: {
    readonly userId: string;
    readonly title: string;
    readonly body: string;
    readonly type: string;
    readonly actionURL?: string;
    readonly metadata?: Readonly<
      Record<string, unknown>
    >;
  },
  transaction?: Transaction
): Promise<void> {
  const reference =
    firestore
      .collection(
        collections.notifications
      )
      .doc();

  const data = {
    userId: input.userId,
    title: input.title,
    body: input.body,
    type: input.type,
    actionURL:
      input.actionURL ?? null,
    metadata:
      input.metadata ?? {},
    read: false,
    createdAt:
      FieldValue.serverTimestamp(),
    updatedAt:
      FieldValue.serverTimestamp(),
  };

  if (transaction) {
    transaction.create(
      reference,
      data
    );

    return;
  }

  await reference.create(
    data
  );
}

export function serverTimestamp(): ReturnType<
  typeof FieldValue.serverTimestamp
> {
  return FieldValue.serverTimestamp();
}

export function currentTimestamp(): Timestamp {
  return Timestamp.now();
}

export function getFirestoreInstance(): Firestore {
  return firestore;
}
