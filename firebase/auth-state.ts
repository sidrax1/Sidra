import {
  onAuthStateChanged,
  onIdTokenChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from "firebase/auth";

import { getFirebaseAuth } from "@/firebase/auth";

import { logger } from "@/lib/logger";

export type AuthStateListener = (
  user: FirebaseUser | null
) => void;

export async function subscribeToAuthState(
  listener: AuthStateListener
): Promise<Unsubscribe> {
  const auth = await getFirebaseAuth();

    return onAuthStateChanged(
      auth,
      listener,
      (error) => {
        logger.error(
          "Firebase authentication state listener failed.",
          error
        );
      }
    );
}

export async function subscribeToIdToken(
  listener: AuthStateListener
): Promise<Unsubscribe> {
  const auth = await getFirebaseAuth();

    return onIdTokenChanged(
      auth,
      listener,
      (error) => {
        logger.error(
          "Firebase ID token listener failed.",
          error
        );
      }
    );
}

export async function getCurrentFirebaseUser(): Promise<
 FirebaseUser | null
>{
 const auth = await getFirebaseAuth();

    if (auth.currentUser) {
      return auth.currentUser;
    }

    return new Promise<FirebaseUser | null>((resolve) => {
     const unsubscribe = onAuthStateChanged(
       auth,
       (user) => {
         unsubscribe();
         resolve(user);
       },
       (error) => {
         unsubscribe();

            logger.error(
              "Unable to resolve current Firebase user.",
              error
            );

            resolve(null);
        }
      );
    });
}

export async function waitForAuthenticatedUser(): Promise<FirebaseUser> {
 const user = await getCurrentFirebaseUser();

    if (!user) {
      throw new Error("Authentication is required.");
    }

    return user;
}
