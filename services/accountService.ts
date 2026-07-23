import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/firebase/firestore";

const db = getFirebaseFirestore();
import { callableFunction } from "@/firebase/functions";
import type {
  AccountNotificationPreferencesInput,
  AccountProfileInput,
  ChangePasswordInput,
} from "@/lib/schemas/account";
import type {
  AccountNotificationPreferences,
  AccountProfile,
  AccountSecuritySummary,
} from "@/types/account";

interface ChangePasswordResponse {
  readonly success: true;
  readonly changedAt: string;
}

interface RevokeSessionsResponse {
  readonly success: true;
  readonly revokedSessionCount: number;
}

const changePasswordCallable =
  callableFunction<
    ChangePasswordInput,
    ChangePasswordResponse
  >("changeAccountPassword");

const revokeSessionsCallable =
  callableFunction<
    Record<string, never>,
    RevokeSessionsResponse
  >("revokeOtherAccountSessions");

function assertUserId(
  userId: string
): void {
  if (!userId.trim()) {
    throw new Error(
      "A valid user ID is required."
    );
  }
}

export async function getAccountProfile(
  userId: string
): Promise<AccountProfile | null> {
  assertUserId(userId);

  const snapshot = await getDoc(
    doc(db, "users", userId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as AccountProfile;
}

export async function updateAccountProfile(
  userId: string,
  input: AccountProfileInput
): Promise<void> {
  assertUserId(userId);

  await updateDoc(
    doc(db, "users", userId),
    {
      displayName:
        input.displayName,
      firstName:
        input.firstName ?? null,
      lastName:
        input.lastName ?? null,
      phone:
        input.phone ?? null,
      photoURL:
        input.photoURL ?? null,
      updatedAt:
        serverTimestamp(),
    }
  );
}

export async function getAccountNotificationPreferences(
  userId: string
): Promise<AccountNotificationPreferences> {
  assertUserId(userId);

  const reference = doc(
    db,
    "users",
    userId,
    "preferences",
    "notifications"
  );

  const snapshot =
    await getDoc(reference);

  if (!snapshot.exists()) {
    return {
      orderUpdates: true,
      customOrderUpdates: true,
      studioUpdates: true,
      reviewUpdates: true,
      supportUpdates: true,
      marketingEmail: false,
      transactionalEmail: true,
      inAppNotifications: true,
      updatedAt:
        new Date().toISOString(),
    };
  }

  return snapshot.data() as AccountNotificationPreferences;
}

export async function updateAccountNotificationPreferences(
  userId: string,
  input: AccountNotificationPreferencesInput
): Promise<void> {
  assertUserId(userId);

  await setDoc(
    doc(
      db,
      "users",
      userId,
      "preferences",
      "notifications"
    ),
    {
      ...input,
      transactionalEmail: true,
      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function changeAccountPassword(
  input: ChangePasswordInput
): Promise<ChangePasswordResponse> {
  const result =
    await changePasswordCallable(
      input
    );

  return result.data;
}

export async function revokeOtherAccountSessions(): Promise<RevokeSessionsResponse> {
  const result =
    await revokeSessionsCallable({});

  return result.data;
}

export async function getAccountSecuritySummary(
  userId: string
): Promise<AccountSecuritySummary> {
  const profile =
    await getAccountProfile(
      userId
    );

  if (!profile) {
    throw new Error(
      "Account profile was not found."
    );
  }

  return {
    emailVerified:
      profile.emailVerified,
    googleConnected: Boolean(
      profile.photoURL
    ),
    passwordEnabled: true,
    lastPasswordChangeAt:
      undefined,
    lastLoginAt:
      profile.lastLoginAt,
    activeSessionCount: 1,
  };
}
