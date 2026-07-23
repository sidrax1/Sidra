import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let firestore: Firestore | null = null;
let emulatorConnected = false;

function initializeFirebaseFirestore(): Firestore {
 if (firestore) {
   return firestore;
 }

    try {
      firestore = initializeFirestore(firebaseApp, {
        ignoreUndefinedProperties: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),

        }),
      });
    } catch {
      firestore = getFirestore(firebaseApp);
    }

    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS ===
         "true" &&
      !emulatorConnected
    ){
      connectFirestoreEmulator(
         firestore,
         "127.0.0.1",
         8080
      );

        emulatorConnected = true;

        logger.info(
          "Connected to the local Firestore emulator."
        );
    }

    return firestore;
}

export function getFirebaseFirestore(): Firestore {
  return initializeFirebaseFirestore();
}
