import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { User } from "@/types/user";

function userReference(uid: string) {
  return doc(getFirebaseFirestore(), COLLECTIONS.USERS, uid);
}

export async function getUser(
  uid: string
): Promise<User | null> {
  const snapshot = await getDoc(userReference(uid));

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as User;
}

export async function ensureUserProfile(

  input: Pick<
    User,
    "uid" | "email" | "displayName" | "emailVerified"
  >&{
    photoURL?: string;
  }
): Promise<void> {
  await setDoc(
    userReference(input.uid),
    {
      uid: input.uid,
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL ?? null,
      role: "customer",
      status: "active",
      emailVerified: input.emailVerified,
      onboardingCompleted: false,
      wishlistCount: 0,
      cartCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function updateUserProfile(
  uid: string,
  input: {
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
    onboardingCompleted?: boolean;
  }
): Promise<void> {
  await updateDoc(userReference(uid), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}
