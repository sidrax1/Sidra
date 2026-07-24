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

let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let authConfigured = false;

async function configureAuth(firebaseAuth: Auth): Promise<void> {
 if (authConfigured || typeof window === "undefined") {
   return;
 }

 authConfigured = true;

 try {
   await setPersistence(
     firebaseAuth,
     browserLocalPersistence
   );

   if (
     process.env.NODE_ENV === "development" &&
     process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS ===
        "true"
   ){
     connectAuthEmulator(
        firebaseAuth,
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
 if (!auth) {
   auth = getAuth(firebaseApp);
 }

 await configureAuth(auth);

 return auth;
}

export function getGoogleAuthProvider(): GoogleAuthProvider {
 if (!googleProvider) {
   googleProvider = new GoogleAuthProvider();
   googleProvider.setCustomParameters({
     prompt: "select_account",
   });
   googleProvider.addScope("email");
   googleProvider.addScope("profile");
 }

 return googleProvider;
}
