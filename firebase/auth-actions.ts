import {

  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  reload,
  type UserCredential,
} from "firebase/auth";

import {
  getFirebaseAuth,
  getGoogleAuthProvider,
} from "@/firebase/auth";

import { logger } from "@/lib/logger";

export async function signInWithGoogle(): Promise<UserCredential> {
 const auth = await getFirebaseAuth();

    try {
      return await signInWithPopup(
        auth,
        getGoogleAuthProvider()
      );
    } catch (error) {
      logger.error(
        "Google Sign-In failed.",
        error
      );

        throw error;
    }
}

export async function signOutUser(): Promise<void> {
 const auth = await getFirebaseAuth();

    try {
      await signOut(auth);
    } catch (error) {
      logger.error(
        "Sign out failed.",
        error
      );

        throw error;
    }
}

export async function refreshCurrentUser(): Promise<void> {
 const auth = await getFirebaseAuth();

    if (!auth.currentUser) {
      return;
    }

    await reload(auth.currentUser);
}

export async function updateCurrentUserProfile(input: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> {
  const auth = await getFirebaseAuth();

    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    await updateProfile(auth.currentUser, input);
}

export async function sendVerificationEmail(): Promise<void> {
 const auth = await getFirebaseAuth();

    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

  await sendEmailVerification(auth.currentUser);
}
