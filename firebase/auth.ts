import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth,
} from "firebase/auth";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

googleProvider.addScope("email");
googleProvider.addScope("profile");

let authConfigured = false;

async function configureAuth(): Promise<void> {
 if (authConfigured || typeof window === "undefined") {
   return;
 }

 authConfigured = true;

 try {
   await setPersistence(
     auth,
     browserLocalPersistence
   );

   if (
     process.env.NODE_ENV === "development" &&
     process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS ===
        "true"
   ){
     connectAuthEmulator(
        auth,
        "http://127.0.0.1:9099",
        {
          disableWarnings: true,
        }
     );
   }
 } catch (error) {
   authConfigured = false;

  logger.error(
    "Firebase Authentication configuration failed.",
    error
  );

  throw error;

    }
}

export async function getFirebaseAuth(): Promise<Auth> {
 await configureAuth();

    return auth;
}

export function getGoogleAuthProvider(): GoogleAuthProvider {
  return googleProvider;
}
